/* gtoday/gtoday-data.js — содержимое раздела «Грамматика сегодня»: банк фраз для распознавания 12 времён.
   Только данные, без логики и DOM. Всё лежит в EG.gtoday.data — других глобальных имён нет.

   Фраза: [английский с [ключевой формой], перевод, почему это время (сигнал), неверная форма 1, неверная форма 2].
     В английском ровно одна пара скобок — эта часть становится пропуском в задании «Выбери форму».
     Сигнал (yesterday, for, by Friday…) должен быть в самой фразе: без него время не определить однозначно.
   Пара: P(верное время, второе время, смысл по-русски, верная фраза, похожая фраза, почему).
   id фразы = 's-' + slug(английского), пары = 'p-' + slug(верной фразы). Правка английского текста
   меняет id — прогресс этой фразы начнётся заново. */
(function (EG) {
  'use strict';

  var D = (EG.gtoday = EG.gtoday || {}).data = {};

  D.times = { past: 'Прошлое', present: 'Сейчас', future: 'Будущее' };
  // Оригинальные названия: группа (Past / Present / Future) + вид (Simple / Continuous / Perfect / Perfect Continuous) = время
  D.timeNames = { past: 'Past', present: 'Present', future: 'Future' };
  D.aspectNames = { simple: 'Simple', continuous: 'Continuous', perfect: 'Perfect', perfcont: 'Perfect Continuous' };
  D.aspects = {
    simple: 'Просто факт или событие',
    continuous: 'Процесс в этот момент',
    perfect: 'Результат: уже сделано к моменту',
    perfcont: 'Длительность: сколько длилось до момента'
  };

  // point — пояснение к шагу «точка отсчёта», form — формула, ex — опорный пример для знакомства
  D.tenses = [
    { id: 'present-simple', name: 'Present Simple', ru: 'обычно, всегда, по расписанию', time: 'present', aspect: 'simple',
      form: 'V / V-s · do / does', point: 'Смотрим из «сейчас»: так бывает вообще, регулярно.',
      ex: ['She [works] in a bank.', 'Она работает в банке.'] },
    { id: 'present-continuous', name: 'Present Continuous', ru: 'прямо сейчас, временно', time: 'present', aspect: 'continuous',
      form: 'am / is / are + V-ing', point: 'Смотрим из «сейчас»: происходит в эту минуту или в этот период.',
      ex: ['Sorry, I[\'m talking] on the phone.', 'Извини, я говорю по телефону.'] },
    { id: 'past-simple', name: 'Past Simple', ru: 'было и закончилось', time: 'past', aspect: 'simple',
      form: 'V-ed / 2-я форма · did', point: 'Смотрим в прошлое: случилось и закончилось тогда.',
      ex: ['I [saw] him yesterday.', 'Я видел его вчера.'] },
    { id: 'future-simple', name: 'Future Simple', ru: 'решаю сейчас, прогноз, обещание', time: 'future', aspect: 'simple',
      form: 'will + V', point: 'Речь о будущем: решение, прогноз или обещание.',
      ex: ['I think it [will rain].', 'Думаю, будет дождь.'] },
    { id: 'present-perfect', name: 'Present Perfect', ru: 'уже сделано — важен результат сейчас', time: 'present', aspect: 'perfect',
      form: 'have / has + V3', point: 'Смотрим из «сейчас»: важно, что есть на данный момент (ключей нет, опыт есть), а не когда это было.',
      ex: ['I [have lost] my keys.', 'Я потерял ключи (и сейчас их нет).'] },
    { id: 'past-continuous', name: 'Past Continuous', ru: 'был в процессе в тот момент', time: 'past', aspect: 'continuous',
      form: 'was / were + V-ing', point: 'Смотрим в конкретный момент прошлого.',
      ex: ['I [was driving] when you called.', 'Я был за рулём, когда ты позвонил.'] },
    { id: 'past-perfect', name: 'Past Perfect', ru: 'случилось раньше другого прошлого', time: 'past', aspect: 'perfect',
      form: 'had + V3', point: 'Точка отсчёта — момент в прошлом, а действие случилось ещё раньше.',
      ex: ['When I arrived, the film [had started].', 'Когда я пришёл, фильм уже начался.'] },
    { id: 'present-perfect-continuous', name: 'Present Perfect Continuous', ru: 'длится до сих пор — как долго', time: 'present', aspect: 'perfcont',
      form: 'have / has been + V-ing', point: 'Смотрим из «сейчас»: длится до этой минуты (по-русски часто настоящее: «жду уже час»).',
      ex: ['I [have been waiting] for an hour.', 'Я жду уже час.'] },
    { id: 'future-continuous', name: 'Future Continuous', ru: 'буду в процессе в тот момент', time: 'future', aspect: 'continuous',
      form: 'will be + V-ing', point: 'Конкретный момент в будущем («завтра в 8»).',
      ex: ['This time tomorrow I[\'ll be flying] to Rome.', 'Завтра в это время я буду лететь в Рим.'] },
    { id: 'future-perfect', name: 'Future Perfect', ru: 'будет готово к сроку', time: 'future', aspect: 'perfect',
      form: 'will have + V3', point: 'Точка отсчёта — срок в будущем («к пятнице»).',
      ex: ['I [will have finished] by Friday.', 'Я закончу к пятнице.'] },
    { id: 'past-perfect-continuous', name: 'Past Perfect Continuous', ru: 'длилось до момента в прошлом', time: 'past', aspect: 'perfcont',
      form: 'had been + V-ing', point: 'Точка отсчёта — момент в прошлом, действие длилось до него.',
      ex: ['His eyes were red — he [had been crying].', 'У него были красные глаза — он плакал.'] },
    { id: 'future-perfect-continuous', name: 'Future Perfect Continuous', ru: 'сколько будет длиться к сроку', time: 'future', aspect: 'perfcont',
      form: 'will have been + V-ing', point: 'Точка отсчёта — срок в будущем, к нему действие будет длиться уже какое-то время.',
      ex: ['By June I [will have been working] here for five years.', 'В июне будет пять лет, как я здесь работаю.'] }
  ];
  // Порядок D.tenses — порядок изучения: от частого и простого к редкому; времена открываются по одному.

  var S = {
    'present-simple': [
      ['My dad usually [drives] to work.', 'Папа обычно ездит на работу на машине.', 'usually — привычка, регулярное действие.', 'is driving', 'drove'],
      ['I [drink] coffee every morning.', 'Я пью кофе каждое утро.', 'every morning — повторяется каждый день.', 'am drinking', 'have drunk'],
      ['The museum [opens] at ten on Sundays.', 'По воскресеньям музей открывается в десять.', 'Расписание — Present Simple.', 'is opening', 'open'],
      ['Water [boils] at 100 degrees.', 'Вода кипит при 100 градусах.', 'Научный факт — верно всегда.', 'is boiling', 'boil'],
      ['She never [eats] meat.', 'Она никогда не ест мясо.', 'never — привычка («никогда так не делает»).', 'is eating', 'eat'],
      ['How often [do you go] to the gym?', 'Как часто ты ходишь в спортзал?', 'How often — вопрос о регулярности.', 'are you going', 'does you go'],
      ['My brother [doesn\'t like] horror films.', 'Мой брат не любит фильмы ужасов.', 'like — глагол состояния; «вообще не любит» — факт.', 'isn\'t liking', 'don\'t like'],
      ['We [have] English classes twice a week.', 'У нас уроки английского дважды в неделю.', 'twice a week — регулярно.', 'are having', 'has'],
      ['I [know] what you mean.', 'Я понимаю, что ты имеешь в виду.', 'know — глагол состояния: его не ставят в -ing даже «сейчас».', 'am knowing', 'knows'],
      ['It often [rains] here in autumn.', 'Осенью здесь часто идут дожди.', 'often — регулярно.', 'is raining', 'rain']
    ],
    'present-continuous': [
      ['Shh! The baby [is sleeping].', 'Тсс! Малыш спит.', 'Shh! — прямо сейчас, в момент речи.', 'sleeps', 'slept'],
      ['Look! It [is snowing]!', 'Смотри! Идёт снег!', 'Look! — происходит на глазах.', 'snows', 'has snowed'],
      ['I can\'t talk now — I [am driving].', 'Не могу говорить — я за рулём.', 'now — процесс в момент речи.', 'drive', 'drove'],
      ['She [is staying] with her parents this week.', 'На этой неделе она живёт у родителей.', 'this week — временная ситуация.', 'stays', 'stay'],
      ['What [are you doing] right now?', 'Что ты делаешь прямо сейчас?', 'right now — в эту минуту.', 'do you do', 'did you do'],
      ['Prices [are going] up these days.', 'В последнее время цены растут.', 'these days — изменение, которое идёт сейчас.', 'go', 'goes'],
      ['We [are meeting] Anna tomorrow — we booked a table.', 'Завтра мы встречаемся с Анной — уже забронировали столик.', 'Договорённость на будущее (всё решено и организовано) — Present Continuous.', 'meet', 'met'],
      ['At the moment I [am reading] a great book.', 'Сейчас я читаю отличную книгу.', 'at the moment — в данный период.', 'read', 'have read'],
      ['Listen! Someone [is knocking] at the door.', 'Слышишь? Кто-то стучит в дверь.', 'Listen! — прямо сейчас.', 'knocks', 'knocked'],
      ['Why [are you laughing]? What\'s so funny?', 'Почему ты смеёшься? Что смешного?', 'Вопрос о том, что происходит в эту минуту.', 'do you laugh', 'you laughing']
    ],
    'past-simple': [
      ['I [saw] Tom at the station yesterday.', 'Вчера я видел Тома на вокзале.', 'yesterday — законченное время в прошлом.', 'have seen', 'see'],
      ['We [moved] to Kazan in 2019.', 'Мы переехали в Казань в 2019 году.', 'in 2019 — точная дата в прошлом.', 'have moved', 'move'],
      ['She [didn\'t call] me last night.', 'Вчера вечером она мне не позвонила.', 'last night — прошлое; после didn\'t — начальная форма.', 'didn\'t called', 'hasn\'t called'],
      ['When [did you arrive]?', 'Когда ты приехал?', 'Вопрос «когда?» — про конкретный момент в прошлом.', 'have you arrived', 'do you arrive'],
      ['Two years ago I [worked] in a café.', 'Два года назад я работал в кафе.', 'ago — Past Simple.', 'have worked', 'work'],
      ['He [lost] his phone on the bus last week.', 'На прошлой неделе он потерял телефон в автобусе.', 'last week — законченное прошлое.', 'has lost', 'loses'],
      ['I got up, [had] a shower and left for work.', 'Я встал, принял душ и ушёл на работу.', 'Цепочка событий одно за другим — Past Simple.', 'have had', 'have'],
      ['[Did you enjoy] the concert last night?', 'Тебе понравился концерт вчера вечером?', 'last night — прошлое; вопрос с did.', 'Have you enjoyed', 'Do you enjoy'],
      ['Shakespeare [wrote] Hamlet.', 'Шекспир написал «Гамлета».', 'Автора давно нет, событие осталось в прошлом.', 'has written', 'writes'],
      ['When I was a child, I [walked] to school every day.', 'В детстве я каждый день ходил в школу пешком.', 'When I was a child — прошлый период; прошлые привычки — Past Simple.', 'have walked', 'walk']
    ],
    'future-simple': [
      ['I think it [will rain] tomorrow.', 'Думаю, завтра будет дождь.', 'I think — прогноз, мнение о будущем.', 'rains', 'rained'],
      ['"It\'s hot in here." — "I [will open] the window."', '«Тут жарко». — «Я открою окно».', 'Решение в момент речи — will.', 'open', 'opened'],
      ['Don\'t worry, I [won\'t tell] anyone.', 'Не волнуйся, я никому не скажу.', 'Обещание — will / won\'t.', 'didn\'t tell', 'don\'t told'],
      ['[Will you help] me with this box?', 'Поможешь мне с этой коробкой?', 'Просьба о будущем — Will you…?', 'Do you help', 'Did you help'],
      ['Maybe he [will come] later.', 'Может, он придёт позже.', 'maybe + later — предположение о будущем.', 'coming', 'come'],
      ['I promise I [will call] you tonight.', 'Обещаю, я позвоню тебе вечером.', 'I promise — обещание.', 'called', 'calling'],
      ['One day robots [will do] all the housework.', 'Однажды роботы будут делать всю работу по дому.', 'One day — прогноз о будущем.', 'did', 'doing'],
      ['"Tea or coffee?" — "[I\'ll have] tea, please."', '«Чай или кофе?» — «Мне чай, пожалуйста».', 'Решение прямо сейчас, заказ — will.', 'I had', 'I having'],
      ['If it rains, we [will stay] at home.', 'Если пойдёт дождь, мы останемся дома.', 'Главная часть условия про будущее — will (а после if — Present Simple).', 'stayed', 'staying']
    ],
    'present-perfect': [
      ['[Have you ever been] to Japan?', 'Ты когда-нибудь был в Японии?', 'ever — опыт «за всю жизнь» до этого момента.', 'Are you ever', 'Did you ever be'],
      ['I [have known] Mike since school.', 'Я знаю Майка со школы.', 'since + состояние длится до сих пор (по-русски — настоящее!).', 'know', 'am knowing'],
      ['The report is ready — I [have finished] it.', 'Отчёт готов — я его закончил.', 'Результат виден сейчас (отчёт готов), время не названо.', 'finish', 'am finishing'],
      ['We [have lived] here for ten years.', 'Мы живём здесь десять лет.', 'for ten years + до сих пор (по-русски — настоящее!).', 'live', 'are living'],
      ['I [have never seen] snow.', 'Я никогда не видел снега.', 'never — опыт за всю жизнь до сейчас.', 'have never see', 'am never seeing'],
      ['She [has just left] — you missed her.', 'Она только что ушла — ты с ней разминулся.', 'just — только что; результат: её здесь нет.', 'just leaves', 'is just leaving'],
      ['How many cups of coffee [have you had] today?', 'Сколько чашек кофе ты сегодня выпил?', 'today — день ещё не закончился, считаем «до сейчас».', 'do you have', 'are you having'],
      ['I [haven\'t finished] my homework yet.', 'Я ещё не сделал домашнее задание.', 'yet — «ещё не» к этому моменту.', 'don\'t finish', 'am not finish'],
      ['This is the best pizza I [have ever eaten].', 'Это лучшая пицца, которую я когда-либо ел.', 'the best … ever — опыт за всю жизнь.', 'ever eat', 'am ever eating'],
      ['He [has broken] his leg, so he can\'t play today.', 'Он сломал ногу, так что сегодня не может играть.', 'Результат сейчас: нога сломана → не может играть.', 'breaks', 'is breaking']
    ],
    'past-continuous': [
      ['At 8 pm yesterday I [was having] dinner.', 'Вчера в 8 вечера я ужинал.', 'At 8 pm yesterday — процесс в конкретный момент прошлого.', 'am having', 'have had'],
      ['I [was driving] when you called.', 'Я был за рулём, когда ты позвонил.', 'Фон (процесс), который прервал звонок.', 'am driving', 'have driven'],
      ['While she [was cooking], the kids were watching TV.', 'Пока она готовила, дети смотрели телевизор.', 'while — два процесса шли одновременно.', 'is cooking', 'has cooked'],
      ['What [were you doing] at midnight?', 'Что ты делал в полночь?', 'В конкретный момент прошлого — процесс.', 'are you doing', 'have you done'],
      ['It [was raining] when we left the house.', 'Когда мы вышли из дома, шёл дождь.', 'Фон: дождь уже шёл, когда мы вышли.', 'rains', 'has rained'],
      ['Sorry, I [wasn\'t listening]. Can you repeat that?', 'Извини, я не слушал. Можешь повторить?', 'Процесс в тот момент, когда собеседник говорил.', 'didn\'t listening', 'don\'t listen'],
      ['This time last year we [were travelling] around Italy.', 'В это время в прошлом году мы путешествовали по Италии.', 'this time last year — процесс в момент прошлого.', 'are travelling', 'have travelled'],
      ['The sun [was shining] when we woke up.', 'Когда мы проснулись, светило солнце.', 'Фон в прошлом: солнце уже светило.', 'shines', 'has shone']
    ],
    'past-perfect': [
      ['When I arrived, the film [had already started].', 'Когда я пришёл, фильм уже начался.', 'Начался раньше, чем я пришёл, — одно прошлое раньше другого.', 'has already started', 'already starts'],
      ['I [had never flown] before that trip.', 'До той поездки я ни разу не летал.', 'before that trip — опыт до момента в прошлом.', 'have never flown', 'never fly'],
      ['She was upset because she [had lost] her wallet.', 'Она была расстроена, потому что потеряла кошелёк.', 'Потеряла раньше, чем расстроилась.', 'has lost', 'loses'],
      ['By the time we got to the station, the train [had left].', 'Когда мы добрались до вокзала, поезд уже ушёл.', 'by the time + прошлое → к тому моменту уже.', 'has left', 'leaves'],
      ['He told me he [had seen] the film twice.', 'Он сказал, что смотрел этот фильм дважды.', 'Косвенная речь: смотрел раньше, чем сказал.', 'has seen', 'sees'],
      ['After she [had finished] work, she went home.', 'Закончив работу, она пошла домой.', 'after — одно действие закончилось раньше другого.', 'has finished', 'finishes'],
      ['I didn\'t recognise him — he [had changed] so much.', 'Я его не узнал — он так изменился.', 'Изменился раньше момента, когда я его увидел.', 'has changed', 'changes'],
      ['The kitchen was clean: someone [had washed] the dishes.', 'Кухня была чистой: кто-то помыл посуду.', 'Результат к моменту в прошлом.', 'has washed', 'washes']
    ],
    'present-perfect-continuous': [
      ['I [have been waiting] for you for an hour!', 'Я жду тебя уже час!', 'for an hour + до сих пор (по-русски — настоящее!).', 'am waiting', 'wait'],
      ['She [has been learning] English since May.', 'Она учит английский с мая.', 'since May — длится с прошлого до сейчас.', 'is learning', 'learns'],
      ['How long [have you been working] here?', 'Сколько ты здесь работаешь?', 'How long — вопрос о длительности до сейчас.', 'are you working', 'do you work'],
      ['You look tired. [Have you been running]?', 'Ты выглядишь уставшим. Ты бегал?', 'Недавний процесс, следы которого видны сейчас.', 'Are you running', 'Do you run'],
      ['It [has been raining] all day.', 'Весь день идёт дождь.', 'all day — процесс длится до сих пор.', 'rains', 'is rain'],
      ['My hands are dirty because I [have been painting] the fence.', 'У меня грязные руки, потому что я красил забор.', 'Процесс недавно шёл, и видны его следы.', 'paint', 'am paint'],
      ['We [have been living] in this flat for three years.', 'Мы живём в этой квартире три года.', 'for three years — длительность до сейчас.', 'are living', 'live'],
      ['He [has been playing] video games since morning.', 'Он с утра играет в видеоигры.', 'since morning — с утра и до сих пор.', 'is playing', 'plays']
    ],
    'future-continuous': [
      ['This time tomorrow I [will be flying] to Rome.', 'Завтра в это время я буду лететь в Рим.', 'this time tomorrow — процесс в момент будущего.', 'fly', 'flew'],
      ['Don\'t call me at 8 — I [will be having] dinner.', 'Не звони в 8 — я буду ужинать.', 'В 8 буду в процессе.', 'have', 'had'],
      ['At noon tomorrow we [will be sitting] on the beach.', 'Завтра в полдень мы будем сидеть на пляже.', 'at noon tomorrow — процесс в конкретный момент будущего.', 'sit', 'sat'],
      ['[Will you be using] the car tonight?', 'Ты будешь пользоваться машиной вечером?', 'Вежливый вопрос о планах — Future Continuous.', 'Do you use', 'Did you use'],
      ['In an hour I [will be driving] home.', 'Через час я буду ехать домой.', 'В момент через час — процесс.', 'drive', 'drove'],
      ['At 10 tomorrow she [will be taking] her exam.', 'Завтра в 10 она будет сдавать экзамен.', 'at 10 tomorrow — будет в процессе.', 'take', 'took']
    ],
    'future-perfect': [
      ['I [will have finished] the report by Friday.', 'Я закончу отчёт к пятнице.', 'by Friday — к сроку уже будет готово.', 'finish', 'finished'],
      ['By 2030 they [will have built] a new bridge.', 'К 2030 году построят новый мост.', 'by 2030 — результат к моменту в будущем.', 'build', 'built'],
      ['By the time you get home, I [will have cooked] dinner.', 'К твоему приходу я уже приготовлю ужин.', 'by the time — к этому моменту будет готово.', 'cook', 'cooked'],
      ['[Will you have finished] by six?', 'Ты закончишь к шести?', 'by six — к сроку.', 'Do you finish', 'Did you finish'],
      ['By the end of the year she [will have saved] 1000 dollars.', 'К концу года она накопит 1000 долларов.', 'by the end of the year — итог к сроку.', 'saves', 'saved'],
      ['Don\'t worry, the film [will have ended] by ten.', 'Не волнуйся, фильм закончится к десяти.', 'by ten — к этому моменту уже закончится.', 'ends', 'ended']
    ],
    'past-perfect-continuous': [
      ['She [had been working] there for ten years before she left.', 'Она проработала там десять лет, прежде чем уйти.', 'for ten years before she left — длительность до момента в прошлом.', 'has been working', 'is working'],
      ['His eyes were red — he [had been crying].', 'У него были красные глаза — он плакал.', 'Процесс до момента в прошлом, следы видны тогда.', 'has been crying', 'is crying'],
      ['We [had been walking] for hours when we finally found a café.', 'Мы шли уже несколько часов, когда наконец нашли кафе.', 'for hours + when … found — длилось до момента в прошлом.', 'have been walking', 'are walking'],
      ['The ground was wet because it [had been raining].', 'Земля была мокрой, потому что шёл дождь.', 'Процесс до момента в прошлом, видны его следы.', 'has been raining', 'is raining'],
      ['How long [had you been waiting] when the bus came?', 'Сколько ты прождал, когда пришёл автобус?', 'How long + when … came — длительность до момента в прошлом.', 'have you been waiting', 'are you waiting'],
      ['I was tired because I [had been studying] all night.', 'Я был уставшим, потому что учился всю ночь.', 'all night — длилось до момента в прошлом.', 'have been studying', 'am studying']
    ],
    'future-perfect-continuous': [
      ['By June I [will have been working] here for five years.', 'В июне будет пять лет, как я здесь работаю.', 'by June + for five years — длительность к моменту в будущем.', 'will work', 'have been working'],
      ['By the time you arrive, we [will have been waiting] for two hours.', 'К твоему приезду мы будем ждать уже два часа.', 'by the time + for two hours.', 'will wait', 'are waiting'],
      ['Next month she [will have been teaching] for 20 years.', 'В следующем месяце будет 20 лет, как она преподаёт.', 'next month + for 20 years — «юбилейный» подсчёт.', 'will teach', 'teaches'],
      ['At 6 pm I [will have been driving] for ten hours.', 'В 6 вечера будет десять часов, как я за рулём.', 'at 6 pm + for ten hours.', 'will drive', 'drive'],
      ['By midnight they [will have been dancing] for five hours.', 'К полуночи они будут танцевать уже пять часов.', 'by midnight + for five hours.', 'will dance', 'dance']
    ]
  };

  function P(tense, other, ru, right, wrong, why) {
    return { tense: tense, other: other, ru: ru, right: right, wrong: wrong, why: why };
  }

  // Пары «Что точнее передаёт смысл?» — одно и то же предложение в двух временах.
  // Главная тренировка различения: смысл решает, какое время нужно.
  var PAIRS = [
    P('present-simple', 'present-continuous', 'Он водитель — это его работа.', 'He drives a bus.', 'He\'s driving a bus.', 'Постоянное занятие — Simple. Continuous значило бы «прямо сейчас он за рулём».'),
    P('present-continuous', 'present-simple', 'Прямо сейчас, в эту минуту, он за рулём.', 'He\'s driving.', 'He drives.', 'В момент речи — Continuous. Simple значило бы «он вообще водит машину».'),
    P('present-perfect', 'past-simple', 'Он был в Париже в прошлом году.', 'He was in Paris last year.', 'He has been in Paris last year.', 'Названо прошлое время (last year) — только Past Simple.'),
    P('present-perfect', 'past-simple', 'Я потерял ключи, и сейчас их у меня нет.', 'I\'ve lost my keys.', 'I lost my keys in 2015.', 'Важен результат сейчас — Present Perfect. С датой в прошлом (in 2015) — просто история.'),
    P('present-perfect', 'present-simple', 'Я живу здесь с 2015 года.', 'I\'ve lived here since 2015.', 'I live here since 2015.', 'since + «до сих пор» — Present Perfect, хотя по-русски настоящее время.'),
    P('present-perfect', 'present-perfect-continuous', 'Я написал три письма — вот они, готовы.', 'I\'ve written three emails.', 'I\'ve been writing three emails.', 'Итог, сколько сделано — Present Perfect.'),
    P('present-perfect-continuous', 'present-perfect', 'Я весь день красил комнату — устал и весь в краске.', 'I\'ve been painting the room all day.', 'I\'ve painted the room all day.', 'Процесс и его длительность (all day) — Perfect Continuous.'),
    P('present-perfect-continuous', 'present-continuous', 'Я жду уже час.', 'I\'ve been waiting for an hour.', 'I\'m waiting for an hour.', 'for an hour + до сих пор — Perfect Continuous. Главная ловушка для русскоговорящих.'),
    P('past-continuous', 'past-simple', 'Когда пришёл Том, я как раз готовил ужин.', 'I was cooking dinner when Tom came.', 'I cooked dinner when Tom came.', 'Процесс-фон — Past Continuous. Past Simple значило бы «Том пришёл — и тогда я приготовил ужин».'),
    P('past-simple', 'past-continuous', 'Вчера я посмотрел фильм — от начала до конца.', 'I watched a film yesterday.', 'I was watching a film yesterday.', 'Законченное событие — Past Simple. Continuous рисует процесс, который чем-то прервался.'),
    P('past-perfect', 'past-simple', 'Когда я пришёл, фильм уже шёл (начался до моего прихода).', 'When I arrived, the film had started.', 'When I arrived, the film started.', 'Одно прошлое раньше другого — Past Perfect. Past Simple: пришёл, и после этого фильм начался.'),
    P('past-perfect-continuous', 'past-perfect', 'Она устала, потому что долго бегала.', 'She was tired because she had been running.', 'She was tired because she had run 10 km.', 'Процесс и его длительность до момента в прошлом — Perfect Continuous. Past Perfect — итог (10 км).'),
    P('future-simple', 'present-simple', 'Я решил прямо сейчас: открою окно.', 'I\'ll open the window.', 'I open the window.', 'Решение в момент речи — will.'),
    P('future-simple', 'present-simple', 'Если завтра будет дождь, мы останемся дома.', 'If it rains tomorrow, we\'ll stay at home.', 'If it will rain tomorrow, we\'ll stay at home.', 'После if — Present Simple, will только в главной части.'),
    P('present-continuous', 'future-simple', 'Мы уже договорились: завтра встречаемся с Анной.', 'We\'re meeting Anna tomorrow.', 'We\'ll meet Anna tomorrow, I think.', 'Готовая договорённость — Present Continuous. will + I think — лишь предположение.'),
    P('future-continuous', 'future-simple', 'Завтра в 9 я буду занят работой (в процессе).', 'At 9 tomorrow I\'ll be working.', 'At 9 tomorrow I\'ll work.', 'В процессе в момент будущего — Future Continuous.'),
    P('future-perfect', 'future-continuous', 'К шести отчёт уже будет готов.', 'I\'ll have finished the report by six.', 'I\'ll be finishing the report at six.', 'by six — к сроку уже сделано: Future Perfect. Continuous — в шесть ещё в процессе.'),
    P('future-perfect', 'future-perfect-continuous', 'К вечеру я прочитаю 100 страниц (итог).', 'By the evening I\'ll have read 100 pages.', 'By the evening I\'ll have been reading 100 pages.', 'Итог, количество — Future Perfect. Perfect Continuous — сколько времени.'),
    P('past-simple', 'present-simple', 'Раньше я работал в банке, теперь — нет.', 'I worked in a bank.', 'I work in a bank.', 'Закончилось в прошлом — Past Simple.')
  ];

  function slug(s) {
    return String(s).toLowerCase().replace(/[[\]]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);
  }

  D.items = [];
  D.byId = Object.create(null);
  D.tensesById = Object.create(null);
  D.tenses.forEach(function (t, i) { t.order = i; D.tensesById[t.id] = t; });
  D.tenses.forEach(function (t) {
    (S[t.id] || []).forEach(function (r) {
      var key = (r[0].match(/\[([^\]]+)\]/) || [])[1] || '';
      var it = { id: 's-' + slug(r[0]), kind: 'sentence', tense: t.id, en: r[0], ru: r[1], why: r[2], answer: key, wrong: [r[3], r[4]] };
      D.items.push(it); D.byId[it.id] = it;
    });
  });
  PAIRS.forEach(function (p) {
    var it = Object.assign({ id: 'p-' + slug(p.right), kind: 'pair' }, p);
    D.items.push(it); D.byId[it.id] = it;
  });
  D.slug = slug;
})(window.EG = window.EG || {});
