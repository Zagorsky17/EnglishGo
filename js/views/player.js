/* views/player.js — проигрыватель учебных сессий (все типы упражнений + разбор ответа) */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  EG.views = EG.views || {};

  var EXPECTED_MS = { context: 8000, meaning: 7000, listen: 9000, register: 7000, recall: 14000, dictation: 15000, build: 16000, turn: 20000, dlgnode: 9000, slangify: 7000, formalize: 7000, decode: 8000, texting: 14000 };

  /** Разбор ответа в режиме «Разговор» (используется и в talk.js). */
  function turnFeedback(turn, ev, opts) {
    opts = opts || {};
    var toneMap = { great: 'good', good: 'good', understood: 'ok', partial: 'warn', awkward: 'warn', miss: 'bad' };
    var verdictLabel = { great: 'Отлично', good: 'Правильно', understood: 'Понятно', partial: 'Частично', awkward: 'Неудачно', miss: 'Непонятно' };
    var tone = toneMap[ev.verdict] || 'bad';
    var nat = ev.naturalness || 0;
    var better = turn.better || (turn.accepted[0] && turn.accepted[0].t);
    var learn = EG.dialogue.learnIds(turn);

    var box = h('div', { class: 'feedback turn-fb ' + tone },
      h('div', { class: 'fb-head' },
        h('span', { class: 'fb-verdict ' + tone }, icon(ev.correct ? 'check' : 'x'), verdictLabel[ev.verdict] || ''),
        opts.xp ? h('span', { class: 'xp-pill' }, '+' + opts.xp + ' XP') : null,
        opts.ms ? h('span', { class: 'muted small' }, 'ответ за ' + (opts.ms / 1000).toFixed(1) + ' с') : null
      ),
      h('p', { class: 'fb-msg' }, ev.message),
      h('div', { class: 'metric-row' },
        h('div', { class: 'metric' }, h('span', { class: 'metric-label' }, 'Правильность'),
          h('strong', null, ev.correct ? 'смысл передан' : ev.partial ? 'частично' : 'не передан')),
        h('div', { class: 'metric grow' }, h('span', { class: 'metric-label' }, 'Естественность · ' + nat + '%'),
          EG.ui.bar(nat, nat >= 75 ? 'good' : nat >= 45 ? 'ok' : 'bad'))
      ),
      ev.note ? h('p', { class: 'fb-note' }, icon('bulb'), ev.note) : null,
      better ? h('div', { class: 'better' },
        h('span', { class: 'metric-label' }, ev.verdict === 'great' ? 'Так говорят носители' : 'Более естественный вариант'),
        h('div', { class: 'better-line' }, h('strong', null, better), EG.ui.speakBtn(better, true)),
        turn.betterRu ? h('p', { class: 'muted' }, turn.betterRu) : null
      ) : null,
      turn.npc ? EG.ui.answerLines({ ask: turn.npc, askRu: turn.npcRu, user: opts.user, userRu: '' }) : null,
      turn.explain ? h('div', { class: 'explain' }, h('span', { class: 'metric-label' }, 'Почему так'), h('p', null, turn.explain)) : null,
      turn.accepted.length > 1 ? h('details', { class: 'alts' }, h('summary', null, 'Другие естественные варианты'),
        h('ul', null, turn.accepted.slice(0, 5).map(function (a) { return h('li', null, a.t, h('span', { class: 'muted small' }, ' · ' + a.n + '%')); }))) : null,
      learn.length ? h('div', { class: 'learn-list' },
        h('span', { class: 'metric-label' }, 'Новые выражения'),
        h('div', { class: 'chips' }, learn.map(function (id) {
          var v = EG.data.byId[id];
          return h('span', { class: 'chip static', title: v.ru }, v.en, h('span', { class: 'muted' }, ' — ' + v.ru));
        }))
      ) : null
    );
    return box;
  }

  /** Блок с информацией о выражении для разбора. */
  function itemInfo(item, compact) {
    if (!item) return null;
    return h('div', { class: 'item-info' },
      h('div', { class: 'item-line' }, h('strong', { class: 'en' }, item.en), EG.ui.speakBtn(item.en, true), h('span', { class: 'ru' }, '— ' + item.ru)),
      item.example ? h('p', { class: 'example' }, EG.ui.highlight(item), ' ', EG.ui.speakBtn(item.example, true)) : null,
      item.exampleRu && !compact ? h('p', { class: 'muted' }, item.exampleRu) : null,
      item.usage ? h('p', { class: 'usage' }, icon('bulb'), item.usage) : null,
      formsBlock(item)
    );
  }

  /** Блок «Обычно / Сленг / В переписке» для выражения. */
  function formsBlock(item) {
    var f = item && item.forms;
    if (!f) return null;
    var rows = [];
    if (f.neutral) rows.push(h('div', { class: 'form-row' }, h('span', { class: 'form-tag neutral' }, 'Обычно'), h('span', { lang: 'en' }, f.neutral), EG.ui.speakBtn(f.neutral, true)));
    if (f.slang) rows.push(h('div', { class: 'form-row' }, h('span', { class: 'form-tag slang' }, 'Сленг'), h('span', { lang: 'en' }, f.slang), EG.ui.speakBtn(f.slang, true)));
    if (f.text) rows.push(h('div', { class: 'form-row' }, h('span', { class: 'form-tag text' }, 'В чате'), h('span', { class: 'msg-mini', lang: 'en' }, f.text)));
    if (!rows.length) return null;
    return h('div', { class: 'forms-box' }, rows, f.note ? h('p', { class: 'muted small' }, f.note) : null);
  }

  function run(root, list, opts) {
    opts = opts || {};
    list = list.filter(Boolean);
    var idx = 0, locked = false, shownAt = 0, keyHandler = null;
    var timers = [];
    var graded = {};
    var results = { correct: 0, wrong: 0, xp: 0 };
    var started = Date.now(), minutesSaved = false;

    var progressEl = h('div', { class: 'bar thin' }, h('span'));
    var counter = h('span', { class: 'muted small' });
    var stage = h('div', { class: 'stage' });
    var foot = h('div', { class: 'stage-foot' });

    var wrap = h('div', { class: 'player' },
      h('div', { class: 'player-top' },
        h('button', { class: 'icon-btn', title: 'Завершить', 'aria-label': 'Завершить', onclick: exit }, icon('x')),
        progressEl, counter),
      opts.title ? h('div', { class: 'player-title muted small' }, opts.title) : null,
      stage, foot);
    root.replaceChildren(wrap);

    function onKey(e) {
      if (keyHandler && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.altKey) keyHandler(e);
    }
    document.addEventListener('keydown', onKey);

    function clearTimers() { timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = []; }

    function saveMinutes() {
      if (minutesSaved) return;
      minutesSaved = true;
      var ms = Math.min(Date.now() - started, 90 * 60000);
      if (ms > 5000) EG.progress.addMinutes(ms);
    }

    function exit() {
      if (opts.onExit) opts.onExit(); else EG.router.go(opts.exitTo || 'home');
    }

    function updateProgress() {
      var pct = list.length ? idx / list.length * 100 : 100;
      progressEl.firstChild.style.width = pct + '%';
      counter.textContent = Math.min(idx + 1, list.length) + ' / ' + list.length;
    }

    function next() {
      clearTimers();
      EG.ui.stopSpeech();
      locked = false;
      keyHandler = null;
      foot.replaceChildren();
      if (idx >= list.length) return finish();
      updateProgress();
      var ex = list[idx];
      var r = RENDER[ex.type];
      stage.replaceChildren();
      if (!r) { idx++; return next(); }
      var node = r(ex);
      stage.appendChild(h('div', { class: 'card ex-card ex-' + ex.type + ' enter' }, node));
      shownAt = Date.now();
      var f = stage.querySelector('[data-autofocus]');
      if (f) setTimeout(function () { f.focus(); }, 30);
    }

    function advance() { idx++; next(); }

    function expected(ex) { return ex.timeMs || EXPECTED_MS[ex.type] || 9000; }

    function answered(ex, res) {
      if (locked) return Promise.resolve();
      locked = true;
      clearTimers();
      var ms = Date.now() - shownAt;
      var item = ex.item;
      var itemId = ex.itemId || (item && item.id);
      var tasks = [];

      tasks.push(EG.progress.recordAnswer({
        itemId: itemId, type: ex.type, correct: res.correct, partial: res.partial,
        userAnswer: res.userAnswer, expected: res.expected || ex.answer, ms: ms,
        kind: ex.kind || 'vocab', prompt: ex.mistakePrompt || '', ref: ex.ref || null, note: res.note || ''
      }));

      if (item && !ex.noSrs) {
        var q = EG.srs.qualityFromAnswer(res.correct, ms, expected(ex), res.partial);
        // в одной сессии учитываем первый ответ; последующие — только ошибки
        if (!graded[item.id] || q === 0) {
          graded[item.id] = true;
          tasks.push(EG.srs.grade(item.id, q));
        }
      }

      if (res.correct && !res.partial) results.correct++; else results.wrong++;

      // ошибку повторяем в конце сессии (retrieval practice)
      if (!res.correct && !ex.retry) {
        var again = item && ex.kind !== 'turn' && ex.kind !== 'dlg' ? (EG.exercises.make(ex.type, item) || ex) : ex;
        list.push(Object.assign({}, again, { retry: true, timeMs: ex.timeMs ? Math.round(ex.timeMs * 1.3) : undefined }));
      }

      return Promise.all(tasks).then(function (r) {
        var xp = r[0] || 0;
        results.xp += xp;
        showFeedback(ex, res, xp, ms);
      }).catch(function (e) { console.error(e); showFeedback(ex, res, 0, ms); });
    }

    function nextButton(label) {
      var b = h('button', { class: 'btn primary block', onclick: advance }, label || 'Далее', icon('arrow'));
      keyHandler = function (e) { if (e.key === 'Enter') { e.preventDefault(); advance(); } };
      setTimeout(function () { b.focus({ preventScroll: true }); }, 30);
      return b;
    }

    function showFeedback(ex, res, xp, ms) {
      var body;
      if (ex.type === 'turn') {
        body = turnFeedback(ex.turn, res.ev, { xp: xp, ms: ms, user: res.userAnswer });
      } else {
        var tone = res.correct ? (res.partial ? 'ok' : 'good') : 'bad';
        var label = res.correct ? (res.partial ? 'Почти верно' : ['Верно!', 'Отлично!', 'Так держать!'][Math.floor(Math.random() * 3)]) : (res.timeout ? 'Время вышло' : 'Неверно');
        body = h('div', { class: 'feedback ' + tone },
          h('div', { class: 'fb-head' },
            h('span', { class: 'fb-verdict ' + tone }, icon(res.correct ? 'check' : 'x'), label),
            xp ? h('span', { class: 'xp-pill' }, '+' + xp + ' XP') : null),
          (!res.correct || res.partial || res.showAnswer) && ex.answer ? EG.ui.answerLines({
            ask: ex.ask, askRu: ex.askRu,
            right: res.expected || ex.answer, rightRu: res.expected && res.expected !== ex.answer ? undefined : ex.answerRu, item: ex.item,
            user: res.userAnswer && (!res.correct || res.partial) && !res.timeout ? res.userAnswer : '', userRu: res.userRu
          }) : null,
          res.note ? h('p', { class: 'fb-note' }, icon('bulb'), res.note) : null,
          ex.type === 'dlgnode' ? null : itemInfo(ex.item, true)
        );
      }
      foot.replaceChildren(body, nextButton());
      EG.ui.scrollToEnd(foot);
    }

    /* ---------- общие части ---------- */

    function choiceList(ex, opts2) {
      var btns = [];
      var listEl = h('div', { class: 'options' + (opts2 && opts2.en ? ' en' : '') });
      ex.options.forEach(function (o, i) {
        var b = h('button', { class: 'option', type: 'button', onclick: function () { pick(i); } },
          h('span', { class: 'opt-key' }, String(i + 1)), h('span', { class: 'opt-text' }, o));
        btns.push(b);
        listEl.appendChild(b);
      });
      function pick(i) {
        if (locked) return;
        var val = ex.options[i];
        var ok = opts2 && opts2.isCorrect ? opts2.isCorrect(i) : val === ex.answer;
        btns.forEach(function (b, j) {
          b.disabled = true;
          var right = opts2 && opts2.isCorrect ? opts2.isCorrect(j) : ex.options[j] === ex.answer;
          if (right) b.classList.add('correct');
          if (j === i && !ok) b.classList.add('wrong');
        });
        var res = { correct: ok, userAnswer: val };
        if (opts2 && opts2.extra) Object.assign(res, opts2.extra(i));
        answered(ex, res);
      }
      keyHandler = function (e) {
        var n = parseInt(e.key, 10);
        if (n >= 1 && n <= ex.options.length) { e.preventDefault(); pick(n - 1); }
      };
      return listEl;
    }

    function typedInput(ex, check, placeholder) {
      var input = h('input', { type: 'text', class: 'input big', placeholder: placeholder || 'Ваш ответ по-английски…', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'data-autofocus': true, lang: 'en' });
      var hintLevel = 0;
      var hintEl = h('p', { class: 'hint muted' });
      function submit() {
        if (locked) return;
        var v = input.value.trim();
        if (!v) { input.focus(); input.classList.add('shake'); setTimeout(function () { input.classList.remove('shake'); }, 400); return; }
        input.disabled = true;
        check(v);
      }
      function giveUp() { if (locked) return; input.disabled = true; answered(ex, { correct: false, userAnswer: input.value.trim() || '(не знаю)', showAnswer: true }); }
      function hint() {
        hintLevel++;
        var a = ex.answer;
        var words = a.split(' ');
        hintEl.textContent = 'Подсказка: ' + words.map(function (w, i) {
          return i < hintLevel ? w : w.charAt(0) + w.slice(1).replace(/[A-Za-z]/g, '·');
        }).join(' ');
      }
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); submit(); } });
      return h('div', { class: 'typed' }, input, hintEl,
        h('div', { class: 'row gap' },
          h('button', { class: 'btn primary', onclick: submit }, 'Проверить'),
          ex.answer ? h('button', { class: 'btn ghost', onclick: hint }, 'Подсказка') : null,
          h('button', { class: 'btn ghost', onclick: giveUp }, 'Не знаю')));
    }

    function checkTyped(ex) {
      return function (v) {
        var m = EG.text.matchAny(v, ex.answers || [ex.answer]);
        var note = '';
        if (m.ok && EG.text.normalize(v) !== EG.text.normalize(m.target)) note = 'Засчитано. Точная форма: «' + m.target + '».';
        answered(ex, { correct: m.ok || m.partial, partial: !m.ok && m.partial, userAnswer: v, expected: m.target, note: note });
      };
    }

    function audioBlock(text) {
      if (EG.ui.canSpeak()) {
        // автовоспроизведение — только если включено в настройках
        timers.push(setTimeout(function () { EG.ui.autoSpeak(text); }, 250));
        var btn = h('button', { class: 'play-btn', type: 'button', 'aria-label': 'Прослушать', onclick: function () { EG.ui.speak(text); } }, icon('speaker'));
        var slow = h('button', { class: 'btn ghost sm', type: 'button', onclick: function () { EG.ui.speak(text, null, 0.7); } }, 'Медленнее');
        return h('div', { class: 'audio-block' }, btn, h('div', { class: 'audio-side' }, h('span', { class: 'muted small' }, EG.storage.get('autoSpeak') ? 'Нажмите, чтобы прослушать ещё раз' : 'Нажмите, чтобы прослушать'), slow));
      }
      // нет голосов: показываем текст ненадолго — тренировка быстрого восприятия
      var shown = h('div', { class: 'flash-text' }, text);
      var sec = Math.max(3, Math.min(6, Math.round(text.split(' ').length * 0.6)));
      var note = h('p', { class: 'muted small' }, 'Озвучка недоступна — прочитайте фразу за ' + sec + ' с.');
      timers.push(setTimeout(function () { shown.classList.add('hidden-text'); shown.textContent = '• • •'; note.textContent = 'Фраза скрыта. Что вы запомнили?'; }, sec * 1000));
      return h('div', { class: 'audio-block' }, shown, note);
    }

    /* ---------- рендеры упражнений ---------- */
    var RENDER = {
      intro: function (ex) {
        var it = ex.item;
        timers.push(setTimeout(function () { EG.ui.autoSpeak(it.en); }, 300));
        var btn = h('button', { class: 'btn primary block', onclick: function () {
          if (locked) return; locked = true;
          (opts.addOnIntro === false ? Promise.resolve() : EG.srs.addItems([it.id])).then(advance);
        } }, 'Понятно', icon('arrow'));
        keyHandler = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } };
        setTimeout(function () { btn.focus(); }, 30);
        return h('div', null,
          h('div', { class: 'ex-label' }, icon('star'), 'Новое выражение'),
          h('div', { class: 'badges' }, EG.ui.levelBadge(it.level), h('span', { class: 'badge' }, EG.ui.TYPES[it.type] || it.type), EG.ui.registerBadge(it.register)),
          h('div', { class: 'big-phrase' }, h('span', { lang: 'en' }, it.en), EG.ui.speakBtn(it.en)),
          h('p', { class: 'translation' }, it.ru),
          it.cue ? h('div', { class: 'cue-mini' }, h('span', { class: 'muted small' }, 'Отвечаем на: '), h('em', { lang: 'en' }, it.cue), it.cueRu ? h('span', { class: 'muted small' }, ' (' + it.cueRu + ')') : null) : null,
          it.example ? h('div', { class: 'context-box' },
            h('p', { class: 'example', lang: 'en' }, EG.ui.highlight(it), ' ', EG.ui.speakBtn(it.example, true)),
            h('p', { class: 'muted' }, it.exampleRu)) : null,
          it.usage ? h('p', { class: 'usage' }, icon('bulb'), it.usage) : null,
          formsBlock(it),
          btn);
      },

      context: function (ex) {
        var it = ex.item;
        var tr = h('p', { class: 'muted small hidden' }, it.exampleRu);
        return h('div', null,
          h('div', { class: 'ex-label' }, 'Выражение в контексте'),
          h('p', { class: 'prompt' }, ex.prompt),
          h('p', { class: 'sentence', lang: 'en' }, ex.parts.before, h('span', { class: 'blank' }, '_____'), ex.parts.after),
          h('button', { class: 'link-btn', onclick: function () { tr.classList.toggle('hidden'); } }, 'Перевод'),
          tr,
          choiceList(ex, { en: true }));
      },

      meaning: function (ex) {
        var it = ex.item;
        return h('div', null,
          h('div', { class: 'ex-label' }, 'Понимание'),
          h('p', { class: 'prompt' }, ex.prompt),
          h('div', { class: 'big-phrase' }, h('span', { lang: 'en' }, it.en), EG.ui.speakBtn(it.en)),
          it.example ? h('p', { class: 'example muted', lang: 'en' }, EG.ui.highlight(it)) : null,
          choiceList(ex));
      },

      listen: function (ex) {
        return h('div', null,
          h('div', { class: 'ex-label' }, icon('speaker'), 'Аудирование'),
          h('p', { class: 'prompt' }, ex.prompt),
          audioBlock(ex.audio),
          choiceList(ex));
      },

      dictation: function (ex) {
        return h('div', null,
          h('div', { class: 'ex-label' }, icon('speaker'), 'Диктант'),
          h('p', { class: 'prompt' }, ex.prompt),
          audioBlock(ex.audio),
          typedInput(ex, checkTyped(ex), 'Напечатайте услышанное…'));
      },

      reaction: function (ex) {
        var total = ex.timeMs;
        var timerBar = h('div', { class: 'timer' }, h('span'));
        var fill = timerBar.firstChild;
        var t0 = Date.now();
        fill.style.setProperty('--timer-ms', total + 'ms');
        requestAnimationFrame(function () {
          fill.style.transition = 'transform ' + total + 'ms linear';
          fill.style.transform = 'scaleX(0)';
        });
        timers.push(setTimeout(function () { EG.ui.autoSpeak(ex.cue); }, 150));
        timers.push(setTimeout(function () {
          if (locked) return;
          stage.querySelectorAll('.option').forEach(function (b) {
            b.disabled = true;
            if (b.querySelector('.opt-text').textContent === ex.answer) b.classList.add('correct');
          });
          answered(ex, { correct: false, userAnswer: '(время вышло)', timeout: true });
        }, total));
        return h('div', null,
          h('div', { class: 'ex-label' }, icon('bolt'), 'Быстрая реакция · ' + Math.round(total / 1000) + ' с'),
          timerBar,
          h('div', { class: 'bubble npc' }, h('span', { lang: 'en' }, ex.cue), EG.ui.speakBtn(ex.cue, true)),
          h('p', { class: 'prompt' }, ex.prompt),
          choiceList(ex, { en: true }),
          h('span', { hidden: true, 'data-t0': t0 }));
      },

      register: function (ex) {
        var it = ex.item;
        return h('div', null,
          h('div', { class: 'ex-label' }, 'Уместность'),
          h('p', { class: 'prompt' }, ex.prompt),
          h('div', { class: 'big-phrase' }, h('span', { lang: 'en' }, it.en), EG.ui.speakBtn(it.en)),
          h('p', { class: 'muted' }, it.ru),
          choiceList(ex));
      },

      recall: function (ex) {
        var it = ex.item;
        return h('div', null,
          h('div', { class: 'ex-label' }, 'Активное воспоминание'),
          h('p', { class: 'prompt' }, ex.prompt),
          h('p', { class: 'big-ru' }, it.ru),
          ex.parts ? h('p', { class: 'sentence muted', lang: 'en' }, ex.parts.before, h('span', { class: 'blank' }, '…'), ex.parts.after) : null,
          it.exampleRu ? h('p', { class: 'muted small' }, it.exampleRu) : null,
          typedInput(ex, checkTyped(ex)));
      },

      build: function (ex) {
        var answer = [];
        var pool = ex.words.map(function (w, i) { return { w: w, i: i, used: false }; });
        var line = h('div', { class: 'build-line', 'aria-label': 'Ваша фраза' });
        var bank = h('div', { class: 'build-bank' });
        function redraw() {
          line.replaceChildren.apply(line, answer.length ? answer.map(function (p, k) {
            return h('button', { class: 'chip', type: 'button', onclick: function () { if (locked) return; p.used = false; answer.splice(k, 1); redraw(); } }, p.w);
          }) : [h('span', { class: 'muted small' }, 'Нажимайте на слова по порядку')]);
          bank.replaceChildren.apply(bank, pool.map(function (p) {
            return h('button', { class: 'chip' + (p.used ? ' used' : ''), type: 'button', disabled: p.used || locked, onclick: function () { p.used = true; answer.push(p); redraw(); } }, p.w);
          }));
        }
        redraw();
        function check() {
          if (locked || !answer.length) return;
          var v = answer.map(function (p) { return p.w; }).join(' ');
          var ok = EG.text.normalize(v) === EG.text.normalize(ex.answer);
          line.classList.add(ok ? 'ok' : 'bad');
          answered(ex, { correct: ok, userAnswer: v, expected: ex.answer });
        }
        keyHandler = function (e) {
          if (e.key === 'Enter') { e.preventDefault(); check(); }
          if (e.key === 'Backspace' && answer.length) { e.preventDefault(); answer.pop().used = false; redraw(); }
        };
        return h('div', null,
          h('div', { class: 'ex-label' }, 'Соберите фразу'),
          h('p', { class: 'prompt' }, ex.hint),
          line, bank,
          h('div', { class: 'row gap' },
            h('button', { class: 'btn primary', onclick: check }, 'Проверить'),
            h('button', { class: 'btn ghost', onclick: function () { if (locked) return; answer.forEach(function (p) { p.used = false; }); answer = []; redraw(); } }, 'Сбросить')));
      },

      flash: function (ex) {
        var it = ex.item;
        var card = EG.state.cards.get(it.id) || EG.srs.newCard(it.id);
        var back = h('div', { class: 'flash-back hidden' });
        var showBtn = h('button', { class: 'btn primary block', onclick: reveal }, 'Показать ответ');
        var labels = EG.srs.QUALITY_LABELS, pv = EG.srs.preview(card);
        function reveal() {
          if (!back.classList.contains('hidden')) return;
          back.classList.remove('hidden');
          showBtn.remove();
          back.appendChild(h('p', { class: 'translation' }, it.ru));
          if (it.exampleRu) back.appendChild(h('p', { class: 'muted' }, it.exampleRu));
          if (it.usage) back.appendChild(h('p', { class: 'usage' }, icon('bulb'), it.usage));
          back.appendChild(h('p', { class: 'muted small' }, 'Насколько легко вы вспомнили?'));
          back.appendChild(h('div', { class: 'grades' }, [0, 1, 2, 3].map(function (q) {
            return h('button', { class: 'grade g' + q, onclick: function () { rate(q); } },
              h('strong', null, (q + 1) + '. ' + labels[q]), h('span', null, pv[q]));
          })));
          keyHandler = function (e) {
            var n = parseInt(e.key, 10);
            if (n >= 1 && n <= 4) { e.preventDefault(); rate(n - 1); }
          };
        }
        function rate(q) {
          if (locked) return;
          locked = true;
          var ms = Date.now() - shownAt;
          graded[it.id] = true;
          if (q > 0) results.correct++; else results.wrong++;
          if (q === 0) list.push({ type: 'recall', item: it, parts: EG.exercises.findInExample(it), prompt: 'Скажите по-английски', answers: [it.en].concat(it.alt || []), answer: it.en, retry: true });
          Promise.all([
            EG.progress.recordAnswer({ itemId: it.id, type: 'flash', correct: q > 0, partial: q === 1, userAnswer: labels[q], expected: it.en, ms: ms }),
            EG.srs.grade(it.id, q)
          ]).then(function (r) { results.xp += r[0] || 0; advance(); });
        }
        keyHandler = function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); reveal(); } };
        return h('div', null,
          h('div', { class: 'ex-label' }, 'Карточка · вспомните значение'),
          h('div', { class: 'big-phrase' }, h('span', { lang: 'en' }, it.en), EG.ui.speakBtn(it.en)),
          it.example ? h('p', { class: 'example', lang: 'en' }, EG.ui.highlight(it)) : null,
          back, showBtn);
      },

      slangify: function (ex) {
        var it = ex.item;
        return h('div', null,
          h('div', { class: 'ex-label' }, icon('chat'), 'Обычно → сленг'),
          h('p', { class: 'prompt' }, ex.prompt),
          h('div', { class: 'big-phrase' }, h('span', { lang: 'en' }, it.en), EG.ui.speakBtn(it.en)),
          h('p', { class: 'muted' }, it.ru),
          choiceList(ex, { en: true, extra: function () { return { note: ex.note }; } }));
      },

      formalize: function (ex) {
        var it = ex.item;
        var shown = it.register === 'casual' ? it.en : (it.forms.slang || it.en);
        return h('div', null,
          h('div', { class: 'ex-label' }, icon('chat'), 'Сленг → обычная речь'),
          h('p', { class: 'prompt' }, ex.prompt),
          h('div', { class: 'big-phrase' }, h('span', { lang: 'en' }, shown), EG.ui.speakBtn(shown)),
          h('p', { class: 'muted' }, it.ru),
          choiceList(ex, { en: true, extra: function () { return { note: ex.note }; } }));
      },

      decode: function (ex) {
        return h('div', null,
          h('div', { class: 'ex-label' }, icon('chat'), 'Расшифруй сообщение'),
          h('p', { class: 'prompt' }, ex.prompt),
          h('div', { class: 'phone-msg' }, h('span', { class: 'msg in', lang: 'en' }, ex.message)),
          choiceList(ex));
      },

      texting: function (ex) {
        var it = ex.item;
        return h('div', null,
          h('div', { class: 'ex-label' }, icon('chat'), 'Напиши как в чате'),
          h('p', { class: 'prompt' }, ex.prompt),
          h('p', { class: 'big-ru' }, ex.hintRu || it.ru),
          typedInput(ex, function (v) {
            var m = EG.text.matchAny(v, ex.answers, 0.8);
            var ok = m.ok || m.partial;
            var note = '';
            if (ok && !EG.text.slangMarkers(v).length) note = 'Верно! Но в чате обычно пишут короче: «' + ex.answer + '».';
            else if (ok) note = 'Так и пишут в мессенджерах 👍';
            answered(ex, { correct: ok, partial: !m.ok && m.partial, userAnswer: v, expected: ex.answer, note: note, showAnswer: true });
          }, 'Напишите как в чате…'));
      },

      // повтор реплики из режима «Разговор» (ошибки)
      turn: function (ex) {
        var t = ex.turn;
        return h('div', null,
          h('div', { class: 'ex-label' }, icon('talk'), ex.setting || 'Разговор'),
          h('div', { class: 'bubble npc' }, h('span', { lang: 'en' }, t.npc), EG.ui.speakBtn(t.npc, true)),
          t.intent ? h('p', { class: 'intent' }, h('span', { class: 'muted' }, 'Задача: '), t.intent) : null,
          typedInput(ex, function (v) {
            var ev = EG.dialogue.evaluateTurn(t, v);
            if (ev.verdict === 'empty' || ev.verdict === 'russian') {
              EG.ui.toast(ev.message, 'warn');
              stage.querySelector('input').disabled = false;
              return;
            }
            answered(ex, { correct: ev.correct, partial: ev.partial, userAnswer: v, expected: t.better || t.accepted[0].t, ev: ev });
          }));
      },

      // повтор узла диалога (ошибки)
      dlgnode: function (ex) {
        var node = ex.node;
        return h('div', null,
          h('div', { class: 'ex-label' }, icon('dialogues'), ex.setting || 'Диалог'),
          h('div', { class: 'bubble npc' }, h('span', { lang: 'en' }, node.npc), EG.ui.speakBtn(node.npc, true)),
          h('p', { class: 'prompt' }, 'Выберите самый естественный ответ'),
          choiceList(ex, {
            en: true,
            isCorrect: function (i) { return node.options[i].q === 'best'; },
            extra: function (i) { var o = node.options[i]; return { note: o.fb, partial: o.q === 'ok', userRu: o.ru || '' }; }
          }));
      }
    };

    function finish() {
      clearTimers();
      keyHandler = null;
      saveMinutes();
      progressEl.firstChild.style.width = '100%';
      var total = results.correct + results.wrong;
      var acc = total ? Math.round(results.correct / total * 100) : 100;
      var done = Promise.resolve(opts.onComplete ? opts.onComplete(results, acc) : null);
      done.then(function (extra) {
        var bonusXp = total ? EG.progress.XP.session : 0;
        return (bonusXp ? EG.progress.addXp(bonusXp) : Promise.resolve()).then(function () {
          results.xp += bonusXp;
          return extra;
        });
      }).then(function (extra) {
        var mood = acc >= 90 ? 'Блестяще!' : acc >= 70 ? 'Хорошая работа!' : acc >= 50 ? 'Неплохо — ошибки уже в повторении.' : 'Сложно — но именно так и учатся.';
        var actions = (opts.finishActions || []).map(function (a) {
          return h('a', { class: 'btn ' + (a.primary ? 'primary' : 'ghost'), href: a.href }, a.label);
        });
        actions.push(h('a', { class: 'btn ghost', href: '#/home' }, 'На главную'));
        stage.replaceChildren(h('div', { class: 'card finish enter' },
          h('h2', null, opts.finishTitle || 'Сессия завершена'),
          h('p', { class: 'muted' }, mood),
          h('div', { class: 'finish-stats' },
            EG.ui.ring(acc, acc + '%', 'точность'),
            h('div', { class: 'finish-nums' },
              h('div', null, h('strong', null, '+' + results.xp), h('span', null, 'XP')),
              h('div', null, h('strong', null, results.correct), h('span', null, 'верно')),
              h('div', null, h('strong', null, results.wrong), h('span', null, 'ошибок')),
              h('div', null, h('strong', null, Math.max(1, Math.round((Date.now() - started) / 60000))), h('span', null, 'мин')))),
          extra || null,
          h('div', { class: 'row gap wrap center' }, actions)));
        foot.replaceChildren();
        counter.textContent = '';
        var first = stage.querySelector('.btn');
        if (first) first.focus();
      });
    }

    next();

    return function cleanup() {
      clearTimers();
      document.removeEventListener('keydown', onKey);
      saveMinutes();
    };
  }

  EG.player = { run: run, turnFeedback: turnFeedback, itemInfo: itemInfo, formsBlock: formsBlock };
})(window.EG = window.EG || {});
