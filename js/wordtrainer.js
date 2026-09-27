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
  var FAST_MS = 5000;    // «сразу» — с учётом времени на чтение четырёх вариантов
  var SESSION_SIZE = 20;
  var UNIT_SIZE = 20;    // слов в блоке «класса»
  var REVIEW_SIZE = 25;  // слов в общем повторении
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

  /** Общий перевод или однокоренные переводы — такие слова не годятся в неверные варианты друг для друга. */
  function overlaps(a, b) {
    return a.senses.some(function (s) { return b.senses.indexOf(s) >= 0; }) ||
      (a.stems || []).some(function (s) { return (b.stems || []).indexOf(s) >= 0; });
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

  /* ---------- классы (уровни) и блоки ---------- */

  var unitCache = {};

  /** Блоки уровня по UNIT_SIZE слов: сначала частотные, части речи вперемешку. */
  function units(level) {
    if (unitCache[level]) return unitCache[level];
    var list = W().filter(function (w) { return w.level === level; })
      .sort(function (a, b) { return a.rank - b.rank || a.order - b.order; });
    var out = [];
    for (var i = 0; i < list.length; i += UNIT_SIZE) {
      out.push({ level: level, n: out.length + 1, words: list.slice(i, i + UNIT_SIZE) });
    }
    // короткий хвост присоединяем к предыдущему блоку
    if (out.length > 1 && out[out.length - 1].words.length < UNIT_SIZE / 2) {
      var tail = out.pop();
      out[out.length - 1].words = out[out.length - 1].words.concat(tail.words);
    }
    unitCache[level] = out;
    return out;
  }

  function unit(level, n) { return units(level)[n - 1] || null; }

  /** Состояние блока: сколько новых, изучаемых, выученных; mastery — 0…1 по «коробкам». */
  function unitStats(u, now) {
    now = now || Date.now();
    var r = { total: u.words.length, fresh: 0, learning: 0, learned: 0, due: 0, mastery: 0 };
    var sum = 0;
    u.words.forEach(function (w) {
      var x = rec(w.id);
      if (!x) { r.fresh++; return; }
      if (x.box >= LEARNED_BOX) r.learned++; else r.learning++;
      if (x.due <= now) r.due++;
      sum += Math.min(x.box, LEARNED_BOX);
    });
    r.mastery = r.total ? sum / (r.total * LEARNED_BOX) : 0;
    r.started = r.fresh < r.total;
    r.done = r.fresh === 0;
    return r;
  }

  /** Текущий блок уровня: первый, где остались новые слова (или null — все пройдены). */
  function currentUnit(level) {
    var list = units(level);
    for (var i = 0; i < list.length; i++) if (unitStats(list[i]).fresh) return list[i];
    return null;
  }

  /** Уровень-«класс», который сейчас проходится: первый от A1 с непройденными словами. */
  function currentClass() {
    for (var i = 0; i < EG.LEVELS.length; i++) if (currentUnit(EG.LEVELS[i])) return EG.LEVELS[i];
    return EG.LEVELS[EG.LEVELS.length - 1];
  }

  /** Следующий блок курса A1 → C1. */
  function nextUnit() { return currentUnit(currentClass()); }

  /** Все слова к повторению (любых уровней): сначала невыученные и самые просроченные. */
  function dueAll(now) {
    now = now || Date.now();
    var out = [];
    S().words.forEach(function (r) {
      if (r.due <= now && EG.data.wordsById[r.id]) out.push(r);
    });
    out.sort(function (a, b) { return (a.box >= LEARNED_BOX) - (b.box >= LEARNED_BOX) || a.due - b.due; });
    return out.map(function (r) { return EG.data.wordsById[r.id]; });
  }

  /** Сколько новых слов начато сегодня (для дневной сводки). */
  function startedToday() {
    var start = new Date(); start.setHours(0, 0, 0, 0);
    var n = 0;
    S().words.forEach(function (r) { if (r.firstTs >= start.getTime()) n++; });
    return n;
  }

  /** Отметить слово «на изучение» (например, из текста для чтения): появится в ближайшем повторении. */
  function addToLearning(id) {
    if (rec(id) || !EG.data.wordsById[id]) return Promise.resolve(false);
    var now = Date.now();
    var r = { id: id, box: 0, correct: 0, wrong: 0, streak: 0, firstTs: now, lastTs: now, learnedTs: 0, due: now };
    return S().saveWord(r).then(function () { EG.bus.emit('words'); return true; });
  }

  /* ---------- написание ---------- */

  /** Нормализация для сравнения написания: регистр, апострофы, британские/американские варианты. */
  function spell(s) {
    return String(s || '').toLowerCase()
      .replace(/[’‘`´]/g, "'").replace(/…|\.\.\./g, ' ')
      .replace(/[^a-z0-9'\s-]/g, ' ').replace(/-/g, ' ')
      .replace(/\s+/g, ' ').trim()
      .replace(/our\b/g, 'or').replace(/our(?=[a-z])/g, 'or')
      .replace(/([^aeiou])re\b/g, '$1er')
      .replace(/is(e|ed|es|ing|ation)\b/g, 'iz$1').replace(/yse\b/g, 'yze')
      .replace(/ogue\b/g, 'og').replace(/ll(ed|ing|er)\b/g, 'l$1');
  }

  var bySpelling = null;
  /** Другое слово с тем же переводом (синоним), которое ввёл ученик, или null. */
  function synonymTyped(w, a) {
    if (!bySpelling) {
      bySpelling = Object.create(null);
      W().forEach(function (x) { (bySpelling[spell(x.en)] = bySpelling[spell(x.en)] || []).push(x); });
    }
    return (bySpelling[a] || []).filter(function (x) {
      return x.id !== w.id && x.senses.some(function (s) { return w.senses.indexOf(s) >= 0; });
    })[0] || null;
  }

  /** Проверка написанного слова: 'exact' | 'typo' (одна-две опечатки) | 'synonym' (другое слово с тем же переводом) | 'wrong'. */
  function checkSpelling(w, typed) {
    var a = spell(typed), b = spell(w.en);
    if (!a) return 'wrong';
    if (a === b) return 'exact';
    if (synonymTyped(w, a)) return 'synonym';
    var d = EG.text.lev(a, b);
    if (b.length >= 5 && d <= (b.length >= 9 ? 2 : 1)) return 'typo';
    return 'wrong';
  }

  /** Подсказка к написанию: открыты первые n букв, остальные — «_» (пробелы и дефисы сохраняются). */
  function mask(en, n) {
    var k = 0;
    return en.split('').map(function (ch) {
      if (!/[a-z]/i.test(ch)) return ch;
      return k++ < n ? ch : '_';
    }).join('');
  }

  function letterCount(en) { return (en.match(/[a-z]/gi) || []).length; }

  /* ---------- примеры употребления ---------- */

  var exIndex = null;
  function buildExIndex() {
    exIndex = [];
    (EG.data.vocab || []).forEach(function (v) {
      if (v.example) exIndex.push({ en: v.example, ru: v.exampleRu || '', low: ' ' + v.example.toLowerCase().replace(/[^a-z']+/g, ' ') + ' ' });
    });
    (EG.data.texts || []).forEach(function (t) {
      t.paragraphs.forEach(function (p) {
        p.replace(/([.!?])\s+/g, '$1\n').split('\n').forEach(function (sent) {
          if (sent.length < 30 || sent.length > 160) return;
          exIndex.push({ en: sent, ru: '', src: t.title, low: ' ' + sent.toLowerCase().replace(/[^a-z']+/g, ' ') + ' ' });
        });
      });
    });
  }

  /** До n предложений, где встречается слово (из выражений курса и текстов для чтения). */
  function examples(w, n) {
    if (!exIndex) buildExIndex();
    var key = ' ' + w.en.toLowerCase().replace(/[^a-z']+/g, ' ').trim() + ' ';
    if (key.trim().length < 2) return [];
    var out = [];
    for (var i = 0; i < exIndex.length && out.length < (n || 1); i++) {
      if (exIndex[i].low.indexOf(key) >= 0) out.push(exIndex[i]);
    }
    // предложения с переводом — вперёд
    return out.sort(function (a, b) { return (b.ru ? 1 : 0) - (a.ru ? 1 : 0); });
  }

  EG.wordTrainer = {
    LEARNED_BOX: LEARNED_BOX,
    KNOWN_BOX: KNOWN_BOX,
    SESSION_SIZE: SESSION_SIZE,
    UNIT_SIZE: UNIT_SIZE,
    REVIEW_SIZE: REVIEW_SIZE,
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
    counts: counts,
    units: units,
    unit: unit,
    unitStats: unitStats,
    currentUnit: currentUnit,
    currentClass: currentClass,
    nextUnit: nextUnit,
    dueAll: dueAll,
    startedToday: startedToday,
    addToLearning: addToLearning,
    checkSpelling: checkSpelling,
    mask: mask,
    letterCount: letterCount,
    examples: examples
  };
})(window.EG = window.EG || {});
