/**
 * Writes public/robots.txt and public/sitemap.xml before `vite build`.
 *
 * The PHP build served both from views/robots.php and views/sitemap.php, which
 * could read config at request time. A static deploy has no request, so they
 * are generated here from the same route table the app renders — meaning a new
 * route can never be added to the site and forgotten in the sitemap.
 *
 * Both files are gitignored: they are build output, not source.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

/* Vite loads .env for the client bundle, but this script runs before Vite, so
   it reads the same files itself. Vercel injects project env vars into
   process.env directly, and those win. */
for (const file of ['.env', '.env.local', '.env.production']) {
  const path = resolve(root, file);
  if (!existsSync(path)) continue;

  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, raw] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = raw.replace(/^["']|["']$/g, '');
  }
}

const { SITE } = await import('../src/config/site.js');
const { ROUTES, absUrl } = await import('../src/config/routes.js');

const isPlaceholder = SITE.siteUrl.includes('yourdomain.com');

/* ---------------------------------------------------------------------------
 * robots.txt
 *
 * AdsBot is deliberately not blocked — a Disallow it obeyed would stop Google
 * Ads from checking the landing pages, and a disapproved ad is worse than an
 * unindexed page.
 *
 * While the launch gate has not passed the app sends `noindex, nofollow` on
 * every page anyway; a placeholder domain additionally gets a blanket Disallow
 * here so a preview deployment cannot be crawled under the wrong hostname.
 * ------------------------------------------------------------------------- */
const robots = isPlaceholder
  ? ['User-agent: *', 'Disallow: /', '', '# VITE_SITE_URL is still the placeholder domain.', ''].join('\n')
  : ['User-agent: *', 'Allow: /', '', `Sitemap: ${absUrl('/sitemap.xml')}`, ''].join('\n');

writeFileSync(resolve(root, 'public/robots.txt'), robots, 'utf8');

/* ---------------------------------------------------------------------------
 * sitemap.xml
 *
 * <lastmod> is the build date. The PHP build used the mtime of the config files
 * for the same reason: reporting today's date on every request tells a crawler
 * the whole site changed daily and is worth exactly nothing.
 * ------------------------------------------------------------------------- */
const lastmod = new Date().toISOString().slice(0, 10);

const urls = ROUTES.map((route) => {
  const priority = Number(route.priority ?? 0.7).toFixed(1);
  const changefreq = route.changefreq ?? 'monthly';

  return [
    '  <url>',
    `    <loc>${absUrl(route.path)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}).join('\n');

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urls,
  '</urlset>',
  '',
].join('\n');

writeFileSync(resolve(root, 'public/sitemap.xml'), sitemap, 'utf8');

console.log(
  `[seo] wrote robots.txt and sitemap.xml (${ROUTES.length} URLs) for ${SITE.siteUrl}` +
    (isPlaceholder ? ' — PLACEHOLDER DOMAIN, crawling disallowed' : '')
);
