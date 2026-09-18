/**
 * The accordion used on the home, service and pest pages.
 *
 * One open at a time, first open on load — the same behaviour the PHP build's
 * site.js applied, but driven by state rather than by toggling `hidden` on the
 * DOM, so the open panel is always what React rendered.
 *
 * Every answer is in the markup whether open or not, so the content is present
 * for a crawler and for find-in-page; the closed ones are just collapsed.
 *
 * The icon is always i-plus. `.faq__q[aria-expanded="true"] .faq__icon` rotates
 * it 45deg into a minus, so the open and closed states differ by one attribute
 * and the markup never has to change.
 */

import { useId, useState } from 'react';
import Icon from './Icon.jsx';

export default function Faq({ items = [] }) {
  const list = (Array.isArray(items) ? items : []).filter(Boolean);
  const [openIndex, setOpenIndex] = useState(0);
  /* Two accordions on one page must not hand out colliding panel ids. */
  const blockId = useId().replace(/:/g, '');

  return (
    <div className="faq" data-faq="">
      {list.map((item, index) => {
        const open = index === openIndex;
        const answerId = `${blockId}-answer-${index}`;

        return (
          <div className="faq__item" data-faq-item="" key={answerId}>
            <button
              className="faq__q"
              type="button"
              data-faq-q=""
              aria-expanded={open}
              aria-controls={answerId}
              onClick={() => setOpenIndex(open ? -1 : index)}
            >
              <span>{item.question ?? ''}</span>
              <span className="faq__icon">
                <Icon id="i-plus" className="ic ic--sm" />
              </span>
            </button>
            <div className="faq__a" id={answerId} data-faq-a="" hidden={!open}>
              <p>{item.answer ?? ''}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
