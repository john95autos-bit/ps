/**
 * Small formatting helpers shared by the templates — the port of the display
 * helpers in inc/helpers.php.
 */

import { SITE } from '../config/site.js';

/**
 * The business address as a single line, or '' when not configured.
 *
 * Google Ads expects an advertised business to be identifiable and reachable,
 * and the privacy policy has to name the operating entity and its address, so
 * this needs one canonical formatting rather than being retyped per template.
 */
export function formattedAddress(separator = ', ') {
  const a = SITE.address;
  if (!a || typeof a !== 'object') return '';

  return [a.street, a.locality, `${a.region ?? ''} ${a.postcode ?? ''}`.trim(), a.country]
    .map((v) => String(v ?? '').trim())
    .filter((v) => v !== '')
    .join(separator);
}

/**
 * The date shown on the legal pages.
 *
 * The PHP version compared SITE.legalUpdated against the mtime of
 * config/legal.php and preferred the file, so a revision could never ship under
 * a stale hand-typed date. A bundled app has no meaningful file mtime at
 * runtime, so the configured date is authoritative here — which means it is now
 * on you to bump SITE.legalUpdated whenever src/config/legal.js changes.
 */
export function legalUpdatedDate() {
  const explicit = String(SITE.legalUpdated ?? '').trim();
  if (explicit !== '') return explicit;

  return new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Inline style object for the staggered reveal delay used across the grids. */
export function revealDelay(index, step = 70) {
  return { '--delay': `${index * step}ms` };
}

/** Two-digit ordinal used by the tile and info-card numbers: 1 -> "01". */
export const pad2 = (n) => String(n).padStart(2, '0');
