/* tenses/tenses.js — раздел «Таблица времён»: шпаргалка по 12 временам.
   Изоляция: ничего не пишет — ни в IndexedDB, ни в localStorage, ни в SRS/XP/статистику.
   Из ядра используется только EG.ui (DOM-хелперы, озвучка); ссылка на урок в «Грамматике» — только чтение EG.grammar.data.
   Маршруты: #/tenses (таблица) · #/tenses/:id (карточка времени).
   «Проверь себя» — режим самопроверки: формулы и примеры скрыты, пока их не откроешь (активное припоминание). */
(function (EG) {
  'use strict';

  var T = EG.tenses = EG.tenses || {};
  EG.views = EG.views || {};
  var h = EG.ui.h, icon = EG.ui.icon;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  var quiz = false; // режим самопроверки живёт до перезагрузки страницы — без записи в хранилище

  function D() { return T.data; }
  function timeOf(t) { return D().times.filter(function (x) { return x.id === t.time; })[0]; }
  function aspectOf(t) { return D().aspects.filter(function (x) { return x.id === t.aspect; })[0]; }
  function cellFor(time, aspect) { return D().list.filter(function (t) { return t.time === time && t.aspect === aspect; })[0]; }

  /* ================= мелкие элементы ================= */

  /** «I [have lost] my keys» → текст с подсвеченной ключевой частью. */
  function marked(s) {
    var out = [], re = /\[([^\]]+)\]/g, last = 0, m;
    while ((m = re.exec(s))) {
      if (m.index > last) out.push(s.slice(last, m.index));
      out.push(h('mark', { class: 'tt-key' }, m[1]));
      last = re.lastIndex;
    }
    if (last < s.length) out.push(s.slice(last));
    return out;
  }
  function plain(s) { return s.replace(/[[\]]/g, ''); }
  function nobr(s) { return s.replace(/-/g, '\u2011'); } // V-ing не разрывается на «V-» и «ing»

  /** Скрываемый в режиме самопроверки блок. */
  function hideable(cls, children) {
    return h('div', { class: 'tt-hide' + (cls ? ' ' + cls : '') }, children);
  }

  function quizToggle(box) {
    var btn = h('button', { class: 'btn ghost tt-quiz-btn', type: 'button', 'aria-pressed': String(quiz), onclick: function () {
      quiz = !quiz;
      applyQuiz(box);
      btn.setAttribute('aria-pressed', String(quiz));
      label.textContent = quiz ? 'Показать всё' : 'Проверь себя';
    } }, icon('eye'));
    var label = h('span', null, quiz ? 'Показать всё' : 'Проверь себя');
    btn.append(label);
    return btn;
  }

  function applyQuiz(box) {
    box.classList.toggle('tt-quiz', quiz);
    box.querySelectorAll('.tt-hide').forEach(function (el) {
      el.classList.remove('tt-shown');
      if (quiz) { el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button'); el.setAttribute('aria-label', 'Скрыто — вспомните и нажмите, чтобы проверить'); }
      else { el.removeAttribute('tabindex'); el.removeAttribute('role'); el.removeAttribute('aria-label'); }
    });
    var hint = box.querySelector('.tt-quiz-hint');
    if (hint) hint.hidden = !quiz;
  }

  // Открытие скрытого блока. Перехват в фазе захвата: в таблице блок лежит внутри ссылки,
  // и первое нажатие должно открыть ответ, а не перейти на карточку.
  function reveal(e) {
    if (!quiz) return;
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
    var el = e.target.closest && e.target.closest('.tt-hide');
    if (!el || el.classList.contains('tt-shown')) return;
    e.preventDefault(); e.stopPropagation();
    el.classList.add('tt-shown');
    el.removeAttribute('tabindex'); el.removeAttribute('role'); el.removeAttribute('aria-label');
  }

  function shell(cls) {
    var box = h('div', { class: 'tt ' + cls });
    box.addEventListener('click', reveal, true);
    box.addEventListener('keydown', reveal, true);
    return box;
  }

  /* ================= линия времени ================= */

  function svg(tag, attrs, text) {
    var el = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, String(attrs[k])); });
    if (text != null) el.appendChild(document.createTextNode(text));
    return el;
  }

  var TL_NOTE = {
    habit: 'повторяется регулярно',
    point: 'одно событие в этот момент',
    span: 'процесс идёт в этот момент',
    upto: 'сделано до момента — важен результат',
    spanUpto: 'длилось вплоть до момента — важна длительность'
  };

  /** Схема времени: ось «прошлое → будущее», «сейчас» и точка отсчёта. Рисуется через createElementNS (CSP). */
  function timeline(t) {
    var Y = 42, NOW = 160;
    var ref = { past: 80, present: NOW, future: 240 }[t.time];
    var s = svg('svg', { viewBox: '0 0 320 78', class: 'tt-tl-svg', role: 'img', 'aria-label': 'Схема на линии времени: ' + TL_NOTE[t.tl] });
    s.appendChild(svg('line', { x1: 8, y1: Y, x2: 306, y2: Y, class: 'tt-axis' }));
    s.appendChild(svg('path', { d: 'M306 ' + (Y - 5) + ' L314 ' + Y + ' L306 ' + (Y + 5) + 'z', class: 'tt-axis-head' }));
    s.appendChild(svg('line', { x1: NOW, y1: Y - 22, x2: NOW, y2: Y + 14, class: 'tt-now' }));
    s.appendChild(svg('text', { x: NOW, y: 72, class: 'tt-tl-text tt-tl-now' }, 'сейчас'));
    if (ref !== NOW) {
      s.appendChild(svg('line', { x1: ref, y1: Y - 22, x2: ref, y2: Y + 14, class: 'tt-ref' }));
      s.appendChild(svg('text', { x: ref, y: 72, class: 'tt-tl-text' }, t.time === 'past' ? 'тогда' : 'потом'));
    }
    function arrowHead(x) { s.appendChild(svg('path', { d: 'M' + (x - 9) + ' ' + (Y - 6) + ' L' + x + ' ' + Y + ' L' + (x - 9) + ' ' + (Y + 6) + 'z', class: 'tt-act' })); }
    if (t.tl === 'habit') {
      [36, 86, 136, 186, 236, 286].forEach(function (x) { s.appendChild(svg('circle', { cx: x, cy: Y, r: 5, class: 'tt-act' })); });
    } else if (t.tl === 'point') {
      s.appendChild(svg('circle', { cx: ref, cy: Y, r: 7, class: 'tt-act' }));
    } else if (t.tl === 'span') {
      s.appendChild(svg('rect', { x: ref - 42, y: Y - 8, width: 84, height: 16, rx: 8, class: 'tt-band' }));
    } else if (t.tl === 'upto') {
      s.appendChild(svg('line', { x1: ref - 52, y1: Y, x2: ref - 8, y2: Y, class: 'tt-arrow' }));
      s.appendChild(svg('circle', { cx: ref - 52, cy: Y, r: 7, class: 'tt-act' }));
      arrowHead(ref);
    } else if (t.tl === 'spanUpto') {
      s.appendChild(svg('rect', { x: ref - 72, y: Y - 8, width: 64, height: 16, rx: 8, class: 'tt-band' }));
      arrowHead(ref);
    }
    return h('figure', { class: 'tt-tl' }, s, h('figcaption', { class: 'muted' }, TL_NOTE[t.tl]));
  }

  /* ================= таблица ================= */

  function cell(t) {
    var a = aspectOf(t);
    return h('a', { class: 'tt-cell tt-a-' + t.aspect, href: '#/tenses/' + t.id },
      h('span', { class: 'tt-cell-aspect' }, a.ru),
      h('strong', { class: 'tt-cell-name', lang: 'en' }, t.name),
      h('span', { class: 'tt-cell-ru' }, t.ru),
      hideable('tt-cell-body', [
        h('code', { class: 'tt-cell-f' }, nobr(t.formula[0])),
        h('span', { class: 'tt-cell-ex', lang: 'en' }, marked(t.ex[0][0]))
      ]));
  }

  function overview(root) {
    var d = D();
    var box = shell('tt-overview');
    var head = h('div', { class: 'tt-grid-head' }, h('span'),
      d.aspects.map(function (a) {
        return h('div', { class: 'tt-col tt-a-' + a.id }, h('strong', { lang: 'en' }, a.title), h('span', null, a.ru));
      }));
    var rows = d.times.map(function (tm) {
      return h('div', { class: 'tt-row' },
        h('div', { class: 'tt-row-head' }, h('strong', null, tm.title), h('span', { lang: 'en' }, tm.en)),
        d.aspects.map(function (a) { var t = cellFor(tm.id, a.id); return t ? cell(t) : h('span'); }));
    });

    box.append(
      EG.ui.pageHead('Таблица времён', '12 времён на одном экране. Строка — когда, столбец — что именно важно. Нажмите на время, чтобы открыть карточку.', quizToggle(box)),
      h('p', { class: 'tt-quiz-hint', hidden: true }, icon('bulb'), 'Формулы и примеры скрыты. Вспомните их сами, потом нажмите на блок и проверьте себя: так материал запоминается намного лучше, чем при перечитывании.'),
      h('section', { class: 'card tt-key-card' },
        h('h2', { class: 'card-title' }, 'Ключ ко всей таблице'),
        h('p', { class: 'muted tt-lead' }, 'Смысл столбца одинаков в прошлом, настоящем и будущем — меняется только точка отсчёта. Форму собирают как конструктор: «время» берёт на себя первый глагол (was / is / will), а «вид» задаёт схема.'),
        h('div', { class: 'tt-aspects' }, d.aspects.map(function (a) {
          return h('div', { class: 'tt-aspect tt-a-' + a.id },
            h('div', { class: 'tt-aspect-top' }, h('strong', { lang: 'en' }, a.title), h('span', { class: 'tt-aspect-ru' }, a.ru)),
            h('p', null, a.idea),
            h('code', null, nobr(a.form)));
        }))),
      h('div', { class: 'tt-table' }, head, rows),
      h('section', { class: 'card tt-steps' },
        h('h2', { class: 'card-title' }, 'Как выбрать время за 3 вопроса'),
        h('ol', null, d.steps.map(function (s) { return h('li', null, h('strong', null, s.q), ' ', h('span', { class: 'muted' }, s.a)); })))
    );
    root.append(box);
    applyQuiz(box);
    return null;
  }

  /* ================= карточка времени ================= */

  function block(title, body) {
    return h('section', { class: 'tt-block' }, h('div', { class: 'tt-label' }, title), body);
  }

  function detail(root, t) {
    var d = D(), list = d.list, i = list.indexOf(t);
    var prev = list[i - 1], next = list[i + 1];
    var tm = timeOf(t), a = aspectOf(t);
    var box = shell('tt-detail');
    var gr = t.grammar && EG.grammar && EG.grammar.data && EG.grammar.data.byId && EG.grammar.data.byId[t.grammar];
    var signs = ['+', '−', '?'];

    box.append(
      h('a', { class: 'back-link', href: '#/tenses' }, icon('back'), 'Таблица времён'),
      h('header', { class: 'tt-detail-head' },
        h('div', null,
          h('h1', { lang: 'en' }, t.name),
          h('p', { class: 'tt-detail-ru' }, t.ru),
          h('div', { class: 'tt-tags' },
            h('span', { class: 'tt-tag' }, tm.title),
            h('span', { class: 'tt-tag tt-a-' + t.aspect }, a.title + ' · ' + a.ru),
            h('span', { class: 'tt-tag tt-lvl' }, t.level))),
        quizToggle(box)),
      h('p', { class: 'tt-quiz-hint', hidden: true }, icon('bulb'), 'Перед тем как открыть блок, скажите ответ вслух или про себя — потом сверьтесь.'),
      h('div', { class: 'card tt-card' },
        timeline(t),
        h('div', { class: 'tt-two' },
          block('Когда', hideable('', h('ul', { class: 'tt-when' }, t.when.map(function (w) { return h('li', null, w); })))),
          block('Формула', hideable('', h('div', { class: 'tt-formula' }, t.formula.map(function (f, k) {
            return h('div', { class: 'tt-f-row' }, h('span', { class: 'tt-f-tag' }, signs[k]), h('code', null, nobr(f)));
          }))))),
        block('Примеры', h('div', { class: 'tt-examples' }, t.ex.map(function (e) {
          return h('div', { class: 'tt-ex' },
            h('div', { class: 'tt-ex-en', lang: 'en' }, h('span', null, marked(e[0])), EG.ui.speakBtn(plain(e[0]), true)),
            hideable('tt-ex-ru', e[1]));
        }))),
        block('Слова-подсказки', h('div', { class: 'tt-markers' }, t.markers.map(function (m) { return h('span', { class: 'tt-marker', lang: 'en' }, m); })))),
      h('section', { class: 'card tt-vs' },
        h('h2', { class: 'card-title' }, '⚖️ Не путай'),
        t.vs.map(function (v) {
          var o = d.byId[v.id];
          return h('div', { class: 'tt-vs-item' },
            o ? h('a', { class: 'tt-vs-link', href: '#/tenses/' + o.id, lang: 'en' }, t.name + ' vs ' + o.name) : null,
            hideable('', h('p', null, v.text)));
        })),
      h('p', { class: 'tt-pitfall' }, icon('mistakes'), h('span', null, h('strong', null, 'Частая ошибка. '), t.pitfall)),
      h('div', { class: 'tt-nav' },
        prev ? h('a', { class: 'btn ghost', href: '#/tenses/' + prev.id }, icon('back'), h('span', { lang: 'en' }, prev.name)) : h('span'),
        gr ? h('a', { class: 'btn', href: '#/grammar/t/' + t.grammar }, 'Урок и практика') : null,
        next ? h('a', { class: 'btn primary', href: '#/tenses/' + next.id }, h('span', { lang: 'en' }, next.name), icon('arrow')) : h('a', { class: 'btn primary', href: '#/tenses' }, 'К таблице'))
    );
    root.append(box);
    applyQuiz(box);
    return null;
  }

  EG.views.tenses = function (root, params) {
    if (!T.data || !T.data.list || !T.data.list.length) {
      root.append(EG.ui.empty('help', 'Таблица времён недоступна', 'Не удалось загрузить материалы раздела.'));
      return null;
    }
    var id = params && params[0];
    if (!id) return overview(root);
    var t = T.data.byId[id];
    if (!t) {
      root.append(EG.ui.empty('help', 'Время не найдено', 'Возможно, ссылка устарела.', h('a', { class: 'btn', href: '#/tenses' }, 'К таблице времён')));
      return null;
    }
    return detail(root, t);
  };
})(window.EG = window.EG || {});
