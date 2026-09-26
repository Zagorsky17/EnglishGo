/* views/reading.js — «Чтение»: связные тексты A1–C1. Нажатие на слово показывает перевод из словаря
   тренажёра (с приведением к начальной форме: went → go, cities → city), слово можно отправить в тренажёр.
   После чтения — тест на понимание. */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  EG.views = EG.views || {};

  var WPM = { A1: 70, A2: 90, B1: 110, B2: 130, C1: 150 }; // скорость чтения для оценки времени
  var listLevel = '';

  var lookup = function (t) { return EG.lexicon.lookup(t); };
  var phraseAt = function (tokens, i) { return EG.lexicon.phraseAt(tokens, i); };
  var norm = function (t) { return EG.lexicon.norm(t); };

  /* ================= список текстов ================= */

  function statusOf(t) { return EG.state.dialogues.get(t.id) || null; }
  function minutes(t) { return Math.max(1, Math.round(t.words / (WPM[t.level] || 100))); }

  function textCard(t) {
    var rec = statusOf(t);
    var topic = EG.data.textTopics[t.topic] || { name: t.topic, emoji: '📄' };
    return h('a', { class: 'scene text-card' + (rec ? ' done' : ''), href: '#/text/' + t.id },
      h('span', { class: 'scene-emoji' }, topic.emoji),
      h('span', { class: 'scene-body' },
        h('strong', { lang: 'en' }, t.title),
        h('span', { class: 'muted small' }, t.titleRu),
        h('span', { class: 'muted small' }, topic.name + ' · ' + t.words + ' слов · ~' + minutes(t) + ' мин · ' + t.questions.length + ' вопросов')),
      h('span', { class: 'scene-meta' }, EG.ui.levelBadge(t.level),
        rec ? h('span', { class: 'badge st-mastered' }, icon('check'), rec.bestScore + '%') : null));
  }

  EG.views.reading = function (root) {
    var eff = EG.progress.effectiveLevel();
    var done = EG.data.texts.filter(statusOf).length;
    var grid = h('div');
    var seg = h('div', { class: 'segmented' }, [''].concat(EG.LEVELS).map(function (l) {
      var n = EG.data.texts.filter(function (t) { return !l || t.level === l; }).length;
      return h('button', { type: 'button', class: l === listLevel ? 'active' : '', onclick: function (e) {
        listLevel = l;
        Array.prototype.forEach.call(seg.children, function (b) { b.classList.toggle('active', b === e.currentTarget); });
        draw();
      } }, (l || 'Все') + ' ', h('span', { class: 'seg-sub' }, String(n)));
    }));

    function draw() {
      grid.replaceChildren();
      EG.LEVELS.forEach(function (lv) {
        if (listLevel && lv !== listLevel) return;
        var items = EG.data.texts.filter(function (t) { return t.level === lv; });
        if (!items.length) return;
        grid.appendChild(h('section', { class: 'level-section' },
          h('h2', { class: 'section-title' }, EG.ui.levelBadge(lv), EG.data.levelNames[lv] || lv,
            lv === eff ? h('span', { class: 'badge st-learning' }, 'ваш уровень') : null),
          h('div', { class: 'scene-grid' }, items.map(textCard))));
      });
    }
    draw();

    root.append(
      EG.ui.pageHead('Чтение', 'Тексты разных уровней и тем. Читайте целиком, нажимайте на незнакомые слова — перевод появится сразу, а слово можно отправить в тренажёр. После чтения — тест на понимание.'),
      h('div', { class: 'row between wrap reading-bar' }, seg, h('span', { class: 'muted small' }, 'Прочитано ' + done + ' из ' + EG.data.texts.length)),
      grid);
  };

  /* ================= текст ================= */

  EG.views.text = function (root, params) {
    var t = EG.data.textsById[params[0]];
    if (!t) { root.append(EG.ui.empty('book', 'Текст не найден', null, h('a', { class: 'btn', href: '#/reading' }, 'К списку текстов'))); return; }
    var topic = EG.data.textTopics[t.topic] || { name: t.topic, emoji: '📄' };
    var lvl = EG.util.levelIndex(t.level);
    var started = Date.now(), minutesSaved = false;
    var keyHandler = null;
    var added = {};
    var tokenSpans = [];

    function onKey(e) {
      if (e.key === 'Escape' && !pop.hidden) { closePop(); return; }
      if (keyHandler && !e.metaKey && !e.ctrlKey && !e.defaultPrevented) keyHandler(e);
    }
    document.addEventListener('keydown', onKey);
    function saveMinutes() {
      if (minutesSaved) return;
      minutesSaved = true;
      var ms = Math.min(Date.now() - started, 60 * 60000);
      if (ms > 20000) EG.progress.addMinutes(ms);
    }

    /* ---------- всплывающая карточка слова ---------- */
    var pop = h('div', { class: 'word-pop', hidden: true, role: 'dialog', 'aria-label': 'Перевод слова' });
    var activeSpan = null;
    function closePop() {
      pop.hidden = true;
      if (activeSpan) activeSpan.classList.remove('active');
      activeSpan = null;
    }

    function entryRow(w) {
      var st = EG.wordTrainer.status(w.id);
      var action = st !== 'new' || added[w.id]
        ? h('span', { class: 'badge ' + (st === 'learned' ? 'st-mastered' : 'st-learning') }, st === 'learned' ? 'выучено' : added[w.id] ? 'добавлено' : 'изучается')
        : h('button', { class: 'btn sm primary', type: 'button', onclick: function () {
          EG.wordTrainer.addToLearning(w.id).then(function () {
            added[w.id] = true;
            EG.ui.toast('«' + w.en + '» — в тренажёре слов', 'good');
            if (activeSpan) showPop(activeSpan);
          }).catch(function () { EG.ui.toast('Не удалось сохранить', 'bad'); });
        } }, icon('plus'), 'Учить');
      return h('div', { class: 'pop-entry' },
        h('div', { class: 'pop-main' },
          h('strong', { lang: 'en' }, w.en), EG.ui.speakBtn(w.en, true),
          h('span', { class: 'muted small' }, EG.data.wordPos[w.pos]), EG.ui.levelBadge(w.level)),
        h('div', { class: 'pop-ru' }, w.ru),
        h('div', { class: 'pop-act' }, action));
    }

    function showPop(span) {
      if (activeSpan && activeSpan !== span) activeSpan.classList.remove('active');
      activeSpan = span;
      span.classList.add('active');
      var info = span._info;
      var token = span.textContent;
      var entries = lookup(token).concat(phraseAt(info.tokens, info.i));
      var seen = [];
      entries = entries.filter(function (w) { if (seen.indexOf(w) >= 0) return false; seen.push(w); return true; });
      var gl = (info.gloss || []).map(function (gi) { return t.glossary[gi]; });
      var lemma = entries[0] && entries[0].en.toLowerCase() !== norm(token) && entries[0].en.indexOf(' ') < 0 ? entries[0].en : null;
      EG.ui.fill(pop,
        h('div', { class: 'row between pop-head' },
          h('span', null, h('strong', { lang: 'en', class: 'pop-token' }, token), lemma ? h('span', { class: 'muted small' }, ' → ' + lemma) : null,
            EG.ui.speakBtn(token, true)),
          h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Закрыть', onclick: closePop }, icon('x'))),
        gl.map(function (g) {
          return h('div', { class: 'pop-gloss' }, h('span', { class: 'badge' }, 'выражение'), h('strong', { lang: 'en' }, g[0]), h('span', null, '— ' + g[1]));
        }),
        EG.lexicon.basic(token) ? h('p', { class: 'pop-basic' }, h('span', { class: 'badge' }, 'служебное слово'), ' ' + EG.lexicon.basic(token)) : null,
        entries.length ? entries.map(entryRow)
          : gl.length || EG.lexicon.basic(token) ? null : h('p', { class: 'muted small' }, 'Этого слова нет в словаре тренажёра. Попробуйте понять его по контексту.'));
      pop.hidden = false;
    }

    /* ---------- текст с кликабельными словами ---------- */

    function renderParagraph(text) {
      var p = h('p', { class: 'reading-p', lang: 'en' });
      var re = /[A-Za-zÀ-ÿ]+(?:[-'’][A-Za-zÀ-ÿ]+)*|[^A-Za-zÀ-ÿ]+/g, m;
      var parts = [], tokens = [];
      while ((m = re.exec(text))) {
        var isWord = /^[A-Za-zÀ-ÿ]/.test(m[0]);
        parts.push({ s: m[0], word: isWord, at: m.index, idx: isWord ? tokens.length : -1 });
        if (isWord) tokens.push(m[0]);
      }
      // выражения из глоссария: отмечаем слова, которые в них входят
      var low = text.toLowerCase().replace(/’/g, "'");
      var glossOf = {};
      t.glossary.forEach(function (g, gi) {
        var needle = g[0].toLowerCase();
        var from = 0, pos;
        while ((pos = low.indexOf(needle, from)) >= 0) {
          var before = pos === 0 || !/[a-z]/.test(low[pos - 1]);
          var after = pos + needle.length >= low.length || !/[a-z]/.test(low[pos + needle.length]);
          if (before && after) {
            parts.forEach(function (pt) {
              if (pt.word && pt.at >= pos && pt.at < pos + needle.length) (glossOf[pt.idx] = glossOf[pt.idx] || []).push(gi);
            });
          }
          from = pos + needle.length;
        }
      });
      parts.forEach(function (pt) {
        if (!pt.word) { p.appendChild(document.createTextNode(pt.s)); return; }
        var span = h('span', { class: 'w', role: 'button', tabindex: '0' }, pt.s);
        span._info = { tokens: tokens, i: pt.idx, gloss: glossOf[pt.idx] || null };
        span._word = lookup(pt.s)[0] || null;
        tokenSpans.push(span);
        p.appendChild(span);
      });
      p.addEventListener('click', function (e) {
        var s = e.target.closest('.w');
        if (s) showPop(s);
      });
      p.addEventListener('keydown', function (e) {
        var s = e.target.closest && e.target.closest('.w');
        if (s && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); showPop(s); }
      });
      return p;
    }

    var body = h('div', { class: 'reading-body' });

    function showReading() {
      keyHandler = null;
      tokenSpans = [];
      var article = h('article', { class: 'card reading-text' },
        t.paragraphs.map(function (para) {
          var p = renderParagraph(para);
          return h('div', { class: 'reading-para' }, p);
        }));
      // озвучка — одной кнопкой над текстом, чтобы в самом тексте не было ничего лишнего
      var listen = EG.ui.canSpeak() ? h('button', { class: 'btn ghost sm', type: 'button', onclick: function () {
        EG.ui.speak(t.paragraphs.join(' '));
      } }, icon('speaker'), 'Прослушать текст') : null;
      var glossary = t.glossary.length ? h('section', { class: 'card' },
        h('h3', { class: 'card-title' }, 'Полезные выражения из текста'),
        h('div', { class: 'gloss-list' }, t.glossary.map(function (g) {
          return h('div', { class: 'gloss-row' }, h('strong', { lang: 'en' }, g[0]), EG.ui.speakBtn(g[0], true), h('span', { class: 'muted' }, g[1]));
        }))) : null;
      body.replaceChildren(
        h('div', { class: 'row between wrap reading-bar' },
          h('span', { class: 'muted small' }, 'Нажмите на любое слово — появится перевод.'),
          listen),
        article,
        glossary,
        h('div', { class: 'row gap wrap story-actions' },
          h('button', { class: 'btn primary', type: 'button', onclick: startQuiz }, 'Проверить понимание (' + t.questions.length + ' вопросов)', icon('arrow'))));
    }

    /* ---------- тест ---------- */
    function startQuiz() {
      closePop();
      var idx = 0, right = 0;
      // варианты перемешиваем (кроме «верно/неверно»), чтобы правильный ответ не стоял всегда на одном месте
      var orders = t.questions.map(function (q) {
        var ids = q.options.map(function (_, i) { return i; });
        return q.options.length > 2 ? EG.util.shuffle(ids) : ids;
      });
      function renderQ() {
        var q = t.questions[idx], order = orders[idx];
        var locked = false;
        var en = EG.util.levelIndex(t.level) >= 2;
        var btns = order.map(function (oi, k) {
          return h('button', { class: 'option', type: 'button', onclick: function () { pick(k); } },
            h('span', { class: 'opt-key' }, String(k + 1)), h('span', { class: 'opt-text', lang: en ? 'en' : 'ru' }, q.options[oi]));
        });
        var foot = h('div');
        function pick(k) {
          if (locked) return;
          locked = true;
          var oi = order[k], ok = oi === q.answer;
          if (ok) right++;
          btns.forEach(function (b, j) {
            b.disabled = true;
            if (order[j] === q.answer) b.classList.add('correct');
            if (j === k && !ok) b.classList.add('wrong');
          });
          EG.progress.recordAnswer({ itemId: 'text:' + t.id + ':' + idx, type: 'text', correct: ok, userAnswer: q.options[oi], expected: q.options[q.answer], noMistake: true, xpFactor: 0.8 });
          var next = h('button', { class: 'btn primary block', type: 'button', onclick: advance }, idx + 1 < t.questions.length ? 'Следующий вопрос' : 'Результат', icon('arrow'));
          foot.replaceChildren(h('div', { class: 'feedback ' + (ok ? 'good' : 'bad') },
            h('div', { class: 'fb-head' }, h('span', { class: 'fb-verdict ' + (ok ? 'good' : 'bad') }, icon(ok ? 'check' : 'x'), ok ? 'Верно!' : 'Неверно')),
            !ok ? h('p', null, 'Правильный ответ: ', h('strong', null, q.options[q.answer])) : null,
            q.explain ? h('p', { class: 'fb-note' }, icon('bulb'), q.explain) : null), next);
          keyHandler = function (e) { if (e.key === 'Enter') { e.preventDefault(); advance(); } };
          setTimeout(function () { next.focus(); }, 30);
        }
        function advance() { keyHandler = null; idx++; if (idx < t.questions.length) renderQ(); else finish(right); }
        keyHandler = function (e) { var n = parseInt(e.key, 10); if (n >= 1 && n <= btns.length) { e.preventDefault(); pick(n - 1); } };
        body.replaceChildren(h('div', { class: 'card ex-card enter' },
          h('div', { class: 'row between' }, h('div', { class: 'ex-label' }, icon('book'), 'Вопрос ' + (idx + 1) + ' из ' + t.questions.length),
            h('button', { class: 'link-btn', type: 'button', onclick: function () { keyHandler = null; showReading(); } }, 'Перечитать текст')),
          EG.ui.bar(idx / t.questions.length * 100),
          h('p', { class: 'big-ru', lang: en ? 'en' : 'ru' }, q.q),
          h('div', { class: 'options' + (en ? ' en' : '') }, btns),
          foot));
        window.scrollTo(0, 0);
      }
      renderQ();
    }

    /** Слова текста уровня текста и выше, которых ещё нет в тренажёре. */
    function newWords() {
      var out = [], seen = {};
      tokenSpans.forEach(function (s) {
        var w = s._word;
        if (!w || seen[w.id] || EG.wordTrainer.rec(w.id) || EG.util.levelIndex(w.level) < lvl) return;
        seen[w.id] = true;
        out.push(w);
      });
      return out.slice(0, 12);
    }

    function finish(right) {
      var score = Math.round(right / t.questions.length * 100);
      saveMinutes();
      var fresh = newWords();
      var addAll = fresh.length ? h('button', { class: 'btn ghost', type: 'button', onclick: function () {
        addAll.disabled = true;
        Promise.all(fresh.map(function (w) { return EG.wordTrainer.addToLearning(w.id); })).then(function () {
          EG.ui.toast('Добавлено в тренажёр: ' + fresh.length + ' ' + EG.util.plural(fresh.length, 'слово', 'слова', 'слов'), 'good');
          addAll.textContent = 'Слова добавлены ✓';
        }).catch(function () { addAll.disabled = false; EG.ui.toast('Не удалось сохранить', 'bad'); });
      } }, icon('plus'), 'Добавить все в тренажёр') : null;
      EG.progress.completeDialogue(t.id, 'text', score).then(function (xp) {
        var next = EG.data.texts.filter(function (x) { return x.id !== t.id && !statusOf(x) && EG.util.levelIndex(x.level) >= lvl; })
          .sort(function (a, b) { return EG.util.levelIndex(a.level) - EG.util.levelIndex(b.level) || a.order - b.order; })[0];
        body.replaceChildren(h('div', { class: 'card finish enter' },
          h('h2', null, score === 100 ? 'Всё понято! 🎉' : score >= 70 ? 'Хорошее понимание!' : 'Стоит перечитать'),
          h('div', { class: 'finish-stats' }, EG.ui.ring(score, right + '/' + t.questions.length, 'верно'),
            h('div', { class: 'finish-nums' },
              h('div', null, h('strong', null, '+' + (xp || 0)), h('span', null, 'XP')),
              h('div', null, h('strong', null, t.words), h('span', null, 'слов прочитано')))),
          fresh.length ? h('div', { class: 'learn-list' },
            h('span', { class: 'metric-label' }, 'Новые слова уровня ' + t.level + ' из текста'),
            h('div', { class: 'chips' }, fresh.map(function (w) { return h('span', { class: 'chip static' }, h('span', { lang: 'en' }, w.en), h('span', { class: 'muted' }, ' — ' + w.ru)); })),
            h('div', { class: 'row gap wrap' }, addAll)) : null,
          h('div', { class: 'row gap wrap center' },
            h('button', { class: 'btn ghost', type: 'button', onclick: showReading }, 'Перечитать'),
            next ? h('a', { class: 'btn primary', href: '#/text/' + next.id }, 'Следующий текст: ' + next.title) : h('a', { class: 'btn primary', href: '#/reading' }, 'Все тексты'))));
        window.scrollTo(0, 0);
      }).catch(function (e) { console.error(e); });
    }

    root.append(
      h('a', { class: 'back-link', href: '#/reading' }, icon('back'), 'Чтение'),
      h('div', { class: 'scene-head card' },
        h('div', { class: 'row between' }, h('h1', { lang: 'en' }, t.title), EG.ui.levelBadge(t.level)),
        h('p', { class: 'muted' }, t.titleRu),
        h('p', { class: 'muted small' }, topic.emoji + ' ' + topic.name + ' · ' + t.words + ' слов · ~' + minutes(t) + ' мин чтения')),
      body, pop);
    showReading();

    return function () {
      saveMinutes();
      document.removeEventListener('keydown', onKey);
    };
  };

})(window.EG = window.EG || {});
