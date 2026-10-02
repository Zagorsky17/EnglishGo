/* grammar/grammar-data.js — содержимое раздела «Грамматика»: времена, «Не путай», конструкции.
   Только данные, без логики и DOM. Всё лежит в EG.grammar.data — других глобальных имён нет.

   Разметка в английских примерах: [ключевая часть] подсвечивается, ___ — пропуск в задании.
   Упражнения: правильный вариант всегда ПЕРВЫЙ в списке — при показе варианты перемешиваются.
     M — «Определи смысл»      (фраза → варианты смысла по-русски)
     N — «Определи время»      (фраза → название времени/конструкции)
     C — «Выбери вариант»      (фраза с ___ → варианты)
     B — «Собери предложение»  (готовое предложение режется на слова и перемешивается)
     F — «Исправь ошибку»      (фраза с ошибкой → список принятых исправлений)
     S — «Ситуация»            (описание ситуации по-русски → подходящая фраза)  */
(function (EG) {
  'use strict';

  var G = EG.grammar = EG.grammar || {};

  function M(text, options, explain) { return { type: 'meaning', text: text, options: options, explain: explain }; }
  function N(text, options, explain) { return { type: 'tense', text: text, options: options, explain: explain }; }
  function C(text, options, explain) { return { type: 'choose', text: text, options: options, explain: explain }; }
  function B(answer, ru, explain) { return { type: 'build', answer: answer, ru: ru, explain: explain }; }
  function F(text, accept, explain) { return { type: 'fix', text: text, accept: accept, explain: explain }; }
  function S(text, options, explain) { return { type: 'situation', text: text, options: options, explain: explain }; }

  var GROUPS = [
    { id: "tenses", title: "Времена", emoji: "⏱", sub: "Что означает каждое время и как его узнать на слух" },
    { id: "compare", title: "Не путай", emoji: "⚖️", sub: "Похожие конструкции рядом — в чём разница" },
    { id: "constructions", title: "Конструкции", emoji: "🧩", sub: "Частые обороты из живой речи" }
  ];

  var TOPICS = [

    /* ======================= ВРЕМЕНА ======================= */

    {
      id: "present-simple", group: "tenses", level: "A1",
      title: "Present Simple", ru: "Обычно, всегда, по расписанию",
      core: "Факт, привычка или расписание — то, что верно «вообще», а не только в эту секунду.",
      key: ["I [work] from home.", "Я работаю из дома — это мой обычный образ жизни."],
      when: [
        "Привычки и повторяющиеся действия: I drink coffee every morning.",
        "Факты и общие истины: Water boils at 100 degrees.",
        "Расписания: The train leaves at seven.",
        "Состояния: I know, I like, I need, I want."
      ],
      signals: ["every day, usually, often, never, always", "окончание -s у he / she / it: she work[s]", "do / does в вопросах и отрицаниях"],
      formula: [["+", "I / you / we / they + V · he / she / it + V-s"], ["−", "don't / doesn't + V"], ["?", "Do / Does + подлежащее + V?"]],
      examples: [
        ["She [works] in a bank.", "Она работает в банке."],
        ["I [don't eat] meat.", "Я не ем мясо."],
        ["[Do] you [live] near here?", "Ты живёшь где-то рядом?"],
        ["The shop [opens] at nine.", "Магазин открывается в девять."]
      ],
      talk: [["What do you do?", "Кем ты работаешь?"], ["I don't get it.", "Не понимаю."], ["It depends.", "Смотря как."]],
      vs: { a: ["I [work] from home.", "обычно, всегда"], b: ["I['m working] from home today.", "сегодня, временно"],
        text: "Simple — как правило. Continuous — прямо сейчас или временно.", link: "ps-vs-pc" },
      mistakes: [
        ["She work in a bank.", "She works in a bank.", "У he / she / it в утверждении нужно окончание -s."],
        ["He don't like it.", "He doesn't like it.", "С he / she / it — doesn't."],
        ["Does she lives here?", "Does she live here?", "-s уже есть в does, поэтому глагол остаётся без -s."]
      ],
      practice: [
        M("I drink coffee every morning.", ["Это моя привычка", "Я пью кофе прямо сейчас", "Я выпил кофе сегодня утром"], "every morning — повторяющееся действие, привычка."),
        C("She ___ in London.", ["lives", "live", "is live"], "she → окончание -s: lives."),
        C("___ you like jazz?", ["Do", "Are", "Does"], "Вопрос в Present Simple с you начинается с Do."),
        N("The train leaves at 6:15.", ["Present Simple", "Present Continuous", "Future Simple"], "Расписание — Present Simple, даже если поезд уходит завтра."),
        F("He don't work on Fridays.", ["He doesn't work on Fridays.", "He does not work on Fridays."], "he → doesn't."),
        B("Where do you work?", "Где ты работаешь?", "Вопрос: вопросительное слово + do + подлежащее + глагол."),
        S("Вы рассказываете о своём обычном дне: во сколько встаёте.", ["I get up at seven.", "I'm getting up at seven.", "I got up at seven."], "Привычный распорядок — Present Simple.")
      ]
    },

    {
      id: "present-continuous", group: "tenses", level: "A1",
      title: "Present Continuous", ru: "Прямо сейчас, временно",
      core: "Действие идёт прямо сейчас или длится какое-то время «в этот период».",
      key: ["I['m cooking]. I'll call you back!", "Я сейчас готовлю — перезвоню!"],
      when: [
        "В момент речи: She's talking on the phone.",
        "Временная ситуация: I'm staying with friends this week.",
        "Договорённость на будущее: We're meeting at six.",
        "Что-то меняется: Prices are going up."
      ],
      signals: ["am / is / are + глагол с -ing", "now, right now, at the moment, today, this week", "Look! Listen! — что-то происходит на глазах"],
      formula: [["+", "am / is / are + V-ing"], ["−", "am not / isn't / aren't + V-ing"], ["?", "Am / Is / Are + подлежащее + V-ing?"]],
      examples: [
        ["I['m watching] a movie.", "Я смотрю фильм."],
        ["She['s working] from home this week.", "На этой неделе она работает из дома."],
        ["What [are] you [doing]?", "Что делаешь?"],
        ["We['re meeting] Tom tonight.", "Сегодня вечером мы встречаемся с Томом (договорились)."]
      ],
      talk: [["I'm just looking, thanks.", "Я просто смотрю, спасибо (в магазине)."], ["Are you kidding me?", "Ты шутишь?"], ["I'm getting there.", "Постепенно получается."]],
      vs: { a: ["She [works] in a bank.", "это её работа"], b: ["She['s working] late today.", "сегодня, временно"],
        text: "Continuous — про «сейчас» и «временно», Simple — про «всегда».", link: "ps-vs-pc" },
      mistakes: [
        ["I am agree.", "I agree.", "agree, know, like, want, need — состояния, а не процессы: -ing с ними обычно не используют."],
        ["She working now.", "She's working now.", "Нельзя пропускать am / is / are."],
        ["I'm knowing the answer.", "I know the answer.", "know — состояние, Continuous не нужен."]
      ],
      practice: [
        M("I'm staying at a hotel this week.", ["Временно, только на эту неделю", "Я всегда живу в отелях", "Я уже уехал из отеля"], "this week + -ing — временная ситуация."),
        C("Be quiet! The baby ___.", ["is sleeping", "sleeps", "slept"], "Прямо сейчас — Present Continuous."),
        C("I ___ what you mean.", ["know", "'m knowing", "am know"], "know — глагол состояния, он остаётся в Simple."),
        N("We're having dinner with Anna on Friday.", ["Present Continuous", "Present Simple", "Future Continuous"], "Договорённость на будущее часто выражают Present Continuous."),
        F("She is work now.", ["She is working now.", "She's working now."], "После is нужен глагол с -ing."),
        B("What are you doing?", "Что ты делаешь?", "Вопрос: what + are + you + doing."),
        S("Друг звонит и спрашивает, чем вы заняты в эту минуту. Вы готовите ужин.", ["I'm cooking dinner.", "I cook dinner.", "I cooked dinner."], "Действие в момент речи — Present Continuous.")
      ]
    },

    {
      id: "past-simple", group: "tenses", level: "A1",
      title: "Past Simple", ru: "Было и закончилось",
      core: "Законченное событие в прошлом. Важно, когда это было: вчера, в 2019 году, в прошлую пятницу.",
      key: ["I [lost] my keys yesterday.", "Я потерял ключи вчера — событие в прошлом."],
      when: [
        "Конкретное событие в прошлом: We met in 2015.",
        "Цепочка событий в рассказе: I got up, had a shower and left.",
        "Привычка в прошлом: I walked to school every day."
      ],
      signals: ["-ed у правильных глаголов: worked, called", "особые формы: went, saw, had, got", "did / didn't в вопросах и отрицаниях", "yesterday, last week, ago, in 2010, when I was a kid"],
      formula: [["+", "V-ed / вторая форма (went, saw)"], ["−", "didn't + V"], ["?", "Did + подлежащее + V?"]],
      examples: [
        ["We [went] to Italy last summer.", "Прошлым летом мы ездили в Италию."],
        ["She [didn't come] to the party.", "Она не пришла на вечеринку."],
        ["[Did] you [see] that?", "Ты это видел?"],
        ["I [moved] here two years ago.", "Я переехал сюда два года назад."]
      ],
      talk: [["How did it go?", "Ну как всё прошло?"], ["I didn't catch that.", "Я не расслышал."], ["What did you say?", "Что ты сказал?"]],
      vs: { a: ["I [lost] my keys yesterday.", "важно когда — вчера"], b: ["I['ve lost] my keys.", "важен результат: ключей нет сейчас"],
        text: "Past Simple — про момент в прошлом, Present Perfect — про последствия сейчас.", link: "past-vs-perfect" },
      mistakes: [
        ["Did you went there?", "Did you go there?", "После did — начальная форма глагола."],
        ["I didn't saw him.", "I didn't see him.", "После didn't — тоже начальная форма."],
        ["I have seen him yesterday.", "I saw him yesterday.", "С yesterday, last week, ago — только Past Simple."]
      ],
      practice: [
        M("We met in 2015.", ["Событие закончилось, известно когда", "Мы встречаемся до сих пор", "Мы встретимся в 2015 году"], "Конкретное время в прошлом — законченное событие."),
        C("I ___ him two days ago.", ["saw", "have seen", "see"], "ago → Past Simple."),
        C("___ you enjoy the film?", ["Did", "Do", "Have"], "Вопрос о прошлом событии — Did."),
        N("She called me last night.", ["Past Simple", "Present Perfect", "Past Continuous"], "last night — конкретное время в прошлом."),
        F("Did you saw my phone?", ["Did you see my phone?"], "После did — see, а не saw."),
        B("I went to bed early.", "Я рано лёг спать.", "Подлежащее + went + остальное."),
        S("Вы рассказываете, что сделали в прошлые выходные: навестили родителей.", ["I visited my parents.", "I've visited my parents.", "I'm visiting my parents."], "Законченное событие в известное время (прошлые выходные) — Past Simple.")
      ]
    },

    {
      id: "past-continuous", group: "tenses", level: "A2",
      title: "Past Continuous", ru: "Шло в какой-то момент в прошлом",
      core: "Процесс, который шёл в определённый момент в прошлом. Часто это фон, на который «падает» другое событие.",
      key: ["I [was cooking] when you called.", "Я готовил (процесс), когда ты позвонил (событие)."],
      when: [
        "Что происходило в конкретный момент: At 8 pm I was watching TV.",
        "Фон для события: I was walking home when it started to rain.",
        "Два процесса одновременно: She was reading while he was cooking."
      ],
      signals: ["was / were + -ing", "when, while, at 5 o'clock yesterday", "в рассказе: длинное действие (фон) + короткое (Past Simple)"],
      formula: [["+", "was / were + V-ing"], ["−", "wasn't / weren't + V-ing"], ["?", "Was / Were + подлежащее + V-ing?"]],
      examples: [
        ["I [was sleeping] when you called.", "Я спал, когда ты позвонил."],
        ["What [were] you [doing] at ten last night?", "Что ты делал вчера в десять вечера?"],
        ["It [was raining] all morning.", "Всё утро шёл дождь."],
        ["We [were talking] about you!", "Мы как раз о тебе говорили!"]
      ],
      talk: [["I was just wondering…", "Я тут подумал… (мягкое начало просьбы)"], ["I was going to call you.", "Я как раз собирался тебе позвонить."], ["Sorry, I wasn't listening.", "Прости, я прослушал."]],
      vs: { a: ["When he came, I [was making] tea.", "я уже заваривал чай, когда он пришёл"], b: ["When he came, I [made] tea.", "он пришёл — и я заварил чай"],
        text: "Continuous — процесс уже шёл. Simple — действие случилось после." },
      mistakes: [
        ["I was sleep when you called.", "I was sleeping when you called.", "После was нужен глагол с -ing."],
        ["They was watching TV.", "They were watching TV.", "they / we / you — were."]
      ],
      practice: [
        M("I was having a shower when the phone rang.", ["Я был в душе, и тут зазвонил телефон", "Сначала зазвонил телефон, потом я пошёл в душ", "Я каждый день принимаю душ"], "was having — процесс-фон, rang — событие, которое его прервало."),
        C("What ___ you doing at nine last night?", ["were", "did", "was"], "С you — were."),
        C("I ___ TV when the lights went out.", ["was watching", "watched", "am watching"], "Фон, который прервало событие, — Past Continuous."),
        N("They were playing football at 5 pm.", ["Past Continuous", "Past Simple", "Present Continuous"], "were + -ing и точный момент в прошлом."),
        F("She were working late yesterday.", ["She was working late yesterday."], "she → was."),
        B("It was raining all day.", "Весь день шёл дождь.", "It + was + raining + остальное."),
        S("Вы объясняете, почему не ответили на звонок: в тот момент вы были за рулём.", ["I was driving.", "I drove.", "I've driven."], "Процесс в момент звонка — Past Continuous.")
      ]
    },

    {
      id: "present-perfect", group: "tenses", level: "A2",
      title: "Present Perfect", ru: "Было раньше — важно сейчас",
      core: "Что-то произошло раньше, но важен результат или опыт сейчас. Когда именно это было — неважно, поэтому время и не называют.",
      key: ["I['ve lost] my keys.", "Я потерял ключи → их нет сейчас, не могу войти домой."],
      when: [
        "Результат сейчас: I've lost my keys.",
        "Жизненный опыт: Have you ever been to Japan?",
        "Новости: They've just announced the results.",
        "Период ещё не закончился: I've drunk three coffees today.",
        "Длится до сих пор (since / for): I've known her for years."
      ],
      signals: ["have / has + третья форма: done, seen, been", "just, already, yet, ever, never, so far, today, this week", "нет точного времени в прошлом (без yesterday, ago)"],
      formula: [["+", "have / has + V3"], ["−", "haven't / hasn't + V3"], ["?", "Have / Has + подлежащее + V3?"]],
      examples: [
        ["I['ve already eaten].", "Я уже поел (и не голоден)."],
        ["[Have] you ever [been] to New York?", "Ты когда-нибудь был в Нью-Йорке?"],
        ["She [hasn't called] yet.", "Она ещё не звонила."],
        ["We['ve known] each other for ten years.", "Мы знакомы десять лет (и сейчас тоже)."],
        ["I['ve just finished].", "Я только что закончил."]
      ],
      talk: [["Have you met Anna?", "Ты знаком с Анной?"], ["I haven't decided yet.", "Я ещё не решил."], ["I've been there.", "Знаю, сам через это прошёл."]],
      vs: { a: ["I['ve been] to London.", "опыт: когда — неважно"], b: ["I [went] to London in May.", "конкретная поездка в мае"],
        text: "Есть точное время в прошлом — Past Simple. Важен опыт или результат — Present Perfect.", link: "past-vs-perfect" },
      mistakes: [
        ["I have seen him yesterday.", "I saw him yesterday.", "Если названо время в прошлом — Past Simple."],
        ["I live here since 2020.", "I've lived here since 2020.", "Началось в прошлом и длится сейчас — Present Perfect, а не Present Simple."],
        ["She have finished.", "She has finished.", "he / she / it — has."],
        ["Did you ever been to Paris?", "Have you ever been to Paris?", "Вопрос об опыте — Have you ever…?"]
      ],
      practice: [
        M("I've already eaten.", ["Я сыт — я поел раньше", "Я ем прямо сейчас", "Я поем позже"], "already + Present Perfect: результат сейчас — я не голоден."),
        M("She's lost her phone.", ["Телефона у неё сейчас нет", "Когда-то давно теряла, но нашла", "Она теряет телефон прямо сейчас"], "Present Perfect — результат: телефон потерян и сейчас."),
        C("I ___ here for three years.", ["have lived", "live", "am living"], "Началось в прошлом и длится до сих пор (for three years) — Present Perfect."),
        C("Have you ___ been to Spain?", ["ever", "yet", "ago"], "Опыт за всю жизнь — ever."),
        N("Have you finished your homework?", ["Present Perfect", "Past Simple", "Present Simple"], "have + V3, важен результат: готово ли сейчас."),
        F("I have seen him yesterday.", ["I saw him yesterday."], "yesterday — точное время в прошлом, поэтому Past Simple."),
        B("I have already eaten.", "Я уже поел.", "already ставится между have и третьей формой."),
        S("Вы работаете в компании с 2020 года и до сих пор. Как сказать?", ["I've worked here since 2020.", "I work here since 2020.", "I worked here since 2020."], "Началось в прошлом и продолжается — Present Perfect + since.")
      ]
    },

    {
      id: "present-perfect-continuous", group: "tenses", level: "B1",
      title: "Present Perfect Continuous", ru: "Длится до сих пор — сколько уже",
      core: "Процесс начался в прошлом и шёл до сих пор (или только что закончился). В центре внимания — длительность или следы процесса.",
      key: ["I['ve been waiting] for an hour!", "Я жду уже час — и всё ещё жду."],
      when: [
        "Сколько уже длится: I've been learning English for two years.",
        "Видны следы процесса: You're out of breath. Have you been running?",
        "Недовольство: Who's been using my laptop?"
      ],
      signals: ["have / has been + -ing", "for, since, all day, lately, recently", "How long have you been…?"],
      formula: [["+", "have / has been + V-ing"], ["−", "haven't / hasn't been + V-ing"], ["?", "Have / Has + подлежащее + been + V-ing?"]],
      examples: [
        ["I['ve been waiting] for you for ages!", "Я тебя целую вечность жду!"],
        ["How long [have] you [been learning] English?", "Сколько ты уже учишь английский?"],
        ["It['s been raining] all day.", "Весь день идёт дождь."],
        ["She['s been working] too hard lately.", "В последнее время она слишком много работает."]
      ],
      talk: [["What have you been up to?", "Чем занимался всё это время?"], ["I've been meaning to call you.", "Всё собирался тебе позвонить."], ["I've been thinking…", "Я тут подумал…"]],
      vs: { a: ["I['ve been painting] the kitchen.", "процесс: руки в краске, может, ещё не закончил"], b: ["I['ve painted] the kitchen.", "результат: кухня покрашена"],
        text: "Continuous — процесс и длительность, Perfect — результат.", link: "perfect-vs-perfect-cont" },
      mistakes: [
        ["I am waiting for an hour.", "I've been waiting for an hour.", "Русское «жду уже час» по-английски — Perfect Continuous."],
        ["I've been knowing her for years.", "I've known her for years.", "know — состояние, -ing с ним не используют."],
        ["She has been work all day.", "She has been working all day.", "После been — глагол с -ing."]
      ],
      practice: [
        M("You look tired. Have you been working all night?", ["Спрашивают о процессе, следы которого видны", "Спрашивают о планах на ночь", "Спрашивают о работе вообще"], "Perfect Continuous: процесс шёл до сих пор, и видны его следы (усталость)."),
        C("I ___ for you for twenty minutes!", ["'ve been waiting", "'m waiting", "wait"], "Длится до сих пор + for — Perfect Continuous."),
        C("How long ___ you been living here?", ["have", "are", "did"], "have + been + -ing."),
        N("It's been snowing since morning.", ["Present Perfect Continuous", "Present Continuous", "Past Continuous"], "'s been + -ing + since — длится с утра до сих пор."),
        F("I'm learning English for five years.", ["I've been learning English for five years.", "I have been learning English for five years."], "Длится пять лет и продолжается — have been + -ing."),
        B("How long have you been waiting?", "Сколько ты уже ждёшь?", "How long + have + you + been + waiting."),
        S("Друг опоздал, и вы уже полчаса стоите на улице. Вы раздражены.", ["I've been standing here for half an hour!", "I'm standing here for half an hour!", "I stood here for half an hour!"], "Длится до сих пор, важна длительность — Perfect Continuous.")
      ]
    },

    {
      id: "past-perfect", group: "tenses", level: "B1",
      title: "Past Perfect", ru: "Раньше другого события в прошлом",
      core: "«Предпрошедшее»: одно действие в прошлом случилось раньше другого. Помогает показать порядок событий.",
      key: ["When I got to the station, the train [had left].", "Я пришёл на вокзал — а поезд уже ушёл."],
      when: [
        "Уже случилось к моменту в прошлом: When we arrived, the film had started.",
        "Причина в рассказе: I was tired because I hadn't slept.",
        "Сожаление: I wish I had known."
      ],
      signals: ["had + V3 (одинаково для всех лиц)", "already, just, before, by the time, by then", "два события в прошлом, одно раньше другого"],
      formula: [["+", "had + V3"], ["−", "hadn't + V3"], ["?", "Had + подлежащее + V3?"]],
      examples: [
        ["The train [had left] when we got there.", "Когда мы пришли, поезд уже ушёл."],
        ["I [hadn't seen] him for years.", "Я не видел его много лет (до той встречи)."],
        ["She was upset because she [had lost] her bag.", "Она расстроилась, потому что потеряла сумку."],
        ["By the time I woke up, everyone [had gone].", "Когда я проснулся, все уже ушли."]
      ],
      talk: [["I'd never seen anything like it.", "Я никогда такого не видел (до того момента)."], ["I wish I had known.", "Жаль, что я не знал."], ["Had you met before?", "Вы раньше встречались?"]],
      vs: { a: ["When I arrived, she [left].", "я пришёл — и она ушла"], b: ["When I arrived, she [had left].", "я пришёл — а её уже не было"],
        text: "Past Perfect показывает, что действие случилось раньше." },
      mistakes: [
        ["When I came, he already left.", "When I came, he had already left.", "Действие раньше другого прошлого — Past Perfect."],
        ["I had went there.", "I had gone there.", "После had — третья форма: gone."]
      ],
      practice: [
        M("When we got to the cinema, the film had started.", ["Фильм начался до нашего прихода", "Фильм начался, когда мы вошли", "Фильм начнётся позже"], "had started — раньше нашего прихода."),
        C("I was hungry because I ___ breakfast.", ["hadn't had", "haven't had", "don't have"], "Причина раньше другого прошлого — Past Perfect."),
        C("By the time we arrived, they ___ all the pizza.", ["had eaten", "have eaten", "eat"], "By the time + прошлое → had + V3."),
        N("She had already gone home when I called.", ["Past Perfect", "Present Perfect", "Past Simple"], "had + V3: ушла раньше моего звонка."),
        F("When I arrived, the party already finished.", ["When I arrived, the party had already finished."], "Вечеринка закончилась раньше моего прихода — had finished."),
        B("I had never seen snow before.", "Я никогда раньше не видел снега.", "had + never + seen."),
        S("Вы рассказываете: пришли на вокзал, а поезда уже не было.", ["The train had left.", "The train left.", "The train has left."], "Поезд ушёл раньше вашего прихода — Past Perfect.")
      ]
    },

    {
      id: "future-simple", group: "tenses", level: "A1",
      title: "Future Simple (will)", ru: "Решил сейчас, обещаю, думаю",
      core: "Решение «здесь и сейчас», обещание, предложение помочь или прогноз в духе «я думаю, будет так».",
      key: ["— It's cold. — I['ll close] the window.", "Решение принято прямо в момент разговора."],
      when: [
        "Спонтанное решение: I'll have the soup.",
        "Обещания и предложения: I'll call you tomorrow. I'll carry that.",
        "Прогноз-мнение: I think it'll rain.",
        "Просьба: Will you help me?"
      ],
      signals: ["will / 'll + глагол", "won't = will not", "I think…, probably, maybe, I'm sure…"],
      formula: [["+", "will ('ll) + V"], ["−", "won't + V"], ["?", "Will + подлежащее + V?"]],
      examples: [
        ["I['ll call] you later.", "Я позвоню тебе позже."],
        ["Don't worry, I [won't tell] anyone.", "Не волнуйся, я никому не скажу."],
        ["I think you['ll like] it.", "Думаю, тебе понравится."],
        ["[Will] you [marry] me?", "Ты выйдешь за меня?"]
      ],
      talk: [["I'll be right back.", "Сейчас вернусь."], ["It won't take long.", "Это ненадолго."], ["I'll have the soup, please.", "Мне, пожалуйста, суп."]],
      vs: { a: ["I['ll get] it!", "решил прямо сейчас (звонят в дверь)"], b: ["I'm [going to buy] a car.", "план, решил заранее"],
        text: "will — решение в момент речи, going to — заранее принятый план.", link: "will-vs-going" },
      mistakes: [
        ["I will to call you.", "I will call you.", "После will — глагол без to."],
        ["If it will rain, we will stay home.", "If it rains, we'll stay home.", "После if и when о будущем — Present Simple."]
      ],
      practice: [
        M("— The phone's ringing. — I'll get it!", ["Решение принято прямо сейчас", "Это давний план", "Я уже ответил на звонок"], "will — спонтанное решение в момент речи."),
        C("Don't worry, I ___ anyone.", ["won't tell", "don't tell", "am not telling"], "Обещание — will / won't."),
        C("If it ___ tomorrow, we'll stay at home.", ["rains", "will rain", "rained"], "После if о будущем — Present Simple."),
        N("I'll send you the file tonight.", ["Future Simple", "be going to", "Present Simple"], "'ll = will: обещание."),
        F("I will to help you.", ["I will help you.", "I'll help you."], "После will — без to."),
        B("I think it will rain.", "Думаю, будет дождь.", "I think + it will + rain."),
        S("Подруге холодно. Вы сразу предлагаете закрыть окно.", ["I'll close the window.", "I close the window tomorrow.", "I closed the window."], "Предложение и решение в момент речи — will.")
      ]
    },

    {
      id: "going-to", group: "tenses", level: "A2",
      title: "be going to", ru: "План или «вот-вот случится»",
      core: "Намерение, которое уже есть в голове. Или прогноз по явным признакам: «сейчас случится».",
      key: ["I'm [going to buy] a new laptop.", "Я собираюсь купить ноутбук — уже решил."],
      when: [
        "Решённые планы: We're going to move next year.",
        "Прогноз по фактам: Look at those clouds! It's going to rain.",
        "В живой речи часто звучит как gonna."
      ],
      signals: ["am / is / are + going to + V", "в речи: gonna", "планы: next week, this summer; явные признаки: Look!"],
      formula: [["+", "am / is / are going to + V"], ["−", "am not / isn't / aren't going to + V"], ["?", "Am / Is / Are + подлежащее + going to + V?"]],
      examples: [
        ["I'm [going to learn] to drive this year.", "В этом году я собираюсь научиться водить."],
        ["Look out! You['re going to fall]!", "Осторожно! Ты сейчас упадёшь!"],
        ["What [are] you [going to do] tonight?", "Что будешь делать вечером?"],
        ["We['re not going to make] it on time.", "Мы не успеем вовремя."]
      ],
      talk: [["I'm gonna be late.", "Я опоздаю."], ["It's going to be fine.", "Всё будет хорошо."], ["What are you gonna do?", "Что будешь делать?"]],
      vs: { a: ["I'm [going to call] her tonight.", "план: решил заранее"], b: ["OK, I['ll call] her.", "решил только что"],
        text: "going to — план и явные признаки, will — решение на месте.", link: "will-vs-going" },
      mistakes: [
        ["I going to call her.", "I'm going to call her.", "Нельзя пропускать am / is / are."],
        ["She is going to calls.", "She is going to call.", "После going to — начальная форма."]
      ],
      practice: [
        M("Look at those clouds! It's going to rain.", ["Есть явные признаки: скоро пойдёт дождь", "Дождь идёт прямо сейчас", "Когда-нибудь, возможно, пойдёт дождь"], "going to — прогноз по тому, что видно сейчас."),
        C("We've decided. We ___ sell the house.", ["'re going to", "will to", "sell"], "Решение принято заранее — going to."),
        C("What ___ you going to do this weekend?", ["are", "do", "will"], "are + you + going to."),
        N("I'm going to start a new job next month.", ["be going to", "Present Continuous", "Future Simple"], "am going to + V — заранее принятый план."),
        F("He going to buy a car.", ["He is going to buy a car.", "He's going to buy a car."], "Нужно is: He is going to…"),
        B("What are you going to do?", "Что ты собираешься делать?", "What + are + you + going to + do."),
        S("Вы давно решили провести лето в Испании и рассказываете об этом.", ["I'm going to visit Spain this summer.", "I visit Spain this summer.", "I visited Spain this summer."], "Заранее принятый план — going to.")
      ]
    },

    {
      id: "future-continuous", group: "tenses", level: "B1",
      title: "Future Continuous", ru: "Будет идти в момент в будущем",
      core: "Процесс, который будет идти в определённый момент в будущем. А ещё — вежливый способ спросить о чужих планах.",
      key: ["This time tomorrow I['ll be flying] to Rome.", "Завтра в это время я буду в полёте."],
      when: [
        "В конкретный момент в будущем: At eight tonight I'll be watching the game.",
        "Само собой разумеющееся: I'll be seeing him at work anyway.",
        "Вежливый вопрос о планах: Will you be using the car tonight?"
      ],
      signals: ["will be + -ing", "this time tomorrow, at 5 pm tomorrow, all day tomorrow"],
      formula: [["+", "will be + V-ing"], ["−", "won't be + V-ing"], ["?", "Will + подлежащее + be + V-ing?"]],
      examples: [
        ["Don't call at nine — I['ll be driving].", "Не звони в девять — я буду за рулём."],
        ["This time next week we['ll be lying] on the beach.", "Через неделю в это время мы будем лежать на пляже."],
        ["[Will] you [be using] the car tonight?", "Ты будешь вечером брать машину?"],
        ["I['ll be working] late, so don't wait for me.", "Я буду работать допоздна, не жди меня."]
      ],
      talk: [["I'll be waiting.", "Буду ждать."], ["We'll be landing shortly.", "Скоро мы совершим посадку."], ["Will you be joining us?", "Вы к нам присоединитесь?"]],
      vs: { a: ["I['ll call] you at eight.", "действие: в восемь позвоню"], b: ["I['ll be having] dinner at eight.", "процесс: в восемь буду ужинать"],
        text: "Future Simple — одно действие, Future Continuous — процесс в момент будущего." },
      mistakes: [
        ["I will driving at nine.", "I will be driving at nine.", "Не забывайте be."],
        ["This time tomorrow I will fly to Rome.", "This time tomorrow I will be flying to Rome.", "Процесс в момент будущего — will be + -ing."]
      ],
      practice: [
        M("This time tomorrow I'll be sitting on a plane.", ["Завтра в это время я буду лететь", "Я сажусь в самолёт прямо сейчас", "Я уже прилетел"], "will be + -ing — процесс в момент будущего."),
        C("Don't call me at ten — I ___.", ["'ll be sleeping", "sleep", "slept"], "В десять будет идти процесс — Future Continuous."),
        C("___ you be using your laptop tonight?", ["Will", "Are", "Do"], "Вежливый вопрос о планах: Will you be + -ing?"),
        N("At noon tomorrow we'll be having lunch.", ["Future Continuous", "Future Simple", "Present Continuous"], "'ll be + -ing + момент в будущем."),
        F("I will be work all day tomorrow.", ["I will be working all day tomorrow.", "I'll be working all day tomorrow."], "После be — -ing."),
        B("I will be waiting for you.", "Я буду тебя ждать.", "will + be + waiting."),
        S("Коллега хочет созвониться завтра в три, но в это время у вас встреча с клиентом.", ["I'll be meeting a client at three.", "I met a client at three.", "I meet a client at three every day."], "Процесс в конкретный момент будущего — Future Continuous.")
      ]
    },

    {
      id: "future-perfect", group: "tenses", level: "B2",
      title: "Future Perfect", ru: "Будет сделано к сроку",
      core: "Что-то будет уже сделано к определённому моменту в будущем. Смотрим из будущего назад.",
      key: ["By Friday I['ll have finished] the project.", "К пятнице проект уже будет готов."],
      when: [
        "Срок: By 2030 I'll have paid off the loan.",
        "Подсчёт к моменту: Next month we'll have been married for ten years."
      ],
      signals: ["will have + V3", "by Friday, by then, by the time, by the end of the year"],
      formula: [["+", "will have + V3"], ["−", "won't have + V3"], ["?", "Will + подлежащее + have + V3?"]],
      examples: [
        ["I['ll have finished] by six.", "К шести я закончу."],
        ["By the time you arrive, we['ll have eaten].", "Когда ты приедешь, мы уже поедим."],
        ["She [won't have read] it by tomorrow.", "К завтрашнему дню она это ещё не прочитает."],
        ["Next year I['ll have worked] here for ten years.", "В следующем году будет десять лет, как я здесь работаю."]
      ],
      talk: [["I'll have done it by then.", "К тому времени я это сделаю."], ["Will you have finished by Monday?", "Ты успеешь закончить к понедельнику?"]],
      vs: { a: ["I['ll finish] it on Friday.", "закончу в пятницу"], b: ["I['ll have finished] it by Friday.", "к пятнице уже будет готово, может, и раньше"],
        text: "by + срок — сигнал Future Perfect." },
      mistakes: [
        ["By Monday I will finish it already.", "By Monday I will have finished it.", "by + срок → will have + V3."],
        ["I will have finish by six.", "I will have finished by six.", "После have — третья форма."]
      ],
      practice: [
        M("By 10 pm I'll have finished the report.", ["К 22:00 отчёт уже будет готов", "Я начну отчёт в 22:00", "Я закончил отчёт вчера в 22:00"], "will have + V3 — готово к сроку."),
        C("By the end of the year, I ___ twenty books.", ["will have read", "will read", "have read"], "by the end of the year — срок → Future Perfect."),
        C("Don't worry, we ___ finished by the time you come back.", ["will have", "have", "had"], "will have + V3: к твоему возвращению уже закончим."),
        N("By June they'll have built the bridge.", ["Future Perfect", "Future Simple", "Present Perfect"], "'ll have + V3 + by June."),
        F("By tomorrow I will have write the essay.", ["By tomorrow I will have written the essay.", "By tomorrow I'll have written the essay."], "После have — третья форма: written."),
        B("I will have finished by Monday.", "К понедельнику я закончу.", "will + have + finished + by…"),
        S("Вы обещаете начальнику, что отчёт будет готов к пятнице.", ["I'll have finished the report by Friday.", "I've finished the report by Friday.", "I finished the report by Friday."], "Готово к сроку в будущем — Future Perfect.")
      ]
    },

    /* ======================= НЕ ПУТАЙ ======================= */

    {
      id: "ps-vs-pc", group: "compare", level: "A1",
      title: "Present Simple vs Present Continuous", ru: "Обычно или прямо сейчас?",
      core: "Simple — как обычно, вообще. Continuous — прямо сейчас или временно.",
      sides: [
        { name: "Present Simple", means: "привычка, факт, постоянное", ex: ["I [work] in an office.", "Я работаю в офисе (это моя работа)."] },
        { name: "Present Continuous", means: "сейчас, временно, процесс", ex: ["I['m working] from home this week.", "На этой неделе я работаю из дома."] }
      ],
      signals: ["usually, every day, often → Simple", "now, at the moment, this week, Look! → Continuous", "know, like, want, need, believe почти всегда в Simple"],
      mistakes: [
        ["I'm usually going to work by bus.", "I usually go to work by bus.", "usually — привычка, значит Simple."],
        ["Look! It rains.", "Look! It's raining.", "Происходит на глазах — Continuous."]
      ],
      practice: [
        C("Listen! Somebody ___ at the door.", ["is knocking", "knocks", "knock"], "Listen! — прямо сейчас."),
        C("He ___ to the gym three times a week.", ["goes", "is going", "go"], "three times a week — привычка."),
        C("I ___ you're right.", ["think", "'m thinking", "thinking"], "think в значении «считаю» — состояние, Simple."),
        M("She's living with her parents at the moment.", ["Временно живёт у родителей", "Всегда жила и живёт с родителями", "Раньше жила с родителями"], "at the moment + -ing — временно."),
        S("Вас спрашивают, чем вы зарабатываете на жизнь. Вы учитель английского.", ["I teach English.", "I am teach English.", "I taught English."], "Профессия — постоянное, Present Simple.")
      ]
    },

    {
      id: "past-vs-perfect", group: "compare", level: "A2",
      title: "Past Simple vs Present Perfect", ru: "Когда было — или что сейчас?",
      core: "Past Simple отвечает на вопрос «когда это было?». Present Perfect — «что из этого сейчас?».",
      sides: [
        { name: "Past Simple", means: "конкретное событие, время известно", ex: ["I [went] to London last year.", "Я ездил в Лондон в прошлом году."] },
        { name: "Present Perfect", means: "опыт или результат сейчас, время неважно", ex: ["I['ve been] to London.", "Я бывал в Лондоне."] }
      ],
      signals: ["yesterday, ago, last…, in 2019 → Past Simple", "ever, never, just, already, yet, so far, since → Present Perfect", "вопрос When…? — всегда Past Simple"],
      mistakes: [
        ["When have you arrived?", "When did you arrive?", "When… спрашивает о времени — Past Simple."],
        ["I have finished it two hours ago.", "I finished it two hours ago.", "ago → Past Simple."]
      ],
      practice: [
        C("I ___ that film. Let's watch something else.", ["'ve seen", "saw", "see"], "Важен результат сейчас: я его уже знаю."),
        C("We ___ in Paris in 2018.", ["were", "have been", "are"], "in 2018 — точное время, Past Simple."),
        C("___ you ever eaten sushi?", ["Have", "Did", "Do"], "Опыт за жизнь — Have you ever…?"),
        M("I've lost my wallet.", ["Кошелька нет до сих пор", "Когда-то терял, но нашёл", "Потеряю в будущем"], "Present Perfect — результат сейчас."),
        F("When have you met her?", ["When did you meet her?"], "When → Past Simple.")
      ]
    },

    {
      id: "perfect-vs-perfect-cont", group: "compare", level: "B1",
      title: "Present Perfect vs Perfect Continuous", ru: "Результат или процесс?",
      core: "Perfect — результат: «сколько сделано». Perfect Continuous — процесс: «как долго».",
      sides: [
        { name: "Present Perfect", means: "результат, количество", ex: ["I['ve written] three emails.", "Я написал три письма."] },
        { name: "Perfect Continuous", means: "длительность, процесс", ex: ["I['ve been writing] emails all morning.", "Я всё утро пишу письма."] }
      ],
      signals: ["how many / how much, число → Present Perfect", "how long, all day, for hours → Perfect Continuous", "состояния (know, have, be) — только Present Perfect: I've known him for years."],
      mistakes: [
        ["I've been writing three emails.", "I've written three emails.", "Есть количество — это результат."],
        ["I've been knowing him since school.", "I've known him since school.", "know — состояние."]
      ],
      practice: [
        C("She ___ ten kilometres today.", ["has run", "has been running", "runs"], "Есть результат-число — Present Perfect."),
        C("I'm so tired. I ___ all day.", ["'ve been working", "'m work", "had worked"], "Длительность и следы процесса — Perfect Continuous."),
        C("I ___ this book three times.", ["have read", "have been reading", "am reading"], "three times — результат, количество."),
        M("Your eyes are red. Have you been crying?", ["Спрашивают о процессе, следы которого видны", "Спрашивают, сколько раз ты плакал", "Спрашивают о будущем"], "Perfect Continuous — видны следы процесса."),
        C("How long have you ___ for me?", ["been waiting", "wait", "waiting"], "How long — длительность: been + -ing.")
      ]
    },

    {
      id: "will-vs-going", group: "compare", level: "A2",
      title: "will vs going to", ru: "Решил сейчас или заранее?",
      core: "will — решаю прямо сейчас. going to — решил заранее.",
      sides: [
        { name: "will", means: "решение в момент речи, обещание, мнение о будущем", ex: ["— We're out of milk. — I['ll buy] some.", "— Молоко закончилось. — Я куплю."] },
        { name: "going to", means: "план, намерение; прогноз по признакам", ex: ["I'm [going to buy] milk after work.", "После работы я куплю молока (план)."] }
      ],
      signals: ["I think / probably / I promise → will", "план уже есть или видны признаки (Look!) → going to", "в прогнозах-мнениях часто подходят оба"],
      mistakes: [
        ["Look at the sky! It will rain.", "Look at the sky! It's going to rain.", "Есть явный признак — going to."],
        ["I'm going to answer! (звонит телефон)", "I'll answer it!", "Решение в момент звонка — will."]
      ],
      practice: [
        S("Звонят в дверь. Вы решаете открыть.", ["I'll get it!", "I'm going to get it next week!", "I got it!"], "Решение на месте — will."),
        C("We ___ get married in June. We've booked everything.", ["'re going to", "'ll to", "get"], "Всё забронировано — план, going to."),
        M("I'm going to quit my job.", ["Я уже решил и собираюсь это сделать", "Решил только что, в разговоре", "Я уже уволился"], "going to — заранее принятое решение."),
        M("— I can't open this. — I'll help you.", ["Предложение помощи — решение прямо сейчас", "Давно запланированная помощь", "Помощь в прошлом"], "will — спонтанное предложение помочь."),
        C("Look out! That glass ___ fall!", ["is going to", "will to", "falls"], "Явный признак: вот-вот упадёт.")
      ]
    },

    {
      id: "used-vs-would", group: "compare", level: "B1",
      title: "used to vs would", ru: "Как было раньше",
      core: "Оба — о привычках в прошлом. used to подходит и для состояний (жил, был, имел), would — только для повторяющихся действий.",
      sides: [
        { name: "used to", means: "привычки и состояния в прошлом, которых больше нет", ex: ["I [used to live] in a small town.", "Раньше я жил в маленьком городе."] },
        { name: "would", means: "повторяющиеся действия в воспоминаниях", ex: ["Every summer we [would go] to the sea.", "Каждое лето мы ездили на море."] }
      ],
      signals: ["состояния (live, be, have, like, know) → только used to", "would — обычно в рассказе, когда уже понятно, что речь о прошлом", "used to подходит всегда, would — не всегда"],
      mistakes: [
        ["I would live in London.", "I used to live in London.", "live — состояние, would здесь нельзя."],
        ["I use to play tennis.", "I used to play tennis.", "В утверждении — used."],
        ["Did you used to smoke?", "Did you use to smoke?", "После did — use без d."]
      ],
      practice: [
        C("I ___ have long hair.", ["used to", "would", "use to"], "have (иметь) — состояние: только used to."),
        C("When I was a kid, my grandma ___ tell me stories every night.", ["would", "was", "use to"], "Повторяющееся действие в воспоминаниях — would (used to тоже подошло бы)."),
        M("I used to smoke.", ["Раньше курил, теперь нет", "Курю и сейчас", "Привык к курению"], "used to — было раньше, сейчас нет."),
        F("I didn't used to like coffee.", ["I didn't use to like coffee."], "После didn't — use без d."),
        C("We ___ to be friends.", ["used", "would", "use"], "be — состояние: used to.")
      ]
    },

    {
      id: "say-tell", group: "compare", level: "A2",
      title: "say vs tell", ru: "Сказать что-то или сказать кому-то",
      core: "say — сказать слова. tell — сказать кому-то, рассказать. После tell обычно стоит человек.",
      sides: [
        { name: "say", means: "say something, say to someone", ex: ["She [said] she was tired.", "Она сказала, что устала."] },
        { name: "tell", means: "tell someone something, tell a story", ex: ["She [told me] she was tired.", "Она сказала мне, что устала."] }
      ],
      signals: ["tell + человек: tell me, tell him", "say + to + человек (реже): say to me", "устойчиво: tell the truth, tell a lie, tell a joke, tell a story; say hello, say sorry, say yes"],
      mistakes: [
        ["He said me the truth.", "He told me the truth.", "Человек после глагола → tell."],
        ["She told that she was busy.", "She said that she was busy.", "После tell нужен человек."],
        ["Say me!", "Tell me!", "«Скажи мне» — Tell me."]
      ],
      practice: [
        C("Can you ___ me the time?", ["tell", "say", "speak"], "tell + me."),
        C("What did she ___?", ["say", "tell", "talk"], "Без человека — say."),
        C("Always ___ the truth.", ["tell", "say", "speak"], "Устойчиво: tell the truth."),
        C("He ___ hello and left.", ["said", "told", "spoke"], "Устойчиво: say hello."),
        F("She said me about her trip.", ["She told me about her trip."], "Есть человек (me) — told.")
      ]
    },

    {
      id: "do-make", group: "compare", level: "A2",
      title: "do vs make", ru: "Делать или создавать?",
      core: "do — делать, выполнять (дела, работу, задачи). make — создавать, производить что-то новое.",
      sides: [
        { name: "do", means: "работа, обязанности, действие вообще", ex: ["I [do] the dishes every night.", "Я мою посуду каждый вечер."] },
        { name: "make", means: "создать результат", ex: ["I [made] a cake.", "Я испёк торт."] }
      ],
      signals: ["do: homework, the dishes, the shopping, sport, a favour, your best", "make: a mistake, a decision, money, friends, a call, a plan, noise, coffee, sense", "do something / do nothing — неопределённое действие"],
      mistakes: [
        ["I did a mistake.", "I made a mistake.", "Устойчиво: make a mistake."],
        ["Can you make me a favour?", "Can you do me a favour?", "Устойчиво: do a favour."],
        ["I need to make my homework.", "I need to do my homework.", "Устойчиво: do homework."]
      ],
      practice: [
        C("I've ___ a decision.", ["made", "done", "did"], "make a decision."),
        C("Could you ___ me a favour?", ["do", "make", "give"], "do a favour."),
        C("Let's ___ some coffee.", ["make", "do", "create"], "make coffee — приготовить."),
        C("It doesn't ___ sense.", ["make", "do", "have"], "make sense — иметь смысл."),
        F("She does a lot of money.", ["She makes a lot of money."], "make money — зарабатывать.")
      ]
    },

    {
      id: "since-for", group: "compare", level: "A2",
      title: "since vs for", ru: "С какого момента или сколько?",
      core: "for — сколько времени длится. since — с какого момента.",
      sides: [
        { name: "for", means: "период: for two hours, for a week, for ages", ex: ["I've lived here [for] five years.", "Я живу здесь пять лет."] },
        { name: "since", means: "точка начала: since Monday, since 2010", ex: ["I've lived here [since] 2020.", "Я живу здесь с 2020 года."] }
      ],
      signals: ["можно спросить «сколько?» → for", "можно спросить «с каких пор?» → since", "чаще всего — с Present Perfect"],
      mistakes: [
        ["I've known her since five years.", "I've known her for five years.", "five years — период → for."],
        ["I live here since 2019.", "I've lived here since 2019.", "Длится до сих пор — Present Perfect."]
      ],
      practice: [
        C("I've been waiting ___ twenty minutes.", ["for", "since", "from"], "Период → for."),
        C("We've been friends ___ school.", ["since", "for", "from"], "Точка начала → since."),
        C("She's worked here ___ March.", ["since", "for", "during"], "С марта → since."),
        C("I haven't seen him ___ ages.", ["for", "since", "ago"], "for ages — целую вечность."),
        S("Вы говорите, что знаете друга со школы.", ["I've known him since school.", "I know him since school.", "I've known him for school."], "Длится до сих пор + точка начала: have known + since.")
      ]
    },

    {
      id: "much-many", group: "compare", level: "A1",
      title: "much vs many", ru: "Сколько — штук или вещества?",
      core: "many — с тем, что можно посчитать (people, books). much — с тем, что не считается (money, time, water).",
      sides: [
        { name: "many", means: "исчисляемые во множественном числе", ex: ["How [many] people came?", "Сколько человек пришло?"] },
        { name: "much", means: "неисчисляемые", ex: ["I don't have [much] time.", "У меня немного времени."] }
      ],
      signals: ["можно сказать «один, два…» → many", "money, time, water, information, advice, work → much", "в утверждениях вместо much чаще говорят a lot of: I have a lot of work."],
      mistakes: [
        ["How much people?", "How many people?", "people можно посчитать."],
        ["I have many money.", "I have a lot of money.", "money не считается; в утверждении естественнее a lot of."],
        ["many informations", "a lot of information", "information не имеет множественного числа."]
      ],
      practice: [
        C("How ___ does it cost?", ["much", "many", "lot"], "О цене — How much."),
        C("How ___ times have you been there?", ["many", "much", "lot"], "times можно посчитать."),
        C("I don't have ___ friends here.", ["many", "much", "a lot"], "friends — исчисляемые."),
        C("There isn't ___ milk left.", ["much", "many", "few"], "milk — неисчисляемое."),
        F("He gave me many advices.", ["He gave me a lot of advice.", "He gave me some advice.", "He gave me lots of advice."], "advice не имеет множественного числа.")
      ]
    },

    {
      id: "few-little", group: "compare", level: "A2",
      title: "few vs little", ru: "Мало — штук или вещества?",
      core: "few — мало того, что считается. little — мало того, что не считается. С a — «немного, но есть». Без a — «мало, почти нет».",
      sides: [
        { name: "(a) few", means: "friends, days, people", ex: ["I have [a few] friends here.", "У меня здесь есть несколько друзей."] },
        { name: "(a) little", means: "time, money, water", ex: ["I have [a little] time.", "У меня есть немного времени."] }
      ],
      signals: ["a few / a little — позитивно: немного есть", "few / little — негативно: почти нет", "He has few friends. — Друзей почти нет."],
      mistakes: [
        ["I need a few money.", "I need a little money.", "money не считается → little."],
        ["There are little people here.", "There are few people here.", "people считаются → few."]
      ],
      practice: [
        C("Can I ask you a ___ questions?", ["few", "little", "much"], "questions считаются → a few."),
        C("I speak a ___ French.", ["little", "few", "many"], "Язык — неисчисляемое → a little."),
        M("He has few friends.", ["Друзей почти нет", "У него есть несколько друзей", "У него много друзей"], "few без a — «почти нет»."),
        M("We have a little time.", ["Немного времени есть — успеем", "Времени совсем нет", "Времени очень много"], "a little — немного, но есть."),
        C("Add a ___ salt.", ["little", "few", "many"], "salt — неисчисляемое.")
      ]
    },

    {
      id: "some-any", group: "compare", level: "A1",
      title: "some vs any", ru: "Утверждение или вопрос и отрицание?",
      core: "some — в утверждениях, просьбах и предложениях. any — в вопросах и отрицаниях.",
      sides: [
        { name: "some", means: "утверждения, просьбы, предложения", ex: ["Would you like [some] coffee?", "Хочешь кофе?"] },
        { name: "any", means: "вопросы и отрицания", ex: ["We don't have [any] milk.", "У нас нет молока."] }
      ],
      signals: ["утверждение → some", "отрицание, обычный вопрос → any", "просьба или предложение → some: Can I have some water?", "any в утверждении = «любой»: Call me any time."],
      mistakes: [
        ["I don't have some time.", "I don't have any time.", "Отрицание → any."],
        ["There is any milk in the fridge.", "There is some milk in the fridge.", "Утверждение → some."]
      ],
      practice: [
        C("I didn't buy ___ bread.", ["any", "some", "no"], "Отрицание → any."),
        C("Can I have ___ water, please?", ["some", "any", "no"], "Просьба → some."),
        C("There's ___ cheese in the fridge.", ["some", "any", "many"], "Утверждение → some."),
        M("Call me any time.", ["Звони в любое время", "Никогда не звони", "Звони иногда"], "any в утверждении = «любой»."),
        F("I haven't got some friends here.", ["I haven't got any friends here.", "I don't have any friends here."], "Отрицание → any.")
      ]
    },

    {
      id: "must-haveto", group: "compare", level: "A2",
      title: "must vs have to", ru: "Сам решил или так надо?",
      core: "must — я сам считаю, что надо (или строгое правило). have to — так требуют обстоятельства. Главная разница — в отрицании!",
      sides: [
        { name: "must", means: "внутреннее убеждение, правила, надписи", ex: ["I [must] call Mum.", "Мне надо позвонить маме (сам так решил)."] },
        { name: "have to", means: "внешняя необходимость", ex: ["I [have to] wear a uniform at work.", "На работе я обязан носить форму."] }
      ],
      signals: ["mustn't = нельзя: You mustn't smoke here.", "don't have to = не обязательно: You don't have to come.", "в прошлом — только had to: I had to wait."],
      mistakes: [
        ["You mustn't come if you're busy.", "You don't have to come if you're busy.", "mustn't — запрет, а здесь «не обязательно»."],
        ["She must to go.", "She must go.", "После must — без to."],
        ["Yesterday I must work.", "Yesterday I had to work.", "У must нет прошедшего времени — had to."]
      ],
      practice: [
        M("You don't have to pay.", ["Платить не обязательно", "Платить запрещено", "Нужно заплатить"], "don't have to — не обязательно."),
        M("You mustn't park here.", ["Здесь парковаться запрещено", "Здесь можно не парковаться", "Здесь надо парковаться"], "mustn't — запрет."),
        C("Yesterday I ___ work late.", ["had to", "must", "must to"], "Прошлое — had to."),
        C("It's Sunday, so I ___ get up early.", ["don't have to", "mustn't", "must"], "Не обязательно, но можно — don't have to."),
        C("She ___ wear glasses to drive.", ["has to", "have to", "must to"], "she → has to.")
      ]
    },

    {
      id: "should-haveto", group: "compare", level: "A2",
      title: "should vs have to", ru: "Совет или обязанность?",
      core: "should — совет: «стоит, лучше бы». have to — обязанность: «придётся, без вариантов».",
      sides: [
        { name: "should", means: "совет, мнение", ex: ["You [should] see a doctor.", "Тебе стоит сходить к врачу."] },
        { name: "have to", means: "необходимость, правило", ex: ["You [have to] show your passport.", "Нужно показать паспорт (иначе не пустят)."] }
      ],
      signals: ["совет, рекомендация → should", "правило, закон, выбора нет → have to", "shouldn't — не стоит; don't have to — не обязательно"],
      mistakes: [
        ["You should to try it.", "You should try it.", "После should — без to."],
        ["He shoulds go.", "He should go.", "У should не бывает -s."]
      ],
      practice: [
        S("Друг жалуется на головную боль. Вы советуете отдохнуть.", ["You should rest.", "You should to rest.", "You shoulds rest."], "Совет — should + глагол без to."),
        S("Вы объясняете туристу правило музея: сумку нужно сдать в гардероб.", ["You have to leave your bag in the cloakroom.", "You should to leave your bag in the cloakroom.", "You has to leave your bag in the cloakroom."], "Правило без вариантов — have to."),
        C("You ___ eat so much sugar. It's bad for you.", ["shouldn't", "don't have to", "haven't to"], "Совет «не стоит» — shouldn't."),
        M("You don't have to bring anything.", ["Можно ничего не приносить", "Приносить запрещено", "Обязательно что-нибудь принеси"], "don't have to — не обязательно."),
        F("You should to call her.", ["You should call her."], "После should — без to.")
      ]
    },

    {
      id: "can-could", group: "compare", level: "A1",
      title: "can vs could", ru: "Могу или мог / вежливее",
      core: "can — могу сейчас, умею. could — мог в прошлом, вежливая просьба или осторожное «возможно».",
      sides: [
        { name: "can", means: "умение, возможность, разрешение сейчас", ex: ["I [can] swim.", "Я умею плавать."] },
        { name: "could", means: "умение в прошлом, вежливая просьба, предположение", ex: ["[Could] you help me?", "Не могли бы вы мне помочь?"] }
      ],
      signals: ["Could you…? звучит вежливее, чем Can you…?", "прошлое: When I was five, I could read.", "возможность: It could be true. — Может, это и правда."],
      mistakes: [
        ["I can to swim.", "I can swim.", "После can — без to."],
        ["Yesterday I can't sleep.", "Yesterday I couldn't sleep.", "Прошлое — couldn't."],
        ["He cans drive.", "He can drive.", "У can не бывает -s."]
      ],
      practice: [
        C("When I was a child, I ___ climb trees.", ["could", "can", "can to"], "Умение в прошлом — could."),
        C("___ you pass the salt, please?", ["Could", "Should", "Must"], "Вежливая просьба — Could you…?"),
        M("It could be dangerous.", ["Возможно, это опасно", "Раньше это было опасно, сейчас нет", "Это точно опасно"], "could — осторожное предположение."),
        C("I ___ hear you. The music is too loud.", ["can't", "couldn't to", "mustn't"], "Не могу сейчас — can't."),
        F("Last night I can't sleep.", ["Last night I couldn't sleep.", "Last night I could not sleep."], "Прошлое — couldn't.")
      ]
    },

    {
      id: "may-might", group: "compare", level: "A2",
      title: "may vs might", ru: "Может быть — насколько уверенно?",
      core: "Оба значат «может быть». may — чуть увереннее и официальнее, might — менее уверенно и чаще в разговоре. Ещё may — вежливое «можно?».",
      sides: [
        { name: "may", means: "возможность, вежливое разрешение", ex: ["[May] I come in?", "Можно войти?"] },
        { name: "might", means: "возможность, меньше уверенности", ex: ["I [might] be late.", "Возможно, я опоздаю."] }
      ],
      signals: ["May I…? — вежливо просим разрешения", "might — частый выбор в разговоре о планах: I might go.", "после may / might — глагол без to"],
      mistakes: [
        ["I might to come.", "I might come.", "После might — без to."],
        ["It mays rain.", "It may rain.", "У may не бывает -s."]
      ],
      practice: [
        C("___ I ask you a question?", ["May", "Might", "Must"], "Вежливо просим разрешения — May I…?"),
        M("I might go to the party.", ["Возможно, пойду — не уверен", "Точно пойду", "Мне разрешили пойти"], "might — неуверенная возможность."),
        C("Take an umbrella. It ___ rain later.", ["might", "must", "can to"], "Возможность — might."),
        F("She may to know the answer.", ["She may know the answer."], "После may — без to."),
        S("Друг зовёт в кино, а вы ещё не решили.", ["I might come.", "I must come.", "I may to come."], "Неуверенно «может, приду» — might.")
      ]
    },

    /* ======================= КОНСТРУКЦИИ ======================= */

    {
      id: "there-is", group: "constructions", level: "A1",
      title: "there is / there are", ru: "Где-то что-то есть",
      core: "Так говорят, что что-то где-то есть или находится. Русское «есть, имеется».",
      key: ["[There's] a café near my house.", "Рядом с моим домом есть кафе."],
      when: ["Наличие: There's a problem.", "Что где находится: There are two parks in my area.", "Вопрос: Is there a bank near here?"],
      signals: ["There is / There's + один предмет", "There are + несколько", "Is there…? Are there…? There isn't / There aren't"],
      formula: [["+", "There is + ед. ч. / There are + мн. ч."], ["−", "There isn't / There aren't (any)"], ["?", "Is there…? / Are there…?"], ["прошлое", "There was / There were"]],
      examples: [
        ["[There's] a problem with my order.", "С моим заказом проблема."],
        ["[Are there] any good restaurants around here?", "Здесь поблизости есть хорошие рестораны?"],
        ["[There weren't] many people at the party.", "На вечеринке было немного людей."],
        ["[There's] nothing to worry about.", "Не о чем беспокоиться."]
      ],
      talk: [["Is there anything I can do?", "Я могу чем-нибудь помочь?"], ["There's no way!", "Да ни за что! / Не может быть!"], ["There you go.", "Вот, пожалуйста."]],
      vs: { a: ["[There is] a garden behind the house.", "за домом есть сад"], b: ["We [have] a garden.", "у нас есть сад — он наш"],
        text: "there is — что где находится, have — что кому принадлежит." },
      mistakes: [
        ["In my city is a big park.", "There is a big park in my city.", "Русское «в городе есть…» начинают с There is."],
        ["There is many people.", "There are many people.", "Много — are."],
        ["Have a bank near here?", "Is there a bank near here?", "Вопрос о наличии — Is there…?"]
      ],
      practice: [
        C("___ any milk in the fridge?", ["Is there", "Are there", "Has it"], "milk — неисчисляемое: Is there."),
        C("___ two bedrooms in the flat.", ["There are", "There is", "They are"], "Два — There are."),
        C("___ a lot of traffic this morning.", ["There was", "There were", "It was"], "traffic — неисчисляемое, прошлое: There was."),
        F("In our office is a coffee machine.", ["There is a coffee machine in our office.", "There's a coffee machine in our office.", "In our office there is a coffee machine."], "Начинаем с There is."),
        B("Is there a pharmacy near here?", "Здесь поблизости есть аптека?", "Is + there + a pharmacy…"),
        S("Вы спрашиваете прохожего, есть ли рядом банкомат.", ["Is there an ATM near here?", "Have an ATM near here?", "Is it an ATM near here?"], "Вопрос о наличии — Is there…?")
      ]
    },

    {
      id: "have-got", group: "constructions", level: "A1",
      title: "have got", ru: "У меня есть",
      core: "have got = have: «у меня есть». Очень частое британское разговорное выражение.",
      key: ["I['ve got] two brothers.", "У меня два брата."],
      when: ["Владение: I've got a new phone.", "Родственники, внешность: She's got blue eyes.", "Болезни: I've got a headache.", "Обязанность: I've got to go (= I have to go)."],
      signals: ["'ve got / 's got = have / has got", "Have you got…? — I haven't got…", "got здесь не значит «получил»"],
      formula: [["+", "have / has got + сущ."], ["−", "haven't / hasn't got"], ["?", "Have / Has + подлежащее + got…?"], ["=", "have got to = have to"]],
      examples: [
        ["I['ve got] a cold.", "Я простудился."],
        ["[Have] you [got] a minute?", "У тебя есть минутка?"],
        ["She['s got] a great sense of humour.", "У неё отличное чувство юмора."],
        ["I['ve got to] go.", "Мне пора идти."]
      ],
      talk: [["I've got it!", "Понял! / Придумал!"], ["You've got this!", "Ты справишься!"], ["Got a sec?", "Есть секунда?"]],
      vs: { a: ["I['ve got] a car.", "у меня есть машина (= I have a car)"], b: ["I [got] a car.", "я купил или получил машину"],
        text: "have got — «есть сейчас», got без have — прошлое «получил»." },
      mistakes: [
        ["I have got not a car.", "I haven't got a car.", "not ставится после have."],
        ["Do you have got a pen?", "Have you got a pen?", "С have got вопрос без do (или: Do you have a pen?)."],
        ["She have got a dog.", "She has got a dog.", "she → has got."]
      ],
      practice: [
        M("I've got a headache.", ["У меня болит голова", "Вчера у меня болела голова", "Голова уже прошла"], "'ve got = have: есть сейчас."),
        C("___ you got any brothers?", ["Have", "Do", "Are"], "Вопрос с have got — Have you got…?"),
        C("He ___ got a car.", ["hasn't", "haven't", "doesn't"], "he → hasn't got."),
        F("Do you have got a pen?", ["Have you got a pen?", "Do you have a pen?"], "Либо Have you got…, либо Do you have…"),
        B("I have got to go.", "Мне надо идти.", "have got to = have to.")
      ]
    },

    {
      id: "going-to-link", group: "constructions", level: "A2", link: "going-to",
      title: "going to", ru: "Планы и «вот-вот» — урок во «Временах»"
    },

    {
      id: "used-to", group: "constructions", level: "A2",
      title: "used to (do)", ru: "Раньше было, теперь нет",
      core: "used to + глагол — «раньше (обычно) делал, а теперь нет».",
      key: ["I [used to play] football.", "Раньше я играл в футбол, а теперь нет."],
      when: ["Старые привычки: I used to smoke.", "Состояния в прошлом: We used to live in a small town.", "«Раньше и сейчас»: This used to be a cinema."],
      signals: ["used to + начальная форма глагола", "didn't use to / Did you use to…? (без d)", "часто рядом anymore / now: …but not anymore"],
      formula: [["+", "used to + V"], ["−", "didn't use to + V"], ["?", "Did + подлежащее + use to + V?"]],
      examples: [
        ["I [used to be] really shy.", "Раньше я был очень стеснительным."],
        ["This building [used to be] a school.", "Раньше в этом здании была школа."],
        ["I [didn't use to like] coffee.", "Раньше я не любил кофе."],
        ["[Did] you [use to have] long hair?", "У тебя раньше были длинные волосы?"]
      ],
      talk: [["We used to be close.", "Раньше мы были близки."], ["It used to be cheaper.", "Раньше было дешевле."]],
      vs: { a: ["I [used to work] at night.", "раньше работал по ночам"], b: ["I['m used to working] at night.", "привык работать по ночам"],
        text: "used to + V — «раньше», be used to + -ing — «привык».", link: "be-used-to" },
      mistakes: [
        ["I use to live here.", "I used to live here.", "В утверждении — used."],
        ["I used to living here.", "I used to live here.", "После used to (раньше) — начальная форма."],
        ["Did you used to smoke?", "Did you use to smoke?", "После did — use без d."]
      ],
      practice: [
        M("I used to live in Spain.", ["Раньше жил в Испании, теперь нет", "Я привык к Испании", "Живу в Испании сейчас"], "used to + V — было раньше."),
        C("This café ___ be a bookshop.", ["used to", "use to", "was used to"], "Раньше было — used to + V."),
        C("I didn't ___ like vegetables.", ["use to", "used to", "using to"], "После didn't — use to."),
        F("She use to work here.", ["She used to work here."], "В утверждении — used to."),
        B("We used to be friends.", "Раньше мы были друзьями.", "We + used to + be + friends."),
        S("В детстве вы каждое лето ездили к бабушке, а теперь нет. Как сказать?", ["I used to visit my grandma every summer.", "I'm used to visiting my grandma every summer.", "I use to visit my grandma every summer."], "Было раньше, теперь нет — used to + V.")
      ]
    },

    {
      id: "be-used-to", group: "constructions", level: "B1",
      title: "be used to", ru: "Я привык",
      core: "be used to + существительное или -ing — «привык»: для меня это уже нормально.",
      key: ["I['m used to getting up] early.", "Я привык рано вставать."],
      when: ["Что-то уже привычно: I'm used to the noise.", "Что-то непривычно: I'm not used to driving on the left."],
      signals: ["am / is / are / was + used to", "после to — существительное или глагол с -ing, а не начальная форма!"],
      formula: [["+", "be used to + сущ. / V-ing"], ["−", "be not used to + сущ. / V-ing"], ["?", "Are you used to + V-ing?"]],
      examples: [
        ["I['m used to] the cold.", "Я привык к холоду."],
        ["She [isn't used to working] in a team.", "Она не привыкла работать в команде."],
        ["Don't worry, I['m used to it].", "Не переживай, я привык."],
        ["[Are] you [used to living] alone?", "Ты привык жить один?"]
      ],
      talk: [["I'm not used to this.", "Мне это непривычно."], ["You'll get used to it.", "Привыкнешь."]],
      vs: { a: ["I['m used to] it.", "уже привык — состояние"], b: ["I['m getting used to] it.", "привыкаю — процесс"],
        text: "be used to — уже привык, get used to — привыкаю.", link: "get-used-to" },
      mistakes: [
        ["I'm used to get up early.", "I'm used to getting up early.", "После be used to — глагол с -ing."],
        ["I used to the noise.", "I'm used to the noise.", "Без am получается «раньше…»."]
      ],
      practice: [
        C("I'm used to ___ late.", ["working", "work", "worked"], "be used to + -ing."),
        M("I'm used to spicy food.", ["Острая еда для меня привычна", "Раньше ел острое, теперь нет", "Начинаю привыкать к острому"], "be used to — уже привык."),
        C("She ___ used to the climate yet.", ["isn't", "doesn't", "didn't"], "be used to: отрицание через isn't."),
        F("He's used to drive on the right.", ["He's used to driving on the right.", "He is used to driving on the right."], "be used to + -ing."),
        S("Коллега удивлён, что вы встаёте в пять утра. Для вас это нормально.", ["I'm used to it.", "I used to it.", "I use to it."], "Уже привык — be used to.")
      ]
    },

    {
      id: "get-used-to", group: "constructions", level: "B1",
      title: "get used to", ru: "Привыкаю, привыкну",
      core: "get used to — «привыкать, привыкнуть». Это процесс, в котором непривычное становится нормой.",
      key: ["I'm [getting used to] my new job.", "Я привыкаю к новой работе."],
      when: ["Процесс: I'm getting used to the time difference.", "Поддержка: You'll get used to it.", "Результат: I got used to it quickly."],
      signals: ["get / getting / got + used to", "после to — существительное или -ing"],
      formula: [["", "get used to + сущ. / V-ing"], ["процесс", "be getting used to"], ["будущее", "will get used to"]],
      examples: [
        ["You'll [get used to it].", "Ты привыкнешь."],
        ["I can't [get used to waking up] so early.", "Никак не привыкну так рано вставать."],
        ["It took me a month to [get used to] the food.", "Мне понадобился месяц, чтобы привыкнуть к еде."],
        ["I'm slowly [getting used to] London.", "Я понемногу привыкаю к Лондону."]
      ],
      talk: [["Don't worry, you'll get used to it.", "Не переживай, привыкнешь."], ["I could get used to this!", "К такому я бы привык! (о приятном)"]],
      vs: { a: ["I [used to drive].", "раньше водил"], b: ["I'm [getting used to driving].", "привыкаю водить"],
        text: "used to — прошлое, get used to — привыкание.", link: "used-to" },
      mistakes: [
        ["I'm getting used to live here.", "I'm getting used to living here.", "После get used to — -ing."],
        ["I'll get use to it.", "I'll get used to it.", "Всегда used."]
      ],
      practice: [
        C("It's hard to get used to ___ on the left.", ["driving", "drive", "drove"], "get used to + -ing."),
        M("I'm getting used to the new schedule.", ["Постепенно привыкаю", "Уже давно привык", "Раньше так работал"], "getting used to — процесс."),
        C("Don't worry, you'll ___ used to it.", ["get", "got", "use"], "will + get used to."),
        F("I got use to it fast.", ["I got used to it fast."], "get used to — всегда used."),
        B("You will get used to it.", "Ты привыкнешь.", "will + get used to + it.")
      ]
    },

    {
      id: "have-to", group: "constructions", level: "A1",
      title: "have to", ru: "Приходится, нужно",
      core: "have to — «приходится, нужно» из-за обстоятельств, правил, работы.",
      key: ["I [have to] work on Saturday.", "В субботу мне придётся работать."],
      when: ["Обязанности: I have to get up at six.", "Правила: You have to wear a helmet.", "Прошлое: I had to wait for an hour.", "Будущее: You'll have to try again."],
      signals: ["have / has to + V", "had to (прошлое), will have to (будущее)", "don't have to — не обязательно"],
      formula: [["+", "have / has to + V"], ["−", "don't / doesn't have to + V"], ["?", "Do / Does + подлежащее + have to + V?"], ["прошлое", "had to + V"]],
      examples: [
        ["I [have to] go now.", "Мне надо идти."],
        ["You [don't have to] decide right now.", "Не обязательно решать прямо сейчас."],
        ["She [has to] work this weekend.", "В эти выходные ей приходится работать."],
        ["We [had to] cancel the trip.", "Нам пришлось отменить поездку."]
      ],
      talk: [["I have to say…", "Должен признать…"], ["You don't have to do that.", "Не стоило (мне приятно)."]],
      vs: { a: ["I [have to] wear a tie.", "так требует работа"], b: ["I [must] call Mum.", "сам так решил"],
        text: "have to — внешняя необходимость, must — внутренняя.", link: "must-haveto" },
      mistakes: [
        ["He have to go.", "He has to go.", "he → has to."],
        ["I haven't to work today.", "I don't have to work today.", "Отрицание — don't have to."],
        ["Yesterday I have to work.", "Yesterday I had to work.", "Прошлое — had to."]
      ],
      practice: [
        C("She ___ to wear a uniform.", ["has", "have", "is"], "she → has to."),
        C("Yesterday we ___ to wait for two hours.", ["had", "have", "must"], "Прошлое — had to."),
        M("You don't have to come.", ["Можешь не приходить", "Тебе нельзя приходить", "Ты должен прийти"], "don't have to — не обязательно."),
        F("I haven't to get up early tomorrow.", ["I don't have to get up early tomorrow."], "Отрицание — don't have to."),
        B("Do I have to pay now?", "Мне нужно платить сейчас?", "Do + I + have to + pay…")
      ]
    },

    {
      id: "be-able-to", group: "constructions", level: "A2",
      title: "be able to", ru: "Смогу, смог, удалось",
      core: "be able to = can: «мочь, быть в состоянии». Нужен там, где can не работает: в будущем, после других глаголов, в Perfect.",
      key: ["I'll [be able to] help you tomorrow.", "Завтра я смогу тебе помочь."],
      when: ["Будущее: I'll be able to come.", "После would like, might, want: I'd like to be able to speak French.", "Удалось в конкретной ситуации: I was able to fix it.", "Perfect: I haven't been able to sleep."],
      signals: ["am / is / are / was / were / will be + able to + V", "was able to — «смог, удалось»"],
      formula: [["настоящее", "am / is / are able to + V"], ["прошлое", "was / were able to + V"], ["будущее", "will be able to + V"], ["−", "not able to / unable to"]],
      examples: [
        ["Will you [be able to] come?", "Ты сможешь прийти?"],
        ["I [wasn't able to] find it.", "Мне не удалось это найти."],
        ["I haven't [been able to] sleep lately.", "В последнее время я не могу уснуть."],
        ["She [was able to] fix the problem.", "Ей удалось решить проблему."]
      ],
      talk: [["I won't be able to make it.", "Я не смогу прийти."], ["I'd love to be able to help.", "Я бы с радостью помог, но не могу."]],
      vs: { a: ["I [can] swim.", "умею (сейчас)"], b: ["I'll [be able to] swim soon.", "смогу — в будущем can нельзя"],
        text: "Где can невозможен (will, have, to) — be able to.", link: "can-could" },
      mistakes: [
        ["I will can help you.", "I will be able to help you.", "Два модальных подряд нельзя: will + be able to."],
        ["I would like to can speak English.", "I would like to be able to speak English.", "После to — be able to."],
        ["She is able speak.", "She is able to speak.", "Не забывайте to."]
      ],
      practice: [
        C("I'm sorry, I won't ___ come tomorrow.", ["be able to", "can", "able"], "После won't — be able to."),
        C("I haven't ___ to call him yet.", ["been able", "could", "can"], "Perfect — have been able to."),
        M("I was able to finish on time.", ["Мне удалось закончить вовремя", "Я всегда заканчиваю вовремя", "Я смогу закончить позже"], "was able to — удалось в конкретной ситуации."),
        F("I will can do it tomorrow.", ["I will be able to do it tomorrow.", "I'll be able to do it tomorrow."], "will + be able to."),
        B("Will you be able to come?", "Ты сможешь прийти?", "Will + you + be able to + come.")
      ]
    },

    {
      id: "would-like", group: "constructions", level: "A1",
      title: "would like to", ru: "Хотел бы — вежливо",
      core: "would like — вежливое «хотел бы». Мягче, чем want.",
      key: ["I['d like to] book a table.", "Я бы хотел забронировать столик."],
      when: ["Просьбы и заказы: I'd like a coffee, please.", "Вежливые желания: I'd like to ask you something.", "Предложения: Would you like to join us?"],
      signals: ["I'd like = I would like", "would like + сущ. (I'd like tea) / + to + V (I'd like to go)", "Would you like…? — вежливое предложение"],
      formula: [["+", "I'd like + сущ. / to + V"], ["?", "Would you like + сущ. / to + V?"], ["−", "I wouldn't like to + V"]],
      examples: [
        ["I['d like to] make a reservation.", "Я бы хотел сделать бронь."],
        ["[Would] you [like] something to drink?", "Хотите что-нибудь выпить?"],
        ["[Would] you [like to] come with us?", "Хочешь пойти с нами?"],
        ["I['d like] the bill, please.", "Счёт, пожалуйста."]
      ],
      talk: [["I'd love to!", "С удовольствием!"], ["Would you like a hand?", "Помочь?"]],
      vs: { a: ["I [want] a coffee.", "хочу — прямо, может прозвучать резко"], b: ["I['d like] a coffee, please.", "хотел бы — вежливо"],
        text: "С незнакомыми людьми и в сервисе — would like.", link: "want-to" },
      mistakes: [
        ["I would like go.", "I'd like to go.", "would like + to + глагол."],
        ["Do you like a drink?", "Would you like a drink?", "Do you like… — «тебе вообще нравится…», а не предложение."],
        ["I like to order a pizza.", "I'd like to order a pizza.", "Заказ — I'd like."]
      ],
      practice: [
        M("Would you like some tea?", ["Предлагают выпить чаю", "Спрашивают, нравится ли чай вообще", "Просят принести чай"], "Would you like…? — предложение."),
        M("Do you like tea?", ["Спрашивают, нравится ли чай вообще", "Предлагают выпить чаю сейчас", "Просят заварить чай"], "Do you like…? — о вкусах вообще."),
        C("I'd like ___ a table for two.", ["to book", "book", "booking"], "would like + to + V."),
        S("Вы в отеле и вежливо просите поменять номер.", ["I'd like to change my room, please.", "I want change my room.", "I like to change my room."], "Вежливая просьба — I'd like to…"),
        F("I would like order a pizza.", ["I would like to order a pizza.", "I'd like to order a pizza."], "Нужно to.")
      ]
    },

    {
      id: "want-to", group: "constructions", level: "A1",
      title: "want to", ru: "Хочу",
      core: "want to — «хочу». Прямо и честно; с незнакомыми людьми вежливее сказать would like.",
      key: ["I [want to] learn Spanish.", "Я хочу выучить испанский."],
      when: ["Свои желания: I want to go home.", "Предложение друзьям: Do you want to grab lunch?", "Хочу, чтобы кто-то сделал: I want you to listen."],
      signals: ["want + to + V; в речи — wanna", "want + человек + to + V: I want you to come", "don't want to — не хочу"],
      formula: [["+", "want(s) to + V"], ["−", "don't / doesn't want to + V"], ["?", "Do you want to + V?"], ["другой человек", "want + someone + to + V"]],
      examples: [
        ["I [want to] be honest with you.", "Хочу быть с тобой честным."],
        ["[Do] you [want to] watch a movie?", "Хочешь посмотреть фильм?"],
        ["I [don't want to] talk about it.", "Я не хочу об этом говорить."],
        ["I [want you to] meet my parents.", "Я хочу, чтобы ты познакомился с моими родителями."]
      ],
      talk: [["Wanna come?", "Пойдёшь с нами?"], ["I just wanted to say thanks.", "Хотел просто сказать спасибо."]],
      vs: { a: ["I [want] the bill.", "хочу счёт — резковато"], b: ["I['d like] the bill, please.", "вежливо"],
        text: "want — прямо, would like — вежливо.", link: "would-like" },
      mistakes: [
        ["I want that you come.", "I want you to come.", "«Хочу, чтобы…» = want + человек + to."],
        ["I want go home.", "I want to go home.", "Нужно to."],
        ["She want to stay.", "She wants to stay.", "she → wants."]
      ],
      practice: [
        C("I want ___ to help me.", ["you", "that you", "you that"], "want + человек + to."),
        C("She ___ to go out tonight.", ["doesn't want", "don't want", "not want"], "she → doesn't want."),
        F("I want that you call me.", ["I want you to call me."], "want + you + to."),
        B("Do you want to grab lunch?", "Хочешь пообедать вместе?", "Do + you + want to + grab lunch."),
        M("Wanna grab a coffee?", ["Неформально предлагают выпить кофе", "Строго спрашивают о покупке кофе", "Отказываются от кофе"], "wanna = want to, разговорное предложение.")
      ]
    },

    {
      id: "need-to", group: "constructions", level: "A1",
      title: "need to", ru: "Нужно, надо",
      core: "need to — «нужно, надо». Обычная необходимость, без строгого приказа.",
      key: ["I [need to] charge my phone.", "Мне нужно зарядить телефон."],
      when: ["Личная необходимость: I need to sleep.", "Не нужно: You don't need to worry.", "Нужно, чтобы кто-то сделал: I need you to sign here."],
      signals: ["need(s) to + V", "don't need to = не нужно", "need + сущ.: I need help. — «мне нужна помощь»"],
      formula: [["+", "need(s) to + V"], ["−", "don't / doesn't need to + V"], ["?", "Do you need to + V?"], ["+ сущ.", "need + something"]],
      examples: [
        ["I [need to] talk to you.", "Мне нужно с тобой поговорить."],
        ["You [don't need to] bring anything.", "Ничего приносить не нужно."],
        ["[Do] we [need to] book in advance?", "Нужно бронировать заранее?"],
        ["I [need] a break.", "Мне нужен перерыв."]
      ],
      talk: [["I need to go.", "Мне надо бежать."], ["No need.", "Не нужно."], ["You need to relax.", "Тебе надо расслабиться."]],
      vs: { a: ["I [need to] call Mum.", "мне надо — моя потребность"], b: ["I [have to] wear a tie at work.", "обязан — правило"],
        text: "need to — потребность, have to — обязанность.", link: "have-to" },
      mistakes: [
        ["I need go.", "I need to go.", "Нужно to."],
        ["He need to rest.", "He needs to rest.", "he → needs."],
        ["You not need to come.", "You don't need to come.", "Отрицание через don't."]
      ],
      practice: [
        C("You ___ to worry. Everything's fine.", ["don't need", "needn't to", "not need"], "Не нужно — don't need to."),
        C("She ___ some help.", ["needs", "need", "needs to"], "need + существительное, she → needs."),
        F("I need talk to you.", ["I need to talk to you."], "need + to + V."),
        M("You don't need to pay.", ["Платить не нужно", "Платить запрещено", "Нужно заплатить"], "don't need to — не нужно."),
        B("Do we need to book in advance?", "Нужно бронировать заранее?", "Do + we + need to + book…")
      ]
    },

    {
      id: "make-let", group: "constructions", level: "A2",
      title: "make / let someone do", ru: "Заставить / позволить",
      core: "make someone do — заставить. let someone do — позволить. После них — глагол без to!",
      key: ["My boss [made me stay] late.", "Начальник заставил меня задержаться."],
      when: ["Заставить: She made me laugh. — Она меня рассмешила.", "Разрешить: Let me help you.", "Предложение: Let's go! (= let us)", "Let me know. — Дай знать."],
      signals: ["make / let + человек + глагол без to", "let's — «давай(те)»", "прошлое: made, let (форма не меняется)"],
      formula: [["заставить", "make + кого-то + V"], ["разрешить", "let + кого-то + V"], ["давай", "let's + V"]],
      examples: [
        ["[Let me] know if you need anything.", "Дай знать, если что-нибудь понадобится."],
        ["It [made me think].", "Это заставило меня задуматься."],
        ["My parents [didn't let me] go out.", "Родители не отпускали меня гулять."],
        ["Don't [make me] wait!", "Не заставляй меня ждать!"],
        ["[Let's] get started.", "Давайте начнём."]
      ],
      talk: [["Let me see.", "Сейчас посмотрю / дай подумать."], ["Let it go.", "Забудь, отпусти."], ["You made my day!", "Ты меня очень порадовал!"]],
      vs: { a: ["She [made me] clean the room.", "заставила"], b: ["She [let me] use her car.", "разрешила"],
        text: "make — заставить, let — разрешить. В обоих случаях без to." },
      mistakes: [
        ["She made me to cry.", "She made me cry.", "После make + человек — без to."],
        ["Let me to help.", "Let me help.", "После let — без to."],
        ["My dad allowed me go.", "My dad let me go.", "allow требует to (allowed me to go), а let — без to."]
      ],
      practice: [
        C("The film made me ___.", ["cry", "to cry", "crying"], "make + человек + V без to."),
        C("___ me know when you arrive.", ["Let", "Make", "Allow"], "Let me know — дай знать."),
        M("My boss made me work on Sunday.", ["Начальник заставил работать в воскресенье", "Начальник разрешил работать в воскресенье", "Я сам решил поработать"], "make — заставить."),
        F("Let me to explain.", ["Let me explain."], "После let — без to."),
        B("Let me help you.", "Давай я помогу.", "Let + me + help + you.")
      ]
    },

    {
      id: "have-done", group: "constructions", level: "B1",
      title: "have something done", ru: "Мне сделали (не я сам)",
      core: "have something done — что-то сделали для вас, но не вы сами. «Я подстригся» в парикмахерской — I had my hair cut.",
      key: ["I [had my hair cut].", "Меня подстригли (в парикмахерской)."],
      when: ["Услуги: I'm having my car repaired.", "Неприятности: She had her bag stolen.", "Разговорно — get: I need to get my phone fixed."],
      signals: ["have / get + предмет + V3", "действие выполняет кто-то другой: мастер, сервис"],
      formula: [["", "have + что + V3"], ["разговорно", "get + что + V3"]],
      examples: [
        ["I need to [get my phone fixed].", "Мне надо отдать телефон в ремонт."],
        ["We're [having the kitchen painted].", "Нам красят кухню."],
        ["She [had her bag stolen].", "У неё украли сумку."],
        ["Where do you [have your hair done]?", "Где ты делаешь причёску?"]
      ],
      talk: [["I got my nails done.", "Я сделала маникюр."], ["I'm getting my eyes tested.", "Иду проверять зрение."]],
      vs: { a: ["I [cut my hair].", "подстригся сам"], b: ["I [had my hair cut].", "меня подстригли"],
        text: "Сам — обычный глагол. Для меня сделал другой — have + предмет + V3." },
      mistakes: [
        ["I cut my hair at the hairdresser's.", "I had my hair cut at the hairdresser's.", "Стриг мастер — have + hair + cut."],
        ["I had repaired my car.", "I had my car repaired.", "Порядок важен: have + предмет + V3."]
      ],
      practice: [
        M("I had my car washed.", ["Машину мне помыли", "Я сам помыл машину", "Я хочу помыть машину"], "have + предмет + V3 — сделал кто-то другой."),
        C("I need to get my laptop ___.", ["repaired", "repair", "repairing"], "get + предмет + V3."),
        C("She had her passport ___.", ["stolen", "steal", "stole"], "had + passport + stolen — у неё украли."),
        F("I had cut my hair at the salon.", ["I had my hair cut at the salon."], "have + предмет + V3."),
        B("We are having our kitchen painted.", "Нам красят кухню.", "are having + our kitchen + painted.")
      ]
    },

    {
      id: "conditionals", group: "constructions", level: "B1",
      title: "Условные предложения (if)", ru: "Если…, то…",
      core: "«Если…, то…». Главное — насколько реальна ситуация: всегда так, реально в будущем, нереально сейчас или нереально в прошлом.",
      key: ["If it [rains], we['ll stay] home.", "Если пойдёт дождь, мы останемся дома."],
      when: ["Всегда так (0): If you heat ice, it melts.", "Реально в будущем (1): If you call me, I'll come.", "Нереально сейчас (2): If I were you, I'd say no.", "Нереально в прошлом (3): If I had known, I would have come."],
      signals: ["в части с if никогда нет will", "'d = would во второй части", "If I were you… — частая формула совета"],
      formula: [["0", "If + Present, Present"], ["1", "If + Present, will + V"], ["2", "If + Past, would + V"], ["3", "If + had V3, would have V3"]],
      examples: [
        ["If you [need] help, I['ll be] there.", "Если понадобится помощь, я рядом."],
        ["If I [were] you, I['d take] the job.", "На твоём месте я бы согласился на эту работу."],
        ["If I [had known], I [would have called].", "Если бы я знал, я бы позвонил."],
        ["What [would] you [do] if you [won] the lottery?", "Что бы ты сделал, если бы выиграл в лотерею?"]
      ],
      talk: [["If you say so.", "Ну, раз ты так говоришь."], ["If I were you…", "На твоём месте…"], ["If anything happens, call me.", "Если что — звони."]],
      vs: { a: ["If I [have] time, I['ll call].", "реально: может, время и будет"], b: ["If I [had] time, I['d call].", "нереально: времени нет"],
        text: "Прошедшее время после if часто значит не прошлое, а «нереально»." },
      mistakes: [
        ["If it will rain, we will stay.", "If it rains, we'll stay.", "После if — без will."],
        ["If I would know, I would tell you.", "If I knew, I would tell you.", "would — только во второй части."],
        ["If I had known, I would come.", "If I had known, I would have come.", "Нереальное прошлое: would have + V3."]
      ],
      practice: [
        M("If I had a car, I would drive to work.", ["Машины нет — это мечта", "Машина есть, и я езжу на ней", "У меня была машина в прошлом"], "If + Past, would — нереально сейчас."),
        C("If you ___ hungry, there's pizza in the fridge.", ["are", "will be", "would be"], "После if — Present."),
        C("If I ___ you, I'd talk to her.", ["were", "am", "will be"], "Формула совета: If I were you…"),
        M("If I had known, I would have come.", ["Не знал — и не пришёл", "Знал и пришёл", "Узнаю — и приду"], "Третий тип: нереальное прошлое."),
        F("If I will see him, I will tell him.", ["If I see him, I will tell him.", "If I see him, I'll tell him."], "После if — Present Simple."),
        S("Подруга сомневается, принять ли предложение. Вы советуете: «На твоём месте я бы согласился».", ["If I were you, I'd accept it.", "If I am you, I accept it.", "If I will be you, I will accept it."], "Совет — If I were you, I'd…")
      ]
    },

    {
      id: "passive", group: "constructions", level: "B1",
      title: "Passive voice", ru: "Важно, что сделали, а не кто",
      core: "Пассив: важно, что сделали, а не кто. Объект действия становится главным в предложении.",
      key: ["My phone [was stolen].", "У меня украли телефон (кто — неизвестно)."],
      when: ["Исполнитель неизвестен: My bike was stolen.", "Исполнитель неважен: English is spoken here.", "Новости, объявления, официальный стиль: The meeting has been cancelled."],
      signals: ["be в нужной форме + V3", "by + кто сделал (не всегда): written by Tolkien", "русское «сделано», «построили», «говорят»"],
      formula: [["настоящее", "am / is / are + V3"], ["прошлое", "was / were + V3"], ["perfect", "has / have been + V3"], ["будущее", "will be + V3"]],
      examples: [
        ["This house [was built] in 1900.", "Этот дом построили в 1900 году."],
        ["The flight [has been cancelled].", "Рейс отменили."],
        ["You['ll be paid] on Friday.", "Тебе заплатят в пятницу."],
        ["Is breakfast [included]?", "Завтрак включён?"],
        ["I [was told] to wait here.", "Мне сказали подождать здесь."]
      ],
      talk: [["I was born in 1995.", "Я родился в 1995 году."], ["It's made in China.", "Сделано в Китае."], ["You're not allowed to smoke here.", "Здесь курить нельзя."]],
      vs: { a: ["Someone [stole] my bike.", "актив: кто-то украл"], b: ["My bike [was stolen].", "пассив: велосипед украли"],
        text: "Пассив убирает исполнителя на второй план." },
      mistakes: [
        ["I born in 1990.", "I was born in 1990.", "«Родился» — всегда was born."],
        ["The email was send yesterday.", "The email was sent yesterday.", "После be — третья форма."],
        ["It made in Italy.", "It's made in Italy.", "Нужен is: It is made."]
      ],
      practice: [
        C("The museum ___ in 1850.", ["was built", "built", "is building"], "Музей построили — пассив: was built."),
        C("Is service ___ in the price?", ["included", "include", "including"], "be + V3: is included."),
        M("My wallet was stolen.", ["Кто-то украл мой кошелёк", "Я украл кошелёк", "Кошелёк крадут прямо сейчас"], "was stolen — с кошельком что-то сделали."),
        F("I born in 1995.", ["I was born in 1995."], "was born."),
        B("The meeting has been cancelled.", "Встречу отменили.", "has been + cancelled."),
        S("Вы сообщаете, что ресторан закрыли на ремонт (кто закрыл — неважно).", ["The restaurant has been closed for repairs.", "The restaurant has closed by repairs.", "The restaurant closing for repairs."], "Важно, что сделали, — пассив: has been closed.")
      ]
    },

    {
      id: "reported", group: "constructions", level: "B1",
      title: "Косвенная речь", ru: "Он сказал, что…",
      core: "Пересказываем чужие слова. Если said / told в прошлом, время в пересказе обычно «сдвигается» на шаг назад.",
      key: ["He said he [was] tired.", "Он сказал, что устал. (Он сказал: «I'm tired».)"],
      when: ["Пересказ: She said she would call.", "Вопросы: He asked if I was OK.", "Просьбы: She told me to wait."],
      signals: ["said (that) / told me (that)", "asked if / asked where…", "told me to + V — просьба или указание"],
      formula: [["сдвиг", "am / is → was · will → would · can → could"], ["вопрос", "asked + if / where + порядок как в утверждении"], ["просьба", "told / asked + кого + to + V"]],
      examples: [
        ["She [said she was] busy.", "Она сказала, что занята."],
        ["He [told me he would] be late.", "Он сказал мне, что опоздает."],
        ["They [asked if we were] ready.", "Они спросили, готовы ли мы."],
        ["She [told me to wait].", "Она сказала мне подождать."]
      ],
      talk: [["He said he'd call.", "Он сказал, что позвонит."], ["She asked me to tell you.", "Она просила тебе передать."]],
      vs: { a: ["She said, «[I'm] tired».", "прямая речь"], b: ["She said she [was] tired.", "косвенная речь: сдвиг времени"],
        text: "В пересказе am → was, will → would, can → could." },
      mistakes: [
        ["He asked where do I live.", "He asked where I lived.", "В косвенном вопросе нет do, порядок слов — как в утверждении."],
        ["She said me that she was busy.", "She told me that she was busy.", "С человеком — told."],
        ["He told me wait.", "He told me to wait.", "told + кого + to + V."]
      ],
      practice: [
        C("«I can swim.» → He said he ___ swim.", ["could", "can to", "will"], "can → could."),
        C("She asked me where I ___.", ["lived", "did live", "do live"], "Косвенный вопрос: без do, сдвиг времени."),
        C("He told me ___ the door.", ["to close", "close", "closing"], "told + кого + to + V."),
        F("She asked me where do I work.", ["She asked me where I worked.", "She asked me where I work."], "Без do: where I worked."),
        M("He said he would call.", ["Он обещал позвонить", "Он уже позвонил", "Он звонит сейчас"], "would — будущее с точки зрения прошлого.")
      ]
    },

    {
      id: "relative", group: "constructions", level: "B1",
      title: "who / which / that / where", ru: "Который, где, чей",
      core: "Придаточные с who / which / that / where добавляют информацию о человеке, предмете или месте. Это русское «который».",
      key: ["The man [who lives] next door is a doctor.", "Мужчина, который живёт по соседству, — врач."],
      when: ["Уточнить человека: the girl who called", "Уточнить вещь: the phone that I bought", "Место: the café where we met"],
      signals: ["who — люди, which — вещи, that — и то и другое (разговорно)", "where — место, whose — чей", "that / who часто пропускают: the film (that) I saw"],
      formula: [["люди", "who / that"], ["вещи", "which / that"], ["место", "where"], ["чей", "whose"]],
      examples: [
        ["The guy [who] fixed my car was great.", "Парень, который чинил мою машину, — молодец."],
        ["This is the book [that] I told you about.", "Это книга, о которой я тебе рассказывал."],
        ["That's the restaurant [where] we had our first date.", "Это ресторан, где у нас было первое свидание."],
        ["I have a friend [whose] dad is a pilot.", "У меня есть друг, чей папа — пилот."]
      ],
      talk: [["Anyone who wants to come is welcome.", "Приходите все, кто хочет."], ["That's what I meant.", "Вот это я и имел в виду."]],
      vs: { a: ["the woman [who] called", "человек → who"], b: ["the phone [which] rang", "вещь → which"],
        text: "that подходит в обоих случаях, но в разговоре чаще его просто пропускают." },
      mistakes: [
        ["The man which called me…", "The man who called me…", "Человек → who."],
        ["The city where I live in.", "The city where I live.", "where уже включает «в»."],
        ["The book who I read.", "The book that I read.", "Вещь → that / which."]
      ],
      practice: [
        C("The woman ___ lives upstairs is very kind.", ["who", "which", "where"], "Человек → who."),
        C("This is the hotel ___ we stayed.", ["where", "which", "who"], "Место → where."),
        C("The phone ___ I bought last week doesn't work.", ["that", "who", "where"], "Вещь → that."),
        C("I know a guy ___ brother is an actor.", ["whose", "who", "which"], "«чей брат» → whose."),
        F("The girl which helped me was nice.", ["The girl who helped me was nice.", "The girl that helped me was nice."], "Человек → who / that.")
      ]
    },

    {
      id: "infinitive", group: "constructions", level: "A2",
      title: "Инфинитив (to + глагол)", ru: "Чтобы, что делать",
      core: "to + глагол — «чтобы», «что делать». Ставится после многих глаголов и прилагательных.",
      key: ["I came here [to learn] English.", "Я приехал сюда, чтобы учить английский."],
      when: ["Цель — «чтобы»: I went out to buy bread.", "После want, decide, hope, plan, need, agree, promise: I decided to stay.", "После прилагательных: It's easy to forget. Nice to meet you.", "После вопросительных слов: I don't know what to say."],
      signals: ["to + начальная форма", "после модальных (can, must, should) to НЕ нужен", "make / let + V — тоже без to"],
      formula: [["цель", "to + V = «чтобы»"], ["глагол + to V", "want / decide / hope / plan / need + to V"], ["прилаг. + to V", "It's hard / easy / nice + to V"]],
      examples: [
        ["I called [to say] sorry.", "Я позвонил, чтобы извиниться."],
        ["We decided [to stay] at home.", "Мы решили остаться дома."],
        ["It's hard [to explain].", "Это сложно объяснить."],
        ["I don't know what [to do].", "Не знаю, что делать."],
        ["Nice [to meet] you!", "Приятно познакомиться!"]
      ],
      talk: [["Nice to meet you.", "Приятно познакомиться."], ["Good to know.", "Хорошо, буду знать."], ["I'm about to leave.", "Я как раз ухожу."]],
      vs: { a: ["I want [to go].", "после want — to"], b: ["I enjoy [going].", "после enjoy — -ing"],
        text: "Одни глаголы требуют to, другие — -ing.", link: "gerund" },
      mistakes: [
        ["I came here for learn English.", "I came here to learn English.", "Цель «чтобы» = to + V, не for."],
        ["I decided going.", "I decided to go.", "decide + to."],
        ["You should to rest.", "You should rest.", "После модальных — без to."]
      ],
      practice: [
        C("I went to the shop ___ some milk.", ["to buy", "for buy", "buying"], "Цель — to + V."),
        C("We hope ___ you soon.", ["to see", "seeing", "see"], "hope + to."),
        C("It's easy ___ lost here.", ["to get", "get", "getting"], "Прилагательное + to + V."),
        F("I came here for study.", ["I came here to study."], "Цель — to + V."),
        B("I don't know what to say.", "Не знаю, что сказать.", "what + to + say.")
      ]
    },

    {
      id: "gerund", group: "constructions", level: "A2",
      title: "Герундий (глагол + -ing)", ru: "Действие как существительное",
      core: "Глагол + -ing в роли существительного: «плавание», «чтение». Нужен после некоторых глаголов и после всех предлогов.",
      key: ["I [enjoy cooking].", "Я люблю готовить."],
      when: ["Как подлежащее: Smoking is bad for you.", "После enjoy, finish, mind, avoid, keep, stop, suggest: I don't mind waiting.", "После предлогов: I'm good at drawing. Thanks for coming.", "После like / love / hate можно и -ing, и to."],
      signals: ["после about, at, for, of, without, before, after → всегда -ing", "How about going…? What about…?", "looking forward to + -ing (здесь to — предлог)"],
      formula: [["подлежащее", "V-ing + глагол"], ["после глаголов", "enjoy / finish / mind / avoid / keep + V-ing"], ["после предлогов", "предлог + V-ing"]],
      examples: [
        ["I [don't mind waiting].", "Я не против подождать."],
        ["Thanks for [coming]!", "Спасибо, что пришёл!"],
        ["[Learning] languages is fun.", "Учить языки — интересно."],
        ["How about [going] out tonight?", "Может, сходим куда-нибудь вечером?"],
        ["Stop [worrying].", "Хватит переживать."]
      ],
      talk: [["Keep going!", "Продолжай!"], ["Do you mind waiting?", "Вы не против подождать?"], ["I'm looking forward to seeing you.", "С нетерпением жду встречи."]],
      vs: { a: ["I stopped [smoking].", "бросил курить"], b: ["I stopped [to smoke].", "остановился, чтобы покурить"],
        text: "После stop смысл меняется в зависимости от формы.", link: "infinitive" },
      mistakes: [
        ["I enjoy to swim.", "I enjoy swimming.", "enjoy + -ing."],
        ["I'm looking forward to see you.", "I'm looking forward to seeing you.", "to здесь — предлог, после него -ing."],
        ["Thanks for help me.", "Thanks for helping me.", "После предлога — -ing."]
      ],
      practice: [
        C("Do you mind ___ the window?", ["opening", "to open", "open"], "mind + -ing."),
        C("I'm good at ___.", ["cooking", "cook", "to cook"], "После предлога at — -ing."),
        C("I'm looking forward to ___ you.", ["seeing", "see", "saw"], "looking forward to + -ing."),
        M("I stopped smoking.", ["Бросил курить", "Остановился, чтобы покурить", "Курю прямо сейчас"], "stop + -ing — прекратить делать."),
        F("I enjoy to read before bed.", ["I enjoy reading before bed."], "enjoy + -ing.")
      ]
    },

    {
      id: "modals", group: "constructions", level: "A2",
      title: "Модальные глаголы", ru: "Могу, должен, стоит, возможно",
      core: "Модальные глаголы добавляют отношение: могу, должен, стоит, возможно. После них — глагол без to, и у них нет -s.",
      key: ["You [should] try it.", "Тебе стоит попробовать."],
      when: ["can / could — умение, возможность, просьба", "must / have to — необходимость", "should — совет", "may / might — вероятность", "will / would — будущее, вежливость"],
      signals: ["модальный + начальная форма: She can swim", "нет -s: He must go (не musts)", "вопрос и отрицание без do: Can I…? You shouldn't…"],
      formula: [["+", "модальный + V"], ["−", "модальный + not + V"], ["?", "Модальный + подлежащее + V?"]],
      examples: [
        ["You [should] see a doctor.", "Тебе стоит сходить к врачу."],
        ["[Can] I [ask] you something?", "Можно тебя кое о чём спросить?"],
        ["It [might be] a good idea.", "Возможно, это хорошая идея."],
        ["You [must] be tired.", "Ты, наверное, устал. (must — уверенное предположение)"],
        ["[Would] you [mind] helping me?", "Вы не могли бы мне помочь?"]
      ],
      talk: [["You must be joking!", "Да ты шутишь!"], ["Could be.", "Возможно."], ["Shall we?", "Ну что, идём?"]],
      vs: { a: ["You [must] be tired.", "предположение: наверняка устал"], b: ["You [must] go now.", "обязанность: тебе надо идти"],
        text: "У must два смысла — «наверняка» и «обязан».", link: "must-haveto" },
      mistakes: [
        ["She cans speak French.", "She can speak French.", "У модальных нет -s."],
        ["Do you can help me?", "Can you help me?", "Вопрос — без do."],
        ["You should to go.", "You should go.", "После модальных — без to."]
      ],
      practice: [
        C("___ I open the window?", ["Can", "Do", "Am"], "Просим разрешения — Can I…?"),
        C("He ___ speak three languages.", ["can", "cans", "can to"], "Модальный без -s и без to."),
        M("You must be hungry.", ["Ты, наверное, голоден", "Ты обязан быть голодным", "Ты был голоден"], "must — уверенное предположение."),
        S("Вы советуете другу взять зонт.", ["You should take an umbrella.", "You should to take an umbrella.", "You shoulds take an umbrella."], "Совет — should + V."),
        F("Do you can help me?", ["Can you help me?", "Could you help me?"], "Вопрос с модальным — без do.")
      ]
    }
  ];

  // Порядок «от простого к сложному» — для рекомендации «Что мне учить дальше?»
  var CURRICULUM = [
    "present-simple", "present-continuous", "ps-vs-pc", "there-is", "past-simple", "past-continuous",
    "have-got", "want-to", "would-like", "need-to", "have-to", "can-could", "much-many", "some-any",
    "present-perfect", "past-vs-perfect", "since-for", "going-to", "future-simple", "will-vs-going",
    "say-tell", "do-make", "modals", "should-haveto", "must-haveto", "used-to", "used-vs-would",
    "be-used-to", "get-used-to", "few-little", "present-perfect-continuous", "perfect-vs-perfect-cont",
    "be-able-to", "make-let", "infinitive", "gerund", "may-might", "conditionals", "passive", "relative",
    "past-perfect", "future-continuous", "reported", "have-done", "future-perfect"
  ];

  var byId = Object.create(null);
  TOPICS.forEach(function (t) {
    byId[t.id] = t;
    // ключ упражнения стабилен, пока не меняется порядок заданий в теме
    (t.practice || []).forEach(function (ex, i) { ex.key = t.id + ':' + i; ex.topic = t.id; });
  });

  G.data = { groups: GROUPS, topics: TOPICS, byId: byId, curriculum: CURRICULUM };
})(window.EG = window.EG || {});
