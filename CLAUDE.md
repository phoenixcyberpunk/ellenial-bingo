# ellenial bingo — Project Guide

Read this first in every session. Social bingo maker under **Ellenial**, English and Swedish. Project brief: https://claude.ai/artifact/RT5fXaLmYeY9DLLYPpXSZ4 · Approved mock-up (7 Nov 2026, Ellen said "Perfect" 8 Nov): https://claude.ai/artifact/WSpDUSnEpBbuXmAp3HmfH2 · Notes live in the claude.ai Project "Ellenial Party apps".

## Infrastructure
- **Code:** GitHub `phoenixcyberpunk/ellenial-bingo` (public, AGPL-3.0).
- **Hosting:** Vercel team "The Ellenial Project" (`the-ellenial-project`), project `ellenial-bingo`, domain `bingo.ellenial.app`. Auto-deploys from `main`.
- **No backend at all:** no Supabase, no live room, no storage beyond `eb:lang` and `eb:theme-pref`. CSP `connect-src 'self'`.
- **Stack:** plain HTML/CSS/JS, no build, no libraries. `fonts/`, `ellenial-theme.js`, `LICENSE`, `TRADEMARK.md` and the base of `styles.css` copied from ellenial poll.

## Decisions (Ellen, 7 Nov 2026)
- Its own app at bingo.ellenial.app (not a Party games game).
- Exactly 9 squares, one 3×3 template. Everyone gets the same 9, scrambled: that's the point, and one person only has to come up with 9.
- The creator chooses how many cards (2–30) and how to win (one line, two lines, full card). Every card is numbered.
- Pictures (one per player, share sheet) and a PDF to print. Screenshots are mentioned as fine too.
- (8 Nov) Free square in the middle: an option, OFF by default (on 3×3 the centre is on 4 of 8 lines, so a line can need only 2 squares; the hint says so). With it on you write 8; the 8 are shuffled around the centre.
- (8 Nov) PDF: the creator picks 2 cards per page (default, cut line) or 1 per page (bigger, centred).
- Solo only for now; "fill together" via a live room is a later idea (would reuse `ellenial-room.js` from poll).

## Build notes (8 Nov 2026)
- Picture: canvas 1080×1350, always the light palette. `fitText` tries every size without splitting words first, then allows splits.
- PDF: hand-written, A4, 2 cards per page, JPEG images, white print palette (`PAL_PRINT`); pictures use `PAL_SCREEN` (peach). Payload line `%EllenialBingo:` + base64url JSON `{v:1,title,squares,count,win,cards:["031…"],lang}`. `openPdf` reads only the first 64 KB, then `parseBingo` validates everything (lengths, 9 non-empty squares, card strings `^[0-8]{9}$` with 9 distinct digits).
- Squares max 80 characters, title max 40.
- Free middle: `state.free`; a card is still 9 digits with `4` fixed at position 4, and `squares[4]` is ignored (kept, so switching off brings it back). Payload adds `free` and `perPage`; `parseBingo` rejects free cards without `4` in the middle. PDFs from before 8 Nov (no `free`) still open.

## Testing
- 8 Nov 2026, Playwright at 390×844, dark and light, English and Swedish: all four screens, 10 unique cards, two-lines rule, PDF made (5 pages for 10 cards) and reopened to the same cards and rule, a non-bingo PDF gives a friendly note, long Swedish squares and a 39-letter word fit the picture. No console errors.
- Not testable here: the real share sheet on iPhone/Android. Ellen tests that on her phone.

## Decisions (Ellen, 8 Nov 2026, evening)
- App icon: Ellen's own drawing (bingo card, red dots, green winning diagonal) replaces the flower on the tile; "bingo" in Fraunces stays bottom-left. Tile lavender-blue #DCDCF5, TEMPORARY: Ellen will upload all the other icons and compare. Master made from her 1024 px original (art/drawings/bingo.png in the ellenial repo); `icons/` holds 512, 192 and apple-touch 180.
- Footer on every picture and PDF card: "Created in bingo.ellenial.app · Free, no ads, no trackers. Bingo!" (Swedish: "Skapad i bingo.ellenial.app · Gratis, ingen reklam, inga spårare. Bingo!"). "Bingo!" chosen over "jackpot" (a gambling word).
- Help is opt-in and the same in every app: a "?" top-right opens "How it works" (3 steps). Never shown unasked. Built here as the shared `ellenial-help.js` + `ellenial-help.css` (copy unchanged; they read the app's colour variables). Other apps still to get it.
- Listed on ellenial.app as Alpha with Ellen's descriptions (en/sv).

## Ship check (8 Nov 2026, against Public)
- Repo history clean (no keys or personal data; commits as Claude <noreply@anthropic.com>); AGPL-3.0; innerHTML only on constant SVG.
- Crafted-PDF fuzz (HTML in fields, 5 000-char text, bad/duplicate/500 cards, wrong types, `__proto__`, wrong version, payload past 64 KB, garbage, empty, bad base64/JSON): all rejected or cleaned, no injection, no errors. Fix: duplicate cards in a PDF are now dropped.
- axe-core (WCAG 2.1 AA + best practice): 0 violations on all 4 screens, light and dark, phone and desktop. Canvas/PDF colour pairs ≥ 5.6:1. Keyboard order follows the page.
- Passes Alpha (and Beta once fonts are credited). Public blocked by: Ellen's app icon + manifest, the shared "how it works in 3 steps" onboarding gate, `bingo` in credits.json for Fraunces, DM Sans and Fontsource, and the library card (her description). Cost receipt: nothing to add (static, inside "hosting now $0").

## Open
- Final tile colour once Ellen has compared all the icons.
- Roll out the shared "?" help to Quiz, Poll, Party games and the other apps (each needs its own 3 steps, shown to Ellen first).
- List on ellenial.app when Ellen decides (alpha).
- (Done 8 Nov) The PDF prints on white to save ink; shared pictures keep the peach ground.
- Later: fill together (live room), 4×4 and 5×5, a tappable card in the browser.

## Brand
- Final Ellenial brand: same tokens, fonts and theme switch as poll and quiz. Theme key `eb:theme-pref`. Test with `?theme=light|dark`. Copy in first person ("I").
- Accessibility: text ≥ 4.5:1, controls ≥ 3:1, never colour alone (✓ on the chosen win rule, "✓ Shared" with the word).

## Status
- 2026-11-08: v1 built and tested, white print PDF added. Repo created by Ellen, pushed to `main`. Vercel project `ellenial-bingo` (`prj_JnerObNvPb2DWbh15ddOBmDajoAz`) created, linked to the repo (auto-deploys from `main`), domain bingo.ellenial.app verified. First production deploy READY; headers (CSP, HSTS, noindex) confirmed live. Not listed on ellenial.app yet. Next: Ellen's real-phone test of sharing.
- 2026-11-08 evening: Ellen tested on her phone: sharing and reopening the PDF work perfectly. Added the free middle square and the 2-or-1 per page PDF choice (mock-up screens 6–8 approved). Tested in Playwright: 8 unique cards with the centre always free, Next needs 8 (free) or 9, 1 per page = 8 pages and 2 per page = 4 pages for 8 cards, reopen keeps free, layout and cards, an old PDF still opens, no errors. Also removed auto-hyphenation in the preview grid.
