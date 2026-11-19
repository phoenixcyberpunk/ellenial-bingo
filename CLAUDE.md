# ellenial bingo — Project Guide

Read this first in every session. Social bingo maker under **Ellenial**, English and Swedish. Project brief: https://claude.ai/artifact/RT5fXaLmYeY9DLLYPpXSZ4 · Approved mock-up (7 Nov 2026, Ellen said "Perfect" 8 Nov): https://claude.ai/artifact/WSpDUSnEpBbuXmAp3HmfH2 · Notes live in the claude.ai Project "Ellenial Party apps".

## Infrastructure
- **Code:** GitHub `phoenixcyberpunk/ellenial-bingo` (public, AGPL-3.0).
- **Hosting:** Vercel team "The Ellenial Project" (`the-ellenial-project`), project `ellenial-bingo`, domain `bingo.ellenial.app`. Auto-deploys from `main`.
- **Backend only for live links (19 Nov 2026), otherwise none:** storage beyond `eb:lang`, `eb:theme-pref`, `ellenial-bingo:counted` and, for players, `eb:live:<code>` (`{card, marks, won, exp}`, removed after the link ends). CSP `connect-src 'self'`. **Exception (9 Nov 2026):** a daily visit counter for Ellen's Ongoing board: `api/visit.js` (Vercel function) calls `public.bingo_count_visit()` once per phone per Stockholm day, which can only add 1 to `ellenial_bingo.daily_visits` (migration in `supabase/migrations`). The page side is `countVisit()` at the end of `app.js`, real address only. The help text says so openly.
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
- PDF cards = the drawn picture + an invisible Helvetica text layer (render mode 3, stretched with Tz to each drawn line), so the PDF can be searched, copied and read aloud (Ellen chose this, 8 Nov; same as Quiz).
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
- (Done 8 Nov) Compared with all the icons: new icon system = drawing centred on the tile colour, no name; Bingo keeps #DCDCF5. Home-screen name "Bingo", tab "Bingo · Ellenial", header has a small "Ellenial" above "Bingo". Details: doc `claude/ellenial-drawn-app-icons.md` in the claude.ai Project "Ellenial - Brand identity - Master".
- Roll out the shared "?" help to Quiz, Poll, Party games and the other apps (each needs its own 3 steps, shown to Ellen first).
- List on ellenial.app when Ellen decides (alpha).
- (Done 8 Nov) The PDF prints on white to save ink; shared pictures keep the peach ground.
- Later: fill together (live room), 4×4, a tappable card in the browser. (5×5 built 19 Nov.)

## Decisions (Ellen, 19 Nov 2026): 5 × 5
- 5 × 5 is a choice next to 3 × 3, not a replacement: "it's a choice to choose either and the option needs to exist". 3 × 3 stays the default. Mock-up screens 11–13 approved.
- Free middle on by default for 5 × 5 (write 24), still off by default for 3 × 3.
- Win rules on 5 × 5: one line, two lines, four corners (new, 5 × 5 only), full card (all 25).

## Build notes (19 Nov 2026)
- `state.size` (3|5); `center()` = 4 or 12; `state.keep[size]` holds the other size's squares and free choice, so switching back loses nothing.
- Write screen on 5 × 5: numbered list of inputs (not a grid), "Paste a list" (one per line, leading 1. / - / • stripped, fills in order around the free middle). Examples carry 16 extra squares (`more`) for 5 × 5.
- Picture: same 1080 × 1350 canvas and same 960 px grid; 5 × 5 cells ~181 px, text 34→20 px. Preview grid `.cells5`.
- PDF: 5 × 5 with 2 per page prints A4 sideways, cards side by side (squares ~22 mm); 1 per page as before. Payload adds `size`; cards are one base-36 character per square (0–8 on 3 × 3, so old PDFs and the old format are unchanged; 0–9a–o on 5 × 5). `parseBingo` checks size 3|5, square count, card shape per size, the free centre, and the win rule allowed for the size. A 5 × 5 PDF is rejected by the old app version (wrong square count), as it should be.
- Tested 19 Nov: Playwright 390×844, dark/light, en/sv: switching sizes, paste, examples, 10 unique cards with the centre free, four corners rule, PDF 2/page (5 sideways pages) and 1/page (10), reopened to the same cards; old 3 × 3 payload still opens; crafted payloads (size 4, wrong counts, corners on 3 × 3, bad cards) rejected or cleaned. axe-core: 0 violations on all new screens, light and dark. No console errors.

