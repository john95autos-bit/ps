/**
 * Click-to-call surfaces — the port of phone_link(), phone_cta() and
 * phone_cta_stacked().
 *
 * Every phone link pushes a `phone_click` event to dataLayer with the page
 * path, link placement and phone number, and fires the Google Ads conversion
 * when one is configured. That is the site's only conversion, so the push
 * happens here, on the element itself, rather than in a delegated listener that
 * could be attached late.
 *
 * The handler does no preventDefault and no async work — the dial intent fires
 * exactly as it would on a bare <a href="tel:">.
 */

import { SITE } from '../config/site.js';
import Icon from './Icon.jsx';

/** Set by CallPopup so the prompt never interrupts someone already dialling. */
export const callState = { started: false };

export function trackPhoneClick(placement) {
  callState.started = true;

  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'phone_click',
    phone_number: SITE.phoneHref,
    link_placement: placement || 'unknown',
    page_path: window.location.pathname,
  });

  /* gtag.js has no trigger engine and never reads arbitrary dataLayer objects,
     so without this explicit call the conversion is never reported and Google
     Ads records zero conversions no matter how many calls come in. GoogleAds.jsx
     defines it only when a conversion label is configured. */
  if (typeof window.__adsConversion === 'function') window.__adsConversion();
}

export default function PhoneLink({ placement, className = '', children, onClick }) {
  return (
    <a
      className={className}
      href={`tel:${SITE.phoneHref}`}
      data-phone-link=""
      data-placement={placement}
      aria-label={`Call ${SITE.name} at ${SITE.phoneDisplay}`}
      onClick={(e) => {
        trackPhoneClick(placement);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}

/**
 * The standard call-to-action button: phone icon + "Call 1-844-705-9874".
 */
export function PhoneCta({ placement, className = 'btn btn--call', label, onClick }) {
  return (
    <PhoneLink placement={placement} className={className} onClick={onClick}>
      <Icon id="i-phone" />
      <span>{label ?? `Call ${SITE.phoneDisplay}`}</span>
    </PhoneLink>
  );
}

/**
 * Two-line variant for the header and sticky bar: a small action word above the
 * number, so the button reads as an instruction rather than a label.
 */
export function PhoneCtaStacked({
  placement,
  className = 'btn btn--call btn--stack',
  kicker = 'Tap to call',
}) {
  return (
    <PhoneLink placement={placement} className={className}>
      <span className="phone-badge">
        <Icon id="i-phone" className="ic ic--sm" />
      </span>
      <span className="btn__label">
        <small>{kicker}</small>
        <strong>{SITE.phoneDisplay}</strong>
      </span>
    </PhoneLink>
  );
}
