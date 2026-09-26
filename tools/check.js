// tools/check.js — проверка учебных данных и логики EnglishGo в Node (без браузера).
// Запуск из корня проекта: node tools/check.js   → «OK» или список ошибок (код выхода 1).
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const ROOT = process.argv[2] || path.join(__dirname, '..');

const store = {};
const ctx = {
  console,
  localStorage: { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = String(v); } },
  document: { readyState: 'loading', addEventListener() {}, createElement() { return {}; } },
  matchMedia: () => ({ matches: false }),
  navigator: {},
  setTimeout, clearTimeout, setInterval, clearInterval,
};
ctx.window = ctx;
vm.createContext(ctx);
const files = ['data/vocabulary.js', 'data/registers.js', 'data/dialogues.js', 'data/dialogues-more.js', 'data/stories.js', 'data/chats.js', 'data/chats-more.js', 'data/lessons.js', 'data/words/a1.js', 'data/words/a2.js', 'data/words/b1.js', 'data/words/b2.js', 'data/words/c1.js', 'data/wordbank.js', 'data/texts.js', 'js/storage.js', 'js/database.js', 'js/state.js', 'js/srs.js', 'js/progress.js', 'js/exercises.js', 'js/dialogues.js', 'js/chat.js', 'js/games.js', 'js/wordtrainer.js', 'js/lexicon.js'];
const warns=[]; const ow=console.warn; console.warn=(...a)=>{warns.push(a.join(' '));};
for (const f of files) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
const EG = ctx.EG;
console.warn=ow;
let errors = 0;
const err = (...a) => { errors++; console.log('ERR', ...a); };

