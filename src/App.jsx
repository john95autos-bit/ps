/**
 * The document shell and the route table — the port of inc/layout.php plus the
 * dispatch half of index.php.
 *
 * Structure matches the PHP output exactly so the stylesheet needs no changes:
 *   skip link -> pre-launch banner -> header -> <main> -> footer -> call bar
 *   -> consent banner -> call prompt
 */

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
import PestControl from './pages/PestControl.jsx';
import PestDetail from './pages/PestDetail.jsx';
import Service from './pages/Service.jsx';
import About from './pages/About.jsx';
import ServiceAreas from './pages/ServiceAreas.jsx';
import Contact from './pages/Contact.jsx';
import Legal from './pages/Legal.jsx';

/* Every page is imported eagerly, and deliberately so.
 *
 * These were React.lazy chunks, which broke hydration: the prerendered HTML
 * holds the finished page, but on the client the lazy component has not loaded
 * at hydration time, so React renders the Suspense fallback instead, sees a
 * mismatch (error #418) and throws the server markup away to re-render from
 * scratch. That defeated the entire point of prerendering and left the scroll
 * reveals attached to a DOM that had been replaced underneath them.
 *
 * The saving was never real anyway — all seven page modules together are about
 * 35 KB, against a round trip per navigation. */

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
        </ErrorBoundary>
      </main>

      <Footer />
      <MobileCallBar />
      <CookieConsent />
      <CallPopup />
    </>
  );
}
