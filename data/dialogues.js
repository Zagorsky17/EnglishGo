/* data/dialogues.js — ветвящиеся диалоги и сценарии режима «Разговор».
   Диалог: узлы {npc, ru, options:[O(качество, en, ru, разбор, следующий узел, ответ собеседника?, перевод?)]}
   качество: best — естественно, ok — допустимо, awkward — неестественно, wrong — ошибка
   Сценарий: реплики {npc, npcRu, intent (задача), accepted:[{t, n — естественность 0–100, note}],
   keywords (все группы «a|b» должны быть в ответе, чтобы смысл считался переданным), distractors, better, explain, learn} */
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

  /* ======================================================================
     ДИАЛОГИ
     ====================================================================== */
  D.dialogues = [
    /* ---------------- A1 ---------------- */
    {
      id: 'd-coffee', topic: 'cafe', level: 'A1', title: 'Кофе с собой', partner: 'Barista', scenario: 's-coffee',
      setting: 'You are at a coffee shop in New York.', settingRu: 'Вы в кофейне в Нью-Йорке.',
      learn: ['Can I get', 'To go, please.', 'Can I pay by card?'],
      start: 'a',
      nodes: {
        a: { npc: 'Hi there! What can I get for you?', ru: 'Здравствуйте! Что вам предложить?', options: [
          O('best', 'Hi! Can I get a cappuccino, please?', 'Здравствуйте! Можно мне капучино?', 'Идеально: приветствие + Can I get… + please.', 'b'),
          O('ok', 'I would like a cappuccino.', 'Я бы хотел капучино.', 'Правильно, но звучит официально для кофейни. Сокращение I\'d like — естественнее.', 'b'),
          O('wrong', 'I want cappuccino.', 'Я хочу капучино.', '«I want» звучит требовательно. И нужен артикль: a cappuccino.', 'b', 'Uh… sure. One cappuccino.', 'Э… конечно. Один капучино.')] },
        b: { npc: 'Sure! What size?', ru: 'Конечно! Какой размер?', options: [
          O('best', 'Medium, please.', 'Средний, пожалуйста.', 'Коротко и вежливо — именно так отвечают.', 'c'),
          O('ok', 'A medium one.', 'Средний.', 'Понятно, но please сделало бы ответ вежливее.', 'c'),
          O('awkward', 'Middle size.', 'Средний размер.', 'Размеры в кафе: small, medium, large. «Middle» так не говорят.', 'c', 'Medium? Okay.', 'Средний? Хорошо.')] },
        c: { npc: 'For here or to go?', ru: 'Здесь или с собой?', options: [
          O('best', 'To go, please.', 'С собой, пожалуйста.', 'Отлично — стандартный ответ.', 'd'),
          O('ok', "I'll take it with me.", 'Возьму с собой.', 'Понятно, но носители почти всегда говорят просто To go.', 'd'),
          O('wrong', 'With me.', 'С собой.', 'Калька с русского. Ответ: To go, please.', 'd', 'Sorry? Oh — to go. Got it.', 'Простите? А, с собой. Понял.')] },
        d: { npc: 'Can I get a name for the order?', ru: 'Как вас записать (имя для заказа)?', options: [
          O('best', "Sure, it's Anna.", 'Конечно, Анна.', 'Естественно: Sure + it\'s + имя.', 'e'),
          O('ok', 'My name is Anna.', 'Меня зовут Анна.', 'Правильно, но чуть формально. В кафе достаточно It\'s Anna.', 'e'),
          O('awkward', 'I am Anna.', 'Я Анна.', 'Так представляются при знакомстве. Для заказа — It\'s Anna.', 'e')] },
        e: { npc: "Great, that's $4.50. It'll be ready in a minute!", ru: 'Отлично, с вас 4,50. Будет готово через минуту!', options: [
          O('best', 'Thanks! Can I pay by card?', 'Спасибо! Можно картой?', 'Отлично: благодарность + вопрос об оплате.', 'end'),
          O('ok', 'Okay, here you go.', 'Хорошо, вот.', 'Хорошо — так говорят, протягивая деньги или карту.', 'end'),
          O('awkward', 'Give me the coffee.', 'Дайте мне кофе.', 'Грубо. Бариста сам отдаст кофе, когда он будет готов.', 'end', 'It will be ready in a minute…', 'Будет готово через минуту…')] },
        end: { npc: "Here's your cappuccino. Have a great day!", ru: 'Вот ваш капучино. Хорошего дня!', end: true }
      }
    },
    {
      id: 'd-neighbour', topic: 'greetings', level: 'A1', title: 'Новый сосед', partner: 'Jake', scenario: 's-first-day',
      setting: 'You just moved into a new apartment. A neighbor says hello in the hallway.', settingRu: 'Вы только что переехали. Сосед здоровается с вами в коридоре.',
      learn: ['Nice to meet you.', 'Where are you from?', 'What do you do?'],
      start: 'a',
      nodes: {
        a: { npc: "Hi! Are you new here? I'm Jake, from 4B.", ru: 'Привет! Вы новенький? Я Джейк из 4B.', options: [
          O('best', "Hi Jake! Yes, I just moved in. I'm Max. Nice to meet you.", 'Привет, Джейк! Да, только переехал. Я Макс. Приятно познакомиться.', 'Отлично: ответили, представились и сказали Nice to meet you.', 'b'),
          O('ok', 'Yes. My name is Max.', 'Да. Меня зовут Макс.', 'Правильно, но суховато. Добавьте Nice to meet you — и разговор потеплеет.', 'b'),
          O('wrong', 'Yes, I am new. Goodbye.', 'Да, я новый. До свидания.', 'Вы оборвали знакомство. Ответьте и представьтесь.', 'b', 'Oh… okay. Well, welcome anyway!', 'Ох… ладно. Ну, добро пожаловать!')] },
        b: { npc: 'Nice to meet you too! Where are you from?', ru: 'Взаимно! Откуда вы?', options: [
          O('best', "I'm from Russia. How about you?", 'Я из России. А вы?', 'Хорошо: ответ + встречный вопрос поддерживает разговор.', 'c'),
          O('ok', 'Russia.', 'Россия.', 'Понятно, но односложно. I\'m from Russia + встречный вопрос — лучше.', 'c'),
          O('awkward', 'I am from the Russia.', 'Я из России.', 'Перед названиями большинства стран артикль не нужен: from Russia.', 'c')] },
        c: { npc: "I'm from Chicago, born and raised. So, what do you do?", ru: 'Я из Чикаго, коренной. А кем работаешь?', options: [
          O('best', "I'm a software developer. I work from home.", 'Я разработчик. Работаю из дома.', 'Отлично! I\'m a + профессия.', 'd'),
          O('ok', 'My job is programmer.', 'Моя работа — программист.', 'Понятно, но неестественно. Говорят I\'m a programmer.', 'd'),
          O('wrong', 'I do programs.', 'Я делаю программы.', 'Так не говорят. I\'m a programmer / I write software.', 'd', "Oh, you mean you're a programmer? Cool.", 'А, то есть ты программист? Круто.')] },
        d: { npc: 'Cool! Well, if you need anything, just knock on my door.', ru: 'Круто! Если что-то понадобится — стучи.', options: [
          O('best', "Thanks, that's really kind of you! See you around.", 'Спасибо, очень мило! Ещё увидимся.', 'Тепло и естественно. See you around — «ещё увидимся».', 'end'),
          O('ok', 'Thank you very much.', 'Большое спасибо.', 'Вежливо. Можно добавить See you around.', 'end'),
          O('awkward', 'Okay. Bye.', 'Ладно. Пока.', 'Звучит холодно в ответ на доброе предложение. Поблагодарите.', 'end')] },
        end: { npc: 'See you around, Max!', ru: 'Ещё увидимся, Макс!', end: true }
      }
    },
    {
      id: 'd-jacket', topic: 'shop', level: 'A1', title: 'Примерка куртки', partner: 'Sales assistant', scenario: 's-shop',
      setting: 'You are in a clothing store.', settingRu: 'Вы в магазине одежды.',
      learn: ["I'm just looking, thanks.", 'Can I try it on?', "It's a bit too small.", "I'll take it."],
      start: 'a',
      nodes: {
        a: { npc: 'Hi! Can I help you find anything?', ru: 'Здравствуйте! Помочь вам что-нибудь найти?', options: [
          O('best', "I'm just looking, thanks.", 'Я просто смотрю, спасибо.', 'Идеальный вежливый ответ, если помощь не нужна.', 'b'),
          O('ok', 'No, thank you.', 'Нет, спасибо.', 'Вежливо, но I\'m just looking звучит мягче.', 'b'),
          O('wrong', 'No. Go away.', 'Нет. Уходите.', 'Очень грубо! Скажите I\'m just looking, thanks.', 'b', 'Oh! Um… okay.', 'Ой! Эм… ладно.')] },
        b: { npc: 'Sure! Oh, that jacket is new this week.', ru: 'Конечно! О, эта куртка — новинка недели.', options: [
          O('best', "It's nice! Can I try it on?", 'Красивая! Можно примерить?', 'Отлично: try on — примерить.', 'c'),
          O('ok', 'Can I put it on?', 'Можно надеть?', 'Понятно, но в магазине говорят try on — примерить.', 'c'),
          O('awkward', 'Can I test it?', 'Можно протестировать?', 'test — для техники. Одежду — try on.', 'c')] },
        c: { npc: 'Of course! The fitting rooms are over there. What size are you?', ru: 'Конечно! Примерочные вон там. Какой у вас размер?', options: [
          O('best', 'Usually a medium.', 'Обычно M.', 'Естественно: usually смягчает, если не уверены.', 'd'),
          O('ok', 'M size.', 'Размер M.', 'Понятно, но говорят просто medium или a medium.', 'd'),
          O('awkward', 'My size is middle.', 'Мой размер средний.', 'Размеры: small, medium, large.', 'd')] },
        d: { npc: 'How does it fit?', ru: 'Как сидит?', options: [
          O('best', "It's a bit too small. Do you have it in a large?", 'Маловата. Есть размер L?', 'Отлично: a bit смягчает, и сразу просьба.', 'e'),
          O('ok', 'It is small.', 'Она маленькая.', 'Понятно. A bit too small + вопрос о другом размере — естественнее.', 'e'),
          O('wrong', "It's not fit.", 'Не подходит.', 'Ошибка: It doesn\'t fit — не подходит по размеру.', 'e')] },
        e: { npc: "Here's a large. Better?", ru: 'Вот L. Лучше?', options: [
          O('best', 'Perfect! How much is it?', 'Идеально! Сколько стоит?', 'Коротко и естественно.', 'f'),
          O('ok', 'Yes. What is the price?', 'Да. Какая цена?', 'Правильно, но How much is it? — естественнее.', 'f'),
          O('awkward', 'Yes. How much it costs?', 'Да. Сколько стоит?', 'Порядок слов: How much does it cost?', 'f')] },
        f: { npc: "It's $60, but it's 20% off today.", ru: 'Она стоит 60 долларов, но сегодня скидка 20%.', options: [
          O('best', "Great, I'll take it!", 'Отлично, беру!', 'В момент решения — I\'ll take it.', 'end'),
          O('ok', 'Okay, I buy it.', 'Хорошо, покупаю.', 'Решение прямо сейчас выражают через will: I\'ll take it.', 'end'),
          O('awkward', 'Can you make it cheaper?', 'Можно дешевле?', 'В сетевых магазинах торговаться не принято — цена фиксированная.', 'end', 'Sorry, the price is already reduced.', 'Извините, цена уже снижена.')] },
        end: { npc: 'Great choice! You can pay at the register.', ru: 'Отличный выбор! Оплатить можно на кассе.', end: true }
      }
    },
    {
      id: 'd-directions', topic: 'city', level: 'A1', title: 'Как пройти к вокзалу', partner: 'Passer-by', scenario: 's-taxi',
      setting: 'You are lost in London and need to find the train station.', settingRu: 'Вы заблудились в Лондоне и ищете вокзал.',
      learn: ['How do I get to', 'Go straight', 'turn left', 'a five-minute walk', "You can't miss it."],
      start: 'a',
      nodes: {
        a: { npc: 'You look a bit lost. Can I help?', ru: 'Вы, кажется, заблудились. Помочь?', options: [
          O('best', 'Yes, please! How do I get to the train station?', 'Да, пожалуйста! Как добраться до вокзала?', 'Отлично: вежливо и точно.', 'b'),
          O('ok', 'Yes. Where is the train station?', 'Да. Где вокзал?', 'Нормально. How do I get to… — чуть вежливее.', 'b'),
          O('wrong', 'Train station. Where?', 'Вокзал. Где?', 'Звучит как команда. Постройте вопрос: Where is the train station?', 'b', 'The train station? Sure.', 'Вокзал? Конечно.')] },
        b: { npc: 'Go straight for two blocks, then turn left at the bank.', ru: 'Идите прямо два квартала, потом у банка налево.', options: [
          O('best', 'Straight for two blocks, then left at the bank. Got it.', 'Прямо два квартала, у банка налево. Понял.', 'Отлично! Повторить маршрут — лучший способ проверить, что вы поняли.', 'c'),
          O('ok', 'Okay, thank you.', 'Хорошо, спасибо.', 'Хорошо, но повторить маршрут — полезная привычка.', 'c'),
          O('awkward', 'Speak slower.', 'Говорите медленнее.', 'Звучит как приказ. Could you speak a little slower, please?', 'c', 'Sure. Straight… two blocks… left at the bank.', 'Конечно. Прямо… два квартала… у банка налево.')] },
        c: { npc: "It's about a five-minute walk. You can't miss it.", ru: 'Минут пять пешком. Не пропустите.', options: [
          O('best', 'Great, thanks so much for your help!', 'Отлично, большое спасибо за помощь!', 'Тепло и естественно.', 'end'),
          O('ok', 'Thanks.', 'Спасибо.', 'Нормально. Чуть теплее: Thanks so much!', 'end'),
          O('wrong', 'I miss it?', 'Я пропущу?', 'You can\'t miss it — «точно не пропустите». Это подбадривание, а не вопрос.', 'end', "No, no — I mean it's easy to find!", 'Нет-нет, я имею в виду, его легко найти!')] },
        end: { npc: 'No problem. Enjoy London!', ru: 'Не за что. Приятно провести время в Лондоне!', end: true }
      }
    },

    /* ---------------- A2 ---------------- */
    {
      id: 'd-hotel-checkin', topic: 'hotel', level: 'A2', title: 'Заселение в отель', partner: 'Receptionist', scenario: 's-hotel',
      setting: 'You arrive at your hotel in Dublin late in the evening.', settingRu: 'Вы поздно вечером приезжаете в отель в Дублине.',
      learn: ['I have a reservation.', 'under the name', 'Is breakfast included?', "What's the Wi-Fi password?"],
      start: 'a',
      nodes: {
        a: { npc: 'Good evening! Welcome to the Harbor Hotel. Checking in?', ru: 'Добрый вечер! Добро пожаловать в Harbor Hotel. Заселяетесь?', options: [
          O('best', 'Yes, I have a reservation under the name Sokolov.', 'Да, у меня бронь на имя Соколов.', 'Идеально: сразу бронь и имя.', 'b'),
          O('ok', 'Yes. I booked a room.', 'Да. Я бронировал номер.', 'Хорошо. Сразу назовите имя: under the name…', 'b', 'Great. What name is it under?', 'Отлично. На какое имя?'),
          O('awkward', 'Yes, I want my room.', 'Да, хочу свой номер.', 'Звучит требовательно. I have a reservation — вежливый стандарт.', 'b')] },
        b: { npc: "Perfect, I've found it. Two nights, right? Can I see your passport, please?", ru: 'Нашла. Две ночи, верно? Можно ваш паспорт?', options: [
          O('best', "That's right. Here's my passport.", 'Верно. Вот мой паспорт.', 'Отлично.', 'c'),
          O('ok', 'Yes. Here.', 'Да. Вот.', 'Понятно, но Here you are / Here\'s my passport — вежливее.', 'c'),
          O('wrong', 'Yes, two nights. Why passport?', 'Да, две ночи. Зачем паспорт?', 'Звучит подозрительно и резко. Паспорт в отелях просят всегда.', 'c', "It's standard procedure for all guests.", 'Это стандартная процедура для всех гостей.')] },
        c: { npc: "Thank you. You're in room 512. Breakfast is from 7 to 10.", ru: 'Спасибо. Ваш номер 512. Завтрак с 7 до 10.', options: [
          O('best', 'Great. Is breakfast included?', 'Отлично. Завтрак включён?', 'Правильный и полезный вопрос.', 'd'),
          O('ok', 'Breakfast is free?', 'Завтрак бесплатный?', 'Понятно по интонации, но Is breakfast included? — стандарт.', 'd'),
          O('awkward', "I don't eat breakfast. Goodbye.", 'Я не завтракаю. До свидания.', 'Необязательно сообщать это. Лучше уточните важное.', 'd')] },
        d: { npc: "Yes, it's included in your rate. Anything else I can help you with?", ru: 'Да, он включён. Чем ещё могу помочь?', options: [
          O('best', "Just one thing — what's the Wi-Fi password?", 'Ещё одно — какой пароль от Wi-Fi?', 'Естественно: Just one thing — «ещё одно».', 'e'),
          O('best', 'What time is checkout?', 'Во сколько выезд?', 'Тоже полезный вопрос!', 'e'),
          O('awkward', 'No.', 'Нет.', 'Слишком резко. No, that\'s all, thanks.', 'e')] },
        e: { npc: 'The password is on your key card, and checkout is at 11. Enjoy your stay!', ru: 'Пароль на ключ-карте, выезд в 11. Приятного отдыха!', options: [
          O('best', 'Thank you, have a good night!', 'Спасибо, доброй ночи!', 'Вежливо и тепло.', 'end'),
          O('ok', 'Thanks.', 'Спасибо.', 'Нормально.', 'end'),
          O('wrong', 'You too enjoy.', 'Вам тоже наслаждаться.', 'Неверная структура. Ответ: Thank you! / Thanks, good night!', 'end')] },
        end: { npc: 'Good night!', ru: 'Доброй ночи!', end: true }
      }
    },
    {
      id: 'd-airport', topic: 'travel', level: 'A2', title: 'Регистрация на рейс', partner: 'Check-in agent', scenario: 's-passport',
      setting: 'You are checking in for a flight from London to Rome.', settingRu: 'Вы регистрируетесь на рейс Лондон — Рим.',
      learn: ["Here's my passport.", 'Just one bag.', 'window or aisle', 'boarding pass', 'Where is gate'],
      start: 'a',
      nodes: {
        a: { npc: 'Hi! Where are you flying today?', ru: 'Здравствуйте! Куда летите?', options: [
          O('best', "To Rome. Here's my passport.", 'В Рим. Вот паспорт.', 'Коротко и сразу с паспортом.', 'b'),
          O('ok', 'I fly to Rome.', 'Я лечу в Рим.', 'Для текущей ситуации — I\'m flying to Rome, или просто To Rome.', 'b'),
          O('awkward', 'Rome is my destination point.', 'Рим — мой пункт назначения.', 'Слишком книжно. Просто: To Rome.', 'b')] },
        b: { npc: 'Thank you. How many bags are you checking?', ru: 'Спасибо. Сколько сумок сдаёте?', options: [
          O('best', 'Just one bag.', 'Только одну сумку.', 'Естественно.', 'c'),
          O('ok', 'One.', 'Одну.', 'Понятно. Just one — чуть естественнее.', 'c'),
          O('awkward', 'I have one baggage.', 'У меня один багаж.', 'baggage — неисчисляемое: one bag / one suitcase.', 'c')] },
        c: { npc: 'Would you like a window or aisle seat?', ru: 'Место у окна или у прохода?', options: [
          O('best', 'Window, please.', 'У окна, пожалуйста.', 'Отлично.', 'd'),
          O('best', 'Aisle, please.', 'У прохода, пожалуйста.', 'Отлично. aisle читается [айл].', 'd'),
          O('awkward', 'The place near the window.', 'Место рядом с окном.', 'Понятно, но говорят window seat или просто Window, please.', 'd')] },
        d: { npc: "Here's your boarding pass. Boarding starts at 10:40 at gate 23.", ru: 'Ваш посадочный. Посадка в 10:40, выход 23.', options: [
          O('best', 'Thanks! Where is gate 23?', 'Спасибо! Где выход 23?', 'Хорошо — уточняем сразу.', 'e'),
          O('ok', 'Okay, thank you.', 'Хорошо, спасибо.', 'Нормально.', 'e'),
          O('awkward', 'Gate is where?', 'Выход где?', 'Порядок слов: Where is gate 23?', 'e')] },
        e: { npc: 'Go through security and turn right. Have a nice flight!', ru: 'Пройдите досмотр и направо. Хорошего полёта!', options: [
          O('best', 'Thank you, have a nice day!', 'Спасибо, хорошего дня!', 'Идеально.', 'end'),
          O('ok', 'Thanks a lot.', 'Большое спасибо.', 'Нормально.', 'end'),
          O('awkward', 'Thanks, you too!', 'Спасибо, вам тоже!', 'Классическая ошибка: агент никуда не летит! Скажите Have a nice day!', 'end', 'Ha, I wish!', 'Ха, если бы!')] },
        end: { npc: 'Bye!', ru: 'До свидания!', end: true }
      }
    },
    {
      id: 'd-restaurant', topic: 'cafe', level: 'A2', title: 'Ужин в ресторане', partner: 'Waiter', scenario: 's-restaurant-problem',
      setting: 'You and a friend are having dinner at an Italian restaurant.', settingRu: 'Вы с другом ужинаете в итальянском ресторане.',
      learn: ['a table for two', 'Could I have', 'What do you recommend?', "I'll have", "That's it, thanks.", 'the check, please'],
      start: 'a',
      nodes: {
        a: { npc: 'Hi there! How many?', ru: 'Здравствуйте! Сколько вас?', options: [
          O('best', 'A table for two, please.', 'Столик на двоих, пожалуйста.', 'Стандартный ответ.', 'b'),
          O('ok', 'Two people.', 'Два человека.', 'Понятно. A table for two, please — стандарт.', 'b'),
          O('awkward', 'We are two.', 'Нас двое.', 'Калька с русского. Говорят: A table for two / Two, please.', 'b')] },
        b: { npc: 'Right this way. Can I get you something to drink?', ru: 'Проходите. Что будете пить?', options: [
          O('best', 'Could I have a glass of water, please?', 'Можно стакан воды?', 'Вежливо и естественно.', 'c'),
          O('ok', 'Water, please.', 'Воду, пожалуйста.', 'Тоже нормально — коротко.', 'c'),
          O('awkward', 'Bring me water.', 'Принесите мне воды.', 'Повелительное наклонение звучит грубо.', 'c')] },
        c: { npc: 'Are you ready to order?', ru: 'Готовы сделать заказ?', options: [
          O('best', "I'm still deciding. What do you recommend?", 'Ещё выбираю. Что посоветуете?', 'Отлично — официанты любят этот вопрос.', 'd'),
          O('best', "Yes, I'll have the lasagna.", 'Да, я возьму лазанью.', 'Классическая форма заказа.', 'd'),
          O('awkward', 'I will eat lasagna.', 'Я буду есть лазанью.', 'Калька «я буду». При заказе: I\'ll have the lasagna.', 'd')] },
        d: { npc: 'The lasagna is excellent. Anything else?', ru: 'Лазанья отличная. Что-нибудь ещё?', options: [
          O('best', "That's it, thanks.", 'Это всё, спасибо.', 'Естественно.', 'e'),
          O('ok', 'No.', 'Нет.', 'Суховато: No, that\'s it, thanks.', 'e'),
          O('awkward', 'Nothing more I want.', 'Больше ничего не хочу.', 'Неестественный порядок слов. That\'s all, thanks.', 'e')] },
        e: { npc: 'How is everything?', ru: 'Как вам всё?', options: [
          O('best', 'Delicious, thank you!', 'Очень вкусно, спасибо!', 'Отлично.', 'f'),
          O('ok', 'Good.', 'Хорошо.', 'Можно, но немного энтузиазма не помешает: Great, thanks!', 'f'),
          O('awkward', "It's normal.", 'Нормально.', 'Русское «нормально» — одобрение, а It\'s normal звучит как «обычное, так себе».', 'f')] },
        f: { npc: 'Can I get you anything else? Dessert?', ru: 'Что-нибудь ещё? Десерт?', options: [
          O('best', 'No, thanks. Could we get the check, please?', 'Нет, спасибо. Можно счёт?', 'Идеально.', 'end'),
          O('ok', 'Just the check.', 'Только счёт.', 'Понятно, но please сделает вежливее.', 'end'),
          O('wrong', 'Give us the account.', 'Дайте нам счёт.', 'account — счёт в банке. В ресторане — the check / the bill.', 'end', 'The… check? Sure.', 'Счёт? Конечно.')] },
        end: { npc: "Of course. I'll be right back with it.", ru: 'Конечно. Сейчас принесу.', end: true }
      }
    },
    {
      id: 'd-phone', topic: 'phone', level: 'A2', title: 'Звонок в офис', partner: 'Receptionist',
      setting: 'You call a company to speak to Ms. Lopez about a job interview.', settingRu: 'Вы звоните в компанию, чтобы поговорить с мисс Лопес о собеседовании.',
      learn: ['Hi, this is', 'Can I speak to', 'Can I take a message?', 'call me back', "You're breaking up.", "I'm calling about"],
      start: 'a',
      nodes: {
        a: { npc: 'Good morning, Brightline Solutions. How can I help you?', ru: 'Доброе утро, Brightline Solutions. Чем могу помочь?', options: [
          O('best', 'Hi, this is Ivan Petrov. Can I speak to Ms. Lopez, please?', 'Здравствуйте, это Иван Петров. Можно поговорить с мисс Лопес?', 'Идеально: представились через this is + вежливая просьба.', 'b'),
          O('ok', 'Hello. I need Ms. Lopez.', 'Здравствуйте. Мне нужна мисс Лопес.', 'Звучит требовательно. Can I speak to… — стандарт.', 'b'),
          O('awkward', 'Hello, I am Ivan. Give me Ms. Lopez.', 'Здравствуйте, я Иван. Дайте мне мисс Лопес.', 'По телефону — this is Ivan. И «give me» — грубо.', 'b')] },
        b: { npc: "Just a moment, please… I'm sorry, she's in a meeting. Can I take a message?", ru: 'Минутку… Извините, она на встрече. Что-нибудь передать?', options: [
          O('best', 'Yes, please. Could you ask her to call me back?', 'Да, пожалуйста. Попросите её перезвонить мне?', 'Отлично.', 'c'),
          O('ok', 'Okay. I call later.', 'Хорошо. Я позвоню позже.', 'Нужно будущее: I\'ll call back later.', 'c'),
          O('awkward', 'When she is free?', 'Когда она свободна?', 'Порядок слов: When will she be free?', 'c')] },
        c: { npc: "Of course. What's your number?", ru: 'Конечно. Ваш номер?', options: [
          O('best', "It's 555-0142.", '555-0142.', 'Коротко и естественно.', 'd'),
          O('ok', 'My number is 555-0142.', 'Мой номер 555-0142.', 'Правильно. It\'s… — короче.', 'd'),
          O('awkward', 'Write: 555-0142.', 'Пишите: 555-0142.', 'Повелительное «write» звучит грубо.', 'd')] },
        d: { npc: "Sorry, you're breaking up. Could you repeat that?", ru: 'Простите, вы пропадаете. Повторите?', options: [
          O('best', 'Sure — 555-0142.', 'Конечно — 555-0142.', 'Отлично.', 'e'),
          O('best', 'Can you hear me now? 555-0142.', 'Теперь слышно? 555-0142.', 'Естественно при плохой связи.', 'e'),
          O('awkward', 'What breaking?', 'Что ломается?', 'You\'re breaking up — «вы пропадаете», про плохую связь.', 'e', 'The line — I can barely hear you. Your number again?', 'Связь — я вас почти не слышу. Ещё раз номер?')] },
        e: { npc: 'Got it. And what is this regarding?', ru: 'Записала. А по какому вопросу?', options: [
          O('best', "I'm calling about the job interview on Friday.", 'Я звоню по поводу собеседования в пятницу.', 'Отлично: I\'m calling about…', 'end'),
          O('ok', 'About interview.', 'Про собеседование.', 'Нужен артикль и уточнение: about the interview on Friday.', 'end'),
          O('awkward', 'It is secret.', 'Это секрет.', 'Звучит странно — секретарю нужно понять, что передать.', 'end')] },
        end: { npc: "Thank you, Mr. Petrov. I'll give her the message.", ru: 'Спасибо, мистер Петров. Я всё передам.', end: true }
      }
    },
    {
      id: 'd-weekend', topic: 'plans', level: 'A2', title: 'Планы на выходные', partner: 'Emma', scenario: 's-reschedule',
      setting: 'Your friend Emma calls you on Thursday evening.', settingRu: 'Ваша подруга Эмма звонит вам в четверг вечером.',
      learn: ['Are you free', "I'd love to!", 'How about', 'Sounds good!', 'Let me know.'],
      start: 'a',
      nodes: {
        a: { npc: 'Hey! Are you free on Saturday?', ru: 'Привет! Ты свободна в субботу?', options: [
          O('best', 'I think so. Why?', 'Думаю, да. А что?', 'Естественно и открыто.', 'b'),
          O('ok', "Yes, I'm free.", 'Да, свободна.', 'Хорошо.', 'b'),
          O('awkward', 'I am free in Saturday.', 'Я свободна в субботу.', 'Предлог: on Saturday.', 'b')] },
        b: { npc: 'Some friends and I are going hiking. Do you want to come?', ru: 'Мы с друзьями идём в поход. Пойдёшь?', options: [
          O('best', "I'd love to! What time?", 'С удовольствием! Во сколько?', 'Тепло и сразу к делу.', 'c'),
          O('ok', 'Yes, okay.', 'Да, ладно.', 'Звучит равнодушно. I\'d love to! — тепло.', 'c'),
          O('wrong', "I don't want.", 'Не хочу.', 'Резкий отказ. Если не хотите: Thanks, but maybe another time.', 'c', 'Oh… Well, think about it!', 'Ох… Ну, подумай!')] },
        c: { npc: "We're leaving at 7 a.m.", ru: 'Выезжаем в 7 утра.', options: [
          O('best', "Wow, that's early! How about 8?", 'Ого, рано! Может, в 8?', 'Мягко предлагаете свой вариант.', 'd'),
          O('ok', 'Okay, sounds good!', 'Хорошо, отлично!', 'Тоже естественно.', 'd'),
          O('awkward', '7 is very early for me, no.', '7 — очень рано для меня, нет.', 'Резко. Предложите вариант: How about 8?', 'd')] },
        d: { npc: 'Hmm, how about 7:30?', ru: 'Хм, как насчёт 7:30?', options: [
          O('best', "Sounds good! Let's meet at 7:30.", 'Отлично! Встречаемся в 7:30.', 'Идеально.', 'e'),
          O('ok', 'Okay.', 'Хорошо.', 'Нормально, но суховато.', 'e'),
          O('awkward', 'It is good for me the 7:30.', 'Мне подходит 7:30.', 'Неестественно. 7:30 works for me / Sounds good.', 'e')] },
        e: { npc: 'Great! Oh, and bring some snacks.', ru: 'Отлично! И захвати перекус.', options: [
          O('best', 'Sure! Let me know if you need anything else.', 'Конечно! Если что-то ещё нужно — скажи.', 'Отлично.', 'end'),
          O('ok', 'Okay, I will.', 'Хорошо, возьму.', 'Нормально.', 'end'),
          O('awkward', 'Why me?', 'Почему я?', 'Звучит как недовольство. Просто: Sure!', 'end')] },
        end: { npc: 'Awesome. See you Saturday!', ru: 'Супер. До субботы!', end: true }
      }
    },
    {
      id: 'd-pharmacy', topic: 'health', level: 'A2', title: 'В аптеке', partner: 'Pharmacist', scenario: 's-doctor',
      setting: 'You have a bad cold and go to a pharmacy.', settingRu: 'Вы сильно простыли и пришли в аптеку.',
      learn: ["I've got a cold.", 'My throat hurts', 'Do I need a prescription?', 'Get well soon!'],
      start: 'a',
      nodes: {
        a: { npc: 'Hi, how can I help you?', ru: 'Здравствуйте, чем могу помочь?', options: [
          O('best', "Hi, I've got a cold. My throat hurts.", 'Здравствуйте, я простыл. Болит горло.', 'Отлично: проблема + симптом.', 'b'),
          O('ok', 'I am ill.', 'Я болен.', 'Понятно, но слишком общо. Опишите симптомы.', 'b'),
          O('awkward', 'I need pills.', 'Мне нужны таблетки.', 'Расплывчато. Опишите проблему.', 'b', 'Okay… what are your symptoms?', 'Хорошо… какие симптомы?')] },
        b: { npc: "I'm sorry to hear that. Do you have a fever?", ru: 'Сочувствую. Температура есть?', options: [
          O('best', "No, I don't think so. Just a sore throat and a headache.", 'Нет, вроде нет. Только горло и голова.', 'Отлично, фармацевту важны детали.', 'c'),
          O('ok', 'No.', 'Нет.', 'Можно добавить детали.', 'c'),
          O('awkward', 'No temperature.', 'Нет температуры.', 'Говорят I don\'t have a fever / a temperature.', 'c')] },
        c: { npc: 'These lozenges should help. Take one every three hours.', ru: 'Эти пастилки помогут. По одной каждые три часа.', options: [
          O('best', 'Thanks. Do I need a prescription?', 'Спасибо. Нужен рецепт?', 'Полезный вопрос.', 'd'),
          O('ok', 'Okay, thank you.', 'Хорошо, спасибо.', 'Нормально.', 'd'),
          O('awkward', 'I need recipe?', 'Мне нужен рецепт?', 'recipe — рецепт блюда. Лекарственный — prescription.', 'd')] },
        d: { npc: "No, they're over the counter. Anything else?", ru: 'Нет, они без рецепта. Что-нибудь ещё?', options: [
          O('best', "No, that's it. How much are they?", 'Нет, это всё. Сколько стоят?', 'Естественно.', 'end'),
          O('ok', "That's all.", 'Это всё.', 'Нормально.', 'end'),
          O('awkward', 'What means over the counter?', 'Что значит over the counter?', 'Грамматика: What does "over the counter" mean? (= без рецепта)', 'end', "It means you don't need a prescription.", 'Это значит, рецепт не нужен.')] },
        end: { npc: "That's $8.99. Get well soon!", ru: 'С вас 8,99. Выздоравливайте!', end: true }
      }
    },

    /* ---------------- B1 ---------------- */
    {
      id: 'd-party', topic: 'smalltalk', level: 'B1', title: 'На вечеринке', partner: 'Chloe', scenario: 's-party',
      setting: "You're at a friend's birthday party. You don't know many people.", settingRu: 'Вы на дне рождения друга. Почти никого не знаете.',
      learn: ["I don't think we've met.", 'How do you know', 'Lucky you!', 'It was nice talking to you.'],
      start: 'a',
      nodes: {
        a: { npc: "Hi! I don't think we've met. I'm Chloe.", ru: 'Привет! Кажется, мы не знакомы. Я Хлоя.', options: [
          O('best', "Hi Chloe, I'm Dima. Nice to meet you!", 'Привет, Хлоя, я Дима. Приятно познакомиться!', 'Идеально.', 'b'),
          O('ok', 'Hello. My name is Dmitry.', 'Здравствуйте. Меня зовут Дмитрий.', 'Правильно, но официально для вечеринки.', 'b'),
          O('awkward', "Yes, we didn't meet.", 'Да, мы не встречались.', 'Неестественно. Ответ: Hi, I\'m… Nice to meet you!', 'b')] },
        b: { npc: 'Nice to meet you too! So, how do you know Sam?', ru: 'Взаимно! А ты откуда знаешь Сэма?', options: [
          O('best', 'We work together. What about you?', 'Мы работаем вместе. А ты?', 'Ответ + встречный вопрос — основа small talk.', 'c'),
          O('ok', 'From work.', 'С работы.', 'Хорошо, но встречный вопрос поддержит разговор.', 'c'),
          O('awkward', 'I know Sam two years.', 'Я знаю Сэма два года.', 'Время: I\'ve known Sam for two years.', 'c')] },
        c: { npc: "We went to college together. Have you been to one of his parties before?", ru: 'Мы вместе учились. Ты уже был на его вечеринках?', options: [
          O('best', "No, this is my first time. It's a great party!", 'Нет, впервые. Классная вечеринка!', 'Ответ + позитив.', 'd'),
          O('ok', 'No, never.', 'Нет, никогда.', 'Суховато. Добавьте что-то позитивное.', 'd'),
          O('awkward', 'No, I have never been in his party before in my life.', 'Нет, никогда в жизни не был на его вечеринке.', 'Тяжеловесно. Коротко: No, it\'s my first time.', 'd')] },
        d: { npc: "I'm going to Lisbon next month, actually.", ru: 'Кстати, я в следующем месяце еду в Лиссабон.', options: [
          O('best', 'Lucky you! Have you been there before?', 'Везёт! Ты там уже была?', 'Реакция + вопрос.', 'e'),
          O('ok', 'Nice.', 'Здорово.', 'Немного равнодушно.', 'e'),
          O('awkward', 'Why Lisbon?', 'Почему Лиссабон?', 'Может прозвучать резко. Лучше: Oh nice! What\'s taking you there?', 'e')] },
        e: { npc: "No, it's my first trip. I'm so excited!", ru: 'Нет, впервые. Я в предвкушении!', options: [
          O('best', "That sounds amazing. You'll love it!", 'Звучит потрясающе. Тебе понравится!', 'Тепло и позитивно.', 'f'),
          O('ok', "That's good.", 'Это хорошо.', 'Нормально, но без эмоций.', 'f'),
          O('awkward', "Be careful, it's dangerous.", 'Будь осторожна, там опасно.', 'Негатив в small talk не приветствуется.', 'f')] },
        f: { npc: "Oh, there's my friend. It was nice talking to you!", ru: 'О, вот моя подруга. Было приятно поболтать!', options: [
          O('best', 'You too! Enjoy the party.', 'Взаимно! Хорошо повеселиться.', 'Идеально.', 'end'),
          O('ok', 'Bye.', 'Пока.', 'Суховато.', 'end'),
          O('awkward', 'Okay, go.', 'Ладно, иди.', 'Звучит грубо.', 'end')] },
        end: { npc: 'Thanks, you too!', ru: 'Спасибо, и тебе!', end: true }
      }
    },
    {
      id: 'd-noisy-room', topic: 'hotel', level: 'B1', title: 'Шумный номер', partner: 'Front desk',
      setting: "It's 11 p.m. The room next to yours is very noisy. You call the front desk.", settingRu: '23:00. В соседнем номере очень шумно. Вы звоните на ресепшен.',
      learn: ["It's a bit noisy.", 'switch rooms', 'Would it be possible to', "I'd like to make a complaint."],
      start: 'a',
      nodes: {
        a: { npc: 'Front desk, this is Mark. How may I help you?', ru: 'Ресепшен, Марк. Чем могу помочь?', options: [
          O('best', "Hi, this is room 305. Sorry to bother you, but the room next to mine is really noisy.", 'Здравствуйте, это 305-й. Извините за беспокойство, но в соседнем номере очень шумно.', 'Идеально: номер, вежливость, проблема.', 'b'),
          O('ok', 'The room next to me is noisy.', 'Соседний номер шумит.', 'Понятно, но назовите свой номер и смягчите.', 'b'),
          O('awkward', 'Your hotel is terrible! Too loud!', 'Ваш отель ужасен! Слишком громко!', 'Агрессивно. Спокойный тон — быстрее помогут.', 'b')] },
        b: { npc: "I'm very sorry about that. Do you know which room it is?", ru: 'Очень жаль. Вы знаете, какой номер?', options: [
          O('best', "I think it's 307. It's been going on for about an hour.", 'Думаю, 307. Это продолжается около часа.', 'Отлично: детали помогают.', 'c'),
          O('ok', '307.', '307.', 'Понятно.', 'c'),
          O('awkward', 'No idea, you find it.', 'Понятия не имею, сами ищите.', 'Грубовато. I\'m not sure, but I think it\'s…', 'c')] },
        c: { npc: "I'll send someone up to talk to them right away.", ru: 'Сейчас же отправлю кого-нибудь поговорить с ними.', options: [
          O('best', 'Thank you, I really appreciate it.', 'Спасибо, очень признателен.', 'Тёплая благодарность.', 'd'),
          O('ok', 'Okay.', 'Хорошо.', 'Нормально.', 'd'),
          O('awkward', 'Fast, please.', 'Быстро, пожалуйста.', 'Звучит как приказ.', 'd')] },
        d: { npc: 'If it continues, would you like to switch rooms?', ru: 'Если продолжится, хотите сменить номер?', options: [
          O('best', 'Yes, if possible. Would it be possible to get a quieter room?', 'Да, если можно. Можно ли номер потише?', 'Вежливая просьба.', 'end'),
          O('ok', 'Maybe, yes.', 'Может быть, да.', 'Нормально.', 'end'),
          O('awkward', 'Yes, and I want a discount.', 'Да, и хочу скидку.', 'Компенсацию просить можно, но мягче: Would you be able to offer a discount?', 'end')] },
        end: { npc: "Of course. I'll call you back in ten minutes.", ru: 'Конечно. Перезвоню через десять минут.', end: true }
      }
    },
    {
      id: 'd-standup', topic: 'work', level: 'B1', title: 'Утро понедельника', partner: 'Priya (manager)',
      setting: "It's Monday morning. Your manager, Priya, stops by your desk.", settingRu: 'Утро понедельника. Руководитель Прия подходит к вашему столу.',
      learn: ['How was your weekend?', "What's the status on", 'get it done', 'give me a hand', 'touch base'],
      start: 'a',
      nodes: {
        a: { npc: 'Morning! How was your weekend?', ru: 'Доброе утро! Как выходные?', options: [
          O('best', 'It was great, thanks! We went to the lake. How about yours?', 'Отлично, спасибо! Ездили на озеро. А ваши?', 'Ответ + деталь + встречный вопрос.', 'b'),
          O('ok', 'Good.', 'Хорошо.', 'Суховато для small talk.', 'b'),
          O('awkward', 'Why do you ask?', 'А почему вы спрашиваете?', 'В офисе это обычный small talk, не допрос.', 'b')] },
        b: { npc: "Pretty relaxing. Listen, what's the status on the client report?", ru: 'Спокойно. Слушай, как дела с отчётом для клиента?', options: [
          O('best', "It's almost done. I'll get it done by Wednesday.", 'Почти готов. Закончу к среде.', 'Уверенно и конкретно.', 'c'),
          O('ok', "It's not ready.", 'Не готов.', 'Честно, но добавьте, когда будет.', 'c'),
          O('awkward', "I don't know status.", 'Не знаю статус.', 'Звучит безответственно. Let me check — и уточните.', 'c')] },
        c: { npc: 'Great. Could you also give Tom a hand with the presentation?', ru: 'Отлично. Поможешь ещё Тому с презентацией?', options: [
          O('best', 'Sure, no problem. When is it due?', 'Конечно. Когда срок?', 'Согласие + уточнение срока.', 'd'),
          O('ok', 'Okay.', 'Хорошо.', 'Нормально.', 'd'),
          O('wrong', "It's not my job.", 'Это не моя работа.', 'Рискованно. Если заняты: I\'d love to help, but I\'m swamped this week.', 'd', 'Hmm. Let\'s talk about it later.', 'Хм. Обсудим позже.')] },
        d: { npc: "It's due Friday. Are you free for a quick call at 2?", ru: 'Срок — пятница. Свободен на короткий созвон в 2?', options: [
          O('best', 'Yes, 2 works for me.', 'Да, в 2 удобно.', 'works for me — естественно.', 'e'),
          O('best', "Let me check… Yes, I'm free.", 'Сейчас проверю… Да, свободен.', 'Естественно.', 'e'),
          O('awkward', 'Yes, at 2 I am free for you.', 'Да, в 2 я свободен для вас.', 'Неестественно. 2 works for me.', 'e')] },
        e: { npc: "Perfect. Let's touch base then.", ru: 'Отлично. Тогда и сверимся.', options: [
          O('best', 'Sounds good. See you at 2!', 'Договорились. До двух!', 'Идеально.', 'end'),
          O('ok', 'Okay.', 'Хорошо.', 'Нормально.', 'end'),
          O('awkward', 'What is touch base?', 'Что такое touch base?', 'Грамматика: What does "touch base" mean? (= коротко сверить информацию)', 'end', 'Just a quick catch-up!', 'Просто быстро сверимся!')] },
        end: { npc: 'Thanks!', ru: 'Спасибо!', end: true }
      }
    },
    {
      id: 'd-lost-luggage', topic: 'travel', level: 'B1', title: 'Потерянный багаж', partner: 'Baggage agent',
      setting: "You've just landed in Toronto, but your suitcase didn't come out.", settingRu: 'Вы прилетели в Торонто, но ваш чемодан не появился на ленте.',
      learn: ["My luggage didn't arrive.", 'I missed my connection.'],
      start: 'a',
      nodes: {
        a: { npc: 'Hi, how can I help?', ru: 'Здравствуйте, чем помочь?', options: [
          O('best', "Hi, my luggage didn't arrive. I was on the flight from Frankfurt.", 'Здравствуйте, мой багаж не прилетел. Я летел из Франкфурта.', 'Отлично: проблема + рейс.', 'b'),
          O('ok', 'My bag is lost.', 'Моя сумка потерялась.', 'Понятно. Уточните рейс — так быстрее найдут.', 'b'),
          O('awkward', 'Where is my luggages?', 'Где мои багажи?', 'luggage — неисчисляемое: Where is my luggage?', 'b')] },
        b: { npc: "I'm sorry about that. Can I see your baggage tag?", ru: 'Сожалею. Можно багажную бирку?', options: [
          O('best', 'Sure, here it is.', 'Конечно, вот.', 'Естественно.', 'c'),
          O('ok', 'Here.', 'Вот.', 'Коротковато.', 'c'),
          O('awkward', 'What tag?', 'Какую бирку?', 'Бирка обычно наклеена на посадочный: Sure, here it is.', 'c')] },
        c: { npc: 'Can you describe the bag?', ru: 'Опишите сумку.', options: [
          O('best', "It's a large black suitcase with a red ribbon on the handle.", 'Большой чёрный чемодан с красной лентой на ручке.', 'Отлично: размер, цвет, приметы.', 'd'),
          O('ok', 'Black, big.', 'Чёрный, большой.', 'Понятно, но лучше полным предложением.', 'd'),
          O('awkward', "It's normal bag.", 'Обычная сумка.', 'Такое описание не поможет найти багаж.', 'd')] },
        d: { npc: "It's still in Frankfurt. It should arrive tomorrow. Where are you staying?", ru: 'Он ещё во Франкфурте. Прибудет завтра. Где вы остановились?', options: [
          O('best', 'At the Maple Hotel downtown. Could you deliver it there?', 'В отеле Maple в центре. Можете доставить туда?', 'Отлично: адрес + просьба.', 'e'),
          O('ok', 'In hotel.', 'В отеле.', 'Нужны детали и артикль: at the Maple Hotel.', 'e'),
          O('awkward', 'This is unacceptable! I need it now!', 'Это неприемлемо! Мне нужно сейчас!', 'Эмоции понятны, но агент не виноват. Спокойная просьба сработает лучше.', 'e')] },
        e: { npc: "Absolutely. We'll deliver it by tomorrow evening.", ru: 'Конечно. Доставим завтра к вечеру.', options: [
          O('best', 'Thank you. Could you give me a reference number?', 'Спасибо. Можно номер обращения?', 'Разумно — номер понадобится.', 'end'),
          O('ok', 'Okay, thanks.', 'Хорошо, спасибо.', 'Нормально.', 'end'),
          O('awkward', 'Sure?', 'Точно?', 'Звучит недоверчиво.', 'end')] },
        end: { npc: "Of course. Here's your file reference.", ru: 'Конечно. Вот номер вашего обращения.', end: true }
      }
    },
    {
      id: 'd-return', topic: 'shop', level: 'B1', title: 'Возврат товара', partner: 'Store clerk',
      setting: 'You bought headphones last week, but they stopped working.', settingRu: 'Вы купили наушники неделю назад, но они перестали работать.',
      learn: ["I'd like to return this.", 'What seems to be the problem?', "I'd like a refund.", 'exchange it for'],
      start: 'a',
      nodes: {
        a: { npc: 'Hi there, what can I do for you?', ru: 'Здравствуйте, чем могу помочь?', options: [
          O('best', "Hi, I'd like to return these headphones. They don't work.", 'Здравствуйте, хочу вернуть наушники. Они не работают.', 'Чётко и вежливо.', 'b'),
          O('ok', 'These headphones are broken.', 'Эти наушники сломаны.', 'Понятно. Скажите, чего хотите: I\'d like to return them.', 'b'),
          O('awkward', 'I want money back!', 'Хочу деньги назад!', 'Звучит агрессивно. I\'d like a refund.', 'b')] },
        b: { npc: "Oh, I'm sorry. Do you have the receipt?", ru: 'Ой, сожалею. Чек есть?', options: [
          O('best', 'Yes, here it is.', 'Да, вот он.', 'Естественно.', 'c'),
          O('ok', 'Yes.', 'Да.', 'Нормально.', 'c'),
          O('awkward', 'Receipt? No, why?', 'Чек? Нет, зачем?', 'Чек почти всегда нужен для возврата.', 'c', 'We usually need it, but let me check your card payment.', 'Обычно нужен, но я проверю оплату по карте.')] },
        c: { npc: 'What seems to be the problem?', ru: 'В чём проблема?', options: [
          O('best', 'The left side stopped working after two days.', 'Левый наушник перестал работать через два дня.', 'Конкретно.', 'd'),
          O('ok', 'Not working.', 'Не работают.', 'Слишком коротко.', 'd'),
          O('awkward', 'They are not working good.', 'Они работают не хорошо.', 'Говорят: They don\'t work properly.', 'd')] },
        d: { npc: 'I can exchange them or give you a refund.', ru: 'Могу обменять или вернуть деньги.', options: [
          O('best', "I'd like a refund, please.", 'Верните деньги, пожалуйста.', 'Чётко.', 'end'),
          O('best', 'Could I exchange them for a different model?', 'Можно обменять на другую модель?', 'Отлично.', 'end'),
          O('awkward', 'Refund me.', 'Верните мне.', 'Звучит как приказ.', 'end')] },
        end: { npc: 'No problem. The refund will be on your card in 3–5 days.', ru: 'Без проблем. Деньги вернутся на карту через 3–5 дней.', end: true }
      }
    },

    /* ---------------- B2 ---------------- */
    {
      id: 'd-deadline', topic: 'work', level: 'B2', title: 'Перенос дедлайна', partner: 'Mark (manager)', scenario: 's-colleague',
      setting: 'Your manager wants the project finished two days earlier than planned.', settingRu: 'Руководитель хочет получить проект на два дня раньше.',
      learn: ['a tight schedule', 'I see your point, but', 'Just to clarify', 'follow up', 'Keep me posted.'],
      start: 'a',
      nodes: {
        a: { npc: 'Hey, do you have a minute? The client wants the project by Wednesday instead of Friday.', ru: 'Есть минутка? Клиент хочет проект к среде вместо пятницы.', options: [
          O('best', "Wednesday? That's tight. Can we talk about what's realistic?", 'Среда? Жёстко. Обсудим, что реально?', 'Профессионально: не соглашаетесь вслепую.', 'b'),
          O('ok', "Okay, I'll try.", 'Хорошо, постараюсь.', 'Соглашаться на нереальное рискованно.', 'b'),
          O('awkward', 'Impossible. No way.', 'Невозможно. Ни за что.', 'Слишком резко для разговора с руководителем.', 'b')] },
        b: { npc: "I know it's a tight schedule. What would you need to make it work?", ru: 'Знаю, сроки сжатые. Что нужно, чтобы успеть?', options: [
          O('best', 'If Anna could help with testing, I think we could get it done by Wednesday.', 'Если Анна поможет с тестированием, думаю, успеем к среде.', 'Конкретное решение.', 'c'),
          O('ok', 'More people.', 'Больше людей.', 'Слишком общо.', 'c'),
          O('awkward', 'I need a vacation.', 'Мне нужен отпуск.', 'Шутка не к месту.', 'c')] },
        c: { npc: "Anna's swamped. What if we cut the extra features?", ru: 'Анна завалена. А если убрать дополнительные функции?', options: [
          O('best', 'I see your point, but the client asked for those features specifically.', 'Понимаю, но клиент просил именно эти функции.', 'Вежливое несогласие с аргументом.', 'd'),
          O('ok', 'Okay, good idea.', 'Хорошо, хорошая идея.', 'Можно, но вы теряете важное для клиента.', 'd'),
          O('awkward', "You don't understand the project.", 'Вы не понимаете проект.', 'Звучит как обвинение. Мягче: I see your point, but…', 'd')] },
        d: { npc: 'Fair enough. What if I ask the client for Thursday?', ru: 'Справедливо. А если попросить у клиента четверг?', options: [
          O('best', 'That would work. Just to clarify, would that include final testing?', 'Подходит. Просто уточню: включая финальное тестирование?', 'Согласие + уточнение.', 'e'),
          O('ok', 'Thursday is fine.', 'Четверг подходит.', 'Нормально.', 'e'),
          O('awkward', 'Thursday is also bad but okay.', 'Четверг тоже плохо, но ладно.', 'Звучит недовольно.', 'e')] },
        e: { npc: "Yes, everything by Thursday. I'll follow up with them today.", ru: 'Да, всё к четвергу. Сегодня свяжусь с ними.', options: [
          O('best', 'Great. Keep me posted.', 'Отлично. Держите в курсе.', 'Идеально.', 'end'),
          O('ok', 'Okay, thanks.', 'Хорошо, спасибо.', 'Нормально.', 'end'),
          O('awkward', 'Tell me what they say, yes?', 'Скажете, что они ответят, да?', 'Неестественно. Keep me posted.', 'end')] },
        end: { npc: 'Will do.', ru: 'Обязательно.', end: true }
      }
    },
    {
      id: 'd-news', topic: 'reactions', level: 'B2', title: 'Новости друга', partner: 'Leo',
      setting: 'You meet your old friend Leo for coffee. He has a lot of news.', settingRu: 'Вы пьёте кофе со старым другом Лео. У него много новостей.',
      learn: ['No way!', "I'm so happy for you!", "I'm sorry to hear that.", "You've got to be kidding!", "It's on me."],
      start: 'a',
      nodes: {
        a: { npc: 'Guess what? I finally got the job at Google!', ru: 'Угадай что? Меня наконец взяли в Google!', options: [
          O('best', "No way! Congratulations, I'm so happy for you!", 'Да ладно! Поздравляю, так за тебя рад!', 'Эмоционально и тепло.', 'b'),
          O('ok', "That's good.", 'Это хорошо.', 'Слишком сдержанно для такой новости.', 'b'),
          O('awkward', 'Why Google?', 'Почему Google?', 'Не та реакция — сначала порадуйтесь.', 'b')] },
        b: { npc: 'Thanks! But the bad news is I have to move to Dublin.', ru: 'Спасибо! Но плохая новость — придётся переехать в Дублин.', options: [
          O('best', "Oh, I'm sorry to hear that. I'll miss you! When are you leaving?", 'Жаль это слышать. Буду скучать! Когда уезжаешь?', 'Сочувствие + вопрос.', 'c'),
          O('ok', 'Oh no.', 'О нет.', 'Можно продолжить вопросом.', 'c'),
          O('awkward', 'Good for you!', 'Молодец!', 'Не подходит к грустной новости — это реакция на достижение.', 'c')] },
        c: { npc: 'Next month. And my landlord says I have to be out in two weeks!', ru: 'Через месяц. А хозяин квартиры требует съехать через две недели!', options: [
          O('best', "You've got to be kidding! That's so stressful.", 'Да ты шутишь! Какой стресс.', 'Сильная эмоция к месту.', 'd'),
          O('ok', 'What a shame.', 'Как жаль.', 'Подходит, но слабовато.', 'd'),
          O('awkward', 'Fair enough.', 'Справедливо.', 'Звучит равнодушно — «ну, логично».', 'd')] },
        d: { npc: 'Tell me about it! Could I maybe stay at your place for a week?', ru: 'И не говори! Можно я поживу у тебя неделю?', options: [
          O('best', 'Of course! Stay as long as you need.', 'Конечно! Живи сколько нужно.', 'Щедро и тепло.', 'e'),
          O('ok', 'Maybe. Let me check with my roommate.', 'Может быть. Спрошу соседа.', 'Честно и нормально.', 'e'),
          O('awkward', "It's not my problem.", 'Это не моя проблема.', 'Очень холодно для друга.', 'e')] },
        e: { npc: "You're a lifesaver! Coffee's on me.", ru: 'Ты меня спасаешь! Кофе за мой счёт.', options: [
          O('best', 'Ha, deal! Thanks.', 'Ха, договорились! Спасибо.', 'Легко и дружелюбно.', 'end'),
          O('ok', 'Thank you.', 'Спасибо.', 'Нормально.', 'end'),
          O('awkward', 'Yes, you pay.', 'Да, ты платишь.', 'Звучит грубовато.', 'end')] },
        end: { npc: 'Seriously, thank you.', ru: 'Серьёзно, спасибо.', end: true }
      }
    },
    {
      id: 'd-debate', topic: 'opinions', level: 'B2', title: 'Спор о переезде офиса', partner: 'Jordan',
      setting: 'Your team is discussing moving to a new office outside the city center.', settingRu: 'Команда обсуждает переезд офиса за пределы центра.',
      learn: ['If you ask me', "That's a good point.", 'I see your point, but', "I'm not sure about that.", 'Having said that'],
      start: 'a',
      nodes: {
        a: { npc: 'If you ask me, moving outside the city is a great idea. The rent is half the price.', ru: 'По-моему, переезд за город — отличная идея. Аренда вдвое дешевле.', options: [
          O('best', "That's a good point, but what about people who don't drive?", 'Хороший довод, но как быть тем, кто не водит?', 'Признали аргумент и мягко возразили.', 'b'),
          O('ok', "I don't agree.", 'Не согласен.', 'Прямо. Лучше смягчить и аргументировать.', 'b'),
          O('awkward', 'You are wrong.', 'Ты не прав.', 'Слишком резко.', 'b')] },
        b: { npc: 'They could take the company shuttle.', ru: 'Они могли бы ездить на корпоративном автобусе.', options: [
          O('best', 'I see your point, but a shuttle adds almost an hour to the commute.', 'Понимаю, но автобус добавляет почти час к дороге.', 'Аргумент с фактами.', 'c'),
          O('ok', 'Maybe.', 'Может быть.', 'Уклончиво.', 'c'),
          O('awkward', 'Shuttle is bad idea.', 'Автобус — плохая идея.', 'Без аргументов и артикля: a bad idea.', 'c')] },
        c: { npc: 'Honestly, I think people would get used to it.', ru: 'Честно, думаю, люди привыкнут.', options: [
          O('best', "Maybe, but I'm not sure about that. Why don't we ask the team?", 'Может, но я не уверен. Почему бы не спросить команду?', 'Конструктивно.', 'd'),
          O('ok', 'I think not.', 'Я думаю, нет.', 'Говорят I don\'t think so.', 'd'),
          O('awkward', 'Whatever.', 'Без разницы.', 'Звучит пренебрежительно.', 'd')] },
        d: { npc: 'Fair enough. Having said that, we need to decide by Friday.', ru: 'Справедливо. При этом решить нужно к пятнице.', options: [
          O('best', "Agreed. Let's put together a quick survey today.", 'Согласен. Давай сегодня сделаем быстрый опрос.', 'Решение и действие.', 'end'),
          O('ok', 'Okay.', 'Хорошо.', 'Нормально.', 'end'),
          O('awkward', 'Friday is too soon, no way.', 'Пятница — слишком рано, ни за что.', 'Резко и без альтернативы.', 'end')] },
        end: { npc: 'Sounds like a plan.', ru: 'Звучит как план.', end: true }
      }
    },

    /* ---------------- C1 ---------------- */
    {
      id: 'd-interview', topic: 'work', level: 'C1', title: 'Собеседование', partner: 'Interviewer',
      setting: "You're in a job interview for a project manager position.", settingRu: 'Вы на собеседовании на позицию проектного менеджера.',
      learn: ["I'm in charge of", 'on the same page', 'a tight schedule', 'bring to the table', 'push back on'],
      start: 'a',
      nodes: {
        a: { npc: 'Thanks for coming in. So, tell me a bit about yourself.', ru: 'Спасибо, что пришли. Расскажите немного о себе.', options: [
          O('best', "Sure. I've been a project manager for five years, mostly in fintech, and I'm in charge of a team of eight.", 'Конечно. Я пять лет работаю проектным менеджером, в основном в финтехе, руковожу командой из восьми человек.', 'Опыт, сфера, масштаб — именно это хотят услышать.', 'b'),
          O('ok', 'My name is Olga, I am 30 years old, I live in Moscow.', 'Меня зовут Ольга, мне 30, живу в Москве.', 'Возраст и адрес не нужны. Говорите об опыте.', 'b'),
          O('awkward', 'What do you want to know?', 'А что вы хотите узнать?', 'Уклончиво. Ждут краткого рассказа о карьере.', 'b')] },
        b: { npc: 'What would you say is your biggest weakness?', ru: 'Какая ваша главная слабость?', options: [
          O('best', "I used to take on too much myself, but I've learned to delegate.", 'Раньше я брала на себя слишком много, но научилась делегировать.', 'Честно и с развитием.', 'c'),
          O('ok', 'I am a perfectionist.', 'Я перфекционист.', 'Клише — интервьюеры слышат это постоянно.', 'c'),
          O('awkward', "I don't have weaknesses.", 'У меня нет слабостей.', 'Звучит самонадеянно.', 'c')] },
        c: { npc: 'What can you bring to the table?', ru: 'Что вы можете предложить команде?', options: [
          O('best', "I'm good at keeping everyone on the same page, especially on a tight schedule.", 'Я умею синхронизировать всех, особенно при сжатых сроках.', 'Конкретная сильная сторона.', 'd'),
          O('ok', 'I work hard.', 'Я много работаю.', 'Слишком общо.', 'd'),
          O('awkward', "Table? I don't understand.", 'Стол? Не понимаю.', 'bring to the table — что вы можете предложить.', 'd', 'I mean, what skills would you bring to the team?', 'Я имею в виду, какие навыки вы принесёте в команду?')] },
        d: { npc: 'How do you handle disagreements with stakeholders?', ru: 'Как вы решаете разногласия с заинтересованными сторонами?', options: [
          O('best', 'I listen first, and if I need to push back, I back it up with data.', 'Сначала выслушиваю, а если нужно возразить — подкрепляю данными.', 'Зрелый ответ.', 'e'),
          O('ok', 'I tell them they are wrong.', 'Говорю, что они не правы.', 'Слишком прямолинейно.', 'e'),
          O('awkward', 'I avoid them.', 'Избегаю их.', 'Плохой сигнал для менеджера.', 'e')] },
        e: { npc: 'Do you have any questions for us?', ru: 'У вас есть к нам вопросы?', options: [
          O('best', 'Yes — what would success look like in the first six months?', 'Да — каким был бы успех в первые полгода?', 'Сильный вопрос: показывает интерес к результату.', 'end'),
          O('ok', 'No, thank you.', 'Нет, спасибо.', 'Лучше задать вопрос — это показывает интерес.', 'end'),
          O('awkward', 'How much is the salary?', 'Какая зарплата?', 'Не первым вопросом — о деньгах лучше позже.', 'end')] },
        end: { npc: "Great question. Thanks — we'll get back to you by Friday.", ru: 'Отличный вопрос. Спасибо — ответим до пятницы.', end: true }
      }
    },
    {
      id: 'd-billing', topic: 'problems', level: 'C1', title: 'Ошибка в счёте', partner: 'Support agent', scenario: 's-complaint',
      setting: 'You were charged twice for your phone bill. You call customer service.', settingRu: 'С вас дважды списали оплату за связь. Вы звоните в поддержку.',
      learn: ["there's been a mix-up", 'I apologize for the inconvenience.', 'Is there any way', "I'd appreciate it if", "I'd like to escalate this.", "That's a relief."],
      start: 'a',
      nodes: {
        a: { npc: 'Thank you for calling. How can I help you today?', ru: 'Спасибо за звонок. Чем помочь?', options: [
          O('best', "Hi, I'm afraid there's been a mix-up with my bill — I was charged twice this month.", 'Здравствуйте, боюсь, со счётом путаница — с меня дважды списали оплату.', 'Дипломатично и точно.', 'b'),
          O('ok', 'You took my money twice.', 'Вы взяли мои деньги дважды.', 'Звучит как обвинение.', 'b'),
          O('awkward', 'Your company is stealing!', 'Ваша компания ворует!', 'Агрессия не поможет.', 'b')] },
        b: { npc: 'I apologize for the inconvenience. Can I have your account number?', ru: 'Приносим извинения. Номер счёта, пожалуйста.', options: [
          O('best', "Sure, it's 4471-2290.", 'Конечно, 4471-2290.', 'Естественно.', 'c'),
          O('ok', '4471-2290.', '4471-2290.', 'Нормально.', 'c'),
          O('awkward', 'You should know it.', 'Вы должны его знать.', 'Недружелюбно — сотрудник следует процедуре.', 'c')] },
        c: { npc: 'I see the double charge. The refund could take up to 30 days.', ru: 'Вижу двойное списание. Возврат — до 30 дней.', options: [
          O('best', 'Is there any way to speed that up? Thirty days seems like a lot.', 'Можно ли ускорить? Тридцать дней — это много.', 'Вежливая настойчивость.', 'd'),
          O('ok', 'Okay.', 'Хорошо.', 'Вы сдались слишком быстро.', 'd'),
          O('awkward', 'Thirty days is unacceptable! I want it now!', 'Тридцать дней неприемлемо! Хочу сейчас!', 'Эмоционально. Сначала вежливо: Is there any way…', 'd')] },
        d: { npc: "I'm afraid that's the standard process.", ru: 'Боюсь, таков стандартный порядок.', options: [
          O('best', "I understand, but I'd appreciate it if you could look into it. Otherwise, I'd like to escalate this.", 'Понимаю, но буду признателен, если вы разберётесь. Иначе я попрошу передать вопрос выше.', 'Твёрдо и корректно.', 'e'),
          O('ok', 'Fine.', 'Ладно.', 'Сдались.', 'e'),
          O('awkward', 'Then give me your boss.', 'Тогда дайте мне вашего начальника.', 'Грубо. Could I speak to a supervisor?', 'e')] },
        e: { npc: 'Let me check with my supervisor… Good news — we can refund it within 5 business days.', ru: 'Уточню у руководителя… Хорошие новости — вернём за 5 рабочих дней.', options: [
          O('best', "That's a relief. Thank you for your help!", 'Какое облегчение. Спасибо за помощь!', 'Благодарность за помощь.', 'end'),
          O('ok', 'Finally.', 'Наконец-то.', 'Звучит раздражённо — сотрудник же помог.', 'end'),
          O('awkward', 'Why not from the start?', 'Почему не сразу?', 'Лишний упрёк.', 'end')] },
        end: { npc: "You're welcome. Is there anything else I can help with?", ru: 'Пожалуйста. Могу ещё чем-то помочь?', end: true }
      }
    }
  ];

  /* ======================================================================
     СЦЕНАРИИ РЕЖИМА «РАЗГОВОР»
     ====================================================================== */
  D.scenarios = [
    {
      id: 's-coffee', topic: 'cafe', level: 'A1', title: 'Кофейня', partner: 'Barista',
      setting: 'You are at a coffee shop.', settingRu: 'Вы в кофейне.',
      closing: 'Here you go. Have a nice day!', closingRu: 'Пожалуйста. Хорошего дня!',
      turns: [
        { npc: 'Hi! What can I get for you?', npcRu: 'Здравствуйте! Что вам предложить?', intent: 'Закажите латте среднего размера.',
          accepted: [A('Can I get a medium latte, please?', 98), A('Could I get a medium latte, please?', 97), A('Can I have a medium latte, please?', 92),
            A("I'll have a medium latte, please.", 92), A('A medium latte, please.', 90, 'Коротко и естественно — так часто и говорят.'), A("I'd like a medium latte, please.", 85, 'Правильно, чуть формальнее, чем Can I get…')],
          keywords: ['latte', 'medium'],
          distractors: [X('I want a medium latte.', 35, '«I want» звучит требовательно. Используйте Can I get… / I\'ll have…'), X('Give me a latte.', 15, 'Повелительное наклонение звучит грубо.')],
          better: 'Can I get a medium latte, please?', betterRu: 'Можно мне средний латте?',
          explain: 'В кофейнях говорят Can I get… или I\'ll have… Слово please обязательно, а I want звучит как требование.', learn: ['Can I get'] },
        { npc: 'Sure! Hot or iced?', npcRu: 'Конечно! Горячий или со льдом?', intent: 'Скажите, что хотите горячий.',
          accepted: [A('Hot, please.', 98), A('Hot, thanks.', 96), A('A hot one, please.', 88), A("I'd like it hot, please.", 80, 'Правильно, но длинновато — хватит Hot, please.')],
          keywords: ['hot'],
          distractors: [X('Warm, please.', 40, 'warm — тёплый. Горячий напиток — hot.')],
          better: 'Hot, please.', betterRu: 'Горячий, пожалуйста.',
          explain: 'На вопрос-выбор отвечают одним словом + please. Полное предложение здесь не нужно.' },
        { npc: 'Anything else?', npcRu: 'Что-нибудь ещё?', intent: 'Попросите ещё круассан.',
          accepted: [A('Can I also get a croissant, please?', 97), A('And a croissant, please.', 95), A('Yes, a croissant, please.', 93), A("I'll also have a croissant.", 90)],
          keywords: ['croissant'],
          distractors: [X('Also croissant.', 40, 'Не хватает артикля и please: And a croissant, please.')],
          better: 'And a croissant, please.', betterRu: 'И круассан, пожалуйста.',
          explain: 'Добавляя к заказу, говорят And… или Can I also get…', learn: ['Anything else?'] },
        { npc: 'For here or to go?', npcRu: 'Здесь или с собой?', intent: 'Скажите, что возьмёте с собой.',
          accepted: [A('To go, please.', 98), A('To go, thanks.', 96), A("I'll take it to go.", 88), A('Take away, please.', 85, 'Британский вариант — в США скажут To go.')],
          keywords: ['to go|take away|takeaway'],
          distractors: [X('With me.', 25, 'Калька с русского «с собой». Говорят To go.'), X('For go.', 20, 'Так не говорят. Ответ: To go, please.')],
          better: 'To go, please.', betterRu: 'С собой, пожалуйста.',
          explain: 'For here — здесь, to go — с собой. Калька «with me» не работает.', learn: ['For here or to go?', 'To go, please.'] },
        { npc: "That'll be $6.50. Cash or card?", npcRu: 'С вас 6,50. Наличные или карта?', intent: 'Скажите, что заплатите картой.',
          accepted: [A('Card, please.', 97), A('By card, please.', 92), A("I'll pay by card.", 90), A('Card.', 85)],
          keywords: ['card'],
          distractors: [X('With credit.', 30, 'Говорят card / credit card.')],
          better: 'Card, please.', betterRu: 'Картой, пожалуйста.',
          explain: 'Снова вопрос-выбор — достаточно одного слова.', learn: ['Can I pay by card?'] }
      ]
    },
    {
      id: 's-first-day', topic: 'greetings', level: 'A1', title: 'Первый день на курсах', partner: 'Carlos',
      setting: "It's your first day at an English school. Another student sits next to you.", settingRu: 'Первый день в языковой школе. Рядом садится другой студент.',
      closing: 'Bye!', closingRu: 'Пока!',
      turns: [
        { npc: "Hi! I'm Carlos. What's your name?", npcRu: 'Привет! Я Карлос. Как тебя зовут?', intent: 'Представьтесь и скажите, что приятно познакомиться.',
          accepted: [A("Hi Carlos, I'm Anna. Nice to meet you!", 98), A("Hi, I'm Anna. Nice to meet you.", 97), A("I'm Anna. Nice to meet you.", 95), A('My name is Anna. Nice to meet you.', 88, 'Правильно, но в неформальной обстановке I\'m… звучит естественнее.')],
          keywords: ['i am|my name is|name s|call me', 'nice to meet you|nice meeting you|pleased to meet you|good to meet you|great to meet you'],
          distractors: [X('My name Anna.', 20, 'Пропущен глагол: My name is Anna / I\'m Anna.')],
          better: "Hi Carlos, I'm Anna. Nice to meet you!", betterRu: 'Привет, Карлос, я Анна. Приятно познакомиться!',
          explain: 'Повторить имя собеседника — приятный жест. Nice to meet you — почти обязательная часть знакомства.', learn: ['Nice to meet you.'] },
        { npc: 'Nice to meet you too! Where are you from?', npcRu: 'Взаимно! Откуда ты?', intent: 'Скажите, откуда вы, и спросите его в ответ.',
          accepted: [A("I'm from Russia. How about you?", 97), A("I'm from Russia. What about you?", 97), A("I'm from Russia. And you?", 95), A("I'm from Russia. Where are you from?", 90)],
          keywords: ['from', 'you'],
          distractors: [X('I am from the Russia.', 30, 'Без артикля: from Russia.')],
          better: "I'm from Russia. How about you?", betterRu: 'Я из России. А ты?',
          explain: 'Встречный вопрос How about you? / And you? поддерживает разговор — иначе он заглохнет.', learn: ['Where are you from?'] },
        { npc: "I'm from Mexico. So, what do you do?", npcRu: 'Я из Мексики. А кем ты работаешь?', intent: 'Скажите, кем вы работаете (например, менеджер).',
          accepted: [A("I'm a manager at a bank.", 96), A("I'm a manager.", 95), A('I work as a manager.', 92), A('I work in sales.', 94), A("I'm a student.", 95)],
          keywords: ['i am|i work|i study|student'],
          distractors: [X('I am manager.', 45, 'Перед профессией нужен артикль: I\'m a manager.'), X('My work is manager.', 25, 'Калька. Говорят I\'m a manager / I work as a manager.')],
          better: "I'm a manager at a bank.", betterRu: 'Я менеджер в банке.',
          explain: 'Профессия — с артиклем a/an. Также: I work in IT / I work for Google.', learn: ['What do you do?', 'I work in'] },
        { npc: "Cool! Well, class is starting. See you later!", npcRu: 'Круто! Ну, урок начинается. Увидимся!', intent: 'Попрощайтесь дружелюбно.',
          accepted: [A('See you later, Carlos!', 98), A('See you later!', 97), A('Bye, see you later!', 96), A('See you!', 95), A('Take care!', 88)],
          keywords: ['see you|bye|take care|later'],
          distractors: [X('Goodbye forever.', 10, 'Звучит драматично — будто вы больше не увидитесь!')],
          better: 'See you later, Carlos!', betterRu: 'Увидимся, Карлос!',
          explain: 'See you later — дружеское прощание, даже если увидитесь через 5 минут.', learn: ['See you later!', 'Take care!'] }
      ]
    },
    {
      id: 's-shop', topic: 'shop', level: 'A1', title: 'Магазин одежды', partner: 'Sales assistant',
      setting: 'You are shopping for a sweater.', settingRu: 'Вы выбираете свитер в магазине.',
      closing: "Sure! Here's your receipt.", closingRu: 'Конечно! Вот ваш чек.',
      turns: [
        { npc: 'Hi! Can I help you find anything?', npcRu: 'Здравствуйте! Помочь вам что-нибудь найти?', intent: 'Скажите, что просто смотрите.',
          accepted: [A("I'm just looking, thanks.", 98), A('Just looking, thanks.', 97), A("No, thanks. I'm just looking.", 96), A("I'm just browsing, thank you.", 95)],
          keywords: ['just looking|just browsing'],
          distractors: [X('No.', 25, 'Слишком резко. Добавьте I\'m just looking, thanks.'), X('I only watch.', 20, 'watch — смотреть фильм. В магазине — look / browse.')],
          better: "I'm just looking, thanks.", betterRu: 'Я просто смотрю, спасибо.',
          explain: 'Стандартный вежливый способ отказаться от помощи.', learn: ["I'm just looking, thanks."] },
        { npc: 'Sure! Oh, do you like that sweater? It just came in.', npcRu: 'Конечно! О, вам нравится этот свитер? Только поступил.', intent: 'Скажите, что нравится, и спросите, можно ли примерить.',
          accepted: [A('I love it. Can I try it on?', 98), A('Yes! Can I try it on?', 98), A('Can I try it on?', 97), A('Could I try it on?', 97)],
          keywords: ['try'],
          distractors: [X('Can I wear it?', 40, 'wear — носить. Примерить — try on.'), X('Can I test it?', 25, 'test — для техники. Одежду — try on.')],
          better: 'I love it. Can I try it on?', betterRu: 'Очень нравится. Можно примерить?',
          explain: 'try on — примерять. Местоимение стоит между глаголом и частицей: try it on.', learn: ['Can I try it on?'] },
        { npc: 'Of course. What size are you?', npcRu: 'Конечно. Какой у вас размер?', intent: 'Скажите, что обычно носите M.',
          accepted: [A("I'm usually a medium.", 98), A('Usually a medium.', 97), A('Medium, I think.', 94), A('A medium, please.', 92)],
          keywords: ['medium'],
          distractors: [X('I am M size.', 40, 'Говорят: I\'m a medium.'), X('Middle.', 20, 'Средний размер — medium.')],
          better: "I'm usually a medium.", betterRu: 'Обычно я ношу M.',
          explain: 'О размере одежды: I\'m a small / medium / large. usually — «обычно».' },
        { npc: 'How does it fit?', npcRu: 'Как сидит?', intent: 'Скажите, что маловат, и спросите больший размер.',
          accepted: [A("It's a bit too small. Do you have it in a large?", 98), A("It's a little small. Do you have a bigger size?", 95), A('A bit small. Can I try a large?', 93), A("It's too small. Do you have a large?", 90)],
          keywords: ['small', 'large|bigger|big'],
          distractors: [X('It is not fit.', 25, 'Правильно: It doesn\'t fit.')],
          better: "It's a bit too small. Do you have it in a large?", betterRu: 'Маловат. У вас есть L?',
          explain: 'a bit смягчает. Do you have it in… — есть ли в другом размере/цвете.', learn: ["It's a bit too small.", 'Do you have this in'] },
        { npc: "Here's a large. It's $45.", npcRu: 'Вот L. Стоит 45 долларов.', intent: 'Скажите, что берёте, и спросите, можно ли картой.',
          accepted: [A("Perfect, I'll take it. Can I pay by card?", 98), A("I'll take it. Can I pay by card?", 97), A("Great, I'll take it. Do you take cards?", 97)],
          keywords: ['take it|buy it|get it', 'card'],
          distractors: [X('I buy it. Card.', 35, 'В момент решения — I\'ll take it. И вопрос про карту: Can I pay by card?')],
          better: "Perfect, I'll take it. Can I pay by card?", betterRu: 'Отлично, беру. Можно картой?',
          explain: 'I\'ll take it — «беру» (решение прямо сейчас, поэтому will).', learn: ["I'll take it.", 'Can I pay by card?'] }
      ]
    },
    {
      id: 's-hotel', topic: 'hotel', level: 'A2', title: 'Заселение', partner: 'Receptionist',
      setting: 'You arrive at a hotel in London.', settingRu: 'Вы приехали в отель в Лондоне.',
      closing: 'My pleasure. Enjoy your stay!', closingRu: 'Всегда пожалуйста. Приятного отдыха!',
      turns: [
        { npc: 'Good evening! How can I help you?', npcRu: 'Добрый вечер! Чем могу помочь?', intent: 'Скажите, что у вас бронь на имя Смирнов.',
          accepted: [A('Hi, I have a reservation under the name Smirnov.', 98), A('Hi, I have a booking under the name Smirnov.', 97), A('Good evening. I have a reservation under Smirnov.', 96), A("I'd like to check in. The name is Smirnov.", 94)],
          keywords: ['reservation|booking|check in|booked|reserved', 'smirnov|name'],
          distractors: [X('I want my room.', 25, 'Требовательно. I have a reservation — вежливый стандарт.')],
          better: 'Hi, I have a reservation under the name Smirnov.', betterRu: 'Здравствуйте, у меня бронь на имя Смирнов.',
          explain: 'under the name — «на имя». Так уточняют бронь в отеле и ресторане.', learn: ['I have a reservation.', 'under the name'] },
        { npc: "Welcome! You're in room 214. Is there anything else?", npcRu: 'Добро пожаловать! Ваш номер 214. Что-нибудь ещё?', intent: 'Спросите, включён ли завтрак.',
          accepted: [A('Is breakfast included?', 98), A('Yes, is breakfast included?', 97), A('Just one question — is breakfast included?', 97), A('Does the price include breakfast?', 88)],
          keywords: ['breakfast', 'included|include'],
          distractors: [X('Breakfast is free?', 50, 'Понятно по интонации, но Is breakfast included? — стандарт.')],
          better: 'Is breakfast included?', betterRu: 'Завтрак включён?',
          explain: 'included — включён в стоимость.', learn: ['Is breakfast included?'] },
        { npc: 'Yes, from 7 to 10 in the lobby restaurant.', npcRu: 'Да, с 7 до 10 в ресторане в лобби.', intent: 'Спросите, во сколько выезд.',
          accepted: [A('Great. What time is checkout?', 98), A('And what time is checkout?', 97), A('When is checkout?', 94), A('What time do I need to check out?', 93)],
          keywords: ['checkout|check out', 'time|when'],
          distractors: [X('When I must go out?', 25, 'Порядок слов и неверное выражение. What time is checkout?')],
          better: 'Great. What time is checkout?', betterRu: 'Отлично. Во сколько выезд?',
          explain: 'checkout — время выезда (существительное), check out — выехать (глагол).', learn: ['What time is checkout?'] },
        { npc: 'Checkout is at 11 a.m.', npcRu: 'Выезд в 11 утра.', intent: 'Вежливо попросите поздний выезд.',
          accepted: [A('Would it be possible to get a late checkout?', 98), A('Is it possible to get a late checkout?', 97), A('Could I get a late checkout?', 96), A('Can I have a late checkout, please?', 92)],
          keywords: ['late|later'],
          distractors: [X('I want to leave at 2.', 35, 'Звучит как требование. Спросите: Is it possible to…?')],
          better: 'Would it be possible to get a late checkout?', betterRu: 'Можно ли выехать попозже?',
          explain: 'Would it be possible to…? — очень вежливая просьба.', learn: ['a late checkout', 'Would it be possible to'] },
        { npc: 'Sure, I can give you until 1 p.m.', npcRu: 'Конечно, могу дать до часу дня.', intent: 'Тепло поблагодарите.',
          accepted: [A('Thank you, I really appreciate it.', 98), A("That's great, thank you so much!", 98), A('Perfect, thanks a lot!', 97), A('Thanks!', 90)],
          keywords: ['thank|thanks|appreciate'],
          distractors: [],
          better: 'Thank you, I really appreciate it.', betterRu: 'Спасибо, очень признателен.',
          explain: 'I really appreciate it — тёплая благодарность за услугу.' }
      ]
    },
    {
      id: 's-passport', topic: 'travel', level: 'A2', title: 'Паспортный контроль', partner: 'Officer',
      setting: "You're at passport control at New York JFK airport.", settingRu: 'Вы на паспортном контроле в аэропорту JFK в Нью-Йорке.',
      closing: 'Next!', closingRu: 'Следующий!',
      turns: [
        { npc: 'Good afternoon. Passport, please.', npcRu: 'Добрый день. Паспорт, пожалуйста.', intent: 'Поздоровайтесь и отдайте паспорт.',
          accepted: [A('Good afternoon. Here you go.', 98), A("Here's my passport.", 98), A('Here you are.', 97), A('Sure, here it is.', 96)],
          keywords: ['here'],
          distractors: [X('Take.', 15, 'Калька «Возьмите». Говорят Here you are / Here you go.')],
          better: 'Good afternoon. Here you go.', betterRu: 'Добрый день. Вот, пожалуйста.',
          explain: 'Протягивая что-то: Here you are / Here you go / Here it is.', learn: ["Here's my passport."] },
        { npc: "What's the purpose of your visit?", npcRu: 'Какова цель визита?', intent: 'Скажите, что вы в отпуске.',
          accepted: [A("I'm here on vacation.", 98), A("I'm on vacation.", 95), A('Vacation.', 92), A('Tourism.', 90), A("I'm here on holiday.", 90, 'Британский вариант — в США скажут vacation.')],
          keywords: ['vacation|holiday|tourism|tourist|travel|visit|sightseeing'],
          distractors: [X("I'm here for rest.", 35, 'Калька «на отдых». Говорят on vacation.')],
          better: "I'm here on vacation.", betterRu: 'Я в отпуске.',
          explain: 'on vacation (США) / on holiday (Великобритания).', learn: ["I'm here on vacation."] },
        { npc: 'How long are you staying?', npcRu: 'Как долго вы пробудете?', intent: 'Скажите, что десять дней.',
          accepted: [A("I'm staying for ten days.", 98), A('For ten days.', 97), A('Ten days.', 95), A('About ten days.', 94)],
          keywords: ['ten|10', 'day'],
          distractors: [X('During ten days.', 30, 'С числом используют for: for ten days.')],
          better: "I'm staying for ten days.", betterRu: 'Я пробуду десять дней.',
          explain: 'Длительность — предлог for. Present Continuous — для запланированного.', learn: ["I'm staying for"] },
        { npc: 'Where are you staying?', npcRu: 'Где вы остановитесь?', intent: 'Скажите, что в отеле на Манхэттене.',
          accepted: [A("I'm staying at a hotel in Manhattan.", 98), A('At a hotel in Manhattan.', 97), A('At the Hilton in Manhattan.', 96)],
          keywords: ['hotel|hilton|marriott|hostel', 'manhattan'],
          distractors: [X('In hotel.', 40, 'Нужен артикль и детали: at a hotel in Manhattan.')],
          better: "I'm staying at a hotel in Manhattan.", betterRu: 'Я остановлюсь в отеле на Манхэттене.',
          explain: 'at a hotel — «в отеле» (как место).' },
        { npc: 'Okay. Enjoy your stay.', npcRu: 'Хорошо. Приятного пребывания.', intent: 'Поблагодарите и пожелайте хорошего дня.',
          accepted: [A('Thanks, have a good day!', 98), A('Thank you, have a nice day.', 98), A('Thank you!', 95)],
          keywords: ['thank|thanks'],
          distractors: [X('You too.', 30, 'Офицер не отдыхает — «you too» тут смешно.')],
          better: 'Thanks, have a good day!', betterRu: 'Спасибо, хорошего дня!',
          explain: 'Отвечаем благодарностью и пожеланием.' }
      ]
    },
    {
      id: 's-taxi', topic: 'city', level: 'A2', title: 'Такси из аэропорта', partner: 'Taxi driver',
      setting: 'You get into a taxi at the airport in Chicago.', settingRu: 'Вы садитесь в такси в аэропорту Чикаго.',
      closing: 'Here you go. Enjoy Chicago!', closingRu: 'Держите. Приятно провести время в Чикаго!',
      turns: [
        { npc: 'Hi there! Where to?', npcRu: 'Здравствуйте! Куда едем?', intent: 'Попросите отвезти в отель Palmer House.',
          accepted: [A('Hi! The Palmer House Hotel, please.', 98), A('Could you take me to the Palmer House Hotel?', 97), A('To the Palmer House Hotel, please.', 97), A('Take me to the Palmer House, please.', 92)],
          keywords: ['palmer'],
          distractors: [X('Drive to Palmer House.', 30, 'Приказ звучит грубо. Просто название + please.')],
          better: 'Hi! The Palmer House Hotel, please.', betterRu: 'Здравствуйте! В отель Palmer House, пожалуйста.',
          explain: 'Таксисту достаточно назвать место + please.', learn: ['Take me to'] },
        { npc: 'Sure thing. First time in Chicago?', npcRu: 'Конечно. Впервые в Чикаго?', intent: 'Скажите, что да, и спросите, далеко ли ехать.',
          accepted: [A("Yeah, first time! Is it far from here?", 98), A("Yes, it's my first time. Is it far?", 98), A('Yes. How long does it take to get there?', 94), A('Yes, it is. How far is it?', 92)],
          keywords: ['yes|first|yeah', 'far|long'],
          distractors: [X('Yes. It is far?', 45, 'Порядок слов в вопросе: Is it far?')],
          better: 'Yeah, first time! Is it far from here?', betterRu: 'Да, впервые! Это далеко?',
          explain: 'В вопросе глагол to be идёт перед подлежащим: Is it far?', learn: ['Is it far from here?'] },
        { npc: "About 40 minutes. It's rush hour.", npcRu: 'Минут 40. Сейчас час пик.', intent: 'Спросите, можно ли оплатить картой.',
          accepted: [A('No problem. Do you take cards?', 98), A('Okay. Can I pay by card?', 98), A('Can I pay with a card?', 93)],
          keywords: ['card'],
          distractors: [X('Card is possible?', 35, 'Калька. Can I pay by card? / Do you take cards?')],
          better: 'No problem. Do you take cards?', betterRu: 'Без проблем. Карты принимаете?',
          explain: 'Do you take cards? — «вы принимаете карты?» — очень естественно.', learn: ['Can I pay by card?', 'rush hour'] },
        { npc: "Sure, card's fine. … Okay, here we are.", npcRu: 'Конечно, можно картой. … Приехали.', intent: 'Поблагодарите и попросите чек.',
          accepted: [A('Thanks! Can I get a receipt, please?', 98), A('Could I get a receipt?', 97), A('Can I have a receipt, please?', 95)],
          keywords: ['receipt'],
          distractors: [X('Give me check.', 25, 'check — счёт в ресторане. Из такси — receipt. И give me — грубо.')],
          better: 'Thanks! Can I get a receipt, please?', betterRu: 'Спасибо! Можно чек?',
          explain: 'receipt читается [ри-сИт] — p не произносится!', learn: ['Can I get a receipt?'] }
      ]
    },
    {
      id: 's-doctor', topic: 'health', level: 'B1', title: 'У врача', partner: 'Dr. Patel',
      setting: "You're at a clinic because you've felt sick for three days.", settingRu: 'Вы в клинике — вам плохо уже три дня.',
      closing: 'Take care. Get well soon!', closingRu: 'Берегите себя. Выздоравливайте!',
      turns: [
        { npc: "Hi, I'm Dr. Patel. What seems to be the problem?", npcRu: 'Здравствуйте, я доктор Патель. Что вас беспокоит?', intent: 'Скажите, что три дня болят горло и голова.',
          accepted: [A("I've had a sore throat and a headache for three days.", 98), A("I've been feeling sick for three days — sore throat and headache.", 97), A("My throat hurts and I have a headache. It's been three days.", 95)],
          keywords: ['throat', 'head|headache', 'three|3|days'],
          distractors: [X('I am sick three days.', 30, 'Для длительности до настоящего — Present Perfect: I\'ve been sick for three days.')],
          better: "I've had a sore throat and a headache for three days.", betterRu: 'Три дня болит горло и голова.',
          explain: 'Present Perfect + for — для того, что началось в прошлом и продолжается.', learn: ['I have a headache', "I've been feeling"] },
        { npc: 'I see. Do you have a fever?', npcRu: 'Понятно. Температура есть?', intent: 'Скажите, что вчера была небольшая температура, а сегодня нет.',
          accepted: [A('I had a slight fever yesterday, but not today.', 98), A('Yes, I had a low fever yesterday.', 96), A('A little bit yesterday, but not today.', 94), A('I had a temperature yesterday.', 92)],
          keywords: ['fever|temperature|little|bit', 'yesterday'],
          distractors: [X('I had temperature.', 40, 'Нужен артикль: a temperature, или a fever.')],
          better: 'I had a slight fever yesterday, but not today.', betterRu: 'Вчера была небольшая температура, сегодня нет.',
          explain: 'fever — жар. «Температура» как симптом — a temperature (с артиклем).' },
        { npc: 'Are you taking any medication right now?', npcRu: 'Принимаете сейчас какие-нибудь лекарства?', intent: 'Скажите, что только обезболивающее от головной боли.',
          accepted: [A('Just some painkillers for the headache.', 98), A('Only painkillers for my headache.', 95), A("I'm just taking painkillers.", 94), A('Just ibuprofen for the headache.', 96)],
          keywords: ['painkiller|painkillers|pain killers|ibuprofen|aspirin|paracetamol|tylenol|advil'],
          distractors: [X('I drink pills.', 30, 'Таблетки не «пьют»: take pills / take medication.')],
          better: 'Just some painkillers for the headache.', betterRu: 'Только обезболивающее от головы.',
          explain: 'Лекарства по-английски take, а не drink.' },
        { npc: 'It looks like a virus. Rest, drink lots of fluids, and take these twice a day.', npcRu: 'Похоже на вирус. Отдыхайте, пейте больше жидкости и принимайте это дважды в день.', intent: 'Спросите про побочные эффекты.',
          accepted: [A('Okay. Are there any side effects?', 98), A('Does it have any side effects?', 97), A('Are there side effects?', 94)],
          keywords: ['side effect|side effects'],
          distractors: [],
          better: 'Okay. Are there any side effects?', betterRu: 'Хорошо. Есть побочные эффекты?',
          explain: 'side effects — побочные эффекты. В вопросе — any.', learn: ['side effects'] },
        { npc: 'Some people feel a bit sleepy. You should feel better in a few days.', npcRu: 'Бывает сонливость. Через пару дней станет лучше.', intent: 'Поблагодарите врача.',
          accepted: [A('Great, thank you so much.', 97), A('Thanks, I appreciate it.', 97), A('Thank you, doctor.', 96)],
          keywords: ['thank|thanks|appreciate'],
          distractors: [],
          better: 'Great, thank you so much, doctor.', betterRu: 'Отлично, большое спасибо, доктор.',
          explain: 'Коротко и тепло.' }
      ]
    },
    {
      id: 's-party', topic: 'smalltalk', level: 'B1', title: 'Вечеринка', partner: 'Grace',
      setting: "You're at a colleague's housewarming party. Someone starts talking to you by the snacks.", settingRu: 'Вы на новоселье у коллеги. У стола с закусками с вами заговаривают.',
      closing: 'Great! Let me get your number.', closingRu: 'Отлично! Давай обменяемся номерами.',
      turns: [
        { npc: "These snacks are amazing, aren't they?", npcRu: 'Закуски потрясающие, правда?', intent: 'Согласитесь и представьтесь.',
          accepted: [A("They really are! I'm Alex, by the way.", 98), A("I know, right? I'm Alex, by the way.", 98), A("Yeah, they're great. I'm Alex.", 96)],
          keywords: ['i am|name', 'yes|really|right|great|amazing|delicious|agree|they are|so good'],
          distractors: [X('Yes. I am Alex.', 55, 'Правильно, но суховато. They really are! + by the way — живее.')],
          better: "They really are! I'm Alex, by the way.", betterRu: 'И правда! Кстати, я Алекс.',
          explain: 'by the way — «кстати»: мягко переходим к знакомству.' },
        { npc: "Nice to meet you, Alex. I'm Grace. So, how do you know Ben?", npcRu: 'Приятно, Алекс. Я Грейс. А откуда ты знаешь Бена?', intent: 'Скажите, что вы работаете вместе, и спросите её.',
          accepted: [A('Nice to meet you too! We work together. How about you?', 98), A('We work together. How about you?', 98), A("We're colleagues. What about you?", 96), A('We work together. How do you know him?', 97)],
          keywords: ['work|colleague|colleagues|office', 'you'],
          distractors: [X('From work.', 55, 'Понятно, но встречный вопрос поддержит разговор.')],
          better: 'Nice to meet you too! We work together. How about you?', betterRu: 'Взаимно! Мы работаем вместе. А ты?',
          explain: 'Ответ + встречный вопрос — основа small talk.', learn: ['How do you know'] },
        { npc: 'We were roommates in college. Have you been to one of his parties before?', npcRu: 'Мы жили вместе в колледже. Ты уже бывал на его вечеринках?', intent: 'Скажите, что нет, это первый раз, и добавьте что-то позитивное.',
          accepted: [A("No, this is my first time. It's a great place!", 98), A('No, this is my first time.', 96), A("Nope, it's my first one!", 96), A("No, never. It's my first time here.", 95)],
          keywords: ['no|never|first|nope'],
          distractors: [X("No, I didn't been.", 20, 'Ошибка: No, I haven\'t / No, this is my first time.')],
          better: "No, this is my first time. It's a great place!", betterRu: 'Нет, впервые. Классное место!',
          explain: 'Позитивная деталь делает разговор легче.', learn: ['Have you been here before?'] },
        { npc: 'So, what have you been up to lately?', npcRu: 'Ну, чем занимаешься в последнее время?', intent: 'Скажите, что в основном работаете, но на выходных ходили в поход.',
          accepted: [A('Oh, you know, work mostly. But I went hiking last weekend.', 98), A("Work's been crazy, but I went hiking last weekend.", 97), A('Not much, just work. I went hiking on the weekend, though.', 95)],
          keywords: ['work', 'hiking|hike|hiked'],
          distractors: [X('I work. I did hiking.', 35, '«did hiking» — калька. Говорят went hiking.')],
          better: 'Oh, you know, work mostly. But I went hiking last weekend.', betterRu: 'Да так, в основном работа. Но на выходных ходил в поход.',
          explain: 'go + -ing для активностей: go hiking, go swimming.', learn: ['What have you been up to?', 'Oh, you know, the usual'] },
        { npc: 'Oh, I love hiking! We should all go together sometime.', npcRu: 'О, обожаю походы! Надо как-нибудь сходить всем вместе.', intent: 'С энтузиазмом согласитесь.',
          accepted: [A("I'd love that! Count me in.", 98), A("That sounds fun! Let's do it.", 97), A('Definitely! That would be great.', 96), A('Sounds great!', 94)],
          keywords: ['love|fun|great|yes|sure|definitely|count me in|good|awesome|absolutely'],
          distractors: [X('Okay, maybe.', 40, 'Звучит равнодушно.')],
          better: "I'd love that! Count me in.", betterRu: 'С удовольствием! Я в деле.',
          explain: 'Count me in — «я в деле», энергичное согласие.', learn: ['That sounds fun!', 'Count me in!'] }
      ]
    },
    {
      id: 's-restaurant-problem', topic: 'cafe', level: 'B1', title: 'Проблема с заказом', partner: 'Waiter',
      setting: "You're at a restaurant. The waiter brings the wrong dish.", settingRu: 'Вы в ресторане. Официант приносит не то блюдо.',
      closing: "It's the least we can do.", closingRu: 'Это меньшее, что мы можем сделать.',
      turns: [
        { npc: 'Here you go — the mushroom risotto!', npcRu: 'Пожалуйста — ризотто с грибами!', intent: 'Вежливо скажите, что заказывали пасту с курицей.',
          accepted: [A('Sorry, I think there\'s a mistake. I ordered the chicken pasta.', 98), A('Sorry, I actually ordered the chicken pasta.', 98), A("Excuse me, this isn't what I ordered. I asked for the chicken pasta.", 97)],
          keywords: ['chicken', 'pasta', 'order|ordered|asked'],
          distractors: [X('This is wrong food!', 25, 'Резко. Начните с Sorry / Excuse me.')],
          better: "Sorry, I think there's been a mistake. I ordered the chicken pasta.", betterRu: 'Извините, кажется, ошибка. Я заказывал пасту с курицей.',
          explain: 'Sorry, I think… смягчает — так вас быстрее поймут и не обидятся.', learn: ["This isn't what I ordered."] },
        { npc: "Oh, I'm so sorry! I'll bring it right away.", npcRu: 'Ой, простите! Сейчас принесу.', intent: 'Скажите, что ничего страшного.',
          accepted: [A('No worries, it happens.', 98), A("That's okay, don't worry about it.", 98), A('No problem, it happens.', 97), A("It's fine, thanks.", 94)],
          keywords: ['no problem|no worries|okay|ok|fine|worry|happens|all right|alright'],
          distractors: [X('Hurry up.', 15, 'Грубо.')],
          better: 'No worries, it happens.', betterRu: 'Ничего страшного, бывает.',
          explain: 'it happens — «бывает». Дружелюбно снимаем напряжение.', learn: ["Don't worry about it.", 'No worries.'] },
        { npc: 'Here you go. Is everything okay with your meal?', npcRu: 'Пожалуйста. Всё в порядке с блюдом?', intent: 'Скажите, что вкусно, но немного холодное.',
          accepted: [A("It's really tasty, but it's a bit cold, actually.", 98), A("It's delicious, but it's a bit cold. Could you warm it up?", 98), A("It's good, but it's a little cold.", 96)],
          keywords: ['cold'],
          distractors: [X("It's cold. Bad.", 25, 'Слишком резко. a bit смягчает жалобу.')],
          better: "It's really tasty, but it's a bit cold, actually.", betterRu: 'Очень вкусно, но немного холодное.',
          explain: 'Критика «сэндвичем»: похвала + a bit + проблема.' },
        { npc: "I'm so sorry. Let me warm it up. And dessert's on us tonight.", npcRu: 'Простите. Сейчас подогрею. И десерт сегодня за наш счёт.', intent: 'Поблагодарите за жест.',
          accepted: [A("Oh, that's very kind of you. Thank you!", 98), A("Oh, that's so nice, thank you!", 97), A('Thanks, I really appreciate it.', 97)],
          keywords: ['thank|thanks|appreciate|kind|nice'],
          distractors: [],
          better: "Oh, that's very kind of you. Thank you!", betterRu: 'Ох, как мило. Спасибо!',
          explain: 'That\'s very kind of you — вежливая благодарность за жест.', learn: ["It's on me."] }
      ]
    },
    {
      id: 's-colleague', topic: 'work', level: 'B2', title: 'Просьба коллеги', partner: 'Sam',
      setting: "Your colleague asks for help, but you're very busy this week.", settingRu: 'Коллега просит помочь, но вы очень заняты на этой неделе.',
      closing: 'Will do. Thanks again!', closingRu: 'Обязательно. Ещё раз спасибо!',
      turns: [
        { npc: 'Hey, do you have a minute? Could you help me with the sales report?', npcRu: 'Есть минутка? Поможешь с отчётом по продажам?', intent: 'Мягко скажите, что вы очень загружены на этой неделе.',
          accepted: [A("I'd love to help, but I'm swamped this week.", 98), A("I wish I could, but I'm snowed under this week.", 97), A("Sorry, I've got a lot on my plate this week.", 97), A("Sorry, I'm really busy this week.", 92)],
          keywords: ['busy|swamped|snowed|plate|a lot'],
          distractors: [X("No, I can't. I'm busy.", 40, 'Резкий отказ. Смягчите: I\'d love to help, but…')],
          better: "I'd love to help, but I'm swamped this week.", betterRu: 'Я бы с радостью, но на этой неделе завален.',
          explain: 'Отказ коллеге смягчают: I\'d love to, but… / I wish I could, but…', learn: ["I'm swamped."] },
        { npc: "Oh, I see. It's due on Friday, though.", npcRu: 'Понятно. Но срок — пятница.', intent: 'Предложите помочь в четверг утром.',
          accepted: [A('I could give you a hand on Thursday morning. Would that work?', 98), A('How about Thursday morning? I could help you then.', 98), A('Would Thursday morning work for you?', 97)],
          keywords: ['thursday', 'morning'],
          distractors: [X('Thursday morning maybe I help.', 40, 'Нужен модальный: I could help / I can help.')],
          better: 'I could give you a hand on Thursday morning. Would that work?', betterRu: 'Могу помочь в четверг утром. Подойдёт?',
          explain: 'Предложение с could звучит мягко и гибко.', learn: ['How about', 'give me a hand'] },
        { npc: 'Thursday works. Could you check the numbers in section two?', npcRu: 'Четверг подходит. Проверишь цифры во втором разделе?', intent: 'Согласитесь и уточните, смотреть ли ещё графики.',
          accepted: [A('Sure. Just to clarify, do you want me to check the charts too?', 98), A('Sure. Do you need me to check the charts too?', 97), A('No problem. Should I look at the charts as well?', 96)],
          keywords: ['chart|charts|graph|graphs'],
          distractors: [X('Okay. Charts too or no?', 45, 'Понятно, но резковато. Just to clarify… — вежливое уточнение.')],
          better: 'Sure. Just to clarify, do you want me to check the charts too?', betterRu: 'Конечно. Просто уточню: графики тоже проверить?',
          explain: 'Just to clarify — «просто уточню»: вежливо и профессионально.', learn: ['Just to clarify'] },
        { npc: "Just the numbers. Thanks so much, you're a lifesaver!", npcRu: 'Только цифры. Спасибо огромное, выручаешь!', intent: 'Скажите «не за что» и попросите держать в курсе.',
          accepted: [A('Happy to help! Keep me posted.', 98), A('No problem! Keep me posted.', 98), A('Anytime! Let me know if anything changes.', 97)],
          keywords: ['no problem|happy|anytime|sure|welcome|no worries|pleasure', 'posted|updated|let me know|in the loop'],
          distractors: [],
          better: 'Happy to help! Keep me posted.', betterRu: 'Рад помочь! Держи в курсе.',
          explain: 'Keep me posted — «держи меня в курсе».', learn: ['Keep me posted.', 'Let me know.'] }
      ]
    },
    {
      id: 's-reschedule', topic: 'plans', level: 'B2', title: 'Перенос встречи', partner: 'Mia',
      setting: 'You planned dinner with a friend tonight, but something came up at work.', settingRu: 'Вы договорились поужинать с подругой, но на работе возникли дела.',
      closing: 'Thanks for understanding! Good luck with the deadline.', closingRu: 'Спасибо за понимание! Удачи с дедлайном.',
      turns: [
        { npc: 'Hey! Still on for dinner at 8?', npcRu: 'Привет! В силе ужин в 8?', intent: 'Извинитесь и скажите, что не сможете — возникли дела на работе.',
          accepted: [A("I'm so sorry, but something came up at work. I can't make it tonight.", 98), A("I'm really sorry, I can't make it tonight. Something came up at work.", 98), A("Sorry, something came up. I won't be able to make it.", 97)],
          keywords: ['sorry', 'make it|come|able|cancel'],
          distractors: [X("I can't come. Work.", 40, 'Суховато. Извинитесь и объясните мягче.')],
          better: "I'm so sorry, but something came up at work. I can't make it tonight.", betterRu: 'Прости, на работе кое-что случилось. Сегодня не смогу.',
          explain: 'Something came up — универсальная причина. I can\'t make it — «не смогу прийти».', learn: ['Something came up.', "I can't make it."] },
        { npc: "Oh no, that's too bad. Is everything okay?", npcRu: 'Ох, жаль. Всё в порядке?', intent: 'Успокойте: ничего серьёзного, просто срочный дедлайн.',
          accepted: [A("Yeah, it's nothing serious — just a last-minute deadline.", 98), A("Everything's fine, just a last-minute deadline.", 97), A("Yes, don't worry. It's just a work deadline.", 96)],
          keywords: ['deadline|work|project', 'fine|serious|okay|ok|worry|good'],
          distractors: [],
          better: "Yeah, it's nothing serious — just a last-minute deadline.", betterRu: 'Да, ничего серьёзного — просто срочный дедлайн.',
          explain: 'last-minute — «в последний момент».', learn: ["It's nothing serious.", 'deadline'] },
        { npc: 'No worries. Want to reschedule?', npcRu: 'Ничего страшного. Перенесём?', intent: 'Предложите пятницу.',
          accepted: [A('Definitely! Does Friday work for you?', 98), A('Yes! How about Friday?', 98), A('Can we do Friday instead?', 96)],
          keywords: ['friday'],
          distractors: [X('Friday is good for me, for you?', 45, 'Говорят: Does Friday work for you?')],
          better: 'Definitely! Does Friday work for you?', betterRu: 'Конечно! Тебе удобно в пятницу?',
          explain: 'Does … work for you? — «тебе удобно?» Самый естественный способ предложить время.', learn: ['Can we reschedule?', 'What time works for you?'] },
        { npc: "Friday's tricky. Can I let you know tomorrow?", npcRu: 'С пятницей сложно. Можно скажу завтра?', intent: 'Скажите, что конечно, без спешки — как ей удобно.',
          accepted: [A('Sure, no rush. Whatever works for you.', 98), A('Sure, no rush. We can play it by ear.', 98), A('Of course! Just let me know.', 96)],
          keywords: ['sure|of course|course|okay|ok|no problem|fine|yes|absolutely'],
          distractors: [],
          better: 'Sure, no rush. Whatever works for you.', betterRu: 'Конечно, не спеши. Как тебе удобнее.',
          explain: 'no rush — «не спеши». Whatever works for you — гибко и дружелюбно.', learn: ['Whatever works for you.', 'play it by ear'] }
      ]
    },
    {
      id: 's-complaint', topic: 'problems', level: 'C1', title: 'Жалоба в поддержку', partner: 'Support agent',
      setting: 'Your internet has been down for three days. You call your provider for the second time.', settingRu: 'Интернет не работает три дня. Вы звоните провайдеру во второй раз.',
      closing: 'Between 9 and 12. Thank you for your patience!', closingRu: 'С 9 до 12. Спасибо за терпение!',
      turns: [
        { npc: 'Thank you for calling. How can I help you today?', npcRu: 'Спасибо за звонок. Чем помочь?', intent: 'Скажите, что интернет не работает три дня и вы звоните уже второй раз.',
          accepted: [A("Hi, my internet has been down for three days, and this is the second time I'm calling.", 98), A("I'm calling again because my internet hasn't worked for three days.", 96), A("My internet's been down for three days. I already called once.", 96)],
          keywords: ['internet|connection|wifi|wi fi', 'three|3|days', 'second|again|already|twice'],
          distractors: [X('Internet not working three days!', 30, 'Пропущены глаголы. Present Perfect: has been down for three days.')],
          better: "Hi, my internet has been down for three days, and this is the second time I'm calling.", betterRu: 'Здравствуйте, интернет не работает три дня, и я звоню уже второй раз.',
          explain: 'be down — не работать (о сети, сервисе). Present Perfect — для длительности до сейчас.' },
        { npc: 'I apologize for the inconvenience. A technician can come next Tuesday.', npcRu: 'Приносим извинения. Техник может прийти в следующий вторник.', intent: 'Вежливо, но твёрдо: это слишком поздно, вы работаете из дома.',
          accepted: [A('I understand, but I work from home. Is there any way to get someone out sooner?', 98), A("I'm afraid that's not good enough. I work from home, so I need it fixed sooner.", 98), A('With respect, Tuesday is too late. I work from home.', 95)],
          keywords: ['work from home|work at home|home', 'soon|sooner|late|earlier|faster|today|tomorrow|asap'],
          distractors: [X('Tuesday? Are you crazy?', 10, 'Оскорбление — худший способ добиться результата.')],
          better: 'I understand, but I work from home. Is there any way to get someone out sooner?', betterRu: 'Понимаю, но я работаю из дома. Можно прислать кого-то раньше?',
          explain: 'I\'m afraid… / I understand, but… — твёрдость без грубости.', learn: ['Is there any way', 'work from home'] },
        { npc: 'Let me see… The earliest I can do is Friday.', npcRu: 'Посмотрим… Самое раннее — пятница.', intent: 'Попросите передать вопрос руководителю.',
          accepted: [A("I'd appreciate it if you could escalate this. Could I speak to a supervisor?", 98), A("In that case, I'd like to escalate this. Can I speak to your manager?", 97), A('Could you put me through to a supervisor, please?', 96)],
          keywords: ['supervisor|manager|escalate|someone else|senior'],
          distractors: [X('Give me your boss.', 20, 'Грубо. Could I speak to a supervisor?')],
          better: "I'd appreciate it if you could escalate this. Could I speak to a supervisor?", betterRu: 'Буду признателен, если вы передадите вопрос выше. Можно поговорить с руководителем?',
          explain: 'escalate — передать выше. Формально, но твёрдо.', learn: ["I'd like to escalate this.", "I'd appreciate it if", "I'll put you through."] },
        { npc: 'One moment… Good news: my supervisor approved a visit tomorrow morning, and a credit for the three days.', npcRu: 'Минуту… Хорошие новости: руководитель одобрил визит завтра утром и компенсацию за три дня.', intent: 'Поблагодарите и спросите, во сколько ждать техника.',
          accepted: [A("That's a relief, thank you. What time should I expect the technician?", 98), A("Thank you, I really appreciate it. Do you know what time they'll arrive?", 97), A('Great, thanks for your help. What time will the technician come?', 96)],
          keywords: ['thank|thanks|appreciate|relief', 'time|when'],
          distractors: [X('Finally. What time?', 35, 'Звучит раздражённо — сотрудник же помог.')],
          better: "That's a relief, thank you. What time should I expect the technician?", betterRu: 'Какое облегчение, спасибо. Во сколько ждать техника?',
          explain: 'What time should I expect…? — вежливый деловой вопрос.', learn: ["That's a relief."] }
      ]
    }
  ];

  /* ---------- индексы ---------- */
  D.dialoguesById = Object.create(null); // без прототипа: id «constructor» из backup не найдёт Object
  D.dialogues.forEach(function (d) { D.dialoguesById[d.id] = d; });
  D.scenariosById = Object.create(null); // без прототипа: id «constructor» из backup не найдёт Object
  D.scenarios.forEach(function (s) { D.scenariosById[s.id] = s; });
})(window.EG = window.EG || {});
