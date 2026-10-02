/* data/chats-extra.js — ещё контакты мессенджера: друзья, рабочие и формальные переписки.
   Формат тот же, что в data/chats.js; файл подключается после chats-more.js и дополняет списки и индексы.
   Регистры: leo/chloe — дружеский, marcus — рабочий чат, grace/helen — формальная переписка. */
(function (EG) {
  'use strict';

  var D = EG.data = EG.data || {};
  function A(t, n, note) { return { t: t, n: n, note: note || '' }; }
  function X(t, n, note) { return { t: t, n: n, note: note }; }
  var DECLINE = ['can not|sorry|busy|unfortunately|no thanks|nah|maybe next time|another time|not really'];

  var contacts = [
    { id: 'leo', name: 'Leo', color: '#dc2626', role: 'друг из зала', register: 'slang', about: 'Друг по спортзалу. Сплошные сокращения и эмодзи, шутит про день ног.',
      confused: ['huh? 😅', 'wait what lol'] },
    { id: 'chloe', name: 'Chloe', color: '#d946ef', role: 'подруга', register: 'casual', about: 'Подруга из книжного клуба. Неформально, но полными словами.',
      confused: ['Sorry, I do not follow 😅', 'Hmm, what do you mean?'] },
    { id: 'marcus', name: 'Marcus', color: '#2563eb', role: 'коллега из другого отдела', register: 'semi', about: 'Коллега из соседнего отдела. Рабочий чат: коротко, дружелюбно, без сленга.',
      confused: ['Sorry, could you clarify?', 'Not sure I follow — what do you mean?'] },
    { id: 'grace', name: 'Grace Lin', color: '#0891b2', role: 'клиентка', register: 'formal', about: 'Клиентка компании. Деловая переписка: полные формы, вежливые формулы.',
      confused: ['I am sorry, I do not quite follow.', 'Could you clarify that, please?'] },
    { id: 'helen', name: 'Helen Price', color: '#7c3aed', role: 'преподаватель курса', register: 'formal', about: 'Преподаватель языкового курса. Знакомый человек, но пишете вы ей вежливо и полными формами.',
      confused: ['Sorry, could you rephrase that?', 'I am not sure I understand — could you explain?'] }
  ];

  var episodes = [
    /* ================= Leo — друг из зала, сленг ================= */
    {
      id: 'leo-1', contactId: 'leo', order: 1, level: 'A2', title: 'Зал вечером',
      intro: 'Лео зовёт на тренировку.', learn: ["I'm down.", 'Let me know.', 'What time works for you?'],
      start: 'a',
      nodes: {
        a: { them: ['yo! gym 2nite?'], ru: ['Йо! В зал сегодня вечером?'], next: 'b',
          reply: { intent: 'Согласитесь и спросите, во сколько.',
            accepted: [A("yeah im down, what time?", 98), A('sure! what time?', 96), A('yep! when?', 95), A('Yes, I am free. What time?', 85, 'Правильно, но другу в чате пишут короче: yeah im down, what time?')],
            keywords: ['yes|yeah|sure|down|in|ok', 'time|when'],
            distractors: [X('I would like to attend the gym.', 25, 'Звучит книжно, как из учебника. Другу: im down, what time?')],
            better: 'yeah im down! what time?', betterRu: 'Да, я за! Во сколько?',
            explain: '2nite = tonight. im down — «я за, я в деле».',
            branches: [{ keywords: DECLINE, next: 'x' }] } },
        b: { them: ['7? ill be there after work', 'leg day 💀'], ru: ['В 7? Я буду после работы', 'День ног 💀'], next: 'c',
          reply: { intent: 'Согласитесь на 7 и скажите, что после прошлого раза всё ещё болят мышцы.',
            accepted: [A('7 works! im still sore from last time 😭', 98), A('ok 7! my legs still hurt lol', 96), A('sounds good, still sore tho', 95), A('Seven is fine. I am still sore from last time.', 88, 'Верно, но другу проще: 7 works!')],
            keywords: ['7|seven', 'sore|hurt|hurts|aching|pain|dying'],
            distractors: [X('I have muscle pain in my legs.', 35, 'Грамматически верно, но в чате скажут: im still sore')],
            better: '7 works! still sore from last time 💀', betterRu: 'В 7 норм! Ещё не отошёл после прошлого раза 💀',
            explain: 'sore — «мышцы болят после тренировки». tho = though — «правда, впрочем».' } },
        c: { them: ['lol no pain no gain', 'can u bring my resistance band? left it at urs'], ru: ['Лол, без боли нет результата', 'Можешь принести мою резинку? Забыл у тебя'], next: 'end',
          reply: { intent: 'Скажите, что возьмёте и не забудете.',
            accepted: [A('sure, ill bring it', 98), A('ofc! wont forget', 97), A('yep got it 👍', 95), A('Yes, I will bring it with me.', 88)],
            keywords: ['bring|got it|sure|yes|ok|remember|forget'],
            distractors: [],
            better: 'sure! ill bring it 👍', betterRu: 'Конечно! Принесу 👍',
            explain: 'urs = yours. no pain no gain — «без труда ничего не выйдет».' } },
        end: { them: ['💪 see u at 7'], ru: ['💪 Увидимся в 7'], end: true },
        x: { them: ['aight next time then', 'dont skip leg day tho 😤'], ru: ['Лады, тогда в другой раз', 'Но день ног не пропускай 😤'], end: true }
      }
    },
    {
      id: 'leo-2', contactId: 'leo', order: 2, level: 'B1', title: 'Отмена в последний момент',
      intro: 'Лео уже в зале и ждёт вас, но у вас не получается прийти.', learn: ['Something came up.', "I can't make it.", 'Can we reschedule?'],
      start: 'a',
      nodes: {
        a: { them: ['yo where u at? 😅', 'been here 15 min already'], ru: ['Йо, ты где? 😅', 'Я тут уже 15 минут'], next: 'b',
          reply: { intent: 'Извинитесь: на работе возникли дела, вы не сможете прийти.',
            accepted: [A("im so sorry, something came up at work. i cant make it today 😞", 98), A('sorry! work stuff came up, cant make it', 97), A('ugh sorry, something came up. not gonna make it today', 96)],
            keywords: ['can not|not make it|not coming', 'sorry|work|came up'],
            distractors: [X('I will not come.', 30, 'Сухо и без объяснения — друг обидится. Извинитесь и объясните причину.')],
            better: "so sorry! something came up at work, i cant make it 😞", betterRu: 'Прости! На работе дела, не смогу прийти 😞',
            explain: 'Something came up — «кое-что произошло, возникли дела». I can\'t make it — «я не смогу».' } },
        b: { them: ['ah man', 'all good, work is work'], ru: ['Эх', 'Да ладно, работа есть работа'], next: 'c',
          reply: { intent: 'Предложите перенести на завтра.',
            accepted: [A('can we reschedule for tmrw?', 98), A('lets do it tmrw instead?', 97), A('rain check? tomorrow same time?', 95), A('Could we move it to tomorrow?', 92)],
            keywords: ['tomorrow|tmrw|reschedule|rain check'],
            distractors: [],
            better: 'can we reschedule for tmrw? same time', betterRu: 'Можем перенести на завтра? В то же время',
            explain: 'reschedule — перенести на другое время. tmrw = tomorrow.' } },
        c: { them: ['works for me', 'but ur buying the protein shake after 😂'], ru: ['Мне подходит', 'Но протеиновый коктейль потом с тебя 😂'], next: 'end',
          reply: { intent: 'Шутливо согласитесь: заслужили.',
            accepted: [A('haha deal, i owe u one', 98), A('fair enough 😂 deal', 97), A('lol ok i deserve that', 96), A('That is fair. Deal!', 88)],
            keywords: ['deal|fair|ok|owe|deserve|yes'],
            distractors: [],
            better: 'haha deal, i owe u one 🥤', betterRu: 'Ха-ха, договорились, с меня должок 🥤',
            explain: 'I owe you one — «с меня должок». Fair enough — «справедливо, ладно».' } },
        end: { them: ['👊 tmrw then'], ru: ['👊 Тогда завтра'], end: true }
      }
    },
    {
      id: 'leo-3', contactId: 'leo', order: 3, level: 'B2', title: 'Челлендж на месяц',
      intro: 'Лео придумал челлендж и хочет втянуть вас.', learn: ['Count me in!', 'go the extra mile', "I'm beat."],
      start: 'a',
      nodes: {
        a: { them: ['ngl im starting a 30 day challenge', 'no junk food, gym 4x a week 💀'], ru: ['Честно, я начинаю челлендж на 30 дней', 'Никакого фастфуда, зал 4 раза в неделю 💀'], next: 'b',
          reply: { intent: 'Скажите, что впечатлены, и спросите, можно ли присоединиться.',
            accepted: [A('respect 😂 can i join?', 98), A('thats hardcore! count me in', 98), A('oof. mind if i join u?', 96), A('That sounds tough. Can I join you?', 88)],
            keywords: ['join|count me|in|with you'],
            distractors: [X('Good luck with that.', 30, 'Звучит как «ну удачи» — будто вы не верите. Друг ждёт поддержки.')],
            better: 'thats hardcore 😂 count me in', betterRu: 'Это жёстко 😂 Я в деле',
            explain: 'Count me in! — «я в деле». mind if i join? — «не против, если я с тобой?»' } },
        b: { them: ['yesss lets go', 'rule 1: no excuses. if u skip, u pay the other 10 bucks'], ru: ['Дааа, погнали', 'Правило 1: никаких отговорок. Пропустил — платишь другому 10 баксов'], next: 'c',
          reply: { intent: 'Согласитесь на условие, но попросите исключение: болезнь не считается.',
            accepted: [A('deal! but sick days dont count ok?', 98), A('im in, but if ur sick it shouldnt count', 96), A('ok deal, unless one of us is ill', 95)],
            keywords: ['sick|ill|illness', 'not count|unless|except|but'],
            distractors: [],
            better: 'deal! but sick days dont count 😅', betterRu: 'Договорились! Но дни болезни не считаются 😅',
            explain: 'bucks — доллары. unless — «если только не».' } },
        c: { them: ['fair', 'day 1 tmrw: 6am run. u up for it?'], ru: ['Справедливо', 'День 1 завтра: пробежка в 6 утра. Готов?'], next: 'end',
          reply: { intent: 'Скажите, что 6 утра — это жесть, но вы придёте.',
            accepted: [A('6am is brutal but ill be there', 98), A('ugh 6am 😩 but im in', 97), A('thats early, but count me in', 94)],
            keywords: ['6am|6|six|early', 'but|still|anyway|in'],
            distractors: [],
            better: '6am is brutal 😩 but ill be there', betterRu: '6 утра — это жесть 😩 но я приду',
            explain: 'brutal — «жесть, зверски тяжело». be up for it — «быть готовым на это».' } },
        end: { them: ['💪 dont u dare sleep in'], ru: ['💪 Только не проспи'], end: true }
      }
    },

    /* ================= Chloe — подруга, неформально, но полными словами ================= */
    {
      id: 'chloe-1', contactId: 'chloe', order: 1, level: 'A2', title: 'Кофе после работы',
      intro: 'Хлоя зовёт встретиться на неделе.', learn: ['How about', 'What time works for you?', 'Sounds good!'],
      start: 'a',
      nodes: {
        a: { them: ['Hey! Are you free this week?', 'I want to hear about your new job ☕'], ru: ['Привет! Ты свободен на этой неделе?', 'Хочу послушать про твою новую работу ☕'], next: 'b',
          reply: { intent: 'Скажите, что свободны в четверг, и предложите кофе.',
            accepted: [A('Yes! Thursday works for me. Coffee?', 98), A("I'm free on Thursday — how about coffee?", 98), A('Thursday is good for me! Coffee after work?', 96)],
            keywords: ['thursday', 'coffee|cafe|drink'],
            distractors: [X('I am free on Thursday at 5 pm for 40 minutes.', 45, 'Слишком по-деловому для подруги — как запись в календаре.')],
            better: "Yes! I'm free on Thursday — how about coffee after work?", betterRu: 'Да! В четверг свободен — может, кофе после работы?',
            explain: 'Thursday works for me — «четверг мне подходит».' } },
        b: { them: ['Thursday is perfect!', 'Do you know that new place on Mill Street?'], ru: ['Четверг отлично!', 'Знаешь то новое место на Милл-стрит?'], next: 'c',
          reply: { intent: 'Скажите, что ещё не были там, но слышали хорошие отзывы.',
            accepted: [A("I haven't been there yet, but I've heard good things!", 98), A("No, but everyone says it's great", 96), A('Not yet! I heard it is really nice', 95)],
            keywords: ['not|no|never', 'heard|say|good|nice|great'],
            distractors: [],
            better: "I haven't been there yet, but I've heard great things!", betterRu: 'Ещё не был, но слышал только хорошее!',
            explain: "I've heard good things — «слышал хорошие отзывы». not yet — «пока нет»." } },
        c: { them: ["Let's try it then! 5:30?", 'I will book a table just in case'], ru: ['Тогда попробуем! В 17:30?', 'Забронирую столик на всякий случай'], next: 'end',
          reply: { intent: 'Согласитесь и поблагодарите за бронь.',
            accepted: [A('Sounds good! Thanks for booking 😊', 98), A('5:30 works, thanks for booking the table!', 98), A('Perfect, see you at 5:30! Thank you!', 95)],
            keywords: ['thank|thanks', 'sounds good|perfect|works|5 30|great'],
            distractors: [],
            better: 'Sounds good! Thanks for booking 😊', betterRu: 'Отлично! Спасибо, что забронируешь 😊',
            explain: 'just in case — «на всякий случай». book a table — забронировать столик.' } },
        end: { them: ['See you on Thursday! 💛'], ru: ['До четверга! 💛'], end: true }
      }
    },
    {
      id: 'chloe-2', contactId: 'chloe', order: 2, level: 'B1', title: 'Просьба об одолжении',
      intro: 'Хлоя уезжает и просит помочь.', learn: ['give me a hand', 'No worries.', 'Keep me posted.'],
      start: 'a',
      nodes: {
        a: { them: ['Hi! Could you give me a hand with something?', "I'm away next week 🧳"], ru: ['Привет! Можешь помочь мне кое с чем?', 'Меня не будет на следующей неделе 🧳'], next: 'b',
          reply: { intent: 'Согласитесь помочь и спросите, что нужно.',
            accepted: [A('Of course! What do you need?', 98), A('Sure, what can I do?', 97), A('Happy to help! What is it?', 96)],
            keywords: ['sure|of course|yes|happy|course', 'what|how'],
            distractors: [X('It depends on what you want.', 30, 'Звучит настороженно. Подруге сначала: sure, what do you need?')],
            better: 'Of course! What do you need?', betterRu: 'Конечно! Что нужно?',
            explain: 'give someone a hand — «помочь». Happy to help — «рад помочь».',
            branches: [{ keywords: DECLINE, next: 'x' }] } },
        b: { them: ['Could you water my plants? 🌱', 'And take in any parcels if they come'], ru: ['Можешь полить мои цветы? 🌱', 'И забирать посылки, если придут'], next: 'c',
          reply: { intent: 'Согласитесь и спросите, как часто поливать.',
            accepted: [A('No problem! How often should I water them?', 98), A('Sure! How often do they need water?', 97), A('Of course. How many times a week?', 95)],
            keywords: ['how often|how many times|often'],
            distractors: [],
            better: 'No problem! How often should I water them?', betterRu: 'Без проблем! Как часто их поливать?',
            explain: 'take in a parcel — «забрать посылку». How often — «как часто».' } },
        c: { them: ['Twice a week is enough 🙂', 'The spare key is with Tom next door'], ru: ['Два раза в неделю достаточно 🙂', 'Запасной ключ у соседа Тома'], next: 'end',
          reply: { intent: 'Скажите, что всё поняли, и пообещайте держать её в курсе.',
            accepted: [A("Got it! I'll keep you posted 🌱", 98), A('Understood — I will keep you posted', 96), A('Great, I will let you know how they are doing!', 95)],
            keywords: ['keep you posted|let you know|keep you updated|text you|message you'],
            distractors: [],
            better: "Got it! I'll keep you posted 🌱", betterRu: 'Понял! Буду держать в курсе 🌱',
            explain: 'Keep me posted — «держи меня в курсе». spare key — запасной ключ.' } },
        end: { them: ['You are a star ⭐ Thank you!'], ru: ['Ты чудо ⭐ Спасибо!'], end: true },
        x: { them: ['No worries at all! I will ask Tom instead 🙂'], ru: ['Ничего страшного! Тогда попрошу Тома 🙂'], end: true }
      }
    },
    {
      id: 'chloe-3', contactId: 'chloe', order: 3, level: 'B2', title: 'Неловкое напоминание',
      intro: 'Хлоя забыла вернуть деньги за билеты. Напомните так, чтобы не обидеть.', learn: ['I was wondering if', "It's not a big deal.", 'No harm done.'],
      start: 'a',
      nodes: {
        a: { them: ['Hey! Did you see the photos from Saturday? 😄'], ru: ['Привет! Видел фото с субботы? 😄'], next: 'b',
          reply: { intent: 'Ответьте, что видели и что было здорово.',
            accepted: [A('Yes, they are great! Saturday was so much fun', 98), A('I did! Such a fun night 😄', 97), A('Yes! We all look so happy in them', 94)],
            keywords: ['yes|i did|saw|seen', 'fun|great|good|nice|happy|lovely|amazing'],
            distractors: [],
            better: 'Yes, they turned out great! Saturday was so much fun', betterRu: 'Да, отлично получились! Суббота была супер',
            explain: 'turn out — «получиться» (о фото, о результате).' } },
        b: { them: ['We should do it again soon!'], ru: ['Надо повторить!'], next: 'c',
          reply: { intent: 'Согласитесь и мягко напомните про деньги за билеты.',
            accepted: [A('Definitely! By the way, could you send me the money for the tickets when you get a chance?', 98), A('Yes! And I was wondering if you could transfer me the ticket money 🙂', 98), A('For sure! Also, about the tickets — could you send me the money?', 95)],
            keywords: ['ticket|tickets', 'money|transfer|send|pay'],
            distractors: [X('You still owe me money.', 25, 'Слишком прямо для подруги — звучит как претензия. Мягче: could you send me the ticket money when you get a chance?')],
            better: 'Definitely! By the way, could you send me the ticket money when you get a chance?', betterRu: 'Обязательно! Кстати, скинешь деньги за билеты, когда будет минутка?',
            explain: 'By the way + when you get a chance — вежливое напоминание без давления.' } },
        c: { them: ['Oh no, I completely forgot! 😳 I am so sorry', 'Sending it right now'], ru: ['О нет, я совсем забыла! 😳 Прости', 'Отправляю прямо сейчас'], next: 'end',
          reply: { intent: 'Успокойте: ничего страшного.',
            accepted: [A('No worries at all, it is not a big deal 🙂', 98), A("Don't worry about it! No harm done", 98), A('Honestly, no rush! Thank you', 94)],
            keywords: ['no worries|do not worry|not a big deal|no harm|no rush|no problem|fine'],
            distractors: [X('Finally.', 5, 'Пассивная агрессия — обидит подругу, которая уже извинилась.')],
            better: "No worries at all — it's not a big deal 🙂", betterRu: 'Да ничего страшного 🙂',
            explain: 'No harm done — «ничего страшного не случилось».' } },
        end: { them: ['Sent 💸 Thank you for reminding me ❤️'], ru: ['Отправила 💸 Спасибо, что напомнил ❤️'], end: true }
      }
    },

    /* ================= Marcus — коллега из другого отдела, рабочий чат ================= */
    {
      id: 'marcus-1', contactId: 'marcus', order: 1, level: 'A2', title: 'Нет доступа к файлу',
      intro: 'Коллега не может открыть ваш отчёт.', learn: ['Do you have a minute?', 'Let me check.', "I'll look into it."],
      start: 'a',
      nodes: {
        a: { them: ['Hi! Do you have a minute?', 'I cannot open the report you shared — it says I need access'], ru: ['Привет! Есть минутка?', 'Я не могу открыть отчёт, который ты прислал, — пишет, что нужен доступ'], next: 'b',
          reply: { intent: 'Извинитесь и скажите, что сейчас проверите.',
            accepted: [A('Hi! Sorry about that, let me check.', 98), A('Oh sorry! I will look into it right away.', 97), A('Sure — sorry, let me check the settings.', 96)],
            keywords: ['check|look into|see|fix'],
            distractors: [X('It works on my computer.', 20, 'Перекладывает проблему на коллегу. Сначала: let me check.')],
            better: 'Hi! Sorry about that — let me check.', betterRu: 'Привет! Извини, сейчас проверю.',
            explain: 'Let me check — «сейчас посмотрю». look into it — «разобраться с этим».' } },
        b: { them: ['Thanks!', 'I need it before the 2 pm call'], ru: ['Спасибо!', 'Он нужен мне до созвона в 14:00'], next: 'c',
          reply: { intent: 'Скажите, что дали доступ, и попросите обновить страницу.',
            accepted: [A('Done — I have given you access. Could you refresh the page?', 98), A('You should have access now, please refresh and try again.', 98), A('I just shared it with you — try refreshing the page.', 96)],
            keywords: ['access|shared|share', 'refresh|reload|try again'],
            distractors: [],
            better: 'Done — you should have access now. Could you refresh the page?', betterRu: 'Готово — доступ есть. Обнови страницу, пожалуйста.',
            explain: 'refresh the page — «обновить страницу». give access — дать доступ.' } },
        c: { them: ['It works now, thank you!', 'By the way, do you know who is responsible for the Q3 numbers?'], ru: ['Теперь работает, спасибо!', 'Кстати, не знаешь, кто отвечает за цифры за третий квартал?'], next: 'end',
          reply: { intent: 'Скажите, что за них отвечает Сара, и предложите познакомить.',
            accepted: [A('Sarah is in charge of those. I can put you in touch.', 98), A('That is Sarah — she is in charge of the Q3 numbers. Shall I introduce you?', 97), A('Sarah handles those. I can connect you two.', 95)],
            keywords: ['sarah', 'in charge|handles|responsible|introduce|put you in touch|connect'],
            distractors: [],
            better: 'Sarah is in charge of those — I can put you in touch.', betterRu: 'За них отвечает Сара — могу вас свести.',
            explain: 'be in charge of — «отвечать за». put someone in touch — «познакомить, свести».' } },
        end: { them: ['Perfect, thanks a lot! 🙌'], ru: ['Отлично, большое спасибо! 🙌'], end: true }
      }
    },
    {
      id: 'marcus-2', contactId: 'marcus', order: 2, level: 'B1', title: 'Перенос встречи',
      intro: 'Коллега просит перенести вашу еженедельную встречу.', learn: ['Can we reschedule?', 'a tight schedule', 'touch base'],
      start: 'a',
      nodes: {
        a: { them: ['Hi, sorry for the short notice', 'Could we move our sync from Wednesday to Thursday?'], ru: ['Привет, извини, что в последний момент', 'Можем перенести нашу встречу со среды на четверг?'], next: 'b',
          reply: { intent: 'Согласитесь, но скажите, что в четверг можете только утром.',
            accepted: [A('Sure, Thursday works — but only in the morning, I am afraid.', 98), A('No problem! Thursday morning would work best for me.', 97), A('That is fine. Could we make it Thursday morning?', 96)],
            keywords: ['thursday', 'morning'],
            distractors: [X('Why do you always change our meetings?', 10, 'Звучит как претензия. В рабочем чате — нейтрально и по делу.')],
            better: 'Sure, Thursday works — morning would be best for me.', betterRu: 'Конечно, четверг подходит — лучше утром.',
            explain: 'short notice — «в последний момент». works for me — «мне подходит».' } },
        b: { them: ['Morning is fine. 10:30?', 'I have a tight schedule that day'], ru: ['Утро подходит. В 10:30?', 'У меня плотный график в этот день'], next: 'c',
          reply: { intent: 'Подтвердите 10:30 и спросите, сколько времени нужно.',
            accepted: [A('10:30 works. Shall we say 30 minutes?', 98), A('Perfect, 10:30. How much time should I set aside?', 97), A('10:30 is in my calendar. How long do you need?', 96)],
            keywords: ['10 30|half past ten', 'how long|how much time|minutes|need'],
            distractors: [],
            better: '10:30 works for me. How long do you need?', betterRu: '10:30 подходит. Сколько времени нужно?',
            explain: 'set aside time — «выделить время». a tight schedule — плотный график.' } },
        c: { them: ['30 minutes should be enough', 'I just want to touch base before the client call'], ru: ['30 минут должно хватить', 'Просто хочу свериться перед звонком с клиентом'], next: 'end',
          reply: { intent: 'Подтвердите и попросите прислать приглашение в календарь.',
            accepted: [A('Sounds good. Could you send a calendar invite?', 98), A('Great — please send an invite and I will accept it.', 97), A('Perfect. Would you mind sending the invite?', 96)],
            keywords: ['invite|invitation|calendar'],
            distractors: [],
            better: 'Sounds good — could you send a calendar invite?', betterRu: 'Отлично — пришлёшь приглашение в календарь?',
            explain: 'touch base — «коротко свериться». calendar invite — приглашение в календарь.' } },
        end: { them: ['Sent. See you on Thursday!'], ru: ['Отправил. До четверга!'], end: true }
      }
    },
    {
      id: 'marcus-3', contactId: 'marcus', order: 3, level: 'B2', title: 'Вежливый отказ коллеге',
      intro: 'Коллега просит взять его задачу. У вас нет ресурса — откажите так, чтобы сохранить отношения.', learn: ["I'm swamped.", 'Would it be possible to', 'Keep me posted.'],
      start: 'a',
      nodes: {
        a: { them: ['Hi! Quick favour 🙏', 'Could you take over the supplier report this week?'], ru: ['Привет! Небольшая просьба 🙏', 'Можешь взять на себя отчёт по поставщикам на этой неделе?'], next: 'b',
          reply: { intent: 'Вежливо откажите: на этой неделе вы перегружены.',
            accepted: [A("I'd like to help, but I am completely swamped this week.", 98), A('I am swamped at the moment — I would not be able to do it properly.', 97), A("Unfortunately I can't take that on this week, my plate is full.", 96)],
            keywords: ['swamped|busy|full|no time|can not|unfortunately|overloaded'],
            distractors: [X('No.', 10, 'Слишком резко для коллеги — объясните причину и предложите альтернативу.')],
            better: "I'd like to help, but I am completely swamped this week.", betterRu: 'Рад бы помочь, но на этой неделе я завален.',
            explain: "be swamped — «завален работой». my plate is full — «дел выше крыши»." } },
        b: { them: ['I understand.', 'Would next week be possible?'], ru: ['Понимаю.', 'А на следующей неделе получится?'], next: 'c',
          reply: { intent: 'Согласитесь на следующую неделю, но попросите прислать данные заранее.',
            accepted: [A('Yes, next week works. Could you send me the data in advance?', 98), A('Next week is fine — please send the numbers beforehand.', 97), A('That should be possible. Would it be possible to get the data by Friday?', 95)],
            keywords: ['next week|week', 'data|numbers|files|information|send'],
            distractors: [],
            better: 'Yes, next week works — could you send me the data in advance?', betterRu: 'Да, следующая неделя подходит — пришлёшь данные заранее?',
            explain: 'in advance / beforehand — «заранее».' } },
        c: { them: ['Of course. I will send everything on Friday.', 'Thanks for being straight with me 👍'], ru: ['Конечно. Всё пришлю в пятницу.', 'Спасибо, что сказал прямо 👍'], next: 'end',
          reply: { intent: 'Поблагодарите за понимание и попросите держать вас в курсе, если сроки сдвинутся.',
            accepted: [A('Thanks for understanding! Please keep me posted if the deadline changes.', 98), A('I appreciate your understanding — keep me posted if anything changes.', 98), A('Thank you for understanding. Let me know if the timeline moves.', 96)],
            keywords: ['keep me posted|let me know|keep me updated', 'deadline|change|changes|timeline|anything'],
            distractors: [],
            better: 'Thanks for understanding — please keep me posted if the deadline changes.', betterRu: 'Спасибо за понимание — держи в курсе, если сроки сдвинутся.',
            explain: 'Keep me posted — «держи меня в курсе». be straight with someone — говорить прямо.' } },
        end: { them: ['Will do. Have a good one!'], ru: ['Хорошо. Хорошего дня!'], end: true }
      }
    },

    /* ================= Grace Lin — клиентка, формальная деловая переписка ================= */
    {
      id: 'grace-1', contactId: 'grace', order: 1, level: 'B1', title: 'Статус заказа',
      intro: 'Клиентка спрашивает, где её заказ.', learn: ["What's the status on", 'I apologize for the inconvenience.', "I'll get back to you."],
      start: 'a',
      nodes: {
        a: { them: ['Good morning. I hope you are well.', 'Could you tell me the status of our order?'], ru: ['Доброе утро. Надеюсь, у вас всё хорошо.', 'Не могли бы вы сообщить статус нашего заказа?'], next: 'b',
          reply: { intent: 'Поздоровайтесь и скажите, что проверите и вернётесь с ответом сегодня.',
            accepted: [A('Good morning! Let me check with the team and I will get back to you today.', 98), A('Good morning. I will check the status and come back to you later today.', 97), A('Hello! I am checking now and will get back to you by the end of the day.', 96)],
            keywords: ['check|checking|look into|find out', 'today|get back|come back|end of the day'],
            distractors: [X('I do not know.', 15, 'Клиенту нужен план действий, а не «не знаю». Скажите, что проверите и вернётесь с ответом.')],
            better: 'Good morning! Let me check with the team and I will get back to you today.', betterRu: 'Доброе утро! Уточню у команды и вернусь с ответом сегодня.',
            explain: 'get back to you — «вернуться с ответом». Обещание срока успокаивает клиента.' } },
        b: { them: ['Thank you. To be honest, we are a little concerned about the delay.'], ru: ['Спасибо. Честно говоря, нас беспокоит задержка.'], next: 'c',
          reply: { intent: 'Извинитесь за неудобства и объясните: задержка на стороне поставщика.',
            accepted: [A('I apologize for the inconvenience. The delay is on our supplier side, and we are following up daily.', 98), A('I am very sorry for the inconvenience — our supplier is late, and we are chasing them every day.', 97), A('Please accept my apologies for the delay. It is caused by our supplier, and we are pushing them daily.', 96)],
            keywords: ['apologize|apologies|apology|sorry', 'supplier|delivery|warehouse|delay'],
            distractors: [X('It is not our fault.', 10, 'Клиента не интересует, кто виноват, — нужны извинения и срок.')],
            better: 'I apologize for the inconvenience. The delay is on our supplier side, and we are following up daily.', betterRu: 'Приношу извинения за неудобства. Задержка на стороне поставщика, мы держим это на контроле.',
            explain: 'I apologize for the inconvenience — стандартная деловая формула извинения. follow up — «напоминать, доводить до конца».' } },
        c: { them: ['I understand. When can we expect delivery?'], ru: ['Понимаю. Когда ожидать поставку?'], next: 'end',
          reply: { intent: 'Назовите срок — до конца следующей недели — и пообещайте прислать трек-номер.',
            accepted: [A('We expect delivery by the end of next week, and I will send you the tracking number as soon as it ships.', 98), A('By the end of next week. I will share the tracking number once the order is shipped.', 97), A('Delivery should arrive by the end of next week — I will send the tracking details as soon as I have them.', 96)],
            keywords: ['next week', 'tracking|track|number|details'],
            distractors: [],
            better: 'We expect delivery by the end of next week, and I will send the tracking number as soon as it ships.', betterRu: 'Ожидаем поставку до конца следующей недели, трек-номер пришлю сразу после отгрузки.',
            explain: 'as soon as it ships — «как только отправят». tracking number — номер отслеживания.' } },
        end: { them: ['Thank you for the update. That is very helpful.'], ru: ['Спасибо за информацию. Это очень помогает.'], end: true }
      }
    },
    {
      id: 'grace-2', contactId: 'grace', order: 2, level: 'B2', title: 'Ошибка в счёте',
      intro: 'Клиентке дважды выставили счёт за одну позицию.', learn: ['There seems to be a problem with', 'Just to clarify', "I'd like a refund."],
      start: 'a',
      nodes: {
        a: { them: ['Hello. There seems to be a problem with the invoice we received.', 'We were charged twice for the same item.'], ru: ['Здравствуйте. Кажется, в полученном счёте ошибка.', 'С нас дважды списали за одну позицию.'], next: 'b',
          reply: { intent: 'Извинитесь и попросите номер счёта, чтобы проверить.',
            accepted: [A('I am very sorry about that. Could you please send me the invoice number so that I can check?', 98), A('Apologies for the mistake. Would you mind sharing the invoice number?', 97), A('I am sorry to hear that — could you send me the invoice number, please?', 96)],
            keywords: ['invoice|number', 'send|share|forward|give'],
            distractors: [X('Are you sure you read it correctly?', 10, 'Сомнение в клиенте звучит оскорбительно. Извинитесь и попросите данные.')],
            better: 'I am very sorry about that. Could you please send me the invoice number so that I can check?', betterRu: 'Прошу прощения. Пришлите, пожалуйста, номер счёта, чтобы я мог проверить.',
            explain: 'Would you mind + -ing — очень вежливая просьба. invoice — счёт.' } },
        b: { them: ['Of course. It is INV-4471.', 'We would like a refund for the second charge.'], ru: ['Конечно. Это INV-4471.', 'Мы хотели бы возврат за второе списание.'], next: 'c',
          reply: { intent: 'Признайте ошибку и скажите, что возврат займёт до пяти рабочих дней.',
            accepted: [A('You are right, this was our mistake. The refund will be processed within five working days.', 98), A('I can confirm the double charge — we will refund it within five working days.', 97), A('Thank you. I see the error, and the refund should reach you within five working days.', 96)],
            keywords: ['refund|money back', 'five|working days|business days|days'],
            distractors: [],
            better: 'You are right — this was our mistake. The refund will be processed within five working days.', betterRu: 'Вы правы — это наша ошибка. Возврат пройдёт в течение пяти рабочих дней.',
            explain: 'working days / business days — рабочие дни. process a refund — оформить возврат.' } },
        c: { them: ['Thank you. Just to clarify: will the credit note be sent as well?'], ru: ['Спасибо. Уточню: корректирующий счёт тоже пришлёте?'], next: 'end',
          reply: { intent: 'Подтвердите и пообещайте прислать корректирующий счёт сегодня.',
            accepted: [A('Yes, I will send the credit note by the end of the day.', 98), A('Certainly — the credit note will be issued and sent to you today.', 98), A('Yes, of course. You will receive the credit note today.', 96)],
            keywords: ['yes|certainly|of course|sure|course', 'credit note|today|end of the day'],
            distractors: [],
            better: 'Certainly — I will send the credit note by the end of the day.', betterRu: 'Разумеется — корректирующий счёт пришлю сегодня до конца дня.',
            explain: 'credit note — корректирующий счёт. Certainly — формальное «конечно».' } },
        end: { them: ['Much appreciated. Thank you for resolving this so quickly.'], ru: ['Очень признательна. Спасибо за быстрое решение.'], end: true }
      }
    },
    {
      id: 'grace-3', contactId: 'grace', order: 3, level: 'C1', title: 'Разговор о цене',
      intro: 'Клиентка считает предложение дорогим. Ведите переговоры.', learn: ['push back on', 'Having said that', 'I see your point, but'],
      start: 'a',
      nodes: {
        a: { them: ['Good afternoon. We have reviewed your proposal.', 'I have to be honest: the price is higher than we expected.'], ru: ['Добрый день. Мы изучили ваше предложение.', 'Буду честна: цена выше, чем мы ожидали.'], next: 'b',
          reply: { intent: 'Поблагодарите за прямоту и спросите, на какой бюджет они рассчитывали.',
            accepted: [A('Thank you for being upfront. May I ask what budget you had in mind?', 98), A('I appreciate your honesty. What figure did you have in mind?', 97), A('Thank you for telling me directly. Could you share the budget you were expecting?', 96)],
            keywords: ['budget|figure|price|number', 'what|how much|share|ask'],
            distractors: [X('The price is the price.', 10, 'Закрывает переговоры. Сначала выясните ожидания клиента.')],
            better: 'Thank you for being upfront. May I ask what budget you had in mind?', betterRu: 'Спасибо за откровенность. Можно узнать, на какой бюджет вы рассчитывали?',
            explain: 'upfront — «откровенный, прямой». have in mind — «иметь в виду».' } },
        b: { them: ['We were thinking of around fifteen percent less.'], ru: ['Мы рассчитывали примерно на пятнадцать процентов меньше.'], next: 'c',
          reply: { intent: 'Признайте их позицию, но откажите в такой скидке; предложите меньшую при более длинном контракте.',
            accepted: [A('I see your point, but fifteen percent is not feasible for us. We could offer five percent for a two-year contract.', 98), A('I understand your position. Having said that, we cannot go that far — five percent would be possible with a longer contract.', 98), A('I take your point, although fifteen percent is beyond what we can do. With a two-year agreement, we could offer five.', 96)],
            keywords: ['five|5', 'contract|agreement|longer|two year|term'],
            distractors: [],
            better: 'I see your point, but fifteen percent is not feasible. We could offer five percent for a two-year contract.', betterRu: 'Понимаю вашу позицию, но пятнадцать процентов для нас невозможны. Можем предложить пять при двухлетнем контракте.',
            explain: 'not feasible — «неосуществимо». Having said that — «тем не менее».' } },
        c: { them: ['That is an interesting option. I will have to discuss it internally.', 'Could you put it in writing?'], ru: ['Интересный вариант. Мне нужно обсудить это внутри компании.', 'Можете прислать это письменно?'], next: 'end',
          reply: { intent: 'Пообещайте письменное предложение завтра и предложите созвон на следующей неделе.',
            accepted: [A('Certainly. I will send a written proposal tomorrow, and we could arrange a call next week if that suits you.', 98), A('Of course — you will have the revised offer in writing by tomorrow. Shall we schedule a call for next week?', 98), A('I will put it in writing and send it tomorrow. Would a call next week work for you?', 96)],
            keywords: ['tomorrow|writing|written', 'call|meeting|next week'],
            distractors: [],
            better: 'Certainly. I will send the revised proposal in writing tomorrow — shall we arrange a call next week?', betterRu: 'Разумеется. Завтра пришлю предложение письменно — может, созвонимся на следующей неделе?',
            explain: 'put it in writing — «зафиксировать письменно». if that suits you — «если вам удобно».' } },
        end: { them: ['Perfect. I look forward to receiving it. Thank you.'], ru: ['Отлично. Буду ждать. Спасибо.'], end: true }
      }
    },

    /* ================= Helen Price — преподаватель курса, формально со знакомым ================= */
    {
      id: 'helen-1', contactId: 'helen', order: 1, level: 'B1', title: 'Пропущенное занятие',
      intro: 'Преподаватель заметила, что вас не было на занятии.', learn: ['Something came up.', 'Would it be possible to', 'Sorry I\'m late!'],
      start: 'a',
      nodes: {
        a: { them: ['Good evening. I noticed you were not at yesterday\'s class.', 'Is everything all right?'], ru: ['Добрый вечер. Я заметила, что вас не было на вчерашнем занятии.', 'У вас всё в порядке?'], next: 'b',
          reply: { intent: 'Извинитесь и объясните: на работе возникли срочные дела.',
            accepted: [A('Good evening! I am sorry — something came up at work and I could not attend.', 98), A('Hello, and apologies for missing the class. Something urgent came up at work.', 97), A('I am sorry I missed it. I had an urgent issue at work and could not make it.', 96)],
            keywords: ['sorry|apologies|apologize|apology', 'work|urgent|came up|emergency'],
            distractors: [X('I did not want to come.', 5, 'Звучит неуважительно. Объясните причину вежливо.')],
            better: 'Good evening! I am sorry — something urgent came up at work and I could not attend.', betterRu: 'Добрый вечер! Извините — на работе возникли срочные дела, и я не смог прийти.',
            explain: 'Something came up — «возникли срочные дела». attend a class — посещать занятие.' } },
        b: { them: ['I understand, thank you for letting me know.', 'We covered the present perfect and started unit 6.'], ru: ['Понимаю, спасибо, что сообщили.', 'Мы разобрали present perfect и начали шестой юнит.'], next: 'c',
          reply: { intent: 'Спросите, можно ли получить материалы урока и домашнее задание.',
            accepted: [A('Would it be possible to get the materials and the homework for that lesson?', 98), A('Could you send me the slides and the homework, please?', 97), A('Thank you. Would you mind sharing the lesson materials and the homework?', 96)],
            keywords: ['materials|slides|notes|handouts', 'homework|assignment|exercises|task'],
            distractors: [],
            better: 'Would it be possible to get the materials and the homework for that lesson?', betterRu: 'Можно ли получить материалы и домашнее задание с этого урока?',
            explain: 'Would it be possible to… — очень вежливая просьба.' } },
        c: { them: ['Of course. I will email them tonight.', 'Please do the exercises before Thursday.'], ru: ['Конечно. Пришлю сегодня вечером.', 'Сделайте, пожалуйста, упражнения до четверга.'], next: 'end',
          reply: { intent: 'Поблагодарите и подтвердите, что сделаете к четвергу.',
            accepted: [A('Thank you very much. I will have them ready by Thursday.', 98), A('Thank you! I will complete the exercises before Thursday.', 97), A('Many thanks — the exercises will be done by Thursday.', 96)],
            keywords: ['thank|thanks', 'thursday'],
            distractors: [],
            better: 'Thank you very much. I will have them done by Thursday.', betterRu: 'Большое спасибо. Сделаю к четвергу.',
            explain: 'have something ready by — «подготовить к сроку».' } },
        end: { them: ['Excellent. See you on Thursday.'], ru: ['Прекрасно. До четверга.'], end: true }
      }
    },
    {
      id: 'helen-2', contactId: 'helen', order: 2, level: 'B2', title: 'Просьба продлить срок',
      intro: 'Вы не успеваете сдать итоговое эссе.', learn: ['I was wondering if', 'deadline', 'I apologize for the inconvenience.'],
      start: 'a',
      nodes: {
        a: { them: ['Good morning. A reminder that the final essay is due on Monday.'], ru: ['Доброе утро. Напоминаю, что итоговое эссе нужно сдать в понедельник.'], next: 'b',
          reply: { intent: 'Вежливо попросите продлить срок на несколько дней и объясните причину.',
            accepted: [A('Good morning. I was wondering if the deadline could be extended by a few days — I have been ill this week.', 98), A('Thank you for the reminder. Would it be possible to extend the deadline to Wednesday? I have been unwell.', 97), A('I am afraid I need a little more time because of illness. Could the deadline be moved by a few days?', 96)],
            keywords: ['deadline|due date|more time|extend|extension|moved', 'ill|unwell|sick|illness'],
            distractors: [X('I will send it when I can.', 15, 'Звучит небрежно. Попросите продление и назовите новый срок.')],
            better: 'I was wondering if the deadline could be extended by a few days — I have been ill this week.', betterRu: 'Я хотел спросить, можно ли продлить срок на несколько дней — я болел на этой неделе.',
            explain: 'I was wondering if… — мягкая формула просьбы. extend the deadline — продлить срок.' } },
        b: { them: ['I am sorry to hear that. Wednesday would be acceptable.', 'Do you have a medical note?'], ru: ['Жаль это слышать. Среда подойдёт.', 'У вас есть справка?'], next: 'c',
          reply: { intent: 'Скажите, что справка есть, и вы пришлёте её сегодня.',
            accepted: [A('Yes, I do. I will send a copy today.', 98), A('I do have one — I will email it to you this afternoon.', 97), A('Yes, the doctor gave me a note and I will forward it today.', 96)],
            keywords: ['yes|i do|i have', 'send|email|forward|today|copy'],
            distractors: [],
            better: 'Yes, I do. I will email you a copy today.', betterRu: 'Да, есть. Сегодня пришлю копию.',
            explain: 'medical note — справка от врача. forward — переслать.' } },
        c: { them: ['Thank you. Please also note that the essay should be around 800 words.'], ru: ['Спасибо. Учтите также, что эссе должно быть примерно на 800 слов.'], next: 'end',
          reply: { intent: 'Подтвердите объём и новый срок, поблагодарите за понимание.',
            accepted: [A('Understood — around 800 words by Wednesday. Thank you for your understanding.', 98), A('Thank you for being flexible. I will submit about 800 words on Wednesday.', 97), A('Noted: 800 words, Wednesday. Thank you very much for your understanding.', 96)],
            keywords: ['800|eight hundred', 'wednesday'],
            distractors: [],
            better: 'Understood — around 800 words by Wednesday. Thank you for your understanding.', betterRu: 'Понял — около 800 слов к среде. Спасибо за понимание.',
            explain: 'Noted — «принято к сведению». submit — сдать работу.' } },
        end: { them: ['Perfect. Good luck with the essay.'], ru: ['Прекрасно. Удачи с эссе.'], end: true }
      }
    },
    {
      id: 'helen-3', contactId: 'helen', order: 3, level: 'C1', title: 'Рекомендательное письмо',
      intro: 'Курс закончен. Попросите преподавателя о рекомендации.', learn: ["I'd appreciate it if", "Let's keep in touch.", 'It was nice talking to you.'],
      start: 'a',
      nodes: {
        a: { them: ['Congratulations on finishing the course — your progress has been excellent.'], ru: ['Поздравляю с окончанием курса — ваш прогресс отличный.'], next: 'b',
          reply: { intent: 'Поблагодарите и скажите, что курс очень помог, особенно с речью.',
            accepted: [A('Thank you very much. The course has helped me enormously, especially with speaking.', 98), A('Thank you! I have learned a great deal, particularly in speaking.', 97), A('That is very kind of you. The course made a real difference to my English.', 96)],
            keywords: ['thank|kind', 'course|lessons|helped|learned|learnt|difference'],
            distractors: [],
            better: 'Thank you very much. The course has helped me enormously, especially with speaking.', betterRu: 'Большое спасибо. Курс очень мне помог, особенно с речью.',
            explain: 'a great deal — «очень много». make a real difference — «заметно помочь».' } },
        b: { them: ['That is lovely to hear.', 'Are you planning to take the C1 exam?'], ru: ['Очень приятно слышать.', 'Планируете сдавать экзамен на C1?'], next: 'c',
          reply: { intent: 'Скажите, что планируете весной, и попросите рекомендательное письмо для университета.',
            accepted: [A('Yes, in the spring. I would also appreciate it if you could write me a reference letter for university.', 98), A('I am planning to take it in spring. Would you be willing to write a reference for my university application?', 98), A('Yes, in spring. May I ask you for a letter of recommendation for my application?', 96)],
            keywords: ['spring', 'reference|recommendation|letter'],
            distractors: [X('Write me a recommendation letter.', 20, 'Звучит как приказ. Просьба к преподавателю — через would you / I would appreciate it if.')],
            better: 'Yes, in the spring. I would also appreciate it if you could write me a reference letter for university.', betterRu: 'Да, весной. Был бы признателен, если бы вы написали мне рекомендательное письмо для университета.',
            explain: "I'd appreciate it if — «был бы признателен, если бы». reference letter — рекомендательное письмо." } },
        c: { them: ['I would be glad to. Could you send me the details and the deadline?'], ru: ['С радостью. Пришлёте детали и срок?'], next: 'end',
          reply: { intent: 'Поблагодарите, пообещайте прислать детали и предложите оставаться на связи.',
            accepted: [A("Thank you so much. I will send everything this week. Let's keep in touch!", 98), A('That is very kind — I will email the details tomorrow. I hope we can keep in touch.', 97), A('Thank you! I will forward the requirements and the deadline shortly. Let us stay in touch.', 96)],
            keywords: ['send|email|forward', 'keep in touch|stay in touch|touch'],
            distractors: [],
            better: "Thank you so much. I will send the details this week — let's keep in touch!", betterRu: 'Огромное спасибо. Пришлю детали на этой неделе — давайте оставаться на связи!',
            explain: "Let's keep in touch — «давайте оставаться на связи». shortly — «в ближайшее время»." } },
        end: { them: ['Certainly. All the best with the exam!'], ru: ['Конечно. Удачи на экзамене!'], end: true }
      }
    }
  ];

  contacts.forEach(function (c) { D.contacts.push(c); D.contactsById[c.id] = c; });
  episodes.forEach(function (e) {
    D.episodes.push(e);
    D.episodesById[e.id] = e;
    Object.keys(e.nodes).forEach(function (nid) {
      var n = e.nodes[nid];
      if (n.reply) { n.reply.npc = n.them[n.them.length - 1]; n.reply.npcRu = (n.ru || [])[n.them.length - 1] || ''; }
    });
  });
})(window.EG = window.EG || {});
