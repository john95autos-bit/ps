/**
 * The compact head every sub-page opens with.
 *
 * Two shapes, decided by whether an image was passed:
 *   with an image  -> .pagehead + .pagehead__media + .pagehead__scrim
 *   without one    -> .pagehead.pagehead--plain (flat navy, no photo request)
 *
 * Props (all optional):
 *   eyebrow   — short uppercase label above the heading
 *   title     — plain-text <h1>; the page's only h1
 *   text      — plain-text lead paragraph
 *   image     — image path registered in IMAGES
 *   imageAlt  — alt text for it; '' leaves the photo decorative, which is the
 *               right answer for a backdrop sitting under a scrim
 *   crumbs    — [{ label, href }]; href null renders a plain span, and the last
 *               crumb always renders as <span aria-current="page">
 *
 * No [data-anim] anywhere in here on purpose: this block is the first screen on
 * every sub-page, and the first screen must be painted and tappable without
 * waiting on the animation chunk.
 */

import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import Img from './Img.jsx';

export default function PageHero({
  eyebrow = '',
  title = '',
  text = '',
  image = '',
  imageAlt = '',
  crumbs = [],
}) {
  const list = Array.isArray(crumbs) ? crumbs : [];
  const lastIndex = list.length - 1;

  return (
    <section className={`pagehead${image === '' ? ' pagehead--plain' : ''}`}>
      {image !== '' ? (
        <>
          <div className="pagehead__media">
            <Img src={image} alt={imageAlt} fetchPriority="high" />
          </div>
          <div className="pagehead__scrim" />
        </>
      ) : null}

      <div className="wrap">
        <div className="pagehead__inner">
          {list.length ? (
            <nav className="crumbs" aria-label="Breadcrumb">
              {list.map((crumb, i) => {
                const label = String(crumb?.label ?? '');
                const href = crumb?.href ?? '';
                const isEnd = i === lastIndex;

                return (
                  <span key={`${label}-${i}`}>
                    {i > 0 ? (
                      <span className="sep">
                        <Icon id="i-chevron-right" className="ic ic--sm" />
                      </span>
                    ) : null}
                    {isEnd ? (
                      <span aria-current="page">{label}</span>
                    ) : href ? (
                      <Link to={href}>{label}</Link>
                    ) : (
                      <span>{label}</span>
                    )}
                  </span>
                );
              })}
            </nav>
          ) : null}

          {eyebrow !== '' ? <p className="eyebrow eyebrow--on-navy">{eyebrow}</p> : null}
          <h1>{title}</h1>
          {text !== '' ? <p className="lede lede--on-navy">{text}</p> : null}
        </div>
      </div>
    </section>
  );
}
