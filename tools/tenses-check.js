// tools/tenses-check.js — проверка раздела «Таблица времён» в Node (без браузера).
// Запуск из корня проекта: node tools/tenses-check.js   → «OK» или список ошибок (код выхода 1).
// Проверяет: все 12 клеток таблицы заполнены, поля на месте, разметка [..] парная,
// ссылки «Не путай» и уроки «Грамматики» существуют.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const ROOT = process.argv[2] || path.join(__dirname, '..');

const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ['grammar/grammar-data.js', 'tenses/tenses-data.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}
const EG = ctx.EG;
const D = EG.tenses.data;
const grammar = EG.grammar.data.byId;
let errors = 0;
const err = (...a) => { errors++; console.log('ERR', ...a); };

const times = new Set(D.times.map(x => x.id));
const aspects = new Set(D.aspects.map(x => x.id));
const TL = new Set(['habit', 'point', 'span', 'upto', 'spanUpto']);
const cells = new Set();
const ids = new Set();

function marked(s, where) {
  if (typeof s !== 'string' || !s.trim()) return err(where, 'пустая строка');
  const open = (s.match(/\[/g) || []).length, close = (s.match(/\]/g) || []).length;
  if (open !== close || /\[[^\]]*\[/.test(s)) err(where, 'непарные скобки:', s);
}

if (D.list.length !== 12) err('ожидалось 12 времён, найдено', D.list.length);
for (const t of D.list) {
  const w = t.id;
  if (ids.has(t.id)) err(w, 'повтор id'); ids.add(t.id);
  if (!times.has(t.time)) err(w, 'неизвестное time', t.time);
  if (!aspects.has(t.aspect)) err(w, 'неизвестный aspect', t.aspect);
  const key = t.time + '/' + t.aspect;
  if (cells.has(key)) err(w, 'клетка занята дважды', key); cells.add(key);
  for (const f of ['name', 'ru', 'pitfall', 'level']) if (!t[f]) err(w, 'нет поля', f);
  if (!TL.has(t.tl)) err(w, 'неизвестная схема tl', t.tl);
  if (!Array.isArray(t.when) || t.when.length < 2) err(w, 'when: нужно хотя бы 2 пункта');
  if (!Array.isArray(t.formula) || t.formula.length !== 3) err(w, 'formula: нужно [+, −, ?]');
  else if (!/\?$/.test(t.formula[2])) err(w, 'formula[2] — вопрос должен заканчиваться «?»');
  if (!Array.isArray(t.ex) || t.ex.length < 2) err(w, 'ex: нужно хотя бы 2 примера');
  (t.ex || []).forEach((e, i) => {
    marked(e[0], w + ' ex[' + i + ']');
    if (!/\[/.test(e[0])) err(w, 'ex[' + i + '] без подсветки [..]');
    if (!e[1]) err(w, 'ex[' + i + '] без перевода');
  });
  if (!Array.isArray(t.markers) || !t.markers.length) err(w, 'нет слов-подсказок');
  if (!Array.isArray(t.vs) || !t.vs.length) err(w, 'нет блока «Не путай»');
  (t.vs || []).forEach(v => {
    if (!D.byId[v.id]) err(w, 'vs ссылается на неизвестное время', v.id);
    if (v.id === t.id) err(w, 'vs ссылается сам на себя');
    if (!v.text) err(w, 'vs без текста', v.id);
  });
  if (t.grammar && !grammar[t.grammar]) err(w, 'урок грамматики не найден', t.grammar);
}
for (const tm of times) for (const a of aspects) if (!cells.has(tm + '/' + a)) err('пустая клетка таблицы', tm + '/' + a);

console.log(errors ? errors + ' ошибок' : 'OK');
process.exit(errors ? 1 : 0);
