/* data/wordbank.js — отдельные слова для тренажёра «Словарный запас» (перевод с выбором из 4 вариантов).
   Формат строки: 'english|перевод; english|перевод, синоним'. Пояснение в скобках показывается,
   но при сравнении переводов не учитывается. Если два слова — синонимы, дайте им общий перевод:
   тогда они не попадут в варианты ответа друг к другу. */
(function (EG) {
  'use strict';

  var D = EG.data = EG.data || {};

  // часть речи: n — существительное, v — глагол, a — прилагательное, d — наречие
  var RAW = [
    /* ================= A1 ================= */
    ['A1', 'n', 'time|время; day|день; year|год; week|неделя; month|месяц; hour|час; minute|минута; morning|утро; evening|вечер; night|ночь; ' +
      'man|мужчина; woman|женщина; child|ребёнок; boy|мальчик; girl|девочка; friend|друг; family|семья; mother|мама, мать; father|папа, отец; ' +
      'brother|брат; sister|сестра; son|сын; daughter|дочь; husband|муж; wife|жена; parents|родители; name|имя; house|дом (здание); home|дом (жильё); ' +
      'room|комната; kitchen|кухня; bed|кровать; table|стол; chair|стул; door|дверь; window|окно; city|город; street|улица; country|страна'],
    ['A1', 'n', 'shop|магазин; school|школа; job|работа (должность); money|деньги; food|еда; water|вода; bread|хлеб; milk|молоко; coffee|кофе; tea|чай; ' +
      'apple|яблоко; egg|яйцо; meat|мясо; fish|рыба; car|машина; bus|автобус; train|поезд; plane|самолёт; ticket|билет; book|книга; phone|телефон; ' +
      'computer|компьютер; dog|собака; cat|кошка; bird|птица; sun|солнце; rain|дождь; snow|снег; weather|погода; head|голова; hand|рука (кисть); ' +
      'eye|глаз; face|лицо; hair|волосы; clothes|одежда; shirt|рубашка; shoes|обувь, туфли; colour|цвет; music|музыка; film|фильм'],
    ['A1', 'n', 'game|игра; question|вопрос; word|слово; language|язык (речь); lesson|урок; teacher|учитель; student|студент; doctor|врач; hospital|больница; ' +
      'breakfast|завтрак; lunch|обед; dinner|ужин; restaurant|ресторан; party|вечеринка; birthday|день рождения; holiday|праздник, отпуск; sea|море; ' +
      'river|река; tree|дерево; flower|цветок; key|ключ; bag|сумка; box|коробка; picture|картинка; letter|письмо, буква; number|число, номер; people|люди; ' +
      'baby|малыш, младенец; animal|животное; hotel|гостиница, отель; airport|аэропорт; station|вокзал, станция; park|парк; beach|пляж; cup|чашка; glass|стакан, стекло'],
    ['A1', 'n', 'plate|тарелка; spoon|ложка; knife|нож; fork|вилка; sugar|сахар; salt|соль; cheese|сыр; chicken|курица; rice|рис; potato|картофель; ' +
      'orange|апельсин; banana|банан; juice|сок; wine|вино; cake|торт; shower|душ; hobby|хобби; weekend|выходные; dress|платье; hat|шляпа; ' +
      'jacket|куртка; bike|велосипед; map|карта (местности); pen|ручка; paper|бумага; homework|домашнее задание; office|офис; city centre|центр города; ' +
      'bathroom|ванная; garden|сад; floor|пол, этаж; wall|стена; clock|часы (настенные); boyfriend|парень (молодой человек); girlfriend|девушка (подруга)'],
    ['A1', 'v', 'be|быть; have|иметь; do|делать; go|идти, ехать; come|приходить; see|видеть; look|смотреть; watch|смотреть (фильм), наблюдать; listen|слушать; ' +
      'hear|слышать; say|сказать; tell|рассказывать; speak|говорить (на языке); talk|разговаривать; ask|спрашивать; know|знать; think|думать; want|хотеть; ' +
      'like|нравиться; love|любить; need|нуждаться; eat|есть (пищу); drink|пить; sleep|спать; live|жить; work|работать; play|играть; read|читать; write|писать'],
    ['A1', 'v', 'open|открывать; close|закрывать; buy|покупать; sell|продавать; pay|платить; give|давать; take|брать; get|получать; put|класть; sit|сидеть; ' +
      'stand|стоять; walk|гулять, ходить пешком; run|бегать; swim|плавать; cook|готовить (еду); wash|мыть; help|помогать; learn|учить, узнавать; ' +
      'study|учиться, изучать; understand|понимать; remember|помнить; forget|забывать; start|начинать; finish|заканчивать; wait|ждать; call|звонить; ' +
      'meet|встречать; visit|посещать, навещать; travel|путешествовать; dance|танцевать; sing|петь; drive|водить (машину); find|находить; lose|терять; ' +
      'show|показывать; try|пытаться, пробовать; use|использовать; stay|оставаться; leave|уходить, уезжать; arrive|прибывать; carry|нести; bring|приносить; ' +
      'send|отправлять; cost|стоить; wear|носить (одежду); feel|чувствовать'],
    ['A1', 'a', 'good|хороший; bad|плохой; big|большой; small|маленький; new|новый; old|старый; young|молодой; hot|горячий, жаркий; cold|холодный; ' +
      'happy|счастливый; sad|грустный; tired|уставший; hungry|голодный; beautiful|красивый; nice|приятный, милый; easy|лёгкий, простой; difficult|трудный, сложный; ' +
      'fast|быстрый; slow|медленный; long|длинный; short|короткий; tall|высокий; cheap|дешёвый; expensive|дорогой; clean|чистый; dirty|грязный; full|полный; ' +
      'empty|пустой; right|правильный, правый; wrong|неправильный; free|свободный, бесплатный; busy|занятой; ready|готовый; late|поздний; early|ранний; ' +
      'favourite|любимый; different|разный, другой; same|тот же самый, одинаковый; white|белый; black|чёрный; red|красный; green|зелёный; blue|синий, голубой; ' +
      'yellow|жёлтый; warm|тёплый; funny|смешной; interesting|интересный; boring|скучный; strong|сильный; weak|слабый; sick|больной; rich|богатый; poor|бедный'],
    ['A1', 'd', 'now|сейчас; today|сегодня; tomorrow|завтра; yesterday|вчера; always|всегда; never|никогда; often|часто; sometimes|иногда; usually|обычно; ' +
      'here|здесь; there|там; very|очень; again|снова; also|тоже, также; together|вместе; soon|скоро; later|позже, потом; already|уже; still|всё ещё; well|хорошо'],

    /* ================= A2 ================= */
    ['A2', 'n', 'advice|совет; air|воздух; area|район, область; bill|счёт (к оплате); bottle|бутылка; bridge|мост; building|здание; business|бизнес, дело; ' +
      'camera|фотоаппарат, камера; card|карта, открытка; century|век; change|перемена, сдача; choice|выбор; cloud|облако; coast|побережье; corner|угол; ' +
      'culture|культура; customer|клиент, покупатель; danger|опасность; dream|мечта, сон; earth|земля (планета); environment|окружающая среда; exam|экзамен; ' +
      'experience|опыт; factory|завод, фабрика; farm|ферма; fire|огонь, пожар; forest|лес; future|будущее; gift|подарок; guest|гость; health|здоровье'],
    ['A2', 'n', 'heart|сердце; hill|холм; history|история (наука); idea|идея; island|остров; journey|поездка, путешествие; lake|озеро; law|закон; library|библиотека; ' +
      'life|жизнь; luggage|багаж; market|рынок; meal|приём пищи; medicine|лекарство; meeting|встреча, собрание; message|сообщение; mind|ум, разум; ' +
      'mistake|ошибка; moon|луна; mountain|гора; neighbour|сосед; news|новости; noise|шум; ocean|океан; opinion|мнение; pain|боль; passport|паспорт; ' +
      'past|прошлое; plan|план; pocket|карман; police|полиция; price|цена; problem|проблема; queue|очередь; reason|причина; rent|арендная плата; rest|отдых'],
    ['A2', 'n', 'road|дорога; rule|правило; safety|безопасность; salary|зарплата; screen|экран; season|время года, сезон; seat|сиденье, место; shape|форма (очертание); ' +
      'sky|небо; smell|запах; soap|мыло; song|песня; sound|звук; space|пространство, космос; speed|скорость; star|звезда; storm|буря, шторм; ' +
      'story|рассказ, история; success|успех; suitcase|чемодан; surprise|сюрприз, удивление; taste|вкус; temperature|температура; tooth|зуб; tour|экскурсия, тур; ' +
      'towel|полотенце; town|городок; toy|игрушка; traffic|движение (транспорта), пробки; umbrella|зонт; village|деревня; voice|голос; war|война; wind|ветер; world|мир (планета)'],
    ['A2', 'n', 'accident|авария, несчастный случай; adult|взрослый; age|возраст; aunt|тётя; uncle|дядя; boss|начальник; trousers|брюки; coat|пальто; ' +
      'sweater|свитер; gloves|перчатки; socks|носки; fridge|холодильник; oven|духовка; sofa|диван; mirror|зеркало; wallet|кошелёк; leg|нога; arm|рука (от плеча); ' +
      'back|спина; stomach|живот, желудок; nose|нос; mouth|рот; ear|ухо; neck|шея; finger|палец; knee|колено; shoulder|плечо; skin|кожа; blood|кровь; ' +
      'vegetable|овощ; fruit|фрукт; soup|суп; sandwich|бутерброд; menu|меню; waiter|официант; receipt|чек (квитанция); discount|скидка; size|размер; ' +
      'address|адрес; appointment|запись (к врачу), встреча; cousin|двоюродный брат, двоюродная сестра; peace|мир (без войны); team|команда'],
    ['A2', 'v', 'agree|соглашаться; allow|разрешать; reply|отвечать; borrow|брать взаймы; lend|давать взаймы; break|ломать; build|строить; catch|ловить; ' +
      'check|проверять; choose|выбирать; climb|взбираться, лезть; collect|собирать (коллекцию); compare|сравнивать; complain|жаловаться; continue|продолжать; ' +
      'cross|пересекать, переходить; cry|плакать; cut|резать; decide|решать, принимать решение; describe|описывать; die|умирать; draw|рисовать (карандашом); ' +
      'drop|ронять; enjoy|наслаждаться; explain|объяснять; fall|падать; fight|драться, бороться; fill|наполнять; fly|летать; follow|следовать; grow|расти'],
    ['A2', 'v', 'hate|ненавидеть; hide|прятать(ся); hit|ударять; hold|держать; hope|надеяться; hurry|спешить; hurt|причинять боль, болеть; invite|приглашать; ' +
      'join|присоединяться; jump|прыгать; keep|хранить, сохранять; kill|убивать; kiss|целовать; knock|стучать; laugh|смеяться; lie|лгать, лежать; ' +
      'lift|поднимать; miss|скучать, пропускать; move|двигаться, переезжать; order|заказывать; pack|упаковывать, собирать вещи; paint|красить, рисовать (красками); ' +
      'pass|проходить, сдавать (экзамен); prefer|предпочитать; prepare|готовить(ся), подготавливать; promise|обещать; pull|тянуть; push|толкать; relax|расслабляться, отдыхать'],
    ['A2', 'v', 'repair|чинить, ремонтировать; repeat|повторять; return|возвращать(ся); save|спасать, экономить; shout|кричать; smile|улыбаться; smoke|курить; ' +
      'spend|тратить; steal|красть; stop|останавливать(ся); teach|учить (кого-то), преподавать; throw|бросать; touch|трогать; turn|поворачивать; ' +
      'wake up|просыпаться; win|выигрывать, побеждать; worry|волноваться, беспокоиться; improve|улучшать; practise|практиковаться, тренироваться; guess|угадывать; ' +
      'happen|случаться, происходить; mean|значить, иметь в виду; believe|верить; belong|принадлежать; fit|подходить (по размеру); feed|кормить; ' +
      'hang|вешать, висеть; marry|жениться, выйти замуж; share|делиться; shake|трясти; kick|пинать; count|считать (числа); receive|получать (письмо, подарок)'],
    ['A2', 'a', 'angry|злой, сердитый; afraid|испуганный, боящийся; bored|скучающий; brave|храбрый, смелый; bright|яркий; calm|спокойный; careful|осторожный; ' +
      'cheerful|весёлый, жизнерадостный; comfortable|удобный; common|распространённый; cool|прохладный, классный; crazy|сумасшедший; dangerous|опасный; dark|тёмный; ' +
      'dead|мёртвый; deep|глубокий; delicious|вкусный; dry|сухой; excited|взволнованный (радостно); famous|знаменитый, известный; fat|толстый; foreign|иностранный; ' +
      'friendly|дружелюбный; heavy|тяжёлый; honest|честный; huge|огромный; important|важный; kind|добрый; lazy|ленивый; lonely|одинокий'],
    ['A2', 'a', 'loud|громкий; lucky|везучий, удачливый; modern|современный; narrow|узкий; wide|широкий; nervous|нервный; noisy|шумный; quiet|тихий; polite|вежливый; ' +
      'rude|грубый, невежливый; popular|популярный; possible|возможный; pretty|симпатичный, милый; proud|гордый; real|настоящий, реальный; safe|безопасный; salty|солёный; ' +
      'sweet|сладкий; sour|кислый; bitter|горький; serious|серьёзный; sharp|острый; shy|застенчивый; similar|похожий; soft|мягкий; hard|твёрдый, трудный; ' +
      'strange|странный; sure|уверенный; surprised|удивлённый; terrible|ужасный; thin|тонкий, худой; thick|толстый (о предмете); ugly|некрасивый, уродливый; ' +
      'useful|полезный; wet|мокрый; wild|дикий; wonderful|чудесный; worried|обеспокоенный; healthy|здоровый; true|правдивый, верный; unusual|необычный; ' +
      'clever|умный; stupid|глупый; whole|целый; own|собственный; necessary|необходимый; single|одиночный, холостой'],
    ['A2', 'd', 'almost|почти; actually|на самом деле; anyway|в любом случае, всё равно; certainly|конечно, безусловно; especially|особенно; exactly|точно, именно; ' +
      'finally|наконец; hardly|едва, вряд ли; immediately|немедленно, сразу; maybe|может быть, возможно; only|только; probably|вероятно; quite|довольно, вполне; ' +
      'really|действительно, правда; recently|недавно; suddenly|внезапно, вдруг; twice|дважды; everywhere|везде; nowhere|нигде; abroad|за границей; outside|снаружи, на улице; ' +
      'inside|внутри; upstairs|наверху; downstairs|внизу; forward|вперёд; enough|достаточно; instead|вместо этого; ago|назад (тому назад); once|однажды, один раз'],

    /* ================= B1 ================= */
    ['B1', 'n', 'ability|способность; access|доступ; achievement|достижение; advantage|преимущество; disadvantage|недостаток; advertisement|реклама; agreement|соглашение; ' +
      'aim|цель; amount|количество; argument|спор, довод; attention|внимание; attitude|отношение (к чему-то); audience|зрители, аудитория; average|среднее значение; ' +
      'behaviour|поведение; belief|убеждение, вера; benefit|польза, выгода; career|карьера; cause|причина; challenge|вызов, сложная задача; character|характер, персонаж; ' +
      'charity|благотворительность; citizen|гражданин; community|сообщество; competition|соревнование, конкуренция; condition|условие, состояние; confidence|уверенность'],
    ['B1', 'n', 'connection|связь; crime|преступление; crowd|толпа; damage|ущерб, повреждение; decision|решение; degree|степень, градус; delay|задержка; demand|спрос, требование; ' +
      'departure|отправление, отъезд; development|развитие; device|устройство; difference|разница; direction|направление; disease|болезнь; distance|расстояние; ' +
      'duty|долг, обязанность; economy|экономика; education|образование; effect|эффект, результат; effort|усилие; election|выборы; emotion|эмоция; employee|сотрудник; ' +
      'employer|работодатель; energy|энергия; equipment|оборудование; event|событие; evidence|доказательства, улики; exhibition|выставка; expert|эксперт, специалист'],
    ['B1', 'n', 'failure|неудача, провал; fear|страх; feature|особенность, черта; freedom|свобода; fuel|топливо; goal|цель, гол; government|правительство; growth|рост; ' +
      'guide|гид, путеводитель; habit|привычка; image|образ, изображение; income|доход; industry|промышленность; influence|влияние; injury|травма; insurance|страховка; ' +
      'interview|собеседование, интервью; invention|изобретение; knowledge|знания; lack|нехватка; leader|лидер; level|уровень; loss|потеря; material|материал; ' +
      'memory|память, воспоминание; method|метод, способ; mood|настроение; nature|природа; opportunity|возможность; option|вариант, выбор'],
    ['B1', 'n', 'patience|терпение; performance|выступление, результативность; permission|разрешение; pollution|загрязнение; population|население; pressure|давление; ' +
      'pride|гордость; purpose|цель, назначение; quality|качество; range|диапазон, ассортимент; relationship|отношения (между людьми); research|исследование; ' +
      'resource|ресурс; responsibility|ответственность; risk|риск; schedule|расписание, график; service|услуга, обслуживание; skill|навык, умение; society|общество; ' +
      'solution|решение (проблемы); source|источник; stress|стресс; subject|предмет, тема; suggestion|предложение (идея); support|поддержка; survey|опрос; ' +
      'talent|талант; target|мишень, цель; technology|технология; tradition|традиция; trend|тенденция, тренд; trust|доверие; truth|правда, истина; value|ценность; ' +
      'victim|жертва; view|вид, взгляд; wealth|богатство; wisdom|мудрость; youth|молодость, молодёжь; deadline|крайний срок; feedback|обратная связь, отзыв; ' +
      'complaint|жалоба; refund|возврат денег; rumour|слух; gossip|сплетни; neighbourhood|округа, район'],
    ['B1', 'v', 'achieve|достигать; admit|признавать; affect|влиять на, затрагивать; afford|позволить себе (по деньгам); apologize|извиняться; appear|появляться, казаться; ' +
      'apply|подавать заявление, применять; appreciate|ценить; argue|спорить; arrange|организовывать, договариваться; attack|нападать; attend|посещать (занятия); ' +
      'avoid|избегать; behave|вести себя; blame|винить; breathe|дышать; calculate|вычислять, подсчитывать; cancel|отменять; celebrate|праздновать; claim|утверждать, заявлять; ' +
      'communicate|общаться; concentrate|сосредоточиться; confirm|подтверждать; consider|рассматривать, обдумывать; contain|содержать; convince|убеждать; create|создавать'],
    ['B1', 'v', 'deliver|доставлять; deny|отрицать; depend|зависеть; deserve|заслуживать; destroy|разрушать, уничтожать; develop|развивать; disappear|исчезать; ' +
      'discover|обнаруживать, открывать; discuss|обсуждать; earn|зарабатывать; encourage|поощрять, подбадривать; estimate|оценивать (примерно); exchange|обменивать; ' +
      'expect|ожидать; express|выражать; fail|потерпеть неудачу, провалить; force|заставлять, вынуждать; forgive|прощать; gain|приобретать, набирать; ignore|игнорировать; ' +
      'imagine|представлять себе; include|включать; increase|увеличивать; reduce|уменьшать, сокращать; inform|сообщать, информировать; insist|настаивать; ' +
      'intend|намереваться; introduce|представлять (знакомить), вводить; manage|справляться, управлять; measure|измерять; mention|упоминать; notice|замечать'],
    ['B1', 'v', 'offer|предлагать; persuade|уговаривать, убеждать; predict|предсказывать; pretend|притворяться; prevent|предотвращать; produce|производить; protect|защищать; ' +
      'prove|доказывать; provide|обеспечивать, предоставлять; publish|публиковать; realize|осознавать; recognize|узнавать (знакомое), признавать; recommend|рекомендовать, советовать; ' +
      'refuse|отказываться; regret|сожалеть; reject|отвергать, отклонять; rely|полагаться; remind|напоминать; remove|удалять, убирать; replace|заменять; ' +
      'require|требовать; rescue|спасать; respect|уважать; satisfy|удовлетворять; search|искать; seem|казаться; solve|решать (задачу); spread|распространять(ся); ' +
      'succeed|преуспевать, добиваться успеха; suffer|страдать; suggest|предлагать, советовать; supply|снабжать, поставлять; suppose|предполагать; surround|окружать; ' +
      'survive|выживать; threaten|угрожать; translate|переводить (текст); warn|предупреждать; waste|тратить впустую; weigh|весить, взвешивать; ' +
      'wonder|задаваться вопросом, интересоваться; recover|выздоравливать, восстанавливаться'],
    ['B1', 'a', 'accurate|точный; active|активный; aggressive|агрессивный; alive|живой; ancient|древний; anxious|тревожный, беспокойный; available|доступный, в наличии; ' +
      'aware|осведомлённый, знающий; awkward|неловкий; basic|базовый, основной; brilliant|блестящий, великолепный; certain|определённый, уверенный; confident|уверенный в себе; ' +
      'confused|сбитый с толку, растерянный; convenient|удобный (по времени, месту); curious|любопытный; current|текущий, нынешний; decent|приличный, порядочный; ' +
      'disappointed|разочарованный; efficient|эффективный; embarrassed|смущённый; equal|равный; essential|существенный, необходимый; exhausted|измотанный; ' +
      'extra|дополнительный; fair|справедливый; false|ложный; familiar|знакомый; fashionable|модный; flexible|гибкий; frightened|напуганный, испуганный'],
    ['B1', 'a', 'generous|щедрый; gentle|нежный, мягкий; grateful|благодарный; guilty|виновный, виноватый; harmful|вредный; helpful|полезный, готовый помочь; ' +
      'independent|независимый; innocent|невиновный; jealous|ревнивый, завистливый; legal|законный; likely|вероятный; local|местный; main|главный, основной; ' +
      'mental|психический, умственный; negative|отрицательный; positive|положительный; obvious|очевидный; ordinary|обычный, заурядный; original|оригинальный, исходный; ' +
      'patient|терпеливый; personal|личный; physical|физический; pleasant|приятный; practical|практичный; previous|предыдущий; private|частный, личный; ' +
      'public|общественный, публичный; rare|редкий; reasonable|разумный; relaxed|расслабленный; reliable|надёжный; responsible|ответственный; selfish|эгоистичный; ' +
      'sensible|благоразумный, здравомыслящий; sensitive|чувствительный; severe|суровый, серьёзный; silly|глупый, дурацкий; smooth|гладкий; spare|запасной, свободный; ' +
      'specific|конкретный; successful|успешный; suitable|подходящий; tiny|крошечный; typical|типичный; unfair|несправедливый; upset|расстроенный; valuable|ценный; ' +
      'various|различный, разнообразный; violent|жестокий; visible|видимый; willing|готовый (охотно)'],
    ['B1', 'd', 'apparently|по-видимому, судя по всему; completely|полностью; definitely|определённо, точно; eventually|в конце концов; fortunately|к счастью; ' +
      'unfortunately|к сожалению; gradually|постепенно; honestly|честно; mostly|в основном; obviously|очевидно; originally|изначально; particularly|в особенности, особенно; ' +
      'properly|как следует, правильно; rarely|редко; regularly|регулярно; seriously|серьёзно; slightly|слегка, немного; therefore|поэтому, следовательно; ' +
      'meanwhile|тем временем; otherwise|иначе, в противном случае; nowadays|в наше время; frankly|откровенно говоря; simply|просто; directly|прямо, напрямую; ' +
      'totally|совершенно, полностью; afterwards|впоследствии, потом'],

    /* ================= B2 ================= */
    ['B2', 'n', 'acquaintance|знакомый (человек); adjustment|корректировка, настройка; ambition|амбиция, стремление; anxiety|тревога; appearance|внешность, появление; ' +
      'approach|подход; assumption|предположение; awareness|осведомлённость; background|происхождение, фон; bias|предвзятость; boundary|граница (предел); burden|бремя; ' +
      'campaign|кампания; circumstance|обстоятельство; commitment|обязательство, преданность; compromise|компромисс; concern|беспокойство, забота; consequence|последствие; ' +
      'contribution|вклад; controversy|спор, полемика; criticism|критика; curiosity|любопытство; debt|долг (денежный); dilemma|дилемма; disaster|катастрофа, бедствие; ' +
      'emphasis|акцент, упор; encounter|встреча (неожиданная); enthusiasm|энтузиазм; expectation|ожидание; expense|расход, затрата; fault|вина, неисправность'],
    ['B2', 'n', 'flaw|изъян, недостаток; framework|рамки, структура; guilt|чувство вины; hesitation|колебание, нерешительность; implication|последствие, подтекст; ' +
      'impression|впечатление; incentive|стимул; insight|понимание, озарение; integrity|честность, порядочность; intention|намерение; issue|проблема, вопрос; ' +
      'justice|справедливость; landscape|пейзаж; loyalty|верность, преданность; majority|большинство; minority|меньшинство; mess|беспорядок; obstacle|препятствие; ' +
      'outcome|результат, исход; perspective|точка зрения, перспектива; phenomenon|явление; priority|приоритет; procedure|процедура; proposal|предложение (официальное); ' +
      'prospect|перспектива; recession|спад (экономический); reputation|репутация; resistance|сопротивление; revenue|выручка, доход; strategy|стратегия; ' +
      'strength|сила (сильная сторона); weakness|слабость; tendency|тенденция, склонность; tension|напряжение; threat|угроза; tolerance|терпимость; transition|переход; ' +
      'uncertainty|неопределённость; venue|место проведения; witness|свидетель; breakthrough|прорыв; drawback|недостаток, минус; setback|неудача, препятствие; ' +
      'workload|рабочая нагрузка; shortage|нехватка, дефицит; stereotype|стереотип'],
    ['B2', 'v', 'abandon|покидать, бросать; accomplish|выполнять, достигать; acknowledge|признавать; adapt|приспосабливаться, адаптировать; allocate|распределять, выделять; ' +
      'anticipate|предвидеть, ожидать; assess|оценивать; assume|предполагать; attempt|пытаться; bargain|торговаться; bother|беспокоить, утруждать себя; ' +
      'collapse|рушиться, обваливаться; commit|совершать, брать обязательство; compensate|возмещать, компенсировать; comply|соблюдать, подчиняться; conceal|скрывать; ' +
      'conclude|заключать, делать вывод; confront|противостоять, сталкиваться; consult|консультироваться; contradict|противоречить; cope|справляться; criticize|критиковать; ' +
      'declare|объявлять, заявлять; decline|отклонять, снижаться; demonstrate|демонстрировать; determine|определять; distinguish|различать; distract|отвлекать'],
    ['B2', 'v', 'emerge|появляться, возникать; emphasize|подчёркивать; enable|давать возможность, позволять; enhance|улучшать, усиливать; ensure|обеспечивать, гарантировать; ' +
      'exaggerate|преувеличивать; exceed|превышать; exploit|эксплуатировать; grasp|схватывать, понимать; hesitate|колебаться, сомневаться; highlight|выделять, подчёркивать; ' +
      'imply|подразумевать; impose|навязывать; indicate|указывать; interfere|вмешиваться; interpret|толковать, интерпретировать; justify|оправдывать; maintain|поддерживать, сохранять; ' +
      'neglect|пренебрегать; negotiate|вести переговоры; obtain|получать, добывать; occur|происходить, случаться; overcome|преодолевать; overlook|упускать из виду; ' +
      'postpone|откладывать, переносить; pursue|преследовать, добиваться; reassure|успокаивать, ободрять; reflect|отражать, размышлять; reinforce|усиливать, укреплять; ' +
      'resemble|походить на; resign|увольняться (по собственному желанию); resolve|разрешать (конфликт), решать; restore|восстанавливать; retain|удерживать, сохранять; ' +
      'reveal|раскрывать, обнаруживать; seize|хватать, захватывать; stumble|спотыкаться; sustain|поддерживать; undergo|подвергаться, проходить (лечение); ' +
      'undermine|подрывать; urge|призывать, убеждать; withdraw|снимать (деньги), отступать; yield|уступать, приносить (доход)'],
    ['B2', 'a', 'absurd|нелепый, абсурдный; accessible|доступный; adequate|адекватный, достаточный; ambitious|амбициозный; apparent|очевидный, кажущийся; ' +
      'appropriate|уместный, подходящий; arrogant|высокомерный; bold|дерзкий, смелый; cautious|осторожный; competitive|конкурентный, соревновательный; complex|сложный; ' +
      'considerate|внимательный к другим; consistent|последовательный; crucial|решающий, ключевой; cynical|циничный; decisive|решительный; deliberate|намеренный; ' +
      'demanding|требовательный; desperate|отчаянный; distinct|отчётливый, особый; eager|жаждущий, стремящийся; enormous|огромный, громадный; evident|очевидный; ' +
      'excessive|чрезмерный; exclusive|эксклюзивный, исключительный; explicit|явный, недвусмысленный; fierce|свирепый, яростный; fragile|хрупкий; genuine|подлинный, искренний'],
    ['B2', 'a', 'hostile|враждебный; humble|скромный; ignorant|невежественный; inevitable|неизбежный; intense|интенсивный, напряжённый; keen|увлечённый, заинтересованный; ' +
      'legitimate|законный, обоснованный; mature|зрелый; modest|скромный; naive|наивный; neutral|нейтральный; notorious|печально известный; outstanding|выдающийся; ' +
      'persistent|настойчивый, упорный; plausible|правдоподобный; precise|точный; predictable|предсказуемый; prominent|видный, выдающийся; relevant|относящийся к делу, актуальный; ' +
      'reluctant|неохотный, не желающий; remarkable|замечательный; restless|беспокойный, неугомонный; ridiculous|нелепый, смешной; rigid|жёсткий, негибкий; robust|прочный, крепкий; ' +
      'rough|грубый, шершавый; scarce|скудный, дефицитный; sophisticated|утончённый, сложный; spontaneous|спонтанный; stable|стабильный, устойчивый; ' +
      'straightforward|простой, прямолинейный; stubborn|упрямый; subtle|тонкий, едва заметный; sufficient|достаточный; superficial|поверхностный; thorough|тщательный; ' +
      'tough|жёсткий, трудный; vague|расплывчатый; vulnerable|уязвимый; worthwhile|стоящий'],
    ['B2', 'd', 'accordingly|соответственно; approximately|приблизительно; barely|едва; consequently|следовательно; deliberately|намеренно, нарочно; effectively|эффективно, фактически; ' +
      'entirely|целиком, полностью; furthermore|более того; inevitably|неизбежно; merely|лишь, просто; nevertheless|тем не менее; presumably|предположительно; ' +
      'relatively|относительно; seemingly|по-видимому, казалось бы; significantly|значительно; thoroughly|тщательно; ultimately|в конечном счёте; undoubtedly|несомненно; ' +
      'somewhat|отчасти, несколько'],

    /* ================= C1 ================= */
    ['C1', 'n', 'adversity|невзгоды, беды; aftermath|последствия (бедствия); ambiguity|двусмысленность; anecdote|случай из жизни; benchmark|ориентир, эталон; ' +
      'clarity|ясность; complacency|самоуспокоенность; conscience|совесть; consensus|единое мнение, консенсус; discrepancy|расхождение, несоответствие; dismay|смятение, тревога; ' +
      'disposition|характер, склонность; endeavour|старание, попытка; fallacy|заблуждение; hindsight|задний ум, взгляд в прошлое; hurdle|препятствие, барьер; ' +
      'inquiry|расследование, запрос; leeway|свобода действий; merit|достоинство, заслуга; nuance|нюанс; ordeal|тяжёлое испытание; pitfall|подводный камень, ловушка; ' +
      'plight|бедственное положение; premise|предпосылка; rapport|взаимопонимание; remedy|средство (от чего-то); scrutiny|пристальное внимание; stamina|выносливость; ' +
      'stance|позиция; turmoil|смятение, беспорядки; upheaval|переворот, потрясение; whim|каприз, прихоть; zeal|рвение, усердие'],
    ['C1', 'v', 'alleviate|облегчать (боль), смягчать; ascertain|выяснять, устанавливать; bolster|укреплять, поддерживать; circumvent|обходить (правила); coerce|принуждать; ' +
      'condone|мириться с, потворствовать; convey|передавать (смысл); curtail|сокращать, урезать; deter|удерживать, отпугивать; discern|различать, распознавать; ' +
      'elicit|вызывать (реакцию), выявлять; encompass|охватывать; endorse|одобрять, поддерживать публично; entail|влечь за собой; exacerbate|усугублять; ' +
      'facilitate|облегчать, содействовать; flourish|процветать; foster|способствовать, воспитывать; hamper|мешать, затруднять; linger|задерживаться, медлить; ' +
      'mitigate|смягчать (последствия); nurture|взращивать, растить; outweigh|перевешивать; perceive|воспринимать; plead|умолять, просить; ponder|обдумывать, размышлять; ' +
      'refrain|воздерживаться; relish|наслаждаться, смаковать; rectify|исправлять; scrutinize|тщательно изучать; strive|стремиться; substantiate|обосновывать; ' +
      'thrive|процветать, преуспевать; undertake|предпринимать, браться за; waive|отказываться (от права)'],
    ['C1', 'a', 'adamant|непреклонный; ambiguous|двусмысленный; arbitrary|произвольный; astute|проницательный; benevolent|доброжелательный; blatant|вопиющий, явный; ' +
      'candid|откровенный, прямой; coherent|связный, логичный; complacent|самодовольный; compulsory|обязательный; conspicuous|заметный, бросающийся в глаза; ' +
      'daunting|пугающий (сложностью); diligent|усердный, прилежный; discreet|сдержанный, тактичный; eloquent|красноречивый; feasible|осуществимый; frugal|бережливый; ' +
      'gullible|легковерный, доверчивый; impartial|беспристрастный; imminent|неминуемый; inherent|присущий, неотъемлемый; meticulous|дотошный, скрупулёзный; ' +
      'mundane|обыденный, приземлённый; obsolete|устаревший; ominous|зловещий; pragmatic|прагматичный; profound|глубокий (смысл, влияние); prolific|плодовитый; ' +
      'prudent|благоразумный, осмотрительный; resilient|стойкий, жизнестойкий; tedious|утомительный, нудный; tenacious|упорный, цепкий; trivial|пустяковый, банальный; ' +
      'ubiquitous|вездесущий, повсеместный; versatile|разносторонний, универсальный; vivid|яркий, живой; wary|настороженный'],
    ['C1', 'd', 'arguably|пожалуй, вероятно; inadvertently|нечаянно, непреднамеренно; invariably|неизменно; predominantly|преимущественно; profoundly|глубоко; ' +
      'reluctantly|неохотно; scarcely|едва, вряд ли; subsequently|впоследствии; vastly|значительно, намного; notably|в частности, заметно']
  ];

  var POS = { n: 'сущ.', v: 'глаг.', a: 'прил.', d: 'нареч.' };

  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  /** Переводы без пояснений в скобках — для сравнения синонимов. */
  function senses(ru) {
    return ru.replace(/\([^)]*\)/g, '').split(',').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
  }

  var words = [], byId = Object.create(null), order = 0;
  RAW.forEach(function (row) {
    row[2].split(';').forEach(function (pair) {
      var p = pair.split('|');
      if (p.length !== 2) return;
      var en = p[0].trim(), ru = p[1].trim();
      var id = slug(en);
      if (byId[id]) id += '-' + row[1];
      var w = { id: id, en: en, ru: ru, level: row[0], pos: row[1], order: order++, senses: senses(ru) };
      words.push(w);
      byId[id] = w;
    });
  });

  // rank — место слова внутри своей группы «уровень × часть речи» (0…1): новые слова идут
  // вперемешку по частям речи, но в порядке частотности внутри каждой части
  var groups = {};
  words.forEach(function (w) { (groups[w.level + w.pos] = groups[w.level + w.pos] || []).push(w); });
  Object.keys(groups).forEach(function (k) { groups[k].forEach(function (w, i, a) { w.rank = i / a.length; }); });

  D.words = words;
  D.wordsById = byId;
  D.wordPos = POS;
})(window.EG = window.EG || {});
