/* dialogues.js — движок ветвящихся диалогов и оценка свободных ответов в режиме «Разговор» */
(function (EG) {
  'use strict';

  var QUALITY = {
    best:    { points: 3, label: 'Отлично', tone: 'good' },
    ok:      { points: 2, label: 'Нормально', tone: 'ok' },
    awkward: { points: 1, label: 'Неестественно', tone: 'warn' },
    wrong:   { points: 0, label: 'Не подходит', tone: 'bad' }
  };

  /* ---------- ветвящиеся диалоги ---------- */

  function getDialogue(id) { return EG.data.dialoguesById[id] || null; }

  function createRun(dlg) {
    return { dlg: dlg, nodeId: dlg.start, history: [], points: 0, max: 0, started: Date.now(), mistakes: [] };
  }

  function currentNode(run) { return run.dlg.nodes[run.nodeId]; }

  /** Выбор варианта: возвращает разбор и переходит к следующему узлу. */
  function choose(run, idx) {
    var node = currentNode(run);
    var opt = node.options[idx];
    var q = QUALITY[opt.q] || QUALITY.ok;
    run.points += q.points;
    run.max += 3;
    run.history.push({ nodeId: run.nodeId, idx: idx, q: opt.q });
    var best = node.options.filter(function (o) { return o.q === 'best'; })[0] || opt;
    var fromNode = run.nodeId;
    run.nodeId = opt.next || null;
    var nextNode = run.nodeId ? run.dlg.nodes[run.nodeId] : null;
    return {
      option: opt, quality: q, best: best, fromNode: fromNode,
      reply: opt.reply || null, replyRu: opt.replyRu || null,
      next: nextNode, finished: !nextNode || !!nextNode.end
    };
  }

  function score(run) { return run.max ? Math.round(run.points / run.max * 100) : 0; }

  /** Id выражений словаря, связанных с диалогом/сценарием. */
  function learnIds(obj) {
    return (obj.learn || []).map(EG.data.resolve).filter(Boolean);
  }

  /* ---------- режим «Разговор»: оценка свободного ответа ---------- */

  /**
   * turn: {npc, intent, accepted:[{t, n, note}], keywords:[...], distractors:[{t, note}], better, explain}
   * Возвращает {verdict, correct, partial, naturalness, match, keywordCoverage, message}
   */
  function evaluateTurn(turn, text) {
    var raw = String(text || '').trim();
    if (!raw) return { verdict: 'empty', correct: false, naturalness: 0, message: 'Напишите ответ — хотя бы пару слов.' };
    if (EG.text.hasCyrillic(raw)) {
      return { verdict: 'russian', correct: false, naturalness: 0, message: 'Попробуйте ответить по-английски — даже простыми словами. Если трудно, нажмите «Варианты».' };
    }
    var norm = EG.text.normalize(raw);

    // лучшее совпадение с принятыми вариантами
    var best = null;
    turn.accepted.forEach(function (a) {
      var s = EG.text.phraseSim(raw, a.t);
      if (!best || s > best.sim) best = { sim: s, a: a };
    });

    // явно неудачные варианты
    var badHit = null;
    (turn.distractors || []).forEach(function (d) {
      var s = EG.text.phraseSim(raw, d.t);
      if (s >= 0.88 && (!badHit || s > badHit.sim)) badHit = { sim: s, d: d };
    });

    var groups = turn.keywords || [];
    var hit = groups.filter(function (g) { return EG.text.hasKeyword(norm, g); }).length;
    var coverage = groups.length ? hit / groups.length : 0;
    var words = norm.split(' ').length;

    if (badHit && (!best || badHit.sim > best.sim)) {
      return {
        verdict: 'awkward', correct: false, partial: true, naturalness: badHit.d.n != null ? badHit.d.n : 25,
        match: turn.accepted[0], coverage: coverage, note: badHit.d.note,
        message: 'Звучит неестественно — собеседник, скорее всего, переспросит.'
      };
    }

    if (best.sim >= 0.8) {
      var nat = Math.round(best.a.n * (0.85 + 0.15 * best.sim));
      return {
        verdict: best.a.n >= 80 ? 'great' : 'good', correct: true, naturalness: nat,
        match: best.a, coverage: coverage, note: best.a.note,
        message: best.a.n >= 80 ? 'Отлично! Так и говорят носители.' : 'Верно и понятно.'
      };
    }

    if (groups.length && coverage >= 0.999) {
      // смысл передан своими словами
      var n2 = Math.round(50 + best.sim * 30 - (words > 18 ? 10 : 0));
      return {
        verdict: 'understood', correct: true, naturalness: EG.util.clamp(n2, 40, 78),
        match: best.a, coverage: coverage,
        message: 'Вас поймут! Смысл передан. Посмотрите, как сказать естественнее.'
      };
    }

    if (best.sim >= 0.6 || coverage >= 0.5) {
      return {
        verdict: 'partial', correct: false, partial: true,
        naturalness: Math.round(25 + best.sim * 25), match: best.a, coverage: coverage,
        message: 'Почти. Часть смысла понятна, но чего-то не хватает.'
      };
    }

    return {
      verdict: 'miss', correct: false, naturalness: 10, match: best.a, coverage: coverage,
      message: 'Собеседник вас, скорее всего, не поймёт. Разберите правильный вариант.'
    };
  }

  /** Варианты для режима подсказки: 2 принятых + неудачные. */
  function hintOptions(turn) {
    var good = turn.accepted.slice().sort(function (a, b) { return b.n - a.n; }).slice(0, 2)
      .map(function (a) { return { t: a.t, n: a.n, note: a.note, good: true }; });
    var bad = (turn.distractors || []).slice(0, 2)
      .map(function (d) { return { t: d.t, n: d.n != null ? d.n : 15, note: d.note, good: false }; });
    return EG.util.shuffle(good.concat(bad));
  }

  function getScenario(id) { return EG.data.scenariosById[id] || null; }

  EG.dialogue = {
    QUALITY: QUALITY,
    getDialogue: getDialogue,
    createRun: createRun,
    currentNode: currentNode,
    choose: choose,
    score: score,
    learnIds: learnIds,
    getScenario: getScenario,
    evaluateTurn: evaluateTurn,
    hintOptions: hintOptions
  };
})(window.EG = window.EG || {});
