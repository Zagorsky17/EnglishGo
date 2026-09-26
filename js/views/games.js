/* views/games.js — раздел «Игры»: список и игровой экран (жизни, комбо, таймер, рекорды) */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  EG.views = EG.views || {};

  /* ================= Список игр ================= */
  EG.views.games = function (root) {
    var day = EG.games.gameOfDay();
    root.append(
      EG.ui.pageHead('Игры', 'Учиться можно и играя: жизни, серии, рекорды. Все ответы идут в статистику, а ошибки — в повторение.'),
      h('a', { class: 'card game-hero', href: '#/game/' + day.id },
        h('span', { class: 'game-emoji big' }, day.emoji),
        h('span', { class: 'game-body' }, h('span', { class: 'badge reg-casual' }, 'Игра дня · ×2 XP'), h('strong', null, day.title), h('span', { class: 'muted' }, day.desc)),
        icon('arrow')),
      h('div', { class: 'game-grid' }, EG.games.GAMES.map(function (g) {
        var r = EG.state.games.get(g.id);
        return h('a', { class: 'game-card', href: '#/game/' + g.id },
          h('span', { class: 'game-emoji' }, g.emoji),
          h('strong', null, g.title),
          h('span', { class: 'muted small' }, g.desc),
          h('span', { class: 'game-stats' },
            h('span', null, '🏆 ' + (r ? r.best : 0)),
            h('span', { class: 'muted' }, r ? 'сыграно: ' + r.plays : 'ещё не играли')));
      })));
  };

  /* ================= Игровой экран ================= */
  EG.views.game = function (root, params) {
    var g = EG.games.byId[params[0]];
    if (!g) { root.append(EG.ui.empty('game', 'Игра не найдена', null, h('a', { class: 'btn', href: '#/games' }, 'К играм'))); return; }
    var isDay = EG.games.gameOfDay().id === g.id;
    var timers = [], alive = true, keyHandler = null;
    var st = { score: 0, lives: g.lives, combo: 0, best: 0, right: 0, wrong: 0, xp: 0, over: false, graded: {} };
    var started = Date.now();
    var deadline = g.time ? Date.now() + g.time * 1000 : 0;

    var heartsEl = h('span', { class: 'hearts' });
    var scoreEl = h('strong', { class: 'game-score' }, '0');
    var comboEl = h('span', { class: 'combo hidden' });
    var timerFill = h('span');
    var timerEl = h('div', { class: 'timer game-timer' }, timerFill);
    var timeText = h('span', { class: 'muted small' });
    var stage = h('div', { class: 'game-stage' });

    root.append(h('div', { class: 'game' },
      h('div', { class: 'game-top' },
        h('a', { class: 'icon-btn', href: '#/games', 'aria-label': 'Выйти' }, icon('x')),
        h('span', { class: 'game-title' }, g.emoji + ' ' + g.title),
        heartsEl, comboEl, h('span', { class: 'score-box' }, scoreEl, h('span', { class: 'muted small' }, ' очков'))),
      timerEl, timeText, stage));

    function onKey(e) { if (keyHandler && !e.metaKey && !e.ctrlKey) keyHandler(e); }
    document.addEventListener('keydown', onKey);
    function later(fn, ms) { var t = setTimeout(function () { if (alive && !st.over) fn(); }, ms); timers.push(t); return t; }

    function hud() {
      heartsEl.textContent = '❤️'.repeat(Math.max(0, st.lives)) + '🤍'.repeat(Math.max(0, g.lives - st.lives));
      scoreEl.textContent = st.score;
      var m = EG.games.multiplier(st.combo);
      comboEl.textContent = '🔥 ×' + m + ' · серия ' + st.combo;
      comboEl.classList.toggle('hidden', st.combo < 3);
    }

    /* ---------- общий таймер игры ---------- */
    var qTimer = null, qDeadline = 0;
    var ticker = null;
    function tick() {
      if (!alive || st.over) { clearInterval(ticker); return; }
      var now = Date.now();
      if (deadline) {
        var left = Math.max(0, deadline - now);
        timerFill.style.transform = 'scaleX(' + (left / (g.time * 1000)) + ')';
        timeText.textContent = Math.ceil(left / 1000) + ' с';
        if (left <= 0) return end('Время вышло!');
      } else if (qDeadline) {
        var ql = Math.max(0, qDeadline - now);
        timerFill.style.transform = 'scaleX(' + (ql / (g.perQ * 1000)) + ')';
        timeText.textContent = Math.ceil(ql / 1000) + ' с на ответ';
        if (ql <= 0 && qTimer) { var f = qTimer; qTimer = null; f(); }
      }
    }

    function popXp(text, good) {
      var p = h('span', { class: 'xp-pop ' + (good ? 'good' : 'bad') }, text);
      stage.appendChild(p);
      setTimeout(function () { p.remove(); }, 900);
    }

    /** Засчитать ответ: очки, жизни, комбо, запись в статистику. */
    function score(correct, itemId, opts) {
      opts = opts || {};
      if (st.over || st.lives <= 0) return false; // игра уже закончилась — ответы больше не засчитываются
      if (correct) {
        st.combo++; st.right++;
        st.best = Math.max(st.best, st.combo);
        var m = EG.games.multiplier(st.combo);
        var speed = opts.ms ? Math.max(0, Math.round((1 - Math.min(1, opts.ms / 8000)) * 5)) : 0;
        var pts = (opts.points || 10) * m + speed;
        st.score += pts;
        popXp('+' + pts, true);
      } else {
        st.combo = 0; st.wrong++; st.lives--;
        popXp('−❤️', false);
        stage.classList.add('shake'); setTimeout(function () { stage.classList.remove('shake'); }, 400);
      }
      var mult = EG.games.multiplier(st.combo) * (isDay ? 2 : 1);
      EG.progress.recordAnswer({
        itemId: itemId || 'game:' + g.id, type: 'game', correct: correct, userAnswer: opts.user || '', expected: opts.expected || '',
        ms: opts.ms || 0, noMistake: !itemId || !EG.data.byId[itemId], xpFactor: 0.5 * mult
      }).then(function (xp) { st.xp += xp || 0; });
      // SRS: только по первому ответу на выражение за игру и только для уже изучаемых
      if (itemId && EG.state.cards.has(itemId) && !st.graded[itemId]) {
        st.graded[itemId] = true;
        EG.srs.grade(itemId, correct ? EG.srs.qualityFromAnswer(true, opts.ms, 8000) : 0);
      }
      hud();
      if (st.lives <= 0) { later(function () { end('Жизни закончились'); }, 700); return false; }
      return true;
    }

    /* ---------- вопросы (все игры, кроме «пар») ---------- */
    function nextQuestion() {
      if (st.over) return;
      var q = EG.games.GEN[g.id]();
      var shownAt = Date.now();
      var locked = false;
      keyHandler = null;
      if (g.perQ) {
        qDeadline = Date.now() + g.perQ * 1000;
        qTimer = function () { if (!locked) { locked = true; reveal(null); if (score(false, q.itemId, { user: '(время вышло)' })) later(nextQuestion, 1300); } };
      }

      var head = [];
      if (q.chat) head.push(h('div', { class: 'phone-msg' }, q.who ? h('span', { class: 'muted tiny' }, q.who) : null, h('span', { class: 'msg in', lang: 'en' }, q.chat)));
      if (q.bubble) head.push(h('div', { class: 'bubble npc' }, h('span', { lang: 'en' }, q.bubble)));
      if (q.big) head.push(h('div', { class: 'big-phrase' }, h('span', { lang: 'en' }, q.big)));
      if (q.statement) head.push(h('p', { class: 'statement' }, q.statement));

      var feedback = h('div', { class: 'game-fb' });
      function reveal(ok, extra) {
        EG.ui.fill(feedback, h('p', { class: ok ? 'good-text' : 'bad-text' }, ok ? 'Верно!' : (ok === null ? 'Время вышло' : 'Неверно')),
          extra ? h('p', { class: 'small' }, extra) : null,
          q.explain ? h('p', { class: 'muted small' }, q.explain) : null);
      }

      var body;
      if (q.kind === 'choice') {
        var btns = q.options.map(function (o, i) {
          return h('button', { class: 'option', type: 'button', onclick: function () { pick(i); } }, h('span', { class: 'opt-key' }, String(i + 1)), h('span', { class: 'opt-text' }, o.label));
        });
        var pick = function (i) {
          if (locked) return; locked = true; qTimer = null;
          var o = q.options[i];
          btns.forEach(function (b, j) { b.disabled = true; if (q.options[j].correct) b.classList.add('correct'); if (j === i && !o.correct) b.classList.add('wrong'); });
          reveal(o.correct, o.note);
          var cont = score(o.correct, q.itemId, { ms: Date.now() - shownAt, user: o.label, points: o.n ? Math.round(o.n / 10) : 10 });
          if (cont) later(nextQuestion, o.correct ? 700 : 1600);
        };
        keyHandler = function (e) { var n = parseInt(e.key, 10); if (n >= 1 && n <= btns.length) { e.preventDefault(); pick(n - 1); } };
        body = h('div', { class: 'options' + (q.en ? ' en' : '') }, btns);
      } else if (q.kind === 'tf') {
        var tfb = [true, false].map(function (v) {
          return h('button', { class: 'btn tf ' + (v ? 'yes' : 'no'), type: 'button', onclick: function () { answer(v); } }, v ? '✓ Правда' : '✗ Неправда');
        });
        var answer = function (v) {
          if (locked) return; locked = true; qTimer = null;
          var ok = v === q.truth;
          tfb.forEach(function (b) { b.disabled = true; });
          reveal(ok);
          if (score(ok, q.itemId, { ms: Date.now() - shownAt })) later(nextQuestion, ok ? 600 : 1500);
        };
        keyHandler = function (e) {
          if (e.key === 'ArrowLeft' || e.key === '1') { e.preventDefault(); answer(true); }
          if (e.key === 'ArrowRight' || e.key === '2') { e.preventDefault(); answer(false); }
        };
        body = h('div', { class: 'tf-row' }, tfb);
      } else {
        // build
        var chosen = [];
        var pool = q.words.map(function (w) { return { w: w, used: false }; });
        var line = h('div', { class: 'build-line' });
        var bank = h('div', { class: 'build-bank' });
        var redraw = function () {
          line.replaceChildren.apply(line, chosen.length ? chosen.map(function (p, k) {
            return h('button', { class: 'chip', type: 'button', onclick: function () { if (locked) return; p.used = false; chosen.splice(k, 1); redraw(); } }, p.w);
          }) : [h('span', { class: 'muted small' }, 'Нажимайте на слова по порядку')]);
          bank.replaceChildren.apply(bank, pool.map(function (p) {
            return h('button', { class: 'chip' + (p.used ? ' used' : ''), type: 'button', disabled: p.used || locked, onclick: function () {
              p.used = true; chosen.push(p); redraw();
              if (chosen.length === pool.length) check();
            } }, p.w);
          }));
        };
        var check = function () {
          if (locked) return; locked = true; qTimer = null;
          var v = chosen.map(function (p) { return p.w; }).join(' ');
          var ok = EG.text.normalize(v) === EG.text.normalize(q.answer);
          line.classList.add(ok ? 'ok' : 'bad');
          reveal(ok);
          if (score(ok, q.itemId, { ms: Date.now() - shownAt, user: v, points: 15 })) later(nextQuestion, ok ? 900 : 1800);
        };
        redraw();
        keyHandler = function (e) { if (e.key === 'Backspace' && chosen.length && !locked) { e.preventDefault(); chosen.pop().used = false; redraw(); } };
        body = h('div', null, h('p', { class: 'prompt' }, q.hint), line, bank);
      }

      stage.replaceChildren(h('div', { class: 'card game-card-q enter' },
        h('p', { class: 'prompt' }, q.prompt || ''), head, body, feedback));
    }

    /* ---------- «Сленг-пары» ---------- */
    function pairsGame() {
      var round = EG.games.pairsRound(6);
      if (round.length < 3) { stage.replaceChildren(EG.ui.empty('game', 'Мало материала', 'Изучите ещё несколько выражений — и возвращайтесь.')); return; }
      var selL = null, selR = null, left = 0, shownAt = Date.now();
      var L = EG.util.shuffle(round), R = EG.util.shuffle(round);
      var colL = h('div', { class: 'pairs-col' }), colR = h('div', { class: 'pairs-col' });
      var btnsL = L.map(function (p) { return h('button', { class: 'pair-btn', type: 'button', onclick: function () { choose('L', p, this); } }, p.left); });
      var btnsR = R.map(function (p) { return h('button', { class: 'pair-btn slang', type: 'button', onclick: function () { choose('R', p, this); } }, p.right); });
      btnsL.forEach(function (b) { colL.appendChild(b); });
      btnsR.forEach(function (b) { colR.appendChild(b); });
      function choose(side, p, btn) {
        if (btn.disabled || st.over || st.lives <= 0) return;
        if (side === 'L') { if (selL) selL.btn.classList.remove('sel'); selL = { p: p, btn: btn }; }
        else { if (selR) selR.btn.classList.remove('sel'); selR = { p: p, btn: btn }; }
        btn.classList.add('sel');
        if (selL && selR) {
          var ok = selL.p.id === selR.p.id;
          var a = selL, b = selR;
          selL = selR = null;
          if (ok) {
            [a.btn, b.btn].forEach(function (x) { x.classList.remove('sel'); x.classList.add('matched'); x.disabled = true; });
            left++;
            score(true, a.p.id, { ms: Date.now() - shownAt, points: 10 });
            shownAt = Date.now();
            if (left === round.length) later(pairsGame, 600);
          } else {
            [a.btn, b.btn].forEach(function (x) { x.classList.remove('sel'); x.classList.add('mismatch'); setTimeout(function () { x.classList.remove('mismatch'); }, 500); });
            score(false, a.p.id, { user: a.p.left + ' ↔ ' + b.p.right, expected: a.p.left + ' ↔ ' + a.p.right });
          }
        }
      }
      stage.replaceChildren(h('div', { class: 'card enter' },
        h('p', { class: 'prompt' }, 'Соедините обычную фразу (слева) с разговорной / сленговой (справа)'),
        h('div', { class: 'pairs' }, colL, colR)));
    }

    /* ---------- конец игры ---------- */
    function end(reason) {
      if (st.over) return;
      st.over = true;
      keyHandler = null;
      timerFill.style.transform = 'scaleX(0)';
      EG.progress.addMinutes(Date.now() - started);
      EG.games.saveResult(g.id, st.score).then(function (res) {
        var total = st.right + st.wrong;
        stage.replaceChildren(h('div', { class: 'card finish enter' },
          res.isBest ? h('div', { class: 'confetti', 'aria-hidden': 'true' }, Array.from({ length: 24 }, function (_, i) { return h('i', { style: { left: (i * 4.2) + '%', animationDelay: (i % 6) * 0.08 + 's' } }); })) : null,
          h('h2', null, res.isBest ? '🏆 Новый рекорд!' : reason),
          h('div', { class: 'finish-stats' },
            EG.ui.ring(total ? st.right / total * 100 : 0, String(st.score), 'очков'),
            h('div', { class: 'finish-nums' },
              h('div', null, h('strong', null, res.record.best), h('span', null, 'рекорд')),
              h('div', null, h('strong', null, st.right + '/' + total), h('span', null, 'верно')),
              h('div', null, h('strong', null, st.best), h('span', null, 'лучшая серия')),
              h('div', null, h('strong', null, '+' + st.xp), h('span', null, 'XP')))),
          h('div', { class: 'row gap wrap center' },
            h('button', { class: 'btn primary', onclick: function () { EG.router.refresh(); } }, 'Ещё раз'),
            h('a', { class: 'btn ghost', href: '#/games' }, 'Другие игры'))));
      });
    }

    hud();
    if (g.id === 'pairs') pairsGame(); else nextQuestion();
    tick();
    ticker = setInterval(tick, 100);

    return function () {
      // досрочный выход: результат сыгранной части тоже засчитываем
      if (!st.over && (st.right + st.wrong) > 0) { st.over = true; EG.games.saveResult(g.id, st.score).catch(function () {}); EG.progress.addMinutes(Date.now() - started); }
      alive = false; clearInterval(ticker); timers.forEach(clearTimeout); document.removeEventListener('keydown', onKey);
    };
  };
})(window.EG = window.EG || {});
