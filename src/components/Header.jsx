/**
 * Site chrome: desktop top bar, sticky masthead, mobile drawer.
 *
 * Structure notes carried over from the PHP partial:
 * · .topbar is desktop-only (the stylesheet reveals it at 900px), so the phone
 *   number never loses vertical space to it on the screens that convert.
 * · The drawer is a child of .masthead on purpose. .masthead carries a
 *   backdrop-filter, which makes it the containing block for fixed-position
 *   descendants, so the drawer's `inset: 64px 0 auto` resolves against the
 *   header itself and stays pinned to its lower edge at every scroll position.
 * · The closed drawer carries `inert` plus aria-hidden, so its links leave the
 *   tab order and the accessibility tree together.
 */

import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE } from '../config/site.js';
import { NAV_ITEMS } from '../config/routes.js';
import Icon from './Icon.jsx';
import { PhoneCta, PhoneCtaStacked } from './PhoneLink.jsx';

/** True when href is the current page or one of its ancestors. */
function isActive(href, now) {
  if (href === '/') return now === '/';
  return now === href || now.startsWith(`${href.replace(/\/+$/, '')}/`);
}

/* The drawer carries the primary nav plus any secondary destination not already
   in it. Filtered rather than appended blindly: Contact is in the main nav, and
   a hardcoded append would have listed it twice. */
const EXTRA_DRAWER_ITEMS = [
  { label: 'Service areas', href: '/service-areas' },
  { label: 'Contact', href: '/contact' },
];

const DRAWER_ITEMS = [
  ...NAV_ITEMS,
  ...EXTRA_DRAWER_ITEMS.filter((e) => !NAV_ITEMS.some((n) => n.href === e.href)),
];

export default function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const drawerRef = useRef(null);
  const toggleRef = useRef(null);

  /* Header shadow once the page has moved. */
  useEffect(() => {
    const apply = () => setStuck(window.scrollY > 8);
    apply();
    window.addEventListener('scroll', apply, { passive: true });
    return () => window.removeEventListener('scroll', apply);
  }, []);

  /* Close on route change — a drawer left open across a navigation covers the
     page the visitor just asked for. */
  useEffect(() => setOpen(false), [pathname]);

  /* `inert` is set imperatively so the behaviour is identical on React 18 and
     19, which disagree about whether it is a known boolean prop. */
  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;
    if (open) {
      el.removeAttribute('inert');
      el.removeAttribute('aria-hidden');
    } else {
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  /* Crossing to desktop with the drawer open leaves an orphaned panel. */
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const desktop = window.matchMedia('(min-width: 900px)');
    const onChange = (e) => { if (e.matches) setOpen(false); };
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, []);

  const navLink = (item, extra = null) => (
    <Link
      key={item.href}
      className={isActive(item.href, pathname) ? 'is-active' : undefined}
      to={item.href}
      aria-current={pathname === item.href ? 'page' : undefined}
    >
      {extra ? <span>{item.label}</span> : item.label}
      {extra}
    </Link>
  );

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span className="topbar__item">
            <Icon id="i-pin" className="ic ic--sm" />
            <span>Serving {SITE.primaryArea} and nearby areas</span>
          </span>
          <span className="topbar__item">
            <Icon id="i-clock" className="ic ic--sm" />
            <span>{SITE.hours}</span>
          </span>
        </div>
      </div>

      <header className={`masthead${stuck ? ' is-stuck' : ''}`} data-masthead="">
        <div className="wrap">
          {/* The visible brand word is the short form while SITE.name drives the
              accessible label — the same split the original markup used. */}
          <Link className="brand" to="/" aria-label={`${SITE.name} home`}>
            <span className="brand__mark">
              <Icon id="i-house" />
            </span>
            <span className="brand__text">
              <strong>{SITE.brandShort}</strong>
              <small>Home services</small>
            </span>
          </Link>

          <nav className="mainnav" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => navLink(item))}
          </nav>

          <PhoneCtaStacked
            placement="header_desktop"
            className="btn btn--call btn--stack masthead__call"
          />

          <button
            ref={toggleRef}
            className="navtoggle"
            type="button"
            data-navtoggle=""
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>

        <div
          ref={drawerRef}
          className={`drawer${open ? ' is-open' : ''}`}
          id="mobile-nav"
          data-drawer=""
        >
          <div className="drawer__inner">
            <nav aria-label="Mobile navigation">
              {DRAWER_ITEMS.map((item) =>
                navLink(item, <Icon key="chev" id="i-chevron-right" className="ic ic--sm" />)
              )}
            </nav>

            <div className="drawer__cta">
              <PhoneCta placement="drawer" className="btn btn--call btn--block" />
            </div>

            <p className="drawer__hours">
              <span className="pill">
                <Icon id="i-clock" className="ic ic--sm" />
                <span>{SITE.hours}</span>
              </span>
            </p>
          </div>
        </div>
      </header>
    </>
  );
}
