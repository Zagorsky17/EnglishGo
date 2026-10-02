/* games.js — игры: описания, генераторы вопросов, очки, рекорды */
(function (EG) {
  'use strict';

  var U = EG.util;

  /* ---------- пул материала: изученное + текущий уровень ---------- */
  function pool(filter) {
    var max = Math.max(1, EG.progress.effectiveLevelIndex());
    var list = EG.data.vocab.filter(function (v) { return filter(v) && U.levelIndex(v.level) <= max; });
    // изученные и изучаемые — чаще
    var known = list.filter(function (v) { return EG.state.cards.has(v.id); });
    return known.length >= 8 ? U.shuffle(known).concat(U.shuffle(list)) : U.shuffle(list);
  }

  function pickOther(list, exclude, field, n) {
    var seen = {}; seen[exclude] = 1;
    var out = [];
    U.shuffle(list).forEach(function (x) {
      var v = typeof field === 'function' ? field(x) : x[field];
      if (!v || seen[v] || out.length >= n) return;
      seen[v] = 1; out.push(v);
    });
    return out;
  }

  function opts(correct, wrong) {
    return U.shuffle([{ label: correct, correct: true }].concat(wrong.map(function (w) { return { label: w, correct: false }; })));
  }

  /* ---------- генераторы ---------- */

  // «Расшифруй чат»: сообщение со сленгом → смысл
  function chatLines() {
    var lines = [];
    EG.data.vocab.forEach(function (v) { if (v.topic === 'texting') lines.push({ en: v.example, ru: v.exampleRu, itemId: v.id, level: v.level }); });
    EG.data.stories.forEach(function (s) {
      if (s.kind !== 'chat') return;
      s.lines.forEach(function (l) { if (EG.text.slangMarkers(l.en).length && l.en.length > 8) lines.push({ en: l.en, ru: l.ru, level: s.level }); });
    });
    EG.data.episodes.forEach(function (e) {
      Object.keys(e.nodes).forEach(function (k) {
        var n = e.nodes[k];
        n.them.forEach(function (t, i) { if (EG.text.slangMarkers(t).length && t.length > 8 && n.ru && n.ru[i]) lines.push({ en: t, ru: n.ru[i], level: e.level }); });
      });
    });
    var max = EG.progress.effectiveLevelIndex() + 1;
    return lines.filter(function (l) { return U.levelIndex(l.level) <= max; });
  }

  var GEN = {
    decode: function () {
      var all = chatLines();
      var l = all[Math.floor(Math.random() * all.length)];
      return { kind: 'choice', chat: l.en, prompt: 'Что значит это сообщение?', options: opts(l.ru, pickOther(all, l.ru, 'ru', 3)), itemId: l.itemId,
        ask: l.en, askRu: '', explainAlways: true, explain: EG.chat.decodeMessage(l.en).map(function (d) { return d.abbr + ' = ' + d.full; }).join(', ') };
    },

    blitz: function () {
      if (Math.random() < 0.55) {
        var withCue = pool(function (v) { return !!v.cue; });
        var it = withCue[Math.floor(Math.random() * Math.min(withCue.length, 40))];
        return { kind: 'choice', bubble: it.cue, prompt: 'Быстро ответьте', options: opts(it.en, pickOther(withCue, it.en, 'en', 3)), itemId: it.id, explain: it.en + ' — ' + it.ru, en: true,
          ask: it.cue, askRu: it.cueRu || '', rightRu: it.ru };
      }
      var p = pool(function () { return true; });
      var x = p[Math.floor(Math.random() * Math.min(p.length, 60))];
      return { kind: 'choice', big: x.en, prompt: 'Что это значит?', options: opts(x.ru, pickOther(p, x.ru, 'ru', 3)), itemId: x.id, explain: x.en + ' — ' + x.ru,
        ask: x.en, askRu: '' };
    },

    truefalse: function () {
      var truth = Math.random() < 0.5;
      if (Math.random() < 0.5) {
        var tx = pool(function (v) { return v.topic === 'texting'; });
        var a = tx[Math.floor(Math.random() * tx.length)];
        var shown = truth ? a.ru : pickOther(tx, a.ru, 'ru', 1)[0];
        return { kind: 'tf', statement: '«' + a.en + '» значит: ' + shown, truth: truth, itemId: a.id, explain: '«' + a.en + '» = ' + a.ru };
      }
      var f = pool(function (v) { return v.forms && v.forms.slang && v.register !== 'casual'; });
      var b = f[Math.floor(Math.random() * f.length)];
      var slang = truth ? b.forms.slang : pickOther(f, b.forms.slang, function (v) { return v.forms.slang; }, 1)[0];
      return { kind: 'tf', statement: '«' + slang + '» — неформальный вариант фразы «' + b.en + '»', truth: truth, itemId: b.id,
        explain: 'Неформально «' + b.en + '» → «' + b.forms.slang + '»' + (b.forms.text ? ', в чате: ' + b.forms.text : '') };
    },

    reply: function () {
      var replies = [];
      var max = EG.progress.effectiveLevelIndex() + 1;
      EG.data.episodes.forEach(function (e) {
        if (U.levelIndex(e.level) > max) return;
        var c = EG.data.contactsById[e.contactId];
        Object.keys(e.nodes).forEach(function (k) {
          var n = e.nodes[k];
          if (!n.reply || !(n.reply.distractors || []).length) return;
          // в эпизоде реплика собеседника лежит в узле (them / ru), а не в самом ходе
          replies.push({ reply: n.reply, who: c.name + ' · ' + c.role, npc: (n.them || []).slice(-1)[0], npcRu: (n.ru || []).slice(-1)[0] });
        });
      });
      EG.data.scenarios.forEach(function (s) {
        if (U.levelIndex(s.level) > max) return;
        s.turns.forEach(function (t) { if ((t.distractors || []).length) replies.push({ reply: t, who: s.partner, npc: t.npc, npcRu: t.npcRu }); });
      });
      var r = replies[Math.floor(Math.random() * replies.length)];
      var o = EG.dialogue.hintOptions(r.reply).map(function (x) { return { label: x.t, correct: x.good, n: x.n, note: x.note }; });
      var best = r.reply.better || r.reply.accepted[0].t;
      return { kind: 'choice', chat: r.npc, chatRu: r.npcRu, who: r.who, prompt: r.reply.intent || 'Выберите лучший ответ', options: o, en: true,
        explain: 'Лучше всего: ' + best + (r.reply.betterRu ? ' — ' + r.reply.betterRu : ''), turn: r.reply,
        ask: r.npc, askRu: r.npcRu || '', right: best, rightRu: r.reply.betterRu || '' };
    },

    build: function () {
      var p = pool(function (v) { var n = (v.example || '').split(/\s+/).length; return n >= 4 && n <= 9; });
      var it = p[Math.floor(Math.random() * Math.min(p.length, 60))];
      var words = it.example.split(/\s+/);
      var sh = U.shuffle(words);
      if (sh.join(' ') === words.join(' ')) sh = words.slice().reverse();
      return { kind: 'build', words: sh, order: words, answer: it.example, hint: it.exampleRu, itemId: it.id, explain: it.example, rightRu: it.exampleRu };
    }
  };

  /* ---------- «Сленг-пары»: набор пар ---------- */
  function pairsRound(n) {
    var p = pool(function (v) { return v.forms && (v.forms.slang || v.forms.neutral); });
    var cand = [];
    p.forEach(function (v) {
      var left = v.register === 'casual' ? v.forms.neutral : v.en;
      var right = v.register === 'casual' ? v.en : v.forms.slang;
      if (!left || !right || left === right) return;
      // слишком похожие формы («Sorry, I can't hear you» ↔ «Sorry, what? I can't hear you») не интересны
      if (EG.text.phraseSim(left, right) > 0.72) return;
      cand.push({ id: v.id, topic: v.topic, left: left, right: right, ru: v.ru });
    });
    // раунд из одной-двух тем: внутри темы фразы разные по смыслу — меньше двусмысленных пар
    var byTopic = {};
    cand.forEach(function (c) { (byTopic[c.topic] = byTopic[c.topic] || []).push(c); });
    var topics = U.shuffle(Object.keys(byTopic)).sort(function (a, b) { return byTopic[b].length - byTopic[a].length > 0 ? (Math.random() < 0.5 ? 1 : -1) : 0; });
    var out = [], used = {};
    topics.forEach(function (t) {
      byTopic[t].forEach(function (c) {
        if (out.length >= n || used[c.left] || used[c.right]) return;
        used[c.left] = used[c.right] = 1;
        out.push(c);
      });
    });
    return out;
  }

  /* ---------- описания игр ---------- */
  var GAMES = [
    { id: 'pairs', emoji: '🧩', title: 'Сленг-пары', desc: 'Соедините обычную фразу с её сленговым вариантом. 90 секунд, раунд за раундом.', time: 90, lives: 3 },
    { id: 'decode', emoji: '📱', title: 'Расшифруй чат', desc: 'Сообщения из мессенджера с сокращениями — поймите смысл. idk, lmk, omw…', lives: 3, perQ: 15 },
    { id: 'blitz', emoji: '⚡', title: 'Молния', desc: '60 секунд: отвечайте на реплики и переводите фразы. Чем быстрее — тем больше очков.', time: 60, lives: 3 },
    { id: 'reply', emoji: '💬', title: 'Ответь в чат', desc: 'Вам пишут — выберите самый естественный ответ. Неудачные варианты стоят жизни.', lives: 3, perQ: 20 },
    { id: 'build', emoji: '🧱', title: 'Собери фразу', desc: 'Соберите фразу из слов на время. Серия без ошибок умножает очки.', lives: 3, perQ: 25 },
    { id: 'truefalse', emoji: '✅', title: 'Правда или нет', desc: '45 секунд: правда ли, что «ngl» значит «не буду врать»? Решайте мгновенно.', time: 45, lives: 3 }
  ];
  var byId = Object.create(null);
  GAMES.forEach(function (g) { byId[g.id] = g; });

  function multiplier(combo) { return combo >= 6 ? 3 : combo >= 3 ? 2 : 1; }

  function saveResult(id, score) {
    var prev = EG.state.games.get(id) || { id: id, best: 0, plays: 0 };
    var rec = { id: id, best: Math.max(prev.best || 0, score), plays: (prev.plays || 0) + 1, lastScore: score, lastTs: Date.now() };
    return EG.state.saveGame(rec).then(function () { return { record: rec, isBest: score > (prev.best || 0) && score > 0 }; });
  }

  /** Игра дня — меняется ежедневно. */
  function gameOfDay() {
    var d = EG.util.dateKey().split('-').reduce(function (a, b) { return a + Number(b); }, 0);
    return GAMES[d % GAMES.length];
  }

  EG.games = {
    GAMES: GAMES, byId: byId, GEN: GEN, pairsRound: pairsRound,
    multiplier: multiplier, saveResult: saveResult, gameOfDay: gameOfDay
  };
})(window.EG = window.EG || {});
