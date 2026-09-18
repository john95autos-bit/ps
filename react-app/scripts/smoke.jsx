/**
 * Render every route to a string and assert the page actually produced its
 * content. Run with `npm run smoke`.
 *
 * A client-rendered app compiles happily with a broken component — the failure
 * only shows up in a browser. This walks all 15 routes plus a 404 through
 * react-dom/server, which catches missing imports, bad props and anything that
 * throws during render, without needing a browser or a test runner.
 *
 * Effects do not run under renderToStaticMarkup, so this checks markup, not
 * behaviour: the reveal animations, meta tags, consent banner and call prompt
 * all live in effects and need a real browser to exercise.
 */

import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from '../src/App.jsx';
import { ROUTES } from '../src/config/routes.js';

const EXPECTATIONS = {
  '/': ['one clear call', 'Four services, described plainly', 'callbar'],
  '/pest-control': ['not a guess', 'Common household pests'],
  '/pest-control/cockroach-control': ['Cockroach control for homes', 'Possible signs'],
  '/pest-control/termite-control': ['Termite inspection', 'Possible signs'],
  '/pest-control/bed-bug-control': ['Bed bug inspection', 'Possible signs'],
  '/pest-control/rodent-control': ['Rodent control', 'Possible signs'],
  '/roofing': ['roof over your head', 'Leak investigation'],
  '/gardening': ['outdoor space', 'Hedge trimming'],
  '/plumbing': ['everyday plumbing problems', 'Blocked fixtures'],
  '/about': ['free platform that connects homeowners', 'Our standards'],
  '/service-areas': ['Local coverage', 'Northeast'],
  '/contact': ['One call. A clearer next step', 'Send an enquiry', 'f-consent'],
  '/privacy': ['Who we are', 'Calls and text messages'],
  '/terms': ['Website purpose', 'Governing terms'],
  '/disclaimer': ['Illustrative content', 'Verifying your contractor'],
};

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * React.lazy suspends on its first render and the router's Suspense boundary
 * emits the fallback. Rendering again once the chunk's promise has settled
 * gives the real page, so try a few passes before giving up.
 */
async function render(path) {
  let html = '';
  for (let attempt = 0; attempt < 5; attempt += 1) {
    html = renderToStaticMarkup(
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    );
    if (!html.includes('data-suspense')) return html;
    await tick();
  }
  return html;
}

async function main() {
  let failures = 0;
  const paths = [...ROUTES.map((r) => r.path), '/does-not-exist'];

  for (const path of paths) {
    let html = '';
    try {
      html = await render(path);
    } catch (error) {
      console.error(`FAIL  ${path} — threw during render: ${error.message}`);
      failures += 1;
      continue;
    }

    const problems = [];

    if (html.length < 2000) problems.push(`suspiciously short (${html.length} bytes)`);
    if (!html.includes('tel:+18447059874')) problems.push('no click-to-call link');
    if (!html.includes('sitefoot')) problems.push('footer missing');
    if (html.includes('undefined')) problems.push('literal "undefined" in output');
    if (html.includes('[object Object]')) problems.push('un-stringified object in output');

    const expected =
      path === '/does-not-exist' ? ['That page is not here'] : EXPECTATIONS[path] ?? [];
    for (const needle of expected) {
      if (!html.includes(needle)) problems.push(`missing expected copy: "${needle}"`);
    }

    if (problems.length) {
      console.error(`FAIL  ${path}`);
      problems.forEach((p) => console.error(`        ${p}`));
      failures += 1;
    } else {
      console.log(`  ok  ${path.padEnd(34)} ${String(html.length).padStart(6)} bytes`);
    }
  }

  console.log(
    failures === 0
      ? `\nAll ${paths.length} routes rendered.`
      : `\n${failures} of ${paths.length} routes failed.`
  );

  process.exit(failures === 0 ? 0 : 1);
}

main();
