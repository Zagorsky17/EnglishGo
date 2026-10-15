/* views/convos.js — «Чтение диалогов»: живые разговоры A1–C1 по возрастанию сложности (data/convos.js).
   Сам диалог открывается на экране чтения (EG.reading.view из views/reading.js): слова переводятся по нажатию,
   реплика — кнопкой «RU», внизу — разбор времён и тест на понимание. */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  EG.views = EG.views || {};

  var listLevel = '';

  var CONVO = {
    kind: 'convo', noun: 'диалог', list: function () { return EG.data.convos; }, href: '#/convo/',
    back: '#/convos', backLabel: 'Чтение диалогов', nextLabel: 'Следующий диалог: ', allLabel: 'Все диалоги',
    head: function (c) {
      return [
        h('p', { class: 'setting', lang: 'en' }, c.setting),
        h('p', { class: 'muted' }, c.settingRu),
        h('div', { class: 'cv-grams' }, c.grammar.map(EG.reading.grammarChip))
      ];
    }
  };

  function statusOf(c) { return EG.state.dialogues.get(c.id) || null; }
  /** Первый непройденный диалог — диалоги идут по сложности, поэтому это «следующий шаг». */
  function nextConvo() { return EG.data.convos.filter(function (c) { return !statusOf(c); })[0] || null; }

  function convoCard(c, isNext) {
    var rec = statusOf(c);
    var topic = EG.data.textTopics[c.topic] || { name: c.topic, emoji: '💬' };
    return h('a', { class: 'scene text-card' + (rec ? ' done' : '') + (isNext ? ' cv-next' : ''), href: '#/convo/' + c.id },
      h('span', { class: 'cv-num' }, String(c.order + 1)),
      h('span', { class: 'scene-body' },
        h('strong', { lang: 'en' }, c.title),
        h('span', { class: 'muted small' }, c.titleRu),
        h('span', { class: 'muted small' }, topic.emoji + ' ' + topic.name + ' · ' + c.lines.length + ' реплик · ' + c.questions.length + ' вопросов'),
        h('span', { class: 'cv-grams' }, c.grammar.map(function (g) {
          return h('span', { class: 'badge cv-gram' }, EG.data.convoGrammar[g] || g);
        }))),
      h('span', { class: 'scene-meta' }, EG.ui.levelBadge(c.level),
        rec ? h('span', { class: 'badge st-mastered' }, icon('check'), rec.bestScore + '%')
          : isNext ? h('span', { class: 'badge st-learning' }, 'следующий') : null));
  }

  EG.views.convos = function (root) {
    var all = EG.data.convos;
    var done = all.filter(statusOf).length;
    var next = nextConvo();
    var grid = h('div');
    var seg = h('div', { class: 'segmented' }, [''].concat(EG.LEVELS).map(function (l) {
      var n = all.filter(function (c) { return !l || c.level === l; }).length;
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
        var items = all.filter(function (c) { return c.level === lv; });
        if (!items.length) return;
        grid.appendChild(h('section', { class: 'level-section' },
          h('h2', { class: 'section-title' }, EG.ui.levelBadge(lv), EG.data.levelNames[lv] || lv),
          h('div', { class: 'scene-grid' }, items.map(function (c) { return convoCard(c, c === next); }))));
      });
    }
    draw();

    root.append(
      EG.ui.pageHead('Чтение диалогов', 'Живые разговоры на разные темы — от простых A1 до сложных C1. Читайте по порядку: каждый следующий диалог чуть сложнее. Нажимайте на незнакомые слова, смотрите разбор времён, а в конце проверьте понимание.'),
      next ? h('div', { class: 'card cv-continue row between wrap' },
        h('span', null, h('span', { class: 'muted small' }, done ? 'Продолжить с диалога ' + (next.order + 1) : 'Начните с первого диалога'),
          h('br'), h('strong', { lang: 'en' }, next.title), h('span', { class: 'muted' }, ' — ' + next.titleRu)),
        h('a', { class: 'btn primary', href: '#/convo/' + next.id }, done ? 'Продолжить' : 'Начать', icon('arrow'))) : null,
      h('div', { class: 'row between wrap reading-bar' }, seg, h('span', { class: 'muted small' }, 'Прочитано ' + done + ' из ' + all.length)),
      grid);
  };

  EG.views.convo = function (root, params) {
    var c = EG.data.convosById[params[0]];
    if (!c) { root.append(EG.ui.empty('dialogues', 'Диалог не найден', null, h('a', { class: 'btn', href: '#/convos' }, 'К списку диалогов'))); return; }
    return EG.reading.view(root, c, CONVO);
  };

})(window.EG = window.EG || {});
