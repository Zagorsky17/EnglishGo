/* progress.js — XP, серия, статистика, ошибки, адаптация сложности, рекомендации */
(function (EG) {
  'use strict';

  var XP = { correct: 10, partial: 5, wrong: 1, lesson: 30, dialogue: 15, talk: 20, session: 10 };

  function S() { return EG.state; }

  /* ---------- серия дней ---------- */
  function touchStreak() {
    var m = S().meta, today = EG.util.dateKey();
    // дата последнего занятия «в будущем» (часы перевели назад, перелёт на запад) — серию не сбрасываем
    if (m.lastActiveDate === today || (m.lastActiveDate && m.lastActiveDate > today)) return Promise.resolve();
    var streak = m.lastActiveDate === EG.util.addDays(today, -1) ? (m.streak || 0) + 1 : 1;
    return Promise.all([
      S().setMeta('streak', streak),
      S().setMeta('bestStreak', Math.max(streak, m.bestStreak || 0)),
      S().setMeta('lastActiveDate', today)
    ]).then(function () { EG.bus.emit('streak', streak); });
  }

  function currentStreak() {
    var m = S().meta, today = EG.util.dateKey();
    if (m.lastActiveDate === today || m.lastActiveDate === EG.util.addDays(today, -1) || m.lastActiveDate > today) return m.streak || 0;
    return 0;
  }

  /* ---------- XP ---------- */
  function addXp(n) {
    if (!n) return Promise.resolve();
    var t = S().today();
    var before = t.xp;
    t.xp += n;
    var goal = EG.storage.get('dailyGoal');
    return Promise.all([
      S().setMeta('totalXp', (S().meta.totalXp || 0) + n),
      S().saveToday(),
      touchStreak()
    ]).then(function () {
      EG.bus.emit('xp', n);
      if (before < goal && t.xp >= goal) EG.bus.emit('goal');
    });
  }

  /* ---------- адаптация сложности ---------- */
  // skill дрейфует: +0.04 за верный, −0.08 за неверный → равновесие около 67% точности
  function updateSkill(correct, partial) {
    var d = correct ? (partial ? 0.01 : 0.04) : -0.08;
    return S().setMeta('skill', EG.util.clamp((S().meta.skill || 0) + d, -2, 2));
  }

  function skillShift() {
    var s = S().meta.skill || 0;
    return s >= 1 ? 1 : s <= -1 ? -1 : 0;
  }

  function baseLevelIndex() { return EG.util.levelIndex(EG.storage.get('level')); }

  function effectiveLevelIndex() {
    return EG.util.clamp(baseLevelIndex() + skillShift(), 0, EG.LEVELS.length - 1);
  }

  function effectiveLevel() { return EG.LEVELS[effectiveLevelIndex()]; }

  function recentAccuracy(n) {
    var r = S().recent.slice(-(n || 30));
    if (!r.length) return null;
    return r.filter(function (a) { return a.correct; }).length / r.length;
  }

  /** Время на быструю реакцию (мс): короче при высоком навыке. */
  function reactionMs() {
    var base = 10000 - baseLevelIndex() * 600;
    return Math.round(EG.util.clamp(base - (S().meta.skill || 0) * 1500, 5000, 14000));
  }

  function levelSuggestion() {
    var acc = recentAccuracy(30), idx = baseLevelIndex(), s = S().meta.skill || 0;
    if (S().recent.length < 20 || acc == null) return null;
    if (s >= 1.5 && acc >= 0.85 && idx < EG.LEVELS.length - 1) return { dir: 1, level: EG.LEVELS[idx + 1], acc: acc };
    if (s <= -1.5 && acc < 0.55 && idx > 0) return { dir: -1, level: EG.LEVELS[idx - 1], acc: acc };
    return null;
  }

  /* ---------- ответы и ошибки ---------- */
  /**
   * opts: {itemId, type, correct, partial, userAnswer, expected, ms, kind, prompt, note, ref}
   * kind: 'vocab' | 'turn' | 'dlg' — для тренировки ошибок
   */
  function recordAnswer(opts) {
    var now = Date.now();
    var t = S().today();
    if (opts.correct) t.correct += 1; else t.wrong += 1;
    S().recent.push({ correct: !!opts.correct, ts: now });
    if (S().recent.length > 60) S().recent.shift();

    var tasks = [
      EG.db.put('answers', {
        ts: now, itemId: String(opts.itemId), exerciseType: opts.type || 'unknown',
        correct: !!opts.correct, userAnswer: String(opts.userAnswer || '').slice(0, 500),
        expected: String(opts.expected || '').slice(0, 500), ms: opts.ms || 0
      }),
      S().setMeta('totalAnswers', (S().meta.totalAnswers || 0) + 1),
      S().setMeta('totalCorrect', (S().meta.totalCorrect || 0) + (opts.correct ? 1 : 0)),
      updateSkill(opts.correct, opts.partial),
      S().saveToday()
    ];

    var m = opts.noMistake ? null : S().mistakes.get(opts.itemId);
    if (opts.noMistake) {
      // ответ учитывается в статистике и XP, но не попадает в «Ошибки»
    } else if (!opts.correct) {
      m = Object.assign(m || { itemId: opts.itemId, count: 0, firstTs: now }, {
        count: (m ? m.count : 0) + 1, lastTs: now, resolved: false, rightStreak: 0,
        kind: opts.kind || 'vocab', type: opts.type, lastUserAnswer: String(opts.userAnswer || ''),
        expected: String(opts.expected || ''), prompt: opts.prompt || '', note: opts.note || '', ref: opts.ref || null
      });
      tasks.push(S().saveMistake(m));
    } else if (m && !m.resolved) {
      var streak = (m.rightStreak || 0) + (opts.partial ? 0 : 1);
      m = Object.assign({}, m, { rightStreak: streak, resolved: streak >= 2, lastTs: now });
      tasks.push(S().saveMistake(m));
    }

    var xp = opts.correct ? (opts.partial ? XP.partial : XP.correct) : XP.wrong;
    if (opts.xpFactor != null) xp = Math.round(xp * opts.xpFactor);
    tasks.push(addXp(xp));
    return Promise.all(tasks).then(function () { EG.bus.emit('answer', opts); return xp; });
  }

  function unresolvedMistakes() {
    var out = [];
    S().mistakes.forEach(function (m) { if (!m.resolved) out.push(m); });
    return out.sort(function (a, b) { return b.count - a.count || b.lastTs - a.lastTs; });
  }

  /* ---------- уроки и диалоги ---------- */
  function completeLesson(id, score) {
    var prev = S().lessons.get(id);
    var rec = {
      id: id, status: 'done', score: Math.max(score, prev ? prev.score || 0 : 0),
      completions: (prev ? prev.completions || 0 : 0) + 1, completedAt: Date.now()
    };
    return S().saveLesson(rec).then(function () { return addXp(prev ? Math.round(XP.lesson / 3) : XP.lesson); });
  }

  function completeDialogue(id, kind, score, naturalness) {
    var prev = S().dialogues.get(id);
    var rec = {
      id: id, kind: kind, bestScore: Math.max(score, prev ? prev.bestScore || 0 : 0),
      lastScore: score, naturalness: naturalness != null ? naturalness : (prev ? prev.naturalness : null),
      completions: (prev ? prev.completions || 0 : 0) + 1, lastTs: Date.now()
    };
    var t = S().today();
    t.dialogues += 1;
    var xp = (kind === 'talk' ? XP.talk : XP.dialogue) + Math.round(score / 10);
    if (prev) xp = Math.round(xp / 2);
    return Promise.all([S().saveDialogue(rec), S().saveToday()]).then(function () { return addXp(xp).then(function () { return xp; }); });
  }

  function addMinutes(ms) {
    var t = S().today();
    t.minutes = +(t.minutes + ms / 60000).toFixed(1);
    return S().saveToday();
  }

  /* ---------- метрики ---------- */
  function isLearned(id) {
    var c = S().cards.get(id);
    return !!c && (c.state === 'review' || c.state === 'mastered');
  }

  function levelProgress(level) {
    var items = EG.data.vocab.filter(function (v) { return v.level === level; });
    var learned = items.filter(function (v) { return isLearned(v.id); }).length;
    var started = items.filter(function (v) { return S().cards.has(v.id); }).length;
    return { level: level, total: items.length, learned: learned, started: started, pct: items.length ? Math.round(learned / items.length * 100) : 0 };
  }

  function overallProgress() {
    var total = EG.data.vocab.length, learned = 0;
    EG.data.vocab.forEach(function (v) { if (isLearned(v.id)) learned++; });
    var lessonsDone = 0;
    EG.data.lessons.forEach(function (l) { if (S().lessons.has(l.id)) lessonsDone++; });
    var dlgDone = S().dialogues.size;
    var dlgTotal = EG.data.dialogues.length + EG.data.scenarios.length + EG.data.stories.length + EG.data.episodes.length;
    // вес: словарь 60%, уроки 20%, диалоги 20%
    var pct = total ? (learned / total) * 60 + (lessonsDone / EG.data.lessons.length) * 20 + (Math.min(dlgDone, dlgTotal) / dlgTotal) * 20 : 0;
    return { pct: Math.round(pct), learned: learned, total: total, lessonsDone: lessonsDone, dlgDone: dlgDone, dlgTotal: dlgTotal };
  }

  function nextLesson() {
    var max = effectiveLevelIndex();
    var list = EG.data.lessons.filter(function (l) { return EG.util.levelIndex(l.level) <= max && !S().lessons.has(l.id); });
    // приоритет — текущий уровень, затем нижние
    list.sort(function (a, b) { return EG.util.levelIndex(b.level) - EG.util.levelIndex(a.level) || a.order - b.order; });
    return list[0] || null;
  }

  function nextOf(list, kind) {
    var max = effectiveLevelIndex();
    var cand = list.filter(function (d) { return EG.util.levelIndex(d.level) <= max && !S().dialogues.has(d.id); });
    cand.sort(function (a, b) { return EG.util.levelIndex(b.level) - EG.util.levelIndex(a.level); });
    if (cand.length) return cand[0];
    // всё пройдено — предложить с наименьшим результатом
    var done = list.filter(function (d) { return EG.util.levelIndex(d.level) <= max; });
    done.sort(function (a, b) {
      var sa = (S().dialogues.get(a.id) || {}).bestScore || 0, sb = (S().dialogues.get(b.id) || {}).bestScore || 0;
      return sa - sb;
    });
    return done[0] || null;
  }

  function recommendations() {
    var recs = [];
    var due = EG.srs.dueCount();
    var reviewDue = EG.srs.getDue().filter(function (c) { return c.state !== 'new'; }).length;
    var mistakes = unresolvedMistakes().length;
    var t = S().today();
    var goal = EG.storage.get('dailyGoal');

    if (reviewDue > 0) {
      recs.push({ icon: 'review', tone: 'accent', title: 'Повторите ' + reviewDue + ' ' + EG.util.plural(reviewDue, 'выражение', 'выражения', 'выражений'),
        text: 'Интервальное повторение закрепляет фразы в долгой памяти. Лучше всего — именно сегодня.', href: '#/review' });
    }
    if (mistakes >= 3) {
      recs.push({ icon: 'mistakes', tone: 'warn', title: 'Разберите ошибки (' + mistakes + ')',
        text: 'Повторение ошибок — самый быстрый способ перестать их делать.', href: '#/mistakes' });
    }
    // резервная копия: прогресс живёт только в браузере — раз в неделю напоминаем
    var lastExport = S().meta.lastExportTs || 0;
    if ((S().meta.totalAnswers || 0) >= 20 && Date.now() - lastExport > 7 * EG.util.DAY) {
      recs.push({ icon: 'download', tone: 'warn', title: lastExport ? 'Обновите резервную копию' : 'Сделайте резервную копию',
        text: 'Прогресс хранится только в этом браузере. Экспорт займёт секунду и защитит от потери данных.', href: '#/settings' });
    }
    // новое сообщение в мессенджере
    var unreadContact = EG.data.contacts.filter(function (c) { return EG.chat.status(c).unread; })[0];
    if (unreadContact) {
      var cs = EG.chat.status(unreadContact);
      recs.push({ icon: 'chat', tone: 'good', title: 'Новое сообщение от ' + unreadContact.name,
        text: '«' + (cs.last ? cs.last.text : '') + '» — ответьте, как в настоящем мессенджере.', href: '#/chat/' + unreadContact.id });
    }
    var sug = levelSuggestion();
    if (sug && S().meta.levelHintShown !== EG.util.dateKey()) {
      recs.push({ icon: 'bolt', tone: 'good',
        title: sug.dir > 0 ? 'Кажется, вам пора на ' + sug.level : 'Попробуйте уровень ' + sug.level,
        text: sug.dir > 0 ? 'Точность последних ответов ' + Math.round(sug.acc * 100) + '%. Повысьте уровень в настройках.' : 'Сейчас много ошибок — более простой материал поможет закрепить базу.',
        href: '#/settings' });
    }
    var lesson = nextLesson();
    if (lesson) {
      recs.push({ icon: 'words', tone: 'accent', title: 'Урок: ' + lesson.title + ' · ' + lesson.level,
        text: lesson.items.length + ' новых выражений в контексте ситуации.', href: '#/lesson/' + lesson.id });
    }
    var sc = nextOf(EG.data.scenarios, 'talk');
    if (sc) {
      recs.push({ icon: 'talk', tone: 'accent', title: 'Разговор: ' + sc.title,
        text: sc.settingRu + ' Отвечайте своими словами — приложение оценит естественность.', href: '#/talk/' + sc.id });
    }
    if (due === 0 && t.xp < goal) {
      recs.push({ icon: 'today', tone: 'accent', title: 'Учите новое',
        text: 'Повторений нет — отличное время добавить новые выражения.', href: '#/today' });
    }
    var story = nextOf(EG.data.stories, 'story');
    if (story) {
      recs.push({ icon: 'book', tone: 'accent', title: 'Прочитайте: ' + story.title,
        text: (story.kind === 'chat' ? 'Переписка со сленгом' : 'Полный диалог') + ' и ' + story.questions.length + ' вопросов на понимание.', href: '#/story/' + story.id });
    }
    var gd = EG.games.gameOfDay();
    recs.push({ icon: 'game', tone: 'warn', title: 'Игра дня: ' + gd.title + ' (×2 XP)', text: gd.desc, href: '#/game/' + gd.id });
    var dlg = nextOf(EG.data.dialogues, 'dialogue');
    if (dlg) {
      recs.push({ icon: 'dialogues', tone: 'accent', title: 'Диалог: ' + dlg.title,
        text: 'Интерактивная сцена с выбором реплик и разбором.', href: '#/dialogue/' + dlg.id });
    }
    return recs.slice(0, 5);
  }

  EG.progress = {
    XP: XP,
    addXp: addXp,
    touchStreak: touchStreak,
    currentStreak: currentStreak,
    recordAnswer: recordAnswer,
    unresolvedMistakes: unresolvedMistakes,
    completeLesson: completeLesson,
    completeDialogue: completeDialogue,
    addMinutes: addMinutes,
    effectiveLevelIndex: effectiveLevelIndex,
    effectiveLevel: effectiveLevel,
    baseLevelIndex: baseLevelIndex,
    skillShift: skillShift,
    recentAccuracy: recentAccuracy,
    reactionMs: reactionMs,
    levelSuggestion: levelSuggestion,
    levelProgress: levelProgress,
    overallProgress: overallProgress,
    isLearned: isLearned,
    nextLesson: nextLesson,
    recommendations: recommendations
  };
})(window.EG = window.EG || {});
