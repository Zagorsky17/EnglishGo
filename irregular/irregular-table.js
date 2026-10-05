/* irregular/irregular-table.js — раздел «Неправильные глаголы»: таблица-шпаргалка (#/irregular).
   Глаголы сгруппированы по звучанию (правило группы → сразу несколько глаголов), есть поиск, вид «А–Z»,
   озвучка «go — went — gone» и режим «Проверь себя» (2-я и 3-я формы скрыты, пока их не откроешь).
   Ничего не сохраняет. Из ядра — только EG.ui (DOM-хелперы, озвучка). */
(function (EG) {
  'use strict';

  var IR = EG.irregular = EG.irregular || {};
  EG.views = EG.views || {};
  var h = EG.ui.h, icon = EG.ui.icon;

  // состояние экрана живёт до перезагрузки страницы — без записи в хранилище
  var state = { mode: 'groups', query: '', quiz: false };

  function D() { return IR.data; }
  function forms(list) { return list.join(' / '); }
  /** «go, went, gone» — для озвучки ритмом (запятые дают паузы). */
  function chant(v) { return [v.base, v.v2[0], v.v3[0]].join(', '); }
  IR.chant = chant;

  function matches(v, q) {
    if (!q) return true;
    var hay = [v.base].concat(v.v2, v.v3, [v.ru]).join(' ').toLowerCase();
    return hay.indexOf(q) >= 0;
  }

  function hideable(text) {
    return h('span', { class: 'iv-hide', lang: 'en' }, h('span', null, text));
  }

  function row(v) {
    return h('div', { class: 'iv-row' },
      h('div', { class: 'iv-c iv-base' },
        h('span', { class: 'iv-en', lang: 'en' }, v.base, v.top ? h('span', { class: 'iv-star', title: 'Один из 30 самых частых' }, '★') : null),
        h('span', { class: 'iv-ru' }, v.ru)),
      h('div', { class: 'iv-c' }, hideable(forms(v.v2))),
      h('div', { class: 'iv-c' }, hideable(forms(v.v3))),
      h('div', { class: 'iv-c iv-say' }, EG.ui.speakBtn(chant(v), true)));
  }

  function head() {
    return h('div', { class: 'iv-row iv-head' },
      h('div', { class: 'iv-c' }, 'Base · V1'),
      h('div', { class: 'iv-c' }, 'Past Simple · V2'),
      h('div', { class: 'iv-c' }, 'Past Participle · V3'),
      h('div', { class: 'iv-c' }));
  }

  function applyQuiz(box) {
    box.classList.toggle('iv-quiz', state.quiz);
    box.querySelectorAll('.iv-hide').forEach(function (el) {
      el.classList.remove('iv-shown');
      if (state.quiz) { el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button'); el.setAttribute('aria-label', 'Скрыто — вспомните и нажмите, чтобы проверить'); }
      else { el.removeAttribute('tabindex'); el.removeAttribute('role'); el.removeAttribute('aria-label'); }
    });
  }

  function reveal(e) {
    if (!state.quiz) return;
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target.closest && e.target.closest('.iv-hide');
    if (!el || el.classList.contains('iv-shown')) return;
    e.preventDefault();
    el.classList.add('iv-shown');
    el.removeAttribute('tabindex'); el.removeAttribute('role'); el.removeAttribute('aria-label');
  }

  EG.views.irregular = function (root) {
    if (!D() || !D().verbs || !D().verbs.length) {
      root.append(EG.ui.empty('help', 'Таблица недоступна', 'Не удалось загрузить материалы раздела.'));
      return null;
    }
    var box = h('div', { class: 'iv' });
    box.addEventListener('click', reveal);
    box.addEventListener('keydown', reveal);
    var list = h('div', { class: 'iv-list' });

    function draw() {
      var q = state.query.trim().toLowerCase();
      var blocks = [];
      if (state.mode === 'groups') {
        D().groups.forEach(function (g) {
          var vs = g.verbs.filter(function (v) { return matches(v, q); });
          if (!vs.length) return;
          blocks.push(h('section', { class: 'card iv-group' },
            h('div', { class: 'iv-group-head' },
              h('h2', null, g.title),
              h('span', { class: 'iv-pattern' }, g.pattern)),
            h('p', { class: 'iv-rule' }, g.rule),
            head(), vs.map(row)));
        });
      } else {
        var vs = D().verbs.filter(function (v) { return matches(v, q); }).slice();
        if (state.mode === 'az') vs.sort(function (a, b) { return a.base < b.base ? -1 : 1; });
        else vs.sort(function (a, b) { return a.rank - b.rank; });
        if (vs.length) blocks.push(h('section', { class: 'card iv-group' }, head(), vs.map(row)));
      }
      if (!blocks.length) blocks.push(EG.ui.empty('search', 'Ничего не найдено', 'Попробуйте другое слово — по-английски или по-русски.'));
      list.replaceChildren.apply(list, blocks);
      applyQuiz(box);
    }

    var modes = [['groups', 'По группам'], ['freq', 'Частые сначала'], ['az', 'A–Z']];
    var seg = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Порядок' }, modes.map(function (m) {
      return h('button', { type: 'button', class: state.mode === m[0] ? 'active' : null, 'aria-pressed': String(state.mode === m[0]), onclick: function (e) {
        state.mode = m[0];
        seg.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        e.currentTarget.classList.add('active'); e.currentTarget.setAttribute('aria-pressed', 'true');
        draw();
      } }, m[1]);
    }));
    var search = h('input', { type: 'search', class: 'input iv-search', placeholder: 'Найти: go, went, идти…', value: state.query, 'aria-label': 'Поиск глагола',
      oninput: function (e) { state.query = e.target.value; draw(); } });
    var quizLabel = h('span', null, state.quiz ? 'Показать всё' : 'Проверь себя');
    var quizBtn = h('button', { class: 'btn ghost iv-quiz-btn', type: 'button', 'aria-pressed': String(state.quiz), onclick: function () {
      state.quiz = !state.quiz;
      quizBtn.setAttribute('aria-pressed', String(state.quiz));
      quizLabel.textContent = state.quiz ? 'Показать всё' : 'Проверь себя';
      hint.hidden = !state.quiz;
      applyQuiz(box);
    } }, icon('eye'), quizLabel);
    var hint = h('p', { class: 'iv-quiz-hint', hidden: !state.quiz }, icon('bulb'),
      'Вторая и третья формы скрыты. Произнесите все три формы вслух, потом нажмите и проверьте себя.');

    box.append(
      EG.ui.pageHead('Неправильные глаголы', D().verbs.length + ' самых нужных глаголов, сгруппированных по звучанию: выучив правило группы, запоминаете сразу несколько глаголов.', quizBtn),
      h('section', { class: 'card iv-tips' },
        h('div', { class: 'iv-tips-grid' },
          h('div', null, h('strong', null, 'V2 — Past Simple'), h('p', { class: 'muted small' }, 'Прошлое событие: I ', h('b', { lang: 'en' }, 'went'), ' home yesterday.')),
          h('div', null, h('strong', null, 'V3 — Past Participle'), h('p', { class: 'muted small' }, 'После have / has и в пассиве: She has ', h('b', { lang: 'en' }, 'gone'), '. It was ', h('b', { lang: 'en' }, 'stolen'), '.')),
          h('div', null, h('strong', null, 'Как учить быстрее'), h('p', { class: 'muted small' }, 'Группами по звучанию, вслух ритмом «go — went — gone», сначала ★ самые частые — и каждый день понемногу.'))),
        EG.views.iverbs ? h('a', { class: 'btn primary iv-cta', href: '#/iverbs' }, 'Тренировка «Неправильные глаголы сегодня»', icon('arrow')) : null),
      hint,
      h('div', { class: 'iv-controls' }, search, seg),
      list);
    root.append(box);
    draw();
    return null;
  };
})(window.EG = window.EG || {});
