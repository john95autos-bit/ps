import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from '../src/App.jsx';
import { ROUTES } from '../src/config/routes.js';

const tick = () => new Promise((r) => setTimeout(r, 0));

async function render(path) {
  let html = '';
  for (let i = 0; i < 5; i += 1) {
    html = renderToStaticMarkup(<StaticRouter location={path}><App /></StaticRouter>);
    if (!html.includes('data-suspense')) return html;
    await tick();
  }
  return html;
}

// Strip the shared chrome so we measure the PAGE, not the header/footer.
function pageText(html) {
  const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/);
  return (main ? main[1] : html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const rows = [];
  for (const route of ROUTES) {
    const html = await render(route.path);
    const text = pageText(html);
    const words = text ? text.split(' ').length : 0;
    const body = html.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1] ?? '';
    rows.push({
      path: route.path,
      words,
      h2: (body.match(/<h2/g) || []).length,
      h3: (body.match(/<h3/g) || []).length,
      sections: (body.match(/<section/g) || []).length,
    });
  }

  rows.sort((a, b) => a.words - b.words);
  console.log('  words   h2  h3  sec   route');
  for (const r of rows) {
    const flag = r.words < 350 ? '  << thin' : r.words < 600 ? '  < light' : '';
    console.log(
      `  ${String(r.words).padStart(5)}  ${String(r.h2).padStart(3)} ${String(r.h3).padStart(3)} ${String(r.sections).padStart(4)}   ${r.path}${flag}`
    );
  }
  const total = rows.reduce((s, r) => s + r.words, 0);
  console.log(`\n  ${rows.length} pages, ${total} words total, median ${rows[Math.floor(rows.length/2)].words}`);
}
main();
