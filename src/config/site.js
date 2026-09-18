/**
 * Central business configuration — the port of config/site.php.
 *
 * Everything a non-developer might need to edit lives here. The PHP build read
 * overrides from a gitignored config/local.php; in a Vite app the equivalent is
 * an env var, so the handful of values that differ between local and production
 * (domain, tag ids, launch flag) read from import.meta.env with the same
 * defaults the PHP file used.
 *
 * Vite only exposes vars prefixed VITE_, and everything here ships to the
 * browser — so nothing secret belongs in this file. The Resend key and webhook
 * URL used by api/lead.js are deliberately NOT here; they are server-only.
 */

const env = (key, fallback = '') => {
  /* Read from Vite in the browser bundle and from process.env under plain Node,
     so scripts/generate-seo.js can import this same file at build time to write
     robots.txt and sitemap.xml against the real domain. */
  const fromVite = import.meta.env?.[key];
  if (typeof fromVite === 'string' && fromVite !== '') return fromVite;
  const fromNode = typeof process !== 'undefined' ? process.env?.[key] : undefined;
  if (typeof fromNode === 'string' && fromNode !== '') return fromNode;
  return fallback;
};

export const SITE = {
  name: 'AD Housing Services',
  /* Short form used as the visible wordmark in the header, footer and og:image
     alt. Renaming the business in `name` alone used to leave the logo saying
     the old name forever. */
  brandShort: 'AD Housing',
  legalName: 'AD Housing Services',
  phoneDisplay: '1-844-705-9874',
  phoneHref: '+18447059874',
  email: 'support@adhousingservices.com',

  /* Registered business address. Rendered in the footer, on the contact page
     and in the LocalBusiness structured data. Google Ads expects the advertised
     business to be identifiable and reachable, and the privacy policy has to
     name the entity and its address. */
  address: {
    street: '30 N Gould St, Ste R',
    locality: 'Sheridan',
    region: 'WY',
    postcode: '82801',
    country: 'USA',
  },

  /* Coverage. This is a nationwide platform, not a local trade business, so
     there is no "city" and no district list. `primaryArea` is the phrase that
     reads naturally after "in"; `coverage` is the adjective used in titles and
     chips. Both fill tokens in src/config/routes.js. */
  primaryArea: 'the United States',
  coverage: 'Nationwide',

  /* How coverage actually works, stated honestly: nationwide reach does not
     mean every trade is available in every ZIP on any given day. */
  coverageNote:
    'Contractor availability varies by location, trade and current workload, so coverage for your specific job is confirmed when you call or send an enquiry.',

  /* Regions listed on the coverage page. Not a promise of availability in every
     location within them — see coverageNote. */
  serviceAreas: ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West', 'Pacific Northwest'],
  hours: 'Mon–Sat, 8:00 AM–6:00 PM',
  legalUpdated: '19 August 2026',

  /* --- Platform disclosure -------------------------------------------------
   * Rendered at the bottom of EVERY page. This is a material disclosure, not
   * boilerplate: it tells a visitor that the operator is a referral platform
   * rather than the contractor who will attend. Under Google Ads
   * misrepresentation policy, a lead-generation service that presents itself as
   * the service provider is a suspendable violation, so this line has to be
   * visible on every route and must not be contradicted by the copy above it.
   * --------------------------------------------------------------------- */
  platformDisclosure:
    'AD Housing Services is a free platform that connects users with local independent contractors. We do not directly provide home service work or employ the technicians.',

  /* The launch switch. While false the site sends `noindex, nofollow` and shows
     a pre-launch banner on every page. See src/lib/launch.js — it is only
     honoured when nothing in launchBlockers() contradicts it. */
  configured: env('VITE_CONFIGURED') === 'true',

  siteUrl: env('VITE_SITE_URL', 'https://www.yourdomain.com').replace(/\/+$/, ''),

  /* --- Call-conversion tracking --------------------------------------------
   * A phone call is the only conversion this site has, so getting this wrong
   * means paying for ads and seeing zero results in Google Ads.
   * Two supported setups; use ONE.
   *
   * A) gtag.js — set both googleAdsId and googleAdsConversionLabel. The label
   *    comes from the Google Ads conversion action screen ("Tag setup > Install
   *    the tag yourself"); it looks like AbC-D_efGh12345 and is the part AFTER
   *    the slash in send_to: 'AW-123456789/AbC-D_efGh12345'.
   * B) Google Tag Manager — set gtmId instead and build the trigger in GTM off
   *    the `phone_click` dataLayer event.
   * --------------------------------------------------------------------- */
  googleAdsId: env('VITE_GOOGLE_ADS_ID'),
  googleAdsConversionLabel: env('VITE_GOOGLE_ADS_CONVERSION_LABEL'),
  gtmId: env('VITE_GTM_ID'),
};

