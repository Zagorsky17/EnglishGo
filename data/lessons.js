/* data/lessons.js — темы (ситуации) и уроки.
   Уроки собираются автоматически: тема × уровень → выражения из словаря + связанные диалоги и сценарии.
   tips — грамматика только там, где она помогает говорить. */
(function (EG) {
  'use strict';

  var D = EG.data = EG.data || {};

  D.levelNames = {
    A1: 'Начальный', A2: 'Элементарный', B1: 'Средний', B2: 'Выше среднего', C1: 'Продвинутый'
  };

  D.topics = {
    greetings: {
      title: 'Знакомство и приветствия', emoji: '👋', subtitle: 'Первые 30 секунд разговора',
      intro: 'Как поздороваться, представиться и попрощаться так, чтобы звучать естественно. Носители почти не говорят «Hello, how are you? — I am fine, thank you» — посмотрим, что говорят на самом деле.',
      tips: {
        A1: 'How are you? / How\'s it going? — это приветствие, а не вопрос о здоровье. Отвечайте коротко (Good, thanks!) и возвращайте вопрос: You?',
        A2: 'После разлуки — Present Perfect: How have you been? — I\'ve been good. Он связывает прошлое с «сейчас».',
        B1: 'Чтобы самому начать знакомство, используйте мягкие фразы: I don\'t think we\'ve met. Сразу после — назовите себя.',
        all: 'Прощание — тоже ритуал: It was nice talking to you / Take care / Let\'s keep in touch.'
      }
    },
    smalltalk: {
      title: 'Small talk', emoji: '☕', subtitle: 'Лёгкий разговор ни о чём — и обо всём',
      intro: 'Small talk — это не пустая болтовня, а способ наладить контакт. Погода, выходные, общие знакомые — безопасные темы. Главный секрет: отвечайте с деталью и задавайте встречный вопрос.',
      tips: {
        A2: 'Me too — на утверждение (I\'m tired. — Me too). Me neither — на отрицание (I don\'t like it. — Me neither).',
        B1: 'Хвостики isn\'t it? / right? / huh? превращают фразу в приглашение к разговору: Nice day, isn\'t it?',
        all: 'Формула: короткий ответ + деталь + встречный вопрос. «Good, thanks. We went to the lake. How about you?»'
      }
    },
    cafe: {
      title: 'Кафе и ресторан', emoji: '🍽️', subtitle: 'Заказать, уточнить, оплатить',
      intro: 'Вежливый заказ строится не на I want, а на Can I get… / I\'ll have… / Could I have… В ответ на вопрос-выбор (For here or to go?) достаточно одного слова + please.',
      tips: {
        A1: 'I want звучит требовательно, как у ребёнка. Используйте Can I get…? или I\'ll have… — и всегда please.',
        B1: 'Жалоба «сэндвичем»: Sorry, … + проблема + просьба. «Sorry, this isn\'t what I ordered. Could I get the pasta?»',
        all: 'Could звучит мягче, чем can. Would you mind…? — ещё мягче.'
      }
    },
    shop: {
      title: 'Магазин', emoji: '🛍️', subtitle: 'Примерить, выбрать, вернуть',
      intro: 'Как отказаться от помощи продавца, попросить другой размер, спросить про скидку и вернуть товар.',
      tips: {
        A1: 'I\'ll take it — «беру». Will здесь — решение, принятое прямо сейчас. I take it так не работает.',
        A2: 'fit — подходить по размеру, suit — идти по стилю. It doesn\'t fit (мал/велик) ≠ It doesn\'t suit me (не идёт).',
        all: 'a bit смягчает любую критику: It\'s a bit expensive / a bit too long.'
      }
    },
    travel: {
      title: 'Аэропорт и путешествия', emoji: '✈️', subtitle: 'Регистрация, контроль, пересадки',
      intro: 'Фразы, которые нужно понимать на слух в аэропорту, и короткие ответы на стандартные вопросы паспортного контроля.',
      tips: {
        A2: 'Для планов используйте Present Continuous: I\'m staying for two weeks / I\'m flying to Rome tomorrow.',
        B1: 'luggage и baggage — неисчисляемые: my luggage, one bag / two suitcases (не two luggages).',
        all: 'На вопросы офицеров отвечайте коротко и точно — длинные объяснения только запутывают.'
      }
    },
    hotel: {
      title: 'Отель', emoji: '🏨', subtitle: 'Заселение, просьбы, жалобы',
      intro: 'Заселиться, задать важные вопросы и вежливо решить проблему с номером.',
      tips: {
        B1: 'Would it be possible to…? — универсальная вежливая просьба. Работает в отеле, на работе, в любом сервисе.',
        B2: 'There seems to be a problem with… — жалоба без обвинений. Так проблему решают быстрее.',
        all: 'Начинайте просьбу с Hi / Excuse me и заканчивайте Thank you — это половина успеха.'
      }
    },
    city: {
      title: 'Город и транспорт', emoji: '🚕', subtitle: 'Дорога, такси, общественный транспорт',
      intro: 'Спросить дорогу, понять объяснение, взять такси и не потеряться в метро.',
      tips: {
        A1: 'Повторите маршрут вслух: «Straight, then left at the bank — got it». Так вы проверите, что поняли.',
        B1: 'get on / get off — автобус, поезд. get in / get out of — машина, такси.',
        all: 'You can\'t miss it — «точно не пропустите». Это подбадривание, а не вопрос.'
      }
    },
    phone: {
      title: 'Телефонные разговоры', emoji: '📞', subtitle: 'Звонки без паники',
      intro: 'По телефону сложнее: нет мимики и жестов. Эти фразы помогут представиться, попросить нужного человека и справиться с плохой связью.',
      tips: {
        A1: 'По телефону представляются через this is: «Hi, this is Anna». Не I am Anna.',
        A2: 'Не бойтесь переспрашивать: Sorry, could you repeat that? / Could you speak a little slower? — носители делают так же.',
        all: 'Сразу называйте цель звонка: I\'m calling about… Это экономит время обоим.'
      }
    },
    work: {
      title: 'Работа и офис', emoji: '💼', subtitle: 'Встречи, задачи, переговоры',
      intro: 'Деловой английский — это не сложные слова, а вежливые и чёткие конструкции: уточнить, предложить, мягко возразить.',
      tips: {
        B1: 'I didn\'t catch that звучит лучше, чем I don\'t understand: проблема в том, что вы не расслышали, а не в вас.',
        B2: 'Смягчители: I\'m afraid…, I\'d suggest…, Just to clarify… — делают речь профессиональной.',
        C1: 'Несогласие в два шага: признать (I take your point) + возразить с фактами (…but the numbers show…).',
        all: 'Будущее время для обещаний: I\'ll get it done by Friday / I\'ll get back to you.'
      }
    },
    health: {
      title: 'Здоровье', emoji: '🩺', subtitle: 'Врач, аптека, самочувствие',
      intro: 'Описать симптомы, записаться к врачу и понять рекомендации.',
      tips: {
        A2: 'Лекарства take, а не drink: take a pill, take medicine.',
        B1: 'Для симптомов, которые длятся: I\'ve had a headache for two days / I\'ve been feeling dizzy since Monday.',
        all: 'prescription — рецепт на лекарство. recipe — рецепт блюда. Частая путаница!'
      }
    },
    plans: {
      title: 'Планы и приглашения', emoji: '📅', subtitle: 'Договориться, согласиться, перенести',
      intro: 'Как пригласить, согласиться с энтузиазмом, вежливо отказаться и перенести встречу.',
      tips: {
        A2: 'Отказ всегда смягчают: Sorry, I can\'t… + причина + Maybe another time.',
        B1: 'I can\'t make it — самый естественный способ сказать «не смогу прийти».',
        all: 'Does Friday work for you? — лучший способ предложить время.'
      }
    },
    reactions: {
      title: 'Реакции и эмоции', emoji: '😮', subtitle: 'Живой отклик на слова собеседника',
      intro: 'Разговор — это не только ответы, но и реакции. Правильная реакция показывает, что вы слушаете и сопереживаете.',
      tips: {
        A2: 'I\'m sorry to hear that — сочувствие, а не извинение. Sorry в английском шире русского «извините».',
        B1: 'Tell me about it! — «И не говори!», а не просьба рассказать. Слушайте интонацию.',
        all: 'Хорошие новости → That\'s great! / Good for you! Плохие → Oh no / I\'m sorry to hear that.'
      }
    },
    opinions: {
      title: 'Мнения и обсуждения', emoji: '💬', subtitle: 'Согласиться, возразить, аргументировать',
      intro: 'Как выразить мнение, мягко не согласиться и поддержать дискуссию без конфликта.',
      tips: {
        A2: 'I think so / I don\'t think so — не I think yes / I think no.',
        B2: 'I couldn\'t agree more — это сильное СОГЛАСИЕ, хотя звучит как отрицание.',
        all: 'Несогласие начинайте с признания: That\'s a good point, but… / I see your point, but…'
      }
    },
    problems: {
      title: 'Проблемы и жалобы', emoji: '🛠️', subtitle: 'Извиниться, пожаловаться, решить',
      intro: 'Как извиниться, сообщить о проблеме и добиться решения — твёрдо, но вежливо.',
      tips: {
        B1: 'won\'t = «отказывается»: The door won\'t open. My phone won\'t turn on.',
        C1: 'Шкала твёрдости: There seems to be a problem… → I\'m afraid this isn\'t acceptable… → I\'d like to escalate this.',
        all: 'Excuse me — привлечь внимание. Sorry — извиниться за ошибку.'
      }
    },
    casual: {
      title: 'Разговорные формы', emoji: '😎', subtitle: 'gonna, wanna, kinda и живой сленг',
      intro: 'Так говорят в фильмах, сериалах и в жизни. Важно понимать эти формы на слух — и знать, где их использовать уместно.',
      tips: {
        A2: 'gonna / wanna / gotta — это произношение going to / want to / got to. Пишите так только в неформальных чатах.',
        B1: 'I\'m good в ответ на предложение («ещё чаю?») значит «нет, спасибо».',
        all: 'Разговорные формы уместны с друзьями, но не в резюме, письме начальнику или на собеседовании.'
      }
    },
    texting: {
      title: 'Язык переписки', emoji: '📱', subtitle: 'u, idk, lmk, omw — как пишут в мессенджерах',
      intro: 'В чатах носители почти никогда не пишут полными фразами: you превращается в u, are — в r, «не знаю» — в idk. Понимать это нужно обязательно, а использовать — с умом: с друзьями да, с начальником или в официальном письме — нет.',
      tips: {
        A1: 'Главное: u = you, ur = your / you\'re, r = are. «r u ok?» = «Are you OK?»',
        A2: 'Цифры читаются как слова: 2 = to/too, 4 = for, 8 = «eight» → l8r (later), gr8 (great), 2nite (tonight).',
        B1: 'Одиночное «k» может звучать холодно, как будто вы обиделись. Дружелюбнее: ok!, kk, sure 🙂',
        all: 'Правило регистра: чем выше статус собеседника и формальнее ситуация, тем меньше сокращений. Коллеге — полные слова, другу — как угодно.'
      }
    },
    idioms: {
      title: 'Идиомы и фразовые глаголы', emoji: '🧩', subtitle: 'То, что не переводится дословно',
      intro: 'Фразовые глаголы и идиомы — основа живой речи. Учите их целиком, в контексте, как готовые блоки.',
      tips: {
        B1: 'Фразовый глагол = глагол + частица, и смысл меняется целиком: give up — сдаться, find out — узнать.',
        B2: 'Местоимение ставится между глаголом и частицей: put it off, figure it out.',
        all: 'Не пытайтесь перевести идиому по словам — запоминайте ситуацию, в которой её говорят.'
      }
    }
  };

  var TOPIC_ORDER = ['greetings', 'cafe', 'shop', 'city', 'travel', 'hotel', 'smalltalk', 'reactions', 'plans', 'phone', 'health', 'casual', 'texting', 'opinions', 'problems', 'work', 'idioms'];
  var MAX_PER_LESSON = 7;

  /* ---------- сборка уроков ---------- */
  var lessons = [];
  var LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  var MIN_PER_LESSON = 3;
  TOPIC_ORDER.forEach(function (topic, ti) {
    var carry = []; // слишком маленькие группы переносим в следующий уровень темы
    var topicLessons = [];
    LEVELS.forEach(function (level, li) {
      var items = carry.concat(D.vocab.filter(function (v) { return v.topic === topic && v.level === level; }).map(function (v) { return v.id; }));
      carry = [];
      if (!items.length) return;
      if (items.length < MIN_PER_LESSON && li < LEVELS.length - 1) { carry = items; return; }
      if (items.length < MIN_PER_LESSON && topicLessons.length) {
        Array.prototype.push.apply(topicLessons[topicLessons.length - 1].items, items);
        return;
      }
      var parts = Math.ceil(items.length / MAX_PER_LESSON);
      var size = Math.ceil(items.length / parts);
      for (var p = 0; p < parts; p++) {
        var chunk = items.slice(p * size, (p + 1) * size);
        var t = D.topics[topic];
        var lesson = {
          id: topic + '-' + level.toLowerCase() + (parts > 1 ? '-' + (p + 1) : ''),
          topic: topic, level: level,
          title: t.title + (parts > 1 ? ' · часть ' + (p + 1) : ''),
          items: chunk,
          order: li * 100 + ti * 2 + p,
          dialogues: D.dialogues.filter(function (d) { return d.topic === topic && d.level === level; }).map(function (d) { return d.id; }),
          scenarios: D.scenarios.filter(function (s) { return s.topic === topic && s.level === level; }).map(function (s) { return s.id; })
        };
        lessons.push(lesson);
        topicLessons.push(lesson);
      }
    });
  });
  lessons.sort(function (a, b) { return a.order - b.order; });

  D.lessons = lessons;
  D.lessonsById = {};
  lessons.forEach(function (l) { D.lessonsById[l.id] = l; });
})(window.EG = window.EG || {});
