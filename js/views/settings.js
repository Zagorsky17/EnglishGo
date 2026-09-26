/* views/settings.js — настройки, экспорт/импорт прогресса, сброс */
(function (EG) {
  'use strict';

  var h = EG.ui.h, icon = EG.ui.icon;
  EG.views = EG.views || {};

  var MAX_FILE = 50 * 1024 * 1024;

  function field(label, control, hint) {
    return h('label', { class: 'field' }, h('span', { class: 'field-label' }, label), control, hint ? h('span', { class: 'muted small' }, hint) : null);
  }

  function segmented(key, options, onChange) {
    var cur = EG.storage.get(key);
    var wrap = h('div', { class: 'segmented', role: 'radiogroup' });
    options.forEach(function (o) {
      var b = h('button', { type: 'button', class: o[0] === cur ? 'active' : '', role: 'radio', 'aria-checked': o[0] === cur ? 'true' : 'false', onclick: function () {
        EG.storage.set(key, o[0]);
        wrap.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-checked', 'false'); });
        b.classList.add('active'); b.setAttribute('aria-checked', 'true');
        if (onChange) onChange(o[0]);
      } }, o[1]);
      wrap.appendChild(b);
    });
    return wrap;
  }

  function toggle(key, label, onChange, hint) {
    var input = h('input', { type: 'checkbox', checked: EG.storage.get(key) ? true : null, onchange: function () { EG.storage.set(key, input.checked); if (onChange) onChange(input.checked); } });
    return h('label', { class: 'toggle' }, input, h('span', { class: 'toggle-ui' }),
      h('span', { class: 'toggle-text' }, label, hint ? h('span', { class: 'muted small' }, hint) : null));
  }

  function numberInput(key, min, max, step) {
    var i = h('input', { class: 'input', type: 'number', min: min, max: max, step: step || 1, value: EG.storage.get(key),
      onchange: function () { EG.storage.set(key, Number(i.value)); i.value = EG.storage.get(key); } });
    return i;
  }

  function download(filename, text) {
    var blob = new Blob([text], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = h('a', { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1000);
  }

  function doExport() {
    return EG.db.exportAll().then(function (data) {
      download('english-app-backup.json', JSON.stringify(data, null, 1));
      EG.ui.toast('Резервная копия сохранена', 'good');
    }).catch(function (e) { EG.ui.toast('Не удалось экспортировать: ' + e.message, 'bad'); });
  }

  function doImport(file) {
    if (!file) return;
    if (file.size > MAX_FILE) { EG.ui.toast('Файл слишком большой', 'bad'); return; }
    var reader = new FileReader();
    reader.onerror = function () { EG.ui.toast('Не удалось прочитать файл', 'bad'); };
    reader.onload = function () {
      var obj;
      try { obj = JSON.parse(reader.result); }
      catch (e) {
        EG.ui.modal({ title: 'Файл повреждён', body: h('p', null, 'Это не корректный JSON: ' + e.message + '. Текущий прогресс не изменён.') });
        return;
      }
      var res = EG.db.validateBackup(obj);
      if (!res.ok) {
        EG.ui.modal({ title: 'Файл не подходит', body: h('div', null,
          h('p', null, 'Импорт отменён, текущий прогресс не изменён.'),
          h('ul', { class: 'plain errors' }, res.errors.map(function (e) { return h('li', null, e); }))) });
        return;
      }
      var s = res.summary;
      EG.ui.modal({
        title: 'Восстановить прогресс?',
        body: h('div', null,
          h('p', null, 'Текущие данные будут полностью заменены данными из файла' + (res.exportedAt ? ' от ' + new Date(res.exportedAt).toLocaleString('ru-RU') : '') + '.'),
          h('ul', { class: 'plain' },
            h('li', null, 'Карточек SRS: ', h('strong', null, s.cards)),
            h('li', null, 'Ответов в истории: ', h('strong', null, s.answers)),
            h('li', null, 'Ошибок: ', h('strong', null, s.mistakes)),
            h('li', null, 'Уроков и диалогов: ', h('strong', null, s.lessons + s.dialogues)),
            h('li', null, 'Дней статистики: ', h('strong', null, s.stats)),
            h('li', null, 'Переписок и игр: ', h('strong', null, (s.chats || 0) + ' / ' + (s.games || 0)))),
          res.warnings.length ? h('details', null, h('summary', null, 'Предупреждения (' + res.warnings.length + ')'),
            h('ul', { class: 'plain small' }, res.warnings.map(function (w) { return h('li', null, w); }))) : null),
        actions: [{ label: 'Отмена', value: false }, { label: 'Восстановить', value: true, primary: true }]
      }).then(function (ok) {
        if (!ok) return;
        EG.db.importValidated(res)
          .then(function () { return EG.state.load(); })
          .then(function () {
            EG.app.applyTheme();
            EG.ui.toast('Прогресс восстановлен', 'good');
            EG.router.go('home');
          })
          .catch(function (e) { EG.ui.toast('Ошибка импорта: ' + e.message + '. Данные не изменены.', 'bad'); });
      });
    };
    reader.readAsText(file);
  }

  EG.views.settings = function (root) {
    var fileInput = h('input', { type: 'file', accept: 'application/json,.json', class: 'visually-hidden', onchange: function () { doImport(fileInput.files[0]); fileInput.value = ''; } });

    var voices = EG.ui.voices();
    var voiceSelect = h('select', { class: 'input', onchange: function () { EG.storage.set('voice', voiceSelect.value); } },
      h('option', { value: '' }, 'Автоматически'),
      voices.map(function (v) { return h('option', { value: v.name }, v.name + ' (' + v.lang + ')' + (v.localService ? '' : ' · онлайн')); }));
    voiceSelect.value = EG.storage.get('voice');
    var rate = h('input', { type: 'range', min: 0.6, max: 1.3, step: 0.05, value: EG.storage.get('rate'), onchange: function () { EG.storage.set('rate', Number(rate.value)); } });
    var testVoice = h('button', { class: 'btn ghost sm', type: 'button', onclick: function () { EG.ui.speak('Hi! How are you doing today?'); } }, icon('speaker'), 'Проверить голос');

    var nameInput = h('input', { class: 'input', type: 'text', maxlength: 30, value: EG.storage.get('name'), placeholder: 'Как к вам обращаться', onchange: function () { EG.storage.set('name', nameInput.value.trim()); } });

    root.append(
      EG.ui.pageHead('Настройки'),
      h('div', { class: 'grid-2' },
        h('section', { class: 'card' },
          h('h3', { class: 'card-title' }, 'Обучение'),
          field('Ваш уровень', segmented('level', EG.LEVELS.map(function (l) { return [l, l]; })),
            'A1 — начальный · A2 — элементарный · B1 — средний · B2 — выше среднего · C1 — продвинутый. Материал дополнительно подстраивается под ваши ответы.'),
          field('Цель в день, XP', numberInput('dailyGoal', 10, 500, 10), '≈10 XP за верный ответ. 60 XP — около 10 минут.'),
          field('Новых выражений в день', numberInput('newPerDay', 0, 40), 'Оптимально 5–12: новое без перегрузки повторений.'),
          toggle('talkHints', 'Показывать задачу (по-русски) в «Разговоре» и в чатах'),
          toggle('chatFeedback', 'Чаты: показывать разбор ответа сразу', null, 'Иначе разбор открывается по нажатию на значок у вашего сообщения — так переписка больше похожа на настоящую.'),
          field('Имя', nameInput)),
        h('section', { class: 'card' },
          h('h3', { class: 'card-title' }, 'Интерфейс и звук'),
          field('Тема', segmented('theme', [['auto', 'Системная'], ['light', 'Светлая'], ['dark', 'Тёмная']], function () { EG.app.applyTheme(); })),
          toggle('compact', 'Компактный режим', function () { EG.app.applyTheme(); }),
          toggle('speech', 'Озвучка английских фраз', function () { EG.router.refresh(); }),
          voices.length && EG.storage.get('speech') ? toggle('autoSpeak', 'Автоматически произносить фразы', null,
            'Реплики собеседника, новые выражения и задания на аудирование будут звучать сразу при появлении. Если выключено — только по кнопке с динамиком.') : null,
          voices.length ? h('div', null,
            field('Голос', voiceSelect, 'Голоса берутся из системы и работают офлайн (кроме помеченных «онлайн»).'),
            field('Скорость речи', rate),
            testVoice) :
            h('p', { class: 'notice warn small' }, icon('speaker'), 'В системе нет английских голосов для озвучки. Задания на аудирование будут показывать фразу на несколько секунд.'))),
      h('section', { class: 'card' },
        h('h3', { class: 'card-title' }, 'Резервное копирование'),
        h('p', { class: 'muted' }, 'Весь прогресс хранится в браузере (IndexedDB) на этом устройстве. Сохраните копию, чтобы перенести его на другое устройство или не потерять при очистке браузера.'),
        !EG.db.persistent ? h('p', { class: 'notice warn' }, icon('mistakes'), 'IndexedDB недоступна: данные живут только до закрытия вкладки. Обязательно сделайте экспорт.') : null,
        h('div', { class: 'row gap wrap' },
          h('button', { class: 'btn primary', onclick: doExport }, icon('download'), 'Экспорт прогресса'),
          h('button', { class: 'btn ghost', onclick: function () { fileInput.click(); } }, icon('upload'), 'Импорт прогресса'),
          fileInput),
        h('p', { class: 'muted small' }, 'Файл english-app-backup.json. При импорте проверяются формат, версия и каждая запись — повреждённый файл не затронет текущие данные.')),
      h('section', { class: 'card danger-zone' },
        h('h3', { class: 'card-title' }, 'Сброс'),
        h('p', { class: 'muted' }, 'Удалит весь прогресс: карточки, историю, ошибки, статистику. Настройки сохранятся.'),
        h('button', { class: 'btn danger', onclick: function () {
          EG.ui.confirm('Сбросить весь прогресс?', 'Это действие нельзя отменить. Рекомендуем сначала сделать экспорт.', 'Сбросить', true).then(function (ok) {
            if (!ok) return;
            EG.db.wipe().then(function () { return EG.state.load(); }).then(function () { EG.ui.toast('Прогресс сброшен'); EG.router.go('home'); });
          });
        } }, icon('trash'), 'Сбросить прогресс')),
      h('p', { class: 'muted small center' }, 'EnglishGo · работает полностью офлайн · формат данных v' + EG.db.SCHEMA_VERSION));
  };
})(window.EG = window.EG || {});