/* ---------------------------------------------------------------------------
 * Lead form.
 *
 * `consentText` is the TCPA consent statement. It is stored verbatim with every
 * submission, so what the person actually agreed to can be produced later —
 * consent you cannot evidence is consent you do not have. Changing this string
 * changes what future submissions record; it does not rewrite consent already
 * given.
 *
 * The privacy policy quotes this same wording. It now reads it from here rather
 * than repeating it, so the two can never drift apart — they were two separate
 * copies in the PHP build.
 * ------------------------------------------------------------------------- */
export const LEAD_FORM = {
  enabled: true,
  consentText:
    'By clicking submit, I consent to receive calls and text messages from AD Housing Services and its network of independent contractors at the number provided. Consent is not a condition of purchase. Message and data rates may apply. Reply STOP to opt out.',
};

/* ---------------------------------------------------------------------------
 * The timed call prompt.
 *
 * A soft dialog that surfaces the phone number a few seconds into every page
 * view. It is the most intrusive element on the site, so everything about it is
 * configurable here rather than buried in a component.
 *
 * · `delayMs` starts counting from mount.
 * · `oncePerSession` false means it appears on every page view. That is the most
 *   aggressive setting; true shows it once per browsing session instead, which
 *   usually reads far better to someone genuinely reading several service pages.
 * · It never appears for someone who has already tapped a call link.
 * ------------------------------------------------------------------------- */
export const CALL_POPUP = {
  enabled: true,
  delayMs: 3000,
  /* false = every page view, including each client-side navigation. */
  oncePerSession: false,

  /* Shown wherever no variant below matches: home, about, the legal pages. */
  default: {
    placement: 'popup',
    eyebrow: 'Speak to the team',
    title: 'Talk it through in one call.',
    text: 'Describe what you have noticed and we will talk through the next sensible step.',
    /* Kept short enough to scan in one glance — these support the decision,
       they are not a feature list. Hidden entirely on short screens. */
    reasons: [
      'Tell us the issue and your location',
      'We confirm coverage and availability',
      'Scope agreed before any work',
    ],
  },

  /* Per-page copy, keyed by route. A visitor reading about bed bugs gets a
     prompt about bed bugs, not a generic one — the prompt is interrupting
     them, so the least it can do is be about what they came for.
     `placement` reaches Google Ads as the conversion's link_placement, so each
     page's prompt can be measured separately and the ones that are not earning
     their intrusion can be turned off.
     Any key omitted here falls back to `default` above. */
  variants: {
    '/pest-control': {
      placement: 'popup_pest',
      eyebrow: 'Pest control',
      title: 'Describe what you have seen.',
      text: 'The species, where you have seen it and roughly when. That is usually enough for a contractor to tell you what happens next.',
      reasons: [
        'Tell us the pest and your location',
        'We confirm coverage and availability',
        'Preparation explained before any visit',
      ],
    },

    '/pest-control/cockroach-control': {
      placement: 'popup_cockroach',
      eyebrow: 'Cockroach control',
      title: 'Seen roaches? Tell us where.',
      text: 'Which room, what time of day, and whether you have found droppings or egg cases. Identifying the species decides the whole approach.',
      reasons: [
        'Tell us where and when you see them',
        'Please do not spray before the inspection',
        'We confirm contractor availability',
      ],
    },

    '/pest-control/termite-control': {
      placement: 'popup_termite',
      eyebrow: 'Termite inspection',
      title: 'Think it might be termites?',
      text: 'Mud tubes, discarded wings or hollow-sounding timber are worth describing today. Leave the evidence exactly where it is.',
      reasons: [
        'Describe the signs and where you found them',
        'Leave shelter tubes undisturbed',
        'Inspection arranged before any quote',
      ],
    },

    '/pest-control/bed-bug-control': {
      placement: 'popup_bedbug',
      eyebrow: 'Bed bug treatment',
      title: 'Found something in the seams?',
      text: 'Dark spotting, shed skins or live insects near the mattress. Bites alone do not confirm it, so tell us what you can actually see.',
      reasons: [
        'Tell us what you have found, and where',
        'Do not move bedding to another room',
        'Preparation list before any treatment',
      ],
    },

    '/pest-control/rodent-control': {
      placement: 'popup_rodent',
      eyebrow: 'Rodent control',
      title: 'Hearing something in the walls?',
      text: 'When you hear it and where in the building narrows it down fast. Do not seal anything up before you have had advice.',
      reasons: [
        'Tell us when and where you hear it',
        'Do not seal entry points yet',
        'We confirm contractor availability',
      ],
    },

    '/roofing': {
      placement: 'popup_roofing',
      eyebrow: 'Roofing',
      title: 'Describe it from the ground.',
      text: 'When the leak shows, which room it appears in, and what you can see safely from below. Please do not climb up to check.',
      reasons: [
        'Tell us the symptom and the roof type',
        'Photos from ground level are enough',
        'Assessment arranged before any quote',
      ],
    },

    '/gardening': {
      placement: 'popup_gardening',
      eyebrow: 'Garden care',
      title: 'What needs doing first?',
      text: 'Roughly the size, the access, and the jobs that matter most to you. One-off or recurring — both are worth asking about.',
      reasons: [
        'Describe the garden and the access',
        'Tell us what to prioritise',
        'Confirm green-waste arrangements',
      ],
    },

    '/plumbing': {
      placement: 'popup_plumbing',
      eyebrow: 'Plumbing',
      title: 'Is water still running?',
      text: 'If it is, isolate the supply at the shut-off valve first, then call. Tell us what is affected and when it started.',
      reasons: [
        'Isolate the supply if water is escaping',
        'Describe the fault and when it started',
        'We confirm contractor availability',
      ],
    },

    '/service-areas': {
      placement: 'popup_areas',
      eyebrow: 'Check your address',
      title: 'Give us a ZIP code.',
      text: 'That is all we need to tell you whether a contractor covers your area and has capacity for the job.',
      reasons: [
        'A ZIP code is enough to check',
        'Availability confirmed on the call',
        'No obligation either way',
      ],
    },

    '/contact': {
      placement: 'popup_contact',
      eyebrow: 'Faster by phone',
      title: 'Calling beats the form.',
      text: 'The form works and someone will call you back. A call gets your coverage checked while you are still on the line.',
      reasons: [
        'Coverage checked during the call',
        'Nothing booked until you agree it',
        'Free to use, no payment online',
      ],
    },
  },
};

