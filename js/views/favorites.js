/* views/favorites.js — «Избранное»: выражения, отмеченные звёздочкой в карточках */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  EG.views = EG.views || {};

  var TRAIN_MAX = 20; // заданий в тренировке избранного

  /** Избранные выражения, которые есть в словаре (новые — первыми). */
  function favItems() {
    return EG.state.meta.favorites.map(function (id) { return EG.data.byId[id]; }).filter(Boolean);
  }

  EG.views.favorites = function (root, params) {
    if (params[0] === 'train') {
      var pick = EG.util.sample(favItems(), TRAIN_MAX);
      if (!pick.length) { EG.router.go('favorites'); return; }
      var ex = pick.map(function (it) {
        var e = EG.exercises.forItem(it, EG.state.cards.get(it.id));
        e.noSrs = true; // доп. практика не сдвигает расписание повторений
        return e;
      });
      return EG.player.run(root, ex, { title: 'Избранное', exitTo: 'favorites', finishTitle: 'Тренировка избранного завершена' });
    }

    var listEl = h('div', { class: 'fav-list' });
    var countEl = h('p', { class: 'muted small' });
    var trainBtn = h('a', { class: 'btn primary', href: '#/favorites/train' }, 'Тренировать', icon('arrow'));

    function remove(it) {
      EG.state.setFavorite(it.id, false).catch(function () { /* ошибка уже показана через db-error */ });
      EG.ui.toast('Убрано из избранного');
      draw();
    }

    function row(it) {
      return h('div', { class: 'fav-item' },
        h('div', { class: 'fav-main' },
          h('div', { class: 'item-line' }, h('strong', { lang: 'en' }, it.en), EG.ui.speakBtn(it.en, true), h('span', { class: 'muted' }, '— ' + it.ru)),
          it.example ? h('p', { class: 'example', lang: 'en' }, EG.ui.highlight(it), ' ', EG.ui.speakBtn(it.example, true)) : null,
          it.exampleRu ? h('p', { class: 'muted small' }, it.exampleRu) : null,
          it.usage ? h('p', { class: 'usage small' }, icon('bulb'), it.usage) : null),
        h('div', { class: 'fav-actions' },
          EG.ui.levelBadge(it.level),
          h('button', { class: 'icon-btn sm', type: 'button', title: 'Удалить из избранного', 'aria-label': 'Удалить из избранного «' + it.en + '»',
            onclick: function () { remove(it); } }, icon('trash'))));
    }

    function draw() {
      var items = favItems();
      countEl.textContent = items.length ? items.length + ' ' + EG.util.plural(items.length, 'выражение', 'выражения', 'выражений') : '';
      trainBtn.hidden = !items.length;
      if (!items.length) {
        listEl.replaceChildren(EG.ui.empty('star', 'Здесь пока пусто',
          'Нажмите звёздочку в правом верхнем углу карточки с выражением в «Учить сегодня», уроках или повторении — выражение появится здесь.',
          h('a', { class: 'btn primary', href: '#/today' }, 'Учить сегодня', icon('arrow'))));
        return;
      }
      listEl.replaceChildren.apply(listEl, items.map(row));
    }
    draw();

    root.append(
      EG.ui.pageHead('Избранное', 'Выражения, отмеченные звёздочкой. Можно посмотреть, послушать и потренировать их отдельно.', trainBtn),
      h('section', { class: 'card' }, countEl, listEl));
  };
})(window.EG = window.EG || {});
