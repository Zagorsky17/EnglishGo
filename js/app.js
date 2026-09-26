/* app.js — точка входа: инициализация хранилищ, навигация, тема, онбординг */
(function (EG) {
  'use strict';

  var h, icon;

  function applyTheme() {
    var t = EG.storage.get('theme');
    if (t === 'auto') t = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.classList.toggle('compact', !!EG.storage.get('compact'));
  }

  function navLink(r, cls) {
    return h('a', { href: '#/' + r.path, class: cls, 'data-nav': r.path }, icon(r.icon), h('span', null, cls === 'bn-item' ? (r.short || r.title) : r.title),
      r.path === 'review' ? h('span', { class: 'nav-count', 'data-count': 'review' }) : null,
      r.path === 'mistakes' ? h('span', { class: 'nav-count', 'data-count': 'mistakes' }) : null,
      r.path === 'chats' ? h('span', { class: 'nav-count green', 'data-count': 'chats' }) : null);
  }

  function buildNav() {
    var routes = EG.router.ROUTES.filter(function (r) { return r.nav; });
    var side = document.getElementById('side-nav');
    side.replaceChildren.apply(side, routes.map(function (r) { return navLink(r, 'nav-item'); }));

    var bottom = document.getElementById('bottom-nav');
    var main = routes.filter(function (r) { return r.nav === 'main'; });
    var more = routes.filter(function (r) { return r.nav === 'side'; });
    var sheet = h('div', { class: 'sheet', id: 'more-sheet', hidden: true },
      h('div', { class: 'sheet-inner' }, more.map(function (r) { return navLink(r, 'sheet-item'); })));
    var moreBtn = h('button', { class: 'bn-item', type: 'button', 'data-nav-more': '', 'aria-expanded': 'false', onclick: function () {
      var open = sheet.hidden;
      sheet.hidden = !open;
      moreBtn.setAttribute('aria-expanded', String(open));
    } }, icon('more'), h('span', null, 'Ещё'));
    bottom.replaceChildren.apply(bottom, main.map(function (r) { return navLink(r, 'bn-item'); }).concat([moreBtn]));
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) { if (e.target === sheet || e.target.closest('a')) { sheet.hidden = true; moreBtn.setAttribute('aria-expanded', 'false'); } });
    window.addEventListener('hashchange', function () { sheet.hidden = true; });
  }

  function updateBadges() {
    var review = EG.srs.getDue().filter(function (c) { return c.state !== 'new'; }).length;
    var mistakes = EG.progress.unresolvedMistakes().length;
    var chats = EG.chat.unreadTotal();
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var k = el.getAttribute('data-count');
      var n = k === 'review' ? review : k === 'chats' ? chats : mistakes;
      el.textContent = n > 99 ? '99+' : n ? String(n) : '';
    });
    var xpEl = document.getElementById('hud-xp'), stEl = document.getElementById('hud-streak');
    if (xpEl) xpEl.textContent = EG.state.today().xp + '/' + EG.storage.get('dailyGoal');
    if (stEl) stEl.textContent = EG.progress.currentStreak();
  }

  function onboarding() {
    if (EG.storage.get('onboarded') || EG.state.meta.totalAnswers > 0) return;
    var chosen = EG.storage.get('level');
    var desc = {
      A1: 'Знаю буквы и пару фраз. Хочу начать говорить.',
      A2: 'Могу представиться и заказать кофе, но теряюсь в разговоре.',
      B1: 'Объясняюсь в поездке, но говорю медленно и «по-книжному».',
      B2: 'Свободно общаюсь, хочу звучать естественнее.',
      C1: 'Говорю уверенно, нужны тонкости, идиомы и деловой стиль.'
    };
    var list = h('div', { class: 'options' }, EG.LEVELS.map(function (l) {
      var b = h('button', { class: 'option' + (l === chosen ? ' selected' : ''), type: 'button', onclick: function () {
        chosen = l;
        list.querySelectorAll('.option').forEach(function (x) { x.classList.remove('selected'); });
        b.classList.add('selected');
      } }, h('span', { class: 'opt-key' }, l), h('span', { class: 'opt-text' }, desc[l]));
      return b;
    }));
    EG.ui.modal({
      title: 'Добро пожаловать в EnglishGo!',
      body: h('div', null,
        h('p', null, 'Здесь учатся говорить: живые фразы, реальные ситуации, быстрые ответы. Всё работает офлайн и хранится на вашем устройстве.'),
        h('p', { class: 'muted small' }, 'Выберите уровень — его можно поменять в настройках, а сложность подстроится автоматически.'),
        list),
      actions: [{ label: 'Начать', value: true, primary: true }]
    }).then(function () {
      EG.storage.set('level', chosen);
      EG.storage.set('onboarded', true);
      EG.router.refresh();
    });
  }

  function init() {
    h = EG.ui.h; icon = EG.ui.icon;
    applyTheme();
    if (window.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      var f = function () { if (EG.storage.get('theme') === 'auto') applyTheme(); };
      if (mq.addEventListener) mq.addEventListener('change', f); else if (mq.addListener) mq.addListener(f);
    }
    buildNav();

    EG.db.open()
      .then(function () { return EG.state.load(); })
      .catch(function (e) { console.error(e); EG.ui.toast('Ошибка загрузки данных: ' + e.message, 'bad'); })
      .then(function () {
        document.body.classList.remove('loading');
        EG.router.start(document.getElementById('view'));
        updateBadges();
        onboarding();
      });

    ['cards', 'answer', 'xp', 'loaded', 'settings', 'streak'].forEach(function (e) { EG.bus.on(e, updateBadges); });
    window.addEventListener('hashchange', function () { setTimeout(updateBadges, 50); });
    EG.bus.on('goal', function () { EG.ui.toast('Дневная цель выполнена! 🎉', 'good'); });
    EG.bus.on('streak', function (n) { if (n > 1) EG.ui.toast('Серия: ' + n + ' ' + EG.util.plural(n, 'день', 'дня', 'дней') + ' подряд 🔥', 'good'); });
    EG.bus.on('voices', function () { if (/^#\/settings/.test(location.hash)) EG.router.refresh(); });

    // смена дня, пока приложение открыто
    var day = EG.util.dateKey();
    setInterval(function () {
      if (EG.util.dateKey() !== day) { day = EG.util.dateKey(); updateBadges(); }
    }, 60000);

    // запрос на постоянное хранилище, чтобы браузер не очищал данные
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(function () { /* не критично */ });
    }
  }

  EG.app = { applyTheme: applyTheme, updateBadges: updateBadges };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.EG = window.EG || {});
