import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://theglobaldoctrine.online";
const PROJECT_ID = "vk54bhae";
const DATASET = "production";
const API_VERSION = "2024-01-01";

const STATIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/all-articles", changefreq: "daily", priority: "0.9" },
  { path: "/interview", changefreq: "weekly", priority: "0.8" },
  { path: "/magazine", changefreq: "monthly", priority: "0.8" },
  { path: "/social", changefreq: "monthly", priority: "0.6" },
  { path: "/topics/cover-story", changefreq: "weekly", priority: "0.8" },
  { path: "/topics/international", changefreq: "weekly", priority: "0.7" },
  { path: "/topics/europe", changefreq: "weekly", priority: "0.7" },
  { path: "/topics/asia", changefreq: "weekly", priority: "0.7" },
  { path: "/topics/africa", changefreq: "weekly", priority: "0.7" },
  { path: "/topics/middle-east", changefreq: "weekly", priority: "0.7" },
  { path: "/topics/diplomacy", changefreq: "weekly", priority: "0.7" },
  { path: "/topics/america", changefreq: "weekly", priority: "0.7" },
  { path: "/topics/economics", changefreq: "weekly", priority: "0.7" },
  { path: "/about/who-we-are", changefreq: "monthly", priority: "0.5" },
  { path: "/about/policy", changefreq: "monthly", priority: "0.5" },
];

const escapeXml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

async function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];
  let articles = [];
  let interviews = [];

  try {
    const query = encodeURIComponent(`{
      "articles": *[_type in ["article", "coverStory"] && defined(slug.current)] | order(publishedAt desc) {
        "slug": slug.current,
        "lastmod": coalesce(publishedAt, _updatedAt)
      },
      "interviews": *[_type == "interview" && defined(slug.current)] | order(publishedAt desc) {
        "slug": slug.current,
        "lastmod": coalesce(publishedAt, _updatedAt)
      }
    }`);
    const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${query}`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      articles = json?.result?.articles || [];
      interviews = json?.result?.interviews || [];
      console.log(`Fetched ${articles.length} articles and ${interviews.length} interviews for sitemap.xml`);
    }
  } catch (err) {
    console.warn("Could not fetch dynamic Sanity routes for sitemap, using static routes:", err.message);
  }

  const urls = [];

  for (const r of STATIC_ROUTES) {
    urls.push(`  <url>
    <loc>${escapeXml(`${SITE_URL}${r.path}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`);
  }

  const seenArticleSlugs = new Set();
  for (const a of articles) {
    if (!a.slug || seenArticleSlugs.has(a.slug)) continue;
    seenArticleSlugs.add(a.slug);
    const lastmod = a.lastmod ? new Date(a.lastmod).toISOString().split("T")[0] : today;
    urls.push(`  <url>
    <loc>${escapeXml(`${SITE_URL}/article/${a.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  const seenInterviewSlugs = new Set();
  for (const item of interviews) {
    if (!item.slug || seenInterviewSlugs.has(item.slug)) continue;
    seenInterviewSlugs.add(item.slug);
    const lastmod = item.lastmod ? new Date(item.lastmod).toISOString().split("T")[0] : today;
    urls.push(`  <url>
    <loc>${escapeXml(`${SITE_URL}/interview/${item.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  const outPath = path.resolve(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(outPath, xml, "utf8");
  console.log(`Wrote ${urls.length} URLs to ${outPath}`);
}

generateSitemap();
