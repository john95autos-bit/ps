/**
 * One page per pest type, backing /pest-control/<slug>.
 *
 * The page head is written out here rather than delegated to PageHero so the
 * call button can sit inside .pagehead__inner, above the fold at 375×667.
 *
 * Section order follows what a worried homeowner actually asks, in order: is it
 * this (identify) → what have I got (clues) → why here (conditions) → what
 * happens next (approach) → what should I do first (prepare) → and afterwards
 * (aftercare) → everything else (FAQ).
 *
 * Call surfaces: <slug>_hero, <slug>_mid, <slug>_cta_panel.
 */

import { Link, useParams } from 'react-router-dom';
import { PEST_PAGES } from '../config/pests.js';
import { routeFor, pageTitle, metaText } from '../config/routes.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import { pad2 } from '../lib/format.js';
import Icon from '../components/Icon.jsx';
import Img from '../components/Img.jsx';
import Faq from '../components/Faq.jsx';
import CallPanel from '../components/CallPanel.jsx';
import { PhoneCta } from '../components/PhoneLink.jsx';
import NotFound from './NotFound.jsx';

export default function PestDetail() {
  const { slug = '' } = useParams();
  const pest = PEST_PAGES[slug];
  const route = routeFor(`/pest-control/${slug}`);

  if (!pest || !route) return <NotFound />;

  return <PestBody pest={pest} route={route} slug={slug} />;
}

function PestBody({ pest, route, slug }) {
  usePageMeta({
    title: pageTitle(route),
    description: metaText(route.description),
    canonical: route.path,
  });

  const pestLower = String(pest.pest).toLowerCase();
  const clues = pest.clues ?? [];
  const identify = pest.identify ?? [];
  const conditions = pest.conditions ?? [];
  const approach = pest.approach ?? [];
  const prepare = pest.prepare ?? [];
  const aftercare = pest.aftercare ?? [];
  const faqs = pest.faqs ?? [];

  return (
    <>
      <section className="pagehead">
        <div className="pagehead__media">
          <Img
            src="/images/pest-control-hero.webp"
            alt="Pest-control technician inspecting a residential kitchen"
            fetchPriority="high"
          />
        </div>
        <div className="pagehead__scrim" />
        <div className="wrap">
          <div className="pagehead__inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="sep">
                <Icon id="i-chevron-right" className="ic ic--sm" />
              </span>
              <Link to="/pest-control">Pest control</Link>
              <span className="sep">
                <Icon id="i-chevron-right" className="ic ic--sm" />
              </span>
              <span aria-current="page">{pest.pest}</span>
            </nav>
            <p className="eyebrow eyebrow--on-navy">Residential pest information</p>
            <h1>{pest.title}</h1>
            <p className="lede lede--on-navy">{pest.intro}</p>
            <PhoneCta placement={`${slug}_hero`} className="btn btn--call btn--lg" />
          </div>
        </div>
      </section>

      <section className="section s-paper">
        <div className="wrap">
          <div className="sec-head" data-anim="rise">
            <p className="eyebrow">Possible signs</p>
            <h2>What people commonly notice.</h2>
            <p className="lede">
              One sign alone may not confirm {pestLower}. Avoid disturbing the area before asking
              what will help an inspection — intact evidence is worth more than a tidy room.
            </p>
          </div>
          <div className="signals signals--two" data-anim-group="">
            {clues.map((clue) => (
              <div className="signal" data-anim="rise" key={clue}>
                <Icon id="i-search" />
                <strong>{clue}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {identify.length ? (
        <section className="section s-white">
          <div className="wrap">
            <div className="sec-head" data-anim="rise">
              <p className="eyebrow">Telling it apart</p>
              <h2>How to check what you are actually looking at.</h2>
              <p className="lede">
                Plenty of things get mistaken for {pestLower}, and the difference changes the
                response. None of this replaces an inspection — it just makes your first call a more
                useful one.
              </p>
            </div>
            <div className="info-grid" data-anim-group="">
              {identify.map((item, i) => (
                <article className="info-card" data-anim="rise" key={item.title}>
                  <span className="info-card__num">{pad2(i + 1)}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {conditions.length ? (
        <section className="section s-mist">
          <div className="wrap">
            <div className="split split--wide-left">
              <div className="stack" data-anim="left">
                <p className="eyebrow">Why here, why now</p>
                <h2>What tends to support the activity.</h2>
                <p className="lede">
                  Treatment addresses the population. These are what decide whether it comes back,
                  and most of them stay with the property after the contractor has gone.
                </p>
                <PhoneCta placement={`${slug}_mid`} className="btn btn--call" />
              </div>
              <div data-anim="right">
                <ul className="checklist">
                  {conditions.map((item) => (
                    <li key={item}>
                      <Icon id="i-info" className="ic ic--sm" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section s-white">
        <div className="wrap">
          <div className="sec-head" data-anim="rise">
            <p className="eyebrow">A practical approach</p>
            <h2>Inspection, treatment planning and clear aftercare.</h2>
          </div>
          <div className="stack-lg">
            {/* The 01–04 badge on each step is a CSS counter. */}
            <div className="steps" data-anim-group="">
              {approach.map((step) => (
                <div className="step" data-anim="rise" key={step}>
                  <h3>{step}</h3>
                </div>
              ))}
            </div>
            <div className="notecard notecard--warn" data-anim="rise">
              <Icon id="i-alert" className="ic ic--lg" />
              <div>
                <strong>Safety comes first.</strong>
                <p>
                  Tell the attending technician about children, pets, pregnancy, allergies,
                  respiratory conditions and sensitive areas. Any pesticide use must follow the
                  product label and applicable local rules, and those decisions belong to the
                  licensed applicator who attends — not to this website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {prepare.length ? (
        <section className="section s-paper">
          <div className="wrap wrap--narrow">
            <div className="sec-head" data-anim="rise">
              <p className="eyebrow">Before the visit</p>
              <h2>The preparation is doing more work than you think.</h2>
              <p className="lede">
                Incomplete preparation is the most common reason a treatment underperforms. This
                part is entirely within your control and it costs nothing.
              </p>
            </div>
            <ul className="checklist" data-anim-group="">
              {prepare.map((item) => (
                <li data-anim="rise" key={item}>
                  <Icon id="i-clipboard" className="ic ic--sm" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {aftercare.length ? (
        <section className="section s-white">
          <div className="wrap">
            <div className="sec-head sec-head--center" data-anim="rise">
              <p className="eyebrow">Afterwards</p>
              <h2>What normally happens next.</h2>
            </div>
            <div className="info-grid info-grid--four" data-anim-group="">
              {aftercare.map((item) => (
                <article className="info-card" data-anim="rise" key={item.title}>
                  <span className="info-card__num">
                    <Icon id="i-check" className="ic ic--sm" />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section s-navy">
        <div className="wrap">
          <div className="split split--wide-right">
            <div className="stack" data-anim="left">
              <p className="eyebrow eyebrow--on-navy">{pest.pest} FAQs</p>
              <h2>Answers without overpromising.</h2>
              <p className="lede lede--on-navy">
                The right plan depends on evidence found at the property. Nothing here promises a
                result, because nobody can promise one before looking.
              </p>
            </div>
            <div data-anim="right">
              <Faq items={faqs} />
            </div>
          </div>
        </div>
      </section>

      <CallPanel
        title={`Concerned about ${pestLower}? Start with a clear description.`}
        placement={`${slug}_cta_panel`}
      />
    </>
  );
}
