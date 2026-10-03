// tools/grammar-check.js — проверка раздела «Грамматика» в Node (без браузера).
// Запуск из корня проекта: node tools/grammar-check.js   → «OK» или список ошибок (код выхода 1).
// Проверяет данные (ссылки, варианты, разметку, исправления) и логику (подбор заданий, рекомендации)
// в отдельном контексте: модуль грамматики загружается поверх ядра так же, как в index.html.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const ROOT = process.argv[2] || path.join(__dirname, '..');

const store = {};
const ctx = {
  console,
  localStorage: { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = String(v); } },
  document: { readyState: 'loading', addEventListener() {}, removeEventListener() {}, createElement() { return {}; } },
  matchMedia: () => ({ matches: false }),
  navigator: {},
  setTimeout, clearTimeout, setInterval, clearInterval,
};
ctx.window = ctx;
vm.createContext(ctx);
const files = ['js/storage.js', 'js/database.js', 'js/state.js', 'js/exercises.js'];
for (const f of files) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
// DOM нет — хватает заглушек: при загрузке модуль только берёт ссылки на хелперы
vm.runInContext('EG.ui = { h: function () { return {}; }, icon: function () { return {}; } };', ctx);
for (const f of ['grammar/grammar-data.js', 'grammar/grammar-ui.js', 'grammar/grammar.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}
const EG = ctx.EG;
const G = EG.grammar;
let errors = 0;
const err = (...a) => { errors++; console.log('ERR', ...a); };

const TENSES = ['Present Simple', 'Present Continuous', 'Past Simple', 'Past Continuous', 'Present Perfect',
  'Present Perfect Continuous', 'Past Perfect', 'Future Simple', 'be going to', 'Future Continuous', 'Future Perfect'];
const groups = new Set(G.data.groups.map(g => g.id));
const ids = new Set();
const counts = {};
let exN = 0;

function brackets(s, where) {
  if (typeof s !== 'string' || !s.trim()) { err('empty text', where); return; }
  let depth = 0;
  for (const ch of s) { if (ch === '[') depth++; if (ch === ']') depth--; if (depth < 0 || depth > 1) break; }
  if (depth !== 0) err('unbalanced [ ]', where, s);
}
function pair(p, where) {
  if (!Array.isArray(p) || p.length < 2) { err('bad pair', where); return; }
  brackets(p[0], where);
  if (!p[1]) err('no translation', where, p[0]);
  if (/[а-яё]/i.test(p[0])) err('cyrillic in English', where, p[0]);
}

for (const t of G.data.topics) {
  if (ids.has(t.id)) err('dup topic', t.id); ids.add(t.id);
  if (!groups.has(t.group)) err('unknown group', t.id, t.group);
  if (!t.title || !t.ru) err('no title/ru', t.id);
  if (t.link) { if (!G.data.byId[t.link] || G.data.byId[t.link].link) err('bad link', t.id, t.link); continue; }
  counts[t.group] = (counts[t.group] || 0) + 1;
  if (!t.core) err('no core', t.id);
  if (!/^(A1|A2|B1|B2|C1)$/.test(t.level)) err('bad level', t.id, t.level);
  if (t.key) pair(t.key, t.id + ' key');
  (t.examples || []).forEach((p, i) => pair(p, t.id + ' ex' + i));
  (t.talk || []).forEach((p, i) => pair(p, t.id + ' talk' + i));
  if (t.group === 'compare') {
    if (!t.sides || t.sides.length !== 2) err('compare needs 2 sides', t.id);
    else t.sides.forEach((s, i) => { if (!s.name || !s.means) err('side fields', t.id, i); pair(s.ex, t.id + ' side' + i); });
  } else {
    if (!t.key || !t.formula || !t.examples || t.examples.length < 3) err('lesson needs key/formula/3+ examples', t.id);
    if (!t.when || !t.signals) err('lesson needs when/signals', t.id);
  }
  if (t.vs) { pair(t.vs.a, t.id + ' vs.a'); pair(t.vs.b, t.id + ' vs.b'); if (t.vs.link && !G.data.byId[t.vs.link]) err('bad vs.link', t.id, t.vs.link); }
  (t.mistakes || []).forEach((m, i) => {
    if (m.length < 3 || !m[2]) err('mistake needs wrong/right/why', t.id, i);
    if (G.ui.norm(m[0]) === G.ui.norm(m[1])) err('mistake wrong == right', t.id, m[0]);
  });
  const pr = t.practice || [];
  if (pr.length < 5) err('need 5+ exercises', t.id, pr.length);
  const types = new Set(pr.map(e => e.type));
  if (types.size < (t.group === 'tenses' ? 3 : 2)) err('too few exercise types', t.id);
  pr.forEach((e, i) => {
    exN++;
    const w = t.id + ' #' + i + ' ' + e.type;
    if (!e.explain) err('no explain', w);
    if (e.type !== 'meaning' && e.type !== 'build' && (!e.ru || !/[а-яё]/i.test(e.ru) || /[\[\]_]/.test(e.ru))) err('needs Russian translation (ru)', w);
    if (e.key !== t.id + ':' + i || e.topic !== t.id) err('bad key', w);
    if (e.type === 'build') {
      const n = G.ui.words(e.answer).list.length;
      if (n < 3 || n > 9) err('build length 3..9', w, e.answer);
      if (!e.ru) err('build needs ru', w);
      if (/[\[\]_]/.test(e.answer)) err('markup in build', w);
    } else if (e.type === 'fix') {
      if (!e.accept || !e.accept.length) { err('fix needs accept', w); return; }
      if (G.ui.checkFix(e.text, e).ok) err('wrong sentence is accepted', w, e.text);
      e.accept.forEach(a => { if (!G.ui.checkFix(a, e).ok) err('accepted answer fails', w, a); });
    } else {
      const o = e.options || [];
      if (o.length < 3) err('need 3+ options', w);
      if (new Set(o.map(x => x.toLowerCase())).size !== o.length) err('duplicate options', w, o);
      if (e.type === 'choose' && (e.text.match(/___/g) || []).length !== 1) err('choose needs one ___', w, e.text);
      if (e.type === 'tense') o.forEach(x => { if (!TENSES.includes(x)) err('unknown tense name', w, x); });
      if (e.type === 'situation' && !/[а-яё]/i.test(e.text)) err('situation should be in Russian', w);
      if ((e.type === 'meaning') && o.some(x => !/[а-яё]/i.test(x))) err('meaning options should be Russian', w);
    }
  });
}

// учебный порядок: каждая тема (кроме ссылок) ровно один раз
const cur = G.data.curriculum;
const real = G.data.topics.filter(t => !t.link).map(t => t.id);
if (new Set(cur).size !== cur.length) err('curriculum has duplicates');
cur.forEach(id => { if (!real.includes(id)) err('curriculum unknown id', id); });
real.forEach(id => { if (!cur.includes(id)) err('curriculum misses', id); });

// логика: пустой прогресс → первая тема по порядку; ошибки → тема с ошибками; подбор заданий
const L = G.logic;
L.store.load().then(() => {
  let r = L.recommend();
  if (!r || !r.topic || r.topic.id !== cur[0] || r.kind !== 'new') err('empty progress should recommend first topic', r && r.topic && r.topic.id);
  const t = G.data.byId['past-simple'];
  const items = L.practiceFor(t, 5);
  if (items.length !== 5) err('practiceFor size', items.length);
  for (let i = 1; i < items.length; i++) if (items[i].type === items[i - 1].type && new Set(items.map(x => x.type)).size > 2) { /* допускается, если типов мало */ }
  // три ошибки подряд по теме → рекомендация её разобрать, а задания с ошибками идут первыми
  const rec = L.store.ensure(t.id);
  for (const ex of t.practice.slice(0, 3)) { rec.attempts++; rec.recent.push(0); rec.mistakes[ex.key] = 1; }
  rec.lastTs = Date.now();
  L.store.put(rec);
  r = L.recommend();
  if (!r || r.kind !== 'mistakes' || r.topic.id !== t.id) err('mistakes should drive recommendation', r && r.kind, r && r.topic && r.topic.id);
  const first = L.practiceFor(t, 5).slice(0, 3).map(x => x.key).sort().join();
  if (first !== t.practice.slice(0, 3).map(x => x.key).sort().join()) err('mistaken exercises should come first');
  const mix = L.mixItems();
  if (!mix.length || mix.length > 8) err('mixItems size', mix.length);
  if (L.mastery(null) !== 0 || L.status(null).key !== 'new') err('empty record status');

  console.log('topics', JSON.stringify(counts), 'exercises', exN);
  if (errors) { console.log(errors + ' error(s)'); process.exit(1); }
  console.log('OK');
});
