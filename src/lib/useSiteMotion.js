/**
 * Scroll reveals and hero parallax — the port of initReveals() / initParallax()
 * from assets/js/site.js.
 *
 * Design rule carried over verbatim: nothing here may delay, cover or intercept
 * the phone call. Animation is layered on top of a page that already works.
 *
 * This file has caused two production incidents, both of which left whole
 * sections of a live ad landing page invisible. The rules below exist because
 * of them, and are worth keeping in that order of priority:
 *
 *  1. NEVER hide anything the visitor can already see. The pages are
 *     prerendered, so they paint complete before this runs. Hiding on-screen
 *     content in order to fade it back in means the visitor watches the page
 *     empty itself — and if anything then goes wrong, they are left staring at
 *     a coloured band. Only elements genuinely below the fold get an entrance.
 *  2. Own both ends of every tween in JS. The first incident came from
 *     `gsap.from({opacity: 0})` against a stylesheet that had already set
 *     opacity to 0: it animated 0 to 0. There is no longer a CSS pre-animation
 *     state to disagree with, so that class of bug cannot recur.
 *  3. Refresh after the page settles. ScrollTrigger measures on creation, when
 *     images and fonts have not landed. Stale positions mean triggers fire at
 *     the wrong scroll offset or get skipped, which was the second incident.
 *  4. Assume it will break anyway. A sweep rescues anything that ends up stuck
 *     and on screen, using an !important inline style, because GSAP writes
 *     inline styles and a class cannot beat one.
 *
 * GSAP is imported dynamically, so it lands in its own chunk and the first
 * paint never waits on 115 KB of animation code.
 */

import { useEffect } from 'react';

const FROM = {
  rise: { y: 22, opacity: 0 },
  fade: { opacity: 0 },
  left: { x: -22, opacity: 0 },
  right: { x: 22, opacity: 0 },
  scale: { scale: 0.96, opacity: 0 },
};

const TO = { opacity: 1, x: 0, y: 0, scale: 1 };

/** Everything visible, no animation. The reduced-motion and no-GSAP path. */
function showEverything() {
  document.querySelectorAll('[data-anim]').forEach((n) => n.classList.add('is-shown'));
}

/**
 * True when an element starts below the visible area, and so can be animated in
 * without the visitor watching it vanish first.
 */
const belowFold = (el) => el.getBoundingClientRect().top >= window.innerHeight * 0.9;

/**
 * Rescue anything that is on screen and still transparent.
 *
 * Uses !important on the inline style deliberately: GSAP writes its own inline
 * opacity, so a class — which is what the previous version of this used — is
 * powerless against it. Elements well below the fold are skipped, because those
 * are legitimately waiting their turn rather than stuck.
 */
function rescueStuck() {
  const limit = window.innerHeight * 1.25;

  document.querySelectorAll('[data-anim]').forEach((node) => {
    const rect = node.getBoundingClientRect();
    if (rect.top > limit || rect.bottom < 0) return;
    if (parseFloat(window.getComputedStyle(node).opacity) > 0.01) return;

    node.style.setProperty('opacity', '1', 'important');
    node.style.setProperty('transform', 'none', 'important');
  });
}

export default function useSiteMotion(pathname) {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* The stylesheet still carries `.js-motion [data-anim] { opacity: 0 }` from
       the PHP build. Nothing sets that class any more — the "from" state is
       owned entirely by GSAP below — but clear it defensively so a stale class
       from a previous route can never blank a page. */
    root.classList.remove('js-motion');

    if (reduceMotion) {
      showEverything();
      return undefined;
    }

    let cancelled = false;
    let ctx = null;
    let failsafe = 0;
    let onLoad = null;
    let onScroll = null;

    (async () => {
      let gsap;
      let ScrollTrigger;
      try {
        ({ gsap } = await import('gsap'));
        ({ ScrollTrigger } = await import('gsap/ScrollTrigger'));
      } catch {
        /* Animation is optional; content is not. */
        if (!cancelled) showEverything();
        return;
      }

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        /* Group siblings that share a [data-anim-group] parent so they stagger
           together instead of each firing its own ScrollTrigger. */
        const grouped = new Set();

        document.querySelectorAll('[data-anim-group]').forEach((group) => {
          const items = Array.from(group.querySelectorAll('[data-anim]'));
          if (!items.length) return;
          items.forEach((item) => grouped.add(item));

          /* Already on screen: leave it exactly as the prerendered HTML painted
             it. No hide, no fade, nothing to go wrong. */
          if (!belowFold(group)) return;

          gsap.fromTo(items, FROM.rise, {
            ...TO,
            duration: 0.62,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: { trigger: group, start: 'top 88%', once: true },
          });
        });

        document.querySelectorAll('[data-anim]').forEach((node) => {
          if (grouped.has(node)) return;
          if (!belowFold(node)) return;

          const kind = node.getAttribute('data-anim') || 'rise';
          const delay = parseFloat(node.getAttribute('data-anim-delay') || '0');

          gsap.fromTo(node, FROM[kind] || FROM.rise, {
            ...TO,
            duration: 0.6,
            delay,
            ease: 'power2.out',
            scrollTrigger: { trigger: node, start: 'top 90%', once: true },
          });
        });

        /* Hero parallax — background layers only, never text, and never on
           mobile where it costs scroll performance for no real gain. */
        if (window.matchMedia('(min-width: 900px)').matches) {
          gsap.utils.toArray('[data-parallax]').forEach((layer) => {
            gsap.to(layer, {
              yPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: layer.closest('section') || layer.parentElement,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.6,
              },
            });
          });
        }
      });

      /* Positions are measured on creation, before images and fonts have
         landed and while the page is still its wrong height. Refresh whenever
         that changes, or triggers fire at offsets that no longer exist. */
      ScrollTrigger.refresh();

      onLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', onLoad);
      if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

      /* Last line of defence, on a page whose only job is a phone call: sweep
         for anything on screen and still transparent. Throttled to one check
         per frame, and cheap — it only measures [data-anim] elements. */
      let queued = false;
      onScroll = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          rescueStuck();
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      failsafe = window.setTimeout(rescueStuck, 2500);
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      if (onLoad) window.removeEventListener('load', onLoad);
      if (onScroll) window.removeEventListener('scroll', onScroll);
      if (ctx) ctx.revert();
    };
  }, [pathname]);
}
