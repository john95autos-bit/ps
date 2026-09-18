/**
 * About page (/about).
 *
 * The version this replaces said the business "is presented as an independent
 * home-services provider", which flatly contradicted the platform disclosure in
 * the footer of the same page. Under Google Ads misrepresentation policy, a
 * lead-generation service that presents itself as the service provider is a
 * suspendable violation, so this page now states the model plainly and at
 * length rather than leaving it to one line of small print.
 *
 * Call surfaces: about_story, about_mid, about_cta_panel.
 */

import { Link } from 'react-router-dom';
import { SITE } from '../config/site.js';
import { routeFor, pageTitle, metaText } from '../config/routes.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import { pad2 } from '../lib/format.js';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import CallPanel from '../components/CallPanel.jsx';
import Faq from '../components/Faq.jsx';
import { PhoneCta } from '../components/PhoneLink.jsx';

const weDo = [
  'Take your enquiry by phone or through the contact form',
  'Check which independent contractors cover your area and trade',
  'Put you in touch with one who has capacity for the job',
  'Explain what to expect and what to have ready beforehand',
  'Tell you plainly when we cannot help, instead of leaving you waiting',
];

const weDoNot = [
  'Carry out any home-service work ourselves',
  'Employ the technicians or tradespeople who attend',
  'Set, collect or process payment for the work',
  'Quote a price, a response time or an outcome on a contractor’s behalf',
  'Verify or warrant a contractor’s licensing, insurance or bonding for your job',
];

/* Each of these is a claim the site deliberately does not make, paired with the
   reason. Stating the absence is more useful than silently omitting it — and it
   is the honest version of a trust section. */
const whatWeDontPublish = [
  {
    title: 'Reviews and ratings',
    text: 'We do not publish testimonials, star ratings or review counts. Ones we cannot evidence would be fabricated, and fabricated social proof is both a deceptive practice and a straightforward way to lose an advertising account.',
  },
  {
    title: 'Accreditation badges',
    text: 'No trust marks, certification logos or association memberships appear here. A badge belongs to whoever earned it, and the contractor who attends your property is the one whose credentials matter.',
  },
  {
    title: 'Job counts and years in business',
    text: '"Ten thousand jobs completed" and similar figures are unverifiable by anyone reading them. We would rather say nothing than publish a number you have no way to check.',
  },
  {
    title: 'Prices and response times',
    text: 'We do not set either. The contractor quotes the work after seeing it, and availability depends on trade, location and workload. A price on this page would be a guess presented as a commitment.',
  },
  {
    title: 'Guaranteed outcomes',
    text: 'No promise that pests will not return, that a repair is permanent or that a result is assured. Those depend on the property, the conditions and follow-through, and nobody can commit to them before looking.',
  },
];

const aboutFaqs = [
  {
    question: 'So who actually turns up at my house?',
    answer:
      'A local independent contractor. They are not our employee, and they run their own business. They quote the work, carry it out, and stand behind it — the agreement for the work itself is between you and them.',
  },
  {
    question: 'What does this cost me?',
    answer:
      'Nothing for the introduction. The platform is free to homeowners and takes no payment online. You agree pricing directly with the contractor before authorising any work.',
  },
  {
    question: 'How do you make money, then?',
    answer:
      'Contractors pay to receive work. That is the standard model for a referral platform, and it is worth knowing because it means we have an interest in passing on enquiries — which is exactly why the disclosure above matters and why we would rather tell you we cannot help than waste your time.',
  },
  {
    question: 'Do you check the contractors?',
    answer:
      'Verifying that a contractor holds the right licences, insurance and bonding for your specific job and jurisdiction is the homeowner’s responsibility, and our service disclaimer sets that out in full. Requirements differ by trade, by the value of the work and by state, county and municipality. Ask to see current documentation before work begins and check it with the issuing authority rather than relying on a copy.',
  },
  {
    question: 'What happens to my details?',
    answer:
      'They are passed to a local independent contractor so they can call you back about your enquiry. They are not sold, and they are not used to market anything you did not ask about. The privacy policy sets out exactly what is recorded and why.',
  },
  {
    question: 'Am I committed to anything by calling?',
    answer:
      'No. A call or a form submission does not create a booking or a contract. You can decline at any point, and nothing is confirmed until you have agreed a scope and a price with the contractor directly.',
  },
];

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
            <p>
              {SITE.name} is a free platform that connects homeowners across {SITE.primaryArea} with
              local independent contractors for pest control, roofing, gardening and plumbing. We do
              not carry out the work ourselves and we do not employ the technicians who attend. Our
              website explains the service categories covered, how enquiries are handled and what
              may affect scope, pricing or outcomes.
            </p>
            <p>
              That distinction is not a technicality. The person who arrives at your property runs
              their own business, sets their own prices and is responsible for their own work and
              credentials. Knowing that from the outset changes what you ask them, and it is why we
              state it on every page rather than burying it.
            </p>
            <p>
              What we can do is make the first conversation a better one. Most wasted appointments
              come down to a job being described one way and turning out to be another, so most of
              this site is spent on what to look for, what to have ready and what genuinely affects
              a quote.
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
                  <p>Set practical expectations about inspection, access and possible next steps.</p>
                </div>
              </li>
              <li className="step" data-anim="rise">
                <div>
                  <h3>Confirm before work</h3>
                  <p>Agree availability, scope, pricing basis and terms before authorisation.</p>
                </div>
              </li>
              <li className="step" data-anim="rise">
                <div>
                  <h3>Say so when we cannot help</h3>
                  <p>
                    A straight no is more use than an enquiry that sits unanswered for a week.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section s-white">
        <div className="wrap">
          <div className="sec-head" data-anim="rise">
            <p className="eyebrow">Where the line sits</p>
            <h2>What we do, and what we deliberately do not.</h2>
            <p className="lede">
              The second list matters as much as the first. If any page on this site ever reads as
              though we are the contractor, the second list is the one that is correct.
            </p>
          </div>
          <div className="split">
            <div className="stack" data-anim="left">
              <h3>What we do</h3>
              <ul className="checklist">
                {weDo.map((item) => (
                  <li key={item}>
                    <Icon id="i-check" className="ic ic--sm" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="stack" data-anim="right">
              <h3>What we do not</h3>
              <ul className="checklist">
                {weDoNot.map((item) => (
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

      <section className="section s-mist">
        <div className="wrap">
          <div className="sec-head" data-anim="rise">
            <p className="eyebrow">What you will not find here</p>
            <h2>The claims this site does not make.</h2>
            <p className="lede">
              Most home-services sites lead with proof. We would rather explain what is missing and
              why than publish something neither of us can check.
            </p>
          </div>
          <div className="info-grid" data-anim-group="">
            {whatWeDontPublish.map((item, i) => (
              <article className="info-card" data-anim="rise" key={item.title}>
                <span className="info-card__num">{pad2(i + 1)}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section s-white">
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

      <section className="section s-navy">
        <div className="wrap split split--wide-right">
          <div className="sec-head" data-anim="left">
            <p className="eyebrow eyebrow--on-navy">Straight answers</p>
            <h2>Questions about how this works.</h2>
            <p className="lede lede--on-navy">
              Including the one most platforms avoid: how we get paid. See also the{' '}
              <Link to="/disclaimer">service disclaimer</Link> for what verifying a contractor
              involves.
            </p>
            <PhoneCta placement="about_mid" className="btn btn--call" />
          </div>
          <div data-anim="right">
            <Faq items={aboutFaqs} />
          </div>
        </div>
      </section>

      <CallPanel placement="about_cta_panel" title="Tell us what your home needs." />
    </>
  );
}
