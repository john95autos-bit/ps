/**
 * One page per pest type, backing /pest-control/<slug>.
 *
 * The page head is written out here rather than delegated to PageHero so the
 * call button can sit inside .pagehead__inner, above the fold at 375×667.
 */

import { Link, useParams } from 'react-router-dom';
import { PEST_PAGES } from '../config/site.js';
import { routeFor, pageTitle, metaText } from '../config/routes.js';
import { usePageMeta } from '../lib/usePageMeta.js';
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
  const approach = pest.approach ?? [];
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
              what will help an inspection.
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
                  product label and applicable local rules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section s-navy">
        <div className="wrap">
          <div className="split split--wide-right">
            <div className="stack" data-anim="left">
              <p className="eyebrow eyebrow--on-navy">{pest.pest} FAQs</p>
              <h2>Answers without overpromising.</h2>
              <p className="lede lede--on-navy">
                The right plan depends on evidence found at the property.
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
