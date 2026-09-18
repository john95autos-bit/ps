/**
 * Restores the browser behaviour a multi-page site gets for free: a new page
 * starts at the top.
 *
 * An in-page anchor (#pests, #enquiry) is honoured instead, because the whole
 * point of those links is to land somewhere specific.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
