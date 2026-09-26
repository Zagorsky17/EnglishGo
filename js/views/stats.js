/* views/stats.js — экран «Прогресс» */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  EG.views = EG.views || {};

  function statTile(value, label, sub) {
    return h('div', { class: 'stat' }, h('strong', null, value), h('span', null, label), sub ? h('span', { class: 'muted small' }, sub) : null);
  }

  EG.views.progress = function (root) {
    var S = EG.state, m = S.meta;
    var overall = EG.progress.overallProgress();
    var counts = EG.srs.stateCounts();
    var totalAcc = m.totalAnswers ? Math.round(m.totalCorrect / m.totalAnswers * 100) : 0;
    var recentAcc = EG.progress.recentAccuracy(30);
    var goal = EG.storage.get('dailyGoal');

    // последние 14 дней
    var today = EG.util.dateKey();
    var days = [], totalMin = 0;
    for (var i = 13; i >= 0; i--) {
      var key = EG.util.addDays(today, -i);
      var s = S.stats.get(key) || { xp: 0, correct: 0, wrong: 0, minutes: 0 };
      var p = key.split('-');
      days.push({ label: +p[2] + '.' + p[1], value: s.xp, hi: i === 0, s: s });
      totalMin += s.minutes || 0;
    }
    var activeDays = days.filter(function (d) { return d.value > 0; }).length;

    // точность по дням
    var accData = days.map(function (d) {
      var n = d.s.correct + d.s.wrong;
      return { label: d.label, value: n ? Math.round(d.s.correct / n * 100) : 0, hi: d.hi };
    });

    var skill = m.skill || 0;
    var skillText = skill >= 1 ? 'Материал усложнён: вы справляетесь отлично.' : skill <= -1 ? 'Материал упрощён, чтобы закрепить базу.' : 'Сложность соответствует выбранному уровню.';

    var totalCards = (counts.new || 0) + (counts.learning || 0) + (counts.review || 0) + (counts.mastered || 0);
    var dist = h('div', { class: 'dist' }, ['new', 'learning', 'review', 'mastered'].map(function (st) {
      var n = counts[st] || 0;
      return n ? h('span', { class: 'dist-seg st-' + st, style: { flexGrow: n }, title: EG.ui.STATE_RU[st] + ': ' + n }) : null;
    }));

    var dlgDone = 0, talkDone = 0, storyDone = 0, chatDone = 0;
    S.dialogues.forEach(function (d) { if (d.kind === 'talk') talkDone++; else if (d.kind === 'story') storyDone++; else if (d.kind === 'chat') chatDone++; else dlgDone++; });
    var gamesPlayed = 0, bestScore = 0;
    S.games.forEach(function (g) { gamesPlayed += g.plays || 0; bestScore = Math.max(bestScore, g.best || 0); });

    root.append(
      EG.ui.pageHead('Прогресс', 'Ваша статистика обучения — всё хранится локально на этом устройстве.'),
      h('section', { class: 'stats-grid' },
        statTile(String(m.totalXp || 0), 'всего XP'),
        statTile(String(EG.progress.currentStreak()), 'серия дней', 'рекорд: ' + (m.bestStreak || 0)),
        statTile(overall.learned + ' / ' + overall.total, 'выражений изучено'),
        statTile(totalAcc + '%', 'точность', recentAcc != null ? 'последние 30: ' + Math.round(recentAcc * 100) + '%' : null),
        statTile(String(m.totalAnswers || 0), 'ответов'),
        statTile(Math.round(totalMin) + ' мин', 'за 14 дней', activeDays + ' ' + EG.util.plural(activeDays, 'активный день', 'активных дня', 'активных дней'))),
      h('div', { class: 'grid-2' },
        h('section', { class: 'card' }, h('h3', { class: 'card-title' }, 'XP за 14 дней'),
          EG.ui.barChart(days, { goal: goal, min: goal, label: 'XP по дням' }),
          h('p', { class: 'muted small' }, 'Пунктир — дневная цель (' + goal + ' XP).')),
        h('section', { class: 'card' }, h('h3', { class: 'card-title' }, 'Точность по дням, %'),
          EG.ui.barChart(accData, { min: 100, label: 'Точность по дням' }))),
      h('div', { class: 'grid-2' },
        h('section', { class: 'card' },
          h('h3', { class: 'card-title' }, 'Уровни'),
          EG.LEVELS.map(function (lv) {
            var lp = EG.progress.levelProgress(lv);
            return h('div', { class: 'level-row' },
              EG.ui.levelBadge(lv),
              h('div', { class: 'grow' }, EG.ui.bar(lp.pct), h('span', { class: 'muted small' }, lp.learned + ' из ' + lp.total + ' изучено · начато ' + lp.started)),
              h('strong', null, lp.pct + '%'));
          }),
          h('div', { class: 'tip' }, h('strong', null, icon('bolt'), 'Адаптация сложности'),
            h('p', null, skillText + ' Время на быструю реакцию: ' + Math.round(EG.progress.reactionMs() / 1000) + ' с.'))),
        h('section', { class: 'card' },
          h('h3', { class: 'card-title' }, 'Карточки SRS'),
          totalCards ? dist : h('p', { class: 'muted' }, 'Пока пусто — начните первое занятие.'),
          h('div', { class: 'state-grid' }, ['new', 'learning', 'review', 'mastered'].map(function (st) {
            return h('div', { class: 'state-cell st-' + st }, h('strong', null, counts[st] || 0), h('span', null, EG.ui.STATE_RU[st]));
          })),
          h('h3', { class: 'card-title' }, 'Пройдено'),
          h('ul', { class: 'plain' },
            h('li', null, 'Уроков: ', h('strong', null, overall.lessonsDone + ' / ' + EG.data.lessons.length)),
            h('li', null, 'Диалогов: ', h('strong', null, dlgDone + ' / ' + EG.data.dialogues.length)),
            h('li', null, 'Разговорных сценариев: ', h('strong', null, talkDone + ' / ' + EG.data.scenarios.length)),
            h('li', null, 'Диалогов с вопросами: ', h('strong', null, storyDone + ' / ' + EG.data.stories.length)),
            h('li', null, 'Переписок в чатах: ', h('strong', null, chatDone + ' / ' + EG.data.episodes.length)),
            h('li', null, 'Игр сыграно: ', h('strong', null, gamesPlayed), gamesPlayed ? ' · лучший результат ' + bestScore : ''),
            h('li', null, 'Ошибок исправлено: ', h('strong', null, (function () { var n = 0; S.mistakes.forEach(function (x) { if (x.resolved) n++; }); return n; })() + ' / ' + S.mistakes.size))))));
  };
})(window.EG = window.EG || {});
