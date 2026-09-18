/**
 * The sticky mobile call bar — the single highest-value element on the site.
 *
 * Hidden above 900px by the stylesheet, where the masthead CTA takes over.
 *
 * It publishes its measured height as --callbar-h so the page reserves exactly
 * that much bottom padding and the consent banner stacks above it rather than
 * over it.
 *
 * On the reveal: the PHP build added `.js` to <html> from an inline script in
 * <head>, which hid the bar before first paint and left it hidden until
 * site.js — the third of three deferred scripts, 136 KB in — added `.is-in`.
 * The stylesheet's own comment said the bar "must never depend on 129 KB of
 * deferred JavaScript to appear", and it did. Here `.js` is added on mount and
 * `.is-in` on the very next frame, so the hide and the reveal are two frames
 * apart and the bar is never waiting on the animation bundle.
 */

import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { PhoneCtaStacked } from './PhoneLink.jsx';

export default function MobileCallBar() {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    const publishHeight = () => {
      const desktop = window.matchMedia('(min-width: 900px)').matches;
      document.documentElement.style.setProperty(
        '--callbar-h',
        `${desktop ? 0 : bar.offsetHeight}px`
      );
    };

    document.documentElement.classList.add('js');
    const frame = requestAnimationFrame(() => {
      bar.classList.add('is-in');
      publishHeight();
    });

    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(publishHeight, 150);
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="callbar" data-callbar="" ref={barRef}>
      <PhoneCtaStacked
        placement="callbar_sticky"
        className="btn btn--call btn--stack callbar__call"
      />

      {/* Secondary, deliberately small and quiet: it must never compete with
          the amber button beside it. */}
      <Link
        className="callbar__aux"
        to="/contact"
        aria-label="What to have ready before you call"
      >
        <Icon id="i-clipboard" />
      </Link>
    </div>
  );
}
