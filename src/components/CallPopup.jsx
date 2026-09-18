/**
 * The timed call prompt.
 *
 * A soft dialog that surfaces the phone number a few seconds into every page
 * view. Timing and copy come from CALL_POPUP in src/config/site.js, not from
 * constants in here.
 *
 * Copy is per-route: callPopupFor(pathname) picks the variant, so someone
 * reading about bed bugs gets a bed bug prompt rather than a generic one. Each
 * variant carries its own `placement`, which reaches Google Ads as the
 * conversion's link_placement — so you can see which page's prompt actually
 * earns calls, and switch off the ones that do not.
 *
 * It re-arms on every route change, because a client-side navigation is a new
 * page view to the visitor even though the document never reloaded. Without
 * that this fired once per hard load and never again, whatever the config said.
 *
 * Deliberate suppressions — an unwanted prompt costs more calls than it wins:
 *   · never while the mobile menu is open, which it would cover
 *   · never for a visitor who has already tapped a call link on this page view
 *   · optionally once per session, when config says so
 *
 * It is a real modal: focus moves into it, is trapped while open, and returns
 * to wherever it was when the prompt closes. If the consent banner is still on
 * screen when the prompt appears, the prompt borrows the screen and hands it
 * straight back on dismissal, rather than stacking two overlays.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CALL_POPUP, SITE, callPopupFor } from '../config/site.js';
import Icon from './Icon.jsx';
import { PhoneCta, callState } from './PhoneLink.jsx';
import { consentState } from './CookieConsent.jsx';

const SESSION_KEY = 'adhs-callpop-seen';

const seenThisSession = () => {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
};

const markSeen = () => {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* fine */
  }
};

const push = (event, extra = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, page_path: window.location.pathname, ...extra });
};

export default function CallPopup() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);
  const lastFocused = useRef(null);
  const borrowedConsent = useRef(false);

  const popup = callPopupFor(pathname);

  const close = useCallback((reason = 'dismissed') => {
    setOpen(false);
    document.body.classList.remove('is-locked');

    if (borrowedConsent.current) {
      borrowedConsent.current = false;
      consentState.show?.();
    }

    lastFocused.current?.focus?.({ preventScroll: true });
    push('call_prompt_closed', { close_reason: reason });
  }, []);

  /* Re-armed per route. Everything about a navigation — the timer, the
     already-called suppression, any prompt still open from the previous page —
     resets, because to the visitor this is a new page. */
  useEffect(() => {
    if (!CALL_POPUP.enabled) return undefined;

    setOpen(false);
    document.body.classList.remove('is-locked');
    borrowedConsent.current = false;
    callState.started = false;

    if (CALL_POPUP.oncePerSession && seenThisSession()) return undefined;

    const timer = setTimeout(() => {
      if (callState.started) return;

      const drawer = document.querySelector('[data-drawer]');
      if (drawer?.classList.contains('is-open')) return;

      /* If the consent banner is still on screen, tuck it away for the duration
         rather than covering it — it comes back the moment this closes, so the
         visitor still gets to make the choice. */
      if (consentState.visible) borrowedConsent.current = true;

      lastFocused.current = document.activeElement;
      setOpen(true);
      document.body.classList.add('is-locked');
      markSeen();
      push('call_prompt_shown', { prompt_variant: popup.placement });
    }, CALL_POPUP.delayMs);

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('is-locked');
    };
  }, [pathname, popup.placement]);

  /* Focus trap + Escape, live only while the dialog is open. */
  useEffect(() => {
    if (!open) return undefined;

    const card = cardRef.current;
    card.scrollTop = 0;
    card.querySelector('[data-callpop-close]')?.focus({ preventScroll: true });

    const focusables = () =>
      Array.from(
        card.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter((el) => el.offsetParent !== null);

    const onKeydown = (e) => {
      if (e.key === 'Escape') {
        close('dismissed');
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [open, close]);

  useEffect(() => () => document.body.classList.remove('is-locked'), []);

  if (!CALL_POPUP.enabled) return null;

  return (
    <div className={`callpop${open ? ' is-open' : ''}`} data-callpop="" hidden={!open}>
      <div className="callpop__scrim" data-callpop-scrim="" onClick={() => close('scrim')} />

      <div
        className="callpop__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="callpop-title"
        aria-describedby="callpop-text"
        ref={cardRef}
      >
        {/* Purely decorative affordance telling a thumb the sheet can be
            dragged/dismissed. Hidden on desktop, where the card is centred. */}
        <div className="callpop__grip" aria-hidden="true" />

        <button
          className="callpop__close"
          type="button"
          data-callpop-close=""
          aria-label="Close"
          onClick={() => close('dismissed')}
        >
          <Icon id="i-plus" />
        </button>

        <p className="callpop__eyebrow">{popup.eyebrow}</p>
        <h2 className="callpop__title" id="callpop-title">
          {popup.title}
        </h2>
        <p className="callpop__text" id="callpop-text">
          {popup.text}
        </p>

        {popup.reasons?.length ? (
          <ul className="callpop__list">
            {popup.reasons.map((reason) => (
              <li key={reason}>
                <Icon id="i-check" className="ic ic--sm" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <PhoneCta
          placement={popup.placement}
          className="btn btn--call btn--lg btn--block"
          onClick={() => close('called')}
        />

        <p className="callpop__hours">
          <Icon id="i-clock" className="ic ic--sm" />
          <span>{SITE.hours}</span>
        </p>
      </div>
    </div>
  );
}
