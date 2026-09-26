/* data/vocabulary.js — слова и выражения.
   Формат: V(уровень, тип, регистр, en, ru, пример, перевод примера, когда уместно, доп.)
   тип: p — фраза, w — слово, i — идиома, c — разговорная форма, v — фразовый глагол, k — конструкция
   регистр: c — разговорный, n — нейтральный, f — формальный
   доп.: { cue: реплика, на которую это ответ, cueRu, alt: [другие варианты] }
   Важно: пример должен содержать выражение дословно (для упражнений на контекст). */
(function (EG) {
  'use strict';

  var D = EG.data = EG.data || {};
  var TYPES = { p: 'phrase', w: 'word', i: 'idiom', c: 'contraction', v: 'phrasal', k: 'chunk' };
  var REGS = { c: 'casual', n: 'neutral', f: 'formal' };
  var list = [];
  var topic = '';

  function slug(s) {
    return String(s).toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function T(t) { topic = t; }

  function V(level, type, reg, en, ru, ex, exRu, usage, extra) {
    var item = {
      id: slug(en), en: en, ru: ru, type: TYPES[type] || type, register: REGS[reg] || reg,
      level: level, topic: topic, example: ex, exampleRu: exRu, usage: usage, order: list.length
    };
    if (extra) {
      if (extra.cue) { item.cue = extra.cue; item.cueRu = extra.cueRu || ''; }
      if (extra.alt) item.alt = extra.alt;
    }
    list.push(item);
  }

  /* ===================== Знакомство и приветствия ===================== */
  T('greetings');
  V('A1', 'p', 'c', "How's it going?", 'Как дела?', "Hey Tom! How's it going?", 'Привет, Том! Как дела?',
    'Самый частый способ спросить «как дела» у друзей и коллег. Это приветствие, а не настоящий вопрос: отвечают коротко — Good, thanks! / Not bad.');
  V('A1', 'p', 'n', 'Nice to meet you.', 'Приятно познакомиться.', "Hi, I'm Alex. Nice to meet you.", 'Привет, я Алекс. Приятно познакомиться.',
    'Говорят при первом знакомстве. При прощании с новым знакомым — Nice meeting you.', { cue: "Hi, I'm Sarah.", cueRu: 'Привет, я Сара.', alt: ['Nice to meet you too', 'Pleased to meet you'] });
  V('A1', 'p', 'c', 'Not bad, thanks.', 'Неплохо, спасибо.', "How's it going? — Not bad, thanks. You?", 'Как дела? — Неплохо, спасибо. А у тебя?',
    'Типичный ответ на How are you? / How\'s it going? Хорошо добавить встречный вопрос: You? / And you?', { cue: "How's it going?", cueRu: 'Как дела?', alt: ['Pretty good, thanks', 'Good, thanks'] });
  V('A1', 'p', 'n', 'What do you do?', 'Кем вы работаете?', "So, what do you do? — I'm a designer.", 'Так чем ты занимаешься? — Я дизайнер.',
    'Естественный вопрос о работе. «What is your job?» звучит как анкета — носители так почти не говорят.');
  V('A1', 'p', 'n', 'Where are you from?', 'Откуда вы?', "Where are you from? — I'm from Russia, from Kazan.", 'Откуда вы? — Я из России, из Казани.',
    'Один из первых вопросов при знакомстве в путешествии. Ответ: I\'m from… / Originally from…');
  V('A1', 'p', 'c', 'See you later!', 'Увидимся!', "I've got to go. See you later!", 'Мне пора. Увидимся!',
    'Дружеское прощание, даже если вы не знаете, когда увидитесь снова. Короче — See ya! / Later!', { cue: 'I have to go now.', cueRu: 'Мне нужно идти.', alt: ['See you', 'See ya'] });
  V('A1', 'p', 'n', 'Good to see you!', 'Рад тебя видеть!', 'Mike! Good to see you! How have you been?', 'Майк! Рад тебя видеть! Как ты?',
    'Для знакомых. С новым человеком — Nice to meet you, а не Good to see you.', { cue: 'Hi! Long time no see!', cueRu: 'Привет! Сто лет не виделись!', alt: ['Great to see you', 'Nice to see you'] });
  V('A1', 'p', 'n', 'Take care!', 'Береги себя! / Всего хорошего!', 'Okay, bye! Take care!', 'Ну пока! Береги себя!',
    'Тёплое прощание — с друзьями, коллегами, даже с кассиром. Звучит заботливо, но не слишком лично.', { cue: 'Bye! See you next week.', cueRu: 'Пока! Увидимся на следующей неделе.' });
  V('A2', 'p', 'n', 'How have you been?', 'Как ты (всё это время)?', 'Good to see you! How have you been?', 'Рад тебя видеть! Как поживаешь?',
    'Когда давно не виделись. Отвечают в Present Perfect: I\'ve been good / busy / great.');
  V('A2', 'p', 'c', 'Long time no see!', 'Сто лет не виделись!', 'Long time no see! You look great.', 'Сто лет не виделись! Отлично выглядишь.',
    'Дружеское восклицание при встрече после долгого перерыва. Грамматически «неправильное», но абсолютно естественное.');
  V('A2', 'p', 'n', "I've been good.", 'У меня всё хорошо.', "How have you been? — I've been good, just busy with work.", 'Как ты? — Всё хорошо, просто много работы.',
    'Ответ на How have you been? — отвечаем той же формой (have been).', { cue: 'How have you been?', cueRu: 'Как ты (всё это время)?', alt: ["I've been great", "I've been busy"] });
  V('A2', 'k', 'n', 'This is my friend', 'Это мой друг / моя подруга (представляем)', 'Hi guys! This is my friend Kate.', 'Привет, ребята! Это моя подруга Кейт.',
    'Так представляют одного человека другому. Не «He is my friend» — при знакомстве говорят This is…');
  V('B1', 'p', 'n', 'What brings you here?', 'Что привело вас сюда?', 'So, what brings you here? Work or vacation?', 'Так что тебя сюда привело? Работа или отдых?',
    'Вежливый способ спросить о цели визита — в поездке, на конференции, на вечеринке.');
  V('B1', 'p', 'n', "I don't think we've met.", 'Кажется, мы не знакомы.', "Hi, I don't think we've met. I'm Dan.", 'Привет, кажется, мы не знакомы. Я Дэн.',
    'Мягкий способ самому начать знакомство на вечеринке или на работе. Сразу после — назовите себя.');
  V('B1', 'p', 'n', "I've heard a lot about you.", 'Много о вас слышал(а).', "Oh, you're Lisa! I've heard a lot about you.", 'О, ты Лиза! Я много о тебе слышал.',
    'Комплимент при знакомстве с другом/родственником знакомого. Подразумевается — хорошего.', { cue: "Hi, I'm Lisa, Tom's sister.", cueRu: 'Привет, я Лиза, сестра Тома.' });
  V('B1', 'p', 'n', 'It was nice talking to you.', 'Было приятно поговорить.', 'Well, I should get going. It was nice talking to you.', 'Что ж, мне пора. Было приятно поговорить.',
    'Вежливо завершает разговор с новым знакомым или коллегой.', { cue: "I'd better go, my bus is here.", cueRu: 'Мне пора, мой автобус пришёл.', alt: ['Nice talking to you', 'It was great talking to you'] });
  V('B1', 'p', 'c', "I'd better get going.", 'Мне пора.', "Oh, it's late. I'd better get going.", 'Ой, уже поздно. Мне пора.',
    'Естественный способ закончить встречу. Звучит мягче, чем I must go.', { alt: ['I should get going', "I'd better go"] });
  V('B2', 'p', 'c', 'Fancy seeing you here!', 'Вот так встреча!', 'Fancy seeing you here! Do you shop here too?', 'Вот так встреча! Ты тоже здесь закупаешься?',
    'Шутливое восклицание при неожиданной встрече со знакомым. Особенно популярно в британском английском.');
  V('B2', 'p', 'n', "Let's keep in touch.", 'Давай будем на связи.', "It was great to catch up. Let's keep in touch.", 'Было здорово пообщаться. Давай не теряться.',
    'Говорят при прощании с человеком, с которым хотите продолжить общение.', { cue: 'It was so good to see you again!', cueRu: 'Так здорово было снова увидеться!', alt: ["Let's stay in touch"] });
  V('C1', 'p', 'f', "I don't believe we've been introduced.", 'Кажется, нас не представили друг другу.', "Excuse me, I don't believe we've been introduced. I'm Helen Parker.", 'Простите, кажется, нас не представили. Я Хелен Паркер.',
    'Формальный вариант «мы не знакомы» — на деловом мероприятии, приёме, конференции.');

  /* ===================== Small talk ===================== */
  T('smalltalk');
  V('A1', 'p', 'n', 'Nice weather today', 'Хорошая сегодня погода', "Nice weather today, isn't it?", 'Хорошая сегодня погода, правда?',
    'Классика small talk: погода — безопасная тема с незнакомыми, соседями, коллегами. Хвостик isn\'t it? приглашает к ответу.');
  V('A1', 'p', 'n', 'How was your weekend?', 'Как прошли выходные?', 'Morning! How was your weekend?', 'Доброе утро! Как выходные?',
    'Стандартное начало разговора с коллегами в понедельник. Ответ короткий + деталь: It was great, we went hiking.');
  V('A1', 'p', 'n', 'It was great, thanks.', 'Было отлично, спасибо.', 'How was your weekend? — It was great, thanks. We went to the lake.', 'Как выходные? — Отлично, спасибо. Мы ездили на озеро.',
    'Ответ на вопрос о прошедшем событии. Добавьте одну деталь — так разговор продолжится.', { cue: 'How was your weekend?', cueRu: 'Как прошли выходные?', alt: ['It was good, thanks', 'It was nice, thanks'] });
  V('A2', 'p', 'c', 'What are you up to?', 'Чем занимаешься? / Что делаешь?', 'Hey, what are you up to this weekend?', 'Эй, что делаешь на выходных?',
    'Разговорный вопрос о текущих делах или планах. Отвечают: Not much / Just working.');
  V('A2', 'p', 'n', 'Any plans for the weekend?', 'Есть планы на выходные?', 'Any plans for the weekend? — Not really, just relaxing.', 'Есть планы на выходные? — Не особо, просто отдыхаю.',
    'Типичный вопрос в пятницу. Сокращённая форма (без Do you have) звучит естественнее.');
  V('A2', 'p', 'c', 'Not really.', 'Не особо.', 'Any plans for the weekend? — Not really. Maybe a movie.', 'Есть планы на выходные? — Не особо. Может, кино.',
    'Мягкое «нет». Звучит дружелюбнее, чем просто No.', { cue: 'Any plans for the weekend?', cueRu: 'Есть планы на выходные?' });
  V('A2', 'p', 'c', "It's freezing!", 'Жутко холодно!', "Close the window, it's freezing!", 'Закрой окно, жутко холодно!',
    'Эмоционально о холоде. Носители редко говорят It is very cold — используют сильные слова: freezing, boiling.');
  V('B1', 'p', 'c', 'Crazy weather, huh?', 'Странная погода, да?', 'Sun in the morning and snow in the afternoon. Crazy weather, huh?', 'Утром солнце, днём снег. Странная погода, да?',
    'Лёгкий способ заговорить с незнакомцем в лифте или на остановке. huh? = «да?» в разговорной речи.');
  V('B1', 'p', 'n', 'Have you been here before?', 'Вы здесь уже бывали?', 'Have you been here before? The pasta is amazing.', 'Вы здесь уже бывали? Паста потрясающая.',
    'Отличный вопрос для начала разговора в ресторане, в городе, на мероприятии.');
  V('B1', 'k', 'n', 'How do you know', 'Откуда вы знаете (хозяина, друга)?', 'So, how do you know Mark? — We went to university together.', 'Так ты откуда знаешь Марка? — Мы вместе учились в университете.',
    'Лучший вопрос для знакомства на вечеринке: у всех гостей есть общий знакомый — хозяин.');
  V('A2', 'p', 'c', 'Same here.', 'У меня тоже. / Я тоже.', "I'm so tired today. — Same here. I barely slept.", 'Я сегодня так устал. — Я тоже. Почти не спал.',
    'Короткое согласие «у меня так же». Подходит на утверждения: I\'m tired / I love this song.', { cue: "I'm so tired today.", cueRu: 'Я сегодня так устал.', alt: ['Me too'] });
  V('A2', 'p', 'c', 'Me neither.', 'Я тоже нет.', "I don't really like horror movies. — Me neither.", 'Я не очень люблю ужастики. — Я тоже.',
    'Согласие с ОТРИЦАНИЕМ. Частая ошибка — ответить Me too на фразу с don\'t.', { cue: "I don't really like horror movies.", cueRu: 'Я не очень люблю фильмы ужасов.', alt: ['Me either', 'Neither do I'] });
  V('A2', 'p', 'n', 'That sounds fun!', 'Звучит весело!', "We're going to a concert on Saturday. — That sounds fun!", 'Мы идём на концерт в субботу. — Звучит весело!',
    'Реакция на чужие планы. Показывает интерес — хорошо добавить вопрос: Who\'s playing?', { cue: "We're going to a concert on Saturday.", cueRu: 'Мы в субботу идём на концерт.', alt: ['Sounds fun', 'That sounds great'] });
  V('B2', 'p', 'c', "I can't complain.", 'Не жалуюсь.', "How's life? — I can't complain, really.", 'Как жизнь? — Не жалуюсь.',
    'Скромный позитивный ответ на How\'s life? / How are things? — «всё в порядке».', { cue: "How's life?", cueRu: 'Как жизнь?', alt: ["Can't complain"] });
  V('B2', 'p', 'c', 'Keeping busy?', 'Всё в делах?', 'Hey, keeping busy? — Always!', 'Привет, всё в делах? — Как всегда!',
    'Дружеский вопрос-приветствие коллеге или соседу. Ответа подробного не ждут.');
  V('B1', 'p', 'c', 'What have you been up to?', 'Чем занимался (в последнее время)?', 'Long time no see! What have you been up to?', 'Сто лет не виделись! Чем занимался?',
    'Вопрос о новостях после разлуки. Отвечают: Not much / Oh, you know, the usual / I\'ve been…');
  V('B1', 'p', 'c', 'Oh, you know, the usual', 'Да так, как обычно', 'What have you been up to? — Oh, you know, the usual. Work, gym, sleep.', 'Чем занимался? — Да так, как обычно. Работа, спортзал, сон.',
    'Непринуждённый ответ, когда новостей нет. Чтобы разговор не угас — задайте встречный вопрос.', { cue: 'What have you been up to?', cueRu: 'Чем занимался в последнее время?', alt: ['The usual'] });
  V('B2', 'k', 'n', 'Speaking of which', 'Кстати, раз уж об этом', 'Speaking of which, did you finish that book?', 'Кстати, раз уж заговорили — ты дочитал ту книгу?',
    'Связка для плавного перехода к связанной теме. Делает речь живой и связной.');
  V('A2', 'w', 'c', 'Anyway', 'В общем / Так вот', "Anyway, how's your new job?", 'Ну, в общем, как новая работа?',
    'Сигнал смены темы или возвращения к главному. Одно из самых частых слов в устной речи.');

  /* ===================== Кафе и ресторан ===================== */
  T('cafe');
  V('A1', 'k', 'n', 'Can I get', 'Можно мне… (при заказе)', 'Hi! Can I get a latte, please?', 'Здравствуйте! Можно мне латте?',
    'Самый естественный способ заказать в американском кафе. «I want» звучит грубо, «I would like» — чуть формально.', { cue: 'Hi! What can I get for you?', cueRu: 'Здравствуйте! Что вам предложить?', alt: ['Could I get', 'Can I have', 'Could I have'] });
  V('A1', 'p', 'n', 'For here or to go?', 'Здесь или с собой?', 'For here or to go? — To go, please.', 'Здесь или с собой? — С собой, пожалуйста.',
    'Вопрос бариста в США. В Британии спрашивают: Eat in or take away?');
  V('A1', 'p', 'n', 'To go, please.', 'С собой, пожалуйста.', 'For here or to go? — To go, please.', 'Здесь или с собой? — С собой, пожалуйста.',
    'Ответ, если берёте заказ с собой. Британский вариант — Take away, please.', { cue: 'For here or to go?', cueRu: 'Здесь или с собой?', alt: ['To go', 'Take away, please'] });
  V('A1', 'k', 'n', "I'll have", 'Я возьму…', "I'll have the chicken salad, please.", 'Я возьму салат с курицей.',
    'Классическая форма заказа в ресторане, когда официант готов принять заказ.', { cue: 'Are you ready to order?', cueRu: 'Вы готовы сделать заказ?', alt: ["I'd like", 'Can I get'] });
  V('A1', 'k', 'n', 'the check, please', 'счёт, пожалуйста', 'Excuse me, can we get the check, please?', 'Извините, можно нам счёт?',
    'В США — check, в Британии — bill. Официанта не зовут словом «Waiter!» — просто ловят взгляд и говорят Excuse me.', { alt: ['the bill, please'] });
  V('A2', 'p', 'n', 'What do you recommend?', 'Что посоветуете?', 'Everything looks good. What do you recommend?', 'Всё выглядит вкусно. Что посоветуете?',
    'Вежливый вопрос официанту. Официанты любят этот вопрос — и часто советуют лучшее.', { alt: ['What would you recommend?'] });
  V('A2', 'p', 'n', 'Is this seat taken?', 'Это место свободно?', 'Excuse me, is this seat taken?', 'Простите, это место свободно?',
    'Спрашиваем в кафе, в поезде, в зале. Внимание: «Yes» значит ЗАНЯТО, «No, go ahead» — свободно.');
  V('A1', 'k', 'n', 'a table for two', 'столик на двоих', 'Hi, a table for two, please.', 'Здравствуйте, столик на двоих, пожалуйста.',
    'Так отвечают хостес на входе в ресторан. Не нужно строить полное предложение.', { cue: 'Hi there! How many?', cueRu: 'Здравствуйте! Сколько вас?' });
  V('A2', 'k', 'n', 'Could I have', 'Можно мне… (вежливо)', 'Could I have a glass of water, please?', 'Можно мне стакан воды, пожалуйста?',
    'Вежливая просьба о чём-то. Could звучит мягче, чем Can.', { alt: ['Can I have', 'Can I get', 'Could I get'] });
  V('A1', 'p', 'n', 'Anything else?', 'Что-нибудь ещё?', "One cappuccino. Anything else? — No, that's it.", 'Один капучино. Что-нибудь ещё? — Нет, это всё.',
    'Типичный вопрос кассира или официанта. Ответ: That\'s it, thanks / That\'s all.');
  V('A1', 'p', 'n', "That's it, thanks.", 'Это всё, спасибо.', "Anything else? — That's it, thanks.", 'Что-нибудь ещё? — Это всё, спасибо.',
    'Естественный ответ, когда заказ закончен. Просто No звучит суховато.', { cue: 'Anything else?', cueRu: 'Что-нибудь ещё?', alt: ["That's all, thanks", "That's all"] });
  V('A2', 'k', 'n', "I'm allergic to", 'У меня аллергия на…', "Sorry, I'm allergic to nuts. Is there any in this cake?", 'Извините, у меня аллергия на орехи. В этом торте они есть?',
    'Важная фраза в ресторане. Предупреждайте до заказа.');
  V('B1', 'p', 'n', 'Keep the change.', 'Сдачи не надо.', "Here's twenty. Keep the change.", 'Вот двадцать. Сдачи не надо.',
    'Когда оставляете сдачу как чаевые — в такси, кафе.');
  V('B1', 'p', 'n', "I'm still deciding.", 'Я ещё выбираю.', "Are you ready to order? — I'm still deciding. Could you give me a minute?", 'Готовы заказать? — Ещё выбираю. Можно минутку?',
    'Если официант подошёл слишком рано. Можно добавить: Could you give us a few more minutes?', { cue: 'Are you ready to order?', cueRu: 'Вы готовы сделать заказ?', alt: ['I need a minute', 'Could I have a minute?'] });
  V('B1', 'k', 'n', 'on the side', 'отдельно (соус, заправку)', 'Could I get the dressing on the side?', 'Можно заправку отдельно?',
    'Очень частая просьба в американских ресторанах: соус, заправка, сыр — отдельно, а не в блюде.');
  V('B1', 'p', 'n', 'Is service included?', 'Обслуживание включено?', 'Is service included, or should I leave a tip?', 'Обслуживание включено или оставить чаевые?',
    'Полезно в Европе. В США чаевые 15–20% почти обязательны.');
  V('B1', 'p', 'c', "It's on me.", 'Я угощаю.', "Put your wallet away, it's on me.", 'Убери кошелёк, я угощаю.',
    'Дружеское «я плачу». Вариант: My treat!', { cue: "Let's split the bill.", cueRu: 'Давай разделим счёт.', alt: ["It's my treat", 'My treat'] });
  V('B1', 'p', 'n', "Let's split the bill.", 'Давай разделим счёт.', "That was great. Let's split the bill.", 'Было здорово. Давай разделим счёт.',
    'Предложение платить пополам. В США говорят и split the check.', { alt: ["Let's split it", "Let's split the check"] });
  V('B1', 'p', 'n', "This isn't what I ordered.", 'Это не то, что я заказывал(а).', "Excuse me, this isn't what I ordered. I asked for the soup.", 'Извините, это не то, что я заказывал. Я просил суп.',
    'Спокойно и вежливо — с Excuse me в начале. Не нужно извиняться или объяснять долго.');
  V('B2', 'k', 'c', 'grab a bite', 'перекусить', 'Want to grab a bite after work?', 'Хочешь перекусить после работы?',
    'Неформальное приглашение поесть что-то быстрое. Также: grab a coffee, grab lunch.');
  V('C1', 'k', 'f', 'Could I trouble you for', 'Не затруднит ли вас… (дать мне)', 'Sorry, could I trouble you for some more water?', 'Простите, не затруднит ли вас принести ещё воды?',
    'Очень вежливая просьба — в дорогом ресторане, в гостях. В кафе с друзьями прозвучит чопорно.');

  /* ===================== Магазин ===================== */
  T('shop');
  V('A1', 'p', 'n', 'How much is this?', 'Сколько это стоит?', 'Excuse me, how much is this?', 'Извините, сколько это стоит?',
    'Базовый вопрос о цене. Для нескольких вещей — How much are these?');
  V('A1', 'p', 'n', "I'm just looking, thanks.", 'Я просто смотрю, спасибо.', "Can I help you? — I'm just looking, thanks.", 'Вам помочь? — Я просто смотрю, спасибо.',
    'Вежливый отказ от помощи продавца. Звучит дружелюбно, а не грубо.', { cue: 'Hi! Can I help you find anything?', cueRu: 'Здравствуйте! Помочь вам что-нибудь найти?', alt: ["I'm just browsing, thanks", 'Just looking, thanks'] });
  V('A2', 'k', 'n', 'Do you have this in', 'У вас есть это в (размере/цвете)…?', 'Do you have this in a medium?', 'У вас есть это в размере M?',
    'Вопрос о другом размере или цвете: …in a large? / …in blue?');
  V('A1', 'p', 'n', 'Can I try it on?', 'Можно примерить?', 'I like this jacket. Can I try it on?', 'Мне нравится эта куртка. Можно примерить?',
    'try on — фразовый глагол «примерять». Для брюк/обуви — Can I try them on?');
  V('A2', 'p', 'n', 'Where are the fitting rooms?', 'Где примерочные?', 'Excuse me, where are the fitting rooms?', 'Извините, где примерочные?',
    'В Британии чаще говорят changing rooms.');
  V('A1', 'p', 'n', 'Can I pay by card?', 'Можно оплатить картой?', 'Can I pay by card? — Sure, just tap here.', 'Можно картой? — Конечно, просто приложите сюда.',
    'Спрашивают до оплаты. Также: Do you take cards?', { alt: ['Do you take cards?', 'Can I pay with card?'] });
  V('A1', 'p', 'n', 'Do you need a bag?', 'Вам нужен пакет?', "Do you need a bag? — No, thanks. I've got one.", 'Вам нужен пакет? — Нет, спасибо, у меня есть.',
    'Частый вопрос на кассе. Понимать его нужно на слух — кассиры говорят быстро: Need a bag?');
  V('A1', 'p', 'n', "I'll take it.", 'Беру.', "It fits perfectly. I'll take it.", 'Сидит идеально. Беру.',
    'Решение купить. Для нескольких вещей — I\'ll take them.', { cue: 'So, what do you think?', cueRu: 'Ну, что думаете?' });
  V('A2', 'p', 'n', "It's a bit too small.", 'Немного маловато.', "It's a bit too small. Do you have a bigger size?", 'Немного маловато. Есть размер побольше?',
    'a bit смягчает критику. Also: a bit too big / tight / long.', { alt: ["It's too small"] });
  V('A2', 'p', 'n', 'Is this on sale?', 'Это со скидкой?', "Is this on sale? — Yes, it's 30% off.", 'Это со скидкой? — Да, минус 30%.',
    'on sale — «по сниженной цене» (в США). for sale — просто «продаётся».');
  V('A2', 'p', 'n', 'Can I get a receipt?', 'Можно чек?', 'Can I get a receipt, please?', 'Можно чек, пожалуйста?',
    'Чек нужен для возврата. Кассир может спросить: Do you want the receipt?');
  V('A2', 'p', 'n', "I'd like to return this.", 'Я хотел(а) бы это вернуть.', "Hi, I'd like to return this. It doesn't fit.", 'Здравствуйте, я хотел бы это вернуть. Не подошло по размеру.',
    'Возврат товара. Сразу назовите причину: It doesn\'t fit / It\'s damaged.');
  V('B1', 'k', 'n', 'exchange it for', 'обменять на', 'Could I exchange it for a larger size?', 'Можно обменять на размер побольше?',
    'Обмен вместо возврата денег.');
  V('B1', 'p', 'c', "It's a rip-off.", 'Это грабёж (слишком дорого).', "Forty dollars for a T-shirt? It's a rip-off.", 'Сорок долларов за футболку? Это грабёж.',
    'Разговорное возмущение ценой. Говорите это другу, а не продавцу.');
  V('B1', 'k', 'n', 'a good deal', 'выгодная покупка', "Two for ten dollars? That's a good deal.", 'Две за десять долларов? Выгодно.',
    'О выгодной цене. Сильнее — a great deal / a steal.');
  V('B1', 'p', 'n', "It doesn't suit me.", 'Мне не идёт.', "I love the color, but it doesn't suit me.", 'Цвет классный, но мне не идёт.',
    'suit — идти (по стилю), fit — подходить по размеру. Частая путаница.');
  V('A2', 'p', 'n', 'Do you have anything cheaper?', 'Есть что-нибудь подешевле?', "It's nice, but do you have anything cheaper?", 'Красиво, но есть что-нибудь подешевле?',
    'Вежливо, без извинений. Можно смягчить: something a bit cheaper.');
  V('B2', 'p', 'n', "I'm on a budget.", 'У меня ограниченный бюджет.', "I'm on a budget, so nothing over fifty dollars.", 'У меня ограниченный бюджет, так что не дороже пятидесяти.',
    'Нормальный способ обозначить, что денег немного. Не звучит стыдно.');
  V('B2', 'v', 'n', 'shop around', 'присмотреться, сравнить цены', "I'm going to shop around before I buy a new laptop.", 'Я сначала сравню цены, прежде чем покупать новый ноутбук.',
    'Сравнить предложения в разных местах перед покупкой.');
  V('B2', 'i', 'n', 'worth every penny', 'стоит своих денег до копейки', "These boots were expensive, but they're worth every penny.", 'Эти ботинки были дорогими, но стоят каждого потраченного рубля.',
    'Оправдываем дорогую, но хорошую покупку.');

  /* ===================== Аэропорт и путешествия ===================== */
  T('travel');
  V('A1', 'p', 'n', "Here's my passport.", 'Вот мой паспорт.', "Good morning. Here's my passport.", 'Доброе утро. Вот мой паспорт.',
    'На паспортном контроле и регистрации. Here\'s / Here you are — когда что-то протягиваем.', { cue: 'Passport, please.', cueRu: 'Паспорт, пожалуйста.', alt: ['Here you are', 'Here you go'] });
  V('A1', 'k', 'n', 'window or aisle', 'у окна или у прохода', 'Would you like a window or aisle seat?', 'Вам место у окна или у прохода?',
    'Вопрос при регистрации. aisle читается [айл] — s не произносится!');
  V('A1', 'p', 'n', 'Just one bag.', 'Только одна сумка.', 'How many bags are you checking? — Just one bag.', 'Сколько сумок сдаёте? — Только одну.',
    'Ответ при сдаче багажа. check a bag — сдать в багаж.', { cue: 'How many bags are you checking?', cueRu: 'Сколько сумок сдаёте в багаж?', alt: ['Just one', 'One bag'] });
  V('A1', 'k', 'n', 'Where is gate', 'Где выход номер…', 'Excuse me, where is gate 12?', 'Простите, где выход номер 12?',
    'gate — выход на посадку. Номер без артикля: gate 12.');
  V('A1', 'w', 'n', 'boarding pass', 'посадочный талон', 'Please have your boarding pass ready.', 'Пожалуйста, приготовьте посадочный талон.',
    'Одно из главных слов аэропорта. Слышите его — доставайте талон.');
  V('A2', 'p', 'n', "I'm here on vacation.", 'Я здесь в отпуске.', "What's the purpose of your visit? — I'm here on vacation.", 'Какова цель визита? — Я в отпуске.',
    'Ответ на паспортном контроле. Британский вариант — on holiday. Для работы — on business.', { cue: "What's the purpose of your visit?", cueRu: 'Какова цель вашего визита?', alt: ["I'm here on holiday", "I'm on vacation", 'Tourism'] });
  V('A2', 'k', 'n', "I'm staying for", 'Я пробуду…', "How long are you staying? — I'm staying for two weeks.", 'Сколько вы пробудете? — Две недели.',
    'Present Continuous для запланированного будущего — очень естественно.', { cue: 'How long are you staying?', cueRu: 'Как долго вы пробудете?', alt: ['For two weeks'] });
  V('A2', 'k', 'n', 'is delayed', 'задерживается', "Sorry, I'll be late. My flight is delayed.", 'Извини, опоздаю. Мой рейс задерживается.',
    'О задержке рейса. Отменён — canceled.');
  V('A2', 'w', 'n', 'carry-on', 'ручная кладь', 'Can I take this as a carry-on?', 'Можно взять это как ручную кладь?',
    'Американское слово. В Британии — hand luggage.');
  V('A2', 'k', 'n', 'the line for', 'очередь на…', 'Excuse me, is this the line for check-in?', 'Простите, это очередь на регистрацию?',
    'line — очередь в США, queue — в Британии.', { alt: ['the queue for'] });
  V('B1', 'p', 'n', 'I missed my connection.', 'Я опоздал на стыковочный рейс.', 'My first flight was late, and I missed my connection.', 'Первый рейс опоздал, и я не успел на стыковку.',
    'connection — стыковочный рейс. Говорят на стойке трансфера.');
  V('B1', 'p', 'n', "My luggage didn't arrive.", 'Мой багаж не прилетел.', "Excuse me, my luggage didn't arrive. Where do I report it?", 'Извините, мой багаж не прилетел. Куда обратиться?',
    'luggage — неисчисляемое: my luggage (не luggages).');
  V('B1', 'w', 'n', 'a layover', 'пересадка (остановка между рейсами)', 'We have a layover in Istanbul for three hours.', 'У нас пересадка в Стамбуле на три часа.',
    'Время между рейсами. Британцы чаще говорят stopover.');
  V('B1', 'i', 'n', 'keep an eye on', 'присмотреть за', 'Could you keep an eye on my bag for a minute?', 'Не могли бы вы минутку присмотреть за моей сумкой?',
    'Просьба присмотреть за вещами, детьми, ситуацией.');
  V('B1', 'w', 'n', 'jet lag', 'джетлаг, смена часовых поясов', "I'm exhausted. The jet lag is killing me.", 'Я вымотан. Джетлаг меня добивает.',
    'Разница во времени после перелёта. Is killing me — шутливое преувеличение.');
  V('B2', 'k', 'c', 'catch a flight', 'успеть на рейс / лететь', 'I have to catch a flight at six tomorrow.', 'Завтра в шесть мне нужно на самолёт.',
    'Разговорное «лететь рейсом». Также: catch a train / a bus.');
  V('B2', 'k', 'n', 'travel light', 'путешествовать налегке', 'I always travel light — just a backpack.', 'Я всегда путешествую налегке — только рюкзак.',
    'Без лишнего багажа.');
  V('B2', 'k', 'n', 'Is there any way', 'Есть ли возможность…', 'Is there any way I could get on an earlier flight?', 'Есть ли возможность улететь более ранним рейсом?',
    'Вежливая и настойчивая просьба о чём-то сложном. Работает на стойках и в службах поддержки.');
  V('C1', 'i', 'n', 'off the beaten track', 'вдали от туристических троп', 'We found a lovely village off the beaten track.', 'Мы нашли чудесную деревушку вдали от туристов.',
    'О малоизвестных местах. В США чаще off the beaten path.');

  /* ===================== Отель ===================== */
  T('hotel');
  V('A1', 'p', 'n', 'I have a reservation.', 'У меня бронь.', 'Hi, I have a reservation under the name Ivanov.', 'Здравствуйте, у меня бронь на имя Иванов.',
    'Первая фраза на ресепшен. В Британии — I have a booking.', { cue: 'Good evening! Checking in?', cueRu: 'Добрый вечер! Заселяетесь?', alt: ['I have a booking', 'I made a reservation'] });
  V('A1', 'p', 'n', 'What time is checkout?', 'Во сколько выезд?', 'What time is checkout? — Eleven a.m.', 'Во сколько выезд? — В 11 утра.',
    'Важно спросить при заселении.');
  V('A1', 'p', 'n', 'Is breakfast included?', 'Завтрак включён?', 'Is breakfast included in the price?', 'Завтрак включён в стоимость?',
    'included — включён в цену.');
  V('A1', 'p', 'n', "What's the Wi-Fi password?", 'Какой пароль от Wi-Fi?', "Sorry, what's the Wi-Fi password?", 'Простите, какой пароль от Wi-Fi?',
    'Wi-Fi произносится [вай-фай].');
  V('A2', 'k', 'n', 'under the name', 'на имя', 'I booked a room under the name Petrova.', 'Я бронировала номер на имя Петрова.',
    'Так уточняют бронь в отеле и ресторане.');
  V('A2', 'k', 'n', "isn't working", 'не работает', "Hi, the air conditioning isn't working in room 305.", 'Здравствуйте, в 305-м номере не работает кондиционер.',
    'О неисправностях: The TV / The shower isn\'t working.');
  V('A2', 'k', 'n', 'a late checkout', 'поздний выезд', 'Is it possible to get a late checkout tomorrow?', 'Можно ли завтра выехать попозже?',
    'Часто бесплатно, если попросить заранее и вежливо.');
  V('A2', 'p', 'n', 'Could you call me a taxi?', 'Не могли бы вы вызвать мне такси?', 'Could you call me a taxi for 7 a.m.?', 'Не могли бы вы вызвать мне такси на 7 утра?',
    'call me a taxi = вызвать такси для меня.');
  V('A2', 'p', 'n', 'Can I leave my bags here', 'Можно оставить здесь сумки', "We're early. Can I leave my bags here until check-in?", 'Мы рано. Можно оставить сумки до заселения?',
    'Если приехали до заселения или после выезда. Отели почти всегда соглашаются.');
  V('B1', 'p', 'n', "It's a bit noisy.", 'Немного шумно.', "The room is nice, but it's a bit noisy.", 'Номер хороший, но немного шумно.',
    'Мягкая жалоба: a bit смягчает. Дальше — просьба: Could I switch rooms?');
  V('B1', 'k', 'n', 'switch rooms', 'поменять номер', 'Would it be possible to switch rooms?', 'Можно ли поменять номер?',
    'switch = поменять одно на другое. Также: change rooms.');
  V('B1', 'k', 'f', 'Would it be possible to', 'Можно ли было бы…', 'Would it be possible to get extra towels?', 'Можно ли получить дополнительные полотенца?',
    'Очень вежливая форма просьбы. Хороша в отеле, по работе, в официальных ситуациях.');
  V('B1', 'p', 'n', "I'd like to extend my stay.", 'Я хочу продлить проживание.', "I'd like to extend my stay by two nights.", 'Я хочу продлить проживание на две ночи.',
    'extend — продлить. by two nights — на две ночи.');
  V('B2', 'k', 'f', 'There seems to be a problem with', 'Кажется, есть проблема с…', 'There seems to be a problem with the shower.', 'Кажется, с душем какая-то проблема.',
    'Вежливая жалоба без обвинений. Работает лучше, чем The shower is broken!');
  V('B1', 'k', 'n', 'somewhere to eat nearby', 'где поесть поблизости', 'Could you recommend somewhere to eat nearby?', 'Не посоветуете, где поесть поблизости?',
    'Сотрудники отеля знают лучшие местные места — спрашивайте.');
  V('C1', 'k', 'f', "I'd appreciate it if", 'Я был(а) бы признателен(на), если…', "I'd appreciate it if you could look into this.", 'Я был бы признателен, если бы вы разобрались с этим.',
    'Формальная вежливая просьба — в письме или серьёзном разговоре. Звучит твёрдо, но корректно.');

  /* ===================== Город и транспорт ===================== */
  T('city');
  V('A1', 'k', 'n', 'How do I get to', 'Как добраться до…', 'Excuse me, how do I get to the train station?', 'Извините, как добраться до вокзала?',
    'Главный вопрос туриста. Начинайте с Excuse me.');
  V('A1', 'p', 'n', 'Is it far from here?', 'Это далеко отсюда?', "Is it far from here? — No, it's a five-minute walk.", 'Это далеко? — Нет, пять минут пешком.',
    'Уточнение расстояния.');
  V('A1', 'k', 'n', 'Go straight', 'Идите прямо', 'Go straight and turn left at the bank.', 'Идите прямо и поверните налево у банка.',
    'Базовая фраза в объяснении дороги. Также: go straight ahead.');
  V('A1', 'k', 'n', 'turn left', 'поверните налево', 'Turn left at the traffic lights.', 'На светофоре поверните налево.',
    'turn left / turn right — поворачивать. at the lights — на светофоре.');
  V('A2', 'k', 'n', 'a five-minute walk', 'пять минут пешком', 'The museum is a five-minute walk from here.', 'Музей в пяти минутах ходьбы отсюда.',
    'Обратите внимание: five-minute без s — это прилагательное.');
  V('A1', 'k', 'n', 'Take me to', 'Отвезите меня…', 'Hi, take me to this address, please.', 'Здравствуйте, отвезите меня по этому адресу, пожалуйста.',
    'Фраза для такси. С please — вежливо и естественно.');
  V('A2', 'k', 'n', 'Which bus goes to', 'Какой автобус идёт до…', 'Excuse me, which bus goes to the airport?', 'Извините, какой автобус идёт в аэропорт?',
    'Вопрос об общественном транспорте.');
  V('A2', 'k', 'n', 'Does this train stop at', 'Этот поезд останавливается на…', 'Does this train stop at Central Station?', 'Этот поезд останавливается на Центральном вокзале?',
    'Проверяем маршрут перед посадкой.');
  V('A1', 'p', 'n', "I'm lost.", 'Я заблудился(ась).', "Sorry, I'm lost. Where is the main square?", 'Извините, я заблудился. Где главная площадь?',
    'Коротко и понятно — люди охотно помогают.');
  V('A2', 'p', 'n', "You can't miss it.", 'Вы точно не пропустите.', "It's a big red building. You can't miss it.", 'Это большое красное здание. Не пропустите.',
    'Так заканчивают объяснение дороги. Понимать на слух!');
  V('B1', 'v', 'n', 'drop me off', 'высадите меня', 'Can you drop me off at the corner?', 'Можете высадить меня на углу?',
    'В такси или когда друг подвозит. Забрать — pick me up.');
  V('B1', 'v', 'n', 'get off', 'выходить (из транспорта)', 'You need to get off at the next stop.', 'Вам нужно выйти на следующей остановке.',
    'get off — из автобуса/поезда, get out of — из машины/такси. Сесть — get on.');
  V('B1', 'k', 'n', 'a round-trip ticket', 'билет туда и обратно', 'A round-trip ticket to Boston, please.', 'Билет до Бостона туда и обратно, пожалуйста.',
    'В США — round-trip, в Британии — return ticket. В одну сторону — one-way.', { alt: ['a return ticket'] });
  V('B1', 'w', 'n', 'rush hour', 'час пик', "Don't take the car during rush hour.", 'Не езди на машине в час пик.',
    'Время самых больших пробок.');
  V('B1', 'v', 'n', 'pull over', 'остановиться у обочины', 'Could you pull over here, please?', 'Не могли бы вы остановиться здесь?',
    'Просьба к водителю такси. Полиция тоже говорит: Pull over!');
  V('B2', 'k', 'n', 'within walking distance', 'в пешей доступности', 'The hotel is within walking distance of the beach.', 'Отель в пешей доступности от пляжа.',
    'Частая фраза в описаниях отелей и квартир.');
  V('B1', 'p', 'c', "I'm running late.", 'Я опаздываю.', "Sorry, I'm running late. The traffic is terrible.", 'Прости, я опаздываю. Жуткие пробки.',
    'Предупреждаем заранее, что опоздаем. Естественнее, чем I will be late.');
  V('B1', 'k', 'n', 'stuck in traffic', 'застрял(а) в пробке', "I'm stuck in traffic. Start without me.", 'Я застрял в пробке. Начинайте без меня.',
    'Самое частое оправдание опоздания в городе.');
  V('C1', 'i', 'c', 'took the scenic route', 'поехали живописной дорогой (сделали крюк)', "Sorry we're late — we took the scenic route.", 'Простите за опоздание — мы поехали живописной дорогой.',
    'Шутливое оправдание, когда заблудились или ехали дольше.');

  /* ===================== Телефон ===================== */
  T('phone');
  V('A1', 'k', 'n', 'Hi, this is', 'Здравствуйте, это… (по телефону)', 'Hi, this is Anna from the dental clinic.', 'Здравствуйте, это Анна из стоматологии.',
    'По телефону представляются через this is, а не I am.', { cue: 'Hello?', cueRu: 'Алло?' });
  V('A1', 'k', 'n', 'Can I speak to', 'Можно поговорить с…', 'Hello, can I speak to Mr. Brown, please?', 'Здравствуйте, можно поговорить с мистером Брауном?',
    'Вежливее — Could I speak to…? / May I speak to…?', { alt: ['Could I speak to', 'May I speak to'] });
  V('A1', 'p', 'n', 'Just a moment, please.', 'Минутку, пожалуйста.', "Just a moment, please. I'll get him.", 'Минутку, пожалуйста. Сейчас позову его.',
    'Просим подождать. Разговорно — Just a sec / Hang on.', { alt: ['One moment, please', 'Just a second'] });
  V('A1', 'p', 'n', "Sorry, I can't hear you.", 'Простите, вас не слышно.', "Sorry, I can't hear you. Can you say that again?", 'Простите, вас не слышно. Повторите, пожалуйста?',
    'Проблемы со связью или шум вокруг.');
  V('A2', 'p', 'f', "Who's calling, please?", 'Кто звонит?', "Who's calling, please? — It's Tom Green.", 'Кто звонит? — Это Том Грин.',
    'Вежливый вопрос секретаря. Отвечают: It\'s… / This is…');
  V('A2', 'p', 'n', 'Can I take a message?', 'Что-нибудь передать?', "She's not here right now. Can I take a message?", 'Её сейчас нет. Что-нибудь передать?',
    'Стандартная фраза, если нужного человека нет.');
  V('A2', 'v', 'n', 'call me back', 'перезвонить мне', 'Could you ask him to call me back?', 'Не могли бы вы попросить его перезвонить мне?',
    'call back — перезвонить.');
  V('A2', 'p', 'n', "You're breaking up.", 'Вы пропадаете (связь).', "Sorry, you're breaking up. Can you hear me now?", 'Простите, вы пропадаете. Теперь слышно?',
    'О плохой связи. Буквально «вы распадаетесь».');
  V('A2', 'p', 'c', 'Hold on a second.', 'Подожди секунду.', "Hold on a second, someone's at the door.", 'Подожди секунду, кто-то в дверь звонит.',
    'Разговорное «подожди». Также Hang on a second.', { alt: ['Hang on a second', 'Hold on', 'Just a second'] });
  V('B1', 'p', 'f', "I'll put you through.", 'Я вас соединю.', "One moment, I'll put you through to Sales.", 'Минуту, соединяю вас с отделом продаж.',
    'Фраза секретаря или колл-центра. Понимать на слух.');
  V('B1', 'k', 'n', 'you have the wrong number', 'вы ошиблись номером', 'Sorry, I think you have the wrong number.', 'Извините, кажется, вы ошиблись номером.',
    'Вежливо — с Sorry, I think.');
  V('B1', 'k', 'n', "I'm calling about", 'Я звоню по поводу…', "Hi, I'm calling about the apartment for rent.", 'Здравствуйте, я звоню по поводу квартиры в аренду.',
    'Сразу называем цель звонка — так говорят носители.');
  V('A2', 'p', 'n', 'Could you speak a little slower?', 'Не могли бы вы говорить помедленнее?', 'Sorry, could you speak a little slower?', 'Простите, не могли бы вы говорить помедленнее?',
    'Не стесняйтесь просить — это нормально и вежливо.', { alt: ['Could you speak more slowly?', 'Could you slow down a bit?'] });
  V('B2', 'p', 'n', "I'll get back to you.", 'Я вам отвечу (позже).', "Let me check my schedule and I'll get back to you.", 'Я проверю расписание и дам вам знать.',
    'Обещание ответить позже — по работе и в жизни.');
  V('B1', 'p', 'n', 'Sorry, I missed your call.', 'Извини, пропустил(а) твой звонок.', "Hey, sorry, I missed your call. What's up?", 'Привет, извини, пропустил твой звонок. Что случилось?',
    'Так начинают перезвон.');
  V('B1', 'v', 'n', 'hang up', 'повесить трубку', "Don't hang up, I'm still here!", 'Не вешай трубку, я ещё тут!',
    'hang up — закончить звонок. Hang up on someone — бросить трубку.');
  V('C1', 'i', 'f', 'tied up', 'занят (не может ответить)', "I'm afraid he's tied up at the moment. Can I take a message?", 'Боюсь, он сейчас занят. Что-нибудь передать?',
    'Вежливое «занят» в деловой речи. I\'m afraid смягчает отказ.');

  /* ===================== Работа ===================== */
  T('work');
  V('A2', 'k', 'n', 'I work in', 'Я работаю в (сфере)…', 'I work in marketing for a small tech company.', 'Я работаю в маркетинге в небольшой IT-компании.',
    'in + сфера (marketing, IT, sales), for + компания, at + место (at a bank).');
  V('B1', 'k', 'n', "I'm in charge of", 'Я отвечаю за…', "I'm in charge of the design team.", 'Я отвечаю за команду дизайнеров.',
    'О своих обязанностях и зоне ответственности.');
  V('A2', 'p', 'n', 'Do you have a minute?', 'У тебя есть минутка?', 'Hey, do you have a minute? I need your help.', 'Привет, есть минутка? Нужна твоя помощь.',
    'Вежливо отвлекаем коллегу. Также: Got a minute? (разг.)', { alt: ['Got a minute?', 'Do you have a second?'] });
  V('A2', 'p', 'n', 'Let me check.', 'Сейчас проверю.', 'Is the report ready? — Let me check.', 'Отчёт готов? — Сейчас проверю.',
    'Выигрываем время, когда не знаем ответ.', { cue: 'Is the report ready?', cueRu: 'Отчёт готов?' });
  V('B2', 'k', 'c', 'touch base', 'связаться, сверить информацию', "Let's touch base next week about the budget.", 'Давай на следующей неделе сверимся по бюджету.',
    'Деловой жаргон: короткий созвон или разговор, чтобы обменяться новостями.');
  V('B1', 'w', 'n', 'deadline', 'срок сдачи, дедлайн', 'The deadline for the report is Friday.', 'Срок сдачи отчёта — пятница.',
    'meet a deadline — уложиться в срок; miss a deadline — сорвать.');
  V('B1', 'p', 'c', "I'm swamped.", 'Я завален работой.', "Sorry, I can't today. I'm swamped.", 'Извини, сегодня не могу. Я завален.',
    'Разговорное «очень занят». Звучит естественнее, чем I am very busy.', { alt: ["I'm really busy", "I'm snowed under"] });
  V('B1', 'k', 'n', 'give me a hand', 'помочь (мне)', 'Could you give me a hand with these boxes?', 'Не поможешь мне с этими коробками?',
    'Просьба о помощи, чаще физической.');
  V('B1', 'p', 'n', "Let's get started.", 'Давайте начнём.', "Okay, everyone's here. Let's get started.", 'Итак, все здесь. Давайте начнём.',
    'Открываем встречу, урок, работу.', { alt: ["Let's start", "Let's begin"] });
  V('B1', 'k', 'n', 'get it done', 'сделать, закончить', "Don't worry, I'll get it done by Friday.", 'Не волнуйся, я закончу к пятнице.',
    'Уверенное обещание выполнить задачу.');
  V('A2', 'p', 'n', 'Sorry, could you repeat that?', 'Простите, не могли бы вы повторить?', "Sorry, could you repeat that? I didn't catch the last part.", 'Простите, повторите, пожалуйста? Я не расслышал конец.',
    'Нормальная фраза на встречах — носители тоже так спрашивают.', { alt: ['Could you say that again?', 'Sorry, could you say that again?'] });
  V('B1', 'p', 'n', "I didn't catch that.", 'Я не расслышал(а) / не уловил(а).', "Sorry, I didn't catch that. Could you say it again?", 'Простите, я не уловил. Повторите?',
    'Более естественно, чем I don\'t understand — вы не расслышали, а не «не понимаете».');
  V('B2', 'i', 'n', 'on the same page', 'одинаково понимаем ситуацию', "Let's make sure we're all on the same page.", 'Давайте убедимся, что мы все понимаем ситуацию одинаково.',
    'Популярное в офисе выражение: «синхронизироваться».');
  V('B2', 'v', 'n', 'follow up', 'вернуться к вопросу, напомнить', "I'll follow up with the client tomorrow.", 'Завтра ещё раз свяжусь с клиентом.',
    'Повторный контакт по делу: письмо, звонок после встречи.');
  V('B2', 'p', 'f', "I'd like to hear your thoughts.", 'Хотел(а) бы услышать ваше мнение.', "I'd like to hear your thoughts on the new plan.", 'Хотел бы услышать ваше мнение о новом плане.',
    'Приглашаем к обсуждению на встрече.');
  V('B2', 'k', 'n', 'Just to clarify', 'Просто чтобы уточнить', 'Just to clarify, the meeting is on Tuesday, right?', 'Просто уточню: встреча во вторник, верно?',
    'Уточняем без обиды для собеседника.');
  V('B2', 'k', 'n', "What's the status on", 'Как обстоят дела с…', "What's the status on the new website?", 'Как продвигается новый сайт?',
    'Деловой вопрос о прогрессе задачи.');
  V('A2', 'k', 'n', 'work from home', 'работать из дома', 'I work from home on Mondays.', 'По понедельникам я работаю из дома.',
    'Также говорят WFH в чатах и remote work.');
  V('C1', 'k', 'f', 'circle back', 'вернуться к вопросу позже', "Good point. Let's circle back to this later.", 'Хорошее замечание. Давайте вернёмся к этому позже.',
    'Корпоративный язык: отложить тему на потом.');
  V('C1', 'i', 'n', 'bring to the table', 'привнести, предложить (навыки, идеи)', 'What can you bring to the table?', 'Что вы можете предложить команде?',
    'Частый вопрос на собеседовании.');
  V('C1', 'k', 'f', 'push back on', 'возразить, не согласиться с', "I'm afraid I'll have to push back on that deadline.", 'Боюсь, мне придётся возразить против этого срока.',
    'Деловое, корректное несогласие.');
  V('B2', 'k', 'n', 'a tight schedule', 'плотный график', "We're on a tight schedule, so let's be quick.", 'У нас плотный график, так что давайте быстро.',
    'Мало времени на много дел.');

  /* ===================== Здоровье ===================== */
  T('health');
  V('A1', 'p', 'n', "I don't feel well.", 'Мне нехорошо.', "I don't feel well. I think I'll stay home.", 'Мне нехорошо. Думаю, останусь дома.',
    'Общая жалоба на самочувствие.', { alt: ["I'm not feeling well", "I don't feel good"] });
  V('A1', 'k', 'n', 'I have a headache', 'У меня болит голова', 'Do you have any painkillers? I have a headache.', 'У тебя есть обезболивающее? Голова болит.',
    'headache, stomachache, toothache — с артиклем a.', { alt: ["I've got a headache"] });
  V('A1', 'k', 'n', 'My throat hurts', 'Горло болит', 'My throat hurts when I swallow.', 'Горло болит, когда глотаю.',
    'hurts — болит. My back / My leg hurts.');
  V('A2', 'p', 'n', "I'd like to make an appointment.", 'Я хочу записаться на приём.', "Hi, I'd like to make an appointment with Dr. Lee.", 'Здравствуйте, я хочу записаться к доктору Ли.',
    'appointment — запись к врачу, парикмахеру; не путать с meeting.', { alt: ["I'd like to book an appointment"] });
  V('A2', 'p', 'n', "I've got a cold.", 'Я простыл(а).', "I've got a cold, so I'm staying in bed.", 'Я простыл, так что лежу в кровати.',
    'Британцы чаще говорят I\'ve got…, американцы — I have…', { alt: ['I have a cold'] });
  V('A2', 'p', 'n', 'Do I need a prescription?', 'Мне нужен рецепт?', 'Do I need a prescription for this?', 'Мне нужен рецепт на это?',
    'В аптеке. prescription — рецепт на лекарство (не recipe!).');
  V('A2', 'p', 'n', 'How often should I take it?', 'Как часто это принимать?', 'How often should I take it? — Twice a day after meals.', 'Как часто принимать? — Два раза в день после еды.',
    'Уточняем дозировку у врача или фармацевта.');
  V('B1', 'k', 'n', "I've been feeling", 'Я (последнее время) чувствую…', "I've been feeling dizzy since yesterday.", 'У меня со вчерашнего дня кружится голова.',
    'Present Perfect Continuous для симптомов, которые длятся какое-то время.');
  V('B1', 'i', 'n', 'under the weather', 'нездоровится', "I'm feeling a bit under the weather today.", 'Мне сегодня немного нездоровится.',
    'Мягкий способ сказать, что вы приболели — например, коллегам.');
  V('B1', 'p', 'n', "It's nothing serious.", 'Ничего серьёзного.', "Don't worry, it's nothing serious.", 'Не волнуйся, ничего серьёзного.',
    'Успокаиваем собеседника.');
  V('A2', 'p', 'n', 'Get well soon!', 'Выздоравливай!', "Sorry to hear you're sick. Get well soon!", 'Жаль, что ты заболел. Выздоравливай!',
    'Пожелание больному — устно, в сообщении, в открытке.', { cue: "I've got the flu.", cueRu: 'У меня грипп.', alt: ['Feel better soon'] });
  V('B2', 'w', 'n', 'side effects', 'побочные эффекты', 'Does this medicine have any side effects?', 'У этого лекарства есть побочные эффекты?',
    'Важный вопрос врачу или фармацевту.');
  V('B2', 'k', 'n', 'pulled a muscle', 'потянул(а) мышцу', 'I pulled a muscle at the gym.', 'Я потянул мышцу в спортзале.',
    'Типичная спортивная травма.');
  V('B2', 'i', 'n', 'on the mend', 'на поправку', "I was sick last week, but I'm on the mend now.", 'На прошлой неделе я болел, но сейчас иду на поправку.',
    'Выздоравливаю.');
  V('C1', 'w', 'n', 'run-down', 'вымотанный, истощённый', "I've been feeling really run-down lately.", 'Последнее время я чувствую себя совсем вымотанным.',
    'Усталость + слабость, часто перед болезнью.');

  /* ===================== Планы и приглашения ===================== */
  T('plans');
  V('A1', 'k', 'n', 'Are you free', 'Ты свободен(на)…?', 'Are you free on Saturday?', 'Ты свободен в субботу?',
    'Спрашиваем перед приглашением.');
  V('A1', 'k', 'n', "Let's meet", 'Давай встретимся', "Let's meet at six in front of the cinema.", 'Давай встретимся в шесть у кинотеатра.',
    'Let\'s + глагол — предложение что-то сделать вместе.');
  V('A1', 'p', 'c', 'Sounds good!', 'Звучит неплохо! / Договорились!', 'How about pizza tonight? — Sounds good!', 'Как насчёт пиццы вечером? — Отлично!',
    'Самый частый способ согласиться с предложением.', { cue: "Let's meet at six?", cueRu: 'Встретимся в шесть?', alt: ['Sounds great', 'Sounds good to me', 'Sure'] });
  V('A1', 'k', 'c', 'Do you want to', 'Хочешь…?', 'Do you want to get coffee later?', 'Хочешь попить кофе попозже?',
    'Простое приглашение. В речи звучит как «Do you wanna».');
  V('A2', 'k', 'n', 'How about', 'Как насчёт…', "I can't on Thursday. How about Friday?", 'В четверг не могу. Как насчёт пятницы?',
    'Предлагаем вариант. После How about — существительное или -ing.', { alt: ['What about'] });
  V('A2', 'p', 'n', "I'd love to!", 'С удовольствием!', "Would you like to come to dinner? — I'd love to!", 'Придёшь на ужин? — С удовольствием!',
    'Тёплое согласие на приглашение. Намного теплее, чем Yes.', { cue: 'Would you like to come to my party?', cueRu: 'Хочешь прийти на мою вечеринку?', alt: ["I'd love to", 'Sure, I would love to'] });
  V('A2', 'p', 'n', 'Maybe another time.', 'Может, в другой раз.', "Sorry, I'm busy tonight. Maybe another time.", 'Извини, сегодня занят. Может, в другой раз.',
    'Вежливый отказ, оставляющий дверь открытой.', { cue: 'Want to go to the gym with me?', cueRu: 'Хочешь со мной в зал?', alt: ['Maybe next time'] });
  V('A2', 'p', 'n', 'What time works for you?', 'Во сколько тебе удобно?', 'What time works for you? — Any time after five.', 'Во сколько тебе удобно? — Когда угодно после пяти.',
    'Естественный способ договориться о времени. works for you = удобно тебе.', { alt: ['When works for you?', 'What time is good for you?'] });
  V('B1', 'p', 'c', "I'm up for it.", 'Я за!', "Hiking on Sunday? I'm up for it.", 'Поход в воскресенье? Я за.',
    'Разговорное согласие поучаствовать.', { cue: 'Want to go hiking this weekend?', cueRu: 'Пойдём в поход на выходных?', alt: ["I'm in", 'Count me in'] });
  V('A2', 'p', 'n', 'Let me know.', 'Дай знать.', 'If you want to join us, let me know.', 'Если захочешь присоединиться — дай знать.',
    'Очень частая фраза в конце сообщений и разговоров.');
  V('B1', 'v', 'c', 'hang out', 'тусоваться, проводить время', 'Do you want to hang out this weekend?', 'Хочешь потусить на выходных?',
    'Проводить время вместе без особой цели. Очень частое слово у молодёжи.');
  V('B1', 'k', 'n', 'check my schedule', 'свериться с расписанием', "I'll have to check my schedule and let you know.", 'Мне нужно свериться с расписанием, я тебе скажу.',
    'Не даём ответ сразу. Хорошо для работы и жизни.');
  V('B1', 'p', 'n', 'Can we reschedule?', 'Можем перенести?', 'Something came up. Can we reschedule?', 'Кое-что случилось. Можем перенести?',
    'Перенос встречи — вежливо и коротко.');
  V('B1', 'p', 'n', 'Something came up.', 'Кое-что случилось (планы изменились).', "Sorry, something came up. I can't make it tonight.", 'Извини, кое-что случилось. Не смогу сегодня вечером.',
    'Универсальное объяснение отмены без подробностей. Никто не спросит, что именно.');
  V('B1', 'p', 'n', "I can't make it.", 'Я не смогу прийти.', "Sorry, I can't make it to the meeting.", 'Извините, я не смогу прийти на встречу.',
    'make it — успеть, прийти. Самый естественный способ отказаться от встречи.', { cue: 'See you at the party tonight?', cueRu: 'Увидимся вечером на вечеринке?', alt: ["I can't come", "I won't be able to make it"] });
  V('B2', 'i', 'n', 'take a rain check', 'перенести на потом (приглашение)', "I'm exhausted tonight. Can I take a rain check?", 'Я сегодня без сил. Можно в другой раз?',
    'Вежливо отказаться сейчас, но согласиться в будущем. Типично американское.');
  V('B2', 'p', 'c', 'Count me in!', 'Я в деле!', 'Bowling on Friday? Count me in!', 'Боулинг в пятницу? Я в деле!',
    'Энергичное согласие участвовать. Противоположное — Count me out.', { cue: "We're going bowling on Friday. Want to join?", cueRu: 'Мы в пятницу идём в боулинг. Присоединишься?', alt: ["I'm in", "I'm up for it"] });
  V('B2', 'i', 'n', 'play it by ear', 'действовать по обстоятельствам', "Let's not plan too much. We'll play it by ear.", 'Давай не будем много планировать. Сориентируемся по ходу.',
    'Решать на месте, без жёсткого плана.');
  V('C1', 'v', 'n', 'pencil in', 'предварительно назначить', "Let's pencil in Tuesday and confirm later.", 'Давай предварительно поставим вторник, а потом подтвердим.',
    'Записать карандашом — то есть можно поменять. Деловой и бытовой контекст.');

  /* ===================== Реакции и эмоции ===================== */
  T('reactions');
  V('A1', 'p', 'c', 'No problem.', 'Без проблем. / Не за что.', 'Thanks for your help! — No problem.', 'Спасибо за помощь! — Не за что.',
    'Непринуждённый ответ на спасибо. Часто естественнее, чем You\'re welcome.', { cue: 'Thanks for your help!', cueRu: 'Спасибо за помощь!', alt: ['No worries', 'Sure', "You're welcome"] });
  V('A1', 'p', 'n', "You're welcome.", 'Пожалуйста (в ответ на спасибо).', "Thank you so much! — You're welcome.", 'Большое спасибо! — Пожалуйста.',
    'Классический ответ на благодарность. Внимание: не Please!', { cue: 'Thank you so much!', cueRu: 'Большое спасибо!', alt: ['No problem', 'My pleasure'] });
  V('A1', 'w', 'n', 'Really?', 'Правда?', "I'm moving to Canada. — Really? That's amazing!", 'Я переезжаю в Канаду. — Правда? Это потрясающе!',
    'Показываем интерес и удивление. Интонация вверх!');
  V('A1', 'p', 'n', "That's great!", 'Это здорово!', "I passed my exam! — That's great!", 'Я сдал экзамен! — Это здорово!',
    'Радуемся за собеседника.', { cue: 'I got the job!', cueRu: 'Меня взяли на работу!', alt: ['That is great', 'Awesome', "That's amazing"] });
  V('A1', 'p', 'n', 'Oh no!', 'О нет!', 'I lost my keys. — Oh no!', 'Я потерял ключи. — О нет!',
    'Сочувствие к небольшой неприятности.', { cue: 'I lost my phone.', cueRu: 'Я потерял телефон.' });
  V('A2', 'p', 'n', "I'm sorry to hear that.", 'Мне жаль это слышать.', "My dog is sick. — I'm sorry to hear that.", 'Моя собака заболела. — Мне жаль это слышать.',
    'Сочувствие к плохим новостям. sorry здесь — не извинение, а сожаление.', { cue: 'My grandmother is in the hospital.', cueRu: 'Моя бабушка в больнице.', alt: ["Sorry to hear that", "Oh, I'm so sorry"] });
  V('A2', 'p', 'n', 'Good for you!', 'Молодец! / Рад за тебя!', 'I started running every morning. — Good for you!', 'Я начал бегать каждое утро. — Молодец!',
    'Одобряем чьё-то решение или достижение.', { cue: 'I finally quit smoking!', cueRu: 'Я наконец бросил курить!', alt: ['Well done', "That's great"] });
  V('A1', 'w', 'n', 'Congratulations!', 'Поздравляю!', "We're getting married! — Congratulations!", 'Мы женимся! — Поздравляю!',
    'На важные новости: свадьба, работа, ребёнок. Разговорно — Congrats!', { cue: "We're getting married!", cueRu: 'Мы женимся!', alt: ['Congrats'] });
  V('A2', 'p', 'c', 'No way!', 'Да ладно! / Не может быть!', 'I won the lottery! — No way!', 'Я выиграл в лотерею! — Да ладно!',
    'Удивление (обычно радостное). Также — категоричный отказ: No way am I doing that.', { cue: 'I met Brad Pitt at the airport!', cueRu: 'Я встретил Брэда Питта в аэропорту!', alt: ['Really?', 'Seriously?'] });
  V('A2', 'p', 'n', "Don't worry about it.", 'Не переживай. / Ничего страшного.', "Sorry I broke your cup. — Don't worry about it.", 'Прости, я разбил твою чашку. — Не переживай.',
    'Ответ на извинение.', { cue: "Sorry I'm late!", cueRu: 'Извини, что опоздал!', alt: ['No worries', "It's fine", "That's okay"] });
  V('A2', 'p', 'n', 'I see.', 'Понятно.', 'The meeting is at two, not three. — Oh, I see.', 'Встреча в два, а не в три. — А, понятно.',
    'Показываем, что поняли информацию. Не путать с «я вижу».');
  V('B1', 'p', 'n', 'That makes sense.', 'Логично. / Понятно.', 'So we leave early to avoid traffic? That makes sense.', 'Выезжаем пораньше, чтобы избежать пробок? Логично.',
    'Соглашаемся с объяснением. Отрицание — That doesn\'t make sense.');
  V('B1', 'p', 'n', 'What a shame!', 'Как жаль!', 'The concert was canceled. — What a shame!', 'Концерт отменили. — Как жаль!',
    'Сожаление о небольшой неудаче. Не про стыд!', { cue: 'The concert was canceled.', cueRu: 'Концерт отменили.', alt: ['What a pity', "That's a shame", 'Oh no'] });
  V('B1', 'p', 'c', 'Lucky you!', 'Везёт тебе!', "I'm off to Spain next week. — Lucky you!", 'Я на следующей неделе еду в Испанию. — Везёт тебе!',
    'Дружеская «белая зависть».', { cue: "I'm going to Bali next week!", cueRu: 'Я на следующей неделе еду на Бали!', alt: ["You're so lucky"] });
  V('B1', 'p', 'c', 'Tell me about it!', 'И не говори!', 'This heat is unbearable. — Tell me about it!', 'Эта жара невыносима. — И не говори!',
    'Горячее согласие с жалобой. НЕ просьба рассказать!', { cue: 'Mondays are the worst.', cueRu: 'Понедельники — худшие дни.', alt: ['I know, right?', 'Same here'] });
  V('B1', 'p', 'c', 'Fair enough.', 'Справедливо. / Ладно, понятно.', "I can't come, I have to work. — Fair enough.", 'Не смогу прийти, надо работать. — Понятно, справедливо.',
    'Принимаем чужой довод или отказ без спора. Очень британское, но популярно везде.');
  V('B2', 'p', 'c', "You've got to be kidding!", 'Ты, должно быть, шутишь!', "They canceled our flight again? You've got to be kidding!", 'Наш рейс снова отменили? Да вы издеваетесь!',
    'Возмущённое удивление. Короче — Are you kidding me?', { alt: ['Are you kidding me?', 'You must be joking'] });
  V('B1', 'p', 'n', "I'm so happy for you!", 'Я так за тебя рад(а)!', "I got the promotion! — I'm so happy for you!", 'Меня повысили! — Я так за тебя рада!',
    'Искренняя радость за другого человека.', { cue: 'I got into Oxford!', cueRu: 'Я поступил в Оксфорд!', alt: ["I'm really happy for you", 'Congratulations'] });
  V('B2', 'p', 'n', "That's a relief.", 'Какое облегчение.', "The test results are fine. — Oh, that's a relief.", 'Результаты анализов в порядке. — Ох, какое облегчение.',
    'Реакция на хорошую новость после волнения.', { cue: 'Good news — your bag has been found.', cueRu: 'Хорошие новости — вашу сумку нашли.', alt: ['What a relief'] });
  V('C1', 'p', 'c', "That's the last thing I need.", 'Только этого мне не хватало.', "It's raining and my car won't start. That's the last thing I need.", 'Дождь, и машина не заводится. Только этого мне не хватало.',
    'Раздражение от очередной проблемы.');
  V('B2', 'p', 'n', 'I can imagine.', 'Представляю.', 'The flight was twelve hours. — I can imagine. You must be tired.', 'Перелёт был двенадцать часов. — Представляю. Ты, наверное, устал.',
    'Показываем сочувствие и понимание.');

  /* ===================== Мнения ===================== */
  T('opinions');
  V('A2', 'p', 'n', 'I think so.', 'Думаю, да.', 'Is the shop open today? — I think so.', 'Магазин сегодня открыт? — Думаю, да.',
    'Неуверенное «да». Не говорят I think yes.', { cue: 'Is it going to rain?', cueRu: 'Будет дождь?', alt: ['I guess so', 'I believe so'] });
  V('A2', 'p', 'n', "I don't think so.", 'Не думаю.', "Is he coming? — I don't think so.", 'Он придёт? — Не думаю.',
    'Мягкое «нет». Не говорят I think no.', { cue: 'Is Tom coming tonight?', cueRu: 'Том придёт сегодня вечером?' });
  V('A2', 'k', 'n', 'In my opinion', 'По моему мнению', 'In my opinion, the first movie was better.', 'По-моему, первый фильм был лучше.',
    'Чуть книжно для бытовой речи. В разговоре чаще I think… / For me…');
  V('A2', 'p', 'n', 'I agree.', 'Согласен(на).', 'This place is too expensive. — I agree.', 'Здесь слишком дорого. — Согласен.',
    'Внимание: не I am agree! Просто I agree.', { cue: 'This movie is way too long.', cueRu: 'Этот фильм слишком длинный.', alt: ['I agree with you', 'True'] });
  V('B1', 'p', 'n', "I'm not sure about that.", 'Не уверен(а) насчёт этого.', "It's the best phone ever. — Hmm, I'm not sure about that.", 'Это лучший телефон в мире. — Хм, не уверен.',
    'Вежливое несогласие без конфликта.');
  V('B1', 'k', 'n', 'To be honest', 'Честно говоря', "To be honest, I didn't like the ending.", 'Честно говоря, мне не понравилась концовка.',
    'Смягчает критику. В чатах — TBH.');
  V('B1', 'w', 'n', 'Exactly!', 'Именно! / Точно!', 'So we need more time? — Exactly!', 'Значит, нам нужно больше времени? — Именно!',
    'Сильное согласие — собеседник сказал именно то, что вы имели в виду.');
  V('B1', 'k', 'n', 'I see your point, but', 'Я понимаю вашу мысль, но', "I see your point, but I still think it's too risky.", 'Понимаю вашу мысль, но всё же думаю, что это слишком рискованно.',
    'Вежливое несогласие: сначала признаём аргумент, потом возражаем.');
  V('B1', 'p', 'n', 'It depends.', 'Зависит (от обстоятельств).', 'Do you like working from home? — It depends.', 'Тебе нравится работать из дома? — Смотря как.',
    'Уклончивый ответ. Лучше продолжить: It depends on the day.');
  V('B1', 'k', 'n', 'As far as I know', 'Насколько я знаю', 'As far as I know, the store closes at nine.', 'Насколько я знаю, магазин закрывается в девять.',
    'Даём информацию без полной уверенности.');
  V('B2', 'p', 'n', "I couldn't agree more.", 'Полностью согласен(на).', "We should hire more people. — I couldn't agree more.", 'Нам нужно нанять больше людей. — Полностью согласен.',
    'Буквально «не мог бы согласиться больше». Очень сильное согласие, не отрицание!', { cue: 'We need to take more breaks.', cueRu: 'Нам нужно делать больше перерывов.', alt: ['Totally agree', 'I totally agree', 'Absolutely'] });
  V('B1', 'p', 'n', "That's a good point.", 'Хорошее замечание.', "We should think about the cost too. — That's a good point.", 'Надо подумать и о цене. — Хорошее замечание.',
    'Признаём ценность чужого довода. Популярно на встречах.', { cue: 'But what about the cost?', cueRu: 'А как же цена?', alt: ['Good point'] });
  V('B2', 'p', 'c', "I'm with you on that.", 'Тут я с тобой согласен.', "This meeting could have been an email. — I'm with you on that.", 'Эта встреча могла быть письмом. — Тут я с тобой.',
    'Неформальное согласие по конкретному вопросу.');
  V('B2', 'k', 'c', 'If you ask me', 'Если хочешь знать моё мнение', "If you ask me, he's making a big mistake.", 'Если хочешь знать моё мнение, он совершает большую ошибку.',
    'Высказываем мнение, даже если не спрашивали.');
  V('B2', 'p', 'f', "I'd have to disagree.", 'Я бы не согласился(ась).', "I'd have to disagree. The numbers don't support that.", 'Я бы не согласился. Цифры этого не подтверждают.',
    'Вежливое, но твёрдое несогласие на работе.', { alt: ["I'm afraid I disagree", "I don't agree"] });
  V('C1', 'p', 'n', "That's debatable.", 'Это спорно.', "It's the best city in Europe. — That's debatable.", 'Это лучший город Европы. — Это спорно.',
    'Сомневаемся в утверждении — вежливо, но с иронией.');
  V('C1', 'p', 'f', 'I take your point', 'Понимаю ваш довод', "I take your point, but we can't afford it right now.", 'Понимаю ваш довод, но сейчас мы не можем себе это позволить.',
    'Формально признаём аргумент перед возражением.');
  V('C1', 'i', 'n', "play devil's advocate", 'побыть адвокатом дьявола', "Just to play devil's advocate, what if the client says no?", 'Просто побуду адвокатом дьявола: а если клиент откажется?',
    'Специально выдвигаем контраргумент, чтобы проверить идею.');
  V('C1', 'k', 'n', 'Having said that', 'И тем не менее / При этом', 'The hotel was expensive. Having said that, the service was excellent.', 'Отель был дорогим. При этом обслуживание было отличным.',
    'Связка для контраста — звучит зрело и связно.', { alt: ['That said'] });
  V('B2', 'k', 'n', 'The way I see it', 'Как я это вижу', 'The way I see it, we have two options.', 'Как я это вижу, у нас два варианта.',
    'Вводим собственную точку зрения — естественнее, чем In my opinion.');

  /* ===================== Проблемы, жалобы, извинения ===================== */
  T('problems');
  V('A1', 'w', 'n', 'Excuse me', 'Простите (привлечь внимание)', 'Excuse me, is this your umbrella?', 'Простите, это ваш зонт?',
    'Привлечь внимание или пройти. Извиниться за ошибку — Sorry.');
  V('A1', 'p', 'n', "Sorry I'm late!", 'Простите за опоздание!', "Sorry I'm late! The bus didn't come.", 'Извините за опоздание! Автобус не пришёл.',
    'Короткое извинение + причина.');
  V('A1', 'p', 'n', 'Can you help me?', 'Вы можете мне помочь?', "Excuse me, can you help me? I can't find my hotel.", 'Простите, вы можете мне помочь? Не могу найти свой отель.',
    'Вежливее — Could you help me?', { alt: ['Could you help me?'] });
  V('A2', 'k', 'n', "There's a problem with", 'Есть проблема с…', "There's a problem with my order.", 'С моим заказом проблема.',
    'Нейтральное начало жалобы.');
  V('A2', 'p', 'n', "It doesn't work.", 'Не работает.', "I bought this charger yesterday and it doesn't work.", 'Я вчера купил эту зарядку, и она не работает.',
    'О сломанной вещи. Для временной поломки — It\'s not working.');
  V('B1', 'p', 'c', 'My bad.', 'Моя вина. / Мой косяк.', 'Oops, I took your pen. My bad!', 'Ой, я взял твою ручку. Мой косяк!',
    'Лёгкое признание мелкой ошибки среди друзей. На работе с руководителем — лучше Sorry, my mistake.');
  V('A2', 'k', 'n', "I didn't mean to", 'Я не хотел(а) (не нарочно)', "Sorry, I didn't mean to wake you up.", 'Прости, я не хотел тебя будить.',
    'Извиняемся за случайное действие.');
  V('B1', 'p', 'f', "I'd like to make a complaint.", 'Я хочу подать жалобу.', "I'd like to make a complaint about the noise.", 'Я хочу пожаловаться на шум.',
    'Официальная жалоба — в отеле, магазине, службе.');
  V('B1', 'p', 'c', "It's not a big deal.", 'Ничего страшного. / Не так уж важно.', "Don't apologize. It's not a big deal.", 'Не извиняйся. Ничего страшного.',
    'Успокаиваем, снижаем важность проблемы. Также: No big deal.', { cue: "I'm so sorry I forgot your birthday!", cueRu: 'Прости, я забыл про твой день рождения!', alt: ['No big deal', "Don't worry about it"] });
  V('B1', 'p', 'n', 'What seems to be the problem?', 'В чём проблема?', "What seems to be the problem? — My laptop won't turn on.", 'В чём проблема? — Ноутбук не включается.',
    'Вопрос врача, мастера, поддержки. seems смягчает вопрос.');
  V('B1', 'k', 'n', "won't turn on", 'не включается', "My phone won't turn on.", 'Мой телефон не включается.',
    'won\'t = отказывается: The door won\'t open, the car won\'t start.');
  V('B1', 'k', 'f', 'I was wondering if', 'Я хотел(а) спросить, не могли бы…', 'I was wondering if you could help me with my bags.', 'Я хотел спросить, не могли бы вы помочь мне с сумками.',
    'Очень вежливая просьба. Прошедшее время делает её мягче.');
  V('B1', 'p', 'n', "I'll look into it.", 'Я разберусь с этим.', "Thanks for letting us know. I'll look into it.", 'Спасибо, что сообщили. Я разберусь.',
    'Обещание выяснить ситуацию — типичный ответ на жалобу.');
  V('B1', 'p', 'n', "I'd like a refund.", 'Я хочу вернуть деньги.', "The product is broken. I'd like a refund.", 'Товар сломан. Я хочу вернуть деньги.',
    'refund — возврат денег, exchange — обмен.');
  V('B2', 'p', 'f', 'This is unacceptable.', 'Это неприемлемо.', "We've waited for an hour. This is unacceptable.", 'Мы ждём час. Это неприемлемо.',
    'Сильная, но вежливая жалоба. Используйте, когда мягкие фразы не сработали.');
  V('B2', 'p', 'f', 'I apologize for the inconvenience.', 'Приносим извинения за неудобства.', "I apologize for the inconvenience. We'll fix it right away.", 'Приношу извинения за неудобства. Мы сейчас же всё исправим.',
    'Формальное извинение сотрудника компании. Понимать на слух.');
  V('B2', 'p', 'c', 'No harm done.', 'Ничего страшного, всё в порядке.', 'Sorry I bumped into you! — No harm done.', 'Простите, что толкнул! — Ничего страшного.',
    'Ответ на извинение, когда ничего не пострадало.', { cue: 'Oh, sorry! I bumped into you.', cueRu: 'Ой, простите! Я вас толкнул.', alt: ["Don't worry about it", "It's fine"] });
  V('C1', 'k', 'n', "there's been a mix-up", 'произошла путаница', "I'm afraid there's been a mix-up with our reservation.", 'Боюсь, с нашей бронью произошла путаница.',
    'Дипломатично указываем на ошибку, не обвиняя никого.');
  V('C1', 'p', 'f', "I'd like to escalate this.", 'Я хотел(а) бы передать это выше.', "If it isn't fixed today, I'd like to escalate this.", 'Если это не исправят сегодня, я хотел бы передать вопрос руководству.',
    'Просим подключить руководство или службу выше уровнем.');

  /* ===================== Разговорные формы ===================== */
  T('casual');
  V('A2', 'c', 'c', 'gonna', 'going to (собираюсь)', "I'm gonna grab some food. Want anything?", 'Я пойду возьму поесть. Тебе что-нибудь?',
    'Так произносят going to в быстрой речи. В чатах — можно, в деловых письмах — нет.');
  V('A2', 'c', 'c', 'wanna', 'want to (хочу)', 'Do you wanna watch a movie tonight?', 'Хочешь посмотреть фильм вечером?',
    'Быстрое произношение want to. Пишется только в неформальной переписке.');
  V('B1', 'c', 'c', 'gotta', 'have got to (должен, надо)', 'Sorry, I gotta go. Talk later!', 'Прости, мне пора. Поговорим позже!',
    'Разговорное «надо». Типично: I gotta go.');
  V('B1', 'c', 'c', 'kinda', 'kind of (вроде как, немного)', "I'm kinda tired, to be honest.", 'Я, честно говоря, немного устал.',
    'Смягчает высказывание. Слышится постоянно в фильмах и сериалах.');
  V('A2', 'p', 'c', "What's up?", 'Как дела? / Что нового?', "Hey man, what's up? — Not much, you?", 'Привет, как дела? — Да ничего, а ты?',
    'Неформальное приветствие. Отвечают Not much, а не рассказом о проблемах.');
  V('A2', 'p', 'c', 'Not much.', 'Да ничего особенного.', "What's up? — Not much. Just chilling.", 'Что нового? — Да ничего. Отдыхаю.',
    'Стандартный ответ на What\'s up?', { cue: "What's up?", cueRu: 'Как дела? / Что нового?', alt: ['Not much, you?', 'Nothing much'] });
  V('A1', 'w', 'c', 'Cool.', 'Круто. / Хорошо, ок.', "I'll pick you up at eight. — Cool.", 'Заеду за тобой в восемь. — Ок.',
    'Универсальное согласие или одобрение.');
  V('A2', 'p', 'c', 'No worries.', 'Не парься. / Без проблем.', "Sorry, I'm a bit late. — No worries!", 'Прости, немного опоздал. — Без проблем!',
    'Ответ на спасибо или извинение. Особенно популярно в Австралии и Британии.', { cue: 'Sorry, I forgot to call you back!', cueRu: 'Прости, я забыл тебе перезвонить!', alt: ['No problem', "Don't worry about it"] });
  V('A1', 'p', 'c', 'Yeah, sure.', 'Да, конечно.', 'Can you pass the salt? — Yeah, sure.', 'Передашь соль? — Да, конечно.',
    'Лёгкое согласие на просьбу.', { cue: 'Can you pass the salt?', cueRu: 'Передашь соль?', alt: ['Sure', 'Of course'] });
  V('A2', 'p', 'c', 'Hang on.', 'Погоди.', "Hang on, I'll be right there.", 'Погоди, сейчас буду.',
    'Просим подождать — разговорно.', { alt: ['Hold on', 'Wait a second'] });
  V('B2', 'p', 'c', "I'm down.", 'Я за!', "Tacos tonight? — I'm down!", 'Тако вечером? — Я за!',
    'Американский сленг: согласие на предложение. Не путать с I\'m feeling down — мне грустно.', { cue: 'Tacos tonight?', cueRu: 'Тако вечером?', alt: ["I'm in", "I'm up for it"] });
  V('B1', 'k', 'c', 'Sort of', 'вроде того, отчасти', 'Did you like it? — Sort of. It was a bit long.', 'Тебе понравилось? — Вроде да. Немного затянуто.',
    'Неопределённый ответ, «не совсем».');
  V('A2', 'k', 'n', 'a bit', 'немного', "I'm a bit hungry.", 'Я немного голоден.',
    'Очень частое слово-смягчитель. Звучит естественнее, чем a little, в британском английском.');
  V('B1', 'c', 'c', "y'know", 'ну, знаешь', "It was, y'know, kind of weird.", 'Это было, ну, знаешь, как-то странно.',
    'Слово-заполнитель паузы. Пара раз в разговоре — естественно, каждую фразу — перебор.');
  V('B1', 'p', 'c', "I'm good.", 'Мне не надо, спасибо (отказ).', "Want another drink? — I'm good, thanks.", 'Ещё напиток? — Нет, спасибо, мне хватит.',
    'Внимание! В ответ на предложение I\'m good = «нет, спасибо».', { cue: 'Do you want some more cake?', cueRu: 'Хочешь ещё торта?', alt: ["I'm good, thanks", "No, thanks, I'm fine"] });
  V('B1', 'w', 'c', 'Gotcha.', 'Понял(а).', 'Turn left after the bridge. — Gotcha.', 'После моста налево. — Понял.',
    'got you — «понял тебя». Неформально.', { alt: ['Got it'] });
  V('B2', 'w', 'c', 'chilled', 'отдыхали, расслаблялись', 'We just stayed in and chilled all weekend.', 'Мы просто сидели дома и отдыхали все выходные.',
    'chill — расслабляться. Chill out! — Успокойся!');
  V('B1', 'p', 'n', "It's up to you.", 'Решать тебе.', "Pizza or sushi? — It's up to you.", 'Пицца или суши? — Решай ты.',
    'Передаём право выбора собеседнику.', { cue: 'Pizza or sushi?', cueRu: 'Пицца или суши?', alt: ['Up to you', 'Your call'] });
  V('A2', 'p', 'c', "That's awesome!", 'Это потрясающе!', "I got a new job! — That's awesome!", 'У меня новая работа! — Это потрясающе!',
    'Очень частая восторженная реакция в американском английском.', { cue: 'I just got tickets to the final!', cueRu: 'Я только что достал билеты на финал!', alt: ["That's great", "That's amazing"] });
  V('B2', 'p', 'n', 'Whatever works for you.', 'Как тебе удобнее.', 'Should we meet at 5 or 6? — Whatever works for you.', 'Встретимся в 5 или 6? — Как тебе удобнее.',
    'Гибко соглашаемся на удобный собеседнику вариант.', { cue: 'Should we meet at 5 or 6?', cueRu: 'Встретимся в 5 или в 6?', alt: ["Whatever's easier for you", 'Either works'] });
  V('B2', 'p', 'c', "I'm beat.", 'Я вымотан(а).', "What a day. I'm beat.", 'Ну и денёк. Я без сил.',
    'Сленговое «очень устал».', { alt: ["I'm exhausted", "I'm wiped out"] });
  V('C1', 'k', 'c', 'Not gonna lie', 'Не буду врать / Честно говоря', "Not gonna lie, that was the best pizza I've ever had.", 'Не буду врать, это лучшая пицца в моей жизни.',
    'Молодёжное «честно». В чатах — NGL.');

  /* ===================== Идиомы и фразовые глаголы ===================== */
  T('idioms');
  V('B1', 'v', 'n', 'figure out', 'разобраться, понять', "I can't figure out how this app works.", 'Не могу разобраться, как работает это приложение.',
    'Понять что-то через размышление. Очень частый глагол.');
  V('A2', 'v', 'n', 'find out', 'узнать', 'I need to find out what time the store opens.', 'Мне нужно узнать, во сколько открывается магазин.',
    'Узнать новую информацию. Не путать с find — найти.');
  V('B1', 'v', 'n', 'looking forward to', 'с нетерпением ждать', "I'm looking forward to the trip.", 'Я с нетерпением жду поездки.',
    'После to — существительное или -ing: looking forward to seeing you. В письмах: I look forward to…');
  V('B1', 'v', 'n', 'run out of', 'закончиться (о запасах)', "We've run out of milk.", 'У нас закончилось молоко.',
    'I ran out of time / money / patience.');
  V('B1', 'v', 'n', 'come up with', 'придумать', 'We need to come up with a better idea.', 'Нам нужно придумать идею получше.',
    'Придумать идею, план, решение.');
  V('B1', 'v', 'n', 'give up', 'сдаться, бросить', "Don't give up! You're almost there.", 'Не сдавайся! Ты почти у цели.',
    'give up smoking — бросить курить.');
  V('B1', 'i', 'c', 'a piece of cake', 'проще простого', 'The test was a piece of cake.', 'Тест был проще простого.',
    'О чём-то очень лёгком.', { alt: ['easy', 'a breeze'] });
  V('B2', 'i', 'n', 'break the ice', 'растопить лёд', 'He told a joke to break the ice.', 'Он рассказал шутку, чтобы разрядить обстановку.',
    'Снять напряжение в начале общения.');
  V('B2', 'i', 'n', 'get the hang of', 'освоиться, наловчиться', "Driving is hard at first, but you'll get the hang of it.", 'Водить сначала сложно, но ты освоишься.',
    'Постепенно научиться чему-то.');
  V('B2', 'i', 'c', 'hit the road', 'отправляться в путь', "It's getting late. Let's hit the road.", 'Уже поздно. Поехали.',
    'Уходить, уезжать. Разговорно.');
  V('B2', 'i', 'n', 'on the fence', 'в нерешительности', "I'm still on the fence about the job offer.", 'Я всё ещё не решил насчёт предложения о работе.',
    'Сидеть на заборе — не выбрать сторону.');
  V('B2', 'v', 'n', 'put off', 'откладывать', "Don't put off until tomorrow what you can do today.", 'Не откладывай на завтра то, что можно сделать сегодня.',
    'Откладывать дело. put off doing something.');
  V('B2', 'i', 'n', 'cut corners', 'халтурить, экономить на качестве', "Don't cut corners on safety.", 'Не экономь на безопасности.',
    'Делать быстрее и дешевле в ущерб качеству.');
  V('B2', 'i', 'n', 'not my cup of tea', 'не в моём вкусе', 'Jazz is not my cup of tea.', 'Джаз — не моё.',
    'Вежливо сказать, что что-то не нравится.');
  V('B2', 'i', 'n', 'call it a day', 'закончить на сегодня', "We've done enough. Let's call it a day.", 'Мы достаточно сделали. На сегодня всё.',
    'Заканчиваем работу.');
  V('C1', 'i', 'n', 'beat around the bush', 'ходить вокруг да около', "Don't beat around the bush. Just tell me.", 'Не ходи вокруг да около. Просто скажи.',
    'Избегать главного.');
  V('C1', 'i', 'n', 'the elephant in the room', 'очевидная проблема, о которой молчат', "Let's talk about the elephant in the room: the budget.", 'Давайте поговорим о главном, о чём все молчат, — о бюджете.',
    'Проблема, которую все видят, но обходят.');
  V('C1', 'i', 'n', 'a blessing in disguise', 'нет худа без добра', 'Losing that job was a blessing in disguise.', 'Потеря той работы оказалась к лучшему.',
    'Неудача, которая обернулась пользой.');
  V('C1', 'i', 'n', 'bite off more than you can chew', 'взять на себя слишком много', "Don't bite off more than you can chew with this project.", 'Не бери на себя слишком много с этим проектом.',
    'Взяться за непосильное.');
  V('C1', 'i', 'n', 'go the extra mile', 'сделать больше, чем требуется', 'Our team is ready to go the extra mile for clients.', 'Наша команда готова сделать для клиентов больше, чем требуется.',
    'Приложить дополнительные усилия.');
  V('C1', 'i', 'n', 'hit the nail on the head', 'попасть в точку', 'You hit the nail on the head with that comment.', 'Этим комментарием ты попал в точку.',
    'Точно описать суть.');
  V('B2', 'p', 'n', 'Keep me posted.', 'Держи меня в курсе.', "Keep me posted. I want to know how it goes.", 'Держи меня в курсе. Хочу знать, как пройдёт.',
    'Просим сообщать новости. Также: Keep me updated.', { alt: ['Keep me updated', 'Keep me in the loop'] });

  /* ---------- индексы ---------- */
  D.slug = slug;
  D.vocab = list;
  D.byId = {};
  list.forEach(function (v) {
    if (D.byId[v.id]) console.warn('[EnglishGo] Повтор id в словаре:', v.id);
    D.byId[v.id] = v;
  });
  D.resolve = function (en) {
    var id = slug(en);
    if (D.byId[id]) return id;
    console.warn('[EnglishGo] Выражение не найдено в словаре:', en);
    return null;
  };
})(window.EG = window.EG || {});
