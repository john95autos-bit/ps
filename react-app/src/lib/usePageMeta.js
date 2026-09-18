/**
 * Per-page document metadata — the <head> half of inc/layout.php.
 *
 * A client-rendered app has no server to compose <head>, so the tags are
 * written into the live document on navigation instead. Everything is set by
 * find-or-create against a stable selector, so navigating between routes
 * updates the existing tag rather than appending a second one.
 *
 * Worth knowing: a crawler that does not execute JavaScript sees only the tags
 * baked into index.html. Googlebot does render, but social scrapers (Facebook,
 * LinkedIn, Slack) largely do not, so shared links fall back to the defaults in
 * index.html. If organic search or link previews matter, prerender the routes
 * at build time — see the README.
 */

import { useEffect } from 'react';
import { SITE, IMAGES } from '../config/site.js';
import { absUrl } from '../config/routes.js';
import { siteIsConfigured } from './launch.js';
import { formattedAddress } from './format.js';

const JSONLD_ID = 'ld-localbusiness';

/** Find a <meta>/<link> by selector, or create and append it to <head>. */
function upsert(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function setMeta(attr, key, content) {
  const el = upsert(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute(attr, key);
    return m;
  });
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  const el = upsert(`link[rel="${rel}"]`, () => {
    const l = document.createElement('link');
    l.setAttribute('rel', rel);
    return l;
  });
  el.setAttribute('href', href);
}

/**
 * @param {object}  opts
 * @param {string}  opts.title        full <title>, already composed
 * @param {string}  opts.description  meta description
 * @param {string}  opts.canonical    route path, e.g. '/roofing'
 * @param {string} [opts.ogImage]     image path registered in IMAGES
 * @param {boolean}[opts.noindex]     force noindex regardless of launch state
 */
export function usePageMeta({
  title,
  description = '',
  canonical = '/',
  ogImage = '/images/pest-control-hero.webp',
  noindex = false,
}) {
  useEffect(() => {
    const configured = siteIsConfigured();
    const canonicalUrl = absUrl(canonical);
    const size = IMAGES[ogImage] ?? { width: 1672, height: 941 };

    document.title = title;

    setMeta('name', 'description', description);
    /* The PHP build always emitted `index, follow`, even with a placeholder
       phone number in every heading. Until the launch gate passes, the site
       refuses to be indexed. */
    setMeta('name', 'robots', !configured || noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('name', 'application-name', SITE.name);

    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:locale', 'en_US');
    setMeta('property', 'og:site_name', SITE.name);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', absUrl(ogImage));
    setMeta('property', 'og:image:width', String(size.width));
    setMeta('property', 'og:image:height', String(size.height));
    setMeta('property', 'og:image:alt', `${SITE.brandShort} home-service support`);
    setMeta('name', 'twitter:card', 'summary_large_image');

    setLink('canonical', canonicalUrl);

    /* Structured data. Emitted only once the launch validation passes —
       publishing a LocalBusiness record carrying placeholder details would feed
       them straight into Google's knowledge systems. */
    const existing = document.getElementById(JSONLD_ID);
    if (existing) existing.remove();

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

      const script = document.createElement('script');
      script.id = JSONLD_ID;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'HomeAndConstructionBusiness',
        name: SITE.name,
        legalName: SITE.legalName,
        url: absUrl('/'),
        image: absUrl('/images/pest-control-hero.webp'),
        telephone: SITE.phoneHref,
        address,
        email: SITE.email,
        /* Nationwide platform: the served area is a country, not a list of
           towns. Emitting six regions as Place entities would misrepresent the
           model. */
        areaServed: { '@type': 'Country', name: 'United States' },
        openingHours: SITE.hours,
        description,
      });
      document.head.appendChild(script);
    }
  }, [title, description, canonical, ogImage, noindex]);
}

/** The postal address, exposed here so the footer and contact card agree. */
export { formattedAddress };
