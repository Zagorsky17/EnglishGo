/* grammar/grammar-ui.js — компоненты раздела «Грамматика»: подсветка примеров, блоки урока и
   спокойный плеер упражнений (без таймеров и «жизней»: ошибка → короткое объяснение → задание
   вернётся в конце). Пишет только в EG.grammar.ui; из приложения берёт лишь EG.ui.h / icon / speakBtn. */
(function (EG) {
  'use strict';

  var G = EG.grammar = EG.grammar || {};
  var h = EG.ui.h, icon = EG.ui.icon;

  var TYPE_LABEL = {
    meaning: 'Определи смысл', tense: 'Определи время', choose: 'Выбери вариант',
    build: 'Собери предложение', fix: 'Исправь ошибку', situation: 'Ситуация'
  };
  var TYPE_PROMPT = {
    meaning: 'Что значит эта фраза?', tense: 'Какое это время или конструкция?', choose: 'Какой вариант подходит?',
    build: 'Нажимайте на слова по порядку', fix: 'Исправьте фразу — достаточно поменять пару слов', situation: 'Что сказать?'
  };

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  /** «I [have lost] my keys» → текст с подсветкой; «___» → пропуск. */
  function mark(text, fill) {
    var out = [];
    String(text || '').split(/(\[[^\]]+\]|___)/).forEach(function (part) {
      if (!part) return;
      if (part === '___') out.push(fill ? h('mark', { class: 'gr-key' }, fill) : h('span', { class: 'gr-gap' }, ' '));
      else if (part.charAt(0) === '[') out.push(h('mark', { class: 'gr-key' }, part.slice(1, -1)));
      else out.push(part);
    });
    return h('span', { lang: 'en' }, out);
  }
  function plain(text) { return String(text || '').replace(/[\[\]]/g, ''); }

  function speak(text) { return EG.ui.speakBtn ? EG.ui.speakBtn(plain(text), true) : null; }

  /** Пример: английская фраза с подсветкой + перевод. */
  function example(pair) {
    return h('div', { class: 'gr-ex' },
      h('div', { class: 'gr-ex-en' }, mark(pair[0]), speak(pair[0])),
      pair[1] ? h('div', { class: 'gr-ex-ru' }, pair[1]) : null);
  }

  /** Сворачиваемый блок: подробности не перегружают экран. */
  function fold(title, body, open) {
    return h('details', { class: 'gr-fold', open: !!open }, h('summary', null, title), h('div', { class: 'gr-fold-body' }, body));
  }

  function formula(rows) {
    return h('div', { class: 'gr-formula' }, rows.map(function (r) {
      return h('div', { class: 'gr-f-row' }, r[0] ? h('span', { class: 'gr-f-tag' }, r[0]) : null, h('span', { class: 'gr-f-text', lang: 'en' }, r[1]));
    }));
  }

  /** «Не путай» — две колонки. */
  function versus(a, b, aName, bName) {
    function col(x, name) {
      return h('div', { class: 'gr-vs-col' },
        name ? h('div', { class: 'gr-vs-name' }, name) : null,
        h('div', { class: 'gr-vs-en' }, mark(x[0]), speak(x[0])),
        h('div', { class: 'gr-vs-means' }, '→ ' + x[1]));
    }
    return h('div', { class: 'gr-vs' }, col(a, aName), col(b, bName));
  }

  function mistakesList(list) {
    return h('div', { class: 'gr-mistakes' }, list.map(function (m) {
      return h('div', { class: 'gr-mis' },
        h('div', { class: 'gr-mis-wrong', lang: 'en' }, icon('x'), m[0]),
        h('div', { class: 'gr-mis-right', lang: 'en' }, icon('check'), m[1]),
        m[2] ? h('div', { class: 'gr-mis-why' }, m[2]) : null);
    }));
  }

  function bulletList(items) {
    return h('ul', { class: 'gr-list' }, items.map(function (s) { return h('li', null, s); }));
  }

  /* ================= проверка ответов ================= */

  // нормализация как во всём приложении (сокращения I've → I have), если ядро доступно
  function norm(s) {
    var t = EG.text && EG.text.normalize ? EG.text.normalize(s) : String(s || '').toLowerCase().replace(/[^a-z0-9'\s]/g, ' ');
    return t.replace(/\s+/g, ' ').trim();
  }
  function lev(a, b) {
    if (EG.text && EG.text.lev) return EG.text.lev(a, b);
    return a === b ? 0 : 99;
  }
  /** Исправление: точное совпадение — верно; опечатка в 1–2 буквы — тоже верно, но с подсказкой. */
  function checkFix(value, ex) {
    var v = norm(value);
    if (!v || v === norm(ex.text)) return { ok: false };
    for (var i = 0; i < ex.accept.length; i++) {
      var a = norm(ex.accept[i]);
      if (v === a) return { ok: true };
      if (a.length > 12 && lev(v, a) <= 2) return { ok: true, typo: ex.accept[i] };
    }
    return { ok: false };
  }

  function words(sentence) {
    var end = (sentence.match(/[.?!]+$/) || [''])[0];
    return { list: sentence.replace(/[.?!]+$/, '').split(/\s+/), end: end };
  }

  /* ================= плеер упражнений ================= */

  /**
   * Короткая сессия упражнений.
   * opts: { title, exitHref, onAnswer(ex, ok), finish: { title, actions:[{label, href, primary}] } }
   * Возвращает функцию очистки (снимает обработчик клавиш).
   */
  function run(root, items, opts) {
    opts = opts || {};
    var queue = items.slice();
    var pos = 0, firstOk = 0, firstTotal = items.length, keyHandler = null;

    var bar = h('span');
    var counter = h('span', { class: 'muted small' });
    var stage = h('div', { class: 'gr-stage' });
    var foot = h('div', { class: 'gr-foot' });
    root.append(h('div', { class: 'gr-run' },
      h('div', { class: 'gr-run-top' },
        h('a', { class: 'icon-btn', href: opts.exitHref || '#/grammar', title: 'Завершить', 'aria-label': 'Завершить' }, icon('x')),
        h('div', { class: 'bar thin gr-run-bar' }, bar), counter),
      opts.title ? h('div', { class: 'gr-run-title muted small' }, opts.title) : null,
      stage, foot));

    function onKey(e) {
      if (keyHandler && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.altKey) keyHandler(e);
    }
    document.addEventListener('keydown', onKey);

    function progress() {
      bar.style.width = Math.round(pos / queue.length * 100) + '%';
      counter.textContent = Math.min(pos + 1, queue.length) + ' / ' + queue.length;
    }

    function next() {
      keyHandler = null;
      foot.replaceChildren();
      if (pos >= queue.length) return finish();
      progress();
      show(queue[pos]);
    }

    function show(ex) {
      var body;
      if (ex.type === 'build') body = buildView(ex);
      else if (ex.type === 'fix') body = fixView(ex);
      else body = choiceView(ex);
      stage.replaceChildren(h('div', { class: 'card gr-card enter' },
        h('div', { class: 'ex-label' }, TYPE_LABEL[ex.type] || '', ex.retry ? h('span', { class: 'gr-again' }, 'ещё раз') : null),
        body));
    }

    function question(ex) {
      if (ex.type === 'situation') return h('p', { class: 'gr-situation' }, ex.text);
      return h('div', { class: 'gr-q' }, mark(ex.text), ex.type === 'choose' ? null : speak(ex.text));
    }

    // «Перевод» под фразой: в «Ситуации» перевод подсказал бы ответ — там он только в разборе
    function ruToggle(ex) {
      if (!ex.ru || ex.type === 'situation') return null;
      var ruLine = h('p', { class: 'gr-ex-ru gr-q-ru', hidden: true }, ex.ru);
      return h('div', { class: 'gr-ru-wrap' }, ruLine,
        h('button', { class: 'link-btn', type: 'button', onclick: function (e) {
          ruLine.hidden = !ruLine.hidden;
          e.currentTarget.textContent = ruLine.hidden ? 'Перевод' : 'Скрыть перевод';
        } }, 'Перевод'));
    }

    function choiceView(ex) {
      var opts2 = shuffle(ex.options);
      var right = ex.options[0];
      var btns = [];
      var isEn = ex.type === 'choose' || ex.type === 'situation';
      var list = h('div', { class: 'options' + (isEn ? ' en' : '') }, opts2.map(function (o, i) {
        var b = h('button', { class: 'option', type: 'button', onclick: function () { pick(i); } },
          h('span', { class: 'opt-key' }, String(i + 1)), h('span', { class: 'opt-text', lang: isEn ? 'en' : null }, o));
        btns.push(b);
        return b;
      }));
      var q = question(ex);
      function pick(i) {
        if (btns[0].disabled) return;
        var ok = opts2[i] === right;
        btns.forEach(function (b, j) {
          b.disabled = true;
          if (opts2[j] === right) b.classList.add('correct');
          if (j === i && !ok) b.classList.add('wrong');
        });
        // в задании с пропуском показываем фразу целиком
        if (ex.type === 'choose') EG.ui.fill(q, mark(ex.text, right), speak(ex.text.replace('___', right)));
        answered(ex, ok, opts2[i], right);
      }
      keyHandler = function (e) {
        var n = parseInt(e.key, 10);
        if (n >= 1 && n <= btns.length) { e.preventDefault(); pick(n - 1); }
      };
      return [h('p', { class: 'prompt' }, TYPE_PROMPT[ex.type]), q, ruToggle(ex), list];
    }

    function buildView(ex) {
      var w = words(ex.answer);
      var pool = shuffle(w.list.map(function (x) { return { w: x, used: false }; }));
      if (pool.map(function (p) { return p.w; }).join(' ') === w.list.join(' ') && pool.length > 1) pool.reverse();
      var chosen = [], done = false;
      var line = h('div', { class: 'build-line gr-build-line' });
      var bank = h('div', { class: 'build-bank' });
      var reset = h('button', { class: 'btn ghost sm', type: 'button', onclick: function () {
        if (done) return; chosen.forEach(function (p) { p.used = false; }); chosen = []; draw();
      } }, 'Сбросить');
      function draw() {
        line.replaceChildren.apply(line, chosen.length ? chosen.map(function (p, k) {
          return h('button', { class: 'chip', type: 'button', disabled: done, onclick: function () { if (done) return; p.used = false; chosen.splice(k, 1); draw(); } }, p.w);
        }) : [h('span', { class: 'muted small' }, 'Нажимайте на слова по порядку')]);
        bank.replaceChildren.apply(bank, pool.map(function (p) {
          return h('button', { class: 'chip' + (p.used ? ' used' : ''), type: 'button', disabled: p.used || done, onclick: function () {
            p.used = true; chosen.push(p); draw();
            if (chosen.length === pool.length) check();
          } }, p.w);
        }));
      }
      function check() {
        done = true;
        var v = chosen.map(function (p) { return p.w; }).join(' ');
        var ok = norm(v) === norm(w.list.join(' '));
        line.classList.add(ok ? 'ok' : 'bad');
        draw();
        answered(ex, ok, v + w.end, ex.answer);
      }
      keyHandler = function (e) {
        if (e.key === 'Backspace' && chosen.length && !done) { e.preventDefault(); chosen.pop().used = false; draw(); }
      };
      draw();
      return [h('p', { class: 'prompt' }, 'Соберите по-английски: ', h('strong', null, ex.ru)), line, bank, h('div', { class: 'row gap' }, reset)];
    }

    function fixView(ex) {
      var input = h('input', { type: 'text', class: 'input big', value: ex.text, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', lang: 'en', 'aria-label': 'Исправленная фраза' });
      var done = false;
      function submit(giveUp) {
        if (done) return;
        var r = giveUp ? { ok: false } : checkFix(input.value, ex);
        // та же фраза без правок — подсказываем, а не засчитываем ошибку
        if (!giveUp && norm(input.value) === norm(ex.text)) { hint.textContent = 'Пока фраза не изменилась — найдите ошибку и поправьте её.'; return; }
        done = true;
        input.disabled = true;
        input.classList.add(r.ok ? 'gr-ok' : 'gr-bad');
        answered(ex, r.ok, giveUp ? '' : input.value.trim(), ex.accept[0], r.typo ? 'Засчитано, но проверьте написание: ' + r.typo : '');
      }
      var hint = h('p', { class: 'muted small gr-hint' });
      keyHandler = function (e) { if (e.key === 'Enter' && document.activeElement === input) { e.preventDefault(); submit(false); } };
      setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) { /* нет фокуса */ } }, 30);
      return [h('p', { class: 'prompt' }, TYPE_PROMPT.fix),
        h('div', { class: 'gr-q gr-q-wrong', lang: 'en' }, ex.text), ruToggle(ex),
        input, hint,
        h('div', { class: 'row gap wrap gr-actions' },
          h('button', { class: 'btn primary', type: 'button', onclick: function () { submit(false); } }, 'Проверить'),
          h('button', { class: 'btn ghost', type: 'button', onclick: function () { submit(true); } }, 'Показать ответ'))];
    }

    function answered(ex, ok, user, right, note) {
      keyHandler = null;
      if (!ex.retry) { if (ok) firstOk++; }
      if (opts.onAnswer) { try { opts.onAnswer(ex, ok); } catch (e) { console.error(e); } }
      if (!ok && !ex.retry) queue.push(Object.assign({}, ex, { retry: true }));
      var tone = ok ? 'good' : 'bad';
      var btn = h('button', { class: 'btn primary block', type: 'button', onclick: go }, pos + 1 >= queue.length ? 'Завершить' : 'Дальше', icon('arrow'));
      function go() { pos++; next(); }
      foot.replaceChildren(h('div', { class: 'feedback gr-fb ' + tone },
        h('div', { class: 'fb-head' }, h('span', { class: 'fb-verdict ' + tone }, icon(ok ? 'check' : 'bulb'), ok ? (ex.retry ? 'Теперь верно!' : 'Верно!') : 'Не совсем')),
        !ok ? h('p', { class: 'fb-answer' }, h('span', { class: 'muted' }, 'Правильно: '), h('strong', { lang: /[a-z]/i.test(right) ? 'en' : null }, right)) : null,
        ex.ru ? h('p', { class: 'gr-ex-ru' }, h('span', { class: 'muted' }, 'Перевод: '), ex.ru) : null,
        ex.explain ? h('p', { class: 'gr-explain' }, ex.explain) : null,
        note ? h('p', { class: 'muted small' }, note) : null,
        !ok && !ex.retry ? h('p', { class: 'muted small' }, 'Ничего страшного — это задание вернётся в конце.') : null
      ), btn);
      keyHandler = function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } };
      setTimeout(function () { try { btn.focus({ preventScroll: true }); } catch (e) { /* нет фокуса */ } }, 30);
      if (EG.ui.scrollToEnd) EG.ui.scrollToEnd(foot);
    }

    function finish() {
      keyHandler = null;
      bar.style.width = '100%';
      counter.textContent = '';
      var pct = firstTotal ? Math.round(firstOk / firstTotal * 100) : 100;
      var mood = pct === 100 ? 'Отлично — всё с первого раза!' : pct >= 70 ? 'Хорошо! Ошибки вы уже разобрали.' : 'Тема ещё «укладывается» — это нормально. Повторите через день, и станет легче.';
      var f = opts.finish || {};
      stage.replaceChildren(h('div', { class: 'card gr-card gr-finish enter' },
        h('h2', null, f.title || 'Готово!'),
        h('p', { class: 'gr-finish-score' }, h('strong', null, firstOk + ' из ' + firstTotal), ' с первого раза'),
        h('p', { class: 'muted' }, mood),
        h('div', { class: 'row gap wrap gr-actions' }, (f.actions || [{ label: 'К грамматике', href: '#/grammar', primary: true }]).map(function (a) {
          return h('a', { class: 'btn' + (a.primary ? ' primary' : ' ghost'), href: a.href }, a.label);
        }))));
      foot.replaceChildren();
      if (opts.onFinish) { try { opts.onFinish({ correct: firstOk, total: firstTotal }); } catch (e) { console.error(e); } }
    }

    next();
    return function () { document.removeEventListener('keydown', onKey); };
  }

  G.ui = {
    mark: mark, plain: plain, example: example, fold: fold, formula: formula, versus: versus,
    mistakesList: mistakesList, bulletList: bulletList, speak: speak, shuffle: shuffle,
    run: run, checkFix: checkFix, norm: norm, words: words, TYPE_LABEL: TYPE_LABEL
  };
})(window.EG = window.EG || {});
