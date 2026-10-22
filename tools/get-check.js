// tools/get-check.js — проверка раздела «Глагол get» в Node (без браузера).
// Запуск из корня проекта: node tools/get-check.js   → «OK» или список ошибок (код выхода 1).
// Проверяет: поля тем, разметку [..], варианты ответов, исправления (через проверку «Грамматики»),
// ссылки утверждений и уроков «Грамматики», сборку смешанного теста.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const ROOT = process.argv[2] || path.join(__dirname, '..');

const ctx = {
  console,
  localStorage: { getItem: () => null, setItem() {} },
  document: { readyState: 'loading', addEventListener() {}, removeEventListener() {}, createElement() { return {}; } },
  matchMedia: () => ({ matches: false }),
  navigator: {},
  setTimeout, clearTimeout, setInterval, clearInterval,
};
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ['js/storage.js', 'js/database.js', 'js/state.js', 'js/exercises.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}
vm.runInContext('EG.ui = { h: function () { return {}; }, icon: function () { return {}; } };', ctx);
for (const f of ['grammar/grammar-data.js', 'grammar/grammar-ui.js', 'getverb/get-data.js', 'getverb/get.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}
const EG = ctx.EG;
const D = EG.getverb.data;
const GU = EG.grammar.ui;
let errors = 0;
const err = (...a) => { errors++; console.log('ERR', ...a); };

function brackets(s, where) {
  if (typeof s !== 'string' || !s.trim()) { err('пустая строка', where); return; }
  let depth = 0;
  for (const ch of s) { if (ch === '[') depth++; if (ch === ']') depth--; if (depth < 0 || depth > 1) break; }
  if (depth !== 0) err('непарные [ ]', where, s);
}
function pair(p, where, needKey) {
  if (!Array.isArray(p) || p.length < 2) { err('нужна пара [английский, перевод]', where); return; }
  brackets(p[0], where);
  if (needKey && !/\[/.test(p[0])) err('нет подсветки [..]', where, p[0]);
  if (!p[1]) err('нет перевода', where, p[0]);
  if (/[а-яё]/i.test(p[0])) err('кириллица в английском', where, p[0]);
}

const ids = new Set();
let exN = 0;
for (const t of D.topics) {
  const w = t.id;
  if (ids.has(t.id)) err('повтор id', t.id); ids.add(t.id);
  for (const f of ['emoji', 'title', 'ru', 'core', 'level']) if (!t[f]) err(w, 'нет поля', f);
  if (!/^(A1|A2|B1|B2|C1)$/.test(t.level)) err(w, 'неизвестный уровень', t.level);
  if (t.key) pair(t.key, w + ' key', true);
  if (!t.examples || t.examples.length < 3) { if (!t.phrases) err(w, 'нужно 3+ примера'); }
  (t.examples || []).forEach((p, i) => pair(p, w + ' ex' + i, true));
  (t.talk || []).forEach((p, i) => pair(p, w + ' talk' + i, false));
  (t.times || []).forEach((r, i) => {
    brackets(r[0], w + ' times' + i);
    if (!/\[/.test(r[0]) || !r[1] || !r[2]) err(w, 'times: нужно [пример с [..], форма, смысл, ловушка?]', i);
  });
  (t.phrases || []).forEach((p, i) => {
    if (p.length !== 4 || !p[0] || !p[1]) err(w, 'phrases: нужно [фраза, перевод, пример, перевод примера]', i);
    else pair([p[2], p[3]], w + ' phrase' + i, true);
  });
  (t.sides || []).forEach((s, i) => { if (!s.name || !s.means) err(w, 'sides: нет name/means', i); pair(s.ex, w + ' side' + i, true); });
  if (t.sides && t.sides.length !== 2) err(w, 'sides: нужно ровно 2');
  (t.mistakes || []).forEach((m, i) => {
    if (m.length < 3 || !m[2]) err(w, 'ошибка: нужно [неверно, верно, почему]', i);
    if (GU.norm(m[0]) === GU.norm(m[1])) err(w, 'ошибка совпадает с исправлением', m[0]);
  });

  const pr = t.practice || [];
  if (pr.length < 5) err(w, 'нужно 5+ упражнений', pr.length);
  if (new Set(pr.map(e => e.type)).size < 3) err(w, 'слишком мало типов упражнений');
  pr.forEach((e, i) => {
    exN++;
    const x = w + ' #' + i + ' ' + e.type;
    if (!e.explain) err('нет объяснения', x);
    if (e.key !== t.id + ':' + i || e.topic !== t.id) err('неверный key', x);
    if (e.type !== 'meaning' && e.type !== 'build' && (!e.ru || !/[а-яё]/i.test(e.ru) || /[\[\]_]/.test(e.ru))) err('нужен русский перевод (ru)', x);
    if (e.type === 'build') {
      const n = GU.words(e.answer).list.length;
      if (n < 3 || n > 9) err('«Собери»: 3–9 слов', x, e.answer);
      if (!e.ru) err('«Собери»: нет ru', x);
      if (/[\[\]_,]/.test(e.answer)) err('«Собери»: разметка или запятая в ответе', x, e.answer);
    } else if (e.type === 'fix') {
      if (!e.accept || !e.accept.length) { err('«Исправь»: нет accept', x); return; }
      if (GU.checkFix(e.text, e).ok) err('неверная фраза принимается', x, e.text);
      e.accept.forEach(a => { if (!GU.checkFix(a, e).ok) err('верный ответ не принимается', x, a); });
    } else {
      const o = e.options || [];
      if (o.length < 3) err('нужно 3+ варианта', x);
      if (new Set(o.map(s => s.toLowerCase())).size !== o.length) err('повтор вариантов', x, o);
      if (e.type === 'choose' && (e.text.match(/___/g) || []).length !== 1) err('нужен ровно один ___', x, e.text);
      if (e.type === 'choose' && o.some(s => /^'/.test(s))) err('вариант с апострофом в начале склеится неверно', x, o);
      if (e.type === 'situation' && !/[а-яё]/i.test(e.text)) err('ситуация должна быть по-русски', x);
      if ((e.type === 'meaning' || e.type === 'tense') && o.some(s => !/[а-яё]/i.test(s))) err('варианты смысла должны быть по-русски', x);
      if ((e.type === 'choose' || e.type === 'situation') && o.some(s => /[а-яё]/i.test(s))) err('английские варианты с кириллицей', x);
    }
  });
}

(D.myths || []).forEach((m, i) => {
  if (!m.claim || !m.text) err('утверждение без текста', i);
  if (!['no', 'partly', 'yes'].includes(m.verdict)) err('неизвестный вердикт', i, m.verdict);
  if (!D.byId[m.topic]) err('утверждение ссылается на неизвестную тему', i, m.topic);
});
(D.related || []).forEach(id => { if (!EG.grammar.data.byId[id]) err('урок «Грамматики» не найден', id); });

// тест: нужного размера, без повторов, соседние задания из разных тем
for (let k = 0; k < 50; k++) {
  const items = EG.getverb.logic.testItems();
  if (items.length !== EG.getverb.logic.TEST_SIZE) { err('размер теста', items.length); break; }
  if (new Set(items.map(e => e.key)).size !== items.length) { err('повтор задания в тесте'); break; }
  if (items.some((e, j) => j && e.topic === items[j - 1].topic)) { err('соседние задания теста из одной темы'); break; }
}

console.log('темы', D.topics.length, 'упражнения', exN);
console.log(errors ? errors + ' ошибок' : 'OK');
process.exit(errors ? 1 : 0);
