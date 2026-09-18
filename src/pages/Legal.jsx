/**
 * One component, three routes: /privacy, /terms and /disclaimer.
 *
 * The copy — every section title and paragraph, in order — lives in
 * src/config/legal.js and is rendered verbatim; nothing is written here.
 *
 * Call surfaces on this page: <slug>_cta_panel (the closing panel only, so the
 * placement is still unique when all three documents share this template).
 */

import { SITE, LEAD_FORM } from '../config/site.js';
import { legalDocuments } from '../config/legal.js';
import { routeFor, pageTitle, metaText } from '../config/routes.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import { formattedAddress, legalUpdatedDate } from '../lib/format.js';
import { hasMeasurementTag } from '../lib/launch.js';
import Icon from '../components/Icon.jsx';
import PageHero from '../components/PageHero.jsx';
import CallPanel from '../components/CallPanel.jsx';
import NotFound from './NotFound.jsx';

export default function Legal({ slug }) {
  const doc = legalDocuments(hasMeasurementTag())[slug];
  const route = routeFor(`/${slug}`);

  if (!doc || !route) return <NotFound />;

  return <LegalBody doc={doc} route={route} slug={slug} />;
}

function LegalBody({ doc, route, slug }) {
  usePageMeta({
    title: pageTitle(route),
    description: metaText(route.description),
    canonical: route.path,
  });

  /* Paragraph copy is stored with placeholders so the text stays a plain string
     in config and the legal entity, address and consent wording are each edited
     in exactly one place. */
  const tokens = {
    '{legal_name}': SITE.legalName,
    '{address}': formattedAddress(),
    '{phone}': SITE.phoneDisplay,
    '{email}': SITE.email,
    '{consent_text}': LEAD_FORM.consentText,
  };

  const fill = (text) =>
    Object.entries(tokens).reduce((out, [token, value]) => out.split(token).join(value), text);

  return (
    <>
      <PageHero
        eyebrow={doc.eyebrow}
        title={doc.title}
        text={doc.intro}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: doc.eyebrow, href: null },
        ]}
      />

      <section className="section s-white">
        <div className="wrap wrap--narrow">
          {/* One reveal for the document as a whole: the guidance is to animate
              section-level blocks, and eight separately fading clauses would turn
              a legal page into a slideshow. */}
          <article className="legal" data-anim="fade">
            {/* A <div>, not a <p>: `.legal p` is the more specific selector and
                would override the pill's own size and colour. */}
            <div className="legal__updated">
              <Icon id="i-clock" className="ic ic--sm" />
              <span>Last updated: {legalUpdatedDate()}</span>
            </div>
            {doc.sections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i}>{fill(paragraph)}</p>
                ))}
              </section>
            ))}
          </article>
        </div>
      </section>

      <CallPanel
        placement={`${slug}_cta_panel`}
        eyebrow="Questions about this page?"
        title="Ask before you decide."
        text="If anything here affects the work you are considering, call and ask. We will explain what applies to your enquiry."
      />
    </>
  );
}
