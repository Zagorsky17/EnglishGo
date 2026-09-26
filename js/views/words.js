/* views/words.js — словарь выражений с фильтрами и карточкой выражения */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  EG.views = EG.views || {};

  var filters = { q: '', level: '', topic: '', type: '', status: '', forms: '' };

  function statusOf(id) {
    var c = EG.state.cards.get(id);
    return c ? c.state : 'none';
  }

  function openItem(it, onChange) {
    var c = EG.state.cards.get(it.id);
    var srsInfo = c ? h('div', { class: 'srs-info' },
      h('div', null, h('span', { class: 'muted small' }, 'Статус'), h('strong', null, EG.ui.STATE_RU[c.state])),
      h('div', null, h('span', { class: 'muted small' }, 'Следующее повторение'), h('strong', null, EG.ui.relDue(c.due))),
      h('div', null, h('span', { class: 'muted small' }, 'Повторений'), h('strong', null, c.reps)),
      h('div', null, h('span', { class: 'muted small' }, 'Успешность'), h('strong', null, c.correct + c.wrong ? Math.round(c.correct / (c.correct + c.wrong) * 100) + '%' : '—')),
      h('div', null, h('span', { class: 'muted small' }, 'Сложность'), h('strong', null, Math.round(c.difficulty * 100) + '%')),
      h('div', null, h('span', { class: 'muted small' }, 'Интервал'), h('strong', null, c.interval ? c.interval + ' дн.' : '—'))
    ) : h('p', { class: 'muted small' }, 'Ещё не в изучении.');

    var body = h('div', { class: 'item-detail' },
      h('div', { class: 'badges' }, EG.ui.levelBadge(it.level), h('span', { class: 'badge' }, EG.ui.TYPES[it.type] || it.type), EG.ui.registerBadge(it.register),
        h('span', { class: 'badge' }, (EG.data.topics[it.topic] || {}).title || it.topic)),
      h('div', { class: 'big-phrase' }, h('span', { lang: 'en' }, it.en), EG.ui.speakBtn(it.en)),
      h('p', { class: 'translation' }, it.ru),
      it.cue ? h('p', { class: 'small' }, h('span', { class: 'muted' }, 'Ответ на реплику: '), h('em', { lang: 'en' }, it.cue), it.cueRu ? h('span', { class: 'muted' }, ' — ' + it.cueRu) : null) : null,
      it.example ? h('div', { class: 'context-box' }, h('p', { class: 'example', lang: 'en' }, EG.ui.highlight(it), ' ', EG.ui.speakBtn(it.example, true)), h('p', { class: 'muted' }, it.exampleRu)) : null,
      it.usage ? h('p', { class: 'usage' }, icon('bulb'), it.usage) : null,
      EG.player.formsBlock(it),
      it.alt && it.alt.length ? h('p', { class: 'small' }, h('span', { class: 'muted' }, 'Также говорят: '), it.alt.join(' · ')) : null,
      srsInfo);

    var actions = [{ label: 'Закрыть', value: null }];
    if (!c) actions.push({ label: 'Добавить в изучение', value: 'add', primary: true });
    else actions.unshift({ label: 'Сбросить прогресс', value: 'reset', kind: 'ghost' });
    EG.ui.modal({ title: 'Выражение', body: body, actions: actions, wide: true }).then(function (v) {
      if (v === 'add') EG.srs.addItems([it.id]).then(function () { EG.ui.toast('Добавлено в повторение', 'good'); onChange(); });
      if (v === 'reset') EG.state.saveCard(EG.srs.newCard(it.id)).then(function () { EG.ui.toast('Прогресс выражения сброшен'); onChange(); });
    });
  }

  EG.views.words = function (root) {
    var listEl = h('div', { class: 'word-list' });
    var countEl = h('span', { class: 'muted small' });

    function select(key, label, opts) {
      var s = h('select', { class: 'input', 'aria-label': label, onchange: function () { filters[key] = s.value; draw(); } },
        h('option', { value: '' }, label), opts.map(function (o) { return h('option', { value: o[0] }, o[1]); }));
      s.value = filters[key];
      return s;
    }

    var search = h('input', { class: 'input', type: 'search', placeholder: 'Поиск по-английски или по-русски…', value: filters.q,
      oninput: function () { filters.q = search.value; draw(); } });

    var bar = h('div', { class: 'filters' },
      h('div', { class: 'search' }, icon('search'), search),
      select('level', 'Все уровни', EG.LEVELS.map(function (l) { return [l, l]; })),
      select('topic', 'Все темы', Object.keys(EG.data.topics).map(function (k) { return [k, EG.data.topics[k].title]; })),
      select('type', 'Все типы', Object.keys(EG.ui.TYPES).map(function (k) { return [k, EG.ui.TYPES[k]]; })),
      select('forms', 'Все формы', [['slang', 'есть сленговая пара'], ['text', 'есть форма для чата']]),
      select('status', 'Любой статус', [['none', 'не изучалось'], ['new', 'новое'], ['learning', 'изучается'], ['review', 'повторение'], ['mastered', 'выучено']]));

    function draw() {
      var q = filters.q.trim().toLowerCase();
      var items = EG.data.vocab.filter(function (v) {
        if (filters.level && v.level !== filters.level) return false;
        if (filters.topic && v.topic !== filters.topic) return false;
        if (filters.type && v.type !== filters.type) return false;
        if (filters.status && statusOf(v.id) !== filters.status) return false;
        if (filters.forms === 'slang' && !(v.forms && (v.forms.slang || v.forms.neutral))) return false;
        if (filters.forms === 'text' && !(v.forms && v.forms.text) && v.topic !== 'texting') return false;
        if (q && (v.en + ' ' + v.ru + ' ' + (v.example || '') + ' ' + (v.forms ? [v.forms.slang, v.forms.neutral, v.forms.text].join(' ') : '')).toLowerCase().indexOf(q) < 0) return false;
        return true;
      });
      countEl.textContent = 'Найдено: ' + items.length;
      var frag = document.createDocumentFragment();
      items.slice(0, 400).forEach(function (v) {
        var st = statusOf(v.id);
        frag.appendChild(h('button', { class: 'word', type: 'button', onclick: function () { openItem(v, draw); } },
          h('span', { class: 'word-main' },
            h('strong', { lang: 'en' }, v.en),
            h('span', { class: 'muted' }, v.ru + (v.forms && (v.forms.slang || v.forms.neutral) ? '  ·  ' + (v.forms.slang ? 'сленг: ' + v.forms.slang : 'обычно: ' + v.forms.neutral) : ''))),
          h('span', { class: 'word-meta' },
            st !== 'none' ? h('span', { class: 'dot st-' + st, title: EG.ui.STATE_RU[st] }) : null,
            EG.ui.levelBadge(v.level))));
      });
      listEl.replaceChildren(frag);
      if (!items.length) listEl.appendChild(EG.ui.empty('search', 'Ничего не найдено', 'Измените фильтры или запрос.'));
    }
    draw();

    var counts = EG.srs.stateCounts();
    root.append(
      EG.ui.pageHead('Слова и выражения', EG.data.vocab.length + ' единиц: живые фразы, разговорные формы, идиомы — всегда с примером и объяснением, когда уместно.'),
      h('div', { class: 'row gap wrap stat-chips' },
        h('span', { class: 'chip static' }, h('span', { class: 'dot st-learning' }), 'изучается: ' + ((counts.new || 0) + (counts.learning || 0))),
        h('span', { class: 'chip static' }, h('span', { class: 'dot st-review' }), 'повторение: ' + (counts.review || 0)),
        h('span', { class: 'chip static' }, h('span', { class: 'dot st-mastered' }), 'выучено: ' + (counts.mastered || 0))),
      h('section', { class: 'card' }, bar, countEl, listEl));
  };
})(window.EG = window.EG || {});
