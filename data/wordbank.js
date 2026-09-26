/* data/wordbank.js — сборка слов для тренажёра «Словарный запас» (перевод с выбором из 4 вариантов, написание).
   Сами слова лежат по уровням в data/words/a1.js … c1.js (подключаются раньше этого файла) и добавляются в D.wordRows:
   ['A1', часть речи, 'english|перевод; english|перевод, синоним']. Часть речи: n — существительное, v — глагол,
   a — прилагательное, d — наречие или устойчивое выражение-наречие, x — служебное слово (предлог, союз, местоимение).
   Пояснение в скобках показывается, но при сравнении переводов не учитывается. Если два слова — синонимы, дайте им
   общий перевод: тогда они не попадут в варианты ответа друг к другу. */
(function (EG) {
  'use strict';

  var D = EG.data = EG.data || {};

  var POS = { n: 'сущ.', v: 'глаг.', a: 'прил.', d: 'нареч.', x: 'служ.' };
  var RAW = D.wordRows || [];

  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  /** Переводы без пояснений в скобках — для сравнения синонимов. */
  function senses(ru) {
    return ru.replace(/\([^)]*\)/g, '').split(',').map(function (s) { return s.trim().toLowerCase().replace(/ё/g, 'е'); }).filter(Boolean);
  }

  /** Основы длинных слов перевода («раздражённый» и «раздражающий» → «раздра»): однокоренные переводы
      почти всегда синонимы, такие слова тоже не должны становиться неверными вариантами друг для друга. */
  function stems(list) {
    var out = [];
    list.forEach(function (s) {
      s.split(/[\s-]+/).forEach(function (w) { if (w.length >= 7 && out.indexOf(w.slice(0, 6)) < 0) out.push(w.slice(0, 6)); });
    });
    return out;
  }

  var words = [], byId = Object.create(null), order = 0;
  RAW.forEach(function (row) {
    row[2].split(';').forEach(function (pair) {
      var p = pair.split('|');
      if (p.length !== 2) return;
      var en = p[0].trim(), ru = p[1].trim();
      var id = slug(en);
      if (byId[id]) id += '-' + row[1];
      var sn = senses(ru);
      var w = { id: id, en: en, ru: ru, level: row[0], pos: row[1], order: order++, senses: sn, stems: stems(sn) };
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
