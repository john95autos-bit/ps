/**
 * The Google tag and call-conversion wiring.
 *
 * Consent Mode's `default` is registered in index.html, before React boots and
 * before this component injects anything, because the tag has to see the denied
 * default before any `update` is replayed.
 *
 * Config it reads (src/config/site.js):
 *   googleAdsId                 AW-123456789   loads gtag.js
 *   googleAdsConversionLabel    AbC-D_efGh12   fires the call conversion
 *   gtmId                       GTM-XXXXXXX    optional, instead of gtag.js
 *
 * THE BUG THIS AVOIDS
 * The site's only conversion action is a phone call. Every call surface pushes
 * `phone_click` into dataLayer — but gtag.js has no trigger engine and never
 * reads arbitrary dataLayer objects. Those events go into a queue nothing
 * consumes, so Google Ads records ZERO conversions no matter how many calls come
 * in. Two supported paths:
 *   · gtag.js + a conversion label -> window.__adsConversion() fires the real
 *     `conversion` event, and PhoneLink calls it on every tap.
 *   · a GTM container -> gtm.js DOES consume dataLayer, so the existing
 *     phone_click push becomes usable as a trigger with no code change.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE } from '../config/site.js';
import { hasAdsTag, hasGtm } from '../lib/launch.js';

function injectOnce(id, attrs) {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  s.async = true;
  Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

export default function GoogleAds() {
  const { pathname } = useLocation();
  const adsTag = hasAdsTag();
  const gtm = hasGtm();
  const label = String(SITE.googleAdsConversionLabel ?? '');

  useEffect(() => {
    /* Guard before a single byte is written, so an unset or malformed id leaves
       the document completely untouched. */
    if (!adsTag && !gtm) return;

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }

    if (adsTag) {
      injectOnce('gtag-js', {
        src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(SITE.googleAdsId)}`,
      });
      window.gtag('js', new Date());
      window.gtag('config', SITE.googleAdsId);

      if (label !== '') {
        const sendTo = `${SITE.googleAdsId}/${label}`;
        window.__adsConversion = () => window.gtag('event', 'conversion', { send_to: sendTo });
      }
    }

    if (gtm) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      injectOnce('gtm-js', {
        src: `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(SITE.gtmId)}`,
      });
    }
  }, [adsTag, gtm, label]);

  /* Client-side navigation does not reload the document, so the tag would count
     one page view for an entire session. Push one per route instead. */
  useEffect(() => {
    if (!adsTag && !gtm) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, adsTag, gtm]);

  return null;
}
