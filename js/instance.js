/* instance.js — одна активная вкладка.
   Две вкладки с общим IndexedDB перезаписывали бы прогресс друг друга (кеш в памяти у каждой свой).
   Новая вкладка спрашивает «ping»; активная отвечает «pong». Перехват управления — «takeover».
   Канал: BroadcastChannel + запасной путь через событие storage (localStorage). */
(function (EG) {
  'use strict';

  var KEY = 'eg.instance';
  var TAKEOVER_FLAG = 'eg.takeover';
  var id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  var ch = null;
  var seen = {};
  var starting = false;
  var gotPong = false;

  var api = { id: id, active: true };

  function post(type) {
    var msg = { type: type, from: id, ts: Date.now(), n: Math.random() };
    if (ch) { try { ch.postMessage(msg); } catch (e) { /* канал закрыт */ } }
    try { localStorage.setItem(KEY, JSON.stringify(msg)); } catch (e) { /* localStorage недоступен */ }
  }

  function receive(msg) {
    if (!msg || typeof msg !== 'object' || msg.from === id) return;
    var k = msg.from + ':' + msg.ts + ':' + msg.n;
    if (seen[k]) return; // одно сообщение может прийти двумя путями
    seen[k] = 1;

    if (msg.type === 'ping') {
      // отвечаем, если мы активны; при одновременном старте двух вкладок побеждает меньший id
      if ((api.active && !starting) || (starting && id < msg.from)) post('pong');
    } else if (msg.type === 'pong') {
      if (starting) gotPong = true;
    } else if (msg.type === 'takeover') {
      if (api.active && !starting) {
        api.active = false;
        if (EG.bus) EG.bus.emit('instance-inactive');
      }
    }
  }

  function listen() {
    if ('BroadcastChannel' in window) {
      try { ch = new BroadcastChannel('englishgo'); ch.onmessage = function (e) { receive(e.data); }; } catch (e) { ch = null; }
    }
    window.addEventListener('storage', function (e) {
      if (e.key !== KEY || !e.newValue) return;
      try { receive(JSON.parse(e.newValue)); } catch (err) { /* мусор в ключе */ }
    });
  }

  /** Старт: resolve(true) — эта вкладка активна, resolve(false) — приложение уже открыто в другой. */
  api.start = function () {
    listen();
    var forced = false;
    try { forced = sessionStorage.getItem(TAKEOVER_FLAG) === '1'; sessionStorage.removeItem(TAKEOVER_FLAG); } catch (e) { /* нет sessionStorage */ }
    if (forced) { post('takeover'); api.active = true; return Promise.resolve(true); }
    starting = true;
    post('ping');
    return new Promise(function (resolve) {
      setTimeout(function () {
        starting = false;
        api.active = !gotPong;
        resolve(api.active);
      }, 400);
    });
  };

  /** Сделать эту вкладку активной (другая перейдёт в режим ожидания). */
  api.takeover = function () {
    try { sessionStorage.setItem(TAKEOVER_FLAG, '1'); } catch (e) { /* ignore */ }
    location.reload();
  };

  EG.instance = api;
})(window.EG = window.EG || {});
