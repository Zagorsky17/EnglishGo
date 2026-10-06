/* router.js — hash-роутер (работает через file://) */
(function (EG) {
  'use strict';

  // nav: 'main' — в нижней панели на телефоне, 'side' — только в меню/сайдбаре
  // group — блок меню: между блоками рисуется разделитель (учёба · грамматика · неправильные глаголы · остальное)
  var ROUTES = [
    { path: 'home',      title: 'Главная',        icon: 'home',      nav: 'main', group: 'home' },
    { path: 'favorites', title: 'Избранное',      icon: 'star',      nav: 'side', group: 'home' },
    { path: 'today',     title: 'Учить сегодня',  short: 'Сегодня', icon: 'today', nav: 'main', group: 'learn' },
    { path: 'vocab',     title: 'Словарный запас', short: 'Слова',  icon: 'vocab', nav: 'main', group: 'learn' },
    { path: 'chats',     title: 'Чаты',           icon: 'chat',      nav: 'main', group: 'learn' },
    { path: 'games',     title: 'Игры',           icon: 'game',      nav: 'main', group: 'learn' },
    { path: 'review',    title: 'Повторение',     icon: 'review',    nav: 'side', group: 'learn' },
    { path: 'talk',      title: 'Разговор',       icon: 'talk',      nav: 'side', group: 'learn' },
    { path: 'dialogues', title: 'Диалоги',        icon: 'dialogues', nav: 'side', group: 'learn' },
    { path: 'reading',   title: 'Чтение',         icon: 'book',      nav: 'side', group: 'learn' },
    { path: 'grammar',   title: 'Грамматика',     icon: 'grammar',   nav: 'side', group: 'grammar' }, // изолированный модуль grammar/
    { path: 'gtoday',    title: 'Грамматика сегодня', short: 'Грамм. сегодня', icon: 'bolt', nav: 'side', group: 'grammar' }, // изолированный модуль gtoday/
    { path: 'tenses',    title: 'Таблица времён', icon: 'target',    nav: 'side', group: 'grammar' }, // изолированный модуль tenses/
    { path: 'iverbs',    title: 'Неправильные глаголы сегодня', icon: 'flame', nav: 'side', group: 'verbs' }, // изолированный модуль irregular/
    { path: 'irregular', title: 'Неправильные глаголы', icon: 'table', nav: 'side', group: 'verbs' }, // изолированный модуль irregular/
    { path: 'words',     title: 'Выражения',      icon: 'words',     nav: 'side', group: 'more' },
    { path: 'mistakes',  title: 'Ошибки',         icon: 'mistakes',  nav: 'side', group: 'more' },
    { path: 'progress',  title: 'Прогресс',       icon: 'progress',  nav: 'side', group: 'more' },
    { path: 'settings',  title: 'Настройки',      icon: 'settings',  nav: 'side', group: 'more' },
    // вложенные экраны (без пункта меню)
    { path: 'lesson',    parent: 'today' },
    { path: 'dialogue',  parent: 'dialogues' },
    { path: 'story',     parent: 'dialogues' },
    { path: 'text',      parent: 'reading' },
    { path: 'session',   parent: 'today' },
    { path: 'chat',      parent: 'chats' },
    { path: 'game',      parent: 'games' }
  ];

  var cleanup = null;
  var viewEl = null;
  var renderToken = 0;

  function parse() {
    var hash = location.hash.replace(/^#\/?/, '');
    var parts = hash.split('/').filter(Boolean).map(decodeURIComponent);
    var name = parts[0] || 'home';
    var route = ROUTES.filter(function (r) { return r.path === name; })[0];
    if (!route || !EG.views[name]) { name = 'home'; route = ROUTES[0]; parts = []; }
    return { name: name, route: route, params: parts.slice(1) };
  }

  function render() {
    if (!viewEl) return; // события (например, загрузка голосов) могут прийти до старта роутера
    var p = parse();
    var token = ++renderToken;
    if (typeof cleanup === 'function') { try { cleanup(); } catch (e) { console.error(e); } }
    cleanup = null;
    EG.ui.stopSpeech();
    viewEl.replaceChildren();
    viewEl.className = 'view view-' + p.name;
    var active = p.route.parent || p.name;
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-nav') === active);
      if (a.getAttribute('data-nav') === active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var moreBtn = document.querySelector('[data-nav-more]');
    if (moreBtn) {
      var inMore = ROUTES.some(function (r) { return r.nav === 'side' && r.path === active; });
      moreBtn.classList.toggle('active', inMore);
    }
    var t = (p.route.title || (ROUTES.filter(function (r) { return r.path === active; })[0] || {}).title || '');
    document.title = (t ? t + ' · ' : '') + 'EnglishGo';
    window.scrollTo(0, 0);
    Promise.resolve()
      .then(function () { return EG.views[p.name](viewEl, p.params); })
      .then(function (fn) { if (token === renderToken) cleanup = fn || null; else if (typeof fn === 'function') fn(); })
      .catch(function (err) {
        console.error(err);
        viewEl.replaceChildren(EG.ui.empty('mistakes', 'Что-то пошло не так', String(err && err.message || err)));
      });
    viewEl.focus({ preventScroll: true });
  }

  EG.router = {
    ROUTES: ROUTES,
    start: function (el) {
      viewEl = el;
      // экраны передают в append массивы и null (условные блоки) — разворачиваем и пропускаем пустое
      el.append = function () {
        var items = Array.prototype.slice.call(arguments).flat(Infinity).filter(function (x) { return x != null && x !== false; });
        Element.prototype.append.apply(el, items);
      };
      window.addEventListener('hashchange', render);
      render();
    },
    go: function (path) {
      var target = '#/' + path.replace(/^#?\/?/, '');
      if (location.hash === target) render(); else location.hash = target;
    },
    refresh: render
  };
})(window.EG = window.EG || {});
