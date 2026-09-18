/**
 * The primary ad landing page.
 *
 * This page is the whole business on one screen: what is offered, what each
 * service actually covers, what to look for, how a job proceeds, where the
 * platform operates, and what to have ready before dialling. Everything factual
 * is read from src/config/site.js, so the home page can never describe a
 * service differently from that service's own page.
 *
 * Conversion structure: a call action appears above the fold, again mid-page in
 * the amber strip, again after the pest section, and again in the closing panel
 * — a visitor is never more than about one screen from a phone button.
 *
 * Nothing above the fold is animated: the hero must be painted and the call
 * button tappable the moment the app mounts, before the GSAP chunk has loaded.
 */

import { Link } from 'react-router-dom';
import { SITE, MAIN_SERVICES } from '../config/site.js';
import { PEST_TYPES } from '../config/pests.js';
import { SERVICE_DETAILS } from '../config/services.js';
import { routeFor, pageTitle, metaText } from '../config/routes.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import { pad2 } from '../lib/format.js';
import Icon from '../components/Icon.jsx';
import Img from '../components/Img.jsx';
import Faq from '../components/Faq.jsx';
import CallPanel from '../components/CallPanel.jsx';
import { PhoneCta } from '../components/PhoneLink.jsx';

const homeFaqs = [
  {
    question: 'Which areas do you serve?',
    answer: `We operate ${SITE.coverage.toLowerCase()} across ${SITE.primaryArea}. Contractor availability still varies by location, trade and current workload, so give us your ZIP code and we will confirm what is available for your job before you rely on a visit.`,
  },
  {
    question: 'Can I get an exact price by phone?',
    answer:
      'We can discuss likely scope and any known call-out details. Some work needs an inspection before a reliable quote can be provided.',
  },
  {
    question: 'Do you take payment through this website?',
    answer:
      'No. This website does not request card or bank details. Confirm pricing, payment methods and service terms directly with the contractor before authorising work.',
  },
  {
    question: 'Are the photos on the site examples?',
    answer:
      'Yes. Website images illustrate the type of work discussed and do not claim to show a specific customer, technician or completed job.',
  },
  {
    question: 'How quickly can someone attend?',
    answer:
      'That depends on the service, your location and current workload, so we will not quote a response time before checking. Call and we will tell you the next realistic window rather than an optimistic one.',
  },
  {
    question: 'What happens after I call?',
    answer:
      'We discuss what you have noticed, confirm whether your address is covered, explain the likely next step and agree what happens before any work is authorised. Calling does not commit you to anything.',
  },
];

const homeValues = [
  ['01', 'Transparent information', 'Important limitations and variables are stated close to the service claims they affect.'],
  ['02', 'No invented proof', 'We do not use fabricated reviews, accreditation badges, ratings or job counts.'],
  ['03', 'Privacy-conscious', 'Optional ad measurement follows your cookie choice; sensitive payment details are not collected here.'],
  ['04', 'Mobile call-ready', 'The same visible phone number is available across landing pages for easier ad verification.'],
];

const homePoints = [
  {
    icon: 'i-search',
    point: 'Inspection-led recommendations',
    label: 'Inspection-led',
    text: 'Contractors recommend based on the property and the issue in front of them.',
  },
  {
    icon: 'i-clipboard',
    point: 'Scope agreed before any work',
    label: 'Clear scope',
    text: 'You understand the proposed work before you approve it.',
  },
  {
    icon: 'i-shield',
    point: 'No payment taken online',
    label: 'No online payment',
    text: 'This website does not request card or bank details.',
  },
  {
    icon: 'i-clock',
    point: 'Phone-first, during published hours',
    label: 'Easy to reach',
    text: `Phone-first support during ${SITE.hours}.`,
  },
];

/* What each service covers. Read from the service pages themselves so the home
   page and the landing pages can never disagree; pest control has no
   SERVICE_DETAILS entry, so its coverage is the pest guides it links to. */
