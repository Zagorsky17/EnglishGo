/* data/words/a1.js — слова уровня A1 для тренажёра «Словарный запас» (формат строк — в data/wordbank.js).
   Внутри части речи слова идут от более частотных к менее частотным: так они и попадают в блоки. */
(function (EG) {
  'use strict';

  var D = EG.data = EG.data || {};
  (D.wordRows = D.wordRows || []).push(
    // местоимения, числительные, отрицание
    ['A1', 'x', 'I|я; you|ты, вы; he|он; she|она; it|оно, это; we|мы; they|они; me|меня, мне; him|его, ему (о нём); her|её, ей; us|нас, нам; ' +
      'them|их, им; my|мой; your|твой, ваш; his|его (принадлежащий ему); our|наш; their|их (принадлежащий им); not|не; no|нет, никакой; yes|да; ' +
      'more|больше, более; one|один; two|два; three|три; four|четыре; five|пять; six|шесть; seven|семь; eight|восемь; nine|девять; ten|десять; ' +
      'twenty|двадцать; hundred|сто; thousand|тысяча; million|миллион'],
    // модальные глаголы
    ['A1', 'v', 'can|мочь, уметь; must|должен (обязан); should|следует, стоит (совет); ' +
      'would|бы (вспомогательный глагол); could|мог, мог бы; might|может быть, возможно (модальный)'],
    // существительные
    ['A1', 'n', 'time|время; day|день; year|год; week|неделя; month|месяц; hour|час; minute|минута; morning|утро; evening|вечер; night|ночь; man|мужчина; ' +
      'woman|женщина; child|ребёнок; boy|мальчик; girl|девочка; friend|друг; family|семья; mother|мама, мать; father|папа, отец; brother|брат; ' +
      'sister|сестра; son|сын; daughter|дочь; husband|муж; wife|жена; parents|родители; name|имя; house|дом (здание); home|дом (жильё); room|комната; ' +
      'kitchen|кухня; bed|кровать; table|стол; chair|стул; door|дверь; window|окно; city|город; street|улица; country|страна; shop|магазин'],
    ['A1', 'n', 'school|школа; job|работа (должность); money|деньги; food|еда; water|вода; bread|хлеб; milk|молоко; coffee|кофе; tea|чай; apple|яблоко; egg|яйцо; ' +
      'meat|мясо; fish|рыба; car|машина; bus|автобус; train|поезд; plane|самолёт; ticket|билет; book|книга; phone|телефон; computer|компьютер; dog|собака; ' +
      'cat|кошка; bird|птица; sun|солнце; rain|дождь; snow|снег; weather|погода; head|голова; hand|рука (кисть); eye|глаз; face|лицо; hair|волосы; ' +
      'clothes|одежда; shirt|рубашка; shoes|обувь, туфли; colour|цвет; music|музыка; film|фильм; game|игра'],
    ['A1', 'n', 'question|вопрос; word|слово; language|язык (речь); lesson|урок; teacher|учитель; student|студент; doctor|врач; hospital|больница; breakfast|завтрак; ' +
      'lunch|обед; dinner|ужин; restaurant|ресторан; party|вечеринка; birthday|день рождения; holiday|праздник, отпуск; sea|море; river|река; tree|дерево; ' +
      'flower|цветок; key|ключ; bag|сумка; box|коробка; picture|картинка; letter|письмо, буква; number|число, номер; people|люди; baby|малыш, младенец; ' +
      'animal|животное; hotel|гостиница, отель; airport|аэропорт; station|вокзал, станция; park|парк; beach|пляж; cup|чашка; glass|стакан, стекло; ' +
      'plate|тарелка; spoon|ложка; knife|нож; fork|вилка; sugar|сахар'],
    ['A1', 'n', 'salt|соль; cheese|сыр; chicken|курица; rice|рис; potato|картофель; orange|апельсин; banana|банан; juice|сок; wine|вино; cake|торт; shower|душ; ' +
      'hobby|хобби; weekend|выходные; dress|платье; hat|шляпа; jacket|куртка; bike|велосипед; map|карта (местности); pen|ручка; paper|бумага; ' +
      'homework|домашнее задание; office|офис; city centre|центр города; bathroom|ванная; garden|сад; floor|пол, этаж; wall|стена; clock|часы (настенные); ' +
      'boyfriend|парень (молодой человек); girlfriend|девушка (подруга); afternoon|вторая половина дня; apartment|квартира; flat|квартира; armchair|кресло; ' +
      'ball|мяч; band|музыкальная группа; bank|банк; bath|ванна; bedroom|спальня; bicycle|велосипед'],
    ['A1', 'n', 'blouse|блузка; board|доска; boat|лодка; body|тело; bookshop|книжный магазин; bowl|миска; butter|сливочное масло; cafe|кафе; calendar|календарь; ' +
      'carrot|морковь; class|класс, занятие; classroom|классная комната; cinema|кинотеатр; company|компания, фирма; cow|корова; cream|сливки, крем; ' +
      'dad|папа; mum|мама; desk|письменный стол, парта; dictionary|словарь; dish|блюдо; driver|водитель; email|электронное письмо; end|конец; ' +
      'engineer|инженер; example|пример; exercise|упражнение; farmer|фермер; foot|ступня, нога; football|футбол; grandfather|дедушка; grandmother|бабушка; ' +
      'grandparents|бабушка и дедушка; group|группа; guitar|гитара; gym|спортзал; horse|лошадь; ice|лёд; ice cream|мороженое; information|информация'],
    ['A1', 'n', 'internet|интернет; jeans|джинсы; lamp|лампа; list|список; moment|момент, миг; mouse|мышь; museum|музей; newspaper|газета; notebook|тетрадь, блокнот; ' +
      'page|страница; pair|пара; pasta|паста, макароны; pencil|карандаш; person|человек; pet|домашнее животное; photo|фотография; piano|пианино; ' +
      'pizza|пицца; place|место; player|игрок; postcard|открытка; present|подарок; sentence|предложение (фраза); shopping|покупки, шопинг; singer|певец; ' +
      'skirt|юбка; sport|спорт; spring|весна; summer|лето; autumn|осень; winter|зима; supermarket|супермаркет; swimming pool|бассейн; T-shirt|футболка; ' +
      'taxi|такси; television|телевизор; tennis|теннис; test|тест, контрольная; thing|вещь; toilet|туалет'],
    ['A1', 'n', 'tomato|помидор; tourist|турист; trip|поездка; university|университет; video|видео; website|сайт; zoo|зоопарк; Monday|понедельник; Tuesday|вторник; ' +
      'Wednesday|среда (день недели); Thursday|четверг; Friday|пятница; Saturday|суббота; Sunday|воскресенье; January|январь; February|февраль; March|март; ' +
      'April|апрель; May|май; June|июнь; July|июль; August|август; September|сентябрь; October|октябрь; November|ноябрь; December|декабрь; kid|ребёнок; ' +
      'biscuit|печенье; chocolate|шоколад; dessert|десерт; lemon|лимон; pear|груша; strawberry|клубника; grape|виноград; onion|лук (овощ); salad|салат; ' +
      'beef|говядина; pork|свинина; sausage|колбаса, сосиска; beer|пиво'],
    ['A1', 'n', 'hamburger|гамбургер; cash|наличные; coin|монета; credit card|кредитная карта; activity|занятие, деятельность; art|искусство; maths|математика; ' +
      'science|наука; geography|география; movie|фильм; actor|актёр; artist|художник; nurse|медсестра; police officer|полицейский; pilot|пилот; ' +
      'secretary|секретарь; manager|менеджер, руководитель; worker|рабочий; church|церковь; post office|почта (отделение); bus stop|автобусная остановка; ' +
      'car park|парковка; square|площадь; tower|башня; castle|замок (крепость); sand|песок; sheep|овца; pig|свинья; duck|утка; lion|лев; tiger|тигр; ' +
      'elephant|слон; monkey|обезьяна; rabbit|кролик; bear|медведь; snake|змея; cupboard|шкаф (кухонный); shelf|полка; stairs|лестница; roof|крыша'],
    ['A1', 'n', 'living room|гостиная; toothbrush|зубная щётка; laptop|ноутбук; tablet|планшет; app|приложение; radio|радио; password|пароль; boots|ботинки, сапоги; ' +
      'trainers|кроссовки; scarf|шарф; sunglasses|солнечные очки; glasses|очки; date|дата, свидание; flight|рейс, полёт; fun|веселье; answer|ответ; ' +
      'half|половина; part|часть; piece|кусок, кусочек; type|тип, вид; way|путь, способ; top|верх, вершина; middle|середина; side|сторона; kitten|котёнок; ' +
      'puppy|щенок; evening meal|ужин; noon|полдень; midnight|полночь; weekday|будний день; everyday life|повседневная жизнь; toothpaste|зубная паста; ' +
      'cooker|плита; sink|раковина; napkin|салфетка; tip|чаевые'],
    // глаголы
    ['A1', 'v', 'be|быть; have|иметь; do|делать; go|идти, ехать; come|приходить; see|видеть; look|смотреть; watch|смотреть (фильм), наблюдать; listen|слушать; ' +
      'hear|слышать; say|сказать; tell|рассказывать; speak|говорить (на языке); talk|разговаривать; ask|спрашивать; know|знать; think|думать; want|хотеть; ' +
      'like|нравиться; love|любить; need|нуждаться; eat|есть (пищу); drink|пить; sleep|спать; live|жить; work|работать; play|играть; read|читать; ' +
      'write|писать; open|открывать; close|закрывать; buy|покупать; sell|продавать; pay|платить; give|давать; take|брать; get|получать; put|класть; ' +
      'sit|сидеть; stand|стоять'],
    ['A1', 'v', 'walk|гулять, ходить пешком; run|бегать; swim|плавать; cook|готовить (еду); wash|мыть; help|помогать; learn|учить, узнавать; study|учиться, изучать; ' +
      'understand|понимать; remember|помнить; forget|забывать; start|начинать; finish|заканчивать; wait|ждать; call|звонить; meet|встречать; ' +
      'visit|посещать, навещать; travel|путешествовать; dance|танцевать; sing|петь; drive|водить (машину); find|находить; lose|терять; show|показывать; ' +
      'try|пытаться, пробовать; use|использовать; stay|оставаться; leave|уходить, уезжать; arrive|прибывать; carry|нести; bring|приносить; send|отправлять; ' +
      'cost|стоить; wear|носить (одежду); feel|чувствовать; add|добавлять; begin|начинать; brush|чистить щёткой; get up|вставать; ' +
      'go out|выходить (из дома), гулять'],
    ['A1', 'v', 'look for|искать; make|делать, изготавливать; ride|ездить верхом, кататься; spell|произносить по буквам; text|писать сообщение; turn on|включать; ' +
      'turn off|выключать; put on|надевать; take off|снимать (одежду), взлетать; pick up|поднимать, забирать; ski|кататься на лыжах; fix|чинить; ' +
      'thank|благодарить; hug|обнимать; clean up|убирать (наводить чистоту); sit down|садиться; lie down|ложиться; come in|входить; go back|возвращаться; ' +
      'hurry up|поторопиться; listen to|слушать (кого-то); look at|смотреть на; talk about|говорить о; laugh at|смеяться над; wait for|ждать (кого-то); ' +
      'jog|бегать трусцой; shout at|кричать на; welcome|приветствовать; wish|желать; check in|регистрироваться (в отеле, аэропорту)'],
    // прилагательные
    ['A1', 'a', 'good|хороший; bad|плохой; big|большой; small|маленький; new|новый; old|старый; young|молодой; hot|горячий, жаркий; cold|холодный; happy|счастливый; ' +
      'sad|грустный; tired|уставший; hungry|голодный; beautiful|красивый; nice|приятный, милый; easy|лёгкий, простой; difficult|трудный, сложный; ' +
      'fast|быстрый; slow|медленный; long|длинный; short|короткий; tall|высокий; cheap|дешёвый; expensive|дорогой; clean|чистый; dirty|грязный; full|полный; ' +
      'empty|пустой; right|правильный, правый; wrong|неправильный; free|свободный, бесплатный; busy|занятой; ready|готовый; late|поздний; early|ранний; ' +
      'favourite|любимый; different|разный, другой; same|тот же самый, одинаковый; white|белый; black|чёрный'],
    ['A1', 'a', 'red|красный; green|зелёный; blue|синий, голубой; yellow|жёлтый; warm|тёплый; funny|смешной; interesting|интересный; boring|скучный; strong|сильный; ' +
      'weak|слабый; sick|больной; rich|богатый; poor|бедный; brown|коричневый; grey|серый; pink|розовый; purple|фиолетовый; light|светлый, лёгкий; ' +
      'fine|хороший, в порядке; great|отличный, огромный; excellent|отличный; fantastic|фантастический, потрясающий; lovely|прекрасный, милый; ' +
      'sunny|солнечный; rainy|дождливый; windy|ветреный; cloudy|облачный; thirsty|испытывающий жажду; ill|больной; married|женатый, замужняя; ' +
      'next|следующий; last|последний, прошлый; first|первый; closed|закрытый; high|высокий; low|низкий; little|маленький, небольшой; ' +
      'large|большой, крупный; English|английский; Russian|русский'],
    ['A1', 'a', 'dear|дорогой (милый); cute|милый, симпатичный; correct|правильный, верный; alone|один, в одиночестве; online|онлайн, в интернете; quick|быстрый; ' +
      'hard-working|трудолюбивый; kind-hearted|добросердечный; glad|рад, довольный; sorry|сожалеющий, виноватый; well-dressed|хорошо одетый; left|левый; ' +
      'asleep|спящий; awake|бодрствующий, не спящий'],
    // наречия и выражения
    ['A1', 'd', 'now|сейчас; today|сегодня; tomorrow|завтра; yesterday|вчера; always|всегда; never|никогда; often|часто; sometimes|иногда; usually|обычно; here|здесь; ' +
      'there|там; very|очень; again|снова; also|тоже, также; together|вместе; soon|скоро; later|позже, потом; already|уже; still|всё ещё; well|хорошо; ' +
      'tonight|сегодня вечером; ever|когда-либо; far|далеко; near|рядом, близко; just|только что, просто; perhaps|возможно, может быть; quickly|быстро; ' +
      'slowly|медленно; then|потом, тогда; too|тоже, слишком; yet|ещё (не), уже (в вопросах); badly|плохо; carefully|осторожно, внимательно; easily|легко; ' +
      'loudly|громко; quietly|тихо; happily|радостно, счастливо; away|прочь, вдали; at home|дома; every day|каждый день'],
    ['A1', 'd', 'last night|вчера вечером; next week|на следующей неделе; at night|ночью; in the morning|утром; right now|прямо сейчас; a lot|много, очень; ' +
      'a little|немного; of course|конечно; over there|вон там'],
    // служебные слова и связки
    ['A1', 'x', 'about|о (о чём-то), около; above|над, выше; after|после; before|до, перед; because|потому что; but|но; or|или; with|с (вместе с); without|без; ' +
      'under|под; between|между; behind|за, позади; in front of|перед (впереди); next to|рядом с; opposite|напротив; into|в (внутрь); from|из, от; ' +
      'until|до (какого-то времени); if|если; when|когда; where|где, куда; why|почему; how|как; who|кто; what|что; which|который, какой; everything|всё; ' +
      'something|что-то, что-нибудь; nothing|ничего, ничто; everyone|все, каждый; someone|кто-то, кто-нибудь; each|каждый; every|каждый; all|все, весь; ' +
      'some|несколько, немного; many|много (с исчисляемыми); much|много (с неисчисляемыми); a lot of|много; and|и; so|так, поэтому'],
    ['A1', 'x', 'than|чем (при сравнении); this|этот, это; that|тот, то, что (союз); these|эти; those|те; here is|вот (здесь есть); there is|есть, имеется; ' +
      'there are|есть, имеются (мн. ч.); on|на; in|в; at|в, у, на (о месте, времени); each other|друг друга; for|для, в течение; of|из (принадлежность); ' +
      'by|у, возле, к (сроку); up|вверх; down|вниз; out|наружу; how much|сколько (с неисчисляемыми); how many|сколько (с исчисляемыми)'],
    // слова из текстов раздела «Чтение»
    ['A1', 'x', 'hi|привет; hello|здравствуйте, привет; any|любой, какой-нибудь; eleven|одиннадцать; twelve|двенадцать; fifteen|пятнадцать; thirty|тридцать; forty|сорок; fifty|пятьдесят; sixty|шестьдесят; seventy|семьдесят; eighty|восемьдесят; ninety|девяносто'],
    ['A1', 'n', 'south|юг; north|север; east|восток; west|запад; toast|тост (жареный хлеб); burger|бургер; TV|телевизор; pound|фунт; grandma|бабушка; line|линия, строка, очередь'],
    ['A1', 'a', 'second|второй; third|третий'],
    ['A1', 'd', 'o\'clock|час (ровно): at five o\'clock — в пять часов']
  );
})(window.EG = window.EG || {});
