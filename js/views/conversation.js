/* views/conversation.js — «Диалоги» (ветвящиеся сцены) и «Разговор» (свободный ответ) */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  EG.views = EG.views || {};

  function npcBubble(text, ru, name) {
    var tr = ru ? h('span', { class: 'bubble-ru hidden' }, ru) : null;
    var b = h('div', { class: 'bubble npc enter' },
      name ? h('span', { class: 'bubble-name' }, name) : null,
      h('span', { lang: 'en' }, text),
      h('span', { class: 'bubble-tools' },
        EG.ui.speakBtn(text, true),
        ru ? h('button', { class: 'link-btn small', type: 'button', onclick: function () { tr.classList.toggle('hidden'); } }, 'перевод') : null),
      tr);
    return b;
  }

  function userBubble(text, tone) {
    return h('div', { class: 'bubble me enter ' + (tone || '') }, h('span', { lang: 'en' }, text));
  }

  function statusBadge(id) {
    var r = EG.state.dialogues.get(id);
    return r ? h('span', { class: 'badge st-mastered' }, icon('check'), (r.bestScore || 0) + '%') : null;
  }

  function sceneCard(obj, href, kind) {
    var topic = EG.data.topics[obj.topic] || {};
    return h('a', { class: 'scene', href: href },
      h('span', { class: 'scene-emoji' }, topic.emoji || '💬'),
      h('span', { class: 'scene-body' },
        h('strong', null, obj.title),
        h('span', { class: 'scene-setting', lang: 'en' }, obj.setting),
        h('span', { class: 'muted small' }, kind === 'talk' ? obj.turns.length + ' ' + EG.util.plural(obj.turns.length, 'реплика', 'реплики', 'реплик') + ' · свободный ответ'
          : kind === 'story' ? (obj.kind === 'chat' ? '📱 переписка' : '💬 диалог') + ' · ' + obj.questions.length + ' вопросов на понимание'
          : (topic.title || ''))),
      h('span', { class: 'scene-meta' }, EG.ui.levelBadge(obj.level), statusBadge(obj.id)));
  }

  function groupedList(list, hrefFn, kind) {
    var eff = EG.progress.effectiveLevelIndex();
    return EG.LEVELS.map(function (lv, i) {
      var items = list.filter(function (d) { return d.level === lv; });
      if (!items.length) return null;
      return h('section', { class: 'level-section' + (i > eff + 1 ? ' dim' : '') },
        h('h3', { class: 'section-title' }, EG.ui.levelBadge(lv), EG.data.levelNames[lv], i > eff ? h('span', { class: 'muted small' }, ' — выше вашего уровня') : null),
        h('div', { class: 'scene-grid' }, items.map(function (d) { return sceneCard(d, hrefFn(d), kind); })));
    });
  }

  /* ================= Диалоги ================= */

  EG.views.dialogues = function (root, params) {
    var read = params[0] === 'read';
    var tabs = h('div', { class: 'segmented tabs', role: 'tablist' },
      h('a', { class: read ? '' : 'active', href: '#/dialogues', role: 'tab' }, 'Интерактивные'),
      h('a', { class: read ? 'active' : '', href: '#/dialogues/read', role: 'tab' }, 'Читать и понять'));
    root.append(
      EG.ui.pageHead('Диалоги', read
        ? 'Полные диалоги и переписки. Прочитайте (перевод — по нажатию на реплику) и ответьте на вопросы на понимание.'
        : 'Интерактивные сцены: выбирайте реплики и смотрите, как на них реагирует собеседник. После каждой — разбор естественности.'),
      tabs,
      read ? groupedList(EG.data.stories, function (d) { return '#/story/' + d.id; }, 'story')
        : groupedList(EG.data.dialogues, function (d) { return '#/dialogue/' + d.id; }, 'dialogue'));
  };

  EG.views.dialogue = function (root, params) {
    var dlg = EG.dialogue.getDialogue(params[0]);
    if (!dlg) { root.append(EG.ui.empty('dialogues', 'Диалог не найден', null, h('a', { class: 'btn', href: '#/dialogues' }, 'К диалогам'))); return; }
    var run = EG.dialogue.createRun(dlg);
    var log = h('div', { class: 'chat' });
    var controls = h('div', { class: 'chat-controls' });
    var started = Date.now();
    var keyHandler = null;
    function onKey(e) { if (keyHandler && !e.metaKey && !e.ctrlKey) keyHandler(e); }
    document.addEventListener('keydown', onKey);

    root.append(
      h('a', { class: 'back-link', href: '#/dialogues' }, icon('back'), 'Диалоги'),
      h('div', { class: 'scene-head card' },
        h('div', { class: 'row between' }, h('h1', null, dlg.title), EG.ui.levelBadge(dlg.level)),
        h('p', { class: 'setting', lang: 'en' }, dlg.setting),
        h('p', { class: 'muted' }, dlg.settingRu)),
      log, controls);

    function scroll() { controls.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }

    function showNode() {
      var node = EG.dialogue.currentNode(run);
      log.appendChild(npcBubble(node.npc, node.ru, dlg.partner));
      EG.ui.autoSpeak(node.npc);
      if (node.end || !node.options) return finish();
      var opts = EG.util.shuffle(node.options.map(function (o, i) { return { o: o, i: i }; }));
      var btns = opts.map(function (x, k) {
        return h('button', { class: 'option', type: 'button', onclick: function () { pick(x.i); } },
          h('span', { class: 'opt-key' }, String(k + 1)), h('span', { class: 'opt-text', lang: 'en' }, x.o.en));
      });
      keyHandler = function (e) { var n = parseInt(e.key, 10); if (n >= 1 && n <= opts.length) { e.preventDefault(); pick(opts[n - 1].i); } };
      controls.replaceChildren(h('p', { class: 'prompt' }, 'Ваш ответ:'), h('div', { class: 'options en' }, btns));
      scroll();
    }

    function pick(i) {
      keyHandler = null;
      var nodeId = run.nodeId;
      var res = EG.dialogue.choose(run, i);
      var q = res.quality, opt = res.option;
      log.appendChild(userBubble(opt.en, q.tone));
      var good = opt.q === 'best' || opt.q === 'ok';
      EG.progress.recordAnswer({
        itemId: 'dlg:' + dlg.id + ':' + nodeId, type: 'dlgnode', correct: good, partial: opt.q === 'ok',
        userAnswer: opt.en, expected: res.best.en, kind: 'dlg', prompt: dlg.nodes[nodeId].npc,
        ref: { dialogueId: dlg.id, nodeId: nodeId }, note: opt.fb || '', xpFactor: 0.6
      });
      var fb = h('div', { class: 'feedback inline ' + q.tone },
        h('div', { class: 'fb-head' }, h('span', { class: 'fb-verdict ' + q.tone }, icon(good ? 'check' : 'x'), q.label)),
        h('p', { class: 'muted small' }, opt.ru),
        opt.fb ? h('p', { class: 'fb-note' }, icon('bulb'), opt.fb) : null,
        opt.q !== 'best' ? h('p', { class: 'small' }, h('span', { class: 'muted' }, 'Лучше: '), h('strong', { lang: 'en' }, res.best.en), ' ', EG.ui.speakBtn(res.best.en, true)) : null);
      log.appendChild(fb);
      if (res.reply) {
        log.appendChild(npcBubble(res.reply, res.replyRu, dlg.partner));
      }
      var btn = h('button', { class: 'btn primary block', onclick: go }, res.finished && !res.next ? 'Завершить' : 'Дальше', icon('arrow'));
      function go() {
        keyHandler = null;
        if (!res.next) return finish();
        showNode();
      }
      keyHandler = function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } };
      controls.replaceChildren(btn);
      setTimeout(function () { btn.focus(); }, 30);
      scroll();
    }

    function finish() {
      keyHandler = null;
      var score = EG.dialogue.score(run);
      var ids = EG.dialogue.learnIds(dlg);
      EG.progress.addMinutes(Date.now() - started);
      Promise.all([EG.progress.completeDialogue(dlg.id, 'dialogue', score), EG.srs.addItems(ids)]).then(function (r) {
        controls.replaceChildren(h('div', { class: 'card finish enter' },
          h('h2', null, 'Диалог завершён'),
          h('div', { class: 'finish-stats' }, EG.ui.ring(score, score + '%', 'естественность'),
            h('div', { class: 'finish-nums' }, h('div', null, h('strong', null, '+' + (r[0] || 0)), h('span', null, 'XP')))),
          ids.length ? h('div', { class: 'learn-list' }, h('span', { class: 'metric-label' }, 'Выражения добавлены в повторение'),
            h('div', { class: 'chips' }, ids.map(function (id) { var v = EG.data.byId[id]; return h('span', { class: 'chip static' }, v.en, h('span', { class: 'muted' }, ' — ' + v.ru)); }))) : null,
          h('div', { class: 'row gap wrap center' },
            h('button', { class: 'btn ghost', onclick: function () { EG.router.refresh(); } }, 'Пройти ещё раз'),
            dlg.scenario ? h('a', { class: 'btn primary', href: '#/talk/' + dlg.scenario }, 'Теперь своими словами') : null,
            h('a', { class: 'btn ' + (dlg.scenario ? 'ghost' : 'primary'), href: '#/dialogues' }, 'Другие диалоги'))));
        scroll();
      });
    }

    showNode();
    return function () { document.removeEventListener('keydown', onKey); };
  };

  /* ================= Разговор ================= */

  EG.views.talk = function (root, params) {
    if (params[0]) return runTalk(root, params[0]);
    root.append(
      EG.ui.pageHead('Разговор', 'Вы — в реальной ситуации. Собеседник говорит, вы отвечаете своими словами. Думайте на английском: приложение оценит смысл и естественность.'),
      h('div', { class: 'notice' }, icon('bulb'), 'Пишите так, как сказали бы вслух. Не бойтесь ошибок — разбор покажет, как звучит естественнее. Кнопка «Варианты» — если совсем трудно.'),
      groupedList(EG.data.scenarios, function (s) { return '#/talk/' + s.id; }, 'talk'));
  };

  function runTalk(root, id) {
    var sc = EG.dialogue.getScenario(id);
    if (!sc) { root.append(EG.ui.empty('talk', 'Сценарий не найден', null, h('a', { class: 'btn', href: '#/talk' }, 'К разговорам'))); return; }
    var idx = 0, scores = [], nats = [], started = Date.now(), shownAt = 0;
    var log = h('div', { class: 'chat' });
    var controls = h('div', { class: 'chat-controls' });
    var keyHandler = null;
    function onKey(e) { if (keyHandler && !e.metaKey && !e.ctrlKey) keyHandler(e); }
    document.addEventListener('keydown', onKey);
    var settingRu = h('p', { class: 'muted hidden' }, sc.settingRu);

    root.append(
      h('a', { class: 'back-link', href: '#/talk' }, icon('back'), 'Разговор'),
      h('div', { class: 'scene-head card' },
        h('div', { class: 'row between' }, h('h1', null, sc.title), EG.ui.levelBadge(sc.level)),
        h('p', { class: 'setting', lang: 'en' }, sc.setting, ' ', EG.ui.speakBtn(sc.setting, true),
          h('button', { class: 'link-btn small', onclick: function () { settingRu.classList.toggle('hidden'); } }, 'перевод')),
        settingRu,
        h('div', { class: 'bar thin talk-progress' }, h('span', { style: { width: '0%' } }))),
      log, controls);
    var progressFill = root.querySelector('.talk-progress span');

    function scroll() { controls.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }

    function showTurn(isRetry) {
      var turn = sc.turns[idx];
      progressFill.style.width = (idx / sc.turns.length * 100) + '%';
      if (!isRetry) {
        log.appendChild(npcBubble(turn.npc, turn.npcRu, sc.partner));
        EG.ui.autoSpeak(turn.npc);
      }
      shownAt = Date.now();
      var input = h('textarea', { class: 'input big', rows: 2, placeholder: 'Ответьте по-английски…', lang: 'en', autocapitalize: 'sentences', spellcheck: 'false' });
      var hintsBox = h('div', { class: 'options en hidden' });
      var usedHint = false;
      var sent = false; // защита от двойной отправки (двойной клик, зажатый Enter)
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
      });
      function submit() {
        if (sent) return;
        var ev = EG.dialogue.evaluateTurn(turn, input.value);
        if (ev.verdict === 'empty' || ev.verdict === 'russian') { EG.ui.toast(ev.message, 'warn'); input.focus(); return; }
        done(input.value.trim(), ev);
      }
      function showHints() {
        if (usedHint) return;
        usedHint = true;
        hintsBox.classList.remove('hidden');
        EG.dialogue.hintOptions(turn).forEach(function (o, k) {
          hintsBox.appendChild(h('button', { class: 'option', type: 'button', onclick: function () {
            var ev = o.good
              ? { verdict: o.n >= 80 ? 'great' : 'good', correct: true, naturalness: o.n, note: o.note, message: o.n >= 80 ? 'Отличный выбор — так и говорят.' : 'Подходит, но есть вариант естественнее.' }
              : { verdict: 'awkward', correct: false, partial: true, naturalness: o.n, note: o.note, message: 'Этот вариант звучит неудачно.' };
            done(o.t, ev);
          } }, h('span', { class: 'opt-key' }, String(k + 1)), h('span', { class: 'opt-text' }, o.t)));
        });
        scroll();
      }
      function giveUp() {
        done('(не знаю)', { verdict: 'miss', correct: false, naturalness: 0, message: 'Ничего страшного — вот как можно ответить. Попробуйте повторить вслух.' });
      }
      function done(text, ev) {
        if (sent) return;
        sent = true;
        input.disabled = true;
        controls.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
        keyHandler = null;
        var ms = Date.now() - shownAt;
        var tone = ev.correct ? (ev.naturalness >= 75 ? 'good' : 'ok') : ev.partial ? 'warn' : 'bad';
        log.appendChild(userBubble(text, tone));
        var turnScore = ev.correct ? Math.max(60, ev.naturalness) : ev.partial ? 30 : 0;
        if (usedHint) turnScore = Math.round(turnScore * 0.7);
        if (!isRetry) { scores.push(turnScore); nats.push(ev.naturalness || 0); }
        else if (turnScore > scores[scores.length - 1]) { scores[scores.length - 1] = Math.round((scores[scores.length - 1] + turnScore) / 2); }
        EG.progress.recordAnswer({
          itemId: 'talk:' + sc.id + ':' + idx, type: 'turn', correct: ev.correct, partial: ev.partial,
          userAnswer: text, expected: turn.better || turn.accepted[0].t, ms: ms, kind: 'turn', prompt: turn.npc,
          ref: { scenarioId: sc.id, turnIdx: idx }, note: ev.note || '', xpFactor: (usedHint ? 0.6 : 1.5) * (isRetry ? 0.5 : 1)
        }).then(function (xp) {
          var fb = EG.player.turnFeedback(turn, ev, { xp: xp, ms: text === '(не знаю)' ? 0 : ms });
          log.appendChild(fb);
          var last = idx >= sc.turns.length - 1;
          var nextBtn = h('button', { class: 'btn primary', onclick: next }, last ? 'Завершить' : 'Дальше', icon('arrow'));
          controls.replaceChildren(h('div', { class: 'row gap wrap' },
            !ev.correct || ev.naturalness < 75 ? h('button', { class: 'btn ghost', onclick: function () { keyHandler = null; showTurn(true); } }, 'Сказать ещё раз') : null,
            nextBtn));
          keyHandler = function (e) { if (e.key === 'Enter') { e.preventDefault(); next(); } };
          setTimeout(function () { nextBtn.focus(); }, 30);
          scroll();
        });
      }
      function next() {
        keyHandler = null;
        idx++;
        if (idx >= sc.turns.length) finish(); else showTurn(false);
      }
      keyHandler = function (e) {
        if (!usedHint || document.activeElement === input) return;
        var n = parseInt(e.key, 10);
        var b = hintsBox.querySelectorAll('.option')[n - 1];
        if (b) { e.preventDefault(); b.click(); }
      };
      EG.ui.fill(controls,
        isRetry ? h('p', { class: 'muted small' }, 'Попробуйте ещё раз — используйте более естественный вариант.') : null,
        EG.storage.get('talkHints') && turn.intent ? h('p', { class: 'intent' }, h('span', { class: 'muted' }, 'Задача: '), turn.intent) : null,
        input,
        h('div', { class: 'row gap wrap' },
          h('button', { class: 'btn primary', onclick: submit }, 'Ответить'),
          h('button', { class: 'btn ghost', onclick: showHints }, 'Варианты'),
          h('button', { class: 'btn ghost', onclick: giveUp }, 'Не знаю')),
        h('p', { class: 'muted small' }, 'Enter — отправить, Shift+Enter — новая строка.'),
        hintsBox);
      setTimeout(function () { input.focus(); }, 60);
      scroll();
    }

    function finish() {
      progressFill.style.width = '100%';
      var score = scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length) : 0;
      var nat = nats.length ? Math.round(nats.reduce(function (a, b) { return a + b; }, 0) / nats.length) : 0;
      var ids = [];
      sc.turns.forEach(function (t) { EG.dialogue.learnIds(t).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); }); });
      EG.progress.addMinutes(Date.now() - started);
      if (sc.closing) log.appendChild(npcBubble(sc.closing, sc.closingRu, sc.partner));
      Promise.all([EG.progress.completeDialogue(sc.id, 'talk', score, nat), EG.srs.addItems(ids)]).then(function (r) {
        var others = EG.data.scenarios.filter(function (s) { return s.id !== sc.id && s.level === sc.level && !EG.state.dialogues.has(s.id); });
        controls.replaceChildren(h('div', { class: 'card finish enter' },
          h('h2', null, 'Разговор завершён'),
          h('p', { class: 'muted' }, score >= 80 ? 'Вы звучите естественно. Так держать!' : score >= 50 ? 'Вас понимают. Теперь — шлифуем естественность.' : 'Хорошее начало. Повторите сценарий — во второй раз будет заметно легче.'),
          h('div', { class: 'finish-stats' },
            EG.ui.ring(score, score + '%', 'результат'),
            h('div', { class: 'finish-nums' },
              h('div', null, h('strong', null, nat + '%'), h('span', null, 'естественность')),
              h('div', null, h('strong', null, '+' + (r[0] || 0)), h('span', null, 'XP бонус')))),
          ids.length ? h('div', { class: 'learn-list' }, h('span', { class: 'metric-label' }, 'Выражения добавлены в повторение'),
            h('div', { class: 'chips' }, ids.map(function (id) { var v = EG.data.byId[id]; return h('span', { class: 'chip static' }, v.en, h('span', { class: 'muted' }, ' — ' + v.ru)); }))) : null,
          h('div', { class: 'row gap wrap center' },
            h('button', { class: 'btn ghost', onclick: function () { EG.router.refresh(); } }, 'Ещё раз'),
            others[0] ? h('a', { class: 'btn primary', href: '#/talk/' + others[0].id }, 'Следующий: ' + others[0].title) : h('a', { class: 'btn primary', href: '#/talk' }, 'Все сценарии'))));
        scroll();
      });
    }

    showTurn(false);
    return function () { document.removeEventListener('keydown', onKey); };
  }
})(window.EG = window.EG || {});
