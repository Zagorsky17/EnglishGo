// tools/keyverbs-check.js — проверка раздела «Ключевые глаголы» в Node (без браузера).
// Запуск из корня проекта: node tools/keyverbs-check.js   → «OK» или список ошибок (код выхода 1).
// Проверяет: поля глаголов и тем, разметку [..], варианты ответов, исправления (через проверку «Грамматики»),
// ссылки утверждений и уроков «Грамматики», сборку тестов.
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
for (const f of ['grammar/grammar-data.js', 'grammar/grammar-ui.js', 'keyverbs/keyverbs-data.js', 'keyverbs/keyverbs.js']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}
const EG = ctx.EG;
const D = EG.keyverbs.data;
const L = EG.keyverbs.logic;
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

const verbIds = new Set(), topicIds = new Set();
let exN = 0, topicN = 0;
for (const v of D.verbs) {
  if (verbIds.has(v.id)) err('повтор id глагола', v.id); verbIds.add(v.id);
  for (const f of ['emoji', 'title', 'ru', 'core']) if (!v[f]) err(v.id, 'нет поля', f);
  if (!v.topics || !v.topics.length) err(v.id, 'нет тем');
  (v.myths || []).forEach((m, i) => {
    if (!m.claim || !m.text) err(v.id, 'утверждение без текста', i);
    if (!['no', 'partly', 'yes'].includes(m.verdict)) err(v.id, 'неизвестный вердикт', m.verdict);
    if (m.topic && !(D.topicsById[m.topic] && D.topicsById[m.topic].verb === v.id)) err(v.id, 'утверждение ссылается на чужую или неизвестную тему', m.topic);
  });

  for (const t of v.topics) {
    topicN++;
    const w = v.id + '/' + t.id;
    if (topicIds.has(t.id)) err('повтор id темы', t.id); topicIds.add(t.id);
    if (t.verb !== v.id || D.topicsById[t.id] !== t) err(w, 'тема не проиндексирована');
    for (const f of ['emoji', 'title', 'ru', 'core', 'level']) if (!t[f]) err(w, 'нет поля', f);
    if (!/^(A1|A2|B1|B2|C1)$/.test(t.level)) err(w, 'неизвестный уровень', t.level);
    if (t.key) pair(t.key, w + ' key', true);
    if ((!t.examples || t.examples.length < 3) && !t.phrases) err(w, 'нужно 3+ примера или фразы');
    (t.examples || []).forEach((p, i) => pair(p, w + ' ex' + i, true));
    (t.talk || []).forEach((p, i) => pair(p, w + ' talk' + i, false));
    (t.phrases || []).forEach((p, i) => {
      if (p.length !== 4 || !p[0] || !p[1]) err(w, 'phrases: нужно [фраза, перевод, пример, перевод примера]', i);
      else pair([p[2], p[3]], w + ' phrase' + i, true);
    });
    if (t.sides && t.sides.length !== 2) err(w, 'sides: нужно ровно 2');
    (t.sides || []).forEach((s, i) => { if (!s.name || !s.means) err(w, 'sides: нет name/means', i); pair(s.ex, w + ' side' + i, true); });
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
}
(D.related || []).forEach(id => { if (!EG.grammar.data.byId[id]) err('урок «Грамматики» не найден', id); });

// тесты: нужного размера, без повторов, соседние задания из разных тем (если тем больше одной)
function checkTest(topics, size, name) {
  const want = Math.min(size, topics.reduce((s, t) => s + t.practice.length, 0));
  for (let k = 0; k < 30; k++) {
    const items = L.testItems(topics, size);
    if (items.length !== want) { err(name, 'размер теста', items.length, 'ожидалось', want); return; }
    if (new Set(items.map(e => e.key)).size !== items.length) { err(name, 'повтор задания в тесте'); return; }
    if (topics.length > 1 && items.some((e, j) => j && e.topic === items[j - 1].topic)) { err(name, 'соседние задания из одной темы'); return; }
  }
}
checkTest(L.allTopics(), L.TEST_SIZE, 'общий тест');
D.verbs.forEach(v => checkTest(v.topics, L.VERB_TEST_SIZE, 'тест ' + v.id));

console.log('глаголы', D.verbs.length, 'темы', topicN, 'упражнения', exN);
console.log(errors ? errors + ' ошибок' : 'OK');
process.exit(errors ? 1 : 0);
