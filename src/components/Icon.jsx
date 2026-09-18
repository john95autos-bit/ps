/**
 * An icon from the self-hosted Font Awesome 6 subset.
 *
 * The glyph is attached by CSS via `.ic--<slug>::before { content: var(--fa) }`,
 * so the markup stays free of private-use characters that a screen reader might
 * try to announce. Decorative by definition — the accessible name always comes
 * from the surrounding link, button or heading.
 *
 * The font is subset to only the glyphs this site uses: 1.7 KB rather than the
 * 158 KB full solid face, and no CDN request.
 */
export default function Icon({ id, className = 'ic' }) {
  const slug = String(id).startsWith('i-') ? String(id).slice(2) : String(id);
  return <i className={`${className} ic--${slug}`} aria-hidden="true" />;
}
