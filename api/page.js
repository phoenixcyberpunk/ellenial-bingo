// /k7f2x → this function (rewrite in vercel.json). It serves the normal app page, with the bingo's name,
// size and end date in the preview tags, so a live link pasted in a chat shows "Kick-off bingo · 5 × 5"
// instead of a bare address. app.js then reads the code from the address and opens the bingo.

const fs = require("fs");
const path = require("path");

const SUPABASE = "https://knvrvmqdxvcatsrvkrgx.supabase.co";
const KEY = "sb_publishable_5e3mg1E-r-P_to34ONwRfw_FQYUwy3z";
const SECRET = process.env.BINGO_LIVE_SECRET || "";
const CODE = /^[2-9a-hjkmnp-z]{5}$/;

let PAGE = null;
function page() {
  if (!PAGE) PAGE = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");
  return PAGE;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

async function lookup(code) {
  if (!SECRET || !CODE.test(code)) return null;
  try {
    const r = await fetch(`${SUPABASE}/rest/v1/rpc/bingo_live_get`, {
      method: "POST",
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ p_secret: SECRET, p_code: code }),
      signal: AbortSignal.timeout(3000)
    });
    if (!r.ok) return null;
    const d = await r.json();
    if (!d) return null;
    let lang = "en";
    try { const p = JSON.parse(Buffer.from(d.payload, "base64url").toString("utf8")); if (p.lang === "sv") lang = "sv"; } catch (e) { /* keep en */ }
    return { title: d.title, size: d.size, expires: d.expires, lang };
  } catch (e) { return null; }
}

module.exports = async function handler(req, res) {
  const url = new URL(req.url, "http://x");
  const code = url.searchParams.get("code") || url.pathname.replace(/^\/|\/$/g, "");
  const d = await lookup(code);
  const host = req.headers["x-forwarded-host"] || req.headers.host || "bingo.ellenial.app";
  let title, desc;
  if (d) {
    const sv = d.lang === "sv";
    const until = new Intl.DateTimeFormat(sv ? "sv-SE" : "en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/Stockholm" }).format(new Date(d.expires));
    title = `${d.title} · ${d.size} × ${d.size}`;
    desc = sv ? `Välj en bricka och spela bingo i mobilen. Öppen till ${until}.` : `Pick a card and play bingo on your phone. Open until ${until}.`;
  } else {
    title = "This bingo has ended";
    desc = "Make your own free bingo at bingo.ellenial.app.";
  }
  const tags =
    `<meta property="og:title" content="${esc(title)}">\n` +
    `<meta property="og:description" content="${esc(desc)}">\n` +
    `<meta property="og:site_name" content="Bingo · Ellenial">\n` +
    `<meta property="og:type" content="website">\n` +
    `<meta property="og:url" content="https://${esc(host)}/${esc(CODE.test(code) ? code : "")}">\n` +
    `<meta property="og:image" content="https://${esc(host)}/icons/icon-512.png">\n` +
    `<meta name="twitter:card" content="summary">\n`;
  const html = page()
    .replace("<title>Bingo · Ellenial</title>", `<title>${esc(title)} · Bingo · Ellenial</title>`)
    .replace("</head>", tags + "</head>");
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(html);
};
