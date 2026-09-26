/* wordtrainer.js — тренажёр словарного запаса: отдельные слова, перевод с выбором из 4 вариантов,
   интервальное повторение по «коробкам» (выученные слова появляются всё реже) */
(function (EG) {
  'use strict';

  var MIN = 60000, DAY = 86400000;
  // через сколько снова показать слово, попавшее в коробку n
  var BOX_MS = [MIN, 10 * MIN, DAY, 3 * DAY, 7 * DAY, 16 * DAY, 40 * DAY, 90 * DAY];
  var MAX_BOX = BOX_MS.length - 1;
  var LEARNED_BOX = 4;   // с этой коробки слово считается выученным (интервал ≥ недели)
  var KNOWN_BOX = 3;     // слово угадано с первого раза и быстро — уже знакомо, сразу в коробку 3
  var FAST_MS = 4000;
  var SESSION_SIZE = 20;
  var NEW_MIN = 6, NEW_MAX = 10; // новых слов за сессию: интенсивное пополнение, но без перегруза

  function S() { return EG.state; }
  function W() { return EG.data.words; }

  function rec(id) { return S().words.get(id) || null; }
  function isLearned(id) { var r = rec(id); return !!r && r.box >= LEARNED_BOX; }
  /** 'new' — ещё не встречалось, 'learning' — изучается, 'learned' — выучено. */
  function status(id) { var r = rec(id); return !r ? 'new' : r.box >= LEARNED_BOX ? 'learned' : 'learning'; }

  /** Чистая функция: новое состояние слова после ответа. */
  function schedule(r, correct, ms, now) {
    if (now == null) now = Date.now();
    var first = !r;
    r = Object.assign({ box: 0, correct: 0, wrong: 0, streak: 0, firstTs: now, lastTs: 0, learnedTs: 0 }, r || {});
    if (correct) {
      r.correct++; r.streak++;
      r.box = first && ms && ms < FAST_MS ? KNOWN_BOX : Math.min(MAX_BOX, r.box + 1);
      if (r.box >= LEARNED_BOX && !r.learnedTs) r.learnedTs = now;
    } else {
      r.wrong++; r.streak = 0;
      r.box = r.box >= LEARNED_BOX ? 1 : 0; // забытое выученное слово возвращается в изучение
      r.learnedTs = 0;
    }
    r.due = now + BOX_MS[r.box];
    r.lastTs = now;
    return r;
  }

  function grade(id, correct, ms) {
    var prev = rec(id);
    var next = Object.assign(schedule(prev, correct, ms), { id: id });
    var t = S().today();
    t.reviews += 1;
    if (!prev) t.newItems += 1;
    return Promise.all([S().saveWord(next), S().saveToday()]).then(function () {
      EG.bus.emit('words');
      return { before: prev, after: next };
    });
  }

  /* ---------- выбор слов ---------- */

  /** Слова выбранного уровня: конкретный уровень или всё до уровня из настроек
      (не адаптивного: набор слов не должен «прыгать» от серии ошибок). */
  function poolFor(level) {
    if (level) return W().filter(function (w) { return w.level === level; });
    var max = EG.progress.baseLevelIndex();
    return W().filter(function (w) { return EG.util.levelIndex(w.level) <= max; });
  }

  function dueList(level, now) {
    now = now || Date.now();
    return poolFor(level).filter(function (w) { var r = rec(w.id); return r && r.due <= now; });
  }

  /** Состав сессии: сначала слова «к повторению», затем новые, затем ближайшие по сроку; выученные — только в крайнем случае. */
  function buildSession(level, size) {
    size = size || SESSION_SIZE;
    var now = Date.now();
    var pool = poolFor(level);
    var due = [], fresh = [], waiting = [], learned = [];
    pool.forEach(function (w) {
      var r = rec(w.id);
      if (!r) fresh.push(w);
      else if (r.due <= now) due.push(w);
      else if (r.box < LEARNED_BOX) waiting.push(w);
      else learned.push(w);
    });
    // невыученные раньше выученных, затем по сроку
    due.sort(function (a, b) {
      var ra = rec(a.id), rb = rec(b.id);
      return (ra.box >= LEARNED_BOX) - (rb.box >= LEARNED_BOX) || ra.due - rb.due;
    });
    // новые: сначала текущий уровень (при «моём уровне»), затем нижние; внутри — по порядку частотности
    var max = level ? EG.util.levelIndex(level) : EG.progress.baseLevelIndex();
    fresh.sort(function (a, b) {
      return (max - EG.util.levelIndex(a.level)) - (max - EG.util.levelIndex(b.level)) || a.rank - b.rank || a.order - b.order;
    });
    var byDue = function (a, b) { return rec(a.id).due - rec(b.id).due; };
    waiting.sort(byDue);
    learned.sort(byDue);

    var out = [];
    function take(list, n) { while (list.length && out.length < size && n-- > 0) out.push(list.shift()); }
    take(due, size - Math.min(NEW_MIN, fresh.length));
    take(fresh, NEW_MAX);
    take(due, size);
    take(waiting, size);
    take(fresh, size);
    take(learned, size);
    return EG.util.shuffle(out);
  }

  /* ---------- вопросы ---------- */

  function overlaps(a, b) {
    return a.senses.some(function (s) { return b.senses.indexOf(s) >= 0; });
  }

  /** 3 неверных варианта: та же часть речи, близкий уровень, без общих переводов. */
  function distractors(w, dir) {
    var li = EG.util.levelIndex(w.level);
    var label = function (x) { return dir === 'ru-en' ? x.en : x.ru; };
    var ok = function (x) { return x.id !== w.id && x.pos === w.pos && !overlaps(x, w) && label(x) !== label(w); };
    var near = W().filter(function (x) { return ok(x) && Math.abs(EG.util.levelIndex(x.level) - li) <= 1; });
    var picked = [], used = {};
    used[label(w)] = 1;
    function add(list) {
      EG.util.shuffle(list).forEach(function (x) {
        if (picked.length >= 3 || used[label(x)] || picked.some(function (p) { return overlaps(p, x); })) return;
        used[label(x)] = 1;
        picked.push(x);
      });
    }
    add(near);
    if (picked.length < 3) add(W().filter(ok));
    return picked;
  }

  /** Вопрос: dir 'ru-en' — русское слово → выбрать английское; 'en-ru' — наоборот. */
  function question(w, dir) {
    var opts = EG.util.shuffle([w].concat(distractors(w, dir)));
    return {
      id: w.id, word: w, dir: dir,
      prompt: dir === 'ru-en' ? w.ru : w.en,
      options: opts.map(function (x) { return dir === 'ru-en' ? x.en : x.ru; }),
      answer: dir === 'ru-en' ? w.en : w.ru
    };
  }

  function counts(level) {
    var pool = level === undefined ? W() : poolFor(level);
    var now = Date.now();
    var r = { total: pool.length, learned: 0, learning: 0, fresh: 0, due: 0 };
    pool.forEach(function (w) {
      var x = rec(w.id);
      if (!x) { r.fresh++; return; }
      if (x.box >= LEARNED_BOX) r.learned++; else r.learning++;
      if (x.due <= now) r.due++;
    });
    return r;
  }

  EG.wordTrainer = {
    LEARNED_BOX: LEARNED_BOX,
    SESSION_SIZE: SESSION_SIZE,
    rec: rec,
    status: status,
    isLearned: isLearned,
    schedule: schedule,
    grade: grade,
    poolFor: poolFor,
    dueList: dueList,
    buildSession: buildSession,
    distractors: distractors,
    question: question,
    counts: counts
  };
})(window.EG = window.EG || {});
