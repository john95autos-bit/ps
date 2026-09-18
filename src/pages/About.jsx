/**
 * About page (/about).
 *
 * Call surfaces on this page: about_story, about_cta_panel.
 */

import { SITE } from '../config/site.js';
import { routeFor, pageTitle, metaText } from '../config/routes.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import PageHero from '../components/PageHero.jsx';
import CallPanel from '../components/CallPanel.jsx';
import { PhoneCta } from '../components/PhoneLink.jsx';

export default function About() {
  const route = routeFor('/about');
  usePageMeta({
    title: pageTitle(route),
    description: metaText(route.description),
    canonical: '/about',
  });

  return (
    <>
      <PageHero
        eyebrow={`About ${SITE.brandShort}`}
        title="Home care should begin with a clear, honest conversation."
        text="We organise practical household service support around one simple idea: understand the problem before recommending the work."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About', href: null },
        ]}
      />

      <section className="section s-paper">
        <div className="wrap split">
          <div className="stack" data-anim="left">
            <p className="eyebrow">Our approach</p>
            <h2>Useful information first.</h2>
            {/* Was "is presented as an independent home-services provider",
                which contradicted the platform disclosure in the footer of the
                same page. The operator is the platform; the contractor does the
                work. */}
            <p>
              {SITE.name} is a free platform that connects homeowners across {SITE.primaryArea} with
              local independent contractors. We do not carry out the work ourselves and we do not
              employ the technicians who attend. Our website explains the service categories
              covered, how enquiries are handled and what may affect scope, pricing or outcomes.
            </p>
            <p>
              We do not publish reviews, accreditation marks, customer counts or guaranteed-result
              claims. Anything of that kind belongs on a website only when it can be evidenced, so
              you will not find it here. Verifying a contractor’s credentials, qualifications and
              insurance is the homeowner’s responsibility — ask to see current documentation before
              work begins, and see the service disclaimer for what that involves.
            </p>
            <PhoneCta placement="about_story" className="call-link" />
          </div>
          <div>
            <p className="eyebrow">What matters to us</p>
            {/* The 01 / 02 / 03 markers are CSS counters on .step — never markup. */}
            <ol className="steps" data-anim-group="">
              <li className="step" data-anim="rise">
                <div>
                  <h3>Listen carefully</h3>
                  <p>Start with the issue, the property and the customer’s priorities.</p>
                </div>
              </li>
              <li className="step" data-anim="rise">
                <div>
                  <h3>Explain clearly</h3>
                  <p>
                    Set practical expectations about inspection, access and possible next steps.
                  </p>
                </div>
              </li>
              <li className="step" data-anim="rise">
                <div>
                  <h3>Confirm before work</h3>
                  <p>Agree availability, scope, pricing basis and terms before authorisation.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section s-mist">
        <div className="wrap">
          <div className="sec-head sec-head--center" data-anim="rise">
            <p className="eyebrow">Our standards</p>
            <h2>Designed around informed choices.</h2>
          </div>
          <div className="info-grid" data-anim-group="">
            <article className="info-card" data-anim="rise">
              <span className="info-card__num">01</span>
              <h3>Relevant</h3>
              <p>The page a visitor lands on should closely match the service mentioned in the ad.</p>
            </article>
            <article className="info-card" data-anim="rise">
              <span className="info-card__num">02</span>
              <h3>Transparent</h3>
              <p>Important qualifications, limitations and pricing variables should not be hidden.</p>
            </article>
            <article className="info-card" data-anim="rise">
              <span className="info-card__num">03</span>
              <h3>Reachable</h3>
              <p>
                A consistent phone number, business identity, hours and service area make contact
                easier.
              </p>
            </article>
          </div>
        </div>
      </section>

      <CallPanel placement="about_cta_panel" title="Tell us what your home needs." />
    </>
  );
}
