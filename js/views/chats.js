/* views/chats.js — эмулятор мессенджера: список чатов и окно переписки */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  EG.views = EG.views || {};

  var EMOJI = ['😂', '😅', '😊', '😍', '🥰', '😎', '🤔', '😬', '😢', '😩', '🙏', '👍', '👌', '👊', '🙌', '👏', '❤️', '🔥', '🎉', '✨', '🍕', '☕', '🍻', '😴'];
  var VERDICT_ICON = { great: '✓', good: '✓', understood: '≈', partial: '≈', awkward: '!', miss: '!' };
  var VERDICT_TONE = { great: 'good', good: 'good', understood: 'ok', partial: 'warn', awkward: 'warn', miss: 'bad' };

  function avatar(c, big) {
    return h('span', { class: 'avatar' + (big ? ' big' : ''), style: { background: c.color } }, c.name.replace('Mr. ', '').charAt(0));
  }

  function timeStr(ts) {
    var d = new Date(ts || Date.now());
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  function dayStr(ts) {
    if (!ts) return '';
    var d = new Date(ts), now = new Date();
    if (d.toDateString() === now.toDateString()) return timeStr(ts);
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  }

  /* ================= Список чатов ================= */

  EG.views.chats = function (root) {
    var rows = EG.data.contacts.map(function (c) { return { c: c, s: EG.chat.status(c) }; });
    rows.sort(function (a, b) { return (b.s.unread ? 1 : 0) - (a.s.unread ? 1 : 0) || b.s.lastTs - a.s.lastTs; });

    root.append(
      EG.ui.pageHead('Чаты', 'Переписка как в мессенджере. У каждого собеседника свой стиль: с другом — сленг и сокращения, с коллегой — полными словами, с арендодателем — формально.'),
      h('div', { class: 'notice' }, icon('bulb'), 'Отвечайте так, как написали бы в WhatsApp или Telegram. Нажмите на сообщение собеседника — увидите перевод и расшифровку сокращений. Значок у вашего сообщения открывает разбор.'),
      h('section', { class: 'card chat-list' }, rows.map(function (r) {
        var c = r.c, s = r.s;
        var preview = s.last ? (s.last.from === 'me' ? 'Вы: ' : '') + s.last.text : c.about;
        return h('a', { class: 'chat-row' + (s.unread ? ' unread' : ''), href: '#/chat/' + c.id },
          avatar(c),
          h('span', { class: 'chat-row-main' },
            h('span', { class: 'chat-row-top' }, h('strong', null, c.name), h('span', { class: 'muted small' }, s.lastTs ? dayStr(s.lastTs) : '')),
            h('span', { class: 'chat-row-bottom' },
              h('span', { class: 'chat-preview' }, preview),
              s.unread ? h('span', { class: 'unread-badge' }, String(s.unread)) : null),
            h('span', { class: 'muted tiny' }, c.role + ' · ' + (s.done === s.total ? 'все переписки пройдены ✓' : 'переписка ' + (s.done + 1) + ' из ' + s.total + (s.current ? ' · ' + s.current.level : '')))));
      })));
  };

  /* ================= Окно переписки ================= */

  EG.views.chat = function (root, params) {
    var contact = EG.data.contactsById[params[0]];
    if (!contact) { root.append(EG.ui.empty('chat', 'Чат не найден', null, h('a', { class: 'btn', href: '#/chats' }, 'К чатам'))); return; }
    var timers = [], alive = true, busy = false, usedHint = false, misses = 0, shownAt = Date.now();
    var instant = EG.storage.get('chatFeedback');

    var statusEl = h('span', { class: 'chat-status' }, 'в сети');
    var msgs = h('div', { class: 'msgs', role: 'log', 'aria-live': 'polite' });
    var input = h('textarea', { class: 'composer-input', rows: 1, placeholder: 'Сообщение', lang: 'en', spellcheck: 'false', autocapitalize: 'off' });
    var sendBtn = h('button', { class: 'composer-send', type: 'button', 'aria-label': 'Отправить', onclick: send }, icon('send'));
    var emojiPanel = h('div', { class: 'emoji-panel hidden' }, EMOJI.map(function (e) {
      return h('button', { type: 'button', onclick: function () { insert(e); } }, e);
    }));
    var quick = h('div', { class: 'quick-replies hidden' });
    var intentEl = h('div', { class: 'chat-intent hidden' });
    var composer = h('div', { class: 'composer' },
      h('button', { class: 'composer-btn', type: 'button', title: 'Эмодзи', 'aria-label': 'Эмодзи', onclick: function () { emojiPanel.classList.toggle('hidden'); } }, icon('smile')),
      input,
      h('button', { class: 'composer-btn', type: 'button', title: 'Варианты ответа', 'aria-label': 'Варианты ответа', onclick: toggleQuick }, icon('bulb')),
      sendBtn);

    var composerWrap = h('div', { class: 'composer-wrap' }, intentEl, quick, emojiPanel, composer);

    root.append(h('div', { class: 'messenger' },
      h('div', { class: 'chat-head' },
        h('a', { class: 'icon-btn', href: '#/chats', 'aria-label': 'Назад' }, icon('back')),
        avatar(contact),
        h('div', { class: 'chat-head-main' }, h('strong', null, contact.name), statusEl),
        h('button', { class: 'icon-btn', title: 'О собеседнике', 'aria-label': 'О собеседнике', onclick: aboutContact }, icon('help'))),
      msgs,
      composerWrap));

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
    input.addEventListener('input', function () {
      input.style.height = 'auto';
      input.style.height = Math.min(120, input.scrollHeight) + 'px';
    });

    function insert(txt) {
      var p = input.selectionStart || input.value.length;
      input.value = input.value.slice(0, p) + txt + input.value.slice(p);
      input.focus();
    }

    function later(fn, ms) { var t = setTimeout(function () { if (alive) fn(); }, ms); timers.push(t); }

    var pinned = true;
    msgs.addEventListener('scroll', function () { pinned = msgs.scrollHeight - msgs.clientHeight - msgs.scrollTop < 48; });
    function scroll() { pinned = true; msgs.scrollTop = msgs.scrollHeight; }
    // Композер меняет высоту (подсказка «Что ответить?», эмодзи, растущее поле) уже после
    // scroll() и «съедает» низ ленты — возвращаем её вниз, если человек и так читал последние сообщения.
    var sizeWatch = window.ResizeObserver ? new ResizeObserver(function () { if (pinned) msgs.scrollTop = msgs.scrollHeight; }) : null;
    if (sizeWatch) sizeWatch.observe(composerWrap);

    function aboutContact() {
      var s = EG.chat.status(contact);
      EG.ui.modal({ title: contact.name, body: h('div', null,
        h('p', null, contact.about),
        h('p', { class: 'muted small' }, 'Стиль: ' + ({ slang: 'сленг и сокращения — нормально', casual: 'неформально, но без перебора', semi: 'рабочий — полными словами, без u / lol', formal: 'формальный — только полные формы и вежливые обороты' })[contact.register]),
        h('p', { class: 'muted small' }, 'Пройдено переписок: ' + s.done + ' из ' + s.total)),
        actions: s.done ? [{ label: 'Начать переписку заново', value: 'reset', kind: 'ghost' }, { label: 'Закрыть', value: null, primary: true }] : undefined
      }).then(function (v) {
        if (v !== 'reset') return;
        Promise.all(EG.chat.episodesFor(contact.id).map(function (ep) { EG.state.chats.delete(ep.id); return EG.db.del('chats', ep.id); }))
          .then(function () { EG.router.refresh(); });
      });
    }

    /* ---------- отрисовка сообщений ---------- */

    function themBubble(m) {
      var extra = h('div', { class: 'msg-extra hidden' });
      var el = h('div', { class: 'msg in' + (m.system ? ' confused' : '') },
        h('span', { class: 'msg-text', lang: 'en' }, m.text),
        h('span', { class: 'msg-meta' }, timeStr(m.ts)),
        extra);
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', 'Сообщение: ' + m.text + '. Нажмите, чтобы увидеть перевод');
      el.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target === el) { e.preventDefault(); el.click(); } });
      el.addEventListener('click', function (e) {
        if (e.target.closest('button')) return;
        if (!extra.childNodes.length) {
          var dec = EG.chat.decodeMessage(m.text);
          EG.ui.fill(extra,
            m.ru ? h('div', { class: 'msg-ru' }, m.ru) : null,
            dec.length ? h('div', { class: 'msg-decode' }, dec.map(function (d) {
              return h('span', null, h('b', null, d.abbr), ' = ' + (d.full || '') + (d.ru ? ' (' + d.ru.split(' — ').pop() + ')' : ''));
            })) : null,
            EG.ui.speakBtn(m.text, true));
        }
        extra.classList.toggle('hidden');
      });
      return el;
    }

    function meBubble(m, ep) {
      var tone = m.ev ? VERDICT_TONE[m.ev.verdict] || 'ok' : 'ok';
      var badge = m.ev ? h('button', { class: 'msg-grade ' + tone, type: 'button', title: 'Разбор ответа', 'aria-label': 'Разбор ответа',
        onclick: function () { showFeedback(m, ep); } }, VERDICT_ICON[m.ev.verdict] || '?') : null;
      var ticks = h('span', { class: 'ticks' + (m.read ? ' read' : '') }, m.read ? '✓✓' : '✓');
      var el = h('div', { class: 'msg out' },
        badge,
        h('span', { class: 'msg-text', lang: 'en' }, m.text),
        h('span', { class: 'msg-meta' }, timeStr(m.ts), ' ', ticks));
      el._ticks = ticks;
      return el;
    }

    function showFeedback(m, ep) {
      var episode = ep || EG.data.episodesById[m.ep];
      var node = episode && episode.nodes[m.node];
      if (!node || !node.reply) return;
      EG.ui.modal({ title: 'Разбор ответа', wide: true, body: EG.player.turnFeedback(node.reply, m.ev, { user: m.text }) });
    }

    function renderHistory() {
      msgs.replaceChildren();
      EG.chat.episodesFor(contact.id).forEach(function (ep, i) {
        var r = EG.chat.record(ep);
        if (!r) return;
        msgs.appendChild(h('div', { class: 'msg-sep' }, h('span', null, ep.title + (r.done ? ' · ' + r.score + '%' : ''))));
        r.messages.forEach(function (m) { msgs.appendChild(m.from === 'me' ? meBubble(m, ep) : themBubble(m)); });
      });
      scroll();
    }

    /* ---------- логика эпизода ---------- */

    var ep = EG.chat.currentEpisode(contact.id);
    var rec = ep ? EG.chat.record(ep) : null;

    function save() { rec.lastTs = Date.now(); return EG.state.saveChat(Object.assign({}, rec)); }

    function setComposer(on) {
      [input, sendBtn].forEach(function (el) { el.disabled = !on; });
      composer.classList.toggle('disabled', !on);
      if (!on) { quick.classList.add('hidden'); emojiPanel.classList.add('hidden'); }
      var node = ep && rec && ep.nodes[rec.nodeId];
      if (on && node && node.reply && EG.storage.get('talkHints')) {
        intentEl.replaceChildren(
          h('button', { class: 'link-btn small', type: 'button', onclick: function () { intentEl.classList.toggle('open'); } }, '💡 Что ответить?'),
          h('span', { class: 'intent-text' }, node.reply.intent));
        intentEl.classList.remove('hidden', 'open');
      } else intentEl.classList.add('hidden');
      if (on) { shownAt = Date.now(); setTimeout(function () { input.focus(); }, 50); }
    }

    function typingDelay(text) { return Math.min(2600, 700 + text.length * 35); }

    /** Показать сообщения собеседника с «печатает…». */
    function playThem(list, done) {
      var i = 0;
      function step() {
        if (i >= list.length) { statusEl.textContent = 'в сети'; statusEl.classList.remove('typing'); return done && done(); }
        var m = list[i++];
        statusEl.textContent = 'печатает…';
        statusEl.classList.add('typing');
        var dots = h('div', { class: 'msg in typing-dots' }, h('span'), h('span'), h('span'));
        msgs.appendChild(dots); scroll();
        later(function () {
          dots.remove();
          msgs.appendChild(themBubble(m));
          EG.ui.autoSpeak(m.text);
          scroll();
          later(step, 350);
        }, typingDelay(m.text));
      }
      // «прочитано» у последних своих сообщений
      msgs.querySelectorAll('.msg.out .ticks').forEach(function (t) { t.textContent = '✓✓'; t.classList.add('read'); });
      if (rec) rec.messages.forEach(function (m) { if (m.from === 'me') m.read = true; });
      later(step, 500);
    }

    function enterNode(nodeId) {
      var node = ep.nodes[nodeId];
      var now = Date.now();
      var incoming = node.them.map(function (t, i) { return { from: 'them', text: t, ru: (node.ru || [])[i] || '', ts: now + i }; });
      rec.nodeId = nodeId;
      Array.prototype.push.apply(rec.messages, incoming);
      rec.phase = node.end ? 'done' : 'reply';
      var completion = null;
      if (node.end) {
        rec.done = true;
        rec.score = rec.turns ? Math.round(rec.scoreSum / rec.turns) : 0;
      }
      rec.readTs = Date.now() + 60000;
      save();
      // награду начисляем сразу — даже если пользователь уйдёт во время «печатает…»
      if (node.end) completion = EG.chat.completeEpisode(ep, rec).catch(function () { return 0; });
      busy = true;
      setComposer(false);
      playThem(incoming, function () {
        busy = false;
        if (node.end) finishEpisode(completion); else setComposer(true);
      });
    }

    function finishEpisode(completion) {
      var ids = (ep.learn || []).map(EG.data.resolve).filter(Boolean);
      Promise.resolve(completion).then(function (xp) {
        var r = [xp];
        var next = EG.chat.currentEpisode(contact.id);
        msgs.appendChild(h('div', { class: 'chat-summary' },
          h('strong', null, 'Переписка завершена · ' + rec.score + '%'),
          h('span', { class: 'muted small' }, '+' + (r[0] || 0) + ' XP' + (ids.length ? ' · ' + ids.length + ' выражений в повторение' : '')),
          ids.length ? h('div', { class: 'chips' }, ids.map(function (id) { var v = EG.data.byId[id]; return h('span', { class: 'chip static' }, v.en, h('span', { class: 'muted' }, ' — ' + v.ru)); })) : null,
          h('div', { class: 'row gap wrap center' },
            next ? h('button', { class: 'btn primary', onclick: function () { startEpisode(next); } }, 'Продолжить: ' + next.title) : h('span', { class: 'muted small' }, 'Все переписки с ' + contact.name + ' пройдены 🎉'),
            h('a', { class: 'btn ghost', href: '#/chats' }, 'Другие чаты'))));
        scroll();
      });
    }

    function startEpisode(e) {
      ep = e;
      rec = EG.chat.newRecord(ep);
      misses = 0;
      msgs.appendChild(h('div', { class: 'msg-sep' }, h('span', null, ep.title)));
      msgs.appendChild(h('div', { class: 'chat-note' }, ep.intro));
      scroll();
      enterNode(ep.start);
    }

    function toggleQuick() {
      var node = ep && rec && ep.nodes[rec.nodeId];
      if (!node || !node.reply || busy) return;
      if (!quick.classList.contains('hidden')) { quick.classList.add('hidden'); return; }
      usedHint = true;
      quick.replaceChildren.apply(quick, EG.dialogue.hintOptions(node.reply).map(function (o) {
        return h('button', { class: 'quick', type: 'button', onclick: function () { input.value = o.t; quick.classList.add('hidden'); send(); } }, o.t);
      }));
      quick.classList.remove('hidden');
    }

    function send() {
      if (busy || !ep || !rec) return;
      var node = ep.nodes[rec.nodeId];
      if (!node || !node.reply) return;
      var text = input.value.trim();
      if (!text) return;
      var ev = EG.chat.evaluate(node.reply, text, contact);
      if (ev.verdict === 'russian') { EG.ui.toast(ev.message, 'warn'); return; }
      if (ev.verdict === 'empty') return;
      var ms = Date.now() - shownAt;
      input.value = ''; input.style.height = 'auto';
      quick.classList.add('hidden'); emojiPanel.classList.add('hidden');

      var m = { from: 'me', text: text, ts: Date.now(), ep: ep.id, node: rec.nodeId,
        ev: { verdict: ev.verdict, correct: !!ev.correct, partial: !!ev.partial, naturalness: ev.naturalness || 0, note: ev.note || '', message: ev.message || '' } };
      rec.messages.push(m);
      var bubble = meBubble(m, ep);
      msgs.appendChild(bubble); scroll();

      var turnScore = ev.correct ? Math.max(60, ev.naturalness) : ev.partial ? 30 : 0;
      if (usedHint) turnScore = Math.round(turnScore * 0.7);
      var isMiss = ev.verdict === 'miss' && misses < 2;

      EG.progress.recordAnswer({
        itemId: 'chat:' + ep.id + ':' + rec.nodeId, type: 'chat', correct: !!ev.correct, partial: !!ev.partial,
        userAnswer: text, expected: node.reply.better || node.reply.accepted[0].t, ms: ms, kind: 'chat', prompt: node.reply.npc,
        ref: { episodeId: ep.id, nodeId: rec.nodeId }, note: ev.note || '', xpFactor: usedHint ? 0.6 : 1.5
      });
      usedHint = false;

      if (instant || isMiss) {
        msgs.appendChild(h('div', { class: 'chat-fb' }, EG.player.turnFeedback(node.reply, m.ev, { ms: ms, user: text })));
        scroll();
      } else if (ev.verdict !== 'great' && ev.verdict !== 'good' && !EG.storage.get('chatHintShown')) {
        EG.storage.set('chatHintShown', true);
        EG.ui.toast('Нажмите на значок у своего сообщения, чтобы увидеть разбор', '');
      }

      if (isMiss) {
        // собеседник не понял — переспрашивает, ход повторяется
        misses++;
        var confused = { from: 'them', text: contact.confused[Math.floor(Math.random() * contact.confused.length)], ru: 'Собеседник не понял ваш ответ — попробуйте иначе.', ts: Date.now(), system: true };
        rec.messages.push(confused);
        save();
        busy = true; setComposer(false);
        playThem([confused], function () { busy = false; setComposer(true); });
        return;
      }
      misses = 0;
      rec.turns += 1;
      rec.scoreSum += turnScore;
      var next = EG.chat.nextNode(node, text);
      save();
      enterNode(next);
    }

    /* ---------- старт ---------- */
    renderHistory();
    if (!ep) {
      msgs.appendChild(h('div', { class: 'chat-note' }, 'Все переписки с ' + contact.name + ' пройдены. Новые собеседники — в списке чатов.'));
      setComposer(false);
    } else if (!rec) {
      startEpisode(ep);
    } else if (rec.phase === 'reply') {
      rec.readTs = Date.now() + 60000; save();
      setComposer(true);
    } else {
      setComposer(false);
    }
    scroll();

    return function () { alive = false; timers.forEach(clearTimeout); if (sizeWatch) sizeWatch.disconnect(); };
  };
})(window.EG = window.EG || {});