const coverage = [
  {
    title: 'Pest control',
    href: '/pest-control',
    icon: 'i-search',
    blurb:
      'Inspection-led treatment planning for common household pests, with preparation and aftercare explained before anything is applied.',
    items: PEST_TYPES.map((p) => p.name),
  },
  ...['roofing', 'gardening', 'plumbing']
    .filter((slug) => SERVICE_DETAILS[slug])
    .map((slug) => ({
      title: slug.charAt(0).toUpperCase() + slug.slice(1),
      href: `/${slug}`,
      icon: slug === 'plumbing' ? 'i-wrench' : slug === 'roofing' ? 'i-house' : 'i-shield',
      blurb: SERVICE_DETAILS[slug].summary ?? '',
      items: SERVICE_DETAILS[slug].highlights ?? [],
    })),
];

const homeSteps = [
  { title: 'Describe', text: 'Tell us what you have noticed, which rooms or areas are affected and when it started.' },
  { title: 'Prepare', text: 'Receive instructions on access, clearing and anything to avoid before the visit.' },
  { title: 'Inspect', text: 'The contractor reviews the evidence at the property and the conditions that may be supporting the problem.' },
  { title: 'Act', text: 'Discuss the proposed plan, aftercare and any follow-up, then decide whether to proceed.' },
];

const homeReady = [
  { title: 'Your location', text: 'Postcode, ZIP code or neighbourhood.' },
  { title: 'The service needed', text: 'Pest control, roofing, gardening or plumbing.' },
  { title: 'What you noticed', text: 'Signs, affected area and when it started.' },
  { title: 'Access or safety details', text: 'Children, pets, height, utilities or urgent risks.' },
];