console.log('vocab', EG.data.vocab.length, 'dialogues', EG.data.dialogues.length, 'scenarios', EG.data.scenarios.length, 'lessons', EG.data.lessons.length);
const lv = {}; EG.data.vocab.forEach(v => lv[v.level] = (lv[v.level] || 0) + 1); console.log('levels', JSON.stringify(lv));
const ids = new Set();
for (const v of EG.data.vocab) {
  if (ids.has(v.id)) err('dup id', v.id); ids.add(v.id);
  if (!EG.exercises.findInExample(v)) err('example lacks phrase:', v.en, '|', v.example);
  if (!v.usage) err('no usage', v.en);
  for (const k of ['en', 'ru', 'example', 'exampleRu', 'level', 'topic']) if (!v[k]) err('missing', k, v.en);
  if (!EG.data.topics[v.topic]) err('unknown topic', v.topic);
  // собственный ответ должен засчитываться
  const m = EG.text.matchAny(v.en, [v.en].concat(v.alt || []));
  if (!m.ok) err('self-match fail', v.en);
}
for (const d of EG.data.dialogues) {
  if (!d.nodes[d.start]) err('no start', d.id);
  for (const [nid, n] of Object.entries(d.nodes)) {
    if (!n.end && (!n.options || !n.options.length)) err('dead node', d.id, nid);
    (n.options || []).forEach(o => { if (o.next && !d.nodes[o.next]) err('bad next', d.id, nid, o.next); if (!EG.dialogue.QUALITY[o.q]) err('bad q', d.id, nid); });
    if (n.options && !n.options.some(o => o.q === 'best')) err('no best', d.id, nid);
  }
  (d.learn || []).forEach(en => { if (!EG.data.byId[EG.data.slug(en)]) err('dlg learn missing', d.id, en); });
  if (d.scenario && !EG.data.scenariosById[d.scenario]) err('bad scenario link', d.id);
}
for (const s of EG.data.scenarios) {
  s.turns.forEach((t, i) => {
    (t.learn || []).forEach(en => { if (!EG.data.byId[EG.data.slug(en)]) err('scn learn missing', s.id, en); });
    t.accepted.forEach(a => {
      const ev = EG.dialogue.evaluateTurn(t, a.t);
      if (!ev.correct) err('accepted not correct', s.id, i, a.t, ev.verdict);
      const kwOk = (t.keywords || []).every(g => EG.text.hasKeyword(EG.text.normalize(a.t), g));
      if (!kwOk) err('accepted misses keyword', s.id, i, a.t);
    });
    (t.distractors || []).forEach(dd => {
      const ev = EG.dialogue.evaluateTurn(t, dd.t);
      if (ev.verdict === 'great' || ev.verdict === 'good') err('distractor accepted', s.id, i, dd.t, ev.verdict);
    });
  });
}
// Свободные ответы: проверим несколько реалистичных вариантов
const sc = EG.data.scenariosById['s-coffee'];
for (const txt of ["hi can i get a medium latte", "I'd like medium latte please", "I want medium latte", "Give me a latte", "one latte medium size please", "coffee", "латте"]) {
  const ev = EG.dialogue.evaluateTurn(sc.turns[0], txt);
  console.log('  coffee t0:', JSON.stringify(txt), '→', ev.verdict, ev.naturalness);
}
const fd = EG.data.scenariosById['s-first-day'];
for (const txt of ["Hi, I'm Olga. Nice to meet you!", "My name is Petr, nice to meet you", "i am sergey"]) {
  const ev = EG.dialogue.evaluateTurn(fd.turns[0], txt);
  console.log('  first-day t0:', JSON.stringify(txt), '→', ev.verdict, ev.naturalness);
}
// matchAny
for (const [u, t] of [["cant i get", "Can I get"], ["could i get", "Can I get"], ["nice to meet u", "Nice to meet you."], ["I am just looking thanks", "I'm just looking, thanks."], ["gona", "gonna"]]) {
  console.log('  match', JSON.stringify(u), 'vs', JSON.stringify(t), JSON.stringify(EG.text.matchAny(u, [t])));
}
// SRS
let c = EG.srs.newCard('x', 0);
const seq = [2, 2, 2, 2, 0, 2, 3];
let now = 0;
for (const q of seq) { c = EG.srs.schedule(c, q, now); console.log('  srs q', q, '→', c.state, 'interval', c.interval, 'due+', ((c.due - now) / 3600000).toFixed(2) + 'h', 'ease', c.ease); now = c.due; }
console.log('lessons sample', EG.data.lessons.slice(0, 5).map(l => l.id + ':' + l.items.length).join(', '));
const sizes = EG.data.lessons.map(l => l.items.length); console.log('lesson sizes min/max', Math.min(...sizes), Math.max(...sizes));

