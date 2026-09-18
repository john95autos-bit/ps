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
  oncePerSession: false,
  eyebrow: 'Speak to the team',
  title: 'Talk it through in one call.',
  text: 'Describe what you have noticed and we will talk through the next sensible step.',
  /* Kept short enough to scan in one glance — these support the decision, they
     are not a feature list. Hidden entirely on short screens. */
  reasons: [
    'Tell us the issue and your location',
    'We confirm coverage and availability',
    'Scope agreed before any work',
  ],
  dismiss: 'Keep reading',
};

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

/* ---------------------------------------------------------------------------
 * Pest sub-pages listed on the home and pest-control pages.
 * ------------------------------------------------------------------------- */
export const PEST_TYPES = [
  {
    name: 'Cockroaches',
    href: '/pest-control/cockroach-control',
    blurb: 'Target harbourage areas and reduce the conditions that help activity return.',
  },
  {
    name: 'Termites',
    href: '/pest-control/termite-control',
    blurb: 'Inspection-led guidance for signs of termite activity and next-step options.',
  },
  {
    name: 'Bed bugs',
    href: '/pest-control/bed-bug-control',
    blurb: 'Careful assessment, preparation instructions and treatment planning.',
  },
  {
    name: 'Rodents',
    href: '/pest-control/rodent-control',
    blurb: 'Identify likely access points, activity patterns and practical control measures.',
  },
];

/* ---------------------------------------------------------------------------
 * Roofing / gardening / plumbing landing pages.
 * ------------------------------------------------------------------------- */
export const SERVICE_DETAILS = {
  roofing: {
    slug: 'roofing',
    eyebrow: 'Roof inspections & repairs',
    title: 'Straightforward help for the roof over your head.',
    summary:
      'Tell us what you have noticed. We will discuss the next sensible step, availability and the information needed to estimate the work.',
    image: '/images/roofing-service.webp',
    imageAlt: 'Roofing professionals safely inspecting a residential roof',
    highlights: ['Leak investigation', 'Shingle and tile repair', 'Routine roof checks', 'Gutter-related issues'],
    signs: [
      { title: 'Water marks', text: 'Stains on a ceiling or wall can indicate water entering from above.' },
      {
        title: 'Missing materials',
        text: 'Loose, slipped or missing roof coverings should be assessed before damage spreads.',
      },
      {
        title: 'Visible wear',
        text: 'Cracked flashing, damaged edges and persistent debris may deserve a closer look.',
      },
    ],
    process: [
      {
        number: '01',
        title: 'Call and describe it',
        text: 'Share the location, roof type and what you can safely observe.',
      },
      {
        number: '02',
        title: 'Arrange an assessment',
        text: 'We confirm the visit window and what access may be required.',
      },
      {
        number: '03',
        title: 'Review the options',
        text: 'You receive a clear explanation before authorising any work.',
      },
    ],
    faqs: [
      {
        question: 'Can you quote from a photo?',
        answer:
          'Photos can help with an initial discussion, but some roofing issues require an on-site assessment before a reliable price can be given.',
      },
      {
        question: 'Do I need to climb onto the roof?',
        answer:
          'No. Please stay safe and only describe or photograph what you can see from a secure location.',
      },
      {
        question: 'Is every leak a full roof replacement?',
        answer:
          'No. The appropriate response depends on the roof, the defect and the extent of any hidden damage.',
      },
    ],
    note: 'Roofing availability, scope and pricing depend on access, roof condition, materials and local requirements.',
  },

  gardening: {
    slug: 'gardening',
    eyebrow: 'Garden care',
    title: 'A tidier, healthier outdoor space—without the guesswork.',
    summary:
      'From regular upkeep to a seasonal reset, call to discuss your garden, priorities and a realistic service plan.',
    image: '/images/gardening-service.webp',
    imageAlt: 'A professional gardener trimming a hedge in a residential garden',
    highlights: ['Lawn and border care', 'Hedge trimming', 'Garden tidy-ups', 'Seasonal maintenance'],
    signs: [
      {
        title: 'Overgrown edges',
        text: 'Beds, pathways and boundaries can quickly lose their definition without routine care.',
      },
      { title: 'Seasonal build-up', text: 'Leaves, spent growth and debris may need a focused tidy-up.' },
      {
        title: 'Limited time',
        text: 'A planned maintenance schedule can keep the garden manageable throughout the year.',
      },
    ],
    process: [
      {
        number: '01',
        title: 'Talk through the garden',
        text: 'Tell us the approximate size and the work you want prioritised.',
      },
      {
        number: '02',
        title: 'Confirm the scope',
        text: 'We agree access, green-waste expectations and the proposed visit.',
      },
      {
        number: '03',
        title: 'Care and tidy',
        text: 'The team completes the agreed tasks and leaves the work area orderly.',
      },
    ],
    faqs: [
      {
        question: 'Do you offer one-off visits?',
        answer:
          'One-off and recurring options may be available. Call to check the services offered in your area.',
      },
      {
        question: 'Is green-waste removal included?',
        answer:
          'That depends on the agreed scope. Confirm disposal arrangements before booking so the quote is clear.',
      },
      {
        question: 'Can work continue in poor weather?',
        answer:
          'Some tasks can, while others may be rescheduled for safety or to avoid harming the garden.',
      },
    ],
    note: 'Service scope may vary by season, site access, garden condition and local green-waste rules.',
  },

  plumbing: {
    slug: 'plumbing',
    eyebrow: 'Household plumbing',
    title: 'Clear next steps for everyday plumbing problems.',
    summary:
      'Call with the symptoms and location of the issue. We will explain availability, likely next steps and what to do while you wait.',
    image: '/images/plumbing-service.webp',
    imageAlt: 'A plumbing professional inspecting pipework beneath a kitchen sink',
    highlights: ['Leaks and drips', 'Blocked fixtures', 'Tap and toilet faults', 'Planned maintenance'],
    signs: [
      {
        title: 'Persistent dripping',
        text: 'A small leak can waste water and may cause damage when left unresolved.',
      },
      {
        title: 'Slow drainage',
        text: 'Recurring slow flow or unpleasant smells may indicate a developing blockage.',
      },
      {
        title: 'Unexpected moisture',
        text: 'Damp cabinets, walls or floors should be investigated to locate the source.',
      },
    ],
    process: [
      {
        number: '01',
        title: 'Describe the fault',
        text: 'Tell us what is affected, when it started and whether water is still flowing.',
      },
      {
        number: '02',
        title: 'Confirm attendance',
        text: 'We discuss the visit window, call-out details and any immediate precautions.',
      },
      {
        number: '03',
        title: 'Assess before work',
        text: 'The issue and proposed work are explained before you decide how to proceed.',
      },
    ],
    faqs: [
      {
        question: 'What should I do during an active leak?',
        answer:
          'If it is safe and you know how, isolate the relevant water supply, protect nearby belongings and call for guidance.',
      },
      {
        question: 'Can you guarantee a price by phone?',
        answer:
          'Not always. The cause may need to be inspected before labour, parts and access requirements are known.',
      },
      {
        question: 'Do you handle gas work?',
        answer:
          'Only appropriately qualified professionals should perform regulated gas work. Confirm qualifications and local service availability when calling.',
      },
    ],
    note: 'For flooding, electrical danger or another immediate safety threat, contact the appropriate emergency service or utility provider.',
  },
};

