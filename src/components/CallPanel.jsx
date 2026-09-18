/**
 * The dark closing band every page ends on.
 *
 * Props (all optional; the defaults are the copy the site has always used):
 *   eyebrow   — small label above the heading
 *   title     — <h2>
 *   text      — supporting sentence
 *   placement — data-placement for the phone link, default 'cta_panel'. Pass a
 *               page-specific value when a page already spends 'cta_panel'
 *               somewhere else, so no two call surfaces on one page report the
 *               same placement.
 *
 * The eyebrow is a <span>, not a <p>: `.cta-panel p` is more specific than
 * `.eyebrow--on-navy`, so a paragraph here would lose its amber accent and pick
 * up the body-copy colour and margin instead.
 *
 * The phone button deliberately carries no [data-anim]. Everything else in the
 * panel may reveal on scroll; the call action is never allowed to depend on the
 * animation chunk having loaded.
 */

import { SITE } from '../config/site.js';
import Icon from './Icon.jsx';
import { PhoneCta } from './PhoneLink.jsx';

export default function CallPanel({
  eyebrow = 'Ready to talk?',
  title = 'Start with one clear phone call.',
  text = 'Tell us what is happening, where you are and when you need help. We will explain the available next step.',
  placement = 'cta_panel',
}) {
  return (
    <section className="cta-panel">
      <div className="wrap">
        <div className="cta-panel__inner">
          <div className="stack" data-anim="rise">
            {eyebrow !== '' ? <span className="eyebrow eyebrow--on-navy">{eyebrow}</span> : null}
            <h2>{title}</h2>
            {text !== '' ? <p>{text}</p> : null}
          </div>
          <div className="cta-panel__actions">
            <PhoneCta placement={placement} className="btn btn--call btn--lg" />
            <div className="cta-panel__hours">
              <Icon id="i-clock" className="ic ic--sm" />
              <span>{SITE.hours}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
