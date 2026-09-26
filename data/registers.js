/* data/registers.js — пары «обычная ↔ сленговая» и формы для переписки.
   R(en, { s: сленговая/разговорная форма, t: как пишут в мессенджере, n: где уместно (рус.) })
   Для разговорных фраз (register: casual) поле nu — нейтральная, «обычная» форма.
   Пары даём только там, где такой вариант реально употребляется. */
(function (EG) {
  'use strict';

  var D = EG.data;
  var map = {};
  function R(en, f) { map[D.slug(en)] = f; }

  /* ---------- Знакомство и приветствия ---------- */
  R("How's it going?", { nu: 'How are you?', s: "What's up?", t: 'sup? / hows it going?', n: 'How are you? — нейтрально везде; What\'s up? / sup — только с друзьями.' });
  R('Nice to meet you.', { s: 'Nice to meet ya!', t: 'nice to meet u!', n: 'В переписке после знакомства часто пишут просто nice to meet u 🙂' });
  R('Not bad, thanks.', { s: 'Pretty good, you?', t: 'not bad u?', n: 'В чате встречный вопрос сокращают до «u?» или «hbu?».' });
  R('What do you do?', { s: 'So what do you do for work?', t: 'what do u do?', n: 'Сленговой замены нет — вопрос и так разговорный.' });
  R('Where are you from?', { s: 'Where you from?', t: 'where r u from?', n: 'Where you from? — без are, очень разговорно.' });
  R('See you later!', { s: 'Later! / See ya!', t: 'cya / l8r / ttyl', n: 'Later! и See ya! — с друзьями. В чате: cya, l8r, ttyl.' });
  R('Good to see you!', { s: 'Good to see ya!', t: 'so good to see u!!', n: 'После встречи друзья пишут: so good to see u today!' });
  R('Take care!', { s: 'Take it easy!', t: 'take care! / tc', n: 'Take it easy! — расслабленно-дружеское прощание.' });
  R('How have you been?', { s: "How've you been?", t: 'how have u been?', n: 'Сокращённое How\'ve you been — живая речь.' });
  R('Long time no see!', { nu: "It's been a long time!", s: 'Long time no see!', t: 'long time no see!! how r u?', n: 'Сама фраза уже разговорная. Нейтральнее — It\'s been a long time.' });
  R("I've been good.", { s: 'Been good!', t: 'been good! hbu?', n: 'В разговоре и чатах подлежащее часто опускают: Been good.' });
  R("I don't think we've met.", { s: "Hey, I don't think we've met!", t: '—', n: 'Фраза для живого общения; в переписке так не начинают.' });
  R("I've heard a lot about you.", { s: "I've heard so much about you!", t: 'heard so much about u!', n: 'so much — эмоциональнее.' });
  R('It was nice talking to you.', { s: 'Great chatting!', t: 'great chatting w/ u!', n: 'Great chatting! — неформально, в том числе в конце переписки.' });
  R("I'd better get going.", { nu: 'I have to leave now.', s: 'Gotta go!', t: 'gtg!', n: 'Gotta go / gtg — с друзьями. I have to leave now — нейтрально.' });
  R('Fancy seeing you here!', { nu: 'What a surprise to see you here!', s: 'Fancy seeing you here!', t: '—', n: 'Шутливая британская фраза, в чатах не используется.' });
  R("Let's keep in touch.", { s: "Let's stay in touch!", t: 'keep in touch! / hmu anytime', n: 'hmu = hit me up — «пиши в любое время», сленг.' });
  R("I don't believe we've been introduced.", { s: "I don't think we've met.", t: '—', n: 'Формальная фраза. В разговоре — I don\'t think we\'ve met.' });

  /* ---------- Small talk ---------- */
  R('How was your weekend?', { s: 'How was the weekend?', t: 'how was ur weekend?', n: 'В чате с коллегами пишут без сокращений; с друзьями — ur.' });
  R('It was great, thanks.', { s: 'It was awesome!', t: 'it was awesome!!', n: 'awesome — очень частое американское «отлично».' });
  R('What are you up to?', { nu: 'What are you doing?', s: "What's up?", t: 'wyd?', n: 'What are you doing? — нейтрально; What\'s up? — сленг; wyd? — в мессенджере.' });
  R('Any plans for the weekend?', { s: 'Got any plans this weekend?', t: 'any plans this weekend?', n: 'Got any…? — разговорное сокращение от Have you got any…?' });
  R('Not really.', { nu: 'No, not really.', s: 'Nah, not really.', t: 'nah not rly', n: 'nah — сленговое «нет».' });
  R("It's freezing!", { nu: "It's very cold.", s: "It's freezing!", t: 'its freezing 🥶', n: 'It\'s very cold — нейтрально, freezing — эмоционально.' });
  R('Crazy weather, huh?', { nu: 'The weather is strange today.', s: 'Crazy weather, huh?', t: 'crazy weather lol', n: 'huh? — разговорный хвостик-вопрос.' });
  R('Have you been here before?', { s: 'Been here before?', t: 'u been here b4?', n: 'Been here before? — без Have you, очень разговорно.' });
  R('Same here.', { nu: 'Me too.', s: 'Same!', t: 'same / same lol', n: 'Same! — очень частое сленговое согласие, особенно в чатах.' });
  R('Me neither.', { nu: 'Neither do I.', s: 'Me neither.', t: 'me neither', n: 'Neither do I — нейтрально/формальнее.' });
  R('That sounds fun!', { s: 'Sounds fun!', t: 'sounds fun!! 😄', n: 'Без That — разговорно.' });
  R("I can't complain.", { nu: "I'm fine, thanks.", s: "Can't complain!", t: 'cant complain', n: 'Без I — разговорно.' });
  R('Keeping busy?', { nu: 'Are you busy these days?', s: 'Keeping busy?', t: 'keeping busy?', n: 'Уже разговорная форма.' });
  R('What have you been up to?', { nu: 'What have you been doing lately?', s: "What's new?", t: "what's new? / wyd lately?", n: 'What\'s new? — короткий разговорный вариант.' });
  R('Oh, you know, the usual', { nu: 'Nothing special.', s: 'Same old, same old.', t: 'same old lol', n: 'Same old, same old — «всё по-старому», сленг.' });
  R('Speaking of which', { s: 'Oh, speaking of…', t: 'speaking of which…', n: 'В чатах часто заменяют на btw.' });
  R('Anyway', { nu: 'In any case', s: 'Anyways', t: 'anyway / anyways', n: 'Anyways — разговорное, особенно в американской речи.' });

  /* ---------- Кафе и ресторан ---------- */
  R('Can I get', { s: "Lemme get", t: '—', n: 'Lemme get a latte = Let me get — очень разговорно, так говорят в фастфуде.' });
  R('To go, please.', { s: 'To go!', t: '—', n: 'Коротко и без please — разговорно, но звучит нормально.' });
  R("I'll have", { s: "I'll go with", t: '—', n: 'I\'ll go with the burger — «пожалуй, возьму бургер», непринуждённо.' });
  R('the check, please', { s: 'Check, please!', t: '—', n: 'Коротко, как в кино. Официанту лучше с Can we get…' });
  R('What do you recommend?', { s: "What's good here?", t: "what's good there?", n: 'What\'s good here? — непринуждённый вопрос официанту или другу.' });
  R('Is this seat taken?', { s: 'Anyone sitting here?', t: '—', n: 'Anyone sitting here? — разговорнее.' });
  R('Anything else?', { s: 'Anything else for you?', t: '—', n: 'Фраза персонала, понимать на слух.' });
  R("That's it, thanks.", { s: "That's all!", t: '—', n: 'That\'s all — чуть короче.' });
  R('Keep the change.', { s: "Keep it.", t: '—', n: 'Keep it — совсем коротко, с таксистом.' });
  R("I'm still deciding.", { s: 'Still looking!', t: '—', n: 'Still looking — «ещё смотрю меню».' });
  R("It's on me.", { nu: "I'll pay.", s: 'My treat!', t: 'my treat 😉', n: 'I\'ll pay — нейтрально; My treat / It\'s on me — дружески.' });
  R("Let's split the bill.", { s: "Let's go halves.", t: 'split it?', n: 'go halves / go Dutch — разговорные варианты.' });
  R("This isn't what I ordered.", { s: "I think this isn't mine.", t: '—', n: 'Мягкий разговорный вариант.' });
  R('grab a bite', { nu: 'have something to eat', s: 'grab a bite', t: 'wanna grab a bite?', n: 'have something to eat — нейтрально.' });
  R('Could I trouble you for', { s: 'Could I get', t: '—', n: 'Формальная фраза; в обычной ситуации достаточно Could I get…' });

  /* ---------- Магазин ---------- */
  R('How much is this?', { s: "How much?", t: 'how much?', n: 'Коротко — на рынке или в чате о продаже.' });
  R("I'm just looking, thanks.", { s: 'Just browsing!', t: '—', n: 'Just browsing — коротко и дружелюбно.' });
  R('Can I try it on?', { s: 'Mind if I try it on?', t: '—', n: 'Mind if…? — разговорная вежливая форма.' });
  R('Can I pay by card?', { s: 'Card okay?', t: 'can i pay w/ card?', n: 'Card okay? — очень коротко.' });
  R("I'll take it.", { s: "Sold!", t: '—', n: 'Sold! — шутливое «беру!».' });
  R("It's a bit too small.", { s: "It's kinda small.", t: 'its kinda small tbh', n: 'kinda — разговорное «немного».' });
  R('Is this on sale?', { s: 'Is this discounted?', t: '—', n: 'discounted — нейтральный синоним.' });
  R("It's a rip-off.", { nu: "It's too expensive.", s: "It's a rip-off.", t: 'such a rip off smh', n: 'Сленг. Нейтрально — It\'s too expensive / overpriced.' });
  R('a good deal', { s: 'a steal', t: 'what a steal!!', n: 'a steal — «даром», очень выгодно.' });
  R("It doesn't suit me.", { s: "It's not really me.", t: 'not really me tbh', n: 'It\'s not really me — «это не моё», разговорно.' });
  R('Do you have anything cheaper?', { s: 'Got anything cheaper?', t: '—', n: 'Got…? — разговорное сокращение.' });
  R("I'm on a budget.", { s: "I'm broke right now.", t: 'im broke rn lol', n: 'broke — сленг «без денег». С друзьями, не с продавцом.' });
  R('worth every penny', { s: 'totally worth it', t: 'totally worth it!!', n: 'totally worth it — молодёжный вариант.' });

  /* ---------- Путешествия ---------- */
  R("Here's my passport.", { s: 'Here you go.', t: '—', n: 'Here you go — универсальное «вот, держите».' });
  R('Just one bag.', { s: 'Just the one.', t: '—', n: 'Just the one — британское разговорное.' });
  R("I'm here on vacation.", { s: "Just visiting!", t: '—', n: 'На контроле лучше отвечать чётко: on vacation.' });
  R('is delayed', { s: 'is running late', t: 'flight delayed ugh', n: 'running late — о человеке или транспорте, разговорно.' });
  R('I missed my connection.', { s: 'I missed my flight.', t: 'missed my connection 😩', n: 'В чате — эмоции через эмодзи.' });
  R("My luggage didn't arrive.", { s: 'They lost my bag.', t: 'they lost my bag omg', n: 'They lost my bag — как рассказывают друзьям.' });
  R('keep an eye on', { s: 'watch', t: 'can u watch my bag?', n: 'watch my bag — проще и разговорнее.' });
  R('jet lag', { s: 'jet-lagged', t: 'so jetlagged rn', n: 'I\'m jet-lagged — прилагательное, очень частое.' });
  R('catch a flight', { nu: 'take a flight', s: 'catch a flight', t: 'gotta catch a flight', n: 'take a flight — нейтрально.' });
  R('Is there any way', { s: 'Any chance', t: 'any chance u could…?', n: 'Any chance I could get an earlier flight? — разговорно.' });
  R('off the beaten track', { s: 'hidden gem', t: 'found a hidden gem!', n: 'a hidden gem — «скрытая жемчужина», популярное выражение.' });

  /* ---------- Отель ---------- */
  R('I have a reservation.', { s: "I've got a booking.", t: '—', n: 'I\'ve got — разговорное британское.' });
  R('What time is checkout?', { s: 'When do we have to check out?', t: 'when is checkout?', n: 'Проще и разговорнее.' });
  R("What's the Wi-Fi password?", { s: "What's the Wi-Fi?", t: 'whats the wifi pw?', n: 'pw = password в переписке.' });
  R("isn't working", { s: "is broken", t: 'the shower is broken lol', n: 'is broken — проще, но резче.' });
  R('Could you call me a taxi?', { s: 'Can you get me a cab?', t: '—', n: 'cab — разговорное «такси».' });
  R("It's a bit noisy.", { s: "It's pretty loud.", t: 'its so loud here', n: 'pretty loud — разговорно.' });
  R('Would it be possible to', { nu: 'Could I', s: 'Any chance I could', t: 'any chance i could…?', n: 'Would it be possible — вежливо-формально; Could I — нейтрально; Any chance — разговорно.' });
  R('There seems to be a problem with', { nu: "There's a problem with", s: "Something's wrong with", t: "something's wrong w/ the…", n: 'От формального к разговорному.' });
  R('somewhere to eat nearby', { s: 'a good place to eat around here', t: 'any good food around here?', n: 'around here — разговорное «поблизости».' });
  R("I'd appreciate it if", { nu: 'Could you please', s: 'It would be great if', t: 'would be great if u could…', n: 'От формального к дружескому.' });

  /* ---------- Город и транспорт ---------- */
  R('How do I get to', { s: "What's the best way to", t: 'hows the best way to get to…?', n: 'What\'s the best way to get to…? — разговорно и естественно.' });
  R('Is it far from here?', { s: 'Is it far?', t: 'is it far?', n: 'Короче — разговорнее.' });
  R('Take me to', { s: 'Can you take me to', t: '—', n: 'С Can you — вежливее и живее.' });
  R("I'm lost.", { s: "I have no idea where I am.", t: 'im so lost lol', n: 'Эмоциональный разговорный вариант.' });
  R("You can't miss it.", { s: "It's right there, can't miss it.", t: 'u cant miss it', n: 'Без You — ещё разговорнее.' });
  R('drop me off', { s: 'let me out', t: 'can u drop me off?', n: 'let me out — «выпустите меня» (из машины).' });
  R('rush hour', { s: 'traffic is crazy', t: 'traffic is insane rn', n: 'Как говорят о пробках в жизни.' });
  R("I'm running late.", { nu: "I'll be late.", s: "Running late!", t: 'running late sry!! 10 min', n: 'I\'ll be late — нейтрально; Running late! — разговорно; в чате + время.' });
  R('stuck in traffic', { s: 'stuck in traffic', t: 'stuck in traffic ugh', n: 'ugh — раздражение в чатах.' });
  R('took the scenic route', { nu: 'We got lost.', s: 'took the scenic route', t: 'took the scenic route lol', n: 'Шутливое оправдание вместо We got lost.' });

  /* ---------- Телефон ---------- */
  R('Hi, this is', { s: "Hey, it's", t: "hey it's anna!", n: 'Hey, it\'s Anna — с друзьями, в том числе в сообщении с нового номера.' });
  R('Can I speak to', { s: 'Is … there?', t: '—', n: 'Is Tom there? — разговорно, по домашнему телефону.' });
  R('Just a moment, please.', { s: 'One sec!', t: '1 sec', n: 'One sec / 1 sec — сленговое «секунду».' });
  R("Sorry, I can't hear you.", { s: "Sorry, what? I can't hear you.", t: '—', n: 'Живая реакция при плохой связи.' });
  R("Who's calling, please?", { nu: 'Who is this?', s: "Who's this?", t: 'who is this?', n: 'Who\'s this? — с незнакомого номера, но может звучать резко.' });
  R('Can I take a message?', { s: 'Want me to tell him something?', t: '—', n: 'Разговорный вариант дома.' });
  R('call me back', { s: 'hit me back', t: 'call me back pls / hmu', n: 'hit me back / hmu — сленг «перезвони, напиши».' });
  R("You're breaking up.", { s: "You're cutting out.", t: '—', n: 'cutting out — синоним про плохую связь.' });
  R('Hold on a second.', { nu: 'Please wait a moment.', s: 'Hang on a sec.', t: 'hold on 1 sec', n: 'sec — разговорное «секунду».' });
  R("I'll put you through.", { nu: "I'll connect you.", s: "Let me transfer you.", t: '—', n: 'Все варианты — речь секретаря.' });
  R("I'm calling about", { s: 'Just calling about', t: 'texting about…', n: 'В сообщении: texting about the apartment.' });
  R('Could you speak a little slower?', { s: 'Slow down a bit?', t: '—', n: 'Коротко и разговорно — с друзьями.' });
  R("I'll get back to you.", { s: "I'll let you know.", t: 'will lmk / ill get back to u', n: 'I\'ll let you know — проще и разговорнее.' });
  R('Sorry, I missed your call.', { s: 'Sorry, missed your call!', t: 'sry missed ur call! whats up?', n: 'В чате — типичное начало перезвона.' });
  R('tied up', { nu: 'busy', s: 'swamped', t: 'swamped rn', n: 'tied up — деловое; busy — нейтральное; swamped — разговорное.' });

  /* ---------- Работа ---------- */
  R('Do you have a minute?', { s: 'Got a sec?', t: 'got a sec?', n: 'Got a sec? — очень частое в офисе и в рабочих чатах.' });
  R('Let me check.', { s: 'Lemme check.', t: 'lemme check', n: 'lemme = let me, только неформально.' });
  R('touch base', { nu: 'talk briefly', s: 'catch up', t: 'quick catch up?', n: 'catch up — «созвониться, обменяться новостями».' });
  R("I'm swamped.", { nu: "I'm very busy.", s: "I'm slammed.", t: 'slammed today 😵', n: 'slammed — сленг «завален».' });
  R('give me a hand', { nu: 'help me', s: 'help me out', t: 'can u help me out?', n: 'help me out — разговорно и дружелюбно.' });
  R("Let's get started.", { s: "Let's get going.", t: '—', n: 'Let\'s kick off — деловой сленг.' });
  R('get it done', { nu: 'finish it', s: 'get it done', t: 'will get it done by fri', n: 'В рабочих чатах дни сокращают: mon, fri.' });
  R('Sorry, could you repeat that?', { s: 'Sorry, come again?', t: '—', n: 'Come again? — разговорное «повтори?».' });
  R("I didn't catch that.", { s: 'Sorry, missed that.', t: '—', n: 'Коротко и естественно на созвоне.' });
  R('on the same page', { s: 'in sync', t: 'r we on the same page?', n: 'in sync — синоним.' });
  R('follow up', { s: 'ping', t: "i'll ping them", n: 'ping — сленг «напомнить, написать».' });
  R("I'd like to hear your thoughts.", { nu: 'What do you think?', s: 'Thoughts?', t: 'thoughts?', n: 'Thoughts? — одним словом в рабочем чате, очень популярно.' });
  R('Just to clarify', { s: 'Just to be clear', t: 'just to clarify —', n: 'Уместно и в чате с коллегами.' });
  R("What's the status on", { s: 'Any update on', t: 'any updates on…?', n: 'Any update on…? — мягче и разговорнее.' });
  R('work from home', { s: 'WFH', t: 'wfh today', n: 'WFH — очень частое сокращение в рабочих чатах.' });
  R('circle back', { nu: 'come back to this later', s: 'revisit', t: '—', n: 'Корпоративный жаргон; в жизни — come back to this.' });
  R('push back on', { nu: 'disagree with', s: 'push back on', t: '—', n: 'Деловая фраза.' });
  R('a tight schedule', { s: 'a tight deadline', t: 'tight deadline 😬', n: 'Эмодзи 😬 — «нервничаю».' });

  /* ---------- Здоровье ---------- */
  R("I don't feel well.", { s: "I feel awful.", t: 'feel like crap ngl', n: 'feel like crap — грубый сленг, только с близкими.' });
  R('I have a headache', { s: 'My head is killing me', t: 'my head is killing me', n: 'is killing me — разговорное преувеличение.' });
  R("I've got a cold.", { s: "I'm sick.", t: 'im sick 🤒', n: 'I\'m sick — в США значит просто «болею».' });
  R('under the weather', { nu: 'sick', s: 'under the weather', t: 'bit under the weather', n: 'Мягкая разговорная идиома.' });
  R("It's nothing serious.", { s: "It's no big deal.", t: 'its nothing serious dont worry', n: 'no big deal — разговорно.' });
  R('Get well soon!', { s: 'Feel better!', t: 'feel better!! ❤️', n: 'Feel better! — часто в сообщениях.' });
  R('on the mend', { nu: 'getting better', s: 'bouncing back', t: 'getting better!', n: 'bouncing back — «прихожу в себя».' });
  R('run-down', { nu: 'very tired', s: 'wiped out', t: 'so wiped out', n: 'wiped out — сленг «вымотан».' });

  /* ---------- Планы ---------- */
  R('Are you free', { s: 'You free', t: 'u free sat?', n: 'You free Saturday? — без Are, очень разговорно.' });
  R("Let's meet", { s: "Let's hang", t: 'wanna hang?', n: 'hang = hang out, сленг.' });
  R('Sounds good!', { nu: "That's fine.", s: 'Sounds good!', t: 'sg / sounds good', n: 'sg = sounds good в переписке.' });
  R('Do you want to', { nu: 'Would you like to', s: 'Wanna', t: 'wanna…?', n: 'Would you like to — вежливо; Do you want to — нейтрально; Wanna — сленг.' });
  R('How about', { s: 'What about', t: 'how abt…?', n: 'abt = about в чатах.' });
  R("I'd love to!", { s: "I'm in!", t: "i'm in!!", n: 'I\'m in! — «я в деле».' });
  R('Maybe another time.', { s: 'Rain check?', t: 'rain check? 🙏', n: 'Rain check? — перенести на потом, разговорно.' });
  R('What time works for you?', { s: "When's good?", t: 'when works?', n: 'When\'s good? — коротко.' });
  R("I'm up for it.", { nu: "I'd like that.", s: "I'm down!", t: 'im down!', n: 'I\'m down — американский сленг «я за».' });
  R('Let me know.', { s: 'Keep me posted.', t: 'lmk', n: 'lmk — очень частое в чатах.' });
  R('hang out', { nu: 'spend time together', s: 'hang out', t: 'wanna hang?', n: 'spend time together — нейтрально.' });
  R('Can we reschedule?', { s: 'Can we push it?', t: 'can we push it to fri?', n: 'push it — «перенести» разговорно.' });
  R('Something came up.', { s: 'Something came up, sorry!', t: 'something came up sry 😕', n: 'В чатах добавляют эмодзи, чтобы смягчить.' });
  R("I can't make it.", { s: "I can't make it, sorry!", t: "can't make it sry!!", n: 'В чатах подлежащее опускают.' });
  R('take a rain check', { nu: 'do it another time', s: 'take a rain check', t: 'rain check?', n: 'Разговорная идиома.' });
  R('Count me in!', { nu: "I'll join.", s: "I'm in!", t: "i'm in! / count me in", n: 'I\'ll join — нейтрально.' });
  R('play it by ear', { nu: 'decide later', s: 'wing it', t: "let's just wing it", n: 'wing it — сленг «импровизировать».' });

  /* ---------- Реакции ---------- */
  R('No problem.', { nu: "You're welcome.", s: 'No worries!', t: 'np / no worries', n: 'np — в переписке.' });
  R("You're welcome.", { s: 'Anytime!', t: 'anytime! / np', n: 'Anytime! — тепло и разговорно.' });
  R('Really?', { s: 'Seriously?', t: 'srsly?? / fr?', n: 'fr = for real — молодёжный сленг.' });
  R("That's great!", { s: "That's awesome!", t: "that's awesome!! 🎉", n: 'awesome — американское «супер».' });
  R('Oh no!', { s: 'Oh no!', t: 'oh noo 😢', n: 'В чатах удлиняют буквы для эмоций: nooo.' });
  R("I'm sorry to hear that.", { s: "That sucks.", t: 'that sucks :( ', n: 'That sucks — сленг «это отстой», только с близкими.' });
  R('Good for you!', { s: 'Nice one!', t: 'nice!! proud of u', n: 'proud of u — тёплая поддержка в чате.' });
  R('Congratulations!', { s: 'Congrats!', t: 'congrats!! 🎉', n: 'Congrats — повсеместно, кроме официальных писем.' });
  R('No way!', { nu: 'Really? I can\'t believe it!', s: 'No way!', t: 'no wayyy / omg', n: 'Нейтрально — Really? I can\'t believe it!' });
  R("Don't worry about it.", { s: 'No worries.', t: 'no worries!', n: 'No worries — коротко и дружелюбно.' });
  R('I see.', { s: 'Got it.', t: 'got it / gotcha', n: 'Got it / Gotcha — «понял».' });
  R('That makes sense.', { s: 'Makes sense.', t: 'makes sense', n: 'Без That — разговорно.' });
  R('What a shame!', { s: 'Bummer!', t: 'bummer :(', n: 'Bummer — американский сленг «облом».' });
  R('Lucky you!', { nu: "You're lucky!", s: 'Lucky you!', t: 'lucky u!! so jealous', n: 'so jealous — шутливая зависть.' });
  R('Tell me about it!', { nu: 'I agree completely.', s: 'Tell me about it!', t: 'ikr', n: 'ikr = I know, right? — чатовый аналог.' });
  R('Fair enough.', { nu: 'I understand.', s: 'Fair enough.', t: 'fair enough', n: 'Нейтрально — I understand.' });
  R("You've got to be kidding!", { nu: "I can't believe it.", s: 'Are you kidding me?', t: 'r u kidding me??', n: 'От нейтрального к эмоциональному.' });
  R("I'm so happy for you!", { s: 'So happy for you!', t: 'so happy for u!! ❤️', n: 'В чатах часто без I\'m.' });
  R("That's a relief.", { s: 'Phew!', t: 'phew 😅', n: 'Phew — облегчённый выдох.' });
  R("That's the last thing I need.", { nu: 'This makes things worse.', s: 'Just great.', t: 'just great smh', n: 'Just great — саркастичное «прекрасно».' });
  R('I can imagine.', { s: 'I bet.', t: 'i bet', n: 'I bet — «ещё бы, представляю».' });

  /* ---------- Мнения ---------- */
  R('I think so.', { s: 'I guess so.', t: 'i think so', n: 'I guess so — чуть менее уверенно, разговорно.' });
  R("I don't think so.", { s: 'Nah, I don\'t think so.', t: 'nah dont think so', n: 'nah — разговорное «не».' });
  R('In my opinion', { s: 'If you ask me', t: 'imo', n: 'imo — в чатах и на форумах.' });
  R('I agree.', { s: 'Totally!', t: 'totally / same', n: 'Totally! — сильное согласие.' });
  R("I'm not sure about that.", { s: 'Hmm, not so sure.', t: 'idk about that', n: 'idk about that — мягкое несогласие в чате.' });
  R('To be honest', { s: 'Honestly', t: 'tbh', n: 'Honestly — разговорно; tbh — в переписке.' });
  R('Exactly!', { s: 'Exactly!', t: 'exactly!! / this', n: '«this» в чатах = «вот именно!» (о чужом сообщении).' });
  R('It depends.', { s: 'Depends.', t: 'depends', n: 'Без It — разговорно.' });
  R('As far as I know', { s: 'I think', t: 'afaik', n: 'afaik = as far as I know, в чатах.' });
  R("I couldn't agree more.", { s: '100%!', t: '100% / 💯', n: '100% и эмодзи 💯 — «полностью согласен».' });
  R("That's a good point.", { s: 'Good point.', t: 'good point', n: 'Коротко.' });
  R("I'm with you on that.", { nu: 'I agree with you.', s: "I'm with you.", t: 'agreed', n: 'agreed — коротко в рабочем чате.' });
  R('If you ask me', { nu: 'In my opinion', s: 'If you ask me', t: 'imo', n: 'Нейтрально — In my opinion.' });
  R("I'd have to disagree.", { nu: "I don't agree.", s: 'Nah, not really.', t: 'hmm not sure i agree', n: 'От формального к разговорному.' });
  R('That\'s debatable.', { s: 'Eh, debatable.', t: 'debatable lol', n: 'Ироничная реакция.' });
  R('I take your point', { nu: 'I understand your point', s: 'Fair point', t: 'fair point', n: 'Fair point — разговорное признание аргумента.' });
  R('Having said that', { nu: 'However', s: 'That said', t: 'that said…', n: 'That said — короче и разговорнее.' });
  R('The way I see it', { s: 'The way I see it', t: 'the way i see it…', n: 'Уже разговорная фраза.' });

  /* ---------- Проблемы ---------- */
  R("Sorry I'm late!", { s: 'Sorry, running late!', t: 'sry im late!!', n: 'sry = sorry в чатах.' });
  R('Can you help me?', { s: 'Can you help me out?', t: 'can u help me out?', n: 'help out — дружелюбнее.' });
  R("It doesn't work.", { s: "It's not working.", t: 'its not working 😩', n: 'Разговорнее с -ing.' });
  R('My bad.', { nu: 'My mistake.', s: 'My bad!', t: 'my bad!', n: 'My mistake — нейтрально, My bad — сленг.' });
  R("I didn't mean to", { s: "Didn't mean to", t: "didn't mean to!! sry", n: 'Без I — разговорно.' });
  R("It's not a big deal.", { nu: "It's not important.", s: 'No biggie.', t: 'no biggie', n: 'No biggie — сленг «ерунда».' });
  R("I'll look into it.", { s: "I'll check it out.", t: 'will check it out', n: 'check it out — разговорно.' });
  R('This is unacceptable.', { nu: "This isn't okay.", s: 'This is ridiculous.', t: 'this is ridiculous smh', n: 'ridiculous — эмоционально, но не грубо.' });
  R('No harm done.', { nu: "It's fine.", s: 'All good!', t: 'all good!', n: 'All good! — очень частое «всё норм».' });
  R("there's been a mix-up", { nu: 'there is a mistake', s: 'someone messed up', t: 'someone messed up lol', n: 'mess up — «напортачить», разговорно.' });

  /* ---------- Разговорные формы: к ним — нейтральные ---------- */
  R('gonna', { nu: 'going to', s: 'gonna', t: 'gonna', n: 'В официальном письме — только going to.' });
  R('wanna', { nu: 'want to', s: 'wanna', t: 'wanna', n: 'В официальном письме — только want to.' });
  R('gotta', { nu: 'have to', s: 'gotta', t: 'gotta', n: 'Нейтрально — have to / have got to.' });
  R('kinda', { nu: 'kind of / a little', s: 'kinda', t: 'kinda', n: 'Нейтрально — a little, somewhat.' });
  R("What's up?", { nu: 'How are you?', s: "What's up?", t: 'sup / wassup / wyd', n: 'sup — ещё короче, очень неформально.' });
  R('Not much.', { nu: 'Nothing special.', s: 'Not much.', t: 'nm / not much u?', n: 'nm = not much в переписке.' });
  R('Cool.', { nu: 'Good. / Okay.', s: 'Cool.', t: 'cool / k', n: 'Нейтрально — Good / OK.' });
  R('No worries.', { nu: 'No problem.', s: 'No worries.', t: 'no worries / np', n: 'Нейтрально — No problem.' });
  R('Yeah, sure.', { nu: 'Yes, of course.', s: 'Yeah, sure.', t: 'ya sure / ofc', n: 'ya, ofc — в переписке.' });
  R('Hang on.', { nu: 'Wait a moment.', s: 'Hang on.', t: '1 sec', n: 'Нейтрально — Wait a moment.' });
  R("I'm down.", { nu: "I'd like to join.", s: "I'm down.", t: 'im down', n: 'Нейтрально — I\'d like to.' });
  R('Sort of', { nu: 'Partly / Somewhat', s: 'Sort of', t: 'sorta', n: 'sorta — в чатах.' });
  R("I'm good.", { nu: 'No, thank you.', s: "I'm good.", t: 'im good ty', n: 'Нейтрально — No, thank you.' });
  R('Gotcha.', { nu: 'I understand.', s: 'Gotcha.', t: 'gotcha / got it', n: 'Нейтрально — I understand / Got it.' });
  R('chilled', { nu: 'relaxed', s: 'chilled', t: 'just chillin', n: 'Нейтрально — relaxed.' });
  R("It's up to you.", { s: 'Your call.', t: 'ur call', n: 'Your call — «тебе решать», разговорно.' });
  R("That's awesome!", { nu: "That's great!", s: "That's awesome!", t: 'thats awesome!! 🙌', n: 'Нейтрально — That\'s great.' });
  R('Whatever works for you.', { s: 'Whatever works!', t: 'whatever works 👍', n: 'Коротко в чатах.' });
  R("I'm beat.", { nu: "I'm very tired.", s: "I'm beat.", t: 'so tired rn / dead 💀', n: '«dead» + 💀 — молодёжное «убит, без сил».' });
  R('Not gonna lie', { nu: 'Honestly', s: 'Not gonna lie', t: 'ngl', n: 'Нейтрально — Honestly.' });

  /* ---------- Идиомы ---------- */
  R('figure out', { nu: 'understand', s: 'figure out', t: 'cant figure it out', n: 'Нейтрально — understand, work out.' });
  R('find out', { nu: 'learn / discover', s: 'find out', t: 'lmk when u find out', n: 'Нейтрально — learn, discover.' });
  R('looking forward to', { s: "can't wait for", t: "can't wait!! 🙌", n: 'can\'t wait — эмоциональнее и разговорнее.' });
  R('run out of', { s: "we're out of", t: 'were out of milk', n: 'be out of — разговорно.' });
  R('come up with', { nu: 'think of', s: 'come up with', t: '—', n: 'Нейтрально — think of, create.' });
  R('give up', { nu: 'stop trying', s: 'give up', t: 'dont give up!!', n: 'Нейтрально — stop trying.' });
  R('a piece of cake', { nu: 'very easy', s: 'a piece of cake', t: 'ez / easy peasy', n: 'ez — геймерский сленг «легко».' });
  R('get the hang of', { nu: 'learn how to do', s: 'get the hang of', t: '—', n: 'Нейтрально — learn how to do.' });
  R('hit the road', { nu: 'leave', s: 'hit the road', t: 'hitting the road now', n: 'Нейтрально — leave.' });
  R('on the fence', { nu: 'undecided', s: 'on the fence', t: 'still on the fence tbh', n: 'Нейтрально — undecided.' });
  R('put off', { nu: 'postpone', s: 'put off', t: '—', n: 'postpone — формально.' });
  R('not my cup of tea', { nu: "I don't like it", s: 'not my thing', t: 'not my thing tbh', n: 'not my thing — разговорно.' });
  R('call it a day', { nu: 'stop working', s: 'call it a day', t: 'calling it a day', n: 'Нейтрально — stop for today.' });
  R('beat around the bush', { nu: 'avoid the main point', s: 'beat around the bush', t: 'just say it lol', n: 'Нейтрально — avoid the point.' });
  R('Keep me posted.', { nu: 'Please keep me informed.', s: 'Keep me posted.', t: 'keep me posted / lmk', n: 'Please keep me informed — формально.' });

  /* ---------- прикрепляем к словарю ---------- */
  var attached = 0;
  Object.keys(map).forEach(function (id) {
    var item = D.byId[id];
    if (!item) { console.warn('[EnglishGo] registers: нет выражения', id); return; }
    var f = map[id];
    var forms = { note: f.n || '' };
    if (f.nu) forms.neutral = f.nu;
    if (f.s && f.s !== item.en && f.s.replace(/[!.?]$/, '') !== item.en.replace(/[!.?]$/, '')) forms.slang = f.s;
    if (f.t && f.t !== '—') forms.text = f.t;
    if (forms.neutral || forms.slang || forms.text) { item.forms = forms; attached++; }
  });
  D.formsCount = attached;
})(window.EG = window.EG || {});
