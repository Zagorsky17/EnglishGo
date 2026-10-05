// tools/iverbs-check.js — проверка разделов «Неправильные глаголы» и «Неправильные глаголы сегодня» в Node.
// Запуск из корня проекта: node tools/iverbs-check.js   → «OK» или список ошибок (код выхода 1).
// Проверяет данные (формы, примеры, группы, частотный список) и логику: варианты ответов
// (ровно один верный), проверку ввода и симуляцию 40 дней занятий.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const ROOT = process.argv[2] || path.join(__dirname, '..');

let now = new Date(2026, 0, 5, 9, 0, 0).getTime();
const RealDate = Date;
class FakeDate extends RealDate {
  constructor(...a) { super(...(a.length ? a : [now])); }
  static now() { return now; }
}
const ctx = { console, Date: FakeDate, Math, Set, Map, Promise, setTimeout, clearTimeout };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext('EG = window.EG = { ui: { h: function () { return {}; }, icon: function () { return {}; } }, views: {} };', ctx);
for (const f of ['irregular/irregular-data.js', 'irregular/irregular-table.js', 'irregular/iverbs.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}
const IR = ctx.EG.irregular;
const D = IR.data;
const L = IR.logic;
let errors = 0;
const err = (...a) => { errors++; console.log('ERR', ...a); };
const low = s => String(s).trim().toLowerCase();

/* ---------- данные ---------- */
const ids = new Set();
for (const v of D.verbs) {
  const w = v.id;
  if (ids.has(v.id)) err(w, 'повтор глагола'); ids.add(v.id);
  if (!/^[a-z]+$/.test(v.base)) err(w, 'base: только строчные латинские буквы');
  if (!v.ru) err(w, 'нет перевода');
  for (const f of v.v2.concat(v.v3)) if (!/^[a-z]+$/.test(f)) err(w, 'странная форма:', f);
  if (!D.groupsById[v.group]) err(w, 'неизвестная группа');
  const check = (text, slot, name) => {
    const m = text.match(/\[([^\]]+)\]/g) || [];
    if (m.length !== 1) return err(w, name + ': нужна ровно одна пара [..]:', text);
    const form = m[0].slice(1, -1);
    if (!slot.includes(form)) err(w, name + ': в [..] не форма', slot.join('/'), '→', form);
  };
  check(v.exPast, v.v2, 'пример V2');
  check(v.exPerfect, v.v3, 'пример V3');
  if (!/\b(have|has|had|been|having)\b/i.test(v.exPerfect)) err(w, 'в примере V3 нет have / has / been:', v.exPerfect);
  if (v.rank >= D.freq.length) err(w, 'глагола нет в частотном списке FREQ');
}
for (const b of D.freq) if (!D.byId[b]) err('FREQ: нет такого глагола в данных:', b);
if (new Set(D.freq).size !== D.freq.length) err('FREQ: повторы');
for (const g of D.groups) {
  if (!g.title || !g.rule || !g.pattern || !g.ex) err(g.id, 'группа неполная');
  if (!g.verbs.length) err(g.id, 'пустая группа');
}

/* ---------- варианты ответов ---------- */
const valid = (v, s) => { const p = s.split(' — '); return p.length === 2 && v.v2.map(low).includes(low(p[0])) && v.v3.map(low).includes(low(p[1])); };
for (const v of D.verbs) {
  for (let k = 0; k < 20; k++) {
    const o = L.formsOptions(v);
    if (o.length !== 4) err(v.id, '«Три формы»: нужно 4 варианта', o.join(' | '));
    if (new Set(o.map(low)).size !== o.length) err(v.id, '«Три формы»: повторы', o.join(' | '));
    if (!valid(v, o[0])) err(v.id, '«Три формы»: первый вариант неверный', o[0]);
    o.slice(1).forEach(x => { if (valid(v, x)) err(v.id, '«Три формы»: второй верный вариант', x); });
    const g = L.gapExercise(v);
    const slot = g.slot === 'V2' ? v.v2 : v.v3;
    if (g.options.length !== 3) err(v.id, '«Вставь форму»: нужно 3 варианта', g.options.join(' | '));
    if (new Set(g.options.map(low)).size !== g.options.length) err(v.id, '«Вставь форму»: повторы', g.options.join(' | '));
    g.options.slice(1).forEach(x => { if (slot.map(low).includes(low(x))) err(v.id, '«Вставь форму»: неверный вариант на самом деле верный', x); });
  }
  if (!L.accepts(v.v2.join('/'), v.v2) || !L.accepts(' ' + v.v3[0].toUpperCase() + ' ', v.v3)) err(v.id, 'ввод верной формы не принят');
  if (L.accepts(L.regular(v.base), v.v2) && !v.v2.includes(L.regular(v.base))) err(v.id, 'принята форма «по правилу»');
}
if (!L.accepts('was / were', D.byId.be.v2) || L.accepts('was / wos', D.byId.be.v2) || L.accepts('', D.byId.be.v2)) err('проверка ввода «was / were» работает неверно');

/* ---------- симуляция занятий ---------- */
let rnd = 11;
const coin = p => { rnd = (rnd * 16807) % 2147483647; return rnd / 2147483647 < p; };
let sessions = 0;
for (let day = 0; day < 40; day++) {
  // можно ли вообще взять двух новых из одной группы
  const unseenBy = {};
  D.verbs.forEach(v => { if (!L.store.item(v.id)) unseenBy[v.group] = (unseenBy[v.group] || 0) + 1; });
  const canPair = Object.values(unseenBy).some(n => n >= 2);
  const p = L.planToday();
  const verbs = p.due.concat(p.fresh);
  if (verbs.length > 18) err('день', day, 'сессия длиннее 18:', verbs.length);
  if (new Set(verbs.map(v => v.id)).size !== verbs.length) err('день', day, 'глагол дважды в сессии');
  if (canPair && p.fresh.length > 2 && new Set(p.fresh.map(v => v.group)).size === p.fresh.length) err('день', day, 'новые глаголы не сгруппированы');
  if (!verbs.length) { now += DAY(); continue; }
  sessions++;
  const list = L.build(verbs);
  const real = list.filter(e => e.kind !== 'intro');
  if (real.length !== verbs.length) err('день', day, 'число заданий не совпадает с числом глаголов');
  list.forEach((e, i) => {
    if (e.kind === 'intro' && (list[i + 1] || {}).verb && list[i + 1].verb.group !== e.group) err('день', day, 'знакомство с группой не перед её глаголом');
  });
  for (const v of verbs) L.grade(v, coin(0.85));
  now += DAY();
}
function DAY() { return 24 * 3600 * 1000; }
const seen = D.verbs.filter(v => L.store.item(v.id)).length;
if (seen < D.verbs.length) err('за 40 дней пройдены не все глаголы:', seen, 'из', D.verbs.length);

console.log('groups', D.groups.length, 'verbs', D.verbs.length, '· симуляция: сессий', sessions, 'пройдено глаголов', seen);
console.log(errors ? errors + ' ошибок' : 'OK');
process.exit(errors ? 1 : 0);
