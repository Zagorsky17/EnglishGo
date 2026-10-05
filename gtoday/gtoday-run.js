/* gtoday/gtoday-run.js — плеер упражнений раздела «Грамматика сегодня».
   Спокойный режим: без таймеров и «жизней». Ошибка → разбор («детектор» + сигнал) → задание вернётся в конце.
   Виды: intro (знакомство с новым временем), steps (детектор в 2 шага), identify (назови время),
   choose (выбери форму), pair (какая фраза точнее передаёт смысл). Пишет только в EG.gtoday.run. */
(function (EG) {
  'use strict';

  var GT = EG.gtoday = EG.gtoday || {};
  var h = EG.ui.h, icon = EG.ui.icon;
  var TIME_KEYS = ['past', 'present', 'future'];
  var ASPECT_KEYS = ['simple', 'continuous', 'perfect', 'perfcont'];

  var LABEL = { intro: 'Новое время', steps: 'Детектор времени', identify: 'Определи время', choose: 'Выбери форму', pair: 'Что точнее?' };

  function D() { return GT.data; }
  function tense(id) { return D().tensesById[id]; }

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  /** «I [have lost] my keys» → подсветка; «___» → пропуск; fill — чем заполнить пропуск. */
  function mark(text, fill) {
    var out = [];
    String(text || '').split(/(\[[^\]]+\]|___)/).forEach(function (part) {
      if (!part) return;
      if (part === '___') out.push(fill ? h('mark', { class: 'gt-key' }, fill) : h('span', { class: 'gt-gap' }, ' '));
      else if (part.charAt(0) === '[') out.push(h('mark', { class: 'gt-key' }, part.slice(1, -1)));
      else out.push(part);
    });
    return h('span', { lang: 'en' }, out);
  }
  function plain(text) { return String(text || '').replace(/[[\]]/g, ''); }
  function gapped(en) { return en.replace(/\[[^\]]+\]/, '___'); }
  function speak(text) { return EG.ui.speakBtn ? EG.ui.speakBtn(plain(text), true) : null; }

  /** «Сейчас → Результат → Present Perfect» — как время собирается из двух ответов. */
  function chain(t) {
    return h('div', { class: 'gt-chain' },
      h('span', { class: 'gt-chip' }, h('strong', { lang: 'en' }, D().timeNames[t.time]), ' · ' + D().times[t.time].toLowerCase()), h('span', { class: 'gt-arrow' }, '→'),
      h('span', { class: 'gt-chip' }, h('strong', { lang: 'en' }, D().aspectNames[t.aspect]), ' · ' + D().aspects[t.aspect].toLowerCase()), h('span', { class: 'gt-arrow' }, '→'),
      h('strong', { lang: 'en' }, t.name));
  }

  function ruToggle(ru) {
    if (!ru) return null;
    var line = h('p', { class: 'gt-ru', hidden: true }, ru);
    return h('div', { class: 'gt-ru-wrap' }, line,
      h('button', { class: 'link-btn', type: 'button', onclick: function (e) {
        line.hidden = !line.hidden;
        e.currentTarget.textContent = line.hidden ? 'Перевод' : 'Скрыть перевод';
      } }, 'Перевод'));
  }

  /**
   * opts: { title, exitHref, onAnswer(ex, ok), onFinish({correct, total}), actions:[{label, href, primary}] }
   * Возвращает функцию очистки (снимает обработчик клавиш).
   */
  function run(root, list, opts) {
    opts = opts || {};
    var queue = list.slice();
    var pos = 0, firstOk = 0, keyHandler = null;
    var firstTotal = list.filter(function (e) { return e.kind !== 'intro'; }).length;
    var missed = {};

    var bar = h('span');
    var counter = h('span', { class: 'muted small' });
    var stage = h('div', { class: 'gt-stage' });
    var foot = h('div', { class: 'gt-foot' });
    root.append(h('div', { class: 'gt-run' },
      h('div', { class: 'gt-run-top' },
        h('a', { class: 'icon-btn', href: opts.exitHref || '#/gtoday', title: 'Завершить', 'aria-label': 'Завершить' }, icon('x')),
        h('div', { class: 'bar thin gt-run-bar' }, bar), counter),
      opts.title ? h('div', { class: 'gt-run-title muted small' }, opts.title) : null,
      stage, foot));

    function onKey(e) {
      if (keyHandler && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.altKey) keyHandler(e);
    }
    document.addEventListener('keydown', onKey);

    function next() {
      keyHandler = null;
      foot.replaceChildren();
      if (pos >= queue.length) return finish();
      bar.style.width = Math.round(pos / queue.length * 100) + '%';
      counter.textContent = (pos + 1) + ' / ' + queue.length;
      var ex = queue[pos];
      var body = ex.kind === 'intro' ? introView(ex) : ex.kind === 'steps' ? stepsView(ex) : ex.kind === 'pair' ? pairView(ex) : choiceView(ex);
      stage.replaceChildren(h('div', { class: 'card gt-card enter' },
        h('div', { class: 'ex-label' }, LABEL[ex.kind], ex.retry ? h('span', { class: 'gt-again' }, 'ещё раз') : null),
        body));
    }

    function go() { pos++; next(); }

    /** Кнопки вариантов; pick(i) вызывается один раз. keys — разрешить цифры на клавиатуре. */
    function optionList(labels, onPick, en) {
      var btns = [];
      var box = h('div', { class: 'options' + (en ? ' en' : '') }, labels.map(function (l, i) {
        var b = h('button', { class: 'option', type: 'button', onclick: function () { pick(i); } },
          h('span', { class: 'opt-key' }, String(i + 1)), l);
        btns.push(b);
        return b;
      }));
      function pick(i) {
        if (btns[0].disabled) return;
        btns.forEach(function (b) { b.disabled = true; });
        onPick(i, btns);
      }
      keyHandler = function (e) {
        var n = parseInt(e.key, 10);
        if (n >= 1 && n <= btns.length) { e.preventDefault(); pick(n - 1); }
      };
      return box;
    }
    function markBtns(btns, right, chosen) {
      btns.forEach(function (b, j) {
        if (j === right) b.classList.add('correct');
        if (j === chosen && chosen !== right) b.classList.add('wrong');
      });
    }

    /* ---------- знакомство с новым временем ---------- */
    function introView(ex) {
      var t = tense(ex.tense);
      var btn = h('button', { class: 'btn primary', type: 'button', onclick: go }, 'Понятно, к заданиям', icon('arrow'));
      keyHandler = function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } };
      setTimeout(function () { try { btn.focus({ preventScroll: true }); } catch (e) { /* нет фокуса */ } }, 30);
      return [
        h('h2', { class: 'gt-intro-name', lang: 'en' }, t.name),
        h('p', { class: 'gt-intro-ru' }, t.ru),
        chain(t),
        h('p', { class: 'gt-intro-point' }, t.point),
        h('div', { class: 'gt-intro-form' }, h('span', { class: 'muted small' }, 'Форма: '), h('code', null, t.form)),
        h('div', { class: 'gt-intro-ex' }, h('div', { class: 'gt-q gt-q-sm' }, mark(t.ex[0]), speak(t.ex[0])), h('p', { class: 'gt-ru' }, t.ex[1])),
        h('div', { class: 'gt-actions' }, btn)
      ];
    }

    /* ---------- детектор: точка отсчёта → что главное ---------- */
    function stepsView(ex) {
      var it = ex.item, t = tense(it.tense);
      var okTime = false;
      var step2 = h('div', { class: 'gt-step' });
      var note1 = h('p', { class: 'gt-step-note', hidden: true });
      // карточка варианта: оригинальное английское название + короткая подсказка по-русски
      function card(en, ru) { return h('span', { class: 'opt-text gt-opt-tense' }, h('strong', { lang: 'en' }, en), h('span', { class: 'muted small' }, ru)); }
      var step1 = h('div', { class: 'gt-step' },
        h('p', { class: 'prompt' }, h('strong', null, 'Шаг 1. '), 'Группа времени: Past, Present или Future?'),
        optionList(TIME_KEYS.map(function (k) { return card(D().timeNames[k], D().times[k]); }), function (i, btns) {
          var right = TIME_KEYS.indexOf(t.time);
          okTime = i === right;
          markBtns(btns, right, i);
          note1.textContent = (okTime ? '' : 'Нет, ' + D().timeNames[t.time] + '. ') + t.point;
          note1.hidden = false;
          note1.classList.add(okTime ? 'good' : 'bad');
          showStep2();
        }),
        note1);

      function showStep2() {
        step2.append(
          h('p', { class: 'prompt' }, h('strong', null, 'Шаг 2. '), 'Какое именно время? Что здесь главное?'),
          // варианты — все четыре времени верной группы: Present Simple, Present Continuous…
          optionList(ASPECT_KEYS.map(function (k) { return card(D().timeNames[t.time] + ' ' + D().aspectNames[k], D().aspects[k]); }), function (i, btns) {
            var right = ASPECT_KEYS.indexOf(t.aspect);
            markBtns(btns, right, i);
            answered(ex, okTime && i === right, t.name);
          }));
        if (EG.ui.scrollToEnd) EG.ui.scrollToEnd(step2);
      }
      return [h('div', { class: 'gt-q' }, mark(it.en), speak(it.en)), ruToggle(it.ru), step1, step2];
    }

    /* ---------- назови время / выбери форму ---------- */
    function choiceView(ex) {
      var it = ex.item;
      var isName = ex.kind === 'identify';
      var right = isName ? it.tense : it.answer;
      var opts2 = shuffle(isName ? ex.options : [it.answer].concat(it.wrong));
      var q = h('div', { class: 'gt-q' }, mark(isName ? it.en : gapped(it.en)), isName ? speak(it.en) : null);
      var labels = opts2.map(function (o) {
        if (!isName) return h('span', { class: 'opt-text', lang: 'en' }, o);
        var t = tense(o);
        return h('span', { class: 'opt-text gt-opt-tense' }, h('strong', { lang: 'en' }, t.name), h('span', { class: 'muted small' }, t.ru));
      });
      var list = optionList(labels, function (i, btns) {
        var r = opts2.indexOf(right);
        markBtns(btns, r, i);
        if (!isName) EG.ui.fill(q, mark(gapped(it.en), it.answer), speak(it.en));
        answered(ex, i === r, isName ? tense(it.tense).name : it.answer);
      }, !isName);
      return [h('p', { class: 'prompt' }, isName ? 'Какое это время?' : 'Какая форма подходит?'), q, ruToggle(it.ru), list];
    }

    /* ---------- пара: смысл → фраза ---------- */
    function pairView(ex) {
      var it = ex.item;
      var opts2 = shuffle([it.right, it.wrong]);
      var list = optionList(opts2.map(function (o) { return h('span', { class: 'opt-text', lang: 'en' }, o); }), function (i, btns) {
        var r = opts2.indexOf(it.right);
        markBtns(btns, r, i);
        answered(ex, i === r, it.right);
      }, true);
      return [h('p', { class: 'prompt' }, 'Какая фраза точнее передаёт смысл?'), h('p', { class: 'gt-meaning' }, it.ru), list];
    }

    /* ---------- разбор ---------- */
    function answered(ex, ok, right) {
      keyHandler = null;
      var it = ex.item, t = tense(it.tense);
      if (!ex.retry && ok) firstOk++;
      if (!ok) missed[it.tense] = (missed[it.tense] || 0) + 1;
      if (opts.onAnswer) { try { opts.onAnswer(ex, ok); } catch (e) { console.error(e); } }
      if (!ok && !ex.retry) queue.push(Object.assign({}, ex, { retry: true }));
      var tone = ok ? 'good' : 'bad';
      var say = it.right;
      var btn = h('button', { class: 'btn primary block', type: 'button', onclick: go }, pos + 1 >= queue.length ? 'Завершить' : 'Дальше', icon('arrow'));
      foot.replaceChildren(h('div', { class: 'feedback gt-fb ' + tone },
        h('div', { class: 'fb-head' }, h('span', { class: 'fb-verdict ' + tone }, icon(ok ? 'check' : 'bulb'), ok ? (ex.retry ? 'Теперь верно!' : 'Верно!') : 'Не совсем')),
        !ok ? h('p', { class: 'fb-answer' }, h('span', { class: 'muted' }, 'Правильно: '), h('strong', { lang: /[a-z]/i.test(right) ? 'en' : null }, right)) : null,
        chain(t),
        h('p', { class: 'gt-why' }, h('span', { class: 'gt-why-tag' }, 'Подсказка'), it.why),
        it.kind === 'sentence' ? h('p', { class: 'gt-ru' }, h('span', { class: 'muted' }, 'Перевод: '), it.ru) : null,
        it.kind === 'pair' ? h('div', { class: 'gt-say' }, mark(say), speak(say)) : null,
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
      var mood = pct === 100 ? 'Отлично — всё с первого раза!' : pct >= 70 ? 'Хорошо! Ошибки разобраны — завтра они вернутся на повторение.' : 'Времена ещё «укладываются» — это нормально. Ошибочные фразы вернутся завтра, и станет легче.';
      var weak = Object.keys(missed).sort(function (a, b) { return missed[b] - missed[a]; });
      stage.replaceChildren(h('div', { class: 'card gt-card gt-finish enter' },
        h('h2', null, opts.finishTitle || 'Готово!'),
        h('p', { class: 'gt-finish-score' }, h('strong', null, firstOk + ' из ' + firstTotal), ' с первого раза'),
        h('p', { class: 'muted' }, mood),
        weak.length ? h('div', { class: 'gt-weak' }, h('p', { class: 'muted small' }, 'Где были ошибки:'),
          h('div', { class: 'gt-weak-list' }, weak.map(function (id) {
            return h('a', { class: 'gt-chip gt-chip-link', href: '#/gtoday/focus/' + id, lang: 'en' }, tense(id).name + ' · ' + missed[id]);
          }))) : null,
        h('div', { class: 'gt-actions gt-actions-center' }, (opts.actions || [{ label: 'К плану', href: '#/gtoday', primary: true }]).map(function (a) {
          return h('a', { class: 'btn' + (a.primary ? ' primary' : ' ghost'), href: a.href }, a.label);
        }))));
      foot.replaceChildren();
      if (opts.onFinish) { try { opts.onFinish({ correct: firstOk, total: firstTotal }); } catch (e) { console.error(e); } }
    }

    next();
    return function () { document.removeEventListener('keydown', onKey); };
  }

  GT.run = run;
  GT.ui = { mark: mark, plain: plain, chain: chain, shuffle: shuffle };
})(window.EG = window.EG || {});
