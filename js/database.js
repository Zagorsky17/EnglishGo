/* database.js — IndexedDB: основное хранилище прогресса, экспорт и импорт */
(function (EG) {
  'use strict';

  var DB_NAME = 'englishgo';
  var DB_VERSION = 1;
  var SCHEMA_VERSION = 1; // версия формата backup-файла
  var APP_ID = 'EnglishGo';

  var STORES = {
    cards:     { keyPath: 'id', indexes: [['due', 'due'], ['state', 'state']] },
    answers:   { keyPath: 'id', autoIncrement: true, indexes: [['ts', 'ts'], ['itemId', 'itemId']] },
    mistakes:  { keyPath: 'itemId', indexes: [['lastTs', 'lastTs']] },
    lessons:   { keyPath: 'id' },
    dialogues: { keyPath: 'id' },
    stats:     { keyPath: 'date' },
    meta:      { keyPath: 'key' }
  };
  var STORE_NAMES = Object.keys(STORES);

  var db = null;
  var memory = null; // фоллбэк, если IndexedDB недоступна

  function reqP(req) {
    return new Promise(function (resolve, reject) {
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function txDone(tx) {
    return new Promise(function (resolve, reject) {
      tx.oncomplete = function () { resolve(); };
      tx.onerror = function () { reject(tx.error); };
      tx.onabort = function () { reject(tx.error || new Error('Транзакция отменена')); };
    });
  }

  function useMemory(reason) {
    memory = { seq: 1 };
    STORE_NAMES.forEach(function (n) { memory[n] = new Map(); });
    api.persistent = false;
    api.reason = reason || 'IndexedDB недоступна';
    console.warn('[EnglishGo] Работаем без IndexedDB:', api.reason);
  }

  function open() {
    return new Promise(function (resolve) {
      if (!window.indexedDB) { useMemory('Браузер не поддерживает IndexedDB'); return resolve(false); }
      var req;
      try { req = indexedDB.open(DB_NAME, DB_VERSION); }
      catch (e) { useMemory(e.message); return resolve(false); }

      req.onupgradeneeded = function () {
        var d = req.result;
        STORE_NAMES.forEach(function (name) {
          if (d.objectStoreNames.contains(name)) return;
          var cfg = STORES[name];
          var os = d.createObjectStore(name, { keyPath: cfg.keyPath, autoIncrement: !!cfg.autoIncrement });
          (cfg.indexes || []).forEach(function (ix) { os.createIndex(ix[0], ix[1]); });
        });
      };
      req.onsuccess = function () {
        db = req.result;
        db.onversionchange = function () { db.close(); };
        api.persistent = true;
        resolve(true);
      };
      req.onerror = function () { useMemory(req.error && req.error.message); resolve(false); };
      req.onblocked = function () { console.warn('[EnglishGo] IndexedDB заблокирована другой вкладкой'); };
    });
  }

  function clone(v) { return v === undefined ? v : JSON.parse(JSON.stringify(v)); }

  function keyOf(store, value) { return value[STORES[store].keyPath]; }

  /* ---------- базовые операции ---------- */

  function get(store, key) {
    if (memory) return Promise.resolve(clone(memory[store].get(key)));
    return reqP(db.transaction(store).objectStore(store).get(key));
  }

  function getAll(store) {
    if (memory) return Promise.resolve(Array.from(memory[store].values()).map(clone));
    return reqP(db.transaction(store).objectStore(store).getAll());
  }

  function put(store, value) {
    if (memory) {
      var v = clone(value);
      if (STORES[store].autoIncrement && v.id == null) v.id = memory.seq++;
      memory[store].set(keyOf(store, v), v);
      return Promise.resolve(keyOf(store, v));
    }
    var tx = db.transaction(store, 'readwrite');
    var p = reqP(tx.objectStore(store).put(value));
    return txDone(tx).then(function () { return p; });
  }

  function putMany(store, values) {
    if (!values.length) return Promise.resolve();
    if (memory) { values.forEach(function (v) { put(store, v); }); return Promise.resolve(); }
    var tx = db.transaction(store, 'readwrite');
    var os = tx.objectStore(store);
    values.forEach(function (v) { os.put(v); });
    return txDone(tx);
  }

  function del(store, key) {
    if (memory) { memory[store].delete(key); return Promise.resolve(); }
    var tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).delete(key);
    return txDone(tx);
  }

  function count(store) {
    if (memory) return Promise.resolve(memory[store].size);
    return reqP(db.transaction(store).objectStore(store).count());
  }

  /** Полная замена содержимого всех хранилищ одной транзакцией (всё или ничего). */
  function replaceAll(storesData) {
    if (memory) {
      STORE_NAMES.forEach(function (n) {
        memory[n].clear();
        (storesData[n] || []).forEach(function (v) { put(n, v); });
      });
      return Promise.resolve();
    }
    var tx = db.transaction(STORE_NAMES, 'readwrite');
    STORE_NAMES.forEach(function (n) {
      var os = tx.objectStore(n);
      os.clear();
      (storesData[n] || []).forEach(function (v) { os.put(v); });
    });
    return txDone(tx);
  }

  function wipe() {
    var empty = {};
    STORE_NAMES.forEach(function (n) { empty[n] = []; });
    return replaceAll(empty);
  }

  /* ---------- экспорт ---------- */

  function exportAll() {
    return Promise.all(STORE_NAMES.map(getAll)).then(function (all) {
      var stores = {};
      STORE_NAMES.forEach(function (n, i) { stores[n] = all[i]; });
      return {
        app: APP_ID,
        schemaVersion: SCHEMA_VERSION,
        dbVersion: DB_VERSION,
        exportedAt: new Date().toISOString(),
        settings: EG.storage ? EG.storage.all() : {},
        stores: stores
      };
    });
  }

  /* ---------- проверка backup-файла ---------- */

  function isStr(v) { return typeof v === 'string' && v.length > 0 && v.length < 500; }
  function isNum(v) { return typeof v === 'number' && isFinite(v); }
  function num(v, d) { return isNum(v) ? v : d; }

  // Валидатор возвращает очищенную запись или null (запись отбрасывается)
  var VALIDATORS = {
    cards: function (r) {
      if (!isStr(r.id) || !isNum(r.due)) return null;
      return {
        id: r.id, due: r.due,
        reps: num(r.reps, 0), lapses: num(r.lapses, 0), ease: Math.max(1.3, num(r.ease, 2.5)),
        interval: Math.max(0, num(r.interval, 0)), step: num(r.step, 0),
        lastReview: isNum(r.lastReview) ? r.lastReview : null,
        correct: num(r.correct, 0), wrong: num(r.wrong, 0),
        difficulty: Math.min(1, Math.max(0, num(r.difficulty, 0.3))),
        state: ['new', 'learning', 'review', 'mastered'].indexOf(r.state) >= 0 ? r.state : 'new',
        addedAt: num(r.addedAt, Date.now())
      };
    },
    answers: function (r) {
      if (!isNum(r.ts) || !isStr(r.itemId) || typeof r.correct !== 'boolean') return null;
      var out = {
        ts: r.ts, itemId: r.itemId, correct: r.correct,
        exerciseType: isStr(r.exerciseType) ? r.exerciseType : 'unknown',
        userAnswer: typeof r.userAnswer === 'string' ? r.userAnswer.slice(0, 500) : '',
        expected: typeof r.expected === 'string' ? r.expected.slice(0, 500) : '',
        ms: num(r.ms, 0)
      };
      if (isNum(r.id)) out.id = r.id;
      return out;
    },
    mistakes: function (r) {
      if (!isStr(r.itemId) || !isNum(r.count)) return null;
      return Object.assign({}, r, { lastTs: num(r.lastTs, Date.now()), resolved: !!r.resolved, rightStreak: num(r.rightStreak, 0) });
    },
    lessons: function (r) { return isStr(r.id) ? r : null; },
    dialogues: function (r) { return isStr(r.id) ? r : null; },
    stats: function (r) {
      if (typeof r.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(r.date)) return null;
      return {
        date: r.date, xp: num(r.xp, 0), reviews: num(r.reviews, 0), newItems: num(r.newItems, 0),
        correct: num(r.correct, 0), wrong: num(r.wrong, 0), minutes: num(r.minutes, 0), dialogues: num(r.dialogues, 0)
      };
    },
    meta: function (r) { return isStr(r.key) && 'value' in r ? { key: r.key, value: r.value } : null; }
  };

  // Миграции формата: MIGRATIONS[n] переводит данные версии n в n+1
  var MIGRATIONS = {};

  function validateBackup(obj) {
    var errors = [], warnings = [];
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return { ok: false, errors: ['Файл не содержит объект JSON.'], warnings: warnings };
    }
    if (obj.app !== APP_ID) errors.push('Это не резервная копия EnglishGo (поле «app» отсутствует или неверно).');
    var v = obj.schemaVersion;
    if (!Number.isInteger(v) || v < 1) errors.push('Не указана или неверна версия формата (schemaVersion).');
    else if (v > SCHEMA_VERSION) errors.push('Файл создан более новой версией приложения (формат v' + v + ', поддерживается до v' + SCHEMA_VERSION + ').');
    if (!obj.stores || typeof obj.stores !== 'object' || Array.isArray(obj.stores)) errors.push('Нет раздела с данными (stores).');
    if (errors.length) return { ok: false, errors: errors, warnings: warnings };

    var data = JSON.parse(JSON.stringify(obj));
    for (var ver = v; ver < SCHEMA_VERSION; ver++) {
      if (MIGRATIONS[ver]) data = MIGRATIONS[ver](data);
    }

    var clean = {}, summary = {};
    STORE_NAMES.forEach(function (n) {
      var arr = data.stores[n];
      if (arr === undefined) { warnings.push('Раздел «' + n + '» отсутствует — будет пустым.'); arr = []; }
      if (!Array.isArray(arr)) { errors.push('Раздел «' + n + '» должен быть массивом.'); return; }
      var kept = [], dropped = 0;
      arr.forEach(function (rec) {
        var r = rec && typeof rec === 'object' ? VALIDATORS[n](rec) : null;
        if (r) kept.push(r); else dropped++;
      });
      if (dropped) warnings.push('«' + n + '»: пропущено повреждённых записей — ' + dropped + '.');
      clean[n] = kept;
      summary[n] = kept.length;
    });
    Object.keys(data.stores).forEach(function (n) {
      if (!STORES[n]) warnings.push('Неизвестный раздел «' + n + '» проигнорирован.');
    });
    if (errors.length) return { ok: false, errors: errors, warnings: warnings };
    return {
      ok: true, errors: errors, warnings: warnings, stores: clean, summary: summary,
      settings: data.settings && typeof data.settings === 'object' ? data.settings : null,
      exportedAt: typeof data.exportedAt === 'string' ? data.exportedAt : ''
    };
  }

  function importValidated(result) {
    return replaceAll(result.stores).then(function () {
      if (result.settings && EG.storage) EG.storage.replace(result.settings);
    });
  }

  var api = {
    STORES: STORE_NAMES,
    SCHEMA_VERSION: SCHEMA_VERSION,
    persistent: false,
    reason: '',
    open: open,
    get: get,
    getAll: getAll,
    put: put,
    putMany: putMany,
    del: del,
    count: count,
    wipe: wipe,
    exportAll: exportAll,
    validateBackup: validateBackup,
    importValidated: importValidated
  };

  EG.db = api;
})(window.EG = window.EG || {});
