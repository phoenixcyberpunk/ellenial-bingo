# bingo, by Ellenial

A free social bingo maker for parties, work kick-offs, car trips and Christmas. Write 9 things that might happen, choose how many cards and how to win, and every player gets the same 9 squares in their own order. Send each card as a picture straight into a chat, or print them all from one PDF.

Play at **https://bingo.ellenial.app**

Part of [Ellenial](https://ellenial.app): free tools made by people, for people. No account, no ads, nothing tracked.

## How private is it?

- **Nothing leaves your phone.** The cards, the pictures and the PDF are all made in the browser. There is no server, no database and no live connection.
- **Nothing is saved.** Close the tab and the bingo is gone. Only your language and theme choice stay on this device (localStorage).
- **The PDF is the save file.** It carries the bingo as one line inside the file, so opening it here again brings back the name, the squares, the settings and the same cards. The app only reads that one line and checks every field before using it.

## How it works

- A plain web app: HTML, CSS and JavaScript, no build step, no framework, no libraries.
- Cards: random orders of the 9 squares (`crypto.getRandomValues`, Fisher–Yates), never two the same. 2 to 30 cards, numbered "Card 3 of 8".
- How to win: one line, two lines or a full card, chosen by the person making the bingo and printed on every card.
- Free square in the middle: optional (off by default). With it on you write 8 squares, shuffled around a free centre marked with a star and the word "Free".
- Pictures: drawn on a canvas, 1080 × 1350 px (4:5, shown uncropped in chat apps), light palette so they read and print well. Long squares shrink, then wrap; a word is only split if it can't fit whole at the smallest size.
- Sharing: the phone's own share menu (Web Share API) where it can take files; otherwise the picture downloads.
- PDF: written by hand in `app.js` (A4, two cards per page with a cut line or one bigger card per page, the same cards on white to save ink, as JPEG). The bingo rides along as a comment line, `%EllenialBingo:<base64url JSON>`.
- English and Swedish, picked from the phone's language with a switch on the first screen.

| Path | What it is |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | The app |
| `ellenial-theme.js` | Shared Ellenial Auto / Light / Dark switch, unchanged from ellenial maps |
| `fonts/` | Self-hosted Fraunces and DM Sans with their licences |

## Run it locally

Any static server, e.g. `python3 -m http.server`. On localhost, `?test` exposes a small test hook (`window.__bingo`) for the Playwright run.

## Running cost

A static site on Vercel's free tier. Nothing else.

## Credits

- Product and design: Ellen Nilsson. Code: written with Claude.
- Fonts: Fraunces (The Fraunces Project Authors) and DM Sans (The DM Sans Project Authors), SIL OFL 1.1, via Fontsource.

## Licence

AGPL-3.0-only, the same as the Ellenial site. See `LICENSE`.

The Ellenial name and logo aren't covered by the code licence, see [TRADEMARK.md](TRADEMARK.md).
