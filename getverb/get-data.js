/* getverb/get-data.js — содержимое раздела «Глагол get»: значения, какое время передаёт, gotta.
   Только данные, без логики и DOM. Всё лежит в EG.getverb.data — других глобальных имён нет.

   Разметка в английских примерах: [ключевая часть] подсвечивается, ___ — пропуск в задании.
   Упражнения — в формате раздела «Грамматика» (их показывает плеер EG.grammar.ui.run);
   правильный вариант всегда ПЕРВЫЙ в списке — при показе варианты перемешиваются.
     M — «Определи смысл»      (фраза → варианты смысла по-русски)
     N — «Определи время»      (фраза → какое время / смысл по-русски)
     C — «Выбери вариант»      (фраза с ___ → варианты)
     B — «Собери предложение»  (готовое предложение режется на слова и перемешивается)
     F — «Исправь ошибку»      (фраза с ошибкой → список принятых исправлений)
     S — «Ситуация»            (описание ситуации по-русски → подходящая фраза)
   Последний аргумент N / C / F / S — перевод правильной фразы целиком.

   Поля темы: core — суть; key — главный пример; times — строки «пример · форма · что значит · ловушка»; formula; sides — сравнение двух форм;
   examples; phrases — фразовые глаголы [фраза, перевод, пример, перевод примера];
   talk — так говорят в жизни; mistakes — [ошибка, верно, почему]; practice — задания. */
