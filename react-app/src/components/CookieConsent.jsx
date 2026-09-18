/**
 * The consent banner.
 *
 * A stored choice is replayed on every load, before the banner decision —
 * otherwise a returning visitor who accepted would stay on the denied default
 * registered in index.html and their conversions would go unmeasured.
 *
 * The banner is hidden, never unmounted: a visitor must be able to change their
 * mind, and the privacy policy promises a footer control that brings this back.
 *
 * The stylesheet parks it directly on top of the sticky call bar
 * (`bottom: calc(var(--callbar-h) + …)`), so it never covers the phone button.
 */

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hasMeasurementTag } from '../lib/launch.js';

const CONSENT_KEY = 'adhs-consent';
export const CONSENT_RESET_EVENT = 'adhs:consent-reset';

/** Published so CallPopup can tuck the banner away and hand the screen back. */
export const consentState = { visible: false, show: null };

function read() {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function updateConsent(value) {
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      ad_storage: value,
      analytics_storage: value,
      ad_user_data: value,
      ad_personalization: value,
    });
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const tagLoads = hasMeasurementTag();

  const show = useCallback(() => setVisible(true), []);

  useEffect(() => {
    consentState.show = show;
    return () => {
      consentState.show = null;
    };
  }, [show]);

  useEffect(() => {
    consentState.visible = visible;
  }, [visible]);

  useEffect(() => {
    const stored = read();
    if (stored) {
      updateConsent(stored === 'accepted' ? 'granted' : 'denied');
      return;
    }
    /* No tag is configured, so there is nothing to consent to and no banner
       worth showing. The PHP build showed it unconditionally and told every
       visitor a Google tag was loading when none was. */
    if (tagLoads) setVisible(true);
  }, [tagLoads]);

  useEffect(() => {
    const onReset = () => {
      try {
        window.localStorage.removeItem(CONSENT_KEY);
      } catch {
        /* private mode — the banner still works, the choice just is not kept */
      }
      updateConsent('denied');
      setVisible(true);
    };
    window.addEventListener(CONSENT_RESET_EVENT, onReset);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, onReset);
  }, []);

  const choose = (choice) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      /* session-only */
    }
    updateConsent(choice === 'accepted' ? 'granted' : 'denied');
    setVisible(false);
  };

  return (
    <aside className="consent" aria-label="Privacy choices" data-consent="" hidden={!visible}>
      <strong>Your privacy choices</strong>
      <p>
        A Google advertising tag loads on every page. Until you choose, it is set to denied and uses
        no identifiers or cookies.{' '}
        <span className="consent__detail">
          Accepting lets it measure whether an ad led to a phone call.
        </span>{' '}
        <Link to="/privacy">Privacy policy</Link>.
      </p>
      <div className="consent__actions">
        {/* Both buttons carry the same weight and the same size. A reject option
            that is visually subordinate to accept is a dark pattern and is
            treated as invalid consent under the GDPR. */}
        <button className="btn btn--outline" type="button" onClick={() => choose('essential')}>
          Essential only
        </button>
        <button className="btn btn--dark" type="button" onClick={() => choose('accepted')}>
          Accept optional
        </button>
      </div>
    </aside>
  );
}
