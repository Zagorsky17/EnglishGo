/* views/home.js — главный экран */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  EG.views = EG.views || {};

  function greeting() {
    var hr = new Date().getHours();
    var name = EG.storage.get('name');
    var g = hr < 5 ? 'Доброй ночи' : hr < 12 ? 'Доброе утро' : hr < 18 ? 'Добрый день' : 'Добрый вечер';
    return g + (name ? ', ' + name : '') + '!';
  }

  function tile(iconName, value, label, href, tone) {
    return h(href ? 'a' : 'div', { class: 'tile ' + (tone || ''), href: href || null },
      icon(iconName), h('strong', null, value), h('span', null, label));
  }

  EG.views.home = function (root) {
    var S = EG.state;
    var t = S.today();
    var goal = EG.storage.get('dailyGoal');
    var pct = Math.min(100, Math.round(t.xp / goal * 100));
    var due = EG.srs.getDue();
    var reviewDue = due.filter(function (c) { return c.state !== 'new'; }).length;
    var streak = EG.progress.currentStreak();
    var overall = EG.progress.overallProgress();
    var base = EG.storage.get('level'), eff = EG.progress.effectiveLevel();
    var lp = EG.progress.levelProgress(base);
    var mistakes = EG.progress.unresolvedMistakes().length;
    var acc = EG.progress.recentAccuracy(30);

    var dayCard = h('section', { class: 'card hero' },
      EG.ui.ring(pct, t.xp + ' XP', 'из ' + goal),
      h('div', { class: 'hero-text' },
        h('h2', null, pct >= 100 ? 'Цель на сегодня выполнена 🎉' : 'Сегодняшний прогресс'),
        h('p', { class: 'muted' }, pct >= 100 ? 'Можно остановиться — или закрепить результат разговорной практикой.' :
          'Осталось ' + (goal - t.xp) + ' XP. ' + (t.correct + t.wrong ? 'Ответов сегодня: ' + (t.correct + t.wrong) + '.' : 'Начните с короткой сессии.')),
        h('div', { class: 'row gap wrap' },
          h('a', { class: 'btn primary', href: '#/today' }, icon('today'), 'Начать занятие'),
          reviewDue ? h('a', { class: 'btn ghost', href: '#/review' }, 'Повторить (' + reviewDue + ')') : h('a', { class: 'btn ghost', href: '#/talk' }, 'Разговор'))));

    var tiles = h('section', { class: 'tiles' },
      tile('review', String(reviewDue), 'на повторение', '#/review', reviewDue ? 'accent' : ''),
      tile('flame', String(streak), EG.util.plural(streak, 'день подряд', 'дня подряд', 'дней подряд'), '#/progress', streak ? 'warm' : ''),
      tile('bolt', String(S.meta.totalXp || 0), 'всего XP', '#/progress'),
      tile('mistakes', String(mistakes), 'ошибок к разбору', '#/mistakes', mistakes ? 'warnish' : ''));

    var levelCard = h('section', { class: 'card level-card' },
      h('div', { class: 'row between' },
        h('div', null,
          h('span', { class: 'muted small' }, 'Текущий уровень'),
          h('div', { class: 'level-big' }, EG.ui.levelBadge(base),
            eff !== base ? h('span', { class: 'muted small' }, ' материал подстроен под ' + eff) : null)),
        h('div', { class: 'right' },
          h('span', { class: 'muted small' }, 'Общий прогресс'),
          h('div', { class: 'pct' }, overall.pct + '%'))),
      EG.ui.bar(overall.pct),
      h('div', { class: 'row between small muted' },
        h('span', null, 'Уровень ' + base + ': изучено ' + lp.learned + ' из ' + lp.total),
        h('span', null, acc == null ? 'Точность появится после ответов' : 'Точность (посл. 30): ' + Math.round(acc * 100) + '%')));

    var recs = EG.progress.recommendations();
    var recCard = h('section', { class: 'card' },
      h('h3', { class: 'card-title' }, 'Что делать дальше'),
      recs.length ? h('div', { class: 'recs' }, recs.map(function (r) {
        return h('a', { class: 'rec ' + r.tone, href: r.href },
          h('span', { class: 'rec-ic' }, icon(r.icon)),
          h('span', { class: 'rec-body' }, h('strong', null, r.title), h('span', { class: 'muted small' }, r.text)),
          icon('arrow', 'rec-arrow'));
      })) : h('p', { class: 'muted' }, 'Всё пройдено! Возвращайтесь к повторению завтра.'));

    var warn = !EG.db.persistent ? h('div', { class: 'notice warn' }, icon('mistakes'),
      'Хранилище IndexedDB недоступно (' + EG.db.reason + '). Прогресс не сохранится после закрытия. Сделайте экспорт в настройках.') : null;

    root.append(
      EG.ui.pageHead(greeting(), 'Учимся говорить, а не зубрить.'),
      warn, dayCard, tiles,
      h('div', { class: 'grid-2' }, recCard, levelCard));
  };
})(window.EG = window.EG || {});
