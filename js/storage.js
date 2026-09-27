/* storage.js — небольшие настройки приложения в localStorage */
(function (EG) {
  'use strict';

  EG.LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

  var KEY = 'eg.settings';

  var DEFAULTS = {
    theme: 'auto',        // auto | light | dark
    level: 'A2',          // выбранный уровень CEFR
    dailyGoal: 60,        // цель XP в день
    newPerDay: 8,         // новых выражений в день
    speech: true,         // озвучка (кнопки прослушивания)
    autoSpeak: false,     // автоматически произносить фразы при появлении
    onlineVoices: false,  // разрешить сетевые голоса (текст уходит на сервер голосового движка)
    rate: 0.95,           // скорость речи
    voice: '',            // имя голоса
    name: '',             // имя пользователя
    talkHints: true,      // показывать задачу (по-русски) в режиме «Разговор»
    compact: false,       // компактный интерфейс
    chatFeedback: false,  // в мессенджере показывать разбор сразу после ответа
    chatHintShown: false, // подсказка про значок разбора уже показана
    wordLevel: '',        // уровень в тренажёре слов ('' — по уровню пользователя)
    wordMode: 'mix',      // режим свободной тренировки: mix | ru-en | en-ru | type | listen
    onboarded: false
  };

  var cache = null;

  function sanitize(obj) {
    var out = {};
    if (!obj || typeof obj !== 'object') return out;
    Object.keys(DEFAULTS).forEach(function (k) {
      if (k in obj && typeof obj[k] === typeof DEFAULTS[k]) out[k] = obj[k];
    });
    if (out.level && EG.LEVELS.indexOf(out.level) === -1) delete out.level;
    if (out.wordLevel && EG.LEVELS.indexOf(out.wordLevel) === -1) delete out.wordLevel;
    if (out.wordMode && ['ru-en', 'en-ru', 'mix', 'type', 'listen'].indexOf(out.wordMode) === -1) delete out.wordMode;
    if (out.theme && ['auto', 'light', 'dark'].indexOf(out.theme) === -1) delete out.theme;
    // верхнего предела у цели нет — ограничиваем только снизу, чтобы не делить на ноль в кольцах прогресса
    if ('dailyGoal' in out) out.dailyGoal = isFinite(out.dailyGoal) ? Math.max(10, Math.round(out.dailyGoal) || DEFAULTS.dailyGoal) : DEFAULTS.dailyGoal;
    if ('newPerDay' in out) out.newPerDay = Math.min(40, Math.max(0, Math.round(out.newPerDay) || 0));
    if ('rate' in out) out.rate = Math.min(1.5, Math.max(0.5, out.rate || 1));
    if ('name' in out) out.name = out.name.slice(0, 30);
    if ('voice' in out) out.voice = out.voice.slice(0, 120);
    return out;
  }

  function load() {
    if (cache) return cache;
    var raw = {};
    try { raw = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { raw = {}; }
    cache = Object.assign({}, DEFAULTS, sanitize(raw));
    return cache;
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) { /* приватный режим и т.п. */ }
  }

  EG.storage = {
    DEFAULTS: DEFAULTS,
    get: function (k) { return load()[k]; },
    set: function (k, v) {
      load();
      var clean = sanitize(Object.assign({}, cache, (function () { var o = {}; o[k] = v; return o; })()));
      cache = Object.assign({}, DEFAULTS, clean);
      persist();
      if (EG.bus) EG.bus.emit('settings', { key: k, value: cache[k] });
    },
    all: function () { return Object.assign({}, load()); },
    replace: function (obj) { cache = Object.assign({}, DEFAULTS, sanitize(obj)); persist(); },
    reset: function () { cache = Object.assign({}, DEFAULTS); persist(); },
    reload: function () { cache = null; load(); if (EG.bus) EG.bus.emit('settings', {}); },
    sanitize: sanitize
  };
})(window.EG = window.EG || {});
