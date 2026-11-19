/* ellenial bingo
   A social bingo maker. Pick 3 × 3 or 5 × 5, write 9 or 25 things, choose how many cards and how
   to win, and every player gets the same squares in their own order. Cards go out as pictures (one per player, made on
   this phone with a canvas) or as one PDF to print (also made on this phone, no library).
   Nothing you make is sent anywhere or saved: the PDF itself carries the bingo, so opening it
   here again brings the squares back. Only the language and theme choice stay on this device.
   The one call out is the daily visit counter at the bottom: an empty +1, once per browser per day. */
(function () {
  'use strict';

  var LIMITS = { title: 40, square: 80, minCards: 2, maxCards: 30 };
  var PDF_MARK = '%EllenialBingo:';

  /* ---------------- words (English and Swedish) ---------------- */

  var T = {
    en: {
      other: 'Svenska', otherLang: 'sv',
      makeTitle: 'Make a bingo',
      makeLead: function (n, free) { return 'Write ' + n + ' things that might happen. Everyone gets the same ' + n + ', in their own order' + (free ? ', around a free middle.' : '.'); },
      nameLabel: 'Name your bingo', namePh: 'Kick-off bingo',
      squaresLabel: function (n) { return 'Your ' + n + ' squares'; }, squarePh: 'Square',
      filled: function (n, of) { return (n === of ? '✓ ' : '') + n + ' of ' + of; },
      freeLabel: 'Free square in the middle', freeHint: function (n) { return 'Already marked for everyone, so you write ' + n + '. Makes lines quicker to get.'; },
      sizeLabel: 'Card size', sizes: { 3: ['3 × 3', '9 squares'], 5: ['5 × 5', '25 squares'] },
      paste: 'Paste a list', pasteLabel: 'One square per line', pasteUse: 'Use these', pasteCancel: 'Cancel',
      pasted: function (n) { return n + (n === 1 ? ' square' : ' squares') + ' filled from your list.'; },
      free: 'Free',
      perPage: 'Cards per printed page', perPage2: '2 per page', perPage1: '1 per page',
      perPageNote: function (n, side) { var two = Math.ceil(n / 2); return '2 per page: ' + two + (two === 1 ? ' sheet' : ' sheets') + (side ? ' printed sideways' : '') + ', cut along the dashed line. 1 per page: ' + n + ' sheets, bigger cards.'; },
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
        corners: ['Four corners', 'A quick round, just the four corners'],
        full: ['Full card', function (n) { return 'All ' + n + ' squares'; }]
      },
      winRule: { line: 'One line wins: a row, column or diagonal', two: 'Two lines win: any two rows, columns or diagonals', corners: 'Four corners win: all four corner squares', full: function (n) { return 'A full card wins: all ' + n + ' squares'; } },
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
      drawn: 'Drawn', madeWith: ' and designed by me, coded with the help of AI.', footPromise: 'Free · no ads · no trackers', footCounter: 'In this app: a simple visit counter', footTool: 'An Ellenial tool', footThanks: 'Thanks',
      source: 'Source',
      madeIn: 'Created in bingo.ellenial.app · Free, no ads, no trackers. Bingo!',
      help: {
        label: 'How it works', title: 'How it works', lead: 'Three steps, about two minutes.', done: 'Got it', close: 'Close',
        note: "Nothing you make is saved or sent anywhere. Close the tab and it's gone, except the files you download. In this app: a simple visit counter.",
        steps: [
          { title: 'Write your squares', text: 'Pick 3 × 3 or 5 × 5, then write 9 or 25 things that might happen (one fewer around a free middle). Stuck? Start from an example.' },
          { title: 'Choose cards and how to win', text: 'How many players, and whether one line, two lines, four corners (5 × 5) or a full card wins.' },
          { title: 'Send a card to each player', text: 'Share a picture into the chat, or print the PDF. Keep the PDF: open it here again to play with the same cards.' }
        ]
      },
      fileCard: 'card', theme: 'Appearance', themeLabels: { auto: 'Auto', light: 'Light', dark: 'Dark' },
      examples: [
        // items: the 9 for 3 × 3; more: 16 extra for 5 × 5 (25 in all).
        { name: 'Party', title: 'Party bingo', items: ['Someone mentions the weather', 'A toast in another language', 'Someone arrives late', "A story you've heard before", 'A phone rings', 'Someone sings along', 'A selfie with the host', 'Someone says "just one more"', 'A laugh you can hear across the room'],
          more: ['Someone spills a drink', 'A dance move nobody asked for', 'Someone talks about work', 'A group photo', 'Someone loses their phone', '"Who brought this?"', 'A song gets requested twice', 'Someone takes their shoes off', "An inside joke you don't get", 'Someone leaves without saying bye', 'Cake', 'Someone checks a score', '"We should do this more often"', 'Someone finds the cat', 'A new friendship', 'The last bus is mentioned'] },
        { name: 'Work kick-off', title: 'Kick-off bingo', items: ['"Can you see my screen?"', 'Someone is on mute', '"Let\'s take that offline"', 'A new acronym', 'The coffee runs out', 'Someone shows a photo of their pet', 'A slide with too much text', '"Quick question"', 'Someone says "synergy"'],
          more: ['Someone joins late', 'An echo on the call', '"Let\'s circle back"', 'A dog barks', '"Can everyone hear me?"', 'The wrong slide is shown', 'Someone eats on camera', '"Low-hanging fruit"', 'The meeting runs over', '"Let\'s park that"', 'Frozen video', '"Per my last email"', 'Someone says "ping"', 'A laptop battery dies', '"Sorry, go ahead"', 'Someone forgets to share'] },
        { name: 'Car trip', title: 'Car trip bingo', items: ['A red car', 'A cow', '"Are we there yet?"', 'A petrol station', 'Someone sings to the radio', 'A bridge', 'A caravan', 'A snack break', 'A sign with a funny name'],
          more: ['A tractor', 'A horse', 'A motorbike', 'Roadworks', 'A toilet stop', 'Someone falls asleep', 'A traffic jam', 'A church', 'A blue car', 'A sheep', 'A windmill', 'A lake', '"I need the loo"', 'A police car', 'A moose sign', 'A lorry'] },
        { name: 'Christmas', title: 'Christmas bingo', items: ['Someone falls asleep on the sofa', 'A Christmas song on the radio', 'Someone wears a Christmas jumper', 'A present gets shaken', 'Someone asks for the recipe', 'Rice pudding', 'A board game comes out', '"I said no presents this year"', 'Someone takes the last chocolate'],
          more: ['Someone cries at a film', 'Ham on the table', 'Herring', 'A candle almost tips over', 'Snow outside', 'A present wrapped last minute', 'Donald Duck on TV', 'Someone mentions last Christmas', 'Mulled wine', 'A pet in a Santa hat', 'Someone says "so cosy"', 'Too much food', 'Toffee', 'Someone forgets a name', 'A present that needs batteries', 'Someone goes for a walk'] }
      ]
    },
    sv: {
      other: 'English', otherLang: 'en',
      makeTitle: 'Gör en bingo',
      makeLead: function (n, free) { return 'Skriv ' + n + ' saker som kan hända. Alla får samma ' + n + ', i sin egen ordning' + (free ? ', runt en fri mitt.' : '.'); },
      nameLabel: 'Döp din bingo', namePh: 'Kickoff-bingo',
      squaresLabel: function (n) { return 'Dina ' + n + ' rutor'; }, squarePh: 'Ruta',
      filled: function (n, of) { return (n === of ? '✓ ' : '') + n + ' av ' + of; },
      freeLabel: 'Fri ruta i mitten', freeHint: function (n) { return 'Redan markerad för alla, så du skriver ' + n + '. Gör det lättare att få rader.'; },
      sizeLabel: 'Brickans storlek', sizes: { 3: ['3 × 3', '9 rutor'], 5: ['5 × 5', '25 rutor'] },
      paste: 'Klistra in en lista', pasteLabel: 'En ruta per rad', pasteUse: 'Använd dessa', pasteCancel: 'Avbryt',
      pasted: function (n) { return n + (n === 1 ? ' ruta' : ' rutor') + ' fylldes från din lista.'; },
      free: 'Fri',
      perPage: 'Brickor per utskriven sida', perPage2: '2 per sida', perPage1: '1 per sida',
      perPageNote: function (n, side) { var two = Math.ceil(n / 2); return '2 per sida: ' + two + ' ark' + (side ? ' i liggande format' : '') + ', klipp längs den streckade linjen. 1 per sida: ' + n + ' ark, större brickor.'; },
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
        corners: ['Fyra hörn', 'En snabb runda, bara de fyra hörnen'],
        full: ['Full bricka', function (n) { return 'Alla ' + n + ' rutor'; }]
      },
      winRule: { line: 'En rad vinner: rad, kolumn eller diagonal', two: 'Två rader vinner: valfria rader, kolumner eller diagonaler', corners: 'Fyra hörn vinner: alla fyra hörnrutorna', full: function (n) { return 'Full bricka vinner: alla ' + n + ' rutor'; } },
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
      drawn: 'Ritat', madeWith: ' och designat av mig, kodat med hjälp av AI.', footPromise: 'Gratis · inga annonser · inga trackers', footCounter: 'I den här appen: en enkel besöksräknare', footTool: 'Ett Ellenial-verktyg', footThanks: 'Tack',
      source: 'GitHub',
      madeIn: 'Skapad i bingo.ellenial.app · Gratis, ingen reklam, inga spårare. Bingo!',
      help: {
        label: 'Så funkar det', title: 'Så funkar det', lead: 'Tre steg, ungefär två minuter.', done: 'Uppfattat', close: 'Stäng',
        note: 'Inget du gör sparas eller skickas någonstans. Stäng fliken så är det borta, utom filerna du laddar ner. I den här appen: en enkel besöksräknare.',
        steps: [
          { title: 'Skriv dina rutor', text: 'Välj 3 × 3 eller 5 × 5 och skriv 9 eller 25 saker som kan hända (en färre runt en fri mitt). Kört fast? Börja från ett exempel.' },
          { title: 'Välj brickor och hur man vinner', text: 'Hur många spelare, och om en rad, två rader, fyra hörn (5 × 5) eller full bricka vinner.' },
          { title: 'Skicka en bricka till varje spelare', text: 'Dela en bild i chatten, eller skriv ut PDF:en. Spara PDF:en: öppna den här igen för att spela med samma brickor.' }
        ]
      },
      fileCard: 'bricka', theme: 'Utseende', themeLabels: { auto: 'Auto', light: 'Ljust', dark: 'Mörkt' },
      examples: [
        { name: 'Fest', title: 'Festbingo', items: ['Någon pratar om vädret', 'En skål på ett annat språk', 'Någon kommer sent', 'En historia du hört förut', 'En telefon ringer', 'Någon sjunger med', 'En selfie med värden', 'Någon säger "bara en till"', 'Ett skratt som hörs i hela rummet'],
          more: ['Någon spiller en drink', 'Ett dansmove ingen bad om', 'Någon pratar jobb', 'Ett gruppfoto', 'Någon tappar bort sin telefon', '"Vem tog med det här?"', 'En låt önskas två gånger', 'Någon tar av sig skorna', 'Ett internskämt du inte fattar', 'Någon går utan att säga hej då', 'Tårta', 'Någon kollar ett matchresultat', '"Vi borde göra det här oftare"', 'Någon hittar katten', 'En ny vänskap', 'Sista bussen nämns'] },
        { name: 'Kickoff', title: 'Kickoff-bingo', items: ['"Ser ni min skärm?"', 'Någon har mikrofonen avstängd', '"Vi tar det efteråt"', 'En ny förkortning', 'Kaffet tar slut', 'Någon visar en bild på sitt husdjur', 'En bild med för mycket text', '"En snabb fråga"', 'Någon säger "synergi"'],
          more: ['Någon ansluter sent', 'Eko i samtalet', '"Vi återkommer till det"', 'En hund skäller', '"Hör alla mig?"', 'Fel bild visas', 'Någon äter i kameran', '"Lågt hängande frukt"', 'Mötet drar över', '"Vi parkerar den"', 'Frusen bild', '"Som jag skrev i mejlet"', 'Någon säger "pinga"', 'Ett laptopbatteri dör', '"Förlåt, kör du"', 'Någon glömmer att dela'] },
        { name: 'Bilresa', title: 'Bilbingo', items: ['En röd bil', 'En ko', '"Är vi framme snart?"', 'En bensinmack', 'Någon sjunger till radion', 'En bro', 'En husvagn', 'Fikapaus', 'En skylt med ett roligt namn'],
          more: ['En traktor', 'En häst', 'En motorcykel', 'Vägarbete', 'Toastopp', 'Någon somnar', 'Bilkö', 'En kyrka', 'En blå bil', 'Ett får', 'En väderkvarn', 'En sjö', '"Jag måste kissa"', 'En polisbil', 'En älgskylt', 'En lastbil'] },
        { name: 'Jul', title: 'Julbingo', items: ['Någon somnar i soffan', 'En julsång på radion', 'Någon har jultröja', 'Någon skakar en julklapp', 'Någon frågar efter receptet', 'Risgrynsgröt', 'Ett sällskapsspel tas fram', '"Vi sa inga julklappar i år"', 'Någon tar den sista chokladen'],
          more: ['Någon gråter till en film', 'Skinka på bordet', 'Sill', 'Ett ljus håller på att välta', 'Snö ute', 'En klapp slås in i sista stund', 'Kalle Anka på tv', 'Någon pratar om förra julen', 'Glögg', 'Ett husdjur i tomteluva', 'Någon säger "så mysigt"', 'För mycket mat', 'Knäck', 'Någon glömmer ett namn', 'En klapp som behöver batterier', 'Någon tar en promenad'] }
      ]
    }
  };

  /* ---------------- state (memory only) ---------------- */

  var app = document.getElementById('app');
  var lang = pickLang();
  var state = {
    view: 'write',
    title: '',
    size: 3,          // 3 (default) or 5 (Ellen, 19 Nov 2026): the creator picks either
    squares: blank(9),
    keep: {},         // the other size's squares and free choice, so switching back loses nothing
    pasteOpen: false,
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
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '1.6');
    if (k === 2 && state.size === 5) {
      // 5 × 5 prints two cards side by side on a sideways page.
      s.setAttribute('width', 22); s.setAttribute('height', 16); s.setAttribute('viewBox', '0 0 22 16');
      s.innerHTML = '<rect x="1" y="1" width="20" height="14" rx="1.5"/><rect x="3" y="4" width="7" height="8" rx="1"/><rect x="12" y="4" width="7" height="8" rx="1"/>';
      return s;
    }
    s.setAttribute('width', 16); s.setAttribute('height', 22); s.setAttribute('viewBox', '0 0 16 22');
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
  function blank(n) { var a = []; for (var i = 0; i < n; i++) a.push(''); return a; }
  function cellsN() { return state.size * state.size; }
  function center() { return (cellsN() - 1) / 2; }   // 4 on 3 × 3, 12 on 5 × 5
  function isFree(i) { return state.free && i === center(); }
  function needed() { return cellsN() - (state.free ? 1 : 0); }
  function filledCount() {
    return state.squares.filter(function (s, i) { return !isFree(i) && clean(s, LIMITS.square); }).length;
  }
  function winKeys() { return state.size === 5 ? ['line', 'two', 'corners', 'full'] : ['line', 'two', 'full']; }
  function winText(k) { var w = t().win[k]; return [w[0], typeof w[1] === 'function' ? w[1](cellsN()) : w[1]]; }
  function ruleText(k) { var r = t().winRule[k]; return typeof r === 'function' ? r(cellsN()) : r; }
  // Free middle defaults: off on 3 × 3 (8 Nov), on for 5 × 5 (classic bingo, 19 Nov).
  function setSize(n) {
    if (n === state.size) return;
    state.keep[state.size] = { squares: state.squares, free: state.free };
    var k = state.keep[n];
    state.size = n; state.squares = k ? k.squares : blank(n * n); state.free = k ? k.free : n === 5;
    if (winKeys().indexOf(state.win) < 0) state.win = 'line';
    state.undo = null; state.pasteOpen = false;
    render();
  }
  // A small picture of each win pattern, beside its words (never the picture alone).
  function winPattern(k) {
    var n = state.size, u = 30 / n, s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'), out = '';
    s.setAttribute('width', 30); s.setAttribute('height', 30); s.setAttribute('viewBox', '0 0 30 30'); s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', 'pattern');
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
      var mid = (n - 1) / 2, on = k === 'full' || (k === 'line' && r === mid) || (k === 'two' && (r === mid - 1 || c === mid + 1)) ||
        (k === 'corners' && (r === 0 || r === n - 1) && (c === 0 || c === n - 1));
      out += '<rect x="' + (c * u + 1) + '" y="' + (r * u + 1) + '" width="' + (u - 2) + '" height="' + (u - 2) + '" rx="1" ' +
        (on ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.55"') + '/>';
    }
    s.innerHTML = out;
    return s;
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
        (backTo && state.title ? h('span', { class: 'wordmark', text: state.title }) : h('span', { class: 'wordmark' }, h('img', { class: 'brand-icon', src: '/icons/icon-192.png', alt: '', width: '44', height: '44' }), h('span', { class: 'brand-name' }, h('span', { class: 'ellenial-eyebrow', text: 'Ellenial' }), 'Bingo')))),
      h('div', { class: 'bar-right' },
        backTo ? null : h('button', { class: 'lang', lang: t().otherLang, onclick: function () {
          lang = t().otherLang; store('eb:lang', lang); render();
        } }, t().other),
        helpButton()));
  }
  // The shared Ellenial "?" (ellenial-help.js): help only when someone asks for it.
  function helpButton() {
    if (!window.EllenialHelp) return null;
    var hp = t().help;
    return EllenialHelp.button({ id: 'help', label: hp.label, onclick: function () {
      EllenialHelp.open({ title: hp.title, lead: hp.lead, image: '/drawings/bingo.png', steps: hp.steps, note: hp.note, done: hp.done, close: hp.close });
    } });
  }

  /* ---------------- shuffling ---------------- */

  function randInt(n) {
    var buf = new Uint32Array(1), lim = Math.floor(4294967296 / n) * n;
    do { crypto.getRandomValues(buf); } while (buf[0] >= lim);
    return buf[0] % n;
  }
  // With a free middle, the other squares are shuffled around it and the centre always holds itself (the free one).
  function perm() {
    var a = [], c = center();
    for (var k = 0; k < cellsN(); k++) if (!isFree(k)) a.push(k);
    for (var i = a.length - 1; i > 0; i--) { var j = randInt(i + 1), x = a[i]; a[i] = a[j]; a[j] = x; }
    if (state.free) a.splice(c, 0, c);
    return a;
  }
  // n different orders of the same squares (at least 8! = 40 320 orders: never a repeat).
  function shuffleCards(n) {
    var seen = {}, out = [];
    while (out.length < n) {
      var p = perm(), k = p.join(',');
      if (!seen[k]) { seen[k] = 1; out.push(p); }
    }
    return out;
  }
  var FREE = null;   // marks the free middle in a card's list of squares
  function cardSquares(i) {
    return state.cards[i].map(function (k, pos) { return isFree(pos) ? FREE : clean(state.squares[k], LIMITS.square); });
  }
  // Fill squares in order (skipping a free middle) from a list; returns how many were filled.
  function fillFrom(list) {
    var sq = blank(cellsN()), j = 0;
    for (var i = 0; i < sq.length; i++) {
      if (isFree(i)) { sq[i] = state.squares[i] || ''; continue; }
      if (j < list.length) sq[i] = clean(list[j++], LIMITS.square);
    }
    state.squares = sq;
    return j;
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
    function toNext(i) {
      var nx = null;
      for (var k = i + 1; k < cellsN() && !nx; k++) nx = document.getElementById('sq' + k);
      (nx || nextBtn).focus();
    }
    var squaresLabel = t().squaresLabel(of), boxes, num = 0;
    if (state.size === 5) {
      // 5 × 5: a numbered list, since 25 text boxes in a phone-wide grid are too small to type in.
      boxes = h('ol', { class: 'sq-list', 'aria-label': squaresLabel }, state.squares.map(function (s, i) {
        if (isFree(i)) return null;
        num++;
        return h('li', null,
          h('span', { class: 'sq-num', 'aria-hidden': 'true', text: String(num) }),
          h('input', {
            id: 'sq' + i, class: 'input sq-line', maxlength: LIMITS.square, autocomplete: 'off', enterkeyhint: 'next',
            'aria-label': t().squarePh + ' ' + num, placeholder: t().squarePh + ' ' + num, value: s,
            oninput: function (e) { state.squares[i] = e.target.value; update(); },
            onkeydown: function (e) { if (e.key === 'Enter') { e.preventDefault(); toNext(i); } }
          }));
      }));
    } else {
      boxes = h('div', { class: 'grid9', role: 'group', 'aria-label': squaresLabel }, state.squares.map(function (s, i) {
        if (isFree(i)) {
          return h('div', { class: 'sq free', role: 'img', 'aria-label': t().freeLabel }, starIcon(24), h('span', { text: t().free }));
        }
        return h('textarea', {
          id: 'sq' + i, class: 'sq', rows: 3, maxlength: LIMITS.square,
          'aria-label': t().squarePh + ' ' + (i + 1), placeholder: t().squarePh + ' ' + (i + 1),
          value: s,
          oninput: function (e) { state.squares[i] = e.target.value.replace(/\n/g, ' '); update(); },
          onkeydown: function (e) { if (e.key === 'Enter') { e.preventDefault(); toNext(i); } }
        });
      }));
    }
    function keepUndo() {
      var had = filledCount() > 0 || clean(state.title, 40);
      state.undo = had ? { title: state.title, squares: state.squares.slice() } : null;
    }
    var pasteBox = state.pasteOpen ? h('div', { class: 'paste stack', style: 'gap:8px' },
      h('label', { class: 'field', for: 'pastebox' }, h('span', { text: t().pasteLabel }),
        h('textarea', { id: 'pastebox', class: 'input', rows: 6, maxlength: 4000 })),
      h('div', { class: 'row-between', style: 'align-items:center' },
        h('button', { class: 'btn link', onclick: function () { state.pasteOpen = false; render(); } }, t().pasteCancel),
        h('button', { id: 'pasteuse', class: 'btn small', onclick: function () {
          var lines = document.getElementById('pastebox').value.split(/\r?\n/).map(function (l) { return clean(l.replace(/^\s*(\d+[.)]|[-*•])\s+/, ''), LIMITS.square); }).filter(Boolean);
          if (!lines.length) return;
          keepUndo();
          var n = fillFrom(lines);
          state.pasteOpen = false; state.note = t().pasted(n); render();
        } }, t().pasteUse))) : null;
    var sizeSeg = h('div', { class: 'stack', style: 'gap:8px' },
      h('span', { id: 'sizelbl', style: 'font-size:14px;font-weight:700', text: t().sizeLabel }),
      h('div', { class: 'seg two size', role: 'group', 'aria-labelledby': 'sizelbl' }, [3, 5].map(function (n) {
        return h('button', { id: 'size' + n, 'aria-pressed': String(state.size === n), onclick: function () { setSize(n); } },
          h('span', { class: 'size-txt' }, h('span', { text: t().sizes[n][0] }), h('small', { text: t().sizes[n][1] })));
      })));
    var fileInput = h('input', { type: 'file', accept: 'application/pdf,.pdf', class: 'sr-only', tabindex: '-1', 'aria-hidden': 'true', onchange: function (e) {
      var f = e.target.files && e.target.files[0]; if (f) openPdf(f);
    } });
    var page = h('div', { class: 'page' },
      topBar(null),
      h('div', { class: 'stack', style: 'gap:6px' },
        h('h1', { class: 'q', text: t().makeTitle }),
        h('p', { class: 'lead', text: t().makeLead(of, state.free) })),
      state.note ? h('p', { class: 'toast', role: 'status', text: state.note }) : null,
      h('label', { class: 'field', for: 'bname' }, h('span', { text: t().nameLabel }), nameInput),
      sizeSeg,
      h('label', { class: 'check' + (state.free ? ' on' : '') },
        h('input', { id: 'free', type: 'checkbox', checked: state.free, onchange: function (e) { state.free = e.target.checked; render(); } }),
        h('span', null, h('strong', { text: t().freeLabel }), h('small', { text: t().freeHint(cellsN() - 1) }))),
      h('div', { class: 'stack', style: 'gap:8px' },
        h('div', { class: 'row-between', style: 'align-items:center' },
          h('span', { style: 'font-size:14px;font-weight:700' }, squaresLabel, ' ', counter),
          state.pasteOpen ? null : h('button', { id: 'paste', class: 'lang', 'aria-expanded': 'false', onclick: function () {
            state.pasteOpen = true; render(); var pb = document.getElementById('pastebox'); if (pb) pb.focus();
          } }, t().paste)),
        pasteBox,
        boxes),
      h('div', { class: 'stack', style: 'gap:8px' },
        h('span', { class: 'note', text: t().examplesLabel }),
        h('div', { class: 'chips' }, t().examples.map(function (ex) {
          return h('button', { class: 'pill', onclick: function () {
            keepUndo();
            // All 9 (or 25) in place, the middle one too: switching the free middle off brings it back.
            state.squares = state.size === 5 ? ex.items.concat(ex.more) : ex.items.slice(); state.title = ex.title;
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

  // The shared Ellenial footer (9 Nov 2026): Bingo's own line on top, then the same block as every app.
  function footer() {
    return h('footer', { class: 'ell-foot' },
      h('div', { class: 'ell-notes' }, h('p', { text: t().nothingSaved })),
      h('div', { class: 'ell-shared' },
        h('p', null, h('a', { href: 'https://ellenial.app/drawings', text: t().drawn }), t().madeWith),
        h('p', { text: t().footPromise }),
        h('p', { text: t().footCounter }),
        h('p', null,
          h('a', { href: 'https://ellenial.app', text: t().footTool }), ' · ',
          h('a', { href: 'https://github.com/phoenixcyberpunk/ellenial-bingo', text: t().source }), ' · ',
          h('a', { href: 'https://ellenial.app/thanks', text: t().footThanks }))),
      h('div', { class: 'ell-controls theme-row' }, themeSwitch()));
  }

  /* ---------------- view 2: cards and how to win ---------------- */

  function viewSettings() {
    function setCount(v) { state.count = Math.max(LIMITS.minCards, Math.min(LIMITS.maxCards, v)); render(); }
    var keys = winKeys(), m = keys.length;
    if (keys.indexOf(state.win) < 0) state.win = 'line';
    var choices = keys.map(function (k) {
      var w = winText(k);
      return h('button', { id: 'win-' + k, class: 'choice', role: 'radio', 'aria-checked': String(state.win === k),
        tabindex: state.win === k ? '0' : '-1',
        onclick: function () { state.win = k; render(); },
        onkeydown: function (e) {
          var i = keys.indexOf(k);
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); state.win = keys[(i + 1) % m]; render(); document.getElementById('win-' + state.win).focus(); }
          if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); state.win = keys[(i + m - 1) % m]; render(); document.getElementById('win-' + state.win).focus(); }
        } },
        h('span', { class: 'tick', 'aria-hidden': 'true', text: '✓' }),
        winPattern(k),
        h('span', null, h('strong', { text: w[0] }), h('small', { text: w[1] })));
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
      h('div', { class: 'cells' + (state.size === 5 ? ' cells5' : '') }, cardSquares(i).map(function (s) {
        return s === FREE ? h('div', { class: 'cell free' }, starIcon(state.size === 5 ? 14 : 20), h('span', { text: t().free })) : h('div', { class: 'cell', text: s });
      })),
      h('span', { class: 'note', text: ruleText(state.win) }));
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
        h('p', { class: 'note', text: t().perPageNote(n, state.size === 5) })),
      h('div', { class: 'stack' },
        h('button', { id: 'pdf', class: 'btn', onclick: downloadPdf }, icon('save'), t().pdf),
        h('button', { id: 'allpics', class: 'btn ghost', onclick: saveAll }, t().allPics(n))),
      h('p', { class: 'note', text: t().shareFoot }),
      h('button', { class: 'btn link', style: 'align-self:center', onclick: function () {
        state.title = ''; state.squares = blank(cellsN()); state.keep = {}; state.cards = []; state.sent = {}; state.undo = null; state.free = state.size === 5;
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
  // The hidden text layer (Ellen, 8 Nov 2026): each card is the drawn picture plus the same words as
  // invisible text on top, so the PDF can be searched, copied and read aloud. Built-in Helvetica,
  // stretched to the width of each drawn line so a selection lands on the words. Same as ellenial quiz.
  function textRun(c, text, left, y, size) {
    var font = c.font, vis = c.measureText(text).width;
    c.font = size + 'px Helvetica, Arial, sans-serif';
    var hw = c.measureText(text).width || 1;
    c.font = font;
    return { text: text, x: left, y: y, size: size, scale: vis / hw };
  }
  function runAt(c, runs, text, x, y, size) {
    var w = c.measureText(text).width, a = c.textAlign;
    runs.push(textRun(c, text, a === 'center' ? x - w / 2 : a === 'right' ? x - w : x, y, size));
  }
  var WIN = { 0x2013: 0x96, 0x2014: 0x97, 0x2018: 0x91, 0x2019: 0x92, 0x201C: 0x93, 0x201D: 0x94, 0x2026: 0x85, 0x20AC: 0x80, 0x2022: 0x95 };
  function winAnsiHex(t) {
    var out = '';
    for (var i = 0; i < t.length; i++) {
      var cp = t.charCodeAt(i), b = cp < 0x80 || (cp >= 0xA0 && cp <= 0xFF) ? cp : WIN[cp] || 0x3F;
      out += (b < 16 ? '0' : '') + b.toString(16);
    }
    return '<' + out + '>';
  }
  function textLayer(runs, cw, ch, ox, oy, w, h) {
    var k = w / cw, s = 'BT 3 Tr\n';
    runs.forEach(function (r) {
      if (!r.text) return;
      s += '/F1 ' + (r.size * k).toFixed(2) + ' Tf ' + Math.max(1, Math.min(400, r.scale * 100)).toFixed(1) + ' Tz 1 0 0 1 ' +
        (ox + r.x * k).toFixed(2) + ' ' + (oy + h - r.y * (h / ch)).toFixed(2) + ' Tm ' + winAnsiHex(r.text) + ' Tj\n';
    });
    return s + 'ET\n';
  }
  function drawCard(i, forPrint) {
    var runs = [];
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
    runAt(ctx, runs, label, W - pad - cw / 2, pad + 8 + 45, 36);

    // Title, top left (shrinks, then wraps to two lines)
    var tw = W - pad * 2 - cw - 28, title = fitText(ctx, state.title, '600 {s}px ' + DISPLAY, tw, 132, 76, 40);
    ctx.fillStyle = PAL.ink; ctx.textAlign = 'left'; ctx.font = '600 ' + title.size + 'px ' + DISPLAY;
    var ty = pad + (title.lines.length === 1 ? 62 : title.lh - 6);
    title.lines.slice(0, 2).forEach(function (l, k) { ctx.fillText(l, pad, ty + k * title.lh); runAt(ctx, runs, l, pad, ty + k * title.lh, title.size); });

    // The grid: 3 x 3 or 5 x 5, always the same 960 px square, so the rest of the card stays put.
    var N = state.size, five = N === 5;
    var gy = 220, gap = five ? 14 : 20, cell = (W - pad * 2 - gap * (N - 1)) / N, inner = cell - (five ? 20 : 48), sq = cardSquares(i);
    ctx.textAlign = 'center';
    sq.forEach(function (s, k) {
      var x = pad + (k % N) * (cell + gap), y = gy + Math.floor(k / N) * (cell + gap);
      roundRect(ctx, x, y, cell, cell, five ? 14 : 24); ctx.fillStyle = s === FREE ? PAL.free : PAL.surface; ctx.fill();
      ctx.lineWidth = five ? 4 : 5; ctx.strokeStyle = PAL.accent; ctx.stroke();
      if (s === FREE) {
        // A star and the word, so it never relies on colour alone.
        var sc = five ? 2.2 : 4, star = 24 * sc, fs = five ? 28 : 44;
        ctx.save(); ctx.translate(x + cell / 2 - star / 2, y + cell / 2 - (five ? 55 : 92)); ctx.scale(sc, sc);
        ctx.fillStyle = PAL.accent; ctx.fill(new Path2D(STAR)); ctx.restore();
        ctx.fillStyle = PAL.ink; ctx.font = '700 ' + fs + 'px ' + SANS;
        var fy = y + cell / 2 + (five ? 36 : 64);
        ctx.fillText(t().free, x + cell / 2, fy);
        runAt(ctx, runs, t().free, x + cell / 2, fy, fs);
        return;
      }
      var f = five ? fitText(ctx, s, '500 {s}px ' + SANS, inner, inner, 34, 20) : fitText(ctx, s, '500 {s}px ' + SANS, inner, inner, 46, 24);
      ctx.fillStyle = PAL.ink; ctx.font = '500 ' + f.size + 'px ' + SANS;
      var top = y + (cell - f.lines.length * f.lh) / 2 + f.lh * 0.78;
      f.lines.forEach(function (l, j) { ctx.fillText(l, x + cell / 2, top + j * f.lh); runAt(ctx, runs, l, x + cell / 2, top + j * f.lh, f.size); });
    });

    // Win rule and address
    ctx.textAlign = 'left';
    var below = gy + cell * N + gap * (N - 1);
    var rule = fitText(ctx, ruleText(state.win), '500 {s}px ' + SANS, W - pad * 2, 50, 38, 26);
    ctx.fillStyle = PAL.ink; ctx.font = '500 ' + rule.size + 'px ' + SANS;
    ctx.fillText(rule.lines[0], pad, below + 70);
    runAt(ctx, runs, rule.lines[0], pad, below + 70, rule.size);
    var made = fitText(ctx, t().madeIn, '400 {s}px ' + SANS, W - pad * 2, 40, 30, 22);
    ctx.fillStyle = PAL.muted; ctx.font = '400 ' + made.size + 'px ' + SANS;
    ctx.fillText(made.lines[0], pad, H - pad + 6);
    runAt(ctx, runs, made.lines[0], pad, H - pad + 6, made.size);
    cv.runs = runs;
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
    // Cards are written one character per square: 0–8 on 3 × 3 (as before 19 Nov), 0–9 and a–o on 5 × 5.
    var payload = b64u(JSON.stringify({ v: 1, size: state.size, title: state.title, squares: state.squares, count: state.cards.length, win: state.win, free: state.free, perPage: state.perPage, cards: state.cards.map(function (c) { return c.map(function (k) { return k.toString(36); }).join(''); }), lang: lang }));
    push('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n'.replace(/[\x80-\xff]/g, '~'));
    push(PDF_MARK + payload + '\n');
    var per = state.perPage === 1 ? 1 : 2;
    // 5 × 5, 2 per page: A4 turned sideways, two cards side by side, so the squares stay big enough to read (~22 mm).
    var side = per === 2 && state.size === 5;
    var pw = side ? 841.89 : 595.28, ph = side ? 595.28 : 841.89, cardH = per === 1 ? 640 : side ? 475 : 380, cardW = cardH * W / H, x = (pw - cardW) / 2;
    var pages = Math.ceil(images.length / per);
    // object numbers: 1 catalog, 2 pages, 3 info, 4 font (for the hidden text), then per page: page, content, img1, img2?
    var next = 5, pageIds = [], pageObjs = [];
    for (var p = 0; p < pages; p++) {
      var ids = { page: next++, content: next++, imgs: [] };
      for (var q = 0; q < per && p * per + q < images.length; q++) ids.imgs.push({ id: next++, data: images[p * per + q].jpeg, runs: images[p * per + q].runs });
      pageIds.push(ids.page); pageObjs.push(ids);
    }
    function obj(id, body) { offsets[id] = len; push(id + ' 0 obj\n'); if (typeof body === 'string') push(body); else body(); push('\nendobj\n'); }
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    obj(2, '<< /Type /Pages /Count ' + pages + ' /Kids [' + pageIds.map(function (id) { return id + ' 0 R'; }).join(' ') + '] >>');
    obj(3, '<< /Title ' + pdfString(state.title) + ' /Producer (ellenial bingo, bingo.ellenial.app) /Creator (ellenial bingo) >>');
    obj(4, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    pageObjs.forEach(function (ids) {
      var xo = ids.imgs.map(function (im, k) { return '/C' + k + ' ' + im.id + ' 0 R'; }).join(' ');
      obj(ids.page, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pw + ' ' + ph + '] /Resources << /XObject << ' + xo + ' >> /Font << /F1 4 0 R >> >> /Contents ' + ids.content + ' 0 R >>');
      var s = '';
      ids.imgs.forEach(function (im, k) {
        var y = per === 1 || side ? (ph - cardH) / 2 : (k === 0 ? ph - 30 - cardH : 30);
        var cx = side ? (k === 0 ? (pw / 2 - cardW) / 2 : pw / 2 + (pw / 2 - cardW) / 2) : x;
        s += 'q ' + cardW.toFixed(2) + ' 0 0 ' + cardH + ' ' + cx.toFixed(2) + ' ' + y.toFixed(2) + ' cm /C' + k + ' Do Q\n';
        s += textLayer(im.runs || [], W, H, cx, y, cardW, cardH);
      });
      if (ids.imgs.length === 2) {
        s += side
          ? 'q 0.6 0.6 0.6 RG 0.75 w [6 4] 0 d ' + (pw / 2).toFixed(2) + ' 30 m ' + (pw / 2).toFixed(2) + ' ' + (ph - 30).toFixed(2) + ' l S Q\n'
          : 'q 0.6 0.6 0.6 RG 0.75 w [6 4] 0 d 40 ' + (ph / 2).toFixed(2) + ' m ' + (pw - 40).toFixed(2) + ' ' + (ph / 2).toFixed(2) + ' l S Q\n';
      }
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
      var imgs = state.cards.map(function (_, i) { var cv = drawCard(i, true); return { jpeg: jpegBytes(cv), runs: cv.runs }; });
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
      var m = s.match(/%EllenialBingo:([A-Za-z0-9_-]{10,40000})/);
      var b = m && parseBingo(m[1]);
      if (!b) { state.note = t().openBad; render(); return; }
      state.size = b.size; state.keep = {}; state.pasteOpen = false;
      state.title = b.title; state.squares = b.squares; state.count = b.count; state.win = b.win; state.free = b.free; state.perPage = b.perPage;
      state.cards = b.cards; state.idx = 0; state.sent = {}; state.undo = null;
      if (b.lang && b.lang !== lang) { lang = b.lang; }
      go('preview');
    }).catch(function () { state.note = t().openBad; render(); });
  }
  function parseBingo(p) {
    try {
      var d = JSON.parse(fromB64u(p));
      // No size = a 3 × 3 PDF from before 19 Nov 2026.
      var size = d.size === undefined || d.size === 3 ? 3 : d.size === 5 ? 5 : 0, nn = size * size, mid = (nn - 1) / 2;
      if (!d || d.v !== 1 || !size || typeof d.title !== 'string' || !Array.isArray(d.squares) || d.squares.length !== nn) return null;
      var squares = d.squares.map(function (x) { return clean(x, LIMITS.square); });
      var title = clean(d.title, LIMITS.title), free = d.free === true;
      if (!title || squares.some(function (x, i) { return !x && !(free && i === mid); })) return null;
      var wins = size === 5 ? ['line', 'two', 'corners', 'full'] : ['line', 'two', 'full'];
      var win = wins.indexOf(d.win) >= 0 ? d.win : 'line';
      var shape = size === 5 ? /^[0-9a-o]{25}$/ : /^[0-8]{9}$/, midCh = mid.toString(36);
      var cards = Array.isArray(d.cards) ? d.cards.filter(function (c) {
        return typeof c === 'string' && shape.test(c) && new Set(c.split('')).size === nn && (!free || c[mid] === midCh);
      }).filter(function (c, i, all) { return all.indexOf(c) === i; })   // never two cards the same
        .slice(0, LIMITS.maxCards).map(function (c) { return c.split('').map(function (ch) { return parseInt(ch, 36); }); }) : [];
      var count = Math.max(LIMITS.minCards, Math.min(LIMITS.maxCards, cards.length || parseInt(d.count, 10) || 8));
      if (cards.length < LIMITS.minCards) {
        var was = { free: state.free, size: state.size }; state.free = free; state.size = size;
        cards = shuffleCards(count); state.free = was.free; state.size = was.size;
      }
      return { size: size, title: title, squares: squares, count: cards.length, win: win, cards: cards, free: free, perPage: d.perPage === 1 ? 1 : 2, lang: d.lang === 'sv' || d.lang === 'en' ? d.lang : null };
    } catch (e) { return null; }
  }

  var VIEWS = { write: viewWrite, settings: viewSettings, preview: viewPreview, share: viewShare };

  // Test hook for the local Playwright run only (?test on localhost); nothing to see in production.
  if ((location.hostname === 'localhost' || location.hostname === '127.0.0.1') && /[?&]test\b/.test(location.search)) {
    window.__bingo = { state: state, drawCard: drawCard, buildPdf: buildPdf, jpegBytes: jpegBytes, parseBingo: parseBingo, fontsReady: fontsReady };
  }

  render(true);

  // Visit counter for Ellen's project board: one count per browser per day, nothing else.
  // The date is remembered in this browser only; the server just adds 1 to today's number.
  (function countVisit() {
    try {
      if (!(location.hostname === 'bingo.ellenial.app')) return;
      var day = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm' }).format(new Date());
      if (localStorage.getItem('ellenial-bingo:counted') === day) return;
      localStorage.setItem('ellenial-bingo:counted', day);
      if (navigator.sendBeacon) navigator.sendBeacon('/api/visit');
      else fetch('/api/visit', { method: 'POST', keepalive: true }).catch(function () {});
    } catch (e) { /* private mode or storage off: skip counting rather than count every load */ }
  })();
})();
