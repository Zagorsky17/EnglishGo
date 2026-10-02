/* grammar/grammar.js — раздел «Грамматика»: собственное хранилище прогресса, рекомендации и экраны.
   Изоляция: прогресс лежит в отдельной базе IndexedDB «englishgo-grammar» (хранилище grammarProgress) —
   база приложения, SRS, XP, ошибки и статистика не затрагиваются. Из ядра используется только чтение:
   EG.ui (DOM-хелперы), EG.instance.active (не писать из неактивной вкладки), EG.text.normalize.
   Маршруты: #/grammar · #/grammar/t/:id · #/grammar/practice/:id · #/grammar/quick[/:id] · #/grammar/mix */
(function (EG) {
  'use strict';

  var G = EG.grammar = EG.grammar || {};
  EG.views = EG.views || {};
  var h = EG.ui.h, icon = EG.ui.icon;

  var PRACTICE_SIZE = 5;   // задания в практике по теме — коротко, без перегрузки
  var QUICK_SIZE = 3;      // «Грамматика за 5 минут»
  var MIX_SIZE = 8;        // смешанная практика по пройденным темам
  var MASTERED = 80;       // освоение темы, %
  var REVIEW_DAYS = 7;     // освоенную тему предлагаем освежить через неделю
  var DAY = 86400000;

  /* ================= хранилище (отдельная база) ================= */

  var DB_NAME = 'englishgo-grammar', STORE = 'grammarProgress';

  var store = (function () {
    var db = null, opening = null, failed = false;
    var map = new Map();

    function open() {
      if (db || failed) return Promise.resolve(db);
      if (opening) return opening;
      opening = new Promise(function (resolve) {
        var req;
        try { req = window.indexedDB ? window.indexedDB.open(DB_NAME, 1) : null; } catch (e) { req = null; }
        if (!req) { failed = true; resolve(null); return; }
        req.onupgradeneeded = function () {
          if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE, { keyPath: 'id' });
        };
        req.onsuccess = function () {
          db = req.result;
          // другая вкладка обновила схему — просто закрываемся, данные останутся в памяти
          db.onversionchange = function () { try { db.close(); } catch (e) { /* уже закрыта */ } db = null; };
          resolve(db);
        };
        req.onerror = function () { failed = true; resolve(null); };
        req.onblocked = function () { failed = true; resolve(null); };
      }).then(function (d) { opening = null; return d; });
      return opening;
    }

    // запись из любой версии (или повреждённая) приводится к ожидаемому виду
    function clean(r) {
      var m = r && r.mistakes && typeof r.mistakes === 'object' ? r.mistakes : {};
      var mistakes = {};
      Object.keys(m).forEach(function (k) { var n = Number(m[k]) || 0; if (n > 0) mistakes[k] = n; });
      return {
        id: String(r.id), seen: Number(r.seen) || 0, quick: Number(r.quick) || 0,
        attempts: Number(r.attempts) || 0, correct: Number(r.correct) || 0,
        recent: Array.isArray(r.recent) ? r.recent.map(function (x) { return x ? 1 : 0; }).slice(-10) : [],
        mistakes: mistakes, lastTs: Number(r.lastTs) || 0
      };
    }

    /** Перечитать всё из базы (вызывается при каждом входе в раздел — другая вкладка могла писать). */
    function load() {
      return open().then(function (d) {
        if (!d) return map;
        return new Promise(function (resolve) {
          try {
            var req = d.transaction(STORE, 'readonly').objectStore(STORE).getAll();
            req.onsuccess = function () {
              map = new Map();
              (req.result || []).forEach(function (r) { if (r && r.id) map.set(String(r.id), clean(r)); });
              resolve(map);
            };
            req.onerror = function () { resolve(map); };
          } catch (e) { resolve(map); }
        });
      });
    }

    function canWrite() { return !(EG.instance && EG.instance.active === false); }

    function put(rec) {
      map.set(rec.id, rec);
      if (!db || !canWrite()) return;
      try { db.transaction(STORE, 'readwrite').objectStore(STORE).put(rec); } catch (e) { console.error('[grammar]', e); }
    }

    function get(id) { return map.get(id) || null; }
    function ensure(id) { return map.get(id) || clean({ id: id }); }

    function clear() {
      map = new Map();
      if (!db || !canWrite()) return Promise.resolve();
      return new Promise(function (resolve) {
        try {
          var tx = db.transaction(STORE, 'readwrite');
          tx.objectStore(STORE).clear();
          tx.oncomplete = tx.onerror = function () { resolve(); };
        } catch (e) { resolve(); }
      });
    }

    return {
      load: load, get: get, ensure: ensure, put: put, clear: clear,
      get persistent() { return !!db; }
    };
  })();

  /* ================= прогресс ================= */

  function topics() { return (G.data && G.data.topics || []).filter(function (t) { return !t.link; }); }
  function topic(id) { var t = G.data && G.data.byId[id]; return t && !t.link ? t : null; }

  /** Освоение темы 0–100: точность последних ответов с учётом их количества. */
  function mastery(rec) {
    if (!rec || !rec.attempts || !rec.recent.length) return 0;
    var acc = rec.recent.reduce(function (s, x) { return s + x; }, 0) / rec.recent.length;
    return Math.round(acc * Math.min(1, rec.attempts / 8) * 100);
  }

  function status(rec) {
    var m = mastery(rec);
    if (!rec || (!rec.seen && !rec.attempts && !rec.quick)) return { key: 'new', label: 'новая' };
    if (!rec.attempts) return { key: 'seen', label: 'прочитано' };
    if (m >= MASTERED) return { key: 'done', label: 'освоено' };
    return { key: 'learning', label: 'учу · ' + m + '%' };
  }

  function mistakeCount(rec) {
    if (!rec) return 0;
    return Object.keys(rec.mistakes).reduce(function (s, k) { return s + rec.mistakes[k]; }, 0);
  }

  function record(ex, ok) {
    var rec = store.ensure(ex.topic);
    rec.attempts++;
    if (ok) rec.correct++;
    rec.recent = rec.recent.concat([ok ? 1 : 0]).slice(-10);
    if (!ok) rec.mistakes[ex.key] = (rec.mistakes[ex.key] || 0) + 1;
    else if (rec.mistakes[ex.key]) { if (--rec.mistakes[ex.key] <= 0) delete rec.mistakes[ex.key]; }
    rec.lastTs = Date.now();
    store.put(rec);
  }

  function markSeen(id, field) {
    var rec = store.ensure(id);
    if (!rec[field]) rec[field] = Date.now();
    store.put(rec);
  }

  /** «Что мне учить дальше?» — по ошибкам этого раздела, затем повтор, затем следующая тема. */
  function recommend() {
    var all = topics();
    if (!all.length) return null;
    var now = Date.now();
    var best = null;
    all.forEach(function (t) {
      var rec = store.get(t.id);
      if (!rec || !rec.attempts) return;
      var recentErr = rec.recent.filter(function (x) { return !x; }).length;
      var errs = recentErr + mistakeCount(rec);
      if (recentErr >= 2 && (!best || errs > best.errs)) best = { topic: t, errs: errs };
    });
    if (best) return { topic: best.topic, kind: 'mistakes', reason: 'В последних заданиях по этой теме были ошибки — разберите её ещё раз, это займёт пару минут.' };

    var due = all.filter(function (t) {
      var rec = store.get(t.id);
      return rec && mastery(rec) >= MASTERED && now - rec.lastTs > REVIEW_DAYS * DAY;
    }).sort(function (a, b) { return store.get(a.id).lastTs - store.get(b.id).lastTs; })[0];
    if (due) return { topic: due, kind: 'review', reason: 'Тема освоена, но вы давно её не повторяли. Короткое повторение закрепит её надолго.' };

    var seen = all.filter(function (t) { var r = store.get(t.id); return r && (r.seen || r.quick) && !r.attempts; })[0];
    if (seen) return { topic: seen, kind: 'practice', reason: 'Урок прочитан, но практики ещё не было. Пять коротких заданий — и тема запомнится.' };

    var weak = all.filter(function (t) { var r = store.get(t.id); return r && r.attempts && mastery(r) < MASTERED; })
      .sort(function (a, b) { return mastery(store.get(a.id)) - mastery(store.get(b.id)); })[0];
    if (weak) return { topic: weak, kind: 'practice', reason: 'Тема ещё не освоена (' + mastery(store.get(weak.id)) + '%). Немного практики — и она будет вашей.' };

    var order = (G.data.curriculum || []).map(topic).filter(Boolean);
    var next = order.filter(function (t) { return !store.get(t.id); })[0] || all.filter(function (t) { return !store.get(t.id); })[0];
    if (next) return { topic: next, kind: 'new', reason: 'Следующая тема по порядку — от самого частого и простого к более сложному.' };

    return { topic: null, kind: 'all', reason: 'Все темы пройдены. Смешанная практика поможет держать их в форме.' };
  }

  /* ================= подбор заданий ================= */

  function interleave(list) {
    // соседние задания — разного типа: так мозг не «залипает» на одном шаблоне
    var out = [], rest = list.slice();
    while (rest.length) {
      var prev = out[out.length - 1];
      var i = rest.findIndex(function (x) { return !prev || x.type !== prev.type; });
      out.push(rest.splice(i < 0 ? 0 : i, 1)[0]);
    }
    return out;
  }

  function practiceFor(t, n) {
    var rec = store.get(t.id);
    var all = G.ui.shuffle(t.practice || []);
    var wrong = rec ? all.filter(function (ex) { return rec.mistakes[ex.key]; }) : [];
    var rest = all.filter(function (ex) { return wrong.indexOf(ex) < 0; });
    // задания с прошлыми ошибками — первыми (так обещает урок), остальные после
    wrong = wrong.slice(0, n);
    return interleave(wrong).concat(interleave(rest.slice(0, n - wrong.length)));
  }

  function mixItems() {
    var pool = topics().filter(function (t) { var r = store.get(t.id); return r && (r.attempts || r.seen || r.quick); });
    if (!pool.length) return [];
    var wrong = [], weighted = [];
    pool.forEach(function (t) {
      var rec = store.get(t.id);
      (t.practice || []).forEach(function (ex) {
        if (rec.mistakes[ex.key]) wrong.push(ex);
        // слабые темы встречаются чаще
        var w = 1 + Math.round((100 - mastery(rec)) / 34);
        for (var i = 0; i < w; i++) weighted.push(ex);
      });
    });
    var picked = G.ui.shuffle(wrong).slice(0, 3);
    var sh = G.ui.shuffle(weighted);
    for (var i = 0; i < sh.length && picked.length < MIX_SIZE; i++) if (picked.indexOf(sh[i]) < 0) picked.push(sh[i]);
    return interleave(G.ui.shuffle(picked));
  }

  /* ================= экраны ================= */

  var root = null;

  function back(href, label) {
    return h('a', { class: 'gr-back', href: href || '#/grammar' }, icon('back'), label || 'Грамматика');
  }

  function badge(rec) {
    var st = status(rec);
    return h('span', { class: 'gr-st gr-st-' + st.key }, st.label);
  }

  function topicCard(t) {
    if (t.link) {
      var target = topic(t.link);
      return h('a', { class: 'gr-topic gr-topic-link', href: '#/grammar/t/' + t.link },
        h('span', { class: 'gr-topic-main' }, h('strong', { lang: 'en' }, t.title), h('span', { class: 'muted small' }, t.ru)),
        target ? badge(store.get(target.id)) : null);
    }
    var rec = store.get(t.id);
    var m = mastery(rec);
    return h('a', { class: 'gr-topic', href: '#/grammar/t/' + t.id },
      h('span', { class: 'gr-topic-main' },
        h('strong', { lang: 'en' }, t.title),
        h('span', { class: 'muted small' }, t.ru)),
      h('span', { class: 'gr-topic-side' }, h('span', { class: 'gr-lvl' }, t.level), badge(rec)),
      h('span', { class: 'gr-topic-bar' }, h('span', { style: { width: m + '%' } })));
  }

  function nextCard() {
    var r = recommend();
    if (!r) return null;
    var t = r.topic;
    return h('section', { class: 'card gr-next' },
      h('div', { class: 'gr-next-head' }, h('span', { class: 'gr-next-ic' }, '🧭'), h('h2', null, 'Что мне учить дальше?')),
      t ? h('div', { class: 'gr-next-topic' }, h('strong', { lang: 'en' }, t.title), h('span', { class: 'muted' }, ' — ' + t.ru)) : null,
      h('p', { class: 'muted' }, r.reason),
      h('div', { class: 'row gap wrap gr-actions' },
        t && (r.kind === 'mistakes' || r.kind === 'practice')
          ? h('a', { class: 'btn primary', href: '#/grammar/practice/' + t.id }, 'Практика · ' + PRACTICE_SIZE + ' заданий')
          : t ? h('a', { class: 'btn primary', href: '#/grammar/t/' + t.id }, 'Открыть урок') : h('a', { class: 'btn primary', href: '#/grammar/mix' }, 'Смешанная практика'),
        t ? h('a', { class: 'btn ghost', href: r.kind === 'new' ? '#/grammar/quick/' + t.id : '#/grammar/t/' + t.id }, r.kind === 'new' ? 'За 5 минут' : 'Урок') : null));
  }

  function overview() {
    var list = topics();
    var done = list.filter(function (t) { return mastery(store.get(t.id)) >= MASTERED; }).length;
    var started = list.filter(function (t) { return store.get(t.id); }).length;
    var pct = list.length ? Math.round(done / list.length * 100) : 0;

    root.append(
      EG.ui.pageHead('Грамматика', 'Коротко и по делу: что значит конструкция, как узнать её в речи и как сказать самому.'),
      store.persistent ? null : h('p', { class: 'gr-note' }, icon('mistakes'), 'Прогресс грамматики сейчас не сохраняется (хранилище браузера недоступно) — он пропадёт после перезагрузки.'),
      nextCard(),
      h('div', { class: 'gr-tiles' },
        h('a', { class: 'gr-tile', href: '#/grammar/quick' },
          h('span', { class: 'gr-tile-ic' }, '⚡'), h('strong', null, 'Грамматика за 5 минут'),
          h('span', { class: 'muted small' }, 'Суть, формула, три примера и три вопроса')),
        h('a', { class: 'gr-tile' + (started ? '' : ' gr-tile-off'), href: '#/grammar/mix' },
          h('span', { class: 'gr-tile-ic' }, '🔀'), h('strong', null, 'Смешанная практика'),
          h('span', { class: 'muted small' }, started ? MIX_SIZE + ' заданий вперемешку из начатых тем' : 'Откроется после первой темы'))),
      h('div', { class: 'gr-progress' },
        h('div', { class: 'row between' }, h('strong', null, 'Освоено тем: ' + done + ' из ' + list.length), h('span', { class: 'muted small' }, 'начато: ' + started)),
        EG.ui.bar(pct, 'good')),
      G.data.groups.map(function (g) {
        var items = G.data.topics.filter(function (t) { return t.group === g.id; });
        return h('section', { class: 'gr-group' },
          h('h2', { class: 'section-title' }, h('span', null, g.emoji), g.title),
          h('p', { class: 'muted small gr-group-sub' }, g.sub),
          h('div', { class: 'gr-grid' }, items.map(topicCard)));
      }),
      h('div', { class: 'gr-footer' },
        h('p', { class: 'muted small' }, 'Прогресс грамматики хранится отдельно и не влияет на слова, повторение и XP.'),
        started ? h('button', { class: 'btn ghost sm', type: 'button', onclick: function () {
          EG.ui.confirm('Сбросить прогресс грамматики?', 'Будут удалены только результаты раздела «Грамматика». Остальной прогресс не изменится.', 'Сбросить', true)
            .then(function (ok) { if (ok) store.clear().then(function () { EG.ui.toast('Прогресс грамматики сброшен'); render([]); }); });
        } }, 'Сбросить прогресс грамматики') : null));
  }

  function lesson(t) {
    markSeen(t.id, 'seen');
    var rec = store.get(t.id);
    var U = G.ui;
    var blocks = [];

    if (t.key) blocks.push(h('section', { class: 'card gr-core' },
      h('div', { class: 'gr-label' }, 'Суть'),
      h('p', { class: 'gr-core-text' }, t.core),
      h('div', { class: 'gr-key-ex' }, U.example(t.key))));
    else blocks.push(h('section', { class: 'card gr-core' }, h('div', { class: 'gr-label' }, 'Суть'), h('p', { class: 'gr-core-text' }, t.core)));

    if (t.sides) {
      blocks.push(h('section', { class: 'card' }, h('div', { class: 'gr-label' }, 'Сравните'),
        h('div', { class: 'gr-sides' }, t.sides.map(function (s) {
          return h('div', { class: 'gr-side' },
            h('div', { class: 'gr-vs-name', lang: 'en' }, s.name),
            h('div', { class: 'gr-side-means' }, s.means),
            U.example(s.ex));
        }))));
    }
    if (t.formula) blocks.push(h('section', { class: 'card' }, h('div', { class: 'gr-label' }, 'Формула'), U.formula(t.formula)));
    if (t.signals) blocks.push(h('section', { class: 'card' }, h('div', { class: 'gr-label' }, t.sides ? 'Как различить' : 'Как распознать'),
      h('div', { class: 'gr-signals' }, t.signals.map(function (s) { return h('span', { class: 'gr-signal' }, s); }))));
    if (t.examples) blocks.push(h('section', { class: 'card' }, h('div', { class: 'gr-label' }, 'Реальные примеры'),
      h('div', { class: 'gr-examples' }, t.examples.map(U.example))));
    if (t.vs) {
      var linked = t.vs.link && topic(t.vs.link);
      blocks.push(h('section', { class: 'card gr-vs-card' }, h('div', { class: 'gr-label' }, 'Не путай'),
        U.versus(t.vs.a, t.vs.b), t.vs.text ? h('p', { class: 'gr-vs-text' }, t.vs.text) : null,
        linked ? h('a', { class: 'link-btn', href: '#/grammar/t/' + linked.id }, 'Подробнее: ' + linked.title, icon('arrow')) : null));
    }

    // подробности свёрнуты — экран не перегружен
    var more = [];
    if (t.when) more.push(U.fold('Когда используется', U.bulletList(t.when)));
    if (t.talk) more.push(U.fold('Так говорят в жизни', h('div', { class: 'gr-examples' }, t.talk.map(U.example))));
    if (t.mistakes) more.push(U.fold('Типичные ошибки', U.mistakesList(t.mistakes)));
    if (more.length) blocks.push(h('section', { class: 'gr-folds' }, more));

    var hasWrong = rec && Object.keys(rec.mistakes).some(function (k) { return k.indexOf(t.id + ':') === 0; });
    root.append(h('div', { class: 'gr gr-lesson' },
      back(),
      h('header', { class: 'gr-lesson-head' },
        h('div', null, h('h1', { lang: 'en' }, t.title), h('p', { class: 'muted' }, t.ru)),
        h('div', { class: 'gr-lesson-meta' }, h('span', { class: 'gr-lvl' }, t.level), badge(rec))),
      blocks,
      h('div', { class: 'gr-cta' },
        hasWrong ? h('p', { class: 'muted small' }, 'В прошлый раз были ошибки — практика начнётся с них.') : null,
        h('div', { class: 'row gap wrap' },
          h('a', { class: 'btn primary', href: '#/grammar/practice/' + t.id }, 'Быстрая практика · ' + Math.min(PRACTICE_SIZE, (t.practice || []).length) + ' заданий', icon('arrow')),
          h('a', { class: 'btn ghost', href: '#/grammar/quick/' + t.id }, 'Кратко за 5 минут')))));
  }

  function quickPicker() {
    root.append(h('div', { class: 'gr' },
      back(),
      EG.ui.pageHead('Грамматика за 5 минут', 'Выберите тему: самое главное на одном экране и три вопроса для проверки.'),
      G.data.groups.map(function (g) {
        return h('section', { class: 'gr-group' },
          h('h2', { class: 'section-title' }, h('span', null, g.emoji), g.title),
          h('div', { class: 'gr-chips' }, topics().filter(function (t) { return t.group === g.id; }).map(function (t) {
            return h('a', { class: 'gr-chip', href: '#/grammar/quick/' + t.id, lang: 'en' }, t.title);
          })));
      })));
  }

  function quick(t) {
    var U = G.ui;
    var ex = (t.examples || []).slice(0, 3); // у «Не путай» примеры уже в двух колонках
    var box = h('div', { class: 'gr gr-quick' });
    root.append(box);
    box.append(back('#/grammar/quick', 'Все темы'),
      h('header', { class: 'gr-lesson-head' }, h('div', null, h('h1', { lang: 'en' }, t.title), h('p', { class: 'muted' }, t.ru)), h('span', { class: 'gr-lvl' }, t.level)),
      h('section', { class: 'card gr-core' },
        h('div', { class: 'gr-label' }, '⚡ Главное'),
        h('p', { class: 'gr-core-text' }, t.core),
        t.formula ? U.formula(t.formula) : null,
        t.sides ? U.versus(t.sides[0].ex, t.sides[1].ex, t.sides[0].name, t.sides[1].name) : null,
        h('div', { class: 'gr-examples' }, ex.map(U.example)),
        t.vs ? h('div', { class: 'gr-quick-vs' }, h('div', { class: 'gr-label' }, 'Не путай'), U.versus(t.vs.a, t.vs.b)) : null),
      h('div', { class: 'gr-cta' }, h('div', { class: 'row gap wrap' },
        h('button', { class: 'btn primary', type: 'button', onclick: start }, 'Проверить себя · ' + QUICK_SIZE + ' вопроса', icon('arrow')),
        h('a', { class: 'btn ghost', href: '#/grammar/t/' + t.id }, 'Полный урок'))));
    var cleanup = null;
    function start() {
      markSeen(t.id, 'quick');
      box.replaceChildren();
      cleanup = U.run(box, practiceFor(t, QUICK_SIZE), {
        title: t.title + ' · за 5 минут', exitHref: '#/grammar/t/' + t.id, onAnswer: record,
        finish: { title: 'Тема в голове!', actions: [
          { label: 'Полная практика', href: '#/grammar/practice/' + t.id, primary: true },
          { label: 'К грамматике', href: '#/grammar' }] }
      });
    }
    return function () { if (cleanup) cleanup(); };
  }

  function practice(t) {
    var box = h('div', { class: 'gr' });
    root.append(box);
    var items = practiceFor(t, PRACTICE_SIZE);
    if (!items.length) { box.append(back(), EG.ui.empty('help', 'Заданий пока нет', 'Для этой темы ещё нет упражнений.')); return null; }
    return G.ui.run(box, items, {
      title: t.title, exitHref: '#/grammar/t/' + t.id, onAnswer: record,
      finish: { actions: [
        { label: 'Что учить дальше', href: '#/grammar', primary: true },
        { label: 'Ещё раз', href: '#/grammar/t/' + t.id },
        { label: 'Смешанная практика', href: '#/grammar/mix' }] }
    });
  }

  function mix() {
    var box = h('div', { class: 'gr' });
    root.append(box);
    var items = mixItems();
    if (!items.length) {
      box.append(back(), EG.ui.empty('help', 'Сначала одна тема', 'Смешанная практика собирает задания из начатых тем. Откройте любой урок — и возвращайтесь.',
        h('a', { class: 'btn primary', href: '#/grammar' }, 'К темам')));
      return null;
    }
    return G.ui.run(box, items, {
      title: 'Смешанная практика', exitHref: '#/grammar', onAnswer: record,
      finish: { title: 'Отличная тренировка!', actions: [{ label: 'К грамматике', href: '#/grammar', primary: true }, { label: 'Ещё раз', href: '#/grammar/mix' }] }
    });
  }

  function notFound() {
    root.append(EG.ui.empty('help', 'Тема не найдена', 'Возможно, её переименовали.', h('a', { class: 'btn', href: '#/grammar' }, 'К грамматике')));
  }

  function render(params) {
    root.replaceChildren();
    if (!G.data || !G.data.topics || !G.data.topics.length) {
      root.append(EG.ui.empty('help', 'Грамматика недоступна', 'Не удалось загрузить материалы раздела.'));
      return null;
    }
    var p = params || [];
    var t = p[1] ? topic(p[1]) : null;
    if (p[0] === 't') return t ? lesson(t) : notFound();
    if (p[0] === 'practice') return t ? practice(t) : notFound();
    if (p[0] === 'quick') return p[1] ? (t ? quick(t) : notFound()) : quickPicker();
    if (p[0] === 'mix') return mix();
    return overview();
  }

  EG.views.grammar = function (el, params) {
    root = el;
    return store.load().then(function () { return render(params); }, function () { return render(params); });
  };

  // для проверки в Node (tools/grammar-check.js) и отладки
  G.logic = { mastery: mastery, status: status, recommend: recommend, practiceFor: practiceFor, mixItems: mixItems, store: store };
})(window.EG = window.EG || {});
