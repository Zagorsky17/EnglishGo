/* gtoday/gtoday.js — раздел «Грамматика сегодня»: ежедневная короткая тренировка распознавания 12 времён.
   Методика: интервальные повторения (коробки Лейтнера), времена вперемешку (interleaving),
   «детектор» из двух вопросов (точка отсчёта → что главное), смысловые пары, мгновенный разбор ошибки.
   Изоляция: прогресс лежит в отдельной базе IndexedDB «englishgo-gtoday» (хранилища items, days) —
   база приложения, SRS, XP, ошибки, статистика и раздел «Грамматика» не затрагиваются.
   Из ядра — только EG.ui (DOM-хелперы, озвучка, confirm) и EG.instance.active (не писать из неактивной вкладки).
   Маршруты: #/gtoday · #/gtoday/start · #/gtoday/extra · #/gtoday/focus/:tense */
(function (EG) {
  'use strict';

  var GT = EG.gtoday = EG.gtoday || {};
  EG.views = EG.views || {};
  var h = EG.ui.h, icon = EG.ui.icon;

  var DAY = 86400000;
  var INTERVALS = [0, 1, 3, 7, 16, 35, 90]; // дни до повторения для коробки 0…6
  var MAX_BOX = INTERVALS.length - 1;
  var LEARNED_BOX = 3;     // с этой коробки фраза считается выученной
  var SESSION_MAX = 15;    // заданий в ежедневной сессии (без карточек знакомства)
  var REVIEW_MAX = 10;     // из них повторений — не больше
  var NEW_MAX = 6;         // новых фраз за сессию
  var NEW_PER_DAY = 10;    // новых фраз за день
  var PAIRS_MAX = 2;       // новых смысловых пар за сессию
  var START_OPEN = 2;      // сначала открыты два времени
  var UNLOCK_SEEN = 4;     // следующее время открывается, когда по каждому открытому пройдено столько фраз
  var EXTRA_SIZE = 10;
  var FOCUS_SIZE = 8;

  // Пары, которые путают чаще всего, — из них в первую очередь берутся неверные варианты в «Определи время».
  var CONFUSED = [
    ['present-simple', 'present-continuous'], ['past-simple', 'present-perfect'], ['present-perfect', 'present-perfect-continuous'],
    ['past-simple', 'past-continuous'], ['past-simple', 'past-perfect'], ['future-simple', 'present-continuous'],
    ['future-continuous', 'future-perfect'], ['present-simple', 'present-perfect'], ['present-continuous', 'present-perfect-continuous'],
    ['past-perfect', 'past-perfect-continuous'], ['future-perfect', 'future-perfect-continuous']
  ];

  function D() { return GT.data; }

  /* ================= хранилище (отдельная база) ================= */

  var DB_NAME = 'englishgo-gtoday';

  var store = (function () {
    var db = null, opening = null, failed = false;
    var items = new Map(), days = new Map();

    function open() {
      if (db || failed) return Promise.resolve(db);
      if (opening) return opening;
      opening = new Promise(function (resolve) {
        var req;
        try { req = window.indexedDB ? window.indexedDB.open(DB_NAME, 1) : null; } catch (e) { req = null; }
        if (!req) { failed = true; resolve(null); return; }
        req.onupgradeneeded = function () {
          var d = req.result;
          if (!d.objectStoreNames.contains('items')) d.createObjectStore('items', { keyPath: 'id' });
          if (!d.objectStoreNames.contains('days')) d.createObjectStore('days', { keyPath: 'date' });
        };
        req.onsuccess = function () {
          db = req.result;
          db.onversionchange = function () { try { db.close(); } catch (e) { /* уже закрыта */ } db = null; };
          resolve(db);
        };
        req.onerror = function () { failed = true; resolve(null); };
        req.onblocked = function () { failed = true; resolve(null); };
      }).then(function (d) { opening = null; return d; });
      return opening;
    }

    function cleanItem(r) {
      return {
        id: String(r.id), box: Math.max(0, Math.min(MAX_BOX, Math.floor(Number(r.box) || 0))),
        due: Number(r.due) || 0, seen: Number(r.seen) || 0,
        right: Number(r.right) || 0, wrong: Number(r.wrong) || 0, lastTs: Number(r.lastTs) || 0
      };
    }
    function cleanDay(r) {
      return { date: String(r.date), answers: Number(r.answers) || 0, correct: Number(r.correct) || 0, sessions: Number(r.sessions) || 0 };
    }

    function readAll(d, name, clean, key) {
      return new Promise(function (resolve) {
        try {
          var req = d.transaction(name, 'readonly').objectStore(name).getAll();
          req.onsuccess = function () {
            var m = new Map();
            (req.result || []).forEach(function (r) { if (r && r[key]) m.set(String(r[key]), clean(r)); });
            resolve(m);
          };
          req.onerror = function () { resolve(null); };
        } catch (e) { resolve(null); }
      });
    }

    /** Перечитать всё из базы (при каждом входе в раздел — другая вкладка могла писать). */
    function load() {
      return open().then(function (d) {
        if (!d) return null;
        return Promise.all([readAll(d, 'items', cleanItem, 'id'), readAll(d, 'days', cleanDay, 'date')]).then(function (r) {
          if (r[0]) items = r[0];
          if (r[1]) days = r[1];
        });
      });
    }

    function canWrite() { return !(EG.instance && EG.instance.active === false); }

    function write(name, rec) {
      if (!db || !canWrite()) return;
      try { db.transaction(name, 'readwrite').objectStore(name).put(rec); } catch (e) { console.error('[gtoday]', e); }
    }

    function clear() {
      items = new Map(); days = new Map();
      if (!db || !canWrite()) return Promise.resolve();
      return new Promise(function (resolve) {
        try {
          var tx = db.transaction(['items', 'days'], 'readwrite');
          tx.objectStore('items').clear();
          tx.objectStore('days').clear();
          tx.oncomplete = tx.onerror = function () { resolve(); };
        } catch (e) { resolve(); }
      });
    }

    return {
      load: load, clear: clear,
      item: function (id) { return items.get(id) || null; },
      ensureItem: function (id) { return items.get(id) || cleanItem({ id: id }); },
      putItem: function (rec) { items.set(rec.id, rec); write('items', rec); },
      day: function (date) { return days.get(date) || cleanDay({ date: date }); },
      putDay: function (rec) { days.set(rec.date, rec); write('days', rec); },
      get persistent() { return !!db; }
    };
  })();

  /* ================= прогресс и расписание ================= */

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dateKey(ts) { var d = new Date(ts); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function startOfDay(ts) { var d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }

  function sentences(tenseId) { return D().items.filter(function (it) { return it.kind === 'sentence' && it.tense === tenseId; }); }
  function seenCount(tenseId) { return sentences(tenseId).filter(function (it) { return store.item(it.id); }).length; }
  function learnedCount(tenseId) {
    return sentences(tenseId).filter(function (it) { var r = store.item(it.id); return r && r.box >= LEARNED_BOX; }).length;
  }

  /** Открытые времена: первые START_OPEN, затем по одному, когда по каждому открытому пройдено UNLOCK_SEEN фраз.
      Время, начатое через «Тренировать отдельно», тоже считается открытым. */
  function openTenses() {
    var list = D().tenses, n = START_OPEN;
    while (n < list.length && list.slice(0, n).every(function (t) { return seenCount(t.id) >= Math.min(UNLOCK_SEEN, sentences(t.id).length); })) n++;
    var set = new Set(list.slice(0, n).map(function (t) { return t.id; }));
    list.forEach(function (t) { if (seenCount(t.id)) set.add(t.id); });
    return set;
  }
  function nextLocked(open) { return D().tenses.filter(function (t) { return !open.has(t.id); })[0] || null; }

  function grade(it, ok) {
    var now = Date.now();
    var rec = store.ensureItem(it.id);
    if (!rec.seen) rec.seen = now;
    if (ok) { rec.right++; rec.box = Math.min(MAX_BOX, rec.box + 1); } else { rec.wrong++; rec.box = 0; }
    rec.due = now + INTERVALS[rec.box] * DAY;
    rec.lastTs = now;
    store.putItem(rec);
    var day = store.day(dateKey(now));
    day.answers++;
    if (ok) day.correct++;
    store.putDay(day);
  }

  function newToday() {
    var from = startOfDay(Date.now());
    return D().items.filter(function (it) { var r = store.item(it.id); return r && r.seen >= from; }).length;
  }

  function pairOpen(it, open) { return open.has(it.tense) && open.has(it.other); }

  /** Новые фразы: по кругу из открытых времён, сначала из тех, где пройдено меньше всего. */
  function pickNew(open, n, onlyTense) {
    if (n <= 0) return [];
    var fresh = D().items.filter(function (it) { return !store.item(it.id); });
    var groups = {};
    fresh.forEach(function (it) {
      if (it.kind !== 'sentence') return;
      if (onlyTense ? it.tense !== onlyTense : !open.has(it.tense)) return;
      (groups[it.tense] = groups[it.tense] || []).push(it);
    });
    var order = Object.keys(groups).sort(function (a, b) { return seenCount(a) - seenCount(b) || D().tensesById[a].order - D().tensesById[b].order; });
    var out = [];
    while (out.length < n && order.some(function (k) { return groups[k].length; })) {
      order.forEach(function (k) { if (out.length < n && groups[k].length) out.push(groups[k].shift()); });
    }
    // смысловые пары — когда оба времени пары уже открыты и по ним есть пройденные фразы
    var pairs = fresh.filter(function (it) {
      return it.kind === 'pair' && pairOpen(it, open) && seenCount(it.tense) && seenCount(it.other) &&
        (!onlyTense || it.tense === onlyTense || it.other === onlyTense);
    }).slice(0, PAIRS_MAX);
    pairs.forEach(function (p) { if (out.length >= n) out.pop(); });
    return out.concat(pairs).slice(0, n);
  }

  function dueItems(open, onlyTense) {
    var now = Date.now();
    return D().items.filter(function (it) {
      var r = store.item(it.id);
      if (!r || r.due > now) return false;
      return onlyTense ? it.tense === onlyTense || it.other === onlyTense : true;
    }).sort(function (a, b) {
      var ra = store.item(a.id), rb = store.item(b.id);
      return ra.box - rb.box || ra.due - rb.due;
    });
  }

  function planToday() {
    var open = openTenses();
    var due = dueItems(open).slice(0, REVIEW_MAX);
    var room = Math.min(NEW_MAX, NEW_PER_DAY - newToday(), SESSION_MAX - due.length);
    var fresh = pickNew(open, room);
    return { open: open, due: due, fresh: fresh };
  }

  /* ================= сборка заданий ================= */

  function confusion(a, b) {
    var ta = D().tensesById[a], tb = D().tensesById[b];
    var s = 0;
    if (ta.time === tb.time) s += 2;
    if (ta.aspect === tb.aspect) s += 2;
    if (CONFUSED.some(function (p) { return (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a); })) s += 3;
    return s + Math.random();
  }

  /** Варианты для «Определи время»: верное + до трёх самых «опасных» соседей из открытых времён. */
  function tenseOptions(tenseId, allowed) {
    var pool = Array.from(allowed).filter(function (id) { return id !== tenseId; });
    if (pool.length < 2) {
      D().tenses.forEach(function (t) { if (t.id !== tenseId && pool.indexOf(t.id) < 0) pool.push(t.id); });
    }
    pool.sort(function (a, b) { return confusion(tenseId, b) - confusion(tenseId, a); });
    return [tenseId].concat(pool.slice(0, 3));
  }

  /** Вид задания по коробке: новая фраза → детектор, дальше → назвать время → выбрать форму → вперемешку. */
  function exerciseFor(it, allowed) {
    if (it.kind === 'pair') return { kind: 'pair', item: it };
    var r = store.item(it.id);
    var box = r ? r.box : 0;
    var kind = !r || box === 0 ? 'steps' : box === 1 ? 'identify' : box === 2 ? 'choose' : (Math.random() < 0.5 ? 'identify' : 'choose');
    return { kind: kind, item: it, options: kind === 'identify' ? tenseOptions(it.tense, allowed) : null };
  }

  /** Соседние задания — про разные времена: так мозг учится различать, а не повторять шаблон. */
  function interleave(list) {
    // каждый раз берём самую большую группу, кроме времени предыдущего задания, — так повторов подряд минимум
    var groups = {};
    GT.ui.shuffle(list).forEach(function (x) { (groups[x.item.tense] = groups[x.item.tense] || []).push(x); });
    var out = [], prev = null;
    for (var n = list.length; n > 0; n--) {
      var keys = Object.keys(groups).filter(function (k) { return groups[k].length; });
      var pick = keys.filter(function (k) { return k !== prev; }).sort(function (a, b) { return groups[b].length - groups[a].length; })[0] || prev;
      out.push(groups[pick].shift());
      prev = pick;
    }
    return out;
  }

  /** Перед первым заданием по времени, которое ещё ни разу не встречалось, — короткое знакомство. */
  function withIntros(list) {
    var shown = {};
    var out = [];
    list.forEach(function (ex) {
      var id = ex.item.tense;
      if (!shown[id] && !seenCount(id) && ex.item.kind === 'sentence') { shown[id] = true; out.push({ kind: 'intro', tense: id, item: { tense: id } }); }
      out.push(ex);
    });
    return out;
  }

  function build(items, allowed) {
    return withIntros(interleave(items.map(function (it) { return exerciseFor(it, allowed); })));
  }

  /* ================= экраны ================= */

  var root = null;

  function back(href, label) {
    return h('a', { class: 'back-link', href: href || '#/gtoday' }, icon('back'), label || 'Грамматика сегодня');
  }

  function countSession() {
    var day = store.day(dateKey(Date.now()));
    day.sessions++;
    store.putDay(day);
  }

  function session(items, allowed, opts) {
    var box = h('div', { class: 'gt' });
    root.append(box);
    // в одной сессии фраза оценивается только по первому ответу; повтор после ошибки на расписание не влияет
    var graded = {};
    return GT.run(box, build(items, allowed), Object.assign({
      exitHref: '#/gtoday',
      onAnswer: function (ex, ok) { if (!graded[ex.item.id]) { graded[ex.item.id] = true; grade(ex.item, ok); } },
      onFinish: countSession
    }, opts));
  }

  function startToday() {
    var p = planToday();
    var items = p.due.concat(p.fresh);
    if (!items.length) {
      root.append(back(), EG.ui.empty('check', 'На сегодня всё!', 'Повторений больше нет, а лимит новых фраз на сегодня пройден. Можно потренироваться дополнительно.',
        h('a', { class: 'btn primary', href: '#/gtoday/extra' }, 'Дополнительная тренировка')));
      return null;
    }
    return session(items, p.open, {
      title: 'Грамматика сегодня',
      finishTitle: 'Сессия на сегодня пройдена!',
      actions: [{ label: 'К плану', href: '#/gtoday', primary: true }, { label: 'Ещё ' + EXTRA_SIZE + ' заданий', href: '#/gtoday/extra' }]
    });
  }

  function startExtra() {
    var seen = D().items.filter(function (it) { return store.item(it.id); }).sort(function (a, b) {
      var ra = store.item(a.id), rb = store.item(b.id);
      return ra.box - rb.box || ra.lastTs - rb.lastTs;
    }).slice(0, EXTRA_SIZE);
    if (!seen.length) {
      root.append(back(), EG.ui.empty('help', 'Сначала основная сессия', 'Дополнительная тренировка повторяет уже знакомые фразы. Начните с плана на сегодня.',
        h('a', { class: 'btn primary', href: '#/gtoday/start' }, 'Начать')));
      return null;
    }
    return session(seen, openTenses(), {
      title: 'Дополнительная тренировка · самые слабые фразы',
      actions: [{ label: 'К плану', href: '#/gtoday', primary: true }, { label: 'Ещё раз', href: '#/gtoday/extra' }]
    });
  }

  function startFocus(t) {
    var open = openTenses();
    var due = dueItems(open, t.id);
    var fresh = pickNew(open, FOCUS_SIZE, t.id);
    var known = D().items.filter(function (it) {
      return store.item(it.id) && (it.tense === t.id || it.other === t.id) && due.indexOf(it) < 0;
    }).sort(function (a, b) { return store.item(a.id).box - store.item(b.id).box; });
    var items = due.concat(fresh, known).slice(0, FOCUS_SIZE);
    var allowed = new Set(open);
    allowed.add(t.id);
    // в отдельной тренировке нужны «соседи» для сравнения, даже если они ещё не открыты
    D().tenses.forEach(function (x) { if (x.id !== t.id && confusion(t.id, x.id) >= 5) allowed.add(x.id); });
    return session(items, allowed, {
      title: t.name + ' · отдельная тренировка',
      exitHref: '#/gtoday',
      actions: [{ label: 'К плану', href: '#/gtoday', primary: true }, { label: 'Ещё раз', href: '#/gtoday/focus/' + t.id }]
    });
  }

  function tenseRow(t, open) {
    var total = sentences(t.id).length;
    var learned = learnedCount(t.id), seen = seenCount(t.id);
    var isOpen = open.has(t.id);
    return h('a', { class: 'gt-tense' + (isOpen ? '' : ' gt-locked'), href: '#/gtoday/focus/' + t.id, title: 'Тренировать отдельно' },
      h('div', { class: 'gt-tense-main' },
        h('strong', { lang: 'en' }, t.name),
        h('span', { class: 'muted small' }, t.ru)),
      h('div', { class: 'gt-tense-side' },
        h('span', { class: 'gt-st' + (learned >= total ? ' done' : seen ? ' learning' : '') },
          !isOpen ? 'закрыто' : learned >= total ? 'освоено' : seen ? learned + ' / ' + total : 'новое')),
      h('div', { class: 'gt-tense-bar' }, h('span', { style: { width: Math.round(learned / total * 100) + '%' } })));
  }

  function overview() {
    var p = planToday();
    var today = store.day(dateKey(Date.now()));
    var reviewN = p.due.length, newN = p.fresh.length;
    var newTenses = [];
    p.fresh.forEach(function (it) { if (it.kind === 'sentence' && !seenCount(it.tense) && newTenses.indexOf(it.tense) < 0) newTenses.push(it.tense); });
    var locked = nextLocked(p.open);
    var hasTable = !!EG.views.tenses;
    var learnedAll = D().items.filter(function (it) { var r = store.item(it.id); return r && r.box >= LEARNED_BOX; }).length;

    var plan = h('section', { class: 'card hero plan gt-plan' },
      h('div', { class: 'hero-text' },
        h('h2', null, 'План на сегодня'),
        h('ul', { class: 'plan-list' },
          h('li', null, icon('review'), h('span', null, h('strong', null, reviewN), ' на повторение — фразы, которые пора вспомнить')),
          h('li', null, icon('star'), h('span', null, h('strong', null, newN), ' новых фраз и ситуаций')),
          newTenses.length ? h('li', null, icon('bulb'), h('span', null, 'Новое время: ', h('strong', { lang: 'en' }, newTenses.map(function (id) { return D().tensesById[id].name; }).join(', ')))) : null,
          h('li', null, icon('target'), h('span', null, 'Времена вперемешку — учимся различать, а не угадывать'))),
        today.answers ? h('p', { class: 'muted small gt-today' }, 'Сегодня: ' + today.answers + ' ответов, верно ' + today.correct + (today.sessions ? ' · сессий: ' + today.sessions : '')) : null,
        reviewN + newN
          ? h('div', { class: 'gt-actions' }, h('a', { class: 'btn primary', href: '#/gtoday/start' }, 'Начать', icon('arrow')), h('span', { class: 'muted small' }, '≈ ' + Math.max(3, Math.round((reviewN + newN) / 3)) + ' мин'))
          : h('div', null, h('p', { class: 'muted' }, 'На сегодня всё повторено, лимит новых фраз пройден. Завтра будут новые повторения.'),
              h('a', { class: 'btn', href: '#/gtoday/extra' }, 'Дополнительная тренировка'))));

    var detector = h('section', { class: 'card gt-detector' },
      h('h3', { class: 'card-title' }, '🔍 Детектор времени — 2 вопроса'),
      h('p', { class: 'muted small' }, 'Любое из 12 времён определяется двумя вопросами. В заданиях «Детектор» вы проходите их по шагам, пока это не станет автоматическим.'),
      h('div', { class: 'gt-det-steps' },
        h('div', { class: 'gt-det-step' }, h('span', { class: 'gt-det-n' }, '1'),
          h('div', null, h('strong', null, 'Группа: ', h('span', { lang: 'en' }, 'Past · Present · Future')), h('p', { class: 'muted small' }, 'Прошлое, сейчас или будущее — строка таблицы. Ищите сигнал: yesterday, now, tomorrow, by Friday.'))),
        h('div', { class: 'gt-det-step' }, h('span', { class: 'gt-det-n' }, '2'),
          h('div', null, h('strong', null, 'Вид: ', h('span', { lang: 'en' }, 'Simple · Continuous · Perfect · Perfect Continuous')), h('p', { class: 'muted small' }, 'Факт, процесс, результат к моменту или длительность до момента — столбец таблицы. Группа + вид = время: Present + Perfect = Present Perfect.')))),
      hasTable ? h('a', { class: 'link-btn gt-table-link', href: '#/tenses' }, 'Открыть таблицу времён →') : null);

    var tensesCard = h('section', { class: 'card' },
      h('h3', { class: 'card-title' }, 'Времена'),
      h('p', { class: 'muted small' }, 'Открыто ' + p.open.size + ' из ' + D().tenses.length + ' · выучено фраз: ' + learnedAll + ' из ' + D().items.length + '. ' +
        (locked ? 'Следующее время (' + locked.name + ') откроется, когда по каждому открытому будет пройдено по ' + UNLOCK_SEEN + ' фразы. ' : '') +
        'Нажмите на время, чтобы потренировать его отдельно.'),
      h('div', { class: 'gt-tenses' }, D().tenses.map(function (t) { return tenseRow(t, p.open); })));

    var how = h('details', { class: 'gt-how' },
      h('summary', null, 'Как это работает'),
      h('ul', null,
        h('li', null, h('strong', null, 'Интервальные повторения. '), 'Каждая фраза возвращается через 1, 3, 7, 16 дней… Ошибка — и фраза снова повторяется со следующего дня.'),
        h('li', null, h('strong', null, 'Вперемешку. '), 'Соседние задания — про разные времена. Так вы учитесь выбирать время, а не повторять одно правило подряд.'),
        h('li', null, h('strong', null, 'Сначала смысл, потом форма. '), 'Новая фраза — «Детектор», затем «Определи время», затем «Выбери форму». Смысловые пары учат различать похожие времена.'),
        h('li', null, h('strong', null, 'Разбор сразу. '), 'После каждого ответа — какое время и почему: сигнал во фразе и цепочка «точка отсчёта → главное → время».')));

    root.append(
      EG.ui.pageHead('Грамматика сегодня', '10–15 коротких заданий в день, чтобы безошибочно определять времена: живые фразы и ситуации, повторения по расписанию.'),
      store.persistent ? null : h('p', { class: 'gt-note' }, icon('mistakes'), 'Прогресс сейчас не сохраняется (хранилище браузера недоступно) — он пропадёт после перезагрузки.'),
      plan, detector, tensesCard, how,
      h('div', { class: 'gt-footer' },
        h('p', { class: 'muted small' }, 'Прогресс раздела хранится отдельно и не влияет на другие разделы.'),
        h('button', { class: 'btn ghost sm', type: 'button', onclick: reset }, icon('trash'), 'Сбросить прогресс')));
    return null;
  }

  function reset() {
    EG.ui.confirm('Сбросить прогресс?', 'Все фразы раздела «Грамматика сегодня» начнутся заново. Другие разделы не затрагиваются.', 'Сбросить', true)
      .then(function (yes) { if (yes) return store.clear().then(function () { EG.router.refresh(); }); });
  }

  function render(params) {
    root.replaceChildren();
    if (!D() || !D().items || !D().items.length) {
      root.append(EG.ui.empty('help', 'Раздел недоступен', 'Не удалось загрузить материалы раздела.'));
      return null;
    }
    var p = params || [];
    if (p[0] === 'start') return startToday();
    if (p[0] === 'extra') return startExtra();
    if (p[0] === 'focus') {
      var t = D().tensesById[p[1]];
      if (t) return startFocus(t);
      root.append(EG.ui.empty('help', 'Время не найдено', 'Возможно, ссылка устарела.', h('a', { class: 'btn', href: '#/gtoday' }, 'К плану')));
      return null;
    }
    return overview();
  }

  EG.views.gtoday = function (el, params) {
    root = el;
    return store.load().then(function () { return render(params); }, function () { return render(params); });
  };

  // для проверки в Node (tools/gtoday-check.js) и отладки
  GT.logic = { store: store, planToday: planToday, openTenses: openTenses, pickNew: pickNew, grade: grade,
    build: build, exerciseFor: exerciseFor, tenseOptions: tenseOptions, interleave: interleave };
})(window.EG = window.EG || {});