(function (EG) {
  'use strict';

  var GV = EG.getverb = EG.getverb || {};

  function M(text, options, explain) { return { type: 'meaning', text: text, options: options, explain: explain }; }
  function N(text, options, explain, ru) { return { type: 'tense', text: text, options: options, explain: explain, ru: ru }; }
  function C(text, options, explain, ru) { return { type: 'choose', text: text, options: options, explain: explain, ru: ru }; }
  function B(answer, ru, explain) { return { type: 'build', answer: answer, ru: ru, explain: explain }; }
  function F(text, accept, explain, ru) { return { type: 'fix', text: text, accept: accept, explain: explain, ru: ru }; }
  function S(text, options, explain, ru) { return { type: 'situation', text: text, options: options, explain: explain, ru: ru }; }

  // Частые утверждения о get и gotta — с честным ответом (показываются на главном экране раздела)
  var MYTHS = [
    {
      claim: "Глагол get сам передаёт какое-то время.",
      verdict: "no", topic: "time",
      text: "Нет. Время задаёт форма: get / gets — настоящее, got — прошлое, will get и gonna get — будущее, have got / have gotten — перфект. Сам get отвечает за смысл: получить, стать, добраться, понять. Но есть формы-ловушки, где вид и смысл расходятся: I've got, Got it!, I gotta."
    },
    {
      claim: "gotta — это способ сказать про будущее в разговоре.",
      verdict: "partly", topic: "gotta",
      text: "Частично. Действие после gotta обычно ещё впереди (I gotta go — сейчас уйду), поэтому по-русски это звучит почти как будущее. Но грамматически gotta — это «надо» в настоящем. Сравните: I'm gonna call him — я позвоню ему (план, будущее); I gotta call him — мне надо ему позвонить (обязанность). Сказать «придётся» в будущем — I'll have to, в прошлом — I had to: у gotta нет других форм."
    },
    {
      claim: "I've got — это Present Perfect, значит «я получил».",
      verdict: "partly", topic: "have-got",
      text: "По форме — да, по смыслу — нет. I've got a car = I have a car: «у меня есть машина» прямо сейчас. «Я получил» — это I got (прошлое) или, по-американски, I've gotten."
    },
    {
      claim: "Got it — прошедшее время.",
      verdict: "partly", topic: "understand",
      text: "Форма прошедшая, но говорят это о настоящем: «понял, принято». Так же I got it! в американской речи — «я возьму на себя, я разберусь»."
    }
  ];

  var TOPICS = [

    /* ======================= ВРЕМЯ ======================= */

    {
      id: "time", emoji: "⏱", level: "A2",
      title: "Какое время передаёт get", ru: "Время — в форме, а не в самом глаголе",
      core: "Get ведёт себя как любой глагол: время показывает форма (get, got, will get, have got). Сложность в другом — несколько частых разговорных форм выглядят как одно время, а значат другое.",
      key: ["I['ve got] a car. — I [got] a car last week.", "У меня есть машина. — Я купил машину на прошлой неделе."],
      times: [
        ["I [get] up at seven.", "Present Simple", "Обычно, каждый день", ""],
        ["It['s getting] dark.", "Present Continuous", "Прямо сейчас меняется: «темнеет»", ""],
        ["I [got] your message.", "Past Simple", "Прошлое: получил", ""],
        ["I['ll get] it!", "Future Simple", "Решил прямо сейчас: «я открою / я возьму трубку»", ""],
        ["I['m gonna get] a new phone.", "going to", "Будущее, план: «собираюсь купить»", ""],
        ["Things [have gotten] better.", "Present Perfect (US)", "Результат к сейчас: «стало лучше». В британском: have got better", ""],
        ["I['ve got] two kids.", "форма Present Perfect", "Смысл — настоящее: «у меня есть» (= I have)", "ловушка"],
        ["[Got] it!", "форма Past Simple", "Смысл — настоящее: «понял, принято»", "ловушка"],
        ["I [gotta] go.", "have got to", "Смысл — настоящее «надо»; само действие — сейчас или скоро", "ловушка"]
      ],
      formula: [["сейчас", "get / gets · am / is / are getting"], ["прошлое", "got · was / were getting"], ["будущее", "will get · am / is / are gonna get"], ["перфект", "have / has got (UK) · have / has gotten (US)"]],
      examples: [
        ["I usually [get] home at six.", "Обычно я прихожу домой в шесть."],
        ["I['m getting] tired.", "Я начинаю уставать."],
        ["We [got] lost yesterday.", "Вчера мы заблудились."],
        ["Don't worry, you['ll get] there.", "Не переживай, у тебя получится (ты доберёшься)."]
      ],
      mistakes: [
        ["I've got a cold last week.", "I had a cold last week.", "have got — только про сейчас. В прошлом — had."],
        ["Tomorrow I got a new phone.", "Tomorrow I'm gonna get a new phone.", "Про будущее — will get или gonna get, а не got."],
        ["I get it yesterday.", "I got it yesterday.", "yesterday → прошедшая форма got."]
      ],
      practice: [
        N("I've got two sisters.", ["Настоящее — «у меня есть»", "Прошлое — «я получил»", "Будущее — «я получу»"], "have got = have: форма перфекта, смысл — настоящее.", "У меня две сестры."),
        N("It's getting cold.", ["Сейчас, процесс: «холодает»", "Привычка: «всегда холодно»", "Прошлое: «похолодало»"], "be getting + прилагательное — изменение идёт прямо сейчас.", "Холодает."),
        N("I gotta go.", ["Настоящее — «мне надо»", "Будущее время — «я пойду»", "Прошлое — «мне надо было»"], "gotta = have got to: обязанность сейчас. Действие впереди, но это не будущее время.", "Мне надо идти."),
        N("I'll get it!", ["Решение в момент речи: «я открою / я возьму»", "Заранее решённый план", "Прошлое: «я получил»"], "will + get — спонтанное решение: звонят в дверь или телефон.", "Я открою! / Я возьму!"),
        N("Got it!", ["Сейчас: «понял»", "Прошлое: «получил вчера»", "Будущее: «получу»"], "Got it — форма прошедшего, но смысл — «понял (прямо сейчас)».", "Понял!"),
        N("I'm gonna get a new laptop.", ["Будущее: план", "Сейчас: процесс покупки", "Обязанность: надо купить"], "gonna = going to — план на будущее.", "Я собираюсь купить новый ноутбук."),
        C("Yesterday I ___ home at midnight.", ["got", "get", "have got"], "yesterday → прошедшее: got.", "Вчера я добрался домой в полночь."),
        C("Last year we ___ a dog.", ["had", "have got", "has got"], "have got — только настоящее. В прошлом — had.", "В прошлом году у нас была собака."),
        F("Tomorrow I got a new phone.", ["Tomorrow I'm gonna get a new phone.", "Tomorrow I'm going to get a new phone.", "Tomorrow I'll get a new phone.", "Tomorrow I will get a new phone."], "Про будущее — gonna get или will get, а got — прошлое.", "Завтра я куплю новый телефон."),
        S("Звонят в дверь. Скажите семье, что откроете сами.", ["I'll get it!", "I get it every day.", "I got it last week."], "Решение в момент речи — will: I'll get it.", "Я открою!")
      ]
    },

    /* ======================= ЗНАЧЕНИЯ ======================= */

    {
      id: "receive", emoji: "📦", level: "A1",
      title: "get = получить, купить, достать", ru: "Самое частое значение",
      core: "get + что-то — получить, купить, взять, принести. В разговоре get почти всегда звучит естественнее, чем receive, buy или obtain.",
      key: ["Can I [get] a coffee, please?", "Можно мне кофе? (заказ в кафе)"],
      formula: [["", "get + что"], ["", "get + кому + что: get me a coffee"], ["", "get + что + for + кому: get a coffee for me"]],
      examples: [
        ["I [got] your message.", "Я получил твоё сообщение."],
        ["I need to [get] some milk.", "Мне нужно купить молока."],
        ["Can you [get] me a glass of water?", "Принеси мне, пожалуйста, стакан воды."],
        ["She [got] a new job.", "Она нашла новую работу."],
        ["What did you [get] for your birthday?", "Что тебе подарили на день рождения?"]
      ],
      talk: [["Can I get…?", "Можно мне…? — так заказывают в кафе"], ["What can I get you?", "Что вам принести? — фраза официанта"], ["I'll get this.", "Я заплачу (за всех)."]],
      mistakes: [
        ["Can you get to me a pen?", "Can you get me a pen?", "get кому-то что-то — без to."],
        ["I getted a letter.", "I got a letter.", "get — неправильный глагол: get — got — got (US: gotten)."]
      ],
      practice: [
        M("Can I get a latte, please?", ["Можно мне латте?", "Можно я сам сделаю латте?", "Я получил латте"], "Can I get…? — обычный способ заказать в кафе."),
        C("I ___ your email this morning.", ["got", "get", "gets"], "Утро уже прошло → прошедшее got.", "Я получил твоё письмо сегодня утром."),
        C("Could you ___ me some water?", ["get", "got", "getting"], "После could — начальная форма.", "Не мог бы ты принести мне воды?"),
        F("Can you get to me a pen?", ["Can you get me a pen?", "Can you get a pen for me?"], "get кому-то что-то — без to: get me a pen.", "Можешь достать мне ручку?"),
        B("I need to get some milk.", "Мне нужно купить молока.", "need to + get + что."),
        S("Вы в кафе и хотите заказать капучино. Как сказать естественно?", ["Can I get a cappuccino, please?", "Can I become a cappuccino, please?", "I want to receive a cappuccino."], "Can I get…? — естественно. become — «стать», а receive звучит как в официальном письме.", "Можно мне капучино?")
      ]
    },

    {
      id: "become", emoji: "🌡", level: "A2",
      title: "get + прилагательное = стать", ru: "Меняется состояние",
      core: "get + прилагательное — «стать, сделаться»: было одно состояние, стало другое. По-русски часто одним глаголом: get tired — устать, get dark — темнеть, get angry — разозлиться.",
      key: ["It['s getting] late.", "Уже поздно (становится поздно)."],
      formula: [["", "get + прилагательное"], ["процесс", "be getting + прилагательное"], ["всё больше", "get + -er: get better, get older"]],
      examples: [
        ["I['m getting] hungry.", "Я начинаю хотеть есть."],
        ["It [gets] dark early in winter.", "Зимой рано темнеет."],
        ["Don't [get] angry!", "Не злись!"],
        ["Your English is [getting better].", "Твой английский становится лучше."],
        ["We [got] really wet.", "Мы сильно промокли."]
      ],
      sides: [
        { name: "get + прилагательное", means: "состояние: устать, разозлиться, похолодать", ex: ["I [got] tired.", "Я устал."] },
        { name: "become + сущ.", means: "профессия, статус, кем-то стать", ex: ["She [became] a doctor.", "Она стала врачом."] }
      ],
      talk: [["Get well soon!", "Выздоравливай!"], ["Don't get me wrong.", "Не пойми меня неправильно."], ["It's getting out of hand.", "Ситуация выходит из-под контроля."]],
      mistakes: [
        ["I'm getting tiring.", "I'm getting tired.", "Чувство человека — форма на -ed: tired, bored."],
        ["She got a doctor.", "She became a doctor.", "Профессия — become. She got a doctor = она нашла (вызвала) врача."]
      ],
      practice: [
        M("It's getting late.", ["Становится поздно — пора", "Вчера было поздно", "Всегда поздно"], "be getting + прилагательное — изменение идёт сейчас."),
        C("In winter it ___ dark at four.", ["gets", "get", "getting"], "Каждую зиму → Present Simple, it → gets.", "Зимой темнеет в четыре."),
        C("Your English is getting ___!", ["better", "good than", "best"], "getting better — становится лучше.", "Твой английский становится лучше!"),
        F("She got a doctor in 2020.", ["She became a doctor in 2020."], "Профессия, статус — become.", "Она стала врачом в 2020 году."),
        B("It is getting dark.", "Темнеет.", "be getting + прилагательное — процесс прямо сейчас."),
        S("Вы долго гуляли без еды. Как сказать «Я проголодался»?", ["I'm getting hungry.", "I'm becoming hungry.", "I get hungry yesterday."], "get + прилагательное — естественно; becoming hungry звучит книжно.", "Я начинаю хотеть есть.")
      ]
    },

    {
      id: "arrive", emoji: "🚌", level: "A1",
      title: "get to = добраться", ru: "Куда-то прийти, приехать",
      core: "get to + место — «добраться, попасть». Со словами home, here, there предлог to не нужен: get home, get there.",
      key: ["How do I [get to] the station?", "Как мне добраться до вокзала?"],
      formula: [["", "get to + место: get to work, get to the airport"], ["без to", "get home · get here · get there"], ["", "get back — вернуться · get in — приехать (поезд, человек)"]],
      examples: [
        ["I [got home] at ten.", "Я пришёл домой в десять."],
        ["We'll [get there] by six.", "Мы доберёмся туда к шести."],
        ["Call me when you [get back].", "Позвони, когда вернёшься."],
        ["What time does your train [get in]?", "Во сколько прибывает твой поезд?"]
      ],
      talk: [["Text me when you get home.", "Напиши, когда будешь дома."], ["You'll get there!", "У тебя всё получится! (дойдёшь до цели)"]],
      mistakes: [
        ["I got to home late.", "I got home late.", "С home предлог to не ставится."],
        ["How can I get the station?", "How can I get to the station?", "Без to получится «достать вокзал»."]
      ],
      practice: [
        C("What time did you get ___?", ["home", "to home", "at home"], "get home — без предлога.", "Во сколько ты добрался домой?"),
        C("How do I get ___ the museum?", ["to", "at", "in"], "Направление — get to.", "Как мне добраться до музея?"),
        F("I got to home late.", ["I got home late."], "С home предлог to не нужен.", "Я поздно вернулся домой."),
        M("Text me when you get there.", ["Напиши, когда доберёшься", "Напиши, когда купишь это", "Напиши, когда поймёшь"], "get there — добраться туда."),
        B("How do I get to the airport?", "Как мне добраться до аэропорта?", "Вопрос: How do I get to + место?"),
        S("Вы заблудились и спрашиваете прохожего дорогу к вокзалу.", ["Excuse me, how do I get to the station?", "Excuse me, how do I get the station?", "Excuse me, how I get to station?"], "get to + место; в вопросе нужно do.", "Простите, как пройти к вокзалу?")
      ]
    },

    {
      id: "understand", emoji: "💡", level: "A2",
      title: "get = понять", ru: "I get it · Got it · I don't get it",
      core: "В разговоре get часто значит «понимать, улавливать»: шутку, мысль, объяснение. Got it — короткое «понял, принято».",
      key: ["Sorry, I don't [get] it.", "Извини, не понимаю."],
      formula: [["понимаю", "I get it. · I get what you mean."], ["не понимаю", "I don't get it."], ["понял!", "Got it! · I got it."], ["?", "Do you get it? · Got it?"]],
      examples: [
        ["Oh, now I [get] it!", "А, теперь понятно!"],
        ["Do you [get] what I mean?", "Понимаешь, о чём я?"],
        ["I didn't [get] the joke.", "Я не понял шутку."],
        ["— Be back by ten. — [Got] it.", "— Вернись к десяти. — Понял."]
      ],
      talk: [["You got me.", "Ты меня подловил. / Без понятия."], ["I get that a lot.", "Мне это часто говорят."], ["Get the picture?", "Улавливаешь?"]],
      mistakes: [
        ["I don't got it.", "I don't get it.", "После don't — начальная форма get."],
        ["I am getting it.", "I get it.", "«Понимаю» — состояние, обычно без -ing."]
      ],
      practice: [
        M("I don't get it.", ["Не понимаю", "Не получил", "Не достану"], "get = понимать: I don't get it — не понимаю."),
        S("Коллега объяснил задачу. Коротко скажите «Понял!».", ["Got it!", "Get it!", "I getting it!"], "Got it — короткое «понял, принято».", "Понял!"),
        C("Sorry, I don't ___ the joke.", ["get", "got", "gets"], "После don't — начальная форма.", "Извини, я не понимаю шутку."),
        F("I don't got it.", ["I don't get it.", "I didn't get it."], "После don't / didn't — get.", "Я не понимаю."),
        N("Did you get what I said?", ["Прошлое: «ты понял, что я сказал?»", "Настоящее: «ты всегда понимаешь?»", "Будущее: «поймёшь?»"], "did + get — вопрос в прошедшем.", "Ты понял, что я сказал?"),
        B("Do you get what I mean?", "Понимаешь, о чём я?", "Do you get + what I mean?")
      ]
    },

    {
      id: "passive", emoji: "💍", level: "B1",
      title: "get + V3 = что-то случилось", ru: "get married, get fired, get lost",
      core: "get + третья форма глагола — разговорный пассив: с человеком что-то произошло или изменилось. Подчёркивает событие, а be + V3 — состояние.",
      key: ["They [got married] last year.", "Они поженились в прошлом году."],
      formula: [["", "get + V3"], ["прошлое", "got + V3: got fired"], ["будущее", "will get / am gonna get + V3"]],
      examples: [
        ["He [got fired] on Monday.", "Его уволили в понедельник."],
        ["We [got lost] in the old town.", "Мы заблудились в старом городе."],
        ["I [get paid] on Fridays.", "Зарплату мне платят по пятницам."],
        ["Hurry up and [get dressed]!", "Давай быстрее одевайся!"],
        ["Don't [get caught]!", "Смотри не попадись!"]
      ],
      sides: [
        { name: "get married", means: "событие: пожениться", ex: ["We [got married] in May.", "Мы поженились в мае."] },
        { name: "be married", means: "состояние: быть женатыми", ex: ["We['re married].", "Мы женаты."] }
      ],
      talk: [["Get lost!", "Отвали! (грубо)"], ["I got stuck in traffic.", "Я застрял в пробке."], ["Did you get hurt?", "Ты не ушибся?"]],
      mistakes: [
        ["We got lose in the forest.", "We got lost in the forest.", "После get — третья форма: lost."],
        ["They married with each other.", "They got married.", "«Пожениться» — get married, без with."],
        ["I fired on Monday.", "I got fired on Monday.", "I fired — «я уволил (кого-то)», а не «меня уволили»."]
      ],
      practice: [
        M("They got married in June.", ["Поженились в июне", "Были женаты в июне", "Собираются пожениться в июне"], "get married — событие свадьбы."),
        C("I ___ paid at the end of the month.", ["get", "got to", "am get"], "Регулярно → Present Simple: I get paid.", "Мне платят в конце месяца."),
        C("We got ___ and missed the bus.", ["lost", "lose", "losing"], "get + V3: got lost.", "Мы заблудились и опоздали на автобус."),
        F("We got lose in the forest.", ["We got lost in the forest."], "После get — третья форма: lost.", "Мы заблудились в лесу."),
        N("We're getting married next summer.", ["Будущее: договорённость", "Сейчас: свадьба идёт", "Прошлое: уже поженились"], "Present Continuous для договорённостей: свадьба уже запланирована.", "Мы женимся следующим летом."),
        S("Друг рассказывает, что его уволили в понедельник. Как он скажет это разговорно?", ["I got fired on Monday.", "I got fire on Monday.", "I fired on Monday."], "get + V3: got fired. I fired — «я уволил».", "Меня уволили в понедельник."),
        B("They got married last year.", "Они поженились в прошлом году.", "got + V3 + когда.")
      ]
    },

    {
      id: "causative", emoji: "✂️", level: "B1",
      title: "get something done", ru: "Сделать чужими руками · уговорить · удалось",
      core: "Три полезные конструкции: get + что + V3 — «мне это сделали»; get + кого + to V — «уговорить, попросить»; get to + V — «удалось, выпала возможность».",
      key: ["I need to [get my hair cut].", "Мне нужно подстричься (в парикмахерской)."],
      formula: [["сделали мне", "get + что + V3: get the car fixed"], ["уговорить", "get + кого + to + V: get him to call"], ["удалось", "get to + V: I got to meet her"]],
      examples: [
        ["We [got the car fixed].", "Нам починили машину."],
        ["I'll [get him to call] you back.", "Я попрошу его вам перезвонить."],
        ["I finally [got to meet] my favourite actor.", "Мне наконец удалось встретиться с любимым актёром."],
        ["You should [get your eyes checked].", "Тебе стоит проверить зрение."]
      ],
      sides: [
        { name: "get to + V", means: "удалось, повезло", ex: ["I [got to see] the Northern Lights.", "Мне удалось увидеть северное сияние."] },
        { name: "have got to + V", means: "надо, должен", ex: ["I['ve got to see] a doctor.", "Мне надо к врачу."] }
      ],
      mistakes: [
        ["I cut my hair yesterday.", "I got my hair cut yesterday.", "I cut my hair — «я сам подстригся». В парикмахерской — got my hair cut."],
        ["I'll get him call you.", "I'll get him to call you.", "get + кого + to + глагол."]
      ],
      practice: [
        M("I got my phone repaired.", ["Мне починили телефон", "Я сам починил телефон", "Я купил новый телефон"], "get + что + V3 — сделал кто-то другой."),
        C("I'll get her ___ you tomorrow.", ["to call", "call", "calling"], "get + кого + to + V.", "Я попрошу её позвонить тебе завтра."),
        C("You should get your eyes ___.", ["checked", "check", "to check"], "get + что + V3.", "Тебе стоит проверить зрение."),
        M("I got to see the Northern Lights!", ["Мне удалось увидеть северное сияние", "Мне пришлось увидеть северное сияние", "Я обязан увидеть северное сияние"], "got to + V — выпала возможность, а не «надо»."),
        F("I need to get my car wash.", ["I need to get my car washed."], "get + что + V3: washed.", "Мне нужно помыть машину (на мойке)."),
        B("I need to get my hair cut.", "Мне нужно подстричься.", "get + my hair + cut (V3).")
      ]
    },

    {
      id: "have-got", emoji: "🎒", level: "A1",
      title: "have got = иметь", ru: "Выглядит как перфект, значит «у меня есть»",
      core: "have got = have: «у меня есть». Форма — как у Present Perfect, а смысл — только настоящий. В американской речи have часто проглатывают: I got two kids = I've got two kids — понимайте по контексту.",
      key: ["I['ve got] a headache.", "У меня болит голова."],
      formula: [["+", "I / you / we / they've got · he / she's got"], ["−", "haven't got · hasn't got"], ["?", "Have you got…? · разговорно: Got…?"], ["прошлое", "had (не «had got»)"]],
      examples: [
        ["I['ve got] two kids.", "У меня двое детей."],
        ["[Have] you [got] a minute?", "У тебя есть минутка?"],
        ["She['s got] a cold.", "Она простудилась (у неё простуда)."],
        ["[Got] a pen?", "Есть ручка?"],
        ["I['ve got] an idea!", "У меня есть идея!"]
      ],
      sides: [
        { name: "I've got (UK и US)", means: "у меня есть — сейчас", ex: ["I['ve got] a car.", "У меня есть машина."] },
        { name: "I've gotten (US)", means: "получил, стал — настоящий перфект", ex: ["I['ve gotten] a lot of emails today.", "Сегодня мне пришло много писем."] }
      ],
      talk: [["You've got this!", "Ты справишься!"], ["Got a sec?", "Есть секунда?"], ["What have you got?", "Что у тебя есть? / Что там у тебя?"]],
      mistakes: [
        ["Do you have got a pen?", "Have you got a pen?", "Либо Have you got…?, либо Do you have…?"],
        ["I've got a cold last week.", "I had a cold last week.", "У have got нет прошедшего — had."]
      ],
      practice: [
        N("She's got blue eyes.", ["Настоящее: у неё голубые глаза", "Прошлое: у неё были голубые глаза", "Она недавно получила глаза"], "'s got = has: смысл — настоящее.", "У неё голубые глаза."),
        C("___ you got a minute?", ["Have", "Do", "Are"], "Вопрос с have got — Have you got…?", "У тебя есть минутка?"),
        C("Last year I ___ a dog.", ["had", "have got", "has got"], "have got — только сейчас. В прошлом — had.", "В прошлом году у меня была собака."),
        F("Do you have got a pen?", ["Have you got a pen?", "Do you have a pen?"], "Либо Have you got…?, либо Do you have…?", "У тебя есть ручка?"),
        M("Got a sec?", ["Есть секунда?", "Получил секунду?", "Подожди секунду"], "= Have you got a second? — have you выпадает."),
        S("Вы хотите спросить друга, есть ли у него зарядка для телефона.", ["Have you got a charger?", "Do you have got a charger?", "Are you got a charger?"], "Have you got…? (или Do you have…?).", "У тебя есть зарядка?")
      ]
    },

    {
      id: "gotta", emoji: "🏃", level: "A2",
      title: "gotta = надо", ru: "Разговорное «должен» — и чем оно отличается от gonna",
      core: "gotta — быстрое произношение have got to = have to: «надо, должен». Это обязанность в настоящем, а не будущее время. Будущее в разговоре — gonna (going to). Пишут gotta только в неформальных чатах.",
      key: ["Sorry, I [gotta] go!", "Извини, мне пора!"],
      formula: [["=", "gotta = have got to = have to"], ["+", "I / you / we / they ('ve) gotta + V · he / she ('s) gotta + V"], ["прошлое", "had to + V"], ["будущее", "will have to + V"], ["−  ?", "don't have to · Do you have to…?"]],
      sides: [
        { name: "gonna = going to", means: "собираюсь — будущее, план", ex: ["I['m gonna call] him.", "Я позвоню ему (собираюсь)."] },
        { name: "gotta = have got to", means: "надо — обязанность сейчас", ex: ["I [gotta call] him.", "Мне надо ему позвонить."] }
      ],
      examples: [
        ["I [gotta] go, talk later!", "Мне пора, поговорим позже!"],
        ["You['ve gotta] try this pizza!", "Ты обязательно должен попробовать эту пиццу!"],
        ["We [gotta] get up early tomorrow.", "Нам завтра рано вставать."],
        ["She['s gotta] finish it by Friday.", "Ей надо закончить это к пятнице."],
        ["You [gotta] be kidding me!", "Ты, наверное, шутишь!"]
      ],
      talk: [["Gotta go!", "Пора бежать!"], ["You gotta do what you gotta do.", "Делай, что должен."], ["I gotta question.", "У меня вопрос (здесь gotta = got a)."]],
      mistakes: [
        ["I gotta to go.", "I gotta go.", "to уже внутри gotta (got to)."],
        ["She gottas go.", "She's gotta go.", "У gotta не бывает -s; she's gotta = she has got to."],
        ["Yesterday I gotta work.", "Yesterday I had to work.", "Прошедшего у gotta нет — had to."],
        ["Gotta you leave?", "Do you have to leave?", "Вопросы с gotta не строят — Do you have to…?"]
      ],
      practice: [
        M("Sorry, I gotta go.", ["Извини, мне надо идти", "Извини, я пойду завтра", "Извини, я уже ушёл"], "gotta = have got to: надо."),
        N("I gotta call my mom.", ["Обязанность сейчас: «мне надо позвонить»", "Будущее время: «я позвоню»", "Прошлое: «я позвонил»"], "gotta — это «надо», а не будущее. Будущее — I'm gonna call.", "Мне надо позвонить маме."),
        C("I gotta ___ up early tomorrow.", ["get", "to get", "got"], "После gotta — сразу глагол без to: to уже спрятано внутри.", "Мне завтра рано вставать."),
        C("Yesterday I ___ work late.", ["had to", "gotta", "have gotta"], "У gotta нет прошедшего — had to.", "Вчера мне пришлось работать допоздна."),
        F("I gotta to finish this.", ["I gotta finish this.", "I've got to finish this.", "I have got to finish this.", "I have to finish this."], "to уже внутри gotta.", "Мне надо это закончить."),
        S("Друг зовёт в кино, но вам завтра сдавать отчёт. Скажите «Не могу, мне надо работать».", ["Can't, I gotta work.", "Can't, I'm gonna work.", "Can't, I gotta worked."], "Обязанность — gotta. I'm gonna work — «собираюсь поработать» (план, а не необходимость).", "Не могу, мне надо работать."),
        S("Вы рассказываете о планах на выходные: собираетесь посмотреть новый сериал.", ["I'm gonna watch the new series.", "I gotta watching the new series.", "I gonna watched the new series."], "План на будущее — be gonna + V.", "Я собираюсь посмотреть новый сериал."),
        M("You gotta see this!", ["Ты обязательно должен это увидеть!", "Ты увидишь это завтра", "Ты это уже видел"], "gotta часто звучит как сильный совет или восторг."),
        B("I have got to go now.", "Мне надо идти прямо сейчас.", "have got to (= gotta) + глагол.")
      ]
    },

    {
      id: "phrasal", emoji: "🧩", level: "A2",
      title: "Фразовые глаголы с get", ru: "get up, get on, get over и другие",
      core: "С частицами get даёт десятки новых глаголов. Смысл часто не складывается из частей — их проще запомнить готовыми фразами.",
      key: ["What time do you [get up]?", "Во сколько ты встаёшь?"],
      phrases: [
        ["get up", "вставать", "I [get up] at seven.", "Я встаю в семь."],
        ["get on / get along (with)", "ладить", "I [get on] well with my boss.", "Я хорошо лажу с начальником."],
        ["get over", "оправиться, пережить", "She [got over] the flu quickly.", "Она быстро оправилась от гриппа."],
        ["get back", "вернуться", "When did you [get back]?", "Когда ты вернулся?"],
        ["get on / get off", "сесть / выйти (автобус, поезд)", "[Get off] at the next stop.", "Выходи на следующей остановке."],
        ["get in / get out (of)", "сесть / выйти (машина, такси)", "[Get in], I'll drive you home.", "Садись, я отвезу тебя домой."],
        ["get rid of", "избавиться", "We need to [get rid of] this old sofa.", "Нам надо избавиться от этого старого дивана."],
        ["get by", "справляться, обходиться", "I can [get by] in Spanish.", "Я могу кое-как объясниться по-испански."],
        ["get together", "встретиться, собраться", "Let's [get together] this weekend.", "Давай встретимся на выходных."],
        ["get away with", "сойти с рук", "He always [gets away with] it.", "Ему всегда всё сходит с рук."]
      ],
      talk: [["Get out!", "Да ладно! / Не может быть! (а ещё — «Вон!»)"], ["Get real.", "Спустись на землю."], ["Let's get going.", "Пора выдвигаться."], ["Get a life!", "Займись уже чем-нибудь!"]],
      mistakes: [
        ["I get on the taxi.", "I get in the taxi.", "Машина, такси — get in / out; автобус, поезд, самолёт — get on / off."],
        ["We need to get rid this sofa.", "We need to get rid of this sofa.", "get rid of — с of."]
      ],
      practice: [
        C("What time do you usually get ___?", ["up", "on", "over"], "get up — вставать.", "Во сколько ты обычно встаёшь?"),
        C("I get ___ really well with my sister.", ["on", "over", "off"], "get on (well) with — ладить.", "Я очень хорошо лажу с сестрой."),
        C("It took her months to get ___ the breakup.", ["over", "on", "by"], "get over — пережить, оправиться.", "Ей понадобились месяцы, чтобы пережить расставание."),
        C("Get ___ the bus at the next stop.", ["off", "out", "over"], "Из автобуса — get off.", "Выходи из автобуса на следующей остановке."),
        M("Let's get together this weekend.", ["Давай встретимся на выходных", "Давай вместе купим что-нибудь на выходных", "Давай вернёмся на выходных"], "get together — встретиться, собраться."),
        M("I can get by in Spanish.", ["Могу кое-как объясниться по-испански", "Отлично знаю испанский", "Еду в Испанию"], "get by — справляться, обходиться минимумом."),
        F("We need to get rid this sofa.", ["We need to get rid of this sofa."], "get rid of — с of.", "Нам надо избавиться от этого дивана.")
      ]
    }
  ];

  var byId = Object.create(null);
  TOPICS.forEach(function (t) {
    byId[t.id] = t;
    (t.practice || []).forEach(function (ex, i) { ex.key = t.id + ':' + i; ex.topic = t.id; });
  });

  GV.data = {
    topics: TOPICS,
    byId: byId,
    myths: MYTHS,
    // ссылки на соседние уроки «Грамматики» (только чтение EG.grammar.data)
    related: ['get-used-to', 'have-got', 'have-to', 'going-to']
  };
})(window.EG = window.EG || {});