export default function Home() {
  const route = routeFor('/');
  usePageMeta({
    title: pageTitle(route),
    description: metaText(route.description),
    canonical: '/',
  });

  return (
    <>
      <section className="hero">
        <div className="hero__media" data-parallax="">
          {/* First hero image: never lazy-loaded. Img adds width/height (the CLS fix). */}
          <Img
            src="/images/pest-control-hero.webp"
            alt="Pest-control technician inspecting a kitchen baseboard"
            fetchPriority="high"
          />
        </div>
        <div className="hero__scrim" />
        <div className="wrap">
          <div className="hero__inner">
            <p className="hero__chip">
              <span className="dot" aria-hidden="true" /> {SITE.coverage} &middot; local independent
              contractors
            </p>
            <h1 className="hero__title">
              Take care of your home, <em>one clear call</em> at a time.
            </h1>
            <p className="lede lede--on-navy">
              Pest control, roofing, gardening and plumbing for households across {SITE.primaryArea}.
              Tell us what is happening and we will connect you with a local independent contractor
              who can explain the likely next step.
            </p>
            <div className="hero__actions">
              <PhoneCta placement="home_hero" className="btn btn--call btn--lg" />
              <Link className="btn btn--onnavy btn--lg" to="/pest-control">
                Explore pest control
              </Link>
            </div>
            <ul className="hero__points">
              {homePoints.map((p) => (
                <li key={p.point}>
                  <Icon id="i-check" />
                  <span>{p.point}</span>
                </li>
              ))}
            </ul>
            <p className="fineprint fineprint--on-navy">
              Calls do not create a booking until availability, scope and terms are confirmed.
            </p>
          </div>
        </div>
      </section>

      <section className="trustrow">
        <div className="wrap">
          <ul className="trustrow__grid" data-anim-group="">
            {homePoints.map((p) => (
              <li className="trustrow__item" data-anim="rise" key={p.label}>
                <Icon id={p.icon} />
                <div>
                  <strong>{p.label}</strong>
                  <span>{p.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section s-paper">
        <div className="wrap">
          <div className="sec-head sec-head--row" data-anim="rise">
            <div>
              <p className="eyebrow">Services for the whole home</p>
              <h2>Useful help, without the hard sell.</h2>
            </div>
            <p className="lede">
              Each service page explains what to notice, what to expect on the first call and the
              factors that may affect scope or pricing.
            </p>
          </div>
          <div className="svc-grid" data-anim-group="">
            {MAIN_SERVICES.map((service) => (
              <Link className="svc-card" data-anim="rise" to={service.href} key={service.href}>
                {/* Below the fold, so these four card images are lazy-loaded. */}
                <Img src={service.image} alt="" loading="lazy" />
                <span className="svc-card__tag">{service.tag}</span>
                <div className="svc-card__body">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span className="svc-card__more">
                    View service <Icon id="i-arrow-right" className="ic ic--sm" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page call prompt. The one place amber is used for something other
          than a button, so its CTA is dark rather than amber-on-amber. */}
      <section className="quickcall">
        <div className="wrap">
          <p>
            <strong>Not sure which service you need?</strong> Describe what you are seeing and we
            will point you at the right one.
          </p>
          <PhoneCta placement="home_quickcall" className="btn btn--dark" />
        </div>
      </section>

      <section className="section s-white">
        <div className="wrap">
          <div className="sec-head" data-anim="rise">
            <p className="eyebrow">What we cover</p>
            <h2>Four services, described plainly.</h2>
            <p className="lede">
              This is the full list of trades we can find you a contractor for. If what you need is
              not here, say so on the call and we will tell you honestly rather than take the
              enquiry.
            </p>
          </div>
          <div className="info-grid info-grid--four" data-anim-group="">
            {coverage.map((cover) => (
              <article className="info-card" data-anim="rise" key={cover.href}>
                <span className="info-card__num">
                  <Icon id={cover.icon} className="ic ic--sm" />
                </span>
                <h3>{cover.title}</h3>
                <p>{cover.blurb}</p>
                {cover.items.length ? (
                  <ul className="checklist mt-4">
                    {cover.items.map((item) => (
                      <li key={item}>
                        <Icon id="i-check" className="ic ic--sm" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <Link className="textlink" to={cover.href}>
                  {cover.title} details <Icon id="i-arrow-right" className="ic ic--sm" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section s-navy">
        <div className="wrap stack-lg">
          <div className="split">
            <figure className="figure" data-anim="left">
              <Img
                src="/images/pest-control-detail.webp"
                alt="Technician carrying out a targeted exterior pest treatment"
                loading="lazy"
              />
              <figcaption className="figure__cap">
                <strong>Targeted approach</strong>
                <span>Inspect • Treat • Guide</span>
              </figcaption>
            </figure>
            <div className="stack" data-anim="right">
              <p className="eyebrow eyebrow--on-navy">Pest-control focus</p>
              <h2>Start with what you are actually seeing.</h2>
              <p className="lede lede--on-navy">
                Different pests, properties and activity levels call for different next steps. An
                honest assessment is more useful than a one-size-fits-all promise.
              </p>
            </div>
          </div>
          <div className="tile-grid" data-anim-group="">
            {PEST_TYPES.map((pest, i) => (
              <Link className="tile" data-anim="rise" to={pest.href} key={pest.href}>
                <span className="tile__num">{pad2(i + 1)}</span>
                <h3>{pest.name}</h3>
                <p>{pest.blurb}</p>
                <span className="tile__more">
                  View guide <Icon id="i-arrow-right" className="ic ic--sm" />
                </span>
              </Link>
            ))}
          </div>
          <PhoneCta placement="home_pest" className="btn btn--call btn--lg" />
        </div>
      </section>

      <section className="section s-mist">
        <div className="wrap">
          <div className="sec-head" data-anim="rise">
            <p className="eyebrow">How it works</p>
            <h2>From your call to the follow-up.</h2>
            <p className="lede">
              The same four steps apply whichever service you need. Nothing is authorised until you
              have seen the scope.
            </p>
          </div>
          <div className="steps steps--row" data-anim-group="">
            {homeSteps.map((step) => (
              <article className="step" data-anim="rise" key={step.title}>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section s-white">
        <div className="wrap">
          <div className="split split--wide-left">
            <div className="stack" data-anim="left">
              <p className="eyebrow">Signs worth a call</p>
              <h2>Small things that are easier to deal with early.</h2>
              <p className="lede">
                These are conversation starters, not a remote diagnosis. Noticing one of them does
                not confirm a problem — it just means it is worth describing to someone.
              </p>
              <PhoneCta placement="home_signs" className="btn btn--call" />
            </div>
            <div className="signals" data-anim-group="">
              {Object.values(SERVICE_DETAILS).map((service) =>
                (service.signs ?? []).slice(0, 1).map((sign) => (
                  <div className="signal" data-anim="rise" key={sign.title}>
                    <Icon id="i-search" />
                    <div>
                      <strong>{sign.title}</strong>
                      <p className="signal__text">{sign.text}</p>
                    </div>
                  </div>
                ))
              )}
              <div className="signal" data-anim="rise">
                <Icon id="i-search" />
                <div>
                  <strong>Pest activity you can see</strong>
                  <p className="signal__text">
                    Droppings, gnaw marks, shed skins or insects appearing in the same place more
                    than once.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section s-paper">
        <div className="wrap">
          <div className="split">
            <div className="stack" data-anim="left">
              <p className="eyebrow">Where we work</p>
              <h2>{SITE.coverage} coverage, local contractors.</h2>
              <p className="lede">{SITE.coverageNote}</p>
              <div className="areas">
                {SITE.serviceAreas.map((area) => (
                  <span className="area-chip" key={area}>
                    <Icon id="i-pin" className="ic ic--sm" />
                    <strong>{area}</strong>
                  </span>
                ))}
              </div>
              <Link className="textlink" to="/service-areas">
                Check your address <Icon id="i-arrow-right" className="ic ic--sm" />
              </Link>
            </div>
            <div className="stack" data-anim="right">
              <p className="eyebrow">Have this ready</p>
              <h2>A more useful first conversation.</h2>
              <ol className="prep-list">
                {homeReady.map((ready) => (
                  <li key={ready.title}>
                    <div>
                      <strong>{ready.title}</strong>
                      <span>{ready.text}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="fineprint">
                {SITE.hours} &middot; standard network charges may apply.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section s-mist">
        <div className="wrap">
          <div className="sec-head" data-anim="rise">
            <p className="eyebrow">Built for informed decisions</p>
            <h2>Trust is in the details.</h2>
            <p className="lede">
              No false urgency, vague “from” prices or promises that cannot be checked. Just clear
              information designed to help you decide what to do next.
            </p>
          </div>
          <div className="info-grid info-grid--four" data-anim-group="">
            {homeValues.map(([number, title, text]) => (
              <article className="info-card" data-anim="rise" key={number}>
                <span className="info-card__num">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section s-white">
        <div className="wrap">
          <div className="split split--wide-right">
            <div className="stack" data-anim="left">
              <p className="eyebrow">Before you call</p>
              <h2>Questions people often ask.</h2>
              <p className="lede">
                If your question is property-specific, a short phone conversation will usually be
                more useful.
              </p>
              <div className="notecard notecard--alert">
                <Icon id="i-alert" />
                <div>
                  <strong>Not an emergency service</strong>
                  <p>
                    For fire, gas odour, electrical danger, major flooding or structural danger,
                    contact the appropriate emergency service or utility provider first.
                  </p>
                </div>
              </div>
            </div>
            <div data-anim="right">
              <Faq items={homeFaqs} />
            </div>
          </div>
        </div>
      </section>

      <CallPanel
        title="A home problem feels smaller once the next step is clear."
        placement="home_cta_panel"
      />
    </>
  );
}
