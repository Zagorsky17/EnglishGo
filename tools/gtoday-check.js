// tools/gtoday-check.js — проверка раздела «Грамматика сегодня» в Node (без браузера).
// Запуск из корня проекта: node tools/gtoday-check.js   → «OK» или список ошибок (код выхода 1).
// Проверяет данные (разметка, варианты, ссылки на времена, уникальность id) и логику:
// симулирует 40 дней занятий (часть ответов неверна) и смотрит размер сессий, открытие времён,
// чередование времён и варианты в «Определи время».
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
// DOM нет — при загрузке модуль только берёт ссылки на хелперы
vm.runInContext('EG = window.EG = { ui: { h: function () { return {}; }, icon: function () { return {}; } }, views: {} };', ctx);
for (const f of ['gtoday/gtoday-data.js', 'gtoday/gtoday-run.js', 'gtoday/gtoday.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}
const GT = ctx.EG.gtoday;
const D = GT.data;
const L = GT.logic;
let errors = 0;
const err = (...a) => { errors++; console.log('ERR', ...a); };

/* ---------- данные ---------- */
const TIMES = Object.keys(D.times), ASPECTS = Object.keys(D.aspects);
const cells = new Set();
for (const t of D.tenses) {
  if (!TIMES.includes(t.time) || !ASPECTS.includes(t.aspect)) err(t.id, 'неизвестные time/aspect');
  cells.add(t.time + '/' + t.aspect);
  for (const f of ['name', 'ru', 'form', 'point']) if (!t[f]) err(t.id, 'нет поля', f);
  if (!/\[[^\]]+\]/.test(t.ex[0]) || !t.ex[1]) err(t.id, 'пример без [..] или перевода');
}
if (D.tenses.length !== 12 || cells.size !== 12) err('нужно 12 разных времён');

const ids = new Set();
const counts = {};
for (const it of D.items) {
  const w = it.id;
  if (ids.has(it.id)) err(w, 'повтор id'); ids.add(it.id);
  if (!D.tensesById[it.tense]) err(w, 'неизвестное время', it.tense);
  if (it.kind === 'sentence') {
    counts[it.tense] = (counts[it.tense] || 0) + 1;
    const n = (it.en.match(/\[/g) || []).length, m = (it.en.match(/\]/g) || []).length;
    if (n !== 1 || m !== 1) err(w, 'нужна ровно одна пара [..]:', it.en);
    if (!it.answer.trim()) err(w, 'пустая форма в [..]');
    if (!it.ru || !it.why) err(w, 'нет перевода или подсказки');
    if (it.wrong.length !== 2 || it.wrong.some(x => !x || !x.trim())) err(w, 'нужно 2 неверные формы');
    const all = [it.answer].concat(it.wrong).map(x => x.trim().toLowerCase());
    if (new Set(all).size !== all.length) err(w, 'варианты совпадают:', all.join(' | '));
    if (/^\s|\s$/.test(it.answer) || it.wrong.some(x => /^\s|\s$/.test(x))) err(w, 'пробелы по краям варианта');
  } else if (it.kind === 'pair') {
    if (!D.tensesById[it.other] || it.other === it.tense) err(w, 'второе время пары неверно', it.other);
    if (!it.ru || !it.right || !it.wrong || !it.why) err(w, 'пара неполная');
    if (it.right === it.wrong) err(w, 'фразы пары совпадают');
  } else err(w, 'неизвестный kind', it.kind);
}
for (const t of D.tenses) if ((counts[t.id] || 0) < 5) err(t.id, 'меньше 5 фраз:', counts[t.id] || 0);

/* ---------- логика: симуляция занятий ---------- */
let rnd = 7;
const coin = p => { rnd = (rnd * 16807) % 2147483647; return rnd / 2147483647 < p; };
const KINDS = new Set(['intro', 'steps', 'identify', 'choose', 'pair']);
let maxOpen = 0, sessions = 0;
for (let day = 0; day < 40; day++) {
  for (let s = 0; s < 2; s++) {
    const p = L.planToday();
    const items = p.due.concat(p.fresh);
    if (items.length > 15) err('день', day, 'сессия длиннее 15:', items.length);
    if (p.due.length > 10) err('день', day, 'повторений больше 10');
    if (new Set(items.map(x => x.id)).size !== items.length) err('день', day, 'фраза дважды в сессии');
    for (const it of p.fresh) {
      if (it.kind === 'sentence' && !p.open.has(it.tense)) err('день', day, 'новая фраза закрытого времени', it.id);
      if (it.kind === 'pair' && !(p.open.has(it.tense) && p.open.has(it.other))) err('день', day, 'пара с закрытым временем', it.id);
    }
    if (!items.length) continue;
    sessions++;
    const list = L.build(items, p.open);
    for (const ex of list) {
      if (!KINDS.has(ex.kind)) err('неизвестный вид задания', ex.kind);
      if (ex.kind === 'identify') {
        if (!ex.options.includes(ex.item.tense)) err('в вариантах нет верного времени', ex.item.id);
        if (new Set(ex.options).size !== ex.options.length || ex.options.length < 2 || ex.options.length > 4) err('варианты времени некорректны', ex.options.join(','));
      }
      if (ex.kind === 'intro' && list[list.indexOf(ex) + 1].item.tense !== ex.tense) err('знакомство не перед своим временем', ex.tense);
    }
    const real = list.filter(e => e.kind !== 'intro');
    const tensesInSession = new Set(real.map(e => e.item.tense));
    // повторов подряд не больше неизбежного: max(0, самая большая группа − остальные − 1)
    let same = 0;
    for (let i = 1; i < real.length; i++) if (real[i].item.tense === real[i - 1].item.tense) same++;
    const biggest = Math.max(...[...tensesInSession].map(t => real.filter(e => e.item.tense === t).length));
    if (same > Math.max(0, biggest - (real.length - biggest) - 1)) err('день', day, 'плохое чередование времён:', same);
    for (const it of items) L.grade(it, coin(0.8));
    now += 2 * 3600 * 1000;
  }
  maxOpen = Math.max(maxOpen, L.openTenses().size);
  now += 20 * 3600 * 1000;
}
if (maxOpen < 12) err('за 40 дней открылись не все времена:', maxOpen);
const seen = D.items.filter(it => L.store.item(it.id)).length;
if (seen < D.items.length) err('за 40 дней пройдены не все фразы:', seen, 'из', D.items.length);

console.log('tenses', D.tenses.length, 'sentences', D.items.filter(i => i.kind === 'sentence').length,
  'pairs', D.items.filter(i => i.kind === 'pair').length, '· симуляция: сессий', sessions, 'открыто времён', maxOpen);
console.log(errors ? errors + ' ошибок' : 'OK');
process.exit(errors ? 1 : 0);
