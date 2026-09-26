/* chat.js — движок эмулятора мессенджера: эпизоды, ветвление, оценка ответа с учётом регистра собеседника */
(function (EG) {
  'use strict';

  // «жёсткий» чатовый сленг — неуместен с коллегами и формальными собеседниками
  var STRONG = ['u', 'ur', 'r', 'ya', 'lol', 'lmao', 'k', 'kk', 'omg', 'ngl', 'smh', 'bro', 'dude', 'wyd', '2day', '2nite', 'l8r', 'gr8', 'b4', 'cya', 'cu', 'gonna', 'wanna', 'gotta'];
  var REGISTER_NAME = { formal: 'формальной переписки', semi: 'рабочего чата' };

  function episodesFor(contactId) {
    return EG.data.episodes.filter(function (e) { return e.contactId === contactId; })
      .sort(function (a, b) { return a.order - b.order; });
  }

  function record(ep) {
    return EG.state.chats.get(ep.id) || null;
  }

  /** Текущий эпизод: первый незавершённый (следующие открываются по очереди). */
  function currentEpisode(contactId) {
    var eps = episodesFor(contactId);
    for (var i = 0; i < eps.length; i++) {
      var r = record(eps[i]);
      if (!r || !r.done) return eps[i];
    }
    return null;
  }

  function newRecord(ep) {
    return { id: ep.id, contactId: ep.contactId, nodeId: ep.start, phase: 'enter', messages: [], turns: 0, scoreSum: 0, done: false, score: 0, startedTs: Date.now(), lastTs: Date.now(), readTs: 0 };
  }

  /** Все сообщения переписки с контактом (завершённые эпизоды + текущий). */
  function history(contactId) {
    var out = [];
    episodesFor(contactId).forEach(function (ep) {
      var r = record(ep);
      if (!r) return;
      if (out.length) out.push({ sep: true, text: ep.title });
      r.messages.forEach(function (m) { out.push(m); });
    });
    return out;
  }

  /** Статус для списка чатов. */
  function status(contact) {
    var eps = episodesFor(contact.id);
    var cur = currentEpisode(contact.id);
    var last = null, lastTs = 0, unread = 0;
    eps.forEach(function (ep) {
      var r = record(ep);
      if (!r || !r.messages.length) return;
      var m = r.messages[r.messages.length - 1];
      if (r.lastTs >= lastTs) { last = m; lastTs = r.lastTs; }
    });
    if (cur) {
      var r = record(cur);
      if (!r) {
        // новый эпизод «пришёл» — показываем первые сообщения как непрочитанные
        var first = cur.nodes[cur.start].them;
        unread = first.length;
        last = { from: 'them', text: first[first.length - 1] };
        lastTs = Date.now();
      } else if (r.phase === 'reply' && r.readTs < r.lastTs) {
        unread = 1;
      }
    }
    var done = eps.filter(function (e) { var r = record(e); return r && r.done; }).length;
    return { last: last, lastTs: lastTs, unread: unread, done: done, total: eps.length, current: cur,
      waiting: cur && record(cur) && record(cur).phase === 'reply' };
  }

  function unreadTotal() {
    var n = 0;
    EG.data.contacts.forEach(function (c) { if (status(c).unread) n++; });
    return n;
  }

  /** Оценка ответа: обычная оценка + уместность сленга для этого собеседника. */
  function evaluate(reply, text, contact) {
    var ev = EG.dialogue.evaluateTurn(reply, text);
    var marks = EG.text.slangMarkers(text);
    var reg = contact.register;
    var bad = reg === 'formal' ? marks : reg === 'semi' ? marks.filter(function (m) { return STRONG.indexOf(m) >= 0; }) : [];
    // если ответ совпал с заготовленным неудачным вариантом, его разбор уже объясняет проблему регистра
    if (bad.length && ev.verdict !== 'empty' && ev.verdict !== 'russian' && ev.verdict !== 'awkward') {
      ev.registerIssue = true;
      ev.naturalness = Math.max(10, (ev.naturalness || 0) - 35);
      if (ev.verdict === 'great' || ev.verdict === 'good') ev.verdict = 'understood';
      var msg = 'Для ' + (REGISTER_NAME[reg] || 'этого собеседника') + ' слишком неформально: ' + bad.map(function (b) { return '«' + b + '»'; }).join(', ') +
        '. ' + contact.name + ' — ' + contact.role + ', пишите полными словами.';
      ev.note = ev.note ? ev.note + ' ' + msg : msg;
    }
    if (reg === 'slang' && ev.correct && !marks.length && text.split(/\s+/).length > 7 && ev.naturalness > 70) {
      ev.note = (ev.note ? ev.note + ' ' : '') + 'Правильно, но с другом в чате обычно пишут короче и проще.';
      ev.naturalness -= 10;
    }
    return ev;
  }

  /** Куда идти после ответа: ветка по ключевым словам или обычный next. */
  function nextNode(node, text) {
    var norm = EG.text.normalize(text);
    var branches = (node.reply && node.reply.branches) || [];
    for (var i = 0; i < branches.length; i++) {
      var b = branches[i];
      if (b.keywords.every(function (g) { return EG.text.hasKeyword(norm, g); })) return b.next;
    }
    return node.next;
  }

  /** Расшифровка сокращений в сообщении: [{abbr, full, ru}] */
  function decodeMessage(text) {
    var out = [], seen = {};
    var byEn = {};
    EG.data.vocab.forEach(function (v) { if (v.topic === 'texting') byEn[v.en.toLowerCase()] = v; });
    String(text).toLowerCase().replace(/[a-z0-9\/']+/g, function (w) {
      var clean = w.replace(/'/g, '');
      var full = EG.text.TEXTING[clean] || (clean === 'w/' ? 'with' : null);
      var v = byEn[w] || byEn[clean];
      if ((full || v) && !seen[clean] && clean.length <= 5 && !/^(a|i|ok)$/.test(clean)) {
        seen[clean] = true;
        out.push({ abbr: w, full: full || '', ru: v ? v.ru : '' });
      }
      return w;
    });
    return out;
  }

  EG.chat = {
    episodesFor: episodesFor,
    currentEpisode: currentEpisode,
    record: record,
    newRecord: newRecord,
    history: history,
    status: status,
    unreadTotal: unreadTotal,
    evaluate: evaluate,
    nextNode: nextNode,
    decodeMessage: decodeMessage
  };
})(window.EG = window.EG || {});