/**
 * The prompt copy for a route: an exact match, then the nearest ancestor, then
 * the default. The ancestor step means a new pest guide gets the pest-control
 * prompt rather than the generic one, without anyone remembering to add it.
 */
export function callPopupFor(pathname) {
  const { variants, default: base } = CALL_POPUP;

  if (variants[pathname]) return { ...base, ...variants[pathname] };

  const ancestor = Object.keys(variants)
    .filter((key) => pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];

  return ancestor ? { ...base, ...variants[ancestor] } : base;
}

/* ---------------------------------------------------------------------------
 * Intrinsic dimensions of every bundled photo. <Img> reads these to emit
 * width/height, which reserves the space and removes layout shift.
 * ------------------------------------------------------------------------- */
export const IMAGES = {
  '/images/pest-control-hero.webp': { width: 1672, height: 941 },
  '/images/pest-control-detail.webp': { width: 1536, height: 1024 },
  '/images/roofing-service.webp': { width: 1920, height: 800 },
  '/images/gardening-service.webp': { width: 1821, height: 864 },
  '/images/plumbing-service.webp': { width: 1736, height: 906 },
};

/* ---------------------------------------------------------------------------
 * Home page service cards.
 * ------------------------------------------------------------------------- */
export const MAIN_SERVICES = [
  {
    title: 'Pest control',
    href: '/pest-control',
    description:
      'Inspection-led treatment plans for common household pests, with clear preparation and aftercare guidance.',
    image: '/images/pest-control-hero.webp',
    tag: 'Primary ad service',
  },
  {
    title: 'Roofing',
    href: '/roofing',
    description:
      'Practical roof inspections, maintenance and repair options explained before work begins.',
    image: '/images/roofing-service.webp',
    tag: 'Exterior care',
  },
  {
    title: 'Gardening',
    href: '/gardening',
    description:
      'Routine garden upkeep, tidy-ups and seasonal care shaped around your outdoor space.',
    image: '/images/gardening-service.webp',
    tag: 'Outdoor care',
  },
  {
    title: 'Plumbing',
    href: '/plumbing',
    description:
      'Help with common household plumbing faults, maintenance and planned improvements.',
    image: '/images/plumbing-service.webp',
    tag: 'Home maintenance',
  },
];
