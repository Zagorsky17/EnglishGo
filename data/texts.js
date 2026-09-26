/* data/texts.js — тексты для раздела «Чтение»: связный текст уровня A1–C1 + тест на понимание.
   Текст: { id, level, topic, title, titleRu, paragraphs: [абзацы], glossary: [[выражение, перевод]], questions: [Q] }.
   Вопрос: {q, options, answer — индекс правильного варианта, explain}. До B1 вопросы по-русски, с B1 — по-английски.
   Любое слово текста можно нажать: перевод берётся из словаря тренажёра (data/words), выражения — из glossary. */
(function (EG) {
  'use strict';

  var D = EG.data = EG.data || {};
  var TF = ['Верно', 'Неверно'];
  var TFE = ['True', 'False'];
  function Q(q, options, answer, explain) { return { q: q, options: options, answer: answer, explain: explain || '' }; }
  function T(id, level, topic, title, titleRu, paragraphs, glossary, questions) {
    return { id: id, level: level, topic: topic, title: title, titleRu: titleRu, paragraphs: paragraphs, glossary: glossary, questions: questions };
  }

  D.textTopics = {
    daily: { name: 'Повседневная жизнь', emoji: '☀️' },
    people: { name: 'Люди и отношения', emoji: '👨‍👩‍👧' },
    city: { name: 'Город', emoji: '🏙️' },
    food: { name: 'Еда', emoji: '🍲' },
    travel: { name: 'Путешествия', emoji: '✈️' },
    nature: { name: 'Природа и экология', emoji: '🌿' },
    work: { name: 'Работа и карьера', emoji: '💼' },
    health: { name: 'Здоровье', emoji: '🩺' },
    tech: { name: 'Технологии', emoji: '📱' },
    education: { name: 'Образование', emoji: '🎓' },
    society: { name: 'Общество', emoji: '🤝' },
    science: { name: 'Наука', emoji: '🔬' },
    history: { name: 'История', emoji: '🏛️' },
    psychology: { name: 'Психология', emoji: '🧠' },
    money: { name: 'Деньги и экономика', emoji: '💰' }
  };

  D.texts = [
    /* ================= A1 ================= */
    T('t-a1-family', 'A1', 'people', 'My Family', 'Моя семья', [
      "Hi! My name is Anna. I am twenty-five years old and I live in a small flat in Kazan. I am a teacher. I teach English at a school near my home.",
      "I have a big family. My father's name is Igor. He is fifty-three and he is a doctor. My mother, Olga, is a cook in a restaurant. Her food is very good! I have one brother and one sister. My brother, Max, is a student. He studies computers at university. My sister, Katya, is only ten. She loves animals and she has a cat called Tom.",
      "My grandparents live in a village. They have a garden with apples and flowers. Every summer we visit them. We eat together in the garden, play games and talk a lot.",
      "On Sundays my family has lunch at my parents' house. My mother cooks, my father makes tea and my sister tells us funny stories about school. I love my family very much."
    ], [
      ['years old', 'лет (о возрасте)'], ['a cook', 'повар'], ['called', 'по имени, под названием'], ['every summer', 'каждое лето'],
      ['has lunch', 'обедает (have lunch — обедать)'], ['very much', 'очень (сильно)']
    ], [
      Q('Кем работает Анна?', ['Врачом', 'Учителем английского', 'Поваром', 'Студенткой'], 1, '«I am a teacher. I teach English…»'),
      Q('Кто в семье работает в ресторане?', ['Отец', 'Брат', 'Мама', 'Бабушка'], 2, '«My mother, Olga, is a cook in a restaurant.»'),
      Q('Сколько лет сестре Анны?', ['Пять', 'Десять', 'Двадцать пять', 'Пятьдесят три'], 1, '«My sister, Katya, is only ten.»'),
      Q('Бабушка и дедушка живут в городе.', TF, 1, '«My grandparents live in a village» — в деревне.'),
      Q('Что изучает Макс?', ['Английский', 'Медицину', 'Компьютеры', 'Животных'], 2, '«He studies computers at university.»'),
      Q('Что семья делает по воскресеньям?', ['Ездит в деревню', 'Обедает у родителей', 'Ходит в ресторан', 'Играет в футбол'], 1, '«On Sundays my family has lunch at my parents\' house.»')
    ]),
    T('t-a1-day', 'A1', 'daily', 'A Day in My Life', 'Один мой день', [
      "My name is Tom and I work in an office in London. My day starts early. I get up at half past six. I take a shower, get dressed and have breakfast. I usually have coffee and toast with butter.",
      "I go to work by bus. The bus is often very full, so I sometimes walk. It takes about thirty minutes. I start work at nine o'clock. I answer emails, write reports and have meetings with my team.",
      "At one o'clock I have lunch with my friends from work. We usually go to a small café near the office. I like their soup and sandwiches.",
      "I finish work at half past five. In the evening I go to the gym or meet friends. Then I go home, cook dinner and watch a film or read a book. I go to bed at eleven. I am always tired, but I am happy!"
    ], [
      ['get dressed', 'одеваться'], ['half past six', 'половина седьмого'], ['by bus', 'на автобусе'], ['it takes', 'это занимает (время)'],
      ['go to bed', 'ложиться спать'], ['answer emails', 'отвечать на письма']
    ], [
      Q('Во сколько Том встаёт?', ['В 6:00', 'В 6:30', 'В 7:30', 'В 9:00'], 1, '«I get up at half past six» — в половине седьмого.'),
      Q('Что Том обычно ест на завтрак?', ['Суп', 'Бутерброд', 'Тост с маслом', 'Ничего'], 2, '«coffee and toast with butter».'),
      Q('Почему Том иногда ходит пешком?', ['Автобус часто переполнен', 'Он любит спорт', 'Автобуса нет', 'Офис рядом с домом'], 0, '«The bus is often very full, so I sometimes walk.»'),
      Q('Том обедает один.', TF, 1, '«I have lunch with my friends from work.»'),
      Q('Во сколько Том заканчивает работу?', ['В 5:00', 'В 5:30', 'В 6:30', 'В 9:00'], 1, '«I finish work at half past five.»'),
      Q('Что Том делает вечером?', ['Работает', 'Ходит в спортзал или встречается с друзьями', 'Спит', 'Учит английский'], 1, '«In the evening I go to the gym or meet friends.»')
    ]),
    T('t-a1-town', 'A1', 'city', 'My Town', 'Мой город', [
      "I live in Brighton. It is a town by the sea in the south of England. It is not very big, but it is very beautiful and there are always a lot of people in the streets.",
      "There is a long beach and an old pier. In summer the beach is full of families. Children swim in the sea and play in the sand. The water is cold, but people love it!",
      "In the centre of the town there are many small shops, cafés and restaurants. There is a big park and a museum too. My favourite place is a small bookshop in North Street. It is quiet and the coffee there is great.",
      "Brighton is only one hour from London by train. A lot of people live in Brighton and work in London. I work in Brighton, so I walk to work every day. I think it is the best town in England!"
    ], [
      ['by the sea', 'у моря'], ['in the south of', 'на юге'], ['pier', 'пирс'], ['full of', 'полный (кого-то, чего-то)'],
      ['my favourite place', 'моё любимое место'], ['by train', 'на поезде']
    ], [
      Q('Где находится Брайтон?', ['На севере Англии', 'На юге Англии', 'В Лондоне', 'В Шотландии'], 1, '«a town by the sea in the south of England».'),
      Q('Какая вода в море?', ['Тёплая', 'Горячая', 'Холодная', 'Грязная'], 2, '«The water is cold, but people love it!»'),
      Q('Любимое место автора — это…', ['Пляж', 'Музей', 'Книжный магазин', 'Парк'], 2, '«My favourite place is a small bookshop in North Street.»'),
      Q('Из Брайтона до Лондона час на поезде.', TF, 0, '«Brighton is only one hour from London by train.»'),
      Q('Как автор добирается до работы?', ['На поезде', 'Пешком', 'На автобусе', 'На машине'], 1, '«I walk to work every day.»'),
      Q('Что есть в центре города?', ['Аэропорт', 'Магазины, кафе и рестораны', 'Университет', 'Большой стадион'], 1, '«there are many small shops, cafés and restaurants».')
    ]),
    T('t-a1-cafe', 'A1', 'food', 'Lunch at the Café', 'Обед в кафе', [
      "It is Saturday. Mia and her friend Ben are hungry, so they go to a café in the city centre. The café is small, but it is warm and friendly.",
      "A waiter comes to their table. 'Hello! Here is the menu. Can I get you something to drink?' Mia wants orange juice. Ben asks for a cup of tea with milk.",
      "Then they look at the menu. Mia doesn't eat meat, so she orders a vegetable soup and a cheese sandwich. Ben is very hungry. He orders a chicken burger with chips and a salad.",
      "The food is delicious. For dessert they share a big piece of chocolate cake. At the end Ben asks for the bill. It is twenty-four pounds. Mia pays with her card and they leave a small tip for the waiter. 'Let's come here again next week,' says Ben."
    ], [
      ['can I get you', 'что вам принести'], ['asks for', 'просит (ask for — просить что-то)'], ['doesn\'t eat meat', 'не ест мясо'], ['chips', 'картофель фри (брит.)'],
      ['share', 'делить (на двоих)'], ['the bill', 'счёт'], ['leave a small tip', 'оставить небольшие чаевые']
    ], [
      Q('Какой сегодня день?', ['Пятница', 'Суббота', 'Воскресенье', 'Понедельник'], 1, '«It is Saturday.»'),
      Q('Что Бен пьёт?', ['Апельсиновый сок', 'Кофе', 'Чай с молоком', 'Воду'], 2, '«Ben asks for a cup of tea with milk.»'),
      Q('Почему Миа заказывает овощной суп?', ['Она не ест мясо', 'Она не голодна', 'Это дёшево', 'Нет другой еды'], 0, '«Mia doesn\'t eat meat».'),
      Q('Они едят два разных десерта.', TF, 1, '«they share a big piece of chocolate cake» — один кусок на двоих.'),
      Q('Сколько стоит обед?', ['14 фунтов', '20 фунтов', '24 фунта', '42 фунта'], 2, '«It is twenty-four pounds.»'),
      Q('Кто платит?', ['Бен', 'Миа', 'Официант', 'Они платят пополам'], 1, '«Mia pays with her card».')
    ]),
    T('t-a1-dog', 'A1', 'nature', 'Our New Dog', 'Наша новая собака', [
      "Last month my family got a dog. His name is Rocky. He is two years old and he is brown and white. We found him at an animal shelter. He didn't have a home, and now he lives with us.",
      "Rocky is very friendly. He loves children and he is never angry. He is not very big, but he is very strong and fast. He can run for hours in the park!",
      "Every morning my dad takes Rocky for a walk before work. In the evening I walk him after school. On weekends we all go to the forest together. Rocky loves water, so he always jumps into the river.",
      "Rocky eats twice a day. He likes meat and fish, but he doesn't like vegetables. His favourite toy is an old red ball. When he is tired, he sleeps on the sofa, but my mum doesn't like that!"
    ], [
      ['last month', 'в прошлом месяце'], ['animal shelter', 'приют для животных'], ['for a walk', 'на прогулку (take for a walk — выгуливать)'], ['for hours', 'часами'],
      ['twice a day', 'два раза в день'], ['jumps into', 'прыгает в (jump into)']
    ], [
      Q('Где семья нашла Рокки?', ['В магазине', 'В приюте для животных', 'В лесу', 'У друзей'], 1, '«We found him at an animal shelter.»'),
      Q('Какого цвета Рокки?', ['Чёрный', 'Белый', 'Коричнево-белый', 'Рыжий'], 2, '«he is brown and white».'),
      Q('Рокки — очень большая собака.', TF, 1, '«He is not very big, but he is very strong».'),
      Q('Кто гуляет с Рокки утром?', ['Мама', 'Папа', 'Автор', 'Никто'], 1, '«Every morning my dad takes Rocky for a walk».'),
      Q('Что Рокки не любит есть?', ['Мясо', 'Рыбу', 'Овощи', 'Корм'], 2, '«he doesn\'t like vegetables».'),
      Q('Кому не нравится, что Рокки спит на диване?', ['Папе', 'Маме', 'Сестре', 'Соседям'], 1, '«my mum doesn\'t like that!»')
    ]),
    T('t-a1-weekend', 'A1', 'daily', 'A Rainy Weekend', 'Дождливые выходные', [
      "This weekend the weather was terrible. It rained on Saturday and on Sunday, and it was cold and windy. We didn't go to the beach. We stayed at home.",
      "On Saturday morning I cleaned my room and helped my mother in the kitchen. We made pizza together. In the afternoon my friend Leo came to my house. We played computer games and listened to music.",
      "On Sunday I got up late, at ten o'clock. After breakfast I read a book about a boy who travels to the moon. It was very interesting! Then I called my grandmother. She lives in another city, and we talk every week.",
      "In the evening my family watched an old comedy on TV. We laughed a lot. It wasn't a sunny weekend, but it was a nice one. Next weekend, I hope, the sun will come back."
    ], [
      ['it rained', 'шёл дождь'], ['stayed at home', 'остались дома'], ['got up late', 'встал поздно'], ['another city', 'другой город'],
      ['laughed a lot', 'много смеялись'], ['I hope', 'надеюсь']
    ], [
      Q('Какая погода была на выходных?', ['Солнечная', 'Дождливая и ветреная', 'Снежная', 'Жаркая'], 1, '«It rained… it was cold and windy.»'),
      Q('Что автор приготовил с мамой?', ['Суп', 'Торт', 'Пиццу', 'Салат'], 2, '«We made pizza together.»'),
      Q('Кто пришёл в гости в субботу?', ['Бабушка', 'Друг Лео', 'Сестра', 'Сосед'], 1, '«my friend Leo came to my house».'),
      Q('В воскресенье автор встал рано.', TF, 1, '«I got up late, at ten o\'clock.»'),
      Q('О чём книга, которую читал автор?', ['О собаке', 'О мальчике, который летит на Луну', 'О море', 'О Лондоне'], 1, '«a book about a boy who travels to the moon».'),
      Q('Что семья делала в воскресенье вечером?', ['Ходила в кино', 'Смотрела комедию по телевизору', 'Играла в игры', 'Гуляла'], 1, '«my family watched an old comedy on TV».')
    ]),

    /* ================= A2 ================= */
    T('t-a2-spain', 'A2', 'travel', 'Two Weeks in Spain', 'Две недели в Испании', [
      "Last summer I went on holiday to Spain with my best friend, Sara. We spent two weeks there and visited three cities: Madrid, Seville and Barcelona. We travelled by train because it is fast and comfortable.",
      "Madrid was our first stop. We stayed in a small hotel near the main square. The weather was really hot — almost forty degrees! — so during the day we visited museums, and in the evening we walked around the old streets and tried tapas in little bars.",
      "Seville was my favourite city. It is full of orange trees and beautiful buildings. One evening we watched a flamenco show. The dancers were amazing, and the music was very emotional. Sara even bought a flamenco dress as a souvenir.",
      "In Barcelona we spent most of the time at the beach. We also visited the famous Sagrada Família church. It is still not finished, although people started building it in 1882!",
      "The only problem on our trip happened on the last day: Sara lost her passport. We went to the police station, and luckily someone found it in a café. Next year we want to go to Portugal."
    ], [
      ['went on holiday', 'поехал(а) в отпуск (go on holiday)'], ['first stop', 'первая остановка'], ['tried tapas', 'попробовали тапас (закуски)'], ['as a souvenir', 'на память, как сувенир'],
      ['most of the time', 'большую часть времени'], ['still not finished', 'всё ещё не достроен'], ['luckily', 'к счастью']
    ], [
      Q('Как друзья путешествовали между городами?', ['На самолёте', 'На машине', 'На поезде', 'На автобусе'], 2, '«We travelled by train because it is fast and comfortable.»'),
      Q('Почему днём они ходили в музеи в Мадриде?', ['Шёл дождь', 'Было очень жарко', 'Музеи были бесплатные', 'Бары были закрыты'], 1, '«The weather was really hot — almost forty degrees!»'),
      Q('Какой город больше всего понравился автору?', ['Мадрид', 'Севилья', 'Барселона', 'Лиссабон'], 1, '«Seville was my favourite city.»'),
      Q('Что Сара купила на память?', ['Апельсины', 'Платье для фламенко', 'Книгу', 'Картину'], 1, '«Sara even bought a flamenco dress as a souvenir.»'),
      Q('Храм Саграда Фамилия уже достроен.', TF, 1, '«It is still not finished».'),
      Q('Что случилось в последний день?', ['Они опоздали на поезд', 'Сара потеряла паспорт', 'Автор заболел', 'Закрылся отель'], 1, '«Sara lost her passport.»'),
      Q('Куда они хотят поехать в следующем году?', ['В Испанию', 'В Италию', 'В Португалию', 'Во Францию'], 2, '«Next year we want to go to Portugal.»')
    ]),
    T('t-a2-first-job', 'A2', 'work', 'My First Job', 'Моя первая работа', [
      "When I was seventeen, I got my first job. I worked in a big supermarket on Saturdays and Sundays. I needed money for a new laptop, and my parents said, 'If you want it, you can earn it!'",
      "On my first day I was very nervous. My manager, Mr Brown, showed me around the shop and explained my tasks. I had to put products on the shelves, help customers find things and sometimes work at the till.",
      "The work was harder than I expected. I was on my feet for eight hours, and some customers were rude. Once a woman shouted at me because we didn't have her favourite bread. But most people were kind and polite, and my colleagues were really friendly. We often had lunch together and laughed a lot.",
      "After four months I had enough money for the laptop. But the job gave me more than money. I learned to talk to strangers, to work in a team and to stay calm when something goes wrong. Now, when I see teenagers working in shops, I always smile at them and say thank you."
    ], [
      ['earn it', 'заработать это'], ['showed me around', 'показал всё вокруг, провёл экскурсию'], ['till', 'касса (в магазине)'], ['harder than I expected', 'тяжелее, чем я ожидал'],
      ['on my feet', 'на ногах'], ['shouted at me', 'накричала на меня'], ['goes wrong', 'идёт не так']
    ], [
      Q('Зачем автору были нужны деньги?', ['На машину', 'На новый ноутбук', 'На отпуск', 'На учёбу'], 1, '«I needed money for a new laptop».'),
      Q('Когда автор работал?', ['Каждый день', 'По вечерам', 'По выходным', 'Только летом'], 2, '«on Saturdays and Sundays».'),
      Q('Как автор чувствовал себя в первый день?', ['Спокойно', 'Очень нервничал', 'Скучал', 'Злился'], 1, '«On my first day I was very nervous.»'),
      Q('Почему женщина накричала на автора?', ['Он ошибся со сдачей', 'Не было её любимого хлеба', 'Он был груб', 'Магазин закрывался'], 1, '«because we didn\'t have her favourite bread».'),
      Q('Коллеги автора были недружелюбными.', TF, 1, '«my colleagues were really friendly».'),
      Q('Сколько времени понадобилось, чтобы накопить на ноутбук?', ['Месяц', 'Два месяца', 'Четыре месяца', 'Год'], 2, '«After four months I had enough money».'),
      Q('Чему научила автора работа?', ['Готовить', 'Работать в команде и сохранять спокойствие', 'Водить машину', 'Программировать'], 1, '«I learned to talk to strangers, to work in a team and to stay calm».')
    ]),
    T('t-a2-market', 'A2', 'food', 'The Saturday Market', 'Субботний рынок', [
      "Every Saturday morning there is a farmers' market in the square near my flat. It opens at eight o'clock and closes at two. I love going there, even when it's raining.",
      "At the market you can buy fresh fruit and vegetables, bread, cheese, eggs, honey and flowers. Most of the sellers are farmers from villages near the city. They grow the food themselves, so it is fresh and tastes much better than food from the supermarket.",
      "My favourite seller is an old man called Peter. He sells apples and pears from his own garden. He always gives me an extra apple 'for the road'. There is also a young woman who bakes amazing bread. By eleven o'clock her table is usually empty, so I always go there first.",
      "Of course, the market is a bit more expensive than the supermarket. But I think it's worth it. I know where my food comes from, I help local farmers, and I don't buy things in plastic. And every Saturday I have a nice chat with people I know. For me, it's not just shopping — it's the best part of the week."
    ], [
      ['farmers\' market', 'фермерский рынок'], ['even when', 'даже когда'], ['grow the food themselves', 'сами выращивают еду'], ['for the road', 'на дорожку'],
      ['it\'s worth it', 'оно того стоит'], ['comes from', 'откуда берётся, происходит'], ['have a nice chat', 'приятно поболтать']
    ], [
      Q('Во сколько закрывается рынок?', ['В 8:00', 'В 11:00', 'В 14:00', 'В 18:00'], 2, '«It opens at eight o\'clock and closes at two.»'),
      Q('Почему еда на рынке вкуснее?', ['Её привозят из-за границы', 'Фермеры сами её выращивают, она свежая', 'Она дешевле', 'Её готовят на месте'], 1, '«They grow the food themselves, so it is fresh».'),
      Q('Что продаёт Питер?', ['Хлеб', 'Мёд', 'Яблоки и груши', 'Цветы'], 2, '«He sells apples and pears from his own garden.»'),
      Q('Почему автор сначала идёт к пекарю?', ['Хлеб дешёвый', 'К одиннадцати часам хлеб обычно заканчивается', 'Она подруга автора', 'Там нет очереди'], 1, '«By eleven o\'clock her table is usually empty».'),
      Q('На рынке дешевле, чем в супермаркете.', TF, 1, '«the market is a bit more expensive».'),
      Q('Что значит «it\'s worth it»?', ['Это дорого', 'Оно того стоит', 'Это неважно', 'Это вредно'], 1, 'worth it — «стоит того».'),
      Q('Какая из причин НЕ упоминается?', ['Помощь местным фермерам', 'Меньше пластика', 'Общение со знакомыми', 'Бесплатная доставка'], 3, 'О доставке в тексте ничего нет.')
    ]),
    T('t-a2-habits', 'A2', 'health', 'Small Habits, Big Changes', 'Маленькие привычки — большие перемены', [
      "A year ago I felt tired all the time. I worked at a computer all day, ate fast food and went to bed after midnight. My doctor told me: 'You don't need medicine. You need to change your habits.'",
      "I didn't want to change everything at once, so I started with small things. First, I began to drink more water — two litres a day. I put a big bottle on my desk, so I didn't forget. After a week I already felt better.",
      "Next, I decided to walk more. I got off the bus two stops early and walked the rest of the way to work. I also started using the stairs instead of the lift. It was difficult at first, but soon it became normal.",
      "The hardest change was sleep. I love watching series in the evening, but now I switch off my phone and laptop at ten thirty and read a paper book. I fall asleep much faster.",
      "Today I have more energy, I'm in a better mood and I've lost five kilos. My advice? Don't try to be perfect. Choose one small habit, do it every day, and add another one when it becomes easy."
    ], [
      ['all the time', 'всё время'], ['at once', 'сразу, одновременно'], ['got off the bus', 'выходил из автобуса'], ['the rest of the way', 'оставшуюся часть пути'],
      ['instead of', 'вместо'], ['switch off', 'выключать'], ['fall asleep', 'засыпать'], ['in a better mood', 'в лучшем настроении']
    ], [
      Q('Что посоветовал врач?', ['Принимать лекарства', 'Изменить привычки', 'Больше работать', 'Поехать в отпуск'], 1, '«You don\'t need medicine. You need to change your habits.»'),
      Q('С чего автор начал?', ['С бега', 'С того, чтобы пить больше воды', 'С диеты', 'Со сна'], 1, '«First, I began to drink more water».'),
      Q('Как автор стал больше ходить?', ['Купил велосипед', 'Выходил на две остановки раньше', 'Записался в спортзал', 'Гулял с собакой'], 1, '«I got off the bus two stops early».'),
      Q('Какое изменение было самым трудным?', ['Вода', 'Прогулки', 'Сон', 'Лестница'], 2, '«The hardest change was sleep.»'),
      Q('Теперь автор смотрит сериалы перед сном.', TF, 1, 'Он выключает технику в 22:30 и читает бумажную книгу.'),
      Q('Сколько килограммов потерял автор?', ['Два', 'Пять', 'Десять', 'Нисколько'], 1, '«I\'ve lost five kilos».'),
      Q('Главный совет автора:', ['Меняйте всё сразу', 'Будьте идеальны', 'Начните с одной маленькой привычки', 'Больше спите днём'], 2, '«Choose one small habit, do it every day…»')
    ]),
    T('t-a2-moving', 'A2', 'city', 'A New City', 'Новый город', [
      "Three months ago I moved from a small town to Manchester for a new job. It was a big change. In my town I knew everybody, but in Manchester I didn't know anyone.",
      "The first weeks were difficult. I lived in a tiny room, and I spent the evenings alone. I often got lost because the streets all looked the same to me. Once I took the wrong bus and ended up on the other side of the city!",
      "Then I decided to do something about it. I joined a running club that meets in the park every Tuesday and Thursday. I also started going to a language café, where people practise different languages and meet new friends. There I met Diego from Mexico and Aisha from Egypt. Now we cook dinner together every Friday.",
      "Slowly the city became home. I found a bigger flat with a balcony, I learned the bus routes, and I discovered a small Italian restaurant with the best pizza I have ever eaten.",
      "Moving to a new place is not easy, but it teaches you a lot. My advice is simple: say yes to invitations, try new things and be patient. Friends don't appear in one day."
    ], [
      ['a big change', 'большая перемена'], ['got lost', 'заблудился'], ['ended up', 'оказался (в итоге)'], ['do something about it', 'что-то с этим сделать'],
      ['language café', 'языковое кафе (встречи для практики языков)'], ['bus routes', 'автобусные маршруты'], ['have ever eaten', 'когда-либо ел'], ['be patient', 'будьте терпеливы']
    ], [
      Q('Почему автор переехал в Манчестер?', ['Учиться', 'Из-за новой работы', 'К родственникам', 'Из-за любви'], 1, '«for a new job».'),
      Q('Что было трудным в первые недели?', ['Жара', 'Одиночество и то, что автор терялся', 'Дорогая еда', 'Работа'], 1, '«I spent the evenings alone. I often got lost».'),
      Q('Как часто встречается беговой клуб?', ['Каждый день', 'Два раза в неделю', 'Раз в месяц', 'По выходным'], 1, '«every Tuesday and Thursday».'),
      Q('Где автор познакомился с Диего и Аишей?', ['На работе', 'В беговом клубе', 'В языковом кафе', 'В ресторане'], 2, '«There I met Diego… and Aisha…» — в языковом кафе.'),
      Q('Автор до сих пор живёт в крошечной комнате.', TF, 1, '«I found a bigger flat with a balcony».'),
      Q('Что автор нашёл в итоге?', ['Итальянский ресторан с лучшей пиццей', 'Новую работу', 'Собаку', 'Велосипед'], 0, '«the best pizza I have ever eaten».'),
      Q('Какой совет автор НЕ даёт?', ['Соглашайтесь на приглашения', 'Пробуйте новое', 'Будьте терпеливы', 'Не уезжайте из родного города'], 3, 'Такого совета в тексте нет.')
    ]),
    T('t-a2-party', 'A2', 'people', 'The Surprise Party', 'Вечеринка-сюрприз', [
      "My grandmother Rosa turned eighty last month, and my family decided to organize a surprise party for her. It wasn't easy, because Grandma Rosa notices everything!",
      "We planned everything for weeks. My aunt booked a room in a small restaurant. My cousins made a big poster with old family photos. I was responsible for the cake. I ordered it from Grandma's favourite bakery: a lemon cake with white cream and the number 80 on top.",
      "On the day of the party my mum told Grandma that we were going to a quiet family dinner. When Grandma opened the door of the restaurant, forty people shouted 'Surprise!' She was so shocked that she sat down on the nearest chair. Then she started laughing and crying at the same time.",
      "Some guests came from very far. Her old school friend flew from Canada, and her brother, who she hadn't seen for ten years, came from Italy. There was music, and Grandma danced with everyone.",
      "At the end of the evening Grandma gave a short speech. 'I am not rich,' she said, 'but tonight I feel like the richest woman in the world.' Everybody clapped, and a lot of us had tears in our eyes."
    ], [
      ['turned eighty', 'исполнилось восемьдесят'], ['for weeks', 'неделями'], ['was responsible for', 'отвечал за'], ['on top', 'сверху'],
      ['at the same time', 'одновременно'], ['hadn\'t seen for ten years', 'не видела десять лет'], ['gave a short speech', 'произнесла короткую речь (give a speech)'], ['had tears in our eyes', 'у нас были слёзы на глазах']
    ], [
      Q('Почему организовать сюрприз было непросто?', ['Бабушка болела', 'Бабушка всё замечает', 'Не было денег', 'Родственники далеко'], 1, '«Grandma Rosa notices everything!»'),
      Q('За что отвечал автор?', ['За плакат', 'За ресторан', 'За торт', 'За музыку'], 2, '«I was responsible for the cake.»'),
      Q('Какой был торт?', ['Шоколадный', 'Лимонный с белым кремом', 'Клубничный', 'Морковный'], 1, '«a lemon cake with white cream».'),
      Q('Что мама сказала бабушке?', ['Правду о вечеринке', 'Что будет тихий семейный ужин', 'Что они идут в кино', 'Ничего'], 1, '«we were going to a quiet family dinner».'),
      Q('Брат бабушки прилетел из Канады.', TF, 1, 'Из Канады прилетела школьная подруга, а брат приехал из Италии.'),
      Q('Сколько человек крикнули «Сюрприз!»?', ['Десять', 'Двадцать', 'Сорок', 'Восемьдесят'], 2, '«forty people shouted \'Surprise!\'»'),
      Q('Что бабушка сказала в речи?', ['Что она устала', 'Что чувствует себя самой богатой женщиной в мире', 'Что не любит сюрпризы', 'Что уедет в Италию'], 1, '«I feel like the richest woman in the world».')
    ]),

    /* ================= B1 ================= */
    T('t-b1-remote', 'B1', 'work', 'Working from Home: Dream or Trap?', 'Работа из дома: мечта или ловушка?', [
      "A few years ago, working from home was a rare privilege. Today millions of people do it at least some of the time. For many, it sounds like a dream: no crowded trains, no strict dress code and the chance to take a break in your own kitchen. But is it really that simple?",
      "The advantages are obvious. Remote workers save time and money on travel. A person who used to spend an hour commuting each way suddenly has ten extra hours a week. Many people say they can concentrate better at home, away from noisy open-plan offices and endless small talk.",
      "However, there are disadvantages too. The biggest one is loneliness. In an office you chat with colleagues, have lunch together and share jokes. At home, some people can go all day without speaking to anyone. Another problem is that work and private life start to mix. When your laptop is always on the kitchen table, it is hard to stop working in the evening.",
      "Experts suggest a few simple rules. Have a fixed start and finish time. Work in one place, not on the sofa or in bed. Get dressed as if you were going to the office. Take real breaks and go outside at least once a day. And make an effort to stay in touch with colleagues — for example, by having a short video call just to chat, not only to discuss work.",
      "It seems that the future belongs to a mix of both. Many companies now offer 'hybrid' work: two or three days in the office and the rest at home. For most people, this may be the best of both worlds."
    ], [
      ['at least some of the time', 'хотя бы иногда'], ['dress code', 'дресс-код'], ['commuting', 'дорога на работу и обратно'], ['each way', 'в одну сторону'],
      ['open-plan office', 'офис открытого типа'], ['small talk', 'светская беседа, болтовня'], ['make an effort', 'прилагать усилия'], ['stay in touch', 'поддерживать связь'],
      ['the best of both worlds', 'лучшее из двух вариантов']
    ], [
      Q('According to the text, what is the main advantage of remote work?', ['Higher salaries', 'Saving time and money on travel', 'More meetings', 'A better office'], 1, 'Экономия времени и денег на дороге — главный плюс, о котором говорится во втором абзаце.'),
      Q('How much extra time a week can someone gain who commuted an hour each way?', ['Two hours', 'Five hours', 'Ten hours', 'Twenty hours'], 2, '1 час туда + 1 час обратно × 5 дней = 10 часов.'),
      Q('What is described as the biggest disadvantage?', ['Loneliness', 'Noise', 'Bad internet', 'Low pay'], 0, '«The biggest one is loneliness.»'),
      Q('Experts recommend working on the sofa to feel relaxed.', TFE, 1, 'Наоборот: «Work in one place, not on the sofa or in bed.»'),
      Q('Why is it hard to stop working in the evening at home?', ['The boss calls you', 'Work and private life start to mix', 'There is nothing else to do', 'The internet is faster at night'], 1, '«work and private life start to mix».'),
      Q('What does "hybrid" work mean in the text?', ['Working two jobs', 'Working only at night', 'Some days in the office, some at home', 'Working from another country'], 2, '«two or three days in the office and the rest at home».'),
      Q('The word "obvious" in paragraph 2 is closest in meaning to…', ['clear', 'hidden', 'strange', 'small'], 0, 'obvious — очевидный, ясный.')
    ]),
    T('t-b1-phone', 'B1', 'tech', 'A Week Without My Phone', 'Неделя без телефона', [
      "Last month I did an experiment: I lived for a week without my smartphone. I put it in a drawer on Sunday evening and bought a cheap old phone that could only make calls and send texts. I told my friends and family in advance, so nobody would worry.",
      "The first two days were the worst. I kept reaching into my pocket for a phone that wasn't there. On the bus I didn't know what to do with my hands. I felt bored and, to be honest, a little anxious. What if I was missing something important?",
      "By Wednesday, something changed. On the way to work I started looking out of the window and noticing things I had never seen: a small bakery, a mural on a wall, an old man who fed the birds every morning. I read two books in one week — more than I usually read in two months.",
      "Of course, there were problems. I got lost trying to find a friend's new flat because I had no map. I couldn't pay by phone and had to find a cash machine. And I missed several group chats and a party invitation.",
      "When the week was over, I switched my smartphone back on and saw 214 notifications. Almost none of them were important. I haven't given up my phone completely — it is too useful for that. But I have made some changes: I've deleted social media apps, I don't take the phone to bed, and I leave it in another room when I'm eating. I feel calmer, and my days feel longer."
    ], [
      ['in advance', 'заранее'], ['kept reaching', 'всё время тянулся'], ['to be honest', 'честно говоря'], ['what if', 'а что, если'],
      ['mural', 'настенная роспись'], ['cash machine', 'банкомат'], ['switched my smartphone back on', 'снова включил смартфон (switch back on)'], ['given up', 'отказался от']
    ], [
      Q('What kind of phone did the writer use during the experiment?', ['A new smartphone', 'A simple phone for calls and texts', 'A tablet', 'No phone at all'], 1, '«a cheap old phone that could only make calls and send texts».'),
      Q('How did the writer feel during the first two days?', ['Relaxed and happy', 'Bored and a little anxious', 'Angry with friends', 'Very busy'], 1, '«I felt bored and, to be honest, a little anxious.»'),
      Q('What changed by Wednesday?', ['The writer bought a new phone', 'The writer started noticing things around', 'The writer stopped going to work', 'The writer moved flat'], 1, 'Автор стал замечать пекарню, роспись, старика с птицами.'),
      Q('The writer read more books than usual.', TFE, 0, '«I read two books in one week — more than I usually read in two months.»'),
      Q('Which problem did the writer NOT have?', ['Getting lost', 'Paying without a phone', 'Missing an invitation', 'Losing the job'], 3, 'О проблемах на работе не говорится.'),
      Q('What did the writer find when switching the smartphone back on?', ['Many important messages', '214 mostly unimportant notifications', 'A broken screen', 'No messages at all'], 1, '«Almost none of them were important.»'),
      Q('Which change has the writer made?', ['Sold the smartphone', 'Deleted social media apps', 'Stopped using the internet', 'Bought a second phone'], 1, '«I\'ve deleted social media apps».')
    ]),
    T('t-b1-volunteer', 'B1', 'society', 'Why I Volunteer', 'Почему я волонтёр', [
      "Every Saturday morning, while most of my friends are still asleep, I go to a small community kitchen in the centre of our city. For the last two years I have volunteered there, helping to prepare hot meals for people who can't afford food or don't have a home.",
      "I started volunteering almost by accident. I was going through a difficult time: I had lost my job and I felt useless. A neighbour suggested that I come along with her one weekend. I agreed, mainly because I had nothing better to do. I didn't expect it to change my life.",
      "The work itself is simple. We chop vegetables, cook huge pots of soup, wash dishes and serve food. But the most important part is talking to people. Some of our guests come every week, and I know their names and their stories. One man, Frank, used to be a successful engineer before he became ill and lost everything. He taught me how to play chess.",
      "Volunteering has given me much more than I have given. It helped me get my confidence back, and I found a new job through a contact I made in the kitchen. It also changed the way I see people. It is easy to judge someone you pass in the street. It is much harder once you know their story.",
      "If you are thinking about volunteering, my advice is: just try it. You don't need special skills. Most organisations are happy with a few hours a month. You may find, like me, that helping others is also the best way to help yourself."
    ], [
      ['community kitchen', 'общественная (бесплатная) кухня'], ['afford', 'позволить себе (по деньгам)'], ['by accident', 'случайно'], ['going through a difficult time', 'переживать трудный период'],
      ['come along', 'пойти вместе'], ['used to be', 'когда-то был'], ['get my confidence back', 'вернуть уверенность'], ['judge someone', 'осуждать кого-то']
    ], [
      Q('How long has the writer volunteered at the kitchen?', ['Two months', 'One year', 'Two years', 'Ten years'], 2, '«For the last two years I have volunteered there».'),
      Q('Why did the writer first go to the kitchen?', ['It was part of a job', 'A neighbour suggested it', 'A school project', 'To find food'], 1, '«A neighbour suggested that I come along with her».'),
      Q('What was the writer\'s situation at that time?', ['Very busy at work', 'Unemployed and feeling useless', 'Studying at university', 'Living abroad'], 1, '«I had lost my job and I felt useless.»'),
      Q('According to the writer, the most important part of the work is…', ['cooking soup', 'washing dishes', 'talking to people', 'collecting money'], 2, '«the most important part is talking to people».'),
      Q('Frank taught the writer to cook.', TFE, 1, '«He taught me how to play chess.»'),
      Q('How did the writer find a new job?', ['Through an advert', 'Through a contact made in the kitchen', 'Through Frank', 'At a job fair'], 1, '«I found a new job through a contact I made in the kitchen.»'),
      Q('What does the writer say you need to volunteer?', ['Special skills', 'A lot of free time', 'No special skills — just a few hours', 'A university degree'], 2, '«You don\'t need special skills… a few hours a month.»')
    ]),
    T('t-b1-language', 'B1', 'education', 'Is It Too Late to Learn a Language?', 'Не поздно ли учить язык?', [
      "Many adults believe that learning a foreign language is something only children can do well. 'My brain is too old,' they say. But is that true? Research suggests the answer is more complicated — and more encouraging.",
      "It is true that young children have some advantages. They copy sounds easily, so they often develop a native-like accent. They are also not afraid of making mistakes. But adults have advantages of their own. They understand grammar rules faster, they have a bigger vocabulary in their first language, and they know how to organise their learning. In studies, adults often make faster progress than children in the first months.",
      "So why do so many adults give up? Usually the problem is not the brain but the method and the motivation. Many people try to learn from a textbook for an hour once a week and then forget everything by the next lesson. Language, like a sport, needs regular practice.",
      "Experts agree on a few things that really work. First, little and often: fifteen minutes every day is better than two hours on Sunday. Second, use spaced repetition — review new words just before you are likely to forget them. Third, get as much input as possible: listen to podcasts, watch series with subtitles, read simple texts. Finally, speak from the very beginning, even if you make mistakes.",
      "Perhaps you will never sound exactly like a native speaker. But that is not the goal. The goal is to communicate, to understand and to be understood. And for that, it is never too late."
    ], [
      ['native-like accent', 'акцент как у носителя'], ['of their own', 'свои собственные'], ['give up', 'сдаваться, бросать'], ['little and often', 'понемногу, но часто'],
      ['spaced repetition', 'интервальное повторение'], ['input', 'языковой материал (то, что слушаем и читаем)'], ['from the very beginning', 'с самого начала']
    ], [
      Q('What do many adults believe about learning languages?', ['It is easy', 'Only children can do it well', 'It needs no practice', 'It is only for teachers'], 1, '«something only children can do well».'),
      Q('Which advantage of children is mentioned?', ['They understand grammar faster', 'They copy sounds easily', 'They have more free time', 'They have bigger vocabularies'], 1, '«They copy sounds easily».'),
      Q('In the first months, adults often progress faster than children.', TFE, 0, '«adults often make faster progress than children in the first months».'),
      Q('According to the text, why do adults usually give up?', ['Their brain is too old', 'Wrong method and weak motivation', 'Languages are too expensive', 'They have no teachers'], 1, '«the problem is not the brain but the method and the motivation».'),
      Q('What does "little and often" mean here?', ['Study rarely but for a long time', 'Study a short time every day', 'Learn only a few words', 'Study only on Sundays'], 1, '«fifteen minutes every day is better than two hours on Sunday».'),
      Q('Spaced repetition means reviewing words…', ['once a year', 'just before you are likely to forget them', 'only before exams', 'every hour'], 1, 'Так прямо сказано в тексте.'),
      Q('What is the main goal of learning a language, according to the writer?', ['To sound like a native speaker', 'To pass exams', 'To communicate and understand', 'To read grammar books'], 2, '«The goal is to communicate, to understand and to be understood.»')
    ]),
    T('t-b1-solo', 'B1', 'travel', 'Travelling Alone', 'Путешествовать одному', [
      "When I told my friends that I was going to travel around Vietnam on my own for three weeks, most of them were surprised. 'Won't you be lonely?' they asked. 'Isn't it dangerous?' Honestly, I was asking myself the same questions.",
      "The first few days were not easy. Eating alone in a restaurant felt strange, and in the evenings I sometimes wished I had someone to share my experiences with. But I soon discovered that when you travel alone, you are never alone for long. People talk to you much more than when you are in a group. I chatted with families on trains, joined a cooking class with travellers from five countries and spent a day exploring caves with a Dutch couple I met at my hostel.",
      "Travelling solo also gives you complete freedom. I could change my plans whenever I wanted. When I fell in love with a small town called Hoi An, I simply stayed there four extra days. Nobody complained, and I didn't have to compromise.",
      "Of course, you have to be careful. I always told my family where I was, kept copies of my documents online and avoided walking alone late at night in unfamiliar places. I also learned to trust my instincts: if something felt wrong, I left.",
      "The biggest surprise was how much I learned about myself. I had to make every decision, solve every problem and deal with every mistake. I came back more confident and more independent. Now, whenever a friend asks whether they should try it, I always say the same thing: go!"
    ], [
      ['on my own', 'в одиночку, самостоятельно'], ['for long', 'надолго, долго'], ['hostel', 'хостел'], ['fell in love with', 'влюбился в'],
      ['compromise', 'идти на компромисс'], ['unfamiliar places', 'незнакомые места'], ['trust my instincts', 'доверять интуиции'], ['deal with', 'справляться с']
    ], [
      Q('How did the writer\'s friends react to the plan?', ['They wanted to come too', 'They were surprised and worried', 'They were not interested', 'They were jealous'], 1, '«most of them were surprised. \'Won\'t you be lonely?\'…»'),
      Q('What felt strange at first?', ['Taking trains', 'Eating alone in a restaurant', 'Speaking English', 'Staying in hostels'], 1, '«Eating alone in a restaurant felt strange».'),
      Q('According to the writer, solo travellers…', ['rarely meet people', 'talk to people more than groups do', 'always feel lonely', 'must join tours'], 1, '«People talk to you much more than when you are in a group.»'),
      Q('Why did the writer stay four extra days in Hoi An?', ['The train was cancelled', 'The writer fell in love with the town', 'The writer was ill', 'Friends asked to stay'], 1, '«When I fell in love with a small town called Hoi An, I simply stayed».'),
      Q('The writer never took any safety precautions.', TFE, 1, 'Автор сообщал семье, где находится, хранил копии документов и избегал ночных прогулок.'),
      Q('What was the biggest surprise for the writer?', ['How cheap Vietnam was', 'How much they learned about themselves', 'How hot the weather was', 'How difficult the food was'], 1, '«how much I learned about myself».'),
      Q('The phrase "trust my instincts" means…', ['follow a guidebook', 'listen to my inner feelings', 'ask the police', 'check the weather'], 1, 'Доверять внутреннему чутью, интуиции.')
    ]),
    T('t-b1-waste', 'B1', 'nature', 'The Problem with Food Waste', 'Проблема пищевых отходов', [
      "Around the world, roughly a third of all the food that is produced is never eaten. It rots in fields, gets damaged during transport, is thrown away by shops or ends up in our kitchen bins. At the same time, hundreds of millions of people don't have enough to eat.",
      "Food waste is not only a moral problem. It is also an environmental one. Growing, transporting and storing food uses huge amounts of water, land and energy. When food goes to landfill, it produces methane, a gas that makes climate change worse. Some experts estimate that if food waste were a country, it would be one of the biggest producers of greenhouse gases in the world.",
      "A large part of the waste happens at home. We buy too much, forget what is in the fridge and throw away food that is still perfectly good. Many people are also confused by labels. 'Best before' simply means the food is at its best quality until that date; it is usually safe to eat after it. 'Use by', on the other hand, is about safety and should be taken seriously.",
      "The good news is that small changes can make a big difference. Plan your meals and make a shopping list. Check your fridge before you go shopping. Store food correctly and freeze what you can't eat in time. Cook with leftovers: yesterday's rice can become today's fried rice, and old bread makes excellent toast or breadcrumbs.",
      "Some cities and companies are also finding creative solutions. There are apps that let restaurants sell unsold meals cheaply at the end of the day, and supermarkets that give food close to its date to charities. Reducing waste is one of the easiest ways for all of us to save money and help the planet at the same time."
    ], [
      ['roughly a third', 'примерно треть'], ['rots', 'гниёт'], ['landfill', 'свалка, полигон отходов'], ['greenhouse gases', 'парниковые газы'],
      ['best before', 'лучше употребить до'], ['use by', 'употребить до (срок годности)'], ['leftovers', 'остатки еды'], ['breadcrumbs', 'панировочные сухари']
    ], [
      Q('How much of the world\'s food is never eaten?', ['About a tenth', 'About a quarter', 'About a third', 'About half'], 2, '«roughly a third of all the food that is produced is never eaten».'),
      Q('Why is food waste an environmental problem?', ['Food is too cheap', 'It wastes water, land and energy and produces methane', 'It makes shops close', 'Farmers grow too little'], 1, 'Об этом говорится во втором абзаце.'),
      Q('What does a "best before" date mean?', ['The food is dangerous after it', 'The food is at its best quality until then', 'The food must be frozen', 'The shop must throw it away'], 1, '«it is usually safe to eat after it».'),
      Q('"Use by" dates are about safety.', TFE, 0, '«\'Use by\'… is about safety and should be taken seriously.»'),
      Q('Which tip is NOT given in the text?', ['Make a shopping list', 'Freeze food you can\'t eat in time', 'Buy food only online', 'Cook with leftovers'], 2, 'Совета покупать только онлайн нет.'),
      Q('What do some apps allow restaurants to do?', ['Sell unsold meals cheaply', 'Deliver food for free', 'Order from farmers', 'Count calories'], 0, '«apps that let restaurants sell unsold meals cheaply».'),
      Q('The word "leftovers" means…', ['fresh vegetables', 'food that remains after a meal', 'frozen meat', 'shopping lists'], 1, 'leftovers — остатки еды.')
    ]),

    /* ================= B2 ================= */
    T('t-b2-sleep', 'B2', 'science', 'Why We Sleep', 'Зачем мы спим', [
      "We spend roughly a third of our lives asleep, yet for centuries scientists had surprisingly little idea why. Today we know that sleep is not simply a period of rest when the brain switches off. On the contrary, during certain stages of sleep the brain is almost as active as when we are awake.",
      "Sleep comes in cycles of about ninety minutes. Each cycle includes lighter sleep, deep sleep and REM sleep — named after the rapid eye movements that accompany it and during which most vivid dreams occur. Deep sleep appears to be essential for physical recovery: the body repairs tissue and the immune system is strengthened. REM sleep, meanwhile, seems to play a key role in processing emotions and consolidating memories. In experiments, people who slept after learning something new remembered it significantly better than those who stayed awake.",
      "Most adults need between seven and nine hours a night, but many regularly get far less. The consequences go well beyond feeling tired. Chronic lack of sleep has been linked to weight gain, a higher risk of heart disease, weaker concentration and poorer decision-making. After a sleepless night, our reaction times can be comparable to those of someone who has been drinking.",
      "Modern life makes good sleep harder. Our internal body clock, the circadian rhythm, is largely controlled by light. Bright screens in the evening, especially the blue light they emit, can delay the release of melatonin, the hormone that makes us feel sleepy. Irregular working hours, caffeine late in the day and stress only add to the problem.",
      "Fortunately, a few habits can help: going to bed and getting up at the same time every day, keeping the bedroom cool and dark, avoiding screens for an hour before bed and getting daylight in the morning. Sleep, it turns out, is not a waste of time. It may be one of the most productive things we do."
    ], [
      ['on the contrary', 'напротив'], ['REM sleep', 'быстрый сон (фаза БДГ)'], ['consolidating memories', 'закрепление воспоминаний'], ['go well beyond', 'выходить далеко за пределы'],
      ['chronic lack of sleep', 'хронический недосып'], ['body clock', 'биологические часы'], ['emit', 'излучать'], ['it turns out', 'оказывается']
    ], [
      Q('What does the first paragraph say about the brain during sleep?', ['It switches off completely', 'It can be almost as active as when awake', 'It stops dreaming', 'It only rests'], 1, '«the brain is almost as active as when we are awake».'),
      Q('How long is one sleep cycle?', ['About 30 minutes', 'About 60 minutes', 'About 90 minutes', 'About 3 hours'], 2, '«cycles of about ninety minutes».'),
      Q('Which stage is linked mainly to physical recovery?', ['Light sleep', 'Deep sleep', 'REM sleep', 'Waking up'], 1, '«Deep sleep appears to be essential for physical recovery».'),
      Q('People who slept after learning remembered the material better.', TFE, 0, 'Так говорится в конце второго абзаца.'),
      Q('Which consequence of chronic sleep loss is NOT mentioned?', ['Weight gain', 'Heart disease risk', 'Poorer decisions', 'Hair loss'], 3, 'О выпадении волос в тексте нет.'),
      Q('How does blue light from screens affect sleep?', ['It releases more melatonin', 'It delays the release of melatonin', 'It makes dreams more vivid', 'It has no effect'], 1, '«can delay the release of melatonin».'),
      Q('In the last paragraph, the writer suggests that sleep is…', ['a waste of time', 'one of the most productive things we do', 'only important for children', 'impossible to improve'], 1, 'Последнее предложение текста.')
    ]),
    T('t-b2-cities', 'B2', 'city', 'Cities of the Future', 'Города будущего', [
      "By 2050, around two thirds of the world's population is expected to live in cities. This rapid growth brings enormous opportunities, but also serious challenges: traffic congestion, air pollution, a shortage of affordable housing and rising temperatures. Urban planners around the world are rethinking what a city should look like.",
      "One increasingly popular idea is the '15-minute city', a concept associated with the Paris-based researcher Carlos Moreno. The principle is simple: residents should be able to reach most of their daily needs — work, shops, schools, doctors, parks — within a fifteen-minute walk or bike ride. Instead of dividing the city into separate zones for living, working and shopping, planners try to mix them in every neighbourhood.",
      "Transport is another key area. Many cities are reducing space for private cars and investing in public transport, cycle lanes and wider pavements. When Seoul replaced an elevated motorway with a restored stream and park in the early 2000s, critics predicted traffic chaos. Instead, the area became one of the city's most popular public spaces, and it helped lower local summer temperatures.",
      "Green infrastructure is also gaining importance. Trees, green roofs and parks do more than look pleasant. They absorb rainwater, reduce flooding, clean the air and cool streets during heatwaves — a growing concern as summers become hotter.",
      "Not everyone is convinced. Critics argue that some of these changes mainly benefit wealthier central districts, and that people who live on the outskirts still depend on their cars. Rising property prices in newly 'green' neighbourhoods can also push out the very residents they were meant to help. The challenge for the cities of the future will be to become greener and more efficient without becoming less fair."
    ], [
      ['traffic congestion', 'транспортные заторы'], ['affordable housing', 'доступное жильё'], ['urban planners', 'градостроители'], ['cycle lanes', 'велодорожки'],
      ['elevated motorway', 'эстакада, надземная автомагистраль'], ['green roofs', 'зелёные крыши'], ['outskirts', 'окраины'], ['push out', 'вытеснять']
    ], [
      Q('What proportion of people are expected to live in cities by 2050?', ['One third', 'Half', 'Two thirds', 'Almost everyone'], 2, '«around two thirds of the world\'s population».'),
      Q('What is the main idea of the "15-minute city"?', ['Everyone drives for 15 minutes to work', 'Daily needs are within a short walk or bike ride', 'Shops close after 15 minutes', 'Buses come every 15 minutes'], 1, 'Всё необходимое — в 15 минутах пешком или на велосипеде.'),
      Q('What happened after Seoul replaced a motorway with a stream and park?', ['Traffic chaos followed', 'The area became very popular and cooler', 'The park was closed', 'Critics were proved right'], 1, 'Место стало популярным и понизило летние температуры.'),
      Q('According to the text, green infrastructure only makes cities look nicer.', TFE, 1, 'Деревья и парки ещё поглощают воду, очищают воздух и охлаждают улицы.'),
      Q('What criticism is mentioned in the last paragraph?', ['Parks are too expensive to build', 'Changes may mainly benefit wealthier districts', 'People don\'t like bicycles', 'Cities are growing too slowly'], 1, '«some of these changes mainly benefit wealthier central districts».'),
      Q('The phrase "push out the very residents they were meant to help" refers to…', ['residents leaving because of rising prices', 'residents being moved by the police', 'residents choosing to live abroad', 'residents buying more cars'], 0, 'Рост цен на жильё вытесняет жителей.'),
      Q('The word "congestion" is closest in meaning to…', ['overcrowding', 'cleanliness', 'silence', 'speed'], 0, 'congestion — перегруженность, затор.')
    ]),
    T('t-b2-social', 'B2', 'psychology', 'Social Media and Friendship', 'Соцсети и дружба', [
      "Never before have we been so connected. The average social media user has hundreds of 'friends' or followers and can message people on the other side of the world in seconds. And yet surveys in many countries suggest that loneliness is on the rise, particularly among young adults. How can both things be true at the same time?",
      "Part of the answer lies in the difference between contact and connection. Scrolling through photos of an old classmate's holiday gives us information about their life, but it is not the same as a conversation. Psychologists distinguish between 'active' use of social media — messaging, commenting, arranging to meet — and 'passive' use, such as endlessly scrolling through feeds. Research suggests that passive use is more often associated with envy and low mood, while active use can actually strengthen relationships.",
      "Another issue is comparison. Online, people tend to share the highlights of their lives: the promotion, the perfect beach, the smiling family. When we compare our ordinary, messy reality with other people's carefully selected best moments, we can easily conclude that everyone else is happier and more successful than we are.",
      "At the same time, it would be unfair to blame technology for everything. For people who are isolated — because of illness, disability, shyness or simply living far from their loved ones — online communities can be a lifeline. Many lasting friendships and even marriages have started on the internet.",
      "Perhaps the question is not whether social media is good or bad, but how we use it. A useful rule might be to treat it as a bridge rather than a destination: a tool for organising real contact, not a replacement for it."
    ], [
      ['on the rise', 'растёт, увеличивается'], ['lies in', 'заключается в'], ['scrolling through', 'пролистывание'], ['feeds', 'ленты (новостей)'],
      ['highlights', 'лучшие моменты'], ['blame', 'винить'], ['a lifeline', 'спасательный круг, жизненно важная поддержка'], ['rather than', 'а не, вместо того чтобы']
    ], [
      Q('What paradox does the first paragraph describe?', ['People have fewer friends online', 'People are more connected but lonelier', 'Social media is getting slower', 'Young people avoid technology'], 1, 'Связей больше, а одиночество растёт.'),
      Q('Which is an example of "active" use?', ['Scrolling through feeds', 'Arranging to meet a friend', 'Watching videos', 'Looking at holiday photos'], 1, 'Активное использование — переписка, комментарии, договорённости о встрече.'),
      Q('Passive use is more often linked to envy and low mood.', TFE, 0, 'Так говорится во втором абзаце.'),
      Q('Why can comparison online be harmful?', ['People share only negative news', 'We compare our reality with others\' best moments', 'Photos are low quality', 'Nobody shares anything'], 1, 'Мы сравниваем обычную жизнь с чужими «лучшими моментами».'),
      Q('For whom can online communities be "a lifeline"?', ['Celebrities', 'Isolated people', 'Companies', 'Journalists'], 1, 'Для изолированных людей: из-за болезни, застенчивости, расстояния.'),
      Q('What does the writer suggest in the last paragraph?', ['Deleting all social media', 'Using social media as a bridge to real contact', 'Using social media only at work', 'Posting more photos'], 1, '«treat it as a bridge rather than a destination».'),
      Q('What is the writer\'s overall attitude?', ['Completely negative', 'Balanced', 'Completely positive', 'Indifferent'], 1, 'Автор показывает и минусы, и плюсы.')
    ]),
    T('t-b2-gig', 'B2', 'money', 'The Gig Economy', 'Экономика подработок', [
      "Deliver a pizza, drive a stranger across town, design a logo for a company on another continent — all before lunch. This is the reality of the 'gig economy', a labour market in which people work short-term, task-based jobs, usually arranged through apps and websites, rather than holding a permanent position.",
      "Supporters of the gig economy point to its flexibility. Workers can choose when, where and how much they work. For students, parents with young children or people looking to earn extra income alongside another job, this freedom can be extremely valuable. Companies, meanwhile, can quickly find workers when demand rises and don't have to pay them when it falls.",
      "Critics, however, argue that this flexibility mostly benefits the platforms. In many countries, gig workers are classified as self-employed rather than as employees. As a result, they often have no right to sick pay, paid holidays or a pension, and their income can vary dramatically from week to week. Algorithms decide who gets the next job, and a few poor customer ratings can significantly reduce someone's earnings — sometimes without a clear explanation.",
      "Governments and courts have started to respond. In several countries, legal cases have challenged the idea that drivers and couriers are truly independent, and some platforms have been required to offer basic protections such as a minimum wage. Unions representing gig workers have also begun to form.",
      "The gig economy is unlikely to disappear; for many people it answers a genuine need. The real question is whether it can be reformed so that flexibility no longer has to mean insecurity."
    ], [
      ['gig', 'разовая подработка'], ['task-based jobs', 'работа по отдельным заданиям'], ['permanent position', 'постоянная должность'], ['extra income', 'дополнительный доход'],
      ['self-employed', 'самозанятый'], ['sick pay', 'оплата больничного'], ['customer ratings', 'оценки клиентов'], ['unions', 'профсоюзы']
    ], [
      Q('What is the gig economy based on?', ['Permanent contracts', 'Short-term, task-based jobs', 'Government jobs', 'Family businesses'], 1, 'Краткосрочные разовые работы через приложения.'),
      Q('Which group is mentioned as benefiting from flexibility?', ['Retired managers', 'Students and parents with young children', 'Bank directors', 'Farmers'], 1, 'Студенты, родители маленьких детей, люди, ищущие подработку.'),
      Q('Why can companies benefit from gig work?', ['They pay higher wages', 'They can hire quickly and don\'t pay when demand falls', 'They get government money', 'They don\'t need customers'], 1, 'Об этом конец второго абзаца.'),
      Q('Gig workers are usually entitled to paid holidays.', TFE, 1, 'Чаще всего у них нет права на отпуск и больничный.'),
      Q('What role do algorithms play, according to the text?', ['They pay taxes', 'They decide who gets the next job', 'They train workers', 'They choose prices for customers'], 1, '«Algorithms decide who gets the next job».'),
      Q('How have some governments and courts responded?', ['By banning apps', 'By requiring basic protections like a minimum wage', 'By lowering taxes', 'By doing nothing'], 1, 'Некоторых платформы обязали обеспечить минимальную зарплату.'),
      Q('What is the writer\'s conclusion?', ['The gig economy will disappear soon', 'It should be reformed so flexibility doesn\'t mean insecurity', 'It is perfect as it is', 'Everyone should become a courier'], 1, 'Последний абзац.')
    ]),
    T('t-b2-tea', 'B2', 'history', 'How Tea Conquered Britain', 'Как чай покорил Британию', [
      "Few things seem more typically British than a cup of tea. The British drink tens of millions of cups every day, and 'Shall I put the kettle on?' is a standard response to almost any situation, from good news to a family crisis. Yet tea is not native to Britain at all. It arrived there only in the seventeenth century, and for a long time it was a luxury.",
      "Tea had been drunk in China for thousands of years before European traders brought it to Europe. In Britain its popularity is often linked to Catherine of Braganza, the Portuguese princess who married King Charles II in 1662. She was already fond of tea, and her habit made it fashionable among the aristocracy.",
      "For most of the eighteenth century, however, tea was extremely expensive, partly because of very high taxes. As a result, smuggling became a huge business. Criminal gangs brought tea into the country illegally, and a lot of the tea that ordinary people drank was smuggled — or mixed with leaves from other plants to make it go further. In 1784 the government dramatically cut the tax, and smuggling almost disappeared overnight.",
      "As prices fell, tea became the drink of the whole nation, including the working classes. Later, the British began producing tea in their colonies, especially in India, which made it cheaper still. In the 1840s the custom of 'afternoon tea' — tea with sandwiches and cakes in the late afternoon — became fashionable, a tradition often credited to Anna, Duchess of Bedford, who complained of feeling hungry between lunch and a late dinner.",
      "Today tea bags have largely replaced loose leaves, and coffee shops fill British high streets. But tea remains a symbol of comfort and hospitality. Its history, however, is also a reminder of trade, empire and the complicated paths by which everyday habits are formed."
    ], [
      ['put the kettle on', 'поставить чайник'], ['native to', 'родом из, исконный для'], ['fond of', 'любящий (be fond of — любить)'], ['smuggling', 'контрабанда'],
      ['make it go further', 'чтобы хватило надольше'], ['overnight', 'в одночасье'], ['credited to', 'приписывается (кому-то)'], ['loose leaves', 'листовой (рассыпной) чай']
    ], [
      Q('When did tea arrive in Britain?', ['In the 12th century', 'In the 17th century', 'In the 19th century', 'In the 20th century'], 1, '«It arrived there only in the seventeenth century».'),
      Q('Who is linked to tea becoming fashionable in Britain?', ['Queen Victoria', 'Catherine of Braganza', 'Anna, Duchess of Bedford', 'King Henry VIII'], 1, 'Португальская принцесса, жена Карла II.'),
      Q('Why was smuggling so common in the 18th century?', ['Tea was banned', 'Taxes on tea were very high', 'Ships could not reach Britain', 'People preferred coffee'], 1, 'Из-за очень высоких налогов.'),
      Q('What happened after the tax was cut in 1784?', ['Smuggling increased', 'Smuggling almost disappeared', 'Tea became illegal', 'Prices went up'], 1, '«smuggling almost disappeared overnight».'),
      Q('Afternoon tea became fashionable in the 1840s.', TFE, 0, '«In the 1840s the custom of \'afternoon tea\'… became fashionable».'),
      Q('Why, according to the story, did the Duchess of Bedford start afternoon tea?', ['She disliked coffee', 'She felt hungry between lunch and a late dinner', 'Her doctor recommended it', 'She wanted to sell tea'], 1, 'Она жаловалась на голод между обедом и поздним ужином.'),
      Q('What does the last paragraph suggest?', ['Tea is no longer drunk in Britain', 'Everyday habits can have complicated histories', 'Coffee is more British than tea', 'Tea bags are illegal'], 1, 'История чая напоминает о торговле и империи.')
    ]),
    T('t-b2-failure', 'B2', 'psychology', 'The Upside of Failure', 'Польза неудач', [
      "Most of us are taught from an early age that failure is something to avoid. We are praised for good grades, winning games and getting things right the first time. It is hardly surprising, then, that many adults are terrified of making mistakes. Yet a growing body of research suggests that failure, handled in the right way, is one of the most powerful drivers of learning.",
      "Consider how a child learns to walk. They fall hundreds of times, but nobody tells them they are 'bad at walking'. Each fall provides feedback about balance and movement. Adults, by contrast, often interpret a single failure as proof that they lack talent. The psychologist Carol Dweck calls this a 'fixed mindset': the belief that abilities are set and cannot really be changed. People with a 'growth mindset', on the other hand, see abilities as something that can be developed through effort and practice — and they tend to persist longer when things get difficult.",
      "Failure also plays a central role in innovation. Many successful products were preceded by long series of unsuccessful attempts. Some organisations now deliberately encourage 'intelligent failures' — small, well-designed experiments that may not work, but from which the team can learn quickly and cheaply. The key is to fail early, when the cost is low, rather than late, when it is high.",
      "Of course, not every failure is useful. Repeating the same mistake without reflecting on it teaches us very little, and some errors — in medicine or aviation, for instance — can have serious consequences. That is why these industries place so much emphasis on analysing mistakes openly rather than hiding them.",
      "So the next time something goes wrong, it may help to ask a different question. Instead of 'Why am I so bad at this?', try 'What can I learn from this?' It sounds simple, but that small change in perspective can turn a setback into a step forward."
    ], [
      ['it is hardly surprising', 'неудивительно'], ['a growing body of research', 'всё больше исследований'], ['drivers of learning', 'движущие силы обучения'], ['by contrast', 'напротив, в отличие от этого'],
      ['fixed mindset', 'установка на данность'], ['growth mindset', 'установка на рост'], ['were preceded by', 'им предшествовали'], ['setback', 'неудача, откат']
    ], [
      Q('What does the first paragraph say many adults are afraid of?', ['Success', 'Making mistakes', 'Children', 'Research'], 1, '«many adults are terrified of making mistakes».'),
      Q('Why does the writer mention a child learning to walk?', ['To show that falling is dangerous', 'To show that failures provide useful feedback', 'To show that children are lazy', 'To talk about sport'], 1, 'Каждое падение — обратная связь.'),
      Q('A person with a "fixed mindset" believes that…', ['abilities can be developed', 'abilities cannot really change', 'effort is everything', 'failure is fun'], 1, 'Способности заданы и не меняются.'),
      Q('People with a growth mindset tend to give up more quickly.', TFE, 1, 'Наоборот: «they tend to persist longer».'),
      Q('What are "intelligent failures"?', ['Mistakes made by clever people', 'Small, well-designed experiments that may not work', 'Failures that are hidden', 'Expensive late mistakes'], 1, 'Небольшие продуманные эксперименты, из которых можно быстро учиться.'),
      Q('Why do medicine and aviation analyse mistakes openly?', ['Because errors there can have serious consequences', 'Because they rarely make mistakes', 'Because it is required by customers', 'Because it saves time'], 0, 'Ошибки там могут иметь серьёзные последствия.'),
      Q('Which question does the writer recommend asking after a failure?', ['Why am I so bad at this?', 'Who is to blame?', 'What can I learn from this?', 'Should I stop trying?'], 2, 'Последний абзац.')
    ]),

    /* ================= C1 ================= */
    T('t-c1-attention', 'C1', 'tech', 'The Attention Economy', 'Экономика внимания', [
      "In 1971, long before smartphones existed, the economist and psychologist Herbert Simon made a remarkably prescient observation: a wealth of information, he wrote, creates a poverty of attention. Half a century later, his remark reads less like a prediction than a description of everyday life.",
      "Many of the most profitable technology companies in the world offer their core services for free. They are, of course, not charities. What they sell is access to our attention, which advertisers are willing to pay for. In this so-called attention economy, the user is not merely the customer but, in a sense, the product. The longer we stay on a platform, the more data can be gathered and the more advertisements can be shown.",
      "It is hardly surprising, then, that apps are meticulously engineered to be difficult to put down. Infinite scrolling removes natural stopping points; autoplay starts the next video before we have decided whether we want to watch it; notifications, often coloured red to signal urgency, pull us back when our attention drifts elsewhere. Some designers have openly acknowledged borrowing techniques from slot machines, where unpredictable rewards prove particularly compelling.",
      "The costs are harder to quantify than the profits, but they are real. Frequent interruptions fragment concentration, and research on multitasking suggests that switching between tasks carries a cognitive cost that we tend to underestimate. There are also broader concerns: algorithms optimised for engagement may inadvertently favour content that provokes outrage, since strong emotions keep people clicking.",
      "Critics are not arguing that technology is inherently harmful, nor that individuals are powerless. Turning off non-essential notifications, keeping phones out of the bedroom and scheduling periods of uninterrupted work can all help. Yet placing the entire burden on individual willpower seems somewhat naive when the other side of the screen employs teams of engineers whose job is to capture as much of that attention as possible. A growing number of voices are therefore calling for regulation and for design standards that respect, rather than exploit, the limits of the human mind."
    ], [
      ['prescient', 'провидческий, дальновидный'], ['core services', 'основные услуги'], ['in a sense', 'в некотором смысле'], ['infinite scrolling', 'бесконечная прокрутка'],
      ['stopping points', 'точки остановки'], ['slot machines', 'игровые автоматы'], ['cognitive cost', 'когнитивная цена, нагрузка на мозг'], ['engagement', 'вовлечённость'],
      ['the entire burden', 'всё бремя (ответственности)']
    ], [
      Q('What did Herbert Simon predict in 1971?', ['That computers would replace workers', 'That abundant information would make attention scarce', 'That advertising would disappear', 'That smartphones would be invented'], 1, '«a wealth of information creates a poverty of attention».'),
      Q('According to the text, what do many free platforms actually sell?', ['Software licences', 'Access to users\' attention', 'Hardware', 'Subscriptions'], 1, 'Доступ к нашему вниманию для рекламодателей.'),
      Q('Which design feature is described as removing "natural stopping points"?', ['Autoplay', 'Infinite scrolling', 'Red notifications', 'Dark mode'], 1, '«Infinite scrolling removes natural stopping points».'),
      Q('Why are slot machines mentioned?', ['Because apps are used for gambling', 'Because unpredictable rewards are especially compelling', 'Because designers dislike them', 'Because they use red colours'], 1, 'Непредсказуемые награды особенно затягивают.'),
      Q('The writer claims that technology is inherently harmful.', TFE, 1, '«Critics are not arguing that technology is inherently harmful».'),
      Q('Why might algorithms favour outrage-provoking content?', ['It is cheaper to produce', 'Strong emotions keep people clicking', 'Advertisers demand it', 'It is more accurate'], 1, '«strong emotions keep people clicking».'),
      Q('What is the writer\'s view on relying only on individual willpower?', ['It is the only solution', 'It is somewhat naive', 'It is unnecessary', 'It is too expensive'], 1, '«placing the entire burden on individual willpower seems somewhat naive».'),
      Q('The word "prescient" is closest in meaning to…', ['outdated', 'far-sighted', 'careless', 'mistaken'], 1, 'prescient — предвидящий будущее.')
    ]),
    T('t-c1-machines', 'C1', 'work', 'Will Machines Take Our Jobs?', 'Отнимут ли машины нашу работу?', [
      "Anxiety about machines replacing human workers is hardly new. In early nineteenth-century England, the Luddites famously smashed textile machinery they blamed for destroying their livelihoods. In the 1960s, commentators warned that automation would soon leave millions permanently unemployed. Each time, the gloomiest predictions failed to materialise: technology eliminated some jobs, but it also created new ones, many of which could scarcely have been imagined beforehand.",
      "Why, then, do many economists argue that the current wave of artificial intelligence may be different? Previous waves of automation mainly affected routine manual tasks. Modern AI systems, by contrast, are increasingly capable of performing cognitive work — drafting documents, analysing data, writing code, translating texts — that was long assumed to be the exclusive domain of educated professionals.",
      "The picture, however, is more nuanced than headlines suggest. Most jobs consist of a bundle of different tasks, only some of which can be automated. A radiologist, for instance, does not merely examine images; she also consults colleagues, communicates with patients and makes judgements in ambiguous cases. It is therefore more accurate to speak of tasks being automated than of entire professions vanishing overnight. In many cases, AI is likely to augment human work rather than supersede it, handling tedious elements and freeing people to focus on what machines do poorly.",
      "Nevertheless, the transition could be painful. Even if new jobs emerge, they may not appear in the same places or require the same skills as those that are lost. A fifty-year-old administrator whose role is automated cannot necessarily retrain as a data engineer. The benefits of productivity gains may also be unevenly distributed, accruing largely to the owners of technology.",
      "The central question, then, is less whether machines will take our jobs than how societies will manage the change. Investment in lifelong learning, social safety nets that cushion transitions, and policies that share the gains more widely may well determine whether this technological revolution widens inequality or, like some of its predecessors, ultimately raises living standards for the majority."
    ], [
      ['Luddites', 'луддиты (противники машин в XIX веке)'], ['failed to materialise', 'не сбылись'], ['exclusive domain', 'исключительная сфера'], ['a bundle of different tasks', 'набор разных задач'],
      ['augment', 'дополнять, усиливать'], ['supersede', 'заменять, вытеснять'], ['accruing largely to', 'достающийся в основном (кому-то)'], ['safety nets', 'системы социальной защиты'], ['cushion', 'смягчать']
    ], [
      Q('Why does the writer mention the Luddites and the 1960s?', ['To show that such fears have a long history', 'To prove that machines are dangerous', 'To praise textile workers', 'To criticise economists'], 0, 'Страх перед автоматизацией — не новость.'),
      Q('According to economists, how is AI different from earlier automation?', ['It only affects factory work', 'It can perform cognitive tasks done by professionals', 'It is cheaper', 'It creates no new jobs'], 1, 'ИИ выполняет когнитивную работу.'),
      Q('What point does the radiologist example illustrate?', ['Radiologists will disappear soon', 'Jobs consist of many tasks, only some automatable', 'Doctors dislike technology', 'Images are hard to analyse'], 1, 'Профессия — это набор задач.'),
      Q('The writer believes entire professions will vanish overnight.', TFE, 1, 'Точнее говорить об автоматизации отдельных задач.'),
      Q('Why might the transition be painful even if new jobs appear?', ['New jobs pay more', 'New jobs may require different skills and be in different places', 'People don\'t want new jobs', 'Governments forbid retraining'], 1, 'Четвёртый абзац.'),
      Q('In the text, "augment" is closest in meaning to…', ['replace', 'enhance', 'destroy', 'delay'], 1, 'augment — усиливать, дополнять.'),
      Q('What, according to the conclusion, will largely determine the outcome?', ['The speed of computers', 'How societies manage the change', 'The number of engineers', 'Consumer preferences'], 1, '«how societies will manage the change».'),
      Q('What is the overall tone of the article?', ['Alarmist', 'Measured and analytical', 'Humorous', 'Dismissive'], 1, 'Автор взвешенно разбирает аргументы.')
    ]),
    T('t-c1-choice', 'C1', 'psychology', 'The Paradox of Choice', 'Парадокс выбора', [
      "Conventional wisdom holds that more choice is always better. If one type of jam is good, surely twenty-four are better still: whatever your taste, you are bound to find something that suits you. Yet a body of psychological research, popularised by the American psychologist Barry Schwartz, suggests that beyond a certain point an abundance of options can leave us less satisfied rather than more.",
      "One frequently cited study took place in an upmarket supermarket. Researchers set up a tasting stand that displayed either six or twenty-four varieties of jam. The larger display attracted more shoppers, but those who saw the smaller selection were far more likely to actually buy a jar. Faced with too many alternatives, people appeared to find the decision so daunting that they simply postponed it.",
      "Even when we do choose, a wide range of options can undermine our satisfaction. The more alternatives we reject, the more easily we can imagine that one of them would have been better — a phenomenon sometimes described as anticipated regret. Expectations rise too: when there are hundreds of options, it seems reasonable to expect that one of them will be perfect, and anything less feels like a personal failure.",
      "Schwartz distinguishes between 'maximisers', who feel compelled to find the best possible option, and 'satisficers', who settle for something that meets their criteria and then stop searching. Maximisers often make objectively better decisions — they may, for instance, land higher-paid jobs — yet they frequently report feeling less happy with the outcome.",
      "It should be said that later attempts to replicate the jam study have produced mixed results, and the effect seems to depend heavily on context. Nevertheless, the broader insight has proved influential. For individuals, it suggests the value of deliberately limiting options, setting 'good enough' criteria and accepting that most decisions are reversible. For designers and policymakers, it implies that thoughtfully curated choices may serve people better than an endless menu."
    ], [
      ['conventional wisdom', 'общепринятое мнение'], ['you are bound to', 'вы обязательно (непременно)'], ['upmarket', 'дорогой, престижный'], ['tasting stand', 'дегустационный стенд'],
      ['anticipated regret', 'предвосхищаемое сожаление'], ['settle for', 'довольствоваться'], ['replicate', 'воспроизвести (исследование)'], ['curated choices', 'тщательно отобранные варианты']
    ], [
      Q('What does "conventional wisdom" hold about choice?', ['Less choice is better', 'More choice is always better', 'Choice doesn\'t matter', 'Only experts should choose'], 1, 'Первое предложение текста.'),
      Q('What was the key finding of the jam study?', ['More people bought jam from the large display', 'The small display led to far more purchases', 'Nobody bought any jam', 'Prices affected sales most'], 1, 'Покупали гораздо чаще при шести вариантах.'),
      Q('Why might many options reduce satisfaction even after choosing?', ['Products are of lower quality', 'We imagine rejected options would have been better', 'Choosing takes too little time', 'Shops raise prices'], 1, 'Предвосхищаемое сожаление.'),
      Q('How do "satisficers" behave?', ['They search until they find the best option', 'They accept an option that meets their criteria', 'They never choose', 'They let others decide'], 1, 'Довольствуются тем, что отвечает их критериям.'),
      Q('Maximisers usually feel happier with their decisions.', TFE, 1, 'Они часто менее довольны результатом.'),
      Q('What does the writer say about attempts to replicate the jam study?', ['They confirmed it exactly', 'They produced mixed results', 'They were never made', 'They proved it false'], 1, '«produced mixed results».'),
      Q('Which piece of advice follows from the text?', ['Always consider every option', 'Set "good enough" criteria', 'Avoid all decisions', 'Choose randomly'], 1, 'Последний абзац.'),
      Q('The word "daunting" is closest in meaning to…', ['intimidating', 'boring', 'cheap', 'pleasant'], 0, 'daunting — пугающий (своей сложностью).')
    ]),
    T('t-c1-rewilding', 'C1', 'nature', 'Rewilding the City', 'Возвращение дикой природы в город', [
      "For most of modern history, cities were defined in opposition to nature. Wilderness was something to be tamed, drained or paved over; progress meant straight roads, tidy lawns and rivers confined to concrete channels. In recent decades, however, a quiet reversal has been under way. Urban planners, ecologists and local communities are increasingly asking not how to keep nature out of cities, but how to invite it back in.",
      "The movement is often described as 'urban rewilding', though the term covers a wide range of practices. At one end of the spectrum are modest interventions: leaving roadside verges unmown so that wildflowers can flourish, installing nesting boxes for birds and bats, or replacing ornamental lawns with native plants that support insects. At the other are ambitious projects such as 'daylighting' rivers that had been buried in underground pipes, or converting disused railway lines and industrial sites into semi-wild corridors that connect fragmented habitats.",
      "The rationale is partly ecological. Pollinating insects have suffered alarming declines, and even small patches of suitable habitat, if linked together, can provide vital stepping stones. But the benefits extend well beyond biodiversity. Vegetation absorbs stormwater, mitigating the flooding that impermeable surfaces exacerbate; tree canopies can lower street temperatures appreciably during heatwaves; and a substantial body of evidence associates access to green space with better mental and physical health.",
      "Rewilding is not without its detractors. Some residents perceive unmown verges and overgrown parks as a sign of neglect rather than design, and there are legitimate concerns about maintenance, safety and the spread of allergenic plants. Proponents counter that such objections can largely be addressed through careful communication — a neatly mown border around a wildflower meadow, for instance, signals that the wildness is intentional.",
      "Ultimately, urban rewilding challenges a deeply ingrained assumption: that human spaces and wild spaces must be kept apart. If it succeeds, the cities of the future may be places where the boundary between the two is not a wall but a gradient."
    ], [
      ['defined in opposition to', 'определялись как противоположность'], ['tamed', 'укрощённый'], ['under way', 'идёт, происходит'], ['roadside verges', 'обочины (травяные полосы)'],
      ['daylighting', 'вскрытие подземных рек (возвращение их на поверхность)'], ['stepping stones', 'перевалочные пункты, «ступеньки»'], ['impermeable surfaces', 'водонепроницаемые покрытия'],
      ['detractors', 'критики, противники'], ['deeply ingrained', 'глубоко укоренившийся']
    ], [
      Q('How were cities traditionally related to nature, according to the text?', ['They were built to protect wilderness', 'They were defined in opposition to it', 'They ignored rivers', 'They copied natural forms'], 1, 'Первое предложение.'),
      Q('Which is an example of a "modest intervention"?', ['Daylighting a buried river', 'Leaving roadside verges unmown', 'Converting a railway line', 'Building a new park district'], 1, 'Скромные меры — некошеные обочины, скворечники, местные растения.'),
      Q('Why are linked patches of habitat important?', ['They are cheaper to maintain', 'They act as stepping stones for species', 'They attract tourists', 'They stop traffic'], 1, '«can provide vital stepping stones».'),
      Q('According to the text, vegetation can reduce flooding.', TFE, 0, '«Vegetation absorbs stormwater, mitigating the flooding».'),
      Q('What objection do some residents raise?', ['Wildflowers are too expensive', 'Overgrown areas look neglected', 'Birds are too noisy', 'Rivers smell bad'], 1, 'Воспринимают как запущенность.'),
      Q('What does a neatly mown border around a meadow signal?', ['That the council has no money', 'That the wildness is intentional', 'That the meadow will be removed', 'That entry is forbidden'], 1, 'Что «дикость» — намеренная.'),
      Q('What does the final sentence suggest?', ['Cities should be walled off from nature', 'The boundary between human and wild spaces may become gradual', 'Nature will replace cities', 'Rewilding will fail'], 1, 'Граница — не стена, а плавный переход.'),
      Q('In the text, "exacerbate" means…', ['make worse', 'prevent', 'measure', 'ignore'], 0, 'exacerbate — усугублять.')
    ]),
    T('t-c1-memory', 'C1', 'science', 'The Unreliable Witness', 'Ненадёжный свидетель', [
      "We tend to think of memory as a kind of video recording: an event happens, the brain stores it, and when we remember, we simply press 'play'. Decades of research have shown this intuitive model to be profoundly misleading. Memory is not a recording but a reconstruction, assembled anew each time we recall an event — and, crucially, it is susceptible to distortion along the way.",
      "Some of the most influential work in this field was carried out by the American psychologist Elizabeth Loftus. In a classic experiment from the 1970s, participants watched film of a car accident and were then asked how fast the cars had been going when they either 'hit' or 'smashed into' each other. Those who heard the word 'smashed' gave significantly higher estimates. A week later, they were also more likely to report having seen broken glass — even though there had been none in the film. A single verb had subtly rewritten their recollection.",
      "Subsequent studies went further, demonstrating that it is possible to implant memories of entire events that never occurred, such as being lost in a shopping centre as a child. Participants who were repeatedly encouraged to imagine such scenes sometimes came to 'remember' them in considerable detail, and with genuine conviction.",
      "The implications are far from academic. Eyewitness testimony has long been regarded as highly persuasive evidence in court, yet mistaken identification has been identified as a contributing factor in a considerable proportion of wrongful convictions later overturned by DNA evidence. Leading questions, suggestive line-up procedures and even well-intentioned conversations with other witnesses can all contaminate what a person believes they saw.",
      "None of this means that memory is worthless; for most everyday purposes it serves us remarkably well. But confidence, it turns out, is a poor guide to accuracy. Recognising the reconstructive nature of memory has prompted reforms in police interviewing and identification procedures — and it might also encourage a measure of humility the next time we insist that we remember something exactly as it happened."
    ], [
      ['assembled anew', 'собираемый заново'], ['susceptible to', 'подверженный'], ['recollection', 'воспоминание'], ['implant memories', 'внедрять ложные воспоминания'],
      ['eyewitness testimony', 'показания очевидцев'], ['wrongful convictions', 'ошибочные приговоры'], ['leading questions', 'наводящие вопросы'], ['line-up', 'опознание (подозреваемых)'],
      ['a measure of humility', 'некоторая доля скромности']
    ], [
      Q('What model of memory does the writer reject?', ['Memory as reconstruction', 'Memory as a video recording', 'Memory as emotion', 'Memory as a muscle'], 1, 'Память — не видеозапись, а реконструкция.'),
      Q('In Loftus\'s experiment, what effect did the word "smashed" have?', ['Lower speed estimates', 'Higher speed estimates and false memories of glass', 'No effect', 'Participants refused to answer'], 1, 'Оценки скорости выше, а через неделю — «вспоминали» битое стекло.'),
      Q('There was broken glass in the film.', TFE, 1, '«even though there had been none in the film».'),
      Q('What did later studies demonstrate?', ['Memories cannot be changed', 'Memories of entire false events can be implanted', 'Children remember better than adults', 'Shopping centres cause stress'], 1, 'Можно внедрить воспоминание о целом событии.'),
      Q('Why is this research important for courts?', ['Judges have poor memories', 'Mistaken identification contributes to wrongful convictions', 'DNA evidence is unreliable', 'Witnesses always lie'], 1, 'Ошибочное опознание — фактор ошибочных приговоров.'),
      Q('According to the writer, confidence is…', ['a reliable sign of accuracy', 'a poor guide to accuracy', 'unrelated to memory', 'a result of training'], 1, '«confidence… is a poor guide to accuracy».'),
      Q('What practical change has the research prompted?', ['Banning witnesses', 'Reforms in police interviewing and identification', 'More video cameras in homes', 'Shorter trials'], 1, 'Последний абзац.'),
      Q('"Susceptible to distortion" means…', ['immune to change', 'easily affected by distortion', 'impossible to recall', 'recorded accurately'], 1, 'Подверженный искажениям.')
    ]),
    T('t-c1-overwork', 'C1', 'society', 'The Cult of Busyness', 'Культ занятости', [
      "Ask someone how they are these days and there is a good chance they will reply, with a mixture of complaint and pride, that they are 'crazy busy'. Busyness has quietly become a status symbol. Whereas leisure once signalled wealth and privilege, today being overscheduled suggests that one is in demand, important, indispensable.",
      "This shift is striking given that, in many developed countries, average working hours are considerably lower than they were a century ago. Why, then, do so many people feel perpetually short of time? Part of the explanation lies in the blurring of boundaries. Smartphones and remote work mean that the office is never entirely out of reach; an evening at home can be punctuated by emails that seem to demand an immediate reply. Time may not be objectively scarcer, but it is more fragmented.",
      "There is also a cultural dimension. In many professional environments, long hours are conspicuously rewarded, and visible exhaustion can be mistaken for dedication. Yet research on productivity consistently suggests that beyond a certain threshold, additional hours yield sharply diminishing returns. Fatigue impairs judgement, creativity suffers, and errors multiply — hardly the ingredients of outstanding work.",
      "Some organisations have begun to experiment with alternatives. Trials of a four-day working week, conducted in several countries, have in many cases reported that productivity was maintained while employee well-being improved markedly. Others have introduced policies discouraging emails outside working hours. Such initiatives remain far from universal, and their results are not uniformly positive, but they suggest that the equation of long hours with commitment is neither inevitable nor necessarily efficient.",
      "Perhaps the deeper question is what we are trying to prove. If our sense of worth is tied to how occupied we appear, rest will always feel like a kind of failure. Reclaiming time for reflection, relationships and idleness is not a sign of laziness; it may be precisely what allows us to do our best work — and to remember why we wanted to do it in the first place."
    ], [
      ['crazy busy', 'безумно занят'], ['overscheduled', 'с перегруженным графиком'], ['in demand', 'востребованный'], ['out of reach', 'вне досягаемости'],
      ['punctuated by', 'прерываемый'], ['diminishing returns', 'убывающая отдача'], ['four-day working week', 'четырёхдневная рабочая неделя'], ['in the first place', 'изначально, вообще']
    ], [
      Q('What does being busy signal today, according to the writer?', ['Poverty', 'Status and importance', 'Laziness', 'Illness'], 1, 'Занятость стала символом статуса.'),
      Q('What contrast does the writer draw with the past?', ['People worked less then', 'Leisure once signalled wealth', 'Nobody had jobs', 'Offices were bigger'], 1, '«leisure once signalled wealth and privilege».'),
      Q('Why do people feel short of time even though working hours have fallen?', ['They sleep more', 'Time is more fragmented and boundaries are blurred', 'Commutes are longer', 'Holidays are shorter'], 1, 'Время раздроблено, границы размыты.'),
      Q('Research suggests that extra hours always increase productivity.', TFE, 1, 'После определённого порога отдача резко падает.'),
      Q('What have trials of a four-day week often reported?', ['Productivity collapsed', 'Productivity was maintained and well-being improved', 'Employees disliked it', 'Costs doubled'], 1, 'Четвёртый абзац.'),
      Q('"Diminishing returns" means…', ['growing profits', 'less benefit from each additional effort', 'free time', 'higher salaries'], 1, 'Убывающая отдача.'),
      Q('What is the writer\'s main argument in the last paragraph?', ['Rest is a sign of failure', 'Reclaiming time for rest may help us do our best work', 'Everyone should work more', 'Idleness is dangerous'], 1, 'Отдых — не лень, а условие хорошей работы.'),
      Q('Which word best describes the writer\'s attitude to the "cult of busyness"?', ['Admiring', 'Critical', 'Neutral', 'Enthusiastic'], 1, 'Автор критически относится к культу занятости.')
    ])
  ];

  D.textsById = Object.create(null); // без прототипа: id «constructor» из backup не найдёт Object
  D.texts.forEach(function (t, i) {
    t.order = i;
    t.words = t.paragraphs.join(' ').split(/\s+/).filter(Boolean).length;
    D.textsById[t.id] = t;
  });
})(window.EG = window.EG || {});
