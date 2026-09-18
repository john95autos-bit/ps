/**
 * Load every route in a real browser and fail if any content is invisible.
 *
 * `npm run smoke` renders through react-dom/server, which never runs effects —
 * so the entire reveal system is invisible to it. Two separate bugs have now
 * shipped in exactly that blind spot, both leaving whole sections at opacity 0
 * on a live page. This closes it.
 *
 *   npm run check            # against the local production build
 *   npm run check -- <url>   # against a deployed site
 *
 * What it asserts, per route, after the page has settled:
 *   · no [data-anim] element is still fully transparent
 *   · no section is rendering as a tall empty band
 *   · the page's own h1 is actually visible
 *   · a click-to-call link is present and visible
 *   · nothing threw in the console
 *
 * It also scrolls the full page, because a reveal that only fires on scroll is
 * exactly the thing a static screenshot of the top of the page would miss.
 */

import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:4173';

const ROUTES = [
  '/',
  '/pest-control',
  '/pest-control/cockroach-control',
  '/pest-control/termite-control',
  '/pest-control/bed-bug-control',
  '/pest-control/rodent-control',
  '/roofing',
  '/gardening',
  '/plumbing',
  '/about',
  '/service-areas',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
];

/**
 * The timed call prompt opens a few seconds in and locks body scrolling while
 * it is up, which would stop this walk before it started. A real visitor
 * dismisses it; so does this.
 */
async function dismissCallPopup(page) {
  try {
    await page.waitForSelector('[data-callpop]:not([hidden])', { timeout: 6000 });
    await page.click('[data-callpop-close]');
    await page.waitForTimeout(400);
  } catch {
    /* Popup disabled or already gone — nothing to dismiss. */
  }
}

/**
 * Walk the whole page so every scroll-triggered reveal gets its chance.
 *
 * The stylesheet sets `scroll-behavior: smooth`, which makes window.scrollTo
 * animate. A stepped walk then never arrives — each hop is still easing when
 * the next one starts, and the page ends up a third of the way down while the
 * loop believes it reached the bottom. Forcing instant scrolling for the walk
 * is the difference between testing the site and testing the easing curve.
 */
async function scrollThrough(page) {
  await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.75;
    let y = 0;
    let guard = 0;
    while (y < document.body.scrollHeight && guard < 200) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 140));
      y += step;
      guard += 1;
    }
    /* Settle at the very bottom, then return, so nothing is skipped by a hop
       that overshot the final section. */
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });
}

async function auditRoute(page, route) {
  const errors = [];
  const onError = (e) => errors.push(e.message);
  const onConsole = (m) => {
    if (m.type() === 'error') errors.push(m.text());
  };

  page.on('pageerror', onError);
  page.on('console', onConsole);

  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle', timeout: 45000 });

  /* The failure that started all this: arrive at a page and find a coloured
     band where the content should be. Measured before any scrolling, because
     that is what the visitor sees. Pages are prerendered, so anything in the
     first screen must be visible from the moment it paints. */
  await page.waitForTimeout(1200);
  const aboveFold = await page.evaluate(() => {
    const stuck = [];
    document.querySelectorAll('[data-anim]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.9 || r.bottom < 0) return;
      if (parseFloat(getComputedStyle(el).opacity) > 0.01) return;
      stuck.push((el.textContent || '').trim().slice(0, 44));
    });
    return stuck;
  });

  await dismissCallPopup(page);
  /* Past the 2.5s failsafe, so a pass here means the reveals themselves work
     rather than the safety net having papered over them. */
  await page.waitForTimeout(3200);
  await scrollThrough(page);

  const result = await page.evaluate(() => {
    const visible = (el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return (
        parseFloat(s.opacity) > 0.01 &&
        s.visibility !== 'hidden' &&
        s.display !== 'none' &&
        r.width > 0 &&
        r.height > 0
      );
    };

    const hiddenAnims = [];
    document.querySelectorAll('[data-anim]').forEach((el) => {
      const s = getComputedStyle(el);
      if (parseFloat(s.opacity) <= 0.01) {
        hiddenAnims.push({
          anim: el.getAttribute('data-anim'),
          cls: (el.className || '').toString().slice(0, 40),
          text: (el.textContent || '').trim().slice(0, 50),
        });
      }
    });

    /* A section taller than half the viewport whose text is not visible is the
       "big empty coloured band" failure, stated as a measurement. */
    const emptyBands = [];
    document.querySelectorAll('main section').forEach((section) => {
      const r = section.getBoundingClientRect();
      if (r.height < window.innerHeight * 0.5) return;
      const words = (section.textContent || '').trim().split(/\s+/).filter(Boolean).length;
      if (words < 5) return;
      const shown = Array.from(section.querySelectorAll('h1,h2,h3,p,li,strong')).filter(visible);
      if (shown.length === 0) {
        emptyBands.push({
          cls: (section.className || '').toString().slice(0, 40),
          height: Math.round(r.height),
          words,
        });
      }
    });

    const h1 = document.querySelector('main h1');
    const tel = document.querySelector('a[href^="tel:"]');

    return {
      hiddenAnims,
      emptyBands,
      totalAnims: document.querySelectorAll('[data-anim]').length,
      h1Text: h1 ? h1.textContent.trim().slice(0, 48) : null,
      h1Visible: h1 ? visible(h1) : false,
      telVisible: tel ? visible(tel) : false,
      jsMotion: document.documentElement.classList.contains('js-motion'),
    };
  });

  page.off('pageerror', onError);
  page.off('console', onConsole);

  return { ...result, aboveFold, errors };
}

