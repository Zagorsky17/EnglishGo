/* data/chats.js — эмулятор мессенджера: контакты и эпизоды переписки.
   Узел: { them: [сообщения], ru: [переводы], reply?: ход пользователя, next?, end? }
   reply: { intent, accepted:[A], keywords, distractors:[X], better, betterRu, explain, learn,
            branches: [{ keywords: [...], next }] — ветка, если ответ совпал по ключевым словам (например, отказ) }
   Регистр контакта: slang — сленг ок; casual — неформально; semi — коллега (без u/lol); formal — только полные формы. */
(function (EG) {
  'use strict';

  var D = EG.data = EG.data || {};
  function A(t, n, note) { return { t: t, n: n, note: note || '' }; }
  function X(t, n, note) { return { t: t, n: n, note: note }; }
  var DECLINE = ['can not|sorry|busy|unfortunately|no thanks|nah|maybe next time|another time|not really'];

  D.contacts = [
    { id: 'jake', name: 'Jake', color: '#f97316', role: 'друг', register: 'slang', about: 'Лучший друг. Пишет сплошным сленгом: u, wyd, lol, ngl.',
      confused: ['huh? 😅', 'wait what lol'] },
    { id: 'emma', name: 'Emma', color: '#ec4899', role: 'подруга', register: 'slang', about: 'Подруга. Много эмоций, эмодзи и omg.',
      confused: ['wait what?? 😂', 'sorry i dont get it'] },
    { id: 'tom', name: 'Tom', color: '#22c55e', role: 'сосед', register: 'casual', about: 'Сосед за стеной. Дружелюбный, пишет почти без сокращений.',
      confused: ['Sorry, not sure what you mean 😅', 'Hmm?'] },
    { id: 'alex', name: 'Alex', color: '#8b5cf6', role: 'знакомство в приложении', register: 'casual', about: 'Познакомились в приложении. Лёгкий флирт, эмодзи, немного сленга.',
      confused: ['haha what? 😅', 'lol i dont follow'] },
    { id: 'sarah', name: 'Sarah', color: '#0ea5e9', role: 'коллега', register: 'semi', about: 'Коллега. Дружелюбно, но по-рабочему: полные слова, без u и lol.',
      confused: ['Sorry, could you clarify?', 'Not sure I follow — could you explain?'] },
    { id: 'priya', name: 'Priya', color: '#14b8a6', role: 'руководитель', register: 'semi', about: 'Руководитель. Коротко и по делу, ценит ясность.',
      confused: ['Sorry, could you rephrase that?', "I didn't quite get that."] },
    { id: 'davis', name: 'Mr. Davis', color: '#64748b', role: 'арендодатель', register: 'formal', about: 'Арендодатель. Пишет формально — отвечайте так же.',
      confused: ['I am sorry, I do not quite understand.', 'Could you please clarify?'] }
  ];

  D.episodes = [
    /* ================= Jake — друг, сленг ================= */
    {
      id: 'jake-1', contactId: 'jake', order: 1, level: 'A2', title: 'Вечер пятницы',
      intro: 'Джейк пишет вам в пятницу вечером.', learn: ['wyd', 'Not much.', 'omw', "I'm down."],
      start: 'a',
      nodes: {
        a: { them: ['yo! wyd tonight?'], ru: ['Йо! Что делаешь сегодня вечером?'], next: 'b',
          reply: { intent: 'Скажите, что ничего особенного, и спросите его в ответ.',
            accepted: [A('nm, u?', 98), A('not much, u?', 97), A('nothing much, why?', 94), A('not much, wbu?', 97), A('Not much, what about you?', 85, 'Правильно, но для Джейка слишком «правильно» — в чате пишут короче: nm, u?')],
            keywords: ['not much|nothing|nm|chilling|chillin|nothing special'],
            distractors: [X('I am doing nothing this evening.', 40, 'Грамматически верно, но звучит как учебник. Другу пишут: nm, u?')],
            better: 'nm, u?', betterRu: 'Ничего особенного, а ты?',
            explain: 'wyd = what are you doing. nm = not much. Встречный «u?» или «wbu?» поддерживает разговор.' } },
        b: { them: ['thinking pizza + fifa at mine', 'u in?'], ru: ['Думаю, пицца и FIFA у меня', 'Ты в деле?'], next: 'c',
          reply: { intent: 'Согласитесь с энтузиазмом.',
            accepted: [A("i'm in!", 98), A("yeah i'm down", 98), A('count me in!', 96), A('sounds good!', 94), A('sure, what time?', 93)],
            keywords: ['in|down|sure|yes|yeah|good|great|count me|of course|definitely|lets go'],
            distractors: [X('Yes, I agree to come.', 40, 'Слишком официально. Другу: i\'m in! / i\'m down')],
            better: "i'm down! 🍕", betterRu: 'Я за! 🍕',
            explain: 'u in? = are you in? — «ты с нами?». Ответ: i\'m in / i\'m down — «я в деле».',
            branches: [{ keywords: DECLINE, next: 'x' }] } },
        c: { them: ['sick. come at 8', 'can u grab some drinks on the way? 🥤'], ru: ['Круто. Приходи к 8', 'Можешь по дороге захватить напитки? 🥤'], next: 'd',
          reply: { intent: 'Согласитесь и спросите, какие напитки взять.',
            accepted: [A('sure, what do u want?', 97), A('ofc! what kind?', 96), A('np, any preferences?', 94), A('Sure, what should I get?', 92)],
            keywords: ['sure|ok|yes|yeah|no problem|of course|yep|course', 'what|which|preference|preferences|any'],
            distractors: [X('Yes. What drinks do you want me to buy for you?', 55, 'Верно, но слишком длинно и официально для друга.')],
            better: 'sure! what do u want?', betterRu: 'Конечно! Что взять?',
            explain: 'sick! — сленг «круто». grab — «захватить, купить по дороге».' } },
        d: { them: ['coke or sprite, whatever', 'oh and bring ur controller lol'], ru: ['Колу или спрайт, без разницы', 'А, и принеси свой джойстик, лол'], next: 'end',
          reply: { intent: 'Ответьте «ок, уже выхожу» — как в чате.',
            accepted: [A('k omw!', 98), A('got it, omw', 97), A('kk see u soon', 95), A('ok on my way!', 92)],
            keywords: ['on my way|see you|coming|leaving|leave|there soon'],
            distractors: [X('I will come.', 40, 'Правильно, но сухо. В чате: omw! (on my way)')],
            better: 'k omw! 🎮', betterRu: 'Ок, уже иду! 🎮',
            explain: 'omw = on my way. k / kk = ok.' } },
        end: { them: ['🔥🔥'], ru: ['🔥🔥'], end: true },
        x: { them: ['aw ok no worries', 'next time then 👊'], ru: ['Ну ладно, ничего страшного', 'Тогда в следующий раз 👊'], end: true }
      }
    },
    {
      id: 'jake-2', contactId: 'jake', order: 2, level: 'B1', title: 'Помощь с переездом',
      intro: 'Джейк переезжает и просит помочь.', learn: ["I can't make it.", 'np', 'ofc'],
      start: 'a',
      nodes: {
        a: { them: ['hey bro u free sat?', "im moving and i kinda need help 😅"], ru: ['Бро, ты свободен в субботу?', 'Я переезжаю, и мне вроде как нужна помощь 😅'], next: 'b',
          reply: { intent: 'Спросите, во сколько и сколько времени это займёт.',
            accepted: [A('ya, what time and how long?', 98), A('ofc! when do u need me?', 97), A('sure, what time?', 95), A('Sure, what time and for how long?', 90)],
            keywords: ['time|when'],
            distractors: [X('At what hour must I arrive?', 30, 'Слишком формально и книжно. Просто: what time?')],
            better: 'ofc! what time and how long?', betterRu: 'Конечно! Во сколько и надолго?',
            explain: 'ofc = of course. В ответ другу — коротко и тепло.' } },
        b: { them: ['like 10am. prob 3-4 hrs', "ill buy pizza after ofc 🍕"], ru: ['Где-то в 10 утра. Наверное, 3–4 часа', 'Потом, конечно, куплю пиццу 🍕'], next: 'c',
          reply: { intent: 'Согласитесь, но скажите, что до 11 не успеете.',
            accepted: [A("deal! but i can't make it b4 11", 98), A("sure, can i come at 11 tho?", 96), A("ok but i'll be there at 11", 95), A("Deal, but I can't be there before 11.", 90)],
            keywords: ['11|eleven'],
            distractors: [X('I will arrive at 11 o\'clock.', 45, 'Понятно, но звучит как отчёт. Другу: can\'t make it b4 11')],
            better: "deal! can't make it b4 11 tho", betterRu: 'Договорились! Но раньше 11 не успею',
            explain: 'prob = probably, b4 = before, tho = though («впрочем, правда»).' } },
        c: { them: ['11 works', 'ty so much man ur a lifesaver'], ru: ['11 подходит', 'Огромное спасибо, ты спасаешь'], next: 'end',
          reply: { intent: 'Ответьте «не за что» по-дружески.',
            accepted: [A('anytime bro', 98), A("np, that's what friends r for", 98), A('np!', 97), A('no worries!', 97), A("You're welcome.", 70, 'Правильно, но для друга звучит немного официально. В чате — np / anytime.')],
            keywords: ['no problem|no worries|anytime|welcome|sure|friends'],
            distractors: [],
            better: "np, that's what friends r for 👊", betterRu: 'Без проблем, для этого и нужны друзья 👊',
            explain: 'ur a lifesaver = you\'re a lifesaver — «ты меня спасаешь».' } },
        end: { them: ['see u sat 👊'], ru: ['Увидимся в субботу 👊'], end: true }
      }
    },

    /* ================= Emma — подруга ================= */
    {
      id: 'emma-1', contactId: 'emma', order: 1, level: 'A2', title: 'Большая новость',
      intro: 'Эмме не терпится чем-то поделиться.', learn: ['Congratulations!', "I'm so happy for you!", 'gr8'],
      start: 'a',
      nodes: {
        a: { them: ['OMG', 'guess what 😱'], ru: ['Боже', 'Угадай что 😱'], next: 'b',
          reply: { intent: 'Спросите, что случилось.',
            accepted: [A('omg what?? tell me!', 98), A('what happened?', 96), A('what??', 95), A('what is it?', 92)],
            keywords: ['what|tell me'],
            distractors: [],
            better: 'omg what?? tell me!', betterRu: 'Боже, что?? Рассказывай!',
            explain: 'Эмоциональное сообщение — отвечаем так же эмоционально.' } },
        b: { them: ['i got the job!!! 🎉🎉', 'the one at the design studio'], ru: ['Меня взяли на работу!!! 🎉🎉', 'Ту, в дизайн-студии'], next: 'c',
          reply: { intent: 'Поздравьте с энтузиазмом.',
            accepted: [A('omg congrats!! so happy for u', 98), A('congrats!!! 🎉', 98), A('no way! congrats!', 97), A("that's amazing! congratulations!", 96)],
            keywords: ['congrat|congrats|congratulations|amazing|awesome|happy for|great|proud'],
            distractors: [X('Good for you.', 45, 'Звучит сдержанно — для такой новости нужно больше эмоций!')],
            better: 'omg congrats!! so happy for u 🎉', betterRu: 'Боже, поздравляю!! Так рада за тебя 🎉',
            explain: 'congrats — разговорное «поздравляю». Много восклицательных знаков в чате = радость.' } },
        c: { them: ['thank uuu ❤️', 'we should celebrate this weekend!!'], ru: ['Спасибооо ❤️', 'Надо отпраздновать на выходных!!'], next: 'd',
          reply: { intent: 'Предложите субботу вечером.',
            accepted: [A('yes! how about sat night?', 98), A('def! sat evening?', 96), A('how about saturday evening?', 96), A('Saturday night?', 94)],
            keywords: ['sat|saturday'],
            distractors: [],
            better: 'yes!! how about sat night?', betterRu: 'Да!! Как насчёт субботы вечером?',
            explain: 'sat = Saturday. def = definitely.' } },
        d: { them: ['perfect', "that new rooftop bar? i heard its gr8"], ru: ['Идеально', 'Тот новый бар на крыше? Говорят, там отлично'], next: 'end',
          reply: { intent: 'Согласитесь и предложите встретиться в 8.',
            accepted: [A('sounds gr8! 8pm?', 98), A('yes! 8?', 95), A('sure, 8 works for me', 96), A('Sounds great! 8 pm?', 94)],
            keywords: ['8|eight'],
            distractors: [],
            better: 'sounds gr8! 8pm?', betterRu: 'Звучит отлично! В 8?',
            explain: 'gr8 = great (8 = «eight»).' } },
        end: { them: ['8 it is 🥂', 'cant wait!!'], ru: ['Значит, в 8 🥂', 'Не терпится!!'], end: true }
      }
    },
    {
      id: 'emma-2', contactId: 'emma', order: 2, level: 'B1', title: 'Плохой день',
      intro: 'Эмма расстроена. Поддержите подругу.', learn: ["It's not a big deal.", 'No worries.', 'r'],
      start: 'a',
      nodes: {
        a: { them: ['hey r u busy?'], ru: ['Привет, ты занята?'], next: 'b',
          reply: { intent: 'Скажите, что нет, и спросите, всё ли в порядке.',
            accepted: [A("no, what's up? r u ok?", 98), A('not really, everything ok?', 97), A('nope! is everything ok?', 96), A('No, what\'s up?', 92)],
            keywords: ['ok|okay|alright|wrong|fine|up'],
            distractors: [],
            better: "no, what's up? r u ok?", betterRu: 'Нет, что случилось? Ты в порядке?',
            explain: 'r u ok? = are you OK?' } },
        b: { them: ['not really 😔', 'i think i messed up at work today'], ru: ['Не особо 😔', 'Кажется, я накосячила на работе сегодня'], next: 'c',
          reply: { intent: 'Посочувствуйте и спросите, что случилось.',
            accepted: [A('oh no, what happened?', 98), A("i'm sorry 😕 what happened?", 98), A('aw what happened?', 96)],
            keywords: ['what happened|what is wrong|what went wrong|tell me|what did'],
            distractors: [X('Why did you do that?', 20, 'Звучит как упрёк. Сначала сочувствие: oh no, what happened?')],
            better: 'oh no 😕 what happened?', betterRu: 'О нет 😕 Что случилось?',
            explain: 'mess up — «напортачить». Сначала сочувствие, потом вопрос.' } },
        c: { them: ['i sent the wrong file to a client 🤦‍♀️', 'my boss wasnt happy'], ru: ['Я отправила клиенту не тот файл 🤦‍♀️', 'Начальник был недоволен'], next: 'd',
          reply: { intent: 'Успокойте: это не страшно, со всеми бывает.',
            accepted: [A("it happens! it's not the end of the world", 98), A("that's not a big deal, it happens to everyone", 98), A("don't worry, everyone makes mistakes", 97), A('no biggie, it happens', 96)],
            keywords: ['happens|mistake|mistakes|big deal|biggie|worry|end of the world|okay|fine|everyone'],
            distractors: [X('You made a big mistake.', 5, 'Подруге сейчас нужна поддержка, а не оценка.')],
            better: "it happens! honestly not a big deal ❤️", betterRu: 'Бывает! Честно, ничего страшного ❤️',
            explain: 'it happens — «бывает». no biggie — сленг «ерунда».' } },
        d: { them: ['ur right', 'ty for listening ❤️ ur the best'], ru: ['Ты права', 'Спасибо, что выслушала ❤️ Ты лучшая'], next: 'end',
          reply: { intent: 'Ответьте тепло: всегда пожалуйста.',
            accepted: [A("that's what friends are for", 98), A('anytime ❤️', 98), A('always here for u', 97), A('np! ❤️', 95)],
            keywords: ['anytime|friends|here for|no problem|welcome|always|love'],
            distractors: [],
            better: "anytime ❤️ that's what friends are for", betterRu: 'Всегда ❤️ Для этого и нужны друзья',
            explain: 'ur = you\'re. anytime — «обращайся в любое время».' } },
        end: { them: ['🥰'], ru: ['🥰'], end: true }
      }
    },

    /* ================= Tom — сосед ================= */
    {
      id: 'tom-1', contactId: 'tom', order: 1, level: 'A2', title: 'Посылка у соседа',
      intro: 'Сосед пишет вам впервые.', learn: ["I'd love to!", 'Let me know.'],
      start: 'a',
      nodes: {
        a: { them: ["Hi! It's Tom from next door 👋", 'I think the courier left your package with me'], ru: ['Привет! Это Том, сосед 👋', 'Кажется, курьер оставил вашу посылку у меня'], next: 'b',
          reply: { intent: 'Поблагодарите и спросите, когда можно забрать.',
            accepted: [A('Oh, thank you! When can I pick it up?', 98), A("Thanks so much! When's a good time to grab it?", 98), A('Thanks! Can I come by now?', 95)],
            keywords: ['thank|thanks', 'when|now|time|come|pick'],
            distractors: [X('Give me my package.', 10, 'Грубо — сосед оказал вам услугу.')],
            better: "Oh, thanks so much! When's a good time to pick it up?", betterRu: 'Ой, спасибо! Когда удобно забрать?',
            explain: 'pick up — «забрать». come by — «заглянуть».' } },
        b: { them: ["I'm home all evening, just knock 🙂"], ru: ['Я весь вечер дома, просто постучите 🙂'], next: 'c',
          reply: { intent: 'Скажите, что зайдёте через 10 минут.',
            accepted: [A("Great, I'll come by in 10 minutes.", 98), A('Perfect, see you in 10!', 97), A("Cool, I'll be there in 10 min.", 95)],
            keywords: ['10|ten'],
            distractors: [],
            better: "Perfect, I'll come by in 10 minutes!", betterRu: 'Отлично, зайду через 10 минут!',
            explain: 'in 10 minutes — «через 10 минут» (не after!).' } },
        c: { them: ["Sounds good. Btw, we're having a BBQ on Sunday.", 'Want to come?'], ru: ['Хорошо. Кстати, в воскресенье у нас барбекю.', 'Придёте?'], next: 'end',
          reply: { intent: 'Согласитесь и спросите, что принести.',
            accepted: [A("I'd love to! What can I bring?", 98), A('Sounds fun! Should I bring anything?', 98), A('Sure! What should I bring?', 96)],
            keywords: ['bring'],
            distractors: [],
            better: "I'd love to! Should I bring anything?", betterRu: 'С удовольствием! Что-нибудь принести?',
            explain: 'Спросить «что принести» — вежливая традиция в англоязычных странах.',
            branches: [{ keywords: DECLINE, next: 'x' }] } },
        end: { them: ['Just bring yourself 😄 See you soon!'], ru: ['Просто приходите сами 😄 До встречи!'], end: true },
        x: { them: ['No worries, next time! 🙂'], ru: ['Ничего страшного, в следующий раз! 🙂'], end: true }
      }
    },
    {
      id: 'tom-2', contactId: 'tom', order: 2, level: 'B1', title: 'Шум за стеной',
      intro: 'Вы вешаете полки, и сосед пишет вам.', learn: ["I didn't mean to", 'Let me know.'],
      start: 'a',
      nodes: {
        a: { them: ['Hey, sorry to bother you…', "Is someone drilling in your apartment? It's pretty loud 😅"], ru: ['Привет, извините за беспокойство…', 'У вас кто-то сверлит? Довольно громко 😅'], next: 'b',
          reply: { intent: 'Извинитесь: вешаете полки, закончите через полчаса.',
            accepted: [A("Oh, sorry about that! I'm putting up shelves. I'll be done in 30 minutes.", 98), A('Sorry! Just hanging some shelves — 30 more minutes max.', 98), A("So sorry! I'll finish in about half an hour.", 96)],
            keywords: ['sorry', '30|thirty|half an hour|minutes|soon|almost done'],
            distractors: [X("It's my apartment.", 5, 'Резко и конфликтно. Начните с извинения.')],
            better: "Oh, sorry about that! I'm putting up shelves — I'll be done in 30 minutes.", betterRu: 'Ой, простите! Вешаю полки — закончу через 30 минут.',
            explain: 'put up shelves — «вешать полки». Извинение + объяснение + срок — идеальный ответ соседу.' } },
        b: { them: ["No worries! My baby is sleeping, that's all 😴"], ru: ['Ничего! Просто малыш спит 😴'], next: 'c',
          reply: { intent: 'Предложите сделать паузу, пока ребёнок спит.',
            accepted: [A("Oh, I'm so sorry! I'll stop until the baby wakes up.", 98), A("No problem, I'll take a break until the baby wakes up.", 97), A("Of course, I'll wait until later. Sorry again!", 96)],
            keywords: ['stop|wait|break|pause|later'],
            distractors: [],
            better: "Of course! I'll take a break until the baby wakes up.", betterRu: 'Конечно! Сделаю перерыв, пока малыш не проснётся.',
            explain: 'take a break — «сделать перерыв».' } },
        c: { them: ['Thank you so much, really appreciate it 🙏'], ru: ['Огромное спасибо, очень ценю 🙏'], next: 'end',
          reply: { intent: 'Попросите написать, когда можно будет продолжить.',
            accepted: [A("No problem! Just let me know when it's okay to continue.", 98), A("Of course! Text me when the baby's awake.", 97), A('np, lmk when i can start again', 90, 'Понятно, но с соседом лучше чуть полнее: let me know.')],
            keywords: ['let me know|text me|tell me|message me'],
            distractors: [],
            better: "No problem! Just let me know when it's okay to continue.", betterRu: 'Без проблем! Дайте знать, когда можно продолжить.',
            explain: 'let me know — «дайте знать», одна из самых частых фраз в переписке.' } },
        end: { them: ['Will do! Thanks, neighbor 😊'], ru: ['Обязательно! Спасибо, сосед 😊'], end: true }
      }
    },

    /* ================= Alex — знакомство ================= */
    {
      id: 'alex-1', contactId: 'alex', order: 1, level: 'B1', title: 'Мэтч в приложении',
      intro: 'У вас мэтч с Алексом. Он пишет первым.', learn: ['hbu', 'grab a bite', 'Sounds good!'],
      start: 'a',
      nodes: {
        a: { them: ['hey! 👋 i see u like hiking too', "what's ur favorite trail?"], ru: ['Привет! 👋 Вижу, ты тоже любишь походы', 'Какой у тебя любимый маршрут?'], next: 'b',
          reply: { intent: 'Скажите, что любите горы, и спросите его.',
            accepted: [A('hi! anything in the mountains tbh. hbu?', 98), A('hey! i love mountain trails. what about you?', 97), A('Hey! Mountains for sure. What about you?', 96)],
            keywords: ['mountain|mountains|hill|hills|forest|lake|coast|sea', 'you|yours'],
            distractors: [X('Mountains.', 45, 'Один ответ без вопроса — разговор заглохнет. Добавьте hbu?')],
            better: 'hey! anything in the mountains tbh 🏔️ hbu?', betterRu: 'Привет! Честно, что угодно в горах 🏔️ А у тебя?',
            explain: 'hbu = how about you. В переписке-знакомстве важно задавать встречный вопрос.' } },
        b: { them: ['same! last month i did a 20km hike 😅', 'legs were dead for days lol'], ru: ['Тоже! В прошлом месяце прошёл 20 км 😅', 'Ноги потом несколько дней отваливались, лол'], next: 'c',
          reply: { intent: 'Отреагируйте с юмором и восхищением.',
            accepted: [A('omg 20km? ur a legend lol', 98), A("wow, 20km?! respect 😂", 98), A("haha that's impressive! i'd be dead too", 97)],
            keywords: ['wow|impressive|respect|legend|omg|haha|lol|crazy|insane|amazing|nice|cool'],
            distractors: [],
            better: "wow 20km?! respect 😂 i'd be dead too", betterRu: 'Ого, 20 км?! Уважаю 😂 Я бы тоже умерла',
            explain: 'legs were dead — «ноги отваливались». respect / legend — сленговое восхищение.' } },
        c: { them: ['haha thanks 😄', 'so… would u wanna grab a coffee sometime?'], ru: ['Ха-ха, спасибо 😄', 'Слушай… может, выпьем кофе как-нибудь?'], next: 'd',
          reply: { intent: 'Согласитесь и предложите эти выходные.',
            accepted: [A("i'd love to! how about this weekend?", 98), A('sure! r u free this weekend?', 97), A('yes! sat or sun?', 96)],
            keywords: ['love|sure|yes|yeah|definitely|of course|why not', 'weekend|saturday|sunday|sat|sun'],
            distractors: [],
            better: "i'd love to! r u free this weekend?", betterRu: 'С удовольствием! Ты свободен на выходных?',
            explain: 'wanna = want to, grab a coffee — «выпить кофе», неформально.',
            branches: [{ keywords: DECLINE, next: 'x' }] } },
        d: { them: ["sat works! there's a cute cafe near the park ☕"], ru: ['Суббота подходит! Возле парка есть милое кафе ☕'], next: 'end',
          reply: { intent: 'Предложите встретиться в 11 утра.',
            accepted: [A('perfect! 11am?', 98), A('sounds great, see u at 11?', 97), A("great! let's meet at 11", 96)],
            keywords: ['11|eleven'],
            distractors: [],
            better: 'perfect! 11am? 😊', betterRu: 'Отлично! В 11 утра? 😊',
            explain: 'Коротко, дружелюбно, с эмодзи — идеальный тон для знакомства.' } },
        end: { them: ["it's a date 😊 see u sat!"], ru: ['Договорились 😊 До субботы!'], end: true },
        x: { them: ['no worries! maybe another time 🙂'], ru: ['Ничего страшного! Может, в другой раз 🙂'], end: true }
      }
    },
    {
      id: 'alex-2', contactId: 'alex', order: 2, level: 'B2', title: 'После свидания',
      intro: 'Вечер после первого свидания.', learn: ['ngl', 'Same here.', 'How about'],
      start: 'a',
      nodes: {
        a: { them: ['hey! i had a really great time today 😊'], ru: ['Привет! Мне очень понравилось сегодня 😊'], next: 'b',
          reply: { intent: 'Скажите, что вам тоже очень понравилось.',
            accepted: [A('same here! i really enjoyed it 😊', 98), A('me too! it was so much fun', 98), A('Me too, I had a great time!', 96)],
            keywords: ['me too|same|too|enjoy|enjoyed|great time|fun|loved'],
            distractors: [X('Thank you for the date.', 45, 'Звучит сухо и официально.')],
            better: 'same here! i really enjoyed it 😊', betterRu: 'Мне тоже! Было очень здорово 😊',
            explain: 'same here — «у меня так же».' } },
        b: { them: ['the coffee was amazing but ngl the company was better 😏'], ru: ['Кофе был потрясающий, но, не буду врать, компания — ещё лучше 😏'], next: 'c',
          reply: { intent: 'Ответьте на комплимент с лёгким юмором.',
            accepted: [A('haha smooth 😏 i agree tho', 97), A('aw stop it 😄 but same', 97), A('lol that was smooth. i had fun too', 96)],
            keywords: ['haha|lol|smooth|aw|stop|agree|same|thank|thanks|too'],
            distractors: [],
            better: 'haha smooth 😏 but same', betterRu: 'Ха-ха, ловко 😏 Но взаимно',
            explain: 'ngl = not gonna lie. smooth — «ловко сказано» (о комплименте).' } },
        c: { them: ['so when can i see u again?'], ru: ['Когда мы снова увидимся?'], next: 'end',
          reply: { intent: 'Предложите в следующую пятницу — сходить на концерт.',
            accepted: [A("how about next friday? there's a concert in the park", 98), A('r u free next fri? we could go to a concert', 97), A('next friday? maybe a concert?', 95)],
            keywords: ['friday|fri', 'concert|gig|show|music'],
            distractors: [],
            better: "how about next fri? there's a concert in the park 🎶", betterRu: 'Как насчёт следующей пятницы? В парке будет концерт 🎶',
            explain: 'fri = Friday. gig — разговорное «концерт».' } },
        end: { them: ["omg yes!! it's a plan 🎶"], ru: ['Боже, да!! Договорились 🎶'], end: true }
      }
    },

    /* ================= Sarah — коллега ================= */
    {
      id: 'sarah-1', contactId: 'sarah', order: 1, level: 'B1', title: 'Рабочие вопросы',
      intro: 'Коллега пишет вам в рабочий мессенджер.', learn: ["I'll get back to you.", 'Let me check.', 'Count me in!'],
      start: 'a',
      nodes: {
        a: { them: ['Hi! Quick question — do you have the sales report?'], ru: ['Привет! Быстрый вопрос — у тебя есть отчёт по продажам?'], next: 'b',
          reply: { intent: 'Скажите, что он почти готов и вы пришлёте его к обеду.',
            accepted: [A("Hi! It's almost done, I'll send it by lunch.", 98), A("Almost ready — I'll send it before lunch.", 97), A("Nearly done! You'll have it by noon.", 96)],
            keywords: ['send|have it|ready|done|finish', 'lunch|noon|12'],
            distractors: [X('almost done, ill send it l8r lol', 35, 'С коллегой лучше без l8r и lol — звучит несерьёзно.')],
            better: "Hi! It's almost done — I'll send it by lunch.", betterRu: 'Привет! Почти готов — пришлю к обеду.',
            explain: 'В рабочих чатах пишут коротко, но полными словами.' } },
        b: { them: ['Great, thanks!', 'Also, are you joining the team lunch on Friday?'], ru: ['Отлично, спасибо!', 'И ещё — ты идёшь на командный обед в пятницу?'], next: 'c',
          reply: { intent: 'Скажите, что с удовольствием.',
            accepted: [A("Yes, I'd love to!", 98), A('Definitely, count me in!', 96), A('Sure, sounds great!', 96)],
            keywords: ['love|yes|sure|definitely|count me|of course|absolutely|sounds'],
            distractors: [],
            better: "Yes, I'd love to! Count me in.", betterRu: 'Да, с удовольствием! Я с вами.',
            explain: 'Count me in — «я в деле», уместно и с коллегами.',
            branches: [{ keywords: DECLINE, next: 'bx' }] } },
        bx: { them: ['No worries, maybe next time!', 'By the way, could you still book the table for us? 😊'], ru: ['Ничего страшного, в следующий раз!', 'Кстати, сможешь всё-таки забронировать для нас столик? 😊'], next: 'c2',
          reply: { intent: 'Согласитесь помочь и уточните время.',
            accepted: [A('Sure! What time should I book it for?', 98), A('Of course — for what time?', 96)],
            keywords: ['sure|no problem|of course|ok|yes|happy to', 'time|when'],
            distractors: [], better: 'Sure! What time should I book it for?', betterRu: 'Конечно! На какое время бронировать?',
            explain: 'book a table — «забронировать столик».' } },
        c: { them: ['Awesome. Could you book a table for 8 people?'], ru: ['Супер. Можешь забронировать столик на 8 человек?'], next: 'c2',
          reply: { intent: 'Согласитесь и уточните время.',
            accepted: [A('Sure! What time works best?', 98), A('No problem. What time should I book it for?', 97), A('Of course — for what time?', 96)],
            keywords: ['sure|no problem|of course|ok|yes|happy to', 'time|when'],
            distractors: [X('k what time', 40, 'С коллегой одиночное «k» звучит резко и небрежно.')],
            better: 'Sure! What time works best?', betterRu: 'Конечно! Во сколько удобнее?',
            explain: 'What time works best? — естественный вопрос о времени.' } },
        c2: { them: ['12:30 would be perfect. Thanks so much!'], ru: ['12:30 — идеально. Большое спасибо!'], next: 'end',
          reply: { intent: 'Скажите, что забронируете и пришлёте подтверждение.',
            accepted: [A("No problem, I'll book it and send you the confirmation.", 98), A("Will do! I'll let you know once it's booked.", 97), A("Sure thing, I'll confirm shortly.", 95)],
            keywords: ['book|reserve|confirm|confirmation|let you know|will do'],
            distractors: [],
            better: "Will do! I'll let you know once it's booked.", betterRu: 'Сделаю! Сообщу, как забронирую.',
            explain: 'Will do — короткое деловое «сделаю».' } },
        end: { them: ['👍'], ru: ['👍'], end: true }
      }
    },
    {
      id: 'sarah-2', contactId: 'sarah', order: 2, level: 'B2', title: 'Коллеге нужна помощь',
      intro: 'Сара застряла с таблицей бюджета.', learn: ['Do you have a minute?', 'give me a hand', 'No problem.'],
      start: 'a',
      nodes: {
        a: { them: ['Hey, sorry to bother you. Do you have a sec?'], ru: ['Привет, извини за беспокойство. Есть секунда?'], next: 'b',
          reply: { intent: 'Скажите, что да, в чём дело.',
            accepted: [A("Of course, what do you need?", 98), A("Sure, what's up?", 97), A('Yeah, go ahead.', 95)],
            keywords: ['sure|yes|yeah|of course|go ahead|what is up|need'],
            distractors: [], better: "Sure, what's up?", betterRu: 'Конечно, что такое?',
            explain: 'sec = second. go ahead — «давай, говори».' } },
        b: { them: ["I'm stuck on the budget spreadsheet. The formulas keep breaking 😩", 'Could you take a look when you have a minute?'], ru: ['Застряла с таблицей бюджета. Формулы всё время ломаются 😩', 'Можешь глянуть, когда будет минутка?'], next: 'c',
          reply: { intent: 'Согласитесь, но скажите, что сможете через полчаса.',
            accepted: [A('Happy to help — give me half an hour?', 98), A('Sure, I can take a look in 30 minutes.', 98), A("Of course! I'll be free in about 30 min.", 96)],
            keywords: ['30|thirty|half an hour'],
            distractors: [X("No, I'm busy.", 20, 'Резкий отказ коллеге. Предложите время.')],
            better: 'Happy to help — give me half an hour?', betterRu: 'С радостью помогу — дашь мне полчаса?',
            explain: 'take a look — «посмотреть». Согласие + срок — профессионально.' } },
        c: { them: ["Perfect, no rush. You're a lifesaver!"], ru: ['Отлично, не спеши. Ты меня спасаешь!'], next: 'end',
          reply: { intent: 'Ответьте «не за что, рада помочь».',
            accepted: [A('No problem, happy to help!', 98), A('Anytime!', 96), A("Don't mention it.", 95)],
            keywords: ['no problem|happy|anytime|mention|welcome|pleasure|no worries'],
            distractors: [], better: 'No problem, happy to help!', betterRu: 'Не за что, рада помочь!',
            explain: 'Don\'t mention it — «не стоит благодарности».' } },
        end: { them: ['🙏'], ru: ['🙏'], end: true }
      }
    },

    /* ================= Priya — руководитель ================= */
    {
      id: 'priya-1', contactId: 'priya', order: 1, level: 'B2', title: 'Срочная задача',
      intro: 'Руководитель пишет вам днём.', learn: ['Just to clarify', 'get it done', 'Keep me posted.'],
      start: 'a',
      nodes: {
        a: { them: ['Hi, are you free for a quick call at 3?'], ru: ['Привет, есть время на быстрый созвон в 3?'], next: 'b',
          reply: { intent: 'Скажите, что в 3 у вас встреча, и предложите 4.',
            accepted: [A('I have a meeting at 3. Would 4 work for you?', 98), A("Unfortunately I'm in a meeting at 3 — how about 4?", 98), A("I'm busy at 3, but I'm free at 4.", 95)],
            keywords: ['4|four'],
            distractors: [X('cant at 3, 4?', 45, 'Для руководителя слишком обрывисто. Would 4 work for you?')],
            better: "I'm in a meeting at 3 — would 4 work for you?", betterRu: 'В 3 у меня встреча — в 4 удобно?',
            explain: 'Would 4 work for you? — вежливое предложение другого времени.' } },
        b: { them: ["4 works. It's about the client presentation — they moved the deadline to Thursday."], ru: ['4 подходит. Это про презентацию для клиента — они перенесли срок на четверг.'], next: 'c',
          reply: { intent: 'Уточните: в четверг утром или к концу дня?',
            accepted: [A('Just to clarify, do they need it Thursday morning or by the end of the day?', 98), A('Got it. Is that Thursday morning or end of day?', 96), A('Thanks for letting me know. Morning or end of day Thursday?', 95)],
            keywords: ['morning', 'end of the day|end of day|eod|afternoon|evening'],
            distractors: [],
            better: 'Just to clarify — Thursday morning or end of day?', betterRu: 'Просто уточню — в четверг утром или к концу дня?',
            explain: 'EOD = end of day — частое сокращение в рабочих чатах.' } },
        c: { them: ['End of day. Can you get it done?'], ru: ['К концу дня. Успеешь?'], next: 'd',
          reply: { intent: 'Скажите, что да, но понадобится помощь Лео с цифрами.',
            accepted: [A("Yes, I can get it done, but I'll need Leo's help with the numbers.", 98), A('Should be fine, as long as Leo can help with the numbers.', 97), A('I think so — could Leo give me a hand with the data?', 96)],
            keywords: ['leo', 'number|numbers|data|figures'],
            distractors: [],
            better: "Yes, I'll get it done — I'll just need Leo's help with the numbers.", betterRu: 'Да, сделаю — только понадобится помощь Лео с цифрами.',
            explain: 'Согласие + условие: так вы берёте задачу и сразу снимаете риск.' } },
        d: { them: ["I'll let him know. Thanks for being flexible 🙏"], ru: ['Я ему скажу. Спасибо за гибкость 🙏'], next: 'end',
          reply: { intent: 'Ответьте коротко и профессионально.',
            accepted: [A("No problem. I'll keep you posted.", 98), A('Happy to help. Will update you tomorrow.', 97), A('Of course. Talk at 4.', 95)],
            keywords: ['no problem|happy|of course|sure|posted|update|talk'],
            distractors: [X('np lol', 30, 'С руководителем «lol» неуместно.')],
            better: "No problem — I'll keep you posted.", betterRu: 'Без проблем — буду держать в курсе.',
            explain: 'keep you posted — «держать в курсе».' } },
        end: { them: ['👍'], ru: ['👍'], end: true }
      }
    },
    {
      id: 'priya-2', contactId: 'priya', order: 2, level: 'C1', title: 'Согласование отпуска',
      intro: 'Руководитель пишет о вашем запросе на отпуск.', learn: ['How about', 'Would it be possible to'],
      start: 'a',
      nodes: {
        a: { them: ['Hi, I saw your vacation request for next month.'], ru: ['Привет, я видела твой запрос на отпуск в следующем месяце.'], next: 'b',
          reply: { intent: 'Скажите, что хотели бы взять две недели в августе, если это удобно команде.',
            accepted: [A("Yes, I'd like to take two weeks off in August, if that works for the team.", 98), A("That's right — I was hoping to take two weeks in August, if it's not a problem.", 98)],
            keywords: ['two|2', 'week|weeks', 'august'],
            distractors: [], better: "Yes — I'd like to take two weeks off in August, if that works for the team.", betterRu: 'Да — хотел(а) бы взять две недели в августе, если это удобно команде.',
            explain: 'take time off — «взять отпуск». if that works — вежливая оговорка.' } },
        b: { them: ['The first two weeks of August are tricky — we have the product launch.'], ru: ['Первые две недели августа — сложно, у нас запуск продукта.'], next: 'c',
          reply: { intent: 'Предложите вторую половину августа.',
            accepted: [A('I understand. Would the second half of August work instead?', 98), A('No problem. How about the last two weeks of August?', 97), A('I see. Could I take the second half of the month instead?', 97)],
            keywords: ['second half|last two weeks|end of august|later|second|last'],
            distractors: [X('But I already bought tickets.', 20, 'Звучит как ультиматум. Предложите альтернативу.')],
            better: 'I understand. Would the second half of August work instead?', betterRu: 'Понимаю. А вторая половина августа подойдёт?',
            explain: 'tricky — «сложно, неудобно». instead — «вместо этого».' } },
        c: { them: ['That works perfectly. Please make sure your tasks are handed over before you go.'], ru: ['Отлично подходит. Только передай, пожалуйста, задачи перед уходом.'], next: 'end',
          reply: { intent: 'Заверьте, что передадите дела и напишете инструкцию для коллег.',
            accepted: [A("Of course. I'll hand everything over and write up notes for the team.", 98), A("Absolutely — I'll make sure everything is handed over and documented.", 98), A("Will do. I'll prepare a handover document before I leave.", 97)],
            keywords: ['hand|handover|handed|over', 'note|notes|document|documented|instructions|doc'],
            distractors: [], better: "Absolutely — I'll hand everything over and write up notes for the team.", betterRu: 'Конечно — передам все дела и напишу инструкцию для команды.',
            explain: 'hand over — «передать дела». write up — «оформить письменно».' } },
        end: { them: ['Perfect. Approved ✅ Enjoy your time off!'], ru: ['Отлично. Одобрено ✅ Хорошего отдыха!'], end: true }
      }
    },

    /* ================= Mr. Davis — арендодатель, формально ================= */
    {
      id: 'davis-1', contactId: 'davis', order: 1, level: 'B1', title: 'Течёт кран',
      intro: 'Арендодатель пишет, чтобы узнать, всё ли в порядке.', learn: ['There seems to be a problem with', 'Would it be possible to', "I'd appreciate it if"],
      start: 'a',
      nodes: {
        a: { them: ['Good morning. This is Robert Davis, your landlord.', 'I wanted to check that everything is fine with the apartment.'], ru: ['Доброе утро. Это Роберт Дэвис, ваш арендодатель.', 'Хотел уточнить, всё ли в порядке с квартирой.'], next: 'b',
          reply: { intent: 'Поздоровайтесь и вежливо сообщите, что на кухне течёт кран.',
            accepted: [A('Good morning, Mr. Davis. Thank you for checking in. Actually, the kitchen faucet is leaking.', 98), A('Good morning! Thanks for asking. There seems to be a problem with the kitchen faucet — it\'s leaking.', 98), A('Hello Mr. Davis. Everything is fine, except the kitchen tap is leaking.', 97)],
            keywords: ['faucet|tap|sink', 'leak|leaking|drip|dripping|broken|problem'],
            distractors: [X('hey! the kitchen tap is broken lol', 20, 'Слишком фамильярно для арендодателя: hey и lol — для друзей.')],
            better: 'Good morning, Mr. Davis. Thank you for checking in. There seems to be a problem with the kitchen faucet — it is leaking.', betterRu: 'Доброе утро, мистер Дэвис. Спасибо, что написали. Кажется, проблема с краном на кухне — он течёт.',
            explain: 'Формальный адресат → обращение (Mr. Davis), благодарность, мягкое There seems to be…' } },
        b: { them: ['I am sorry to hear that. I can send a plumber tomorrow between 10 and 12.', 'Would that suit you?'], ru: ['Сожалею. Могу прислать сантехника завтра с 10 до 12.', 'Вам удобно?'], next: 'c',
          reply: { intent: 'Скажите, что утром вы на работе, и спросите, можно ли после 17:00.',
            accepted: [A("Unfortunately, I'm at work in the morning. Would it be possible after 5 p.m.?", 98), A("I'm afraid I work until 5. Could the plumber come after 5?", 98), A("I'm not available in the morning. Is there any way he could come after 5?", 97)],
            keywords: ['5|five|evening|afternoon'],
            distractors: [X('no, im at work. come after 5', 25, 'Звучит как приказ, да ещё в чатовом стиле. Арендодателю: Would it be possible…?')],
            better: "Unfortunately, I'm at work in the morning. Would it be possible for him to come after 5 p.m.?", betterRu: 'К сожалению, утром я на работе. Может ли он прийти после 17:00?',
            explain: 'Unfortunately / I\'m afraid — смягчают отказ. Would it be possible…? — вежливая просьба.' } },
        c: { them: ['Certainly. He will come at 5:30 p.m.'], ru: ['Разумеется. Он придёт в 17:30.'], next: 'end',
          reply: { intent: 'Вежливо поблагодарите.',
            accepted: [A('Thank you very much, I really appreciate it.', 98), A("That's perfect, thank you!", 96), A('Great, thank you for your help.', 96)],
            keywords: ['thank|appreciate'],
            distractors: [X('thx!', 40, 'Для формальной переписки лучше полностью: Thank you.')],
            better: 'Thank you very much, I really appreciate it.', betterRu: 'Большое спасибо, очень признателен(на).',
            explain: 'В формальной переписке — без сокращений thx / ty.' } },
        end: { them: ['You are welcome. Have a good day.'], ru: ['Пожалуйста. Хорошего дня.'], end: true }
      }
    },
    {
      id: 'davis-2', contactId: 'davis', order: 2, level: 'B2', title: 'Продление аренды',
      intro: 'Договор аренды заканчивается.', learn: ['Is there any way', 'That makes sense.'],
      start: 'a',
      nodes: {
        a: { them: ['Dear tenant,', 'Your lease ends next month. Would you like to renew it for another year?'], ru: ['Уважаемый арендатор,', 'Ваш договор заканчивается в следующем месяце. Хотите продлить ещё на год?'], next: 'b',
          reply: { intent: 'Скажите, что хотели бы продлить, и спросите, изменится ли арендная плата.',
            accepted: [A("Yes, I'd like to renew. Could you let me know if the rent will change?", 98), A('I would be happy to renew. Will the rent stay the same?', 97), A("Yes, I'd like to stay. Is there any change to the rent?", 96)],
            keywords: ['renew|stay|extend', 'rent|price|cost'],
            distractors: [], better: "Yes, I would like to renew. Could you let me know whether the rent will change?", betterRu: 'Да, хотел(а) бы продлить. Подскажите, изменится ли плата?',
            explain: 'renew a lease — «продлить договор аренды».' } },
        b: { them: ['The rent will increase by 5%, as building costs have gone up.'], ru: ['Плата вырастет на 5%, так как выросли расходы на здание.'], next: 'c',
          reply: { intent: 'Вежливо спросите, можно ли оставить прежнюю цену при договоре на 2 года.',
            accepted: [A('I understand. Would it be possible to keep the current rent if I sign for two years?', 98), A('I see. Would you consider keeping the same rent for a two-year lease?', 98), A('Is there any way to keep the current price if I sign a two-year lease?', 97)],
            keywords: ['two|2', 'year|years', 'same|current|keep|increase'],
            distractors: [X("5%?? that's a lot smh", 10, 'Эмоции и сленг в переговорах с арендодателем — худшая тактика.')],
            better: 'I understand. Would it be possible to keep the current rent if I sign for two years?', betterRu: 'Понимаю. Можно ли сохранить текущую плату, если я подпишу на два года?',
            explain: 'Сначала понимание (I understand), потом предложение — так договариваются.' } },
        c: { them: ['That sounds reasonable. I can agree to a 2% increase for a two-year lease.'], ru: ['Звучит разумно. На договор на два года могу согласиться на рост 2%.'], next: 'end',
          reply: { intent: 'Согласитесь и попросите прислать договор.',
            accepted: [A('That works for me. Could you send me the new contract?', 98), A('That sounds fair. I look forward to receiving the contract.', 97), A('Deal. Please send over the contract when you can.', 96)],
            keywords: ['contract|lease|agreement|paperwork|documents'],
            distractors: [], better: 'That sounds fair. Could you please send me the new contract?', betterRu: 'Справедливо. Пришлите, пожалуйста, новый договор.',
            explain: 'I look forward to… — формальное «жду».' } },
        end: { them: ['I will email it to you today. Best regards, Robert Davis.'], ru: ['Отправлю сегодня по почте. С уважением, Роберт Дэвис.'], end: true }
      }
    }
  ];

  /* ---------- индексы и подготовка ---------- */
  D.contactsById = {};
  D.contacts.forEach(function (c) { D.contactsById[c.id] = c; });
  D.episodesById = {};
  D.episodes.forEach(function (e) {
    D.episodesById[e.id] = e;
    Object.keys(e.nodes).forEach(function (nid) {
      var n = e.nodes[nid];
      // реплика собеседника, на которую отвечаем (для упражнений в «Ошибках»)
      if (n.reply) n.reply.npc = n.them[n.them.length - 1];
    });
  });
})(window.EG = window.EG || {});
