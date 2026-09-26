/* ui.js — DOM-хелперы, иконки, уведомления, модальные окна, озвучка, графики */
(function (EG) {
  'use strict';

  /* ---------- создание элементов ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'style') { if (typeof v === 'object') Object.assign(el.style, v); } // строковый style не поддерживаем (CSP)
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }

  function append(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(el, x); }); return; }
    el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }

  // замена детей с пропуском null/false (нативный replaceChildren превращает null в текст «null»)
  function fill(el) {
    el.replaceChildren();
    for (var i = 1; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }

  /* ---------- иконки (inline SVG) ---------- */
  var ICONS = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    today: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    words: '<path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z"/><path d="M4 20a2 2 0 0 0 2 1h13"/><path d="M9 8h6"/>',
    dialogues: '<path d="M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/><path d="M17 9h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v3l-4-3h-3"/>',
    talk: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
    review: '<path d="M20 12a8 8 0 1 1-2.3-5.7L20 8.5"/><path d="M20 3.5v5h-5"/>',
    mistakes: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5"/><path d="M12 17.5v.01"/>',
    progress: '<path d="M4 20V11"/><path d="M10 20V5"/><path d="M16 20v-7"/><path d="M21 20H3"/>',
    settings: '<path d="M4 7h9"/><path d="M17 7h3"/><circle cx="15" cy="7" r="2"/><path d="M4 17h3"/><path d="M11 17h9"/><circle cx="9" cy="17" r="2"/>',
    more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    speaker: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>',
    flame: '<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.5 2-5 1 1.5 2 2 2 2s-1-3 1-7z"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5"/><path d="M4 19h16"/>',
    upload: '<path d="M12 16V5M7 10l5-5 5 5"/><path d="M4 19h16"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    target: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    chat: '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/>',
    game: '<rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="15.5" cy="11.5" r="1"/><circle cx="17.5" cy="13.5" r="1"/>',
    heart: '<path d="M12 20s-7-4.4-9-8.8C1.6 8 3.6 4.5 7 4.5c2 0 3.3 1 5 3 1.7-2 3-3 5-3 3.4 0 5.4 3.5 4 6.7-2 4.4-9 8.8-9 8.8z"/>',
    send: '<path d="M4 12l16-8-6 16-2.5-6.5z"/><path d="M11.5 13.5L20 4"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.4"/><path d="M12 17h.01"/>',
    vocab: '<rect x="3" y="7" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/><path d="M7 12h6M7 16h4"/>',
    book: '<path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z"/><path d="M12 6v14"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
  };

  function icon(name, cls) {
    var span = document.createElement('span');
    span.className = 'ic' + (cls ? ' ' + cls : '');
    span.setAttribute('aria-hidden', 'true');
    // единственный innerHTML в приложении: только константы из ICONS, никаких данных пользователя
    var paths = Object.prototype.hasOwnProperty.call(ICONS, name) ? ICONS[name] : '';
    span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
    return span;
  }

  /* ---------- уведомления ---------- */
  function toast(msg, tone) {
    var root = document.getElementById('toast-root');
    if (!root) return;
    var el = h('div', { class: 'toast ' + (tone || ''), role: 'status' }, msg);
    root.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
    setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () { el.remove(); }, 300);
    }, 2800);
  }

  /* ---------- модальное окно ---------- */
  function modal(opts) {
    var root = document.getElementById('modal-root');
    var prevFocus = document.activeElement;
    return new Promise(function (resolve) {
      function close(val) {
        document.removeEventListener('keydown', onKey, true);
        overlay.classList.remove('show');
        setTimeout(function () { overlay.remove(); if (prevFocus && prevFocus.focus) prevFocus.focus(); }, 200);
        resolve(val);
      }
      function onKey(e) {
        if (e.key === 'Escape') { e.stopPropagation(); close(null); return; }
        if (e.key === 'Tab') {
          // удерживаем фокус внутри окна
          var f = box.querySelectorAll('button, a[href], input, select, textarea, summary, [tabindex="0"]');
          if (!f.length) return;
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
      var actions = (opts.actions || [{ label: 'Закрыть', value: null }]).map(function (a) {
        return h('button', { class: 'btn ' + (a.kind || (a.primary ? 'primary' : 'ghost')), onclick: function () { close(a.value); } }, a.label);
      });
      var box = h('div', { class: 'modal' + (opts.wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true', 'aria-label': opts.title || '' },
        opts.title ? h('h3', { class: 'modal-title' }, opts.title) : null,
        h('div', { class: 'modal-body' }, opts.body || null),
        h('div', { class: 'modal-actions' }, actions)
      );
      var overlay = h('div', { class: 'overlay', onclick: function (e) { if (e.target === overlay) close(null); } }, box);
      root.appendChild(overlay);
      document.addEventListener('keydown', onKey, true);
      requestAnimationFrame(function () {
        overlay.classList.add('show');
        var primary = box.querySelector('.btn.primary') || box.querySelector('.btn');
        if (primary) primary.focus();
      });
    });
  }

  function confirmDialog(title, text, okLabel, danger) {
    return modal({
      title: title, body: h('p', null, text),
      actions: [{ label: 'Отмена', value: false }, { label: okLabel || 'Да', value: true, kind: danger ? 'danger' : 'primary' }]
    }).then(function (v) { return v === true; });
  }

  /* ---------- озвучка (speechSynthesis, офлайн-голоса ОС) ---------- */
  var allVoices = [];
  var synth = window.speechSynthesis || null;
  var activated = false; // было ли действие пользователя (браузеры не дают говорить без него)

  function loadVoices() {
    if (!synth) return;
    var before = allVoices.length;
    try { allVoices = synth.getVoices().filter(function (v) { return /^en[-_]/i.test(v.lang) || v.lang === 'en'; }); } catch (e) { allVoices = []; }
    if (allVoices.length !== before && EG.bus) EG.bus.emit('voices', allVoices);
  }

  /** Доступные голоса: по умолчанию только локальные (офлайн, текст не уходит в сеть). */
  function usableVoices() {
    if (EG.storage.get('onlineVoices')) return allVoices;
    return allVoices.filter(function (v) { return v.localService !== false; });
  }

  if (synth) {
    loadVoices();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', loadVoices);
    else synth.onvoiceschanged = loadVoices;
    // Safari/iOS часто отдаёт голоса позже и без события — проверяем ещё несколько раз
    [300, 1000, 3000, 7000].forEach(function (ms) { setTimeout(loadVoices, ms); });
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (evt) {
    window.addEventListener(evt, function once() {
      activated = true;
      loadVoices();
      window.removeEventListener(evt, once, true);
    }, true);
  });

  function pickVoice() {
    var pool = usableVoices();
    var name = EG.storage.get('voice');
    var v = pool.filter(function (x) { return x.name === name; })[0];
    if (v) return v;
    return pool.filter(function (x) { return /en[-_]US/i.test(x.lang); })[0] ||
      pool.filter(function (x) { return /en[-_]GB/i.test(x.lang); })[0] || pool[0] || null;
  }

  function canSpeak() { return !!synth && usableVoices().length > 0 && EG.storage.get('speech'); }

  function speak(text, onEnd, rate) {
    if (!canSpeak()) { if (onEnd) onEnd(false); return false; }
    try {
      synth.cancel();
      var u = new SpeechSynthesisUtterance(text);
      var v = pickVoice();
      if (!v) { if (onEnd) onEnd(false); return false; } // сетевые голоса без разрешения не используем
      u.voice = v; u.lang = v.lang;
      u.rate = rate || EG.storage.get('rate') || 1;
      if (onEnd) { u.onend = function () { onEnd(true); }; u.onerror = function () { onEnd(false); }; }
      synth.speak(u);
      return true;
    } catch (e) { if (onEnd) onEnd(false); return false; }
  }

  /** Автоозвучка: только если включена в настройках и пользователь уже взаимодействовал со страницей. */
  function autoSpeak(text) {
    var active = activated || (navigator.userActivation && navigator.userActivation.hasBeenActive);
    if (!active || !EG.storage.get('autoSpeak') || !canSpeak()) return false;
    return speak(text);
  }

  function stopSpeech() { try { if (synth) synth.cancel(); } catch (e) { /* ignore */ } }

  function speakBtn(text, small) {
    if (!canSpeak()) return null;
    return h('button', { class: 'icon-btn speak' + (small ? ' sm' : ''), type: 'button', title: 'Прослушать', 'aria-label': 'Прослушать',
      onclick: function (e) { e.stopPropagation(); speak(text); } }, icon('speaker'));
  }

  /* ---------- визуальные компоненты ---------- */
  /** SVG-элемент без innerHTML: значения попадают только в атрибуты и текстовые узлы. */
  function svg(tag, attrs, children) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, String(attrs[k])); });
    (children || []).forEach(function (c) { if (c != null) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }

  function ring(pct, label, sub) {
    pct = EG.util.clamp(Number(pct) || 0, 0, 100);
    var r = 52, c = 2 * Math.PI * r;
    var wrap = h('div', { class: 'ring' });
    wrap.appendChild(svg('svg', { viewBox: '0 0 120 120', 'aria-hidden': 'true' }, [
      svg('circle', { class: 'ring-bg', cx: 60, cy: 60, r: r }),
      svg('circle', { class: 'ring-fg', cx: 60, cy: 60, r: r, 'stroke-dasharray': c.toFixed(1), 'stroke-dashoffset': (c * (1 - pct / 100)).toFixed(1) })
    ]));
    wrap.appendChild(h('div', { class: 'ring-label' }, h('strong', null, label), sub ? h('span', null, sub) : null));
    return wrap;
  }

  function bar(pct, tone) {
    return h('div', { class: 'bar ' + (tone || ''), role: 'progressbar', 'aria-valuenow': Math.round(pct), 'aria-valuemin': 0, 'aria-valuemax': 100 },
      h('span', { style: { width: EG.util.clamp(pct, 0, 100) + '%' } }));
  }

  /** Столбчатая диаграмма (SVG): data = [{label, value}] */
  function barChart(data, opts) {
    opts = opts || {};
    var W = 640, H = 180, padB = 26, padT = 18, padL = 6;
    var vals = data.map(function (d) { return Number(d.value) || 0; });
    var max = Math.max.apply(null, vals.concat([opts.min || 1]));
    var n = data.length, gap = 6;
    var bw = (W - padL * 2 - gap * (n - 1)) / n;
    var kids = [];
    if (opts.goal) {
      var gy = padT + (H - padT - padB) * (1 - Math.min(1, opts.goal / max));
      kids.push(svg('line', { x1: 0, x2: W, y1: gy.toFixed(1), y2: gy.toFixed(1), class: 'chart-goal' }));
    }
    data.forEach(function (d, i) {
      var v = vals[i];
      var hgt = (H - padT - padB) * (v / max);
      var x = padL + i * (bw + gap), y = H - padB - hgt;
      kids.push(svg('rect', { x: x.toFixed(1), y: y.toFixed(1), width: bw.toFixed(1), height: Math.max(hgt, v ? 2 : 0).toFixed(1), rx: 4, class: 'chart-bar' + (d.hi ? ' hi' : '') },
        [svg('title', null, [d.label + ': ' + v])]));
      if (v && n <= 16) kids.push(svg('text', { x: (x + bw / 2).toFixed(1), y: (y - 4).toFixed(1), class: 'chart-val' }, [String(v)]));
      kids.push(svg('text', { x: (x + bw / 2).toFixed(1), y: H - 8, class: 'chart-lbl' }, [String(d.label)]));
    });
    var wrap = h('div', { class: 'chart-wrap' });
    wrap.appendChild(svg('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'chart', role: 'img', 'aria-label': opts.label || '' }, kids));
    return wrap;
  }

  function levelBadge(level) { return h('span', { class: 'badge lvl lvl-' + level }, level); }

  var REGISTER = { casual: 'разговорное', neutral: 'нейтральное', formal: 'формальное' };
  var TYPES = { word: 'слово', phrase: 'фраза', idiom: 'идиома', contraction: 'разговорная форма', phrasal: 'фразовый глагол', chunk: 'конструкция' };

  function registerBadge(r) { return r ? h('span', { class: 'badge reg-' + r }, REGISTER[r] || r) : null; }

  function empty(iconName, title, text, action) {
    return h('div', { class: 'empty' }, icon(iconName, 'lg'), h('h3', null, title), text ? h('p', null, text) : null, action || null);
  }

  function pageHead(title, sub, extra) {
    return h('header', { class: 'page-head' },
      h('div', null, h('h1', null, title), sub ? h('p', { class: 'muted' }, sub) : null), extra || null);
  }

  /** Подсветка выражения в примере. */
  function highlight(item) {
    var f = EG.exercises.findInExample(item);
    if (!f) return h('span', null, item.example || '');
    return h('span', null, f.before, h('mark', null, f.match), f.after);
  }

  function formatDate(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  }

  function relDue(ts) {
    var diff = ts - Date.now();
    if (diff <= 0) return 'сейчас';
    return 'через ' + EG.srs.describeInterval(diff);
  }

  EG.ui = {
    h: h, fill: fill, icon: icon, toast: toast, modal: modal, confirm: confirmDialog,
    speak: speak, autoSpeak: autoSpeak, stopSpeech: stopSpeech, canSpeak: canSpeak, speakBtn: speakBtn,
    voices: function () { return allVoices; },
    usableVoices: usableVoices,
    ring: ring, bar: bar, barChart: barChart, levelBadge: levelBadge, registerBadge: registerBadge,
    REGISTER: REGISTER, TYPES: TYPES, empty: empty, pageHead: pageHead, highlight: highlight,
    formatDate: formatDate, relDue: relDue
  };
})(window.EG = window.EG || {});
