/**
 * Contact page (/contact).
 *
 * Layout: the two ways of getting in touch sit side by side — the phone card on
 * the left, the enquiry form on the right — so a visitor chooses between them
 * instead of scrolling past one to find the other. The "have this ready" list
 * follows underneath, where it works for both routes rather than only for the
 * phone call it used to sit beside.
 *
 * Call surfaces on this page: contact_card, contact_button,
 * contact_form_success, contact_cta_panel.
 */

import { SITE } from '../config/site.js';
import { routeFor, pageTitle, metaText } from '../config/routes.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import { formattedAddress } from '../lib/format.js';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import CallPanel from '../components/CallPanel.jsx';
import LeadForm from '../components/LeadForm.jsx';
import PhoneLink, { PhoneCta } from '../components/PhoneLink.jsx';

/* Numbering is a CSS counter on .prep-list li — never written into the markup. */
const contactSteps = [
  { title: 'Your location', text: 'Postcode, ZIP code or neighbourhood.' },
  { title: 'The service needed', text: 'Pest control, roofing, gardening or plumbing.' },
  { title: 'What you noticed', text: 'Signs, affected area and when it started.' },
  { title: 'Access or safety details', text: 'Children, pets, height, utilities or urgent risks.' },
];

export default function Contact() {
  const route = routeFor('/contact');
  usePageMeta({
    title: pageTitle(route),
    description: metaText(route.description),
    canonical: '/contact',
  });

  const address = formattedAddress();

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="One call. A clearer next step."
        text="For the fastest response, call during published hours and tell us the service, property location and what you have noticed."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact', href: null },
        ]}
      />

      <section className="section s-paper">
        <div className="wrap contact-layout">
          <div className="contact-col" data-anim="left">
            <div className="contact-card">
              <p className="contact-card__label">Phone enquiries</p>
              <PhoneLink placement="contact_card" className="contact-card__number">
                {SITE.phoneDisplay}
              </PhoneLink>
              <p className="contact-card__hours">
                <Icon id="i-clock" className="ic ic--sm" />
                <span>{SITE.hours}</span>
              </p>
              <PhoneCta placement="contact_button" className="btn btn--call btn--lg btn--block" />
              <small>Standard network charges may apply. Calling does not confirm a booking.</small>

              {address ? (
                <p className="contact-card__alt">
                  <Icon id="i-pin" className="ic ic--sm" />
                  <span>
                    {SITE.legalName}
                    <br />
                    {address}
                  </span>
                </p>
              ) : null}

              {/* The privacy policy tells visitors to exercise their data rights
                  by email, so the address has to be reachable from here. */}
              <p className="contact-card__alt">
                <Icon id="i-clipboard" className="ic ic--sm" />
                <span>
                  Prefer to write? <a href={`mailto:${SITE.email}`}>{SITE.email}</a> — for enquiries
                  that are not urgent, and for privacy or data requests.
                </span>
              </p>
            </div>

            {/* Sits under the phone card rather than in its own band below: the
                card is short and the form is tall, and the difference otherwise
                leaves a screen-height hole in this column. */}
            <div className="prep-block">
              <p className="eyebrow">Have this ready</p>
              <h2>Help us understand the enquiry.</h2>
              <p>
                Whether you call or use the form, these four things are what a contractor needs
                before they can tell you anything useful.
              </p>
              <ol className="prep-list">
                {contactSteps.map((step) => (
                  <li key={step.title}>
                    <div>
                      <strong>{step.title}</strong>
                      <span>{step.text}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div data-anim="right">
            <LeadForm />
          </div>
        </div>
      </section>

      <section className="section section--tight s-mist">
        <div className="wrap wrap--narrow">
          <div className="notecard notecard--alert" data-anim="rise">
            <Icon id="i-alert" />
            <div>
              <strong>Emergency notice</strong>
              <p>
                This website is not an emergency-response service. For fire, electrical danger,
                major flooding, gas odour, structural danger or an immediate threat to people,
                contact the appropriate emergency service or utility provider.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CallPanel placement="contact_cta_panel" />
    </>
  );
}
