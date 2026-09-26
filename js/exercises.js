/* exercises.js — проверка ответов (нормализация, нечёткое сравнение) и генерация упражнений */
(function (EG) {
  'use strict';

  /* =========================================================
     Текст: нормализация и сравнение
     ========================================================= */

  var CONTRACTIONS = [
    [/\bwon't\b/g, 'will not'], [/\bcan't\b/g, 'can not'], [/\bcannot\b/g, 'can not'], [/\bshan't\b/g, 'shall not'],
    [/\bain't\b/g, 'is not'], [/\blet's\b/g, 'let us'], [/\by'all\b/g, 'you all'],
    [/\b(\w+)n't\b/g, '$1 not'], [/\b(\w+)'re\b/g, '$1 are'], [/\b(\w+)'ve\b/g, '$1 have'],
    [/\b(\w+)'ll\b/g, '$1 will'], [/\b(\w+)'d\b/g, '$1 would'], [/\bi'm\b/g, 'i am'],
    [/\b(it|that|what|there|here|who|where|how|he|she)'s\b/g, '$1 is'],
    [/\bgonna\b/g, 'going to'], [/\bwanna\b/g, 'want to'], [/\bgotta\b/g, 'got to'],
    [/\bokay\b/g, 'ok'], [/\bo\.k\.?/g, 'ok'], [/\bthx\b/g, 'thanks'], [/\bpls\b|\bplz\b/g, 'please'],
    [/\bu\b/g, 'you'], [/\bur\b/g, 'your'], [/\bcuz\b|\b'cause\b/g, 'because'], [/\byeah\b|\byep\b|\byup\b/g, 'yes']
  ];

  // Сокращения из мессенджеров → полная форма (чтобы «r u coming 2day» ≈ «are you coming today»)
  var TEXTING = {
    r: 'are', ya: 'you', u2: 'you too', idk: 'i do not know', ik: 'i know', ty: 'thank you', tysm: 'thank you so much',
    np: 'no problem', omw: 'on my way', lmk: 'let me know', hbu: 'how about you', wbu: 'what about you',
    wyd: 'what are you doing', wya: 'where are you', rn: 'right now', brb: 'be right back', gtg: 'got to go', g2g: 'got to go',
    cya: 'see you', cu: 'see you', ttyl: 'talk to you later', nvm: 'never mind', ofc: 'of course', bc: 'because',
    tbh: 'to be honest', ngl: 'not going to lie', imo: 'in my opinion', imho: 'in my opinion', btw: 'by the way',
    fyi: 'for your information', asap: 'as soon as possible', jk: 'just kidding', ikr: 'i know right', smh: 'shaking my head',
    ppl: 'people', msg: 'message', sry: 'sorry', srry: 'sorry', abt: 'about', bday: 'birthday', tho: 'though', thru: 'through',
    prob: 'probably', prolly: 'probably', def: 'definitely', rly: 'really', sm: 'so much', k: 'ok', kk: 'ok', okie: 'ok',
    tmrw: 'tomorrow', tmr: 'tomorrow', '2morrow': 'tomorrow', '2day': 'today', '2nite': 'tonight', tonite: 'tonight',
    b4: 'before', l8r: 'later', gr8: 'great', pic: 'picture', pics: 'pictures', convo: 'conversation', gf: 'girlfriend', bf: 'boyfriend',
    bro: 'brother', ty4: 'thank you for', dm: 'message', txt: 'text', ur: 'your', u: 'you',
    // апострофы в чатах часто опускают
    im: 'i am', ive: 'i have', dont: 'do not', doesnt: 'does not', didnt: 'did not', cant: 'can not', wont: 'will not',
    isnt: 'is not', arent: 'are not', wasnt: 'was not', thats: 'that is', whats: 'what is', youre: 'you are', theyre: 'they are', lets: 'let us'
  };
  var TEXTING_RE = new RegExp('(^|[^a-z0-9\'])(' + Object.keys(TEXTING).sort(function (a, b) { return b.length - a.length; }).join('|') + ')(?=$|[^a-z0-9\'])', 'g');

  function expandTexting(s) {
    return s.replace(/\bw\/o\b/g, 'without').replace(/\bw\//g, 'with ').replace(/\bb\/c\b/g, 'because')
      .replace(TEXTING_RE, function (m, pre, w) { return pre + TEXTING[w]; });
  }

  function normalize(s) {
    s = String(s || '').toLowerCase()
      .replace(/[’‘`´]/g, "'").replace(/[“”]/g, '"')
      .replace(/…/g, ' ');
    s = expandTexting(s);
    CONTRACTIONS.forEach(function (c) { s = s.replace(c[0], c[1]); });
    return s.replace(/'s\b/g, ' s').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function lev(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    var prev = new Array(b.length + 1), cur = new Array(b.length + 1);
    for (var j = 0; j <= b.length; j++) prev[j] = j;
    for (var i = 1; i <= a.length; i++) {
      cur[0] = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      var t = prev; prev = cur; cur = t;
    }
    return prev[b.length];
  }

  function similarity(a, b) {
    var m = Math.max(a.length, b.length);
    return m ? 1 - lev(a, b) / m : 1;
  }

  // близкие по написанию слова считаются совпавшими (опечатки)
  function tokenEq(a, b) {
    if (a === b) return true;
    if (a.length < 4 || b.length < 4) return false;
    return lev(a, b) <= (Math.max(a.length, b.length) >= 7 ? 2 : 1);
  }

  var FILLER = { please: 1, um: 1, uh: 1, oh: 1, well: 1, so: 1, just: 1, like: 0, hi: 1, hey: 1, thanks: 1, thank: 1, you: 0, lol: 1, haha: 1, lmao: 1, omg: 1, yay: 1, hehe: 1, ok: 1 };

  /** Коэффициент Дайса по словам (с учётом опечаток). */
  function dice(ta, tb) {
    if (!ta.length || !tb.length) return 0;
    var used = new Array(tb.length), hit = 0;
    ta.forEach(function (w) {
      for (var i = 0; i < tb.length; i++) {
        if (!used[i] && tokenEq(w, tb[i])) { used[i] = true; hit++; return; }
      }
    });
    return (2 * hit) / (ta.length + tb.length);
  }

  function tokens(s) { return s ? s.split(' ') : []; }

  /** Сходство фраз 0..1: максимум из посимвольного и пословного, с мягкостью к вежливым «довескам». */
  function phraseSim(user, target) {
    var a = normalize(user), b = normalize(target);
    if (!a || !b) return 0;
    if (a === b) return 1;
    var ta = tokens(a), tb = tokens(b);
    var s1 = similarity(a, b);
    var s2 = dice(ta, tb);
    // без слов-паразитов/вежливости (please, well, so…)
    var fa = ta.filter(function (w) { return !FILLER[w]; }), fb = tb.filter(function (w) { return !FILLER[w]; });
    var s3 = fa.length && fb.length ? Math.max(similarity(fa.join(' '), fb.join(' ')), dice(fa, fb)) * 0.98 : 0;
    return Math.max(s1, s2, s3);
  }

  /** Сравнить ответ с набором правильных вариантов. */
  function matchAny(user, targets, threshold) {
    threshold = threshold || 0.84;
    var best = { sim: 0, target: targets[0] };
    targets.forEach(function (t) {
      var s = phraseSim(user, t);
      if (s > best.sim) best = { sim: s, target: t };
    });
    var n = normalize(user), shortTarget = normalize(best.target);
    // для коротких ответов требуем почти точное совпадение
    var th = shortTarget.length <= 6 ? 0.99 : threshold;
    return { ok: best.sim >= th, partial: !(best.sim >= th) && best.sim >= th - 0.14 && n.length > 0, sim: best.sim, target: best.target };
  }

  /** Совпадает ли группа ключевых слов «a|b|c» с текстом. */
  function hasKeyword(normText, group) {
    var padded = ' ' + normText + ' ';
    return group.split('|').some(function (k) {
      k = normalize(k);
      if (!k) return false;
      if (padded.indexOf(' ' + k + ' ') >= 0) return true;
      if (k.indexOf(' ') >= 0) return false;
      // одно слово — допускаем множественное число и опечатку
      return tokens(normText).some(function (w) {
        return w === k + 's' || w === k + 'es' || (k.length >= 5 && tokenEq(w, k));
      });
    });
  }

  function hasCyrillic(s) { return /[а-яё]/i.test(s); }

  var SLANG_MARKERS = /(^|[^a-z0-9'])(u|ur|r|ya|idk|lol|lmao|omg|ngl|tbh|wyd|hbu|wbu|lmk|brb|gtg|cya|cu|omw|ttyl|nvm|rn|np|ty|thx|tysm|pls|plz|k|kk|gonna|wanna|gotta|kinda|sorta|2day|2nite|l8r|gr8|b4|tmrw|jk|ikr|smh|bro|dude|w\/)(?=$|[^a-z0-9'])/g;
  /** Сленговые/чатовые маркеры в тексте (для оценки уместности регистра). */
  function slangMarkers(s) {
    var out = [];
    String(s || '').toLowerCase().replace(SLANG_MARKERS, function (m, pre, w) { if (out.indexOf(w) < 0) out.push(w); return m; });
    return out;
  }

  EG.text = {
    normalize: normalize, lev: lev, similarity: similarity, dice: dice,
    phraseSim: phraseSim, matchAny: matchAny, hasKeyword: hasKeyword, hasCyrillic: hasCyrillic,
    expandTexting: expandTexting, slangMarkers: slangMarkers, TEXTING: TEXTING
  };

  /* =========================================================
     Генерация упражнений
     ========================================================= */

  var U = EG.util;

  function stripEnd(s) { return String(s).replace(/[.?!,…]+$/g, '').trim(); }

  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  /** Найти фразу в примере (без учёта регистра) → {before, match, after} */
  function findInExample(item) {
    if (!item.example) return null;
    var core = stripEnd(item.en);
    if (!core) return null;
    var re = new RegExp('(^|[^A-Za-z])(' + escapeRe(core).replace(/'/g, "['’]") + ')(?![A-Za-z])', 'i');
    var m = re.exec(item.example);
    if (!m) return null;
    var start = m.index + m[1].length;
    return { before: item.example.slice(0, start), match: m[2], after: item.example.slice(start + m[2].length) };
  }

  function distractors(item, n, field, pool) {
    field = field || 'en';
    pool = pool || EG.data.vocab;
    var seen = {}; seen[item[field].toLowerCase()] = 1;
    var sameTopic = [], other = [];
    pool.forEach(function (v) {
      if (v.id === item.id || !v[field]) return;
      var k = v[field].toLowerCase();
      if (seen[k]) return;
      seen[k] = 1;
      var lvlClose = Math.abs(U.levelIndex(v.level) - U.levelIndex(item.level)) <= 1;
      if (v.topic === item.topic && lvlClose) sameTopic.push(v);
      else if (lvlClose && v.type === item.type) other.push(v);
    });
    var picked = U.sample(sameTopic, Math.min(n, sameTopic.length));
    if (picked.length < n) picked = picked.concat(U.sample(other, n - picked.length));
    if (picked.length < n) {
      var rest = pool.filter(function (v) { return v.id !== item.id && picked.indexOf(v) < 0 && v[field] && v[field].toLowerCase() !== item[field].toLowerCase(); });
      picked = picked.concat(U.sample(rest, n - picked.length));
    }
    return picked.map(function (v) { return v[field]; });
  }

  function options(correct, wrong) {
    return U.shuffle([correct].concat(wrong));
  }

  var MAKERS = {
    // Презентация нового выражения (Comprehensible Input)
    intro: function (item) { return { type: 'intro', item: item }; },

    // Выражение в контексте: пропуск в примере
    context: function (item) {
      var f = findInExample(item);
      if (!f) return null;
      return {
        type: 'context', item: item, parts: f,
        prompt: 'Вставьте подходящее выражение',
        options: options(stripEnd(item.en), distractors(item, 3).map(stripEnd)),
        answer: stripEnd(item.en)
      };
    },

    // Смысл: английская фраза → русское значение
    meaning: function (item) {
      return {
        type: 'meaning', item: item,
        prompt: 'Что это значит?',
        options: options(item.ru, distractors(item, 3, 'ru')),
        answer: item.ru
      };
    },

    // Active recall: русский смысл → английская фраза (ввод)
    recall: function (item) {
      var f = findInExample(item);
      return {
        type: 'recall', item: item, parts: f,
        prompt: 'Скажите по-английски',
        answers: [item.en].concat(item.alt || []),
        answer: item.en
      };
    },

    // Аудирование: услышать и понять
    listen: function (item) {
      var withText = !!item.example && Math.random() < 0.5;
      return {
        type: 'listen', item: item,
        audio: withText ? item.example : item.en,
        prompt: withText ? 'Послушайте фразу. О чём она?' : 'Послушайте. Что это значит?',
        options: withText
          ? options(item.exampleRu, distractors(item, 3, 'exampleRu'))
          : options(item.ru, distractors(item, 3, 'ru')),
        answer: withText ? item.exampleRu : item.ru
      };
    },

    // Диктант: услышать и записать (для B1+)
    dictation: function (item) {
      return {
        type: 'dictation', item: item, audio: item.en,
        prompt: 'Запишите, что услышали',
        answers: [item.en], answer: item.en
      };
    },

    // Быстрая реакция: реплика собеседника → уместный ответ на время
    reaction: function (item) {
      if (!item.cue) return null;
      var pool = EG.data.vocab.filter(function (v) { return v.cue && v.id !== item.id && v.cue !== item.cue; });
      var wrong = distractors(item, 3, 'en', pool.length >= 3 ? pool : null);
      return {
        type: 'reaction', item: item, cue: item.cue, cueRu: item.cueRu,
        prompt: 'Быстро ответьте собеседнику',
        options: options(item.en, wrong), answer: item.en,
        timeMs: EG.progress.reactionMs()
      };
    },

    // Уместность: регистр речи
    register: function (item) {
      if (!item.register || item.register === 'neutral') return null;
      var opts = [
        { v: 'casual', label: 'С друзьями, неформально' },
        { v: 'neutral', label: 'Подходит почти везде' },
        { v: 'formal', label: 'Официально, по работе, с незнакомыми' }
      ];
      return {
        type: 'register', item: item,
        prompt: 'Где уместна эта фраза?',
        options: opts.map(function (o) { return o.label; }),
        answer: opts.filter(function (o) { return o.v === item.register; })[0].label
      };
    },

    // Скажите то же самое неформально
    slangify: function (item) {
      var f = item.forms;
      if (!f || !f.slang || item.register === 'casual') return null;
      var pool = EG.data.vocab.filter(function (v) { return v.forms && v.forms.slang && v.id !== item.id; })
        .map(function (v) { return { en: v.forms.slang, id: v.id, topic: v.topic, level: v.level, type: v.type }; });
      return {
        type: 'slangify', item: item, prompt: 'Как сказать это неформально — другу?',
        options: options(f.slang, distractors({ id: item.id, en: f.slang, topic: item.topic, level: item.level, type: item.type }, 3, 'en', pool)),
        answer: f.slang, note: f.note
      };
    },

    // Скажите то же самое нейтрально (для сленга и разговорных фраз)
    formalize: function (item) {
      var f = item.forms;
      if (!f || !f.neutral) return null;
      var pool = EG.data.vocab.filter(function (v) { return v.forms && v.forms.neutral && v.id !== item.id; })
        .map(function (v) { return { en: v.forms.neutral, id: v.id, topic: v.topic, level: v.level, type: v.type }; });
      return {
        type: 'formalize', item: item, prompt: 'Как сказать это нейтрально — коллеге или незнакомому человеку?',
        options: options(f.neutral, distractors({ id: item.id, en: f.neutral, topic: item.topic, level: item.level, type: item.type }, 3, 'en', pool)),
        answer: f.neutral, note: f.note
      };
    },

    // Расшифруй сообщение из мессенджера
    decode: function (item) {
      // для темы «Язык переписки» расшифровываем целое сообщение-пример
      if (item.topic === 'texting') {
        return {
          type: 'decode', item: item, message: item.example, prompt: 'Вам пишут в мессенджере. Что это значит?',
          options: options(item.exampleRu, distractors(item, 3, 'exampleRu')), answer: item.exampleRu
        };
      }
      var msg = textForm(item);
      if (!msg || !EG.text.slangMarkers(msg).length) return null;
      return {
        type: 'decode', item: item, message: msg, prompt: 'Вам пишут в мессенджере. Что это значит?',
        options: options(item.ru, distractors(item, 3, 'ru')), answer: item.ru
      };
    },

    // Напишите как в чате
    texting: function (item) {
      if (item.topic === 'texting') {
        return {
          type: 'texting', item: item, prompt: 'Напишите другу в мессенджере — коротко, как в чате', hintRu: item.exampleRu,
          answers: [item.example], answer: item.example
        };
      }
      var msg = textForm(item);
      if (!msg || !EG.text.slangMarkers(msg).length) return null;
      return {
        type: 'texting', item: item, prompt: 'Напишите это другу в мессенджере — коротко, как в чате',
        answers: [item.en].concat(textForms(item), item.alt || [], item.forms.slang ? [item.forms.slang] : []),
        answer: msg
      };
    },

    // Собери фразу из слов
    build: function (item) {
      var target = item.example && item.example.split(/\s+/).length <= 11 ? item.example : item.en;
      var words = target.split(/\s+/);
      if (words.length < 3) return null;
      var shuffled = U.shuffle(words);
      if (shuffled.join(' ') === words.join(' ')) shuffled = words.slice().reverse();
      return {
        type: 'build', item: item, words: shuffled, answer: target,
        hint: target === item.example ? item.exampleRu : item.ru,
        prompt: 'Соберите фразу'
      };
    }
  };

  /** Формы из поля text: «cya / l8r / ttyl» → ['cya', 'l8r', 'ttyl'] */
  function textForms(item) {
    if (!item.forms || !item.forms.text) return [];
    return item.forms.text.split(' / ').map(function (s) { return s.trim(); }).filter(Boolean);
  }
  function textForm(item) { return textForms(item)[0] || null; }

  function make(type, item) {
    var fn = MAKERS[type];
    return fn ? fn(item) : null;
  }

  /** Выбрать подходящий тип упражнения по стадии карточки (от узнавания к активному использованию). */
  function forItem(item, card) {
    var stage = !card ? 0 : card.state === 'new' ? 0 : card.state === 'learning' ? 1 : card.state === 'review' ? 2 : 3;
    var hard = card && card.difficulty > 0.5;
    var high = U.levelIndex(item.level) >= 2;
    var pools = [
      ['context', 'meaning', 'listen', 'register', 'decode'],
      ['context', 'reaction', 'build', 'listen', 'meaning', 'slangify', 'formalize', 'decode'],
      ['recall', 'reaction', 'build', 'context', high ? 'dictation' : 'listen', 'slangify', 'formalize', 'texting'],
      ['recall', 'reaction', 'recall', high ? 'dictation' : 'build', 'texting', 'slangify']
    ];
    var pool = pools[hard ? Math.max(0, stage - 1) : stage].slice();
    pool = U.shuffle(pool);
    for (var i = 0; i < pool.length; i++) {
      var ex = make(pool[i], item);
      if (ex) return ex;
    }
    return make('meaning', item);
  }

  /** Сессия для новых выражений: знакомство + упражнение на узнавание. */
  function forNew(items) {
    var out = [];
    items.forEach(function (item) {
      out.push(make('intro', item));
    });
    U.shuffle(items).forEach(function (item) {
      out.push(make('context', item) || make('meaning', item));
    });
    // второй проход — активное воспроизведение
    U.shuffle(items).forEach(function (item) {
      out.push(make('reaction', item) || make('build', item) || make('recall', item));
    });
    return out;
  }

  /** Урок: презентация партиями по 3, затем практика. */
  function forLesson(items) {
    var out = [];
    for (var i = 0; i < items.length; i += 3) {
      var chunk = items.slice(i, i + 3);
      chunk.forEach(function (it) { out.push(make('intro', it)); });
      U.shuffle(chunk).forEach(function (it) { out.push(make('context', it) || make('meaning', it)); });
    }
    U.shuffle(items).forEach(function (it) {
      out.push(make('reaction', it) || make('build', it) || make('listen', it));
    });
    U.shuffle(items).slice(0, Math.min(items.length, 5)).forEach(function (it) { out.push(make('recall', it)); });
    return out;
  }

  /** Сессия повторения: смесь карточек и упражнений. */
  function forReview(cards) {
    return cards.map(function (c) {
      var item = EG.data.byId[c.id];
      if (!item) return null;
      if (c.state === 'new') return make('intro', item);
      return Math.random() < 0.35 ? { type: 'flash', item: item } : forItem(item, c);
    }).filter(Boolean);
  }

  EG.exercises = {
    make: make,
    forItem: forItem,
    forNew: forNew,
    forLesson: forLesson,
    forReview: forReview,
    findInExample: findInExample,
    textForms: textForms,
    stripEnd: stripEnd
  };
})(window.EG = window.EG || {});
