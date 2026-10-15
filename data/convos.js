/* data/convos.js — раздел «Чтение диалогов»: живые разговоры A1–C1 по возрастанию сложности + тест на понимание.
   Диалог: { id, level, topic (ключ D.textTopics), title, titleRu, setting, settingRu, lines: [L], notes: [N], glossary, questions }.
   Реплика L(who, en, ru). Заметка о грамматике N(фраза из диалога дословно, id времени/конструкции из D.convoGrammar, пояснение):
   из заметок собирается список «Времена в диалоге», а нажатие на слово такой фразы показывает пояснение.
   Вопросы — как в data/texts.js: по-английски, перевод qRu/optionsRu по кнопке «Перевод».
   Порядок в D.convos = порядок сложности: новый диалог добавляйте в нужное место своего уровня. */
(function (EG) {
  'use strict';

  var D = EG.data = EG.data || {};
  var TF = ['Верно', 'Неверно'];
  var TFE = ['True', 'False'];
  function Q(q, options, answer, explain, qRu, optionsRu) {
    return { q: q, options: options, answer: answer, explain: explain || '', qRu: qRu, optionsRu: optionsRu || (options === TFE ? TF : null) };
  }
  function L(who, en, ru) { return { who: who, en: en, ru: ru }; }
  function N(phrase, gram, note) { return { phrase: phrase, gram: gram, note: note }; }
  function C(id, level, topic, title, titleRu, setting, settingRu, lines, notes, glossary, questions) {
    return { id: id, level: level, topic: topic, title: title, titleRu: titleRu, setting: setting, settingRu: settingRu,
      lines: lines, notes: notes, glossary: glossary, questions: questions };
  }

  /** Времена и конструкции, которые встречаются в диалогах. id времён совпадают с #/tenses/:id. */
  D.convoGrammar = {
    'present-simple': 'Present Simple',
    'present-continuous': 'Present Continuous',
    'present-perfect': 'Present Perfect',
    'present-perfect-continuous': 'Present Perfect Continuous',
    'past-simple': 'Past Simple',
    'past-continuous': 'Past Continuous',
    'past-perfect': 'Past Perfect',
    'past-perfect-continuous': 'Past Perfect Continuous',
    'future-simple': 'Future Simple (will)',
    'future-continuous': 'Future Continuous',
    'future-perfect': 'Future Perfect',
    'future-perfect-continuous': 'Future Perfect Continuous',
    'going-to': 'be going to',
    'used-to': 'used to / would',
    'conditional': 'Условные предложения',
    'passive': 'Пассивный залог',
    'modal-perfect': 'must / should / could + have V3',
    'unreal-past': 'wish / would rather',
    'inversion': 'Инверсия'
  };

  D.convos = [
    /* ================= A1 ================= */
    C('cv-a1-neighbour', 'A1', 'people', 'The New Neighbour', 'Новая соседка',
      'Sam meets a woman on the stairs of his building.', 'Сэм встречает на лестнице своего дома незнакомую девушку.', [
        L('Sam', 'Hi! Are you the new neighbour?', 'Привет! Вы новая соседка?'),
        L('Lucy', "Yes, I am. I'm Lucy. I live in flat number five.", 'Да. Я Люси. Я живу в квартире номер пять.'),
        L('Sam', "Nice to meet you, Lucy. I'm Sam. I live next door.", 'Приятно познакомиться, Люси. Я Сэм. Я живу по соседству.'),
        L('Lucy', 'Nice to meet you too! What are you doing with all those boxes?', 'Мне тоже приятно! А что вы делаете со всеми этими коробками?'),
        L('Sam', "I'm helping my sister. She's moving to a new house today.", 'Помогаю сестре. Она сегодня переезжает в новый дом.'),
        L('Lucy', 'Oh, that\'s nice. Do you need any help?', 'О, здорово. Вам нужна помощь?'),
        L('Sam', "No, thanks, it's OK. Do you work near here?", 'Нет, спасибо, всё в порядке. Вы работаете где-то рядом?'),
        L('Lucy', "Yes, I work at the hospital on Green Street. I'm a nurse.", 'Да, я работаю в больнице на Грин-стрит. Я медсестра.'),
        L('Sam', "Really? My mum works there too! She's a doctor.", 'Правда? Моя мама тоже там работает! Она врач.'),
        L('Lucy', "What's her name?", 'Как её зовут?'),
        L('Sam', 'Helen Brown. She usually works at night.', 'Хелен Браун. Она обычно работает по ночам.'),
        L('Lucy', "I know Helen! She's very kind. It's a small world!", 'Я знаю Хелен! Она очень добрая. Мир тесен!')
      ], [
        N('I live next door', 'present-simple', 'Постоянный факт: где человек живёт.'),
        N("I'm helping my sister", 'present-continuous', 'Действие идёт прямо сейчас, в момент разговора.'),
        N("She's moving to a new house today", 'present-continuous', 'Процесс, который происходит сегодня.'),
        N('She usually works at night', 'present-simple', 'Регулярное действие — подсказка usually.')
      ], [
        ['Nice to meet you', 'приятно познакомиться'], ['next door', 'по соседству'], ['all those boxes', 'все эти коробки'],
        ['Do you need any help?', 'Вам нужна помощь?'], ["It's a small world", 'мир тесен']
      ], [
        Q('Where does Lucy live?', ['In flat number five', 'At the hospital', "In Sam's house", 'In a new house'], 0, '«I live in flat number five.»', 'Где живёт Люси?', ['В квартире номер пять', 'В больнице', 'В доме Сэма', 'В новом доме']),
        Q('What is Sam doing with the boxes?', ['He is moving to a new flat', 'He is helping his sister', 'He is selling them', 'He is taking them to the hospital'], 1, '«I\'m helping my sister. She\'s moving…»', 'Что Сэм делает с коробками?', ['Переезжает в новую квартиру', 'Помогает сестре', 'Продаёт их', 'Везёт их в больницу']),
        Q('Lucy is a doctor.', TFE, 1, '«I\'m a nurse» — она медсестра. Врач — мама Сэма.', 'Люси — врач.'),
        Q('Who is Helen Brown?', ["Lucy's sister", "Sam's mum", "Sam's neighbour", 'A nurse'], 1, '«My mum works there too… Helen Brown.»', 'Кто такая Хелен Браун?', ['Сестра Люси', 'Мама Сэма', 'Соседка Сэма', 'Медсестра']),
        Q('Why does Sam say "She usually works at night", not "She is working at night"?', ['It is a habit, so he uses Present Simple', 'It is happening right now', 'It happened yesterday', 'It is a plan for tomorrow'], 0, 'usually — регулярное действие → Present Simple.', 'Почему Сэм говорит «She usually works at night», а не «She is working at night»?', ['Это привычка, поэтому Present Simple', 'Это происходит прямо сейчас', 'Это было вчера', 'Это план на завтра']),
        Q('"It\'s a small world" means…', ['The city is very small', 'It is surprising that people know the same person', 'The world is in danger', 'Lucy wants to travel'], 1, 'Так говорят, когда случайно находятся общие знакомые.', '«It\'s a small world» означает…', ['Город очень маленький', 'Удивительно, что у людей общий знакомый', 'Мир в опасности', 'Люси хочет путешествовать'])
      ]),

    C('cv-a1-cafe', 'A1', 'food', 'A Rainy Morning at the Café', 'Дождливое утро в кафе',
      'Mia and Ben are having breakfast in a small café.', 'Миа и Бен завтракают в маленьком кафе.', [
        L('Waiter', 'Good morning! Are you ready to order?', 'Доброе утро! Готовы сделать заказ?'),
        L('Mia', 'Yes, please. Can I have a cup of tea and a cheese sandwich?', 'Да, пожалуйста. Можно чашку чая и бутерброд с сыром?'),
        L('Waiter', 'Of course. And for you, sir?', 'Конечно. А вам, сэр?'),
        L('Ben', "Hmm, I'm still looking at the menu. What do you recommend?", 'Хм, я ещё смотрю меню. Что вы посоветуете?'),
        L('Waiter', 'Our pancakes are very popular. Everyone loves them.', 'Наши блинчики очень популярны. Их все любят.'),
        L('Ben', 'Do they come with fruit?', 'Их подают с фруктами?'),
        L('Waiter', 'Yes, they come with bananas and strawberries.', 'Да, с бананами и клубникой.'),
        L('Ben', "Great, I'll have the pancakes and an orange juice, please.", 'Отлично, я возьму блинчики и апельсиновый сок, пожалуйста.'),
        L('Waiter', 'Anything else?', 'Что-нибудь ещё?'),
        L('Mia', "No, thank you. Oh, look — it's raining again!", 'Нет, спасибо. Ой, смотрите — опять дождь!'),
        L('Waiter', 'Yes, it often rains here in October. You can stay as long as you like.', 'Да, в октябре здесь часто идёт дождь. Можете сидеть сколько хотите.'),
        L('Ben', "Perfect. We aren't in a hurry today.", 'Отлично. Мы сегодня не спешим.')
      ], [
        N("I'm still looking at the menu", 'present-continuous', 'Действие в процессе: Бен ещё не выбрал.'),
        N('Everyone loves them', 'present-simple', 'Общий факт. Глаголы-состояния (love, like, know) почти не бывают в Continuous.'),
        N("I'll have the pancakes", 'future-simple', 'will — решение, принятое в момент речи (типичная фраза для заказа).'),
        N("it's raining again", 'present-continuous', 'Дождь идёт прямо сейчас.'),
        N('it often rains here in October', 'present-simple', 'Так бывает обычно — подсказка often.')
      ], [
        ['Are you ready to order?', 'Готовы сделать заказ?'], ['What do you recommend?', 'Что вы посоветуете?'], ['come with', 'подаваться с (о блюде)'],
        ['Anything else?', 'Что-нибудь ещё?'], ['as long as you like', 'сколько хотите'], ['in a hurry', 'в спешке']
      ], [
        Q('What does Mia order?', ['Pancakes and juice', 'Tea and a cheese sandwich', 'Coffee and a cake', 'Only tea'], 1, '«Can I have a cup of tea and a cheese sandwich?»', 'Что заказывает Миа?', ['Блинчики и сок', 'Чай и бутерброд с сыром', 'Кофе и пирожное', 'Только чай']),
        Q('Why does Ben ask the waiter for advice?', ['He doesn\'t like pancakes', 'He is still looking at the menu', 'He is in a hurry', 'He has no money'], 1, '«I\'m still looking at the menu. What do you recommend?»', 'Почему Бен просит совета у официанта?', ['Он не любит блинчики', 'Он ещё смотрит меню', 'Он спешит', 'У него нет денег']),
        Q('What do the pancakes come with?', ['Cheese', 'Chocolate', 'Bananas and strawberries', 'Apples'], 2, '«they come with bananas and strawberries».', 'С чем подают блинчики?', ['С сыром', 'С шоколадом', 'С бананами и клубникой', 'С яблоками']),
        Q('Mia and Ben are in a hurry.', TFE, 1, '«We aren\'t in a hurry today.»', 'Миа и Бен спешат.'),
        Q('In "I\'ll have the pancakes", Ben…', ['decides at the moment of speaking', 'talks about a habit', 'remembers the past', 'describes what is happening now'], 0, 'will — решение здесь и сейчас.', 'Во фразе «I\'ll have the pancakes» Бен…', ['принимает решение в момент речи', 'говорит о привычке', 'вспоминает прошлое', 'описывает то, что происходит сейчас']),
        Q('Which sentence is about the weather in general, not right now?', ["It's raining again", 'It often rains here in October', "We aren't in a hurry", 'Everyone loves them'], 1, 'often + Present Simple — так бывает обычно.', 'Какое предложение о погоде вообще, а не прямо сейчас?', ['Опять идёт дождь', 'В октябре здесь часто идут дожди', 'Мы не спешим', 'Их все любят'])
      ]),

    C('cv-a1-call', 'A1', 'daily', 'Where Are You, Dad?', 'Папа, ты где?',
      'Kate phones her dad from the kitchen.', 'Кейт звонит папе с кухни.', [
        L('Kate', 'Hi, Dad! Where are you?', 'Привет, пап! Ты где?'),
        L('Dad', "Hi, sweetie. I'm driving home. Why?", 'Привет, солнышко. Еду домой. А что?'),
        L('Kate', "We're making dinner and we need some eggs. Can you buy them?", 'Мы готовим ужин, и нам нужны яйца. Можешь купить?'),
        L('Dad', 'Sure. How many do you need?', 'Конечно. Сколько нужно?'),
        L('Kate', 'Six, please. And some milk.', 'Шесть, пожалуйста. И молоко.'),
        L('Dad', 'OK. What are you cooking?', 'Хорошо. А что вы готовите?'),
        L('Kate', "Mum's making a cake. It's Grandma's birthday tomorrow!", 'Мама печёт торт. Завтра у бабушки день рождения!'),
        L('Dad', 'Oh no, I always forget birthdays! Are you going to visit her?', 'Ой, я вечно забываю про дни рождения! Вы поедете к ней?'),
        L('Kate', "Yes, we're going to see her after lunch.", 'Да, мы собираемся навестить её после обеда.'),
        L('Dad', 'Good. Is your brother at home?', 'Хорошо. А брат дома?'),
        L('Kate', "Yes, he's in his room. He's playing computer games again.", 'Да, у себя в комнате. Опять играет в компьютерные игры.'),
        L('Dad', 'Of course he is. He plays every day! See you in twenty minutes.', 'Ну конечно. Он играет каждый день! Буду через двадцать минут.')
      ], [
        N("I'm driving home", 'present-continuous', 'Папа сейчас за рулём — действие в процессе.'),
        N('I always forget birthdays', 'present-simple', 'Привычка — подсказка always.'),
        N('Are you going to visit her?', 'going-to', 'Вопрос о плане, который уже есть.'),
        N("we're going to see her after lunch", 'going-to', 'Заранее принятое решение, план.'),
        N('He plays every day', 'present-simple', 'Регулярное действие — every day. Сравните: He\'s playing (сейчас).')
      ], [
        ['sweetie', 'солнышко, милая (ласковое обращение)'], ['How many do you need?', 'Сколько нужно?'], ['Of course he is', 'ну конечно (кто бы сомневался)'],
        ['See you in twenty minutes', 'увидимся через двадцать минут']
      ], [
        Q('Where is Dad?', ['At work', 'In the shop', 'In his car', 'At Grandma\'s house'], 2, '«I\'m driving home.»', 'Где папа?', ['На работе', 'В магазине', 'В машине', 'У бабушки']),
        Q('What does Kate ask Dad to buy?', ['Eggs and milk', 'A cake', 'A present', 'Bread and cheese'], 0, '«we need some eggs… And some milk.»', 'Что Кейт просит купить?', ['Яйца и молоко', 'Торт', 'Подарок', 'Хлеб и сыр']),
        Q('Why is Mum making a cake?', ['It is Kate\'s birthday', 'It is Grandma\'s birthday tomorrow', 'Dad likes cakes', 'They have guests tonight'], 1, '«It\'s Grandma\'s birthday tomorrow!»', 'Почему мама печёт торт?', ['У Кейт день рождения', 'Завтра у бабушки день рождения', 'Папа любит торты', 'Вечером гости']),
        Q('When are they going to visit Grandma?', ['Tonight', 'Before breakfast', 'After lunch', 'Next week'], 2, '«we\'re going to see her after lunch».', 'Когда они собираются к бабушке?', ['Сегодня вечером', 'До завтрака', 'После обеда', 'На следующей неделе']),
        Q('Kate\'s brother is doing his homework.', TFE, 1, '«He\'s playing computer games again.»', 'Брат Кейт делает уроки.'),
        Q('"He plays every day" and "He\'s playing" — what is the difference?', ['No difference', 'The first is a habit, the second is happening now', 'The first is about the past', 'The second is a plan'], 1, 'Present Simple — регулярно, Present Continuous — прямо сейчас.', 'Чем отличаются «He plays every day» и «He\'s playing»?', ['Ничем', 'Первое — привычка, второе — происходит сейчас', 'Первое — о прошлом', 'Второе — план'])
      ]),

    C('cv-a1-weekend', 'A1', 'daily', 'How Was Your Weekend?', 'Как прошли выходные?',
      'Two colleagues talk on Monday morning.', 'Двое коллег болтают в понедельник утром.', [
        L('Leo', 'Hey, Nina! How was your weekend?', 'Привет, Нина! Как выходные?'),
        L('Nina', 'It was great, thanks! I went to the sea with my friends.', 'Отлично, спасибо! Я ездила на море с друзьями.'),
        L('Leo', 'Wow! Was the water warm?', 'Ого! Вода была тёплая?'),
        L('Nina', 'No, it was very cold, but we swam anyway. What did you do?', 'Нет, очень холодная, но мы всё равно плавали. А ты что делал?'),
        L('Leo', 'Nothing special. I stayed at home and watched films.', 'Ничего особенного. Сидел дома и смотрел фильмы.'),
        L('Nina', 'That sounds relaxing. What are you going to do next weekend?', 'Звучит расслабляюще. А что будешь делать в следующие выходные?'),
        L('Leo', "I'm going to visit my cousin in Oxford. He has a new flat there.", 'Собираюсь к двоюродному брату в Оксфорд. У него там новая квартира.'),
        L('Nina', 'Nice! Are you going by train?', 'Здорово! Поедешь на поезде?'),
        L('Leo', 'Yes, the train is fast and cheap on Saturdays.', 'Да, по субботам поезд быстрый и дешёвый.'),
        L('Nina', 'Take some photos for me. I love Oxford!', 'Сфотографируй там что-нибудь для меня. Обожаю Оксфорд!'),
        L('Leo', 'I will. And you? Any plans?', 'Обязательно. А ты? Есть планы?'),
        L('Nina', "I don't know yet. Maybe I'll go to the cinema.", 'Пока не знаю. Может, схожу в кино.')
      ], [
        N('It was great', 'past-simple', 'Прошедшее время глагола be: was / were.'),
        N('I went to the sea', 'past-simple', 'go → went — неправильный глагол.'),
        N('I stayed at home and watched films', 'past-simple', 'Правильные глаголы в прошедшем: + -ed.'),
        N('What did you do?', 'past-simple', 'Вопрос в прошедшем: did + глагол в начальной форме.'),
        N("I'm going to visit my cousin", 'going-to', 'План, о котором Лео уже решил.'),
        N("Maybe I'll go to the cinema", 'future-simple', 'will — нет твёрдого плана, решение «может быть».')
      ], [
        ['How was your weekend?', 'Как прошли выходные?'], ['anyway', 'всё равно'], ['Nothing special', 'ничего особенного'],
        ['That sounds relaxing', 'звучит расслабляюще'], ["I don't know yet", 'пока не знаю']
      ], [
        Q('Where did Nina go at the weekend?', ['To Oxford', 'To the sea', 'To the cinema', 'To her cousin'], 1, '«I went to the sea with my friends.»', 'Куда Нина ездила на выходных?', ['В Оксфорд', 'На море', 'В кино', 'К двоюродному брату']),
        Q('The water was warm.', TFE, 1, '«No, it was very cold, but we swam anyway.»', 'Вода была тёплой.'),
        Q('What did Leo do last weekend?', ['He visited his cousin', 'He went swimming', 'He stayed at home and watched films', 'He worked'], 2, '«I stayed at home and watched films.»', 'Что Лео делал в прошлые выходные?', ['Навещал брата', 'Плавал', 'Сидел дома и смотрел фильмы', 'Работал']),
        Q('Why is Leo going to Oxford?', ['To study', 'To visit his cousin', 'To see a film', 'To buy a flat'], 1, '«I\'m going to visit my cousin in Oxford.»', 'Зачем Лео едет в Оксфорд?', ['Учиться', 'Навестить двоюродного брата', 'Посмотреть фильм', 'Купить квартиру']),
        Q('How is Leo going to travel?', ['By car', 'By bus', 'By train', 'By plane'], 2, '«Are you going by train?» — «Yes».', 'Как Лео поедет?', ['На машине', 'На автобусе', 'На поезде', 'На самолёте']),
        Q('Why does Nina say "Maybe I\'ll go", not "I\'m going to go"?', ['She has a firm plan', 'She is not sure, it is not a plan yet', 'She went yesterday', 'She goes every week'], 1, 'going to — готовый план, will + maybe — решение под вопросом.', 'Почему Нина говорит «Maybe I\'ll go», а не «I\'m going to go»?', ['У неё твёрдый план', 'Она не уверена, это ещё не план', 'Она ходила вчера', 'Она ходит каждую неделю'])
      ]),

    /* ================= A2 ================= */
    C('cv-a2-phone', 'A2', 'city', 'The Lost Phone', 'Потерянный телефон',
      'Jack comes to the lost property office at a train station.', 'Джек приходит в бюро находок на вокзале.', [
        L('Officer', 'Good afternoon. How can I help you?', 'Добрый день. Чем могу помочь?'),
        L('Jack', 'Hi. I think I lost my phone this morning.', 'Здравствуйте. Кажется, я потерял телефон сегодня утром.'),
        L('Officer', "I'm sorry to hear that. Where were you when you last saw it?", 'Сочувствую. Где вы были, когда видели его в последний раз?'),
        L('Jack', 'I was sitting on a bench in the park opposite the station. I was reading a newspaper and talking to a friend.', 'Я сидел на скамейке в парке напротив вокзала. Читал газету и болтал с другом.'),
        L('Officer', 'And when did you notice it was gone?', 'А когда заметили, что его нет?'),
        L('Jack', "When I got to the platform. I put my hand in my pocket and it wasn't there.", 'Когда дошёл до платформы. Сунул руку в карман — а его нет.'),
        L('Officer', 'What does it look like?', 'Как он выглядит?'),
        L('Jack', "It's black, with a blue case. There's a photo of my dog on the screen.", 'Чёрный, в синем чехле. На экране фотография моей собаки.'),
        L('Officer', 'Wait a moment… Someone brought a phone here an hour ago. Is this it?', 'Минутку… Час назад сюда принесли телефон. Этот?'),
        L('Jack', "Yes! That's my dog! Thank you so much!", 'Да! Это моя собака! Огромное спасибо!'),
        L('Officer', 'A woman found it under a bench while she was walking her dog.', 'Его нашла женщина под скамейкой, когда гуляла с собакой.'),
        L('Jack', "I can't believe it. I've never been so lucky!", 'Не могу поверить. Мне никогда так не везло!'),
        L('Officer', 'Just sign here, please. And be more careful next time.', 'Распишитесь здесь, пожалуйста. И в следующий раз будьте внимательнее.')
      ], [
        N('I was sitting on a bench', 'past-continuous', 'Фон в прошлом: что происходило в тот момент.'),
        N('I was reading a newspaper and talking to a friend', 'past-continuous', 'Два процесса одновременно в прошлом.'),
        N('I put my hand in my pocket', 'past-simple', 'Короткие действия одно за другим — Past Simple (put — put — put).'),
        N('Someone brought a phone here an hour ago', 'past-simple', 'ago — точное время в прошлом, значит Past Simple.'),
        N('while she was walking her dog', 'past-continuous', 'while + Past Continuous — длительный фон для короткого события (found).'),
        N("I've never been so lucky", 'present-perfect', 'Жизненный опыт без указания времени — never.')
      ], [
        ['How can I help you?', 'Чем могу помочь?'], ["I'm sorry to hear that", 'сочувствую, жаль это слышать'], ['What does it look like?', 'Как он выглядит?'],
        ['Is this it?', 'Это он?'], ['be more careful', 'будьте внимательнее'], ['next time', 'в следующий раз']
      ], [
        Q('Where was Jack when he last saw his phone?', ['On the platform', 'On a bench in the park', 'On the train', 'At home'], 1, '«I was sitting on a bench in the park opposite the station.»', 'Где был Джек, когда в последний раз видел телефон?', ['На платформе', 'На скамейке в парке', 'В поезде', 'Дома']),
        Q('What was Jack doing in the park?', ['Walking his dog', 'Eating lunch', 'Reading a newspaper and talking to a friend', 'Sleeping'], 2, 'Два действия в Past Continuous.', 'Что Джек делал в парке?', ['Гулял с собакой', 'Обедал', 'Читал газету и болтал с другом', 'Спал']),
        Q('When did he notice the phone was gone?', ['In the park', 'When he got to the platform', 'At home in the evening', 'On the train'], 1, '«When I got to the platform.»', 'Когда он заметил пропажу?', ['В парке', 'Когда дошёл до платформы', 'Дома вечером', 'В поезде']),
        Q('How does Jack recognise his phone?', ['By the colour of the case only', 'By the photo of his dog on the screen', 'By his name on the back', 'By the ringtone'], 1, '«There\'s a photo of my dog on the screen» — «That\'s my dog!»', 'Как Джек узнаёт свой телефон?', ['Только по цвету чехла', 'По фото собаки на экране', 'По имени на крышке', 'По мелодии звонка']),
        Q('Jack found the phone himself.', TFE, 1, 'Телефон нашла женщина, которая гуляла с собакой.', 'Джек сам нашёл телефон.'),
        Q('In "A woman found it while she was walking her dog", which action was longer?', ['found', 'was walking', 'Both were short', 'Neither — it is about the future'], 1, 'Past Continuous — длительный фон, Past Simple — короткое событие на его фоне.', 'Во фразе «A woman found it while she was walking her dog» какое действие длилось дольше?', ['found (нашла)', 'was walking (гуляла)', 'Оба короткие', 'Никакое — это о будущем'])
      ]),

    C('cv-a2-holiday', 'A2', 'travel', 'Have You Ever Been to Italy?', 'Ты был в Италии?',
      'Emma and Dan chat in the college canteen.', 'Эмма и Дэн болтают в столовой колледжа.', [
        L('Emma', 'Have you ever been to Italy, Dan?', 'Дэн, ты когда-нибудь был в Италии?'),
        L('Dan', 'Yes, I have. I went there two years ago with my parents.', 'Да, был. Ездил туда два года назад с родителями.'),
        L('Emma', 'Lucky you! Where did you go?', 'Везёт тебе! А куда именно?'),
        L('Dan', 'We spent a week in Rome. We saw the Colosseum and ate a lot of pizza. What about you?', 'Мы провели неделю в Риме. Видели Колизей и съели кучу пиццы. А ты?'),
        L('Emma', "I've never been to Italy, but I've been to Spain three times.", 'В Италии я ни разу не была, а вот в Испании — три раза.'),
        L('Dan', 'Which place did you like most?', 'Какое место понравилось больше всего?'),
        L('Emma', 'Barcelona. The food was amazing and the people were really friendly.', 'Барселона. Еда потрясающая, а люди очень дружелюбные.'),
        L('Dan', 'Have you tried paella?', 'А паэлью пробовала?'),
        L('Emma', 'Of course! My host family cooked it every Sunday.', 'Конечно! Моя принимающая семья готовила её каждое воскресенье.'),
        L('Dan', 'Host family? Were you studying there?', 'Принимающая семья? Ты там училась?'),
        L('Emma', "Yes, I was doing a Spanish course last summer. And I'm going back in August!", 'Да, прошлым летом я была на курсах испанского. А в августе снова еду!'),
        L('Dan', "That's great! Will you send me a postcard?", 'Здорово! Пришлёшь мне открытку?'),
        L('Emma', 'I promise I will. But first I have to pass my exams!', 'Обещаю. Но сначала мне надо сдать экзамены!')
      ], [
        N('Have you ever been to Italy', 'present-perfect', 'Вопрос о жизненном опыте: «когда-нибудь» — ever.'),
        N('I went there two years ago', 'past-simple', 'Как только названо время (two years ago), нужен Past Simple.'),
        N("I've been to Spain three times", 'present-perfect', 'Сколько раз за жизнь — Present Perfect.'),
        N('My host family cooked it every Sunday', 'past-simple', 'Повторяющееся действие в прошлом, которое закончилось.'),
        N('I was doing a Spanish course last summer', 'past-continuous', 'Временное занятие в прошлом, растянутое во времени.'),
        N("I'm going back in August", 'present-continuous', 'Present Continuous для договорённости на будущее: всё уже решено и куплено.'),
        N('I promise I will', 'future-simple', 'will в обещаниях.')
      ], [
        ['Lucky you!', 'везёт тебе!'], ['What about you?', 'а ты?'], ['host family', 'принимающая семья'],
        ['send me a postcard', 'прислать мне открытку'], ['pass my exams', 'сдать экзамены']
      ], [
        Q('When did Dan go to Italy?', ['Last summer', 'Two years ago', 'Three times', 'He has never been there'], 1, '«I went there two years ago with my parents.»', 'Когда Дэн ездил в Италию?', ['Прошлым летом', 'Два года назад', 'Три раза', 'Никогда не был']),
        Q('What did Dan do in Rome?', ['He studied Italian', 'He saw the Colosseum and ate a lot of pizza', 'He visited his host family', 'He worked in a café'], 1, '«We saw the Colosseum and ate a lot of pizza.»', 'Что Дэн делал в Риме?', ['Учил итальянский', 'Видел Колизей и ел много пиццы', 'Гостил у принимающей семьи', 'Работал в кафе']),
        Q('How many times has Emma been to Spain?', ['Never', 'Once', 'Twice', 'Three times'], 3, '«I\'ve been to Spain three times.»', 'Сколько раз Эмма была в Испании?', ['Ни разу', 'Один', 'Два', 'Три']),
        Q('Emma has been to Italy.', TFE, 1, '«I\'ve never been to Italy».', 'Эмма бывала в Италии.'),
        Q('Why was Emma in Spain last summer?', ['On holiday with her parents', 'She was doing a Spanish course', 'She was working', 'She was visiting Dan'], 1, '«I was doing a Spanish course last summer.»', 'Зачем Эмма была в Испании прошлым летом?', ['Отдыхала с родителями', 'Была на курсах испанского', 'Работала', 'Гостила у Дэна']),
        Q('What must Emma do before August?', ['Buy a postcard', 'Pass her exams', 'Learn Italian', 'Cook paella'], 1, '«But first I have to pass my exams!»', 'Что Эмме нужно сделать до августа?', ['Купить открытку', 'Сдать экзамены', 'Выучить итальянский', 'Приготовить паэлью']),
        Q('Why does Dan say "I went there two years ago", not "I\'ve been there two years ago"?', ['Because the time is mentioned, so Past Simple is needed', 'Because it is a habit', 'Because it is happening now', 'Both are correct'], 0, 'С указанием времени (ago, yesterday, in 2020) Present Perfect не используется.', 'Почему Дэн говорит «I went there two years ago», а не «I\'ve been there two years ago»?', ['Время названо, поэтому нужен Past Simple', 'Это привычка', 'Это происходит сейчас', 'Оба варианта правильные'])
      ]),

    C('cv-a2-cake', 'A2', 'food', 'A Cooking Disaster', 'Кулинарная катастрофа',
      'Tom comes home and finds his sister in a smoky kitchen.', 'Том приходит домой и застаёт сестру на кухне, полной дыма.', [
        L('Tom', 'Something smells strange. What happened in the kitchen?', 'Чем-то странно пахнет. Что случилось на кухне?'),
        L('Anna', "Don't ask! I was making a chocolate cake for Mum's birthday, and it all went wrong.", 'Лучше не спрашивай! Я пекла шоколадный торт маме на день рождения, и всё пошло не так.'),
        L('Tom', 'What went wrong?', 'Что пошло не так?'),
        L('Anna', 'While the cake was baking, my friend called me. We talked for half an hour, and I forgot about the oven.', 'Пока торт пёкся, позвонила подруга. Мы болтали полчаса, и я забыла про духовку.'),
        L('Tom', 'Oh no. So the cake burned?', 'О нет. И торт сгорел?'),
        L('Anna', "Yes, it's completely black. And the kitchen was full of smoke when I came back.", 'Да, он совсем чёрный. А когда я вернулась, кухня была полна дыма.'),
        L('Tom', 'Did the smoke alarm go off?', 'Пожарная сигнализация сработала?'),
        L('Anna', 'Of course it did. The neighbours knocked on the door to check everything was OK.', 'Конечно. Соседи стучали в дверь — проверить, всё ли в порядке.'),
        L('Tom', "Poor you! Mum's coming at seven. What are we going to do?", 'Бедняжка! Мама придёт в семь. Что будем делать?'),
        L('Anna', "I don't know. There isn't enough time to make another one.", 'Не знаю. Испечь новый уже не успеем.'),
        L('Tom', "Don't worry, I'll go to the bakery. Their cakes are better than ours anyway!", 'Не переживай, я схожу в пекарню. Их торты всё равно лучше наших!'),
        L('Anna', "You're right. And I won't answer my phone next time I'm cooking!", 'Ты прав. И в следующий раз, когда буду готовить, не стану отвечать на звонки!')
      ], [
        N('I was making a chocolate cake', 'past-continuous', 'Процесс в прошлом, на фоне которого всё и случилось.'),
        N('While the cake was baking, my friend called me', 'past-continuous', 'Длительное действие (was baking) прервано коротким (called).'),
        N('the kitchen was full of smoke when I came back', 'past-simple', 'Состояние и событие в прошлом — Past Simple.'),
        N("Mum's coming at seven", 'present-continuous', 'Договорённость на сегодня — Present Continuous в значении будущего.'),
        N("I'll go to the bakery", 'future-simple', 'Решение, которое Том принимает прямо сейчас.'),
        N("I won't answer my phone", 'future-simple', 'won\'t = will not — обещание самой себе.')
      ], [
        ["Don't ask!", 'лучше не спрашивай!'], ['went wrong', 'пошло не так'], ['go off', 'сработать (о сигнализации, будильнике)'],
        ['Poor you!', 'бедняжка!'], ['anyway', 'всё равно, в любом случае']
      ], [
        Q('Who was the cake for?', ["Tom's friend", "Mum's birthday", 'The neighbours', 'Anna\'s party'], 1, '«a chocolate cake for Mum\'s birthday».', 'Для кого был торт?', ['Для друга Тома', 'Маме на день рождения', 'Для соседей', 'Для вечеринки Анны']),
        Q('Why did the cake burn?', ['The oven was broken', 'Anna was talking on the phone and forgot about it', 'Tom turned the oven up', 'The recipe was wrong'], 1, '«my friend called me… I forgot about the oven».', 'Почему торт сгорел?', ['Духовка сломалась', 'Анна болтала по телефону и забыла о нём', 'Том прибавил жар', 'Рецепт был неправильный']),
        Q('What did the neighbours do?', ['They called the police', 'They brought a new cake', 'They knocked on the door', 'Nothing'], 2, '«The neighbours knocked on the door».', 'Что сделали соседи?', ['Вызвали полицию', 'Принесли новый торт', 'Постучали в дверь', 'Ничего']),
        Q('Mum is coming at eight.', TFE, 1, '«Mum\'s coming at seven.»', 'Мама придёт в восемь.'),
        Q('What does Tom decide to do?', ['Make another cake', 'Buy a cake at the bakery', 'Cancel the party', 'Call Mum'], 1, '«I\'ll go to the bakery.»', 'Что решает сделать Том?', ['Испечь новый торт', 'Купить торт в пекарне', 'Отменить праздник', 'Позвонить маме']),
        Q('In "While the cake was baking, my friend called me", which action interrupted the other?', ['was baking', 'called', 'Neither', 'Both happened one after another'], 1, 'Короткое действие в Past Simple прерывает длительное в Past Continuous.', 'Во фразе «While the cake was baking, my friend called me» какое действие прервало другое?', ['was baking (пёкся)', 'called (позвонила)', 'Никакое', 'Они шли друг за другом'])
      ]),

    C('cv-a2-job', 'A2', 'work', 'The Part-Time Job', 'Работа на полставки',
      'Olivia has an interview at a bookshop.', 'У Оливии собеседование в книжном магазине.', [
        L('Manager', 'Hello, Olivia. Thanks for coming. Please sit down.', 'Здравствуйте, Оливия. Спасибо, что пришли. Присаживайтесь.'),
        L('Olivia', "Thank you. I'm a bit nervous — it's my first interview.", 'Спасибо. Я немного волнуюсь — это моё первое собеседование.'),
        L('Manager', "Don't worry, it's just a friendly chat. Have you ever worked in a shop?", 'Не переживайте, это просто дружеская беседа. Вы когда-нибудь работали в магазине?'),
        L('Olivia', 'Not in a shop, but I worked at a summer camp last year. I looked after children.', 'В магазине нет, но в прошлом году я работала в летнем лагере. Присматривала за детьми.'),
        L('Manager', "That's useful experience. Why do you want to work in a bookshop?", 'Полезный опыт. А почему вы хотите работать в книжном?'),
        L('Olivia', "I love reading. I've already read most of the books in your window!", 'Я люблю читать. Я уже прочитала почти все книги с вашей витрины!'),
        L('Manager', 'Ha! Very good. Are you studying at the moment?', 'Ха! Отлично. Вы сейчас учитесь?'),
        L('Olivia', "Yes, I'm in my second year at college, so I can only work at weekends.", 'Да, я на втором курсе колледжа, поэтому могу работать только по выходным.'),
        L('Manager', "That's fine. We need someone on Saturdays and Sundays. Have you got any questions?", 'Это подходит. Нам нужен человек по субботам и воскресеньям. У вас есть вопросы?'),
        L('Olivia', 'Yes. When will I know your decision?', 'Да. Когда я узнаю ваше решение?'),
        L('Manager', "We haven't finished the interviews yet. I'll call you on Friday.", 'Мы ещё не закончили собеседования. Я позвоню вам в пятницу.'),
        L('Olivia', 'Great. Thank you for your time!', 'Отлично. Спасибо, что уделили время!')
      ], [
        N('Have you ever worked in a shop?', 'present-perfect', 'Вопрос об опыте вообще, без времени.'),
        N('I worked at a summer camp last year', 'past-simple', 'Время названо — last year, поэтому Past Simple.'),
        N("I've already read most of the books", 'present-perfect', 'already — результат к настоящему моменту.'),
        N('Are you studying at the moment?', 'present-continuous', 'Временное положение дел сейчас (at the moment).'),
        N("We haven't finished the interviews yet", 'present-perfect', 'yet в отрицании — «ещё не».'),
        N("I'll call you on Friday", 'future-simple', 'Обещание на будущее.')
      ], [
        ['a bit nervous', 'немного волнуюсь'], ['a friendly chat', 'дружеская беседа'], ['looked after', 'присматривала за'],
        ['at weekends', 'по выходным'], ['Thank you for your time', 'спасибо, что уделили время']
      ], [
        Q('Why is Olivia nervous?', ['She is late', "It's her first interview", "She doesn't like books", 'She is ill'], 1, '«it\'s my first interview».', 'Почему Оливия волнуется?', ['Она опоздала', 'Это её первое собеседование', 'Она не любит книги', 'Она заболела']),
        Q('Where did Olivia work last year?', ['In a shop', 'In a library', 'At a summer camp', 'At a college'], 2, '«I worked at a summer camp last year.»', 'Где Оливия работала в прошлом году?', ['В магазине', 'В библиотеке', 'В летнем лагере', 'В колледже']),
        Q('Why does she want to work in a bookshop?', ['The money is good', 'She loves reading', 'It is near her home', 'Her friend works there'], 1, '«I love reading.»', 'Почему она хочет работать в книжном?', ['Хорошо платят', 'Она любит читать', 'Магазин рядом с домом', 'Там работает подруга']),
        Q('When can Olivia work?', ['Every evening', 'Only at weekends', 'Every morning', 'Only on Fridays'], 1, '«I can only work at weekends.»', 'Когда Оливия может работать?', ['Каждый вечер', 'Только по выходным', 'Каждое утро', 'Только по пятницам']),
        Q('The manager will call Olivia on Monday.', TFE, 1, '«I\'ll call you on Friday.»', 'Менеджер позвонит Оливии в понедельник.'),
        Q('"We haven\'t finished the interviews yet" means…', ['The interviews are over', 'The interviews are still going on', 'There were no interviews', 'The interviews will start on Friday'], 1, 'haven\'t … yet — ещё не закончили.', '«We haven\'t finished the interviews yet» означает…', ['Собеседования закончились', 'Собеседования ещё идут', 'Собеседований не было', 'Собеседования начнутся в пятницу'])
      ]),

    /* ================= B1 ================= */
    C('cv-b1-late', 'B1', 'people', 'Sorry I\'m Late', 'Прости, я опоздал',
      'Ryan finally arrives at the restaurant where Chloe is waiting.', 'Райан наконец приходит в ресторан, где его ждёт Хлоя.', [
        L('Chloe', "There you are! I've been waiting for forty minutes. I've called you five times!", 'Ну наконец-то! Я жду уже сорок минут. Я звонила тебе пять раз!'),
        L('Ryan', "I'm so sorry, Chloe. You won't believe what happened.", 'Прости, Хлоя. Ты не поверишь, что случилось.'),
        L('Chloe', 'Try me.', 'А ты попробуй.'),
        L('Ryan', "Well, I'd just left the house when I realised I'd forgotten my wallet. So I went back.", 'В общем, я только вышел из дома и понял, что забыл кошелёк. Пришлось вернуться.'),
        L('Chloe', "OK, that's ten minutes, not forty.", 'Ладно, это десять минут, а не сорок.'),
        L('Ryan', 'Wait, there\'s more. By the time I got to the station, the train had already gone.', 'Подожди, это не всё. Когда я добрался до станции, поезд уже ушёл.'),
        L('Chloe', "Why didn't you text me?", 'Почему ты мне не написал?'),
        L('Ryan', "My phone had died. I'd been using it all morning to work on the presentation.", 'У меня сел телефон. Я всё утро работал с него над презентацией.'),
        L('Chloe', "You really need a new battery. You've been saying that for months.", 'Тебе правда нужен новый аккумулятор. Ты твердишь это уже несколько месяцев.'),
        L('Ryan', "I know, I know. I'll buy one this weekend, I promise. Have you ordered yet?", 'Знаю, знаю. Куплю на выходных, обещаю. Ты уже заказала?'),
        L('Chloe', "No, I've been sitting here with a glass of water, feeling like an idiot.", 'Нет, я сижу тут со стаканом воды и чувствую себя дурой.'),
        L('Ryan', "Then dinner's on me. Order whatever you like.", 'Тогда ужин за мой счёт. Заказывай что хочешь.'),
        L('Chloe', "Deal. But if you're late again, I won't wait for you.", 'Договорились. Но если опоздаешь ещё раз, ждать не буду.')
      ], [
        N("I've been waiting for forty minutes", 'present-perfect-continuous', 'Действие началось в прошлом и длится до сих пор; важна длительность (for).'),
        N("I've called you five times", 'present-perfect', 'Результат к настоящему моменту — сколько раз.'),
        N("I'd just left the house", 'past-perfect', 'had + V3: одно прошлое действие раньше другого (realised).'),
        N('the train had already gone', 'past-perfect', 'Поезд ушёл ещё до того, как Райан пришёл.'),
        N("I'd been using it all morning", 'past-perfect-continuous', 'Длительный процесс до момента в прошлом — объясняет, почему телефон сел.'),
        N("You've been saying that for months", 'present-perfect-continuous', 'Повторяется уже давно и продолжается — с оттенком раздражения.'),
        N("if you're late again, I won't wait for you", 'conditional', 'First conditional: if + Present Simple, will — реальное условие в будущем.')
      ], [
        ['There you are!', 'ну наконец-то!'], ['Try me', 'а ты попробуй (расскажи)'], ['My phone had died', 'у меня сел телефон'],
        ["dinner's on me", 'ужин за мой счёт'], ['whatever you like', 'что хочешь'], ['Deal', 'договорились']
      ], [
        Q('How long has Chloe been waiting?', ['Ten minutes', 'Twenty minutes', 'Forty minutes', 'An hour'], 2, '«I\'ve been waiting for forty minutes.»', 'Сколько ждёт Хлоя?', ['Десять минут', 'Двадцать минут', 'Сорок минут', 'Час']),
        Q('Why did Ryan go back home?', ['He forgot his phone', 'He forgot his wallet', 'He forgot his keys', 'It started raining'], 1, '«I realised I\'d forgotten my wallet».', 'Почему Райан вернулся домой?', ['Забыл телефон', 'Забыл кошелёк', 'Забыл ключи', 'Пошёл дождь']),
        Q('What happened at the station?', ['He met a friend', 'The train had already left', 'The station was closed', 'He lost his ticket'], 1, '«the train had already gone».', 'Что случилось на станции?', ['Он встретил друга', 'Поезд уже ушёл', 'Станция была закрыта', 'Он потерял билет']),
        Q('Why couldn\'t Ryan text Chloe?', ['He had no money', 'His phone battery was dead', 'He forgot her number', 'He was driving'], 1, '«My phone had died.»', 'Почему Райан не смог написать Хлое?', ['Не было денег', 'Сел телефон', 'Забыл её номер', 'Был за рулём']),
        Q('Ryan has already bought a new battery.', TFE, 1, '«I\'ll buy one this weekend» — ещё только собирается.', 'Райан уже купил новый аккумулятор.'),
        Q('Who is going to pay for dinner?', ['Chloe', 'Ryan', 'They will split it', 'The restaurant'], 1, '«dinner\'s on me».', 'Кто заплатит за ужин?', ['Хлоя', 'Райан', 'Пополам', 'Ресторан']),
        Q('"By the time I got to the station, the train had already gone" means…', ['The train left before Ryan arrived', 'Ryan arrived before the train left', 'The train and Ryan arrived together', 'The train was late'], 0, 'Past Perfect показывает действие, случившееся раньше другого прошлого.', '«By the time I got to the station, the train had already gone» означает…', ['Поезд ушёл до того, как Райан пришёл', 'Райан пришёл раньше, чем ушёл поезд', 'Они прибыли одновременно', 'Поезд опаздывал'])
      ]),

    C('cv-b1-grandma', 'B1', 'people', 'When I Was Your Age', 'Когда я была в твоём возрасте',
      'Max is visiting his grandmother on a Sunday afternoon.', 'Макс в воскресенье днём в гостях у бабушки.', [
        L('Max', 'Grandma, what did you use to do for fun when you were my age? You didn\'t have phones.', 'Бабушка, а чем вы развлекались в моём возрасте? У вас же не было телефонов.'),
        L('Grandma', "No, we didn't! We used to play outside until it got dark.", 'Не было! Мы играли на улице, пока не стемнеет.'),
        L('Max', 'Every day? Even in winter?', 'Каждый день? Даже зимой?'),
        L('Grandma', 'Every single day. In winter we would build snow forts and have huge snowball fights.', 'Каждый божий день. Зимой мы строили снежные крепости и устраивали огромные снежные битвы.'),
        L('Max', 'Did you have a TV?', 'А телевизор у вас был?'),
        L('Grandma', 'We got our first TV when I was ten. The whole street used to come to our house to watch football.', 'Первый телевизор у нас появился, когда мне было десять. Вся улица приходила к нам смотреть футбол.'),
        L('Max', "That sounds fun. Things have changed a lot, haven't they?", 'Звучит весело. Многое изменилось, да?'),
        L('Grandma', "They certainly have. Now everyone is staring at a screen. Even you — you've been checking your phone the whole time we've been talking!", 'Ещё как. Сейчас все уткнулись в экраны. Даже ты — всё время, пока мы разговариваем, проверяешь телефон!'),
        L('Max', "Sorry! I was reading a message from Dad. He's going to pick me up at six.", 'Прости! Я читал сообщение от папы. Он заберёт меня в шесть.'),
        L('Grandma', "Well, we've still got an hour. Shall I teach you a game we used to play?", 'Ну, у нас ещё есть час. Научить тебя игре, в которую мы играли?'),
        L('Max', "Yes, please! As long as it doesn't involve snow.", 'Да, давай! Только чтобы без снега.'),
        L('Grandma', "Don't worry. All you need is a pencil and some paper.", 'Не волнуйся. Нужны только карандаш и бумага.')
      ], [
        N('what did you use to do for fun', 'used-to', 'Вопрос с used to: did + use to (без -d).'),
        N('We used to play outside', 'used-to', 'used to — привычка в прошлом, которой больше нет.'),
        N('we would build snow forts', 'used-to', 'would тоже описывает повторявшиеся действия в прошлом (но не состояния).'),
        N('We got our first TV when I was ten', 'past-simple', 'Однократное событие с указанием времени.'),
        N('Things have changed a lot', 'present-perfect', 'Изменение, результат которого виден сейчас.'),
        N("you've been checking your phone the whole time", 'present-perfect-continuous', 'Действие повторяется всё время до сих пор — бабушка недовольна.'),
        N('I was reading a message from Dad', 'past-continuous', 'Что происходило в тот момент, когда бабушка заметила.'),
        N("He's going to pick me up at six", 'going-to', 'План, о котором уже договорились.')
      ], [
        ['for fun', 'для развлечения'], ['until it got dark', 'пока не стемнеет'], ['Every single day', 'каждый божий день'],
        ['snowball fights', 'игра в снежки'], ['pick me up', 'забрать меня (на машине)'], ['As long as', 'при условии, что; лишь бы']
      ], [
        Q('What did Grandma use to do for fun?', ['Watch TV', 'Play outside', 'Read books at home', 'Play computer games'], 1, '«We used to play outside until it got dark.»', 'Как бабушка развлекалась в детстве?', ['Смотрела телевизор', 'Играла на улице', 'Читала дома', 'Играла в компьютерные игры']),
        Q('What did the children do in winter?', ['Stayed at home', 'Built snow forts and had snowball fights', 'Went skiing in the mountains', 'Watched football'], 1, '«we would build snow forts and have huge snowball fights».', 'Что дети делали зимой?', ['Сидели дома', 'Строили крепости и играли в снежки', 'Катались на лыжах в горах', 'Смотрели футбол']),
        Q('How old was Grandma when her family got a TV?', ['Six', 'Eight', 'Ten', 'Twelve'], 2, '«when I was ten».', 'Сколько лет было бабушке, когда в семье появился телевизор?', ['Шесть', 'Восемь', 'Десять', 'Двенадцать']),
        Q('Why did people from the street come to Grandma\'s house?', ['To play games', 'To watch football', 'To have dinner', 'To build snow forts'], 1, '«The whole street used to come to our house to watch football.»', 'Зачем соседи приходили к бабушке?', ['Поиграть', 'Посмотреть футбол', 'Поужинать', 'Строить крепости']),
        Q('Max has been looking at his phone during the conversation.', TFE, 0, '«you\'ve been checking your phone the whole time».', 'Макс во время разговора смотрел в телефон.'),
        Q('What do they need for Grandma\'s game?', ['Snow', 'A ball', 'A pencil and some paper', 'A TV'], 2, '«All you need is a pencil and some paper.»', 'Что нужно для бабушкиной игры?', ['Снег', 'Мяч', 'Карандаш и бумага', 'Телевизор']),
        Q('"We used to play outside" means that…', ['they played outside once', 'they played outside regularly, but don\'t any more', 'they are playing outside now', 'they will play outside'], 1, 'used to — повторявшееся в прошлом, чего сейчас уже нет.', '«We used to play outside» значит, что…', ['они один раз играли на улице', 'они регулярно играли на улице, но больше нет', 'они сейчас играют на улице', 'они будут играть на улице'])
      ]),

    C('cv-b1-roadtrip', 'B1', 'travel', 'Planning a Road Trip', 'Планируем поездку на машине',
      'Sophie and Mark are planning a trip to Scotland.', 'Софи и Марк планируют поездку в Шотландию.', [
        L('Sophie', 'So, are we still going to Scotland next week?', 'Ну что, мы всё ещё едем в Шотландию на следующей неделе?'),
        L('Mark', "Definitely. I've booked the car. We're picking it up on Saturday at nine.", 'Конечно. Я забронировал машину. Забираем её в субботу в девять.'),
        L('Sophie', "Great. What's the plan for the first day?", 'Отлично. Какой план на первый день?'),
        L('Mark', "We're going to drive to the Lake District and spend the night there. It'll take about five hours.", 'Доедем до Озёрного края и переночуем там. Дорога займёт около пяти часов.'),
        L('Sophie', "Five hours? Then I'll bring snacks and make a playlist.", 'Пять часов? Тогда я возьму перекус и сделаю плейлист.'),
        L('Mark', "Good idea. This time tomorrow I'll be packing, so let's decide on the route tonight.", 'Хорошая мысль. Завтра в это время я буду собирать вещи, так что давай определимся с маршрутом сегодня.'),
        L('Sophie', "What if it rains the whole time? It's Scotland, after all.", 'А если всё время будет дождь? Это же Шотландия.'),
        L('Mark', "If it rains, we'll visit museums and castles. There are hundreds of them.", 'Если пойдёт дождь, будем ходить по музеям и замкам. Их там сотни.'),
        L('Sophie', 'And if the weather is good?', 'А если погода будет хорошая?'),
        L('Mark', "Then we'll climb Ben Nevis. It's the highest mountain in Britain.", 'Тогда поднимемся на Бен-Невис. Это самая высокая гора Британии.'),
        L('Sophie', 'Have you ever climbed a real mountain?', 'Ты когда-нибудь поднимался на настоящую гору?'),
        L('Mark', "Not yet. But I've been going to the gym three times a week, so I'm ready!", 'Пока нет. Но я хожу в спортзал три раза в неделю, так что готов!'),
        L('Sophie', "We'll see about that. I bet you'll be complaining after the first hour.", 'Посмотрим. Спорим, через час ты уже будешь ныть.')
      ], [
        N("We're picking it up on Saturday at nine", 'present-continuous', 'Договорённость с точным временем — Present Continuous о будущем.'),
        N("We're going to drive to the Lake District", 'going-to', 'Заранее продуманный план.'),
        N("It'll take about five hours", 'future-simple', 'will для прогноза.'),
        N("Then I'll bring snacks", 'future-simple', 'Решение в момент речи.'),
        N("This time tomorrow I'll be packing", 'future-continuous', 'Процесс, который будет идти в конкретный момент в будущем.'),
        N("If it rains, we'll visit museums and castles", 'conditional', 'First conditional: после if — настоящее время, хотя речь о будущем.'),
        N("I've been going to the gym three times a week", 'present-perfect-continuous', 'Регулярная активность последнего времени, которая продолжается.')
      ], [
        ['spend the night', 'переночевать'], ['decide on the route', 'определиться с маршрутом'], ['What if', 'а что, если'],
        ['after all', 'всё-таки, как-никак'], ["We'll see about that", 'ну это мы ещё посмотрим'], ['I bet', 'спорим, держу пари']
      ], [
        Q('When are they picking up the car?', ['Tonight', 'On Saturday at nine', 'Next Friday', 'Tomorrow morning'], 1, '«We\'re picking it up on Saturday at nine.»', 'Когда они забирают машину?', ['Сегодня вечером', 'В субботу в девять', 'В следующую пятницу', 'Завтра утром']),
        Q('How long will the drive to the Lake District take?', ['Two hours', 'About five hours', 'A whole day', 'Nine hours'], 1, '«It\'ll take about five hours.»', 'Сколько займёт дорога до Озёрного края?', ['Два часа', 'Около пяти часов', 'Целый день', 'Девять часов']),
        Q('What will Sophie bring?', ['Maps', 'Snacks and a playlist', 'A tent', 'Umbrellas'], 1, '«I\'ll bring snacks and make a playlist.»', 'Что возьмёт Софи?', ['Карты', 'Перекус и плейлист', 'Палатку', 'Зонтики']),
        Q('What will they do if it rains?', ['Stay in the hotel', 'Go home', 'Visit museums and castles', 'Climb Ben Nevis anyway'], 2, '«If it rains, we\'ll visit museums and castles.»', 'Что они будут делать, если пойдёт дождь?', ['Сидеть в отеле', 'Поедут домой', 'Ходить по музеям и замкам', 'Всё равно полезут на Бен-Невис']),
        Q('Mark has climbed a mountain before.', TFE, 1, '«Have you ever climbed a real mountain?» — «Not yet.»', 'Марк уже поднимался на гору.'),
        Q('Why does Mark think he is ready?', ['He has climbed many mountains', 'He has been going to the gym', 'He has bought good boots', 'He lives in the mountains'], 1, '«I\'ve been going to the gym three times a week».', 'Почему Марк считает, что готов?', ['Он покорил много гор', 'Он ходит в спортзал', 'Он купил хорошие ботинки', 'Он живёт в горах']),
        Q('"This time tomorrow I\'ll be packing" describes…', ['a finished action', 'an action in progress at a moment in the future', 'a habit', 'a past event'], 1, 'Future Continuous — процесс в конкретный момент будущего.', '«This time tomorrow I\'ll be packing» описывает…', ['законченное действие', 'процесс в определённый момент будущего', 'привычку', 'событие в прошлом'])
      ]),

    C('cv-b1-flatmate', 'B1', 'daily', 'The Flatmate Problem', 'Проблема с соседом',
      'Jess wants to talk to her flatmate Olly about the fridge.', 'Джесс хочет поговорить с соседом по квартире Олли о холодильнике.', [
        L('Jess', "Have you got a minute, Olly? I'd like to talk about something.", 'Олли, есть минутка? Хочу кое о чём поговорить.'),
        L('Olly', 'Sure. Is everything OK?', 'Конечно. Что-то случилось?'),
        L('Jess', 'Not really. Someone has been eating my food from the fridge. Yesterday I bought a big piece of cheese, and this morning half of it had disappeared.', 'Не совсем. Кто-то ест мою еду из холодильника. Вчера я купила большой кусок сыра, а утром половины уже не было.'),
        L('Olly', "Oh. Well… I was really hungry last night. I didn't think you'd mind.", 'А. Ну… вчера вечером я был очень голодный. Думал, ты не будешь против.'),
        L('Jess', "It's not just the cheese. You're always borrowing my things without asking.", 'Дело не только в сыре. Ты постоянно берёшь мои вещи без спроса.'),
        L('Olly', "That's fair. I didn't realise it bothered you so much.", 'Справедливо. Я не понимал, что тебя это так задевает.'),
        L('Jess', 'And the dishes have been sitting in the sink since Monday.', 'И посуда стоит в раковине с понедельника.'),
        L('Olly', "I know. I've been working late every day this week. But you're right, I should have washed them.", 'Знаю. Всю неделю работаю допоздна. Но ты права, надо было помыть.'),
        L('Jess', "Look, I don't want to argue. Shall we make a cleaning schedule?", 'Слушай, я не хочу ругаться. Может, составим график уборки?'),
        L('Olly', "Good idea. And I'll replace the cheese today, I promise.", 'Хорошая идея. А сыр я сегодня куплю новый, обещаю.'),
        L('Jess', 'Thanks. If we both stick to the schedule, things will be much easier.', 'Спасибо. Если мы оба будем придерживаться графика, будет намного проще.'),
        L('Olly', "Deal. And next time I'm hungry, I'll ask first.", 'Договорились. А в следующий раз, когда проголодаюсь, сначала спрошу.')
      ], [
        N('Someone has been eating my food', 'present-perfect-continuous', 'Это происходит уже какое-то время, и видны следы.'),
        N('half of it had disappeared', 'past-perfect', 'Исчезло ещё до того момента утром, когда Джесс открыла холодильник.'),
        N('I was really hungry last night', 'past-simple', 'Состояние в прошлом с указанием времени.'),
        N("You're always borrowing my things", 'present-continuous', 'always + Present Continuous — раздражающая привычка.'),
        N('the dishes have been sitting in the sink since Monday', 'present-perfect-continuous', 'С понедельника и до сих пор — since.'),
        N('I should have washed them', 'modal-perfect', 'should have + V3 — «надо было», сожаление о прошлом.'),
        N('If we both stick to the schedule, things will be much easier', 'conditional', 'First conditional — реальное условие.')
      ], [
        ['Have you got a minute', 'есть минутка?'], ['without asking', 'без спроса'], ["That's fair", 'справедливо'],
        ['bothered you', 'беспокоило, задевало тебя'], ['cleaning schedule', 'график уборки'], ['stick to', 'придерживаться']
      ], [
        Q('What is Jess\'s main complaint?', ['Olly is too noisy', 'Olly eats her food and borrows her things', 'Olly never pays the rent', 'Olly invites too many guests'], 1, 'Еда из холодильника и вещи без спроса.', 'На что в основном жалуется Джесс?', ['Олли шумит', 'Олли ест её еду и берёт её вещи', 'Олли не платит за квартиру', 'Олли зовёт слишком много гостей']),
        Q('What happened to the cheese?', ['It went bad', 'Half of it disappeared', 'Jess ate it', 'Olly threw it away'], 1, '«this morning half of it had disappeared».', 'Что случилось с сыром?', ['Он испортился', 'Половина исчезла', 'Джесс его съела', 'Олли его выбросил']),
        Q('Since when have the dishes been in the sink?', ['Since yesterday', 'Since Monday', 'Since last week', 'Since this morning'], 1, '«since Monday».', 'С какого времени посуда в раковине?', ['Со вчера', 'С понедельника', 'С прошлой недели', 'С утра']),
        Q('Why hasn\'t Olly washed the dishes?', ['He forgot', 'He has been working late', 'He doesn\'t like washing up', 'There is no water'], 1, '«I\'ve been working late every day this week.»', 'Почему Олли не помыл посуду?', ['Забыл', 'Работал допоздна', 'Не любит мыть посуду', 'Нет воды']),
        Q('Jess wants to move out.', TFE, 1, 'Она предлагает график уборки: «I don\'t want to argue».', 'Джесс хочет съехать.'),
        Q('What do they agree to do?', ['Buy a second fridge', 'Make a cleaning schedule', 'Eat together every day', 'Find a new flatmate'], 1, '«Shall we make a cleaning schedule?» — «Good idea.»', 'О чём они договариваются?', ['Купить второй холодильник', 'Составить график уборки', 'Каждый день есть вместе', 'Найти нового соседа']),
        Q('In "You\'re always borrowing my things", Jess sounds…', ['happy', 'annoyed', 'surprised', 'sleepy'], 1, 'always + Present Continuous передаёт раздражение.', 'Во фразе «You\'re always borrowing my things» Джесс звучит…', ['радостно', 'раздражённо', 'удивлённо', 'сонно'])
      ]),

    /* ================= B2 ================= */
    C('cv-b2-breakin', 'B2', 'society', 'The Break-In', 'Взлом',
      'A detective interviews Mrs Collins after her house was burgled.', 'Детектив беседует с миссис Коллинз после того, как её дом ограбили.', [
        L('Detective', 'Mrs Collins, can you tell me exactly what happened when you got home?', 'Миссис Коллинз, расскажите, пожалуйста, точно, что произошло, когда вы вернулись домой.'),
        L('Mrs Collins', "Well, I'd been visiting my sister for the weekend. When I opened the front door, I noticed that the kitchen window had been broken.", 'Я провела выходные у сестры. Открыв входную дверь, я заметила, что окно на кухне разбито.'),
        L('Detective', 'Was anything taken?', 'Что-нибудь пропало?'),
        L('Mrs Collins', "My laptop has been stolen, and some jewellery. Oddly enough, the TV wasn't touched.", 'Украли ноутбук и кое-какие украшения. Как ни странно, телевизор не тронули.'),
        L('Detective', "That's typical. Burglars usually go for things they can carry easily. Had you told anyone you'd be away?", 'Это типично. Воры обычно берут то, что легко унести. Вы кому-нибудь говорили, что уезжаете?'),
        L('Mrs Collins', 'Only my neighbour, Mr Hall. He said he would water the plants.', 'Только соседу, мистеру Холлу. Он обещал полить цветы.'),
        L('Detective', 'Did he notice anything unusual?', 'Он заметил что-нибудь необычное?'),
        L('Mrs Collins', "He told me he'd heard a noise on Saturday night, but he thought it was a cat.", 'Он сказал, что в субботу ночью слышал шум, но подумал, что это кошка.'),
        L('Detective', "I see. Houses on this street have been targeted three times this month. We're checking the security cameras.", 'Понятно. На этой улице в этом месяце грабят уже третий дом. Мы проверяем камеры наблюдения.'),
        L('Mrs Collins', 'Will I ever get my things back?', 'Я когда-нибудь получу свои вещи обратно?'),
        L('Detective', "I can't promise anything. But if the laptop is switched on, it might be traced.", 'Обещать ничего не могу. Но если ноутбук включат, его можно будет отследить.'),
        L('Mrs Collins', "If I'd known this would happen, I would have installed an alarm years ago.", 'Знай я, что так случится, давно бы поставила сигнализацию.'),
        L('Detective', "Don't blame yourself. By the end of the week we'll have spoken to all your neighbours, and I'll let you know what we find out.", 'Не вините себя. К концу недели мы поговорим со всеми вашими соседями, и я сообщу, что удастся выяснить.')
      ], [
        N("I'd been visiting my sister for the weekend", 'past-perfect-continuous', 'Длительное действие, которое шло до момента в прошлом (возвращения домой).'),
        N('the kitchen window had been broken', 'passive', 'Past Perfect в пассиве: окно разбили (кто — неизвестно) ещё до её прихода.'),
        N('My laptop has been stolen', 'passive', 'Пассив в Present Perfect: важен результат, а не вор.'),
        N("He told me he'd heard a noise", 'past-perfect', 'Косвенная речь: «I heard» сдвигается в «he\'d heard».'),
        N('Houses on this street have been targeted three times this month', 'present-perfect', 'Период (this month) ещё не закончился — Present Perfect, к тому же пассив.'),
        N("If I'd known this would happen, I would have installed an alarm", 'conditional', 'Third conditional — нереальное условие в прошлом, сожаление.'),
        N("we'll have spoken to all your neighbours", 'future-perfect', 'Действие будет завершено к моменту в будущем (by the end of the week).')
      ], [
        ['Oddly enough', 'как ни странно'], ['go for', 'нацеливаться на, выбирать'], ['water the plants', 'поливать цветы'],
        ['security cameras', 'камеры наблюдения'], ['get my things back', 'вернуть свои вещи'], ["Don't blame yourself", 'не вините себя'], ['find out', 'выяснить']
      ], [
        Q('Where had Mrs Collins been?', ['At work', 'Visiting her sister', 'On a business trip', 'At the neighbour\'s house'], 1, '«I\'d been visiting my sister for the weekend.»', 'Где была миссис Коллинз?', ['На работе', 'В гостях у сестры', 'В командировке', 'У соседа']),
        Q('How did the burglars probably get in?', ['Through the front door', 'Through the kitchen window', 'Through the garage', 'With a key'], 1, '«the kitchen window had been broken».', 'Как, вероятно, проникли воры?', ['Через входную дверь', 'Через окно на кухне', 'Через гараж', 'Ключом']),
        Q('What was stolen?', ['The TV', 'A laptop and some jewellery', 'Money and a phone', 'Nothing'], 1, '«My laptop has been stolen, and some jewellery.»', 'Что украли?', ['Телевизор', 'Ноутбук и украшения', 'Деньги и телефон', 'Ничего']),
        Q('The burglars took the TV as well.', TFE, 1, '«Oddly enough, the TV wasn\'t touched.»', 'Воры унесли и телевизор.'),
        Q('Why didn\'t Mr Hall react to the noise?', ['He was asleep', 'He thought it was a cat', 'He was away', 'He called the police'], 1, '«he thought it was a cat».', 'Почему мистер Холл не отреагировал на шум?', ['Спал', 'Подумал, что это кошка', 'Был в отъезде', 'Вызвал полицию']),
        Q('What does Mrs Collins regret?', ['Visiting her sister', 'Not installing an alarm', 'Telling Mr Hall', 'Buying a laptop'], 1, '«I would have installed an alarm years ago».', 'О чём жалеет миссис Коллинз?', ['Что поехала к сестре', 'Что не поставила сигнализацию', 'Что сказала мистеру Холлу', 'Что купила ноутбук']),
        Q('"By the end of the week we\'ll have spoken to all your neighbours" means the police…', ['spoke to them last week', 'will finish speaking to them before the week ends', 'are speaking to them now', 'won\'t speak to them'], 1, 'Future Perfect — действие завершится к сроку.', '«By the end of the week we\'ll have spoken to all your neighbours» значит, что полиция…', ['говорила с ними на прошлой неделе', 'закончит опрос до конца недели', 'опрашивает их прямо сейчас', 'не будет с ними говорить']),
        Q('In "the kitchen window had been broken", we don\'t know…', ['when she noticed it', 'who broke it', 'which window it was', 'where she had been'], 1, 'Пассив используют, когда исполнитель неизвестен или неважен.', 'Из фразы «the kitchen window had been broken» мы не знаем…', ['когда она это заметила', 'кто его разбил', 'какое это было окно', 'где она была'])
      ]),

    C('cv-b2-career', 'B2', 'work', 'Changing Careers', 'Смена профессии',
      'Paul hears some surprising news from his friend Nadia.', 'Пол узнаёт неожиданную новость от подруги Нади.', [
        L('Paul', "So I hear you've handed in your notice. Is it true?", 'Говорят, ты подала заявление об уходе. Это правда?'),
        L('Nadia', "It is. After eight years in banking, I'm going to retrain as a teacher.", 'Правда. После восьми лет в банке я собираюсь переучиться на учителя.'),
        L('Paul', "Wow. That's a big step. What made you decide?", 'Ого. Серьёзный шаг. Что тебя подтолкнуло?'),
        L('Nadia', "I'd been feeling unhappy for a long time. I was earning good money, but I wasn't enjoying anything.", 'Я давно чувствовала себя несчастной. Зарабатывала хорошо, но ничего не радовало.'),
        L('Paul', "I know the feeling. If I had the courage, I'd quit my job tomorrow.", 'Знакомо. Будь у меня смелость, я бы завтра же уволился.'),
        L('Nadia', "Why don't you, then?", 'Так почему не увольняешься?'),
        L('Paul', "If I didn't have a mortgage, I would. But I can't afford to start again from scratch.", 'Не будь у меня ипотеки, уволился бы. Но я не могу позволить себе начать всё с нуля.'),
        L('Nadia', "That's fair. I've been saving for two years, so I can manage for a while.", 'Понимаю. Я два года копила, так что какое-то время продержусь.'),
        L('Paul', 'How long is the course?', 'Сколько длится обучение?'),
        L('Nadia', "One year. By next September I'll have finished my training, and hopefully I'll be teaching maths at a secondary school.", 'Год. К следующему сентябрю я закончу обучение и, надеюсь, буду преподавать математику в средней школе.'),
        L('Paul', 'Maths? You were always good with numbers. Your students will be lucky.', 'Математику? Ты всегда дружила с цифрами. Твоим ученикам повезёт.'),
        L('Nadia', "Let's hope so. Ask me again in a year — I'll either be very happy or completely exhausted.", 'Будем надеяться. Спроси меня через год — я буду либо очень счастлива, либо совершенно вымотана.')
      ], [
        N("you've handed in your notice", 'present-perfect', 'Свежая новость, результат важен сейчас.'),
        N("I'm going to retrain as a teacher", 'going-to', 'Твёрдое намерение.'),
        N("I'd been feeling unhappy for a long time", 'past-perfect-continuous', 'Состояние длилось долго до момента решения в прошлом.'),
        N('I was earning good money', 'past-continuous', 'Фон, обстоятельства того времени.'),
        N("If I had the courage, I'd quit my job tomorrow", 'conditional', 'Second conditional — нереальная ситуация в настоящем: смелости у Пола нет.'),
        N("If I didn't have a mortgage, I would", 'conditional', 'Second conditional: ипотека есть, поэтому он не уходит.'),
        N("I've been saving for two years", 'present-perfect-continuous', 'Длительный процесс до сих пор — for two years.'),
        N("I'll have finished my training", 'future-perfect', 'Будет завершено к сроку (by next September).'),
        N("I'll be teaching maths", 'future-continuous', 'Процесс, который будет идти в будущем.')
      ], [
        ['handed in your notice', 'подала заявление об уходе'], ["That's a big step", 'это серьёзный шаг'], ['What made you decide?', 'что тебя подтолкнуло к решению?'],
        ['I know the feeling', 'мне знакомо это чувство'], ['from scratch', 'с нуля'], ['manage for a while', 'продержаться какое-то время'], ['good with numbers', 'хорошо обращается с цифрами']
      ], [
        Q('How long has Nadia worked in banking?', ['Two years', 'Five years', 'Eight years', 'One year'], 2, '«After eight years in banking».', 'Сколько лет Надя проработала в банке?', ['Два года', 'Пять лет', 'Восемь лет', 'Год']),
        Q('Why did Nadia decide to leave?', ['She was fired', 'She had been unhappy for a long time', 'The salary was too low', 'She moved to another city'], 1, '«I\'d been feeling unhappy for a long time.»', 'Почему Надя решила уйти?', ['Её уволили', 'Она давно была несчастна', 'Зарплата была низкой', 'Она переехала']),
        Q('What stops Paul from quitting his job?', ['His boss', 'His mortgage', 'His family', 'His health'], 1, '«If I didn\'t have a mortgage, I would.»', 'Что мешает Полу уволиться?', ['Начальник', 'Ипотека', 'Семья', 'Здоровье']),
        Q('How has Nadia prepared for the change?', ['She has borrowed money', 'She has been saving for two years', 'She has found a part-time job', 'She has sold her flat'], 1, '«I\'ve been saving for two years».', 'Как Надя подготовилась к переменам?', ['Взяла в долг', 'Копила два года', 'Нашла подработку', 'Продала квартиру']),
        Q('Nadia\'s training course lasts two years.', TFE, 1, '«One year.»', 'Обучение Нади длится два года.'),
        Q('What does Nadia hope to teach?', ['English', 'Economics', 'Maths', 'History'], 2, '«I\'ll be teaching maths at a secondary school».', 'Что Надя надеется преподавать?', ['Английский', 'Экономику', 'Математику', 'Историю']),
        Q('"If I had the courage, I\'d quit my job tomorrow" means that Paul…', ['is going to quit tomorrow', 'doesn\'t have the courage, so he won\'t quit', 'quit his job yesterday', 'has already found a new job'], 1, 'Second conditional — воображаемая ситуация, противоположная реальности.', '«If I had the courage, I\'d quit my job tomorrow» значит, что Пол…', ['завтра уволится', 'не решается, поэтому не уволится', 'уволился вчера', 'уже нашёл новую работу'])
      ]),

    C('cv-b2-speech', 'B2', 'people', 'The Best Man\'s Speech', 'Речь шафера',
      'Harry is worried about the speech he has to give at his best friend\'s wedding.', 'Гарри переживает из-за речи, которую он должен произнести на свадьбе лучшего друга.', [
        L('Zoe', "How's the speech coming along? The wedding's on Saturday.", 'Как продвигается речь? Свадьба в субботу.'),
        L('Harry', "Badly. I've written three versions and I've thrown them all away.", 'Плохо. Я написал три варианта и все выбросил.'),
        L('Zoe', 'Read me the beginning of the last one.', 'Прочитай мне начало последнего.'),
        L('Harry', "OK. 'I've known Tom for twenty years. We met at school, when he was hiding from a teacher behind the bins…'", 'Ладно. «Я знаю Тома двадцать лет. Мы познакомились в школе, когда он прятался от учителя за мусорными баками…»'),
        L('Zoe', "That's a great start! Why did you throw it away?", 'Отличное начало! Зачем ты его выбросил?'),
        L('Harry', "I wasn't sure if his new in-laws would find it funny. They seem quite serious.", 'Я не был уверен, что его новой родне это покажется смешным. Они выглядят довольно серьёзными.'),
        L('Zoe', 'Trust me, people love a good story. How did Tom and Emily meet, anyway?', 'Поверь, люди любят хорошие истории. Кстати, а как Том и Эмили познакомились?'),
        L('Harry', "That's the best part. If Tom hadn't missed his flight to Berlin, he would never have met her. She was sitting next to him at the airport café.", 'Это самое интересное. Если бы Том не опоздал на рейс в Берлин, он бы никогда её не встретил. Она сидела рядом с ним в кафе аэропорта.'),
        L('Zoe', "You have to include that! It's so romantic.", 'Это обязательно надо включить! Это так романтично.'),
        L('Harry', "You're right. But I'm terrified I'll forget everything when I'm standing in front of two hundred people.", 'Ты права. Но я в ужасе, что забуду всё, когда буду стоять перед двумя сотнями людей.'),
        L('Zoe', "Then practise. By Saturday you'll have read it out loud so many times that you'll know it by heart.", 'Тогда тренируйся. К субботе ты прочитаешь её вслух столько раз, что будешь знать наизусть.'),
        L('Harry', 'Will you listen to me practise tonight?', 'Послушаешь, как я репетирую, сегодня вечером?'),
        L('Zoe', 'Only if you order the pizza.', 'Только если ты закажешь пиццу.')
      ], [
        N("How's the speech coming along?", 'present-continuous', 'Процесс, который идёт в этот период.'),
        N("I've written three versions", 'present-perfect', 'Результат на сейчас, время не важно.'),
        N("I've known Tom for twenty years", 'present-perfect', 'С глаголами-состояниями (know) вместо Perfect Continuous используют Present Perfect.'),
        N('when he was hiding from a teacher', 'past-continuous', 'Что происходило в момент знакомства.'),
        N("If Tom hadn't missed his flight to Berlin, he would never have met her", 'conditional', 'Third conditional: воображаем другое прошлое — на деле он опоздал и встретил её.'),
        N('She was sitting next to him', 'past-continuous', 'Фон истории.'),
        N("when I'm standing in front of two hundred people", 'present-continuous', 'После when о будущем ставят настоящее время, а не will.'),
        N("you'll have read it out loud so many times", 'future-perfect', 'Результат, который будет к субботе.')
      ], [
        ['coming along', 'продвигается'], ['in-laws', 'родственники мужа или жены'], ['Trust me', 'поверь мне'],
        ['missed his flight', 'опоздал на рейс'], ['out loud', 'вслух'], ['by heart', 'наизусть']
      ], [
        Q('When is the wedding?', ['Tonight', 'On Saturday', 'Next month', 'It was last week'], 1, '«The wedding\'s on Saturday.»', 'Когда свадьба?', ['Сегодня вечером', 'В субботу', 'В следующем месяце', 'Была на прошлой неделе']),
        Q('What has Harry done with his speeches so far?', ['He has learned them by heart', 'He has thrown them all away', 'He has sent them to Tom', 'He has read them to the in-laws'], 1, '«I\'ve thrown them all away.»', 'Что Гарри сделал со своими речами?', ['Выучил наизусть', 'Все выбросил', 'Отправил Тому', 'Прочитал родственникам']),
        Q('How long has Harry known Tom?', ['Two years', 'Ten years', 'Twenty years', 'Since the airport'], 2, '«I\'ve known Tom for twenty years.»', 'Сколько лет Гарри знает Тома?', ['Два года', 'Десять лет', 'Двадцать лет', 'С того случая в аэропорту']),
        Q('Why did Harry throw away the last version?', ['It was too short', 'He was afraid the in-laws wouldn\'t find it funny', 'Zoe didn\'t like it', 'Tom asked him to'], 1, '«I wasn\'t sure if his new in-laws would find it funny.»', 'Почему Гарри выбросил последний вариант?', ['Он был слишком коротким', 'Боялся, что родне это не покажется смешным', 'Он не понравился Зои', 'Том попросил']),
        Q('How did Tom meet Emily?', ['At school', 'At a wedding', 'At an airport café after missing a flight', 'In Berlin'], 2, '«If Tom hadn\'t missed his flight… She was sitting next to him at the airport café.»', 'Как Том познакомился с Эмили?', ['В школе', 'На свадьбе', 'В кафе аэропорта, опоздав на рейс', 'В Берлине']),
        Q('Harry isn\'t nervous about the speech.', TFE, 1, '«I\'m terrified I\'ll forget everything».', 'Гарри не волнуется из-за речи.'),
        Q('"If Tom hadn\'t missed his flight, he would never have met her" — what really happened?', ['Tom caught the flight and didn\'t meet Emily', 'Tom missed the flight and met Emily', 'Tom met Emily in Berlin', 'Emily missed the flight'], 1, 'Third conditional описывает противоположное реальному прошлому.', '«If Tom hadn\'t missed his flight, he would never have met her» — что было на самом деле?', ['Том успел на рейс и не встретил Эмили', 'Том опоздал на рейс и встретил Эмили', 'Том встретил Эмили в Берлине', 'На рейс опоздала Эмили'])
      ]),

    C('cv-b2-flying', 'B2', 'nature', 'Should We Stop Flying?', 'Отказаться от самолётов?',
      'Amira and Jon discuss an article about air travel.', 'Амира и Джон обсуждают статью об авиаперелётах.', [
        L('Jon', 'Did you see that article? Apparently flights are responsible for a growing share of emissions.', 'Видела ту статью? Оказывается, на перелёты приходится всё большая доля выбросов.'),
        L('Amira', "I did. That's why I've decided not to fly this year. I'm taking the train to Vienna in June.", 'Видела. Поэтому я решила в этом году не летать. В июне еду в Вену на поезде.'),
        L('Jon', "Seriously? That'll take ages.", 'Серьёзно? Это же целая вечность.'),
        L('Amira', "About a day and a half. But I'll be working on my laptop most of the way, so it's not wasted time.", 'Около полутора суток. Но почти всю дорогу я буду работать за ноутбуком, так что время не потеряно.'),
        L('Jon', "I respect that, but most people can't afford that much time — or the price. Trains are often more expensive than flights.", 'Уважаю, но большинство не может позволить себе столько времени — и такую цену. Поезда часто дороже самолётов.'),
        L('Amira', "True. The system has been designed around cheap flights for decades. It won't be fixed overnight.", 'Верно. Десятилетиями вся система строилась вокруг дешёвых перелётов. Это не исправить за один день.'),
        L('Jon', "So what's the answer? If everyone stopped flying tomorrow, the tourism industry would collapse.", 'И какой выход? Если завтра все перестанут летать, туризм рухнет.'),
        L('Amira', "Nobody's saying everyone should stop completely. But if we flew a bit less, it would make a difference.", 'Никто не говорит, что все должны отказаться полностью. Но если бы мы летали чуть меньше, это имело бы значение.'),
        L('Jon', "Maybe. I have to admit I've taken six flights this year already, mostly for work.", 'Может быть. Признаюсь, я в этом году уже шесть раз летал, в основном по работе.'),
        L('Amira', "Couldn't some of those meetings have been done online?", 'А нельзя было провести часть этих встреч онлайн?'),
        L('Jon', "Probably half of them, to be honest. I hadn't really thought about it until now.", 'Честно говоря, наверное, половину. Я как-то не задумывался об этом до сих пор.'),
        L('Amira', 'See? Small changes add up. By the time our kids grow up, a lot of things will have changed — hopefully for the better.', 'Видишь? Маленькие перемены складываются. Когда наши дети вырастут, многое изменится — надеюсь, к лучшему.')
      ], [
        N("I've decided not to fly this year", 'present-perfect', 'Решение принято, результат действует сейчас.'),
        N("I'm taking the train to Vienna in June", 'present-continuous', 'Запланированная поездка, билеты уже есть.'),
        N("I'll be working on my laptop most of the way", 'future-continuous', 'Процесс, который будет идти в будущем.'),
        N('The system has been designed around cheap flights for decades', 'passive', 'Пассив в Present Perfect: важна система, а не кто её создал.'),
        N("If everyone stopped flying tomorrow, the tourism industry would collapse", 'conditional', 'Second conditional — гипотетическая ситуация в будущем.'),
        N("I've taken six flights this year already", 'present-perfect', 'Год ещё не закончился — Present Perfect.'),
        N("Couldn't some of those meetings have been done online?", 'modal-perfect', 'could have + V3 — упущенная возможность в прошлом (здесь ещё и пассив).'),
        N("I hadn't really thought about it until now", 'past-perfect', 'До этого момента — Past Perfect с until now.'),
        N('a lot of things will have changed', 'future-perfect', 'Изменения произойдут к моменту в будущем.')
      ], [
        ['Apparently', 'оказывается, судя по всему'], ['a growing share of emissions', 'растущая доля выбросов'], ['take ages', 'занимать целую вечность'],
        ['fixed overnight', 'исправлен в одночасье'], ['make a difference', 'иметь значение, менять ситуацию'], ['add up', 'складываться, накапливаться'], ['for the better', 'к лучшему']
      ], [
        Q('How is Amira travelling to Vienna?', ['By plane', 'By car', 'By train', 'By bus'], 2, '«I\'m taking the train to Vienna in June.»', 'Как Амира едет в Вену?', ['На самолёте', 'На машине', 'На поезде', 'На автобусе']),
        Q('Why doesn\'t Amira think the journey is wasted time?', ['She will sleep', 'She will be working on her laptop', 'She will read books', 'She likes trains'], 1, '«I\'ll be working on my laptop most of the way».', 'Почему Амира считает, что время в пути не потеряно?', ['Она будет спать', 'Она будет работать за ноутбуком', 'Она будет читать', 'Она любит поезда']),
        Q('What is Jon\'s main objection?', ['Trains are dangerous', 'Trains take too much time and are often more expensive', 'Vienna is boring', 'Planes are greener'], 1, '«most people can\'t afford that much time — or the price».', 'Каково главное возражение Джона?', ['Поезда опасны', 'Поезда долгие и часто дороже', 'В Вене скучно', 'Самолёты экологичнее']),
        Q('Amira thinks everyone should stop flying completely.', TFE, 1, '«Nobody\'s saying everyone should stop completely.»', 'Амира считает, что все должны полностью отказаться от перелётов.'),
        Q('How many flights has Jon taken this year?', ['None', 'Two', 'Six', 'Twelve'], 2, '«I\'ve taken six flights this year already».', 'Сколько раз Джон летал в этом году?', ['Ни разу', 'Два', 'Шесть', 'Двенадцать']),
        Q('How does Jon\'s attitude change at the end?', ['He gets angry', 'He starts to reconsider his flights', 'He decides to stop flying forever', 'It doesn\'t change'], 1, '«I hadn\'t really thought about it until now.»', 'Как меняется позиция Джона к концу?', ['Он злится', 'Начинает пересматривать свои перелёты', 'Решает больше никогда не летать', 'Не меняется']),
        Q('"If everyone stopped flying tomorrow" describes a situation that is…', ['real and likely', 'imaginary and unlikely', 'in the past', 'already happening'], 1, 'Second conditional: прошедшая форма после if — нереальное или маловероятное.', '«If everyone stopped flying tomorrow» описывает ситуацию…', ['реальную и вероятную', 'воображаемую и маловероятную', 'в прошлом', 'которая уже происходит'])
      ]),

    /* ================= C1 ================= */
    C('cv-c1-investor', 'C1', 'money', 'The Investor Meeting', 'Встреча с инвестором',
      'Leo, the founder of a start-up, pitches to an investor.', 'Лео, основатель стартапа, презентует проект инвестору.', [
        L('Ms Grant', "Thanks for coming in, Leo. I've read your pitch deck. Walk me through the numbers.", 'Спасибо, что пришли, Лео. Я прочитала вашу презентацию. Пройдитесь со мной по цифрам.'),
        L('Leo', "Of course. We launched eighteen months ago, and by the end of this quarter we'll have been operating at a profit for six consecutive months.", 'Конечно. Мы запустились полтора года назад, и к концу квартала будем работать в плюс уже шесть месяцев подряд.'),
        L('Ms Grant', "Impressive, given the market. What's driving the growth?", 'Впечатляет, учитывая рынок. За счёт чего рост?'),
        L('Leo', "Mostly word of mouth. We've barely spent anything on advertising. Users have been recommending us to friends, which keeps acquisition costs low.", 'В основном сарафанное радио. На рекламу мы почти ничего не тратили. Пользователи советуют нас друзьям, поэтому привлечение клиентов обходится дёшево.'),
        L('Ms Grant', 'And what would you do with the investment?', 'А что вы сделаете с инвестициями?'),
        L('Leo', "Expand into Germany and France. Had we had the capital last year, we'd already be operating there.", 'Выйдем в Германию и Францию. Будь у нас капитал в прошлом году, мы бы уже там работали.'),
        L('Ms Grant', "Why didn't you raise money earlier?", 'Почему вы не привлекли деньги раньше?'),
        L('Leo', "Frankly, we weren't ready. If we had scaled too early, we'd probably be bankrupt now. Plenty of our competitors did exactly that and went bust within a year.", 'Откровенно говоря, мы не были готовы. Если бы мы масштабировались слишком рано, сейчас, вероятно, были бы банкротами. Многие конкуренты так и сделали и прогорели за год.'),
        L('Ms Grant', 'Fair point. What keeps you up at night?', 'Справедливо. А что не даёт вам спать по ночам?'),
        L('Leo', "Regulation. Data protection rules are being tightened across Europe, and compliance won't come cheap.", 'Регулирование. По всей Европе ужесточают правила защиты данных, и соответствовать им будет недёшево.'),
        L('Ms Grant', "I appreciate the honesty. Most founders I meet would rather I didn't ask about risks.", 'Ценю честность. Большинство основателей предпочли бы, чтобы я не спрашивала о рисках.'),
        L('Leo', "I'd rather you heard it from me than discovered it later.", 'Я предпочту, чтобы вы услышали это от меня, а не обнаружили потом.'),
        L('Ms Grant', "Let me talk to my partners. You'll be hearing from us by Friday.", 'Дайте мне поговорить с партнёрами. Мы свяжемся с вами до пятницы.')
      ], [
        N("we'll have been operating at a profit for six consecutive months", 'future-perfect-continuous', 'К моменту в будущем процесс будет длиться уже определённое время.'),
        N("We've barely spent anything on advertising", 'present-perfect', 'Итог на сегодня.'),
        N('Users have been recommending us to friends', 'present-perfect-continuous', 'Процесс, который идёт и приносит результат.'),
        N("Had we had the capital last year, we'd already be operating there", 'inversion', 'Инверсия вместо if: Had we had = If we had had. Смешанное условие: прошлое → настоящее.'),
        N("If we had scaled too early, we'd probably be bankrupt now", 'conditional', 'Mixed conditional: нереальное прошлое (had scaled) с последствием в настоящем (would be now).'),
        N('Data protection rules are being tightened', 'passive', 'Пассив в Present Continuous: процесс идёт сейчас.'),
        N("Most founders I meet would rather I didn't ask about risks", 'unreal-past', 'would rather + подлежащее + Past Simple — желание, чтобы другой поступал иначе.'),
        N("You'll be hearing from us by Friday", 'future-continuous', 'Вежливая деловая формула: Future Continuous звучит мягче, чем will hear.')
      ], [
        ['pitch deck', 'презентация для инвесторов'], ['Walk me through', 'проведите меня по, объясните по шагам'], ['at a profit', 'с прибылью'],
        ['word of mouth', 'сарафанное радио'], ['acquisition costs', 'затраты на привлечение клиентов'], ['went bust', 'обанкротились, прогорели'],
        ['keeps you up at night', 'не даёт спать по ночам'], ["won't come cheap", 'обойдётся недёшево']
      ], [
        Q('When did Leo\'s company launch?', ['Six months ago', 'A year ago', 'Eighteen months ago', 'Last quarter'], 2, '«We launched eighteen months ago».', 'Когда запустилась компания Лео?', ['Полгода назад', 'Год назад', 'Полтора года назад', 'В прошлом квартале']),
        Q('What has mainly driven the company\'s growth?', ['Heavy advertising', 'Word of mouth', 'A famous investor', 'Low prices'], 1, '«Mostly word of mouth.»', 'Что в основном обеспечило рост компании?', ['Активная реклама', 'Сарафанное радио', 'Известный инвестор', 'Низкие цены']),
        Q('What does Leo want to do with the investment?', ['Hire more advertisers', 'Expand into Germany and France', 'Pay off debts', 'Build a new office'], 1, '«Expand into Germany and France.»', 'Что Лео хочет сделать с инвестициями?', ['Нанять рекламщиков', 'Выйти в Германию и Францию', 'Погасить долги', 'Построить новый офис']),
        Q('Why didn\'t Leo raise money earlier?', ['Nobody wanted to invest', 'The company wasn\'t ready, and scaling early could have ruined it', 'He didn\'t need money', 'He was waiting for Ms Grant'], 1, '«we weren\'t ready. If we had scaled too early, we\'d probably be bankrupt now».', 'Почему Лео не привлёк деньги раньше?', ['Никто не хотел вкладываться', 'Компания не была готова, ранний рост мог её погубить', 'Деньги были не нужны', 'Ждал госпожу Грант']),
        Q('Leo has spent a lot of money on advertising.', TFE, 1, '«We\'ve barely spent anything on advertising.»', 'Лео потратил много денег на рекламу.'),
        Q('What worries Leo most?', ['Competitors', 'Regulation of data protection', 'His partners', 'Lack of users'], 1, '«Regulation. Data protection rules are being tightened».', 'Что больше всего беспокоит Лео?', ['Конкуренты', 'Регулирование защиты данных', 'Партнёры', 'Нехватка пользователей']),
        Q('"Had we had the capital last year, we\'d already be operating there" implies that…', ['they had the capital and are operating there', 'they didn\'t have the capital, so they aren\'t operating there now', 'they will have the capital next year', 'they are operating there without capital'], 1, 'Смешанное условие с инверсией: нереальное прошлое → нереальное настоящее.', '«Had we had the capital last year, we\'d already be operating there» подразумевает, что…', ['капитал был, и они там работают', 'капитала не было, поэтому сейчас они там не работают', 'капитал появится в следующем году', 'они работают там без капитала']),
        Q('Why does Ms Grant appreciate Leo\'s answer?', ['He was very brief', 'He talked openly about risks', 'He offered her a discount', 'He flattered her'], 1, '«I appreciate the honesty.»', 'Почему госпоже Грант понравился ответ Лео?', ['Он был краток', 'Он открыто говорил о рисках', 'Он предложил скидку', 'Он ей польстил'])
      ]),

    C('cv-c1-regret', 'C1', 'psychology', 'The Road Not Taken', 'Непройденная дорога',
      'Two old friends, Clara and Ben, talk about the choices they made.', 'Старые друзья Клара и Бен говорят о сделанном когда-то выборе.', [
        L('Clara', "Do you ever wonder what would have happened if you'd accepted that job in Tokyo?", 'Ты никогда не задумываешься, что было бы, прими ты тогда ту работу в Токио?'),
        L('Ben', "All the time, to be honest. I wish I'd been braver back then.", 'Честно говоря, постоянно. Жаль, что я тогда не был смелее.'),
        L('Clara', "Why did you turn it down? You'd been dreaming about Japan for years.", 'Почему ты отказался? Ты же годами мечтал о Японии.'),
        L('Ben', "Fear, mostly. Dad had just got ill, and I convinced myself I couldn't leave. Looking back, he would have been fine — he kept telling me to go.", 'В основном страх. Папа только что заболел, и я убедил себя, что не могу уехать. Сейчас понимаю: он бы справился — он сам всё время говорил мне ехать.'),
        L('Clara', "You couldn't have known that at the time.", 'Тогда ты не мог этого знать.'),
        L('Ben', "Maybe not. But if I'd taken it, I'd probably be speaking fluent Japanese by now.", 'Может, и нет. Но если бы я согласился, наверное, уже свободно говорил бы по-японски.'),
        L('Clara', 'And you might never have met Sarah. Or had the twins.', 'И, может быть, никогда не встретил бы Сару. И не было бы близнецов.'),
        L('Ben', "True. That's the thing with regrets — you only ever imagine the good version of the other life.", 'Верно. В этом и подвох сожалений — другую жизнь всегда представляешь только в хорошем варианте.'),
        L('Clara', "Exactly. I used to wish I'd studied medicine instead of law. Then I realised I'd have hated the night shifts.", 'Именно. Я раньше жалела, что пошла на юридический, а не в медицину. А потом поняла, что возненавидела бы ночные смены.'),
        L('Ben', "So you've made peace with it?", 'То есть ты с этим смирилась?'),
        L('Clara', "Mostly. Besides, it's not as if it's too late for you. Little did you know back then that your company would one day open an office in Osaka.", 'В основном. К тому же для тебя ведь ещё не поздно. Ты тогда и представить не мог, что твоя компания однажды откроет офис в Осаке.'),
        L('Ben', "Funny you should mention that. They've asked whether I'd consider moving there next year.", 'Забавно, что ты об этом заговорила. Меня спросили, не подумаю ли я о переезде туда в следующем году.'),
        L('Clara', "Then don't make the same mistake twice. Whatever you decide, decide it for the right reasons.", 'Тогда не повторяй ту же ошибку. Что бы ты ни решил, решай по правильным причинам.')
      ], [
        N("what would have happened if you'd accepted that job", 'conditional', 'Third conditional — воображаемое прошлое.'),
        N("I wish I'd been braver back then", 'unreal-past', 'wish + Past Perfect — сожаление о прошлом.'),
        N("You'd been dreaming about Japan for years", 'past-perfect-continuous', 'Мечта длилась годами до момента отказа.'),
        N('Dad had just got ill', 'past-perfect', 'Случилось незадолго до решения в прошлом.'),
        N('he would have been fine', 'modal-perfect', 'would have + V3 — предположение о том, что было бы.'),
        N("You couldn't have known that at the time", 'modal-perfect', 'couldn\'t have + V3 — это было невозможно в прошлом.'),
        N("if I'd taken it, I'd probably be speaking fluent Japanese by now", 'conditional', 'Mixed conditional: нереальное прошлое → другое настоящее.'),
        N('I used to wish', 'used-to', 'Раньше было так, а теперь нет.'),
        N('Little did you know', 'inversion', 'Инверсия после little для эффекта: = You had no idea.'),
        N("They've asked whether I'd consider moving there", 'present-perfect', 'Свежая новость; would в косвенном вопросе.')
      ], [
        ['turn it down', 'отказаться (от предложения)'], ['Looking back', 'оглядываясь назад'], ['made peace with', 'смириться с'],
        ["it's not as if", 'ведь не то чтобы'], ['Funny you should mention that', 'забавно, что ты об этом упомянула'], ['for the right reasons', 'по правильным причинам']
      ], [
        Q('What did Ben turn down?', ['A place at university', 'A job in Tokyo', 'A trip to Osaka', 'A job in medicine'], 1, '«if you\'d accepted that job in Tokyo».', 'От чего отказался Бен?', ['От места в университете', 'От работы в Токио', 'От поездки в Осаку', 'От работы в медицине']),
        Q('What was the main reason he refused?', ['Money', 'Fear, after his father got ill', 'He didn\'t like Japan', 'His wife didn\'t want to go'], 1, '«Fear, mostly. Dad had just got ill».', 'Какова главная причина отказа?', ['Деньги', 'Страх после болезни отца', 'Ему не нравилась Япония', 'Жена не хотела ехать']),
        Q('What did Ben\'s father think about the job?', ['He asked Ben to stay', 'He kept telling Ben to go', 'He didn\'t know about it', 'He wanted to go too'], 1, '«he kept telling me to go».', 'Как отец Бена относился к той работе?', ['Просил остаться', 'Постоянно уговаривал ехать', 'Ничего не знал', 'Хотел поехать с ним']),
        Q('According to Ben and Clara, what is the problem with regrets?', ['They make you ill', 'We only imagine the good version of the other life', 'They are always justified', 'They disappear with age'], 1, 'Это говорит Бен, а Клара соглашается: «Exactly».', 'В чём, по мнению Клары и Бена, подвох сожалений?', ['От них болеют', 'Другую жизнь представляешь только в хорошем свете', 'Они всегда оправданны', 'С возрастом проходят']),
        Q('What did Clara use to regret?', ['Moving abroad', 'Not studying medicine', 'Leaving her job', 'Not having children'], 1, '«I used to wish I\'d studied medicine instead of law.»', 'О чём раньше жалела Клара?', ['О переезде за границу', 'Что не пошла в медицину', 'Что ушла с работы', 'Что у неё нет детей']),
        Q('Ben has been offered the chance to move to Osaka.', TFE, 0, '«They\'ve asked whether I\'d consider moving there next year.»', 'Бену предложили переехать в Осаку.'),
        Q('"I wish I\'d been braver" means Ben…', ['was brave and is proud of it', 'wasn\'t brave enough and regrets it', 'wants to be brave in the future', 'is brave now'], 1, 'wish + Past Perfect — сожаление о прошлом.', '«I wish I\'d been braver» значит, что Бен…', ['был смелым и гордится этим', 'не был достаточно смелым и жалеет', 'хочет быть смелым в будущем', 'сейчас смелый']),
        Q('What is Clara\'s advice at the end?', ['Stay where you are', 'Don\'t repeat the same mistake and decide for the right reasons', 'Ask your father', 'Learn Japanese first'], 1, '«don\'t make the same mistake twice… decide it for the right reasons».', 'Что советует Клара в конце?', ['Оставаться на месте', 'Не повторять ошибку и решать по правильным причинам', 'Спросить отца', 'Сначала выучить японский'])
      ]),

    C('cv-c1-robots', 'C1', 'tech', 'Are Robots Coming for Our Jobs?', 'Отнимут ли роботы нашу работу?',
      'A podcast host interviews an expert on automation.', 'Ведущий подкаста беседует с экспертом по автоматизации.', [
        L('Host', 'Welcome back. Today I\'m joined by Dr Priya Shah, who has been researching automation for over a decade. Priya, are robots coming for our jobs?', 'С возвращением. Сегодня у меня в гостях доктор Прия Шах, которая больше десяти лет изучает автоматизацию. Прия, роботы отнимут нашу работу?'),
        L('Priya', 'The short answer is: some of them, yes. But the picture is far more nuanced than the headlines suggest.', 'Если коротко — часть работы, да. Но картина куда сложнее, чем в заголовках.'),
        L('Host', 'In what way?', 'В каком смысле?'),
        L('Priya', 'Historically, technology has tended to change jobs rather than simply destroy them. When cash machines were introduced, people predicted bank tellers would disappear. In fact, the number of tellers kept growing for years.', 'Исторически технологии скорее меняли профессии, чем просто уничтожали их. Когда появились банкоматы, предсказывали исчезновение кассиров. На деле их число годами продолжало расти.'),
        L('Host', 'Why was that?', 'Почему так?'),
        L('Priya', 'Branches became cheaper to run, so banks opened more of them, and tellers ended up doing more customer service than counting cash.', 'Содержать отделения стало дешевле, банки открыли их больше, и кассиры в итоге стали больше обслуживать клиентов, чем считать наличные.'),
        L('Host', "But surely AI is different? It's not just replacing muscles, it's replacing brains.", 'Но ведь ИИ — другое дело? Он заменяет не мышцы, а мозги.'),
        L('Priya', "That's a fair concern. By 2035, many routine office tasks will have been automated — drafting standard documents, basic data analysis and so on.", 'Опасение обоснованное. К 2035 году многие рутинные офисные задачи будут автоматизированы — составление типовых документов, простой анализ данных и так далее.'),
        L('Host', 'So what should people be doing now?', 'Так что людям делать уже сейчас?'),
        L('Priya', "Investing in skills that are hard to automate: judgement, negotiation, working with people. Had we started rethinking education twenty years ago, we'd be in a much stronger position today.", 'Вкладываться в навыки, которые трудно автоматизировать: суждение, переговоры, работу с людьми. Начни мы переосмыслять образование двадцать лет назад, сегодня были бы в гораздо лучшем положении.'),
        L('Host', 'Is it too late?', 'Уже поздно?'),
        L('Priya', 'Not at all. But governments will need to be thinking about retraining on a massive scale. Otherwise, a lot of people will be left behind.', 'Вовсе нет. Но правительствам придётся думать о переобучении в огромных масштабах. Иначе очень многие останутся за бортом.'),
        L('Host', 'On that sobering note — Priya Shah, thank you for joining us.', 'На этой отрезвляющей ноте — Прия Шах, спасибо, что пришли.')
      ], [
        N('who has been researching automation for over a decade', 'present-perfect-continuous', 'Деятельность длится больше десяти лет и продолжается.'),
        N('technology has tended to change jobs', 'present-perfect', 'Обобщение опыта вплоть до сегодняшнего дня.'),
        N('When cash machines were introduced', 'passive', 'Пассив в Past Simple: важно событие, а не кто их ввёл.'),
        N('the number of tellers kept growing for years', 'past-simple', 'keep + V-ing — «продолжать» (здесь в прошедшем).'),
        N('many routine office tasks will have been automated', 'future-perfect', 'Future Perfect в пассиве: будет сделано к 2035 году.'),
        N("Had we started rethinking education twenty years ago, we'd be in a much stronger position today", 'inversion', 'Инверсия вместо if + смешанное условие: прошлое → настоящее.'),
        N('governments will need to be thinking about retraining', 'future-continuous', 'Процесс, который должен идти в будущем.'),
        N('a lot of people will be left behind', 'passive', 'Пассив с will — что с ними случится.')
      ], [
        ['coming for our jobs', 'покушаются на наши рабочие места'], ['far more nuanced', 'гораздо сложнее, неоднозначнее'], ['the headlines', 'заголовки (новостей)'],
        ['ended up doing', 'в итоге стали заниматься'], ['a fair concern', 'обоснованное опасение'], ['on a massive scale', 'в огромных масштабах'],
        ['left behind', 'остаться за бортом'], ['On that sobering note', 'на этой отрезвляющей ноте']
      ], [
        Q('How long has Priya been researching automation?', ['Two years', 'Five years', 'Over ten years', 'Twenty years'], 2, '«for over a decade».', 'Сколько лет Прия изучает автоматизацию?', ['Два года', 'Пять лет', 'Больше десяти лет', 'Двадцать лет']),
        Q('According to Priya, what has technology usually done in the past?', ['Destroyed jobs completely', 'Changed jobs rather than destroyed them', 'Had no effect on jobs', 'Created only low-paid jobs'], 1, '«technology has tended to change jobs rather than simply destroy them».', 'Что, по словам Прии, технологии обычно делали в прошлом?', ['Полностью уничтожали профессии', 'Скорее меняли профессии, чем уничтожали', 'Не влияли на работу', 'Создавали только низкооплачиваемые места']),
        Q('What happened to bank tellers after cash machines appeared?', ['They all lost their jobs', 'Their number kept growing', 'They became programmers', 'Banks closed'], 1, '«the number of tellers kept growing for years».', 'Что стало с кассирами после появления банкоматов?', ['Все потеряли работу', 'Их число продолжало расти', 'Они стали программистами', 'Банки закрылись']),
        Q('Why did that happen?', ['Cash machines broke often', 'Branches became cheaper, so banks opened more', 'People didn\'t trust machines', 'The government protected tellers'], 1, '«Branches became cheaper to run, so banks opened more of them».', 'Почему так произошло?', ['Банкоматы часто ломались', 'Отделения подешевели, и банки открыли больше', 'Люди не доверяли машинам', 'Государство защищало кассиров']),
        Q('Which tasks does Priya expect to be automated by 2035?', ['Negotiation', 'Routine office tasks like drafting standard documents', 'Working with people', 'Teaching'], 1, '«many routine office tasks will have been automated».', 'Какие задачи, по мнению Прии, автоматизируют к 2035 году?', ['Переговоры', 'Рутинные офисные задачи вроде типовых документов', 'Работу с людьми', 'Преподавание']),
        Q('Priya believes it is too late to prepare.', TFE, 1, '«Not at all.»', 'Прия считает, что готовиться уже поздно.'),
        Q('"Had we started rethinking education twenty years ago, we\'d be in a much stronger position today" implies that…', ['we did start, and we are strong', 'we didn\'t start, and that weakens us now', 'we will start in twenty years', 'education doesn\'t matter'], 1, 'Инверсия Had we = If we had; нереальное прошлое влияет на настоящее.', '«Had we started rethinking education twenty years ago, we\'d be in a much stronger position today» подразумевает, что…', ['мы начали и сейчас сильны', 'мы не начали, и это ослабляет нас сейчас', 'мы начнём через двадцать лет', 'образование не важно'])
      ]),

    C('cv-c1-painting', 'C1', 'history', 'The Missing Painting', 'Пропавшая картина',
      'An inspector and a sergeant discuss a theft from a city museum.', 'Инспектор и сержант обсуждают кражу из городского музея.', [
        L('Mills', 'The painting was definitely on the wall at closing time, sir. The guard checked at six.', 'Картина точно висела на стене в момент закрытия, сэр. Охранник проверял в шесть.'),
        L('Reed', "And the alarm didn't go off. So whoever took it must have known the code.", 'И сигнализация не сработала. Значит, тот, кто её взял, должно быть, знал код.'),
        L('Mills', "Only four people had access to it: the director, two guards, and a cleaner who'd been working here for less than a month.", 'Доступ был только у четверых: у директора, двух охранников и уборщицы, которая проработала здесь меньше месяца.'),
        L('Reed', "Convenient. But let's not jump to conclusions. What was the night guard doing between midnight and two?", 'Удобно. Но не будем спешить с выводами. Что делал ночной охранник между полуночью и двумя часами?'),
        L('Mills', 'He claims he was doing his rounds. But the cameras on the second floor had been switched off at 11:45.', 'Утверждает, что совершал обход. Но камеры на третьем этаже были отключены в 23:45.'),
        L('Reed', 'By whom?', 'Кем?'),
        L('Mills', "That's the strange part. They were switched off from the director's computer.", 'Вот что странно. Их отключили с компьютера директора.'),
        L('Reed', "The director can't have done it herself — she was giving a speech at a charity dinner all evening. Thirty witnesses.", 'Сама директор этого сделать не могла — весь вечер она выступала на благотворительном ужине. Тридцать свидетелей.'),
        L('Mills', 'Someone might have used her password, then.', 'Значит, кто-то мог воспользоваться её паролем.'),
        L('Reed', 'Quite possibly. Who was in her office yesterday?', 'Вполне возможно. Кто был у неё в кабинете вчера?'),
        L('Mills', "The cleaner. She'd been asked to tidy it before the board meeting.", 'Уборщица. Её попросили прибраться там перед заседанием совета.'),
        L('Reed', 'Interesting. Not only did she have access to the office, but she was also in the building on the night of the theft.', 'Интересно. У неё не только был доступ в кабинет — в ночь кражи она ещё и находилась в здании.'),
        L('Mills', 'Should we bring her in?', 'Задержать её?'),
        L('Reed', "Not yet. If we move too soon, whoever she's working with will disappear. By this time tomorrow, I want every login on that computer checked.", 'Пока нет. Если поторопимся, тот, с кем она работает, исчезнет. К этому времени завтра я хочу, чтобы каждый вход в этот компьютер был проверен.')
      ], [
        N('whoever took it must have known the code', 'modal-perfect', 'must have + V3 — уверенный вывод о прошлом.'),
        N("who'd been working here for less than a month", 'past-perfect-continuous', 'Длительность до момента кражи.'),
        N('What was the night guard doing', 'past-continuous', 'Вопрос о процессе в определённый промежуток прошлого.'),
        N('the cameras on the second floor had been switched off', 'passive', 'Past Perfect в пассиве: отключили ещё до кражи.'),
        N("can't have done it herself", 'modal-perfect', 'can\'t have + V3 — вывод «не могла» о прошлом.'),
        N('she was giving a speech', 'past-continuous', 'Процесс весь вечер — алиби.'),
        N('Someone might have used her password', 'modal-perfect', 'might have + V3 — возможное объяснение прошлого.'),
        N("She'd been asked to tidy it", 'past-perfect', 'Пассив в Past Perfect: просьба прозвучала раньше.'),
        N('Not only did she have access to the office', 'inversion', 'Инверсия после not only — усиление.'),
        N("If we move too soon, whoever she's working with will disappear", 'conditional', 'First conditional — реальный риск.')
      ], [
        ['at closing time', 'во время закрытия'], ["didn't go off", 'не сработала'], ['jump to conclusions', 'делать поспешные выводы'],
        ['doing his rounds', 'совершал обход'], ['charity dinner', 'благотворительный ужин'], ['board meeting', 'заседание совета (директоров)'], ['bring her in', 'доставить её (в участок)']
      ], [
        Q('When was the painting last seen?', ['At midnight', 'At closing time, at six', 'In the morning', 'At 11:45'], 1, '«The painting was definitely on the wall at closing time… The guard checked at six.»', 'Когда картину видели в последний раз?', ['В полночь', 'При закрытии, в шесть', 'Утром', 'В 23:45']),
        Q('Why does Reed think the thief knew the code?', ['The door was open', 'The alarm didn\'t go off', 'The guard said so', 'The code was written on the wall'], 1, '«the alarm didn\'t go off. So whoever took it must have known the code».', 'Почему Рид считает, что вор знал код?', ['Дверь была открыта', 'Сигнализация не сработала', 'Так сказал охранник', 'Код был написан на стене']),
        Q('How were the cameras switched off?', ['By the guard', 'From the director\'s computer', 'By a power cut', 'Nobody knows'], 1, '«They were switched off from the director\'s computer.»', 'Как отключили камеры?', ['Охранник', 'С компьютера директора', 'Из-за отключения электричества', 'Никто не знает']),
        Q('Why can\'t the director be the thief?', ['She doesn\'t know the code', 'She was at a charity dinner with thirty witnesses', 'She was ill', 'She was on holiday'], 1, '«she was giving a speech at a charity dinner all evening. Thirty witnesses.»', 'Почему директор не может быть воровкой?', ['Она не знает код', 'Она была на ужине при тридцати свидетелях', 'Она болела', 'Она была в отпуске']),
        Q('Why was the cleaner in the director\'s office?', ['To steal the password', 'She had been asked to tidy it', 'To meet the director', 'She was lost'], 1, '«She\'d been asked to tidy it before the board meeting.»', 'Зачем уборщица была в кабинете директора?', ['Украсть пароль', 'Её попросили там прибраться', 'Встретиться с директором', 'Она заблудилась']),
        Q('Reed wants to arrest the cleaner immediately.', TFE, 1, '«Not yet. If we move too soon…»', 'Рид хочет немедленно задержать уборщицу.'),
        Q('"must have known the code" expresses…', ['a strong conclusion about the past', 'an obligation in the past', 'a plan for the future', 'a possibility in the present'], 0, 'must have + V3 — уверенный вывод о прошлом.', '«must have known the code» выражает…', ['уверенный вывод о прошлом', 'обязанность в прошлом', 'план на будущее', 'возможность в настоящем']),
        Q('Why doesn\'t Reed want to act too soon?', ['He has no evidence at all', 'The person working with the cleaner might disappear', 'The museum is closed', 'He is going on holiday'], 1, '«whoever she\'s working with will disappear».', 'Почему Рид не хочет действовать слишком быстро?', ['У него вообще нет улик', 'Сообщник уборщицы может скрыться', 'Музей закрыт', 'Он уходит в отпуск'])
      ])
  ];

  D.convosById = Object.create(null); // без прототипа: id «constructor» из backup не найдёт Object
  D.convos.forEach(function (c, i) {
    c.order = i;
    c.words = c.lines.map(function (l) { return l.en; }).join(' ').split(/\s+/).filter(Boolean).length;
    // времена и конструкции в порядке первого появления — для бейджей в списке и в шапке
    c.grammar = [];
    c.notes.forEach(function (n) { if (c.grammar.indexOf(n.gram) < 0) c.grammar.push(n.gram); });
    D.convosById[c.id] = c;
  });
})(window.EG = window.EG || {});
