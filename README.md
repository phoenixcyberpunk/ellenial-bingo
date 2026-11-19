# bingo, by Ellenial

A free social bingo maker for parties, work kick-offs, car trips and Christmas. Pick a 3 × 3 or 5 × 5 card, write 9 or 25 things that might happen, choose how many cards and how to win, and every player gets the same squares in their own order. Share one live link with the whole group so everyone plays on their own phone, send each card as a picture straight into a chat, or print them all from one PDF.

Play at **https://bingo.ellenial.app**

Part of [Ellenial](https://ellenial.app): free tools made by people, for people. No account, no ads, nothing tracked.

## How private is it?

- **Pictures and PDFs never leave your phone.** They're made in the browser.
- **Live links are the one exception, and only if you make one.** The bingo (its name, squares and card orders) is kept on the Ellenial server until the link ends (1 day, 2 days or 1 week, your choice), then deleted for good, every hour on the hour. The server also counts how many people took each card number. Never names, accounts or anyone's marks: a player's card and marks stay on their own phone. To stop spam, a one-way scrambled fingerprint of the connection that changes every day is kept for at most an hour.
- **Nothing else is saved.** Close the tab and the bingo is gone. Only your language and theme choice (and, for players, their card and marks until the link ends) stay on this device (localStorage).
- **The PDF is the save file.** It carries the bingo as one line inside the file, so opening it here again brings back the name, the squares, the settings and the same cards. The app only reads that one line and checks every field before using it.

## How it works

- A plain web app: HTML, CSS and JavaScript, no build step, no framework, no libraries.
- Card size: 3 × 3 (default) or 5 × 5. On 5 × 5 the squares are a numbered list, and "Paste a list" fills them from one line per square. Switching size keeps what you wrote for the other one.
- Cards: random orders of the squares (`crypto.getRandomValues`, Fisher–Yates), never two the same. 2 to 30 cards, numbered "Card 3 of 8".
- How to win: one line, two lines, four corners (5 × 5 only) or a full card, chosen by the person making the bingo and printed on every card.
- Free square in the middle: optional (off by default on 3 × 3, on by default on 5 × 5). With it on you write one square fewer, shuffled around a free centre marked with a star and the word "Free".
- Pictures: drawn on a canvas, 1080 × 1350 px (4:5, shown uncropped in chat apps), light palette so they read and print well. Long squares shrink, then wrap; a word is only split if it can't fit whole at the smallest size.
- Sharing: the phone's own share menu (Web Share API) where it can take files; otherwise the picture downloads.
- Live links: `bingo.ellenial.app/k7f2x` (5 letters and digits, no look-alikes). Players see which card numbers are taken (updated every 10 seconds), pick one, or get a random card when all are taken, and tap their squares; the app spots a line, two lines, four corners or a full card and celebrates (no animation for people who've turned on reduce motion). Pasted in a chat, the link shows the bingo's name, size and end date. While the link is open, the printed PDF shows it on every card.
- PDF: written by hand in `app.js` (A4, two cards per page with a cut line (5 × 5: the page turns sideways, cards side by side) or one bigger card per page, the same cards on white to save ink, as JPEG). The bingo rides along as a comment line, `%EllenialBingo:<base64url JSON>`.
- English and Swedish, picked from the phone's language with a switch on the first screen.
- Help: a "?" in the top-right corner of every screen opens "How it works" in three steps. Nothing pops up by itself.
- Every picture and PDF card ends with "Created in bingo.ellenial.app · Free, no ads, no trackers. Bingo!"

| Path | What it is |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | The app |
| `api/live.js` | Live links: make, open and claim a card (talks to the database with a secret kept in Vercel's environment) |
| `api/page.js` | Serves the app at `/<code>` with the bingo's name in the chat preview |
| `api/visit.js` | The daily visit counter |
| `supabase/migrations/` | The database parts: visit counter and live links (tables locked, functions only) |
| `ellenial-theme.js` | Shared Ellenial Auto / Light / Dark switch, unchanged from ellenial maps |
| `ellenial-help.js`, `ellenial-help.css` | Shared Ellenial "?" button and "How it works" sheet: help only when someone asks for it. Started here, meant to be copied unchanged into every Ellenial app |
| `icons/`, `manifest.webmanifest` | App icon: Ellen's drawing on a lavender-blue tile, for the home screen |
| `drawings/bingo.png` | Ellen's bingo drawing (also at ellenial.app/drawings) |
| `fonts/` | Self-hosted Fraunces and DM Sans with their licences |

## Run it locally

Any static server, e.g. `python3 -m http.server`. On localhost, `?test` exposes a small test hook (`window.__bingo`) for the Playwright run.

## Running cost

Vercel's free tier and a corner of an existing Supabase free project (tiny tables, emptied every hour). Nothing to pay.

## Credits

- Product, design and the bingo drawing: Ellen Nilsson (drawing licensed CC BY-NC-SA 4.0, see [ellenial.app/drawings](https://ellenial.app/drawings)). Code: written with Claude.
- Fonts: Fraunces (The Fraunces Project Authors) and DM Sans (The DM Sans Project Authors), SIL OFL 1.1, via Fontsource.

## Licence

AGPL-3.0-only, the same as the Ellenial site. See `LICENSE`.

The Ellenial name and logo aren't covered by the code licence, see [TRADEMARK.md](TRADEMARK.md).