- (19 Nov, Ellen) The header shows the icon, the "Ellenial" eyebrow and "Bingo" on every screen; the bingo's own name and size sit under the heading on Settings and Share (`.bingo-sub`).

## Live links (Ellen, 19 Nov 2026; mock-up screens 14–18 + 15b approved, "build to live!")
- Three ways to share: live link (new, top of the share screen), pictures, PDF. Ellen chose real short links (option B) over links carrying the whole bingo, for the chat preview and so people use the app.
- Open for 1 day / 2 days (default) / 1 week. One link per shuffle (reshuffling or changing cards drops it).
- Players see which numbers are taken ("Free"/"Taken", dashed), can still pick a taken one, and get **Random card** (picks the least-shared card) when all are taken. The server counts takes per number only. Polls every 10 s on the pick screen.
- Tappable card; `judge()` spots line / two lines / corners / full; the **Bingo!** screen (Ellen's drawing hops in, letters pop, confetti, winning squares bounce) plays once; none of it with reduce motion. Unmarking takes the win back.
- The PDF shows "Play live: bingo.ellenial.app/xxxxx (until …)" while the link is open; pictures keep the normal footer.
- **Build:** Supabase project `knvrvmqdxvcatsrvkrgx` (the same one as the visit counter, Lapp i hatt and others), schema `ellenial_bingo`: `live_links` (code, payload = the PDF's base64url line, title, size, cards, taken[], expires_at), `live_rate`, `live_secret`. All locked; only `public.bingo_live_create/get/claim` can be called, and each needs the secret, which is in `live_secret` and in Vercel env `BINGO_LIVE_SECRET` (sensitive, production + preview), never in the repo. Rate limits: 10 links/hour per connection fingerprint, 600/hour overall, 60 claims/hour per fingerprint. Fingerprint = HMAC(secret, IP + date), kept ≤ 1 h. Cron `bingo-live-cleanup` (:29 every hour) deletes ended links and old rate rows.
- `vercel.json` rewrites `/<5 chars from 23456789abcdefghjkmnpqrstuvwxyz>` to `api/page.js` (includes `index.html`) for the og tags. The app reads the code from `location.pathname`. `/api/live` answers `{ended:true}` (200) for ended links.
- Tested 19 Nov: database functions as the public role (wrong secret refused, tables unreadable, bad card numbers ignored); local Playwright with an in-memory stand-in for the database (this workspace can't reach Supabase): make link en/sv, PDF line, preview tags, pick, taken on another phone, all taken → random (live update), play to bingo (row 3; 3×3 two lines), reload keeps marks, unmark takes it back, ended link, reduce motion; axe-core 0 violations on every new screen, light and dark.

## Brand
- Final Ellenial brand: same tokens, fonts and theme switch as poll and quiz. Theme key `eb:theme-pref`. Test with `?theme=light|dark`. Copy in first person ("I").
- Accessibility: text ≥ 4.5:1, controls ≥ 3:1, never colour alone (✓ on the chosen win rule, "✓ Shared" with the word).

## Status
- 2026-11-08: v1 built and tested, white print PDF added. Repo created by Ellen, pushed to `main`. Vercel project `ellenial-bingo` (`prj_JnerObNvPb2DWbh15ddOBmDajoAz`) created, linked to the repo (auto-deploys from `main`), domain bingo.ellenial.app verified. First production deploy READY; headers (CSP, HSTS, noindex) confirmed live. Not listed on ellenial.app yet. Next: Ellen's real-phone test of sharing.
- 2026-11-08 evening: Ellen tested on her phone: sharing and reopening the PDF work perfectly. Added the free middle square and the 2-or-1 per page PDF choice (mock-up screens 6–8 approved). Tested in Playwright: 8 unique cards with the centre always free, Next needs 8 (free) or 9, 1 per page = 8 pages and 2 per page = 4 pages for 8 cards, reopen keeps free, layout and cards, an old PDF still opens, no errors. Also removed auto-hyphenation in the preview grid.