/* ---------------------------------------------------------------------------
 * Pest detail pages.
 * ------------------------------------------------------------------------- */
export const PEST_PAGES = {
  'cockroach-control': {
    title: 'Cockroach control for homes',
    pest: 'Cockroaches',
    intro:
      'Cockroaches often shelter in warm, dark gaps close to food and water. A useful treatment plan starts by identifying the species, activity areas and conditions supporting them.',
    clues: [
      'Live insects seen at night',
      'Small droppings around cabinets',
      'Egg cases or shed skins',
      'A persistent musty odour',
    ],
    approach: [
      'Inspect likely harbourage points',
      'Discuss food, water and access factors',
      'Apply an appropriate treatment where offered',
      'Explain cleaning and follow-up steps',
    ],
    faqs: [
      {
        question: 'Will one visit always solve the problem?',
        answer:
          'Not necessarily. The species, level of activity, building layout and follow-up actions all affect the treatment plan.',
      },
      {
        question: 'Should I spray before the visit?',
        answer:
          'Avoid adding products unless instructed, as they can disturb activity and make inspection more difficult. Ask when booking.',
      },
    ],
  },

  'termite-control': {
    title: 'Termite inspection and control guidance',
    pest: 'Termites',
    intro:
      'Possible termite activity deserves careful inspection. Similar-looking damage can have other causes, so avoid relying on photographs or surface signs alone.',
    clues: [
      'Mud-like shelter tubes',
      'Hollow or damaged timber',
      'Discarded wings',
      'Doors or floors changing unexpectedly',
    ],
    approach: [
      'Review visible signs and property history',
      'Inspect accessible risk areas',
      'Explain findings and treatment choices',
      'Document prevention and monitoring steps',
    ],
    faqs: [
      {
        question: 'Can termites be confirmed from a photo?',
        answer:
          'A photo may help with an initial conversation, but a proper inspection is usually needed to confirm activity and extent.',
      },
      {
        question: 'Does every property need the same treatment?',
        answer:
          'No. Construction type, species, access, activity and local standards can change the recommended approach.',
      },
    ],
  },

  'bed-bug-control': {
    title: 'Bed bug inspection and treatment planning',
    pest: 'Bed bugs',
    intro:
      'Bed bugs can hide in seams, joints and nearby furniture. Bites alone do not confirm an infestation, so inspection and accurate preparation matter.',
    clues: [
      'Dark spotting near mattress seams',
      'Shed skins or small eggs',
      'Live bugs in cracks and joints',
      'Unexplained marks after sleep',
    ],
    approach: [
      'Inspect sleeping and resting areas',
      'Confirm preparation requirements',
      'Use an appropriate treatment plan',
      'Schedule follow-up where needed',
    ],
    faqs: [
      {
        question: 'Do bites prove I have bed bugs?',
        answer:
          'No. Skin reactions have many causes. Look for physical evidence and arrange an inspection if you are unsure.',
      },
      {
        question: 'Should I throw away my mattress?',
        answer:
          'Not automatically. Ask for guidance before moving or discarding items, as this may spread activity through the property.',
      },
    ],
  },

  'rodent-control': {
    title: 'Rodent control and entry-point guidance',
    pest: 'Rodents',
    intro:
      'Rodent activity is best addressed by combining control with sanitation and practical steps to reduce re-entry.',
    clues: [
      'Droppings or gnaw marks',
      'Scratching in walls or ceilings',
      'Damaged food packaging',
      'Greasy marks along edges',
    ],
    approach: [
      'Inspect activity and likely entry points',
      'Discuss safe control options',
      'Recommend proofing priorities',
      'Review sanitation and monitoring',
    ],
    faqs: [
      {
        question: 'Can you seal every entry point immediately?',
        answer:
          'Timing depends on the species and activity. Premature sealing can create other problems, so follow the recommended sequence.',
      },
      {
        question: 'Are baits safe around children and pets?',
        answer:
          'Products and placement must follow their labels and local rules. Tell the technician about children, pets and sensitive areas before treatment.',
      },
    ],
  },
};
