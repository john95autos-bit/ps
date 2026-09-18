/**
 * The document shell and the route table — the port of inc/layout.php plus the
 * dispatch half of index.php.
 *
 * Structure matches the PHP output exactly so the stylesheet needs no changes:
 *   skip link -> pre-launch banner -> header -> <main> -> footer -> call bar
 *   -> consent banner -> call prompt
 */

import { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MobileCallBar from './components/MobileCallBar.jsx';
import CookieConsent from './components/CookieConsent.jsx';
import CallPopup from './components/CallPopup.jsx';
import PrelaunchNotice from './components/PrelaunchNotice.jsx';
import GoogleAds from './components/GoogleAds.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import useSiteMotion from './lib/useSiteMotion.js';

import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';

/* Only the home page is in the initial bundle. Everything else splits, so an ad
   click that lands on / does not download the legal documents to get there. */
const PestControl = lazy(() => import('./pages/PestControl.jsx'));
const PestDetail = lazy(() => import('./pages/PestDetail.jsx'));
const Service = lazy(() => import('./pages/Service.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const ServiceAreas = lazy(() => import('./pages/ServiceAreas.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Legal = lazy(() => import('./pages/Legal.jsx'));

export default function App() {
  const location = useLocation();

  /* Reveals are re-bound per route, because a client-side navigation replaces
     the DOM the ScrollTriggers were measured against. */
  useSiteMotion(location.pathname);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <GoogleAds />
      <ScrollToTop />
      <PrelaunchNotice />
      <Header />

      <main id="main-content">
        <ErrorBoundary key={location.pathname}>
          <Suspense fallback={<div className="section" data-suspense="" aria-hidden="true" />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/pest-control" element={<PestControl />} />
              <Route path="/pest-control/:slug" element={<PestDetail />} />
              <Route path="/roofing" element={<Service slug="roofing" />} />
              <Route path="/gardening" element={<Service slug="gardening" />} />
              <Route path="/plumbing" element={<Service slug="plumbing" />} />
              <Route path="/about" element={<About />} />
              <Route path="/service-areas" element={<ServiceAreas />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Legal slug="privacy" />} />
              <Route path="/terms" element={<Legal slug="terms" />} />
              <Route path="/disclaimer" element={<Legal slug="disclaimer" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer />
      <MobileCallBar />
      <CookieConsent />
      <CallPopup />
    </>
  );
}
