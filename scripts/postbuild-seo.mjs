import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://theglobaldoctrine.online";
const DEFAULT_IMAGE = `${SITE_URL}/tgd-cover-final.jpg`;
const PROJECT_ID = "vk54bhae";
const DATASET = "production";
const API_VERSION = "2024-01-01";

const CATEGORIES = [
  "Cover Story",
  "International",
  "Europe",
  "Asia",
  "Africa",
  "Middle East",
  "Diplomacy",
  "America",
  "Economics",
];

const slugify = (c) => c.toLowerCase().replace(/\s+/g, "-");

const cleanText = (val) =>
  String(val || "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const escapeHtml = (str) =>
  String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

async function fetchSanityData() {
  try {
    const query = encodeURIComponent(`{
      "articles": *[_type in ["article", "coverStory"] && defined(slug.current)] | order(publishedAt desc) {
        title,
        "slug": slug.current,
        excerpt,
        "category": coalesce(category, "Cover Story"),
        author,
        publishedAt,
        "imageUrl": mainImage.asset->url,
        seoTitle,
        seoDescription
      },
      "interviews": *[_type == "interview" && defined(slug.current)] | order(publishedAt desc) {
        title,
        "slug": slug.current,
        personName,
        personRole,
        publishedAt,
        excerpt,
        "photoUrl": photo.asset->url
      }
    }`);
    const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${query}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sanity HTTP ${res.status}`);
    const json = await res.json();
    return {
      articles: json?.result?.articles || [],
      interviews: json?.result?.interviews || [],
    };
  } catch (err) {
    console.warn("Warning: Could not fetch Sanity data during postbuild:", err.message);
    return { articles: [], interviews: [] };
  }
}

function buildRoutePageHtml(baseHtml, route, allRoutes) {
  const canonicalUrl = `${SITE_URL}${route.path === "/" ? "/" : route.path}`;
  const title = cleanText(route.title) || "The Global Doctrine";
  const description =
    cleanText(route.description) ||
    "Independent reporting on world conflicts, diplomacy, and global affairs through the lens of ordinary people.";
  const image = route.image || DEFAULT_IMAGE;
  const ogType = route.ogType || "website";

  let html = baseHtml;

  // Replace <title>
  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );

  // Replace OpenGraph tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${escapeHtml(ogType)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${escapeHtml(image)}" />`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`
  );

  // Inject self-referencing canonical tag right after <meta name="robots" ... />
  const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`;
  if (/<link\s+rel="canonical"/i.test(html)) {
    html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, canonicalTag);
  } else {
    html = html.replace(
      /(<meta\s+name="robots"\s+content="[^"]*"\s*\/?>)/i,
      `$1\n  ${canonicalTag}`
    );
  }

  // Inject crawlable internal links fallback inside <noscript> so Googlebot discovers internal links immediately
  const navLinksHtml = allRoutes
    .map(
      (r) =>
        `<li><a href="${escapeHtml(r.path === "/" ? "/" : r.path)}">${escapeHtml(
          cleanText(r.title)
        )}</a></li>`
    )
    .join("\n        ");

  const noscriptBlock = `
  <noscript>
    <article>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(description)}</p>
      <nav aria-label="Site Directory">
        <ul>
        ${navLinksHtml}
        </ul>
      </nav>
    </article>
  </noscript>`;

  html = html.replace('<div id="root"></div>', `<div id="root"></div>${noscriptBlock}`);

  return html;
}

async function runPostBuildSeo() {
  const distDir = path.resolve(process.cwd(), "dist");
  const baseHtmlPath = path.join(distDir, "index.html");

  if (!fs.existsSync(baseHtmlPath)) {
    throw new Error(`dist/index.html not found at ${baseHtmlPath}`);
  }

  const baseHtml = fs.readFileSync(baseHtmlPath, "utf8");
  const { articles, interviews } = await fetchSanityData();

  const routes = [
    {
      path: "/",
      title: "The Global Doctrine — Independent Geopolitical Reporting & Analysis",
      description:
        "Independent reporting on world conflicts, diplomacy, and global affairs through the lens of ordinary people.",
      ogType: "website",
    },
    {
      path: "/all-articles",
      title: "All Articles — The Global Doctrine",
      description:
        "Complete archive of geopolitical analysis, cover stories, and regional reporting from The Global Doctrine.",
      ogType: "website",
    },
    {
      path: "/interview",
      title: "The Interview — The Global Doctrine",
      description:
        "Long-form conversations with the diplomats, scholars, and practitioners shaping the world from inside the room.",
      ogType: "website",
    },
    {
      path: "/magazine",
      title: "The Magazine — The Global Doctrine",
      description:
        "A quarterly print edition and rolling digital archive of The Global Doctrine.",
      ogType: "website",
    },
    {
      path: "/social",
      title: "Social Media — The Global Doctrine",
      description:
        "Connect with The Global Doctrine across Facebook, Instagram, YouTube, WhatsApp, and LinkedIn.",
      ogType: "website",
    },
    {
      path: "/search",
      title: "Search Archive — The Global Doctrine",
      description: "Search articles, cover stories, and dispatches across The Global Doctrine.",
      ogType: "website",
    },
    {
      path: "/about/who-we-are",
      title: "Who We Are — The Global Doctrine",
      description:
        "Learn about The Global Doctrine — an independent, student-run geopolitical publication founded by International Relations scholars.",
      ogType: "website",
    },
    {
      path: "/about/policy",
      title: "Editorial Policy — The Global Doctrine",
      description:
        "Editorial independence, verification standards, and people-first geopolitical reporting principles of The Global Doctrine.",
      ogType: "website",
    },
  ];

  // Add all Topic category routes
  for (const cat of CATEGORIES) {
    routes.push({
      path: `/topics/${slugify(cat)}`,
      title: `${cat} — The Global Doctrine`,
      description: `Reporting, analysis, and long-form commentary from across the ${cat} desk at The Global Doctrine.`,
      ogType: "website",
    });
  }

  // Add all Sanity Article routes
  const seenArticles = new Set();
  for (const a of articles) {
    if (!a.slug || seenArticles.has(a.slug)) continue;
    seenArticles.add(a.slug);
    const cleanTitle = cleanText(a.seoTitle || a.title);
    const cleanDesc =
      cleanText(a.seoDescription || a.excerpt) ||
      `${cleanTitle} — Reporting and analysis by ${cleanText(a.author || "The Global Doctrine")}.`;
    routes.push({
      path: `/article/${a.slug}`,
      title: `${cleanTitle} — The Global Doctrine`,
      description: cleanDesc,
      image: a.imageUrl || DEFAULT_IMAGE,
      ogType: "article",
    });
  }

  // Add all Sanity Interview routes
  const seenInterviews = new Set();
  for (const item of interviews) {
    if (!item.slug || seenInterviews.has(item.slug)) continue;
    seenInterviews.add(item.slug);
    const cleanTitle = cleanText(item.title);
    const cleanPerson = cleanText(item.personName);
    const cleanDesc =
      cleanText(item.excerpt) ||
      `In Conversation with ${cleanPerson} (${cleanText(item.personRole)}) — The Global Doctrine.`;
    routes.push({
      path: `/interview/${item.slug}`,
      title: `${cleanPerson}: ${cleanTitle} — The Global Doctrine Interview`,
      description: cleanDesc,
      image: item.photoUrl || DEFAULT_IMAGE,
      ogType: "article",
    });
  }

  let generatedCount = 0;
  for (const route of routes) {
    const pageHtml = buildRoutePageHtml(baseHtml, route, routes);
    if (route.path === "/") {
      fs.writeFileSync(baseHtmlPath, pageHtml, "utf8");
    } else {
      const cleanRelPath = route.path.replace(/^\/+/, "");
      const routeDir = path.join(distDir, cleanRelPath);
      fs.mkdirSync(routeDir, { recursive: true });
      fs.writeFileSync(path.join(routeDir, "index.html"), pageHtml, "utf8");
    }
    generatedCount++;
  }

  // Also keep 404.html fallback and CNAME for GitHub Pages
  fs.writeFileSync(path.join(distDir, "404.html"), baseHtml, "utf8");
  fs.writeFileSync(path.join(distDir, "CNAME"), "theglobaldoctrine.online\n", "utf8");

  console.log(
    `Generated ${generatedCount} static HTTP-200 route HTML files in dist/ for GitHub Pages & Google Search Console.`
  );
}

runPostBuildSeo();