warns.forEach(w=>err('warn:',w));
console.log('forms attached:', EG.data.formsCount, '| stories', EG.data.stories.length, '| contacts', EG.data.contacts.length, '| episodes', EG.data.episodes.length);
for (const st of EG.data.stories) {
  st.questions.forEach((q,i)=>{ if(!(q.answer>=0 && q.answer<q.options.length)) err('story answer idx', st.id, i); });
  (st.learn||[]).forEach(en=>{ if(!EG.data.byId[EG.data.slug(en)]) err('story learn missing', st.id, en); });
}
for (const ep of EG.data.episodes) {
  const c = EG.data.contactsById[ep.contactId]; if(!c) err('no contact', ep.id);
  if(!ep.nodes[ep.start]) err('no start', ep.id);
  const seen=new Set(); const stack=[ep.start];
  while(stack.length){ const id=stack.pop(); if(seen.has(id)) continue; seen.add(id); const n=ep.nodes[id]; if(!n){err('missing node',ep.id,id);continue;}
    if(!n.end && !n.reply) err('node w/o reply and not end', ep.id, id);
    if(!n.end && !n.next) err('node w/o next', ep.id, id);
    if(n.next) stack.push(n.next);
    (n.reply&&n.reply.branches||[]).forEach(b=>stack.push(b.next)); }
  Object.keys(ep.nodes).forEach(id=>{ if(!seen.has(id)) err('unreachable node', ep.id, id); });
  (ep.learn||[]).forEach(en=>{ if(!EG.data.byId[EG.data.slug(en)]) err('episode learn missing', ep.id, en); });
  Object.entries(ep.nodes).forEach(([id,n])=>{ if(!n.reply) return;
    n.reply.accepted.forEach(a=>{ const ev=EG.chat.evaluate(n.reply,a.t,c); if(!ev.correct) err('chat accepted not correct', ep.id,id,a.t,ev.verdict,ev.note||'');
      const nx=EG.chat.nextNode(n,a.t); if(nx!==n.next) err('accepted goes to branch', ep.id, id, a.t, nx); });
    (n.reply.distractors||[]).forEach(d=>{ const ev=EG.chat.evaluate(n.reply,d.t,c); if(ev.verdict==='great'||ev.verdict==='good') err('chat distractor accepted', ep.id,id,d.t); });
  });
}
// регистр: сленг коллеге/арендодателю
const dv=EG.data.contactsById['davis'], ep1=EG.data.episodesById['davis-1'];
console.log('  davis slang:', JSON.stringify(EG.chat.evaluate(ep1.nodes.c.reply,'thx u r the best',dv)));
const jk=EG.data.contactsById['jake'], je=EG.data.episodesById['jake-1'];
console.log('  jake branch decline:', EG.chat.nextNode(je.nodes.b, "sorry cant tonight, busy"), '| accept:', EG.chat.nextNode(je.nodes.b, "i'm down!"));
console.log('  decode:', JSON.stringify(EG.chat.decodeMessage('ngl idk if i can make it 2nite, lmk if u guys r still going')));
// генераторы игр
ctx.EG.state.games=new Map();
for (const gid of ['decode','blitz','truefalse','reply','build']) { for(let i=0;i<200;i++){ const q=EG.games.GEN[gid](); if(q.kind==='choice'){ if(q.options.filter(o=>o.correct).length<1||q.options.length<2) err('game q bad',gid,JSON.stringify(q).slice(0,200)); if(new Set(q.options.map(o=>o.label)).size!==q.options.length) err('game dup opts',gid,q.options.map(o=>o.label).join('|')); } } }
const pr=EG.games.pairsRound(6); console.log('  pairs round:', pr.map(p=>p.left+' ↔ '+p.right).join(' ; '));
// упражнения
let cnt={}; for(const v of EG.data.vocab){ for(const t of ['slangify','formalize','decode','texting']){ const ex=EG.exercises.make(t,v); if(ex){cnt[t]=(cnt[t]||0)+1; if(ex.options && new Set(ex.options).size!==ex.options.length) err('dup options',t,v.en); if(ex.answers){ const m=EG.text.matchAny(ex.answer, ex.answers, .8); if(!m.ok) err('texting self fail', v.en, ex.answer);} } } }
console.log('  exercise availability:', JSON.stringify(cnt));
// тренажёр слов: уникальность, варианты ответа, интервалы
{
  const W = EG.data.words, seenEn = new Set(), pos = {};
  for (const w of W) {
    const k = w.en.toLowerCase();
    if (seenEn.has(k)) err('word dup', w.en); seenEn.add(k);
    if (!w.ru || !w.en || !w.senses.length) err('word empty', w.en);
    if (!EG.data.wordPos[w.pos]) err('word pos', w.en, w.pos);
    if (!EG.LEVELS.includes(w.level)) err('word level', w.en);
    pos[w.pos] = (pos[w.pos] || 0) + 1;
  }
  ctx.EG.state.words = new Map();
  for (const w of W) for (const dir of ['ru-en', 'en-ru']) {
    const q = EG.wordTrainer.question(w, dir);
    if (q.options.length !== 4) err('word options < 4', w.en, dir);
    if (new Set(q.options).size !== q.options.length) err('word dup options', w.en, dir, q.options.join('|'));
    if (q.options.filter(o => o === q.answer).length !== 1) err('word answer missing', w.en, dir);
  }
  let r = null, t = 0; const boxes = [];
  for (const ok of [true, true, true, true, false, true]) { r = EG.wordTrainer.schedule(r, ok, 6000, t); boxes.push(r.box); t = r.due; }
  if (boxes.join() !== '1,2,3,4,1,2') err('word boxes', boxes.join());
  if (EG.wordTrainer.schedule(null, true, 2000, 0).box !== 3) err('known word should jump');
  console.log('words', W.length, JSON.stringify(pos), '| boxes', boxes.join(','));
}

