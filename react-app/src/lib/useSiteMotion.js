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

          gsap.from(items, {
            opacity: 0,
            y: 22,
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
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, [pathname]);
}
