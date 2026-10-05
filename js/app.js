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

  /** Пункты меню с разделителем там, где меняется блок (route.group). */
  function navList(routes, cls) {
    var out = [];
    routes.forEach(function (r, i) {
      if (i && r.group !== routes[i - 1].group) out.push(h('div', { class: 'nav-sep', role: 'separator' }));
      out.push(navLink(r, cls));
    });
    return out;
  }

  function buildNav() {
    var routes = EG.router.ROUTES.filter(function (r) { return r.nav; });
    var side = document.getElementById('side-nav');
    side.replaceChildren.apply(side, navList(routes, 'nav-item'));

    var bottom = document.getElementById('bottom-nav');
    var main = routes.filter(function (r) { return r.nav === 'main'; });
    var more = routes.filter(function (r) { return r.nav === 'side'; });
    var sheet = h('div', { class: 'sheet', id: 'more-sheet', hidden: true },
      h('div', { class: 'sheet-inner' }, navList(more, 'sheet-item')));
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

  /** Что означают 🔥 и ⚡ в сайдбаре — цифры без подписи никому ни о чём не говорят. */
  function hudHelp() {
    var goal = EG.storage.get('dailyGoal');
    var xp = EG.state.today().xp;
    var streak = EG.progress.currentStreak();
    EG.ui.modal({
      title: 'Что означают эти цифры',
      body: [
        h('p', null, h('strong', null, '🔥 Серия — ' + streak + ' ' + EG.util.plural(streak, 'день', 'дня', 'дней')),
          '. Сколько дней подряд вы занимались. День засчитывается за любой верный или неверный ответ; пропустили день — серия обнуляется.'),
        h('p', null, h('strong', null, '⚡ XP за сегодня — ' + xp + ' из ' + goal),
          '. Очки за ответы: примерно 10 XP за верный ответ, в играх — с множителем за серию без ошибок. ' +
          goal + ' XP — ваша дневная цель, её можно изменить в «Настройках».'),
        xp >= goal
          ? h('p', { class: 'muted small' }, 'Цель на сегодня выполнена. Всё, что сверх неё, идёт в общий счёт и в статистику — счётчик не останавливается.')
          : h('p', { class: 'muted small' }, 'Осталось ' + (goal - xp) + ' XP до дневной цели.')
      ],
      actions: [
        { label: 'Открыть «Прогресс»', value: 'progress', primary: true },
        { label: 'Закрыть', value: null }
      ]
    }).then(function (v) { if (v === 'progress') location.hash = '#/progress'; });
  }

  var badgesQueued = false;
  function scheduleBadges() {
    if (badgesQueued) return;
    badgesQueued = true;
    requestAnimationFrame(function () { badgesQueued = false; updateBadges(); });
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
    if (xpEl) {
      var goal = EG.storage.get('dailyGoal'), xp = EG.state.today().xp, done = xp >= goal;
      xpEl.textContent = xp;
      var xpLab = document.getElementById('hud-xp-label');
      if (xpLab) xpLab.textContent = done ? 'цель ' + goal + ' ✓' : 'XP · цель ' + goal;
      var xpChip = document.getElementById('hud-xp-btn');
      if (xpChip) xpChip.classList.toggle('done', done);
    }
    if (stEl) {
      var streak = EG.progress.currentStreak();
      stEl.textContent = streak;
      var stLab = document.getElementById('hud-streak-label');
      if (stLab) stLab.textContent = EG.util.plural(streak, 'день', 'дня', 'дней') + ' подряд';
    }
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

  /* ---------- состояние хранилища: баннер поверх интерфейса ---------- */
  var banner = null;
  function showBanner(kind, text, actions) {
    if (banner) banner.remove();
    banner = h('div', { class: 'app-banner ' + kind, role: 'alert' },
      h('span', null, text),
      h('span', { class: 'row gap' }, actions || []));
    document.body.appendChild(banner);
  }

  var lastErrorToast = 0;
  function errorToast(msg) {
    var now = Date.now();
    if (now - lastErrorToast < 4000) return; // не заваливать уведомлениями
    lastErrorToast = now;
    EG.ui.toast(msg, 'bad');
  }

  function installGuards() {
    // любая неперехваченная ошибка сохранения — пользователь должен о ней узнать
    window.addEventListener('unhandledrejection', function (e) {
      var r = e.reason || {};
      if (r.name === 'InactiveTab' || r.name === 'DbLost') { e.preventDefault(); return; }
      console.error('[EnglishGo]', r);
      errorToast('Что-то пошло не так: ' + (r.message || r.name || 'ошибка') + '. Прогресс мог не сохраниться.');
    });
    window.addEventListener('error', function (e) {
      if (!e.filename || e.filename.indexOf('file:') !== 0 && e.filename.indexOf(location.origin) !== 0) return;
      errorToast('Ошибка в приложении: ' + e.message);
    });

    EG.bus.on('db-error', function (d) {
      if (d.quota) {
        showBanner('bad', 'Недостаточно места в хранилище браузера — прогресс не сохраняется.', [
          h('button', { class: 'btn sm', onclick: function () { EG.db.pruneAnswers(1000).then(function () { EG.ui.toast('Старая история ответов очищена', 'good'); banner.remove(); banner = null; }).catch(function () {}); } }, 'Очистить старую историю'),
          h('a', { class: 'btn sm primary', href: '#/settings' }, 'Сделать экспорт')]);
      } else {
        showBanner('bad', 'Не удалось сохранить прогресс (' + (d.error && (d.error.name || d.error.message)) + '). Сделайте экспорт на всякий случай.', [
          h('a', { class: 'btn sm primary', href: '#/settings' }, 'Экспорт'),
          h('button', { class: 'btn sm', onclick: function () { banner.remove(); banner = null; } }, 'Скрыть')]);
      }
    });
    EG.bus.on('db-lost', function () {
      showBanner('bad', 'EnglishGo обновлён в другой вкладке. Перезагрузите страницу, чтобы продолжить и не потерять прогресс.', [
        h('button', { class: 'btn sm primary', onclick: function () { location.reload(); } }, 'Перезагрузить')]);
    });
    EG.bus.on('db-blocked', function () {
      var boot = document.querySelector('.boot');
      if (boot) boot.textContent = 'Ожидание базы данных… Закройте другие вкладки с EnglishGo.';
    });
    EG.bus.on('instance-inactive', function () {
      // другая вкладка забрала управление — эта больше ничего не пишет
      document.body.appendChild(h('div', { class: 'overlay show instance-lock' },
        h('div', { class: 'modal' },
          h('h3', { class: 'modal-title' }, 'EnglishGo открыт в другой вкладке'),
          h('p', null, 'Чтобы вкладки не перезаписывали прогресс друг друга, работать можно только в одной. Эта вкладка приостановлена.'),
          h('div', { class: 'modal-actions' }, h('button', { class: 'btn primary', onclick: function () { EG.instance.takeover(); } }, 'Работать здесь')))));
    });
    // настройки изменили в другой вкладке (или после перехвата) — перечитать
    window.addEventListener('storage', function (e) {
      if (e.key === 'eg.settings') { EG.storage.reload(); applyTheme(); }
    });
  }

  function showAlreadyOpen() {
    document.body.classList.remove('loading');
    var view = document.getElementById('view');
    view.replaceChildren(EG.ui.empty('chat', 'EnglishGo уже открыт в другой вкладке',
      'Перейдите в ту вкладку. Или продолжите здесь — тогда другая вкладка будет приостановлена, чтобы прогресс не перезаписывался.',
      h('button', { class: 'btn primary', onclick: function () { EG.instance.takeover(); } }, 'Работать здесь')));
  }

  function boot() {
    EG.db.open()
      .then(function () { return EG.state.load(); })
      .catch(function (e) { console.error(e); EG.ui.toast('Ошибка загрузки данных: ' + e.message, 'bad'); })
      .then(function () {
        document.body.classList.remove('loading');
        EG.router.start(document.getElementById('view'));
        updateBadges();
        onboarding();
        if (EG.chat && EG.chat.completePending) EG.chat.completePending();
      });

    ['cards', 'answer', 'xp', 'loaded', 'settings', 'streak'].forEach(function (e) { EG.bus.on(e, scheduleBadges); });
    window.addEventListener('hashchange', scheduleBadges);
    EG.bus.on('goal', function () { EG.ui.toast('Дневная цель выполнена! 🎉', 'good'); });
    EG.bus.on('streak', function (n) { if (n > 1) EG.ui.toast('Серия: ' + n + ' ' + EG.util.plural(n, 'день', 'дня', 'дней') + ' подряд 🔥', 'good'); });
    EG.bus.on('voices', function (list) {
      // голоса появились позже (Safari) — перерисовать экран, чтобы показать кнопки озвучки
      if (list && list.length && !voicesSeen) { voicesSeen = true; if (EG.router && location.hash && !/^#\/(game|chat|session|lesson\/[^/]+\/start|review\/start|mistakes\/train)/.test(location.hash)) EG.router.refresh(); }
    });

    // смена дня, пока приложение открыто
    var day = EG.util.dateKey();
    setInterval(function () {
      if (EG.util.dateKey() !== day) { day = EG.util.dateKey(); updateBadges(); }
    }, 60000);

    // запрос на постоянное хранилище, чтобы браузер не очищал данные
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(function (ok) { EG.app.persisted = !!ok; }).catch(function () { EG.app.persisted = false; });
    }
  }

  var voicesSeen = false;

  function init() {
    h = EG.ui.h; icon = EG.ui.icon;
    applyTheme();
    if (window.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      var f = function () { if (EG.storage.get('theme') === 'auto') applyTheme(); };
      if (mq.addEventListener) mq.addEventListener('change', f); else if (mq.addListener) mq.addListener(f);
    }
    buildNav();
    ['hud-streak-btn', 'hud-xp-btn'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', hudHelp);
    });
    installGuards();
    voicesSeen = EG.ui.voices().length > 0;
    EG.instance.start().then(function (active) { if (active) boot(); else showAlreadyOpen(); });
  }

  EG.app = { applyTheme: applyTheme, updateBadges: scheduleBadges, persisted: null };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.EG = window.EG || {});