// тексты для чтения: ответы, глоссарий встречается в тексте, покрытие словарём
{
  const ids = new Set();
  let tokens = 0, known = 0;
  const unknown = {};
  for (const t of EG.data.texts) {
    if (ids.has(t.id)) err('text dup id', t.id); ids.add(t.id);
    if (!EG.LEVELS.includes(t.level)) err('text level', t.id);
    if (!EG.data.textTopics[t.topic]) err('text topic', t.id, t.topic);
    if (!t.paragraphs.length || !t.questions.length) err('text empty', t.id);
    t.questions.forEach((q, i) => {
      if (!(q.answer >= 0 && q.answer < q.options.length)) err('text answer idx', t.id, i);
      if (new Set(q.options).size !== q.options.length) err('text dup options', t.id, i);
    });
    const low = t.paragraphs.join(' ').toLowerCase().replace(/’/g, "'");
    t.glossary.forEach(g => { if (low.indexOf(g[0].toLowerCase()) < 0) err('glossary not in text', t.id, g[0]); });
    for (const tok of t.paragraphs.join(' ').match(/[A-Za-zÀ-ÿ]+(?:[-'’][A-Za-zÀ-ÿ]+)*/g)) {
      tokens++;
      if (EG.lexicon.lookup(tok).length) known++; else unknown[tok.toLowerCase()] = (unknown[tok.toLowerCase()] || 0) + 1;
    }
  }
  const top = Object.entries(unknown).sort((a, b) => b[1] - a[1]).slice(0, 25).map(e => e[0] + ':' + e[1]).join(' ');
  console.log('texts', EG.data.texts.length, '| словарь покрывает', Math.round(known / tokens * 100) + '% слов текстов | чаще всего без перевода:', top);
  for (const [f, lemma] of [['went', 'go'], ['cities', 'city'], ['stopped', 'stop'], ['children', 'child'], ['happier', 'happy'], ['making', 'make'], ["doesn't", 'do']]) {
    const hit = EG.lexicon.lookup(f).map(w => w.en);
    if (!hit.includes(lemma)) err('lemma', f, '→', hit.join(','));
  }
  const toks = 'I was looking for my keys in front of the house'.split(' ');
  const ph = EG.lexicon.phraseAt(toks, 3).map(w => w.en);
  if (!ph.includes('look for')) err('phraseAt look for', ph.join(','));
}
// блоки тренажёра слов
{
  for (const l of EG.LEVELS) {
    const us = EG.wordTrainer.units(l);
    const n = us.reduce((s, u) => s + u.words.length, 0);
    if (n !== EG.data.words.filter(w => w.level === l).length) err('units lose words', l);
    if (us.some(u => u.words.length < 10 || u.words.length > 30)) err('unit size', l);
  }
  const w = EG.data.words.find(x => x.en === 'colour');
  if (EG.wordTrainer.checkSpelling(w, 'color') === 'wrong') err('spelling color');
  if (EG.wordTrainer.checkSpelling(w, 'colr') !== 'typo') err('spelling typo');
  if (EG.wordTrainer.checkSpelling(w, 'red') !== 'wrong') err('spelling wrong');
  if (EG.wordTrainer.checkSpelling(EG.data.wordsById['compulsory'], 'mandatory') !== 'synonym') err('spelling synonym');
  if (EG.wordTrainer.mask('ice cream', 2) !== 'ic_ _____') err('mask', EG.wordTrainer.mask('ice cream', 2));
  console.log('units', EG.LEVELS.map(l => l + ':' + EG.wordTrainer.units(l).length).join(' '));
}
console.log(errors ? `\n${errors} ERRORS` : '\nOK');
process.exitCode = errors ? 1 : 0;
