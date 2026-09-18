/**
 * Pre-launch banner.
 *
 * While the launch gate has not passed, this appears on every page and
 * usePageMeta emits `noindex, nofollow`. It names the actual blockers rather
 * than saying "placeholder details are still in place": an operator who has
 * just set VITE_CONFIGURED=true and still sees this needs to know precisely
 * what is stopping the launch.
 *
 * It sits above the masthead in source order and scrolls away with the page —
 * it must never occupy fixed space on a phone, where every pixel above the fold
 * belongs to the call action.
 */

import { SITE } from '../config/site.js';
import { launchBlockers, siteIsConfigured } from '../lib/launch.js';
import Icon from './Icon.jsx';

export default function PrelaunchNotice() {
  if (siteIsConfigured()) return null;

  const blockers = launchBlockers();
  const claimed = SITE.configured === true;
  const sentence = blockers.join('; ');

  return (
    <div className="prelaunch">
      <div className="wrap">
        <Icon id="i-alert" className="ic ic--sm" />
        <strong>{claimed ? 'Launch blocked' : 'Pre-launch preview'}</strong>
        <span>
          {blockers.length ? (
            <>
              {sentence.charAt(0).toUpperCase() + sentence.slice(1)}. This site stays{' '}
              <code>noindex</code> until these are resolved.
            </>
          ) : (
            <>
              Set <code>VITE_CONFIGURED=true</code> in your environment to go live. See
              LAUNCH-CHECKLIST.md.
            </>
          )}
        </span>
      </div>
    </div>
  );
}
