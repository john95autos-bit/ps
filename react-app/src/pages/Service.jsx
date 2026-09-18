/**
 * Service landing page — backs /roofing, /gardening and /plumbing.
 *
 * One component, three routes: every string is read from
 * SERVICE_DETAILS[slug], so the three landing pages can never drift apart.
 *
 * Call surfaces on this page: <slug>_hero, <slug>_cta_panel.
 */

import { Link } from 'react-router-dom';
import { SERVICE_DETAILS } from '../config/site.js';
import { routeFor, pageTitle, metaText } from '../config/routes.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import { pad2 } from '../lib/format.js';
import Icon from '../components/Icon.jsx';
import Img from '../components/Img.jsx';
import Faq from '../components/Faq.jsx';
import CallPanel from '../components/CallPanel.jsx';
import { PhoneCta } from '../components/PhoneLink.jsx';
import NotFound from './NotFound.jsx';

export default function Service({ slug }) {
  const service = SERVICE_DETAILS[slug];
  const route = routeFor(`/${slug}`);

  /* A missing entry is a config error, not a visitor error — but a blank screen
     helps nobody, so fall through to the 404 rather than throwing. */
  if (!service || !route) return <NotFound />;

  return <ServiceBody service={service} route={route} slug={slug} />;
}

function ServiceBody({ service, route, slug }) {
  usePageMeta({
    title: pageTitle(route),
    description: metaText(route.description),
    canonical: route.path,
    ogImage: service.image,
  });

  const highlights = service.highlights ?? [];
  const signs = service.signs ?? [];
  const process = service.process ?? [];
  const faqs = service.faqs ?? [];

  return (
    <>
      <section className="hero">
        <div className="hero__media" data-parallax="">
          {/* First image on the page — never lazy-loaded. */}
          <Img src={service.image} alt={service.imageAlt} fetchPriority="high" />
        </div>
        <div className="hero__scrim" />
        <div className="wrap hero__inner">
          <p className="eyebrow eyebrow--on-navy">{service.eyebrow}</p>
          <h1 className="hero__title">{service.title}</h1>
          <p className="lede lede--on-navy">{service.summary}</p>
          <div className="hero__actions">
            <PhoneCta placement={`${slug}_hero`} className="btn btn--call btn--lg" />
            <Link className="btn btn--onnavy btn--lg" to="/service-areas">
              Check service areas
            </Link>
          </div>
          <p className="fineprint fineprint--on-navy">
            No online payment required. Scope and price are confirmed before authorised work.
          </p>
        </div>
      </section>

      <section className="section section--tight s-paper" aria-label="Service highlights">
        <div className="wrap">
          <ul className="pills" data-anim-group="">
            {highlights.map((highlight) => (
              <li className="pill" data-anim="fade" key={highlight}>
                <Icon id="i-check" className="ic ic--sm" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section s-mist">
        <div className="wrap">
          <div className="sec-head" data-anim="rise">
            <p className="eyebrow">What to look for</p>
            <h2>Small signs can point to a bigger maintenance need.</h2>
            <p className="lede">These are useful conversation starters, not a remote diagnosis.</p>
          </div>
          <div className="info-grid" data-anim-group="">
            {signs.map((sign, i) => (
              <article className="info-card" data-anim="rise" key={sign.title}>
                <span className="info-card__num">{pad2(i + 1)}</span>
                <h3>{sign.title}</h3>
                <p>{sign.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section s-white">
        <div className="wrap">
          <div className="sec-head sec-head--row" data-anim="rise">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>Simple from the first call.</h2>
            </div>
            <p className="lede">
              We keep the conversation practical so you understand the next step, the likely scope
              and any limitations before work begins.
            </p>
          </div>
          {/* The 01 / 02 / 03 markers are CSS counters on .step — never markup. */}
          <ol className="steps steps--row" data-anim-group="">
            {process.map((step) => (
              <li className="step" data-anim="rise" key={step.title}>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section s-navy">
        <div className="wrap split split--wide-right">
          <div className="sec-head" data-anim="left">
            <p className="eyebrow eyebrow--on-navy">Common questions</p>
            <h2>Useful answers before you call.</h2>
            <p className="lede">
              Availability and exact service details vary by location and property.
            </p>
          </div>
          <div data-anim="right">
            <Faq items={faqs} />
          </div>
        </div>
      </section>

      <section className="section section--tight s-paper">
        <div className="wrap wrap--narrow">
          {/* Roofing and plumbing ad traffic in particular can arrive mid-crisis,
              so this belongs on the landing page itself, not only on /contact. */}
          <div className="notecard notecard--alert" data-anim="rise">
            <Icon id="i-alert" />
            <div>
              <strong>Not an emergency service</strong>
              <p>
                For fire, gas odour, electrical danger, major flooding or structural danger, contact
                the appropriate emergency service or utility provider first. Call us once the
                immediate danger is handled.
              </p>
            </div>
          </div>

          <div className="notecard" data-anim="rise">
            <Icon id="i-info" />
            <div>
              <strong>Important service note</strong>
              <p>{service.note}</p>
            </div>
          </div>
        </div>
      </section>

      <CallPanel placement={`${slug}_cta_panel`} />
    </>
  );
}
