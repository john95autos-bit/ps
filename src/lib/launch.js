/**
 * The launch gate — the port of launch_blockers() / site_is_configured().
 *
 * The switch used to validate nothing but itself: flipping `configured` to true
 * removed the pre-launch banner and made the site indexable even with a
 * placeholder phone number, an unparseable Ads id, or placeholder governing-law
 * paragraphs still in the legal pages. Those are exactly the mistakes that get
 * an Ads account suspended, so the switch has to earn it.
 */

import { SITE } from '../config/site.js';
import { legalDocuments } from '../config/legal.js';

/** True when a syntactically valid Google Ads tag id is configured. */
export const hasAdsTag = () => /^AW-\d+$/.test(SITE.googleAdsId);

/** True when a syntactically valid GTM container id is configured. */
export const hasGtm = () => /^GTM-[A-Z0-9]+$/.test(SITE.gtmId);

/**
 * True when *some* measurement tag really will load on every page.
 *
 * The consent banner and privacy policy both branch on this. In the PHP build
 * they asserted flatly that a Google tag loads on every page while no tag id
 * was set, so the site asked for consent to something it was not doing.
 */
export const hasMeasurementTag = () => hasAdsTag() || hasGtm();

/**
 * Everything still standing between this site and a real ad campaign.
 *
 * @returns {string[]} Human-readable blockers; empty means ready.
 */
export function launchBlockers() {
  const problems = [];

  const phoneDisplay = String(SITE.phoneDisplay ?? '');
  const phoneHref = String(SITE.phoneHref ?? '');
  const digitsOf = (s) => s.replace(/\D/g, '');

  if (phoneDisplay.includes('000-0000') || phoneDisplay.trim() === '') {
    problems.push('the phone number is still the placeholder');
  }
  if (!/^\+[1-9]\d{6,14}$/.test(phoneHref)) {
    problems.push('phoneHref is not a dialable E.164 number (for example +15551234567)');
  } else if (
    digitsOf(phoneDisplay) !== '' &&
    !digitsOf(phoneHref).endsWith(digitsOf(phoneDisplay).slice(-7))
  ) {
    problems.push('phoneHref and phoneDisplay do not appear to be the same number');
  }

  const area = String(SITE.primaryArea ?? '').trim();
  if (area === '' || area.includes('Your City')) {
    problems.push('the service coverage is not set');
  }
  if (String(SITE.siteUrl).includes('yourdomain.com')) {
    problems.push('VITE_SITE_URL is still the placeholder domain');
  }
  if (String(SITE.email).includes('yourdomain.com')) {
    problems.push('the business email is still the placeholder');
  }

  /* Conversion tracking. The PHP gate only validated the Ads id when one was
     already set, so you could go live with no tag at all and no warning — on a
     site whose only conversion is a phone call. An empty id is now a blocker in
     its own right. */
  const adsId = String(SITE.googleAdsId ?? '');
  const gtmId = String(SITE.gtmId ?? '');

  if (adsId === '' && gtmId === '') {
    problems.push(
      'no VITE_GOOGLE_ADS_ID or VITE_GTM_ID is set, so phone calls cannot be reported to Google Ads at all'
    );
  } else {
    if (adsId !== '' && !hasAdsTag()) {
      problems.push('VITE_GOOGLE_ADS_ID is malformed, so no tag is being emitted at all');
    }
    if (gtmId !== '' && !hasGtm()) {
      problems.push('VITE_GTM_ID is malformed, so no container is being emitted at all');
    }
    if (hasAdsTag() && String(SITE.googleAdsConversionLabel ?? '') === '' && !hasGtm()) {
      problems.push(
        'no conversion label or GTM container is set, so phone calls cannot be reported to Google Ads'
      );
    }
  }

  /* Placeholder legal prose is visitor-facing and was not covered by the gate,
     so it could ship the moment the switch was flipped. */
  const blob = JSON.stringify(legalDocuments(hasMeasurementTag()));
  const markers = ['replace this paragraph', 'before launch', 'should replace placeholder'];
  if (markers.some((m) => blob.toLowerCase().includes(m))) {
    problems.push('the legal pages still contain placeholder text that must be replaced');
  }

  return problems;
}

/**
 * True only when the operator has said the site is ready AND nothing in
 * launchBlockers() contradicts them.
 */
export function siteIsConfigured() {
  return SITE.configured === true && launchBlockers().length === 0;
}
