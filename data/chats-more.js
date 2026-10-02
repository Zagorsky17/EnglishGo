/* data/chats-more.js — дополнительные эпизоды мессенджера и новые контакты.
   Формат тот же, что в data/chats.js; файл подключается сразу после него и дополняет списки и индексы.
   Эпизоды каждого контакта открываются по порядку (order), поэтому новые продолжают уже пройденные. */
(function (EG) {
  'use strict';

  var D = EG.data = EG.data || {};
  function A(t, n, note) { return { t: t, n: n, note: note || '' }; }
  function X(t, n, note) { return { t: t, n: n, note: note }; }
  var DECLINE = ['can not|sorry|busy|unfortunately|no thanks|nah|maybe next time|another time|not really'];

  var contacts = [
    { id: 'mia', name: 'Mia', color: '#eab308', role: 'сестра', register: 'casual', about: 'Младшая сестра, учится в Лондоне. Пишет по-простому, любит эмодзи.',
      confused: ['wait what? 😅', 'huh, not sure what you mean'] },
    { id: 'laura', name: 'Laura Bennett', color: '#475569', role: 'рекрутер', register: 'formal', about: 'Рекрутер международной компании. Деловая переписка — только полные формы.',
      confused: ['I am sorry, could you please clarify?', 'Could you rephrase that, please?'] }
  ];

  var episodes = [
    /* ================= Jake — друг, сленг ================= */
    {
      id: 'jake-3', contactId: 'jake', order: 3, level: 'B1', title: 'Игра в субботу',
      intro: 'Джейк достал билеты на футбол.', learn: ['omg', 'Count me in!', 'lmk', 'np'],
      start: 'a',
      nodes: {
        a: { them: ['broooo', 'guess who got 2 tickets for the game on sat 🔥⚽'], ru: ['Бро-о-о', 'Угадай, у кого два билета на игру в субботу 🔥⚽'], next: 'b',
          reply: { intent: 'Удивитесь и спросите, серьёзно ли он.',
            accepted: [A('no way! for real?', 98), A('omg no way!!', 97), A('wait fr?? 😱', 96), A('are u serious?!', 96), A('Seriously?', 90)],
            keywords: ['no way|for real|serious|seriously|fr|really'],
            distractors: [X('That is good news.', 40, 'Слишком спокойно и официально для такой новости.')],
            better: 'no way!! for real? 😱', betterRu: 'Да ладно!! Серьёзно? 😱',
            explain: 'no way — «да ладно!». fr = for real — «серьёзно?».' } },
        b: { them: ['yep lol', 'u wanna come? kickoff at 3'], ru: ['Ага, лол', 'Хочешь пойти? Начало в 3'], next: 'c',
          reply: { intent: 'С радостью согласитесь.',
            accepted: [A('count me in!!', 98), A("ofc i'm in!", 98), A('yesss 100%', 96), A("hell yeah i'm down", 95), A('Yes, I would love to!', 85, 'Правильно, но для Джейка слишком официально.')],
            keywords: ['in|down|yes|yeah|yesss|100|love to|of course|definitely'],
            distractors: [X('I accept your invitation.', 30, 'Звучит как деловое письмо, а не сообщение другу.')],
            better: "count me in!! 🙌", betterRu: 'Я в деле!! 🙌',
            explain: 'Count me in! — «я с вами!». kickoff — начало матча.',
            branches: [{ keywords: DECLINE, next: 'x' }] } },
        c: { them: ['sick', 'meet at the station at 2? ill bring snacks'], ru: ['Круто', 'Встретимся на станции в 2? Я возьму перекус'], next: 'end',
          reply: { intent: 'Согласитесь и скажите, что купите напитки.',
            accepted: [A('perfect, ill get the drinks', 98), A("deal! i'll bring drinks 🥤", 98), A('ok cool, drinks on me', 96), A('sounds good, I will get drinks', 90)],
            keywords: ['drink|drinks|soda|coke'],
            distractors: [],
            better: "deal! drinks on me 🥤", betterRu: 'Договорились! Напитки с меня 🥤',
            explain: 'on me — «за мой счёт».' } },
        end: { them: ['legend 🙌 see u sat'], ru: ['Легенда 🙌 до субботы'], end: true },
        x: { them: ['nooo 😭', 'ok ill ask someone else. next time tho!'], ru: ['Не-е-ет 😭', 'Ладно, спрошу кого-нибудь ещё. Но в следующий раз — обязательно!'], end: true }
      }
    },
    {
      id: 'jake-4', contactId: 'jake', order: 4, level: 'B2', title: 'Джейк расстроен',
      intro: 'Джейк не прошёл собеседование.', learn: ['ngl', "That's the last thing I need.", "I'm sorry to hear that.", 'tbh'],
      start: 'a',
      nodes: {
        a: { them: ['ngl today sucked', 'didnt get the job 😞'], ru: ['Честно, сегодня отстой', 'Меня не взяли на работу 😞'], next: 'b',
          reply: { intent: 'Посочувствуйте другу.',
            accepted: [A('oh no, im so sorry man', 98), A('ugh that sucks, sorry bro', 98), A("damn, i'm really sorry 😕", 97), A("I'm sorry to hear that.", 85, 'Правильно, но звучит официально. Другу: that sucks, sorry man.')],
            keywords: ['sorry|sucks|damn|oh no|ugh'],
            distractors: [X('It is not a problem.', 20, 'Обесценивает его переживания.')],
            better: 'ugh that sucks, sorry man 😕', betterRu: 'Блин, отстой, сочувствую 😕',
            explain: 'that sucks — «это отстой» (сочувствие в неформальной речи).' } },
        b: { them: ['they said i didnt have enough experience', 'i really wanted that one tbh'], ru: ['Сказали, что мало опыта', 'Честно, очень хотел туда'], next: 'c',
          reply: { intent: 'Поддержите: скажите, что это их потеря и будут другие возможности.',
            accepted: [A("their loss tbh. there'll be other jobs", 98), A("honestly it's their loss. something better will come up", 98), A("ur gonna find something even better, trust me", 96)],
            keywords: ['loss|better|other|next|find|come up|another'],
            distractors: [X('Maybe you are not good enough.', 5, 'Жестоко — друг ждёт поддержки.')],
            better: "honestly it's their loss. something better will come up 💪", betterRu: 'Честно, это их потеря. Подвернётся что-то получше 💪',
            explain: 'their loss — «это их потеря». come up — «подвернуться».' } },
        c: { them: ['thx man', 'i think i just need a beer rn lol'], ru: ['Спасибо, бро', 'Кажется, мне сейчас просто нужно пиво, лол'], next: 'end',
          reply: { intent: 'Предложите встретиться сегодня вечером.',
            accepted: [A('say no more. pub at 7?', 98), A('wanna grab one tonight? my treat', 98), A('lets go out tonight, drinks on me', 96), A('meet u at the pub later?', 95)],
            keywords: ['tonight|later|7|8|pub|bar|grab|go out|meet'],
            distractors: [],
            better: 'say no more. pub at 7? my treat 🍻', betterRu: 'Больше ни слова. Паб в 7? Я угощаю 🍻',
            explain: 'say no more — «можешь не продолжать» (охотно соглашаюсь). my treat — «я угощаю».' } },
        end: { them: ['ur the best 🙏 see u at 7'], ru: ['Ты лучший 🙏 до встречи в 7'], end: true }
      }
    },

    /* ================= Emma — подруга ================= */
    {
      id: 'emma-3', contactId: 'emma', order: 3, level: 'B1', title: 'Помоги выбрать',
      intro: 'Эмма не может выбрать платье для свадьбы подруги.', learn: ['idk', 'imo', 'lol', 'omg'],
      start: 'a',
      nodes: {
        a: { them: ['HELP 😩', 'my friends wedding is on sat and idk what to wear'], ru: ['ПОМОГИ 😩', 'У подруги свадьба в субботу, и я не знаю, что надеть'], next: 'b',
          reply: { intent: 'Спросите, какие есть варианты.',
            accepted: [A('omg ok what are the options?', 98), A('haha ok show me what u have', 97), A("send pics! what've u got?", 96), A('What are your options?', 88)],
            keywords: ['option|options|show|pics|pic|photo|got|have'],
            distractors: [],
            better: 'omg ok send pics! what are the options? 👀', betterRu: 'Боже, ладно, кидай фото! Какие варианты? 👀',
            explain: 'pics = pictures. what\'ve u got? — «что у тебя есть?».' } },
        b: { them: ['ok so blue dress or the red one? 📸📸', 'the blue is more elegant but the red is sooo fun'], ru: ['Итак, синее платье или красное? 📸📸', 'Синее элегантнее, но красное такое весёлое'], next: 'c',
          reply: { intent: 'Скажите, что, по-вашему, лучше синее.',
            accepted: [A('imo the blue one, it looks so elegant', 98), A('def the blue! u look amazing in it', 98), A('blue for sure 💙', 96), A('I think the blue one is better.', 90)],
            keywords: ['blue'],
            distractors: [X('Red is the colour of danger.', 30, 'Не помогает выбрать — и звучит странно.')],
            better: 'imo the blue one! u look amazing in it 💙', betterRu: 'Как по мне, синее! Ты в нём шикарно выглядишь 💙',
            explain: 'imo = in my opinion. def = definitely.' } },
        c: { them: ['ok blue it is!! ty 😘', 'ur the best stylist lol'], ru: ['Решено, синее!! Спасибо 😘', 'Ты лучший стилист, лол'], next: 'end',
          reply: { intent: 'Ответьте шутливо и пожелайте хорошо провести время.',
            accepted: [A('haha anytime! have fun at the wedding 🥂', 98), A('lol i know 😎 have an amazing time!', 97), A('np! enjoy the party!!', 96)],
            keywords: ['fun|enjoy|amazing time|great time|have a good'],
            distractors: [],
            better: 'lol i know 😎 have an amazing time!', betterRu: 'Лол, я знаю 😎 Отлично тебе провести время!',
            explain: 'anytime — «обращайся». have fun / enjoy — пожелание хорошо провести время.' } },
        end: { them: ['will do!! 💃'], ru: ['Обязательно!! 💃'], end: true }
      }
    },
    {
      id: 'emma-4', contactId: 'emma', order: 4, level: 'B2', title: 'Отменённые планы',
      intro: 'Вам придётся отменить встречу с Эммой.', learn: ['Something came up.', 'take a rain check', "It's up to you.", 'Can we reschedule?'],
      start: 'a',
      nodes: {
        a: { them: ['cant wait for tonight!! 🍝', 'still on for 8?'], ru: ['Жду не дождусь вечера!! 🍝', 'В силе на восемь?'], next: 'b',
          reply: { intent: 'Извинитесь: что-то случилось по работе, прийти не сможете.',
            accepted: [A("ugh i'm so sorry, something came up at work and i can't make it tonight 😩", 98), A("sooo sorry, work emergency, can't make it tonight", 97), A("I'm really sorry, something came up and I can't come tonight.", 92)],
            keywords: ['sorry', 'work|came up|emergency|can not make|can not come'],
            distractors: [X("can't come", 40, 'Слишком сухо — нужны извинения и причина.')],
            better: "ugh i'm so sorry 😩 something came up at work and i can't make it tonight", betterRu: 'Блин, прости 😩 на работе кое-что случилось, сегодня не смогу',
            explain: 'Something came up — «кое-что случилось» (вежливая причина). can\'t make it — «не успею/не смогу прийти».' } },
        b: { them: ['oh no 😢', 'is everything ok?'], ru: ['Ой, нет 😢', 'Всё в порядке?'], next: 'c',
          reply: { intent: 'Успокойте её: всё нормально, просто срочный проект. Предложите перенести.',
            accepted: [A("yeah all good, just an urgent project. can we reschedule?", 98), A("yes don't worry, just crazy busy. rain check? 🙏", 97), A("everything's fine, just a deadline. how about tomorrow instead?", 97)],
            keywords: ['reschedule|rain check|tomorrow|another day|instead|next week|friday|saturday|sunday'],
            distractors: [],
            better: "all good, just an urgent project 😅 can we reschedule?", betterRu: 'Всё нормально, просто срочный проект 😅 Перенесём?',
            explain: 'take a rain check — «перенести на потом». reschedule — перенести.' } },
        c: { them: ['of course! friday?', 'u owe me dessert tho 😜'], ru: ['Конечно! В пятницу?', 'Но с тебя десерт 😜'], next: 'end',
          reply: { intent: 'Согласитесь на пятницу и пообещайте угостить десертом.',
            accepted: [A("friday works! and dessert's on me, promise 🍰", 98), A('deal!! friday + dessert on me 😂', 98), A('Friday is perfect. Dessert is on me!', 94)],
            keywords: ['friday', 'dessert|on me|promise|deal'],
            distractors: [],
            better: "friday works! dessert's on me 🍰", betterRu: 'Пятница подходит! Десерт с меня 🍰',
            explain: 'works — «подходит» (о времени). on me — «за мой счёт».' } },
        end: { them: ['yay 🥰 good luck with the project!'], ru: ['Ура 🥰 удачи с проектом!'], end: true }
      }
    },

    /* ================= Tom — сосед ================= */
    {
      id: 'tom-3', contactId: 'tom', order: 3, level: 'B1', title: 'Полить цветы',
      intro: 'Вы уезжаете на неделю и хотите попросить Тома о помощи.', learn: ['I was wondering if', 'No problem.', 'keep an eye on', 'Let me know.'],
      start: 'a',
      nodes: {
        a: { them: ['Hi! Saw your suitcase in the hallway 😄 Going somewhere nice?'], ru: ['Привет! Видел твой чемодан в коридоре 😄 Куда-то в хорошее место?'], next: 'b',
          reply: { intent: 'Скажите, что едете в Италию на неделю.',
            accepted: [A("Hi Tom! Yes, I'm going to Italy for a week.", 98), A('Yep, a week in Italy! Can\'t wait 😊', 97), A("I'm off to Italy for a week!", 96)],
            keywords: ['italy', 'week'],
            distractors: [X('Italy. Week.', 40, 'Слишком отрывисто.')],
            better: "Hi Tom! Yes, I'm off to Italy for a week 😊", betterRu: 'Привет, Том! Да, еду в Италию на неделю 😊',
            explain: 'be off to — «уезжать куда-то» (разговорное).' } },
        b: { them: ['Lucky you! 🇮🇹'], ru: ['Везёт тебе! 🇮🇹'], next: 'c',
          reply: { intent: 'Спросите, не мог бы он поливать ваши цветы, пока вас нет.',
            accepted: [A("Thanks! I was wondering if you could water my plants while I'm away?", 98), A('Would you mind watering my plants while I am away?', 97), A('Could you water my plants while I am gone?', 96)],
            keywords: ['water', 'plant|plants|flowers'],
            distractors: [X('Water my plants.', 30, 'Звучит как приказ. I was wondering if you could…')],
            better: "I was wondering if you could water my plants while I'm away?", betterRu: 'Хотел спросить, не мог бы ты поливать мои цветы, пока меня нет?',
            explain: 'I was wondering if you could… — очень вежливая просьба.', learn: ['I was wondering if'] } },
        c: { them: ['Of course, no problem!', 'Just leave the key under my door.'], ru: ['Конечно, без проблем!', 'Просто оставь ключ под моей дверью.'], next: 'end',
          reply: { intent: 'Поблагодарите и пообещайте привезти что-нибудь из Италии.',
            accepted: [A("Thanks so much! I'll bring you something from Italy 😊", 98), A("You're a star! I'll bring you back some Italian coffee.", 98), A("Thank you! I'll get you a souvenir.", 95)],
            keywords: ['thank|thanks|star', 'bring|get|souvenir|gift|present'],
            distractors: [],
            better: "Thanks so much! I'll bring you back something from Italy 😊", betterRu: 'Огромное спасибо! Привезу тебе что-нибудь из Италии 😊',
            explain: 'You\'re a star! — «ты золото!». bring back — привезти (из поездки).' } },
        end: { them: ['Haha no need! Have a great trip ☀️'], ru: ['Ха-ха, не нужно! Хорошей поездки ☀️'], end: true }
      }
    },
    {
      id: 'tom-4', contactId: 'tom', order: 4, level: 'B2', title: 'Приглашение на барбекю',
      intro: 'Том устраивает барбекю во дворе.', learn: ['Count me in!', 'I\'m up for it.', 'Sounds good!'],
      start: 'a',
      nodes: {
        a: { them: ['Hey neighbour! We are doing a barbecue in the garden on Sunday afternoon 🍔', 'Would you like to join?'], ru: ['Привет, сосед! В воскресенье днём устраиваем барбекю во дворе 🍔', 'Присоединишься?'], next: 'b',
          reply: { intent: 'С радостью согласитесь.',
            accepted: [A("I'd love to, thanks for inviting me!", 98), A("Count me in! Sounds great.", 98), A("Sure, I'm up for it!", 96), A('Yes, with pleasure!', 92)],
            keywords: ['love to|count me in|up for it|sure|yes|great|pleasure|of course'],
            distractors: [],
            better: "I'd love to — thanks for inviting me! 😊", betterRu: 'С удовольствием — спасибо за приглашение! 😊',
            explain: 'I\'d love to / Count me in! — тёплое согласие.',
            branches: [{ keywords: DECLINE, next: 'x' }] } },
        b: { them: ['Great! Around 2 pm.'], ru: ['Отлично! Около двух.'], next: 'c',
          reply: { intent: 'Спросите, принести ли что-нибудь.',
            accepted: [A('Should I bring anything?', 98), A('Can I bring something? Maybe a salad?', 98), A('What can I bring?', 96)],
            keywords: ['bring'],
            distractors: [X('What do you give me to eat?', 20, 'Звучит странно и невежливо.')],
            better: 'Great! Should I bring anything?', betterRu: 'Отлично! Что-нибудь принести?',
            explain: 'Should I bring anything? — принято спрашивать, если зовут в гости.' } },
        c: { them: ['Maybe some drinks? We have plenty of food 😄'], ru: ['Может, напитки? Еды у нас полно 😄'], next: 'end',
          reply: { intent: 'Согласитесь принести лимонад и сок.',
            accepted: [A("Sure, I'll bring some lemonade and juice.", 98), A('No problem, I will get lemonade and juice!', 96), A("Drinks it is! Lemonade and juice okay?", 96)],
            keywords: ['lemonade|juice|drinks'],
            distractors: [],
            better: "Sure, I'll bring some lemonade and juice 🍋", betterRu: 'Конечно, принесу лимонад и сок 🍋',
            explain: 'X it is! — «значит, X!» (согласие с вариантом).' } },
        end: { them: ['Perfect! See you on Sunday 🌞'], ru: ['Идеально! До воскресенья 🌞'], end: true },
        x: { them: ['No worries! Maybe next time 🙂'], ru: ['Ничего страшного! Может, в следующий раз 🙂'], end: true }
      }
    },

    /* ================= Alex — знакомство в приложении ================= */
    {
      id: 'alex-3', contactId: 'alex', order: 3, level: 'B2', title: 'Второе свидание',
      intro: 'Алекс предлагает встретиться снова.', learn: ["I'm down.", 'What are you up to?', 'That sounds fun!', "I'd love to!"],
      start: 'a',
      nodes: {
        a: { them: ['hey you 😊', 'what are you up to this weekend?'], ru: ['Привет 😊', 'Какие планы на выходные?'], next: 'b',
          reply: { intent: 'Скажите, что планов пока нет, и спросите, почему он интересуется.',
            accepted: [A('nothing planned yet, why? 😏', 98), A('not much so far! why do you ask? 😊', 98), A('No plans yet. What did you have in mind?', 95)],
            keywords: ['nothing|no plans|not much|free', 'why|mind|ask'],
            distractors: [],
            better: 'nothing planned yet… why? 😏', betterRu: 'Пока ничего не планировал… а что? 😏',
            explain: 'What did you have in mind? — «что ты задумал?» — лёгкий флирт.' } },
        b: { them: ['there is an open-air cinema in the park on saturday 🎬', 'wanna go?'], ru: ['В субботу в парке кино под открытым небом 🎬', 'Хочешь пойти?'], next: 'c',
          reply: { intent: 'С радостью согласитесь.',
            accepted: [A("that sounds amazing, i'm in!", 98), A("i'd love to 😍", 98), A("yes! i've always wanted to try that", 96), A('Sounds fun, count me in!', 96)],
            keywords: ['in|love to|yes|sounds|down|amazing'],
            distractors: [],
            better: "i'd love to! sounds so cute 😍", betterRu: 'С удовольствием! Звучит так мило 😍',
            explain: 'Эмоции и эмодзи в переписке на свидании уместны.',
            branches: [{ keywords: DECLINE, next: 'x' }] } },
        c: { them: ['yay! i will bring a blanket 🧺', 'you bring the snacks?'], ru: ['Ура! Я возьму плед 🧺', 'С тебя закуски?'], next: 'end',
          reply: { intent: 'Согласитесь и скажите, что возьмёте попкорн и шоколад.',
            accepted: [A("deal! i'll bring popcorn and chocolate 🍿", 98), A('of course! popcorn and chocolate sound good?', 97), A("You got it — popcorn and chocolate!", 96)],
            keywords: ['popcorn|chocolate|snacks'],
            distractors: [],
            better: "deal! popcorn and chocolate it is 🍿🍫", betterRu: 'Договорились! Попкорн и шоколад 🍿🍫',
            explain: 'You got it! — «будет сделано!».' } },
        end: { them: ['perfect date 😄 see you saturday!'], ru: ['Идеальное свидание 😄 до субботы!'], end: true },
        x: { them: ['aw ok 😕 let me know when you are free then'], ru: ['Ну ладно 😕 тогда напиши, когда будешь свободен'], end: true }
      }
    },
    {
      id: 'alex-4', contactId: 'alex', order: 4, level: 'B2', title: 'Знакомство с друзьями',
      intro: 'Алекс зовёт вас на день рождения к своему другу.', learn: ['It\'s up to you.', 'kinda', 'No worries.', 'I can imagine.'],
      start: 'a',
      nodes: {
        a: { them: ['so… my friend sam is having a birthday party on friday 🎉', 'want to come? everyone wants to meet you haha'], ru: ['Слушай… у моего друга Сэма день рождения в пятницу 🎉', 'Пойдёшь? Все хотят с тобой познакомиться, ха-ха'], next: 'b',
          reply: { intent: 'Согласитесь, но признайтесь, что немного нервничаете.',
            accepted: [A("i'd love to! kinda nervous tho 😅", 98), A("sure! a bit nervous to meet everyone haha", 98), A("Yes, but I'm a little nervous!", 94)],
            keywords: ['nervous|scared|anxious|shy'],
            distractors: [],
            better: "i'd love to! kinda nervous tho 😅", betterRu: 'С удовольствием! Правда, немного нервничаю 😅',
            explain: 'kinda = kind of — «немного, вроде как». tho = though — «правда, впрочем».' } },
        b: { them: ['haha dont worry, they are super friendly', 'should we get sam a present together?'], ru: ['Ха-ха, не переживай, они очень дружелюбные', 'Подарим Сэму подарок вместе?'], next: 'c',
          reply: { intent: 'Согласитесь и спросите, что Сэм любит.',
            accepted: [A('good idea! what is he into?', 98), A("yes! what does sam like?", 98), A("sure, any idea what he'd like?", 96)],
            keywords: ['like|into|idea|interested'],
            distractors: [],
            better: 'good idea! what is he into?', betterRu: 'Хорошая идея! Чем он увлекается?',
            explain: 'be into — «увлекаться».' } },
        c: { them: ['he is obsessed with board games 🎲', 'maybe that new strategy game?'], ru: ['Он помешан на настолках 🎲', 'Может, ту новую стратегию?'], next: 'end',
          reply: { intent: 'Согласитесь и предложите купить её вместе в четверг.',
            accepted: [A('perfect! wanna go get it together on thursday?', 98), A("love it. let's buy it together on thursday", 98), A('Great idea, we can buy it on Thursday.', 94)],
            keywords: ['thursday'],
            distractors: [],
            better: "perfect! let's go get it together on thursday 🛍️", betterRu: 'Идеально! Давай купим вместе в четверг 🛍️',
            explain: 'go get — «сходить купить» (разговорное).' } },
        end: { them: ['it’s a date 😘'], ru: ['Договорились — это свидание 😘'], end: true }
      }
    },

    /* ================= Sarah — коллега ================= */
    {
      id: 'sarah-3', contactId: 'sarah', order: 3, level: 'B1', title: 'Обед с командой',
      intro: 'Сара организует командный обед.', learn: ['Let me check.', "I'm allergic to", 'Sounds good!', 'Let me know.'],
      start: 'a',
      nodes: {
        a: { them: ['Hi! We are planning a team lunch on Thursday to welcome the new designer.', 'Are you free around 12:30?'], ru: ['Привет! Планируем командный обед в четверг, чтобы поприветствовать нового дизайнера.', 'Ты свободен около 12:30?'], next: 'b',
          reply: { intent: 'Скажите, что проверите календарь, и потом — что свободны.',
            accepted: [A('Let me check… Yes, I am free at 12:30. Count me in!', 98), A("Just checked — I'm free. Sounds good!", 98), A('Yes, I am free then. Great idea!', 95)],
            keywords: ['free|available|count me in|works'],
            distractors: [X('ya im free lol', 30, 'С коллегой без ya и lol — пишите полными словами.')],
            better: 'Let me check… Yes, I am free at 12:30. Count me in!', betterRu: 'Сейчас посмотрю… Да, в 12:30 свободен. Я в деле!',
            explain: 'Let me check — «сейчас проверю». Рабочий чат: дружелюбно, но без сленга.' } },
        b: { them: ['Great! We are thinking of the Thai place across the street.', 'Any dietary requirements?'], ru: ['Отлично! Думаем про тайское кафе через дорогу.', 'Есть ограничения в еде?'], next: 'c',
          reply: { intent: 'Скажите, что у вас аллергия на арахис.',
            accepted: [A("I'm allergic to peanuts, so I'll need to check the menu.", 98), A('Just one thing — I am allergic to peanuts.', 97), A('I have a peanut allergy, but otherwise anything is fine.', 97)],
            keywords: ['peanut|peanuts|nut|nuts'],
            distractors: [],
            better: "Just one thing — I'm allergic to peanuts.", betterRu: 'Только одно — у меня аллергия на арахис.',
            explain: 'dietary requirements — ограничения в питании. I\'m allergic to… — у меня аллергия на…', learn: ["I'm allergic to"] } },
        c: { them: ['Thanks for letting me know! I will mention it when I book.'], ru: ['Спасибо, что сказал! Предупрежу при бронировании.'], next: 'end',
          reply: { intent: 'Поблагодарите и предложите помощь с организацией.',
            accepted: [A('Thank you! Let me know if you need any help organising it.', 98), A('Thanks, Sarah! Happy to help if you need anything.', 97), A('Thank you. Tell me if I can help.', 94)],
            keywords: ['thank|thanks', 'help'],
            distractors: [X('thx!! ur the best', 30, 'С коллегой без thx и ur.')],
            better: 'Thank you! Let me know if you need any help organising it.', betterRu: 'Спасибо! Скажи, если нужна помощь с организацией.',
            explain: 'Let me know if… — «дай знать, если…».' } },
        end: { them: ['Will do! 😊'], ru: ['Обязательно! 😊'], end: true }
      }
    },
    {
      id: 'sarah-4', contactId: 'sarah', order: 4, level: 'B2', title: 'Ошибка в отчёте',
      intro: 'Сара заметила ошибку в вашем отчёте.', learn: ['My bad.', 'I\'ll look into it.', 'No harm done.'],
      start: 'a',
      nodes: {
        a: { them: ['Hey, quick heads-up: I think the sales figures in section 3 are from last quarter, not this one.'], ru: ['Привет, быстрое предупреждение: кажется, цифры продаж в разделе 3 за прошлый квартал, а не за этот.'], next: 'b',
          reply: { intent: 'Поблагодарите и признайте ошибку.',
            accepted: [A('Oh no, you are right — my bad! Thanks for catching that.', 98), A("Good catch, thank you! That's my mistake.", 98), A('Thanks for letting me know. I must have used the old file.', 97)],
            keywords: ['thank|thanks|catch', 'mistake|bad|right|old|wrong'],
            distractors: [X('No, the figures are correct.', 25, 'Сначала проверьте — Сара, похоже, права.')],
            better: 'Good catch, thank you! My bad — I must have used the old file.', betterRu: 'Хорошо заметила, спасибо! Моя ошибка — видимо, взял старый файл.',
            explain: 'heads-up — предупреждение. Good catch! — «хорошо заметила!». My bad — «моя вина» (неформально, но уместно с коллегой).' } },
        b: { them: ['No worries! The report goes to the director at 3 pm though.'], ru: ['Ничего страшного! Но отчёт уходит директору в 15:00.'], next: 'c',
          reply: { intent: 'Скажите, что исправите в течение часа.',
            accepted: [A("I'll fix it within the hour.", 98), A('I will update it right away — it will be ready well before 3.', 98), A("I'll look into it now and send the updated version by 2.", 97)],
            keywords: ['fix|update|correct|change|look into|send', 'hour|now|right away|2|two|before'],
            distractors: [X('ok ill do it l8r', 20, 'Сленг и «позже» при жёстком дедлайне — плохое сочетание.')],
            better: "I'll fix it right away and send you the updated version by 2.", betterRu: 'Сейчас же исправлю и пришлю обновлённую версию к двум.',
            explain: 'right away — «сразу же». within the hour — «в течение часа».' } },
        c: { them: ['Perfect, thanks!'], ru: ['Отлично, спасибо!'], next: 'end',
          reply: { intent: 'Поблагодарите ещё раз и предложите угостить кофе.',
            accepted: [A('Thank you again — I owe you a coffee!', 98), A('Really appreciate it. Coffee is on me!', 98), A('Thanks, Sarah. Let me buy you a coffee later.', 96)],
            keywords: ['coffee|lunch|drink'],
            distractors: [],
            better: 'Thank you again — I owe you a coffee! ☕', betterRu: 'Ещё раз спасибо — с меня кофе! ☕',
            explain: 'I owe you one / I owe you a coffee — «я твой должник».' } },
        end: { them: ['Haha deal ☕'], ru: ['Ха-ха, договорились ☕'], end: true }
      }
    },

    /* ================= Priya — руководитель ================= */
    {
      id: 'priya-3', contactId: 'priya', order: 3, level: 'B2', title: 'Статус проекта',
      intro: 'Прия спрашивает о ходе проекта.', learn: ['What\'s the status on', 'on the same page', 'a tight schedule', 'Keep me posted.'],
      start: 'a',
      nodes: {
        a: { them: ['Hi. Quick question: what is the status on the website redesign?'], ru: ['Привет. Быстрый вопрос: как дела с редизайном сайта?'], next: 'b',
          reply: { intent: 'Скажите, что всё идёт по плану, дизайн готов на 80%.',
            accepted: [A("Hi Priya, it's on track. The design is about 80% done.", 98), A('We are on schedule — the design is roughly 80 percent complete.', 97), A("Everything is going to plan. We've finished about 80% of the design.", 97)],
            keywords: ['80|eighty', 'track|schedule|plan|done|complete|finished'],
            distractors: [X('its ok i think', 25, 'Руководителю — конкретику, без сленга.')],
            better: "Hi Priya, it's on track — the design is about 80% done.", betterRu: 'Привет, Прия, всё по плану — дизайн готов примерно на 80%.',
            explain: 'on track / on schedule — «по плану». Руководителю — коротко и с цифрами.' } },
        b: { them: ['Good. Any risks I should know about?'], ru: ['Хорошо. Есть риски, о которых мне стоит знать?'], next: 'c',
          reply: { intent: 'Скажите, что есть риск задержки из-за текстов от маркетинга.',
            accepted: [A("One risk: we're still waiting for the texts from marketing, which could delay the launch.", 98), A('The main risk is that marketing has not sent the content yet, so we might be delayed.', 97), A('We are waiting for marketing texts. That could cause a delay.', 95)],
            keywords: ['marketing', 'delay|late|waiting|behind'],
            distractors: [X('No risks, all perfect!', 30, 'Скрывать риски от руководителя — плохая практика.')],
            better: "One risk: we're still waiting for texts from marketing, which could delay the launch.", betterRu: 'Один риск: всё ещё ждём тексты от маркетинга — это может задержать запуск.',
            explain: 'Называйте риск и последствия заранее — это ценится.' } },
        c: { them: ['Understood. I will speak to their team lead today.', 'Keep me posted.'], ru: ['Поняла. Сегодня поговорю с их руководителем.', 'Держи меня в курсе.'], next: 'end',
          reply: { intent: 'Поблагодарите и пообещайте прислать обновление в пятницу.',
            accepted: [A("Thank you, that would really help. I'll send you an update on Friday.", 98), A('Thanks, Priya. I will update you on Friday.', 97), A('Great, thank you. Expect an update from me on Friday.', 96)],
            keywords: ['thank|thanks', 'friday'],
            distractors: [X('k thx', 10, 'Руководителю — полными словами.')],
            better: "Thank you, that would really help. I'll send you an update on Friday.", betterRu: 'Спасибо, это очень поможет. Пришлю новости в пятницу.',
            explain: 'Keep me posted — «держи в курсе». Ответ — с конкретным сроком.' } },
        end: { them: ['Thanks.'], ru: ['Спасибо.'], end: true }
      }
    },
    {
      id: 'priya-4', contactId: 'priya', order: 4, level: 'C1', title: 'Просьба о повышении',
      intro: 'Вы хотите обсудить с Прией карьерный рост.', learn: ['Do you have a minute?', "I'd like to hear your thoughts.", 'bring to the table', 'touch base'],
      start: 'a',
      nodes: {
        a: { them: ['Hi, you wanted to discuss something?'], ru: ['Привет, ты хотел что-то обсудить?'], next: 'b',
          reply: { intent: 'Скажите, что хотели бы обсудить возможность роста до старшего специалиста.',
            accepted: [A("Yes, thanks. I'd like to talk about the possibility of moving into a senior role.", 98), A("I'd like to discuss my career development — specifically a senior position.", 97), A('Yes — I was hoping we could talk about a promotion to senior level.', 97)],
            keywords: ['senior|promotion|career|grow|growth|development'],
            distractors: [X('i want more money', 15, 'Прямо, в чатовом стиле и без аргументов.')],
            better: "Yes, thanks. I'd like to talk about the possibility of moving into a senior role.", betterRu: 'Да, спасибо. Хотел бы обсудить возможность перехода на старшую позицию.',
            explain: 'Формулируйте через развитие и возможности, а не через требования.' } },
        b: { them: ['Sure. What do you think makes you ready for it?'], ru: ['Конечно. Почему ты считаешь, что готов?'], next: 'c',
          reply: { intent: 'Приведите аргумент: за год вы провели три проекта и наставляете двух новичков.',
            accepted: [A("Over the past year I've led three projects and I've been mentoring two new team members.", 98), A('I have led three projects this year and I am currently mentoring two junior colleagues.', 97), A('This year I delivered three projects as lead and I mentor two newcomers.', 96)],
            keywords: ['three|3', 'project|projects', 'mentor|mentoring|junior|new'],
            distractors: [X('Because I work a lot.', 30, 'Количество часов — слабый аргумент. Говорите о результатах.')],
            better: "Over the past year I've led three projects and I've been mentoring two new team members.", betterRu: 'За прошлый год я руководил тремя проектами и наставляю двух новых сотрудников.',
            explain: 'Аргументы — факты и результаты. Present Perfect Continuous — для того, что продолжается.' } },
        c: { them: ['That is fair. Let me talk to HR about the budget.', 'Let us touch base again next week.'], ru: ['Справедливо. Поговорю с HR о бюджете.', 'Вернёмся к разговору на следующей неделе.'], next: 'end',
          reply: { intent: 'Поблагодарите и подтвердите встречу на следующей неделе.',
            accepted: [A("Thank you, I really appreciate your support. Next week works for me.", 98), A('Thanks, Priya. Looking forward to our chat next week.', 97), A('Thank you for considering it. Speak next week!', 95)],
            keywords: ['thank|thanks|appreciate', 'next week|week'],
            distractors: [],
            better: "Thank you, I really appreciate your support. Next week works for me.", betterRu: 'Спасибо, очень ценю вашу поддержку. Следующая неделя мне подходит.',
            explain: 'touch base — «созвониться, вернуться к вопросу».' } },
        end: { them: ['Good. Talk soon.'], ru: ['Хорошо. На связи.'], end: true }
      }
    },

    /* ================= Mr. Davis — арендодатель ================= */
    {
      id: 'davis-3', contactId: 'davis', order: 3, level: 'B2', title: 'Плановый осмотр',
      intro: 'Арендодатель хочет провести осмотр квартиры.', learn: ['Would it be possible to', 'What time works for you?', "I'd appreciate it if", 'Just to clarify'],
      start: 'a',
      nodes: {
        a: { them: ['Good afternoon. I would like to carry out the annual inspection of the apartment.', 'Would Tuesday at 10 a.m. be convenient?'], ru: ['Добрый день. Хотел бы провести ежегодный осмотр квартиры.', 'Вам удобно во вторник в 10 утра?'], next: 'b',
          reply: { intent: 'Вежливо скажите, что во вторник не можете, и предложите четверг после обеда.',
            accepted: [A("Good afternoon, Mr. Davis. Unfortunately, I am not available on Tuesday. Would Thursday afternoon be possible?", 98), A("I'm afraid Tuesday doesn't suit me. Would Thursday afternoon work for you?", 97), A('Thank you for letting me know. Could we arrange it for Thursday afternoon instead?', 97)],
            keywords: ['thursday'],
            distractors: [X('tues is bad, thurs?', 15, 'Сокращения и чатовый стиль неуместны с арендодателем.')],
            better: 'Good afternoon, Mr. Davis. Unfortunately, I am not available on Tuesday. Would Thursday afternoon be possible?', betterRu: 'Добрый день, мистер Дэвис. К сожалению, во вторник я занят. Возможно ли в четверг после обеда?',
            explain: 'Unfortunately / I\'m afraid — смягчают отказ. Would … be possible? — формальная вежливость.' } },
        b: { them: ['Thursday at 3 p.m. is fine.', 'The inspection usually takes about thirty minutes.'], ru: ['Четверг в 15:00 подходит.', 'Осмотр обычно занимает около тридцати минут.'], next: 'c',
          reply: { intent: 'Подтвердите и уточните, нужно ли вам присутствовать.',
            accepted: [A('That is perfect, thank you. Just to clarify, do I need to be present?', 98), A("Thursday at 3 works for me. Will I need to be at home during the inspection?", 97), A('Great, thank you. Should I be there during the inspection?', 96)],
            keywords: ['present|there|home|be at'],
            distractors: [],
            better: 'That is perfect, thank you. Just to clarify, do I need to be present?', betterRu: 'Прекрасно, спасибо. Уточню: мне нужно присутствовать?',
            explain: 'Just to clarify — вежливое уточнение.' } },
        c: { them: ['It is not necessary, but you are welcome to be there.'], ru: ['Не обязательно, но вы можете присутствовать.'], next: 'end',
          reply: { intent: 'Скажите, что будете дома, и поблагодарите.',
            accepted: [A('I will be at home then. Thank you, and see you on Thursday.', 98), A("I'll make sure to be there. Thank you for arranging it.", 97), A('In that case, I will be present. Thank you, Mr. Davis.', 96)],
            keywords: ['thank|thanks'],
            distractors: [X('ok cu thurs', 10, 'Слишком фамильярно.')],
            better: 'I will be at home then. Thank you, and see you on Thursday.', betterRu: 'Тогда я буду дома. Спасибо, до четверга.',
            explain: 'Формальная переписка — полные формы и благодарность.' } },
        end: { them: ['Thank you. Until Thursday.'], ru: ['Спасибо. До четверга.'], end: true }
      }
    },
    {
      id: 'davis-4', contactId: 'davis', order: 4, level: 'C1', title: 'Возврат залога',
      intro: 'Вы съехали, но залог до сих пор не вернули.', learn: ['I was wondering if', "I'd appreciate it if", 'I apologize for the inconvenience.', "I'd like to escalate this."],
      start: 'a',
      nodes: {
        a: { them: ['Good morning. I hope you have settled into your new home.'], ru: ['Доброе утро. Надеюсь, вы обустроились на новом месте.'], next: 'b',
          reply: { intent: 'Поблагодарите и вежливо напомните, что залог не вернули уже три недели.',
            accepted: [A("Good morning, Mr. Davis, thank you. I was wondering if there is any update on the deposit — it has been three weeks since I moved out.", 98), A('Thank you, I have. I just wanted to follow up on my deposit, as it has now been three weeks.', 97), A("Thank you. I'd appreciate an update on the deposit return, as three weeks have passed.", 96)],
            keywords: ['deposit', 'three weeks|3 weeks|weeks'],
            distractors: [X('where is my money??', 5, 'Агрессивно и неформально.')],
            better: 'Good morning, Mr. Davis, thank you. I was wondering if there is any update on the deposit — it has been three weeks since I moved out.', betterRu: 'Доброе утро, мистер Дэвис, спасибо. Хотел узнать, есть ли новости по залогу — прошло три недели с моего выезда.',
            explain: 'I was wondering if… / follow up on — вежливое напоминание.' } },
        b: { them: ['I apologise for the delay. I intend to deduct 150 pounds for a stain on the carpet.'], ru: ['Прошу прощения за задержку. Я намерен удержать 150 фунтов за пятно на ковре.'], next: 'c',
          reply: { intent: 'Вежливо возразите: пятно было при заселении, это есть в акте.',
            accepted: [A('With respect, that stain was already there when I moved in. It is noted in the check-in inventory.', 98), A("I'm afraid I must disagree — the stain was recorded in the inventory when I moved in.", 97), A('I believe that stain was present before my tenancy; it is listed in the move-in report.', 96)],
            keywords: ['already|before|moved in|move in|check in', 'inventory|report|record|recorded|listed|noted|photo|photos'],
            distractors: [X('That is not true, you are lying.', 10, 'Обвинение во лжи — не аргумент.')],
            better: 'With respect, that stain was already there when I moved in. It is noted in the check-in inventory.', betterRu: 'При всём уважении, пятно было уже при моём заселении. Это отмечено в акте приёма.',
            explain: 'With respect / I\'m afraid I must disagree — вежливое, но твёрдое несогласие + факт.' } },
        c: { them: ['I have checked the inventory. You are correct.', 'I will return the full deposit by Friday.'], ru: ['Я проверил акт. Вы правы.', 'Верну залог полностью до пятницы.'], next: 'end',
          reply: { intent: 'Поблагодарите за оперативность.',
            accepted: [A('Thank you for checking so quickly, Mr. Davis. I appreciate it.', 98), A('Thank you very much for resolving this. I really appreciate it.', 97), A('Many thanks for your understanding.', 95)],
            keywords: ['thank|thanks|appreciate'],
            distractors: [X('finally lol', 5, 'Неуместно и невежливо.')],
            better: 'Thank you for checking so quickly, Mr. Davis. I appreciate it.', betterRu: 'Спасибо, что так быстро проверили, мистер Дэвис. Очень признателен.',
            explain: 'Даже после спора завершайте вежливо — репутация арендатора важна.' } },
        end: { them: ['You are welcome. I wish you all the best.'], ru: ['Пожалуйста. Всего наилучшего.'], end: true }
      }
    },

    /* ================= Mia — сестра (новый контакт) ================= */
    {
      id: 'mia-1', contactId: 'mia', order: 1, level: 'A2', title: 'Привет из Лондона',
      intro: 'Сестра Миа пишет из Лондона.', learn: ['How have you been?', 'Long time no see!', 'Take care!', 'What\'s up?'],
      start: 'a',
      nodes: {
        a: { them: ['Hiii! 👋', 'How are you? I miss you!'], ru: ['Приве-е-ет! 👋', 'Как ты? Скучаю!'], next: 'b',
          reply: { intent: 'Скажите, что всё хорошо, тоже скучаете, и спросите, как Лондон.',
            accepted: [A("I'm good! Miss you too! How's London?", 98), A("Hey! All good here, I miss you too. How is London?", 98), A("Hi! I'm fine, miss you too 😊 How's life in London?", 97)],
            keywords: ['miss', 'london'],
            distractors: [X('I am fine. And you?', 50, 'Правильно, но вы не ответили на «I miss you» и не спросили про Лондон.')],
            better: "I'm good! Miss you too! How's London? 😊", betterRu: 'У меня всё хорошо! Тоже скучаю! Как Лондон? 😊',
            explain: 'Miss you too! — «тоже скучаю!».' } },
        b: { them: ["It's amazing but SO expensive 😅", 'A coffee costs like 4 pounds!'], ru: ['Потрясающе, но ТАК дорого 😅', 'Кофе стоит где-то 4 фунта!'], next: 'c',
          reply: { intent: 'Пошутите, что тогда пора научиться варить кофе дома.',
            accepted: [A('Haha, time to make coffee at home then!', 98), A('Wow! Maybe buy a coffee machine 😂', 97), A("Ha, you'll have to make your own coffee!", 96)],
            keywords: ['home|machine|own|make'],
            distractors: [],
            better: 'Haha, time to make coffee at home then! ☕', betterRu: 'Ха-ха, значит, пора варить кофе дома! ☕',
            explain: 'time to… then — «значит, пора…».' } },
        c: { them: ['Lol true 😂', 'Are you coming to visit in December?'], ru: ['Лол, правда 😂', 'Приедешь в гости в декабре?'], next: 'end',
          reply: { intent: 'Скажите, что очень хотите и посмотрите билеты.',
            accepted: [A("I'd love to! I'll check the tickets this week.", 98), A('Yes, I really want to! Let me check flights.', 97), A('Definitely! I will look at tickets.', 95)],
            keywords: ['ticket|tickets|flight|flights|check|look'],
            distractors: [],
            better: "I'd love to! I'll check the tickets this week ✈️", betterRu: 'Очень хочу! На этой неделе посмотрю билеты ✈️',
            explain: 'I\'d love to — «с удовольствием». check flights — посмотреть рейсы.' } },
        end: { them: ['Yaaay 🥳 Keep me posted!'], ru: ['Ура-а-а 🥳 Держи в курсе!'], end: true }
      }
    },
    {
      id: 'mia-2', contactId: 'mia', order: 2, level: 'B1', title: 'Экзамены',
      intro: 'У Мии сессия, и она переживает.', learn: ['Don\'t worry about it.', 'Good for you!', 'I\'m so happy for you!'],
      start: 'a',
      nodes: {
        a: { them: ['I have three exams next week 😫', "I'm so stressed, I can't sleep"], ru: ['На следующей неделе три экзамена 😫', 'Такой стресс, не могу спать'], next: 'b',
          reply: { intent: 'Поддержите её и напомните, что она всегда хорошо сдаёт.',
            accepted: [A("Oh no 😕 You always do well, you'll be fine!", 98), A("Don't worry, you always pass with great marks!", 97), A("You've got this! You always do great in exams.", 97)],
            keywords: ['always|fine|got this|great|well|pass'],
            distractors: [X('Exams are easy.', 30, 'Обесценивает её переживания.')],
            better: "You've got this! You always do great in exams 💪", betterRu: 'Ты справишься! Ты всегда отлично сдаёшь 💪',
            explain: 'You\'ve got this! — «ты справишься!».' } },
        b: { them: ['Thanks 🥺 Any tips for studying?'], ru: ['Спасибо 🥺 Есть советы, как учиться?'], next: 'c',
          reply: { intent: 'Посоветуйте делать перерывы каждый час и высыпаться.',
            accepted: [A('Take a short break every hour and get enough sleep!', 98), A('Study in short blocks with breaks, and please sleep at least 7 hours.', 97), A('Try taking breaks every hour, and go to bed early.', 96)],
            keywords: ['break|breaks', 'sleep|bed|rest'],
            distractors: [],
            better: 'Take a short break every hour and get enough sleep! 😴', betterRu: 'Делай короткий перерыв каждый час и высыпайся! 😴',
            explain: 'get enough sleep — «высыпаться».' } },
        c: { them: ['Okay I will try 😅 Wish me luck!'], ru: ['Ладно, попробую 😅 Пожелай мне удачи!'], next: 'end',
          reply: { intent: 'Пожелайте удачи.',
            accepted: [A('Good luck! You can do it! 🍀', 98), A("Fingers crossed for you! 🤞", 98), A('Break a leg! 💪', 95)],
            keywords: ['luck|fingers crossed|break a leg|can do it'],
            distractors: [],
            better: "Good luck! Fingers crossed for you 🤞", betterRu: 'Удачи! Держу за тебя кулачки 🤞',
            explain: 'Fingers crossed — «держу кулачки». Break a leg — «ни пуха ни пера».' } },
        end: { them: ['Love you! ❤️'], ru: ['Люблю тебя! ❤️'], end: true }
      }
    },
    {
      id: 'mia-3', contactId: 'mia', order: 3, level: 'B1', title: 'Отличные новости',
      intro: 'У Мии результаты экзаменов.', learn: ['Congratulations!', "I'm so happy for you!", 'Good for you!', 'No way!'],
      start: 'a',
      nodes: {
        a: { them: ['GUESS WHAT', 'I passed everything!! And got an A in economics 😭🎉'], ru: ['УГАДАЙ ЧТО', 'Я всё сдала!! И пятёрку по экономике 😭🎉'], next: 'b',
          reply: { intent: 'Поздравьте её с энтузиазмом.',
            accepted: [A("No way!! Congratulations, I'm so proud of you! 🎉", 98), A("That's amazing!! I'm so happy for you!", 98), A('Congrats!!! I knew you could do it!', 97)],
            keywords: ['congrat|congrats|congratulations|proud|amazing|happy for|knew'],
            distractors: [X('Good.', 30, 'Слишком сдержанно для такой новости!')],
            better: "No way!! Congratulations, I'm so proud of you! 🎉", betterRu: 'Не может быть!! Поздравляю, я так тобой горжусь! 🎉',
            explain: 'I\'m so proud of you! — «я так тобой горжусь!».' } },
        b: { them: ['Thank youuu 🥹', "Now I can finally relax. I'm thinking of a trip to Scotland!"], ru: ['Спасибо-о-о 🥹', 'Теперь наконец можно расслабиться. Думаю о поездке в Шотландию!'], next: 'c',
          reply: { intent: 'Скажите, что это отличная идея, и спросите, с кем она поедет.',
            accepted: [A('Great idea! Who are you going with?', 98), A('You deserve it! Are you going alone or with friends?', 98), A("Sounds amazing! Who's going with you?", 97)],
            keywords: ['who|alone|with'],
            distractors: [],
            better: 'You deserve it! Who are you going with?', betterRu: 'Ты заслужила! С кем поедешь?',
            explain: 'You deserve it — «ты это заслужила».' } },
        c: { them: ['With my flatmates 😊 We found cheap train tickets.'], ru: ['С соседками 😊 Нашли дешёвые билеты на поезд.'], next: 'end',
          reply: { intent: 'Пожелайте хорошей поездки и попросите прислать фото.',
            accepted: [A('Have an amazing trip and send me lots of photos!', 98), A('Enjoy it! Send pics 📸', 97), A('Have fun, and send me photos!', 96)],
            keywords: ['photo|photos|pics|pictures'],
            distractors: [],
            better: 'Have an amazing trip and send me lots of photos! 📸', betterRu: 'Отличной поездки, и присылай побольше фото! 📸',
            explain: 'pics = pictures (разговорное).' } },
        end: { them: ['Of course!! 🏴󠁧󠁢󠁳󠁣󠁴󠁿💕'], ru: ['Конечно!! 🏴󠁧󠁢󠁳󠁣󠁴󠁿💕'], end: true }
      }
    },

    /* ================= Laura Bennett — рекрутер (новый контакт) ================= */
    {
      id: 'laura-1', contactId: 'laura', order: 1, level: 'B2', title: 'Предложение о вакансии',
      intro: 'С вами связывается рекрутер.', learn: ['I\'d like to hear your thoughts.', 'I work in', 'What time works for you?', 'looking forward to'],
      start: 'a',
      nodes: {
        a: { them: ['Dear candidate, my name is Laura Bennett, a recruiter at Nordwave.', 'I came across your profile and believe you could be a great fit for our Project Manager role. Would you be interested in learning more?'], ru: ['Уважаемый кандидат, меня зовут Лора Беннетт, я рекрутер Nordwave.', 'Я увидела ваш профиль и думаю, что вы отлично подходите на роль проектного менеджера. Хотели бы узнать подробнее?'], next: 'b',
          reply: { intent: 'Поблагодарите и скажите, что вам интересно узнать больше.',
            accepted: [A('Dear Laura, thank you for reaching out. I would be very interested in learning more about the role.', 98), A('Thank you for contacting me. Yes, I would be happy to hear more about the position.', 97), A('Hello Laura, thank you for your message. I am interested and would like more details.', 97)],
            keywords: ['thank|thanks', 'interest|interested|more|details|hear'],
            distractors: [X('sure, tell me more lol', 10, 'Для рекрутера — деловой стиль, без lol.')],
            better: 'Dear Laura, thank you for reaching out. I would be very interested in learning more about the role.', betterRu: 'Уважаемая Лора, спасибо, что связались со мной. Мне было бы очень интересно узнать о роли подробнее.',
            explain: 'reach out — «связаться». В деловой переписке — обращение и благодарность.' } },
        b: { them: ['Wonderful. The role is fully remote with occasional travel to Berlin.', 'Could you tell me about your current position?'], ru: ['Прекрасно. Работа полностью удалённая, с редкими поездками в Берлин.', 'Расскажете о вашей текущей должности?'], next: 'c',
          reply: { intent: 'Скажите, что вы работаете проектным менеджером в IT-компании пять лет.',
            accepted: [A('I currently work as a project manager at an IT company, where I have been for five years.', 98), A("I've been working as a project manager in IT for the past five years.", 98), A('I am a project manager at a software company and have five years of experience.', 97)],
            keywords: ['project manager|manager', 'five|5'],
            distractors: [X('i manage projects', 30, 'Слишком кратко и неформально.')],
            better: "I've been working as a project manager in IT for the past five years.", betterRu: 'Последние пять лет я работаю проектным менеджером в IT.',
            explain: 'Present Perfect Continuous — для опыта, который продолжается.' } },
        c: { them: ['That sounds excellent. Would you be available for a short call on Wednesday?'], ru: ['Звучит отлично. Могли бы вы созвониться в среду?'], next: 'end',
          reply: { intent: 'Согласитесь и предложите 11 утра.',
            accepted: [A('Yes, Wednesday suits me. Would 11 a.m. work for you?', 98), A('Certainly. I am available on Wednesday at 11 a.m., if that is convenient.', 97), A('Wednesday is fine. How about 11 in the morning?', 96)],
            keywords: ['11|eleven'],
            distractors: [X('wed 11 ok?', 15, 'Сокращения неуместны в деловой переписке.')],
            better: 'Yes, Wednesday suits me. Would 11 a.m. work for you?', betterRu: 'Да, среда подходит. Вам удобно в 11 утра?',
            explain: 'suits me / works for you — «подходит». Формальный стиль — полные слова.' } },
        end: { them: ['Perfect. I will send a calendar invitation shortly. Kind regards, Laura.'], ru: ['Отлично. Скоро пришлю приглашение в календарь. С уважением, Лора.'], end: true }
      }
    },
    {
      id: 'laura-2', contactId: 'laura', order: 2, level: 'C1', title: 'Перенос собеседования',
      intro: 'Вам нужно перенести собеседование.', learn: ['Can we reschedule?', 'Something came up.', 'I apologize for the inconvenience.'],
      start: 'a',
      nodes: {
        a: { them: ['Dear candidate, just a reminder about your interview with our Head of Delivery tomorrow at 2 p.m.'], ru: ['Уважаемый кандидат, напоминаю о собеседовании с руководителем направления завтра в 14:00.'], next: 'b',
          reply: { intent: 'Извинитесь и попросите перенести из-за срочной ситуации на работе.',
            accepted: [A('Dear Laura, thank you for the reminder. Unfortunately, an urgent issue has come up at work. Would it be possible to reschedule?', 98), A('I apologise for the short notice, but something urgent has come up. Could we possibly reschedule the interview?', 98), A('Thank you, Laura. I am very sorry, but I need to ask if we could move the interview due to an urgent matter at work.', 96)],
            keywords: ['reschedule|move|another time|postpone|different time'],
            distractors: [X('cant make it tmrw sorry', 10, 'Сокращения и небрежность — плохое впечатление на рекрутера.')],
            better: 'Dear Laura, thank you for the reminder. I apologise for the short notice, but an urgent issue has come up at work. Would it be possible to reschedule?', betterRu: 'Уважаемая Лора, спасибо за напоминание. Прошу прощения за поздний запрос, но на работе возникла срочная ситуация. Можно ли перенести собеседование?',
            explain: 'short notice — «в последний момент». come up — «возникнуть».' } },
        b: { them: ['I understand. The next available slots are Thursday at 10 a.m. or Friday at 4 p.m.'], ru: ['Понимаю. Ближайшие свободные окна — четверг в 10:00 или пятница в 16:00.'], next: 'c',
          reply: { intent: 'Выберите пятницу в 16:00 и поблагодарите за гибкость.',
            accepted: [A('Friday at 4 p.m. would be ideal. Thank you for your flexibility.', 98), A('I would prefer Friday at 4 p.m., if possible. I really appreciate your understanding.', 97), A('Friday at 4 works perfectly. Thank you for accommodating me.', 97)],
            keywords: ['friday'],
            distractors: [],
            better: 'Friday at 4 p.m. would be ideal. Thank you for your flexibility.', betterRu: 'Пятница в 16:00 — идеально. Спасибо за гибкость.',
            explain: 'Thank you for your flexibility / for accommodating me — благодарность за уступку.' } },
        c: { them: ['Done. I have updated the invitation.'], ru: ['Готово. Я обновила приглашение.'], next: 'end',
          reply: { intent: 'Поблагодарите и скажите, что с нетерпением ждёте разговора.',
            accepted: [A('Thank you, Laura. I look forward to speaking with the team on Friday.', 98), A("Many thanks. I'm looking forward to the interview.", 97), A('Thank you very much. I look forward to it.', 96)],
            keywords: ['thank|thanks', 'look forward|looking forward'],
            distractors: [],
            better: 'Thank you, Laura. I look forward to speaking with the team on Friday.', betterRu: 'Спасибо, Лора. С нетерпением жду разговора с командой в пятницу.',
            explain: 'I look forward to + -ing — стандартное деловое завершение.', learn: ['looking forward to'] } },
        end: { them: ['Good luck! Kind regards, Laura.'], ru: ['Удачи! С уважением, Лора.'], end: true }
      }
    },
    {
      id: 'laura-3', contactId: 'laura', order: 3, level: 'C1', title: 'Оффер',
      intro: 'Рекрутер сообщает результат собеседования.', learn: ['That\'s great!', 'Having said that', 'Would it be possible to', 'I\'d like to hear your thoughts.'],
      start: 'a',
      nodes: {
        a: { them: ['Dear candidate, I am delighted to inform you that the team would like to offer you the position.'], ru: ['Уважаемый кандидат, рада сообщить, что команда хотела бы предложить вам должность.'], next: 'b',
          reply: { intent: 'Поблагодарите и выразите радость, но попросите прислать детали оффера письменно.',
            accepted: [A('Thank you so much, that is wonderful news! Could you please send me the details of the offer in writing?', 98), A("I'm delighted to hear that, thank you! Would it be possible to receive the full offer in writing?", 98), A('That is great news, thank you. I would appreciate it if you could send the offer details by email.', 97)],
            keywords: ['thank|thanks', 'writing|written|email|details|document'],
            distractors: [X('yay!! when do i start', 15, 'Слишком неформально и поспешно.')],
            better: "Thank you so much — that is wonderful news! Would it be possible to receive the full offer in writing?", betterRu: 'Огромное спасибо — прекрасная новость! Можно ли получить полный оффер письменно?',
            explain: 'Прежде чем соглашаться, попросите условия письменно — это нормальная деловая практика.' } },
        b: { them: ['Of course, I have just emailed it to you.', 'Please let me know if you have any questions.'], ru: ['Конечно, только что отправила вам на почту.', 'Сообщите, если будут вопросы.'], next: 'c',
          reply: { intent: 'Спросите, возможно ли начать на две недели позже из-за срока уведомления на текущей работе.',
            accepted: [A('Thank you. Would it be possible to start two weeks later, as I need to give notice to my current employer?', 98), A('One question: could the start date be moved back by two weeks due to my notice period?', 98), A('I have a notice period to serve. Would a start date two weeks later be acceptable?', 97)],
            keywords: ['two weeks|2 weeks', 'notice|later|start date|start'],
            distractors: [],
            better: 'Thank you. Would it be possible to start two weeks later, as I need to give notice to my current employer?', betterRu: 'Спасибо. Можно ли выйти на две недели позже — мне нужно отработать уведомление на текущей работе?',
            explain: 'give notice / notice period — уведомление об увольнении и срок отработки.' } },
        c: { them: ['That will not be a problem. We look forward to welcoming you to Nordwave!'], ru: ['Это не проблема. С нетерпением ждём вас в Nordwave!'], next: 'end',
          reply: { intent: 'Официально примите предложение и поблагодарите за помощь в процессе.',
            accepted: [A('Wonderful. I am happy to formally accept the offer. Thank you for all your help throughout the process.', 98), A('In that case, I gladly accept the offer. Many thanks for your support, Laura.', 97), A('Excellent, I accept. Thank you very much for your help.', 95)],
            keywords: ['accept', 'thank|thanks'],
            distractors: [],
            better: 'Wonderful. I am happy to formally accept the offer. Thank you for all your help throughout the process.', betterRu: 'Прекрасно. С радостью официально принимаю предложение. Спасибо за помощь на всех этапах.',
            explain: 'formally accept — официально принять. throughout the process — на протяжении всего процесса.' } },
        end: { them: ['Congratulations and welcome aboard! Kind regards, Laura.'], ru: ['Поздравляю и добро пожаловать в команду! С уважением, Лора.'], end: true }
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
