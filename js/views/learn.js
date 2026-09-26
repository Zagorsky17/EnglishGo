/* views/learn.js — «Учить сегодня», уроки, повторение, ошибки */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  EG.views = EG.views || {};

  function topicTitle(id) { return (EG.data.topics[id] || {}).title || id; }

  /* ================= Учить сегодня ================= */

  function planToday() {
    var t = EG.state.today();
    var due = EG.srs.getDue(25);
    var newLimit = Math.max(0, EG.storage.get('newPerDay') - t.newItems);
    var fresh = EG.srs.getNewCandidates(Math.min(newLimit, 6));
    return { due: due, fresh: fresh };
  }

  function lessonRow(l) {
    var rec = EG.state.lessons.get(l.id);
    var learned = l.items.filter(EG.progress.isLearned).length;
    return h('a', { class: 'list-row' + (rec ? ' done' : ''), href: '#/lesson/' + l.id },
      h('span', { class: 'row-ic' }, rec ? icon('check') : h('span', { class: 'emoji' }, (EG.data.topics[l.topic] || {}).emoji || '•')),
      h('span', { class: 'row-main' }, h('strong', null, l.title),
        h('span', { class: 'muted small' }, l.items.length + ' ' + EG.util.plural(l.items.length, 'выражение', 'выражения', 'выражений') +
          ' · изучено ' + learned + (rec ? ' · результат ' + rec.score + '%' : ''))),
      EG.ui.levelBadge(l.level));
  }

  EG.views.today = function (root) {
    var p = planToday();
    var eff = EG.progress.effectiveLevelIndex();
    var reviewN = p.due.filter(function (c) { return c.state !== 'new'; }).length;
    var queuedNew = p.due.length - reviewN;
    var sc = EG.progress.recommendations().filter(function (r) { return r.icon === 'talk'; })[0];

    var plan = h('section', { class: 'card hero plan' },
      h('div', { class: 'hero-text' },
        h('h2', null, 'Сессия на сегодня'),
        h('ul', { class: 'plan-list' },
          h('li', null, icon('review'), h('span', null, h('strong', null, reviewN), ' на повторение (SRS)')),
          h('li', null, icon('star'), h('span', null, h('strong', null, p.fresh.length + queuedNew), ' новых выражений в контексте')),
          h('li', null, icon('bolt'), h('span', null, 'Упражнения на понимание, быструю реакцию и активное использование')),
          sc ? h('li', null, icon('talk'), h('span', null, 'Затем — разговорная практика')) : null),
        p.due.length + p.fresh.length
          ? h('a', { class: 'btn primary', href: '#/session/today' }, 'Начать', icon('arrow'))
          : h('p', { class: 'muted' }, 'На сегодня всё повторено и дневной лимит новых выражений исчерпан. Пройдите урок ниже или попрактикуйтесь в разговоре.')));

    var byLevel = {};
    EG.data.lessons.forEach(function (l) { (byLevel[l.level] = byLevel[l.level] || []).push(l); });
    var lessonsEl = h('section', { class: 'card' },
      h('h3', { class: 'card-title' }, 'Уроки по ситуациям'),
      h('p', { class: 'muted small' }, 'Каждый урок — готовые фразы для конкретной жизненной ситуации: знакомство, практика и мини-диалог.'),
      EG.LEVELS.map(function (lv, i) {
        var list = byLevel[lv] || [];
        if (!list.length) return null;
        var done = list.filter(function (l) { return EG.state.lessons.has(l.id); }).length;
        return h('details', { class: 'level-group', open: i === eff || (i === eff + 1 && done === list.length) ? true : null },
          h('summary', null, EG.ui.levelBadge(lv), h('span', null, EG.data.levelNames[lv]), h('span', { class: 'muted small' }, done + '/' + list.length)),
          h('div', { class: 'list' }, list.map(lessonRow)));
      }));

    root.append(EG.ui.pageHead('Учить сегодня', 'Повторение + новое + практика — в правильном порядке.'), plan, lessonsEl);
  };

  /* ================= Сессия ================= */

  EG.views.session = function (root) {
    var p = planToday();
    var exercises = EG.exercises.forReview(p.due).concat(EG.exercises.forNew(p.fresh));
    if (!exercises.length) {
      root.append(EG.ui.empty('check', 'На сегодня всё!', 'Повторений нет, а лимит новых выражений исчерпан. Можно пройти урок или разговор.',
        h('a', { class: 'btn primary', href: '#/talk' }, 'К разговору')));
      return;
    }
    var sc = EG.progress.recommendations().filter(function (r) { return r.icon === 'talk'; })[0];
    return EG.player.run(root, exercises, {
      title: 'Учить сегодня', exitTo: 'today',
      finishActions: sc ? [{ label: 'Продолжить: ' + sc.title, href: sc.href, primary: true }] : []
    });
  };

  /* ================= Урок ================= */

  EG.views.lesson = function (root, params) {
    var l = EG.data.lessonsById[params[0]];
    if (!l) { root.append(EG.ui.empty('words', 'Урок не найден', null, h('a', { class: 'btn', href: '#/today' }, 'К урокам'))); return; }
    var items = l.items.map(function (id) { return EG.data.byId[id]; });
    var topic = EG.data.topics[l.topic] || {};

    if (params[1] === 'start') {
      var dlg = l.dialogues[0], sc = l.scenarios[0];
      var actions = [];
      if (sc) actions.push({ label: 'Разговор: ' + EG.data.scenariosById[sc].title, href: '#/talk/' + sc, primary: true });
      if (dlg) actions.push({ label: 'Диалог: ' + EG.data.dialoguesById[dlg].title, href: '#/dialogue/' + dlg, primary: !sc });
      return EG.player.run(root, EG.exercises.forLesson(items), {
        title: l.title + ' · ' + l.level, exitTo: 'lesson/' + l.id,
        finishTitle: 'Урок пройден',
        finishActions: actions,
        onComplete: function (res, acc) {
          return EG.srs.addItems(l.items).then(function () { return EG.progress.completeLesson(l.id, acc); }).then(function () {
            return h('p', { class: 'muted' }, 'Все выражения урока добавлены в интервальное повторение. Закрепите их в живой ситуации:');
          });
        }
      });
    }

    var rec = EG.state.lessons.get(l.id);
    var tip = topic.tips && (topic.tips[l.level] || topic.tips.all);
    root.append(
      h('a', { class: 'back-link', href: '#/today' }, icon('back'), 'Уроки'),
      EG.ui.pageHead(l.title, topic.subtitle || '', EG.ui.levelBadge(l.level)),
      h('section', { class: 'card' },
        h('p', null, topic.intro || ''),
        tip ? h('div', { class: 'tip' }, h('strong', null, icon('bulb'), 'Для разговора'), h('p', null, tip)) : null,
        h('div', { class: 'row gap wrap' },
          h('a', { class: 'btn primary', href: '#/lesson/' + l.id + '/start' }, rec ? 'Пройти ещё раз' : 'Начать урок', icon('arrow')),
          rec ? h('span', { class: 'muted small' }, 'Пройден · лучший результат ' + rec.score + '%') : null)),
      h('section', { class: 'card' },
        h('h3', { class: 'card-title' }, 'Выражения урока'),
        h('div', { class: 'phrase-list' }, items.map(function (it) {
          var c = EG.state.cards.get(it.id);
          return h('div', { class: 'phrase' },
            h('div', { class: 'phrase-top' }, h('strong', { lang: 'en' }, it.en), EG.ui.speakBtn(it.en, true),
              c ? h('span', { class: 'badge st-' + c.state }, STATE_RU[c.state]) : null),
            h('span', { class: 'muted' }, it.ru));
        }))),
      (l.dialogues.length || l.scenarios.length) ? h('section', { class: 'card' },
        h('h3', { class: 'card-title' }, 'Практика в ситуации'),
        h('div', { class: 'list' },
          l.scenarios.map(function (id) { var s = EG.data.scenariosById[id]; return h('a', { class: 'list-row', href: '#/talk/' + id }, h('span', { class: 'row-ic' }, icon('talk')), h('span', { class: 'row-main' }, h('strong', null, s.title), h('span', { class: 'muted small' }, 'Разговор со свободным ответом')), EG.ui.levelBadge(s.level)); }),
          l.dialogues.map(function (id) { var d = EG.data.dialoguesById[id]; return h('a', { class: 'list-row', href: '#/dialogue/' + id }, h('span', { class: 'row-ic' }, icon('dialogues')), h('span', { class: 'row-main' }, h('strong', null, d.title), h('span', { class: 'muted small' }, 'Интерактивный диалог')), EG.ui.levelBadge(d.level)); }))) : null);
  };

  var STATE_RU = { new: 'новое', learning: 'изучается', review: 'повторение', mastered: 'выучено' };
  EG.ui.STATE_RU = STATE_RU;

  /* ================= Повторение ================= */

  EG.views.review = function (root, params) {
    var due = EG.srs.getDue(30);

    if (params[0] === 'start') {
      if (!due.length) { EG.router.go('review'); return; }
      return EG.player.run(root, EG.exercises.forReview(due), { title: 'Повторение', exitTo: 'review', finishTitle: 'Повторение завершено' });
    }
    if (params[0] === 'hard') {
      var hard = [];
      EG.state.cards.forEach(function (c) { if (c.state !== 'new' && EG.data.byId[c.id]) hard.push(c); });
      hard.sort(function (a, b) { return b.difficulty - a.difficulty; });
      hard = hard.slice(0, 12);
      if (!hard.length) { EG.router.go('review'); return; }
      var ex = hard.map(function (c) {
        var e = EG.exercises.forItem(EG.data.byId[c.id], c);
        e.noSrs = true; // доп. практика не сдвигает расписание
        return e;
      });
      return EG.player.run(root, ex, { title: 'Практика трудных выражений', exitTo: 'review' });
    }

    var counts = EG.srs.stateCounts();
    var fc = EG.srs.forecast(7);
    var labels = ['Сег', 'Зав'].concat([2, 3, 4, 5, 6].map(function (d) {
      var x = new Date(); x.setDate(x.getDate() + d);
      return x.toLocaleDateString('ru-RU', { weekday: 'short' });
    }));
    var reviewN = due.filter(function (c) { return c.state !== 'new'; }).length;

    root.append(
      EG.ui.pageHead('Повторение', 'Интервальное повторение: каждое выражение возвращается ровно тогда, когда начинает забываться.'),
      h('section', { class: 'card hero' },
        EG.ui.ring(due.length ? 0 : 100, String(due.length), 'к повторению'),
        h('div', { class: 'hero-text' },
          h('h2', null, due.length ? 'Пора повторить' : 'Всё повторено'),
          h('p', { class: 'muted' }, due.length ? reviewN + ' на повторение и ' + (due.length - reviewN) + ' новых в очереди. Сессия подстраивается под стадию запоминания: от узнавания к активному использованию.' : 'Следующие повторения — в прогнозе ниже. Можно потренировать трудные выражения без влияния на расписание.'),
          h('div', { class: 'row gap wrap' },
            due.length ? h('a', { class: 'btn primary', href: '#/review/start' }, 'Начать повторение', icon('arrow')) : null,
            EG.state.cards.size ? h('a', { class: 'btn ghost', href: '#/review/hard' }, 'Трудные выражения') : null))),
      h('div', { class: 'grid-2' },
        h('section', { class: 'card' }, h('h3', { class: 'card-title' }, 'Прогноз на неделю'),
          EG.ui.barChart(fc.map(function (v, i) { return { label: labels[i], value: v, hi: i === 0 }; }), { label: 'Прогноз повторений' })),
        h('section', { class: 'card' }, h('h3', { class: 'card-title' }, 'Состояние карточек'),
          h('div', { class: 'state-grid' },
            ['new', 'learning', 'review', 'mastered'].map(function (s) {
              return h('div', { class: 'state-cell st-' + s }, h('strong', null, counts[s] || 0), h('span', null, STATE_RU[s]));
            })),
          h('p', { class: 'muted small' }, 'Выучено — интервал повторения от 21 дня.'))));
  };

  /* ================= Ошибки ================= */

  function mistakeExercise(m) {
    var ref = m.ref || {};
    if (m.kind === 'turn') {
      var sc = EG.data.scenariosById[ref.scenarioId];
      var turn = sc && sc.turns[ref.turnIdx];
      if (!turn) return null;
      return { type: 'turn', turn: turn, itemId: m.itemId, kind: 'turn', ref: ref, setting: sc.setting, noSrs: true, answer: turn.better || turn.accepted[0].t, mistakePrompt: turn.npc };
    }
    if (m.kind === 'chat') {
      var ep = EG.data.episodesById[ref.episodeId];
      var cn = ep && ep.nodes[ref.nodeId];
      if (!cn || !cn.reply) return null;
      var contact = EG.data.contactsById[ep.contactId];
      return { type: 'turn', turn: cn.reply, itemId: m.itemId, kind: 'chat', ref: ref, setting: '📱 ' + contact.name + ' (' + contact.role + ')', noSrs: true,
        answer: cn.reply.better || cn.reply.accepted[0].t, mistakePrompt: cn.reply.npc };
    }
    if (m.kind === 'dlg') {
      var d = EG.data.dialoguesById[ref.dialogueId];
      var node = d && d.nodes[ref.nodeId];
      if (!node || !node.options) return null;
      var shuffled = { npc: node.npc, options: EG.util.shuffle(node.options) };
      var best = shuffled.options.filter(function (o) { return o.q === 'best'; })[0];
      return { type: 'dlgnode', node: shuffled, itemId: m.itemId, kind: 'dlg', ref: ref, setting: d.setting, noSrs: true,
        options: shuffled.options.map(function (o) { return o.en; }), answer: best ? best.en : '', mistakePrompt: node.npc };
    }
    var item = EG.data.byId[m.itemId];
    if (!item) return null;
    // ошибку возвращаем в другом формате — ближе к активному использованию
    var types = EG.util.shuffle(['recall', 'context', 'reaction', 'build']);
    for (var i = 0; i < types.length; i++) {
      var ex = EG.exercises.make(types[i], item);
      if (ex) return ex;
    }
    return EG.exercises.make('meaning', item);
  }

  function mistakeTitle(m) {
    var ref = m.ref || {};
    if (m.kind === 'turn') {
      var sc = EG.data.scenariosById[ref.scenarioId];
      return { title: sc ? '«' + sc.turns[ref.turnIdx].npc + '»' : m.prompt, where: sc ? 'Разговор · ' + sc.title : 'Разговор' };
    }
    if (m.kind === 'chat') {
      var ep = EG.data.episodesById[ref.episodeId];
      var c = ep && EG.data.contactsById[ep.contactId];
      return { title: '«' + (m.prompt || '') + '»', where: c ? 'Чат · ' + c.name : 'Чат' };
    }
    if (m.kind === 'dlg') {
      var d = EG.data.dialoguesById[ref.dialogueId];
      return { title: '«' + (m.prompt || '') + '»', where: d ? 'Диалог · ' + d.title : 'Диалог' };
    }
    var it = EG.data.byId[m.itemId];
    return { title: it ? it.en : m.itemId, where: it ? it.ru : '' };
  }

  var TYPE_RU = { context: 'контекст', meaning: 'понимание', listen: 'аудирование', dictation: 'диктант', reaction: 'реакция', register: 'уместность', recall: 'воспоминание', build: 'сборка фразы', flash: 'карточка', turn: 'разговор', dlgnode: 'диалог', slangify: 'сленг', formalize: 'обычная речь', decode: 'расшифровка чата', texting: 'как в чате', chat: 'мессенджер', game: 'игра', story: 'понимание диалога' };

  EG.views.mistakes = function (root, params) {
    var open = EG.progress.unresolvedMistakes();

    if (params[0] === 'train') {
      var ex = open.slice(0, 15).map(mistakeExercise).filter(Boolean);
      if (!ex.length) { EG.router.go('mistakes'); return; }
      return EG.player.run(root, ex, { title: 'Работа над ошибками', exitTo: 'mistakes', finishTitle: 'Разбор ошибок завершён',
        finishActions: [{ label: 'К списку ошибок', href: '#/mistakes', primary: true }] });
    }

    var showResolved = params[0] === 'all';
    var all = [];
    EG.state.mistakes.forEach(function (m) { if (showResolved || !m.resolved) all.push(m); });
    all.sort(function (a, b) { return (a.resolved - b.resolved) || b.count - a.count || b.lastTs - a.lastTs; });

    var listEl = h('div', { class: 'list' }, all.map(function (m) {
      var t = mistakeTitle(m);
      var row = h('div', { class: 'mistake' + (m.resolved ? ' resolved' : '') },
        h('div', { class: 'mistake-main' },
          h('div', { class: 'row gap wrap' }, h('strong', { lang: 'en' }, t.title), h('span', { class: 'badge' }, TYPE_RU[m.type] || m.type || ''),
            m.resolved ? h('span', { class: 'badge st-mastered' }, 'исправлено') : h('span', { class: 'badge bad' }, '×' + m.count)),
          t.where ? h('span', { class: 'muted small' }, t.where) : null,
          m.expected ? h('p', { class: 'small' }, h('span', { class: 'muted' }, 'Правильно: '), h('span', { lang: 'en' }, m.expected)) : null,
          m.lastUserAnswer ? h('p', { class: 'small muted' }, 'Ваш ответ: ' + m.lastUserAnswer) : null,
          m.note ? h('p', { class: 'small muted' }, m.note) : null),
        h('button', { class: 'icon-btn', title: 'Удалить из списка', 'aria-label': 'Удалить из списка', onclick: function () {
          EG.state.deleteMistake(m.itemId).then(function () { row.remove(); EG.ui.toast('Удалено из списка ошибок'); });
        } }, icon('trash')));
      return row;
    }));

    root.append(
      EG.ui.pageHead('Ошибки', 'Всё, в чём вы ошиблись, собирается здесь. Два верных ответа подряд — и ошибка считается исправленной.'),
      h('section', { class: 'card hero' },
        EG.ui.ring(open.length ? 0 : 100, String(open.length), 'к разбору'),
        h('div', { class: 'hero-text' },
          h('h2', null, open.length ? 'Работа над ошибками' : 'Ошибок нет'),
          h('p', { class: 'muted' }, open.length ? 'Тренировка возвращает ошибки в новых форматах: активное воспоминание, реакция, свободный ответ.' : 'Отличная работа. Новые ошибки появятся здесь автоматически.'),
          h('div', { class: 'row gap wrap' },
            open.length ? h('a', { class: 'btn primary', href: '#/mistakes/train' }, 'Тренировать (' + Math.min(15, open.length) + ')', icon('arrow')) : null,
            h('a', { class: 'btn ghost', href: showResolved ? '#/mistakes' : '#/mistakes/all' }, showResolved ? 'Только активные' : 'Показать исправленные')))),
      all.length ? h('section', { class: 'card' }, listEl) : null);
  };

  EG.learn = { mistakeExercise: mistakeExercise, topicTitle: topicTitle };
})(window.EG = window.EG || {});
