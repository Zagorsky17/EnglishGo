/* getverb/get.js — раздел «Глагол get»: значения get, какое время он передаёт, gotta и упражнения.
   Изоляция: ничего не пишет — ни в IndexedDB, ни в localStorage, ни в SRS/XP/статистику.
   Из ядра используется только EG.ui; упражнения показывает плеер «Грамматики» (EG.grammar.ui.run),
   ссылки на её уроки — только чтение EG.grammar.data.
   Маршруты: #/get · #/get/m/:id (тема) · #/get/practice/:id · #/get/test (смешанный тест) */
(function (EG) {
  'use strict';

  var GV = EG.getverb = EG.getverb || {};
  EG.views = EG.views || {};
  var h = EG.ui.h, icon = EG.ui.icon;

  var TEST_SIZE = 12;

  var VERDICT = {
    no: { label: 'Нет', cls: 'gv-v-no' },
    partly: { label: 'Не совсем', cls: 'gv-v-partly' },
    yes: { label: 'Да', cls: 'gv-v-yes' }
  };

  function D() { return GV.data; }
  function U() { return EG.grammar.ui; }
  function shuffle(a) { return U().shuffle(a); }

  function back(href, label) {
    return h('a', { class: 'back-link', href: href || '#/get' }, icon('back'), label || 'Глагол get');
  }

  /* ================= задания ================= */

  // свежие копии: плеер добавляет к повтору флаг retry
  function copy(list) { return list.map(function (ex) { return Object.assign({}, ex); }); }

  /** Тест: по одному-два задания из каждой темы, вперемешку, соседние — из разных тем. */
  function testItems() {
    var pools = D().topics.map(function (t) { return shuffle(t.practice || []); });
    var out = [];
    while (out.length < TEST_SIZE && pools.some(function (p) { return p.length; })) {
      shuffle(pools).forEach(function (p) {
        if (out.length >= TEST_SIZE || !p.length) return;
        if (out.length && out[out.length - 1].topic === p[0].topic && pools.filter(function (q) { return q.length; }).length > 1) return;
        out.push(p.shift());
      });
    }
    return copy(out);
  }

  function runner(root, items, opts) {
    if (!EG.grammar || !EG.grammar.ui || !EG.grammar.ui.run) {
      root.append(EG.ui.empty('help', 'Упражнения недоступны', 'Не удалось загрузить плеер упражнений.'));
      return null;
    }
    var box = h('div', { class: 'gv' });
    root.append(box);
    return U().run(box, items, opts);
  }

  /* ================= блоки ================= */

  function myth(m) {
    var v = VERDICT[m.verdict] || VERDICT.partly;
    var t = D().byId[m.topic];
    return h('div', { class: 'gv-myth' },
      h('div', { class: 'gv-myth-head' }, h('span', { class: 'gv-verdict ' + v.cls }, v.label), h('strong', null, '«' + m.claim + '»')),
      h('p', null, m.text),
      t ? h('a', { class: 'link-btn', href: '#/get/m/' + t.id }, 'Подробнее: ' + t.title, icon('arrow')) : null);
  }

  function timesTable(rows) {
    return h('div', { class: 'gv-times' }, rows.map(function (r) {
      return h('div', { class: 'gv-time' + (r[3] ? ' gv-trap' : '') },
        h('div', { class: 'gv-time-en' }, U().mark(r[0]), U().speak(r[0])),
        h('div', { class: 'gv-time-form', lang: /[a-z]/i.test(r[1]) && !/[а-я]/i.test(r[1]) ? 'en' : null }, r[1]),
        h('div', { class: 'gv-time-means' }, r[3] ? h('span', { class: 'gv-trap-tag' }, r[3]) : null, r[2]));
    }));
  }

  function phrasesList(rows) {
    return h('div', { class: 'gv-phrases' }, rows.map(function (p) {
      return h('div', { class: 'gv-phrase' },
        h('div', { class: 'gv-phrase-top' }, h('strong', { lang: 'en' }, p[0]), h('span', { class: 'muted' }, '— ' + p[1])),
        U().example([p[2], p[3]]));
    }));
  }

  /** Карточки сравнения: слово, полная форма, смысл, формы, пример. */
  function compareCards(list) {
    return h('div', { class: 'gv-cards' }, list.map(function (c) {
      return h('div', { class: 'gv-cmp' },
        h('div', { class: 'gv-cmp-top' }, h('strong', { class: 'gv-cmp-name', lang: 'en' }, c.name), h('span', { class: 'muted small', lang: 'en' }, c.full)),
        h('p', { class: 'gv-cmp-means' }, c.means),
        h('code', { class: 'gv-cmp-form', lang: 'en' }, c.form),
        U().example(c.ex));
    }));
  }

  function stepsList(rows) {
    return h('ol', { class: 'gv-steps' }, rows.map(function (r) {
      return h('li', null, h('strong', null, r[0]), ' ', h('span', { class: 'muted' }, '→ '), h('span', { lang: 'en' }, r[1]));
    }));
  }

  function soundList(rows) {
    return h('div', { class: 'gv-sound' }, rows.map(function (r) {
      return h('div', { class: 'gv-sound-row' },
        h('div', { class: 'gv-sound-en' }, h('strong', { lang: 'en' }, r[0]), U().speak(r[0]), h('code', null, r[1])),
        h('div', { class: 'muted small' }, r[2]));
    }));
  }

  /** Вопросы на понимание: ответ скрыт, пока его не откроешь. */
  function ccqList(rows) {
    return h('div', { class: 'gv-ccq' }, rows.map(function (r) {
      return h('details', { class: 'gv-ccq-item' },
        h('summary', null, h('span', { class: 'gv-ccq-en', lang: 'en' }, r[0]), h('span', null, r[1])),
        h('p', null, r[2]));
    }));
  }

  function card(label, body, cls) {
    return h('section', { class: 'card' + (cls ? ' ' + cls : '') }, h('div', { class: 'gr-label' }, label), body);
  }

  /* ================= экраны ================= */

  function topicTile(t) {
    var n = (t.practice || []).length;
    return h('a', { class: 'gv-topic', href: '#/get/m/' + t.id },
      h('span', { class: 'gv-topic-ic' }, t.emoji),
      h('span', { class: 'gv-topic-main' },
        h('strong', null, t.title),
        h('span', { class: 'muted small' }, t.ru)),
      h('span', { class: 'gv-topic-side' }, h('span', { class: 'gr-lvl' }, t.level), h('span', { class: 'muted small' }, n + ' зад.')));
  }

  function overview(root) {
    var d = D();
    var grammar = EG.grammar && EG.grammar.data && EG.grammar.data.byId;
    var related = (d.related || []).map(function (id) { return grammar && grammar[id]; }).filter(Boolean);
    var total = d.topics.reduce(function (s, t) { return s + (t.practice || []).length; }, 0);

    root.append(h('div', { class: 'gr gv' },
      EG.ui.pageHead('Глагол get', 'Самый «резиновый» глагол разговорного английского: получить, стать, добраться, понять. Разбираем значения, какое время он передаёт и что такое gotta.'),
      h('section', { class: 'card gr-core gv-hero' },
        h('div', { class: 'gr-label' }, 'Главное'),
        h('p', { class: 'gr-core-text' }, 'Get почти никогда не переводится одним словом — смысл даёт то, что стоит после него. Время, как у любого глагола, задаёт форма: get, got, will get, have got.'),
        h('div', { class: 'gv-map' }, [
          ['get + что', 'получить, купить', 'I got a text.'],
          ['get + прилаг.', 'стать', 'It\'s getting cold.'],
          ['get to + место', 'добраться', 'I got home late.'],
          ['get + V3', 'с тобой случилось', 'We got lost.'],
          ['get it', 'понять', 'I don\'t get it.'],
          ['have got (to)', 'есть · надо', 'I\'ve got to go.']
        ].map(function (r) {
          return h('div', { class: 'gv-map-item' }, h('code', { lang: 'en' }, r[0]), h('span', null, r[1]), h('span', { class: 'muted small', lang: 'en' }, r[2]));
        }))),
      h('div', { class: 'gr-cta gv-cta' },
        h('p', null, h('strong', null, 'Проверьте себя по всем темам'), ' — ', TEST_SIZE + ' заданий вперемешку, ошибки вернутся в конце.'),
        h('a', { class: 'btn primary', href: '#/get/test' }, 'Тест по get', icon('arrow'))),
      h('section', { class: 'gr-group' },
        h('h2', { class: 'section-title' }, h('span', null, '🔍'), 'Проверка утверждений'),
        h('p', { class: 'muted small gr-group-sub' }, 'Что о get и gotta часто думают — и как на самом деле.'),
        h('div', { class: 'gv-myths' }, d.myths.map(myth))),
      h('section', { class: 'gr-group' },
        h('h2', { class: 'section-title' }, h('span', null, '📚'), 'Темы'),
        h('p', { class: 'muted small gr-group-sub' }, d.topics.length + ' тем · ' + total + ' упражнений'),
        h('div', { class: 'gv-topics' }, d.topics.map(topicTile))),
      related.length ? h('section', { class: 'gr-group' },
        h('h2', { class: 'section-title' }, h('span', null, '🔗'), 'В «Грамматике»'),
        h('div', { class: 'gr-chips' }, related.map(function (t) {
          return h('a', { class: 'gr-chip', href: '#/grammar/t/' + t.id, lang: 'en' }, t.title);
        }))) : null,
      h('p', { class: 'muted small gv-foot' }, 'Раздел ничего не сохраняет: результаты тестов не влияют на повторение, XP и статистику.')));
    return null;
  }

  function topicView(root, t) {
    var list = D().topics, i = list.indexOf(t);
    var prev = list[i - 1], next = list[i + 1];
    var u = U();
    var blocks = [];

    blocks.push(h('section', { class: 'card gr-core' },
      h('div', { class: 'gr-label' }, 'Суть'),
      h('p', { class: 'gr-core-text' }, t.core),
      t.key ? h('div', { class: 'gr-key-ex' }, u.example(t.key)) : null));

    var myths = D().myths.filter(function (m) { return m.topic === t.id; });
    if (myths.length) blocks.push(card('Проверка утверждения', h('div', { class: 'gv-myths' }, myths.map(myth)), 'gv-myth-card'));
    if (t.cards) blocks.push(card('Четыре слова рядом', compareCards(t.cards)));
    if (t.steps) blocks.push(card('Как выбрать', stepsList(t.steps)));
    if (t.times) blocks.push(card('Форма → время → смысл', timesTable(t.times)));
    if (t.formula) blocks.push(card('Формула', u.formula(t.formula)));
    if (t.sides) blocks.push(card('Сравните', h('div', { class: 'gr-sides' }, t.sides.map(function (s) {
      return h('div', { class: 'gr-side' },
        h('div', { class: 'gr-vs-name', lang: 'en' }, s.name),
        h('div', { class: 'gr-side-means' }, s.means),
        u.example(s.ex));
    }))));
    if (t.phrases) blocks.push(card('Фразовые глаголы', phrasesList(t.phrases)));
    if (t.examples) blocks.push(card('Примеры', h('div', { class: 'gr-examples' }, t.examples.map(u.example))));
    if (t.sound) blocks.push(card('Как это звучит', soundList(t.sound)));
    if (t.ccq) blocks.push(card('Проверь понимание', h('div', null,
      h('p', { class: 'muted small gv-ccq-hint' }, 'Ответьте про себя, потом откройте ответ.'), ccqList(t.ccq))));

    var more = [];
    if (t.talk) more.push(u.fold('Так говорят в жизни', h('div', { class: 'gr-examples' }, t.talk.map(u.example))));
    if (t.mistakes) more.push(u.fold('Типичные ошибки', u.mistakesList(t.mistakes)));
    if (more.length) blocks.push(h('section', { class: 'gr-folds' }, more));

    root.append(h('div', { class: 'gr gv' },
      back(),
      h('header', { class: 'gr-lesson-head' },
        h('div', null, h('h1', null, t.emoji + ' ' + t.title), h('p', { class: 'muted' }, t.ru)),
        h('div', { class: 'gr-lesson-meta' }, h('span', { class: 'gr-lvl' }, t.level))),
      blocks,
      h('div', { class: 'gr-cta' }, h('div', { class: 'row gap wrap' },
        h('a', { class: 'btn primary', href: '#/get/practice/' + t.id }, 'Упражнения · ' + (t.practice || []).length, icon('arrow')),
        h('a', { class: 'btn ghost', href: '#/get/test' }, 'Тест по всем темам'))),
      h('div', { class: 'gv-nav' },
        prev ? h('a', { class: 'btn ghost', href: '#/get/m/' + prev.id }, icon('back'), h('span', null, prev.title)) : h('span'),
        next ? h('a', { class: 'btn primary', href: '#/get/m/' + next.id }, h('span', null, next.title), icon('arrow')) : h('a', { class: 'btn primary', href: '#/get' }, 'К разделу'))));
    return null;
  }

  function practice(root, t) {
    var list = D().topics, next = list[list.indexOf(t) + 1];
    var actions = [{ label: 'Ещё раз', href: '#/get/m/' + t.id }];
    if (next) actions.unshift({ label: 'Следующая тема', href: '#/get/m/' + next.id, primary: true });
    else actions.unshift({ label: 'Тест по всем темам', href: '#/get/test', primary: true });
    actions.push({ label: 'К разделу', href: '#/get' });
    return runner(root, copy(t.practice || []), { title: t.title, exitHref: '#/get/m/' + t.id, finish: { actions: actions } });
  }

  function test(root) {
    return runner(root, testItems(), {
      title: 'Тест по глаголу get', exitHref: '#/get',
      finish: { title: 'Тест пройден!', actions: [
        { label: 'Пройти ещё раз', href: '#/get/test', primary: true },
        { label: 'К разделу', href: '#/get' }] }
    });
  }

  function notFound(root) {
    root.append(EG.ui.empty('help', 'Тема не найдена', 'Возможно, ссылка устарела.', h('a', { class: 'btn', href: '#/get' }, 'К разделу «Глагол get»')));
    return null;
  }

  EG.views.get = function (root, params) {
    if (!GV.data || !GV.data.topics || !GV.data.topics.length || !EG.grammar || !EG.grammar.ui) {
      root.append(EG.ui.empty('help', 'Раздел недоступен', 'Не удалось загрузить материалы раздела.'));
      return null;
    }
    var p = params || [];
    var t = p[1] ? GV.data.byId[p[1]] : null;
    if (p[0] === 'm') return t ? topicView(root, t) : notFound(root);
    if (p[0] === 'practice') return t ? practice(root, t) : notFound(root);
    if (p[0] === 'test') return test(root);
    return overview(root);
  };

  // для проверки в Node (tools/get-check.js)
  GV.logic = { testItems: testItems, TEST_SIZE: TEST_SIZE };
})(window.EG = window.EG || {});
