/**
 * Service areas page (/service-areas).
 *
 * This page carries more weight than its length suggests: it is where a visitor
 * decides whether the platform is any use to them, and where "nationwide" has
 * to be explained honestly rather than implied. Overstating coverage is both an
 * Ads misrepresentation risk and the fastest way to waste a contractor's time
 * and a homeowner's afternoon.
 *
 * Call surfaces: areas_check, areas_mid, areas_cta_panel.
 */

import { SITE } from '../config/site.js';
import { routeFor, pageTitle, metaText } from '../config/routes.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import { pad2 } from '../lib/format.js';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import CallPanel from '../components/CallPanel.jsx';
import Faq from '../components/Faq.jsx';
import { PhoneCta } from '../components/PhoneLink.jsx';

/* How a request actually becomes a contractor visit. Written plainly because
   the mechanics are the reassurance — a visitor who understands the process
   knows what they are and are not committing to. */
const howItWorks = [
  {
    title: 'You describe the job',
    text: 'The trade, the location and what you have noticed. A ZIP code is enough to start — we do not need an address to check coverage.',
  },
  {
    title: 'We check who is available',
    text: 'We look for an independent contractor covering your area who takes that kind of work and has capacity for it. Availability is not the same as coverage, which is why this step exists.',
  },
  {
    title: 'You are put in touch',
    text: 'The contractor contacts you to discuss the job, arrange an assessment and quote it. From that point the arrangement is between you and them.',
  },
  {
    title: 'Nothing is fixed until they accept',
    text: 'A call to us does not create a booking. The job is confirmed when a contractor has accepted it and agreed the scope with you directly.',
  },
];

const availabilityFactors = [
  {
    title: 'Where the property is',
    text: 'Dense suburban and urban areas usually have several contractors in each trade. Rural and remote addresses have fewer, and travel time can make small jobs uneconomic for the ones that exist.',
  },
  {
    title: 'Which trade you need',
    text: 'General maintenance is widely covered. Specialist work — regulated gas, structural roofing, tree surgery, certain pest treatments — has a smaller pool and a longer lead time almost everywhere.',
  },
  {
    title: 'How soon you need it',
    text: 'Same-week work depends entirely on who has just had a cancellation. A job that can wait a fortnight has considerably more options than one that cannot wait at all.',
  },
  {
    title: 'The season',
    text: 'Roofing after a storm, gardening in spring, plumbing in the first freeze. Demand concentrates predictably, and when it does, lead times move with it.',
  },
  {
    title: 'The size of the job',
    text: 'Very small jobs can be hard to place on their own, because travel time dominates. Bundling a few things into one visit often makes it viable.',
  },
  {
    title: 'Access and site conditions',
    text: 'Restricted access, shared boundaries, scaffolding requirements or a property that cannot be reached with a van all narrow the field before anyone quotes.',
  },
];

const beforeYouCall = [
  'Your ZIP code or postcode — coverage is checked on location first',
  'Which trade you think you need, or a description if you are not sure',
  'What you have noticed, and roughly when it started',
  'How soon it needs attention, honestly — urgent and flexible get different answers',
  'Anything about access: parking, gates, stairs, restricted hours',
  'Whether it is a house, apartment, rental or shared building',
];

const areaFaqs = [
  {
    question: 'Does nationwide mean you cover my address?',
    answer:
      'It means we look nationally for a contractor rather than operating from one location. It is not a guarantee that every trade is available at every address on any given day. The only reliable answer for your address is the one you get when you call with your ZIP code.',
  },
  {
    question: 'What does it cost to use this?',
    answer:
      'Nothing. The platform is free to homeowners and takes no payment online. You agree pricing directly with the contractor who attends, before authorising any work.',
  },
  {
    question: 'What if no contractor is available near me?',
    answer:
      'We will tell you that plainly rather than take the enquiry and leave you waiting. If it is a timing problem rather than a coverage one, we will say which — those are very different situations and you deserve to know which one you have.',
  },
  {
    question: 'Do you carry out the work yourselves?',
    answer:
      'No. We are a free platform that connects homeowners with local independent contractors. We do not provide home-service work and we do not employ the technicians who attend. The contractor is responsible for the work, the quote and the warranty.',
  },
  {
    question: 'Can I choose the contractor?',
    answer:
      'You are never obliged to proceed with anyone. If the contractor you are put in touch with is not right, or you would rather compare, say so — you are free to decline at any point before work is authorised.',
  },
  {
    question: 'How do I know the contractor is qualified?',
    answer:
      'Verifying licences, insurance and bonding for your specific job and jurisdiction is the homeowner’s responsibility. Ask to see current documentation before work begins and check it with the issuing authority or insurer rather than relying on a copy. Our service disclaimer sets this out in full.',
  },
];