/**
 * Second pass, on a phone.
 *
 * Two things only go wrong at this width, and both shipped: a document wider
 * than the screen, and a call prompt whose close or call button falls outside
 * it. The first causes the second — everything position:fixed sizes to the
 * overflowed width — so they are checked together.
 */
async function auditMobile(browser, route) {
  const page = await browser.newPage({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  try {
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });

    /* The site's own stated rule, from the page comments: the primary call
       button is above the fold at 375x667, on arrival, with room for the
       sticky bar beneath it. Measured before anything else happens. The hero
       once ran to 677px on a 667px screen, which put the one element the ad
       spend exists for below the bottom edge on the primary landing page. */
    const arrival = await page.evaluate(() => {
      const cta = document.querySelector('.hero .btn--call, .pagehead .btn--call');
      if (!cta) return null;
      return { bottom: Math.round(cta.getBoundingClientRect().bottom), vh: window.innerHeight };
    });

    await page.waitForSelector('[data-callpop]:not([hidden])', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(600);

    /* What a visitor does next: tries to scroll. Body is locked, so the gesture
       lands on the sheet. The wrapper was a scroll container with 43px of
       overflow from a decorative pseudo-element, and one tick dragged the card
       and its scrim up, exposing un-dimmed page beneath. */
    const sheet = await page.$('[data-callpop]:not([hidden])');
    if (sheet) {
      await page.mouse.move(187, 500);
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(400);
    }

    const found = await page.evaluate(() => {
      const box = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          top: Math.round(r.top),
          left: Math.round(r.left),
          right: Math.round(r.right),
          bottom: Math.round(r.bottom),
        };
      };

      const vw = document.documentElement.clientWidth;
      const problems = [];

      if (document.documentElement.scrollWidth > vw + 1) {
        problems.push(
          'document is ' + document.documentElement.scrollWidth + 'px wide on a ' + vw + 'px screen'
        );
      }

      const card = box('.callpop__card');
      if (card) {
        const close = box('.callpop__close');
        const cta = box('.callpop__card .btn--call');
        if (card.right > vw + 1 || card.left < -1) problems.push('prompt card overflows the screen');
        if (close && close.right > vw + 1) problems.push('prompt close button is off-screen');
        if (cta && cta.bottom > window.innerHeight + 1) {
          problems.push('prompt call button is below the fold');
        }

        /* After the scroll gesture above, the sheet must not have moved. */
        const wrapper = document.querySelector('.callpop');
        const scrim = box('.callpop__scrim');
        if (wrapper && wrapper.scrollTop > 0) {
          problems.push('sheet scrolled by ' + wrapper.scrollTop + 'px when the visitor tried to scroll');
        }
        if (card.bottom < window.innerHeight - 1) {
          problems.push('gap of ' + (window.innerHeight - card.bottom) + 'px below the sheet');
        }
        if (scrim && scrim.bottom < window.innerHeight - 1) {
          problems.push('scrim no longer covers the bottom ' + (window.innerHeight - scrim.bottom) + 'px');
        }

        /* While the prompt is open it must be the only thing on screen. The
           sticky call bar is fixed and carries a backdrop-filter, so trusting
           z-index alone to keep it underneath is fragile compositing — and when
           it slips, the visitor gets a second amber call button and a second
           copy of the phone number directly below the dialog. */
        const bar = document.querySelector('.callbar');
        if (bar) {
          const bs = getComputedStyle(bar);
          const br = bar.getBoundingClientRect();
          const showing =
            bs.display !== 'none' &&
            bs.visibility !== 'hidden' &&
            parseFloat(bs.opacity) > 0.01 &&
            br.height > 0 &&
            br.top < window.innerHeight;
          if (showing) problems.push('sticky call bar still showing beneath the prompt');
        }

        /* Nothing outside the dialog may be painted on top of it. */
        const midX = Math.round(vw / 2);
        const samples = [
          card.top + 24,
          Math.round((card.top + window.innerHeight) / 2),
          window.innerHeight - 6,
        ];
        for (const y of samples) {
          const hit = document.elementFromPoint(midX, Math.round(y));
          if (hit && !hit.closest('.callpop')) {
            problems.push('something outside the prompt paints over it at y=' + Math.round(y));
            break;
          }
        }
      }

      return problems;
    });

    /* Room for the sticky bar (about 64px on a phone) plus a little air. */
    if (arrival && arrival.bottom > arrival.vh - 72) {
      found.push(
        'primary call button not above the fold on arrival (bottom ' +
          arrival.bottom + 'px of ' + arrival.vh + 'px)'
      );
    }

    return found;
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  let failures = 0;
  console.log(`  checking ${BASE}\n`);

  for (const route of ROUTES) {
    let r;
    try {
      r = await auditRoute(page, route);
    } catch (error) {
      console.log(`  FAIL  ${route} — ${error.message.split('\n')[0]}`);
      failures += 1;
      continue;
    }

    const problems = [];
    if (r.aboveFold.length) {
      problems.push(
        `${r.aboveFold.length} element(s) invisible on arrival, before any scroll: ` +
          r.aboveFold.slice(0, 2).map((t) => `"${t}"`).join(', ')
      );
    }
    if (r.hiddenAnims.length) {
      problems.push(`${r.hiddenAnims.length}/${r.totalAnims} [data-anim] still invisible`);
    }
    if (r.emptyBands.length) {
      problems.push(
        `${r.emptyBands.length} empty band(s): ` +
          r.emptyBands.map((b) => `${b.cls || '?'} ${b.height}px/${b.words}w`).join(', ')
      );
    }
    if (!r.h1Visible) problems.push('h1 not visible');
    if (!r.telVisible) problems.push('no visible click-to-call link');
    if (r.errors.length) problems.push(`console: ${r.errors[0].slice(0, 80)}`);

    if (problems.length) {
      failures += 1;
      console.log(`  FAIL  ${route}`);
      problems.forEach((p) => console.log(`          ${p}`));
      r.hiddenAnims.slice(0, 4).forEach((h) =>
        console.log(`          hidden: [${h.anim}] .${h.cls} "${h.text}"`)
      );
    } else {
      console.log(
        `    ok  ${route.padEnd(34)} ${String(r.totalAnims).padStart(3)} reveals, first screen clean`
      );
    }
  }

  await page.close();

  console.log('');
  console.log('  mobile (375x667)');
  console.log('');

  for (const route of ROUTES) {
    let problems;
    try {
      problems = await auditMobile(browser, route);
    } catch (error) {
      console.log('  FAIL  ' + route + ' — ' + error.message.slice(0, 80));
      failures += 1;
      continue;
    }

    if (problems.length) {
      failures += 1;
      console.log('  FAIL  ' + route);
      problems.forEach((msg) => console.log('          ' + msg));
    } else {
      console.log('    ok  ' + route.padEnd(34) + ' fits the screen');
    }
  }

  await browser.close();

  console.log(
    failures === 0
      ? `\n  All ${ROUTES.length} routes pass on desktop and mobile.`
      : `\n  ${failures} check(s) failed.`
  );
  process.exit(failures === 0 ? 0 : 1);
}

main();
