/* database.js — IndexedDB: основное хранилище прогресса, экспорт и импорт */
(function (EG) {
  'use strict';

  var DB_NAME = 'englishgo';
  var DB_VERSION = 3;     // v2: + games, chats; v3: + words
  var SCHEMA_VERSION = 3; // версия формата backup-файла
  var APP_ID = 'EnglishGo';

  var STORES = {
    cards:     { keyPath: 'id', indexes: [['due', 'due'], ['state', 'state']] },
    answers:   { keyPath: 'id', autoIncrement: true, indexes: [['ts', 'ts'], ['itemId', 'itemId']] },
    mistakes:  { keyPath: 'itemId', indexes: [['lastTs', 'lastTs']] },
    lessons:   { keyPath: 'id' },
    dialogues: { keyPath: 'id' },
    stats:     { keyPath: 'date' },
    meta:      { keyPath: 'key' },
    games:     { keyPath: 'id' },
    chats:     { keyPath: 'id' },
    words:     { keyPath: 'id' }
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

  var lost = false;        // соединение закрыто из-за новой версии в другой вкладке — переоткрывать нельзя
  var reopening = null;

  function emit(evt, data) { if (EG.bus) EG.bus.emit(evt, data); }
  function named(name, message) { var e = new Error(message); e.name = name; return e; }

  function attach(d) {
    db = d;
    // другая вкладка открыла новую версию схемы — закрываемся и просим перезагрузку
    db.onversionchange = function () { try { db.close(); } catch (e) { /* уже закрыто */ } db = null; lost = true; emit('db-lost'); };
    // Chrome: аварийное закрытие (очистка данных сайта, сбой процесса хранилища)
    db.onclose = function () { db = null; };
  }

  function openRequest(onBlocked) {
    return new Promise(function (resolve, reject) {
      var req;
      try { req = indexedDB.open(DB_NAME, DB_VERSION); } catch (e) { return reject(e); }
      req.onupgradeneeded = function () {
        var d = req.result;
        STORE_NAMES.forEach(function (name) {
          if (d.objectStoreNames.contains(name)) return;
          var cfg = STORES[name];
          var os = d.createObjectStore(name, { keyPath: cfg.keyPath, autoIncrement: !!cfg.autoIncrement });
          (cfg.indexes || []).forEach(function (ix) { os.createIndex(ix[0], ix[1]); });
        });
      };
      req.onsuccess = function () { attach(req.result); resolve(db); };
      req.onerror = function () { reject(req.error || named('UnknownError', 'IndexedDB error')); };
      req.onblocked = function () { if (onBlocked) onBlocked(); };
    });
  }

  function open() {
    if (!window.indexedDB) { useMemory('Браузер не поддерживает IndexedDB'); return Promise.resolve(false); }
    return openRequest(function () {
      console.warn('[EnglishGo] Открытие базы заблокировано другой вкладкой');
      emit('db-blocked');
    }).then(function () { api.persistent = true; return true; },
      function (e) { useMemory(e && e.message); return false; });
  }

  /** Гарантирует открытое соединение (переоткрывает после сбоя). */
  function ensure() {
    if (lost) return Promise.reject(named('DbLost', 'Приложение обновлено в другой вкладке — перезагрузите страницу'));
    if (db) return Promise.resolve(db);
    if (!reopening) {
      reopening = openRequest(null).then(function (d) { reopening = null; return d; }, function (e) { reopening = null; throw e; });
    }
    return reopening;
  }

  function writeAllowed() {
    return !(EG.instance && EG.instance.active === false);
  }

  function onError(e) {
    // InactiveTab и DbLost — ожидаемые состояния, о них уже сообщает свой баннер
    if (e && e.name !== 'InactiveTab' && e.name !== 'DbLost') {
      console.error('[EnglishGo] Ошибка хранилища:', e);
      emit('db-error', { error: e, quota: !!e && (e.name === 'QuotaExceededError' || /quota/i.test(e.message || '')) });
    }
    throw e;
  }

  /**
   * Единая точка доступа к IndexedDB: никогда не бросает синхронно,
   * при обрыве соединения один раз переоткрывает базу и повторяет операцию.
   */
  function withTx(stores, mode, fn, options) {
    if (mode === 'readwrite' && !writeAllowed()) return Promise.reject(named('InactiveTab', 'Приложение открыто в другой вкладке'));
    return ensure().then(function () {
      var tx;
      try { tx = options ? db.transaction(stores, mode, options) : db.transaction(stores, mode); }
      catch (e) {
        if ((e.name === 'InvalidStateError' || e.name === 'UnknownError') && !lost) {
          db = null;
          return ensure().then(function () { return fn(db.transaction(stores, mode)); });
        }
        throw e;
      }
      return fn(tx);
    }).catch(onError);
  }

  function memWrite(fn) {
    if (!writeAllowed()) return Promise.reject(named('InactiveTab', 'Приложение открыто в другой вкладке'));
    return Promise.resolve(fn());
  }

  function clone(v) { return v === undefined ? v : JSON.parse(JSON.stringify(v)); }

  function keyOf(store, value) { return value[STORES[store].keyPath]; }

  /* ---------- базовые операции ---------- */

  function get(store, key) {
    if (memory) return Promise.resolve(clone(memory[store].get(key)));
    return withTx(store, 'readonly', function (tx) { return reqP(tx.objectStore(store).get(key)); });
  }

  function getAll(store) {
    if (memory) return Promise.resolve(Array.from(memory[store].values()).map(clone));
    return withTx(store, 'readonly', function (tx) { return reqP(tx.objectStore(store).getAll()); });
  }

  function memPut(store, value) {
    var v = clone(value);
    if (STORES[store].autoIncrement && v.id == null) v.id = memory.seq++;
    memory[store].set(keyOf(store, v), v);
    return keyOf(store, v);
  }

  function put(store, value) {
    if (memory) return memWrite(function () { return memPut(store, value); });
    return withTx(store, 'readwrite', function (tx) {
      var p = reqP(tx.objectStore(store).put(value));
      return txDone(tx).then(function () { return p; });
    });
  }

  function putMany(store, values) {
    if (!values.length) return Promise.resolve();
    if (memory) return memWrite(function () { values.forEach(function (v) { memPut(store, v); }); });
    return withTx(store, 'readwrite', function (tx) {
      var os = tx.objectStore(store);
      values.forEach(function (v) { os.put(v); });
      return txDone(tx);
    });
  }

  function del(store, key) {
    if (memory) return memWrite(function () { memory[store].delete(key); });
    return withTx(store, 'readwrite', function (tx) {
      tx.objectStore(store).delete(key);
      return txDone(tx);
    });
  }

  function count(store) {
    if (memory) return Promise.resolve(memory[store].size);
    return withTx(store, 'readonly', function (tx) { return reqP(tx.objectStore(store).count()); });
  }

  /** Последние n ответов — курсором по индексу ts (не загружаем всю историю в память). */
  function lastAnswers(n) {
    if (memory) {
      return Promise.resolve(Array.from(memory.answers.values()).sort(function (a, b) { return a.ts - b.ts; }).slice(-n).map(clone));
    }
    return withTx('answers', 'readonly', function (tx) {
      return new Promise(function (resolve, reject) {
        var out = [];
        var req = tx.objectStore('answers').index('ts').openCursor(null, 'prev');
        req.onsuccess = function () {
          var c = req.result;
          if (c && out.length < n) { out.push(c.value); c.continue(); } else resolve(out.reverse());
        };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  /** Оставить в истории не больше max ответов (самые старые удаляются). */
  function pruneAnswers(max) {
    return count('answers').then(function (total) {
      var extra = total - max;
      if (extra <= 0) return 0;
      if (memory) {
        return memWrite(function () {
          Array.from(memory.answers.values()).sort(function (a, b) { return a.ts - b.ts; }).slice(0, extra)
            .forEach(function (a) { memory.answers.delete(a.id); });
          return extra;
        });
      }
      return withTx('answers', 'readwrite', function (tx) {
        return new Promise(function (resolve, reject) {
          var removed = 0;
          var req = tx.objectStore('answers').index('ts').openCursor();
          req.onsuccess = function () {
            var c = req.result;
            if (c && removed < extra) { c.delete(); removed++; c.continue(); }
          };
          req.onerror = function () { reject(req.error); };
          txDone(tx).then(function () { resolve(removed); }, reject);
        });
      });
    });
  }

  /** Полная замена содержимого всех хранилищ одной транзакцией (всё или ничего). */
  function replaceAll(storesData) {
    if (memory) {
      return memWrite(function () {
        STORE_NAMES.forEach(function (n) {
          memory[n].clear();
          (storesData[n] || []).forEach(function (v) { memPut(n, v); });
        });
      });
    }
    return withTx(STORE_NAMES, 'readwrite', function (tx) {
      STORE_NAMES.forEach(function (n) {
        var os = tx.objectStore(n);
        os.clear();
        (storesData[n] || []).forEach(function (v) { os.put(v); });
      });
      return txDone(tx);
    }, { durability: 'strict' });
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
      // служебная копия перед импортом в файл не попадает (иначе копии вкладываются друг в друга)
      stores.meta = stores.meta.filter(function (m) { return m.key !== 'preImportBackup'; });
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
  function str(v, max) { return typeof v === 'string' ? v.slice(0, max) : ''; }
  function clampNum(v, a, b, d) { return isNum(v) ? Math.min(b, Math.max(a, v)) : d; }
  var VERDICTS = ['great', 'good', 'understood', 'partial', 'awkward', 'miss'];

  // типы служебных значений профиля: строка из backup в числовом поле ломала XP и таймеры
  var META_TYPES = {
    totalXp: 'number', streak: 'number', bestStreak: 'number', skill: 'number', totalAnswers: 'number',
    totalCorrect: 'number', createdAt: 'number', lastExportTs: 'number', lastActiveDate: 'date', levelHintShown: 'string'
  };
  function sanitizeMeta(key, value) {
    var t = META_TYPES[key];
    if (!t) return undefined; // неизвестные ключи не импортируем
    if (t === 'number') {
      if (!isNum(value)) return undefined;
      if (key === 'skill') return Math.min(2, Math.max(-2, value));
      return Math.max(0, value);
    }
    if (t === 'date') return typeof value === 'string' && (value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value)) ? value : undefined;
    return typeof value === 'string' ? value.slice(0, 40) : undefined;
  }

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
      var ref = r.ref && typeof r.ref === 'object' ? {} : null;
      if (ref) Object.keys(r.ref).forEach(function (k) { var v = r.ref[k]; if (isStr(v) || isNum(v)) ref[k] = v; });
      return {
        itemId: r.itemId, count: Math.max(1, r.count), firstTs: num(r.firstTs, Date.now()), lastTs: num(r.lastTs, Date.now()),
        resolved: !!r.resolved, rightStreak: num(r.rightStreak, 0),
        kind: ['vocab', 'turn', 'dlg', 'chat'].indexOf(r.kind) >= 0 ? r.kind : 'vocab', type: str(r.type, 40),
        lastUserAnswer: str(r.lastUserAnswer, 500), expected: str(r.expected, 500), prompt: str(r.prompt, 500), note: str(r.note, 500), ref: ref
      };
    },
    lessons: function (r) {
      if (!isStr(r.id)) return null;
      return { id: r.id, status: 'done', score: clampNum(r.score, 0, 100, 0), completions: num(r.completions, 1), completedAt: num(r.completedAt, 0) };
    },
    dialogues: function (r) {
      if (!isStr(r.id)) return null;
      return {
        id: r.id, kind: ['dialogue', 'talk', 'story', 'chat', 'text'].indexOf(r.kind) >= 0 ? r.kind : 'dialogue',
        bestScore: clampNum(r.bestScore, 0, 100, 0), lastScore: clampNum(r.lastScore, 0, 100, 0),
        naturalness: isNum(r.naturalness) ? r.naturalness : null, completions: num(r.completions, 1), lastTs: num(r.lastTs, 0)
      };
    },
    stats: function (r) {
      if (typeof r.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(r.date)) return null;
      return {
        date: r.date, xp: num(r.xp, 0), reviews: num(r.reviews, 0), newItems: num(r.newItems, 0),
        correct: num(r.correct, 0), wrong: num(r.wrong, 0), minutes: num(r.minutes, 0), dialogues: num(r.dialogues, 0)
      };
    },
    meta: function (r) {
      if (!isStr(r.key) || !('value' in r) || r.key === 'preImportBackup') return null;
      var v = sanitizeMeta(r.key, r.value);
      return v === undefined ? null : { key: r.key, value: v };
    },
    games: function (r) {
      if (!isStr(r.id)) return null;
      return { id: r.id, best: num(r.best, 0), plays: num(r.plays, 0), lastScore: num(r.lastScore, 0), lastTs: num(r.lastTs, 0) };
    },
    chats: function (r) {
      if (!isStr(r.id) || !isStr(r.contactId) || !Array.isArray(r.messages)) return null;
      var msgs = r.messages.filter(function (m) { return m && typeof m === 'object' && typeof m.text === 'string' && (m.from === 'me' || m.from === 'them'); })
        .slice(-500).map(function (m) {
          var out = { from: m.from, text: m.text.slice(0, 1000), ts: num(m.ts, 0) };
          if (typeof m.ru === 'string') out.ru = m.ru.slice(0, 1000);
          if (m.read) out.read = true;
          if (m.system) out.system = true;
          if (isStr(m.ep)) out.ep = m.ep;
          if (isStr(m.node)) out.node = m.node;
          if (m.ev && typeof m.ev === 'object' && VERDICTS.indexOf(m.ev.verdict) >= 0) {
            out.ev = { verdict: m.ev.verdict, correct: !!m.ev.correct, partial: !!m.ev.partial,
              naturalness: clampNum(m.ev.naturalness, 0, 100, 0), note: str(m.ev.note, 500), message: str(m.ev.message, 300) };
          }
          return out;
        });
      return {
        id: r.id, contactId: r.contactId, messages: msgs, nodeId: isStr(r.nodeId) ? r.nodeId : '',
        phase: ['enter', 'reply', 'done'].indexOf(r.phase) >= 0 ? r.phase : 'reply',
        turns: num(r.turns, 0), scoreSum: num(r.scoreSum, 0), done: !!r.done, score: clampNum(r.score, 0, 100, 0),
        completed: !!r.completed, xp: num(r.xp, 0), startedTs: num(r.startedTs, 0), lastTs: num(r.lastTs, 0), readTs: num(r.readTs, 0)
      };
    },
    words: function (r) {
      if (!isStr(r.id) || !isNum(r.due)) return null;
      return {
        id: r.id, due: r.due, box: Math.round(clampNum(r.box, 0, 7, 0)),
        correct: num(r.correct, 0), wrong: num(r.wrong, 0), streak: num(r.streak, 0),
        firstTs: num(r.firstTs, 0), lastTs: num(r.lastTs, 0), learnedTs: num(r.learnedTs, 0)
      };
    }
  };

  // Миграции формата: MIGRATIONS[n] переводит данные версии n в n+1
  var MIGRATIONS = {
    // v1 → v2: появились игры и чаты
    1: function (data) {
      data.stores.games = data.stores.games || [];
      data.stores.chats = data.stores.chats || [];
      return data;
    },
    // v2 → v3: тренажёр словарного запаса
    2: function (data) {
      data.stores.words = data.stores.words || [];
      return data;
    }
  };

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
    lastAnswers: lastAnswers,
    pruneAnswers: pruneAnswers,
    wipe: wipe,
    exportAll: exportAll,
    validateBackup: validateBackup,
    importValidated: importValidated,
    sanitizeMeta: sanitizeMeta,
    META_TYPES: META_TYPES
  };

  EG.db = api;
})(window.EG = window.EG || {});
