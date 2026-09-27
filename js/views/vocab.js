/* views/vocab.js — «Словарный запас»: курс слов по классам A1 → C1 (блоки по 20 слов),
   общее повторение и свободная тренировка. Шаги сессии: карточка нового слова, выбор перевода
   в обе стороны, написание по-английски, узнавание на слух. */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  var WT = function () { return EG.wordTrainer; };
  EG.views = EG.views || {};

  var LEARN_BATCH = 10; // новых слов за одно занятие блока

  var MODES = [
    { id: 'mix', emoji: '🔀', title: 'Выбор перевода', desc: 'Оба направления вперемешку — так слово запоминается крепче.' },
    { id: 'ru-en', emoji: '🇷🇺 → 🇬🇧', title: 'Русский → English', desc: 'Видите русское слово — выберите английское из 4 вариантов.' },
    { id: 'en-ru', emoji: '🇬🇧 → 🇷🇺', title: 'English → русский', desc: 'Видите английское слово — выберите правильный перевод.' },
    { id: 'type', emoji: '⌨️', title: 'Написание', desc: 'Видите перевод — напишите слово по-английски. Самый продуктивный режим.' },
    { id: 'listen', emoji: '🎧', title: 'На слух', desc: 'Слушаете слово — выбираете перевод. Нужен английский голос в системе.', speech: true }
  ];
  function modeById(id) { return MODES.filter(function (m) { return m.id === id; })[0] || MODES[0]; }

  var listFilter = { q: '', status: '' };
  var PAGE = 60;

  function statusBadge(id) {
    var st = WT().status(id), r = WT().rec(id);
    if (st === 'learned') return h('span', { class: 'badge st-mastered', title: 'Повтор ' + EG.ui.relDue(r.due) }, icon('check'), 'выучено');
    if (st === 'learning') return h('span', { class: 'badge st-learning', title: 'Повтор ' + EG.ui.relDue(r.due) }, 'изучается');
    return null;
  }

  function levelName(level) { return (EG.data.levelNames && EG.data.levelNames[level]) || ''; }
  function freeLabel(level) { return level || 'Мой уровень (до ' + EG.storage.get('level') + ')'; }
  function words(n) { return n + ' ' + EG.util.plural(n, 'слово', 'слова', 'слов'); }

  function wordRow(w, extra) {
    return h('div', { class: 'word vocab-row' + (WT().isLearned(w.id) ? ' learned' : '') },
      h('span', { class: 'word-main' },
        h('strong', { lang: 'en' }, w.en),
        h('span', { class: 'muted' }, w.ru + ' · ' + EG.data.wordPos[w.pos])),
      h('span', { class: 'word-meta' }, extra || statusBadge(w.id), EG.ui.speakBtn(w.en, true), EG.ui.levelBadge(w.level)));
  }

  function backLink(href, label) { return h('a', { class: 'back-link', href: href }, icon('back'), label); }

  /* ================= Обзор ================= */
  function overview(root) {
    var all = WT().counts();
    var due = WT().dueAll();
    var cls = WT().currentClass();
    var next = WT().currentUnit(cls);
    var today = WT().startedToday();

    var plan = h('section', { class: 'card vocab-plan' },
      h('div', { class: 'vocab-plan-text' },
        h('h3', { class: 'card-title' }, 'План на сегодня'),
        h('p', { class: 'muted' }, due.length
          ? 'Повторение: ' + words(due.length) + ' — начните с них, пока они не забылись.'
          : 'Повторять пока нечего — самое время для новых слов.'),
        h('p', { class: 'muted small' }, 'Новых слов начато сегодня: ' + today + '. ' +
          (today >= 20 ? 'Отличный темп — дальше лучше повторять.' : 'Оптимально 10–20 новых слов в день и ежедневное повторение.'))),
      h('div', { class: 'row gap wrap' },
        due.length ? h('a', { class: 'btn primary', href: '#/vocab/review' }, icon('review'), 'Повторить ' + words(Math.min(due.length, WT().REVIEW_SIZE))) : null,
        next ? h('a', { class: 'btn ' + (due.length ? 'ghost' : 'primary'), href: '#/vocab/learn/' + cls + '/' + next.n }, icon('plus'), 'Новые слова: ' + cls + ' · блок ' + next.n) : null));

    var classes = h('div', { class: 'class-grid' }, EG.LEVELS.map(function (level) {
      var c = WT().counts(level);
      var cur = WT().currentUnit(level);
      var seen = c.learned + c.learning;
      return h('a', { class: 'class-card' + (level === cls && cur ? ' current' : '') + (!cur ? ' done' : ''), href: '#/vocab/level/' + level },
        h('div', { class: 'row between' }, EG.ui.levelBadge(level),
          !cur ? h('span', { class: 'badge st-mastered' }, icon('check'), 'пройден')
            : level === cls ? h('span', { class: 'badge st-learning' }, 'вы здесь') : null),
        h('strong', null, levelName(level)),
        h('span', { class: 'muted small' }, c.total + ' слов · ' + WT().units(level).length + ' блоков'),
        EG.ui.bar(c.total ? seen / c.total * 100 : 0),
        h('span', { class: 'muted small' }, 'Пройдено ' + seen + ' · выучено ' + c.learned));
    }));

    root.append(
      EG.ui.pageHead('Словарный запас', all.total + ' слов от A1 до C1, разбитых на классы и блоки по 20. Новое слово: карточка → перевод в обе стороны → написание. Выученные (✓) слова возвращаются всё реже.'),
      h('section', { class: 'card vocab-summary' },
        EG.ui.ring(all.total ? all.learned / all.total * 100 : 0, (all.total ? Math.round(all.learned / all.total * 100) : 0) + '%', 'словаря'),
        h('div', { class: 'finish-nums' },
          h('div', null, h('strong', null, all.learned), h('span', null, 'выучено')),
          h('div', null, h('strong', null, all.learning), h('span', null, 'изучается')),
          h('div', null, h('strong', null, due.length), h('span', null, 'к повторению')),
          h('div', null, h('strong', null, all.fresh), h('span', null, 'ещё не встречались')))),
      plan,
      h('h2', { class: 'section-title' }, 'Классы'),
      classes,
      freeTraining(),
      wordList());
  }

  /* ---------- свободная тренировка ---------- */
  function freeTraining() {
    var level = EG.storage.get('wordLevel');
    var cur = WT().counts(level);
    var levelSeg = h('div', { class: 'segmented level-seg' }, [''].concat(EG.LEVELS).map(function (l) {
      var c = WT().counts(l);
      return h('button', { type: 'button', class: l === level ? 'active' : '', onclick: function () { EG.storage.set('wordLevel', l); EG.router.refresh(); } },
        l ? l : 'Мой уровень', h('span', { class: 'seg-sub' }, c.learned + '/' + c.total));
    }));
    var modes = h('div', { class: 'vocab-modes' }, MODES.filter(function (m) { return !m.speech || EG.ui.canSpeak(); }).map(function (m) {
      return h('a', { class: 'game-card vocab-mode' + (EG.storage.get('wordMode') === m.id ? ' last' : ''), href: '#/vocab/play/' + m.id,
        onclick: function () { EG.storage.set('wordMode', m.id); } },
        h('span', { class: 'vocab-mode-emoji' }, m.emoji),
        h('strong', null, m.title),
        h('span', { class: 'muted small' }, m.desc));
    }));
    return h('section', { class: 'card' },
      h('h3', { class: 'card-title' }, 'Свободная тренировка'),
      h('p', { class: 'muted small' }, 'Слова выбранного уровня вне блоков: сначала те, что пора повторить, затем новые. ' +
        freeLabel(level) + ': ' + cur.total + ' слов, выучено ' + cur.learned + '.'),
      levelSeg, modes);
  }

  /* ---------- список слов с отметками ---------- */
  var searchTimer = null;
  function wordList() {
    var listEl = h('div', { class: 'word-list' });
    var countEl = h('span', { class: 'muted small' });
    var search = h('input', { class: 'input', type: 'search', placeholder: 'Поиск по-английски или по-русски…', value: listFilter.q,
      oninput: function () { listFilter.q = search.value; clearTimeout(searchTimer); searchTimer = setTimeout(redraw, 150); } });
    var seg = h('div', { class: 'segmented' }, [['', 'Все'], ['learning', 'Изучаются'], ['learned', 'Выучены'], ['new', 'Новые']].map(function (o) {
      return h('button', { type: 'button', class: listFilter.status === o[0] ? 'active' : '', onclick: function (e) {
        listFilter.status = o[0];
        Array.prototype.forEach.call(seg.children, function (b) { b.classList.toggle('active', b === e.currentTarget); });
        redraw();
      } }, o[1]);
    }));

    var shown = PAGE;
    function draw() {
      var q = listFilter.q.trim().toLowerCase();
      var level = EG.storage.get('wordLevel');
      var items = (q ? EG.data.words : WT().poolFor(level)).filter(function (w) {
        if (listFilter.status && WT().status(w.id) !== listFilter.status) return false;
        if (q && (w.en + ' ' + w.ru).toLowerCase().indexOf(q) < 0) return false;
        return true;
      });
      countEl.textContent = 'Найдено: ' + items.length + (q ? ' (поиск по всем уровням)' : '');
      var frag = document.createDocumentFragment();
      items.slice(0, shown).forEach(function (w) { frag.appendChild(wordRow(w)); });
      if (items.length > shown) {
        frag.appendChild(h('button', { class: 'btn ghost block', type: 'button', onclick: function () { shown += PAGE * 2; draw(); } },
          'Показать ещё (' + (items.length - shown) + ')'));
      }
      listEl.replaceChildren(frag);
      if (!items.length) listEl.appendChild(EG.ui.empty('search', 'Ничего не найдено', 'Измените фильтр или запрос.'));
    }
    function redraw() { shown = PAGE; draw(); }
    draw();

    return h('section', { class: 'card' },
      h('h3', { class: 'card-title' }, 'Все слова'),
      h('div', { class: 'row gap wrap vocab-filters' }, h('div', { class: 'search grow' }, icon('search'), search), seg),
      countEl, listEl);
  }

  /* ================= Класс (уровень) ================= */
  function levelPage(root, level) {
    var list = WT().units(level);
    var c = WT().counts(level);
    var cur = WT().currentUnit(level);
    var seen = c.learned + c.learning;
    var below = EG.util.levelIndex(level) < EG.progress.baseLevelIndex();

    root.append(
      backLink('#/vocab', 'Словарный запас'),
      EG.ui.pageHead(level + ' · ' + levelName(level), c.total + ' слов в ' + list.length + ' блоках. Проходите блоки по порядку: в каждом — 10 новых слов за занятие, затем проверка и написание.'),
      below && cur ? h('div', { class: 'notice' }, icon('bulb'),
        'Этот класс ниже вашего уровня (' + EG.storage.get('level') + '). Откройте блок и выберите «Проверить себя»: слова, которые вы быстро узнаёте, сразу отметятся как знакомые.') : null,
      h('section', { class: 'card' },
        h('div', { class: 'row between wrap' },
          h('div', null,
            h('strong', null, 'Пройдено ' + seen + ' из ' + c.total),
            h('div', { class: 'muted small' }, 'Выучено ' + c.learned + ' · изучается ' + c.learning + ' · к повторению ' + c.due)),
          cur ? h('a', { class: 'btn primary', href: '#/vocab/learn/' + level + '/' + cur.n }, icon('arrow'), 'Продолжить: блок ' + cur.n)
            : h('span', { class: 'badge st-mastered' }, icon('check'), 'Все слова класса пройдены')),
        EG.ui.bar(c.total ? seen / c.total * 100 : 0)),
      h('div', { class: 'unit-grid' }, list.map(function (u) {
        var st = WT().unitStats(u);
        var state = st.learned === st.total ? 'mastered' : st.done ? 'done' : u === cur ? 'current' : st.started ? 'started' : '';
        return h('a', { class: 'unit-tile ' + state, href: '#/vocab/unit/' + level + '/' + u.n },
          h('div', { class: 'row between' },
            h('strong', null, 'Блок ' + u.n),
            st.learned === st.total ? icon('check', 'unit-ok')
              : st.due ? h('span', { class: 'badge st-learning' }, st.due + ' к повт.')
                : u === cur ? h('span', { class: 'badge' }, 'следующий') : null),
          h('span', { class: 'unit-preview muted small', lang: 'en' }, u.words.slice(0, 4).map(function (w) { return w.en; }).join(', ') + '…'),
          h('div', { class: 'bar thin' }, h('span', { style: { width: Math.round(st.mastery * 100) + '%' } })),
          h('span', { class: 'muted small' }, !st.started ? 'не начат · ' + st.total + ' слов'
            : '✓ ' + st.learned + ' · изучается ' + st.learning + (st.fresh ? ' · новых ' + st.fresh : '')));
      })));
  }

  /* ================= Блок ================= */
  function unitPage(root, level, n) {
    var u = WT().unit(level, n);
    if (!u) { root.append(EG.ui.empty('vocab', 'Блок не найден', null, h('a', { class: 'btn', href: '#/vocab' }, 'К словарю'))); return; }
    var total = WT().units(level).length;
    var st = WT().unitStats(u);
    var base = '#/vocab/drill/' + level + '/' + n + '/';

    function action(href, emoji, title, desc, primary) {
      return h('a', { class: 'game-card unit-action' + (primary ? ' primary' : ''), href: href },
        h('span', { class: 'vocab-mode-emoji' }, emoji), h('strong', null, title), h('span', { class: 'muted small' }, desc));
    }

    root.append(
      backLink('#/vocab/level/' + level, level + ' · ' + levelName(level)),
      EG.ui.pageHead('Блок ' + n + ' из ' + total, st.total + ' слов · выучено ' + st.learned + ' · изучается ' + st.learning + (st.fresh ? ' · новых ' + st.fresh : '')),
      h('div', { class: 'vocab-modes' },
        action('#/vocab/learn/' + level + '/' + n, '📘', st.fresh ? 'Учить новые слова' : 'Закрепить блок',
          st.fresh ? 'Следующие ' + words(Math.min(LEARN_BATCH, st.fresh)) + ': сразу варианты ответа в обе стороны, ошибки повторяются.' : 'Повторим самые слабые слова блока с написанием.', true),
        action(base + 'mix', '⚡', 'Проверить себя', 'Все слова блока на скорость. Знакомые слова сразу отметятся как известные.'),
        action(base + 'type', '⌨️', 'Написание', 'Перевод → напишите слово по-английски.'),
        EG.ui.canSpeak() ? action(base + 'listen', '🎧', 'На слух', 'Слушайте слово и выбирайте перевод.') : null),
      h('section', { class: 'card' },
        h('h3', { class: 'card-title' }, 'Слова блока'),
        h('div', { class: 'word-list' }, u.words.map(function (w) { return wordRow(w); }))),
      h('div', { class: 'row between wrap unit-nav' },
        n > 1 ? h('a', { class: 'btn ghost', href: '#/vocab/unit/' + level + '/' + (n - 1) }, icon('back'), 'Блок ' + (n - 1)) : h('span'),
        n < total ? h('a', { class: 'btn ghost', href: '#/vocab/unit/' + level + '/' + (n + 1) }, 'Блок ' + (n + 1), icon('arrow')) : null));
  }

  /* ================= Построение сессий ================= */

  function rnd() { return Math.random(); }
  function dirRandom() { return rnd() < 0.5 ? 'ru-en' : 'en-ru'; }

  /** Шаги для набора слов в заданном режиме. */
  function stepsFor(list, mode) {
    var alt = rnd() < 0.5;
    return list.map(function (w) {
      if (mode === 'type') return { kind: 'type', w: w };
      if (mode === 'listen') return { kind: EG.ui.canSpeak() ? 'listen' : 'choice', w: w, dir: 'en-ru' };
      if (mode === 'ru-en' || mode === 'en-ru') return { kind: 'choice', w: w, dir: mode };
      alt = !alt;
      return { kind: 'choice', w: w, dir: alt ? 'ru-en' : 'en-ru' };
    });
  }

  /** Занятие блока: новые слова порциями по 5 — сразу варианты ответа в обе стороны, ошибки возвращаются. */
  function learnSteps(u) {
    var fresh = u.words.filter(function (w) { return !WT().rec(w.id); }).slice(0, LEARN_BATCH);
    var steps = [];
    if (fresh.length) {
      for (var i = 0; i < fresh.length; i += 5) {
        var chunk = fresh.slice(i, i + 5);
        chunk.forEach(function (w) { steps.push({ kind: 'choice', w: w, dir: 'en-ru', first: true }); });
        EG.util.shuffle(chunk.slice()).forEach(function (w) { steps.push({ kind: 'choice', w: w, dir: 'ru-en' }); });
      }
      return { words: fresh, steps: steps, fresh: true };
    }
    // все слова уже встречались — закрепляем самые слабые
    var weak = u.words.slice().sort(function (a, b) {
      var ra = WT().rec(a.id), rb = WT().rec(b.id);
      return ra.box - rb.box || ra.due - rb.due;
    }).slice(0, LEARN_BATCH);
    EG.util.shuffle(weak).forEach(function (w) { steps.push({ kind: 'choice', w: w, dir: 'ru-en' }); });
    EG.util.shuffle(weak).forEach(function (w) { steps.push({ kind: 'type', w: w }); });
    return { words: weak, steps: steps, fresh: false };
  }

  /** Общее повторение: знакомые слова чаще пишем, реже — выбираем или слушаем. */
  function reviewSteps(list) {
    return list.map(function (w) {
      var r = WT().rec(w.id);
      var box = r ? r.box : 0;
      if (box >= 2 && rnd() < 0.5) return { kind: 'type', w: w };
      if (box >= 1 && EG.ui.canSpeak() && rnd() < 0.2) return { kind: 'listen', w: w, dir: 'en-ru' };
      return { kind: 'choice', w: w, dir: dirRandom() };
    });
  }

  /* ================= Сессия ================= */

  /**
   * cfg: { title, back, steps, words, learn (занятие с карточками), finishActions: () => [элементы] }
   */
  function runSession(root, cfg) {
    var queue = cfg.steps.slice();
    var words = cfg.words;
    var wasNew = {}, lastGrade = {}, retries = {}, reinforced = {}, learnedNow = {}, errored = {}, typedBonus = {}, knownNow = {};
    words.forEach(function (w) { wasNew[w.id] = !WT().rec(w.id); });
    var idx = 0, keyHandler = null, timers = [], alive = true;
    var res = { right: 0, wrong: 0, xp: 0 };
    var started = Date.now(), answeredAny = false, minutesSaved = false;

    var progressEl = h('div', { class: 'bar thin' }, h('span'));
    var counter = h('span', { class: 'muted small' });
    var stage = h('div', { class: 'stage' });
    var foot = h('div', { class: 'stage-foot' });
    root.append(h('div', { class: 'player' },
      h('div', { class: 'player-top' },
        h('a', { class: 'icon-btn', href: cfg.back, title: 'Завершить', 'aria-label': 'Завершить' }, icon('x')),
        progressEl, counter),
      h('div', { class: 'player-title muted small' }, cfg.title),
      stage, foot));

    function onKey(e) { if (keyHandler && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.altKey) keyHandler(e); }
    document.addEventListener('keydown', onKey);
    function later(fn, ms) { timers.push(setTimeout(function () { if (alive) fn(); }, ms)); }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }

    function saveMinutes() {
      if (minutesSaved || !answeredAny) return;
      minutesSaved = true;
      EG.progress.addMinutes(Math.min(Date.now() - started, 90 * 60000));
    }

    function insertLater(item, gap) { queue.splice(Math.min(queue.length, idx + 1 + gap), 0, item); }
    /** Убрать из очереди оставшиеся шаги слова (оно уже известно). */
    function dropRest(w) {
      for (var i = queue.length - 1; i > idx; i--) if (queue[i].w.id === w.id) queue.splice(i, 1);
    }

    function badges(w) {
      var fresh = wasNew[w.id] && !Object.prototype.hasOwnProperty.call(lastGrade, w.id);
      return h('span', { class: 'badges' }, fresh ? h('span', { class: 'badge st-new' }, 'новое слово') : statusBadge(w.id), EG.ui.levelBadge(w.level));
    }

    function exampleBlock(w) {
      var ex = WT().examples(w, 1)[0];
      if (!ex) return null;
      return h('div', { class: 'word-example' },
        h('span', { lang: 'en' }, ex.en), EG.ui.speakBtn(ex.en, true),
        ex.ru ? h('span', { class: 'muted small' }, ex.ru) : ex.src ? h('span', { class: 'muted small' }, 'Из текста «' + ex.src + '»') : null);
    }

    function show() {
      EG.ui.stopSpeech();
      keyHandler = null;
      foot.replaceChildren();
      if (idx >= queue.length) return finish();
      progressEl.firstChild.style.width = (idx / queue.length * 100) + '%';
      counter.textContent = (idx + 1) + ' / ' + queue.length;
      var item = queue[idx];
      if (item.kind === 'type') return showType(item);
      return showChoice(item);
    }

    /* ---------- выбор из 4 вариантов (и режим «на слух») ---------- */
    function showChoice(item) {
      var w = item.w, listen = item.kind === 'listen';
      var dir = listen ? 'en-ru' : item.dir;
      var q = WT().question(w, dir);
      var en = dir === 'en-ru';
      var btns = [], locked = false;
      var opts = h('div', { class: 'options' + (en ? '' : ' en') }, q.options.map(function (o, i) {
        var b = h('button', { class: 'option', type: 'button', onclick: function () { pick(i); } },
          h('span', { class: 'opt-key' }, String(i + 1)), h('span', { class: 'opt-text', lang: en ? 'ru' : 'en' }, o));
        btns.push(b);
        return b;
      }));
      var st = WT().status(w.id);
      var promptEl;
      if (listen) {
        var hidden = h('span', { class: 'listen-word hidden', lang: 'en' }, w.en);
        promptEl = h('div', { class: 'word-prompt' },
          h('button', { class: 'listen-btn', type: 'button', 'aria-label': 'Прослушать ещё раз', onclick: function () { EG.ui.speak(w.en); } }, icon('speaker')),
          h('button', { class: 'link-btn', type: 'button', onclick: function () { EG.ui.speak(w.en, null, 0.6); } }, 'медленнее'),
          hidden);
        item.reveal = function () { hidden.classList.remove('hidden'); };
      } else {
        promptEl = h('div', { class: 'word-prompt' }, h('span', { lang: en ? 'en' : 'ru' }, q.prompt), en ? EG.ui.speakBtn(w.en) : null);
      }

      function pick(i) {
        if (locked) return;
        locked = true;
        var ok = i >= 0 && q.options[i] === q.answer;
        btns.forEach(function (b, j) {
          b.disabled = true;
          if (q.options[j] === q.answer) b.classList.add('correct');
          if (j === i && !ok) b.classList.add('wrong');
        });
        if (item.reveal) item.reveal();
        answer(item, ok, i >= 0 ? q.options[i] : '(не знаю)', q.answer, listen ? 'listen' : dir);
      }
      keyHandler = function (e) {
        var n = parseInt(e.key, 10);
        if (n >= 1 && n <= q.options.length) { e.preventDefault(); pick(n - 1); }
      };

      stage.replaceChildren(h('div', { class: 'card ex-card word-q enter' },
        h('div', { class: 'row between' },
          h('p', { class: 'prompt' }, listen ? 'Прослушайте и выберите перевод' : item.first ? 'Новое слово: как переводится?' : en ? 'Как переводится?' : 'Как сказать по-английски?'),
          badges(w)),
        promptEl,
        h('p', { class: 'muted small center' }, EG.data.wordPos[w.pos] + (st === 'learned' ? ' · вы уже знаете это слово — проверим' : '')),
        opts,
        h('div', { class: 'center' }, h('button', { class: 'link-btn dont-know', type: 'button', onclick: function () { pick(-1); } }, 'Не знаю'))));
      shownAt = Date.now();
      if (listen) setTimeout(function () { if (alive) EG.ui.speak(w.en); }, 250);
      else if (en) EG.ui.autoSpeak(w.en);
    }

    /* ---------- написание ---------- */
    function showType(item) {
      var w = item.w;
      var letters = WT().letterCount(w.en);
      var hints = 1, locked = false;
      var maskEl = h('div', { class: 'type-mask', lang: 'en', 'aria-hidden': 'true' });
      function drawMask() { maskEl.textContent = WT().mask(w.en, hints); }
      drawMask();
      var input = h('input', { class: 'input big type-input', type: 'text', lang: 'en', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
        placeholder: 'Напишите по-английски…', 'aria-label': 'Ответ по-английски' });
      var hintBtn = h('button', { class: 'btn ghost sm', type: 'button', onclick: function () {
        if (hints < letters) { hints++; drawMask(); }
        input.focus();
      } }, icon('bulb'), 'Подсказка');
      var submitBtn = h('button', { class: 'btn primary', type: 'button', onclick: submit }, 'Проверить');
      var giveUp = h('button', { class: 'link-btn dont-know', type: 'button', onclick: function () { input.value = ''; submit(true); } }, 'Не помню');
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); submit(); }
      });

      function submit(gaveUp) {
        if (locked) return;
        var typed = input.value.trim();
        if (!typed && gaveUp !== true) { input.focus(); return; }
        locked = true;
        input.disabled = true; hintBtn.disabled = true; submitBtn.disabled = true; giveUp.disabled = true;
        var verdict = gaveUp === true ? 'wrong' : WT().checkSpelling(w, typed);
        // больше половины букв подсказано — слово не вспомнили сами
        var helped = hints > 1 && hints * 2 > letters;
        var ok = verdict !== 'wrong' && !helped;
        input.classList.add(verdict === 'wrong' ? 'wrong' : 'correct');
        maskEl.textContent = w.en;
        item.typo = verdict === 'typo';
        item.synonym = verdict === 'synonym' ? typed : null;
        item.helped = helped && verdict !== 'wrong';
        answer(item, ok, typed || '(не помню)', w.en, 'type');
      }

      stage.replaceChildren(h('div', { class: 'card ex-card word-q enter' },
        h('div', { class: 'row between' }, h('p', { class: 'prompt' }, 'Напишите по-английски'), badges(w)),
        h('div', { class: 'word-prompt' }, h('span', { lang: 'ru' }, w.ru)),
        h('p', { class: 'muted small center' }, EG.data.wordPos[w.pos] + ' · ' + letters + ' ' + EG.util.plural(letters, 'буква', 'буквы', 'букв')),
        maskEl,
        h('div', { class: 'type-row' }, input, submitBtn),
        h('div', { class: 'row between wrap' }, hintBtn, giveUp)));
      shownAt = Date.now();
      setTimeout(function () { input.focus(); }, 60);
    }

    var shownAt = 0;

    /* ---------- ответ: прогресс слова, повтор ошибок ---------- */
    function answer(item, ok, user, expected, type) {
      var w = item.w, ms = Date.now() - shownAt;
      answeredAny = true;
      if (ok) res.right++; else res.wrong++;
      if (!ok) errored[w.id] = true;
      var tasks = [EG.progress.recordAnswer({
        itemId: 'word:' + w.id, type: 'word-' + type, correct: ok, userAnswer: user, expected: expected, ms: ms,
        noMistake: true, xpFactor: type === 'type' ? 0.8 : 0.5
      })];
      var had = Object.prototype.hasOwnProperty.call(lastGrade, w.id);
      // в прогресс слова идут: первый ответ за сессию, любая ошибка, верный ответ после ошибки
      // и верное написание без ошибок (активное воспоминание — сильный сигнал, слово переходит дальше)
      var bonus = item.kind === 'type' && ok && had && lastGrade[w.id] === true && !errored[w.id] && !typedBonus[w.id];
      if (!had || !ok || lastGrade[w.id] === false || bonus) {
        if (bonus) typedBonus[w.id] = true;
        lastGrade[w.id] = ok;
        // только что показанное слово не считается «угаданным сразу»; «знаю» с верным ответом — считается
        var gms = had ? 0 : ms;
        tasks.push(WT().grade(w.id, ok, gms));
      }
      // ошибка — слово вернётся через несколько вопросов
      if (!ok && (retries[w.id] || 0) < 2) {
        retries[w.id] = (retries[w.id] || 0) + 1;
        var again = item.kind === 'type' ? { kind: 'type', w: w }
          : item.first ? { kind: 'choice', w: w, dir: 'en-ru', first: true } // новое слово покажем ещё раз так же
            : { kind: 'choice', w: w, dir: item.dir === 'en-ru' || item.kind === 'listen' ? 'ru-en' : 'en-ru' };
        insertLater(again, cfg.learn ? 1 : 3);
        item.requeued = true;
      } else if (!cfg.learn && ok && wasNew[w.id] && !reinforced[w.id] && ms >= 4000 && item.kind !== 'type') {
        reinforced[w.id] = true;
        insertLater({ kind: 'choice', w: w, dir: item.dir === 'ru-en' ? 'en-ru' : 'ru-en' }, 5);
      }
      Promise.all(tasks).then(function (r) {
        res.xp += r[0] || 0;
        var g = r[1];
        // новое слово узнали сразу и быстро — оно уже знакомо, остальные его шаги убираем
        if (item.first && ok && !errored[w.id] && g && !g.before && g.after.box >= WT().KNOWN_BOX) {
          knownNow[w.id] = true;
          dropRest(w);
        }
        var justLearned = g && g.after.box >= WT().LEARNED_BOX && !(g.before && g.before.box >= WT().LEARNED_BOX);
        if (justLearned) learnedNow[w.id] = true;
        if (!ok) delete learnedNow[w.id];
        feedback(item, ok, g, justLearned);
      }).catch(function (e) { console.error(e); feedback(item, ok, null, false); });
      if (!ok || item.dir === 'ru-en' || item.kind === 'type') EG.ui.autoSpeak(w.en);
    }

    function advance() { if (!alive) return; clearTimers(); idx++; show(); }

    function feedback(item, ok, g, justLearned) {
      if (!alive) return;
      var w = item.w;
      var line = h('div', { class: 'item-line' }, h('strong', { class: 'en', lang: 'en' }, w.en), EG.ui.speakBtn(w.en, true), h('span', { class: 'ru' }, '— ' + w.ru));
      var note = knownNow[w.id] && ok ? h('p', { class: 'fb-note' }, icon('check'), 'Вы знаете это слово — пропускаем его. Повтор ' + (g ? EG.ui.relDue(g.after.due) : 'позже') + '.')
        : justLearned ? h('p', { class: 'fb-note' }, icon('check'), 'Слово выучено! Следующий повтор ' + EG.ui.relDue(g.after.due) + '.')
          : item.synonym && ok ? h('p', { class: 'muted small' }, '«' + item.synonym + '» — тоже верно, это синоним. Здесь загадано слово ниже.')
            : item.typo && ok ? h('p', { class: 'muted small' }, 'Засчитано, но с опечаткой — сравните написание.')
            : ok && g && !g.before && g.after.box >= WT().KNOWN_BOX ? h('p', { class: 'muted small' }, 'Вы знали это слово — покажем его снова только ' + EG.ui.relDue(g.after.due) + '.')
              : null;
      if (ok) {
        foot.replaceChildren(h('div', { class: 'feedback good' },
          h('div', { class: 'fb-head' }, h('span', { class: 'fb-verdict good' }, icon('check'), item.typo ? 'Почти верно' : item.synonym ? 'Верно (синоним)' : 'Верно!')), line, note));
        later(advance, justLearned || knownNow[w.id] || item.typo || item.synonym ? 1700 : item.kind === 'type' ? 1100 : 900);
        keyHandler = function (e) { if (e.key === 'Enter') { e.preventDefault(); advance(); } };
        return;
      }
      var b = h('button', { class: 'btn primary block', type: 'button', onclick: advance }, 'Далее', icon('arrow'));
      foot.replaceChildren(h('div', { class: 'feedback bad' },
        h('div', { class: 'fb-head' }, h('span', { class: 'fb-verdict bad' }, icon('x'), item.helped ? 'С подсказкой' : 'Неверно')),
        h('p', { class: 'muted small' }, 'Правильно:'), line,
        exampleBlock(w),
        h('p', { class: 'muted small' }, item.requeued ? (item.first ? 'Запомните перевод — слово сейчас появится ещё раз.' : 'Слово вернётся ещё раз в этой сессии.') : 'Слово скоро появится в повторении.')), b);
      keyHandler = function (e) { if (e.key === 'Enter') { e.preventDefault(); advance(); } };
      setTimeout(function () { b.focus(); }, 30);
    }

    function finish() {
      keyHandler = null;
      saveMinutes();
      progressEl.firstChild.style.width = '100%';
      var total = res.right + res.wrong;
      var newCount = words.filter(function (w) { return wasNew[w.id]; }).length;
      var learnedCount = Object.keys(learnedNow).length;
      var knownCount = Object.keys(knownNow).length;
      stage.replaceChildren(h('div', { class: 'card finish enter' },
        h('h2', null, 'Сессия завершена'),
        h('div', { class: 'finish-stats' },
          EG.ui.ring(total ? res.right / total * 100 : 0, Math.round(total ? res.right / total * 100 : 0) + '%', 'верно'),
          h('div', { class: 'finish-nums' },
            h('div', null, h('strong', null, res.right + '/' + total), h('span', null, 'верных ответов')),
            h('div', null, h('strong', null, newCount), h('span', null, knownCount ? 'новых (из них знакомых ' + knownCount + ')' : 'новых слов')),
            h('div', null, h('strong', null, learnedCount), h('span', null, 'стали выученными')),
            h('div', null, h('strong', null, '+' + res.xp), h('span', null, 'XP')))),
        h('div', { class: 'learn-list' }, h('span', { class: 'metric-label' }, 'Слова этой сессии'),
          h('div', { class: 'word-list' }, words.map(function (w) {
            return wordRow(w, lastGrade[w.id] === false ? h('span', { class: 'badge bad' }, 'повторим скоро') : statusBadge(w.id));
          }))),
        h('div', { class: 'row gap wrap center' }, cfg.finishActions())));
      foot.replaceChildren();
      counter.textContent = '';
    }

    show();
    return function () {
      alive = false;
      saveMinutes();
      clearTimers();
      document.removeEventListener('keydown', onKey);
    };
  }

  function emptySession(root, title, text) {
    root.append(EG.ui.empty('vocab', title, text, h('a', { class: 'btn', href: '#/vocab' }, 'К словарю')));
  }

  /* ---------- запуск сессий ---------- */

  function learn(root, level, n) {
    var u = WT().unit(level, n);
    if (!u) return emptySession(root, 'Блок не найден', null);
    var plan = learnSteps(u);
    var total = WT().units(level).length;
    return runSession(root, {
      title: level + ' · блок ' + n + ' · ' + (plan.fresh ? 'новые слова' : 'закрепление'),
      back: '#/vocab/unit/' + level + '/' + n,
      steps: plan.steps, words: plan.words, learn: true,
      finishActions: function () {
        var st = WT().unitStats(u);
        var next = st.fresh ? { href: '#/vocab/learn/' + level + '/' + n, label: 'Ещё ' + words(Math.min(LEARN_BATCH, st.fresh)) + ' блока' }
          : n < total ? { href: '#/vocab/unit/' + level + '/' + (n + 1), label: 'Следующий блок' } : { href: '#/vocab/level/' + level, label: 'К классу ' + level };
        var due = WT().dueAll().length;
        return [
          h('a', { class: 'btn primary', href: next.href, onclick: function () { if (location.hash === next.href) EG.router.refresh(); } }, next.label, icon('arrow')),
          due ? h('a', { class: 'btn ghost', href: '#/vocab/review' }, 'Повторение (' + due + ')') : null,
          h('a', { class: 'btn ghost', href: '#/vocab/unit/' + level + '/' + n }, 'К блоку')];
      }
    });
  }

  function drill(root, level, n, mode) {
    var u = WT().unit(level, n);
    if (!u) return emptySession(root, 'Блок не найден', null);
    var m = modeById(mode);
    var list = EG.util.shuffle(u.words.slice());
    return runSession(root, {
      title: level + ' · блок ' + n + ' · ' + (m.id === 'mix' ? 'проверить себя' : m.title.toLowerCase()),
      back: '#/vocab/unit/' + level + '/' + n,
      steps: stepsFor(list, m.id), words: list,
      finishActions: function () {
        return [
          h('button', { class: 'btn primary', type: 'button', onclick: function () { EG.router.refresh(); } }, 'Ещё раз'),
          m.id !== 'type' ? h('a', { class: 'btn ghost', href: '#/vocab/drill/' + level + '/' + n + '/type' }, 'Написание') : null,
          h('a', { class: 'btn ghost', href: '#/vocab/unit/' + level + '/' + n }, 'К блоку')];
      }
    });
  }

  function review(root) {
    var list = WT().dueAll().slice(0, WT().REVIEW_SIZE);
    if (!list.length) {
      var nu = WT().nextUnit();
      root.append(EG.ui.empty('review', 'Повторять пока нечего', 'Все изученные слова ещё свежи в памяти. Возвращайтесь позже — или выучите новые.',
        nu ? h('a', { class: 'btn primary', href: '#/vocab/learn/' + nu.level + '/' + nu.n }, 'Новые слова: ' + nu.level + ' · блок ' + nu.n) : h('a', { class: 'btn', href: '#/vocab' }, 'К словарю')));
      return;
    }
    list = EG.util.shuffle(list);
    return runSession(root, {
      title: 'Повторение слов · ' + words(list.length),
      back: '#/vocab',
      steps: reviewSteps(list), words: list,
      finishActions: function () {
        var more = WT().dueAll().length;
        var nu = WT().nextUnit();
        return [
          more ? h('button', { class: 'btn primary', type: 'button', onclick: function () { EG.router.refresh(); } }, 'Повторить ещё (' + more + ')')
            : nu ? h('a', { class: 'btn primary', href: '#/vocab/learn/' + nu.level + '/' + nu.n }, 'Новые слова', icon('arrow')) : null,
          h('a', { class: 'btn ghost', href: '#/vocab' }, 'К словарю')];
      }
    });
  }

  function play(root, mode) {
    var m = modeById(mode);
    var level = EG.storage.get('wordLevel');
    var list = WT().buildSession(level);
    if (!list.length) return emptySession(root, 'Нет слов для этого уровня', 'Выберите другой уровень.');
    return runSession(root, {
      title: 'Словарный запас · ' + m.title + ' · ' + freeLabel(level),
      back: '#/vocab',
      steps: stepsFor(list, m.id), words: list,
      finishActions: function () {
        return [
          h('button', { class: 'btn primary', type: 'button', onclick: function () { EG.router.refresh(); } }, 'Ещё ' + WT().SESSION_SIZE + ' слов'),
          h('a', { class: 'btn ghost', href: '#/vocab' }, 'К словарю')];
      }
    });
  }

  EG.views.vocab = function (root, params) {
    var p = params[0];
    var lv = EG.LEVELS.indexOf(params[1]) >= 0 ? params[1] : null;
    var n = parseInt(params[2], 10);
    if (p === 'play') return play(root, params[1]);
    if (p === 'review') return review(root);
    if (p === 'level' && lv) return levelPage(root, lv);
    if (p === 'unit' && lv && n) return unitPage(root, lv, n);
    if (p === 'learn' && lv && n) return learn(root, lv, n);
    if (p === 'drill' && lv && n) return drill(root, lv, n, params[3]);
    overview(root);
  };
})(window.EG = window.EG || {});