export default function ServiceAreas() {
  const route = routeFor('/service-areas');
  usePageMeta({
    title: pageTitle(route),
    description: metaText(route.description),
    canonical: '/service-areas',
  });

  return (
    <>
      {/* The lead line used to say "Enter no details online", which stopped being
          true the moment the enquiry form was added to /contact. */}
      <PageHero
        eyebrow="Service areas"
        title="Local coverage, confirmed before you rely on a visit."
        text="Call with your postcode, ZIP code or neighbourhood and the service you need — or send the same details through the enquiry form."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Service areas', href: null },
        ]}
      />

      <section className="section s-paper">
        <div className="wrap split split--wide-left">
          <div className="stack" data-anim="left">
            <p className="eyebrow">Regions covered</p>
            <h2>
              {SITE.coverage} across {SITE.primaryArea}.
            </h2>
            <p className="lede">{SITE.coverageNote}</p>
            <p className="muted">
              We are a free platform: you tell us the job and the ZIP code, and we look for an
              available independent contractor near you. We do not carry out the work ourselves, we
              do not employ the technicians who attend, and we take no payment online.
            </p>
            <PhoneCta placement="areas_check" className="btn btn--call" />
          </div>
          <div className="areas" data-anim-group="">
            {SITE.serviceAreas.map((area) => (
              <div className="area-chip" data-anim="scale" key={area}>
                <Icon id="i-pin" className="ic ic--sm" />
                <strong>{area}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section s-white">
        <div className="wrap">
          <div className="sec-head" data-anim="rise">
            <p className="eyebrow">How it works</p>
            <h2>From your call to a contractor at the door.</h2>
            <p className="lede">
              Four steps, and you can stop at any of them. Knowing the mechanics is the point —
              you should be able to see exactly what you are and are not committing to.
            </p>
          </div>
          <div className="steps steps--row" data-anim-group="">
            {howItWorks.map((step) => (
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

      <section className="section s-mist">
        <div className="wrap">
          <div className="sec-head" data-anim="rise">
            <p className="eyebrow">What affects availability</p>
            <h2>Why coverage and availability are not the same thing.</h2>
            <p className="lede">
              A contractor covering your region does not automatically mean one is free for your job
              this week. These are the things that actually decide it.
            </p>
          </div>
          <div className="info-grid" data-anim-group="">
            {availabilityFactors.map((factor, i) => (
              <article className="info-card" data-anim="rise" key={factor.title}>
                <span className="info-card__num">{pad2(i + 1)}</span>
                <h3>{factor.title}</h3>
                <p>{factor.text}</p>
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
              <h2>Six things that get you a straight answer.</h2>
              <p className="lede">
                None of it is personal beyond a location. We check coverage from a ZIP code — an
                address is only needed once a contractor is actually attending.
              </p>
              <PhoneCta placement="areas_mid" className="btn btn--call" />
            </div>
            <div data-anim="right">
              <ul className="checklist">
                {beforeYouCall.map((item) => (
                  <li key={item}>
                    <Icon id="i-check" className="ic ic--sm" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section s-navy">
        <div className="wrap split split--wide-right">
          <div className="sec-head" data-anim="left">
            <p className="eyebrow eyebrow--on-navy">Coverage questions</p>
            <h2>The things people ask before they call.</h2>
            <p className="lede lede--on-navy">
              If your question is about your specific address, calling is genuinely faster than
              reading — we can check it while you are on the phone.
            </p>
          </div>
          <div data-anim="right">
            <Faq items={areaFaqs} />
          </div>
        </div>
      </section>

      <section className="section section--tight s-paper">
        <div className="wrap wrap--narrow">
          <div className="notecard notecard--warn" data-anim="rise">
            <Icon id="i-alert" />
            <div>
              <strong>What nationwide does and does not mean</strong>
              <p>
                Nationwide describes where we look for contractors, not a guarantee that every trade
                is available in every location on any given day. Rural addresses, specialist work
                and short-notice jobs are the most likely to have limited availability. Nothing is
                confirmed until a contractor accepts the job.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CallPanel
        placement="areas_cta_panel"
        title="Not sure whether your address is covered?"
        text="Call with your location and the service needed. We will confirm current coverage and availability."
      />
    </>
  );
}
