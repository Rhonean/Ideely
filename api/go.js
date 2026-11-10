// Ideely — koopknop. Telt de klik en stuurt door naar een boekwinkel, met partnercode als die is ingesteld.
// Partnercodes staan alleen op de server (Vercel-omgevingsvariabelen), zodat ze zonder app-update kunnen wijzigen:
//   BOL_SITE_ID   = je site-ID uit het bol.com-partnerprogramma (Nederlands)
//   AMAZON_TAG_DE = je Amazon.de-partnertag (Duits)
//   AMAZON_TAG_EN = je Amazon.co.uk-partnertag (Engels)
// Zonder code werkt de knop ook, alleen zonder vergoeding.
import { storePut } from "./_lib/common.js";
import { LIST, HANDWRITTEN } from "./_lib/books.js";

const enc = encodeURIComponent;

function target(lang, q) {
  if (lang === "de") {
    const tag = process.env.AMAZON_TAG_DE;
    return { store: "amazon.de", url: `https://www.amazon.de/s?k=${enc(q)}&i=stripbooks${tag ? `&tag=${enc(tag)}` : ""}` };
  }
  if (lang === "en") {
    const tag = process.env.AMAZON_TAG_EN;
    return { store: "amazon.co.uk", url: `https://www.amazon.co.uk/s?k=${enc(q)}&i=stripbooks${tag ? `&tag=${enc(tag)}` : ""}` };
  }
  const search = `https://www.bol.com/nl/nl/s/?searchtext=${enc(q)}`;
  const site = process.env.BOL_SITE_ID;
  return {
    store: "bol.com",
    url: site ? `https://partner.bol.com/click/click?p=2&t=url&s=${enc(site)}&f=TXL&url=${enc(search)}&name=${enc("Ideely")}` : search,
  };
}

export default async function handler(req, res) {
  const id = String(req.query?.id || "").slice(0, 120);
  const lang = ["nl", "en", "de"].includes(req.query?.lang) ? req.query.lang : "nl";
  // Zoekterm: bekende titel + auteur uit de bibliotheek; voor eigen boeken wat de app meestuurt.
  const known = LIST[id] || HANDWRITTEN[id];
  const t = String(req.query?.t || "").slice(0, 150).trim();
  const q = (t || (known ? `${known.title} ${known.author}` : "")).replace(/\s+/g, " ").trim();
  if (!q) return res.status(400).json({ error: "invalid_request" });

  const { store, url } = target(lang, q);
  // Tellen mag de doorverwijzing nooit ophouden of laten mislukken.
  await Promise.race([storePut("clicks", { book_id: id || "eigen", lang, store }), new Promise(r => setTimeout(r, 800))]).catch(() => {});
  res.setHeader("cache-control", "no-store");
  res.setHeader("referrer-policy", "no-referrer");
  res.writeHead(302, { location: url });
  res.end();
}
