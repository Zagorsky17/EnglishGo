/* keyverbs/keyverbs-data.js — содержимое раздела «Ключевые глаголы»: take, have, make и do, go и come,
   keep, put, let и разговорные сокращения (wanna, gonna, lemme…).
   Только данные, без логики и DOM. Всё лежит в EG.keyverbs.data — других глобальных имён нет.

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

   Глагол: id, emoji, title, ru, core, myths [{claim, verdict: no|partly|yes, text, topic?}], topics.
   Тема: id (уникален во всём разделе), emoji, level, title, ru, core, key, formula, sides (ровно 2),
   examples, phrases [фраза, перевод, пример, перевод примера], talk, mistakes [ошибка, верно, почему], practice. */
(function (EG) {
  'use strict';

  var KV = EG.keyverbs = EG.keyverbs || {};

  function M(text, options, explain) { return { type: 'meaning', text: text, options: options, explain: explain }; }
  function N(text, options, explain, ru) { return { type: 'tense', text: text, options: options, explain: explain, ru: ru }; }
  function C(text, options, explain, ru) { return { type: 'choose', text: text, options: options, explain: explain, ru: ru }; }
  function B(answer, ru, explain) { return { type: 'build', answer: answer, ru: ru, explain: explain }; }
  function F(text, accept, explain, ru) { return { type: 'fix', text: text, accept: accept, explain: explain, ru: ru }; }
  function S(text, options, explain, ru) { return { type: 'situation', text: text, options: options, explain: explain, ru: ru }; }

  var VERBS = [

    /* ======================= TAKE ======================= */

    {
      id: "take", emoji: "🤲", title: "take", ru: "взять · сделать действие · поехать · занять время",
      core: "take — не только «взять». В разговоре им делают действия (take a shower, take a photo), ездят (take the bus) и меряют время (it takes an hour). Русскоговорящие его недоиспользуют.",
      myths: [
        { claim: "«Сфотографировать» — make a photo.", verdict: "no", topic: "take-actions",
          text: "По-английски — take a photo / take a picture. make a photo поймут, но это калька с русского." },
        { claim: "take an exam — «сдать экзамен».", verdict: "partly", topic: "take-actions",
          text: "take an exam — «сдавать» (процесс, результат неизвестен). «Сдать» успешно — pass, «завалить» — fail." }
      ],
      topics: [
        {
          id: "take-actions", emoji: "📸", level: "A2",
          title: "take + действие", ru: "take a photo, take a break, take a look",
          core: "take + существительное часто значит просто «сделать это действие»: принять душ, сделать перерыв, взглянуть, сфотографировать.",
          key: ["Let's [take a break].", "Давай сделаем перерыв."],
          formula: [["", "take a shower / a break / a nap / a walk"], ["", "take a photo / a look / a seat / a risk"], ["", "take an exam / a test — сдавать"]],
          examples: [
            ["Can you [take a photo] of us?", "Можешь нас сфотографировать?"],
            ["I need to [take a shower].", "Мне нужно принять душ."],
            ["[Take a look] at this!", "Посмотри на это!"],
            ["Please [take a seat].", "Присаживайтесь, пожалуйста."],
            ["I'm [taking] my driving test tomorrow.", "Завтра я сдаю экзамен по вождению."]
          ],
          sides: [
            { name: "take an exam", means: "сдавать — процесс", ex: ["I'm [taking] an exam tomorrow.", "Завтра у меня экзамен."] },
            { name: "pass an exam", means: "сдать — успешно", ex: ["I [passed] the exam!", "Я сдал экзамен!"] }
          ],
          talk: [["Take a guess.", "Угадай."], ["I'll take my chances.", "Рискну."], ["Take a deep breath.", "Сделай глубокий вдох."]],
          mistakes: [
            ["Can I make a photo?", "Can I take a photo?", "Фотографируют — take."],
            ["Please take a sit.", "Please take a seat.", "seat — место; sit — глагол «сидеть»."],
            ["I'm going to pass my exam tomorrow.", "I'm taking my exam tomorrow.", "pass — уже сдать успешно; про сам экзамен — take."]
          ],
          practice: [
            C("Can you ___ a photo of us?", ["take", "make", "do"], "Фотографировать — take a photo.", "Можешь нас сфотографировать?"),
            C("I'm tired. Let's ___ a break.", ["take", "make", "do"], "Перерыв — take a break.", "Я устал. Давай сделаем перерыв."),
            M("I'm taking my driving test tomorrow.", ["Завтра сдаю на права — результат неизвестен", "Завтра точно сдам на права", "Завтра заберу свои права"], "take a test — сдавать; pass — сдать успешно."),
            F("Please take a sit.", ["Please take a seat."], "seat — место; sit — глагол.", "Присаживайтесь, пожалуйста."),
            S("Вы хотите предложить другу сначала посмотреть квартиру.", ["Let's take a look first.", "Let's make a look first.", "Let's do a look first."], "Взглянуть — take a look (или have a look).", "Давай сначала посмотрим."),
            B("I need to take a shower.", "Мне нужно принять душ.", "need to + take a shower.")
          ]
        },
        {
          id: "take-time", emoji: "🚕", level: "A2",
          title: "take = поехать · занять время", ru: "take the bus · it takes an hour",
          core: "take + транспорт — «поехать на нём». It takes + время — «это занимает столько-то». Оба оборота в разговоре звучат постоянно.",
          key: ["It [takes] me an hour to get to work.", "Дорога на работу занимает у меня час."],
          formula: [["транспорт", "take the bus / the train / a taxi"], ["время", "It takes (me) + время + to + V"], ["?", "How long does it take?"]],
          examples: [
            ["I [take the bus] to work.", "Я езжу на работу на автобусе."],
            ["Let's [take a taxi].", "Давай возьмём такси."],
            ["How long does it [take]?", "Сколько это займёт?"],
            ["It [took] ages!", "Это заняло целую вечность!"],
            ["[Take] your time.", "Не торопись."]
          ],
          talk: [["It won't take long.", "Это недолго."], ["Take your time.", "Не спеши."]],
          mistakes: [
            ["It needs twenty minutes.", "It takes twenty minutes.", "Про время — it takes."],
            ["How long it takes?", "How long does it take?", "В вопросе нужно does."]
          ],
          practice: [
            C("It ___ about twenty minutes to get there.", ["takes", "needs", "does"], "Время на дорогу — it takes.", "Дорога туда занимает минут двадцать."),
            C("How long does it ___ to cook?", ["take", "takes", "took"], "После does — начальная форма.", "Сколько времени это готовится?"),
            C("We ___ a taxi to the airport.", ["took", "made", "went"], "Поехать на такси — take a taxi; в прошлом — took.", "Мы поехали в аэропорт на такси."),
            F("How long it takes?", ["How long does it take?"], "Вопрос в Present Simple — с does.", "Сколько времени это занимает?"),
            M("Take your time.", ["Не торопись", "Возьми часы с собой", "Время вышло"], "Take your time — не спеши, у тебя есть время."),
            S("Коллега спрашивает, сколько вы добираетесь до работы. Ответьте: «Около сорока минут».", ["It takes me about forty minutes.", "It needs me about forty minutes.", "I need about forty minutes for come."], "Время на дорогу — it takes me…", "Дорога занимает у меня около сорока минут.")
          ]
        },
        {
          id: "take-phrasal", emoji: "🧩", level: "B1",
          title: "Фразовые глаголы с take", ru: "take off, take after, take up…",
          core: "С частицами take даёт много частых глаголов. Их проще запомнить готовыми фразами.",
          key: ["Please [take off] your shoes.", "Пожалуйста, снимите обувь."],
          phrases: [
            ["take off", "снять (одежду) · взлететь", "The plane [took off] at six.", "Самолёт взлетел в шесть."],
            ["take after", "быть похожим (на родственника)", "She [takes after] her mother.", "Она похожа на маму."],
            ["take up", "начать заниматься (хобби)", "I've [taken up] yoga.", "Я начал заниматься йогой."],
            ["take out", "вынести · пригласить куда-то", "Can you [take out] the rubbish?", "Можешь вынести мусор?"],
            ["take away / to go", "с собой (еда)", "Is that for here or to [take away]?", "Здесь или с собой?"],
            ["take it easy", "не напрягайся, расслабься", "[Take it easy], it's just a game.", "Расслабься, это всего лишь игра."],
            ["take care", "береги себя · пока", "Bye, [take care]!", "Пока, береги себя!"]
          ],
          mistakes: [
            ["The plane took up at six.", "The plane took off at six.", "Взлететь — take off."],
            ["She takes after to her mother.", "She takes after her mother.", "take after + кто — без to."]
          ],
          practice: [
            C("Please take ___ your shoes.", ["off", "up", "after"], "Снять одежду, обувь — take off.", "Пожалуйста, снимите обувь."),
            C("She takes ___ her mother.", ["after", "off", "up"], "Быть похожим на родственника — take after.", "Она похожа на маму."),
            C("I've just taken ___ yoga.", ["up", "after", "off"], "Начать заниматься — take up.", "Я только что начал заниматься йогой."),
            M("Take it easy!", ["Расслабься, не напрягайся!", "Возьми это легко", "Это легко взять"], "Take it easy — не нервничай, спокойно."),
            M("Is that for here or to take away?", ["Здесь или с собой?", "Это здесь или убрать?", "Это вам или другу?"], "Вопрос в кафе: есть здесь или взять с собой."),
            F("The plane took up at six.", ["The plane took off at six."], "Взлететь — take off.", "Самолёт взлетел в шесть.")
          ]
        }
      ]
    },

    /* ======================= HAVE ======================= */

    {
      id: "have", emoji: "🍽", title: "have", ru: "иметь · есть и пить · проводить время · надо",
      core: "have — не только «иметь». В разговоре им едят и пьют (have lunch), проводят время (have fun), делают действия (have a look) и говорят «надо» (have to).",
      myths: [
        { claim: "have — это «иметь», поэтому I'm having сказать нельзя.", verdict: "partly", topic: "have-actions",
          text: "Нельзя, если have значит «иметь»: I have a car, а не I'm having a car. Но have-действие — есть, пить, проводить время — обычный глагол: I'm having lunch, We're having a great time." },
        { claim: "You don't have to — это «нельзя».", verdict: "no", topic: "have-to",
          text: "don't have to — «не обязательно, можно не делать». «Нельзя» — mustn't или can't." }
      ],
      topics: [
        {
          id: "have-actions", emoji: "☕", level: "A1",
          title: "have = есть, пить, проводить", ru: "have lunch, have fun, have a look",
          core: "have + еда или напиток — «есть, пить»; have + время — «проводить»; have a look, have a shower — действие. В этих значениях have спокойно стоит в Continuous.",
          key: ["Sorry, I'm [having] lunch.", "Извини, я обедаю."],
          formula: [["еда", "have breakfast / lunch / dinner / a coffee"], ["время", "have fun · have a good time · have a nice day"], ["действие", "have a look / a shower / a rest / a chat"]],
          examples: [
            ["I usually [have] breakfast at eight.", "Обычно я завтракаю в восемь."],
            ["Let's [have] a coffee.", "Давай выпьем кофе."],
            ["We [had] a great time.", "Мы отлично провели время."],
            ["[Have] fun!", "Повеселись!"],
            ["Can I [have] a look?", "Можно взглянуть?"]
          ],
          sides: [
            { name: "have = иметь", means: "состояние — без -ing", ex: ["I [have] a car.", "У меня есть машина."] },
            { name: "have = действие", means: "есть, пить, проводить — можно с -ing", ex: ["I'm [having] dinner.", "Я ужинаю."] }
          ],
          talk: [["I'll have the soup, please.", "Мне суп, пожалуйста."], ["Have a nice weekend!", "Хороших выходных!"], ["What are you having?", "Что ты будешь (есть, пить)?"]],
          mistakes: [
            ["I'm having a new car.", "I have a new car.", "«Иметь» — состояние, без -ing."],
            ["We had a fun.", "We had fun.", "fun — без a."]
          ],
          practice: [
            C("Sorry, I can't talk — I'm ___ dinner.", ["having", "have", "had"], "Действие прямо сейчас — I'm having.", "Извини, не могу говорить — я ужинаю."),
            C("We ___ a great time at the party.", ["had", "made", "did"], "Проводить время — have a good time.", "Мы отлично провели время на вечеринке."),
            M("Have fun!", ["Повеселись!", "Имей веселье", "Тебе смешно?"], "Have fun — пожелание хорошо провести время."),
            F("I'm having a new car.", ["I have a new car.", "I've got a new car.", "I have got a new car."], "«Иметь» — состояние, без -ing.", "У меня новая машина."),
            N("I'm having lunch with Tom tomorrow.", ["Договорённость на будущее", "Привычка: всегда обедаю с Томом", "У меня есть обед для Тома"], "Present Continuous + tomorrow — уже договорились.", "Завтра я обедаю с Томом."),
            S("Официант спрашивает, что вы будете. Вы хотите стейк.", ["I'll have the steak, please.", "I'm having a steak every day.", "I had the steak, please."], "Заказ в ресторане — I'll have…", "Мне стейк, пожалуйста."),
            B("Let's have a coffee.", "Давай выпьем кофе.", "Let's + have + a coffee.")
          ]
        },
        {
          id: "have-to", emoji: "📋", level: "A2",
          title: "have to и don't have to", ru: "надо · не обязательно",
          core: "have to — «надо» (так сложились обстоятельства). don't have to — не «нельзя», а «не обязательно». «Нельзя» — mustn't или can't.",
          key: ["You [don't have to] come.", "Можешь не приходить (не обязательно)."],
          formula: [["+", "have / has to + V"], ["−", "don't / doesn't have to + V — не обязательно"], ["?", "Do you have to + V?"], ["прошлое", "had to + V"], ["будущее", "will have to + V"]],
          sides: [
            { name: "don't have to", means: "не обязательно", ex: ["You [don't have to] pay.", "Платить не нужно."] },
            { name: "mustn't / can't", means: "нельзя", ex: ["You [can't] smoke here.", "Здесь нельзя курить."] }
          ],
          examples: [
            ["I [have to] work tomorrow.", "Мне завтра на работу."],
            ["[Do] you [have to] go?", "Тебе обязательно уходить?"],
            ["I [had to] wait an hour.", "Мне пришлось ждать час."],
            ["We'll [have to] wait and see.", "Придётся подождать и посмотреть."]
          ],
          mistakes: [
            ["I must to go.", "I have to go.", "После must to не ставится; а «надо идти» в разговоре — have to."],
            ["Do you must work?", "Do you have to work?", "Вопрос — Do you have to…?"],
            ["He have to leave.", "He has to leave.", "he → has to."]
          ],
          practice: [
            M("You don't have to bring anything.", ["Можно ничего не приносить", "Нельзя ничего приносить", "Ты должен что-то принести"], "don't have to — не обязательно."),
            C("She ___ to get up at six.", ["has", "have", "is"], "she → has to.", "Ей надо вставать в шесть."),
            C("Yesterday I ___ to stay late.", ["had", "have", "must"], "Прошлое — had to.", "Вчера мне пришлось задержаться."),
            C("You ___ park here — it's not allowed.", ["can't", "don't have to", "haven't to"], "Запрет — can't (mustn't). don't have to — «не обязательно».", "Здесь нельзя парковаться — это запрещено."),
            F("Do you must work tomorrow?", ["Do you have to work tomorrow?"], "Вопрос — Do you have to…?", "Тебе завтра надо работать?"),
            S("Друг спрашивает, нужно ли ему надевать костюм на вечеринку. Ответьте: «Не обязательно».", ["You don't have to.", "You mustn't.", "You haven't."], "Не обязательно — don't have to. mustn't — «нельзя».", "Не обязательно.")
          ]
        },
        {
          id: "have-talk", emoji: "💬", level: "B1",
          title: "Разговорные фразы с have", ru: "have no idea, have a point, have a go",
          core: "Короткие фразы с have, которые носители говорят постоянно. Их стоит знать целиком.",
          key: ["I [have no idea].", "Понятия не имею."],
          phrases: [
            ["have no idea", "понятия не иметь", "I [have no idea] where he is.", "Понятия не имею, где он."],
            ["have a point", "быть правым в чём-то", "OK, you [have a point].", "Ладно, в этом ты прав."],
            ["have a go", "попробовать", "Can I [have a go]?", "Можно я попробую?"],
            ["have a word (with)", "поговорить (коротко)", "Can I [have a word] with you?", "Можно тебя на пару слов?"],
            ["have a seat", "присаживайтесь", "Please [have a seat].", "Присаживайтесь, пожалуйста."],
            ["have a nice day", "хорошего дня", "Thanks, [have a nice day]!", "Спасибо, хорошего дня!"],
            ["have it your way", "как хочешь (с недовольством)", "Fine, [have it your way].", "Ладно, будь по-твоему."]
          ],
          mistakes: [
            ["I have not idea.", "I have no idea.", "no idea — без not."],
            ["Can I have a talk with you a minute?", "Can I have a word with you?", "Короткий разговор — have a word."]
          ],
          practice: [
            M("I have no idea.", ["Понятия не имею", "У меня нет идей для проекта", "Я против"], "have no idea — не знать совсем."),
            M("You have a point.", ["В твоих словах есть смысл", "У тебя есть очки", "Ты показываешь пальцем"], "have a point — быть отчасти правым."),
            C("Can I have a ___ with you?", ["word", "talk to", "speak"], "Коротко поговорить — have a word.", "Можно тебя на пару слов?"),
            C("Why don't you have a ___?", ["go", "do", "make"], "Попробовать — have a go.", "Почему бы тебе не попробовать?"),
            M("Have a seat.", ["Присаживайтесь", "Займите очередь", "Купите билет"], "Have a seat — вежливое «садитесь»."),
            F("I have not idea.", ["I have no idea.", "I've no idea."], "no idea — без not.", "Понятия не имею.")
          ]
        }
      ]
    },

    /* ======================= MAKE и DO ======================= */

    {
      id: "make-do", emoji: "🔨", title: "make и do", ru: "оба «делать» — но в разных сочетаниях",
      core: "По-русски оба — «делать». Общая подсказка: make — что-то появляется (решение, деньги, шум, ошибка), do — работа, занятие, обязанность. Но частые пары проще просто запомнить.",
      myths: [
        { claim: "«Делать» — всегда do.", verdict: "no", topic: "make-do-pairs",
          text: "Зависит от сочетания: make a mistake, make a decision, make money, make friends — но do homework, do the dishes, do sport, do me a favour." }
      ],
      topics: [
        {
          id: "make-do-pairs", emoji: "⚖️", level: "A2",
          title: "make или do", ru: "Самые частые пары",
          core: "make — создать, произвести результат. do — выполнить работу или занятие. Ошибка «did a mistake» — одна из самых заметных у русскоговорящих.",
          key: ["I [made] a mistake.", "Я ошибся."],
          sides: [
            { name: "make", means: "результат: что-то появляется", ex: ["We need to [make] a decision.", "Нам нужно принять решение."] },
            { name: "do", means: "работа, занятие, обязанность", ex: ["I'll [do] the dishes.", "Я помою посуду."] }
          ],
          phrases: [
            ["make a mistake", "ошибиться", "Everyone [makes mistakes].", "Все ошибаются."],
            ["make a decision", "принять решение", "I can't [make a decision].", "Не могу решиться."],
            ["make money", "зарабатывать", "He [makes good money].", "Он хорошо зарабатывает."],
            ["make friends", "заводить друзей", "It's easy to [make friends] here.", "Здесь легко завести друзей."],
            ["make a call", "позвонить", "I need to [make a call].", "Мне нужно позвонить."],
            ["do homework / the dishes", "делать уроки / мыть посуду", "I'll [do the dishes].", "Я помою посуду."],
            ["do the shopping", "ходить за покупками", "I [do the shopping] on Saturdays.", "По субботам я закупаюсь."],
            ["do me a favour", "сделай одолжение", "Can you [do me a favour]?", "Можешь оказать услугу?"],
            ["do your best", "постараться", "Just [do your best].", "Просто постарайся."]
          ],
          mistakes: [
            ["I did a mistake.", "I made a mistake.", "Ошибка — make a mistake."],
            ["Can you make me a favour?", "Can you do me a favour?", "Услуга — do a favour."],
            ["I must make my homework.", "I have to do my homework.", "Уроки — do homework."]
          ],
          practice: [
            C("I ___ a terrible mistake.", ["made", "did", "took"], "Ошибка — make a mistake.", "Я совершил ужасную ошибку."),
            C("Could you ___ me a favour?", ["do", "make", "give"], "Услуга — do a favour.", "Не окажешь мне услугу?"),
            C("It's your turn to ___ the dishes.", ["do", "make", "take"], "Домашние дела — do.", "Твоя очередь мыть посуду."),
            C("He ___ a lot of money last year.", ["made", "did", "took"], "Зарабатывать — make money.", "В прошлом году он заработал много денег."),
            C("We need to ___ a decision today.", ["make", "do", "take on"], "Принять решение — make a decision.", "Нам нужно принять решение сегодня."),
            F("I did a mistake.", ["I made a mistake."], "Ошибка — make a mistake.", "Я ошибся."),
            S("Вы просите друга об услуге.", ["Can you do me a favour?", "Can you make me a favour?", "Can you take me a favour?"], "Услуга — do a favour.", "Можешь оказать мне услугу?")
          ]
        },
        {
          id: "make-talk", emoji: "💬", level: "B1",
          title: "make it, make sense и другие", ru: "Разговорные обороты с make и do",
          core: "make it — «успеть, прийти, справиться»; make sense — «быть логичным»; make sure — «убедиться». А What do you do? — это «Кем ты работаешь?», а не «Что ты делаешь?».",
          key: ["Sorry, I can't [make it] tonight.", "Извини, сегодня не смогу прийти."],
          examples: [
            ["We [made it]!", "Успели! / У нас получилось!"],
            ["That [makes sense].", "Логично. / Понятно."],
            ["[Make sure] you lock the door.", "Обязательно запри дверь."],
            ["What do you [do]?", "Кем ты работаешь?"],
            ["That'll [do].", "Этого хватит."],
            ["Let's [make up].", "Давай помиримся."]
          ],
          sides: [
            { name: "What do you do?", means: "Кем ты работаешь?", ex: ["What do you [do]? — I'm a nurse.", "Кем ты работаешь? — Я медсестра."] },
            { name: "What are you doing?", means: "Что ты делаешь (сейчас)?", ex: ["What are you [doing]? — Cooking.", "Что делаешь? — Готовлю."] }
          ],
          mistakes: [
            ["It doesn't makes sense.", "It doesn't make sense.", "После doesn't — начальная форма."],
            ["That has sense.", "That makes sense.", "«Имеет смысл» — makes sense (калька has sense не работает)."]
          ],
          practice: [
            M("Sorry, I can't make it on Friday.", ["Не смогу прийти в пятницу", "Не смогу это смастерить в пятницу", "Не смогу приготовить в пятницу"], "make it — успеть, прийти."),
            M("What do you do?", ["Кем ты работаешь?", "Что ты делаешь прямо сейчас?", "Что ты будешь делать?"], "What do you do? — вопрос о работе."),
            C("It doesn't ___ sense.", ["make", "do", "have"], "Иметь смысл — make sense.", "Это не имеет смысла."),
            C("___ sure you have your passport.", ["Make", "Do", "Take"], "Убедиться — make sure.", "Проверь, что паспорт с собой."),
            M("We made it!", ["Успели! У нас получилось!", "Мы это изготовили", "Мы это купили"], "make it — справиться, успеть."),
            F("It doesn't makes sense.", ["It doesn't make sense."], "После doesn't — make.", "Это бессмысленно."),
            S("Друг объяснил, почему опоздал, и это звучит логично. Ответьте: «Понятно, логично».", ["That makes sense.", "That does sense.", "That has sense."], "Логично — that makes sense.", "Логично.")
          ]
        }
      ]
    },

    /* ======================= GO и COME ======================= */

    {
      id: "go-come", emoji: "🚶", title: "go и come", ru: "туда и сюда · стать · фразы",
      core: "go — от говорящего («туда»), come — к говорящему или вместе с ним («сюда», «с нами»). Плюс go + прилагательное = «стать», обычно в худшую сторону.",
      myths: [
        { claim: "Если зовут — отвечаешь «I'm going!» («Иду!»).", verdict: "no", topic: "go-come-direction",
          text: "Когда идёте к тому, кто зовёт, — I'm coming! А I'm going значит «я ухожу (от тебя)»." }
      ],
      topics: [
        {
          id: "go-come-direction", emoji: "🧭", level: "A1",
          title: "go или come", ru: "Направление — от вас или к вам",
          core: "come — движение к говорящему или к собеседнику, «с нами». go — от говорящего, куда-то ещё.",
          key: ["— Dinner's ready! — I'm [coming]!", "— Ужин готов! — Иду!"],
          sides: [
            { name: "come", means: "сюда, к тебе, с нами", ex: ["[Come] to my party!", "Приходи ко мне на вечеринку!"] },
            { name: "go", means: "туда, от нас", ex: ["I'm [going] home.", "Я иду домой."] }
          ],
          examples: [
            ["[Come] here!", "Иди сюда!"],
            ["Can I [come] with you?", "Можно с тобой?"],
            ["Let's [go]!", "Пошли!"],
            ["I'm [going] to bed.", "Я спать."]
          ],
          talk: [["Come on!", "Давай! / Ну же! / Да ладно!"], ["Here I come!", "А вот и я!"], ["Coming!", "Иду!"]],
          mistakes: [
            ["I go to home.", "I'm going home.", "home — без to; сейчас — I'm going."],
            ["Come to here.", "Come here.", "here — без to."]
          ],
          practice: [
            S("Мама зовёт вас ужинать. Вы отвечаете: «Иду!»", ["I'm coming!", "I'm going!", "I go!"], "Идёте к тому, кто зовёт, — coming. I'm going — «ухожу».", "Иду!"),
            C("Would you like to ___ to my party?", ["come", "go", "coming"], "Вечеринка у говорящего — движение к нему: come.", "Хочешь прийти ко мне на вечеринку?"),
            C("I'm tired. I'm ___ to bed.", ["going", "coming", "go"], "Ухожу спать — going.", "Я устал. Иду спать."),
            F("I go to home now.", ["I'm going home now.", "I am going home now."], "home без to; сейчас — Present Continuous.", "Я сейчас иду домой."),
            M("Come on!", ["Давай! / Ну же!", "Поднимайся наверх", "Включи свет"], "Come on — подбадривание или «да ладно»."),
            B("Can I come with you?", "Можно мне с тобой?", "come with + кто — присоединиться.")
          ]
        },
        {
          id: "go-become", emoji: "🥛", level: "B1",
          title: "go + прилагательное и фразы с go", ru: "go bad, go wrong · How's it going?",
          core: "go + прилагательное — «стать», обычно резко и в худшую сторону: молоко испортилось, что-то пошло не так. И несколько фраз, которые звучат каждый день.",
          key: ["The milk [has gone] bad.", "Молоко испортилось."],
          sides: [
            { name: "get + прилагательное", means: "обычное изменение", ex: ["I'm [getting] tired.", "Я устаю."] },
            { name: "go + прилагательное", means: "резко, часто в худшую сторону", ex: ["He [went] crazy.", "Он сошёл с ума."] }
          ],
          examples: [
            ["Something [went wrong].", "Что-то пошло не так."],
            ["The video [went viral].", "Видео разлетелось по интернету."],
            ["How's it [going]?", "Как дела?"],
            ["[Go for it]!", "Действуй! Дерзай!"],
            ["[Go ahead].", "Давай, конечно (разрешаю)."]
          ],
          mistakes: [
            ["The video got viral.", "The video went viral.", "Устойчивое сочетание — go viral."],
            ["Something got wrong.", "Something went wrong.", "Пойти не так — go wrong."]
          ],
          practice: [
            C("The milk has ___ bad.", ["gone", "got", "been go"], "Испортиться — go bad.", "Молоко испортилось."),
            C("Something ___ wrong with my laptop.", ["went", "got", "did"], "Пойти не так — go wrong.", "С моим ноутбуком что-то не так."),
            M("Go for it!", ["Действуй! Попробуй!", "Иди за ним", "Иди туда"], "Go for it — поддержка: дерзай."),
            M("How's it going?", ["Как дела?", "Куда ты идёшь?", "Как туда добраться?"], "How's it going? — обычное «как дела?»."),
            M("Go ahead.", ["Давай, конечно (разрешаю)", "Уходи отсюда", "Иди быстрее"], "Go ahead — разрешение: «пожалуйста, давай»."),
            F("The video got viral.", ["The video went viral."], "Устойчивое сочетание — go viral.", "Видео стало вирусным.")
          ]
        },
        {
          id: "come-phrasal", emoji: "🧩", level: "B1",
          title: "Фразовые глаголы с come", ru: "come up with, come across, come over…",
          core: "С частицами come даёт частые глаголы: придумать, наткнуться, зайти в гости. Плюс вопрос How come? — «как так?».",
          key: ["She [came up with] a great idea.", "Она придумала отличную идею."],
          phrases: [
            ["come up with", "придумать", "We need to [come up with] a plan.", "Нам нужно придумать план."],
            ["come across", "случайно наткнуться", "I [came across] an old photo.", "Я наткнулся на старое фото."],
            ["come over", "зайти в гости", "[Come over] tonight!", "Заходи сегодня вечером!"],
            ["come back", "вернуться", "When are you [coming back]?", "Когда ты вернёшься?"],
            ["come in", "войти", "[Come in], please.", "Входите, пожалуйста."],
            ["come from", "быть родом из", "Where do you [come from]?", "Откуда ты родом?"],
            ["How come…?", "как так вышло, что…?", "[How come] you're late?", "Как так вышло, что ты опоздал?"]
          ],
          mistakes: [
            ["Where are you come from?", "Where do you come from?", "come from — обычный глагол: Where do you come from? (или Where are you from?)"],
            ["How come are you late?", "How come you're late?", "После How come — прямой порядок слов."]
          ],
          practice: [
            C("She came ___ with a great idea.", ["up", "across", "over"], "Придумать — come up with.", "Она придумала отличную идею."),
            C("Where do you come ___?", ["from", "of", "out"], "Быть родом — come from.", "Откуда ты родом?"),
            M("How come you're late?", ["Как так вышло, что ты опоздал?", "Как ты пришёл, опоздав?", "Ты придёшь поздно?"], "How come…? — «почему, как так?»."),
            C("Why don't you come ___ tonight? We're having pizza.", ["over", "across", "up"], "Зайти в гости — come over.", "Заходи сегодня вечером — у нас пицца."),
            M("I came across an old photo.", ["Случайно наткнулся на старое фото", "Перешёл через старое фото", "Пришёл за старым фото"], "come across — случайно найти."),
            F("Where are you come from?", ["Where do you come from?", "Where are you from?"], "Либо Where do you come from?, либо Where are you from?", "Откуда ты?")
          ]
        }
      ]
    },

    /* ======================= KEEP ======================= */

    {
      id: "keep", emoji: "🔁", title: "keep", ru: "продолжать · держать · сохранять",
      core: "keep + -ing — «продолжать, всё время». keep + прилагательное или фраза — «держать в каком-то состоянии». Отсюда keep calm, keep in touch, keep it up.",
      myths: [
        { claim: "«Продолжай идти» — Keep to go.", verdict: "no", topic: "keep-main",
          text: "После keep — глагол с -ing: Keep going! He keeps calling me." }
      ],
      topics: [
        {
          id: "keep-main", emoji: "🔁", level: "A2",
          title: "keep doing и фразы с keep", ru: "Keep going! · Keep in touch!",
          core: "keep + -ing — «продолжать» или «всё время, снова и снова» (часто с раздражением). А ещё много фраз: keep in touch, keep the change, keep an eye on.",
          key: ["[Keep going]!", "Не останавливайся! Продолжай!"],
          formula: [["продолжать", "keep + V-ing"], ["снова и снова", "He keeps + V-ing"], ["держать", "keep + прилагательное: keep calm, keep quiet"]],
          examples: [
            ["He [keeps calling] me.", "Он всё время мне звонит."],
            ["[Keep] the change.", "Сдачи не надо."],
            ["Let's [keep in touch].", "Давай будем на связи."],
            ["[Keep it up]!", "Так держать!"],
            ["Can you [keep an eye on] my bag?", "Присмотришь за моей сумкой?"]
          ],
          talk: [["Keep it down!", "Потише!"], ["Keep me posted.", "Держи меня в курсе."], ["Keep calm.", "Сохраняй спокойствие."]],
          mistakes: [
            ["Keep to go!", "Keep going!", "После keep — -ing."],
            ["He keeps to call me.", "He keeps calling me.", "keep + -ing."]
          ],
          practice: [
            C("Don't stop — keep ___!", ["going", "to go", "go"], "keep + -ing.", "Не останавливайся — продолжай!"),
            C("My phone keeps ___ off.", ["switching", "to switch", "switch"], "keep + -ing — всё время.", "Мой телефон всё время выключается."),
            M("Keep in touch!", ["Не пропадай, будем на связи!", "Держи меня за руку", "Не трогай!"], "keep in touch — поддерживать связь."),
            M("Keep the change.", ["Сдачи не надо", "Сохраните чек", "Ничего не меняйте"], "change — здесь «сдача»."),
            F("He keeps to call me at night.", ["He keeps calling me at night."], "keep + -ing.", "Он всё время звонит мне по ночам."),
            S("Друг отлично занимается английским. Подбодрите: «Так держать!»", ["Keep it up!", "Keep it down!", "Keep it on!"], "Так держать — keep it up. keep it down — «потише».", "Так держать!")
          ]
        }
      ]
    },

    /* ======================= PUT ======================= */

    {
      id: "put", emoji: "📥", title: "put", ru: "положить · надеть · отложить · терпеть",
      core: "put — «положить, поставить» (put — put — put, все формы одинаковые). С частицами: put on — надеть, put off — отложить, put up with — терпеть.",
      myths: [
        { claim: "«Я надел куртку» — I put my jacket.", verdict: "partly", topic: "put-main",
          text: "Не хватает частицы: I put on my jacket или I put my jacket on. Без on получится «я положил куртку»." }
      ],
      topics: [
        {
          id: "put-main", emoji: "📥", level: "A2",
          title: "put и фразовые глаголы с put", ru: "put on, put off, put up with",
          core: "put — положить. Частица меняет смысл: put on — надеть, put off — отложить, put up with — терпеть, put away — убрать.",
          key: ["[Put on] a jacket, it's cold.", "Надень куртку, холодно."],
          phrases: [
            ["put", "положить, поставить", "Where did you [put] my keys?", "Куда ты положил мои ключи?"],
            ["put on", "надеть", "[Put on] your coat.", "Надень пальто."],
            ["put off", "отложить", "Let's [put off] the meeting.", "Давай перенесём встречу."],
            ["put up with", "терпеть", "I can't [put up with] this noise.", "Я не могу терпеть этот шум."],
            ["put away", "убрать на место", "[Put away] your toys.", "Убери игрушки."],
            ["put it this way", "скажем так", "Well, [put it this way]: I won't go back.", "Скажем так: больше я туда не пойду."]
          ],
          mistakes: [
            ["I put my coat and went out.", "I put on my coat and went out.", "Надеть — put on."],
            ["Let's put of the meeting.", "Let's put off the meeting.", "Отложить — put off (две f)."],
            ["I put up this noise.", "I put up with this noise.", "Терпеть — put up with."]
          ],
          practice: [
            C("It's cold. ___ on your jacket.", ["Put", "Take", "Get"], "Надеть — put on.", "Холодно. Надень куртку."),
            C("Let's put ___ the meeting until Monday.", ["off", "on", "up"], "Отложить — put off.", "Давай перенесём встречу на понедельник."),
            C("I can't put up ___ his jokes anymore.", ["with", "to", "for"], "Терпеть — put up with.", "Я больше не могу терпеть его шутки."),
            M("Don't put it off.", ["Не откладывай", "Не снимай это", "Не клади это"], "put off — откладывать."),
            F("I put my coat and went out.", ["I put on my coat and went out.", "I put my coat on and went out."], "Надеть — put on.", "Я надел пальто и вышел."),
            B("Where did you put my keys?", "Куда ты положил мои ключи?", "Where did you + put + что?")
          ]
        }
      ]
    },

    /* ======================= LET ======================= */

    {
      id: "let", emoji: "🔓", title: "let", ru: "разрешить · давай · дай мне",
      core: "let — «позволить». В разговоре в основном в готовых фразах: let me know, let me see, let's go, let it go. После let — глагол без to.",
      myths: [
        { claim: "После let ставится to: let me to help.", verdict: "no", topic: "let-main",
          text: "После let — глагол без to: let me help, let's go." }
      ],
      topics: [
        {
          id: "let-main", emoji: "🔓", level: "A2",
          title: "let me, let's и другие", ru: "Let me know · Let's go · Let it go",
          core: "let + кто + глагол без to — «позволить». let's — «давай(те)». let me — «дай(те) я…»: let me see, let me help, let me know.",
          key: ["[Let me know] if you need anything.", "Дай знать, если что-нибудь понадобится."],
          formula: [["позволить", "let + кто + V (без to)"], ["давай", "let's + V · let's not + V"], ["дай я", "let me + V"]],
          examples: [
            ["[Let me] see…", "Дай-ка подумать… / Посмотрим…"],
            ["[Let's] go!", "Пошли!"],
            ["[Let it go].", "Забудь, отпусти."],
            ["My parents [let] me stay up late.", "Родители разрешают мне ложиться поздно."],
            ["Don't [let] me down.", "Не подведи меня."]
          ],
          mistakes: [
            ["Let me to help you.", "Let me help you.", "После let — глагол без to."],
            ["Let's to go.", "Let's go.", "После let's — без to."]
          ],
          practice: [
            C("Let me ___ you with that.", ["help", "to help", "helping"], "После let — без to.", "Давай я тебе с этим помогу."),
            M("Let me know.", ["Дай мне знать", "Позволь мне всё знать", "Я знаю"], "Let me know — сообщи."),
            C("___ go to the beach!", ["Let's", "Let", "Lets to"], "Предложение — Let's + V.", "Пошли на пляж!"),
            M("Don't let me down.", ["Не подведи меня", "Не опускай меня", "Не оставляй меня внизу"], "let down — подвести."),
            F("Let me to explain.", ["Let me explain."], "После let — без to.", "Давай я объясню."),
            S("Вас спросили что-то сложное. Вы хотите сказать «Дай подумать…».", ["Let me think.", "Make me think.", "Let me to think."], "Дай подумать — let me think.", "Дай подумать."),
            B("My parents let me stay out late.", "Родители разрешают мне гулять допоздна.", "let + кто + глагол без to.")
          ]
        }
      ]
    },

    /* ======================= СОКРАЩЕНИЯ ======================= */

    {
      id: "reductions", emoji: "🗣", title: "wanna, gonna, lemme…", ru: "разговорные сокращения глаголов",
      core: "Это не новые глаголы, а быстрое произношение привычных: want to → wanna, going to → gonna, let me → lemme. Их нужно узнавать на слух; писать так — только в неформальных чатах.",
      myths: [
        { claim: "wanna и gonna — ошибки, так говорить нельзя.", verdict: "partly", topic: "reductions-main",
          text: "В речи это норма — так говорят все носители. Но пишут так только в чатах; в письме и на экзамене — want to и going to. И следите за формой: I wanna (= I want to), а не I'm wanna; I'm gonna (= I'm going to), а не I gonna." }
      ],
      topics: [
        {
          id: "reductions-main", emoji: "🗣", level: "A2",
          title: "Сокращения на слух", ru: "gonna, wanna, gimme, lemme, dunno, kinda",
          core: "Сокращение заменяет несколько слов, поэтому вокруг него грамматика полной формы: I'm gonna (= I'm going to), I wanna (= I want to), he wants to (wanna с he/she не говорят).",
          key: ["I['m gonna] call you later.", "Я тебе позже позвоню."],
          phrases: [
            ["gonna", "going to · собираюсь", "I['m gonna] be late.", "Я опоздаю."],
            ["wanna", "want to / want a · хочу", "Do you [wanna] grab a coffee?", "Хочешь выпить кофе?"],
            ["gotta", "have got to · надо", "I [gotta] go.", "Мне надо идти."],
            ["gimme", "give me · дай мне", "[Gimme] a sec.", "Дай секунду."],
            ["lemme", "let me · дай я", "[Lemme] see.", "Дай-ка посмотреть."],
            ["dunno", "don't know · не знаю", "I [dunno].", "Не знаю."],
            ["kinda", "kind of · вроде, немного", "I'm [kinda] tired.", "Я немного устал."],
            ["outta", "out of · из", "Get [outta] here!", "Да ладно! / Убирайся!"]
          ],
          mistakes: [
            ["I'm wanna go.", "I wanna go.", "wanna = want to; am не нужно."],
            ["I gonna call you.", "I'm gonna call you.", "gonna = going to — нужно am."],
            ["She wanna go with us.", "She wants to go with us.", "С he / she — wants to; wanna не подходит."]
          ],
          practice: [
            M("I dunno.", ["Не знаю", "Я не буду", "Я не могу"], "dunno = don't know."),
            M("Lemme see.", ["Дай-ка посмотреть", "Пусть он увидит", "Я вижу"], "lemme = let me."),
            C("I'm ___ call you later.", ["gonna", "wanna", "gotta"], "I'm + gonna (= going to). I'm wanna и I'm gotta не говорят.", "Я тебе позже позвоню."),
            C("Do you ___ grab a coffee?", ["wanna", "gonna", "gotta"], "Do you want to → Do you wanna.", "Хочешь выпить кофе?"),
            F("I'm wanna go home.", ["I wanna go home.", "I want to go home."], "wanna = want to; am не нужно.", "Я хочу домой."),
            F("She wanna go with us.", ["She wants to go with us."], "С she — wants to.", "Она хочет пойти с нами."),
            N("I'm gonna be late.", ["Будущее: я опоздаю", "Обязанность: я должен опоздать", "Желание: я хочу опоздать"], "gonna = going to — будущее.", "Я опоздаю."),
            M("Gimme a sec.", ["Дай секунду", "Дай мне свою секунду", "У меня есть секунда"], "gimme = give me.")
          ]
        }
      ]
    }
  ];

  var verbsById = Object.create(null), topicsById = Object.create(null);
  VERBS.forEach(function (v) {
    verbsById[v.id] = v;
    v.topics.forEach(function (t) {
      t.verb = v.id;
      topicsById[t.id] = t;
      (t.practice || []).forEach(function (ex, i) { ex.key = t.id + ':' + i; ex.topic = t.id; });
    });
  });

  KV.data = {
    verbs: VERBS,
    verbsById: verbsById,
    topicsById: topicsById,
    // ссылки на соседние уроки «Грамматики» (только чтение EG.grammar.data)
    related: ['do-make', 'make-let', 'have-to', 'must-haveto']
  };
})(window.EG = window.EG || {});
