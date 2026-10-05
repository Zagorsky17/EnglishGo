/* irregular/irregular-data.js — неправильные глаголы: данные для разделов «Неправильные глаголы» (таблица)
   и «Неправильные глаголы сегодня» (тренировка). Только данные, без логики и DOM → EG.irregular.data.

   Глаголы сгруппированы по звучанию: правило группы помогает запомнить сразу несколько глаголов.
   Строка: 'base|V2|V3|перевод|пример с V2|пример с V3'.
     Варианты формы — через «/» (got/gotten); первый вариант — основной.
     В примерах ровно одна пара [скобок] вокруг формы: в примере с V2 — один из вариантов V2, с V3 — один из V3.
     В примере с V2 должен быть сигнал прошлого (yesterday, last…, in 2015) или очевидный контекст,
     в примере с V3 — have / has / been: так в задании «Вставь форму» ответ однозначен.
   id глагола = base: переименование base сбрасывает прогресс этого глагола. */
(function (EG) {
  'use strict';

  var D = (EG.irregular = EG.irregular || {}).data = {};

  var GROUPS = [
    { id: 'same', title: 'Все три одинаковые', pattern: 'A — A — A', ex: 'cut — cut — cut',
      rule: 'Форма не меняется. Прошедшее время понятно из контекста: yesterday, has, have.', rows: [
      'cut|cut|cut|резать|I [cut] my finger yesterday.|Have you [cut] the bread?',
      'put|put|put|класть, ставить|Last night she [put] the keys on the table.|Where have you [put] my phone?',
      'let|let|let|позволять|Yesterday my parents [let] me stay up late.|They have never [let] us down.',
      'set|set|set|устанавливать, ставить|We [set] the table an hour ago.|I have [set] an alarm for seven.',
      'hit|hit|hit|ударять, попадать|The ball [hit] the window last week.|Prices have [hit] a new record.',
      'hurt|hurt|hurt|ранить, болеть|I [hurt] my knee yesterday.|Have you [hurt] yourself?',
      'cost|cost|cost|стоить|The tickets [cost] fifty dollars last year.|The repair has [cost] us a lot.',
      'shut|shut|shut|закрывать|Yesterday he [shut] the door and left.|They have [shut] the shop for the day.',
      'spread|spread|spread|распространять(ся)|The news [spread] quickly yesterday.|The fire has [spread] to the forest.',
      'quit|quit|quit|бросать, уходить|She [quit] her job last month.|I have [quit] smoking.',
      'read|read|read|читать (во 2-й и 3-й форме — [red])|I [read] that book last summer.|Have you [read] the news today?'
    ] },
    { id: 'ought', title: 'Окончание -ought / -aught', pattern: 'A — B — B', ex: 'buy — bought — bought',
      rule: 'Вторая и третья формы одинаковые и звучат как [ɔːt]: bought, thought, caught, taught.', rows: [
      'buy|bought|bought|покупать|I [bought] a new phone last week.|Have you [bought] the tickets yet?',
      'bring|brought|brought|приносить|Yesterday she [brought] a cake to the office.|I have [brought] you some flowers.',
      'think|thought|thought|думать|I [thought] about you yesterday.|Have you [thought] about my offer?',
      'fight|fought|fought|драться, бороться|They [fought] for their rights in the 1960s.|She has [fought] the illness for years.',
      'catch|caught|caught|ловить|He [caught] a big fish last weekend.|I have [caught] a cold.',
      'teach|taught|taught|учить, преподавать|My mum [taught] me to cook when I was ten.|He has [taught] English for twenty years.'
    ] },
    { id: 'short', title: 'Долгий звук становится коротким + t', pattern: 'A — B — B', ex: 'keep — kept — kept',
      rule: 'В основе долгое [iː] или [uː], в формах — короткое [e] или [ɒ] и на конце -t: sleep — slept, feel — felt, lose — lost.', rows: [
      'keep|kept|kept|хранить, держать|She [kept] all his letters for many years.|I have [kept] your secret.',
      'sleep|slept|slept|спать|I [slept] badly last night.|Have you [slept] at all?',
      'feel|felt|felt|чувствовать|I [felt] tired yesterday.|I have never [felt] so happy.',
      'leave|left|left|уходить, оставлять|Yesterday he [left] the office at six.|She has already [left].',
      'mean|meant|meant|значить, иметь в виду|Sorry, yesterday I [meant] Tuesday, not Monday.|This trip has [meant] a lot to me.',
      'meet|met|met|встречать, знакомиться|We [met] at a party two years ago.|Have you [met] my sister?',
      'lose|lost|lost|терять, проигрывать|I [lost] my wallet yesterday.|I have [lost] my keys.',
      'dream|dreamed/dreamt|dreamed/dreamt|мечтать, видеть сон|Last night I [dreamt] about the sea.|I have always [dreamed] of Paris.'
    ] },
    { id: 'dt', title: '-d и -n на конце → -t', pattern: 'A — B — B', ex: 'send — sent — sent',
      rule: 'Звук на конце меняется на -t: send — sent, build — built. У learn и burn можно и -ed: learned, burned.', rows: [
      'build|built|built|строить|They [built] this house in 1990.|We have [built] a new website.',
      'send|sent|sent|отправлять|I [sent] you an email yesterday.|Have you [sent] the report?',
      'spend|spent|spent|тратить, проводить (время)|We [spent] last summer in Spain.|I have [spent] all my money.',
      'lend|lent|lent|одалживать (кому-то)|She [lent] me her car last week.|I have [lent] him a hundred dollars.',
      'learn|learned/learnt|learned/learnt|учить, узнавать|I [learned] to swim when I was five.|What have you [learned] today?',
      'burn|burned/burnt|burned/burnt|жечь, гореть|I [burned] my hand on the stove yesterday.|Oh no, the toast has [burnt]!'
    ] },
    { id: 'aid', title: 'Короткие формы на -d', pattern: 'A — B — B', ex: 'say — said — said',
      rule: 'Очень частые глаголы с короткой формой на -d: say — said, pay — paid, make — made, have — had.', rows: [
      'say|said|said|говорить, сказать|Yesterday he [said] nothing.|I have [said] it many times.',
      'pay|paid|paid|платить|I [paid] for dinner last night.|Have you [paid] the bill?',
      'lay|laid|laid|класть, накрывать (на стол)|She [laid] the table an hour ago.|The hen has [laid] an egg.',
      'make|made|made|делать, создавать|Mum [made] a cake yesterday.|I have [made] a mistake.',
      'have|had|had|иметь|We [had] a great time last weekend.|I have [had] three coffees today.',
      'hear|heard|heard|слышать|I [heard] a strange noise last night.|Have you [heard] the news?'
    ] },
    { id: 'old', title: '-ell → -old, -ind → -ound, -and → -ood', pattern: 'A — B — B', ex: 'tell — told — told',
      rule: 'Устойчивые пары: sell — sold, tell — told, find — found, stand — stood (и understand — understood).', rows: [
      'sell|sold|sold|продавать|They [sold] their car last month.|We have [sold] all the tickets.',
      'tell|told|told|рассказывать, сказать|She [told] me the truth yesterday.|Have you [told] him?',
      'find|found|found|находить|Yesterday I [found] my keys under the sofa.|Have you [found] a job yet?',
      'stand|stood|stood|стоять|We [stood] in the queue for an hour yesterday.|The castle has [stood] here for 500 years.',
      'understand|understood|understood|понимать|I [understood] everything at the lecture yesterday.|Have you [understood] the task?'
    ] },
    { id: 'vowel', title: 'Меняется одна гласная', pattern: 'A — B — B', ex: 'sit — sat — sat',
      rule: 'Меняется только гласная, вторая и третья формы совпадают: sit — sat, get — got, feed — fed.', rows: [
      'sit|sat|sat|сидеть|We [sat] by the fire all evening yesterday.|I have [sat] here for an hour.',
      'win|won|won|выигрывать, побеждать|Our team [won] the match yesterday.|She has [won] three medals.',
      'get|got|got/gotten|получать, становиться|I [got] your message yesterday.|Have you [got] my letter?',
      'shoot|shot|shot|стрелять, снимать (фильм)|They [shot] the film in Italy last year.|He has [shot] three videos this week.',
      'lead|led|led|вести, руководить|In 2018 she [led] the team to victory.|This road has [led] us nowhere.',
      'feed|fed|fed|кормить|I [fed] the cat this morning.|Have you [fed] the dog?',
      'hold|held|held|держать, проводить (встречу)|Yesterday he [held] my hand all evening.|They have [held] the meeting twice.',
      'hang|hung|hung|вешать, висеть|Last week we [hung] the picture on the wall.|I have [hung] my coat in the hall.',
      'light|lit|lit|зажигать|An hour ago she [lit] a candle.|Have you [lit] the fire?'
    ] },
    { id: 'aba', title: 'Третья форма как первая', pattern: 'A — B — A', ex: 'come — came — come',
      rule: 'Третья форма совпадает с первой, меняется только вторая: come — came — come, run — ran — run.', rows: [
      'come|came|come|приходить|He [came] home late yesterday.|Spring has [come].',
      'become|became|become|становиться|She [became] a doctor in 2015.|It has [become] cold.',
      'run|ran|run|бегать, управлять|I [ran] five kilometres yesterday.|Have you ever [run] a marathon?'
    ] },
    { id: 'iau', title: 'i → a → u', pattern: 'A — B — C', ex: 'sing — sang — sung',
      rule: 'Гласная идёт по кругу i → a → u, как в песне: sing — sang — sung, drink — drank — drunk.', rows: [
      'begin|began|begun|начинать|The lesson [began] at nine yesterday.|The film has already [begun].',
      'drink|drank|drunk|пить|I [drank] too much coffee yesterday.|Have you [drunk] your tea?',
      'sing|sang|sung|петь|She [sang] at the party last night.|I have never [sung] on stage.',
      'ring|rang|rung|звонить, звенеть|The phone [rang] at midnight.|Has the bell [rung]?',
      'swim|swam|swum|плавать|We [swam] in the sea yesterday.|I have never [swum] in the ocean.',
      'sink|sank|sunk|тонуть|The Titanic [sank] in 1912.|The boat has [sunk].'
    ] },
    { id: 'ew', title: '-ew и -own', pattern: 'A — B — C', ex: 'know — knew — known',
      rule: 'Вторая форма на -ew, третья на -wn / -n: know — knew — known, fly — flew — flown.', rows: [
      'know|knew|known|знать|Yesterday I [knew] the answer.|I have [known] her for years.',
      'grow|grew|grown|расти, выращивать|She [grew] up in Moscow.|You have [grown] so much!',
      'throw|threw|thrown|бросать|Yesterday he [threw] the ball over the fence.|Have you [thrown] away the old shoes?',
      'blow|blew|blown|дуть|The wind [blew] all night.|The wind has [blown] the roof off.',
      'fly|flew|flown|летать|We [flew] to Rome last summer.|Have you ever [flown] a plane?',
      'draw|drew|drawn|рисовать|My son [drew] a cat yesterday.|She has [drawn] a beautiful map.',
      'show|showed|shown|показывать|Yesterday he [showed] me his photos.|Have you [shown] her the flat?'
    ] },
    { id: 'oen', title: 'o — o + en', pattern: 'A — B — C', ex: 'speak — spoke — spoken',
      rule: 'Во второй форме o, в третьей — та же форма + en: speak — spoke — spoken, break — broke — broken.', rows: [
      'break|broke|broken|ломать|I [broke] my phone last week.|Who has [broken] the window?',
      'speak|spoke|spoken|говорить|We [spoke] on the phone yesterday.|Have you [spoken] to your boss?',
      'choose|chose|chosen|выбирать|Yesterday she [chose] the red dress.|Have you [chosen] a present?',
      'steal|stole|stolen|красть|Someone [stole] my bike last night.|My bike has been [stolen].',
      'freeze|froze|frozen|замерзать|The lake [froze] last winter.|The pipes have [frozen].',
      'wake|woke|woken|просыпаться, будить|I [woke] up at six this morning.|Has the baby [woken] up?',
      'forget|forgot|forgotten|забывать|Yesterday I [forgot] my umbrella at home.|I have [forgotten] his name.'
    ] },
    { id: 'iven', title: 'i — o — i + en', pattern: 'A — B — C', ex: 'write — wrote — written',
      rule: 'Во второй форме o, в третьей возвращается i и добавляется -en: drive — drove — driven, write — wrote — written.', rows: [
      'drive|drove|driven|водить (машину)|Yesterday he [drove] me to the airport.|Have you ever [driven] a truck?',
      'ride|rode|ridden|ездить (верхом, на велосипеде)|Last Sunday we [rode] our bikes to the lake.|I have never [ridden] a horse.',
      'write|wrote|written|писать|She [wrote] me a letter last month.|I have [written] three emails today.',
      'rise|rose|risen|подниматься, вставать|The sun [rose] at five yesterday.|Prices have [risen] again.',
      'bite|bit|bitten|кусать|A dog [bit] me when I was a child.|Have you ever been [bitten] by a snake?',
      'hide|hid|hidden|прятать|Yesterday she [hid] the present under the bed.|Where have you [hidden] the keys?'
    ] },
    { id: 'ook', title: '-ake → -ook, -ear → -ore', pattern: 'A — B — C', ex: 'take — took — taken',
      rule: 'take — took — taken, shake — shook — shaken; wear — wore — worn, tear — tore — torn.', rows: [
      'take|took|taken|брать|I [took] a taxi yesterday.|Have you [taken] your pills?',
      'shake|shook|shaken|трясти, пожимать (руку)|Yesterday he [shook] my hand.|The news has [shaken] everyone.',
      'wear|wore|worn|носить (одежду)|She [wore] a blue dress to the party last night.|I have never [worn] a suit.',
      'tear|tore|torn|рвать|Yesterday he [tore] the letter in half.|I have [torn] my jeans.'
    ] },
    { id: 'special', title: 'Особые — просто запомнить', pattern: 'A — B — C', ex: 'go — went — gone',
      rule: 'Самые частые глаголы без общего правила. Учите их первыми и проговаривайте вслух ритмом: go — went — gone.', rows: [
      'be|was/were|been|быть|I [was] at home yesterday.|Have you ever [been] to London?',
      'go|went|gone|идти, ехать|We [went] to the cinema last night.|She has [gone] to work.',
      'do|did|done|делать|I [did] my homework yesterday.|Have you [done] your homework?',
      'see|saw|seen|видеть|I [saw] Tom yesterday.|I have never [seen] snow.',
      'eat|ate|eaten|есть|We [ate] pizza last night.|Have you [eaten] yet?',
      'give|gave|given|давать|She [gave] me a book for my birthday last year.|He has [given] me his number.',
      'fall|fell|fallen|падать|I [fell] off my bike yesterday.|The leaves have [fallen].',
      'beat|beat|beaten|бить, побеждать|We [beat] them 3–0 last Sunday.|Our team has never [beaten] them.'
    ] }
  ];

  // Порядок частотности в речи: новые глаголы в тренировке идут отсюда — сначала самые нужные.
  var FREQ = ('be have do say go get make know think take see come give find tell become leave feel put bring ' +
    'begin keep hold write stand hear let mean set meet run pay sit speak lead read grow lose fall send build ' +
    'understand draw break spend cut rise drive buy wear choose win teach catch eat sell fly drink sleep forget ' +
    'hit hurt cost show throw sing swim wake shut steal fight hang shoot ride hide shake lend quit spread ring ' +
    'feed light freeze blow bite tear sink beat learn burn dream lay').split(' ');
  var TOP = 30; // первые 30 по частотности отмечаются ★ в таблице

  D.groups = [];
  D.verbs = [];
  D.byId = Object.create(null);
  D.groupsById = Object.create(null);
  GROUPS.forEach(function (g) {
    var group = { id: g.id, title: g.title, pattern: g.pattern, ex: g.ex, rule: g.rule, verbs: [] };
    g.rows.forEach(function (row) {
      var p = row.split('|');
      var rank = FREQ.indexOf(p[0]);
      var v = {
        id: p[0], base: p[0], v2: p[1].split('/'), v3: p[2].split('/'), ru: p[3],
        exPast: p[4], exPerfect: p[5], group: g.id, rank: rank < 0 ? FREQ.length + D.verbs.length : rank
      };
      v.top = v.rank < TOP;
      group.verbs.push(v);
      D.verbs.push(v);
      D.byId[v.id] = v;
    });
    D.groups.push(group);
    D.groupsById[g.id] = group;
  });
  D.freq = FREQ;
})(window.EG = window.EG || {});
