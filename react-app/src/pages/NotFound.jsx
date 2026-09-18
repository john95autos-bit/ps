/**
 * Rendered for any unmatched path.
 *
 * No [data-anim] anywhere: this is the whole first screen, and a visitor who has
 * already hit a dead end must not wait on the animation chunk to see the way
 * out.
 *
 * The canonical is pinned to "/" rather than echoing the requested path, so a
 * crafted URL can never be reflected into <link rel=canonical> on a page that
 * becomes indexable once the launch gate passes.
 *
 * Call surfaces on this page: notfound.
 */

import { Link } from 'react-router-dom';
import { SITE } from '../config/site.js';
import { usePageMeta } from '../lib/usePageMeta.js';
import { PhoneCta } from '../components/PhoneLink.jsx';

export default function NotFound() {
  usePageMeta({
    title: `Page Not Found | ${SITE.name}`,
    description:
      'That page is not available. Return to the home page or call to speak with the team.',
    canonical: '/',
    noindex: true,
  });

  return (
    <section className="section s-white">
      <div className="wrap">
        <div className="notfound">
          <div className="notfound__code">404</div>
          <h1>That page is not here.</h1>
          <p>The link may be old or the address may have been typed incorrectly.</p>
          <div className="notfound__actions">
            <Link className="btn btn--dark" to="/">
              Return home
            </Link>
            <PhoneCta placement="notfound" className="btn btn--call" />
          </div>
        </div>
      </div>
    </section>
  );
}
