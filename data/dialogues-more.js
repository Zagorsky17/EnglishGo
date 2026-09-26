/* data/dialogues-more.js — дополнительные диалоги и сценарии «Разговор» всех уровней.
   Формат тот же, что в data/dialogues.js; файл подключается сразу после него и дополняет списки и индексы. */
(function (EG) {
  'use strict';

  var D = EG.data = EG.data || {};

  function O(q, en, ru, fb, next, reply, replyRu) {
    var o = { q: q, en: en, ru: ru, fb: fb || '', next: next };
    if (reply) { o.reply = reply; o.replyRu = replyRu || ''; }
    return o;
  }
  function A(t, n, note) { return { t: t, n: n, note: note || '' }; }
  function X(t, n, note) { return { t: t, n: n, note: note }; }

  var dialogues = [
    /* ---------------- A1 ---------------- */
    {
      id: 'd-bakery', topic: 'cafe', level: 'A1', title: 'В пекарне', partner: 'Baker', scenario: 's-bakery',
      setting: 'You are buying bread and something sweet in a small bakery.', settingRu: 'Вы покупаете хлеб и что-нибудь сладкое в маленькой пекарне.',
      learn: ["I'll have", 'How much is this?', "That's it, thanks.", 'Can I pay by card?'],
      start: 'a',
      nodes: {
        a: { npc: 'Good morning! What would you like?', ru: 'Доброе утро! Что желаете?', options: [
          O('best', "Morning! I'll have a loaf of brown bread, please.", 'Доброе утро! Мне буханку чёрного хлеба, пожалуйста.', 'Отлично: I\'ll have… + please — естественный заказ.', 'b'),
          O('ok', 'I want brown bread.', 'Я хочу чёрный хлеб.', 'Понятно, но I want звучит резковато. Лучше I\'ll have… / Can I get…', 'b'),
          O('wrong', 'Bread. Brown.', 'Хлеб. Чёрный.', 'Слишком отрывисто — похоже на приказ. Скажите полным предложением с please.', 'b', 'Brown bread? Sure…', 'Чёрный хлеб? Конечно…')] },
        b: { npc: 'Here you are. Anything else?', ru: 'Пожалуйста. Что-нибудь ещё?', options: [
          O('best', 'Yes, how much are the cinnamon rolls?', 'Да, сколько стоят булочки с корицей?', 'Хорошо: how much are… — для множественного числа.', 'c'),
          O('ok', 'What is the price of the rolls?', 'Какая цена у булочек?', 'Правильно, но How much are…? звучит естественнее.', 'c'),
          O('awkward', 'How much cost the rolls?', 'Сколько стоят булочки?', 'Ошибка порядка слов: How much do the rolls cost? / How much are the rolls?', 'c')] },
        c: { npc: 'They are two pounds each, or five for eight pounds.', ru: 'Две фунта за штуку или пять за восемь фунтов.', options: [
          O('best', "Great, I'll take five, then.", 'Отлично, тогда возьму пять.', 'Естественно: then — «тогда, в таком случае».', 'd'),
          O('ok', 'Okay. Five, please.', 'Хорошо. Пять, пожалуйста.', 'Хорошо и вежливо.', 'd'),
          O('awkward', 'I take five.', 'Я беру пять.', 'Решение в момент разговора — I\'ll take…', 'd')] },
        d: { npc: 'Lovely. Is that everything?', ru: 'Прекрасно. Это всё?', options: [
          O('best', "That's it, thanks. Can I pay by card?", 'Это всё, спасибо. Можно картой?', 'Отлично: That\'s it — «это всё» + вопрос об оплате.', 'end'),
          O('ok', 'Yes, everything.', 'Да, всё.', 'Понятно, но That\'s it, thanks — привычнее.', 'end'),
          O('wrong', 'Yes, it is all of me.', 'Да, это всё от меня.', 'Так не говорят. That\'s it / That\'s all, thanks.', 'end', 'Er… okay, that\'s everything then.', 'Э… хорошо, значит, всё.')] },
        end: { npc: "Of course. That's nine pounds fifty. Have a nice day!", ru: 'Конечно. С вас девять пятьдесят. Хорошего дня!', end: true }
      }
    },
    {
      id: 'd-bus', topic: 'city', level: 'A1', title: 'Билет на автобус', partner: 'Bus driver', scenario: 's-directions',
      setting: 'You get on a bus in Dublin and want to go to the city centre.', settingRu: 'Вы садитесь в автобус в Дублине и хотите доехать до центра.',
      learn: ['Does this train stop at', 'How much is this?', 'get off', 'Is it far from here?'],
      start: 'a',
      nodes: {
        a: { npc: 'Morning! Where are you going?', ru: 'Доброе утро! Куда едете?', options: [
          O('best', 'Hi! Does this bus stop at the city centre?', 'Здравствуйте! Этот автобус останавливается в центре?', 'Идеально: Does this bus stop at…?', 'b'),
          O('ok', 'City centre, please.', 'В центр, пожалуйста.', 'Коротко и понятно — так тоже говорят.', 'b'),
          O('wrong', 'I go centre.', 'Я еду центр.', 'Не хватает предлога и артикля: to the city centre.', 'b', 'The city centre? Yes, we go there.', 'В центр? Да, едем туда.')] },
        b: { npc: 'Yes, it does. A single or a return?', ru: 'Да. В одну сторону или туда и обратно?', options: [
          O('best', 'A single, please. How much is it?', 'В одну сторону, пожалуйста. Сколько стоит?', 'Отлично: single — в одну сторону, return — туда-обратно (брит.).', 'c'),
          O('ok', 'One way, please.', 'В одну сторону, пожалуйста.', 'Понятно; в Великобритании чаще говорят a single.', 'c'),
          O('awkward', 'A single man.', 'Одинокий мужчина.', 'Смешная ошибка: a single man — «холостяк». Нужно: A single ticket, please.', 'c', 'Ha! You mean a single ticket?', 'Ха! Вы имеете в виду билет в одну сторону?')] },
        c: { npc: "It's two euros forty. You can tap your card here.", ru: 'Два евро сорок. Можно приложить карту здесь.', options: [
          O('best', 'Thanks. Could you tell me when to get off?', 'Спасибо. Не подскажете, когда мне выходить?', 'Отлично: вежливая просьба Could you tell me…', 'd'),
          O('ok', 'Where do I get off?', 'Где мне выходить?', 'Хорошо и понятно.', 'd'),
          O('awkward', 'Say me the stop.', 'Скажите мне остановку.', 'say me — ошибка. Tell me / Could you tell me…', 'd')] },
        d: { npc: "Sure. It's the fifth stop, next to the big bridge.", ru: 'Конечно. Пятая остановка, возле большого моста.', options: [
          O('best', 'The fifth stop, next to the bridge. Thank you!', 'Пятая, у моста. Спасибо!', 'Отлично: повторить информацию — хорошая привычка.', 'end'),
          O('ok', 'Okay, thanks.', 'Хорошо, спасибо.', 'Нормально.', 'end'),
          O('awkward', 'Why the fifth?', 'Почему пятая?', 'Странный вопрос — водитель просто подсказал остановку.', 'end', 'Er… because that is where the centre is!', 'Э… потому что там центр!')] },
        end: { npc: 'No problem. Take a seat!', ru: 'Не за что. Садитесь!', end: true }
      }
    },
    {
      id: 'd-classmate', topic: 'greetings', level: 'A1', title: 'Новая одногруппница', partner: 'Yuki', scenario: 's-first-day',
      setting: 'It is the first lesson of an English course. The student next to you starts talking.', settingRu: 'Первое занятие на курсах английского. С вами заговаривает соседка.',
      learn: ['Nice to meet you.', 'Where are you from?', 'What do you do?', 'See you later!'],
      start: 'a',
      nodes: {
        a: { npc: "Hi! Is this seat free? I'm Yuki.", ru: 'Привет! Это место свободно? Я Юки.', options: [
          O('best', "Sure, sit down! I'm Ivan. Nice to meet you.", 'Конечно, садись! Я Иван. Приятно познакомиться.', 'Отлично: ответили на вопрос, представились, Nice to meet you.', 'b'),
          O('ok', 'Yes. My name is Ivan.', 'Да. Меня зовут Иван.', 'Правильно, но суховато. Добавьте Nice to meet you.', 'b'),
          O('wrong', 'Yes, free. Sit.', 'Да, свободно. Сиди.', 'Звучит как команда. Sure, sit down! — дружелюбнее.', 'b', 'Oh… thanks.', 'Ой… спасибо.')] },
        b: { npc: 'Nice to meet you too! Where are you from, Ivan?', ru: 'Взаимно! Откуда ты, Иван?', options: [
          O('best', "I'm from Novosibirsk, in Russia. What about you?", 'Я из Новосибирска, в России. А ты?', 'Отлично: ответ + встречный вопрос.', 'c'),
          O('ok', 'From Russia.', 'Из России.', 'Понятно, но односложно. Задайте вопрос в ответ.', 'c'),
          O('awkward', 'I am from the Russia.', 'Я из России.', 'Без артикля: from Russia.', 'c')] },
        c: { npc: "I'm from Osaka, in Japan. I work in a hotel. What do you do?", ru: 'Я из Осаки, в Японии. Работаю в отеле. А кем ты работаешь?', options: [
          O('best', "I'm an engineer. I need English for my job.", 'Я инженер. Мне нужен английский для работы.', 'Отлично: I\'m an + профессия (an — перед гласным звуком).', 'd'),
          O('ok', 'I work as engineer.', 'Я работаю инженером.', 'Почти: нужен артикль — as an engineer.', 'd'),
          O('wrong', 'I am engineer man.', 'Я инженер-мужчина.', 'Так не говорят. I\'m an engineer.', 'd', 'Oh, an engineer? Cool!', 'А, инженер? Круто!')] },
        d: { npc: 'Cool! Oh, the teacher is here. Talk later?', ru: 'Круто! О, учитель пришёл. Поговорим потом?', options: [
          O('best', 'Sure! See you after class.', 'Конечно! Увидимся после занятия.', 'Естественное дружеское завершение.', 'end'),
          O('ok', 'Yes. Bye.', 'Да. Пока.', 'Понятно, но можно теплее: See you later!', 'end'),
          O('awkward', 'Goodbye, Yuki. Have a nice life.', 'До свидания, Юки. Хорошей жизни.', 'Звучит так, будто вы прощаетесь навсегда!', 'end', 'Ha-ha, we will see each other in an hour!', 'Ха-ха, мы увидимся через час!')] },
        end: { npc: 'See you!', ru: 'Увидимся!', end: true }
      }
    },
    {
      id: 'd-weather', topic: 'smalltalk', level: 'A1', title: 'Разговор о погоде', partner: 'Neighbour',
      setting: 'You meet your neighbour at the bus stop on a cold morning.', settingRu: 'Холодным утром вы встречаете соседку на остановке.',
      learn: ["It's freezing!", 'Crazy weather, huh?', 'How was your weekend?', 'Me neither.'],
      start: 'a',
      nodes: {
        a: { npc: "Morning! It's so cold today, isn't it?", ru: 'Доброе утро! Сегодня так холодно, правда?', options: [
          O('best', "Morning! Yes, it's freezing!", 'Доброе утро! Да, просто мороз!', 'Отлично: согласились и добавили эмоцию.', 'b'),
          O('ok', 'Yes, it is cold.', 'Да, холодно.', 'Правильно, но немного сухо.', 'b'),
          O('awkward', 'I have cold.', 'У меня холод.', 'I have a cold — «я простужен». Про погоду: It\'s cold.', 'b', 'Oh no, are you ill?', 'Ой, ты заболел?')] },
        b: { npc: 'Yesterday it was sunny and warm. Crazy weather, huh?', ru: 'Вчера было солнечно и тепло. Безумная погода, да?', options: [
          O('best', 'I know! I never know what to wear.', 'Точно! Никогда не знаю, что надеть.', 'I know! — «вот именно!». Хорошее продолжение разговора.', 'c'),
          O('ok', 'Yes, crazy.', 'Да, безумная.', 'Нормально, но коротко.', 'c'),
          O('awkward', 'The weather is not crazy, it is weather.', 'Погода не безумная, это погода.', 'Слишком буквально: crazy weather — просто «странная, переменчивая погода».', 'c')] },
        c: { npc: 'Ha! Me too. How was your weekend?', ru: 'Ха! Я тоже. Как прошли выходные?', options: [
          O('best', 'It was great, thanks! I went to the mountains. How about yours?', 'Отлично, спасибо! Ездил в горы. А твои?', 'Отлично: ответ + деталь + встречный вопрос.', 'd'),
          O('ok', 'Good, thank you.', 'Хорошо, спасибо.', 'Вежливо, но разговор может закончиться. Добавьте деталь.', 'd'),
          O('wrong', 'It is Monday.', 'Сегодня понедельник.', 'Это не ответ на вопрос о выходных.', 'd', 'Er, yes… it is.', 'Э, да… понедельник.')] },
        d: { npc: 'Quiet. I stayed at home and watched films. Oh, here is our bus!', ru: 'Спокойно. Сидела дома, смотрела фильмы. О, наш автобус!', options: [
          O('best', 'Sounds nice and relaxing. Finally, the bus!', 'Звучит уютно. Наконец-то автобус!', 'Отлично: реакция на рассказ собеседника.', 'end'),
          O('ok', 'Okay. The bus.', 'Хорошо. Автобус.', 'Понятно, но реакция на её рассказ сделала бы беседу теплее.', 'end'),
          O('awkward', 'Films are boring.', 'Фильмы скучные.', 'Невежливо оценивать чужой отдых.', 'end', 'Oh… well, I liked them.', 'Ох… ну, мне понравились.')] },
        end: { npc: 'Finally! Let\'s get on — it\'s warm inside.', ru: 'Наконец-то! Садимся — внутри тепло.', end: true }
      }
    },

    /* ---------------- A2 ---------------- */
    {
      id: 'd-cinema', topic: 'plans', level: 'A2', title: 'Поход в кино', partner: 'Chris', scenario: 's-cinema',
      setting: 'Your friend Chris calls to invite you to the cinema.', settingRu: 'Друг Крис звонит и зовёт вас в кино.',
      learn: ['Are you free', 'What time works for you?', 'Sounds good!', 'Let me know.'],
      start: 'a',
      nodes: {
        a: { npc: 'Hey! Are you free on Friday evening? There is a new comedy at the cinema.', ru: 'Привет! Ты свободен в пятницу вечером? В кино новая комедия.', options: [
          O('best', 'Hey! Yes, I think so. What time does it start?', 'Привет! Да, вроде бы. Во сколько начало?', 'Отлично: согласие + уточняющий вопрос.', 'b'),
          O('ok', 'Yes, I am free.', 'Да, я свободен.', 'Правильно, но можно сразу спросить детали.', 'b'),
          O('awkward', 'Yes, I am free on Friday evening at the cinema.', 'Да, я свободен в пятницу вечером в кино.', 'Повторять весь вопрос не нужно — звучит неестественно.', 'b')] },
        b: { npc: "There's a show at seven and one at nine thirty.", ru: 'Есть сеанс в семь и в девять тридцать.', options: [
          O('best', "Seven is better for me — I have to get up early on Saturday.", 'Мне лучше в семь — в субботу рано вставать.', 'Отлично: выбор + причина.', 'c'),
          O('ok', 'Seven, please.', 'В семь, пожалуйста.', 'Понятно; please здесь лишнее — это же друг, а не касса.', 'c'),
          O('awkward', 'I want the early one because the late is late.', 'Хочу ранний, потому что поздний — поздно.', 'Нелогичное объяснение. Seven works better for me.', 'c')] },
        c: { npc: 'Cool. Should I buy the tickets online?', ru: 'Круто. Мне купить билеты онлайн?', options: [
          O('best', "Yes, please! I'll pay you back on Friday.", 'Да, пожалуйста! Верну деньги в пятницу.', 'pay back — вернуть деньги. Вежливо и честно.', 'd'),
          O('ok', 'Okay, thanks.', 'Хорошо, спасибо.', 'Нормально, но хорошо бы предложить вернуть деньги.', 'd'),
          O('wrong', 'Yes, and you pay.', 'Да, и ты платишь.', 'Звучит как требование. Предложите заплатить за себя.', 'd', 'Er… okay, you can pay me later.', 'Э… ладно, потом отдашь.')] },
        d: { npc: 'No problem. Let\'s meet at the entrance at quarter to seven?', ru: 'Без проблем. Встретимся у входа без четверти семь?', options: [
          O('best', 'Sounds good! See you there.', 'Отлично! Увидимся там.', 'Идеальное подтверждение встречи.', 'end'),
          O('ok', 'Okay, 6:45.', 'Хорошо, 6:45.', 'Понятно и коротко.', 'end'),
          O('awkward', 'What is quarter?', 'Что такое четверть?', 'quarter to seven = 6:45. Полезно знать!', 'end', 'Quarter to seven — six forty-five!', 'Без четверти семь — 6:45!')] },
        end: { npc: 'Great, see you on Friday!', ru: 'Отлично, до пятницы!', end: true }
      }
    },
    {
      id: 'd-doctor-call', topic: 'health', level: 'A2', title: 'Запись к врачу', partner: 'Receptionist', scenario: 's-phone-doctor',
      setting: 'You call a clinic because you have had a sore throat for three days.', settingRu: 'Вы звоните в клинику: три дня болит горло.',
      learn: ["I'd like to make an appointment.", 'My throat hurts', 'Hi, this is', 'What time works for you?'],
      start: 'a',
      nodes: {
        a: { npc: 'Green Street Clinic, how can I help?', ru: 'Клиника на Грин-стрит, чем могу помочь?', options: [
          O('best', "Hello, this is Maria Petrova. I'd like to make an appointment, please.", 'Здравствуйте, это Мария Петрова. Я бы хотела записаться на приём.', 'Отлично: по телефону представляются через this is…', 'b'),
          O('ok', 'Hello, I need a doctor.', 'Здравствуйте, мне нужен врач.', 'Понятно, но make an appointment — точнее и вежливее.', 'b'),
          O('awkward', 'Hello, I am Maria and I am ill person.', 'Здравствуйте, я Мария и я больной человек.', 'Неестественно. I\'m not feeling well / I\'d like to make an appointment.', 'b')] },
        b: { npc: 'Of course. What seems to be the problem?', ru: 'Конечно. На что жалуетесь?', options: [
          O('best', "My throat hurts, and I've had a slight fever for three days.", 'Болит горло, и три дня небольшая температура.', 'Отлично: have had — длится до сих пор.', 'c'),
          O('ok', 'I have throat pain.', 'У меня боль в горле.', 'Понятно; естественнее My throat hurts / I have a sore throat.', 'c'),
          O('awkward', 'My throat is ill.', 'Моё горло больное.', 'Так не говорят. My throat hurts / I have a sore throat.', 'c')] },
        c: { npc: 'I see. Dr Hughes can see you tomorrow at ten or at four.', ru: 'Понятно. Доктор Хьюз может принять вас завтра в десять или в четыре.', options: [
          O('best', "Four o'clock would be perfect, thank you.", 'Четыре часа — идеально, спасибо.', 'would be perfect — вежливо и естественно.', 'd'),
          O('ok', 'At four.', 'В четыре.', 'Понятно, но коротко.', 'd'),
          O('awkward', 'Can he come to my house?', 'Он может прийти ко мне домой?', 'Для лёгкой простуды это необычная просьба.', 'd', "I'm afraid home visits are only for emergencies.", 'Боюсь, на дом выезжают только в экстренных случаях.')] },
        d: { npc: 'Great. Can I have your date of birth, please?', ru: 'Отлично. Назовите, пожалуйста, дату рождения.', options: [
          O('best', "Sure, it's the fourteenth of May, 1995.", 'Конечно, четырнадцатое мая 1995 года.', 'Даты: the fourteenth of May — порядковое числительное.', 'end'),
          O('ok', 'Fourteen May, 1995.', 'Четырнадцать мая 1995.', 'Понятно, но правильнее: the fourteenth of May.', 'end'),
          O('wrong', 'I am thirty years.', 'Мне тридцать лет.', 'Спросили дату рождения, а не возраст.', 'end', 'Sorry, I need the date — day, month and year.', 'Простите, мне нужна дата — день, месяц, год.')] },
        end: { npc: 'Thank you. See you tomorrow at four. Get well soon!', ru: 'Спасибо. Ждём вас завтра в четыре. Выздоравливайте!', end: true }
      }
    },
    {
      id: 'd-market', topic: 'shop', level: 'A2', title: 'На рынке', partner: 'Stallholder',
      setting: 'You are at a farmers\' market and want to buy fruit.', settingRu: 'Вы на фермерском рынке и хотите купить фруктов.',
      learn: ['How much is this?', 'a good deal', "I'll take it.", 'Do you need a bag?'],
      start: 'a',
      nodes: {
        a: { npc: 'Fresh strawberries today! Want to try one?', ru: 'Сегодня свежая клубника! Хотите попробовать?', options: [
          O('best', 'Oh, yes please! Mmm, they are really sweet. How much are they?', 'О, да, спасибо! Ммм, очень сладкая. Сколько стоит?', 'Отлично: благодарность, реакция и вопрос о цене.', 'b'),
          O('ok', 'Yes. How much?', 'Да. Сколько?', 'Понятно, но коротко.', 'b'),
          O('awkward', 'No, thank you, I only buy.', 'Нет, спасибо, я только покупаю.', 'Странно отказываться от бесплатной пробы — это вежливость продавца.', 'b')] },
        b: { npc: 'Three pounds a box, or two boxes for five.', ru: 'Три фунта за коробку или две за пять.', options: [
          O('best', "That's a good deal. I'll take two boxes.", 'Выгодно. Возьму две коробки.', 'a good deal — «выгодная сделка».', 'c'),
          O('ok', 'Two boxes, please.', 'Две коробки, пожалуйста.', 'Хорошо.', 'c'),
          O('awkward', 'It is too cheap.', 'Слишком дёшево.', 'Звучит странно — будто вы жалуетесь на низкую цену.', 'c', 'Ha, most people say the opposite!', 'Ха, обычно говорят обратное!')] },
        c: { npc: 'Here you go. Do you need a bag?', ru: 'Держите. Нужен пакет?', options: [
          O('best', "No, thanks. I've got my own.", 'Нет, спасибо. У меня свой.', 'Отлично: I\'ve got my own — «у меня свой».', 'd'),
          O('ok', 'No, I have bag.', 'Нет, у меня пакет.', 'Понятно, но не хватает артикля: I have a bag.', 'd'),
          O('wrong', 'I need no.', 'Мне нужно нет.', 'Неправильный порядок слов. No, thanks.', 'd', 'Sorry? Oh — no bag. Okay.', 'Простите? А, без пакета. Хорошо.')] },
        d: { npc: 'Great. That\'s five pounds, then.', ru: 'Отлично. Тогда с вас пять фунтов.', options: [
          O('best', 'Here you are. Have a nice day!', 'Вот, пожалуйста. Хорошего дня!', 'Here you are — когда что-то передаёте.', 'end'),
          O('ok', 'Take.', 'Возьмите.', 'Грубовато. Here you are.', 'end'),
          O('awkward', 'Can I pay four?', 'Можно заплатить четыре?', 'Торговаться после согласия с ценой — невежливо.', 'end', 'Sorry, five is already a special price.', 'Извините, пять — это уже специальная цена.')] },
        end: { npc: 'Thanks! Enjoy the strawberries!', ru: 'Спасибо! Приятного аппетита!', end: true }
      }
    },
    {
      id: 'd-train', topic: 'travel', level: 'A2', title: 'Отменённый поезд', partner: 'Station staff',
      setting: 'Your train to Edinburgh has been cancelled. You go to the information desk.', settingRu: 'Ваш поезд до Эдинбурга отменили. Вы идёте в справочную.',
      learn: ['Excuse me', 'is delayed', 'Is there any way', 'a round-trip ticket'],
      start: 'a',
      nodes: {
        a: { npc: 'Hello, how can I help you?', ru: 'Здравствуйте, чем могу помочь?', options: [
          O('best', 'Hi. My train to Edinburgh was cancelled. What should I do?', 'Здравствуйте. Мой поезд до Эдинбурга отменили. Что мне делать?', 'Отлично: проблема + вопрос.', 'b'),
          O('ok', 'My train is cancelled.', 'Мой поезд отменён.', 'Понятно, но стоит сразу спросить, что делать.', 'b'),
          O('wrong', 'Why you cancel my train?!', 'Почему вы отменили мой поезд?!', 'Агрессивно и с ошибкой. Сотрудник не виноват.', 'b', "I'm sorry, it's because of a problem on the line.", 'Простите, это из-за неполадок на линии.')] },
        b: { npc: "I'm sorry about that. There's another train at 2:15, but it's quite full.", ru: 'Сожалею. Есть другой поезд в 14:15, но он довольно заполнен.', options: [
          O('best', 'Can I use my ticket on that train?', 'Можно поехать на нём по моему билету?', 'Правильный практический вопрос.', 'c'),
          O('ok', 'I take it.', 'Беру.', 'Лучше I\'ll take it — и уточнить про билет.', 'c'),
          O('awkward', 'Full is not good for me.', 'Полный мне не подходит.', 'Непонятно, что вы предлагаете. Спросите об альтернативах.', 'c')] },
        c: { npc: 'Yes, your ticket is valid on any train today.', ru: 'Да, ваш билет действует на любой поезд сегодня.', options: [
          O('best', 'Great. And which platform does it leave from?', 'Отлично. А с какой платформы он отходит?', 'Отлично: leave from — отправляться откуда-то.', 'd'),
          O('ok', 'Which platform?', 'Какая платформа?', 'Коротко, но нормально.', 'd'),
          O('awkward', 'Where is the train house?', 'Где дом поезда?', 'Так не говорят. Which platform…?', 'd')] },
        d: { npc: 'Platform six. It might be delayed by ten minutes, so check the screens.', ru: 'Шестая платформа. Может задержаться минут на десять — следите за табло.', options: [
          O('best', 'Platform six. Thank you so much for your help!', 'Шестая. Большое спасибо за помощь!', 'Тепло и естественно.', 'end'),
          O('ok', 'Okay, thanks.', 'Хорошо, спасибо.', 'Нормально.', 'end'),
          O('awkward', 'Ten minutes is terrible!', 'Десять минут — это ужасно!', 'Сотрудник вам помог — лучше поблагодарить.', 'end')] },
        end: { npc: "You're welcome. Have a good trip!", ru: 'Пожалуйста. Хорошей поездки!', end: true }
      }
    },

    /* ---------------- B1 ---------------- */
    {
      id: 'd-flatmate', topic: 'problems', level: 'B1', title: 'Разговор с соседом по квартире', partner: 'Sam', scenario: 's-flatmate',
      setting: 'Your flatmate Sam often leaves dirty dishes in the sink. You decide to talk about it.', settingRu: 'Сосед по квартире Сэм часто оставляет грязную посуду в раковине. Вы решаете поговорить.',
      learn: ['Do you have a minute?', "It's not a big deal.", 'I was wondering if', 'That makes sense.'],
      start: 'a',
      nodes: {
        a: { npc: 'Hey! What\'s up?', ru: 'Привет! Что такое?', options: [
          O('best', 'Hey, do you have a minute? I wanted to talk about the kitchen.', 'Привет, есть минутка? Хотел поговорить о кухне.', 'Отлично: мягкое начало непростого разговора.', 'b'),
          O('ok', 'We need to talk about the dishes.', 'Нам надо поговорить о посуде.', 'Понятно, но звучит напряжённо. Do you have a minute? — мягче.', 'b'),
          O('wrong', 'You are so dirty!', 'Ты такой грязнуля!', 'Обвинение сразу ставит собеседника в защиту.', 'b', 'Whoa… okay, what\'s wrong?', 'Ого… ладно, в чём дело?')] },
        b: { npc: 'Sure. Is something wrong?', ru: 'Конечно. Что-то не так?', options: [
          O('best', "It's not a big deal, but the dishes often stay in the sink for a few days.", 'Ничего страшного, но посуда часто по несколько дней лежит в раковине.', 'Отлично: смягчение + конкретный факт без обвинений.', 'c'),
          O('ok', 'You never wash your dishes.', 'Ты никогда не моешь посуду.', 'Never — преувеличение, которое обижает. Говорите о фактах.', 'c'),
          O('awkward', 'The sink is crying.', 'Раковина плачет.', 'Шутка может не сработать — лучше сказать прямо.', 'c')] },
        c: { npc: "Oh, sorry. I've been really busy with work lately.", ru: 'Ой, извини. В последнее время очень загружен на работе.', options: [
          O('best', 'I understand. I was wondering if we could make a cleaning schedule?', 'Понимаю. Может, составим график уборки?', 'Отлично: понимание + конструктивное предложение.', 'd'),
          O('ok', 'Okay, but please wash them.', 'Ладно, но, пожалуйста, мой её.', 'Нормально, но без предложения решения.', 'd'),
          O('awkward', "Everybody is busy. It's not an excuse.", 'Все заняты. Это не оправдание.', 'Жёстко — разговор может перейти в ссору.', 'd', 'Okay, okay… so what do you suggest?', 'Ладно-ладно… что предлагаешь?')] },
        d: { npc: "That makes sense. Maybe I do the dishes on weekdays, and you do them at weekends?", ru: 'Логично. Может, я мою посуду по будням, а ты по выходным?', options: [
          O('best', "Sounds fair. Thanks for being so easy to talk to!", 'Справедливо. Спасибо, что с тобой так легко договориться!', 'Отлично: согласие и благодарность — отношения сохранены.', 'end'),
          O('ok', 'Okay, deal.', 'Хорошо, договорились.', 'Нормально.', 'end'),
          O('awkward', 'Weekends are too much work for me.', 'Выходные — слишком много работы для меня.', 'Вы сами просили — теперь отказываетесь от честного предложения.', 'end', 'Hmm… okay, let\'s think again then.', 'Хм… ладно, тогда подумаем ещё.')] },
        end: { npc: "No worries. Sorry again — I'll wash everything tonight.", ru: 'Не за что. Ещё раз извини — сегодня всё перемою.', end: true }
      }
    },
    {
      id: 'd-bike', topic: 'city', level: 'B1', title: 'Прокат велосипеда', partner: 'Rental assistant',
      setting: 'You want to rent a bike for a day in Amsterdam.', settingRu: 'Вы хотите взять велосипед напрокат на день в Амстердаме.',
      learn: ['Would it be possible to', 'Is it far from here?', 'within walking distance', 'Just to clarify'],
      start: 'a',
      nodes: {
        a: { npc: 'Hi there! Looking for a bike?', ru: 'Здравствуйте! Ищете велосипед?', options: [
          O('best', "Yes, I'd like to rent one for the whole day. How much would that be?", 'Да, хочу взять на весь день. Сколько это будет стоить?', 'Отлично: I\'d like to rent… + вопрос о цене.', 'b'),
          O('ok', 'Yes, one bike for one day.', 'Да, один велосипед на один день.', 'Понятно, но telegraphic — лучше полным предложением.', 'b'),
          O('awkward', 'I want to borrow a bike.', 'Хочу одолжить велосипед.', 'borrow — бесплатно у знакомого. В прокате — rent / hire.', 'b', 'You mean rent? Sure!', 'Вы имеете в виду напрокат? Конечно!')] },
        b: { npc: "It's fifteen euros a day, including a lock. We need a deposit of fifty euros.", ru: 'Пятнадцать евро в день, замок включён. Нужен залог пятьдесят евро.', options: [
          O('best', 'Just to clarify, do I get the deposit back when I return the bike?', 'Уточню: залог вернут, когда я сдам велосипед?', 'Отлично: Just to clarify — вежливое уточнение.', 'c'),
          O('ok', 'Is the deposit returned?', 'Залог возвращается?', 'Понятно.', 'c'),
          O('awkward', "I don't want to give a deposit.", 'Я не хочу давать залог.', 'Залог — стандартное правило. Лучше уточнить условия.', 'c', "I'm afraid it's required, but you get it back.", 'Боюсь, это обязательно, но его вернут.')] },
        c: { npc: "Yes, as long as the bike is in good condition. Anything else?", ru: 'Да, если велосипед в хорошем состоянии. Что-нибудь ещё?', options: [
          O('best', 'Would it be possible to get a map with some cycling routes?', 'Можно получить карту с велосипедными маршрутами?', 'Would it be possible to… — очень вежливая просьба.', 'd'),
          O('ok', 'Do you have a map?', 'У вас есть карта?', 'Нормально.', 'd'),
          O('awkward', 'Give me a map, please.', 'Дайте мне карту, пожалуйста.', 'Повелительное наклонение звучит резко даже с please.', 'd')] },
        d: { npc: "Of course. I'd recommend the route along the river to the windmills.", ru: 'Конечно. Советую маршрут вдоль реки к мельницам.', options: [
          O('best', 'That sounds lovely. Is it far from here?', 'Звучит чудесно. Это далеко отсюда?', 'Отлично: реакция + практичный вопрос.', 'e'),
          O('ok', 'Okay. How long is it?', 'Хорошо. Какой длины?', 'Нормально.', 'e'),
          O('awkward', "I don't like windmills.", 'Я не люблю мельницы.', 'Можно, но вежливее: Thanks, maybe. Any other ideas?', 'e')] },
        e: { npc: "About ten kilometres — an easy ride, around forty minutes.", ru: 'Около десяти километров — лёгкая поездка, минут сорок.', options: [
          O('best', "Perfect. I'll take the bike, then. Here's my card for the deposit.", 'Отлично. Тогда беру велосипед. Вот карта для залога.', 'Отлично: решение + действие.', 'end'),
          O('ok', 'Good. I take it.', 'Хорошо. Беру.', 'Лучше I\'ll take it.', 'end'),
          O('wrong', 'Forty minutes by walking?', 'Сорок минут пешком?', 'Сотрудник говорил про велосипед (ride).', 'end', 'No, no — by bike!', 'Нет-нет — на велосипеде!')] },
        end: { npc: 'Great. Enjoy your ride, and watch out for the trams!', ru: 'Отлично. Приятной поездки, и осторожнее с трамваями!', end: true }
      }
    },
    {
      id: 'd-gym', topic: 'health', level: 'B1', title: 'Первый раз в спортзале', partner: 'Trainer', scenario: 's-gym',
      setting: 'It is your first visit to a new gym. A trainer comes to talk to you.', settingRu: 'Вы впервые в новом спортзале. К вам подходит тренер.',
      learn: ['pulled a muscle', 'get the hang of', "I'm up for it.", 'How often should I take it?'],
      start: 'a',
      nodes: {
        a: { npc: "Hi, I'm Dan, one of the trainers. Is this your first time here?", ru: 'Привет, я Дэн, один из тренеров. Вы здесь впервые?', options: [
          O('best', "Yes, it is. To be honest, I haven't done any sport for years.", 'Да. Честно говоря, я много лет не занимался спортом.', 'Отлично: честно и с Present Perfect.', 'b'),
          O('ok', 'Yes, first time.', 'Да, первый раз.', 'Нормально, но коротко.', 'b'),
          O('awkward', 'Yes, I am first.', 'Да, я первый.', 'I am first — «я первый (в очереди)». Нужно: It\'s my first time.', 'b')] },
        b: { npc: 'No problem at all. What are your goals?', ru: 'Ничего страшного. Какие у вас цели?', options: [
          O('best', "I'd like to get fitter and have more energy. Maybe lose a few kilos.", 'Хочу быть в лучшей форме и бодрее. Может, сбросить пару кило.', 'Отлично: конкретные цели.', 'c'),
          O('ok', 'I want to be strong.', 'Хочу быть сильным.', 'Понятно.', 'c'),
          O('awkward', 'My goal is the gym.', 'Моя цель — спортзал.', 'Непонятно. Опишите, чего хотите добиться.', 'c')] },
        c: { npc: "Good. I'd start with three short sessions a week. Any injuries I should know about?", ru: 'Хорошо. Я бы начал с трёх коротких тренировок в неделю. Есть травмы, о которых мне надо знать?', options: [
          O('best', 'I pulled a muscle in my back last year, but it\'s fine now.', 'В прошлом году потянул мышцу спины, но сейчас всё в порядке.', 'pull a muscle — потянуть мышцу. Важно сообщить тренеру.', 'd'),
          O('ok', 'No, nothing.', 'Нет, ничего.', 'Нормально, если это правда.', 'd'),
          O('awkward', 'I broke my heart.', 'Я разбил сердце.', 'Это про любовь, а не про травмы!', 'd', 'Ha, that one I can\'t fix!', 'Ха, такое я не вылечу!')] },
        d: { npc: 'Thanks for telling me. We\'ll go easy on the back exercises. Shall I show you the machines?', ru: 'Спасибо, что сказали. Со спиной будем аккуратны. Показать тренажёры?', options: [
          O('best', "Yes, please. I'm sure it'll take me a while to get the hang of them.", 'Да, пожалуйста. Уверен, мне понадобится время, чтобы освоиться.', 'get the hang of — «приноровиться, освоиться».', 'end'),
          O('ok', 'Yes, show me.', 'Да, покажите.', 'Понятно, но please было бы вежливее.', 'end'),
          O('awkward', 'No, I know everything.', 'Нет, я всё знаю.', 'Вы только что сказали, что давно не занимались.', 'end', 'Okay… but let me know if you need help!', 'Ладно… но обращайтесь, если нужна помощь!')] },
        end: { npc: "Don't worry, everyone starts somewhere. Let's go!", ru: 'Не волнуйтесь, все с чего-то начинают. Пойдём!', end: true }
      }
    },
    {
      id: 'd-dinner', topic: 'smalltalk', level: 'B1', title: 'Ужин у друзей', partner: 'Olivia',
      setting: 'You are invited to dinner at your colleague Olivia\'s house.', settingRu: 'Вас пригласили на ужин к коллеге Оливии.',
      learn: ['Good to see you!', 'It was great, thanks.', 'That sounds fun!', "I'd better get going."],
      start: 'a',
      nodes: {
        a: { npc: 'Hi! Come in, come in! So glad you could make it.', ru: 'Привет! Заходи! Так рада, что ты смог прийти.', options: [
          O('best', 'Thanks for having me! I brought some wine and dessert.', 'Спасибо за приглашение! Я принёс вино и десерт.', 'Thanks for having me — классическая фраза гостя.', 'b'),
          O('ok', 'Thank you for inviting me.', 'Спасибо, что пригласила.', 'Вежливо, чуть формальнее.', 'b'),
          O('awkward', 'Yes, I made it. Where is the food?', 'Да, я пришёл. Где еда?', 'Звучит так, будто вы пришли только поесть.', 'b', 'Ha-ha, it\'s almost ready!', 'Ха-ха, почти готово!')] },
        b: { npc: 'Oh, you shouldn\'t have! Do you have any allergies, by the way?', ru: 'Ой, не стоило! Кстати, у тебя есть аллергии?', options: [
          O('best', "No, I eat pretty much everything. It smells amazing!", 'Нет, я ем почти всё. Пахнет потрясающе!', 'Отлично: ответ + комплимент хозяйке.', 'c'),
          O('ok', 'No allergies.', 'Аллергий нет.', 'Нормально.', 'c'),
          O('awkward', 'I am allergic to boring food.', 'У меня аллергия на скучную еду.', 'Шутка может задеть хозяйку, которая готовила весь день.', 'c')] },
        c: { npc: "It's a recipe from my grandmother. So, how was your trip to Scotland?", ru: 'Это бабушкин рецепт. Ну, как съездил в Шотландию?', options: [
          O('best', 'It was great, thanks! The weather was awful, but the mountains were beautiful.', 'Отлично, спасибо! Погода была ужасная, но горы — красота.', 'Отлично: ответ с деталями — разговор продолжается.', 'd'),
          O('ok', 'Good. I liked it.', 'Хорошо. Мне понравилось.', 'Суховато для дружеского ужина.', 'd'),
          O('awkward', 'Scotland is in the north of Britain.', 'Шотландия находится на севере Британии.', 'Вас спросили о впечатлениях, а не о географии.', 'd')] },
        d: { npc: "Sounds amazing. We're thinking of going next summer.", ru: 'Звучит здорово. Мы думаем съездить следующим летом.', options: [
          O('best', "You should! I can send you a list of places we loved.", 'Обязательно поезжайте! Могу прислать список мест, которые нам понравились.', 'Дружелюбно и полезно.', 'e'),
          O('ok', 'Good idea.', 'Хорошая идея.', 'Нормально.', 'e'),
          O('awkward', 'Summer there is also bad.', 'Летом там тоже плохо.', 'Звучит пессимистично — поддержите идею.', 'e')] },
        e: { npc: "That'd be great! … Oh, it's nearly eleven already!", ru: 'Было бы здорово! … Ой, уже почти одиннадцать!', options: [
          O('best', "Wow, time flies! I'd better get going. Thanks for a lovely evening.", 'Ого, время летит! Мне пора. Спасибо за чудесный вечер.', 'I\'d better get going — вежливо, что пора уходить.', 'end'),
          O('ok', 'I must go now. Thank you.', 'Мне нужно идти. Спасибо.', 'Правильно, но немного резко.', 'end'),
          O('awkward', 'Yes, you are right, it is late. Bye.', 'Да, ты права, поздно. Пока.', 'Нужно поблагодарить хозяйку за вечер.', 'end')] },
        end: { npc: 'Thank you for coming! Get home safe.', ru: 'Спасибо, что пришёл! Хорошо добраться.', end: true }
      }
    },

    /* ---------------- B2 ---------------- */
    {
      id: 'd-feedback', topic: 'work', level: 'B2', title: 'Обратная связь от руководителя', partner: 'Helen', scenario: 's-feedback',
      setting: 'Your manager Helen gives you feedback on a presentation you gave to a client.', settingRu: 'Руководитель Хелен даёт обратную связь по вашей презентации для клиента.',
      learn: ["I'd like to hear your thoughts.", 'That\'s a good point.', 'on the same page', 'follow up'],
      start: 'a',
      nodes: {
        a: { npc: 'Thanks for staying. I wanted to give you some feedback on yesterday\'s presentation.', ru: 'Спасибо, что задержались. Хотела дать обратную связь по вчерашней презентации.', options: [
          O('best', "Of course, I'd really appreciate that.", 'Конечно, буду очень признателен.', 'Открытость к критике — сильная позиция.', 'b'),
          O('ok', 'Okay, go ahead.', 'Хорошо, слушаю.', 'Нормально, чуть сухо.', 'b'),
          O('awkward', 'Was it bad?', 'Было плохо?', 'Слишком тревожно — дайте руководителю сказать.', 'b', 'Not at all — let me explain.', 'Вовсе нет — давайте объясню.')] },
        b: { npc: 'Overall, it went well. The client loved your examples. But the data section was a bit too long.', ru: 'В целом прошло хорошо. Клиенту понравились примеры. Но раздел с данными был затянут.', options: [
          O('best', "That's a fair point. I noticed people losing focus there. How would you shorten it?", 'Справедливо. Я заметил, что там теряли внимание. Как бы вы его сократили?', 'Отлично: признание + вопрос о решении.', 'c'),
          O('ok', 'Okay, I will make it shorter.', 'Хорошо, сделаю короче.', 'Нормально, но без интереса к деталям.', 'c'),
          O('awkward', 'But the data was very important!', 'Но данные были очень важны!', 'Оборонительная реакция. Сначала выслушайте, потом аргументируйте.', 'c', 'I agree it matters — it\'s about how we present it.', 'Согласна, это важно — вопрос в подаче.')] },
        c: { npc: 'Maybe keep only the three key charts and put the rest in an appendix.', ru: 'Может, оставить три ключевых графика, а остальное в приложение.', options: [
          O('best', "Good idea. That way people who want the details still have them.", 'Хорошая идея. Так детали останутся для тех, кому они нужны.', 'Отлично: показываете, что поняли логику.', 'd'),
          O('ok', 'Yes, okay.', 'Да, хорошо.', 'Понятно.', 'd'),
          O('awkward', 'Appendix is boring.', 'Приложение — это скучно.', 'Непрофессиональная реакция.', 'd')] },
        d: { npc: 'Exactly. Could you send me the revised version by Thursday?', ru: 'Именно. Пришлёте исправленную версию к четвергу?', options: [
          O('best', "Sure. I'll send it by Wednesday evening so you have time to review it.", 'Конечно. Пришлю в среду вечером, чтобы у вас было время посмотреть.', 'Отлично: берёте инициативу с запасом.', 'end'),
          O('ok', 'Yes, by Thursday.', 'Да, к четвергу.', 'Нормально.', 'end'),
          O('awkward', "I'll try, but I have a lot of work.", 'Постараюсь, но у меня много работы.', 'Звучит как оправдание заранее. Если сроки нереальны — обсудите конкретно.', 'end', 'Let me know if Thursday is a problem.', 'Скажите, если четверг — проблема.')] },
        end: { npc: 'Perfect. Honestly, great job overall. Keep it up!', ru: 'Отлично. Честно, в целом отличная работа. Так держать!', end: true }
      }
    },
    {
      id: 'd-landlord', topic: 'problems', level: 'B2', title: 'Сломанный бойлер', partner: 'Mr Grant', scenario: 's-landlord',
      setting: 'The boiler in your flat has broken down in winter. You call your landlord.', settingRu: 'Зимой в квартире сломался бойлер. Вы звоните арендодателю.',
      learn: ["There's a problem with", "won't turn on", "I'd appreciate it if", 'Is there any way'],
      start: 'a',
      nodes: {
        a: { npc: 'Hello, Grant speaking.', ru: 'Алло, Грант слушает.', options: [
          O('best', "Hello Mr Grant, it's Alex from flat 4. I'm afraid there's a problem with the boiler.", 'Здравствуйте, мистер Грант, это Алекс из 4-й квартиры. Боюсь, проблема с бойлером.', 'I\'m afraid… — вежливое введение плохой новости.', 'b'),
          O('ok', 'Hello, the boiler is broken.', 'Здравствуйте, бойлер сломан.', 'Понятно, но стоит представиться.', 'b'),
          O('wrong', 'Your boiler is rubbish again!', 'Ваш бойлер опять барахло!', 'Грубо — с арендодателем лучше сохранять хорошие отношения.', 'b', "There's no need for that tone.", 'Не нужно таким тоном.')] },
        b: { npc: 'Oh dear. What exactly is happening?', ru: 'Ох. Что именно происходит?', options: [
          O('best', "It won't turn on, and there's been no hot water or heating since last night.", 'Он не включается, и со вчерашнего вечера нет горячей воды и отопления.', 'Отлично: won\'t turn on + Present Perfect для длительности.', 'c'),
          O('ok', "It doesn't work.", 'Он не работает.', 'Слишком общо — дайте подробности.', 'c'),
          O('awkward', 'It is dead.', 'Он мёртв.', 'Разговорно и неточно. Опишите симптомы.', 'c')] },
        c: { npc: 'I see. I can ask a plumber to come on Monday.', ru: 'Понятно. Могу попросить сантехника прийти в понедельник.', options: [
          O('best', "I'd appreciate it if someone could come sooner — it's below zero outside and we have a baby.", 'Был бы признателен, если бы кто-то пришёл раньше — на улице минус, а у нас малыш.', 'Вежливая настойчивость + веская причина.', 'd'),
          O('ok', 'Monday is too late for us.', 'Понедельник для нас слишком поздно.', 'Понятно, но без объяснения причины.', 'd'),
          O('awkward', 'Okay, Monday.', 'Хорошо, понедельник.', 'Вы соглашаетесь провести выходные без отопления — стоит настоять вежливо.', 'd', 'Great, Monday it is.', 'Отлично, значит, понедельник.')] },
        d: { npc: "You're right, that's not acceptable. I'll call an emergency service today.", ru: 'Вы правы, так нельзя. Сегодня же вызову аварийную службу.', options: [
          O('best', 'Thank you, I really appreciate it. Could you let me know what time they\'ll come?', 'Спасибо, очень признателен. Сообщите, во сколько они придут?', 'Отлично: благодарность + практичный вопрос.', 'e'),
          O('ok', 'Thanks.', 'Спасибо.', 'Нормально, но стоит уточнить время.', 'e'),
          O('awkward', 'Finally.', 'Наконец-то.', 'Звучит неблагодарно — он пошёл вам навстречу.', 'e')] },
        e: { npc: 'Of course. And I\'ll bring you an electric heater in the meantime.', ru: 'Конечно. А пока привезу вам электрообогреватель.', options: [
          O('best', "That's very kind of you. Thanks for sorting this out so quickly.", 'Очень любезно. Спасибо, что так быстро всё решаете.', 'sort out — улаживать. Тёплое завершение.', 'end'),
          O('ok', 'Good, thank you.', 'Хорошо, спасибо.', 'Нормально.', 'end'),
          O('awkward', 'A heater is not enough.', 'Обогревателя недостаточно.', 'Он уже решает проблему — лишняя претензия портит отношения.', 'end')] },
        end: { npc: "No problem. I'll text you once I've spoken to them.", ru: 'Не за что. Напишу, как только поговорю с ними.', end: true }
      }
    },
    {
      id: 'd-networking', topic: 'greetings', level: 'B2', title: 'Нетворкинг на конференции', partner: 'Daniel',
      setting: 'During a coffee break at a marketing conference, a stranger starts a conversation.', settingRu: 'В кофе-брейк на маркетинговой конференции с вами заговаривает незнакомец.',
      learn: ["I don't think we've met.", 'What brings you here?', "Let's keep in touch.", 'It was nice talking to you.'],
      start: 'a',
      nodes: {
        a: { npc: "Hi, I don't think we've met. I'm Daniel, from BrightAds.", ru: 'Здравствуйте, кажется, мы не знакомы. Я Дэниел из BrightAds.', options: [
          O('best', 'Nice to meet you, Daniel. I\'m Kira — I work in digital marketing at a travel start-up.', 'Приятно познакомиться, Дэниел. Я Кира — занимаюсь цифровым маркетингом в тревел-стартапе.', 'Отлично: имя + краткая «визитка».', 'b'),
          O('ok', 'Hello, I am Kira.', 'Здравствуйте, я Кира.', 'Нормально, но добавьте, чем занимаетесь.', 'b'),
          O('awkward', 'I know. We have not met.', 'Знаю. Мы не встречались.', 'Звучит холодно — это же приглашение к знакомству.', 'b')] },
        b: { npc: 'Oh, interesting! What brings you to the conference?', ru: 'О, интересно! Что привело вас на конференцию?', options: [
          O('best', "Mainly the talk on AI in advertising. We're trying to figure out how to use it without losing the personal touch.", 'В основном доклад об ИИ в рекламе. Пытаемся понять, как его использовать, не теряя «человечности».', 'Отлично: конкретика даёт тему для разговора.', 'c'),
          O('ok', 'I want to learn new things.', 'Хочу узнать новое.', 'Слишком общо.', 'c'),
          O('awkward', 'My boss sent me.', 'Меня отправил начальник.', 'Честно, но звучит так, будто вам неинтересно.', 'c', 'Ha, fair enough!', 'Ха, понятно!')] },
        c: { npc: "Same here, actually. We've been experimenting with it for a few months.", ru: 'У нас то же самое. Мы экспериментируем с этим несколько месяцев.', options: [
          O('best', "Really? I'd love to hear how it's going. What's worked best so far?", 'Правда? Очень интересно, как успехи. Что пока работает лучше всего?', 'Открытый вопрос — лучший инструмент нетворкинга.', 'd'),
          O('ok', 'Is it good?', 'И как, хорошо?', 'Нормально, но закрытый вопрос сужает беседу.', 'd'),
          O('awkward', 'We are better at it, I think.', 'Думаю, у нас лучше получается.', 'Соревновательный тон отталкивает.', 'd')] },
        d: { npc: "Mostly personalising email subject lines. Open rates went up by about twenty percent. Anyway, I should find my next session.", ru: 'В основном персонализация тем писем. Открываемость выросла процентов на двадцать. Впрочем, мне пора на следующую секцию.', options: [
          O('best', "That's impressive. Let's keep in touch — could I add you on LinkedIn?", 'Впечатляет. Давайте поддерживать связь — могу добавить вас в LinkedIn?', 'Отлично: естественный переход к обмену контактами.', 'end'),
          O('ok', 'Okay, bye.', 'Хорошо, пока.', 'Упущенная возможность обменяться контактами.', 'end'),
          O('awkward', 'Can you send me all your data?', 'Можете прислать мне все ваши данные?', 'Слишком навязчиво для первого знакомства.', 'end', "Hmm, I'm afraid that's confidential.", 'Хм, боюсь, это конфиденциально.')] },
        end: { npc: "Absolutely. It was nice talking to you, Kira. Enjoy the rest of the conference!", ru: 'Конечно. Приятно было пообщаться, Кира. Хорошей конференции!', end: true }
      }
    },
    {
      id: 'd-apology', topic: 'reactions', level: 'B2', title: 'Извинение перед другом', partner: 'Nina',
      setting: 'You forgot your friend Nina\'s birthday party last weekend. You meet her in a café.', settingRu: 'Вы забыли про день рождения подруги Нины в прошлые выходные. Встречаетесь с ней в кафе.',
      learn: ["I didn't mean to", 'No harm done.', "I'm sorry to hear that.", 'I can imagine.'],
      start: 'a',
      nodes: {
        a: { npc: "Oh. Hi.", ru: 'А. Привет.', options: [
          O('best', "Nina, I owe you a huge apology. I completely forgot about your party, and I feel terrible.", 'Нина, я должен тебе огромное извинение. Я совсем забыл про твою вечеринку, мне ужасно стыдно.', 'Отлично: прямое извинение без оправданий.', 'b'),
          O('ok', 'Sorry about Saturday.', 'Извини за субботу.', 'Слишком коротко для такой ситуации.', 'b'),
          O('wrong', "Hi! Why are you so cold with me?", 'Привет! Почему ты такая холодная со мной?', 'Вы переводите вину на неё.', 'b', 'Seriously? You don\'t know?', 'Серьёзно? Ты не знаешь?')] },
        b: { npc: "I kept checking my phone all evening. I thought something had happened to you.", ru: 'Я весь вечер проверяла телефон. Думала, с тобой что-то случилось.', options: [
          O('best', "I can imagine how that felt. There's no excuse — I didn't mean to let you down.", 'Представляю, каково это было. Мне нет оправдания — я не хотел тебя подвести.', 'Признание её чувств — ключ к искреннему извинению.', 'c'),
          O('ok', "I didn't want this to happen.", 'Я не хотел, чтобы так вышло.', 'Нормально.', 'c'),
          O('awkward', 'I was very busy, you know.', 'Я был очень занят, знаешь ли.', 'Оправдание обесценивает извинение.', 'c', 'Busy? Everyone is busy.', 'Занят? Все заняты.')] },
        c: { npc: "Well… I appreciate you saying that.", ru: 'Ну… Спасибо, что говоришь это.', options: [
          O('best', "Can I make it up to you? Let me take you out for dinner this weekend — my treat.", 'Можно я заглажу вину? Приглашаю тебя на ужин в выходные — я угощаю.', 'make it up to someone — загладить вину.', 'd'),
          O('ok', 'So are we okay now?', 'Так мы помирились?', 'Слишком быстро — дайте ей время.', 'd'),
          O('awkward', 'Good, so let\'s forget about it.', 'Хорошо, значит, забудем.', 'Звучит так, будто вам неважны её чувства.', 'd')] },
        d: { npc: "Okay. But you're choosing a really good restaurant!", ru: 'Ладно. Но ресторан выбираешь очень хороший!', options: [
          O('best', "Deal! And I've set three reminders for your next birthday.", 'Договорились! И я поставил три напоминания на твой следующий день рождения.', 'Лёгкий юмор после серьёзного разговора снимает напряжение.', 'end'),
          O('ok', 'Of course.', 'Конечно.', 'Нормально.', 'end'),
          O('awkward', 'Expensive ones are not always good.', 'Дорогие не всегда хорошие.', 'Сейчас не время спорить о ресторанах.', 'end')] },
        end: { npc: 'Ha! Okay, no harm done. Now tell me what I missed at work.', ru: 'Ха! Ладно, ничего страшного. А теперь рассказывай, что я пропустила на работе.', end: true }
      }
    },

    /* ---------------- C1 ---------------- */
    {
      id: 'd-salary', topic: 'work', level: 'C1', title: 'Переговоры о зарплате', partner: 'HR Director', scenario: 's-negotiation',
      setting: 'You have received a job offer and are negotiating the salary with the HR director.', settingRu: 'Вы получили оффер и обсуждаете зарплату с HR-директором.',
      learn: ['I see your point, but', 'bring to the table', 'Having said that', "I'd have to disagree."],
      start: 'a',
      nodes: {
        a: { npc: 'We\'re delighted to offer you the position. The starting salary would be fifty-two thousand.', ru: 'Рады предложить вам должность. Стартовая зарплата — пятьдесят две тысячи.', options: [
          O('best', "Thank you, I'm genuinely excited about the role. Having said that, I was hoping for something closer to sixty, given my experience.", 'Спасибо, я искренне рад этой роли. Однако я рассчитывал на сумму ближе к шестидесяти с учётом моего опыта.', 'Отлично: благодарность + вежливая, аргументированная контрпозиция.', 'b'),
          O('ok', 'I would like more money.', 'Я бы хотел больше денег.', 'Прямолинейно и без аргументов — слабая позиция.', 'b'),
          O('wrong', "That's far too low. I won't accept it.", 'Это слишком мало. Я не соглашусь.', 'Ультиматум в начале переговоров сужает пространство для манёвра.', 'b', "I see. Well, I'm not sure how much flexibility there is.", 'Понятно. Не уверена, что есть пространство для манёвра.')] },
        b: { npc: "I understand. Our budget for this band is quite tight, though.", ru: 'Понимаю. Но бюджет для этой грейдовой вилки довольно ограничен.', options: [
          O('best', "I appreciate that. I'd point out that I'd be bringing direct experience with the exact platform you're migrating to, which should shorten the onboarding considerably.", 'Понимаю. Замечу, что у меня прямой опыт с платформой, на которую вы переходите, — это заметно сократит адаптацию.', 'Отлично: аргумент ценности, а не личных потребностей.', 'c'),
          O('ok', 'But I have a lot of experience.', 'Но у меня большой опыт.', 'Верно, но размыто. Покажите конкретную ценность.', 'c'),
          O('awkward', 'Another company offered me more.', 'Другая компания предложила больше.', 'Может сработать, но без деталей звучит как блеф.', 'c', 'Then you may want to consider that offer.', 'Тогда, возможно, стоит рассмотреть то предложение.')] },
        c: { npc: "That's a fair point. I could go up to fifty-six, plus a review after six months.", ru: 'Справедливо. Могу поднять до пятидесяти шести плюс пересмотр через полгода.', options: [
          O('best', "That's a step in the right direction. Would it be possible to put the six-month review and its criteria in writing?", 'Это шаг в правильном направлении. Можно ли зафиксировать пересмотр через полгода и его критерии письменно?', 'Отлично: принимаете движение и закрепляете условия.', 'd'),
          O('ok', 'Okay, I accept fifty-six.', 'Хорошо, принимаю пятьдесят шесть.', 'Приемлемо, но стоит закрепить условия пересмотра.', 'd'),
          O('awkward', 'Only fifty-six? Come on.', 'Всего пятьдесят шесть? Да ладно.', 'Пренебрежение к уступке портит атмосферу.', 'd')] },
        d: { npc: "Certainly. I'll include clear performance targets in the contract.", ru: 'Конечно. Включу в договор чёткие показатели эффективности.', options: [
          O('best', 'In that case, I\'m happy to accept. I look forward to getting started.', 'В таком случае я с радостью принимаю. С нетерпением жду начала работы.', 'Чёткое и позитивное завершение переговоров.', 'end'),
          O('ok', 'Good. Deal.', 'Хорошо. Договорились.', 'Нормально, но суховато.', 'end'),
          O('awkward', 'And can I also have more holidays?', 'А можно ещё отпуск побольше?', 'Новые требования после договорённости выглядят как неуважение к процессу.', 'end', "Let's keep to what we've agreed, shall we?", 'Давайте придерживаться достигнутого, хорошо?')] },
        end: { npc: 'Wonderful. Welcome aboard!', ru: 'Чудесно. Добро пожаловать в команду!', end: true }
      }
    },
    {
      id: 'd-team-conflict', topic: 'opinions', level: 'C1', title: 'Конфликт в команде', partner: 'Marcus',
      setting: 'As a team lead, you talk to Marcus, who has been openly criticising a colleague\'s work in meetings.', settingRu: 'Вы тимлид и говорите с Маркусом, который открыто критикует работу коллеги на встречах.',
      learn: ['I take your point', 'The way I see it', 'on the same page', "That's debatable."],
      start: 'a',
      nodes: {
        a: { npc: "You wanted to see me?", ru: 'Вы хотели меня видеть?', options: [
          O('best', "Yes, thanks for coming. I wanted to talk about how yesterday's meeting went — I'd like to hear your side first.", 'Да, спасибо, что пришёл. Хотел обсудить вчерашнюю встречу — сначала хочу выслушать тебя.', 'Отлично: начинаете с вопроса, а не с обвинения.', 'b'),
          O('ok', 'Yes. We need to talk about your behaviour.', 'Да. Нам нужно поговорить о твоём поведении.', 'Жёстко: собеседник сразу занимает оборону.', 'b'),
          O('wrong', 'You were totally out of line yesterday.', 'Ты вчера перешёл все границы.', 'Обвинение без разговора обостряет конфликт.', 'b', "Excuse me? I was just being honest.", 'Простите? Я просто был честен.')] },
        b: { npc: "Look, Priya's report had serious errors. Someone had to say it.", ru: 'Слушайте, в отчёте Прии были серьёзные ошибки. Кто-то должен был это сказать.', options: [
          O('best', "I take your point about the errors — they did need addressing. My concern is more about how and where it was raised.", 'Про ошибки я согласен — их нужно было обсудить. Меня больше беспокоит, как и где это было сказано.', 'Отлично: разделяете суть и форму.', 'c'),
          O('ok', 'Maybe, but you were rude.', 'Может быть, но ты был груб.', 'Честно, но формулировка вызывает спор.', 'c'),
          O('awkward', 'Her report was fine.', 'С её отчётом всё было в порядке.', 'Вы отрицаете реальные ошибки — теряете доверие.', 'c', 'With respect, it really wasn\'t.', 'При всём уважении, это не так.')] },
        c: { npc: "So what, I should just stay quiet when something's wrong?", ru: 'И что, мне молчать, когда что-то не так?', options: [
          O('best', "Not at all. The way I see it, feedback like that lands better one-to-one first. In front of the client, it undermined the whole team.", 'Вовсе нет. На мой взгляд, такая обратная связь лучше работает сначала один на один. При клиенте это подорвало доверие ко всей команде.', 'Объясняете последствия, а не морализируете.', 'd'),
          O('ok', 'No, but be nicer.', 'Нет, но будь помягче.', 'Слишком расплывчато.', 'd'),
          O('awkward', 'Yes, that would be better.', 'Да, так было бы лучше.', 'Вы призываете скрывать проблемы — это вредно.', 'd', 'That seems like a bad idea for quality.', 'Это плохо скажется на качестве.')] },
        d: { npc: "…I hadn't thought about the client being there. Fair enough.", ru: '…Я не подумал о том, что там был клиент. Справедливо.', options: [
          O('best', "I appreciate you hearing me out. Would you be willing to go through the report with Priya this week?", 'Спасибо, что выслушал. Готов на этой неделе разобрать отчёт вместе с Прией?', 'Переход к конструктивному действию.', 'end'),
          O('ok', 'Good. Don\'t do it again.', 'Хорошо. Больше так не делай.', 'Решение принято, но тон командный.', 'end'),
          O('awkward', 'I knew you would agree eventually.', 'Я знал, что ты в итоге согласишься.', 'Самодовольство сводит на нет достигнутое.', 'end')] },
        end: { npc: "Yeah, I can do that. And I'll apologise to her for the way I said it.", ru: 'Да, могу. И извинюсь перед ней за то, как это сказал.', end: true }
      }
    },
    {
      id: 'd-qa', topic: 'work', level: 'C1', title: 'Вопросы после презентации', partner: 'Audience member',
      setting: 'You have just presented a new product strategy to senior management. Now it is Q&A time.', settingRu: 'Вы представили новую стратегию продукта руководству. Время вопросов.',
      learn: ["That's a good point.", 'Just to clarify', "I'll get back to you.", 'As far as I know'],
      start: 'a',
      nodes: {
        a: { npc: "Thanks. My concern is the timeline. Isn't launching in March rather ambitious?", ru: 'Спасибо. Меня беспокоят сроки. Запуск в марте — не слишком ли амбициозно?', options: [
          O('best', "That's a fair concern. It is ambitious, which is why we've built in a two-week buffer and a phased rollout.", 'Обоснованное опасение. Это амбициозно, поэтому мы заложили двухнедельный запас и поэтапный запуск.', 'Признали риск и показали, как им управляете.', 'b'),
          O('ok', 'No, it is realistic.', 'Нет, это реально.', 'Без аргументов звучит неубедительно.', 'b'),
          O('awkward', "Everything is ambitious if you think negatively.", 'Всё амбициозно, если мыслить негативно.', 'Звучит как упрёк спрашивающему.', 'b', "I'm simply asking about risk.", 'Я просто спрашиваю о рисках.')] },
        b: { npc: 'And what happens if the supplier delays the components?', ru: 'А если поставщик задержит комплектующие?', options: [
          O('best', "Good question. We've already identified a second supplier, although their unit cost is about eight percent higher.", 'Хороший вопрос. У нас уже есть второй поставщик, хотя его цена за единицу примерно на восемь процентов выше.', 'Честно называете и решение, и его цену.', 'c'),
          O('ok', 'We will find another supplier.', 'Найдём другого поставщика.', 'Слишком общо.', 'c'),
          O('awkward', "That won't happen.", 'Такого не случится.', 'Отрицание риска подрывает доверие.', 'c', "With respect, you can't guarantee that.", 'При всём уважении, вы не можете этого гарантировать.')] },
        c: { npc: 'Do you have figures on how that would affect the margin?', ru: 'Есть ли цифры, как это повлияет на маржу?', options: [
          O('best', "I don't have the exact figure to hand, and I'd rather not guess. I'll get back to you with it by the end of the day.", 'Точной цифры под рукой нет, и гадать не хочу. Пришлю её до конца дня.', 'Отлично: честно признаёте и берёте обязательство.', 'd'),
          O('ok', 'Maybe two or three percent.', 'Может, два-три процента.', 'Догадки на встрече с руководством рискованны.', 'd'),
          O('awkward', 'That is not my department.', 'Это не мой отдел.', 'Уход от ответственности на своей же презентации.', 'd')] },
        d: { npc: 'Fine. Overall, I think it\'s a strong proposal.', ru: 'Хорошо. В целом, думаю, предложение сильное.', options: [
          O('best', "Thank you — and thanks for the challenging questions. They'll help us stress-test the plan.", 'Спасибо — и спасибо за непростые вопросы. Они помогут проверить план на прочность.', 'Благодарность за критику — признак зрелости.', 'end'),
          O('ok', 'Thank you very much.', 'Большое спасибо.', 'Нормально.', 'end'),
          O('awkward', 'I know.', 'Я знаю.', 'Самоуверенно и невежливо.', 'end')] },
        end: { npc: "Looking forward to the figures. Thanks, everyone.", ru: 'Жду цифры. Всем спасибо.', end: true }
      }
    },
    {
      id: 'd-decline', topic: 'plans', level: 'C1', title: 'Вежливый отказ', partner: 'Rachel', scenario: 's-diplomatic',
      setting: 'Rachel, a senior colleague, asks you to lead a volunteer project. You are already overloaded.', settingRu: 'Старшая коллега Рэйчел просит вас возглавить волонтёрский проект. Вы и так перегружены.',
      learn: ['I was wondering if', 'Having said that', 'take a rain check', "I'm swamped."],
      start: 'a',
      nodes: {
        a: { npc: "I was wondering if you'd be interested in leading our new mentoring programme. You'd be perfect for it.", ru: 'Хотела спросить, не возьмётесь ли вы руководить новой программой наставничества. Вы идеально подходите.', options: [
          O('best', "That's really kind of you to think of me, and it sounds like a great initiative.", 'Очень приятно, что вы подумали обо мне, и инициатива звучит отлично.', 'Начните с признательности — отказ воспримут мягче.', 'b'),
          O('ok', 'Thank you, but I have a lot of work.', 'Спасибо, но у меня много работы.', 'Слишком быстрый отказ.', 'b'),
          O('wrong', 'No, I really don\'t have time for that.', 'Нет, у меня точно нет на это времени.', 'Резко и может обидеть старшую коллегу.', 'b', 'Oh. Right. Sorry I asked.', 'А. Понятно. Извините, что спросила.')] },
        b: { npc: "So is that a yes?", ru: 'Значит, да?', options: [
          O('best', "Having said that, I'm fully committed to the Q3 launch until October, and I wouldn't be able to give the programme the attention it deserves.", 'Однако до октября я полностью занят запуском в третьем квартале и не смогу уделить программе должного внимания.', 'Отказ с конкретной причиной и заботой о качестве проекта.', 'c'),
          O('ok', "I'm swamped at the moment.", 'Сейчас я завален работой.', 'Понятно, но коротко — может показаться отговоркой.', 'c'),
          O('awkward', 'Maybe. I don\'t know. Perhaps.', 'Может. Не знаю. Возможно.', 'Неопределённость хуже вежливого «нет».', 'c', "I'll need a clear answer by Friday.", 'Мне нужен чёткий ответ к пятнице.')] },
        c: { npc: "I understand. That's a shame, though.", ru: 'Понимаю. Жаль, конечно.', options: [
          O('best', "Could I suggest Tom? He's been keen to take on more responsibility. And I'd be glad to run one session myself once the launch is over.", 'Могу предложить Тома? Он хотел больше ответственности. А после запуска я с радостью проведу одно занятие сам.', 'Альтернатива + частичное участие — отказ превращается в помощь.', 'end'),
          O('ok', 'Maybe next year.', 'Может, в следующем году.', 'Нормально, но без конкретики.', 'end'),
          O('awkward', 'Yes, but it is not my problem.', 'Да, но это не моя проблема.', 'Грубо — отношения испорчены.', 'end', 'Well, thanks anyway.', 'Что ж, всё равно спасибо.')] },
        end: { npc: "That's a great idea — I'll talk to Tom. And I'll hold you to that session!", ru: 'Отличная идея — поговорю с Томом. И я запомню про занятие!', end: true }
      }
    }
  ];

  var scenarios = [
    /* ---------------- A1 ---------------- */
    {
      id: 's-bakery', topic: 'cafe', level: 'A1', title: 'Пекарня', partner: 'Baker',
      setting: 'You are in a bakery.', settingRu: 'Вы в пекарне.',
      closing: 'Thank you! Have a lovely day.', closingRu: 'Спасибо! Хорошего дня.',
      turns: [
        { npc: 'Hello! What can I get you?', npcRu: 'Здравствуйте! Что вам?', intent: 'Попросите два круассана.',
          accepted: [A('Can I get two croissants, please?', 98), A("I'll have two croissants, please.", 97), A('Two croissants, please.', 95), A("I'd like two croissants, please.", 90)],
          keywords: ['two|2', 'croissant'],
          distractors: [X('I want croissants.', 40, 'I want звучит требовательно, и нет количества.')],
          better: 'Can I get two croissants, please?', betterRu: 'Можно мне два круассана?',
          explain: 'Can I get… / I\'ll have… + количество + please.', learn: ['Can I get'] },
        { npc: 'Sure. Anything else?', npcRu: 'Конечно. Что-нибудь ещё?', intent: 'Спросите, сколько стоит шоколадный торт.',
          accepted: [A('How much is the chocolate cake?', 98), A('How much does the chocolate cake cost?', 94), A("What's the price of the chocolate cake?", 88)],
          keywords: ['how much|price|cost', 'cake'],
          distractors: [X('How much cost the cake?', 40, 'Порядок слов: How much is… / How much does… cost?')],
          better: 'How much is the chocolate cake?', betterRu: 'Сколько стоит шоколадный торт?',
          explain: 'How much is…? — самый естественный вопрос о цене.', learn: ['How much is this?'] },
        { npc: "It's twelve pounds for the whole cake.", npcRu: 'Двенадцать фунтов за целый торт.', intent: 'Скажите, что это всё, и спасибо.',
          accepted: [A("That's it, thanks.", 98), A("That's all, thank you.", 96), A('No, that is all, thanks.', 94), A("Just the croissants, thanks.", 95)],
          keywords: ['that is it|that is all|just|nothing else'],
          distractors: [X('It is all of me.', 20, 'Так не говорят. That\'s it / That\'s all, thanks.')],
          better: "That's it, thanks.", betterRu: 'Это всё, спасибо.',
          explain: 'That\'s it / That\'s all — «это всё».', learn: ["That's it, thanks."] }
      ]
    },
    {
      id: 's-directions', topic: 'city', level: 'A1', title: 'Как пройти', partner: 'Passer-by',
      setting: 'You are looking for the museum in a new city.', settingRu: 'Вы ищете музей в незнакомом городе.',
      closing: 'You\'re welcome. Enjoy the museum!', closingRu: 'Не за что. Приятного посещения!',
      turns: [
        { npc: 'Hi, can I help you?', npcRu: 'Здравствуйте, вам помочь?', intent: 'Спросите, как пройти к музею.',
          accepted: [A('Yes, please. How do I get to the museum?', 98), A('How do I get to the museum?', 96), A('Where is the museum, please?', 90), A('Could you tell me the way to the museum?', 95)],
          keywords: ['museum', 'how|where|way'],
          distractors: [X('Museum where?', 30, 'Постройте полный вопрос: Where is the museum?')],
          better: 'Yes, please. How do I get to the museum?', betterRu: 'Да, пожалуйста. Как пройти к музею?',
          explain: 'How do I get to…? — стандартный вопрос о дороге.', learn: ['How do I get to'] },
        { npc: 'Go straight and turn right at the church.', npcRu: 'Идите прямо и у церкви поверните направо.', intent: 'Спросите, далеко ли это.',
          accepted: [A('Is it far from here?', 98), A('Is it far?', 96), A('How far is it?', 95), A('How long does it take to walk?', 90)],
          keywords: ['far|how long'],
          distractors: [],
          better: 'Is it far from here?', betterRu: 'Это далеко отсюда?',
          explain: 'Is it far (from here)? — обратный порядок слов в вопросе.', learn: ['Is it far from here?'] },
        { npc: "No, it's about five minutes on foot.", npcRu: 'Нет, минут пять пешком.', intent: 'Поблагодарите.',
          accepted: [A('Great, thank you so much!', 98), A('Thanks a lot!', 96), A('Thank you for your help!', 96), A('Thanks!', 92)],
          keywords: ['thank|thanks|cheers'],
          distractors: [],
          better: 'Great, thank you so much!', betterRu: 'Отлично, большое спасибо!',
          explain: 'Thank you so much / Thanks a lot — тёплая благодарность.' }
      ]
    },

    /* ---------------- A2 ---------------- */
    {
      id: 's-cinema', topic: 'plans', level: 'A2', title: 'Приглашение в кино', partner: 'Chris',
      setting: 'Your friend Chris suggests going to the cinema.', settingRu: 'Друг Крис предлагает сходить в кино.',
      closing: 'Great, see you at eight!', closingRu: 'Отлично, увидимся в восемь!',
      turns: [
        { npc: 'Do you want to see a film on Saturday?', npcRu: 'Хочешь сходить на фильм в субботу?', intent: 'Согласитесь с радостью.',
          accepted: [A("I'd love to!", 98), A('Sure, sounds great!', 97), A("Yes, that sounds good!", 96), A("Yeah, I'm in!", 95), A('Yes, why not?', 88)],
          keywords: ['love to|sure|yes|yeah|sounds|in|why not|of course|great'],
          distractors: [X('Yes, I want.', 40, 'Незаконченная фраза. I\'d love to! / Sure!')],
          better: "I'd love to!", betterRu: 'С удовольствием!',
          explain: 'I\'d love to! — тёплое согласие на приглашение.', learn: ["I'd love to!"] },
        { npc: 'Cool! What kind of films do you like?', npcRu: 'Круто! Какие фильмы ты любишь?', intent: 'Скажите, что любите комедии.',
          accepted: [A('I love comedies.', 98), A("I'm really into comedies.", 96), A('I like comedies most.', 90), A('Comedies, definitely!', 94)],
          keywords: ['comedy|comedies'],
          distractors: [X('I like comedy films very.', 40, 'very нельзя в конце: I like comedies very much.')],
          better: "I'm really into comedies.", betterRu: 'Я очень люблю комедии.',
          explain: 'be into — «увлекаться, любить» (разговорное).' },
        { npc: 'Perfect. What time works for you?', npcRu: 'Отлично. Во сколько тебе удобно?', intent: 'Предложите встретиться в восемь.',
          accepted: [A('How about eight?', 98), A('Eight works for me.', 97), A("Let's meet at eight.", 96), A('Is eight okay?', 94)],
          keywords: ['eight|8'],
          distractors: [X('In eight.', 40, 'О времени — предлог at: at eight.')],
          better: 'How about eight?', betterRu: 'Как насчёт восьми?',
          explain: 'How about…? — предложение. At eight — «в восемь».', learn: ['How about', 'What time works for you?'] }
      ]
    },
    {
      id: 's-phone-doctor', topic: 'health', level: 'A2', title: 'Звонок в клинику', partner: 'Receptionist',
      setting: 'You call a clinic because you feel ill.', settingRu: 'Вы звоните в клинику, потому что плохо себя чувствуете.',
      closing: 'See you tomorrow. Get well soon!', closingRu: 'Ждём вас завтра. Выздоравливайте!',
      turns: [
        { npc: 'Hello, City Clinic. How can I help?', npcRu: 'Алло, Городская клиника. Чем помочь?', intent: 'Скажите, что хотите записаться на приём.',
          accepted: [A("Hello, I'd like to make an appointment, please.", 98), A('Hi, can I make an appointment?', 96), A("I'd like to book an appointment with a doctor.", 96)],
          keywords: ['appointment'],
          distractors: [X('I want doctor.', 30, 'Неполно и резко. I\'d like to make an appointment.')],
          better: "Hello, I'd like to make an appointment, please.", betterRu: 'Здравствуйте, я бы хотел записаться на приём.',
          explain: 'make/book an appointment — записаться на приём.', learn: ["I'd like to make an appointment."] },
        { npc: "Sure. What's the problem?", npcRu: 'Конечно. Что вас беспокоит?', intent: 'Скажите, что болит голова и есть температура.',
          accepted: [A('I have a headache and a fever.', 98), A("I've got a headache and a temperature.", 97), A('My head hurts and I have a fever.', 95)],
          keywords: ['headache|head', 'fever|temperature'],
          distractors: [X('My head is ill.', 30, 'Так не говорят. I have a headache.')],
          better: "I've got a headache and a temperature.", betterRu: 'У меня болит голова и температура.',
          explain: 'have a headache / a fever (a temperature — брит.).', learn: ['I have a headache'] },
        { npc: 'The doctor can see you tomorrow at nine.', npcRu: 'Врач примет вас завтра в девять.', intent: 'Согласитесь и поблагодарите.',
          accepted: [A('Nine is fine. Thank you!', 98), A('That works for me, thanks.', 97), A('Great, thank you very much.', 95), A('Perfect, thanks!', 95)],
          keywords: ['thank|thanks|fine|great|perfect|works'],
          distractors: [],
          better: 'Nine is fine. Thank you!', betterRu: 'Девять — подходит. Спасибо!',
          explain: 'That works for me — «мне подходит».' }
      ]
    },

    /* ---------------- B1 ---------------- */
    {
      id: 's-flatmate', topic: 'problems', level: 'B1', title: 'Сосед и музыка', partner: 'Leo',
      setting: 'Your flatmate Leo plays loud music late at night. You need to sleep.', settingRu: 'Сосед Лео поздно вечером громко включает музыку. Вам нужно выспаться.',
      closing: "No worries, I'll use headphones.", closingRu: 'Без проблем, буду в наушниках.',
      turns: [
        { npc: "Hey! Want to join me? I've got a great playlist.", npcRu: 'Привет! Присоединишься? У меня отличный плейлист.', intent: 'Вежливо откажитесь и скажите, что завтра рано вставать.',
          accepted: [A("Thanks, but I have to get up early tomorrow.", 98), A("Maybe another time — I've got an early start tomorrow.", 98), A("Sorry, I can't. I need to get up early tomorrow.", 96)],
          keywords: ['early'],
          distractors: [X('No. Your music is bad.', 15, 'Грубо — и не по делу.')],
          better: "Thanks, but I've got an early start tomorrow.", betterRu: 'Спасибо, но завтра рано вставать.',
          explain: 'an early start — «рано начинать день». Сначала поблагодарите за приглашение.', learn: ['Maybe another time.'] },
        { npc: 'Oh, okay. No problem.', npcRu: 'А, ладно. Без проблем.', intent: 'Попросите сделать музыку потише.',
          accepted: [A('Would you mind turning the music down a bit?', 98), A('Could you turn the music down, please?', 97), A('Could you keep the music down a little?', 96), A('Would it be possible to turn it down a bit?', 96)],
          keywords: ['down|quieter|lower|quiet'],
          distractors: [X('Stop the music!', 20, 'Приказ звучит агрессивно. Would you mind…?')],
          better: 'Would you mind turning the music down a bit?', betterRu: 'Не мог бы ты сделать музыку потише?',
          explain: 'turn down — убавить. Would you mind + -ing — очень вежливая просьба.', learn: ['Would it be possible to'] },
        { npc: 'Sure, sorry! Was it too loud?', npcRu: 'Конечно, извини! Было слишком громко?', intent: 'Скажите, что ничего страшного, просто стены тонкие.',
          accepted: [A("It's not a big deal, the walls are just really thin.", 98), A("No worries, it's just that the walls are thin.", 97), A("Don't worry about it — the walls are pretty thin.", 96)],
          keywords: ['wall'],
          distractors: [X('Yes, it was terrible.', 30, 'Сосед уже извинился — не стоит нагнетать.')],
          better: "It's not a big deal — the walls are just really thin.", betterRu: 'Ничего страшного — просто стены очень тонкие.',
          explain: 'Смягчите ситуацию: it\'s not a big deal / don\'t worry about it.', learn: ["It's not a big deal.", "Don't worry about it."] }
      ]
    },
    {
      id: 's-gym', topic: 'health', level: 'B1', title: 'Запись в спортзал', partner: 'Receptionist',
      setting: 'You want to join a gym.', settingRu: 'Вы хотите записаться в спортзал.',
      closing: "Great, you're all set. Welcome!", closingRu: 'Отлично, всё оформлено. Добро пожаловать!',
      turns: [
        { npc: 'Hi! How can I help you?', npcRu: 'Здравствуйте! Чем могу помочь?', intent: 'Спросите о ценах на абонемент.',
          accepted: [A("Hi, I'm interested in joining. How much is a membership?", 98), A('How much does a monthly membership cost?', 97), A('Could you tell me about your membership prices?', 96)],
          keywords: ['membership|join|price|cost|how much'],
          distractors: [X('Price of gym?', 30, 'Неполная фраза. How much is a membership?')],
          better: "Hi, I'm interested in joining. How much is a membership?", betterRu: 'Здравствуйте, хочу записаться. Сколько стоит абонемент?',
          explain: 'membership — абонемент, членство. be interested in joining — хочу присоединиться.' },
        { npc: "It's forty pounds a month, or three hundred for a year.", npcRu: 'Сорок фунтов в месяц или триста за год.', intent: 'Спросите, можно ли сначала попробовать бесплатное занятие.',
          accepted: [A('Is it possible to try a free session first?', 98), A('Can I have a free trial first?', 97), A('Do you offer a free trial?', 96)],
          keywords: ['free|trial|try'],
          distractors: [X('I want free.', 20, 'Звучит странно. Do you offer a free trial?')],
          better: 'Do you offer a free trial?', betterRu: 'У вас есть бесплатное пробное занятие?',
          explain: 'a free trial — бесплатный пробный период.' },
        { npc: 'Yes, your first visit is free. When would you like to come?', npcRu: 'Да, первое посещение бесплатно. Когда хотите прийти?', intent: 'Скажите, что придёте завтра после работы.',
          accepted: [A("I'll come tomorrow after work.", 98), A('Tomorrow after work, if that works.', 96), A('How about tomorrow after work?', 96)],
          keywords: ['tomorrow', 'after work|evening'],
          distractors: [X('I come tomorrow after the work.', 45, 'Будущее решение — I\'ll come; after work без артикля.')],
          better: "I'll come tomorrow after work.", betterRu: 'Приду завтра после работы.',
          explain: 'Решение в момент речи — will. after work — без артикля.' }
      ]
    },

    /* ---------------- B2 ---------------- */
    {
      id: 's-feedback', topic: 'work', level: 'B2', title: 'Разбор проекта', partner: 'Helen',
      setting: 'Your manager is giving you feedback on a report.', settingRu: 'Руководитель даёт вам обратную связь по отчёту.',
      closing: "Great, I'll look out for it.", closingRu: 'Отлично, буду ждать.',
      turns: [
        { npc: 'The report is good overall, but the conclusions feel a bit rushed.', npcRu: 'Отчёт в целом хороший, но выводы кажутся поспешными.', intent: 'Согласитесь и спросите, что именно улучшить.',
          accepted: [A("That's a fair point. What would you like me to expand on?", 98), A('I agree. Which part should I develop further?', 96), A("You're right. Could you tell me what's missing?", 96)],
          keywords: ['fair|agree|right|point', 'what|which|how'],
          distractors: [X('No, the conclusions are fine.', 25, 'Оборонительная реакция без аргументов.')],
          better: "That's a fair point. What would you like me to expand on?", betterRu: 'Справедливо. Что мне стоит раскрыть подробнее?',
          explain: 'Признайте замечание и уточните, чего ждут. expand on — раскрыть подробнее.', learn: ["That's a good point."] },
        { npc: 'Mainly the budget impact. The board will ask about it.', npcRu: 'В основном влияние на бюджет. Совет директоров об этом спросит.', intent: 'Скажите, что добавите анализ бюджета к пятнице.',
          accepted: [A("I'll add a budget analysis by Friday.", 98), A('I can include a section on the budget by Friday.', 97), A("I'll have the budget analysis ready by Friday.", 97)],
          keywords: ['budget', 'friday'],
          distractors: [X('I will try maybe to add it.', 40, 'Неуверенно. Дайте чёткое обязательство.')],
          better: "I'll have the budget analysis ready by Friday.", betterRu: 'Подготовлю анализ бюджета к пятнице.',
          explain: 'by Friday — «к пятнице». Чёткий срок показывает ответственность.' },
        { npc: 'Perfect. Anything you need from me?', npcRu: 'Отлично. Вам что-то от меня нужно?', intent: 'Попросите доступ к финансовым данным за прошлый год.',
          accepted: [A("Could I get access to last year's financial data?", 98), A("It would help to see last year's figures, if possible.", 96), A("Would you mind sharing last year's financial data?", 97)],
          keywords: ['last year', 'data|figures|numbers|financial'],
          distractors: [X('Give me the data.', 25, 'Повелительная форма звучит резко с руководителем.')],
          better: "Could I get access to last year's financial data?", betterRu: 'Можно получить доступ к финансовым данным за прошлый год?',
          explain: 'Could I get access to…? — вежливая рабочая просьба.' }
      ]
    },
    {
      id: 's-landlord', topic: 'problems', level: 'B2', title: 'Звонок арендодателю', partner: 'Mr Grant',
      setting: 'The heating in your flat is not working. You call your landlord.', settingRu: 'В квартире не работает отопление. Вы звоните арендодателю.',
      closing: "I'll text you the time. Sorry again.", closingRu: 'Напишу вам время. Ещё раз извините.',
      turns: [
        { npc: 'Hello, Grant speaking.', npcRu: 'Алло, Грант слушает.', intent: 'Представьтесь и скажите, что не работает отопление.',
          accepted: [A("Hi Mr Grant, it's Alex from flat 4. I'm afraid the heating isn't working.", 98), A("Hello, this is Alex from flat 4. The heating has stopped working.", 97), A("Hi, it's Alex. There's a problem with the heating.", 96)],
          keywords: ['heating|boiler|radiator', 'this is|it is|i am'],
          distractors: [X('Your heating is broken.', 45, 'Представьтесь сначала; «your heating» звучит как упрёк.')],
          better: "Hi Mr Grant, it's Alex from flat 4. I'm afraid the heating isn't working.", betterRu: 'Здравствуйте, мистер Грант, это Алекс из 4-й. Боюсь, не работает отопление.',
          explain: 'По телефону: it\'s / this is + имя. I\'m afraid… смягчает плохую новость.', learn: ["There's a problem with", 'Hi, this is'] },
        { npc: 'Oh no. I can send someone next week.', npcRu: 'Ох. Могу прислать кого-нибудь на следующей неделе.', intent: 'Вежливо попросите прислать мастера раньше, потому что очень холодно.',
          accepted: [A("I'd appreciate it if someone could come sooner — it's freezing in here.", 98), A("Is there any way someone could come sooner? It's really cold.", 98), A("Would it be possible to send someone earlier? It's freezing.", 97)],
          keywords: ['sooner|earlier|today|tomorrow|asap|as soon as', 'cold|freezing'],
          distractors: [X('Next week? Are you joking?', 20, 'Сарказм испортит разговор.')],
          better: "I'd appreciate it if someone could come sooner — it's freezing in here.", betterRu: 'Был бы признателен, если бы кто-то пришёл раньше — здесь ледяной холод.',
          explain: 'I\'d appreciate it if… / Is there any way… — вежливая настойчивость.', learn: ["I'd appreciate it if", 'Is there any way'] },
        { npc: "You're right. I'll arrange for a plumber to come tomorrow morning.", npcRu: 'Вы правы. Договорюсь, чтобы сантехник пришёл завтра утром.', intent: 'Поблагодарите и попросите сообщить точное время.',
          accepted: [A("Thank you, that's great. Could you let me know the exact time?", 98), A('Thanks so much. Can you tell me what time they will come?', 96), A("I really appreciate it. Please let me know the time.", 96)],
          keywords: ['thank|thanks|appreciate', 'time|when'],
          distractors: [X('Finally. What time?', 35, 'Звучит раздражённо — арендодатель пошёл навстречу.')],
          better: "Thank you, that's great. Could you let me know the exact time?", betterRu: 'Спасибо, отлично. Сообщите, пожалуйста, точное время.',
          explain: 'let me know — «сообщите мне».', learn: ['Let me know.'] }
      ]
    },

    /* ---------------- C1 ---------------- */
    {
      id: 's-negotiation', topic: 'work', level: 'C1', title: 'Обсуждение оффера', partner: 'HR Director',
      setting: 'You are negotiating a job offer.', settingRu: 'Вы обсуждаете условия предложения о работе.',
      closing: "Excellent. I'll send the updated contract today.", closingRu: 'Отлично. Сегодня пришлю обновлённый договор.',
      turns: [
        { npc: 'We can offer you fifty thousand a year.', npcRu: 'Мы можем предложить пятьдесят тысяч в год.', intent: 'Поблагодарите и вежливо скажите, что рассчитывали на пятьдесят пять с учётом опыта.',
          accepted: [A("Thank you. Given my experience, I was hoping for something closer to fifty-five.", 98), A("I appreciate the offer. I was expecting around fifty-five, considering my background.", 97), A("Thank you — though with my experience in mind, I was hoping for fifty-five.", 96)],
          keywords: ['thank|thanks|appreciate', 'fifty five|55|fifty-five', 'experience|background|skills'],
          distractors: [X('Fifty is too low for me.', 40, 'Прямолинейно и без аргументов.')],
          better: 'Thank you. Given my experience, I was hoping for something closer to fifty-five.', betterRu: 'Спасибо. С учётом моего опыта я рассчитывал на сумму ближе к пятидесяти пяти.',
          explain: 'I was hoping for… — мягкая форма запроса. Given… — «с учётом…».' },
        { npc: "That's above our range, I'm afraid.", npcRu: 'Боюсь, это выше нашей вилки.', intent: 'Предложите компромисс: пятьдесят две тысячи плюс пересмотр через полгода.',
          accepted: [A("Would you consider fifty-two, with a salary review after six months?", 98), A("Could we meet halfway — fifty-two and a review in six months?", 97), A("How about fifty-two plus a performance review after six months?", 96)],
          keywords: ['fifty two|52|fifty-two', 'six months|6 months|review'],
          distractors: [X('Then I leave.', 15, 'Ультиматум закрывает переговоры.')],
          better: 'Would you consider fifty-two, with a salary review after six months?', betterRu: 'Рассмотрите ли вы пятьдесят две с пересмотром через полгода?',
          explain: 'Would you consider…? / meet halfway — предложение компромисса.' },
        { npc: 'I think we can work with that.', npcRu: 'Думаю, так мы сможем договориться.', intent: 'Примите и выразите готовность начать работу.',
          accepted: [A("Wonderful. In that case, I'm happy to accept, and I'm looking forward to getting started.", 98), A("Great, then I accept. I'm really looking forward to joining the team.", 97), A("That sounds fair. I'm happy to accept.", 95)],
          keywords: ['accept|deal|agree|happy'],
          distractors: [X('Okay, but I also want more holidays.', 30, 'Новые требования после соглашения — дурной тон.')],
          better: "Wonderful. In that case, I'm happy to accept.", betterRu: 'Чудесно. В таком случае я с радостью принимаю.',
          explain: 'In that case… — «в таком случае». Завершите позитивно.', learn: ['looking forward to'] }
      ]
    },
    {
      id: 's-diplomatic', topic: 'opinions', level: 'C1', title: 'Дипломатичное несогласие', partner: 'Rachel',
      setting: 'In a meeting, a senior colleague proposes cutting the training budget. You disagree.', settingRu: 'На совещании старшая коллега предлагает урезать бюджет на обучение. Вы не согласны.',
      closing: "Let's look at the numbers together, then.", closingRu: 'Тогда давайте вместе посмотрим на цифры.',
      turns: [
        { npc: 'I think we should cut the training budget by half this year.', npcRu: 'Думаю, в этом году нужно урезать бюджет на обучение вдвое.', intent: 'Признайте её довод, но выразите несогласие.',
          accepted: [A("I see your point, but I'm not sure that's the right place to cut.", 98), A("I take your point about costs, but I'd have to disagree on training.", 98), A("I understand the reasoning, but I have some reservations about that.", 96)],
          keywords: ['see your point|take your point|understand|appreciate', 'but|however|although'],
          distractors: [X('That is a stupid idea.', 5, 'Оскорбление недопустимо.'), X('No.', 20, 'Слишком резко без аргументов.')],
          better: "I see your point, but I'm not sure training is the right place to cut.", betterRu: 'Понимаю вашу мысль, но не уверен, что стоит экономить именно на обучении.',
          explain: 'Сначала признайте довод (I see your point), затем but + своя позиция.', learn: ['I see your point, but', "I'd have to disagree."] },
        { npc: "Why? It's the easiest cost to reduce.", npcRu: 'Почему? Это самая простая статья для сокращения.', intent: 'Объясните: без обучения вырастет текучесть кадров, а замена сотрудников дороже.',
          accepted: [A("The way I see it, cutting training would increase staff turnover, and replacing people costs far more.", 98), A("If we cut training, more people will leave, and hiring replacements is much more expensive.", 97), A("My concern is that turnover would rise, and recruiting new staff costs more than training.", 96)],
          keywords: ['leave|turnover|quit|staff', 'cost|expensive|more'],
          distractors: [X('Because training is nice.', 25, 'Нужен деловой аргумент, а не личное мнение.')],
          better: 'The way I see it, cutting training would increase turnover — and replacing people costs far more.', betterRu: 'На мой взгляд, сокращение обучения увеличит текучесть — а замена людей стоит гораздо дороже.',
          explain: 'The way I see it… — мягкое введение аргумента. Опирайтесь на последствия и цифры.', learn: ['The way I see it'] },
        { npc: 'Hmm. Do you have figures to support that?', npcRu: 'Хм. У вас есть цифры в подтверждение?', intent: 'Скажите, что подготовите данные к следующей встрече.',
          accepted: [A("Not to hand, but I'll put the figures together before our next meeting.", 98), A("I'll prepare the numbers for our next meeting.", 97), A("I can get back to you with the data before the next meeting.", 96)],
          keywords: ['figures|numbers|data', 'next meeting|next week|before'],
          distractors: [X('No, but I am sure.', 30, 'Уверенность без данных не убеждает.')],
          better: "Not to hand, but I'll put the figures together before our next meeting.", betterRu: 'Не под рукой, но подготовлю цифры к следующей встрече.',
          explain: 'to hand — «под рукой». I\'ll get back to you — «вернусь с ответом».', learn: ["I'll get back to you."] }
      ]
    }
  ];

  dialogues.forEach(function (d) { D.dialogues.push(d); D.dialoguesById[d.id] = d; });
  scenarios.forEach(function (s) { D.scenarios.push(s); D.scenariosById[s.id] = s; });
})(window.EG = window.EG || {});
