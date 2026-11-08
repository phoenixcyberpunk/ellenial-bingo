/* ellenial bingo
   A social bingo maker. Write 9 things, choose how many cards and how to win, and every player
   gets the same 9 squares in their own order. Cards go out as pictures (one per player, made on
   this phone with a canvas) or as one PDF to print (also made on this phone, no library).
   Nothing is sent anywhere and nothing is saved: the PDF itself carries the bingo, so opening it
   here again brings the squares back. Only the language and theme choice stay on this device. */
(function () {
  'use strict';

  var LIMITS = { title: 40, square: 80, minCards: 2, maxCards: 30 };
  var ORIGIN = 'bingo.ellenial.app';
  var PDF_MARK = '%EllenialBingo:';

  /* ---------------- words (English and Swedish) ---------------- */

  var T = {
    en: {
      other: 'Svenska', otherLang: 'sv',
      makeTitle: 'Make a bingo',
      makeLead: 'Write 9 things that might happen. Everyone gets the same 9, in their own order.',
      nameLabel: 'Name your bingo', namePh: 'Kick-off bingo',
      squaresLabel: 'Your 9 squares', squarePh: 'Square',
      filled: function (n, of) { return (n === of ? '✓ ' : '') + n + ' of ' + of; },
      makeLeadFree: 'Write 8 things that might happen. Everyone gets the same 8, in their own order, around a free middle.',
      squaresLabelFree: 'Your 8 squares',
      freeLabel: 'Free square in the middle', freeHint: 'Already marked for everyone, so you write 8. Makes lines quicker to get.',
      free: 'Free',
      perPage: 'Cards per printed page', perPage2: '2 per page', perPage1: '1 per page',
      perPageNote: function (n) { var two = Math.ceil(n / 2); return '2 per page: ' + two + (two === 1 ? ' sheet' : ' sheets') + ', cut along the dashed line. 1 per page: ' + n + ' sheets, bigger cards.'; },
      examplesLabel: 'Stuck? Start from an example and change it',
      examplesReplaced: 'Your squares were replaced.', undo: 'Undo',
      next: 'Next: cards and how to win',
      needAll: function (n, of) { var m = of - n; return 'Write ' + m + ' more ' + (m === 1 ? 'square' : 'squares') + ' to go on.'; },
      needName: 'Give your bingo a name to go on.',
      nothingSaved: "Nothing is saved. Close the tab and it's gone.",
      openPdf: 'Open a bingo PDF', openPdfHint: 'Made one before? Open its PDF to get the squares back.',
      openBad: "That file isn't a bingo PDF from here, so I couldn't read it.",
      back: 'Back',
      settingsTitle: 'Cards and how to win',
      howMany: 'How many cards?',
      fewer: 'One card fewer', more: 'One card more',
      howManyNote: function (n) { return 'Each card is scrambled differently and numbered, Card 1 of ' + n + ' to Card ' + n + ' of ' + n + '. Up to 30.'; },
      howWin: 'How do you win?',
      win: {
        line: ['One line', 'A row, column or diagonal'],
        two: ['Two lines', 'Any two rows, columns or diagonals'],
        full: ['Full card', 'All 9 squares']
      },
      winRule: { line: 'One line wins: a row, column or diagonal', two: 'Two lines win: any two rows, columns or diagonals', full: 'A full card wins: all 9 squares' },
      shuffle: function (n) { return 'Shuffle ' + n + ' cards'; },
      previewTitle: function (n) { return 'Your ' + n + ' cards'; },
      previewLead: 'Swipe or use the arrows to see each one.',
      cardOf: function (i, n) { return 'Card ' + i + ' of ' + n; },
      prev: 'Previous card', nextCard: 'Next card',
      toShare: 'Share or download', shuffleAgain: 'Shuffle again', reshuffled: 'New order on every card.',
      shareTitle: 'Send one card to each player',
      shareLead: "Share opens your phone's share menu, so a card goes straight into a chat.",
      share: 'Share', shared: 'Shared', shareAgain: 'Again', saved: 'Saved',
      shareCard: function (i, n) { return 'Share card ' + i + ' of ' + n; },
      pdf: 'Download PDF to print', allPics: function (n) { return 'Save all ' + n + ' pictures'; },
      shareFoot: 'Prefer screenshots? That works too. Keep the PDF: open it here again to make new cards from the same squares.',
      startOver: 'Start a new bingo',
      madeWith: 'Made by me, Ellen, with the help of AI. Free, no ads, nothing tracked.',
      source: 'Source code',
      fileCard: 'card', theme: 'Appearance', themeLabels: { auto: 'Auto', light: 'Light', dark: 'Dark' },
      examples: [
        { name: 'Party', title: 'Party bingo', items: ['Someone mentions the weather', 'A toast in another language', 'Someone arrives late', "A story you've heard before", 'A phone rings', 'Someone sings along', 'A selfie with the host', 'Someone says "just one more"', 'A laugh you can hear across the room'] },
        { name: 'Work kick-off', title: 'Kick-off bingo', items: ['"Can you see my screen?"', 'Someone is on mute', '"Let\'s take that offline"', 'A new acronym', 'The coffee runs out', 'Someone shows a photo of their pet', 'A slide with too much text', '"Quick question"', 'Someone says "synergy"'] },
        { name: 'Car trip', title: 'Car trip bingo', items: ['A red car', 'A cow', '"Are we there yet?"', 'A petrol station', 'Someone sings to the radio', 'A bridge', 'A caravan', 'A snack break', 'A sign with a funny name'] },
        { name: 'Christmas', title: 'Christmas bingo', items: ['Someone falls asleep on the sofa', 'A Christmas song on the radio', 'Someone wears a Christmas jumper', 'A present gets shaken', 'Someone asks for the recipe', 'Rice pudding', 'A board game comes out', '"I said no presents this year"', 'Someone takes the last chocolate'] }
      ]
    },
    sv: {
      other: 'English', otherLang: 'en',
      makeTitle: 'Gör en bingo',
      makeLead: 'Skriv 9 saker som kan hända. Alla får samma 9, i sin egen ordning.',
      nameLabel: 'Döp din bingo', namePh: 'Kickoff-bingo',
      squaresLabel: 'Dina 9 rutor', squarePh: 'Ruta',
      filled: function (n, of) { return (n === of ? '✓ ' : '') + n + ' av ' + of; },
      makeLeadFree: 'Skriv 8 saker som kan hända. Alla får samma 8, i sin egen ordning, runt en fri mitt.',
      squaresLabelFree: 'Dina 8 rutor',
      freeLabel: 'Fri ruta i mitten', freeHint: 'Redan markerad för alla, så du skriver 8. Gör det lättare att få rader.',
      free: 'Fri',
      perPage: 'Brickor per utskriven sida', perPage2: '2 per sida', perPage1: '1 per sida',
      perPageNote: function (n) { var two = Math.ceil(n / 2); return '2 per sida: ' + two + (two === 1 ? ' ark' : ' ark') + ', klipp längs den streckade linjen. 1 per sida: ' + n + ' ark, större brickor.'; },
      examplesLabel: 'Kört fast? Börja från ett exempel och ändra',
      examplesReplaced: 'Dina rutor byttes ut.', undo: 'Ångra',
      next: 'Nästa: brickor och hur man vinner',
      needAll: function (n, of) { var m = of - n; return 'Skriv ' + m + ' ' + (m === 1 ? 'ruta' : 'rutor') + ' till för att gå vidare.'; },
      needName: 'Ge din bingo ett namn för att gå vidare.',
      nothingSaved: 'Inget sparas. Stäng fliken så är det borta.',
      openPdf: 'Öppna en bingo-PDF', openPdfHint: 'Gjort en förut? Öppna dess PDF så kommer rutorna tillbaka.',
      openBad: 'Den filen är ingen bingo-PDF härifrån, så jag kunde inte läsa den.',
      back: 'Tillbaka',
      settingsTitle: 'Brickor och hur man vinner',
      howMany: 'Hur många brickor?',
      fewer: 'En bricka färre', more: 'En bricka till',
      howManyNote: function (n) { return 'Varje bricka blandas olika och numreras, Bricka 1 av ' + n + ' till Bricka ' + n + ' av ' + n + '. Upp till 30.'; },
      howWin: 'Hur vinner man?',
      win: {
        line: ['En rad', 'En rad, kolumn eller diagonal'],
        two: ['Två rader', 'Två valfria rader, kolumner eller diagonaler'],
        full: ['Full bricka', 'Alla 9 rutor']
      },
      winRule: { line: 'En rad vinner: rad, kolumn eller diagonal', two: 'Två rader vinner: valfria rader, kolumner eller diagonaler', full: 'Full bricka vinner: alla 9 rutor' },
      shuffle: function (n) { return 'Blanda ' + n + ' brickor'; },
      previewTitle: function (n) { return 'Dina ' + n + ' brickor'; },
      previewLead: 'Svep eller använd pilarna för att se varje bricka.',
      cardOf: function (i, n) { return 'Bricka ' + i + ' av ' + n; },
      prev: 'Förra brickan', nextCard: 'Nästa bricka',
      toShare: 'Dela eller ladda ner', shuffleAgain: 'Blanda igen', reshuffled: 'Ny ordning på varje bricka.',
      shareTitle: 'Skicka en bricka till varje spelare',
      shareLead: 'Dela öppnar telefonens delningsmeny, så att en bricka går rakt in i en chatt.',
      share: 'Dela', shared: 'Delad', shareAgain: 'Igen', saved: 'Sparad',
      shareCard: function (i, n) { return 'Dela bricka ' + i + ' av ' + n; },
      pdf: 'Ladda ner PDF för utskrift', allPics: function (n) { return 'Spara alla ' + n + ' bilder'; },
      shareFoot: 'Hellre skärmdumpar? Det går också bra. Spara PDF:en: öppna den här igen för att göra nya brickor med samma rutor.',
      startOver: 'Gör en ny bingo',
      madeWith: 'Gjord av mig, Ellen, med hjälp av AI. Gratis, ingen reklam, ingen spårning.',
      source: 'Källkod',
      fileCard: 'bricka', theme: 'Utseende', themeLabels: { auto: 'Auto', light: 'Ljust', dark: 'Mörkt' },
      examples: [
        { name: 'Fest', title: 'Festbingo', items: ['Någon pratar om vädret', 'En skål på ett annat språk', 'Någon kommer sent', 'En historia du hört förut', 'En telefon ringer', 'Någon sjunger med', 'En selfie med värden', 'Någon säger "bara en till"', 'Ett skratt som hörs i hela rummet'] },
        { name: 'Kickoff', title: 'Kickoff-bingo', items: ['"Ser ni min skärm?"', 'Någon har mikrofonen avstängd', '"Vi tar det efteråt"', 'En ny förkortning', 'Kaffet tar slut', 'Någon visar en bild på sitt husdjur', 'En bild med för mycket text', '"En snabb fråga"', 'Någon säger "synergi"'] },
        { name: 'Bilresa', title: 'Bilbingo', items: ['En röd bil', 'En ko', '"Är vi framme snart?"', 'En bensinmack', 'Någon sjunger till radion', 'En bro', 'En husvagn', 'Fikapaus', 'En skylt med ett roligt namn'] },
        { name: 'Jul', title: 'Julbingo', items: ['Någon somnar i soffan', 'En julsång på radion', 'Någon har jultröja', 'Någon skakar en julklapp', 'Någon frågar efter receptet', 'Risgrynsgröt', 'Ett sällskapsspel tas fram', '"Vi sa inga julklappar i år"', 'Någon tar den sista chokladen'] }
      ]
    }
  };

  /* ---------------- state (memory only) ---------------- */

  var app = document.getElementById('app');
  var lang = pickLang();
  var state = {
    view: 'write',
    title: '',
    squares: ['', '', '', '', '', '', '', '', ''],
    count: 8,
    win: 'line',
    free: false,      // free square in the middle (Ellen, 8 Nov 2026): off by default
    perPage: 2,       // PDF: 2 cards per A4 (cut) or 1 per page
    cards: [],        // each card: an order of the 9 square indexes
    idx: 0,           // card shown in the preview
    sent: {},         // card number -> 'shared' | 'saved' (this visit only)
    undo: null,       // squares before an example replaced them
    note: ''
  };
  function t() { return T[lang]; }

  function pickLang() {
    var saved = store('eb:lang');
    if (saved === 'sv' || saved === 'en') return saved;
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    return /^(sv|nb|nn|no|da)\b/i.test(nav) ? 'sv' : 'en';
  }

  /* ---------------- small helpers (same as ellenial poll) ---------------- */

  function h(tag, attrs) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style') el.setAttribute('style', v);
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else if (k === 'value') el.value = v;
      else if (k === 'checked') el.checked = !!v;
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, String(v));
    });
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(el, x); }); return; }
    el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
  }
  var ICONS = {
    back: '<path d="M15 18l-6-6 6-6"/>',
    fwd: '<path d="M9 18l6-6-6-6"/>',
    share: '<path d="M12 3v13"/><path d="M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
    save: '<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/>',
    shuffle: '<path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>'
  };
  function icon(name, size) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', size || 18); s.setAttribute('height', size || 18);
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', 'i');
    s.innerHTML = ICONS[name];
    return s;
  }
  function pageIcon(k) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', 16); s.setAttribute('height', 22); s.setAttribute('viewBox', '0 0 16 22'); s.setAttribute('aria-hidden', 'true');
    s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '1.6');
    s.innerHTML = '<rect x="1" y="1" width="14" height="20" rx="1.5"/>' + (k === 2
      ? '<rect x="4" y="3" width="8" height="7" rx="1"/><rect x="4" y="12" width="8" height="7" rx="1"/>'
      : '<rect x="3" y="4" width="10" height="13" rx="1"/>');
    return s;
  }
  function starIcon(size) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('width', size); s.setAttribute('height', size); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<path fill="currentColor" d="' + STAR + '"/>';
    return s;
  }
  var STAR = 'M12 2.5l2.9 6.2 6.6.7-4.9 4.5 1.4 6.6L12 17.2 6 20.5l1.4-6.6L2.5 9.4l6.6-.7z';
  function clean(s, max) {
    return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
  }
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
      if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }
  function themeSwitch() {
    if (!window.EllenialTheme) return null;
    return EllenialTheme.control({ label: t().theme, labels: t().themeLabels });
  }
  function needed() { return state.free ? 8 : 9; }
  function filledCount() {
    return state.squares.filter(function (s, i) { return !(state.free && i === 4) && clean(s, LIMITS.square); }).length;
  }
  function go(view) { state.view = view; state.note = ''; render(true); }
  function render(top) {
    document.documentElement.lang = lang;
    var focusId = top ? null : (document.activeElement && document.activeElement.id);
    app.replaceChildren(VIEWS[state.view]());
    if (focusId) { var f = document.getElementById(focusId); if (f) f.focus({ preventScroll: true }); }
    if (top) {
      window.scrollTo(0, 0);
      var hd = app.querySelector('h1'); if (hd) { hd.setAttribute('tabindex', '-1'); hd.focus({ preventScroll: true }); }
    }
  }

  function topBar(backTo) {
    return h('div', { class: 'bar' },
      h('div', { class: 'bar-left' },
        backTo ? h('button', { class: 'round', 'aria-label': t().back, onclick: function () { go(backTo); } }, icon('back', 22)) : null,
        h('span', { class: 'wordmark', text: backTo && state.title ? state.title : 'bingo' })),
      backTo ? null : h('button', { class: 'lang', lang: t().otherLang, onclick: function () {
        lang = t().otherLang; store('eb:lang', lang); render();
      } }, t().other));
  }

  /* ---------------- shuffling ---------------- */

  function randInt(n) {
    var buf = new Uint32Array(1), lim = Math.floor(4294967296 / n) * n;
    do { crypto.getRandomValues(buf); } while (buf[0] >= lim);
    return buf[0] % n;
  }
  // With a free middle, the 8 other squares are shuffled around it and position 4 always holds 4 (the free one).
  function perm() {
    var a = state.free ? [0, 1, 2, 3, 5, 6, 7, 8] : [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (var i = a.length - 1; i > 0; i--) { var j = randInt(i + 1), x = a[i]; a[i] = a[j]; a[j] = x; }
    if (state.free) a.splice(4, 0, 4);
    return a;
  }
  // n different orders of the same squares (9! = 362 880, or 8! = 40 320 with a free middle: never a repeat).
  function shuffleCards(n) {
    var seen = {}, out = [];
    while (out.length < n) {
      var p = perm(), k = p.join('');
      if (!seen[k]) { seen[k] = 1; out.push(p); }
    }
    return out;
  }
  var FREE = null;   // marks the free middle in a card's list of squares
  function cardSquares(i) {
    return state.cards[i].map(function (k, pos) { return state.free && pos === 4 ? FREE : clean(state.squares[k], LIMITS.square); });
  }

  /* ---------------- view 1: write your 9 ---------------- */

  function viewWrite() {
    var of = needed();
    var nameInput = h('input', {
      id: 'bname', class: 'input', maxlength: LIMITS.title, autocomplete: 'off',
      placeholder: t().namePh, value: state.title,
      oninput: function (e) { state.title = e.target.value; update(); }
    });
    var counter = h('span', { class: 'count', 'aria-live': 'polite' });
    var nextBtn = h('button', { class: 'btn', onclick: function () {
      state.title = clean(state.title, LIMITS.title);
      state.squares = state.squares.map(function (s) { return clean(s, LIMITS.square); });
      go('settings');
    } }, t().next);
    var hint = h('p', { class: 'note', style: 'text-align:center' });
    function update() {
      var c = filledCount(), nm = clean(state.title, LIMITS.title);
      counter.textContent = t().filled(c, of);
      counter.className = 'count' + (c === of ? ' done' : '');
      nextBtn.disabled = !(c === of && nm);
      hint.textContent = c < of ? t().needAll(c, of) : (!nm ? t().needName : '');
      hint.hidden = !hint.textContent;
    }
    var boxes = state.squares.map(function (s, i) {
      if (state.free && i === 4) {
        return h('div', { class: 'sq free', role: 'img', 'aria-label': t().freeLabel }, starIcon(24), h('span', { text: t().free }));
      }
      return h('textarea', {
        id: 'sq' + i, class: 'sq', rows: 3, maxlength: LIMITS.square,
        'aria-label': t().squarePh + ' ' + (i + 1), placeholder: t().squarePh + ' ' + (i + 1),
        value: s,
        oninput: function (e) { state.squares[i] = e.target.value.replace(/\n/g, ' '); update(); },
        onkeydown: function (e) {
          if (e.key === 'Enter') { e.preventDefault(); var nx = document.getElementById('sq' + (i + 1)) || document.getElementById('sq' + (i + 2)); (nx || nextBtn).focus(); }
        }
      });
    });
    var fileInput = h('input', { type: 'file', accept: 'application/pdf,.pdf', class: 'sr-only', tabindex: '-1', 'aria-hidden': 'true', onchange: function (e) {
      var f = e.target.files && e.target.files[0]; if (f) openPdf(f);
    } });
    var page = h('div', { class: 'page' },
      topBar(null),
      h('div', { class: 'stack', style: 'gap:6px' },
        h('h1', { class: 'q', text: t().makeTitle }),
        h('p', { class: 'lead', text: state.free ? t().makeLeadFree : t().makeLead })),
      state.note ? h('p', { class: 'toast', role: 'status', text: state.note }) : null,
      h('label', { class: 'field', for: 'bname' }, h('span', { text: t().nameLabel }), nameInput),
      h('label', { class: 'check' + (state.free ? ' on' : '') },
        h('input', { id: 'free', type: 'checkbox', checked: state.free, onchange: function (e) { state.free = e.target.checked; render(); } }),
        h('span', null, h('strong', { text: t().freeLabel }), h('small', { text: t().freeHint }))),
      h('div', { class: 'stack', style: 'gap:8px' },
        h('div', { class: 'row-between' }, h('span', { style: 'font-size:14px;font-weight:700', text: state.free ? t().squaresLabelFree : t().squaresLabel }), counter),
        h('div', { class: 'grid9', role: 'group', 'aria-label': state.free ? t().squaresLabelFree : t().squaresLabel }, boxes)),
      h('div', { class: 'stack', style: 'gap:8px' },
        h('span', { class: 'note', text: t().examplesLabel }),
        h('div', { class: 'chips' }, t().examples.map(function (ex) {
          return h('button', { class: 'pill', onclick: function () {
            var had = filledCount() > 0 || clean(state.title, 40);
            state.undo = had ? { title: state.title, squares: state.squares.slice() } : null;
            state.squares = ex.items.slice(); state.title = ex.title;
            render();
          } }, ex.name);
        })),
        state.undo ? h('div', { class: 'undo', role: 'status' }, t().examplesReplaced,
          h('button', { class: 'btn link', onclick: function () {
            state.title = state.undo.title; state.squares = state.undo.squares; state.undo = null; render();
          } }, t().undo)) : null),
      h('div', { class: 'grow' }),
      h('div', { class: 'stack' }, nextBtn, hint),
      h('div', { class: 'stack', style: 'gap:4px;align-items:center' },
        fileInput,
        h('button', { class: 'btn link', onclick: function () { fileInput.click(); } }, icon('file', 16), ' ', t().openPdf),
        h('p', { class: 'note', style: 'text-align:center', text: t().openPdfHint })),
      footer());
    update();
    return page;
  }

  function footer() {
    return h('div', { class: 'theme-row' },
      themeSwitch(),
      h('p', { class: 'foot', style: 'margin:0', text: t().nothingSaved }),
      h('p', { class: 'foot', style: 'margin:0' }, t().madeWith, ' ',
        h('a', { href: 'https://ellenial.app', text: 'ellenial.app' }), ' · ',
        h('a', { href: 'https://github.com/phoenixcyberpunk/ellenial-bingo', text: t().source })));
  }

  /* ---------------- view 2: cards and how to win ---------------- */

  function viewSettings() {
    function setCount(v) { state.count = Math.max(LIMITS.minCards, Math.min(LIMITS.maxCards, v)); render(); }
    var choices = ['line', 'two', 'full'].map(function (k) {
      return h('button', { id: 'win-' + k, class: 'choice', role: 'radio', 'aria-checked': String(state.win === k),
        tabindex: state.win === k ? '0' : '-1',
        onclick: function () { state.win = k; render(); },
        onkeydown: function (e) {
          var keys = ['line', 'two', 'full'], i = keys.indexOf(k);
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); state.win = keys[(i + 1) % 3]; render(); document.getElementById('win-' + state.win).focus(); }
          if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); state.win = keys[(i + 2) % 3]; render(); document.getElementById('win-' + state.win).focus(); }
        } },
        h('span', { class: 'tick', 'aria-hidden': 'true', text: '✓' }),
        h('span', null, h('strong', { text: t().win[k][0] }), h('small', { text: t().win[k][1] })));
    });
    return h('div', { class: 'page' },
      topBar('write'),
      h('h1', { class: 'q', text: t().settingsTitle }),
      h('section', { class: 'panel' },
        h('h2', { id: 'howmany', text: t().howMany }),
        h('div', { class: 'stepper' },
          h('button', { id: 'fewer', 'aria-label': t().fewer, disabled: state.count <= LIMITS.minCards, onclick: function () { setCount(state.count - 1); } }, '−'),
          h('output', { 'aria-labelledby': 'howmany', 'aria-live': 'polite', text: String(state.count) }),
          h('button', { id: 'more', 'aria-label': t().more, disabled: state.count >= LIMITS.maxCards, onclick: function () { setCount(state.count + 1); } }, '+')),
        h('p', { class: 'note', text: t().howManyNote(state.count) })),
      h('section', { class: 'panel' },
        h('h2', { id: 'howwin', text: t().howWin }),
        h('div', { class: 'choices', role: 'radiogroup', 'aria-labelledby': 'howwin' }, choices)),
      h('div', { class: 'grow' }),
      h('button', { class: 'btn', onclick: function () {
        state.cards = shuffleCards(state.count); state.idx = 0; state.sent = {};
        go('preview');
      } }, icon('shuffle'), t().shuffle(state.count)));
  }

  /* ---------------- view 3: preview ---------------- */

  function viewPreview() {
    var n = state.cards.length, i = state.idx;
    function to(k) { state.idx = (k + n) % n; render(); }
    var card = h('div', { class: 'bingo', 'aria-roledescription': 'card', 'aria-label': t().cardOf(i + 1, n) },
      h('div', { class: 'bingo-head' },
        h('span', { class: 'bingo-title', text: state.title }),
        h('span', { class: 'card-no', text: t().cardOf(i + 1, n) })),
      h('div', { class: 'cells' }, cardSquares(i).map(function (s) {
        return s === FREE ? h('div', { class: 'cell free' }, starIcon(20), h('span', { text: t().free })) : h('div', { class: 'cell', text: s });
      })),
      h('span', { class: 'note', text: t().winRule[state.win] }));
    var x0 = null;
    card.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    card.addEventListener('touchend', function (e) {
      if (x0 == null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) to(i + (dx < 0 ? 1 : -1));
    });
    var dots = n <= 12
      ? h('div', { class: 'dots', 'aria-hidden': 'true' }, state.cards.map(function (_, k) { return h('span', { class: 'dot' + (k === i ? ' on' : '') }); }))
      : h('span', { class: 'pos', 'aria-hidden': 'true', text: (i + 1) + ' / ' + n });
    return h('div', { class: 'page' },
      topBar('settings'),
      h('div', { class: 'stack', style: 'gap:6px' },
        h('h1', { class: 'q', text: t().previewTitle(n) }),
        h('p', { class: 'lead', text: t().previewLead })),
      card,
      h('div', { class: 'pager' },
        h('button', { id: 'prev', class: 'round', 'aria-label': t().prev, onclick: function () { to(i - 1); } }, icon('back', 22)),
        dots,
        h('button', { id: 'next', class: 'round', 'aria-label': t().nextCard, onclick: function () { to(i + 1); } }, icon('fwd', 22))),
      h('p', { class: 'sr-only', 'aria-live': 'polite', text: t().cardOf(i + 1, n) }),
      state.note ? h('p', { class: 'toast', role: 'status', text: state.note }) : null,
      h('div', { class: 'grow' }),
      h('div', { class: 'stack' },
        h('button', { class: 'btn', onclick: function () { go('share'); } }, t().toShare),
        h('button', { id: 'reshuffle', class: 'btn ghost', onclick: function () {
          state.cards = shuffleCards(state.cards.length); state.idx = 0; state.sent = {}; state.note = t().reshuffled; render();
        } }, icon('shuffle'), t().shuffleAgain)));
  }

  /* ---------------- view 4: share or download ---------------- */

  function viewShare() {
    var n = state.cards.length;
    var rows = state.cards.map(function (_, i) {
      var done = state.sent[i + 1];
      return h('div', { class: 'card-row' },
        h('span', { class: 'name', text: t().cardOf(i + 1, n) }),
        h('span', { style: 'display:flex;align-items:center;gap:6px' },
          done ? h('span', { class: 'done' }, icon('check', 16), done === 'saved' ? t().saved : t().shared) : null,
          h('button', { id: 'share-' + (i + 1), class: 'share-btn' + (done ? ' again' : ''), 'aria-label': t().shareCard(i + 1, n),
            onclick: function () { shareOne(i); } }, done ? null : icon('share', 16), done ? t().shareAgain : t().share)));
    });
    return h('div', { class: 'page' },
      topBar('preview'),
      h('div', { class: 'stack', style: 'gap:6px' },
        h('h1', { class: 'q small', text: t().shareTitle }),
        h('p', { class: 'note', style: 'font-size:14px', text: t().shareLead })),
      h('div', { class: 'cards-list' }, rows),
      state.note ? h('p', { class: 'toast', role: 'status', text: state.note }) : null,
      h('div', { class: 'grow' }),
      h('section', { class: 'panel', style: 'gap:10px' },
        h('span', { id: 'perpage', style: 'font-size:14px;font-weight:700', text: t().perPage }),
        h('div', { class: 'seg two', role: 'group', 'aria-labelledby': 'perpage' }, [2, 1].map(function (k) {
          return h('button', { id: 'pp' + k, 'aria-pressed': String(state.perPage === k), onclick: function () { state.perPage = k; render(); } },
            pageIcon(k), k === 2 ? t().perPage2 : t().perPage1);
        })),
        h('p', { class: 'note', text: t().perPageNote(n) })),
      h('div', { class: 'stack' },
        h('button', { id: 'pdf', class: 'btn', onclick: downloadPdf }, icon('save'), t().pdf),
        h('button', { id: 'allpics', class: 'btn ghost', onclick: saveAll }, t().allPics(n))),
      h('p', { class: 'note', text: t().shareFoot }),
      h('button', { class: 'btn link', style: 'align-self:center', onclick: function () {
        state.title = ''; state.squares = ['', '', '', '', '', '', '', '', '']; state.cards = []; state.sent = {}; state.undo = null; state.free = false;
        go('write');
      } }, t().startOver));
  }

  /* ---------------- the card picture (canvas) ---------------- */

  // Always the light palette: it reads well in any chat and prints cleanly.
  var PAL_SCREEN = { ground: '#FEF2E2', surface: '#FFFBF5', ink: '#1F1A2E', muted: '#575166', accent: '#342E86', onAccent: '#FFFBF5', free: '#B7B1E6' };
  // The PDF prints on white to save ink (Ellen, 8 Nov 2026); the indigo lines and number stay.
  var PAL_PRINT = { ground: '#FFFFFF', surface: '#FFFFFF', ink: '#1F1A2E', muted: '#575166', accent: '#342E86', onAccent: '#FFFFFF', free: '#E4E1F6' };
  var PAL = PAL_SCREEN;
  var W = 1080, H = 1350;   // 4:5, the shape chat apps show without cropping
  var DISPLAY = 'Fraunces, Georgia, serif', SANS = '"DM Sans", system-ui, sans-serif';

  function fontsReady() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.all([
      document.fonts.load('600 60px Fraunces'), document.fonts.load('500 40px "DM Sans"'), document.fonts.load('700 40px "DM Sans"')
    ]).catch(function () {});
  }
  function roundRect(ctx, x, y, w, hh, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + hh, r); ctx.arcTo(x + w, y + hh, x, y + hh, r);
    ctx.arcTo(x, y + hh, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  // Break text into lines that fit `max` px wide; a word too long for one line is split.
  function wrapLines(ctx, text, max) {
    var words = text.split(' '), lines = [], line = '';
    words.forEach(function (w) {
      while (ctx.measureText(w).width > max) {
        var cut = w.length - 1;
        while (cut > 1 && ctx.measureText(w.slice(0, cut) + '-').width > max) cut--;
        if (line) { lines.push(line); line = ''; }
        lines.push(w.slice(0, cut) + '-'); w = w.slice(cut);
      }
      var tt = line ? line + ' ' + w : w;
      if (line && ctx.measureText(tt).width > max) { lines.push(line); line = w; } else line = tt;
    });
    if (line) lines.push(line);
    return lines;
  }
  // The biggest size (in steps of 2 px) at which the text fits the box.
  // Words are only split when even the smallest size can't fit them whole.
  function fitText(ctx, text, weightFamily, maxW, maxH, big, small) {
    for (var pass = 0; pass < 2; pass++) {
      for (var size = big; size >= small; size -= 2) {
        ctx.font = weightFamily.replace('{s}', size);
        if (pass === 0 && text.split(' ').some(function (w) { return ctx.measureText(w).width > maxW; })) continue;
        var lines = wrapLines(ctx, text, maxW), lh = Math.round(size * 1.22);
        if (lines.length * lh <= maxH) return { size: size, lines: lines, lh: lh };
      }
    }
    ctx.font = weightFamily.replace('{s}', small);
    var l2 = wrapLines(ctx, text, maxW), lhs = Math.round(small * 1.22), fit = Math.max(1, Math.floor(maxH / lhs));
    return { size: small, lines: l2.slice(0, fit), lh: lhs };
  }
  function drawCard(i, forPrint) {
    PAL = forPrint ? PAL_PRINT : PAL_SCREEN;
    var cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d'), pad = 60, n = state.cards.length;
    ctx.fillStyle = PAL.ground; ctx.fillRect(0, 0, W, H);
    ctx.textBaseline = 'alphabetic';

    // Card number, top right
    var label = t().cardOf(i + 1, n);
    ctx.font = '700 36px ' + SANS;
    var cw = ctx.measureText(label).width + 56, chH = 64;
    roundRect(ctx, W - pad - cw, pad + 8, cw, chH, 32); ctx.fillStyle = PAL.accent; ctx.fill();
    ctx.fillStyle = PAL.onAccent; ctx.textAlign = 'center'; ctx.fillText(label, W - pad - cw / 2, pad + 8 + 45);

    // Title, top left (shrinks, then wraps to two lines)
    var tw = W - pad * 2 - cw - 28, title = fitText(ctx, state.title, '600 {s}px ' + DISPLAY, tw, 132, 76, 40);
    ctx.fillStyle = PAL.ink; ctx.textAlign = 'left'; ctx.font = '600 ' + title.size + 'px ' + DISPLAY;
    var ty = pad + (title.lines.length === 1 ? 62 : title.lh - 6);
    title.lines.slice(0, 2).forEach(function (l, k) { ctx.fillText(l, pad, ty + k * title.lh); });

    // The 3 x 3 grid
    var gy = 220, gap = 20, cell = (W - pad * 2 - gap * 2) / 3, inner = cell - 48, sq = cardSquares(i);
    ctx.textAlign = 'center';
    sq.forEach(function (s, k) {
      var x = pad + (k % 3) * (cell + gap), y = gy + Math.floor(k / 3) * (cell + gap);
      roundRect(ctx, x, y, cell, cell, 24); ctx.fillStyle = s === FREE ? PAL.free : PAL.surface; ctx.fill();
      ctx.lineWidth = 5; ctx.strokeStyle = PAL.accent; ctx.stroke();
      if (s === FREE) {
        // A star and the word, so it never relies on colour alone.
        ctx.save(); ctx.translate(x + cell / 2 - 48, y + cell / 2 - 92); ctx.scale(4, 4);
        ctx.fillStyle = PAL.accent; ctx.fill(new Path2D(STAR)); ctx.restore();
        ctx.fillStyle = PAL.ink; ctx.font = '700 44px ' + SANS;
        ctx.fillText(t().free, x + cell / 2, y + cell / 2 + 64);
        return;
      }
      var f = fitText(ctx, s, '500 {s}px ' + SANS, inner, inner, 46, 24);
      ctx.fillStyle = PAL.ink; ctx.font = '500 ' + f.size + 'px ' + SANS;
      var top = y + (cell - f.lines.length * f.lh) / 2 + f.lh * 0.78;
      f.lines.forEach(function (l, j) { ctx.fillText(l, x + cell / 2, top + j * f.lh); });
    });

    // Win rule and address
    ctx.textAlign = 'left';
    var below = gy + cell * 3 + gap * 2;
    var rule = fitText(ctx, t().winRule[state.win], '500 {s}px ' + SANS, W - pad * 2, 50, 38, 26);
    ctx.fillStyle = PAL.ink; ctx.font = '500 ' + rule.size + 'px ' + SANS;
    ctx.fillText(rule.lines[0], pad, below + 70);
    ctx.fillStyle = PAL.muted; ctx.font = '400 30px ' + SANS;
    ctx.fillText(ORIGIN, pad, H - pad + 6);
    return cv;
  }
  function cardBlob(i) {
    return fontsReady().then(function () {
      return new Promise(function (res) { drawCard(i).toBlob(function (b) { res(b); }, 'image/png'); });
    });
  }
  function slug() {
    return (clean(state.title, LIMITS.title).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'bingo');
  }
  function cardFile(i, blob) {
    return new File([blob], slug() + '-' + t().fileCard + '-' + (i + 1) + '-of-' + state.cards.length + '.png', { type: 'image/png' });
  }
  function download(blob, name) {
    var url = URL.createObjectURL(blob), a = h('a', { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function canShareFiles(files) {
    try { return !!(navigator.canShare && navigator.share && navigator.canShare({ files: files })); } catch (e) { return false; }
  }
  function mark(nums, how) { nums.forEach(function (k) { state.sent[k] = how; }); render(); }

  function shareOne(i) {
    cardBlob(i).then(function (blob) {
      if (!blob) return;
      var file = cardFile(i, blob);
      if (canShareFiles([file])) {
        navigator.share({ files: [file], title: state.title }).then(function () { mark([i + 1], 'shared'); }, function () {});
      } else {
        download(blob, file.name); mark([i + 1], 'saved');
      }
    });
  }
  function saveAll() {
    var n = state.cards.length, blobs = [];
    var chain = Promise.resolve();
    for (var i = 0; i < n; i++) (function (k) { chain = chain.then(function () { return cardBlob(k).then(function (b) { blobs[k] = b; }); }); })(i);
    chain.then(function () {
      var files = blobs.map(function (b, k) { return cardFile(k, b); }), nums = files.map(function (_, k) { return k + 1; });
      if (canShareFiles(files)) {
        navigator.share({ files: files, title: state.title }).then(function () { mark(nums, 'shared'); }, function () {});
        return;
      }
      // Browsers allow a burst of downloads when they come a moment apart.
      files.forEach(function (f, k) { setTimeout(function () { download(f, f.name); }, k * 350); });
      setTimeout(function () { mark(nums, 'saved'); }, files.length * 350);
    });
  }

  /* ---------------- PDF (built here, no library) ---------------- */

  // A4, two cards per page with a dashed cut line between. Each card is the same picture as the
  // one shared to phones (as JPEG). The bingo itself rides along as one comment line in the file,
  // so opening the PDF here again brings back the name, the 9 squares, the settings and the cards.
  function jpegBytes(cv) {
    var data = cv.toDataURL('image/jpeg', 0.92).split(',')[1], bin = atob(data), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function b64u(str) {
    var bytes = new TextEncoder().encode(str), bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function fromB64u(s) {
    var bin = atob(s.replace(/-/g, '+').replace(/_/g, '/')), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function pdfString(s) {
    // Plain ASCII for the PDF's own metadata; the full text lives in the bingo line.
    return '(' + s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\x20-\x7e]/g, '').replace(/([()\\])/g, '\\$1') + ')';
  }
  function buildPdf(images) {
    var enc = new TextEncoder(), parts = [], len = 0, offsets = [];
    function push(x) { var b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); len += b.length; }
    var payload = b64u(JSON.stringify({ v: 1, title: state.title, squares: state.squares, count: state.cards.length, win: state.win, free: state.free, perPage: state.perPage, cards: state.cards.map(function (c) { return c.join(''); }), lang: lang }));
    push('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n'.replace(/[\x80-\xff]/g, '~'));
    push(PDF_MARK + payload + '\n');
    var per = state.perPage === 1 ? 1 : 2;
    var pw = 595.28, ph = 841.89, cardH = per === 1 ? 640 : 380, cardW = cardH * W / H, x = (pw - cardW) / 2;
    var pages = Math.ceil(images.length / per);
    // object numbers: 1 catalog, 2 pages, 3 info, then per page: page, content, img1, img2?
    var next = 4, pageIds = [], pageObjs = [];
    for (var p = 0; p < pages; p++) {
      var ids = { page: next++, content: next++, imgs: [] };
      for (var q = 0; q < per && p * per + q < images.length; q++) ids.imgs.push({ id: next++, data: images[p * per + q] });
      pageIds.push(ids.page); pageObjs.push(ids);
    }
    function obj(id, body) { offsets[id] = len; push(id + ' 0 obj\n'); if (typeof body === 'string') push(body); else body(); push('\nendobj\n'); }
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    obj(2, '<< /Type /Pages /Count ' + pages + ' /Kids [' + pageIds.map(function (id) { return id + ' 0 R'; }).join(' ') + '] >>');
    obj(3, '<< /Title ' + pdfString(state.title) + ' /Producer (ellenial bingo, bingo.ellenial.app) /Creator (ellenial bingo) >>');
    pageObjs.forEach(function (ids) {
      var xo = ids.imgs.map(function (im, k) { return '/C' + k + ' ' + im.id + ' 0 R'; }).join(' ');
      obj(ids.page, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pw + ' ' + ph + '] /Resources << /XObject << ' + xo + ' >> >> /Contents ' + ids.content + ' 0 R >>');
      var s = '';
      ids.imgs.forEach(function (im, k) {
        var y = per === 1 ? (ph - cardH) / 2 : (k === 0 ? ph - 30 - cardH : 30);
        s += 'q ' + cardW.toFixed(2) + ' 0 0 ' + cardH + ' ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' cm /C' + k + ' Do Q\n';
      });
      if (ids.imgs.length === 2) s += 'q 0.6 0.6 0.6 RG 0.75 w [6 4] 0 d 40 ' + (ph / 2).toFixed(2) + ' m ' + (pw - 40).toFixed(2) + ' ' + (ph / 2).toFixed(2) + ' l S Q\n';
      obj(ids.content, '<< /Length ' + enc.encode(s).length + ' >>\nstream\n' + s + 'endstream');
      ids.imgs.forEach(function (im) {
        obj(im.id, function () {
          push('<< /Type /XObject /Subtype /Image /Width ' + W + ' /Height ' + H + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + im.data.length + ' >>\nstream\n');
          push(im.data); push('\nendstream');
        });
      });
    });
    var total = next, xref = len, x2 = 'xref\n0 ' + total + '\n0000000000 65535 f \n';
    for (var i = 1; i < total; i++) x2 += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    push(x2 + 'trailer\n<< /Size ' + total + ' /Root 1 0 R /Info 3 0 R >>\nstartxref\n' + xref + '\n%%EOF\n');
    return new Blob(parts, { type: 'application/pdf' });
  }
  function downloadPdf() {
    fontsReady().then(function () {
      var imgs = state.cards.map(function (_, i) { return jpegBytes(drawCard(i, true)); });
      download(buildPdf(imgs), slug() + '.pdf');
    });
  }

  // Open a PDF made here: read only our own line, check every field, never run anything from it.
  function openPdf(file) {
    if (file.size > 25 * 1024 * 1024) { state.note = t().openBad; render(); return; }
    var head = file.slice(0, 64 * 1024);
    head.arrayBuffer().then(function (buf) {
      var bytes = new Uint8Array(buf), s = '';
      for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
      var m = s.match(/%EllenialBingo:([A-Za-z0-9_-]{10,20000})/);
      var b = m && parseBingo(m[1]);
      if (!b) { state.note = t().openBad; render(); return; }
      state.title = b.title; state.squares = b.squares; state.count = b.count; state.win = b.win; state.free = b.free; state.perPage = b.perPage;
      state.cards = b.cards; state.idx = 0; state.sent = {}; state.undo = null;
      if (b.lang && b.lang !== lang) { lang = b.lang; }
      go('preview');
    }).catch(function () { state.note = t().openBad; render(); });
  }
  function parseBingo(p) {
    try {
      var d = JSON.parse(fromB64u(p));
      if (!d || d.v !== 1 || typeof d.title !== 'string' || !Array.isArray(d.squares) || d.squares.length !== 9) return null;
      var squares = d.squares.map(function (x) { return clean(x, LIMITS.square); });
      var title = clean(d.title, LIMITS.title), free = d.free === true;
      if (!title || squares.some(function (x, i) { return !x && !(free && i === 4); })) return null;
      var win = ['line', 'two', 'full'].indexOf(d.win) >= 0 ? d.win : 'line';
      var cards = Array.isArray(d.cards) ? d.cards.filter(function (c) {
        return typeof c === 'string' && /^[0-8]{9}$/.test(c) && new Set(c.split('')).size === 9 && (!free || c[4] === '4');
      }).filter(function (c, i, all) { return all.indexOf(c) === i; })   // never two cards the same
        .slice(0, LIMITS.maxCards).map(function (c) { return c.split('').map(Number); }) : [];
      var count = Math.max(LIMITS.minCards, Math.min(LIMITS.maxCards, cards.length || parseInt(d.count, 10) || 8));
      if (cards.length < LIMITS.minCards) { var was = state.free; state.free = free; cards = shuffleCards(count); state.free = was; }
      return { title: title, squares: squares, count: cards.length, win: win, cards: cards, free: free, perPage: d.perPage === 1 ? 1 : 2, lang: d.lang === 'sv' || d.lang === 'en' ? d.lang : null };
    } catch (e) { return null; }
  }

  var VIEWS = { write: viewWrite, settings: viewSettings, preview: viewPreview, share: viewShare };

  // Test hook for the local Playwright run only (?test on localhost); nothing to see in production.
  if ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') && /[?&]test\b/.test(location.search)) {
    window.__bingo = { state: state, drawCard: drawCard, buildPdf: buildPdf, jpegBytes: jpegBytes, parseBingo: parseBingo, fontsReady: fontsReady };
  }

  render(true);
})();
