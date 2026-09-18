/**
 * Scroll reveals and hero parallax — the port of initReveals() / initParallax()
 * from assets/js/site.js.
 *
 * Design rule carried over verbatim: nothing here may delay, cover or intercept
 * the phone call. Animation is layered on top of a page that already works.
 *
 *  · The pre-animation state lives in CSS behind `.js-motion`, which is only
 *    added once GSAP has actually loaded and motion is wanted. Without that
 *    class every [data-anim] element renders at full opacity, so a failed
 *    import, a blocked script or reduced-motion all land on "everything is
 *    visible".
 *  · GSAP is imported dynamically, so it lands in its own chunk and the first
 *    paint never waits on 116 KB of animation code.
 *  · Everything is torn down and rebuilt per route, because a client-side
 *    navigation replaces the DOM the triggers were measured against.
 */

import { useEffect } from 'react';

const FROM = {
  rise: { y: 22, opacity: 0 },
  fade: { opacity: 0 },
  left: { x: -22, opacity: 0 },
  right: { x: 22, opacity: 0 },
  scale: { scale: 0.96, opacity: 0 },
};

function showEverything() {
  document.querySelectorAll('[data-anim]').forEach((n) => n.classList.add('is-shown'));
}

/**
 * Last line of defence: reveal anything on the first screen that is still
 * invisible once the animations have had time to run.
 *
 * The reveal system depends on CSS and JS agreeing about the pre-animation
 * state, and they can silently disagree — `gsap.from({opacity: 0})` against a
 * stylesheet that already sets `opacity: 0` animates from 0 to 0 and leaves
 * every item permanently hidden. That shipped once. On a page whose only job is
 * to produce a phone call, a blank screen costs the whole click, and the
 * animation is decoration, so the failure has to resolve towards "visible".
 *
 * Scoped to roughly the first screen and a half: anything further down is
 * legitimately still hidden, waiting for its ScrollTrigger.
 *
 * `[data-anim].is-shown` and `.js-motion [data-anim]` have equal specificity,
 * and `.is-shown` is declared later in the stylesheet, so it wins. GSAP's own
 * inline styles still beat both, so a working animation is unaffected.
 */
function revealStuckAboveTheFold() {
  const limit = window.innerHeight * 1.5;

  document.querySelectorAll('[data-anim]').forEach((node) => {
    if (node.getBoundingClientRect().top > limit) return;
    if (parseFloat(window.getComputedStyle(node).opacity) > 0) return;
    node.classList.add('is-shown');
  });
}

export default function useSiteMotion(pathname) {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      root.classList.remove('js-motion');
      showEverything();
      return undefined;
    }

    let cancelled = false;
    let ctx = null;
    let failsafe = 0;

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
      root.classList.add('js-motion');

      ctx = gsap.context(() => {
        /* Group siblings that share a [data-anim-group] parent so they stagger
           together instead of each firing its own ScrollTrigger. */
        const grouped = new Set();

        document.querySelectorAll('[data-anim-group]').forEach((group) => {
          const items = Array.from(group.querySelectorAll('[data-anim]'));
          if (!items.length) return;
          items.forEach((i) => grouped.add(i));

          /* `to`, never `from`. The pre-animation state is already applied by
             CSS (`.js-motion [data-anim] { opacity: 0 }` plus a per-kind
             transform), so `gsap.from({opacity: 0})` would animate from 0 to
             the element's current value — which is also 0, leaving every
             grouped item permanently invisible. Animating TO the resting state
             also means each item keeps its own rise/fade/left/right/scale
             starting transform without this code having to know which. */
          gsap.to(items, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.62,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: { trigger: group, start: 'top 88%', once: true },
          });
        });

        document
          .querySelectorAll('[data-anim]')
          .forEach((node) => {
            if (grouped.has(node)) return;
            const kind = node.getAttribute('data-anim') || 'rise';
            const delay = parseFloat(node.getAttribute('data-anim-delay') || '0');

            gsap.fromTo(
              node,
              FROM[kind] || FROM.rise,
              {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.6,
                delay,
                ease: 'power2.out',
                scrollTrigger: { trigger: node, start: 'top 90%', once: true },
              }
            );
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

      /* Late-loading images change section heights; recalculate trigger
         positions once everything has settled so reveals fire at the right
         scroll offsets. */
      ScrollTrigger.refresh();

      failsafe = window.setTimeout(revealStuckAboveTheFold, 2500);
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      if (ctx) ctx.revert();
    };
  }, [pathname]);
}
