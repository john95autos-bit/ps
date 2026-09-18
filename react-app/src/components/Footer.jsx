/**
 * Site footer.
 *
 * The footer repeats the phone number as its own large amber call link rather
 * than a button, so it reads as the closing statement of the page instead of a
 * second CTA competing with the sticky bar.
 */

import { Link } from 'react-router-dom';
import { SITE, MAIN_SERVICES } from '../config/site.js';
import { formattedAddress } from '../lib/format.js';
import Icon from './Icon.jsx';
import PhoneLink from './PhoneLink.jsx';
import { CONSENT_RESET_EVENT } from './CookieConsent.jsx';

export default function Footer() {
  const address = formattedAddress();
  const disclosure = String(SITE.platformDisclosure ?? '').trim();

  return (
    <footer className="sitefoot">
      <div className="wrap">
        <div className="sitefoot__grid">
          <div>
            <Link className="brand" to="/">
              <span className="brand__mark">
                <Icon id="i-house" />
              </span>
              <span className="brand__text">
                <strong>{SITE.brandShort}</strong>
                <small>Home services</small>
              </span>
            </Link>

            <p className="sitefoot__blurb">
              Practical help for pests, roofs, gardens and household plumbing in{' '}
              {SITE.primaryArea} and nearby areas.
            </p>

            <PhoneLink placement="footer" className="sitefoot__call">
              <Icon id="i-phone" />
              <span>{SITE.phoneDisplay}</span>
            </PhoneLink>

            <p className="sitefoot__hours">
              <Icon id="i-clock" className="ic ic--sm" />
              <span>{SITE.hours}</span>
            </p>
          </div>

          <div className="sitefoot__col">
            <h2>Services</h2>
            {MAIN_SERVICES.map((service) => (
              <Link key={service.href} to={service.href}>
                {service.title}
              </Link>
            ))}
          </div>

          <div className="sitefoot__col">
            <h2>Company</h2>
            <Link to="/about">About us</Link>
            <Link to="/service-areas">Service areas</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="sitefoot__col">
            <h2>Information</h2>
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/terms">Terms of use</Link>
            <Link to="/disclaimer">Service disclaimer</Link>
            {/* The privacy policy promises a way to change a consent decision
                after the fact; this is it. */}
            <button
              type="button"
              className="sitefoot__reset"
              onClick={() => window.dispatchEvent(new CustomEvent(CONSENT_RESET_EVENT))}
            >
              Privacy choices
            </button>
          </div>
        </div>

        {address ? (
          <p className="sitefoot__address">
            <Icon id="i-pin" className="ic ic--sm" />
            <span>
              {SITE.legalName} &middot; {address}
            </span>
          </p>
        ) : null}

        {/* Platform disclosure. Sits above the copyright line, in its own
            bordered band, at readable size rather than fine print — a visitor
            has to be able to tell that the operator is not the contractor. */}
        {disclosure ? (
          <p className="sitefoot__disclosure">
            <Icon id="i-info" className="ic ic--sm" />
            <span>{disclosure}</span>
          </p>
        ) : null}

        <div className="sitefoot__base">
          <p>
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <p className="sitefoot__legal">
            {/* Repeated in the bottom bar as well as the Information column. A
                privacy policy has to be prominently and consistently linked, and
                the bottom bar is where visitors look for it by convention. */}
            <Link to="/privacy">Privacy policy</Link>
            <span aria-hidden="true">&middot;</span>
            <Link to="/terms">Terms</Link>
            <span aria-hidden="true">&middot;</span>
            <Link to="/disclaimer">Disclaimer</Link>
          </p>
          {/* Was "Independent home-services provider", which flatly contradicted
              the platform disclosure three lines above it. */}
          <p>Independent contractor referral platform. Not affiliated with Google.</p>
        </div>
      </div>
    </footer>
  );
}
