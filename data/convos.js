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
        ['Is this it?', 'Это он?'], ['sign here', 'распишитесь здесь'], ['be more careful', 'будьте внимательнее'], ['next time', 'в следующий раз']
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
        ["Don't ask!", 'лучше не спрашивай!'], ['went wrong', 'пошло не так'], ['full of smoke', 'полна дыма'], ['smoke alarm', 'пожарная сигнализация'], ['go off', 'сработать (о сигнализации, будильнике)'],
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

    C('cv-a2-doctor', 'A2', 'health', "I Don't Feel Well", 'Мне нехорошо',
      'Ana visits a doctor because she has felt ill for a few days.', 'Ана пришла к врачу: ей уже несколько дней нездоровится.', [
        L('Doctor', "Good morning. Come in and sit down. What's the problem?", 'Доброе утро. Проходите, садитесь. На что жалуетесь?'),
        L('Ana', "I don't feel well. I've had a terrible headache for three days.", 'Я плохо себя чувствую. У меня уже три дня ужасно болит голова.'),
        L('Doctor', 'I see. Do you have a temperature?', 'Понятно. Температура есть?'),
        L('Ana', "Yes, a little. And I'm feeling very tired all the time.", 'Да, небольшая. И я всё время чувствую сильную усталость.'),
        L('Doctor', 'Are you sleeping well?', 'Вы хорошо спите?'),
        L('Ana', "Not really. I'm working on a big project at the moment, so I usually go to bed after midnight.", 'Не очень. Сейчас я работаю над большим проектом, поэтому обычно ложусь после полуночи.'),
        L('Doctor', 'How much water do you drink every day?', 'Сколько воды вы пьёте в день?'),
        L('Ana', 'Not much. I drink a lot of coffee, about five cups a day.', 'Немного. Зато пью много кофе — около пяти чашек в день.'),
        L('Doctor', "That's too much. Did you eat anything this morning?", 'Это слишком много. Вы сегодня утром что-нибудь ели?'),
        L('Ana', "No, I didn't have time. I only had a coffee.", 'Нет, не успела. Только выпила кофе.'),
        L('Doctor', "OK. It isn't serious, but you need to rest. I'm going to give you something for the headache.", 'Хорошо. Ничего серьёзного, но вам нужно отдохнуть. Я дам вам кое-что от головной боли.'),
        L('Ana', 'Thank you. Do I need to stay at home?', 'Спасибо. Мне нужно сидеть дома?'),
        L('Doctor', "Yes, for two days. Drink more water, eat well and go to bed early. You'll feel better soon.", 'Да, два дня. Пейте больше воды, хорошо питайтесь и ложитесь пораньше. Скоро вам станет лучше.')
      ], [
        N("I've had a terrible headache for three days", 'present-perfect', 'for + период: боль началась в прошлом и не прошла. По-русски «болит уже три дня», а по-английски — Present Perfect.'),
        N("I'm working on a big project at the moment", 'present-continuous', 'at the moment — временное занятие в этот период.'),
        N('I usually go to bed after midnight', 'present-simple', 'usually — привычка, поэтому Present Simple.'),
        N("No, I didn't have time", 'past-simple', 'Утро уже прошло — Past Simple.'),
        N("I'm going to give you something for the headache", 'going-to', 'Врач уже решил, что сделает, — be going to.'),
        N("You'll feel better soon", 'future-simple', 'will — уверенный прогноз.')
      ], [
        ['Come in and sit down', 'проходите, садитесь'], ["What's the problem?", 'на что жалуетесь? в чём дело?'], ["I don't feel well", 'я плохо себя чувствую'],
        ['have a temperature', 'температура (повышенная)'], ['all the time', 'всё время'], ['at the moment', 'сейчас, в данный момент'],
        ['go to bed', 'ложиться спать'], ['feel better', 'почувствовать себя лучше']
      ], [
        Q('How long has Ana had a headache?', ['Since yesterday', 'For three days', 'For a week', 'Only this morning'], 1, '«I\'ve had a terrible headache for three days.»', 'Сколько времени у Аны болит голова?', ['Со вчерашнего дня', 'Три дня', 'Неделю', 'Только сегодня утром']),
        Q('Why does Ana go to bed late?', ['She watches films', 'She is working on a big project', 'She has a baby', 'She drinks too much tea'], 1, '«I\'m working on a big project at the moment».', 'Почему Ана поздно ложится?', ['Смотрит фильмы', 'Работает над большим проектом', 'У неё маленький ребёнок', 'Пьёт слишком много чая']),
        Q('How many cups of coffee does Ana drink a day?', ['One', 'Two', 'About five', 'Ten'], 2, '«about five cups a day».', 'Сколько чашек кофе в день пьёт Ана?', ['Одну', 'Две', 'Около пяти', 'Десять']),
        Q('Ana had breakfast this morning.', TFE, 1, '«No, I didn\'t have time. I only had a coffee.»', 'Ана сегодня позавтракала.'),
        Q('What does the doctor tell Ana to do?', ['Go back to work', 'Rest, drink more water and go to bed early', 'Drink more coffee', 'Go to hospital'], 1, '«Drink more water, eat well and go to bed early.»', 'Что врач советует Ане?', ['Вернуться на работу', 'Отдыхать, пить больше воды и рано ложиться', 'Пить больше кофе', 'Лечь в больницу']),
        Q('Why does Ana say "I\'ve had a headache for three days", not "I have a headache for three days"?', ['The headache started in the past and continues now', 'The headache has finished', 'It is a plan', 'Both are correct'], 0, 'for + период до настоящего момента — Present Perfect.', 'Почему Ана говорит «I\'ve had a headache for three days», а не «I have a headache for three days»?', ['Боль началась в прошлом и продолжается сейчас', 'Боль уже прошла', 'Это план', 'Оба варианта верны'])
      ]),

    C('cv-a2-party', 'A2', 'people', 'The Surprise Party', 'Вечеринка-сюрприз',
      'Mia and Jake are planning a party for their friend Chris.', 'Миа и Джейк готовят вечеринку для своего друга Криса.', [
        L('Mia', "Jake, it's Chris's birthday on Saturday. Let's have a surprise party for him!", 'Джейк, в субботу у Криса день рождения. Давай устроим ему вечеринку-сюрприз!'),
        L('Jake', 'Great idea! Where are we going to have it?', 'Отличная идея! А где мы её устроим?'),
        L('Mia', "At my flat. It's big enough for twenty people.", 'У меня. В квартире хватит места на двадцать человек.'),
        L('Jake', "OK. I'll make a list of people to invite.", 'Хорошо. Я составлю список гостей.'),
        L('Mia', "Thanks. I'm going to make a big chocolate cake. Chris loves chocolate.", 'Спасибо. А я испеку большой шоколадный торт. Крис обожает шоколад.'),
        L('Jake', "What about music? My brother has got a great speaker. I'll ask him tonight.", 'А музыка? У моего брата отличная колонка. Спрошу его сегодня вечером.'),
        L('Mia', 'Perfect. But how are we going to get Chris to my flat without telling him?', 'Отлично. Но как мы приведём Криса ко мне, ничего ему не сказав?'),
        L('Jake', "Easy. I'm meeting him for coffee on Saturday afternoon. After that, I'll say I left my jacket at your place.", 'Легко. В субботу днём мы с ним встречаемся выпить кофе. А потом я скажу, что забыл у тебя куртку.'),
        L('Mia', "Ha! He won't suspect anything.", 'Ха! Он ничего не заподозрит.'),
        L('Jake', "And when we open the door, everyone will shout 'Surprise!'", 'А когда мы откроем дверь, все закричат: «Сюрприз!»'),
        L('Mia', "I hope he doesn't cry!", 'Надеюсь, он не расплачется!'),
        L('Jake', 'He will. Last year he cried at a wedding!', 'Расплачется. В прошлом году он плакал на свадьбе!')
      ], [
        N('Where are we going to have it', 'going-to', 'Вопрос о плане: be going to.'),
        N("I'll make a list of people to invite", 'future-simple', 'Решение, принятое прямо сейчас, — will.'),
        N("I'm going to make a big chocolate cake", 'going-to', 'Намерение, задуманное заранее.'),
        N("I'm meeting him for coffee on Saturday afternoon", 'present-continuous', 'Договорённость на конкретное время — Present Continuous.'),
        N("He won't suspect anything", 'future-simple', 'Прогноз: will / won\'t.'),
        N('Last year he cried at a wedding', 'past-simple', 'Last year — событие в прошлом.')
      ], [
        ['surprise party', 'вечеринка-сюрприз'], ['big enough', 'достаточно большая'], ['make a list', 'составить список'],
        ['What about music?', 'а как насчёт музыки?'], ['without telling him', 'ничего ему не сказав'], ['at your place', 'у тебя (дома)'],
        ['suspect anything', 'что-либо заподозрить']
      ], [
        Q("When is Chris's birthday?", ['On Friday', 'On Saturday', 'On Sunday', 'Today'], 1, '«it\'s Chris\'s birthday on Saturday».', 'Когда у Криса день рождения?', ['В пятницу', 'В субботу', 'В воскресенье', 'Сегодня']),
        Q('Where will the party be?', ["At Jake's house", "At Mia's flat", 'In a café', "At Chris's flat"], 1, '«At my flat.»', 'Где будет вечеринка?', ['У Джейка дома', 'У Мии в квартире', 'В кафе', 'У Криса']),
        Q('What is Mia going to make?', ['Pizza', 'A big chocolate cake', 'Sandwiches', 'A fruit salad'], 1, '«I\'m going to make a big chocolate cake.»', 'Что собирается приготовить Миа?', ['Пиццу', 'Большой шоколадный торт', 'Бутерброды', 'Фруктовый салат']),
        Q('Who has got a great speaker?', ['Mia', 'Chris', "Jake's brother", "Mia's sister"], 2, '«My brother has got a great speaker.»', 'У кого есть отличная колонка?', ['У Мии', 'У Криса', 'У брата Джейка', 'У сестры Мии']),
        Q('How will Jake bring Chris to the flat?', ['He will tell him about the party', 'He will say he left his jacket there', 'He will ask him to help with the cake', 'He will send him a message'], 1, '«I\'ll say I left my jacket at your place.»', 'Как Джейк приведёт Криса в квартиру?', ['Расскажет о вечеринке', 'Скажет, что забыл там куртку', 'Попросит помочь с тортом', 'Пришлёт сообщение']),
        Q('Chris knows about the party.', TFE, 1, 'Это сюрприз: «He won\'t suspect anything.»', 'Крис знает о вечеринке.'),
        Q('Why does Jake say "I\'m meeting him for coffee on Saturday"?', ['It is an arrangement for the future', 'It is happening right now', 'It is a habit', 'It happened in the past'], 0, 'Present Continuous — для договорённостей на будущее.', 'Почему Джейк говорит «I\'m meeting him for coffee on Saturday»?', ['Это договорённость на будущее', 'Это происходит прямо сейчас', 'Это привычка', 'Это было в прошлом'])
      ]),

    C('cv-a2-hotel', 'A2', 'travel', 'A Problem at the Hotel', 'Проблема в отеле',
      'Mr Lee calls the hotel reception from his room.', 'Мистер Ли звонит из номера на ресепшен.', [
        L('Receptionist', 'Reception, good evening. How can I help?', 'Ресепшен, добрый вечер. Чем могу помочь?'),
        L('Mr Lee', "Hello, this is room 312. I'm afraid there's a problem with the shower. There's no hot water.", 'Здравствуйте, это номер 312. Боюсь, что-то не так с душем. Нет горячей воды.'),
        L('Receptionist', "Oh, I'm so sorry. Have you tried the left tap? It's sometimes a bit slow.", 'Ой, простите. Вы пробовали левый кран? Он иногда медленно нагревается.'),
        L('Mr Lee', "Yes, I've already tried both taps. I waited for ten minutes, but the water is still cold.", 'Да, я уже пробовал оба крана. Ждал десять минут, а вода всё ещё холодная.'),
        L('Receptionist', "I see. I'll send someone up right away.", 'Понятно. Сейчас же пришлю к вам кого-нибудь.'),
        L('Mr Lee', "Thank you. And one more thing: the Wi-Fi isn't working either.", 'Спасибо. И ещё одно: Wi-Fi тоже не работает.'),
        L('Receptionist', 'Have you entered the new password? We changed it this morning.', 'Вы ввели новый пароль? Мы поменяли его сегодня утром.'),
        L('Mr Lee', "No, I haven't. Nobody told me about a new password.", 'Нет. Мне никто не говорил о новом пароле.'),
        L('Receptionist', "I'm sorry about that. It's SUNSHINE, all in capital letters.", 'Прошу прощения. Пароль SUNSHINE, всё заглавными буквами.'),
        L('Mr Lee', "OK, the Wi-Fi works now. But the engineer hasn't arrived yet.", 'Так, Wi-Fi заработал. Но мастер ещё не пришёл.'),
        L('Receptionist', "He's just left the lift. He'll be at your door in a minute.", 'Он только что вышел из лифта. Через минуту будет у вашей двери.'),
        L('Mr Lee', 'Great, I can hear him now.', 'Отлично, я уже слышу его.'),
        L('Receptionist', 'And for the trouble, breakfast tomorrow is free. Enjoy your stay!', 'А за беспокойство завтрак завтра за наш счёт. Приятного отдыха!')
      ], [
        N("I've already tried both taps", 'present-perfect', 'already — уже сделано, важен результат сейчас.'),
        N('I waited for ten minutes', 'past-simple', 'Законченное действие в прошлом.'),
        N("I'll send someone up right away", 'future-simple', 'Решение и обещание в момент разговора — will.'),
        N("the Wi-Fi isn't working either", 'present-continuous', 'Временная поломка сейчас — Present Continuous.'),
        N('We changed it this morning', 'past-simple', 'this morning уже прошло — Past Simple.'),
        N("the engineer hasn't arrived yet", 'present-perfect', 'yet в отрицании — «ещё не».'),
        N("He's just left the lift", 'present-perfect', 'just — «только что».')
      ], [
        ["I'm afraid", 'боюсь, к сожалению'], ['hot water', 'горячая вода'], ['send someone up', 'прислать кого-нибудь (наверх, в номер)'],
        ['right away', 'сразу, немедленно'], ['one more thing', 'и ещё одно'], ['capital letters', 'заглавные буквы'],
        ['in a minute', 'через минуту'], ['for the trouble', 'за беспокойство'], ['Enjoy your stay!', 'приятного пребывания!']
      ], [
        Q("What is the first problem in Mr Lee's room?", ['The TV is broken', 'There is no hot water', 'The room is too small', "The window doesn't open"], 1, '«There\'s no hot water.»', 'Какая первая проблема в номере мистера Ли?', ['Сломался телевизор', 'Нет горячей воды', 'Номер слишком маленький', 'Не открывается окно']),
        Q('How long did Mr Lee wait for hot water?', ['Two minutes', 'Five minutes', 'Ten minutes', 'An hour'], 2, '«I waited for ten minutes».', 'Сколько мистер Ли ждал горячую воду?', ['Две минуты', 'Пять минут', 'Десять минут', 'Час']),
        Q("Why didn't the Wi-Fi work for Mr Lee?", ['The router was broken', 'He used the old password', 'The hotel has no Wi-Fi', 'His phone is old'], 1, 'Пароль поменяли утром, а ему не сказали.', 'Почему у мистера Ли не работал Wi-Fi?', ['Сломался роутер', 'Он вводил старый пароль', 'В отеле нет Wi-Fi', 'У него старый телефон']),
        Q('The engineer arrived before the Wi-Fi started working.', TFE, 1, '«the Wi-Fi works now. But the engineer hasn\'t arrived yet.»', 'Мастер пришёл раньше, чем заработал Wi-Fi.'),
        Q('What does the hotel give Mr Lee for the trouble?', ['A bigger room', 'A free dinner', 'Free breakfast tomorrow', 'His money back'], 2, '«breakfast tomorrow is free».', 'Что отель даёт мистеру Ли за беспокойство?', ['Номер побольше', 'Бесплатный ужин', 'Бесплатный завтрак завтра', 'Возврат денег']),
        Q('In "He\'s just left the lift", "just" means…', ['a moment ago', 'never', 'every day', 'tomorrow'], 0, 'just + Present Perfect — «только что».', 'Во фразе «He\'s just left the lift» слово «just» означает…', ['только что', 'никогда', 'каждый день', 'завтра'])
      ]),

    C('cv-a2-school', 'A2', 'education', 'A New School', 'Новая школа',
      'Kim talks to her mum after her first day at a new school.', 'Ким рассказывает маме о первом дне в новой школе.', [
        L('Mum', 'So, how was your first day?', 'Ну, как прошёл первый день?'),
        L('Kim', 'Better than I expected! At first I was really nervous, but everyone was friendly.', 'Лучше, чем я ожидала! Сначала я очень нервничала, но все были дружелюбные.'),
        L('Mum', 'Did you make any friends?', 'Подружилась с кем-нибудь?'),
        L('Kim', 'Yes, a girl called Sara. She sat next to me in Maths and showed me around at lunch.', 'Да, с девочкой Сарой. Она сидела рядом со мной на математике и в обед всё мне показала.'),
        L('Mum', 'That was kind of her. What are the teachers like?', 'Как мило с её стороны. А какие учителя?'),
        L('Kim', 'Most of them are nice. The English teacher is the best. She tells funny stories in every lesson.', 'В основном хорошие. Лучше всех учительница английского. Она на каждом уроке рассказывает смешные истории.'),
        L('Mum', 'And is the school bigger than your old one?', 'А школа больше, чем твоя старая?'),
        L('Kim', 'Much bigger! I got lost twice. I was looking for the science room when the bell rang.', 'Гораздо больше! Я дважды заблудилась. Искала кабинет естествознания, когда прозвенел звонок.'),
        L('Mum', 'Oh no! Were you late?', 'Ой! Ты опоздала?'),
        L('Kim', "Only five minutes. The teacher didn't mind.", 'Всего на пять минут. Учитель не возражал.'),
        L('Mum', 'Have you got any homework?', 'Домашнее задание есть?'),
        L('Kim', "Yes, a little. I'm going to do it now, and then I'm going to call Sara.", 'Да, немного. Сейчас сделаю, а потом позвоню Саре.'),
        L('Mum', "Good plan. I'm glad you like it there.", 'Хороший план. Я рада, что тебе там нравится.')
      ], [
        N('At first I was really nervous', 'past-simple', 'Состояние в прошлом: was.'),
        N('She sat next to me in Maths and showed me around at lunch', 'past-simple', 'Цепочка законченных действий в прошлом.'),
        N('She tells funny stories in every lesson', 'present-simple', 'in every lesson — то, что происходит регулярно.'),
        N('I was looking for the science room when the bell rang', 'past-continuous', 'Длительный процесс (was looking) прервало короткое событие (rang).'),
        N("I'm going to do it now", 'going-to', 'Намерение на ближайшее будущее.')
      ], [
        ['Better than I expected', 'лучше, чем я ожидала'], ['make any friends', 'с кем-нибудь подружиться'], ['showed me around', 'всё мне показала'],
        ['That was kind of her', 'как мило с её стороны'], ['What are the teachers like?', 'какие учителя?'], ['got lost', 'заблудилась'],
        ['the bell rang', 'прозвенел звонок'], ["didn't mind", 'не возражал']
      ], [
        Q('How did Kim feel at first?', ['Happy', 'Nervous', 'Bored', 'Angry'], 1, '«At first I was really nervous».', 'Что Ким чувствовала поначалу?', ['Радость', 'Волнение', 'Скуку', 'Злость']),
        Q('Who is Sara?', ["Kim's teacher", 'A girl who helped Kim', "Kim's sister", 'The head teacher'], 1, 'Сара сидела рядом и всё показала Ким.', 'Кто такая Сара?', ['Учительница Ким', 'Девочка, которая помогла Ким', 'Сестра Ким', 'Директор школы']),
        Q('Why does Kim like the English teacher?', ['She gives no homework', 'She tells funny stories', 'She is very young', 'She speaks Russian'], 1, '«She tells funny stories in every lesson.»', 'Почему Ким нравится учительница английского?', ['Не задаёт домашних заданий', 'Рассказывает смешные истории', 'Она очень молодая', 'Говорит по-русски']),
        Q('What happened when Kim was looking for the science room?', ['She found Sara', 'The bell rang', 'She lost her bag', 'She met her mum'], 1, '«I was looking for the science room when the bell rang.»', 'Что случилось, пока Ким искала кабинет естествознания?', ['Она нашла Сару', 'Прозвенел звонок', 'Она потеряла сумку', 'Она встретила маму']),
        Q('Kim was very late for the lesson.', TFE, 1, '«Only five minutes. The teacher didn\'t mind.»', 'Ким сильно опоздала на урок.'),
        Q('What is Kim going to do after her homework?', ['Watch TV', 'Call Sara', 'Go to bed', 'Play football'], 1, '«and then I\'m going to call Sara».', 'Что Ким собирается сделать после домашнего задания?', ['Посмотреть телевизор', 'Позвонить Саре', 'Лечь спать', 'Поиграть в футбол']),
        Q('In "I was looking for the room when the bell rang", which action interrupted the other?', ['was looking', 'rang', 'Both happened at the same time', 'Neither'], 1, 'Короткое действие в Past Simple прерывает длительное в Past Continuous.', 'Во фразе «I was looking for the room when the bell rang» какое действие прервало другое?', ['was looking (искала)', 'rang (прозвенел)', 'Оба произошли одновременно', 'Никакое'])
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
        ['bothered you', 'беспокоило, задевало тебя'], ['cleaning schedule', 'график уборки'], ['stick to', 'придерживаться'], ['Deal', 'договорились']
      ], [
        Q('What is Jess\'s main complaint?', ['Olly is too noisy', 'Olly eats her food and borrows her things', 'Olly never pays the rent', 'Olly invites too many guests'], 1, 'Еда из холодильника и вещи без спроса.', 'На что в основном жалуется Джесс?', ['Олли шумит', 'Олли ест её еду и берёт её вещи', 'Олли не платит за квартиру', 'Олли зовёт слишком много гостей']),
        Q('What happened to the cheese?', ['It went bad', 'Half of it disappeared', 'Jess ate it', 'Olly threw it away'], 1, '«this morning half of it had disappeared».', 'Что случилось с сыром?', ['Он испортился', 'Половина исчезла', 'Джесс его съела', 'Олли его выбросил']),
        Q('Since when have the dishes been in the sink?', ['Since yesterday', 'Since Monday', 'Since last week', 'Since this morning'], 1, '«since Monday».', 'С какого времени посуда в раковине?', ['Со вчера', 'С понедельника', 'С прошлой недели', 'С утра']),
        Q('Why hasn\'t Olly washed the dishes?', ['He forgot', 'He has been working late', 'He doesn\'t like washing up', 'There is no water'], 1, '«I\'ve been working late every day this week.»', 'Почему Олли не помыл посуду?', ['Забыл', 'Работал допоздна', 'Не любит мыть посуду', 'Нет воды']),
        Q('Jess wants to move out.', TFE, 1, 'Она предлагает график уборки: «I don\'t want to argue».', 'Джесс хочет съехать.'),
        Q('What do they agree to do?', ['Buy a second fridge', 'Make a cleaning schedule', 'Eat together every day', 'Find a new flatmate'], 1, '«Shall we make a cleaning schedule?» — «Good idea.»', 'О чём они договариваются?', ['Купить второй холодильник', 'Составить график уборки', 'Каждый день есть вместе', 'Найти нового соседа']),
        Q('In "You\'re always borrowing my things", Jess sounds…', ['happy', 'annoyed', 'surprised', 'sleepy'], 1, 'always + Present Continuous передаёт раздражение.', 'Во фразе «You\'re always borrowing my things» Джесс звучит…', ['радостно', 'раздражённо', 'удивлённо', 'сонно'])
      ]),

    C('cv-b1-interview', 'B1', 'work', 'The Job Interview', 'Собеседование',
      'Laura is having an interview for a job at a travel company.', 'Лора проходит собеседование в туристической компании.', [
        L('Mr Hart', 'Thanks for coming, Laura. Tell me a little about yourself.', 'Спасибо, что пришли, Лора. Расскажите немного о себе.'),
        L('Laura', "Of course. I've been working as a hotel receptionist for four years, and before that I studied tourism at university.", 'Конечно. Я четыре года работаю администратором в отеле, а до этого изучала туризм в университете.'),
        L('Mr Hart', 'Why do you want to leave your current job?', 'Почему вы хотите уйти с нынешней работы?'),
        L('Laura', "I've learnt a lot there, but I'd like more responsibility. I used to organise trips for our guests, and I really enjoyed it.", 'Я многому там научилась, но хочу больше ответственности. Раньше я организовывала поездки для гостей, и мне это очень нравилось.'),
        L('Mr Hart', 'Have you ever dealt with a difficult customer?', 'Вам приходилось иметь дело с трудным клиентом?'),
        L('Laura', 'Many times. Last summer a family arrived at midnight, and their room had been given to someone else by mistake.', 'Много раз. Прошлым летом семья приехала в полночь, а их номер по ошибке уже отдали другим.'),
        L('Mr Hart', 'What did you do?', 'И что вы сделали?'),
        L('Laura', 'I apologised, found them a room in another hotel and booked a taxi. The next morning they left us a five-star review.', 'Я извинилась, нашла им номер в другом отеле и вызвала такси. На следующее утро они оставили нам отзыв на пять звёзд.'),
        L('Mr Hart', 'Impressive. Do you speak any other languages?', 'Впечатляет. Вы говорите на других языках?'),
        L('Laura', "Spanish and a bit of Italian. I've been taking Italian lessons since January.", 'На испанском и немного на итальянском. С января беру уроки итальянского.'),
        L('Mr Hart', 'Good. If we offer you the job, when can you start?', 'Хорошо. Если мы предложим вам работу, когда вы сможете приступить?'),
        L('Laura', "I'll need to give one month's notice, so probably at the beginning of June.", 'Мне нужно будет предупредить начальство за месяц, так что, скорее всего, в начале июня.'),
        L('Mr Hart', "That works for us. We'll let you know by the end of the week.", 'Нас это устраивает. Мы сообщим вам о решении до конца недели.')
      ], [
        N("I've been working as a hotel receptionist for four years", 'present-perfect-continuous', 'Работа началась в прошлом и продолжается сейчас: for + период.'),
        N('before that I studied tourism at university', 'past-simple', 'Закончившийся период в прошлом.'),
        N('I used to organise trips for our guests', 'used-to', 'used to — то, что регулярно делали раньше.'),
        N('their room had been given to someone else by mistake', 'past-perfect', 'had been given — номер отдали раньше, чем приехала семья (Past Perfect в пассиве).'),
        N("I've been taking Italian lessons since January", 'present-perfect-continuous', 'since + начальная точка — занятие длится до сих пор.'),
        N('If we offer you the job, when can you start?', 'conditional', 'Реальное условие: if + Present Simple.'),
        N("We'll let you know by the end of the week", 'future-simple', 'Обещание — will.')
      ], [
        ['Tell me a little about yourself', 'расскажите немного о себе'], ['Spanish', 'испанский (язык)'], ['current job', 'нынешняя работа'], ['more responsibility', 'больше ответственности'],
        ['dealt with', 'иметь дело с'], ['by mistake', 'по ошибке'], ['five-star review', 'отзыв на пять звёзд'],
        ["give one month's notice", 'предупредить об уходе за месяц'], ['That works for us', 'нас это устраивает'], ['let you know', 'сообщить вам']
      ], [
        Q('How long has Laura been working as a receptionist?', ['One year', 'Two years', 'Four years', 'Since January'], 2, '«for four years».', 'Сколько лет Лора работает администратором?', ['Год', 'Два года', 'Четыре года', 'С января']),
        Q('Why does Laura want to change jobs?', ['She wants more money', 'She wants more responsibility', "She doesn't like hotels", 'She is moving to Spain'], 1, '«I\'d like more responsibility.»', 'Почему Лора хочет сменить работу?', ['Хочет больше денег', 'Хочет больше ответственности', 'Не любит отели', 'Переезжает в Испанию']),
        Q('What problem did the family have last summer?', ['Their flight was late', 'Their room had been given to someone else', 'They lost their passports', 'The hotel was closed'], 1, '«their room had been given to someone else by mistake».', 'Какая проблема была у семьи прошлым летом?', ['Задержали рейс', 'Их номер отдали другим', 'Они потеряли паспорта', 'Отель был закрыт']),
        Q('How did the family feel in the end?', ['Angry — they wrote a bad review', 'Happy — they left a five-star review', 'They never said anything', 'They asked for their money back'], 1, '«they left us a five-star review».', 'Как в итоге отреагировала семья?', ['Разозлилась и написала плохой отзыв', 'Осталась довольна и оставила отзыв на пять звёзд', 'Ничего не сказала', 'Потребовала деньги назад']),
        Q('Laura speaks Italian perfectly.', TFE, 1, '«Spanish and a bit of Italian.»', 'Лора свободно говорит по-итальянски.'),
        Q('When can Laura probably start?', ['Tomorrow', 'Next week', 'At the beginning of June', 'In January'], 2, '«probably at the beginning of June».', 'Когда Лора, скорее всего, сможет приступить?', ['Завтра', 'На следующей неделе', 'В начале июня', 'В январе']),
        Q('"I used to organise trips" means that Laura…', ['organised trips regularly in the past', 'is organising a trip now', 'will organise trips', 'has never organised trips'], 0, 'used to — регулярное действие в прошлом.', '«I used to organise trips» значит, что Лора…', ['регулярно организовывала поездки раньше', 'сейчас организует поездку', 'будет организовывать поездки', 'никогда не организовывала поездок'])
      ]),

    C('cv-b1-hike', 'B1', 'nature', 'Lost in the Fog', 'Заблудились в тумане',
      'Two friends are hiking in the mountains when the weather suddenly changes.', 'Двое друзей идут по горам, и вдруг портится погода.', [
        L('Ella', "Wait, Tom. I can't see the path any more. This fog came out of nowhere!", 'Подожди, Том. Я больше не вижу тропу. Этот туман появился из ниоткуда!'),
        L('Tom', 'I know. When we left the hut, the sky was completely clear.', 'Знаю. Когда мы выходили из хижины, небо было совершенно ясным.'),
        L('Ella', 'Did you check the weather forecast this morning?', 'Ты смотрел утром прогноз погоды?'),
        L('Tom', 'I did. It said sunny all day. Let me look at the map.', 'Смотрел. Обещали солнце весь день. Дай-ка взгляну на карту.'),
        L('Ella', 'Have you got any signal on your phone?', 'У тебя есть сигнал на телефоне?'),
        L('Tom', "No, nothing. I'd been using the GPS all morning, and now the battery is almost dead.", 'Нет, никакого. Я всё утро пользовался GPS, и теперь батарея почти села.'),
        L('Ella', 'Great. So what are we going to do?', 'Прекрасно. И что будем делать?'),
        L('Tom', "If we follow the stream, we'll get back to the valley. Streams always go down.", 'Если пойдём вдоль ручья, выйдем обратно в долину. Ручьи всегда текут вниз.'),
        L('Ella', "Are you sure? I don't want to walk in circles.", 'Ты уверен? Не хочу ходить кругами.'),
        L('Tom', 'Trust me. My grandfather taught me that when I was a kid. We used to go walking every summer.', 'Поверь мне. Этому меня научил дедушка, когда я был ребёнком. Мы каждое лето ходили в походы.'),
        L('Ella', 'Look! Lights! That must be the village.', 'Смотри! Огни! Это, наверное, деревня.'),
        L('Tom', "I told you! I hope the café is still open. I'm starving.", 'Я же говорил! Надеюсь, кафе ещё открыто. Умираю с голоду.'),
        L('Ella', "Next time, we're taking a proper map and a power bank.", 'В следующий раз берём нормальную карту и пауэрбанк.')
      ], [
        N('When we left the hut, the sky was completely clear', 'past-simple', 'Действие и состояние в прошлом — Past Simple.'),
        N("I'd been using the GPS all morning", 'past-perfect-continuous', 'Процесс длился до момента в прошлом и привёл к результату: батарея села.'),
        N('So what are we going to do?', 'going-to', 'Вопрос о плане действий.'),
        N("If we follow the stream, we'll get back to the valley", 'conditional', 'Реальное условие: if + Present Simple, will в главной части.'),
        N('Streams always go down', 'present-simple', 'Общеизвестный факт — Present Simple.'),
        N('We used to go walking every summer', 'used-to', 'Привычка в прошлом, которой больше нет.'),
        N("we're taking a proper map and a power bank", 'present-continuous', 'Твёрдое решение на будущее, почти договорённость.')
      ], [
        ['any more', 'больше (не)'], ['came out of nowhere', 'появился из ниоткуда'], ['weather forecast', 'прогноз погоды'],
        ['almost dead', 'почти села (о батарее)'], ['walk in circles', 'ходить кругами'], ['Trust me', 'поверь мне'],
        ['go walking', 'ходить в походы'], ["I'm starving", 'умираю с голоду'], ['power bank', 'пауэрбанк, внешний аккумулятор']
      ], [
        Q('What was the weather like when they left the hut?', ['Foggy', 'Rainy', 'Completely clear', 'Snowy'], 2, '«the sky was completely clear».', 'Какая была погода, когда они выходили из хижины?', ['Туман', 'Дождь', 'Совершенно ясно', 'Снег']),
        Q("Why is Tom's battery almost dead?", ['He forgot to charge it', 'He had been using the GPS all morning', 'The phone is very old', 'It fell in the stream'], 1, '«I\'d been using the GPS all morning».', 'Почему у Тома почти села батарея?', ['Забыл зарядить', 'Всё утро пользовался GPS', 'Телефон очень старый', 'Телефон упал в ручей']),
        Q("What is Tom's plan?", ['To wait for help', 'To follow the stream down', 'To call the police', 'To go back to the hut'], 1, '«If we follow the stream, we\'ll get back to the valley.»', 'Какой у Тома план?', ['Ждать помощи', 'Идти вниз вдоль ручья', 'Позвонить в полицию', 'Вернуться в хижину']),
        Q('Who taught Tom about streams?', ['His father', 'A guide', 'His grandfather', 'Ella'], 2, '«My grandfather taught me that».', 'Кто рассказал Тому про ручьи?', ['Отец', 'Гид', 'Дедушка', 'Элла']),
        Q('In the end, Ella sees lights.', TFE, 0, '«Look! Lights! That must be the village.»', 'В конце Элла видит огни.'),
        Q('What will they take next time?', ['A tent and food', 'A proper map and a power bank', 'A dog', 'A new phone'], 1, '«we\'re taking a proper map and a power bank».', 'Что они возьмут в следующий раз?', ['Палатку и еду', 'Нормальную карту и пауэрбанк', 'Собаку', 'Новый телефон']),
        Q('"I\'d been using the GPS all morning" describes…', ['an action that continued up to a moment in the past', 'a future plan', 'a habit now', 'a very short action'], 0, 'Past Perfect Continuous — процесс до момента в прошлом.', '«I\'d been using the GPS all morning» описывает…', ['действие, которое длилось до момента в прошлом', 'план на будущее', 'нынешнюю привычку', 'очень короткое действие'])
      ]),

    C('cv-b1-parcel', 'B1', 'tech', 'The Parcel That Never Came', 'Посылка, которая не пришла',
      "Ben calls an online shop because his order hasn't arrived.", 'Бен звонит в интернет-магазин: его заказ так и не пришёл.', [
        L('Hannah', 'Thank you for calling Techland. My name is Hannah. How can I help you today?', 'Спасибо, что позвонили в Techland. Меня зовут Ханна. Чем могу помочь?'),
        L('Ben', "Hi. I ordered a pair of headphones two weeks ago, and they still haven't arrived.", 'Здравствуйте. Я заказал наушники две недели назад, а они до сих пор не пришли.'),
        L('Hannah', "I'm sorry about that. Can I have your order number, please?", 'Прошу прощения. Назовите, пожалуйста, номер заказа.'),
        L('Ben', "Sure, it's 48152.", 'Конечно: 48152.'),
        L('Hannah', 'Thank you. Let me check… According to our system, your parcel was sent on the third and was delivered yesterday.', 'Спасибо. Сейчас проверю… По нашим данным, посылку отправили третьего числа, а вчера доставили.'),
        L('Ben', 'Delivered? But I was at home all day, and nobody rang the bell.', 'Доставили? Но я весь день был дома, и никто не звонил в дверь.'),
        L('Hannah', 'It says here it was left with your neighbour at number 14.', 'Тут написано, что её оставили у соседа из дома № 14.'),
        L('Ben', 'Number 14? That house has been empty for months. Nobody lives there.', 'Дом 14? Он уже несколько месяцев пустует. Там никто не живёт.'),
        L('Hannah', "That's strange. Then I'm afraid it has probably been stolen.", 'Странно. Тогда, боюсь, её, скорее всего, украли.'),
        L('Ben', 'So what happens now? I paid ninety pounds for those headphones.', 'И что теперь? Я заплатил за эти наушники девяносто фунтов.'),
        L('Hannah', "Don't worry. A new pair will be sent to you today, and you won't be charged again.", 'Не волнуйтесь. Сегодня вам отправят новые, и повторно деньги не спишут.'),
        L('Ben', 'Thank you. Could you ask the driver to give it to me personally this time?', 'Спасибо. Можно в этот раз попросить курьера отдать посылку лично мне?'),
        L('Hannah', "Of course. I've added a note to your order: 'Do not leave with neighbours.'", 'Конечно. Я добавила к заказу пометку: «Соседям не оставлять».')
      ], [
        N("they still haven't arrived", 'present-perfect', 'still + Present Perfect в отрицании: до сих пор не случилось.'),
        N('your parcel was sent on the third and was delivered yesterday', 'passive', 'Пассив в Past Simple: важно, что сделали с посылкой, а не кто.'),
        N('I was at home all day', 'past-simple', 'Состояние в прошедший день.'),
        N('That house has been empty for months', 'present-perfect', 'for + период до сих пор — Present Perfect.'),
        N('it has probably been stolen', 'passive', 'Пассив в Present Perfect: результат важен сейчас.'),
        N('A new pair will be sent to you today', 'passive', 'Пассив в будущем: will be + V3.'),
        N("I've added a note to your order", 'present-perfect', 'Только что сделано, результат виден сейчас.')
      ], [
        ['order number', 'номер заказа'], ['Let me check', 'сейчас проверю'], ['According to our system', 'по нашим данным'],
        ['rang the bell', 'позвонил в дверь'], ['It says here', 'тут написано'], ['what happens now', 'что теперь будет'],
        ["won't be charged again", 'деньги повторно не спишут'], ['Do not leave with neighbours', 'не оставлять у соседей']
      ], [
        Q('What did Ben order?', ['A phone', 'Headphones', 'A laptop', 'A camera'], 1, '«I ordered a pair of headphones».', 'Что заказал Бен?', ['Телефон', 'Наушники', 'Ноутбук', 'Фотоаппарат']),
        Q('When did Ben order it?', ['Yesterday', 'Three days ago', 'Two weeks ago', 'A month ago'], 2, '«two weeks ago».', 'Когда Бен сделал заказ?', ['Вчера', 'Три дня назад', 'Две недели назад', 'Месяц назад']),
        Q('Where was the parcel left, according to the system?', ['At the post office', 'With a neighbour at number 14', "In Ben's garden", 'At the shop'], 1, '«it was left with your neighbour at number 14».', 'Где, по данным системы, оставили посылку?', ['На почте', 'У соседа из дома № 14', 'В саду у Бена', 'В магазине']),
        Q('Why is that strange?', ['Ben has no neighbours', 'The house at number 14 has been empty for months', 'Ben lives at number 14', "The driver is Ben's friend"], 1, '«That house has been empty for months.»', 'Что в этом странного?', ['У Бена нет соседей', 'Дом № 14 уже несколько месяцев пустует', 'Бен сам живёт в доме № 14', 'Курьер — друг Бена']),
        Q('Ben will have to pay again.', TFE, 1, '«you won\'t be charged again».', 'Бену придётся заплатить ещё раз.'),
        Q('What note has Hannah added to the order?', ['Call before delivery', 'Do not leave with neighbours', 'Deliver in the evening', 'Leave at the door'], 1, '«Do not leave with neighbours.»', 'Какую пометку Ханна добавила к заказу?', ['Позвонить перед доставкой', 'Не оставлять у соседей', 'Доставить вечером', 'Оставить у двери']),
        Q('Why is the passive used in "your parcel was sent"?', ['What happened to the parcel matters, not who sent it', 'It is a future plan', 'Ben sent it himself', 'It is a question'], 0, 'Пассив — когда важен предмет, а не исполнитель.', 'Почему во фразе «your parcel was sent» пассив?', ['Важно, что случилось с посылкой, а не кто её отправил', 'Это план на будущее', 'Бен отправил её сам', 'Это вопрос'])
      ]),

    C('cv-b1-volunteer', 'B1', 'society', 'Why I Volunteer', 'Почему я волонтёр',
      'A local radio presenter interviews Joe, who volunteers at an animal shelter.', 'Ведущая местного радио берёт интервью у Джо — волонтёра приюта для животных.', [
        L('Presenter', "Joe, you've been volunteering at the shelter for three years now. How did it all start?", 'Джо, вы уже три года волонтёрите в приюте. С чего всё началось?'),
        L('Joe', "Well, I used to walk past it every day on my way to work. One day I saw a sign that said 'Volunteers needed', so I went in.", 'Ну, я каждый день проходил мимо по дороге на работу. Однажды увидел объявление «Нужны волонтёры» и зашёл.'),
        L('Presenter', 'And what do you actually do there?', 'И чем вы там занимаетесь?'),
        L('Joe', 'All sorts of things. I walk the dogs, clean the cages and help visitors who are thinking of adopting a pet.', 'Всем понемногу. Выгуливаю собак, чищу клетки и помогаю посетителям, которые думают взять питомца.'),
        L('Presenter', 'That sounds like hard work. Do you get paid?', 'Похоже на тяжёлую работу. Вам платят?'),
        L('Joe', 'Not a penny! But I get something better. Last month a dog that had lived at the shelter for two years finally found a home.', 'Ни пенни! Но я получаю кое-что получше. В прошлом месяце собака, которая прожила в приюте два года, наконец нашла дом.'),
        L('Presenter', 'That must have been an emotional day.', 'Наверное, это был очень трогательный день.'),
        L('Joe', 'It was. I walked him every Saturday, so I cried a bit when he left.', 'Ещё бы. Я выгуливал его каждую субботу, так что немного поплакал, когда он уезжал.'),
        L('Presenter', 'What would you say to listeners who are thinking about volunteering?', 'Что бы вы сказали слушателям, которые думают о волонтёрстве?'),
        L('Joe', 'Just try it. If you have a free hour a week, you can make a real difference.', 'Просто попробуйте. Если у вас есть свободный час в неделю, вы можете по-настоящему помочь.'),
        L('Presenter', "And what's next for you?", 'А что у вас дальше?'),
        L('Joe', "We're organising a charity run next month. We're hoping to raise five thousand pounds for a new building.", 'В следующем месяце мы устраиваем благотворительный забег. Надеемся собрать пять тысяч фунтов на новое здание.'),
        L('Presenter', "Good luck! I'm sure lots of our listeners will join you.", 'Удачи! Уверена, многие наши слушатели к вам присоединятся.')
      ], [
        N("you've been volunteering at the shelter for three years now", 'present-perfect-continuous', 'Занятие длится до сих пор: for three years now.'),
        N('I used to walk past it every day', 'used-to', 'Повторявшееся действие в прошлом.'),
        N('a dog that had lived at the shelter for two years finally found a home', 'past-perfect', 'had lived — то, что было до другого события в прошлом (found).'),
        N('If you have a free hour a week, you can make a real difference', 'conditional', 'Реальное условие: if + Present Simple.'),
        N("We're organising a charity run next month", 'present-continuous', 'Запланированное мероприятие — Present Continuous.'),
        N('lots of our listeners will join you', 'future-simple', 'Прогноз после I\'m sure — will.')
      ], [
        ['on my way to work', 'по дороге на работу'], ['Volunteers needed', 'требуются волонтёры'], ['All sorts of things', 'всем понемногу, самое разное'],
        ['adopting a pet', 'взять питомца из приюта'], ['Not a penny!', 'ни пенни!'], ['found a home', 'нашла дом (хозяев)'],
        ['make a real difference', 'по-настоящему помочь, изменить к лучшему'], ['charity run', 'благотворительный забег'], ['raise five thousand pounds', 'собрать пять тысяч фунтов']
      ], [
        Q('How long has Joe been volunteering?', ['One year', 'Two years', 'Three years', 'Five years'], 2, '«for three years now».', 'Сколько Джо уже волонтёрит?', ['Год', 'Два года', 'Три года', 'Пять лет']),
        Q('How did Joe find out about the shelter?', ['A friend told him', 'He saw a sign on his way to work', 'He read about it online', 'He adopted a dog there'], 1, '«One day I saw a sign that said \'Volunteers needed\'».', 'Как Джо узнал о приюте?', ['Рассказал друг', 'Увидел объявление по дороге на работу', 'Прочитал в интернете', 'Взял там собаку']),
        Q('Which of these does Joe NOT mention?', ['Walking the dogs', 'Cleaning the cages', 'Feeding the cats at night', 'Helping visitors'], 2, 'Про кормление кошек ночью он не говорит.', 'О чём из этого Джо НЕ упоминает?', ['Выгуливать собак', 'Чистить клетки', 'Кормить кошек по ночам', 'Помогать посетителям']),
        Q('Joe gets paid for his work.', TFE, 1, '«Not a penny!»', 'Джо платят за его работу.'),
        Q('Why did Joe cry a bit?', ['A dog he walked every Saturday found a home', 'He lost his job', 'The shelter closed', 'He was very tired'], 0, '«I walked him every Saturday, so I cried a bit when he left.»', 'Почему Джо немного поплакал?', ['Собака, которую он выгуливал по субботам, нашла дом', 'Он потерял работу', 'Приют закрылся', 'Он очень устал']),
        Q('What is the charity run for?', ['To buy food', 'To raise money for a new building', 'To pay the volunteers', 'To find new dogs'], 1, '«to raise five thousand pounds for a new building».', 'Для чего проводят благотворительный забег?', ['Купить корм', 'Собрать деньги на новое здание', 'Заплатить волонтёрам', 'Найти новых собак']),
        Q('In "a dog that had lived at the shelter for two years finally found a home", what happened first?', ['living at the shelter', 'finding a home', 'Both at the same time', 'Neither'], 0, 'Past Perfect (had lived) — то, что было раньше.', 'Во фразе «a dog that had lived at the shelter for two years finally found a home» что было раньше?', ['жизнь в приюте', 'обретение дома', 'Оба одновременно', 'Ничего'])
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
        ['I know the feeling', 'мне знакомо это чувство'], ['from scratch', 'с нуля'], ['manage for a while', 'продержаться какое-то время'], ['secondary school', 'средняя школа'], ['good with numbers', 'хорошо обращается с цифрами']
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

    C('cv-b2-burnout', 'B2', 'health', 'Running on Empty', 'Работа на износ',
      'Rachel has finally gone to see a doctor about her constant exhaustion.', 'Рэйчел наконец пришла к врачу из-за постоянной усталости.', [
        L('Dr Patel', 'So, Rachel, how long have you been feeling like this?', 'Итак, Рэйчел, давно вы так себя чувствуете?'),
        L('Rachel', "Months, honestly. I've been working twelve-hour days since the company was taken over, and I can't seem to switch off.", 'Честно говоря, уже несколько месяцев. С тех пор как компанию купили, я работаю по двенадцать часов и никак не могу отключиться.'),
        L('Dr Patel', 'Are you sleeping?', 'Вы спите?'),
        L('Rachel', 'Barely. I lie awake going through my to-do list. Then I wake up at four and check my emails.', 'Почти нет. Лежу без сна и прокручиваю список дел. Потом просыпаюсь в четыре и проверяю почту.'),
        L('Dr Patel', "What you're describing sounds very much like burnout. Have you talked to your manager?", 'То, что вы описываете, очень похоже на выгорание. Вы говорили с руководителем?'),
        L('Rachel', "Not really. Everyone's under pressure. If I complained, they'd probably think I couldn't cope.", 'Не особо. Все под давлением. Если бы я пожаловалась, они бы, наверное, решили, что я не справляюсь.'),
        L('Dr Patel', 'I understand, but your health has to come first. To be honest, you should have come to see me months ago.', 'Понимаю, но здоровье должно быть на первом месте. Честно говоря, вам следовало прийти ко мне ещё несколько месяцев назад.'),
        L('Rachel', 'I know. I kept telling myself it would get better after the next deadline.', 'Знаю. Я всё твердила себе, что после следующего дедлайна станет легче.'),
        L('Dr Patel', "It rarely does. I'm going to sign you off for two weeks, and I'd like you to see a counsellor.", 'Так почти не бывает. Я выпишу вам больничный на две недели и хочу, чтобы вы сходили к психологу.'),
        L('Rachel', "Two weeks? There's a huge presentation on Thursday!", 'Две недели? В четверг огромная презентация!'),
        L('Dr Patel', "Someone else will have to give it. This time next week, you'll be resting, not answering emails at four in the morning.", 'Её придётся провести кому-то другому. Через неделю в это время вы будете отдыхать, а не отвечать на письма в четыре утра.'),
        L('Rachel', "When you put it like that… OK. Maybe it's exactly what I need.", 'Если так посмотреть… Ладно. Может, это именно то, что мне нужно.')
      ], [
        N('how long have you been feeling like this', 'present-perfect-continuous', 'Вопрос о том, сколько длится состояние до настоящего момента.'),
        N('since the company was taken over', 'passive', 'Пассив: компанию купили, а кто именно — неважно.'),
        N("If I complained, they'd probably think I couldn't cope", 'conditional', 'Второй тип: воображаемая ситуация — if + Past Simple, would в главной части.'),
        N('you should have come to see me months ago', 'modal-perfect', 'should have + V3 — упрёк: надо было сделать, но не сделали.'),
        N('I kept telling myself it would get better', 'past-simple', 'kept + -ing — повторялось снова и снова; would здесь — «будущее в прошлом».'),
        N("I'm going to sign you off for two weeks", 'going-to', 'Решение врача, которое он сейчас выполнит.'),
        N("This time next week, you'll be resting", 'future-continuous', 'Процесс, который будет идти в определённый момент в будущем.')
      ], [
        ["can't seem to", 'никак не могу'], ['switch off', 'отключиться, расслабиться'], ['lie awake', 'лежать без сна'], ['to-do list', 'список дел'],
        ['burnout', 'выгорание'], ['under pressure', 'под давлением'], ["couldn't cope", 'не справляюсь'], ['come first', 'быть на первом месте'],
        ['sign you off', 'выписать больничный'], ['counsellor', 'психолог, консультант'], ['When you put it like that', 'если так посмотреть']
      ], [
        Q('When did Rachel start working twelve-hour days?', ['When she got a promotion', 'When her company was taken over', 'When she moved house', 'When she started a second job'], 1, '«since the company was taken over».', 'Когда Рэйчел начала работать по двенадцать часов?', ['Когда её повысили', 'Когда её компанию купили', 'Когда переехала', 'Когда устроилась на вторую работу']),
        Q('What does Rachel do at four in the morning?', ['Goes running', 'Checks her emails', 'Takes medicine', 'Works on her presentation'], 1, '«Then I wake up at four and check my emails.»', 'Что Рэйчел делает в четыре утра?', ['Бегает', 'Проверяет почту', 'Принимает лекарство', 'Готовит презентацию']),
        Q('Rachel has discussed the problem with her manager.', TFE, 1, '«Not really.»', 'Рэйчел обсудила проблему с руководителем.'),
        Q("Why hasn't Rachel complained?", ['Her manager is on holiday', "She's afraid they would think she couldn't cope", 'She enjoys the pressure', "She doesn't have time"], 1, '«If I complained, they\'d probably think I couldn\'t cope.»', 'Почему Рэйчел не жалуется?', ['Руководитель в отпуске', 'Боится, что решат, будто она не справляется', 'Ей нравится давление', 'Нет времени']),
        Q('What does "you should have come to see me months ago" mean?', ['She came months ago', "She didn't come earlier, and that was a mistake", 'She must come again in a few months', 'She will come next month'], 1, 'should have + V3 — упрёк за то, что не сделано в прошлом.', 'Что значит «you should have come to see me months ago»?', ['Она приходила несколько месяцев назад', 'Она не пришла раньше, и это была ошибка', 'Ей нужно прийти снова через несколько месяцев', 'Она придёт в следующем месяце']),
        Q('What does the doctor decide?', ['To give her sleeping pills', 'To sign her off for two weeks and send her to a counsellor', 'To send her to hospital', 'To call her manager'], 1, '«I\'m going to sign you off for two weeks, and I\'d like you to see a counsellor.»', 'Что решает врач?', ['Дать снотворное', 'Выписать больничный на две недели и направить к психологу', 'Положить в больницу', 'Позвонить её руководителю']),
        Q('Who will give the presentation on Thursday?', ['Rachel', 'The doctor', 'Someone else', 'Nobody — it is cancelled'], 2, '«Someone else will have to give it.»', 'Кто проведёт презентацию в четверг?', ['Рэйчел', 'Врач', 'Кто-то другой', 'Никто — её отменят']),
        Q('"This time next week, you\'ll be resting" describes…', ['an action in progress at a future moment', 'a finished action', 'a habit in the past', 'an action happening now'], 0, 'Future Continuous — процесс в момент в будущем.', '«This time next week, you\'ll be resting» описывает…', ['процесс в определённый момент в будущем', 'законченное действие', 'привычку в прошлом', 'то, что происходит сейчас'])
      ]),

    C('cv-b2-renovation', 'B2', 'money', 'The Renovation Nightmare', 'Ремонт-кошмар',
      'Hannah and Greg are discussing their kitchen renovation, which is going badly.', 'Ханна и Грег обсуждают ремонт кухни, который идёт из рук вон плохо.', [
        L('Hannah', "Greg, the builder just called. The new kitchen won't be finished by the end of the month after all.", 'Грег, звонил строитель. Новую кухню к концу месяца всё-таки не закончат.'),
        L('Greg', "You're joking. He promised! What's the excuse this time?", 'Шутишь. Он же обещал! Какое оправдание на этот раз?'),
        L('Hannah', "Apparently, when they took out the old cupboards, they found that the wiring hadn't been replaced since the seventies.", 'Оказывается, когда сняли старые шкафы, обнаружилось, что проводку не меняли с семидесятых.'),
        L('Greg', "Well, that's not his fault, I suppose. Is it dangerous?", 'Ну, это, наверное, не его вина. Это опасно?'),
        L('Hannah', "He says it's a fire risk, so we'll have to get the whole flat rewired before they can go on.", 'Говорит, есть риск пожара, так что придётся поменять проводку во всей квартире, прежде чем они смогут продолжить.'),
        L('Greg', 'How much is that going to cost?', 'И во сколько это обойдётся?'),
        L('Hannah', "About three thousand pounds. And it'll take another two weeks.", 'Около трёх тысяч фунтов. И ещё две недели.'),
        L('Greg', "Three thousand? We'd already gone over budget before this happened.", 'Три тысячи? Мы и до этого уже вышли за рамки бюджета.'),
        L('Hannah', 'I know. We should have asked for a proper survey before we bought the place.', 'Знаю. Надо было заказать нормальную экспертизу перед покупкой.'),
        L('Greg', 'Too late now. Could we take some money out of our holiday savings?', 'Теперь уже поздно. Может, возьмём часть из накоплений на отпуск?'),
        L('Hannah', "We could, but then we won't be going to Portugal this summer.", 'Можно, но тогда этим летом мы не поедем в Португалию.'),
        L('Greg', "Honestly, I'd rather have a safe kitchen than a week on the beach.", 'Честно, я лучше выберу безопасную кухню, чем неделю на пляже.'),
        L('Hannah', "Fair enough. By the time it's all done, we'll have spent more on this kitchen than on our car!", 'Справедливо. Когда всё закончится, окажется, что на эту кухню мы потратили больше, чем на машину!')
      ], [
        N("The new kitchen won't be finished by the end of the month", 'passive', 'Пассив в будущем: won\'t be + V3.'),
        N("the wiring hadn't been replaced since the seventies", 'past-perfect', 'Past Perfect (в пассиве): чего не делали до момента находки.'),
        N("we'll have to get the whole flat rewired", 'passive', 'get something done — сделать что-то руками специалистов (каузативная конструкция).'),
        N("We'd already gone over budget before this happened", 'past-perfect', 'Сначала вышли за бюджет, потом случилась новая беда.'),
        N('We should have asked for a proper survey', 'modal-perfect', 'should have + V3 — сожаление о том, чего не сделали.'),
        N("we won't be going to Portugal this summer", 'future-continuous', 'Future Continuous — будущее как естественный ход событий.'),
        N("we'll have spent more on this kitchen than on our car", 'future-perfect', 'К моменту в будущем действие будет завершено.')
      ], [
        ['after all', 'всё-таки, в итоге'], ["You're joking", 'шутишь'], ['Apparently', 'судя по всему, оказывается'], ['wiring', 'электропроводка'],
        ['fire risk', 'риск пожара'], ['rewired', 'с заменой проводки (rewire — поменять проводку)'], ['go on', 'продолжить'], ['gone over budget', 'вышли за рамки бюджета'], ['proper survey', 'полноценная экспертиза дома перед покупкой'],
        ['Too late now', 'теперь уже поздно'], ['holiday savings', 'накопления на отпуск'], ['Fair enough', 'справедливо, ладно']
      ], [
        Q("Why won't the kitchen be finished on time?", ['The builder is ill', 'The old wiring has to be replaced', 'They ran out of tiles', 'The neighbours complained'], 1, 'Нашли старую проводку, её нужно менять.', 'Почему кухню не закончат вовремя?', ['Строитель заболел', 'Нужно менять старую проводку', 'Закончилась плитка', 'Пожаловались соседи']),
        Q('How old is the wiring?', ['It is from the seventies', 'Two years old', 'Brand new', 'Ten years old'], 0, '«hadn\'t been replaced since the seventies».', 'Сколько лет проводке?', ['Она с семидесятых', 'Два года', 'Совсем новая', 'Десять лет']),
        Q('How much will the extra work cost?', ['Three hundred pounds', 'About three thousand pounds', 'Thirty thousand pounds', 'Nothing'], 1, '«About three thousand pounds.»', 'Сколько будут стоить дополнительные работы?', ['Триста фунтов', 'Около трёх тысяч фунтов', 'Тридцать тысяч фунтов', 'Нисколько']),
        Q('They were within budget before the wiring problem.', TFE, 1, '«We\'d already gone over budget before this happened.»', 'До проблемы с проводкой они укладывались в бюджет.'),
        Q('What does Hannah regret?', ['Buying a new car', 'Not asking for a proper survey before buying the flat', 'Hiring this builder', 'Choosing a small kitchen'], 1, '«We should have asked for a proper survey».', 'О чём жалеет Ханна?', ['О покупке новой машины', 'Что не заказали экспертизу перед покупкой квартиры', 'Что наняли этого строителя', 'Что выбрали маленькую кухню']),
        Q('What might they give up to pay for the work?', ['Their car', 'A holiday in Portugal', 'Their wedding', 'A new sofa'], 1, '«then we won\'t be going to Portugal this summer».', 'От чего им, возможно, придётся отказаться ради ремонта?', ['От машины', 'От отпуска в Португалии', 'От свадьбы', 'От нового дивана']),
        Q('"We\'ll have to get the whole flat rewired" means…', ['they will do the wiring themselves', 'professionals will do the wiring for them', 'the wiring is already done', "they won't change the wiring"], 1, 'get + объект + V3 — работу сделает кто-то другой.', '«We\'ll have to get the whole flat rewired» значит…', ['они сами поменяют проводку', 'проводку им поменяют специалисты', 'проводка уже готова', 'проводку менять не будут']),
        Q('In "By the time it\'s all done, we\'ll have spent more…", the spending will be…', ['completed before a moment in the future', 'happening right now', 'finished long ago', 'only a possibility'], 0, 'Future Perfect — завершится к моменту в будущем.', 'Во фразе «By the time it\'s all done, we\'ll have spent more…» траты будут…', ['завершены к моменту в будущем', 'происходить прямо сейчас', 'закончены давно', 'лишь возможностью'])
      ]),

    C('cv-b2-exchange', 'B2', 'education', 'A Year Abroad', 'Год за границей',
      'Marta has just come back from a year in Canada and meets her old teacher.', 'Марта только что вернулась после года в Канаде и встречает своего бывшего учителя.', [
        L('Mr Evans', 'Marta! Welcome back! How was Canada?', 'Марта! С возвращением! Как Канада?'),
        L('Marta', 'Life-changing, honestly. I wish I could have stayed longer.', 'Честно — изменила мою жизнь. Жаль, что нельзя было остаться подольше.'),
        L('Mr Evans', 'What did you find hardest at first?', 'Что поначалу было труднее всего?'),
        L('Marta', "The language, definitely. I'd been studying English for eight years, but I still couldn't follow what people said in shops.", 'Язык, однозначно. Я учила английский восемь лет, но всё равно не понимала, что говорят в магазинах.'),
        L('Mr Evans', "That's very common. Textbook English and real English are two different worlds.", 'Это обычное дело. Английский из учебника и живой английский — два разных мира.'),
        L('Marta', 'Exactly. But my host family were amazing. Every evening my host dad would ask me about my day and correct my mistakes.', 'Именно. Но принимающая семья была чудесной. Каждый вечер хозяин дома расспрашивал меня, как прошёл день, и исправлял мои ошибки.'),
        L('Mr Evans', 'And how was school there compared to here?', 'А как там в школе по сравнению с нашей?'),
        L('Marta', 'Much more practical. We were expected to give presentations and work in teams. Here we used to just copy notes from the board.', 'Гораздо практичнее. От нас ждали презентаций и работы в командах. А здесь мы раньше просто переписывали с доски.'),
        L('Mr Evans', "Hey, that's not entirely fair! Though I admit we could do more group work.", 'Эй, это не совсем справедливо! Хотя признаю, групповой работы могло бы быть больше.'),
        L('Marta', "Sorry! I didn't mean your lessons, of course.", 'Простите! Я, конечно, не о ваших уроках.'),
        L('Mr Evans', "Ha, I'll forgive you. So, what are your plans now?", 'Ха, прощаю. Ну и какие теперь планы?'),
        L('Marta', "I'm applying to universities in Canada. If I get a place, I'll be leaving next September.", 'Подаю документы в канадские университеты. Если поступлю, уеду в сентябре следующего года.'),
        L('Mr Evans', "I'm not surprised. I'll write you a reference if you like.", 'Не удивлён. Если хочешь, напишу тебе рекомендацию.')
      ], [
        N('I wish I could have stayed longer', 'unreal-past', 'wish + could have + V3 — сожаление о прошлом, которое уже не изменить.'),
        N("I'd been studying English for eight years", 'past-perfect-continuous', 'Процесс длился до определённого момента в прошлом — до поездки.'),
        N('my host dad would ask me about my day', 'used-to', 'would — повторявшееся действие в прошлом (как used to).'),
        N('We were expected to give presentations', 'passive', 'be expected to — «от нас ожидали».'),
        N('Here we used to just copy notes from the board', 'used-to', 'used to — прошлая привычка, которой больше нет.'),
        N("I'm applying to universities in Canada", 'present-continuous', 'Процесс, который идёт в этот период.'),
        N("If I get a place, I'll be leaving next September", 'conditional', 'Реальное условие; Future Continuous — запланированное событие.')
      ], [
        ['Welcome back!', 'с возвращением!'], ['Life-changing', 'изменивший жизнь'], ["couldn't follow", 'не успевала понять'],
        ['host family', 'принимающая семья'], ['host dad', 'хозяин принимающей семьи'], ['compared to here', 'по сравнению со здешней'],
        ['copy notes from the board', 'переписывать с доски'], ['not entirely fair', 'не совсем справедливо'], ["I didn't mean", 'я не имела в виду'],
        ['get a place', 'поступить (получить место)'], ['write you a reference', 'написать тебе рекомендацию']
      ], [
        Q('How does Marta describe her year in Canada?', ['Boring', 'Life-changing', 'Too short to remember', 'Difficult and sad'], 1, '«Life-changing, honestly.»', 'Как Марта описывает свой год в Канаде?', ['Скучным', 'Изменившим жизнь', 'Слишком коротким, чтобы запомнить', 'Трудным и грустным']),
        Q('What was hardest for Marta at first?', ['The food', 'The weather', 'Understanding real spoken English', 'Making friends'], 2, '«I still couldn\'t follow what people said in shops.»', 'Что поначалу было труднее всего для Марты?', ['Еда', 'Погода', 'Понимать живую речь', 'Заводить друзей']),
        Q('How long had Marta been studying English before the trip?', ['Two years', 'Five years', 'Eight years', 'Ten years'], 2, '«for eight years».', 'Сколько Марта учила английский до поездки?', ['Два года', 'Пять лет', 'Восемь лет', 'Десять лет']),
        Q('What did her host dad do every evening?', ['Cooked dinner', 'Asked about her day and corrected her mistakes', 'Helped with homework', 'Took her to the cinema'], 1, '«would ask me about my day and correct my mistakes».', 'Что каждый вечер делал хозяин семьи?', ['Готовил ужин', 'Расспрашивал о её дне и исправлял ошибки', 'Помогал с домашним заданием', 'Водил её в кино']),
        Q('Marta thinks school in Canada was more practical.', TFE, 0, '«Much more practical.»', 'Марта считает, что школа в Канаде практичнее.'),
        Q('What will happen if Marta gets a place at a Canadian university?', ['She will stay at home', 'She will leave next September', 'She will become a teacher', 'She will work with Mr Evans'], 1, '«If I get a place, I\'ll be leaving next September.»', 'Что будет, если Марта поступит в канадский университет?', ['Останется дома', 'Уедет в сентябре следующего года', 'Станет учителем', 'Будет работать с мистером Эвансом']),
        Q('"I wish I could have stayed longer" means that Marta…', ['stayed longer', "didn't stay longer and regrets it", 'will stay longer', "doesn't want to go back"], 1, 'wish + could have + V3 — сожаление о прошлом.', '«I wish I could have stayed longer» значит, что Марта…', ['осталась подольше', 'не осталась подольше и жалеет об этом', 'останется подольше', 'не хочет возвращаться'])
      ]),

    C('cv-b2-lab', 'B2', 'science', 'The Unexpected Result', 'Неожиданный результат',
      'Two scientists discuss a strange result in their lab late at night.', 'Двое учёных поздно вечером обсуждают в лаборатории странный результат.', [
        L('Felix', "Ines, have you got a minute? I've just run the test again, and the numbers still don't make sense.", 'Инес, есть минутка? Я только что снова прогнал тест, и цифры по-прежнему не сходятся.'),
        L('Ines', "Show me. Hmm… The cells should have died after forty-eight hours, but they're still growing.", 'Покажи. Хм… Клетки должны были погибнуть через сорок восемь часов, а они всё ещё растут.'),
        L('Felix', "Exactly. I've been checking everything since this morning: the temperature, the samples, the equipment.", 'Именно. Я с утра всё проверяю: температуру, образцы, оборудование.'),
        L('Ines', 'Could the samples have been contaminated?', 'Может, образцы были загрязнены?'),
        L('Felix', 'I thought so at first, but they were prepared by two different people in two different labs.', 'Я сначала так и подумал, но их готовили два разных человека в двух разных лабораториях.'),
        L('Ines', "Then either we've made the same mistake twice, or we've found something genuinely new.", 'Тогда либо мы дважды совершили одну и ту же ошибку, либо нашли что-то действительно новое.'),
        L('Felix', "If it's real, it could change the way the drug is tested.", 'Если это правда, это может изменить то, как испытывают препарат.'),
        L('Ines', "Let's not get carried away. Before we tell anyone, the experiment has to be repeated by an independent team.", 'Давай не будем увлекаться. Прежде чем кому-то говорить, эксперимент должна повторить независимая команда.'),
        L('Felix', 'Agreed. Remember the professor who announced a breakthrough last year? It turned out his data had been copied wrong.', 'Согласен. Помнишь профессора, который в прошлом году объявил о прорыве? Оказалось, что его данные неправильно скопировали.'),
        L('Ines', "Exactly. I don't want us to end up like him. I'll email the team in Oslo tomorrow.", 'Вот именно. Не хочу, чтобы мы закончили как он. Завтра напишу команде в Осло.'),
        L('Felix', 'And if they get the same result?', 'А если у них получится то же самое?'),
        L('Ines', "Then we'll be writing the most important paper of our careers. Now go home, Felix. You've been here since seven.", 'Тогда мы будем писать самую важную статью в нашей карьере. А теперь иди домой, Феликс. Ты здесь с семи утра.')
      ], [
        N("I've just run the test again", 'present-perfect', 'just — только что, результат перед глазами.'),
        N('The cells should have died after forty-eight hours', 'modal-perfect', 'should have + V3 — так ожидалось, но не произошло.'),
        N("I've been checking everything since this morning", 'present-perfect-continuous', 'Процесс идёт с утра до сих пор.'),
        N('Could the samples have been contaminated?', 'modal-perfect', 'could have been + V3 — предположение о прошлом (в пассиве).'),
        N('they were prepared by two different people', 'passive', 'Пассив с by — указываем, кем сделано.'),
        N('the experiment has to be repeated by an independent team', 'passive', 'Пассив после модального глагола: has to be + V3.'),
        N('his data had been copied wrong', 'past-perfect', 'Past Perfect: ошибка случилась раньше, чем профессор объявил о прорыве.'),
        N("Then we'll be writing the most important paper of our careers", 'future-continuous', 'Процесс, который будет идти в будущем.')
      ], [
        ['have you got a minute?', 'есть минутка?'], ["don't make sense", 'не имеют смысла, не сходятся'], ['contaminated', 'загрязнены'],
        ['genuinely new', 'действительно новое'], ['get carried away', 'увлекаться, терять голову'], ['breakthrough', 'прорыв'],
        ['It turned out', 'оказалось'], ['end up like him', 'закончить как он'], ['the most important paper', 'самая важная научная статья']
      ], [
        Q('What is strange about the cells?', ['They died too early', 'They are still growing when they should have died', 'They changed colour', 'They disappeared'], 1, '«The cells should have died after forty-eight hours, but they\'re still growing.»', 'Что странного в клетках?', ['Погибли слишком рано', 'Всё ещё растут, хотя должны были погибнуть', 'Изменили цвет', 'Исчезли']),
        Q('How long has Felix been checking everything?', ['Since yesterday', 'Since this morning', 'For a week', 'For an hour'], 1, '«since this morning».', 'Сколько Феликс уже всё проверяет?', ['Со вчерашнего дня', 'С утра', 'Неделю', 'Час']),
        Q('Why does Felix doubt that the samples were contaminated?', ['They were brand new', 'They were prepared by two different people in two different labs', 'Ines prepared them', 'They came from Oslo'], 1, '«they were prepared by two different people in two different labs».', 'Почему Феликс сомневается, что образцы были загрязнены?', ['Они были совсем новые', 'Их готовили два разных человека в двух лабораториях', 'Их готовила Инес', 'Их привезли из Осло']),
        Q('Ines wants to announce the result immediately.', TFE, 1, '«Before we tell anyone, the experiment has to be repeated».', 'Инес хочет немедленно объявить о результате.'),
        Q('What happened to the professor last year?', ['He won a prize', 'His data had been copied wrong', 'He moved to Oslo', 'He repeated the experiment'], 1, '«It turned out his data had been copied wrong.»', 'Что случилось с профессором в прошлом году?', ['Получил премию', 'Его данные неправильно скопировали', 'Переехал в Осло', 'Повторил эксперимент']),
        Q('What will Ines do tomorrow?', ['Write a paper', 'Email the team in Oslo', 'Call the professor', 'Repeat the test herself'], 1, '«I\'ll email the team in Oslo tomorrow.»', 'Что Инес сделает завтра?', ['Напишет статью', 'Напишет команде в Осло', 'Позвонит профессору', 'Сама повторит тест']),
        Q('"Could the samples have been contaminated?" is…', ['a guess about the past', 'a plan for the future', 'an order', 'a fact about the present'], 0, 'could have been + V3 — предположение о прошлом.', '«Could the samples have been contaminated?» — это…', ['предположение о прошлом', 'план на будущее', 'приказ', 'факт о настоящем'])
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
      ]),

    C('cv-c1-whistle', 'C1', 'society', 'The Whistleblower', 'Информатор',
      'A journalist meets a former employee of a chemical company in a quiet café.', 'Журналистка встречается в тихом кафе с бывшим сотрудником химической компании.', [
        L('Harper', "Thank you for agreeing to meet. I realise this can't have been an easy decision.", 'Спасибо, что согласились встретиться. Понимаю, что решение далось нелегко.'),
        L('Daniel', "It wasn't. I've been going back and forth for weeks. Had my daughter not asked me what I actually did at work, I might never have called you.", 'Да уж. Я несколько недель колебался. Если бы дочь не спросила, чем я на самом деле занимаюсь на работе, я бы, может, так и не позвонил.'),
        L('Harper', 'What exactly did you find?', 'Что именно вы обнаружили?'),
        L('Daniel', 'Test results showing that waste from the plant had been leaking into the river for at least three years. The reports were signed off by senior management and then quietly buried.', 'Результаты анализов: отходы завода попадали в реку как минимум три года. Отчёты подписало высшее руководство, а потом их тихо похоронили.'),
        L('Harper', 'Are you saying they knew?', 'Хотите сказать, они знали?'),
        L('Daniel', 'They must have known. Not only did they ignore the results, but they also commissioned a second study that conveniently found nothing.', 'Не могли не знать. Они не только проигнорировали результаты, но и заказали второе исследование, которое очень удобно ничего не нашло.'),
        L('Harper', 'Do you have documents to back this up?', 'У вас есть документы, чтобы это подтвердить?'),
        L('Daniel', "Copies of everything. I'd rather they weren't published in full, though. Some of the names belong to junior staff who had no idea.", 'Копии всего. Правда, я бы предпочёл, чтобы их не публиковали целиком. Там есть имена рядовых сотрудников, которые ничего не знали.'),
        L('Harper', "Understood. We'll redact anything that could identify them. What about your own position?", 'Понятно. Мы вымараем всё, по чему их можно опознать. А как насчёт вашего положения?'),
        L('Daniel', "I'll be fired, obviously, and they'll probably sue. But I'd rather lose my job than spend the rest of my life wondering whether I could have stopped it.", 'Меня, разумеется, уволят и, вероятно, подадут в суд. Но я лучше потеряю работу, чем буду всю жизнь думать, мог ли я это остановить.'),
        L('Harper', 'If this is as serious as it sounds, by the end of the month the story will have reached every newspaper in the country.', 'Если всё так серьёзно, как кажется, к концу месяца эта история попадёт во все газеты страны.'),
        L('Daniel', "That's what I'm counting on. People who live downstream deserve to know what's in their water.", 'На это я и рассчитываю. Люди, живущие ниже по течению, имеют право знать, что у них в воде.')
      ], [
        N("this can't have been an easy decision", 'modal-perfect', "can't have + V3 — уверенность, что в прошлом что-то было невозможно."),
        N("I've been going back and forth for weeks", 'present-perfect-continuous', 'Колебания длились неделями и только что закончились.'),
        N('Had my daughter not asked me what I actually did at work, I might never have called you', 'inversion', "Had … not = If … hadn't: условие третьего типа с инверсией."),
        N('waste from the plant had been leaking into the river for at least three years', 'past-perfect-continuous', 'Процесс длился до момента в прошлом — до того, как нашли результаты.'),
        N('The reports were signed off by senior management', 'passive', 'Пассив: в центре внимания отчёты.'),
        N('They must have known', 'modal-perfect', 'must have + V3 — уверенный вывод о прошлом.'),
        N('Not only did they ignore the results', 'inversion', 'Not only + вспомогательный глагол + подлежащее — эмфатическая инверсия.'),
        N("I'd rather they weren't published in full", 'unreal-past', 'would rather + подлежащее + Past — пожелание о действиях других.'),
        N('the story will have reached every newspaper in the country', 'future-perfect', 'К моменту в будущем действие будет завершено.')
      ], [
        ['going back and forth', 'колебаться, метаться'], ['signed off', 'утвердили, подписали'], ['quietly buried', 'тихо замяли'],
        ['commissioned a second study', 'заказали второе исследование'], ['conveniently', 'очень кстати, как по заказу'], ['back this up', 'подтвердить это'],
        ['in full', 'целиком'], ['junior staff', 'рядовые сотрудники'], ['redact', 'вымарать (закрыть в документе)'], ['sue', 'подать в суд'],
        ['counting on', 'рассчитывать на'], ['downstream', 'ниже по течению']
      ], [
        Q('What finally made Daniel call the journalist?', ['He was fired', 'His daughter asked what he did at work', 'He read an article', 'A colleague told him to'], 1, '«Had my daughter not asked me what I actually did at work…»', 'Что в итоге заставило Дэниела позвонить журналистке?', ['Его уволили', 'Дочь спросила, чем он занимается на работе', 'Он прочитал статью', 'Так посоветовал коллега']),
        Q('What did the test results show?', ['The plant was losing money', 'Waste had been leaking into the river for at least three years', 'The river was clean', 'Workers were ill'], 1, '«waste from the plant had been leaking into the river for at least three years».', 'Что показали результаты анализов?', ['Завод терял деньги', 'Отходы как минимум три года попадали в реку', 'Река чистая', 'Рабочие болели']),
        Q('How did management react to the first results?', ['They stopped production', 'They ignored them and ordered a second study', 'They called the police', 'They told the public'], 1, '«Not only did they ignore the results, but they also commissioned a second study».', 'Как руководство отреагировало на первые результаты?', ['Остановило производство', 'Проигнорировало их и заказало второе исследование', 'Вызвало полицию', 'Сообщило общественности']),
        Q('Daniel wants all the documents to be published in full.', TFE, 1, '«I\'d rather they weren\'t published in full».', 'Дэниел хочет, чтобы все документы опубликовали целиком.'),
        Q('Why is Daniel worried about the names in the documents?', ['They are his friends', 'Some belong to junior staff who knew nothing', 'The names are fake', 'He is not allowed to show them'], 1, '«Some of the names belong to junior staff who had no idea.»', 'Почему Дэниел беспокоится об именах в документах?', ['Это его друзья', 'Среди них рядовые сотрудники, которые ничего не знали', 'Имена вымышленные', 'Ему нельзя их показывать']),
        Q('What does Daniel expect to happen to him?', ['A promotion', 'He will be fired and probably sued', 'Nothing at all', 'He will move abroad'], 1, '«I\'ll be fired, obviously, and they\'ll probably sue.»', 'Чего Дэниел ждёт для себя?', ['Повышения', 'Его уволят и, вероятно, подадут в суд', 'Ничего', 'Он уедет за границу']),
        Q('"Not only did they ignore the results…" uses inversion to…', ['emphasise the statement', 'ask a question', 'talk about the future', 'sound more polite'], 0, 'Инверсия после Not only усиливает высказывание.', '«Not only did they ignore the results…» — инверсия здесь нужна, чтобы…', ['усилить высказывание', 'задать вопрос', 'говорить о будущем', 'звучать вежливее']),
        Q('"They must have known" expresses…', ['a confident conclusion about the past', 'an obligation', 'a future plan', 'a doubt about the present'], 0, 'must have + V3 — уверенный вывод о прошлом.', '«They must have known» выражает…', ['уверенный вывод о прошлом', 'обязанность', 'план на будущее', 'сомнение в настоящем'])
      ]),

    C('cv-c1-memory', 'C1', 'science', 'Can You Trust Your Memory?', 'Можно ли верить памяти?',
      'A podcast host talks to a psychologist who studies false memories.', 'Ведущий подкаста беседует с психологом, которая изучает ложные воспоминания.', [
        L('Adam', "Dr Ruiz, you've spent twenty years studying memory. What's the biggest misconception people have?", 'Доктор Руис, вы двадцать лет изучаете память. Какое самое распространённое заблуждение?'),
        L('Dr Ruiz', "That memory works like a video camera. It doesn't. Every time we recall an event, we're essentially rebuilding it, and details get changed along the way.", 'Что память работает как видеокамера. Это не так. Каждый раз, вспоминая событие, мы по сути собираем его заново, и по ходу детали меняются.'),
        L('Adam', 'So how reliable are our memories?', 'Так насколько можно доверять нашим воспоминаниям?'),
        L('Dr Ruiz', "Far less than we'd like to think. In one study, participants were shown fake photos of themselves on a hot-air balloon ride. Within a few weeks, half of them were describing a trip that had never taken place.", 'Гораздо меньше, чем хотелось бы. В одном исследовании участникам показывали поддельные фото, где они летят на воздушном шаре. Через несколько недель половина из них описывала полёт, которого никогда не было.'),
        L('Adam', "That's unsettling. Were they lying?", 'Это тревожно. Они лгали?'),
        L('Dr Ruiz', "Not at all. They genuinely believed it. Had you interviewed them, you'd have been convinced too. They added details nobody had given them.", 'Вовсе нет. Они искренне в это верили. Если бы вы с ними поговорили, тоже бы поверили. Они добавляли детали, которых им никто не сообщал.'),
        L('Adam', 'Which raises a worrying question about eyewitnesses in court.', 'Что поднимает тревожный вопрос о свидетелях в суде.'),
        L('Dr Ruiz', 'Exactly. Hundreds of people have been convicted largely on the basis of eyewitness testimony, only to be cleared years later by DNA evidence.', 'Именно. Сотни людей осудили в основном на основании показаний очевидцев, а через годы оправдали благодаря анализу ДНК.'),
        L('Adam', 'Should courts stop relying on witnesses, then?', 'Значит, судам стоит перестать полагаться на свидетелей?'),
        L('Dr Ruiz', "Not entirely, but the way they're questioned matters enormously. A single leading question can plant a detail that wasn't there.", 'Не полностью, но огромное значение имеет то, как их допрашивают. Один наводящий вопрос может внедрить в память деталь, которой не было.'),
        L('Adam', 'I have to ask: do you trust your own memories?', 'Не могу не спросить: а вы доверяете собственным воспоминаниям?'),
        L('Dr Ruiz', "Less and less. I'd rather my childhood memories were accurate, but I know some of them must have been shaped by family stories.", 'Всё меньше. Мне бы хотелось, чтобы мои детские воспоминания были точными, но я знаю, что некоторые из них наверняка сложились из семейных рассказов.'),
        L('Adam', 'By the time this episode airs, half our listeners will have started doubting their childhoods!', 'К выходу этого выпуска половина наших слушателей начнёт сомневаться в собственном детстве!')
      ], [
        N("you've spent twenty years studying memory", 'present-perfect', 'Итог за период до настоящего момента.'),
        N('details get changed along the way', 'passive', 'get + V3 — разговорный пассив: детали меняются как бы сами собой.'),
        N('participants were shown fake photos of themselves', 'passive', 'Пассив с двумя дополнениями: were shown + что.'),
        N('half of them were describing a trip that had never taken place', 'past-perfect', 'had never taken place — события не было ни до, ни во время их рассказов.'),
        N("Had you interviewed them, you'd have been convinced too", 'inversion', 'Had you + V3 = If you had + V3: третий тип условия с инверсией.'),
        N('Hundreds of people have been convicted', 'passive', 'Пассив в Present Perfect.'),
        N("I'd rather my childhood memories were accurate", 'unreal-past', 'would rather + подлежащее + Past — желание, которое расходится с реальностью.'),
        N('some of them must have been shaped by family stories', 'modal-perfect', 'must have been + V3 — уверенный вывод о прошлом (в пассиве).'),
        N('half our listeners will have started doubting their childhoods', 'future-perfect', 'Будет сделано к моменту в будущем.')
      ], [
        ['misconception', 'заблуждение'], ['along the way', 'по ходу дела'], ['hot-air balloon ride', 'полёт на воздушном шаре'],
        ['unsettling', 'тревожный, выбивающий из колеи'], ['eyewitnesses', 'очевидцы'], ['on the basis of', 'на основании'],
        ['eyewitness testimony', 'показания очевидцев'], ['cleared', 'оправданы'], ['DNA evidence', 'доказательства по ДНК'],
        ['leading question', 'наводящий вопрос'], ['airs', 'выходит в эфир']
      ], [
        Q('What is the biggest misconception about memory, according to Dr Ruiz?', ['That we forget everything', 'That memory works like a video camera', 'That children remember more', 'That memory improves with age'], 1, '«That memory works like a video camera.»', 'Какое главное заблуждение о памяти, по словам доктора Руис?', ['Что мы всё забываем', 'Что память работает как видеокамера', 'Что дети помнят больше', 'Что с возрастом память улучшается']),
        Q('What happened in the balloon study?', ['Participants went on a real balloon ride', 'Half of them described a trip that never happened', 'Nobody believed the photos', 'The photos were real'], 1, '«half of them were describing a trip that had never taken place».', 'Что произошло в исследовании с воздушным шаром?', ['Участники по-настоящему полетали на шаре', 'Половина описывала полёт, которого не было', 'Никто не поверил фото', 'Фото были настоящими']),
        Q('The participants were lying.', TFE, 1, '«Not at all. They genuinely believed it.»', 'Участники лгали.'),
        Q('Why are eyewitnesses a problem in court?', ['They are usually paid', 'Their memories can be wrong, and innocent people have been convicted', 'They never come to court', 'They speak too fast'], 1, 'Людей осуждали по показаниям очевидцев, а потом оправдывали по ДНК.', 'Почему показания очевидцев — проблема для суда?', ['Им обычно платят', 'Их память может ошибаться, и невиновных осуждали', 'Они не приходят в суд', 'Они слишком быстро говорят']),
        Q('What can a leading question do?', ['Help the witness relax', "Plant a detail that wasn't there", 'Make the trial shorter', 'Prove someone is guilty'], 1, '«A single leading question can plant a detail that wasn\'t there.»', 'Что может сделать наводящий вопрос?', ['Помочь свидетелю расслабиться', 'Внедрить деталь, которой не было', 'Сократить процесс', 'Доказать чью-то вину']),
        Q('Does Dr Ruiz fully trust her own childhood memories?', ['Yes, completely', 'No, some may have been shaped by family stories', 'She has no childhood memories', 'Only the happy ones'], 1, '«some of them must have been shaped by family stories».', 'Доверяет ли доктор Руис своим детским воспоминаниям?', ['Да, полностью', 'Нет, некоторые могли сложиться из семейных рассказов', 'У неё нет детских воспоминаний', 'Только счастливым']),
        Q('"Had you interviewed them, you\'d have been convinced too" means…', ['you interviewed them and were convinced', "you didn't interview them, but if you had, you would have believed them", 'you will interview them', 'you were never convinced by anything'], 1, 'Инверсия Had you + V3 — нереальное условие в прошлом.', '«Had you interviewed them, you\'d have been convinced too» значит…', ['вы с ними поговорили и поверили', 'вы с ними не говорили, но если бы поговорили, то поверили бы', 'вы с ними поговорите', 'вас ничто никогда не убеждало'])
      ]),

    C('cv-c1-mentor', 'C1', 'work', 'Advice From a Mentor', 'Совет наставника',
      'A young lawyer asks her former mentor whether she should leave a well-paid job to start her own firm.', 'Молодой юрист спрашивает бывшего наставника, стоит ли уходить с хорошо оплачиваемой работы ради собственной фирмы.', [
        L('Nora', "Victor, I need your honest opinion. I've been offered a partnership, but I'm seriously thinking of turning it down to start my own firm.", 'Виктор, мне нужно ваше честное мнение. Мне предложили партнёрство, но я всерьёз думаю отказаться и открыть свою фирму.'),
        L('Victor', "Well, that's quite a dilemma. How long have you been mulling this over?", 'Да, непростая дилемма. Давно вы это обдумываете?'),
        L('Nora', "Months. By next spring I'll have been at the company for ten years, and part of me feels it's now or never.", 'Несколько месяцев. К следующей весне я проработаю в компании десять лет, и часть меня чувствует: сейчас или никогда.'),
        L('Victor', 'And the other part?', 'А другая часть?'),
        L('Nora', 'Terrified. Seldom have I felt so unsure about anything. What if I fail and end up with nothing?', 'В ужасе. Я редко бывала в чём-то так не уверена. Что, если я провалюсь и останусь ни с чем?'),
        L('Victor', 'Let me tell you something I rarely admit. Twenty years ago I was in exactly your position, and I took the safe option.', 'Расскажу вам то, в чём я редко признаюсь. Двадцать лет назад я был точно в таком же положении — и выбрал надёжный вариант.'),
        L('Nora', 'Do you regret it?', 'Вы жалеете?'),
        L('Victor', "Some days. I wish I'd at least tried. I'd have learnt more from failing than I did from twenty comfortable years.", 'Иногда. Жаль, что я хотя бы не попробовал. Провал научил бы меня большему, чем двадцать спокойных лет.'),
        L('Nora', "But you've had a brilliant career!", 'Но у вас блестящая карьера!'),
        L('Victor', "Brilliant on paper. Had I been braver, it might have been more interesting. That said, I'd rather you didn't decide based on my regrets.", 'Блестящая на бумаге. Будь я смелее, она могла бы оказаться интереснее. При этом я бы не хотел, чтобы вы решали, глядя на мои сожаления.'),
        L('Nora', 'So what would you advise?', 'Так что вы посоветуете?'),
        L('Victor', "Work out how long you could survive without an income. If the answer is a year or more, go for it. Clients who've worked with you for a decade won't simply vanish.", 'Посчитайте, сколько вы продержитесь без дохода. Если год или больше — дерзайте. Клиенты, которые работают с вами десять лет, просто так не исчезнут.'),
        L('Nora', 'That sounds more practical than I expected.', 'Это звучит практичнее, чем я ожидала.'),
        L('Victor', 'Romance is for novels. Running a firm is about cash flow.', 'Романтика — для романов. Управлять фирмой — значит следить за денежным потоком.')
      ], [
        N("I've been offered a partnership", 'passive', 'Пассив в Present Perfect: предложение получено и актуально сейчас.'),
        N('How long have you been mulling this over?', 'present-perfect-continuous', 'Сколько длится процесс до настоящего момента.'),
        N("By next spring I'll have been at the company for ten years", 'future-perfect', 'К моменту в будущем наберётся определённый срок.'),
        N('Seldom have I felt so unsure about anything', 'inversion', 'Seldom в начале → инверсия (have I): звучит эмоционально и книжно.'),
        N('Twenty years ago I was in exactly your position', 'past-simple', 'Время названо — Past Simple.'),
        N("I wish I'd at least tried", 'unreal-past', 'wish + Past Perfect — сожаление о прошлом.'),
        N("I'd have learnt more from failing", 'conditional', 'Третий тип без if: воображаемый результат в прошлом.'),
        N('Had I been braver, it might have been more interesting', 'inversion', 'Had I been = If I had been.'),
        N("I'd rather you didn't decide based on my regrets", 'unreal-past', 'would rather + you + Past — просьба поступить иначе.')
      ], [
        ['turning it down', 'отказаться'], ['quite a dilemma', 'непростая дилемма'], ['mulling this over', 'обдумывать'], ["it's now or never", 'сейчас или никогда'],
        ['end up with nothing', 'остаться ни с чем'], ['the safe option', 'надёжный вариант'], ['on paper', 'на бумаге, формально'], ['That said', 'при этом, впрочем'],
        ['Work out', 'рассчитать, прикинуть'], ['go for it', 'дерзайте'], ['based on my regrets', 'исходя из моих сожалений'], ['cash flow', 'денежный поток']
      ], [
        Q('What has Nora been offered?', ['A job abroad', 'A partnership', 'A teaching position', 'A loan'], 1, '«I\'ve been offered a partnership».', 'Что предложили Норе?', ['Работу за границей', 'Партнёрство', 'Место преподавателя', 'Кредит']),
        Q('How long will Nora have been at the company by next spring?', ['Five years', 'Eight years', 'Ten years', 'Twenty years'], 2, '«By next spring I\'ll have been at the company for ten years».', 'Сколько Нора проработает в компании к следующей весне?', ['Пять лет', 'Восемь лет', 'Десять лет', 'Двадцать лет']),
        Q('What did Victor do twenty years ago?', ['He started his own firm', 'He took the safe option', 'He left the law', 'He moved abroad'], 1, '«I took the safe option.»', 'Что сделал Виктор двадцать лет назад?', ['Открыл свою фирму', 'Выбрал надёжный вариант', 'Ушёл из юриспруденции', 'Уехал за границу']),
        Q('Victor has no regrets about his career.', TFE, 1, '«Some days. I wish I\'d at least tried.»', 'Виктор ни о чём не жалеет в своей карьере.'),
        Q("What doesn't Victor want Nora to do?", ['Decide based on his regrets', 'Talk to her clients', 'Think about money', 'Ask for advice'], 0, '«I\'d rather you didn\'t decide based on my regrets.»', 'Чего Виктор не хочет от Норы?', ['Чтобы она решала, глядя на его сожаления', 'Чтобы говорила с клиентами', 'Чтобы думала о деньгах', 'Чтобы просила совета']),
        Q('What practical test does Victor suggest?', ['Ask her clients for money', 'Work out how long she could survive without an income', 'Take a long holiday first', 'Find a business partner'], 1, '«Work out how long you could survive without an income.»', 'Какую практическую проверку предлагает Виктор?', ['Попросить денег у клиентов', 'Посчитать, сколько она продержится без дохода', 'Сначала взять долгий отпуск', 'Найти делового партнёра']),
        Q('"Seldom have I felt so unsure" is an example of…', ['inversion for emphasis', 'a question', 'the passive', 'a future form'], 0, 'После Seldom в начале — инверсия.', '«Seldom have I felt so unsure» — это пример…', ['инверсии для усиления', 'вопроса', 'пассива', 'формы будущего']),
        Q('"Had I been braver, it might have been more interesting" means that Victor…', ['was very brave', "wasn't brave enough, and things could have been different", 'will be braver', 'is talking about the future'], 1, 'Инверсия Had I been — нереальное условие в прошлом.', '«Had I been braver, it might have been more interesting» значит, что Виктор…', ['был очень смелым', 'не был достаточно смелым, и всё могло сложиться иначе', 'станет смелее', 'говорит о будущем'])
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
