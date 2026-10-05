/* tenses/tenses-data.js — содержимое раздела «Таблица времён»: 12 времён английского глагола.
   Только данные, без логики и DOM. Всё лежит в EG.tenses.data — других глобальных имён нет.

   Разметка в английских примерах: [ключевая часть] подсвечивается.
   Поля времени:
     time / aspect — строка и столбец таблицы (past|present|future × simple|continuous|perfect|perfcont);
     ru — суть в двух-трёх словах; when — когда используется (2–3 пункта);
     formula — [+, −, ?]; ex — примеры [английский, перевод]; markers — слова-сигналы;
     vs — главное отличие от похожих времён ({id, text}); pitfall — типичная ошибка;
     tl — схема на линии времени (см. tenses.js); grammar — id урока в разделе «Грамматика» (если есть). */
(function (EG) {
  'use strict';

  var T = EG.tenses = EG.tenses || {};

  var TIMES = [
    { id: 'past', title: 'Прошлое', en: 'Past' },
    { id: 'present', title: 'Настоящее', en: 'Present' },
    { id: 'future', title: 'Будущее', en: 'Future' }
  ];

  // Столбцы таблицы — «вид» действия. Это и есть ключ ко всей системе: смысл столбца одинаков в любой строке.
  var ASPECTS = [
    { id: 'simple', title: 'Simple', ru: 'Факт', idea: 'Просто факт: что бывает, было или будет.', form: 'V' },
    { id: 'continuous', title: 'Continuous', ru: 'Процесс', idea: 'Действие в процессе в конкретный момент.', form: 'be + V-ing' },
    { id: 'perfect', title: 'Perfect', ru: 'Результат', idea: 'Уже сделано к моменту — важен итог.', form: 'have + V3' },
    { id: 'perfcont', title: 'Perfect Continuous', ru: 'Длительность', idea: 'Длилось до момента — важно, как долго.', form: 'have been + V-ing' }
  ];

  var LIST = [

    /* ======================= PRESENT ======================= */

    {
      id: 'present-simple', time: 'present', aspect: 'simple', level: 'A1',
      name: 'Present Simple', ru: 'Обычно, всегда, по расписанию',
      when: ['Привычки и регулярные действия', 'Факты и то, что верно всегда', 'Расписания: поезда, уроки, фильмы'],
      formula: ['V · he / she / it + V-s', "don't / doesn't + V", 'Do / Does + подлежащее + V?'],
      ex: [
        ['She [works] in a bank.', 'Она работает в банке.'],
        ['The train [leaves] at six.', 'Поезд отходит в шесть.'],
        ['[Do] you [drink] coffee?', 'Ты пьёшь кофе?']
      ],
      markers: ['always', 'usually', 'often', 'sometimes', 'never', 'every day'],
      vs: [
        { id: 'present-continuous', text: 'Present Simple — обычно: I work from home. Present Continuous — прямо сейчас или временно: I\'m working from home this week.' }
      ],
      pitfall: 'Не теряйте -s у he / she / it: she works. Но после doesn\'t — без -s: she doesn\'t work.',
      tl: 'habit', grammar: 'present-simple'
    },
    {
      id: 'present-continuous', time: 'present', aspect: 'continuous', level: 'A1',
      name: 'Present Continuous', ru: 'Прямо сейчас, временно',
      when: ['Действие происходит в момент речи', 'Временная ситуация: на этой неделе, в эти дни', 'Договорённость на ближайшее будущее'],
      formula: ['am / is / are + V-ing', 'am / is / are + not + V-ing', 'Am / Is / Are + подлежащее + V-ing?'],
      ex: [
        ['Sorry, I[\'m talking] on the phone.', 'Извини, я говорю по телефону.'],
        ['She [is staying] with friends this week.', 'На этой неделе она живёт у друзей.'],
        ['We [are meeting] Tom tomorrow.', 'Мы встречаемся с Томом завтра (уже договорились).']
      ],
      markers: ['now', 'right now', 'at the moment', 'today', 'this week', 'Look!'],
      vs: [
        { id: 'present-simple', text: 'Present Continuous — процесс сейчас или временно: He\'s driving. Present Simple — обычно, вообще: He drives to work.' },
        { id: 'future-simple', text: 'Present Continuous о будущем — уже договорились: I\'m seeing the doctor at 5. will — решаю сейчас: I\'ll call the doctor.' }
      ],
      pitfall: 'Глаголы состояния (know, like, want, need, believe, understand) обычно не ставят в -ing: I know, а не I\'m knowing.',
      tl: 'span', grammar: 'present-continuous'
    },
    {
      id: 'present-perfect', time: 'present', aspect: 'perfect', level: 'A2',
      name: 'Present Perfect', ru: 'Уже сделано — важен результат',
      when: ['Результат сейчас, а когда именно — неважно', 'Опыт «за жизнь»: ever, never', 'Состояние с прошлого до сейчас: for, since'],
      formula: ['have / has + V3', "haven't / hasn't + V3", 'Have / Has + подлежащее + V3?'],
      ex: [
        ['I [have lost] my keys.', 'Я потерял ключи (и сейчас их нет).'],
        ['[Have] you ever [been] to London?', 'Ты когда-нибудь был в Лондоне?'],
        ['We [have known] each other for years.', 'Мы знаем друг друга много лет.']
      ],
      markers: ['already', 'just', 'yet', 'ever', 'never', 'since', 'for', 'so far'],
      vs: [
        { id: 'past-simple', text: 'Present Perfect — важен результат сейчас, время не названо: I\'ve lost my keys. Past Simple — названо, когда: I lost my keys yesterday.' },
        { id: 'present-perfect-continuous', text: 'Present Perfect — итог, сколько сделано: I\'ve written ten emails. Perfect Continuous — процесс, как долго: I\'ve been writing emails all morning.' }
      ],
      pitfall: 'С точным временем в прошлом (yesterday, last year, ago, in 2020) нельзя: I saw him yesterday, а не I have seen him yesterday.',
      tl: 'upto', grammar: 'present-perfect'
    },
    {
      id: 'present-perfect-continuous', time: 'present', aspect: 'perfcont', level: 'B1',
      name: 'Present Perfect Continuous', ru: 'Длится до сих пор — как долго',
      when: ['Действие началось в прошлом и длится до сих пор', 'Отвечает на вопрос «как долго?»', 'Недавний процесс, следы которого видны сейчас'],
      formula: ['have / has been + V-ing', "haven't / hasn't been + V-ing", 'Have / Has + подлежащее + been + V-ing?'],
      ex: [
        ['I [have been waiting] for an hour.', 'Я жду уже час.'],
        ['She [has been learning] English since May.', 'Она учит английский с мая.'],
        ['You look tired. [Have] you [been working] late?', 'Ты выглядишь уставшим. Работал допоздна?']
      ],
      markers: ['for', 'since', 'how long', 'all day', 'lately', 'recently'],
      vs: [
        { id: 'present-perfect', text: 'Perfect Continuous — процесс и его длительность: I\'ve been painting the room (руки в краске). Present Perfect — готовый результат: I\'ve painted the room (комната готова).' },
        { id: 'present-continuous', text: '«Я жду уже час» — по-русски настоящее, а по-английски с for / since нужен Perfect Continuous: I have been waiting, а не I am waiting for an hour.' }
      ],
      pitfall: 'Русское «уже час», «с утра», «третий год» почти всегда подсказывает это время, а не Present Continuous.',
      tl: 'spanUpto', grammar: 'present-perfect-continuous'
    },

    /* ======================= PAST ======================= */

    {
      id: 'past-simple', time: 'past', aspect: 'simple', level: 'A1',
      name: 'Past Simple', ru: 'Было и закончилось',
      when: ['Законченное действие в прошлом, обычно с указанием времени', 'Цепочка событий: сначала одно, потом другое', 'Прошлые привычки'],
      formula: ['V-ed / 2-я форма', "didn't + V", 'Did + подлежащее + V?'],
      ex: [
        ['I [saw] him yesterday.', 'Я видел его вчера.'],
        ['She [didn\'t call] me.', 'Она мне не позвонила.'],
        ['[Did] you [like] the film?', 'Тебе понравился фильм?']
      ],
      markers: ['yesterday', 'last week', 'ago', 'in 2020', 'when'],
      vs: [
        { id: 'present-perfect', text: 'Past Simple — когда это было (yesterday, in May): I lost my keys yesterday. Present Perfect — важен результат сейчас: I\'ve lost my keys (и их нет).' },
        { id: 'past-continuous', text: 'Past Simple — короткое событие: the phone rang. Past Continuous — фон, процесс в тот момент: I was cooking.' }
      ],
      pitfall: 'После did глагол в начальной форме: Did you go? — а не Did you went? То же с didn\'t: I didn\'t see.',
      tl: 'point', grammar: 'past-simple'
    },
    {
      id: 'past-continuous', time: 'past', aspect: 'continuous', level: 'A2',
      name: 'Past Continuous', ru: 'Был в процессе в тот момент',
      when: ['Процесс в определённый момент прошлого', 'Фон, который прервало другое действие', 'Два параллельных процесса (while)'],
      formula: ['was / were + V-ing', "wasn't / weren't + V-ing", 'Was / Were + подлежащее + V-ing?'],
      ex: [
        ['At 8 pm I [was having] dinner.', 'В 8 вечера я ужинал.'],
        ['I [was driving] when you called.', 'Я был за рулём, когда ты позвонил.'],
        ['What [were] you [doing] at ten?', 'Что ты делал в десять?']
      ],
      markers: ['at 5 o\'clock yesterday', 'while', 'when', 'all evening'],
      vs: [
        { id: 'past-simple', text: 'Past Continuous — длинный фон: I was cooking. Past Simple — короткое событие, которое его прервало: when the phone rang.' }
      ],
      pitfall: 'Русское «делал» бывает и тем и другим: процесс в момент — was doing, факт или результат — did.',
      tl: 'span', grammar: 'past-continuous'
    },
    {
      id: 'past-perfect', time: 'past', aspect: 'perfect', level: 'B1',
      name: 'Past Perfect', ru: 'Случилось раньше другого прошлого',
      when: ['Одно действие в прошлом произошло раньше другого', 'Результат к моменту в прошлом', '«Предпрошедшее» в рассказах и косвенной речи'],
      formula: ['had + V3', "hadn't + V3", 'Had + подлежащее + V3?'],
      ex: [
        ['When I arrived, the film [had started].', 'Когда я пришёл, фильм уже начался.'],
        ['I [hadn\'t seen] snow before that trip.', 'До той поездки я ни разу не видел снега.'],
        ['[Had] you [met] him before?', 'Ты встречал его раньше?']
      ],
      markers: ['before', 'already', 'by the time', 'after', 'never … before'],
      vs: [
        { id: 'past-simple', text: 'Past Simple — события по порядку: When I arrived, the film started (пришёл → потом начался). Past Perfect — одно раньше другого: the film had started (начался до прихода).' },
        { id: 'past-perfect-continuous', text: 'Past Perfect — итог к моменту: She had run 10 km. Perfect Continuous — как долго длилось: She had been running for an hour.' }
      ],
      pitfall: 'Не ставьте Past Perfect везде, где речь о прошлом, — только когда важно, что одно случилось раньше другого.',
      tl: 'upto', grammar: 'past-perfect'
    },
    {
      id: 'past-perfect-continuous', time: 'past', aspect: 'perfcont', level: 'B2',
      name: 'Past Perfect Continuous', ru: 'Длилось до момента в прошлом',
      when: ['Действие длилось какое-то время до момента в прошлом', 'Объясняет причину состояния в прошлом'],
      formula: ['had been + V-ing', "hadn't been + V-ing", 'Had + подлежащее + been + V-ing?'],
      ex: [
        ['She [had been working] there for ten years before she left.', 'Она проработала там десять лет, прежде чем ушла.'],
        ['His eyes were red: he [had been crying].', 'У него были красные глаза: он плакал.'],
        ['How long [had] you [been waiting] when the bus came?', 'Сколько ты прождал, когда пришёл автобус?']
      ],
      markers: ['for', 'since', 'how long', 'before', 'by the time'],
      vs: [
        { id: 'past-perfect', text: 'Perfect Continuous — процесс и его длительность: had been running for an hour. Past Perfect — завершённость, итог: had run 10 km.' },
        { id: 'present-perfect-continuous', text: 'Это тот же Present Perfect Continuous, только точка отсчёта — не «сейчас», а момент в прошлом.' }
      ],
      pitfall: 'Нужна точка отсчёта в прошлом (before she left, when the bus came). Без неё обычно хватает Past Simple или Past Continuous.',
      tl: 'spanUpto', grammar: null
    },

    /* ======================= FUTURE ======================= */

    {
      id: 'future-simple', time: 'future', aspect: 'simple', level: 'A1',
      name: 'Future Simple', ru: 'Решаю сейчас, прогноз, обещание',
      when: ['Решение, принятое в момент речи', 'Прогноз и мнение: I think…, probably', 'Обещания, предложения, просьбы'],
      formula: ['will + V', "won't + V", 'Will + подлежащее + V?'],
      ex: [
        ['OK, I[\'ll call] you back.', 'Хорошо, я тебе перезвоню.'],
        ['I think it [will rain] tomorrow.', 'Думаю, завтра будет дождь.'],
        ['[Will] you [help] me?', 'Ты мне поможешь?']
      ],
      markers: ['tomorrow', 'next week', 'I think', 'probably', 'soon'],
      vs: [
        { id: 'present-continuous', text: 'will — решаю прямо сейчас: I\'ll get it! be going to — уже решил заранее: I\'m going to buy a car. Present Continuous — договорился: I\'m meeting Ann at 6.' },
        { id: 'future-continuous', text: 'Future Simple — одно действие или решение: I\'ll call you at 9. Future Continuous — буду в процессе в этот момент: At 9 I\'ll be working.' }
      ],
      pitfall: 'После if / when в значении будущего ставится Present Simple: If it rains, I\'ll stay home — а не If it will rain.',
      tl: 'point', grammar: 'future-simple'
    },
    {
      id: 'future-continuous', time: 'future', aspect: 'continuous', level: 'B1',
      name: 'Future Continuous', ru: 'Буду в процессе в тот момент',
      when: ['Процесс в определённый момент будущего', 'То, что произойдёт «само собой», по ходу дел', 'Вежливо узнать о чужих планах'],
      formula: ['will be + V-ing', "won't be + V-ing", 'Will + подлежащее + be + V-ing?'],
      ex: [
        ['This time tomorrow I[\'ll be flying] to Rome.', 'Завтра в это время я буду лететь в Рим.'],
        ['Don\'t call at eight — I[\'ll be having] dinner.', 'Не звони в восемь — я буду ужинать.'],
        ['[Will] you [be using] the car tonight?', 'Ты будешь пользоваться машиной вечером?']
      ],
      markers: ['this time tomorrow', 'at 5 pm tomorrow', 'all day tomorrow'],
      vs: [
        { id: 'future-simple', text: 'Future Continuous — буду в процессе: At 9 I\'ll be working. Future Simple — одно действие: I\'ll call you at 9.' },
        { id: 'future-perfect', text: 'Future Continuous — в этот момент ещё в процессе: At 6 I\'ll be writing the report. Future Perfect — к этому моменту уже готово: By 6 I\'ll have written it.' }
      ],
      pitfall: 'Вопрос Will you be using…? звучит вежливее, чем Will you use…?, — это вопрос о планах, а не просьба.',
      tl: 'span', grammar: 'future-continuous'
    },
    {
      id: 'future-perfect', time: 'future', aspect: 'perfect', level: 'B2',
      name: 'Future Perfect', ru: 'Будет готово к моменту',
      when: ['Действие будет завершено к моменту в будущем', 'Подсчёт итога к сроку'],
      formula: ['will have + V3', "won't have + V3", 'Will + подлежащее + have + V3?'],
      ex: [
        ['I [will have finished] the report by Friday.', 'Я закончу отчёт к пятнице.'],
        ['By 2030 they [will have built] the bridge.', 'К 2030 году мост уже построят.'],
        ['[Will] you [have finished] by six?', 'Ты закончишь к шести?']
      ],
      markers: ['by Friday', 'by then', 'by the time', 'before'],
      vs: [
        { id: 'future-continuous', text: 'Future Perfect — к моменту уже сделано: By 6 I\'ll have finished. Future Continuous — в этот момент ещё в процессе: At 6 I\'ll be working.' },
        { id: 'future-perfect-continuous', text: 'Future Perfect — итог: I\'ll have read 50 pages. Perfect Continuous — сколько времени: I\'ll have been reading for two hours.' }
      ],
      pitfall: 'Главный сигнал — by («к»): by Monday, by the end of the year. Без «к сроку» обычно хватает will.',
      tl: 'upto', grammar: 'future-perfect'
    },
    {
      id: 'future-perfect-continuous', time: 'future', aspect: 'perfcont', level: 'C1',
      name: 'Future Perfect Continuous', ru: 'Сколько будет длиться к моменту',
      when: ['Сколько времени действие будет длиться к моменту в будущем', 'В основном «юбилейные» подсчёты: пять лет как…'],
      formula: ['will have been + V-ing', "won't have been + V-ing", 'Will + подлежащее + have been + V-ing?'],
      ex: [
        ['By June I [will have been working] here for five years.', 'В июне будет пять лет, как я здесь работаю.'],
        ['When you arrive, we[\'ll have been waiting] for two hours.', 'К твоему приезду мы будем ждать уже два часа.'],
        ['How long [will] you [have been living] here by then?', 'Сколько ты к тому времени здесь проживёшь?']
      ],
      markers: ['by … for …', 'by the time … for …', 'how long'],
      vs: [
        { id: 'future-perfect', text: 'Perfect Continuous — длительность к моменту: will have been running for an hour. Future Perfect — итог: will have run 10 km.' }
      ],
      pitfall: 'В живой речи встречается редко — достаточно узнавать его. Подсказка: by и for в одном предложении.',
      tl: 'spanUpto', grammar: null
    }
  ];

  // Порядок карточек «Дальше / Назад» — по таблице: строка за строкой.
  var TIME_ORDER = { past: 0, present: 1, future: 2 };
  var ASPECT_ORDER = { simple: 0, continuous: 1, perfect: 2, perfcont: 3 };
  LIST.sort(function (a, b) { return TIME_ORDER[a.time] - TIME_ORDER[b.time] || ASPECT_ORDER[a.aspect] - ASPECT_ORDER[b.aspect]; });

  var byId = Object.create(null);
  LIST.forEach(function (t) { byId[t.id] = t; });

  // «Как выбрать время за 3 вопроса» — алгоритм выбора вместо зубрёжки названий.
  var STEPS = [
    { q: 'Когда?', a: 'Прошлое, настоящее или будущее — это строка таблицы.' },
    { q: 'В процессе в конкретный момент?', a: 'Да → Continuous («был/буду занят этим»).' },
    { q: 'Важен итог или «уже» к какому-то моменту?', a: 'Да → Perfect. А если важно, как долго длилось, → Perfect Continuous.' },
    { q: 'Ничего из этого?', a: 'Simple — просто факт.' }
  ];

  T.data = { times: TIMES, aspects: ASPECTS, list: LIST, byId: byId, steps: STEPS };
})(window.EG = window.EG || {});
