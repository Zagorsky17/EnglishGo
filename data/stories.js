/* data/stories.js — полные диалоги для чтения + вопросы на понимание (на русском).
   kind: 'talk' — устный диалог, 'chat' — переписка в мессенджере (со сленгом).
   Вопрос: {q, options, answer — индекс правильного варианта, explain}. Для «верно/неверно» options = TF. */
(function (EG) {
  'use strict';

  var D = EG.data = EG.data || {};
  var TF = ['Верно', 'Неверно'];
  function L(who, en, ru) { return { who: who, en: en, ru: ru }; }
  function Q(q, options, answer, explain) { return { q: q, options: options, answer: answer, explain: explain || '' }; }

  D.stories = [
    /* ================= A1 ================= */
    {
      id: 'st-cafe-friends', level: 'A1', topic: 'cafe', kind: 'talk', title: 'Кофе с подругой',
      setting: 'Tom and Lisa meet at a café after work.', settingRu: 'Том и Лиза встречаются в кафе после работы.',
      lines: [
        L('Tom', "Hey Lisa! How's it going?", 'Привет, Лиза! Как дела?'),
        L('Lisa', "Not bad, thanks. A bit tired. You?", 'Неплохо, спасибо. Немного устала. А ты?'),
        L('Tom', "I'm good. What can I get you? It's on me.", 'Хорошо. Что тебе взять? Я угощаю.'),
        L('Lisa', "Aw, thanks! Can I get a hot chocolate?", 'Ой, спасибо! Можно мне горячий шоколад?'),
        L('Tom', "Sure. No coffee today?", 'Конечно. Сегодня без кофе?'),
        L('Lisa', "No, I had three at work. Too much!", 'Нет, я выпила три на работе. Слишком много!'),
        L('Barista', "Hi! What can I get for you?", 'Здравствуйте! Что вам предложить?'),
        L('Tom', "A hot chocolate and a small latte, please.", 'Горячий шоколад и маленький латте, пожалуйста.'),
        L('Barista', "For here or to go?", 'Здесь или с собой?'),
        L('Tom', "For here, thanks.", 'Здесь, спасибо.')
      ],
      questions: [
        Q('Как себя чувствует Лиза?', ['Отлично', 'Немного устала', 'Заболела', 'Злится'], 1, '«A bit tired» — немного устала.'),
        Q('Кто платит за напитки?', ['Лиза', 'Том', 'Каждый за себя', 'Бариста угощает'], 1, '«It\'s on me» — «я угощаю».'),
        Q('Почему Лиза не берёт кофе?', ['Не любит кофе', 'Уже выпила три чашки на работе', 'Кофе закончился', 'Ей нельзя по здоровью'], 1, '«I had three at work. Too much!»'),
        Q('Они заберут напитки с собой.', TF, 1, '«For here» — они останутся в кафе.'),
        Q('Что заказал себе Том?', ['Горячий шоколад', 'Большой латте', 'Маленький латте', 'Капучино'], 2, '«a small latte» — маленький латте.')
      ],
      learn: ["How's it going?", 'Not bad, thanks.', "It's on me.", 'Can I get', 'For here or to go?']
    },
    {
      id: 'st-chat-movie', level: 'A1', topic: 'texting', kind: 'chat', title: 'Кино сегодня?',
      setting: 'Jake texts his friend Max.', settingRu: 'Джейк пишет другу Максу.',
      lines: [
        L('Jake', 'hey wyd?', 'Привет, что делаешь?'),
        L('Max', 'nm, just got home. u?', 'Ничего особенного, только пришёл домой. А ты?'),
        L('Jake', 'wanna see a movie 2nite?', 'Хочешь сходить в кино сегодня вечером?'),
        L('Max', 'ya sure! what time?', 'Да, конечно! Во сколько?'),
        L('Jake', '8? the new spider-man', 'В 8? Новый «Человек-паук»'),
        L('Max', 'cool. can u get the tickets? ill pay u back', 'Круто. Можешь купить билеты? Я верну деньги'),
        L('Jake', 'np 👍', 'Без проблем 👍'),
        L('Max', 'ty! cya at 7:45 at the cinema', 'Спасибо! Увидимся в 7:45 у кинотеатра')
      ],
      questions: [
        Q('Что значит «wyd?»', ['Где ты?', 'Что делаешь?', 'Почему?', 'Как дела на работе?'], 1, 'wyd = what are you doing.'),
        Q('Макс свободен сегодня вечером.', TF, 0, '«ya sure!» — да, конечно.'),
        Q('Кто купит билеты?', ['Макс', 'Джейк', 'Они купят на месте', 'Никто'], 1, 'Макс просит: «can u get the tickets?» — Джейк отвечает «np».'),
        Q('Во сколько они встречаются у кинотеатра?', ['В 7:45', 'В 8:00', 'В 7:00', 'В 8:45'], 0, '«cya at 7:45 at the cinema».'),
        Q('Что значит «ill pay u back»?', ['Я заплачу за тебя', 'Я верну тебе деньги', 'Я позвоню тебе', 'Я куплю попкорн'], 1, 'pay back — вернуть деньги.'),
        Q('«np» в ответе Джейка значит…', ['не могу', 'без проблем', 'не сейчас', 'новый план'], 1, 'np = no problem.')
      ],
      learn: ['wyd', 'wanna', 'np', 'ty', 'cya', 'u']
    },
    {
      id: 'st-first-day', level: 'A1', topic: 'greetings', kind: 'talk', title: 'Первый день в офисе',
      setting: "It's Anna's first day at a new job.", settingRu: 'Первый день Анны на новой работе.',
      lines: [
        L('Mark', "Hi! You must be Anna. I'm Mark, from the design team.", 'Привет! Ты, должно быть, Анна. Я Марк, из команды дизайна.'),
        L('Anna', 'Hi Mark, nice to meet you!', 'Привет, Марк, приятно познакомиться!'),
        L('Mark', 'Nice to meet you too. Where are you from?', 'Взаимно. Откуда ты?'),
        L('Anna', "I'm from Poland, but I've lived here for two years.", 'Я из Польши, но живу здесь уже два года.'),
        L('Mark', 'Cool. So, this is your desk, next to mine.', 'Круто. Так, это твой стол, рядом с моим.'),
        L('Anna', 'Great! What time is lunch here?', 'Отлично! Во сколько здесь обед?'),
        L('Mark', 'Usually around one. Do you want to join us?', 'Обычно около часа. Хочешь пообедать с нами?'),
        L('Anna', "I'd love to. Thanks!", 'С удовольствием. Спасибо!')
      ],
      questions: [
        Q('В какой команде работает Марк?', ['Продаж', 'Дизайна', 'Бухгалтерии', 'IT'], 1, '«from the design team».'),
        Q('Анна родом из этой страны.', TF, 1, 'Она из Польши, живёт здесь два года.'),
        Q('Где стол Анны?', ['У окна', 'Рядом со столом Марка', 'В другом кабинете', 'На другом этаже'], 1, '«next to mine» — рядом с моим.'),
        Q('Во сколько обычно обед?', ['В 12', 'Около часа', 'В 2', 'Обеда нет'], 1, '«Usually around one».'),
        Q('Как Анна отвечает на приглашение пообедать?', ['Отказывается', 'Говорит «может быть»', 'С радостью соглашается', 'Предлагает другой день'], 2, '«I\'d love to» — с удовольствием.')
      ],
      learn: ['Nice to meet you.', 'Where are you from?', "I'd love to!", 'Do you want to']
    },

    /* ================= A2 ================= */
    {
      id: 'st-hotel-problem', level: 'A2', topic: 'hotel', kind: 'talk', title: 'Проблема в номере',
      setting: 'A guest calls the hotel reception at night.', settingRu: 'Гость ночью звонит на ресепшен.',
      lines: [
        L('Receptionist', 'Front desk, how can I help you?', 'Ресепшен, чем могу помочь?'),
        L('Guest', "Hi, this is room 412. Sorry to bother you, but the air conditioning isn't working.", 'Здравствуйте, это номер 412. Извините за беспокойство, но не работает кондиционер.'),
        L('Receptionist', "I'm sorry about that. I'll send someone up right away.", 'Сожалеем. Сейчас же пришлю кого-нибудь.'),
        L('Guest', 'Thank you. Also, is breakfast included?', 'Спасибо. И ещё — завтрак включён?'),
        L('Receptionist', "Yes, it's from seven to ten in the lobby.", 'Да, с семи до десяти в лобби.'),
        L('Guest', 'Great. And would it be possible to get a late checkout tomorrow?', 'Отлично. А можно завтра выехать попозже?'),
        L('Receptionist', 'Let me check… Yes, you can stay until one.', 'Сейчас проверю… Да, можете остаться до часу.'),
        L('Guest', 'Perfect. Thanks so much!', 'Идеально. Большое спасибо!')
      ],
      questions: [
        Q('Какая проблема в номере?', ['Шумно', 'Не работает кондиционер', 'Нет полотенец', 'Сломан душ'], 1, '«the air conditioning isn\'t working».'),
        Q('Сотрудник предлагает решить проблему завтра утром.', TF, 1, '«I\'ll send someone up right away» — сейчас же.'),
        Q('Где проходит завтрак?', ['В номере', 'В ресторане на крыше', 'В лобби', 'Завтрака нет'], 2, '«in the lobby».'),
        Q('До скольких гость может остаться завтра?', ['До 11', 'До 12', 'До 13', 'До 15'], 2, '«until one» — до часу дня.'),
        Q('Зачем гость говорит «Sorry to bother you»?', ['Он виноват в поломке', 'Чтобы вежливо начать просьбу', 'Он хочет отменить бронь', 'Он жалуется на сотрудника'], 1, 'Это вежливое вступление: «извините за беспокойство».')
      ],
      learn: ["isn't working", 'Is breakfast included?', 'Would it be possible to', 'a late checkout']
    },
    {
      id: 'st-chat-late', level: 'A2', topic: 'texting', kind: 'chat', title: 'Опаздываю!',
      setting: 'Emma is waiting for Sophie at a restaurant.', settingRu: 'Эмма ждёт Софи в ресторане.',
      lines: [
        L('Emma', 'hey r u close? im at the table', 'Привет, ты уже близко? Я за столиком'),
        L('Sophie', 'omg sry!! stuck in traffic 😩', 'Боже, прости!! Застряла в пробке 😩'),
        L('Emma', 'no worries! how long?', 'Ничего страшного! Сколько ещё?'),
        L('Sophie', 'like 15 min? order w/o me', 'Минут 15? Заказывай без меня'),
        L('Emma', 'k what do u want?', 'Ок, что тебе заказать?'),
        L('Sophie', 'the pasta pls + a lemonade', 'Пасту, пожалуйста, и лимонад'),
        L('Emma', 'got it 👍', 'Поняла 👍'),
        L('Sophie', 'ur the best ❤️ omw', 'Ты лучшая ❤️ Уже еду')
      ],
      questions: [
        Q('Почему Софи опаздывает?', ['Проспала', 'Застряла в пробке', 'Забыла о встрече', 'Задержалась на работе'], 1, '«stuck in traffic».'),
        Q('Эмма злится на Софи.', TF, 1, '«no worries!» — ничего страшного.'),
        Q('Что значит «order w/o me»?', ['Закажи со мной', 'Заказывай без меня', 'Не заказывай', 'Закажи мне то же'], 1, 'w/o = without.'),
        Q('Что заказывает Софи?', ['Пиццу и колу', 'Пасту и лимонад', 'Салат и воду', 'Только лимонад'], 1, '«the pasta pls + a lemonade».'),
        Q('Что значит «omw»?', ['Я уже в пути', 'О мой бог', 'Подожди минуту', 'Я на месте'], 0, 'omw = on my way.'),
        Q('«ur the best» переводится как…', ['Ты лучшая', 'Ты — самое лучшее место', 'Твоё лучшее', 'Ты была лучшей'], 0, 'ur = you\'re.')
      ],
      learn: ['r', 'stuck in traffic', 'No worries.', 'w/', 'k', 'pls', 'omw', 'ur']
    },
    {
      id: 'st-gift', level: 'A2', topic: 'shop', kind: 'talk', title: 'Подарок для мамы',
      setting: 'Daniel is buying a present in a shop.', settingRu: 'Дэниел выбирает подарок в магазине.',
      lines: [
        L('Assistant', 'Hi there! Can I help you find anything?', 'Здравствуйте! Помочь вам что-нибудь найти?'),
        L('Daniel', "Yes, please. I'm looking for a present for my mom.", 'Да, пожалуйста. Ищу подарок маме.'),
        L('Assistant', 'How about a scarf? These are really popular.', 'Может, шарф? Они очень популярны.'),
        L('Daniel', 'They look nice. How much is this blue one?', 'Красивые. Сколько стоит этот синий?'),
        L('Assistant', "It's forty dollars, but it's on sale today — thirty.", 'Сорок долларов, но сегодня скидка — тридцать.'),
        L('Daniel', "That's a good deal. Do you have it in green? It's her favorite color.", 'Выгодно. А есть зелёный? Это её любимый цвет.'),
        L('Assistant', 'Let me check… Yes, here you go.', 'Сейчас посмотрю… Да, вот.'),
        L('Daniel', "Perfect, I'll take it. Can you wrap it?", 'Идеально, беру. Можете упаковать?'),
        L('Assistant', 'Of course!', 'Конечно!')
      ],
      questions: [
        Q('Для кого Дэниел ищет подарок?', ['Для девушки', 'Для мамы', 'Для сестры', 'Для себя'], 1, '«a present for my mom».'),
        Q('Сколько стоит шарф сегодня?', ['40 долларов', '30 долларов', '20 долларов', '50 долларов'], 1, 'Скидка: «on sale today — thirty».'),
        Q('Дэниел покупает синий шарф.', TF, 1, 'Он просит зелёный — любимый цвет мамы.'),
        Q('Что значит «That\'s a good deal»?', ['Это дорого', 'Это выгодно', 'Это красиво', 'Это подделка'], 1, 'a good deal — выгодная покупка.'),
        Q('О чём Дэниел просит в конце?', ['О скидке', 'Упаковать подарок', 'Доставить домой', 'Выдать чек'], 1, '«Can you wrap it?» — упаковать.')
      ],
      learn: ['How much is this?', 'Is this on sale?', 'a good deal', 'Do you have this in', "I'll take it."]
    },

    /* ================= B1 ================= */
    {
      id: 'st-weekend-trip', level: 'B1', topic: 'plans', kind: 'talk', title: 'Поездка на выходные',
      setting: 'Two colleagues talk on Monday morning.', settingRu: 'Двое коллег разговаривают в понедельник утром.',
      lines: [
        L('Ben', 'Morning! How was your weekend?', 'Доброе утро! Как выходные?'),
        L('Kate', "Honestly? A bit of a disaster. We went camping and it rained the whole time.", 'Честно? Почти катастрофа. Мы поехали в поход, и всё время шёл дождь.'),
        L('Ben', "Oh no! That's the worst.", 'О нет! Хуже не бывает.'),
        L('Kate', "Tell me about it! And our tent had a hole in it.", 'И не говори! А ещё в палатке была дыра.'),
        L('Ben', "You've got to be kidding. So what did you do?", 'Да ты шутишь. И что вы сделали?'),
        L('Kate', "We gave up and found a little hotel nearby. It was actually a blessing in disguise — best pizza I've ever had.", 'Мы сдались и нашли маленький отель неподалёку. Вообще-то нет худа без добра — лучшая пицца в моей жизни.'),
        L('Ben', 'Ha! Sounds like a good weekend after all.', 'Ха! Похоже, выходные всё-таки удались.'),
        L('Kate', 'I guess so. What about you?', 'Пожалуй. А у тебя?'),
        L('Ben', "Oh, you know, the usual. Netflix and laundry.", 'Да так, как обычно. Netflix и стирка.')
      ],
      questions: [
        Q('Какая была погода в походе?', ['Солнечно', 'Всё время шёл дождь', 'Снег', 'Сильный ветер'], 1, '«it rained the whole time».'),
        Q('Что означает реакция Кейт «Tell me about it!»?', ['Расскажи мне об этом', 'И не говори! (полностью согласна)', 'Не хочу об этом говорить', 'Я не знаю'], 1, 'Это горячее согласие, а не просьба рассказать.'),
        Q('Что в итоге сделали Кейт и её друзья?', ['Поехали домой', 'Остались в палатке', 'Нашли отель неподалёку', 'Поехали к друзьям'], 2, '«found a little hotel nearby».'),
        Q('Кейт считает, что отель в итоге оказался удачей.', TF, 0, '«a blessing in disguise» — нет худа без добра.'),
        Q('Как провёл выходные Бен?', ['Тоже в походе', 'Смотрел Netflix и стирал', 'Работал', 'Ездил к родителям'], 1, '«the usual. Netflix and laundry».'),
        Q('«You\'ve got to be kidding» выражает…', ['Недоверие и удивление', 'Радость', 'Скуку', 'Злость на Кейт'], 0, 'Бен удивлён и не может поверить в череду неудач.')
      ],
      learn: ['How was your weekend?', 'Tell me about it!', "You've got to be kidding!", 'give up', 'a blessing in disguise', 'Oh, you know, the usual']
    },
    {
      id: 'st-chat-party', level: 'B1', topic: 'texting', kind: 'chat', title: 'Идти на вечеринку?',
      setting: 'Mia and Chris are texting on Friday evening.', settingRu: 'Миа и Крис переписываются в пятницу вечером.',
      lines: [
        L('Mia', 'r u going to sams party 2nite?', 'Ты идёшь на вечеринку к Сэму сегодня?'),
        L('Chris', 'idk tbh… kinda tired', 'Не знаю, честно говоря… устал немного'),
        L('Mia', 'cmon!! itll be fun. everyone from work is going', 'Да ладно!! Будет весело. Все с работы идут'),
        L('Chris', 'ngl i dont really know anyone there except u lol', 'Не буду врать, я там никого не знаю, кроме тебя, лол'),
        L('Mia', 'thats the point! ill introduce u. btw emma asked if ur coming 👀', 'В этом и смысл! Я тебя познакомлю. Кстати, Эмма спрашивала, придёшь ли ты 👀'),
        L('Chris', 'wait fr?', 'Стоп, серьёзно?'),
        L('Mia', 'fr 😂', 'Серьёзно 😂'),
        L('Chris', 'ok fine im in. pick me up at 9?', 'Ладно, я в деле. Заберёшь меня в 9?'),
        L('Mia', 'deal! omw at 845', 'Договорились! Выезжаю в 8:45')
      ],
      questions: [
        Q('Почему Крис сначала не хочет идти?', ['Занят на работе', 'Немного устал и почти никого не знает', 'Не любит Сэма', 'Болеет'], 1, '«kinda tired» и «i dont really know anyone».'),
        Q('Что значит «idk tbh»?', ['Я иду, конечно', 'Не знаю, честно говоря', 'Сегодня не могу', 'Думаю, да'], 1, 'idk = I don\'t know, tbh = to be honest.'),
        Q('Что заставило Криса передумать?', ['Бесплатная еда', 'Эмма спрашивала о нём', 'Сэм позвонил', 'Миа пообещала подвезти обратно'], 1, 'После «emma asked if ur coming 👀» он сразу спрашивает «fr?».'),
        Q('«fr» значит…', ['for real — серьёзно', 'friend — друг', 'free — бесплатно', 'from — от'], 0, 'fr = for real.'),
        Q('Миа заберёт Криса на машине.', TF, 0, '«pick me up at 9?» — «deal!».'),
        Q('Что значит «im in»?', ['Я дома', 'Я в деле, иду', 'Я внутри', 'Я занят'], 1, 'I\'m in — соглашаюсь участвовать.')
      ],
      learn: ['idk', 'tbh', 'kinda', 'ngl', 'btw', 'Count me in!']
    },
    {
      id: 'st-doctor', level: 'B1', topic: 'health', kind: 'talk', title: 'У врача',
      setting: 'Paul visits a doctor because he feels unwell.', settingRu: 'Пол пришёл к врачу, потому что плохо себя чувствует.',
      lines: [
        L('Doctor', 'Good morning. What seems to be the problem?', 'Доброе утро. Что вас беспокоит?'),
        L('Paul', "I've been feeling really run-down for about a week. And I've had a headache since Monday.", 'Уже неделю чувствую себя совершенно вымотанным. А с понедельника болит голова.'),
        L('Doctor', 'Are you sleeping well?', 'Вы хорошо спите?'),
        L('Paul', "Not really. I've been working late — we have a big deadline.", 'Не очень. Я работаю допоздна — у нас большой дедлайн.'),
        L('Doctor', 'Any fever or sore throat?', 'Температура, боль в горле есть?'),
        L('Paul', 'No, nothing like that.', 'Нет, ничего такого.'),
        L('Doctor', "Well, the good news is it's nothing serious. You're exhausted. You need rest, more sleep and less coffee.", 'Хорошая новость — ничего серьёзного. Вы переутомились. Нужен отдых, больше сна и меньше кофе.'),
        L('Paul', 'Less coffee? That might be the hardest part.', 'Меньше кофе? Это, пожалуй, самое трудное.'),
        L('Doctor', "I can imagine. Take a couple of days off if you can.", 'Представляю. Возьмите пару выходных, если получится.')
      ],
      questions: [
        Q('Сколько времени Пол чувствует себя вымотанным?', ['Один день', 'Около недели', 'Месяц', 'С понедельника'], 1, '«for about a week». С понедельника — головная боль.'),
        Q('Почему Пол плохо спит?', ['Шумные соседи', 'Работает допоздна из-за дедлайна', 'Болит горло', 'Много кофе на ночь'], 1, '«I\'ve been working late — we have a big deadline».'),
        Q('У Пола температура.', TF, 1, '«No, nothing like that».'),
        Q('Какой диагноз ставит врач?', ['Грипп', 'Переутомление', 'Мигрень', 'Аллергия'], 1, '«You\'re exhausted».'),
        Q('Что Полу кажется самым трудным в рекомендациях?', ['Спать больше', 'Пить меньше кофе', 'Взять выходные', 'Меньше работать'], 1, '«Less coffee? That might be the hardest part».')
      ],
      learn: ['What seems to be the problem?', "I've been feeling", 'run-down', "It's nothing serious.", 'I can imagine.']
    },

    /* ================= B2 ================= */
    {
      id: 'st-flatmates', level: 'B2', topic: 'opinions', kind: 'talk', title: 'Спор соседей по квартире',
      setting: 'Flatmates Jess and Omar discuss the cleaning schedule.', settingRu: 'Соседи по квартире Джесс и Омар обсуждают график уборки.',
      lines: [
        L('Jess', "Omar, do you have a minute? I think we need to talk about the kitchen.", 'Омар, есть минутка? Думаю, нам надо поговорить о кухне.'),
        L('Omar', "Uh-oh. Is this about the dishes?", 'Ой-ой. Это про посуду?'),
        L('Jess', "Kind of. If you ask me, we need a proper cleaning schedule.", 'Вроде того. По-моему, нам нужен нормальный график уборки.'),
        L('Omar', "I see your point, but I cleaned the bathroom twice last week.", 'Понимаю, но я на прошлой неделе дважды убирал ванную.'),
        L('Jess', "That's a good point, and I appreciate it. But the kitchen is a different story.", 'Справедливо, и я это ценю. Но с кухней другая история.'),
        L('Omar', "Fair enough. My bad — I've been swamped with exams.", 'Справедливо. Моя вина — я завален экзаменами.'),
        L('Jess', "I get it. How about this: you take the bathroom, I take the kitchen, and we swap every week?", 'Понимаю. Давай так: ты берёшь ванную, я кухню, и меняемся каждую неделю?'),
        L('Omar', "I'm with you on that. And after my exams, I'll make it up to you — dinner's on me.", 'Согласен. А после экзаменов я заглажу вину — ужин за мой счёт.'),
        L('Jess', "Deal!", 'Договорились!')
      ],
      questions: [
        Q('О какой проблеме хочет поговорить Джесс?', ['О шуме', 'О кухне и посуде', 'Об оплате аренды', 'О гостях'], 1, '«talk about the kitchen» — «Is this about the dishes?».'),
        Q('Как Омар объясняет беспорядок?', ['Он не умеет готовить', 'Он завален экзаменами', 'Это не его посуда', 'Он болел'], 1, '«I\'ve been swamped with exams».'),
        Q('Что значит «My bad»?', ['Мне плохо', 'Моя вина', 'Это плохая идея', 'Мой плохой день'], 1, 'My bad — разговорное признание ошибки.'),
        Q('Какое решение предлагает Джесс?', ['Нанять уборщицу', 'Меняться зонами уборки каждую неделю', 'Убирать вместе по выходным', 'Омар убирает всё'], 1, '«we swap every week».'),
        Q('Омар в итоге не соглашается с планом.', TF, 1, '«I\'m with you on that» — согласен.'),
        Q('Как Омар хочет «загладить вину»?', ['Купить новую посуду', 'Угостить ужином', 'Убрать всю квартиру', 'Заплатить за месяц'], 1, '«dinner\'s on me».')
      ],
      learn: ['Do you have a minute?', 'If you ask me', 'I see your point, but', "That's a good point.", 'Fair enough.', 'My bad.', "I'm with you on that."]
    },
    {
      id: 'st-chat-work', level: 'B2', topic: 'work', kind: 'chat', title: 'Рабочий чат',
      setting: 'Team chat: Priya (manager), Leo and you.', settingRu: 'Рабочий чат: Прия (руководитель), Лео и вы.',
      lines: [
        L('Priya', 'Morning all. FYI the client call moved to 3pm today.', 'Всем доброе утро. К сведению: звонок с клиентом перенесли на 15:00.'),
        L('Leo', "Got it. I'm WFH today but I'll join.", 'Понял. Сегодня работаю из дома, но подключусь.'),
        L('Priya', "Thanks. Any update on the slides? We need them asap.", 'Спасибо. Есть новости по слайдам? Нужны как можно скорее.'),
        L('Leo', "Almost done. Just need the numbers from finance.", 'Почти готово. Жду только цифры от финансов.'),
        L('Priya', "I'll ping them. Let's touch base at 2 to make sure we're on the same page.", 'Я им напишу. Давайте созвонимся в 2, чтобы убедиться, что все понимают одинаково.'),
        L('Leo', 'Sounds good 👍', 'Отлично 👍'),
        L('Priya', 'Thoughts on sending the draft to the client before the call?', 'Мнения — отправить черновик клиенту до звонка?'),
        L('Leo', "Honestly I'd hold off. If they see it early, they'll pick it apart. Better to walk them through it.", 'Честно, я бы подождал. Если увидят заранее — раскритикуют по кусочкам. Лучше провести их по нему на звонке.'),
        L('Priya', "Fair point. Let's do that.", 'Справедливо. Так и сделаем.')
      ],
      questions: [
        Q('Во сколько теперь звонок с клиентом?', ['В 14:00', 'В 15:00', 'В 11:00', 'Завтра'], 1, '«moved to 3pm».'),
        Q('Что значит «WFH»?', ['В отпуске', 'Работаю из дома', 'На больничном', 'Опаздываю'], 1, 'WFH = work from home.'),
        Q('Чего не хватает Лео, чтобы закончить слайды?', ['Дизайна', 'Цифр от финансового отдела', 'Согласования клиента', 'Времени'], 1, '«Just need the numbers from finance».'),
        Q('Зачем созвон в 2 часа?', ['Обсудить отпуск', 'Убедиться, что все понимают задачу одинаково', 'Поздравить клиента', 'Отменить проект'], 1, '«make sure we\'re on the same page».'),
        Q('Лео советует отправить черновик клиенту заранее.', TF, 1, '«I\'d hold off» — лучше подождать.'),
        Q('В рабочем чате уместны сокращения вроде «u» и «r».', TF, 1, 'В рабочих чатах используют FYI, ASAP, WFH, но не u / r / lol — они звучат несерьёзно.')
      ],
      learn: ['fyi', 'work from home', "What's the status on", 'asap', 'touch base', 'on the same page', 'I take your point']
    },
    {
      id: 'st-first-date', level: 'B2', topic: 'smalltalk', kind: 'talk', title: 'Первое свидание',
      setting: 'Ella and Sam meet for the first time after chatting in an app.', settingRu: 'Элла и Сэм впервые встречаются после переписки в приложении.',
      lines: [
        L('Sam', "Ella? Hi! You look just like your photos. That's a relief, honestly.", 'Элла? Привет! Ты выглядишь как на фото. Честно, это облегчение.'),
        L('Ella', "Ha! Same here. I was a bit nervous, not gonna lie.", 'Ха! Взаимно. Не буду врать, я немного нервничала.'),
        L('Sam', 'Me too. So, have you been here before?', 'Я тоже. Ты здесь уже бывала?'),
        L('Ella', "No, never. You picked it — any recommendations?", 'Нет, ни разу. Ты выбирал — что посоветуешь?'),
        L('Sam', "The tacos are amazing. But I'm on the fence about the spicy ones.", 'Тако потрясающие. Но насчёт острых я не уверен.'),
        L('Ella', "I'll risk it. I love spicy food.", 'Рискну. Обожаю острое.'),
        L('Sam', "Brave! So what do you do when you're not working?", 'Смело! А чем ты занимаешься, когда не работаешь?'),
        L('Ella', "I'm getting the hang of rock climbing. It's harder than it looks.", 'Осваиваю скалолазание. Это сложнее, чем кажется.'),
        L('Sam', "No way, I've always wanted to try that!", 'Да ладно, всегда хотел попробовать!'),
        L('Ella', "Then you should come with me sometime.", 'Тогда пойдём как-нибудь со мной.')
      ],
      questions: [
        Q('Почему Сэм говорит «That\'s a relief»?', ['Он рад, что Элла пришла вовремя', 'Элла выглядит так же, как на фото', 'Ресторан открыт', 'Ему стало лучше'], 1, '«You look just like your photos».'),
        Q('Элла нервничала перед встречей.', TF, 0, '«I was a bit nervous, not gonna lie».'),
        Q('Что значит «I\'m on the fence about the spicy ones»?', ['Острые — лучшие', 'Не уверен насчёт острых', 'Острые закончились', 'Не ест острое'], 1, 'on the fence — в нерешительности.'),
        Q('Чем увлекается Элла?', ['Бегом', 'Скалолазанием', 'Кулинарией', 'Танцами'], 1, '«rock climbing».'),
        Q('«I\'m getting the hang of it» значит…', ['Я бросаю это', 'Я постепенно осваиваю это', 'Я профессионал', 'Мне это надоело'], 1, 'get the hang of — наловчиться.'),
        Q('Чем заканчивается разговор?', ['Элла приглашает Сэма на скалодром', 'Они договариваются о втором ужине', 'Сэм уходит', 'Они спорят'], 0, '«you should come with me sometime».')
      ],
      learn: ["That's a relief.", 'Not gonna lie', 'Have you been here before?', 'on the fence', 'get the hang of', 'No way!']
    },

    /* ================= C1 ================= */
    {
      id: 'st-negotiation', level: 'C1', topic: 'work', kind: 'talk', title: 'Переговоры о сроках',
      setting: 'A project lead negotiates with a demanding client.', settingRu: 'Руководитель проекта договаривается с требовательным клиентом.',
      lines: [
        L('Client', "We need the full platform by the end of the month. That's non-negotiable.", 'Нам нужна вся платформа к концу месяца. Это не обсуждается.'),
        L('Lead', "I take your point, and we want to hit that date too. Having said that, I'd be cutting corners if I promised everything by then.", 'Понимаю вас, и мы тоже хотим уложиться. При этом, пообещав всё к этому сроку, я бы халтурил.'),
        L('Client', "So what are you suggesting?", 'И что вы предлагаете?'),
        L('Lead', "Let's address the elephant in the room: the payments module. It's the riskiest part. We launch everything else on time, and payments two weeks later.", 'Давайте о главной проблеме, о которой все молчат: модуль платежей. Это самая рискованная часть. Всё остальное запускаем в срок, а платежи — через две недели.'),
        L('Client', "That's debatable. Our users expect to pay on day one.", 'Спорно. Наши пользователи ждут оплату с первого дня.'),
        L('Lead', "Fair enough. What if we offer invoice payments at launch as a stopgap?", 'Справедливо. А если на старте предложить оплату по счёту как временное решение?'),
        L('Client', "Hmm. I could live with that, as long as it's no more than two weeks.", 'Хм. Это я могу принять, если не дольше двух недель.'),
        L('Lead', "Two weeks, max. I'll put it in writing and follow up by Friday.", 'Максимум две недели. Я зафиксирую это письменно и отпишусь до пятницы.')
      ],
      questions: [
        Q('Что клиент называет «non-negotiable»?', ['Цену', 'Срок — конец месяца', 'Состав команды', 'Дизайн'], 1, '«by the end of the month. That\'s non-negotiable».'),
        Q('Что значит «I\'d be cutting corners»?', ['Я бы сэкономил время', 'Я бы пожертвовал качеством', 'Я бы ушёл с проекта', 'Я бы повысил цену'], 1, 'cut corners — халтурить, экономить на качестве.'),
        Q('Что руководитель называет «the elephant in the room»?', ['Бюджет', 'Модуль платежей', 'Команду клиента', 'Сроки тестирования'], 1, 'Самая рискованная часть — модуль платежей.'),
        Q('Клиент сразу соглашается запустить платежи позже.', TF, 1, '«That\'s debatable» — сначала возражает.'),
        Q('Какой компромисс они находят?', ['Перенести весь запуск', 'Оплата по счёту на старте, модуль платежей — максимум через две недели', 'Отказаться от платежей', 'Нанять другую команду'], 1, '«invoice payments at launch as a stopgap» + «two weeks, max».'),
        Q('Какую тактику использует руководитель?', ['Спорит и давит', 'Признаёт позицию клиента, затем предлагает альтернативу', 'Сразу соглашается на всё', 'Угрожает сорвать сроки'], 1, 'I take your point / Fair enough → альтернатива. Так договариваются на уровне C1.')
      ],
      learn: ['I take your point', 'Having said that', 'cut corners', 'the elephant in the room', "That's debatable.", 'follow up']
    },
    {
      id: 'st-chat-drama', level: 'C1', topic: 'texting', kind: 'chat', title: 'Драма в группе',
      setting: 'Best friends Zoe and Nina are texting late at night.', settingRu: 'Лучшие подруги Зои и Нина переписываются поздно вечером.',
      lines: [
        L('Zoe', 'ok so u will NOT believe what happened at dinner', 'Короче, ты НЕ поверишь, что было на ужине'),
        L('Nina', 'omg spill ☕', 'Боже, рассказывай ☕'),
        L('Zoe', 'mark showed up w/ his ex. to MY birthday dinner', 'Марк пришёл с бывшей. На МОЙ день рождения'),
        L('Nina', "no wayyy. smh. what did u do??", 'Да ладнооо. Ну и ну. И что ты сделала??'),
        L('Zoe', 'nothing lol. i was lowkey furious but i didnt wanna make a scene', 'Ничего, лол. Втихую была в бешенстве, но не хотела устраивать сцену'),
        L('Nina', 'honestly respect. i wouldve lost it', 'Честно, уважаю. Я бы сорвалась'),
        L('Zoe', 'ngl the cake made up for it 😂', 'Не буду врать, торт всё компенсировал 😂'),
        L('Nina', "lmao. ok but ur talking to him tmrw right?", 'Ахаха. Ладно, но ты же поговоришь с ним завтра?'),
        L('Zoe', "ya. not gonna beat around the bush this time", 'Ага. На этот раз не буду ходить вокруг да около'),
        L('Nina', 'good. keep me posted 💪', 'Правильно. Держи в курсе 💪')
      ],
      questions: [
        Q('Что произошло на ужине?', ['Марк не пришёл', 'Марк пришёл с бывшей девушкой', 'Сгорел торт', 'Зои поссорилась с Ниной'], 1, '«mark showed up w/ his ex».'),
        Q('Что значит «spill» (с эмодзи ☕)?', ['Разлей кофе', 'Рассказывай подробности (сплетни)', 'Успокойся', 'Пойдём выпьем кофе'], 1, 'spill the tea — сленг «выкладывай сплетни».'),
        Q('Как отреагировала Зои на ужине?', ['Устроила скандал', 'Ушла домой', 'Ничего не сделала, хотя злилась', 'Посмеялась'], 2, '«lowkey furious but i didnt wanna make a scene».'),
        Q('Что значит «lowkey»?', ['Громко', 'Втихую, не показывая', 'Очень сильно', 'Немного грустно'], 1, 'lowkey — сленг «незаметно, втайне».'),
        Q('Нина бы на месте Зои тоже промолчала.', TF, 1, '«i wouldve lost it» — я бы сорвалась.'),
        Q('Что Зои собирается сделать завтра?', ['Позвонить Нине', 'Прямо поговорить с Марком', 'Забыть об этом', 'Устроить новую вечеринку'], 1, '«not gonna beat around the bush» — говорить прямо.')
      ],
      learn: ['smh', 'w/', 'ngl', 'beat around the bush', 'Keep me posted.', 'No way!']
    }
  ];

  D.storiesById = {};
  D.stories.forEach(function (s) { D.storiesById[s.id] = s; });
})(window.EG = window.EG || {});
