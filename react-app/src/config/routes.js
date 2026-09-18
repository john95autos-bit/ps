/**
 * Route table — the port of inc/router.php.
 *
 * Every path the site answers on is listed here. scripts/generate-seo.js builds
 * sitemap.xml from this same table, so a new route can never be added to the
 * site and forgotten in the sitemap.
 *
 * Title and description strings may contain {area}, {coverage} and {name}; all
 * three are filled from src/config/site.js by metaText(), so changing the
 * business coverage in one place updates every page title.
 */

import { SITE } from './site.js';

export const ROUTES = [
  {
    path: '/',
    view: 'home',
    title: '{coverage} Home Services | Pest Control, Roofing, Gardening & Plumbing',
    description:
      'Connect with local independent contractors for pest control, roofing, gardening and plumbing, {coverage} across {area}. Free to use, clear scope, no payment taken online.',
    priority: 1.0,
    changefreq: 'weekly',
  },
  {
    path: '/pest-control',
    view: 'pest-control',
    title: '{coverage} Pest Control | Find a Local Contractor',
    description:
      'Inspection-led residential pest-control guidance and local contractors {coverage}. Cockroach, termite, bed bug and rodent service information.',
    priority: 0.9,
  },
  {
    path: '/pest-control/cockroach-control',
    view: 'pest-detail',
    slug: 'cockroach-control',
    title: 'Cockroach Control | {coverage} Pest Contractors',
    description:
      'Residential cockroach inspection, treatment planning and preparation guidance from local contractors {coverage}.',
  },
  {
    path: '/pest-control/termite-control',
    view: 'pest-detail',
    slug: 'termite-control',
    title: 'Termite Inspection & Control | {coverage}',
    description:
      'Inspection-led termite information and control guidance for residential properties, from local contractors {coverage}.',
  },
  {
    path: '/pest-control/bed-bug-control',
    view: 'pest-detail',
    slug: 'bed-bug-control',
    title: 'Bed Bug Control | {coverage} Contractors',
    description:
      'Bed bug inspection, preparation and treatment-plan guidance for homes, from local contractors {coverage}.',
  },
  {
    path: '/pest-control/rodent-control',
    view: 'pest-detail',
    slug: 'rodent-control',
    title: 'Rodent Control | {coverage} Contractors',
    description:
      'Residential rodent inspection, control and entry-point guidance from local contractors {coverage}.',
  },
  {
    path: '/roofing',
    view: 'service',
    slug: 'roofing',
    title: '{coverage} Roofing Services | Local Roofing Contractors',
    description:
      'Residential roof inspections, maintenance and repairs from local independent contractors {coverage}.',
  },
  {
    path: '/gardening',
    view: 'service',
    slug: 'gardening',
    title: '{coverage} Gardening & Lawn Services',
    description:
      'Residential garden upkeep, tidy-ups, hedge trimming and seasonal care from local contractors {coverage}.',
  },
  {
    path: '/plumbing',
    view: 'service',
    slug: 'plumbing',
    title: '{coverage} Plumbing Services | Local Plumbers',
    description:
      'Household leaks, blocked fixtures and plumbing maintenance handled by local independent contractors {coverage}.',
  },
  {
    path: '/about',
    view: 'about',
    title: 'About Us',
    description:
      'How {name} connects homeowners with local independent contractors for pest control, roofing, gardening and plumbing.',
  },
  {
    path: '/service-areas',
    view: 'service-areas',
    title: 'Service Coverage | {coverage}',
    description:
      'How {coverage} coverage works across {area}, and how to check availability for your address.',
  },
  {
    path: '/contact',
    view: 'contact',
    title: 'Contact',
    description:
      'Call or send an enquiry to {name} and we will connect you with a local independent contractor.',
  },
  {
    path: '/privacy',
    view: 'legal',
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'How {name} handles website, advertising and contact information.',
  },
  {
    path: '/terms',
    view: 'legal',
    slug: 'terms',
    title: 'Terms of Use',
    description: 'Terms governing use of the {name} website.',
  },
  {
    path: '/disclaimer',
    view: 'legal',
    slug: 'disclaimer',
    title: 'Service Disclaimer',
    description:
      'Important limitations concerning home-service information, imagery and advertising.',
  },
];

/** Look up a route by its path. */
export function routeFor(path) {
  return ROUTES.find((r) => r.path === path);
}

/** Primary navigation, shared by the desktop and mobile menus. */
export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Pest control', href: '/pest-control' },
  { label: 'Roofing', href: '/roofing' },
  { label: 'Gardening', href: '/gardening' },
  { label: 'Plumbing', href: '/plumbing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/** Fill {area}, {coverage} and {name} tokens from config. */
export function metaText(template) {
  return String(template ?? '')
    .replaceAll('{area}', SITE.primaryArea)
    .replaceAll('{coverage}', SITE.coverage)
    .replaceAll('{name}', SITE.name);
}

/** Build the <title> for a route, applying the "%s | Business" template. */
export function pageTitle(route) {
  if (!route?.title) return `${SITE.name} | Practical Home-Service Support`;
  return `${metaText(route.title)} | ${SITE.name}`;
}

/** Absolute URL against the configured public domain. */
export function absUrl(path = '/') {
  const base = SITE.siteUrl.replace(/\/+$/, '');
  const clean = `/${String(path).replace(/^\/+/, '')}`;
  return clean === '/' ? `${base}/` : base + clean;
}
