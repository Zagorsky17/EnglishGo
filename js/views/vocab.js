/* views/vocab.js — «Словарный запас»: интенсивное пополнение словаря (перевод слова с выбором из 4 вариантов) */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  var WT = function () { return EG.wordTrainer; };
  EG.views = EG.views || {};

  var MODES = [
    { id: 'ru-en', emoji: '🇷🇺 → 🇬🇧', title: 'Русский → English', desc: 'Видите русское слово — выберите английское из 4 вариантов.' },
    { id: 'en-ru', emoji: '🇬🇧 → 🇷🇺', title: 'English → русский', desc: 'Видите английское слово — выберите правильный перевод.' },
    { id: 'mix', emoji: '🔀', title: 'Вперемешку', desc: 'Оба направления в одной сессии — так слово запоминается крепче.' }
  ];

  var listFilter = { q: '', status: '' };
  var PAGE = 60;

  function statusBadge(id) {
    var st = WT().status(id), r = WT().rec(id);
    if (st === 'learned') return h('span', { class: 'badge st-mastered', title: 'Повтор ' + EG.ui.relDue(r.due) }, icon('check'), 'выучено');
    if (st === 'learning') return h('span', { class: 'badge st-learning', title: 'Повтор ' + EG.ui.relDue(r.due) }, 'изучается');
    return null;
  }

  function levelLabel(level) { return level || 'Мой уровень (до ' + EG.storage.get('level') + ')'; }

  /* ================= Обзор ================= */
  function overview(root) {
    var level = EG.storage.get('wordLevel');
    var all = WT().counts();
    var cur = WT().counts(level);

    var levelSeg = h('div', { class: 'segmented level-seg' }, [''].concat(EG.LEVELS).map(function (l) {
      var c = WT().counts(l);
      return h('button', { type: 'button', class: l === level ? 'active' : '', onclick: function () { EG.storage.set('wordLevel', l); EG.router.refresh(); } },
        l ? l : 'Мой уровень', h('span', { class: 'seg-sub' }, c.learned + '/' + c.total));
    }));

    var modes = h('div', { class: 'vocab-modes' }, MODES.map(function (m) {
      return h('a', { class: 'game-card vocab-mode' + (EG.storage.get('wordMode') === m.id ? ' last' : ''), href: '#/vocab/play/' + m.id,
        onclick: function () { EG.storage.set('wordMode', m.id); } },
        h('span', { class: 'vocab-mode-emoji' }, m.emoji),
        h('strong', null, m.title),
        h('span', { class: 'muted small' }, m.desc));
    }));

    var next = cur.due ? 'К повторению сейчас: ' + cur.due + ' ' + EG.util.plural(cur.due, 'слово', 'слова', 'слов') + '. '
      : cur.fresh ? 'Повторять пока нечего — самое время для новых слов. ' : 'Все слова уровня уже изучаются — повторим самые «горячие». ';

    root.append(
      EG.ui.pageHead('Словарный запас', 'Интенсивное пополнение словаря: ' + all.total + ' слов от A1 до C1. Выбирайте перевод из 4 вариантов — выученные слова отмечаются ✓ и появляются всё реже.'),
      h('section', { class: 'card vocab-summary' },
        EG.ui.ring(all.total ? all.learned / all.total * 100 : 0, (all.total ? Math.round(all.learned / all.total * 100) : 0) + '%', 'словаря'),
        h('div', { class: 'finish-nums' },
          h('div', null, h('strong', null, all.learned), h('span', null, 'выучено')),
          h('div', null, h('strong', null, all.learning), h('span', null, 'изучается')),
          h('div', null, h('strong', null, all.due), h('span', null, 'к повторению')),
          h('div', null, h('strong', null, all.fresh), h('span', null, 'ещё не встречались')))),
      h('section', { class: 'card' },
        h('h3', { class: 'card-title' }, 'Уровень слов'),
        levelSeg,
        h('p', { class: 'muted small vocab-hint' }, levelLabel(level) + ': ' + cur.total + ' слов, выучено ' + cur.learned + '. ' + next +
          'В сессии ' + WT().SESSION_SIZE + ' слов: сначала повторение, затем новые.')),
      modes,
      wordList());
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
      var items = WT().poolFor(level).filter(function (w) {
        if (listFilter.status && WT().status(w.id) !== listFilter.status) return false;
        if (q && (w.en + ' ' + w.ru).toLowerCase().indexOf(q) < 0) return false;
        return true;
      });
      countEl.textContent = 'Найдено: ' + items.length;
      var frag = document.createDocumentFragment();
      items.slice(0, shown).forEach(function (w) {
        frag.appendChild(h('div', { class: 'word vocab-row' + (WT().isLearned(w.id) ? ' learned' : '') },
          h('span', { class: 'word-main' },
            h('strong', { lang: 'en' }, w.en),
            h('span', { class: 'muted' }, w.ru + ' · ' + EG.data.wordPos[w.pos])),
          h('span', { class: 'word-meta' }, statusBadge(w.id), EG.ui.speakBtn(w.en, true), EG.ui.levelBadge(w.level))));
      });
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
      h('h3', { class: 'card-title' }, 'Слова уровня'),
      h('div', { class: 'row gap wrap vocab-filters' }, h('div', { class: 'search grow' }, icon('search'), search), seg),
      countEl, listEl);
  }

  /* ================= Сессия ================= */
  function play(root, mode) {
    if (!MODES.some(function (m) { return m.id === mode; })) mode = 'mix';
    var level = EG.storage.get('wordLevel');
    var words = WT().buildSession(level);
    if (!words.length) {
      root.append(EG.ui.empty('words', 'Нет слов для этого уровня', 'Выберите другой уровень.', h('a', { class: 'btn', href: '#/vocab' }, 'К словарю')));
      return;
    }

    function dirFor(prevDir) {
      if (mode !== 'mix') return mode;
      if (prevDir) return prevDir === 'ru-en' ? 'en-ru' : 'ru-en';
      return Math.random() < 0.5 ? 'ru-en' : 'en-ru';
    }

    var queue = words.map(function (w) { return { w: w, dir: dirFor() }; });
    var wasNew = {}, lastGrade = {}, retries = {}, reinforced = {}, learnedNow = {};
    words.forEach(function (w) { wasNew[w.id] = !WT().rec(w.id); });
    var idx = 0, locked = false, shownAt = 0, keyHandler = null, timers = [], alive = true;
    var res = { right: 0, wrong: 0, xp: 0 };
    var started = Date.now(), answeredAny = false, minutesSaved = false;

    var progressEl = h('div', { class: 'bar thin' }, h('span'));
    var counter = h('span', { class: 'muted small' });
    var stage = h('div', { class: 'stage' });
    var foot = h('div', { class: 'stage-foot' });
    root.append(h('div', { class: 'player' },
      h('div', { class: 'player-top' },
        h('a', { class: 'icon-btn', href: '#/vocab', title: 'Завершить', 'aria-label': 'Завершить' }, icon('x')),
        progressEl, counter),
      h('div', { class: 'player-title muted small' }, 'Словарный запас · ' + (MODES.filter(function (m) { return m.id === mode; })[0].title) + ' · ' + levelLabel(level)),
      stage, foot));

    function onKey(e) { if (keyHandler && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.altKey) keyHandler(e); }
    document.addEventListener('keydown', onKey);
    function later(fn, ms) { timers.push(setTimeout(function () { if (alive) fn(); }, ms)); }

    function saveMinutes() {
      if (minutesSaved || !answeredAny) return;
      minutesSaved = true;
      EG.progress.addMinutes(Math.min(Date.now() - started, 90 * 60000));
    }

    function insertLater(item, gap) { queue.splice(Math.min(queue.length, idx + 1 + gap), 0, item); }

    function show() {
      EG.ui.stopSpeech();
      locked = false; keyHandler = null;
      foot.replaceChildren();
      if (idx >= queue.length) return finish();
      progressEl.firstChild.style.width = (idx / queue.length * 100) + '%';
      counter.textContent = (idx + 1) + ' / ' + queue.length;

      var item = queue[idx], w = item.w;
      var q = WT().question(w, item.dir);
      var en = item.dir === 'en-ru';
      var btns = [];
      var opts = h('div', { class: 'options' + (en ? '' : ' en') }, q.options.map(function (o, i) {
        var b = h('button', { class: 'option', type: 'button', onclick: function () { pick(i); } },
          h('span', { class: 'opt-key' }, String(i + 1)), h('span', { class: 'opt-text', lang: en ? 'ru' : 'en' }, o));
        btns.push(b);
        return b;
      }));
      var st = WT().status(w.id);

      function pick(i) {
        if (locked) return;
        locked = true;
        var ok = i >= 0 && q.options[i] === q.answer;
        btns.forEach(function (b, j) {
          b.disabled = true;
          if (q.options[j] === q.answer) b.classList.add('correct');
          if (j === i && !ok) b.classList.add('wrong');
        });
        answer(item, q, ok, i >= 0 ? q.options[i] : '(не знаю)');
      }

      keyHandler = function (e) {
        var n = parseInt(e.key, 10);
        if (n >= 1 && n <= q.options.length) { e.preventDefault(); pick(n - 1); }
      };

      stage.replaceChildren(h('div', { class: 'card ex-card word-q enter' },
        h('div', { class: 'row between' },
          h('p', { class: 'prompt' }, en ? 'Как переводится?' : 'Как сказать по-английски?'),
          h('span', { class: 'badges' }, wasNew[w.id] && !Object.prototype.hasOwnProperty.call(lastGrade, w.id) ? h('span', { class: 'badge st-new' }, 'новое слово') : statusBadge(w.id), EG.ui.levelBadge(w.level))),
        h('div', { class: 'word-prompt' },
          h('span', { lang: en ? 'en' : 'ru' }, q.prompt),
          en ? EG.ui.speakBtn(w.en) : null),
        h('p', { class: 'muted small center' }, EG.data.wordPos[w.pos] + (st === 'learned' ? ' · вы уже знаете это слово — проверим' : '')),
        opts,
        h('div', { class: 'center' }, h('button', { class: 'link-btn dont-know', type: 'button', onclick: function () { pick(-1); } }, 'Не знаю'))));
      shownAt = Date.now();
      if (en) EG.ui.autoSpeak(w.en);
    }

    function answer(item, q, ok, user) {
      var w = item.w, ms = Date.now() - shownAt;
      answeredAny = true;
      if (ok) res.right++; else res.wrong++;
      var tasks = [EG.progress.recordAnswer({
        itemId: 'word:' + w.id, type: 'word-' + item.dir, correct: ok, userAnswer: user, expected: q.answer, ms: ms,
        noMistake: true, xpFactor: 0.5
      })];
      // в прогресс слова идёт первый ответ за сессию, любая ошибка и верный ответ после ошибки
      var had = Object.prototype.hasOwnProperty.call(lastGrade, w.id);
      if (!had || !ok || lastGrade[w.id] === false) {
        lastGrade[w.id] = ok;
        tasks.push(WT().grade(w.id, ok, had ? 0 : ms));
      }
      // ошибка — слово вернётся через несколько вопросов; новое слово закрепляем ещё раз в обратную сторону
      if (!ok && (retries[w.id] || 0) < 2) {
        retries[w.id] = (retries[w.id] || 0) + 1;
        insertLater({ w: w, dir: dirFor(item.dir) }, 3);
      } else if (ok && wasNew[w.id] && !reinforced[w.id] && ms >= 4000) {
        reinforced[w.id] = true;
        insertLater({ w: w, dir: dirFor(item.dir) }, 5);
      }
      Promise.all(tasks).then(function (r) {
        res.xp += r[0] || 0;
        var g = r[1];
        var justLearned = g && g.after.box >= WT().LEARNED_BOX && !(g.before && g.before.box >= WT().LEARNED_BOX);
        if (justLearned) learnedNow[w.id] = true;
        if (!ok) delete learnedNow[w.id];
        feedback(w, ok, g, justLearned);
      }).catch(function (e) { console.error(e); feedback(w, ok, null, false); });
      if (!ok || item.dir === 'ru-en') EG.ui.autoSpeak(w.en);
    }

    function advance() { if (!alive) return; idx++; show(); }

    function feedback(w, ok, g, justLearned) {
      if (!alive) return;
      var line = h('div', { class: 'item-line' }, h('strong', { class: 'en', lang: 'en' }, w.en), EG.ui.speakBtn(w.en, true), h('span', { class: 'ru' }, '— ' + w.ru));
      var note = justLearned ? h('p', { class: 'fb-note' }, icon('check'), 'Слово выучено! Следующий повтор ' + EG.ui.relDue(g.after.due) + '.')
        : ok && g && !g.before && g.after.box >= 3 ? h('p', { class: 'muted small' }, 'Вы знали это слово — покажем его снова только ' + EG.ui.relDue(g.after.due) + '.')
          : null;
      if (ok) {
        foot.replaceChildren(h('div', { class: 'feedback good' },
          h('div', { class: 'fb-head' }, h('span', { class: 'fb-verdict good' }, icon('check'), 'Верно!')), line, note));
        later(advance, justLearned ? 1600 : 900);
        keyHandler = function (e) { if (e.key === 'Enter') { e.preventDefault(); timers.forEach(clearTimeout); timers = []; advance(); } };
        return;
      }
      var b = h('button', { class: 'btn primary block', type: 'button', onclick: advance }, 'Далее', icon('arrow'));
      foot.replaceChildren(h('div', { class: 'feedback bad' },
        h('div', { class: 'fb-head' }, h('span', { class: 'fb-verdict bad' }, icon('x'), 'Неверно')),
        h('p', { class: 'muted small' }, 'Правильно:'), line,
        h('p', { class: 'muted small' }, 'Слово вернётся ещё раз в этой сессии.')), b);
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
      stage.replaceChildren(h('div', { class: 'card finish enter' },
        h('h2', null, 'Сессия завершена'),
        h('div', { class: 'finish-stats' },
          EG.ui.ring(total ? res.right / total * 100 : 0, Math.round(total ? res.right / total * 100 : 0) + '%', 'верно'),
          h('div', { class: 'finish-nums' },
            h('div', null, h('strong', null, res.right + '/' + total), h('span', null, 'верных ответов')),
            h('div', null, h('strong', null, newCount), h('span', null, 'новых слов')),
            h('div', null, h('strong', null, learnedCount), h('span', null, 'стали выученными')),
            h('div', null, h('strong', null, '+' + res.xp), h('span', null, 'XP')))),
        h('div', { class: 'learn-list' }, h('span', { class: 'metric-label' }, 'Слова этой сессии'),
          h('div', { class: 'word-list' }, words.map(function (w) {
            return h('div', { class: 'word vocab-row' + (WT().isLearned(w.id) ? ' learned' : '') },
              h('span', { class: 'word-main' }, h('strong', { lang: 'en' }, w.en), h('span', { class: 'muted' }, w.ru)),
              h('span', { class: 'word-meta' },
                lastGrade[w.id] === false ? h('span', { class: 'badge bad' }, 'повторим скоро') : statusBadge(w.id),
                EG.ui.speakBtn(w.en, true)));
          }))),
        h('div', { class: 'row gap wrap center' },
          h('button', { class: 'btn primary', type: 'button', onclick: function () { EG.router.refresh(); } }, 'Ещё ' + WT().SESSION_SIZE + ' слов'),
          h('a', { class: 'btn ghost', href: '#/vocab' }, 'К словарю'))));
      foot.replaceChildren();
      counter.textContent = '';
    }

    show();
    return function () {
      alive = false;
      saveMinutes();
      timers.forEach(clearTimeout);
      document.removeEventListener('keydown', onKey);
    };
  }

  EG.views.vocab = function (root, params) {
    if (params[0] === 'play') return play(root, params[1]);
    overview(root);
  };
})(window.EG = window.EG || {});
