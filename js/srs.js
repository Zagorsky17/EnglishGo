/* srs.js — интервальное повторение (вариант SM-2 с шагами обучения) */
(function (EG) {
  'use strict';

  var MIN = 60000, DAY = 86400000;
  var LEARNING_STEPS = [10 * MIN, DAY];   // шаги для новых карточек
  var GRADUATE_DAYS = 3;                   // первый интервал после обучения
  var EASY_DAYS = 4;
  var MASTERED_DAYS = 21;

  var QUALITY = { AGAIN: 0, HARD: 1, GOOD: 2, EASY: 3 };
  var QUALITY_LABELS = ['Снова', 'Трудно', 'Хорошо', 'Легко'];

  function newCard(id, now) {
    if (now == null) now = Date.now();
    return {
      id: id, reps: 0, lapses: 0, ease: 2.5, interval: 0, step: 0,
      due: now, lastReview: null, correct: 0, wrong: 0, difficulty: 0.3,
      state: 'new', addedAt: now
    };
  }

  /** Чистая функция: возвращает новое состояние карточки после ответа с качеством q (0–3). */
  function schedule(card, q, now) {
    if (now == null) now = Date.now();
    var c = Object.assign({}, card);
    c.reps += 1;
    c.lastReview = now;
    var target = [1, 0.6, 0.25, 0.05][q];
    c.difficulty = +(c.difficulty * 0.7 + target * 0.3).toFixed(3);

    if (q === QUALITY.AGAIN) {
      c.wrong += 1;
      if (c.state === 'review' || c.state === 'mastered') c.lapses += 1;
      c.ease = Math.max(1.3, +(c.ease - 0.2).toFixed(2));
      c.state = 'learning';
      c.step = 0;
      c.interval = 0;
      c.due = now + LEARNING_STEPS[0];
      return c;
    }

    c.correct += 1;

    if (c.state === 'new' || c.state === 'learning') {
      if (q === QUALITY.EASY) {
        c.interval = c.lapses ? GRADUATE_DAYS : EASY_DAYS;
      } else if (q === QUALITY.HARD) {
        c.state = 'learning';
        c.due = now + LEARNING_STEPS[c.step];
        return c;
      } else if (c.step < LEARNING_STEPS.length - 1) {
        c.step += 1;
        c.state = 'learning';
        c.due = now + LEARNING_STEPS[c.step];
        return c;
      } else {
        c.interval = c.lapses ? 1 : GRADUATE_DAYS;
      }
    } else {
      var prev = Math.max(1, c.interval);
      if (q === QUALITY.HARD) {
        c.ease = Math.max(1.3, +(c.ease - 0.15).toFixed(2));
        c.interval = Math.max(prev + 1, Math.round(prev * 1.2));
      } else if (q === QUALITY.GOOD) {
        c.interval = Math.max(prev + 1, Math.round(prev * c.ease));
      } else {
        c.ease = +(c.ease + 0.15).toFixed(2);
        c.interval = Math.max(prev + 2, Math.round(prev * c.ease * 1.3));
      }
    }
    c.interval = Math.min(c.interval, 365);
    c.step = 0;
    c.state = c.interval >= MASTERED_DAYS ? 'mastered' : 'review';
    c.due = now + c.interval * DAY;
    return c;
  }

  /** Качество по правильности и скорости ответа. */
  function qualityFromAnswer(correct, ms, expectedMs, partial) {
    if (!correct) return partial ? QUALITY.HARD : QUALITY.AGAIN;
    if (partial) return QUALITY.HARD;
    expectedMs = expectedMs || 8000;
    if (ms && ms < expectedMs * 0.45) return QUALITY.EASY;
    if (!ms || ms < expectedMs) return QUALITY.GOOD;
    return QUALITY.HARD;
  }

  function describeInterval(ms) {
    if (ms < 60 * MIN) return Math.max(1, Math.round(ms / MIN)) + ' мин';
    if (ms < DAY) return Math.round(ms / (60 * MIN)) + ' ч';
    var d = Math.round(ms / DAY);
    if (d < 30) return d + ' ' + EG.util.plural(d, 'день', 'дня', 'дней');
    var m = Math.round(d / 30);
    return m + ' мес';
  }

  function preview(card, now) {
    now = now || Date.now();
    return [0, 1, 2, 3].map(function (q) { return describeInterval(schedule(card, q, now).due - now); });
  }

  /* ---------- работа с коллекцией ---------- */

  function getDue(limit, now) {
    now = now || Date.now();
    var due = [];
    EG.state.cards.forEach(function (c) {
      if (c.due <= now && EG.data.byId[c.id]) due.push(c);
    });
    // сначала повторение уже изученных (они важнее), затем новые
    due.sort(function (a, b) {
      var an = a.state === 'new' ? 1 : 0, bn = b.state === 'new' ? 1 : 0;
      return an - bn || a.due - b.due;
    });
    return limit ? due.slice(0, limit) : due;
  }

  function dueCount() { return getDue().length; }

  /** Новые кандидаты для изучения: ещё не в SRS, подходящего уровня. */
  function getNewCandidates(limit, maxLevelIdx) {
    if (maxLevelIdx == null) maxLevelIdx = EG.progress.effectiveLevelIndex();
    var list = EG.data.vocab.filter(function (v) {
      return !EG.state.cards.has(v.id) && EG.util.levelIndex(v.level) <= maxLevelIdx;
    });
    // сначала текущий уровень, затем нижние (закрыть пробелы в базе)
    var dist = function (v) { return maxLevelIdx - EG.util.levelIndex(v.level); };
    list.sort(function (a, b) { return dist(a) - dist(b) || a.order - b.order; });
    return list.slice(0, limit);
  }

  function addItems(ids) {
    var now = Date.now();
    var fresh = ids.filter(function (id) { return EG.data.byId[id] && !EG.state.cards.has(id); })
      .map(function (id) { return newCard(id, now); });
    if (!fresh.length) return Promise.resolve(0);
    var t = EG.state.today();
    t.newItems += fresh.length;
    return Promise.all([EG.state.saveCards(fresh), EG.state.saveToday()]).then(function () {
      EG.bus.emit('cards');
      return fresh.length;
    });
  }

  function grade(id, q) {
    var card = EG.state.cards.get(id) || newCard(id);
    var wasNew = !EG.state.cards.has(id);
    var next = schedule(card, q);
    var t = EG.state.today();
    t.reviews += 1;
    if (wasNew) t.newItems += 1;
    return Promise.all([EG.state.saveCard(next), EG.state.saveToday()]).then(function () {
      EG.bus.emit('cards');
      return next;
    });
  }

  function forecast(days) {
    var now = Date.now();
    var out = [];
    for (var i = 0; i < days; i++) out.push(0);
    var todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    EG.state.cards.forEach(function (c) {
      var idx = c.due <= now ? 0 : Math.floor((c.due - todayStart.getTime()) / DAY);
      if (idx >= 0 && idx < days) out[idx]++;
    });
    return out;
  }

  function stateCounts() {
    var r = { new: 0, learning: 0, review: 0, mastered: 0 };
    EG.state.cards.forEach(function (c) { r[c.state] = (r[c.state] || 0) + 1; });
    return r;
  }

  EG.srs = {
    QUALITY: QUALITY,
    QUALITY_LABELS: QUALITY_LABELS,
    newCard: newCard,
    schedule: schedule,
    qualityFromAnswer: qualityFromAnswer,
    preview: preview,
    describeInterval: describeInterval,
    getDue: getDue,
    dueCount: dueCount,
    getNewCandidates: getNewCandidates,
    addItems: addItems,
    grade: grade,
    forecast: forecast,
    stateCounts: stateCounts
  };
})(window.EG = window.EG || {});
