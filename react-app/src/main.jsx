/**
 * Entry point.
 *
 * BrowserRouter, not HashRouter: vercel.json rewrites every unmatched path to
 * index.html, so real URLs work on a hard refresh and in an ad's final URL.
 * A Google Ads final URL containing a # fragment is a common cause of a
 * "destination mismatch" disapproval, which is why the hash router is avoided.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './styles/site.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
