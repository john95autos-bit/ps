/**
 * Prerender every route to static HTML after `vite build`.
 *
 * Without this, the browser gets a near-empty index.html, downloads ~236 KB of
 * JavaScript, parses it, mounts React and only then paints. On a phone over
 * mobile data that is a visible blank screen, on the one kind of page that
 * cannot afford one — a visitor who clicked a paid ad.
 *
 * This renders each route through react-dom/server at build time and writes a
 * real HTML file per URL. The browser paints the finished page immediately and
 * React hydrates it in the background. Three things fall out of that:
 *
 *  · first paint no longer waits on the bundle
 *  · navigation still happens client-side, so it stays instant after the first
 *    load — this adds static HTML, it does not turn the app into a static site
 *  · crawlers and social scrapers that do not run JavaScript now see the real
 *    title, description, canonical and Open Graph tags, which was the main
 *    thing the PHP build had and the React port lost
 *
 * The per-route <head> is composed here rather than read from usePageMeta,
 * because that hook runs in an effect and effects do not run during SSR. Both
 * read the same route table, so they cannot disagree about a title.
 */

import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import App from '../src/App.jsx';
import { ROUTES, pageTitle, metaText, absUrl } from '../src/config/routes.js';
import { SITE, IMAGES } from '../src/config/site.js';
import { siteIsConfigured } from '../src/lib/launch.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const escape = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const shell = readFileSync(join(dist, 'index.html'), 'utf8');
const configured = siteIsConfigured();

/** The <head> block for one route, replacing the defaults in index.html. */
function headFor(route) {
  const title = pageTitle(route);
  const description = metaText(route.description ?? '');
  const canonical = absUrl(route.path);
  const ogImage = '/images/pest-control-hero.webp';
  const size = IMAGES[ogImage] ?? { width: 1672, height: 941 };
  const robots = configured ? 'index, follow' : 'noindex, nofollow';

  const tags = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}">`,
    `<meta name="robots" content="${robots}">`,
    `<meta name="application-name" content="${escape(SITE.name)}">`,
    `<link rel="canonical" href="${escape(canonical)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta property="og:site_name" content="${escape(SITE.name)}">`,
    `<meta property="og:title" content="${escape(title)}">`,
    `<meta property="og:description" content="${escape(description)}">`,
    `<meta property="og:url" content="${escape(canonical)}">`,
    `<meta property="og:image" content="${escape(absUrl(ogImage))}">`,
    `<meta property="og:image:width" content="${size.width}">`,
    `<meta property="og:image:height" content="${size.height}">`,
    `<meta property="og:image:alt" content="${escape(`${SITE.brandShort} home-service support`)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
  ];

  /* Structured data, only once the launch gate passes — publishing a
     LocalBusiness record carrying placeholder details would feed them straight
     into Google's knowledge systems. */
  if (configured) {
    const address = Object.fromEntries(
      Object.entries({
        '@type': 'PostalAddress',
        streetAddress: SITE.address?.street ?? '',
        addressLocality: SITE.address?.locality ?? '',
        addressRegion: SITE.address?.region ?? '',
        postalCode: SITE.address?.postcode ?? '',
        addressCountry: SITE.address?.country ?? '',
      }).filter(([, v]) => v !== '')
    );

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'HomeAndConstructionBusiness',
      name: SITE.name,
      legalName: SITE.legalName,
      url: absUrl('/'),
      image: absUrl(ogImage),
      telephone: SITE.phoneHref,
      address,
      email: SITE.email,
      areaServed: { '@type': 'Country', name: 'United States' },
      openingHours: SITE.hours,
      description,
    };

    tags.push(
      `<script type="application/ld+json" id="ld-localbusiness">${JSON.stringify(ld).replace(
        /</g,
        '\\u003c'
      )}</script>`
    );
  }

  return tags.join('\n');
}

const tick = () => new Promise((r) => setTimeout(r, 0));

/**
 * React.lazy suspends on its first render and the router's Suspense boundary
 * emits the fallback instead. Rendering again once the chunk's promise has
 * settled gives the real page.
 */
async function renderRoute(path) {
  let html = '';
  for (let attempt = 0; attempt < 6; attempt += 1) {
    html = renderToString(
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    );
    if (!html.includes('data-suspense')) return html;
    await tick();
  }
  throw new Error(`route ${path} never resolved past its Suspense fallback`);
}

async function main() {
  let written = 0;

  for (const route of ROUTES) {
    const body = await renderRoute(route.path);

    let page = shell
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
      /* Swap the placeholder head. Everything between <title> and the twitter
         card in index.html is per-route and gets replaced wholesale. */
      .replace(
        /<title>[\s\S]*?<meta name="robots"[^>]*>/,
        headFor(route)
      );

    /* index.html for "/", <route>/index.html for everything else, so Vercel's
       filesystem match serves them before the SPA rewrite is considered. */
    const outPath =
      route.path === '/'
        ? join(dist, 'index.html')
        : join(dist, route.path.replace(/^\//, ''), 'index.html');

    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, page, 'utf8');
    written += 1;
  }

  /* 404.html for anything unmatched, so a bad URL still paints instantly
     instead of flashing an empty document first. */
  const notFound = await renderRoute('/__not-found__');
  writeFileSync(
    join(dist, '404.html'),
    shell
      .replace('<div id="root"></div>', `<div id="root">${notFound}</div>`)
      .replace(
        /<meta name="robots"[^>]*>/,
        '<meta name="robots" content="noindex, nofollow">'
      ),
    'utf8'
  );

  console.log(`[prerender] wrote ${written} routes + 404.html`);
}

main().catch((error) => {
  console.error('[prerender] failed:', error.message);
  process.exit(1);
});
