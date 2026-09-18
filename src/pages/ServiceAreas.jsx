/**
 * Service areas page (/service-areas).
 *
 * Call surfaces on this page: areas_check, areas_cta_panel.
 */

import { SITE } from '../config/site.js';
import { routeFor, pageTitle, metaText } from '../config/routes.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import CallPanel from '../components/CallPanel.jsx';
import { PhoneCta } from '../components/PhoneLink.jsx';

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
              available independent contractor near you. We do not carry out the work ourselves.
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

      <section className="section section--tight s-white">
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
