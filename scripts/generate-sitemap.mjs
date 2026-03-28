import { writeFileSync } from "fs";

const SITE_URL = "https://107studio.es";
const locales = ["es", "en"];
const today = new Date().toISOString().split("T")[0];

const pages = [
  { path: "", changefreq: "weekly", priority: "1.0", label: "Home" },
  { path: "/about-us", changefreq: "monthly", priority: "0.8", label: "About Us" },
  { path: "/services", changefreq: "monthly", priority: "0.9", label: "Services" },
  { path: "/works-simple", changefreq: "weekly", priority: "0.8", label: "Portfolio" },
  { path: "/contact", changefreq: "monthly", priority: "0.7", label: "Contact" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3", label: "Privacy Policy" },
  { path: "/terms", changefreq: "yearly", priority: "0.3", label: "Terms" },
];

function buildUrl(locale, path) {
  const loc = `${SITE_URL}/${locale}${path}`;
  const alternates = locales
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}${path}" />`)
    .join("\n");

  return `  <url>
    <loc>${loc}</loc>
${alternates}
    <lastmod>${today}</lastmod>
    <changefreq>${pages.find((p) => p.path === path).changefreq}</changefreq>
    <priority>${pages.find((p) => p.path === path).priority}</priority>
  </url>`;
}

const urls = pages.flatMap((page) =>
  locales.map((locale) => buildUrl(locale, page.path))
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", sitemap);
console.log(`✓ Sitemap generated with ${urls.length} URLs (${today})`);
