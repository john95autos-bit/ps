/**
 * An <img> carrying the intrinsic width/height from config, so the browser can
 * reserve space and avoid layout shift — the port of img_tag().
 *
 * Every bundled photo is registered in IMAGES with its real dimensions. An
 * unregistered src still renders; it just does not get the reservation, which
 * is the one thing worth noticing in a Lighthouse run.
 */

import { IMAGES } from '../config/site.js';

export default function Img({ src, alt = '', fetchPriority, ...rest }) {
  const size = IMAGES[src] ?? {};

  /* React 18 does not recognise the camelCase `fetchPriority` prop and drops it
     with a console warning; React 19 does. Emitting the lowercase HTML
     attribute works on both, and this attribute is worth keeping — it is what
     tells the browser the hero image is the LCP candidate. */
  const priority = fetchPriority ? { fetchpriority: fetchPriority } : {};

  return (
    <img
      src={src}
      alt={alt}
      {...(size.width ? { width: size.width, height: size.height } : {})}
      decoding="async"
      {...priority}
      {...rest}
    />
  );
}
