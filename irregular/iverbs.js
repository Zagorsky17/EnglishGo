/* irregular/iverbs.js — раздел «Неправильные глаголы сегодня»: ежедневная тренировка трёх форм.
   Методика: группы по звучанию (правило группы → сразу несколько глаголов), частотность (сначала самые нужные),
   активное припоминание (написать формы самому сильнее, чем узнать), интервальные повторения (коробки Лейтнера),
   формы в контексте (V2 после yesterday, V3 после have), проговаривание вслух «go — went — gone».
   Изоляция: прогресс — в отдельной базе IndexedDB «englishgo-iverbs» (хранилища items, days);
   база приложения, SRS, XP, ошибки и статистика не затрагиваются. Из ядра — только EG.ui и EG.instance.active.
   Маршруты: #/iverbs · #/iverbs/start · #/iverbs/extra · #/iverbs/group/:id */
(function (EG) {
  'use strict';

  var IR = EG.irregular = EG.irregular || {};
  EG.views = EG.views || {};
  var h = EG.ui.h, icon = EG.ui.icon;

  var DAY = 86400000;
  var INTERVALS = [0, 1, 3, 7, 16, 35, 90]; // дни до повторения для коробки 0…6
  var MAX_BOX = INTERVALS.length - 1;
  var LEARNED_BOX = 3;    // с этой коробки глагол считается выученным
  var SESSION_MAX = 18;   // заданий в ежедневной сессии (без карточек знакомства)
  var REVIEW_MAX = 12;
  var NEW_MAX = 6;        // новых глаголов за сессию
  var NEW_PER_DAY = 12;
  var SIBLINGS = 2;       // к новому глаголу добавляем до двух «соседей» по группе — учим группой
  var EXTRA_SIZE = 10;
  var GROUP_SIZE = 10;

  function D() { return IR.data; }
  function chant(v) { return [v.base, v.v2[0], v.v3[0]].join(', '); }
  function triple(v) { return [v.base, v.v2.join(' / '), v.v3.join(' / ')].join(' — '); }

  /* ================= хранилище (отдельная база) ================= */

  var store = (function () {
    var db = null, opening = null, failed = false;
    var items = new Map(), days = new Map();

    function open() {
      if (db || failed) return Promise.resolve(db);
      if (opening) return opening;
      opening = new Promise(function (resolve) {
        var req;
        try { req = window.indexedDB ? window.indexedDB.open('englishgo-iverbs', 1) : null; } catch (e) { req = null; }
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
      try { db.transaction(name, 'readwrite').objectStore(name).put(rec); } catch (e) { console.error('[iverbs]', e); }
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

  /* ================= расписание ================= */

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dateKey(ts) { var d = new Date(ts); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function startOfDay(ts) { var d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }

  function learned(v) { var r = store.item(v.id); return !!r && r.box >= LEARNED_BOX; }
  function groupSeen(gid) { return D().groupsById[gid].verbs.some(function (v) { return store.item(v.id); }); }

  function grade(v, ok) {
    var now = Date.now();
    var rec = store.ensureItem(v.id);
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
    return D().verbs.filter(function (v) { var r = store.item(v.id); return r && r.seen >= from; }).length;
  }

  /** Новые глаголы: следующий по частотности + до SIBLINGS соседей по группе (учим группой, а не вразброс). */
  function pickNew(n, onlyGroup) {
    var out = [];
    var fresh = D().verbs.filter(function (v) { return !store.item(v.id) && (!onlyGroup || v.group === onlyGroup); })
      .sort(function (a, b) { return a.rank - b.rank; });
    while (out.length < n && fresh.length) {
      var v = fresh.shift();
      out.push(v);
      var sib = fresh.filter(function (x) { return x.group === v.group; }).slice(0, SIBLINGS);
      sib.forEach(function (x) { if (out.length < n) { out.push(x); fresh.splice(fresh.indexOf(x), 1); } });
    }
    return out;
  }

  function dueVerbs(onlyGroup) {
    var now = Date.now();
    return D().verbs.filter(function (v) {
      var r = store.item(v.id);
      return r && r.due <= now && (!onlyGroup || v.group === onlyGroup);
    }).sort(function (a, b) {
      var ra = store.item(a.id), rb = store.item(b.id);
      return ra.box - rb.box || ra.due - rb.due;
    });
  }

  function planToday() {
    var due = dueVerbs().slice(0, REVIEW_MAX);
    var room = Math.min(NEW_MAX, NEW_PER_DAY - newToday(), SESSION_MAX - due.length);
    return { due: due, fresh: room > 0 ? pickNew(room) : [] };
  }

  /* ================= задания ================= */

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  /** Ошибка «по правилу»: go → goed, cut → cutted, try → tried. */
  function regular(base) {
    if (/e$/.test(base)) return base + 'd';
    if (/[^aeiou]y$/.test(base)) return base.slice(0, -1) + 'ied';
    if (base.length <= 5 && /[^aeiou][aeiou][bdgkmnprt]$/.test(base)) return base + base.slice(-1) + 'ed';
    return base + 'ed';
  }

  function low(s) { return String(s || '').trim().toLowerCase(); }
  function uniqueBy(list, avoid) {
    var seen = new Set((avoid || []).map(low));
    return list.filter(function (x) { var k = low(x); if (!x || seen.has(k)) return false; seen.add(k); return true; });
  }

  /** «Три формы»: верная пара V2 — V3 и три правдоподобные ошибки. */
  function formsOptions(v) {
    var a = v.v2[0], b = v.v3[0], r = regular(v.base), ing = v.base.replace(/e$/, '') + 'ing';
    var right = a + ' — ' + b;
    var cands = [r + ' — ' + r, a + ' — ' + a, b + ' — ' + b, b + ' — ' + a, a + ' — ' + r, r + ' — ' + b, v.base + ' — ' + b, a + ' — ' + v.base, v.base + ' — ' + r];
    // у learn / burn / dream форма «по правилу» тоже верна — тогда добираем варианты с -ing
    var valid = function (s) { var p = s.split(' — '); return v.v2.indexOf(p[0]) >= 0 && v.v3.indexOf(p[1]) >= 0; };
    cands = cands.filter(function (s) { return !valid(s); });
    if (uniqueBy(cands, [right]).length < 3) cands = cands.concat([ing + ' — ' + b, a + ' — ' + ing, ing + ' — ' + ing]);
    var wrong = shuffle(uniqueBy(cands, [right])).slice(0, 3);
    return [right].concat(wrong);
  }

  /** «Вставь форму»: пример с V2 или V3; неверные — другая форма, «по правилу», начальная, -ing. */
  function gapExercise(v) {
    var usePast = Math.random() < 0.5;
    var text = usePast ? v.exPast : v.exPerfect;
    var slot = usePast ? v.v2 : v.v3;
    var right = (text.match(/\[([^\]]+)\]/) || [])[1];
    var other = usePast ? v.v3 : v.v2;
    var wrong = uniqueBy([other[0], regular(v.base), v.base, v.base.replace(/e$/, '') + 'ing'], slot).slice(0, 2);
    return { kind: 'gap', verb: v, text: text, slot: usePast ? 'V2' : 'V3', right: right, options: [right].concat(wrong) };
  }

  function exerciseFor(v) {
    var r = store.item(v.id);
    var box = r ? r.box : 0;
    if (!r || box === 0) return { kind: 'forms', verb: v, options: formsOptions(v) };
    if (box === 1) return gapExercise(v);
    if (box === 2 || Math.random() < 0.6) return { kind: 'type', verb: v };
    return gapExercise(v);
  }

  /** Знакомство с группой — перед первым глаголом группы, которую ещё не встречали. */
  function build(verbs) {
    var today = {};
    verbs.forEach(function (v) { (today[v.group] = today[v.group] || []).push(v.id); });
    // новые — группами подряд (чтобы видеть правило), повторения — вперемешку между ними
    var fresh = verbs.filter(function (v) { return !store.item(v.id); });
    var old = shuffle(verbs.filter(function (v) { return store.item(v.id); }));
    var order = [];
    var step = fresh.length ? Math.max(1, Math.ceil(old.length / fresh.length)) : 0;
    fresh.forEach(function (v) { order.push(v); for (var k = 0; k < step && old.length; k++) order.push(old.shift()); });
    order = order.concat(old);
    var shown = {};
    var out = [];
    order.forEach(function (v) {
      if (!shown[v.group] && !groupSeen(v.group)) { shown[v.group] = true; out.push({ kind: 'intro', group: v.group, today: today[v.group] }); }
      out.push(exerciseFor(v));
    });
    return out;
  }

  /* ================= плеер ================= */

  var LABEL = { intro: 'Новая группа', forms: 'Три формы', gap: 'Вставь форму', type: 'Напиши формы' };

  function mark(text, fill) {
    var out = [];
    String(text || '').split(/(\[[^\]]+\]|___)/).forEach(function (part) {
      if (!part) return;
      if (part === '___') out.push(fill ? h('mark', { class: 'iv-key' }, fill) : h('span', { class: 'iv-gap' }, ' '));
      else if (part.charAt(0) === '[') out.push(h('mark', { class: 'iv-key' }, part.slice(1, -1)));
      else out.push(part);
    });
    return h('span', { lang: 'en' }, out);
  }
  function plain(t) { return String(t || '').replace(/[[\]]/g, ''); }
  function say(text) { return EG.ui.speakBtn ? EG.ui.speakBtn(text, true) : null; }

  /** Сравнение введённой формы: регистр и пробелы не важны; «was / were» — каждая часть должна быть верной. */
  function accepts(value, variants) {
    var parts = low(value).replace(/[’`]/g, '\'').split(/\s*[\/,]\s*|\s+or\s+/).filter(Boolean);
    if (!parts.length) return false;
    var ok = variants.map(low);
    return parts.every(function (p) { return ok.indexOf(p) >= 0; });
  }
  IR.accepts = accepts;

  function run(root, list, opts) {
    var queue = list.slice();
    var pos = 0, firstOk = 0, keyHandler = null;
    var firstTotal = list.filter(function (e) { return e.kind !== 'intro'; }).length;
    var missed = {};

    var bar = h('span');
    var counter = h('span', { class: 'muted small' });
    var stage = h('div');
    var foot = h('div');
    root.append(h('div', { class: 'iv-run' },
      h('div', { class: 'iv-run-top' },
        h('a', { class: 'icon-btn', href: '#/iverbs', title: 'Завершить', 'aria-label': 'Завершить' }, icon('x')),
        h('div', { class: 'bar thin iv-run-bar' }, bar), counter),
      h('div', { class: 'iv-run-title muted small' }, opts.title),
      stage, foot));

    function onKey(e) { if (keyHandler && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.altKey) keyHandler(e); }
    document.addEventListener('keydown', onKey);
    function focusLater(el) { setTimeout(function () { try { el.focus({ preventScroll: true }); } catch (e) { /* нет фокуса */ } }, 30); }

    function next() {
      keyHandler = null;
      foot.replaceChildren();
      if (pos >= queue.length) return finish();
      bar.style.width = Math.round(pos / queue.length * 100) + '%';
      counter.textContent = (pos + 1) + ' / ' + queue.length;
      var ex = queue[pos];
      var body = ex.kind === 'intro' ? introView(ex) : ex.kind === 'type' ? typeView(ex) : choiceView(ex);
      stage.replaceChildren(h('div', { class: 'card iv-card enter' },
        h('div', { class: 'ex-label' }, LABEL[ex.kind], ex.retry ? h('span', { class: 'iv-again' }, 'ещё раз') : null),
        body));
    }
    function go() { pos++; next(); }

    function introView(ex) {
      var g = D().groupsById[ex.group];
      var btn = h('button', { class: 'btn primary', type: 'button', onclick: go }, 'Понятно, к заданиям', icon('arrow'));
      keyHandler = function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } };
      focusLater(btn);
      return [
        h('h2', { class: 'iv-intro-title' }, g.title, h('span', { class: 'iv-pattern' }, g.pattern)),
        h('p', { class: 'iv-intro-rule' }, g.rule),
        h('p', { class: 'muted small' }, 'Произнесите вслух каждую тройку ритмом — так формы запоминаются быстрее. Сегодня учим выделенные.'),
        h('div', { class: 'iv-intro-list' }, g.verbs.map(function (v) {
          var now = ex.today.indexOf(v.id) >= 0;
          return h('div', { class: 'iv-intro-row' + (now ? ' now' : '') },
            h('span', { lang: 'en' }, h('strong', null, v.base), ' — ' + v.v2.join(' / ') + ' — ' + v.v3.join(' / ')),
            h('span', { class: 'muted small' }, v.ru), say(chant(v)));
        })),
        h('div', { class: 'iv-actions' }, btn)
      ];
    }

    function optionList(labels, onPick) {
      var btns = [];
      var box = h('div', { class: 'options en' }, labels.map(function (l, i) {
        var b = h('button', { class: 'option', type: 'button', onclick: function () { pick(i); } },
          h('span', { class: 'opt-key' }, String(i + 1)), h('span', { class: 'opt-text', lang: 'en' }, l));
        btns.push(b);
        return b;
      }));
      function pick(i) {
        if (btns[0].disabled) return;
        btns.forEach(function (b) { b.disabled = true; });
        onPick(i, btns);
      }
      keyHandler = function (e) { var n = parseInt(e.key, 10); if (n >= 1 && n <= btns.length) { e.preventDefault(); pick(n - 1); } };
      return box;
    }

    function choiceView(ex) {
      var v = ex.verb;
      var opts2 = shuffle(ex.options);
      var right = ex.options[0];
      var q;
      if (ex.kind === 'forms') {
        q = [h('p', { class: 'prompt' }, 'Какие у глагола вторая и третья формы?'),
          h('div', { class: 'iv-q' }, h('span', { lang: 'en' }, v.base), say(v.base)), h('p', { class: 'iv-q-ru' }, v.ru)];
      } else {
        var sentence = h('div', { class: 'iv-q iv-q-sent' }, mark(ex.text.replace(/\[[^\]]+\]/, '___')));
        q = [h('p', { class: 'prompt' }, 'Вставьте нужную форму глагола ', h('strong', { lang: 'en' }, v.base), ' (', v.ru, ')'), sentence];
        ex.sentenceEl = sentence;
      }
      var list = optionList(opts2, function (i, btns) {
        var r = opts2.indexOf(right);
        btns.forEach(function (b, j) {
          if (j === r) b.classList.add('correct');
          if (j === i && i !== r) b.classList.add('wrong');
        });
        if (ex.kind === 'gap') EG.ui.fill(ex.sentenceEl, mark(ex.text), say(plain(ex.text)));
        answered(ex, i === r, right);
      });
      return q.concat([list]);
    }

    function typeView(ex) {
      var v = ex.verb, done = false;
      function input(label) {
        return h('input', { type: 'text', class: 'input big iv-input', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', lang: 'en', 'aria-label': label, placeholder: label });
      }
      var i2 = input('Past Simple · V2'), i3 = input('Past Participle · V3');
      var hint = h('p', { class: 'muted small iv-hint' });
      function submit(giveUp) {
        if (done) return;
        if (!giveUp && (!i2.value.trim() || !i3.value.trim())) { hint.textContent = 'Заполните обе формы — или нажмите «Не помню».'; (i2.value.trim() ? i3 : i2).focus(); return; }
        done = true;
        var ok2 = !giveUp && accepts(i2.value, v.v2), ok3 = !giveUp && accepts(i3.value, v.v3);
        [[i2, ok2], [i3, ok3]].forEach(function (p) { p[0].disabled = true; p[0].classList.add(p[1] ? 'iv-ok' : 'iv-bad'); });
        answered(ex, ok2 && ok3, v.v2.join(' / ') + ' — ' + v.v3.join(' / '));
      }
      keyHandler = function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        if (document.activeElement === i2 && !i3.value.trim()) i3.focus(); else submit(false);
      };
      focusLater(i2);
      return [
        h('p', { class: 'prompt' }, 'Напишите вторую и третью формы'),
        h('div', { class: 'iv-q' }, h('span', { lang: 'en' }, v.base), say(v.base)),
        h('p', { class: 'iv-q-ru' }, v.ru),
        h('div', { class: 'iv-inputs' }, i2, i3), hint,
        h('div', { class: 'iv-actions' },
          h('button', { class: 'btn primary', type: 'button', onclick: function () { submit(false); } }, 'Проверить'),
          h('button', { class: 'btn ghost', type: 'button', onclick: function () { submit(true); } }, 'Не помню'))
      ];
    }

    function answered(ex, ok, right) {
      keyHandler = null;
      var v = ex.verb, g = D().groupsById[v.group];
      if (!ex.retry && ok) firstOk++;
      if (!ok) missed[v.id] = true;
      if (opts.onAnswer) { try { opts.onAnswer(ex, ok); } catch (e) { console.error(e); } }
      if (!ok && !ex.retry) queue.push(Object.assign({}, ex.kind === 'gap' ? gapExercise(v) : ex, { retry: true }));
      var tone = ok ? 'good' : 'bad';
      var btn = h('button', { class: 'btn primary block', type: 'button', onclick: go }, pos + 1 >= queue.length ? 'Завершить' : 'Дальше', icon('arrow'));
      foot.replaceChildren(h('div', { class: 'feedback ' + tone },
        h('div', { class: 'fb-head' }, h('span', { class: 'fb-verdict ' + tone }, icon(ok ? 'check' : 'bulb'), ok ? (ex.retry ? 'Теперь верно!' : 'Верно!') : 'Не совсем')),
        !ok ? h('p', { class: 'fb-answer' }, h('span', { class: 'muted' }, 'Правильно: '), h('strong', { lang: 'en' }, right)) : null,
        h('div', { class: 'iv-triple' }, h('span', { lang: 'en' }, triple(v)), say(chant(v)), h('span', { class: 'muted small' }, v.ru)),
        h('p', { class: 'iv-fb-group' }, h('span', { class: 'iv-tag' }, g.pattern), g.title + ': ', h('span', { lang: 'en' }, g.ex)),
        ex.kind === 'gap' ? h('p', { class: 'muted small' }, ex.slot === 'V2' ? 'Прошлое событие → V2 (Past Simple).' : 'После have / has / been → V3 (Past Participle).') : null,
        !ok && !ex.retry ? h('p', { class: 'muted small' }, 'Скажите вслух «' + chant(v).replace(/, /g, ' — ') + '» — глагол вернётся в конце.') : null
      ), btn);
      keyHandler = function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } };
      focusLater(btn);
      if (EG.ui.scrollToEnd) EG.ui.scrollToEnd(foot);
    }

    function finish() {
      keyHandler = null;
      bar.style.width = '100%';
      counter.textContent = '';
      var pct = firstTotal ? Math.round(firstOk / firstTotal * 100) : 100;
      var mood = pct === 100 ? 'Отлично — всё с первого раза!' : pct >= 70 ? 'Хорошо! Ошибочные глаголы вернутся завтра.' : 'Формы ещё «укладываются» — это нормально. Завтра повторим, и станет легче.';
      var weak = Object.keys(missed);
      stage.replaceChildren(h('div', { class: 'card iv-card iv-finish enter' },
        h('h2', null, opts.finishTitle || 'Готово!'),
        h('p', { class: 'iv-finish-score' }, h('strong', null, firstOk + ' из ' + firstTotal), ' с первого раза'),
        h('p', { class: 'muted' }, mood),
        weak.length ? h('div', { class: 'iv-weak' }, h('p', { class: 'muted small' }, 'Повторите вслух:'),
          weak.map(function (id) { var v = D().byId[id]; return h('div', { class: 'iv-weak-row', lang: 'en' }, triple(v), say(chant(v))); })) : null,
        h('div', { class: 'iv-actions iv-center' }, opts.actions.map(function (a) {
          // «Ещё раз» ведёт на текущий адрес — hashchange не сработает, поэтому перерисовываем сами
          return h('a', { class: 'btn' + (a.primary ? ' primary' : ' ghost'), href: a.href, onclick: function (e) {
            if (location.hash === a.href) { e.preventDefault(); EG.router.refresh(); }
          } }, a.label);
        }))));
      foot.replaceChildren();
      if (opts.onFinish) { try { opts.onFinish(); } catch (e) { console.error(e); } }
    }

    next();
    return function () { document.removeEventListener('keydown', onKey); };
  }

  /* ================= экраны ================= */

  var root = null;

  function back() { return h('a', { class: 'back-link', href: '#/iverbs' }, icon('back'), 'Неправильные глаголы сегодня'); }

  function session(verbs, opts) {
    var box = h('div', { class: 'iv' });
    root.append(box);
    var graded = {};
    return run(box, build(verbs), Object.assign({
      // в одной сессии глагол оценивается только по первому ответу
      onAnswer: function (ex, ok) { if (!graded[ex.verb.id]) { graded[ex.verb.id] = true; grade(ex.verb, ok); } },
      onFinish: function () { var d = store.day(dateKey(Date.now())); d.sessions++; store.putDay(d); }
    }, opts));
  }

  function startToday() {
    var p = planToday();
    var verbs = p.due.concat(p.fresh);
    if (!verbs.length) {
      root.append(back(), EG.ui.empty('check', 'На сегодня всё!', 'Повторений больше нет, а лимит новых глаголов на сегодня пройден.',
        h('a', { class: 'btn primary', href: '#/iverbs/extra' }, 'Дополнительная тренировка')));
      return null;
    }
    return session(verbs, {
      title: 'Неправильные глаголы сегодня', finishTitle: 'Сессия на сегодня пройдена!',
      actions: [{ label: 'К плану', href: '#/iverbs', primary: true }, { label: 'Ещё ' + EXTRA_SIZE + ' глаголов', href: '#/iverbs/extra' }]
    });
  }

  function startExtra() {
    var seen = D().verbs.filter(function (v) { return store.item(v.id); }).sort(function (a, b) {
      var ra = store.item(a.id), rb = store.item(b.id);
      return ra.box - rb.box || ra.lastTs - rb.lastTs;
    }).slice(0, EXTRA_SIZE);
    if (!seen.length) {
      root.append(back(), EG.ui.empty('help', 'Сначала основная сессия', 'Дополнительная тренировка повторяет уже знакомые глаголы.',
        h('a', { class: 'btn primary', href: '#/iverbs/start' }, 'Начать')));
      return null;
    }
    return session(seen, {
      title: 'Дополнительная тренировка · самые слабые глаголы',
      actions: [{ label: 'К плану', href: '#/iverbs', primary: true }, { label: 'Ещё раз', href: '#/iverbs/extra' }]
    });
  }

  function startGroup(g) {
    var due = dueVerbs(g.id);
    var fresh = pickNew(GROUP_SIZE, g.id);
    var known = g.verbs.filter(function (v) { return store.item(v.id) && due.indexOf(v) < 0; })
      .sort(function (a, b) { return store.item(a.id).box - store.item(b.id).box; });
    return session(due.concat(fresh, known).slice(0, GROUP_SIZE), {
      title: g.title + ' · тренировка группы',
      actions: [{ label: 'К плану', href: '#/iverbs', primary: true }, { label: 'Ещё раз', href: '#/iverbs/group/' + g.id }]
    });
  }

  function overview() {
    var p = planToday();
    var today = store.day(dateKey(Date.now()));
    var total = D().verbs.length;
    var learnedN = D().verbs.filter(learned).length;
    var n = p.due.length + p.fresh.length;

    var plan = h('section', { class: 'card hero plan iv-plan' },
      h('div', { class: 'hero-text' },
        h('h2', null, 'План на сегодня'),
        h('ul', { class: 'plan-list' },
          h('li', null, icon('review'), h('span', null, h('strong', null, p.due.length), ' глаголов на повторение')),
          h('li', null, icon('star'), h('span', null, h('strong', null, p.fresh.length), ' новых', p.fresh.length ? [': ', h('span', { lang: 'en' }, p.fresh.map(function (v) { return v.base; }).join(', '))] : null)),
          h('li', null, icon('bolt'), h('span', null, 'Узнать → вставить в фразу → написать самому'))),
        today.answers ? h('p', { class: 'muted small iv-today' }, 'Сегодня: ' + today.answers + ' ответов, верно ' + today.correct) : null,
        n ? h('div', { class: 'iv-actions' }, h('a', { class: 'btn primary', href: '#/iverbs/start' }, 'Начать', icon('arrow')), h('span', { class: 'muted small' }, '≈ ' + Math.max(2, Math.round(n / 4)) + ' мин'))
          : h('div', null, h('p', { class: 'muted' }, 'На сегодня всё повторено, лимит новых глаголов пройден. Завтра будут новые повторения.'),
              h('a', { class: 'btn', href: '#/iverbs/extra' }, 'Дополнительная тренировка'))));

    var method = h('section', { class: 'card iv-method' },
      h('h3', { class: 'card-title' }, 'Почему это работает быстро'),
      h('div', { class: 'iv-method-grid' },
        [['🎵', 'Группами по звучанию', 'sing — sang — sung, ring — rang — rung: одно правило — несколько глаголов.'],
         ['★', 'Сначала частые', 'Первые 30 глаголов закрывают большую часть речи.'],
         ['✍️', 'Вспоминать, а не перечитывать', 'Сначала узнаёте, потом вставляете в фразу, потом пишете сами.'],
         ['📅', 'Повторение по расписанию', 'Глагол возвращается через 1, 3, 7, 16 дней — как раз перед тем, как забудется.']].map(function (m) {
          return h('div', { class: 'iv-method-item' }, h('span', { class: 'iv-method-ic' }, m[0]), h('div', null, h('strong', null, m[1]), h('p', { class: 'muted small' }, m[2])));
        })));

    var groups = h('section', { class: 'card' },
      h('div', { class: 'iv-progress-head' },
        h('h3', { class: 'card-title' }, 'Группы'),
        EG.views.irregular ? h('a', { class: 'link-btn', href: '#/irregular' }, 'Таблица глаголов →') : null),
      h('p', { class: 'muted small' }, 'Выучено ' + learnedN + ' из ' + total + '. Нажмите на группу, чтобы потренировать её отдельно.'),
      h('div', { class: 'bar good' }, h('span', { style: { width: Math.round(learnedN / total * 100) + '%' } })),
      h('div', { class: 'iv-groups' }, D().groups.map(function (g) {
        var l = g.verbs.filter(learned).length, s = g.verbs.filter(function (v) { return store.item(v.id); }).length;
        return h('a', { class: 'iv-g', href: '#/iverbs/group/' + g.id },
          h('div', { class: 'iv-g-main' }, h('strong', null, g.title), h('span', { class: 'muted small', lang: 'en' }, g.ex)),
          h('span', { class: 'iv-st' + (l === g.verbs.length ? ' done' : s ? ' learning' : '') }, l === g.verbs.length ? 'выучено' : s ? l + ' / ' + g.verbs.length : 'новая'),
          h('div', { class: 'iv-g-bar' }, h('span', { style: { width: Math.round(l / g.verbs.length * 100) + '%' } })));
      })));

    root.append(
      EG.ui.pageHead('Неправильные глаголы сегодня', 'Каждый день 5 минут: новые глаголы группами и повторение тех, что пора вспомнить.'),
      store.persistent ? null : h('p', { class: 'iv-note' }, icon('mistakes'), 'Прогресс сейчас не сохраняется (хранилище браузера недоступно) — он пропадёт после перезагрузки.'),
      plan, method, groups,
      h('div', { class: 'iv-footer' },
        h('p', { class: 'muted small' }, 'Прогресс раздела хранится отдельно и не влияет на другие разделы.'),
        h('button', { class: 'btn ghost sm', type: 'button', onclick: reset }, icon('trash'), 'Сбросить прогресс')));
    return null;
  }

  function reset() {
    EG.ui.confirm('Сбросить прогресс?', 'Все глаголы раздела «Неправильные глаголы сегодня» начнутся заново. Другие разделы не затрагиваются.', 'Сбросить', true)
      .then(function (yes) { if (yes) return store.clear().then(function () { EG.router.refresh(); }); });
  }

  function render(params) {
    root.replaceChildren();
    if (!D() || !D().verbs || !D().verbs.length) {
      root.append(EG.ui.empty('help', 'Раздел недоступен', 'Не удалось загрузить материалы раздела.'));
      return null;
    }
    var p = params || [];
    if (p[0] === 'start') return startToday();
    if (p[0] === 'extra') return startExtra();
    if (p[0] === 'group') {
      var g = D().groupsById[p[1]];
      if (g) return startGroup(g);
      root.append(EG.ui.empty('help', 'Группа не найдена', 'Возможно, ссылка устарела.', h('a', { class: 'btn', href: '#/iverbs' }, 'К плану')));
      return null;
    }
    return overview();
  }

  EG.views.iverbs = function (el, params) {
    root = el;
    return store.load().then(function () { return render(params); }, function () { return render(params); });
  };

  // для проверки в Node (tools/iverbs-check.js) и отладки
  IR.logic = { store: store, planToday: planToday, pickNew: pickNew, grade: grade, build: build,
    formsOptions: formsOptions, gapExercise: gapExercise, regular: regular, accepts: accepts };
})(window.EG = window.EG || {});
