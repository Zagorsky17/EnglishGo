/* views/stories.js — «Читать и понять»: полный диалог + вопросы на понимание */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  EG.views = EG.views || {};

  /** Реплика диалога: перевод по нажатию, озвучка по кнопке. */
  function lineBubble(line, side, isChat) {
    var tr = h('span', { class: 'bubble-ru hidden' }, line.ru);
    var bubble = h('div', { class: (isChat ? 'msg ' + (side === 'right' ? 'out' : 'in') : 'bubble ' + (side === 'right' ? 'me plain' : 'npc')) + ' story-line', title: 'Нажмите, чтобы увидеть перевод' },
      h('span', { class: 'bubble-name' }, line.who),
      h('span', { lang: 'en' }, line.en),
      h('span', { class: 'bubble-tools' }, EG.ui.speakBtn(line.en, true)),
      tr);
    bubble.setAttribute('role', 'button');
    bubble.setAttribute('tabindex', '0');
    bubble.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === bubble) { e.preventDefault(); tr.classList.toggle('hidden'); } });
    bubble.addEventListener('click', function (e) {
      if (e.target.closest('button')) return;
      tr.classList.toggle('hidden');
    });
    return bubble;
  }

  EG.views.story = function (root, params) {
    var st = EG.data.storiesById[params[0]];
    if (!st) { root.append(EG.ui.empty('book', 'Диалог не найден', null, h('a', { class: 'btn', href: '#/dialogues/read' }, 'К списку'))); return; }
    var isChat = st.kind === 'chat';
    var speakers = [];
    st.lines.forEach(function (l) { if (speakers.indexOf(l.who) < 0) speakers.push(l.who); });
    // в чате «правая» сторона — второй участник; в устном диалоге — тоже второй
    var rightWho = speakers[1];
    var keyHandler = null;
    function onKey(e) { if (keyHandler && !e.metaKey && !e.ctrlKey) keyHandler(e); }
    document.addEventListener('keydown', onKey);
    var started = Date.now();

    var body = h('div', { class: 'story-body' });
    root.append(
      h('a', { class: 'back-link', href: '#/dialogues/read' }, icon('back'), 'Читать и понять'),
      h('div', { class: 'scene-head card' },
        h('div', { class: 'row between' }, h('h1', null, st.title), EG.ui.levelBadge(st.level)),
        h('p', { class: 'setting', lang: 'en' }, st.setting),
        h('p', { class: 'muted' }, st.settingRu),
        h('p', { class: 'muted small' }, isChat ? '📱 Переписка в мессенджере — обратите внимание на сокращения.' : '💬 Устный диалог. Нажмите на реплику, чтобы увидеть перевод.')),
      body);

    function showReading() {
      keyHandler = null;
      var lines = st.lines.map(function (l) { return lineBubble(l, l.who === rightWho ? 'right' : 'left', isChat); });
      var all = false;
      var toggleAll = h('button', { class: 'btn ghost', onclick: function () {
        all = !all;
        body.querySelectorAll('.story-line .bubble-ru').forEach(function (el) { el.classList.toggle('hidden', !all); });
        toggleAll.textContent = all ? 'Скрыть перевод' : 'Показать весь перевод';
      } }, 'Показать весь перевод');
      var go = h('button', { class: 'btn primary', onclick: startQuiz }, 'К вопросам (' + st.questions.length + ')', icon('arrow'));
      body.replaceChildren(
        h('div', { class: isChat ? 'phone' : 'chat' }, lines),
        h('div', { class: 'row gap wrap story-actions' }, toggleAll, go));
    }

    function startQuiz() {
      var idx = 0, right = 0;
      function renderQ() {
        var q = st.questions[idx];
        var locked = false;
        var btns = q.options.map(function (o, i) {
          return h('button', { class: 'option', type: 'button', onclick: function () { pick(i); } },
            h('span', { class: 'opt-key' }, String(i + 1)), h('span', { class: 'opt-text' }, o));
        });
        var foot = h('div');
        function pick(i) {
          if (locked) return;
          locked = true;
          var ok = i === q.answer;
          if (ok) right++;
          btns.forEach(function (b, j) {
            b.disabled = true;
            if (j === q.answer) b.classList.add('correct');
            if (j === i && !ok) b.classList.add('wrong');
          });
          EG.progress.recordAnswer({ itemId: 'story:' + st.id + ':' + idx, type: 'story', correct: ok, userAnswer: q.options[i], expected: q.options[q.answer], noMistake: true, xpFactor: 0.8 });
          var next = h('button', { class: 'btn primary block', onclick: advance }, idx + 1 < st.questions.length ? 'Следующий вопрос' : 'Результат', icon('arrow'));
          foot.replaceChildren(h('div', { class: 'feedback ' + (ok ? 'good' : 'bad') },
            h('div', { class: 'fb-head' }, h('span', { class: 'fb-verdict ' + (ok ? 'good' : 'bad') }, icon(ok ? 'check' : 'x'), ok ? 'Верно!' : 'Неверно')),
            q.explain ? h('p', { class: 'fb-note' }, icon('bulb'), q.explain) : null), next);
          keyHandler = function (e) { if (e.key === 'Enter') { e.preventDefault(); advance(); } };
          setTimeout(function () { next.focus({ preventScroll: true }); }, 30);
          EG.ui.scrollToEnd(foot);
        }
        function advance() { keyHandler = null; idx++; if (idx < st.questions.length) renderQ(); else finish(right); }
        keyHandler = function (e) { var n = parseInt(e.key, 10); if (n >= 1 && n <= btns.length) { e.preventDefault(); pick(n - 1); } };
        body.replaceChildren(h('div', { class: 'card ex-card enter' },
          h('div', { class: 'row between' }, h('div', { class: 'ex-label' }, icon('book'), 'Вопрос ' + (idx + 1) + ' из ' + st.questions.length),
            h('button', { class: 'link-btn', onclick: function () { keyHandler = null; showReading(); } }, 'Перечитать диалог')),
          EG.ui.bar(idx / st.questions.length * 100),
          h('p', { class: 'big-ru' }, q.q),
          h('div', { class: 'options' }, btns),
          foot));
      }
      renderQ();
    }

    function finish(right) {
      var score = Math.round(right / st.questions.length * 100);
      var ids = (st.learn || []).map(EG.data.resolve).filter(Boolean);
      EG.progress.addMinutes(Date.now() - started);
      Promise.all([EG.progress.completeDialogue(st.id, 'story', score), EG.srs.addItems(ids)]).then(function (r) {
        var next = EG.data.stories.filter(function (s) { return s.id !== st.id && !EG.state.dialogues.has(s.id) && EG.util.levelIndex(s.level) <= EG.progress.effectiveLevelIndex() + 1; })[0];
        body.replaceChildren(h('div', { class: 'card finish enter' },
          h('h2', null, score === 100 ? 'Всё понято! 🎉' : score >= 60 ? 'Хорошее понимание!' : 'Стоит перечитать'),
          h('div', { class: 'finish-stats' }, EG.ui.ring(score, right + '/' + st.questions.length, 'верно'),
            h('div', { class: 'finish-nums' }, h('div', null, h('strong', null, '+' + (r[0] || 0)), h('span', null, 'XP бонус')))),
          ids.length ? h('div', { class: 'learn-list' }, h('span', { class: 'metric-label' }, 'Выражения из диалога — в повторение'),
            h('div', { class: 'chips' }, ids.map(function (id) { var v = EG.data.byId[id]; return h('span', { class: 'chip static' }, v.en, h('span', { class: 'muted' }, ' — ' + v.ru)); }))) : null,
          h('div', { class: 'row gap wrap center' },
            h('button', { class: 'btn ghost', onclick: showReading }, 'Перечитать'),
            next ? h('a', { class: 'btn primary', href: '#/story/' + next.id }, 'Следующий: ' + next.title) : h('a', { class: 'btn primary', href: '#/dialogues/read' }, 'Все диалоги'))));
      });
    }

    showReading();
    return function () { document.removeEventListener('keydown', onKey); };
  };
})(window.EG = window.EG || {});
