/* keyverbs/keyverbs.js — раздел «Ключевые глаголы»: take, have, make и do, go и come, keep, put, let, сокращения.
   Изоляция: ничего не пишет — ни в IndexedDB, ни в localStorage, ни в SRS/XP/статистику.
   Из ядра используется только EG.ui; упражнения показывает плеер «Грамматики» (EG.grammar.ui.run),
   ссылки на её уроки — только чтение EG.grammar.data.
   Маршруты: #/verbs · #/verbs/v/:verb · #/verbs/t/:topic · #/verbs/practice/:topic · #/verbs/test[/:verb] */
(function (EG) {
  'use strict';

  var KV = EG.keyverbs = EG.keyverbs || {};
  EG.views = EG.views || {};
  var h = EG.ui.h, icon = EG.ui.icon;

  var TEST_SIZE = 12;      // тест по всем глаголам
  var VERB_TEST_SIZE = 10; // тест по одному глаголу

  var VERDICT = {
    no: { label: 'Нет', cls: 'kv-v-no' },
    partly: { label: 'Не совсем', cls: 'kv-v-partly' },
    yes: { label: 'Да', cls: 'kv-v-yes' }
  };

  function D() { return KV.data; }
  function U() { return EG.grammar.ui; }
  function shuffle(a) { return U().shuffle(a); }
  function exCount(v) { return v.topics.reduce(function (s, t) { return s + (t.practice || []).length; }, 0); }

  function back(href, label) {
    return h('a', { class: 'back-link', href: href }, icon('back'), label);
  }

  /* ================= задания ================= */

  // свежие копии: плеер добавляет к повтору флаг retry
  function copy(list) { return list.map(function (ex) { return Object.assign({}, ex); }); }

  /** Тест: задания из нескольких тем по очереди, соседние — из разных тем, пока это возможно. */
  function testItems(topics, size) {
    var pools = topics.map(function (t) { return shuffle(t.practice || []); });
    var out = [];
    while (out.length < size && pools.some(function (p) { return p.length; })) {
      shuffle(pools).forEach(function (p) {
        if (out.length >= size || !p.length) return;
        if (out.length && out[out.length - 1].topic === p[0].topic && pools.filter(function (q) { return q.length; }).length > 1) return;
        out.push(p.shift());
      });
    }
    return copy(out);
  }

  function allTopics() { return D().verbs.reduce(function (a, v) { return a.concat(v.topics); }, []); }

  function runner(root, items, opts) {
    var box = h('div', { class: 'kv' });
    root.append(box);
    return U().run(box, items, opts);
  }

  /* ================= блоки ================= */

  function myth(m) {
    var v = VERDICT[m.verdict] || VERDICT.partly;
    var t = m.topic && D().topicsById[m.topic];
    return h('div', { class: 'kv-myth' },
      h('div', { class: 'kv-myth-head' }, h('span', { class: 'kv-verdict ' + v.cls }, v.label), h('strong', null, m.claim.charAt(0) === '«' ? m.claim : '«' + m.claim + '»')),
      h('p', null, m.text),
      t ? h('a', { class: 'link-btn', href: '#/verbs/t/' + t.id }, 'Подробнее: ' + t.title, icon('arrow')) : null);
  }

  function phrasesList(rows) {
    return h('div', { class: 'kv-phrases' }, rows.map(function (p) {
      return h('div', { class: 'kv-phrase' },
        h('div', { class: 'kv-phrase-top' }, h('strong', { lang: 'en' }, p[0]), h('span', { class: 'muted' }, '— ' + p[1])),
        U().example([p[2], p[3]]));
    }));
  }

  function card(label, body, cls) {
    return h('section', { class: 'card' + (cls ? ' ' + cls : '') }, h('div', { class: 'gr-label' }, label), body);
  }

  function tile(href, emoji, title, sub, side) {
    return h('a', { class: 'kv-tile', href: href },
      h('span', { class: 'kv-tile-ic' }, emoji),
      h('span', { class: 'kv-tile-main' }, h('strong', null, title), h('span', { class: 'muted small' }, sub)),
      h('span', { class: 'kv-tile-side' }, side));
  }

  /* ================= экраны ================= */

  function overview(root) {
    var d = D();
    var grammar = EG.grammar && EG.grammar.data && EG.grammar.data.byId;
    var related = (d.related || []).map(function (id) { return grammar && grammar[id]; }).filter(Boolean);
    var topics = allTopics();
    var total = topics.reduce(function (s, t) { return s + (t.practice || []).length; }, 0);

    root.append(h('div', { class: 'gr kv' },
      EG.ui.pageHead('Ключевые глаголы', 'Короткие глаголы, которыми носители говорят почти обо всём: take, have, make и do, go и come, keep, put, let. Смысл им даёт то, что стоит рядом.'),
      h('div', { class: 'gr-cta kv-cta' },
        h('p', null, h('strong', null, 'Тест по всем глаголам'), ' — ', TEST_SIZE + ' заданий вперемешку, ошибки вернутся в конце.'),
        h('a', { class: 'btn primary', href: '#/verbs/test' }, 'Начать тест', icon('arrow'))),
      h('section', { class: 'gr-group' },
        h('h2', { class: 'section-title' }, h('span', null, '📚'), 'Глаголы'),
        h('p', { class: 'muted small gr-group-sub' }, d.verbs.length + ' разделов · ' + topics.length + ' тем · ' + total + ' упражнений'),
        h('div', { class: 'kv-tiles' },
          d.verbs.map(function (v) {
            return tile('#/verbs/v/' + v.id, v.emoji, v.title, v.ru,
              [h('span', { class: 'muted small' }, v.topics.length + ' тем.'), h('span', { class: 'muted small' }, exCount(v) + ' зад.')]);
          }),
          EG.views.get ? tile('#/get', '🔑', 'get', 'отдельный раздел «Глагол get»', h('span', { class: 'muted small' }, 'открыть')) : null)),
      h('section', { class: 'gr-group' },
        h('h2', { class: 'section-title' }, h('span', null, '🔍'), 'Проверка утверждений'),
        h('p', { class: 'muted small gr-group-sub' }, 'Что об этих глаголах часто думают — и как на самом деле.'),
        h('div', { class: 'kv-myths' }, d.verbs.reduce(function (a, v) { return a.concat(v.myths || []); }, []).map(myth))),
      related.length ? h('section', { class: 'gr-group' },
        h('h2', { class: 'section-title' }, h('span', null, '🔗'), 'В «Грамматике»'),
        h('div', { class: 'gr-chips' }, related.map(function (t) {
          return h('a', { class: 'gr-chip', href: '#/grammar/t/' + t.id, lang: 'en' }, t.title);
        }))) : null,
      h('p', { class: 'muted small kv-foot' }, 'Раздел ничего не сохраняет: результаты тестов не влияют на повторение, XP и статистику.')));
    return null;
  }

  function verbView(root, v) {
    var list = D().verbs, i = list.indexOf(v);
    var prev = list[i - 1], next = list[i + 1];
    root.append(h('div', { class: 'gr kv' },
      back('#/verbs', 'Ключевые глаголы'),
      h('header', { class: 'gr-lesson-head' },
        h('div', null, h('h1', null, v.emoji + ' ', h('span', { lang: 'en' }, v.title)), h('p', { class: 'muted' }, v.ru))),
      h('section', { class: 'card gr-core' }, h('div', { class: 'gr-label' }, 'Главное'), h('p', { class: 'gr-core-text' }, v.core)),
      (v.myths || []).length ? card('Проверка утверждений', h('div', { class: 'kv-myths' }, v.myths.map(myth)), 'kv-myth-card') : null,
      h('section', { class: 'gr-group' },
        h('h2', { class: 'section-title' }, 'Темы'),
        h('div', { class: 'kv-tiles' }, v.topics.map(function (t) {
          return tile('#/verbs/t/' + t.id, t.emoji, t.title, t.ru,
            [h('span', { class: 'gr-lvl' }, t.level), h('span', { class: 'muted small' }, (t.practice || []).length + ' зад.')]);
        }))),
      h('div', { class: 'gr-cta' }, h('div', { class: 'row gap wrap' },
        h('a', { class: 'btn primary', href: '#/verbs/t/' + v.topics[0].id }, 'Начать с первой темы', icon('arrow')),
        h('a', { class: 'btn ghost', href: '#/verbs/test/' + v.id }, 'Тест по ' + v.title + ' · ' + Math.min(VERB_TEST_SIZE, exCount(v))))),
      h('div', { class: 'kv-nav' },
        prev ? h('a', { class: 'btn ghost', href: '#/verbs/v/' + prev.id }, icon('back'), h('span', { lang: 'en' }, prev.title)) : h('span'),
        next ? h('a', { class: 'btn ghost', href: '#/verbs/v/' + next.id }, h('span', { lang: 'en' }, next.title), icon('arrow')) : h('a', { class: 'btn ghost', href: '#/verbs' }, 'Ко всем глаголам'))));
    return null;
  }

  function topicView(root, t) {
    var v = D().verbsById[t.verb];
    var list = v.topics, i = list.indexOf(t);
    var prev = list[i - 1], next = list[i + 1];
    var u = U();
    var blocks = [];

    blocks.push(h('section', { class: 'card gr-core' },
      h('div', { class: 'gr-label' }, 'Суть'),
      h('p', { class: 'gr-core-text' }, t.core),
      t.key ? h('div', { class: 'gr-key-ex' }, u.example(t.key)) : null));

    var myths = (v.myths || []).filter(function (m) { return m.topic === t.id; });
    if (myths.length) blocks.push(card('Проверка утверждения', h('div', { class: 'kv-myths' }, myths.map(myth)), 'kv-myth-card'));
    if (t.formula) blocks.push(card('Формула', u.formula(t.formula)));
    if (t.sides) blocks.push(card('Сравните', h('div', { class: 'gr-sides' }, t.sides.map(function (s) {
      return h('div', { class: 'gr-side' },
        h('div', { class: 'gr-vs-name', lang: 'en' }, s.name),
        h('div', { class: 'gr-side-means' }, s.means),
        u.example(s.ex));
    }))));
    if (t.phrases) blocks.push(card('Фразы', phrasesList(t.phrases)));
    if (t.examples) blocks.push(card('Примеры', h('div', { class: 'gr-examples' }, t.examples.map(u.example))));

    var more = [];
    if (t.talk) more.push(u.fold('Так говорят в жизни', h('div', { class: 'gr-examples' }, t.talk.map(u.example))));
    if (t.mistakes) more.push(u.fold('Типичные ошибки', u.mistakesList(t.mistakes)));
    if (more.length) blocks.push(h('section', { class: 'gr-folds' }, more));

    root.append(h('div', { class: 'gr kv' },
      back('#/verbs/v/' + v.id, v.emoji + ' ' + v.title),
      h('header', { class: 'gr-lesson-head' },
        h('div', null, h('h1', null, t.emoji + ' ' + t.title), h('p', { class: 'muted' }, t.ru)),
        h('div', { class: 'gr-lesson-meta' }, h('span', { class: 'gr-lvl' }, t.level))),
      blocks,
      h('div', { class: 'gr-cta' }, h('div', { class: 'row gap wrap' },
        h('a', { class: 'btn primary', href: '#/verbs/practice/' + t.id }, 'Упражнения · ' + (t.practice || []).length, icon('arrow')),
        h('a', { class: 'btn ghost', href: '#/verbs/test/' + v.id }, 'Тест по ' + v.title))),
      h('div', { class: 'kv-nav' },
        prev ? h('a', { class: 'btn ghost', href: '#/verbs/t/' + prev.id }, icon('back'), h('span', null, prev.title)) : h('span'),
        next ? h('a', { class: 'btn primary', href: '#/verbs/t/' + next.id }, h('span', null, next.title), icon('arrow'))
          : h('a', { class: 'btn primary', href: '#/verbs/v/' + v.id }, 'К разделу ' + v.title))));
    return null;
  }

  function practice(root, t) {
    var v = D().verbsById[t.verb];
    var next = v.topics[v.topics.indexOf(t) + 1];
    var actions = [{ label: 'Ещё раз', href: '#/verbs/t/' + t.id }];
    if (next) actions.unshift({ label: 'Следующая тема', href: '#/verbs/t/' + next.id, primary: true });
    else actions.unshift({ label: 'Тест по ' + v.title, href: '#/verbs/test/' + v.id, primary: true });
    actions.push({ label: 'Ко всем глаголам', href: '#/verbs' });
    return runner(root, copy(t.practice || []), { title: t.title, exitHref: '#/verbs/t/' + t.id, finish: { actions: actions } });
  }

  function test(root, v) {
    var items = v ? testItems(v.topics, VERB_TEST_SIZE) : testItems(allTopics(), TEST_SIZE);
    var again = v ? '#/verbs/test/' + v.id : '#/verbs/test';
    return runner(root, items, {
      title: v ? 'Тест по ' + v.title : 'Тест по ключевым глаголам', exitHref: v ? '#/verbs/v/' + v.id : '#/verbs',
      finish: { title: 'Тест пройден!', actions: [
        { label: 'Пройти ещё раз', href: again, primary: true },
        v ? { label: 'К разделу ' + v.title, href: '#/verbs/v/' + v.id } : null,
        { label: 'Ко всем глаголам', href: '#/verbs' }].filter(Boolean) }
    });
  }

  function notFound(root) {
    root.append(EG.ui.empty('help', 'Не найдено', 'Возможно, ссылка устарела.', h('a', { class: 'btn', href: '#/verbs' }, 'К ключевым глаголам')));
    return null;
  }

  EG.views.verbs = function (root, params) {
    if (!KV.data || !KV.data.verbs || !KV.data.verbs.length || !EG.grammar || !EG.grammar.ui) {
      root.append(EG.ui.empty('help', 'Раздел недоступен', 'Не удалось загрузить материалы раздела.'));
      return null;
    }
    var p = params || [];
    if (p[0] === 'v') { var v = KV.data.verbsById[p[1]]; return v ? verbView(root, v) : notFound(root); }
    if (p[0] === 't' || p[0] === 'practice') {
      var t = KV.data.topicsById[p[1]];
      if (!t) return notFound(root);
      return p[0] === 't' ? topicView(root, t) : practice(root, t);
    }
    if (p[0] === 'test') {
      if (!p[1]) return test(root, null);
      var tv = KV.data.verbsById[p[1]];
      return tv ? test(root, tv) : notFound(root);
    }
    return overview(root);
  };

  // для проверки в Node (tools/keyverbs-check.js)
  KV.logic = { testItems: testItems, allTopics: allTopics, TEST_SIZE: TEST_SIZE, VERB_TEST_SIZE: VERB_TEST_SIZE };
})(window.EG = window.EG || {});
