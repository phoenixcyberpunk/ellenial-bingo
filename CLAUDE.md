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
- Solo only for now; "fill together" via a live room is a later idea (would reuse `ellenial-room.js` from poll).

## Build notes (8 Nov 2026)
- Picture: canvas 1080×1350, always the light palette. `fitText` tries every size without splitting words first, then allows splits.
- PDF: hand-written, A4, 2 cards per page, JPEG images, white print palette (`PAL_PRINT`); pictures use `PAL_SCREEN` (peach). Payload line `%EllenialBingo:` + base64url JSON `{v:1,title,squares,count,win,cards:["031…"],lang}`. `openPdf` reads only the first 64 KB, then `parseBingo` validates everything (lengths, 9 non-empty squares, card strings `^[0-8]{9}$` with 9 distinct digits).
- Squares max 80 characters, title max 40.

## Testing
- 8 Nov 2026, Playwright at 390×844, dark and light, English and Swedish: all four screens, 10 unique cards, two-lines rule, PDF made (5 pages for 10 cards) and reopened to the same cards and rule, a non-bingo PDF gives a friendly note, long Swedish squares and a 39-letter word fit the picture. No console errors.
- Not testable here: the real share sheet on iPhone/Android. Ellen tests that on her phone.

## Open
- App icon (Ellen's own art, per the Ellenial icon template) and manifest.
- List on ellenial.app when Ellen decides (alpha).
- (Done 8 Nov) The PDF prints on white to save ink; shared pictures keep the peach ground.
- Later: fill together (live room), 4×4 and 5×5, a tappable card in the browser.

## Brand
- Final Ellenial brand: same tokens, fonts and theme switch as poll and quiz. Theme key `eb:theme-pref`. Test with `?theme=light|dark`. Copy in first person ("I").
- Accessibility: text ≥ 4.5:1, controls ≥ 3:1, never colour alone (✓ on the chosen win rule, "✓ Shared" with the word).

## Status
- 2026-11-08: v1 built and tested, white print PDF added. Repo created by Ellen, pushed to `main`. Vercel project `ellenial-bingo` (`prj_JnerObNvPb2DWbh15ddOBmDajoAz`) created, linked to the repo (auto-deploys from `main`), domain bingo.ellenial.app verified. First production deploy READY; headers (CSP, HSTS, noindex) confirmed live. Not listed on ellenial.app yet. Next: Ellen's real-phone test of sharing.
