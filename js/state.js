/* state.js — кеш данных в памяти, шина событий и утилиты */
(function (EG) {
  'use strict';

  /* ---------- утилиты ---------- */
  var DAY = 86400000;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  EG.util = {
    DAY: DAY,
    dateKey: function (d) {
      d = d ? new Date(d) : new Date();
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    },
    addDays: function (key, n) {
      var p = key.split('-').map(Number);
      return EG.util.dateKey(new Date(p[0], p[1] - 1, p[2] + n));
    },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    },
    sample: function (arr, n) { return EG.util.shuffle(arr).slice(0, n); },
    clamp: function (v, a, b) { return Math.max(a, Math.min(b, v)); },
    levelIndex: function (l) { var i = EG.LEVELS.indexOf(l); return i < 0 ? 0 : i; },
    plural: function (n, one, few, many) {
      var m10 = n % 10, m100 = n % 100;
      if (m10 === 1 && m100 !== 11) return one;
      if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
      return many;
    }
  };

  /* ---------- шина событий ---------- */
  var handlers = {};
  EG.bus = {
    on: function (evt, fn) { (handlers[evt] = handlers[evt] || []).push(fn); return function () { EG.bus.off(evt, fn); }; },
    off: function (evt, fn) { handlers[evt] = (handlers[evt] || []).filter(function (f) { return f !== fn; }); },
    emit: function (evt, data) { (handlers[evt] || []).slice().forEach(function (f) { try { f(data); } catch (e) { console.error(e); } }); }
  };

  function noop() { /* ошибка уже показана пользователю через db-error */ }

  /**
   * «Лечение» состояния после загрузки: данные могли прийти из старой версии,
   * повреждённого backup или ссылаться на изменённый контент.
   */
  function heal() {
    var aliases = (EG.data && EG.data.idAliases) || {};
    // переименованные выражения: переносим прогресс на новый id
    Object.keys(aliases).forEach(function (oldId) {
      var newId = aliases[oldId];
      var c = S.cards.get(oldId);
      if (c && !S.cards.has(newId)) {
        var moved = Object.assign({}, c, { id: newId });
        S.cards.set(newId, moved);
        EG.db.put('cards', moved).then(function () { return EG.db.del('cards', oldId); }).catch(noop);
      }
      S.cards.delete(oldId);
    });
    // карточки без контента не показываем (в базе оставляем — контент может вернуться)
    S.cards.forEach(function (c, id) { if (!EG.data.byId[id]) S.cards.delete(id); });
    if (EG.data.wordsById) S.words.forEach(function (w, id) { if (!EG.data.wordsById[id]) S.words.delete(id); });
    // переписки: несуществующий эпизод или узел — начинаем эпизод заново, а не «зависаем»
    S.chats.forEach(function (rec, id) {
      var ep = EG.data.episodesById[id];
      if (!ep) { S.chats.delete(id); return; }
      if (!rec.done && (!ep.nodes[rec.nodeId] || (rec.phase === 'reply' && !ep.nodes[rec.nodeId].reply))) {
        console.warn('[EnglishGo] Переписка', id, 'ссылается на несуществующий шаг — начинаем заново');
        S.chats.delete(id);
        EG.db.del('chats', id).catch(noop);
      }
    });
  }

  /* ---------- состояние ---------- */
  var META_DEFAULTS = {
    totalXp: 0, streak: 0, bestStreak: 0, lastActiveDate: '', skill: 0,
    totalAnswers: 0, totalCorrect: 0, createdAt: 0, levelHintShown: ''
  };

  var S = {
    cards: new Map(),
    mistakes: new Map(),
    lessons: new Map(),
    dialogues: new Map(),
    stats: new Map(),
    games: new Map(),
    chats: new Map(),
    words: new Map(), // прогресс тренажёра «Словарный запас»
    meta: Object.assign({}, META_DEFAULTS),
    recent: [], // последние ответы {correct, ts}

    load: function () {
      var names = ['cards', 'mistakes', 'lessons', 'dialogues', 'stats', 'meta', 'games', 'chats', 'words'];
      return Promise.all(names.map(EG.db.getAll).concat([EG.db.lastAnswers(60)])).then(function (r) {
        S.cards = new Map(r[0].map(function (c) { return [c.id, c]; }));
        S.mistakes = new Map(r[1].map(function (m) { return [m.itemId, m]; }));
        S.lessons = new Map(r[2].map(function (l) { return [l.id, l]; }));
        S.dialogues = new Map(r[3].map(function (d) { return [d.id, d]; }));
        S.stats = new Map(r[4].map(function (s) { return [s.date, s]; }));
        S.games = new Map(r[6].map(function (g) { return [g.id, g]; }));
        S.chats = new Map(r[7].map(function (c) { return [c.id, c]; }));
        S.words = new Map(r[8].map(function (w) { return [w.id, w]; }));
        S.meta = Object.assign({}, META_DEFAULTS);
        S.hasUndoImport = false;
        r[5].forEach(function (m) {
          if (m.key === 'preImportBackup') { S.hasUndoImport = true; return; } // большую копию в памяти не держим
          var v = EG.db.sanitizeMeta(m.key, m.value);
          if (v !== undefined) S.meta[m.key] = v;
        });
        if (!S.meta.createdAt) { S.meta.createdAt = Date.now(); EG.db.put('meta', { key: 'createdAt', value: S.meta.createdAt }).catch(noop); }
        S.recent = r[9].map(function (a) { return { correct: !!a.correct, ts: a.ts }; });
        heal();
        // история ответов не растёт бесконечно
        EG.db.pruneAnswers(5000).catch(noop);
        EG.bus.emit('loaded');
      });
    },

    setMeta: function (key, value) {
      S.meta[key] = value;
      return EG.db.put('meta', { key: key, value: value });
    },

    saveCard: function (card) { S.cards.set(card.id, card); return EG.db.put('cards', card); },
    saveCards: function (cards) {
      cards.forEach(function (c) { S.cards.set(c.id, c); });
      return EG.db.putMany('cards', cards);
    },
    saveMistake: function (m) { S.mistakes.set(m.itemId, m); return EG.db.put('mistakes', m); },
    deleteMistake: function (id) { S.mistakes.delete(id); return EG.db.del('mistakes', id); },
    saveLesson: function (l) { S.lessons.set(l.id, l); return EG.db.put('lessons', l); },
    saveDialogue: function (d) { S.dialogues.set(d.id, d); return EG.db.put('dialogues', d); },
    saveGame: function (g) { S.games.set(g.id, g); return EG.db.put('games', g); },
    saveChat: function (c) { S.chats.set(c.id, c); return EG.db.put('chats', c); },
    saveWord: function (w) { S.words.set(w.id, w); return EG.db.put('words', w); },

    today: function () {
      var key = EG.util.dateKey();
      var s = S.stats.get(key);
      if (!s) {
        s = { date: key, xp: 0, reviews: 0, newItems: 0, correct: 0, wrong: 0, minutes: 0, dialogues: 0 };
        S.stats.set(key, s);
      }
      return s;
    },
    saveToday: function () { return EG.db.put('stats', S.today()); },
    heal: heal
  };

  EG.state = S;
})(window.EG = window.EG || {});
