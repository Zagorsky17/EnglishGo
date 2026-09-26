/* lexicon.js — поиск слова текста в словаре тренажёра: начальные формы (went → go, cities → city,
   stopped → stop), составные слова через дефис и многословные выражения (look for, in front of). */
(function (EG) {
  'use strict';


  // неправильные формы → начальная форма
  var IRREG = (function () {
    var src = 'am,is,are,was,were,been,being:be; has,had,having:have; does,did,done:do; goes,went,gone:go; ' +
      'ate,eaten:eat; drank,drunk:drink; saw,seen:see; took,taken:take; gave,given:give; got,gotten:get; made:make; came:come; ' +
      'knew,known:know; thought:think; told:tell; said:say; found:find; felt:feel; left:leave; kept:keep; met:meet; paid:pay; ' +
      'bought:buy; brought:bring; taught:teach; caught:catch; fought:fight; sought:seek; sold:sell; sent:send; spent:spend; ' +
      'built:build; lent:lend; lost:lose; meant:mean; slept:sleep; stood:stand; understood:understand; sat:sit; won:win; ' +
      'ran:run; began,begun:begin; swam,swum:swim; sang,sung:sing; rang,rung:ring; drove,driven:drive; rode,ridden:ride; ' +
      'wrote,written:write; spoke,spoken:speak; broke,broken:break; chose,chosen:choose; woke,woken:wake; froze,frozen:freeze; ' +
      'stole,stolen:steal; forgot,forgotten:forget; fell,fallen:fall; grew,grown:grow; threw,thrown:throw; flew,flown:fly; ' +
      'drew,drawn:draw; blew,blown:blow; wore,worn:wear; tore,torn:tear; bore,borne:bear; swore,sworn:swear; hid,hidden:hide; ' +
      'bit,bitten:bite; shook,shaken:shake; rose,risen:rise; led:lead; fed:feed; fled:flee; held:hold; heard:hear; laid:lay; ' +
      'lay,lain:lie; hung:hang; dug:dig; stuck:stick; struck:strike; shot:shoot; shone:shine; slid:slide; spun:spin; ' +
      'bent:bend; burnt:burn; dreamt:dream; learnt:learn; smelt:smell; spelt:spell; spilt:spill; dealt:deal; ' +
      'became:become; shown:show; cannot:can; criteria:criterion; phenomena:phenomenon; analyses:analysis; forgave,forgiven:forgive; overcame:overcome; undertook,undertaken:undertake; withdrew,withdrawn:withdraw; ' +
      'mistook,mistaken:mistake; foresaw,foreseen:foresee; arose,arisen:arise; sank,sunk:sink; shrank,shrunk:shrink; ' +
      'men:man; women:woman; children:child; feet:foot; teeth:tooth; mice:mouse; people:person; lives:life; wives:wife; ' +
      'knives:knife; leaves:leaf; shelves:shelf; halves:half; thieves:thief; better,best:good; worse,worst:bad; ' +
      'further,furthest,farther,farthest:far; its:it; me,my,mine:i; him,his:he; her,hers:she; us,our,ours:we; them,their:they; ' +
      "don't:do; doesn't:do; didn't:do; won't:will; can't:can; isn't:be; aren't:be; wasn't:be; weren't:be; i'm:be; you're:be; " +
      "we're:be; they're:be; it's:be; that's:be; there's:there is; haven't:have; hasn't:have; i've:have; we've:have; i'll:will; " +
      "hadn't:have; i'd:would; couldn't:could; shouldn't:should; wouldn't:would";
    var out = Object.create(null);
    src.split(';').forEach(function (grp) {
      var p = grp.split(':');
      if (p.length !== 2) return;
      p[0].split(',').forEach(function (f) { out[f.trim()] = p[1].trim(); });
    });
    return out;
  })();

  var RULES = [
    [/ies$/, 'y'], [/ied$/, 'y'], [/ier$/, 'y'], [/iest$/, 'y'], [/ily$/, 'y'],
    [/ves$/, 'f'], [/ves$/, 'fe'], [/(ss|x|ch|sh|z|o)es$/, '$1'], [/es$/, ''], [/s$/, ''],
    [/([^aeiou])\1ed$/, '$1'], [/ed$/, ''], [/ed$/, 'e'],
    [/([^aeiou])\1ing$/, '$1'], [/ing$/, ''], [/ing$/, 'e'],
    [/([^aeiou])\1er$/, '$1'], [/er$/, ''], [/er$/, 'e'], [/([^aeiou])\1est$/, '$1'], [/est$/, ''], [/est$/, 'e'],
    [/ally$/, 'al'], [/ly$/, ''], [/ly$/, 'le'], [/ness$/, ''], [/ment$/, '']
  ];

  // служебные слова, которые не заучивают отдельно: только справка при нажатии
  var BASIC = {
    the: 'определённый артикль (тот самый, этот)', a: 'неопределённый артикль (один, какой-то)', an: 'неопределённый артикль (перед гласным звуком)',
    to: 'к, в (направление); частица перед глаголом: to go — идти', 'do': 'делать; вспомогательный глагол в вопросах и отрицаниях',
    'n\'t': 'не (отрицание)', 'is': 'есть, является (форма be)', are: 'есть, являются (форма be)', am: 'есть, являюсь (форма be)',
    was: 'был, была, было (форма be)', were: 'были (форма be)', been: 'был (причастие от be)', 'let\'s': 'давай(те)',
    will: 'будет (вспомогательный глагол будущего времени)', won: 'выиграл (форма win)'
  };

  var lex = null, phrases = null;
  function buildLex() {
    lex = Object.create(null);
    phrases = Object.create(null);
    EG.data.words.forEach(function (w) {
      var key = w.en.toLowerCase().replace(/’/g, "'");
      if (!lex[key]) lex[key] = w;
      if (key.indexOf(' ') > 0) phrases[key] = w;
    });
  }

  /** Нижний регистр, прямой апостроф, без диакритики (café → cafe). */
  function norm(t) {
    t = String(t).toLowerCase().replace(/’/g, "'");
    return t.normalize ? t.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : t;
  }

  /** Возможные начальные формы слова (сначала само слово). */
  function lemmas(t) {
    t = norm(t);
    var out = [t];
    function add(x) { if (x && x.length > 1 && out.indexOf(x) < 0) out.push(x); }
    var base = t.replace(/'s$/, '').replace(/'$/, '');
    add(base);
    if (IRREG[t]) add(IRREG[t]);
    if (IRREG[base]) add(IRREG[base]);
    // британское написание: organise → organize, organisation → organization
    var us = base.replace(/is(e|ed|es|er|ers|ing|ation|ations)$/, 'iz$1');
    [base, us].forEach(function (b) {
      if (b !== base) add(b);
      RULES.forEach(function (r) { if (r[0].test(b)) add(b.replace(r[0], r[1])); });
    });
    return out;
  }

  /** Слова словаря для токена (до двух разных). */
  function lookup(token) {
    if (!lex) buildLex();
    var found = [];
    var cands = lemmas(token);
    // составные через дефис: сначала целиком, затем по частям
    if (token.indexOf('-') > 0) token.split('-').forEach(function (part) { cands = cands.concat(lemmas(part)); });
    cands.forEach(function (c) {
      var w = lex[c];
      if (w && found.indexOf(w) < 0 && found.length < 2) found.push(w);
    });
    return found;
  }

  /** Многословные выражения словаря, покрывающие токен i (look for, in front of, a lot of…). */
  function phraseAt(tokens, i) {
    if (!lex) buildLex();
    var hits = [];
    for (var start = Math.max(0, i - 3); start <= i; start++) {
      for (var len = 4; len >= 2; len--) {
        var end = start + len;
        if (end <= i || end > tokens.length) continue;
        var rest = tokens.slice(start + 1, end).map(norm).join(' ');
        lemmas(tokens[start]).forEach(function (first) {
          var w = phrases[first + ' ' + rest];
          if (w && hits.indexOf(w) < 0) hits.push(w);
        });
      }
    }
    return hits;
  }

  /** Справка по служебному слову (артикли, частицы) или null. */
  function basic(token) { var k = norm(token); return Object.prototype.hasOwnProperty.call(BASIC, k) ? BASIC[k] : null; }

  EG.lexicon = { lookup: lookup, lemmas: lemmas, phraseAt: phraseAt, norm: norm, basic: basic };
})(window.EG = window.EG || {});
