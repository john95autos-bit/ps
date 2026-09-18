/**
 * Entry point.
 *
 * BrowserRouter, not HashRouter: vercel.json rewrites every unmatched path to
 * index.html, so real URLs work on a hard refresh and in an ad's final URL.
 * A Google Ads final URL containing a # fragment is a common cause of a
 * "destination mismatch" disapproval, which is why the hash router is avoided.
 */

import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './styles/site.css';
import App from './App.jsx';

const container = document.getElementById('root');

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

/* scripts/prerender.jsx writes real HTML into #root at build time, so the
   browser paints the finished page before this bundle has even parsed. Adopt
   that markup instead of discarding and re-creating it. The `createRoot` branch
   is the dev server, where #root really is empty. */
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
