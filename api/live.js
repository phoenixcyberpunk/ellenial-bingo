// /api/live — Bingo live links (19 Nov 2026).
//   GET  ?code=k7f2x                          → { payload, expires, taken }   ({ ended: true } when it has ended)
//   POST { action: "create", payload, hours } → { code, expires }
//   POST { action: "claim", code, card }      → { taken }
// The bingo is the same base64url line the PDF carries; it's kept until the link ends, then deleted.
// Every database call carries BINGO_LIVE_SECRET (Vercel environment only), so the bingo_live_* functions
// can't be called around this file. Spam brake: a one-way scrambled fingerprint of the connection that
// changes every day (HMAC with the secret), kept in the database for at most an hour. Nothing else.

const crypto = require("crypto");

const SUPABASE = "https://knvrvmqdxvcatsrvkrgx.supabase.co";
const KEY = "sb_publishable_5e3mg1E-r-P_to34ONwRfw_FQYUwy3z";
const SECRET = process.env.BINGO_LIVE_SECRET || "";
const CODE = /^[2-9a-hjkmnp-z]{5}$/;
const HOURS = [24, 48, 168];

async function rpc(fn, args) {
  const r = await fetch(`${SUPABASE}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(Object.assign({ p_secret: SECRET }, args)),
    signal: AbortSignal.timeout(6000)
  });
  if (!r.ok) throw new Error("db " + r.status);
  return r.json();
}

function ipKey(req) {
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || (req.socket && req.socket.remoteAddress) || "?";
  const day = new Date().toISOString().slice(0, 10);
  return crypto.createHmac("sha256", SECRET).update(ip + "|" + day).digest("base64url").slice(0, 22);
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  return new Promise((resolve) => {
    let size = 0, chunks = [];
    req.on("data", (c) => { size += c.length; if (size <= 24000) chunks.push(c); });
    req.on("end", () => {
      if (size > 24000) return resolve(null);
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "null")); } catch (e) { resolve(null); }
    });
    req.on("error", () => resolve(null));
  });
}

// The same shape app.js writes: { v:1, size, title, squares, cards:[...], ... } as base64url JSON.
function checkPayload(p) {
  if (typeof p !== "string" || p.length < 10 || p.length > 16000 || !/^[A-Za-z0-9_-]+$/.test(p)) return null;
  try {
    const d = JSON.parse(Buffer.from(p, "base64url").toString("utf8"));
    const size = d.size === undefined || d.size === 3 ? 3 : d.size === 5 ? 5 : 0;
    if (!d || d.v !== 1 || !size || typeof d.title !== "string" || !Array.isArray(d.squares) || d.squares.length !== size * size) return null;
    if (!Array.isArray(d.cards) || d.cards.length < 2 || d.cards.length > 30) return null;
    const title = d.title.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
    if (!title) return null;
    return { title, size, cards: d.cards.length };
  } catch (e) { return null; }
}

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(obj ? JSON.stringify(obj) : "");
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!SECRET) return send(res, 503, { error: "off" });
  try {
    if (req.method === "GET") {
      const code = new URL(req.url, "http://x").searchParams.get("code") || "";
      if (!CODE.test(code)) return send(res, 200, { ended: true });
      const d = await rpc("bingo_live_get", { p_code: code });
      if (!d) return send(res, 200, { ended: true });
      return send(res, 200, { payload: d.payload, expires: d.expires, taken: d.taken });
    }
    if (req.method !== "POST") { res.setHeader("Allow", "GET, POST"); return send(res, 405); }
    const body = await readBody(req);
    if (!body || typeof body !== "object") return send(res, 400, { error: "bad" });

    if (body.action === "create") {
      const info = checkPayload(body.payload), hours = Number(body.hours);
      if (!info || HOURS.indexOf(hours) < 0) return send(res, 400, { error: "bad" });
      const d = await rpc("bingo_live_create", { p_ip: ipKey(req), p_payload: body.payload, p_title: info.title, p_size: info.size, p_cards: info.cards, p_hours: hours });
      if (d && d.error === "busy") return send(res, 429, { error: "busy" });
      return send(res, 200, { code: d.code, expires: d.expires });
    }
    if (body.action === "claim") {
      const code = String(body.code || ""), card = Number(body.card);
      if (!CODE.test(code) || !Number.isInteger(card) || card < 1 || card > 30) return send(res, 400, { error: "bad" });
      const d = await rpc("bingo_live_claim", { p_ip: ipKey(req), p_code: code, p_card: card });
      if (!d) return send(res, 200, { ended: true });
      if (d.error === "busy") return send(res, 429, { error: "busy" });
      return send(res, 200, { taken: d.taken });
    }
    return send(res, 400, { error: "bad" });
  } catch (e) {
    return send(res, 502, { error: "down" });
  }
};
