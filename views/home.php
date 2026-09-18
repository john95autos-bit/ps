<?php

/**
 * views/home.php — the primary ad landing page.
 *
 * In scope from render_page(): $path, $route, $title, $description,
 * $canonical, $ogImage, $ogSize, $robots.
 *
 * This page is the whole business on one screen: what is offered, what each
 * service actually covers, what to look for, how a job proceeds, where the team
 * works, and what to have ready before dialling. Everything factual is read
 * from config/site.php, so the home page can never describe a service
 * differently from that service's own page.
 *
 * Conversion structure: a call action appears above the fold, again mid-page in
 * the amber strip, again after the pest section, and again in the closing
 * panel — a visitor is never more than about one screen from a phone button.
 *
 * Nothing above the fold is animated: the hero must be painted and the call
 * button tappable the moment the HTML lands, before GSAP has parsed.
 */

/* The original interpolated `${siteConfig.primaryArea}` into the first answer;
   that stays dynamic and now reads config/site.php. */
$homeFaqs = [
    [
        'question' => 'Which areas do you serve?',
        'answer'   => 'We operate ' . mb_strtolower((string) site('coverage')) . ' across ' . site('primary_area') . '. Contractor availability still varies by location, trade and current workload, so give us your ZIP code and we will confirm what is available for your job before you rely on a visit.',
    ],
    [
        'question' => 'Can I get an exact price by phone?',
        'answer'   => 'We can discuss likely scope and any known call-out details. Some work needs an inspection before a reliable quote can be provided.',
    ],
    [
        'question' => 'Do you take payment through this website?',
        'answer'   => 'No. This website does not request card or bank details. Confirm pricing, payment methods and service terms directly with the business before authorising work.',
    ],
    [
        'question' => 'Are the photos on the site examples?',
        'answer'   => 'Yes. Website images illustrate the type of work discussed and do not claim to show a specific customer, technician or completed job.',
    ],
    [
        'question' => 'How quickly can someone attend?',
        'answer'   => 'That depends on the service, your location and current workload, so we will not quote a response time before checking. Call and we will tell you the next realistic window rather than an optimistic one.',
    ],
    [
        'question' => 'What happens after I call?',
        'answer'   => 'We discuss what you have noticed, confirm whether your address is covered, explain the likely next step and agree what happens before any work is authorised. Calling does not commit you to anything.',
    ],
];

/* [number, title, text] — the inline array the original mapped over. The number
   is literal text here, because .info-card__num is not a CSS counter. */
$homeValues = [
    ['01', 'Transparent information', 'Important limitations and variables are stated close to the service claims they affect.'],
    ['02', 'No invented proof', 'We do not use fabricated reviews, accreditation badges, ratings or job counts.'],
    ['03', 'Privacy-conscious', 'Optional ad measurement follows your cookie choice; sensitive payment details are not collected here.'],
    ['04', 'Mobile call-ready', 'The same visible phone number is available across landing pages for easier ad verification.'],
];

/* The four operating properties the hero states, restated in the trust row with
   a one-line explanation each. Every line describes how the business says it
   works — there is no rating, badge, count or promise anywhere in this list. */
$homePoints = [
    ['icon' => 'i-search',    'point' => 'Inspection-led recommendations', 'label' => 'Inspection-led',    'text' => 'Recommendations based on the property and the issue in front of us.'],
    ['icon' => 'i-clipboard', 'point' => 'Scope agreed before any work',   'label' => 'Clear scope',       'text' => 'You understand the proposed work before you approve it.'],
    ['icon' => 'i-shield',    'point' => 'No payment taken online',        'label' => 'No online payment', 'text' => 'This website does not request card or bank details.'],
    ['icon' => 'i-clock',     'point' => 'Phone-first, during published hours', 'label' => 'Easy to reach', 'text' => 'Phone-first support during ' . site('hours') . '.'],
];

/* What each service covers. Read from the service pages themselves so the home
   page and the landing pages can never disagree; pest control has no
   service_details entry, so its coverage is the pest guides it links to. */
$serviceDetails = config('service_details', []);
$coverage = [
    [
        'title' => 'Pest control',
        'href'  => '/pest-control',
        'icon'  => 'i-search',
        'blurb' => 'Inspection-led treatment planning for common household pests, with preparation and aftercare explained before anything is applied.',
        'items' => array_map(static fn (array $p): string => $p['name'], (array) config('pest_types', [])),
    ],
];
foreach (['roofing', 'gardening', 'plumbing'] as $coverSlug) {
    if (!isset($serviceDetails[$coverSlug])) {
        continue;
    }
    $coverage[] = [
        'title' => ucfirst($coverSlug),
        'href'  => '/' . $coverSlug,
        'icon'  => $coverSlug === 'plumbing' ? 'i-wrench' : ($coverSlug === 'roofing' ? 'i-house' : 'i-shield'),
        'blurb' => $serviceDetails[$coverSlug]['summary'] ?? '',
        'items' => (array) ($serviceDetails[$coverSlug]['highlights'] ?? []),
    ];
}

/* The four-step path, shared with the pest-control page. */
$homeSteps = [
    ['title' => 'Describe',  'text' => 'Tell us what you have noticed, which rooms or areas are affected and when it started.'],
    ['title' => 'Prepare',   'text' => 'Receive instructions on access, clearing and anything to avoid before the visit.'],
    ['title' => 'Inspect',   'text' => 'Review the evidence at the property and the conditions that may be supporting the problem.'],
    ['title' => 'Act',       'text' => 'Discuss the proposed plan, aftercare and any follow-up, then decide whether to proceed.'],
];

/* What to have ready — the same four prompts the contact page uses. */
$homeReady = [
    ['title' => 'Your location',            'text' => 'Postcode, ZIP code or neighbourhood.'],
    ['title' => 'The service needed',       'text' => 'Pest control, roofing, gardening or plumbing.'],
    ['title' => 'What you noticed',         'text' => 'Signs, affected area and when it started.'],
    ['title' => 'Access or safety details', 'text' => 'Children, pets, height, utilities or urgent risks.'],
];

?>
<section class="hero">
    <div class="hero__media" data-parallax>
        <?php /* First hero image: never lazy-loaded. img_tag adds width/height (the CLS fix). */ ?>
        <?= img_tag('/images/pest-control-hero.webp', 'Pest-control technician inspecting a kitchen baseboard') ?>
    </div>
    <div class="hero__scrim"></div>
    <div class="wrap">
        <div class="hero__inner">
            <p class="hero__chip"><span class="dot" aria-hidden="true"></span> <?= e(site('coverage')) ?> &middot; local independent contractors</p>
            <h1 class="hero__title">Take care of your home, <em>one clear call</em> at a time.</h1>
            <p class="lede lede--on-navy">Pest control, roofing, gardening and plumbing for households across <?= e(site('primary_area')) ?>. Tell us what is happening and we will connect you with a local independent contractor who can explain the likely next step.</p>
            <div class="hero__actions">
                <?= phone_cta('home_hero', 'btn btn--call btn--lg') ?>
                <a class="btn btn--onnavy btn--lg" href="<?= e(url('/pest-control')) ?>">Explore pest control</a>
            </div>
            <ul class="hero__points">
                <?php foreach ($homePoints as $homePoint): ?>
                    <li><?= icon('i-check') ?><span><?= e($homePoint['point']) ?></span></li>
                <?php endforeach; ?>
            </ul>
            <p class="fineprint fineprint--on-navy">Calls do not create a booking until availability, scope and terms are confirmed.</p>
        </div>
    </div>
</section>

<section class="trustrow">
    <div class="wrap">
        <ul class="trustrow__grid" data-anim-group>
            <?php foreach ($homePoints as $homePoint): ?>
                <li class="trustrow__item" data-anim="rise">
                    <?= icon($homePoint['icon']) ?>
                    <div>
                        <strong><?= e($homePoint['label']) ?></strong>
                        <span><?= e($homePoint['text']) ?></span>
                    </div>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</section>

<section class="section s-paper">
    <div class="wrap">
        <div class="sec-head sec-head--row" data-anim="rise">
            <div>
                <p class="eyebrow">Services for the whole home</p>
                <h2>Useful help, without the hard sell.</h2>
            </div>
            <p class="lede">Each service page explains what to notice, what to expect on the first call and the factors that may affect scope or pricing.</p>
        </div>
        <div class="svc-grid" data-anim-group>
            <?php foreach (config('main_services') as $service): ?>
                <a class="svc-card" data-anim="rise" href="<?= e(url($service['href'])) ?>">
                    <?php /* Below the fold, so these four card images are lazy-loaded. */ ?>
                    <?= img_tag($service['image'], '', ['loading' => 'lazy']) ?>
                    <span class="svc-card__tag"><?= e($service['tag']) ?></span>
                    <div class="svc-card__body">
                        <h3><?= e($service['title']) ?></h3>
                        <p><?= e($service['description']) ?></p>
                        <span class="svc-card__more">View service <?= icon('i-arrow-right', 'ic ic--sm') ?></span>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php /* Mid-page call prompt. The one place amber is used for something other
         than a button, so its CTA is dark rather than amber-on-amber. */ ?>
<section class="quickcall">
    <div class="wrap">
        <p><strong>Not sure which service you need?</strong> Describe what you are seeing and we will point you at the right one.</p>
        <?= phone_cta('home_quickcall', 'btn btn--dark') ?>
    </div>
</section>

<section class="section s-white">
    <div class="wrap">
        <div class="sec-head" data-anim="rise">
            <p class="eyebrow">What we cover</p>
            <h2>Four services, described plainly.</h2>
            <p class="lede">This is the full list of what the team handles. If what you need is not here, say so on the call and we will tell you honestly rather than take the job.</p>
        </div>
        <div class="info-grid info-grid--four" data-anim-group>
            <?php foreach ($coverage as $cover): ?>
                <article class="info-card" data-anim="rise">
                    <span class="info-card__num"><?= icon($cover['icon'], 'ic ic--sm') ?></span>
                    <h3><?= e($cover['title']) ?></h3>
                    <p><?= e($cover['blurb']) ?></p>
                    <?php if ($cover['items']): ?>
                        <ul class="checklist mt-4">
                            <?php foreach ($cover['items'] as $coverItem): ?>
                                <li><?= icon('i-check', 'ic ic--sm') ?><span><?= e($coverItem) ?></span></li>
                            <?php endforeach; ?>
                        </ul>
                    <?php endif; ?>
                    <a class="textlink" href="<?= e(url($cover['href'])) ?>">
                        <?= e($cover['title']) ?> details <?= icon('i-arrow-right', 'ic ic--sm') ?>
                    </a>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="section s-navy">
    <div class="wrap stack-lg">
        <div class="split">
            <figure class="figure" data-anim="left">
                <?= img_tag('/images/pest-control-detail.webp', 'Technician carrying out a targeted exterior pest treatment', ['loading' => 'lazy']) ?>
                <figcaption class="figure__cap">
                    <strong>Targeted approach</strong>
                    <span>Inspect • Treat • Guide</span>
                </figcaption>
            </figure>
            <div class="stack" data-anim="right">
                <p class="eyebrow eyebrow--on-navy">Pest-control focus</p>
                <h2>Start with what you are actually seeing.</h2>
                <p class="lede lede--on-navy">Different pests, properties and activity levels call for different next steps. An honest assessment is more useful than a one-size-fits-all promise.</p>
            </div>
        </div>
        <div class="tile-grid" data-anim-group>
            <?php foreach (config('pest_types') as $pestIndex => $pestType): ?>
                <a class="tile" data-anim="rise" href="<?= e(url($pestType['href'])) ?>">
                    <span class="tile__num"><?= e(sprintf('%02d', $pestIndex + 1)) ?></span>
                    <h3><?= e($pestType['name']) ?></h3>
                    <p><?= e($pestType['blurb']) ?></p>
                    <span class="tile__more">View guide <?= icon('i-arrow-right', 'ic ic--sm') ?></span>
                </a>
            <?php endforeach; ?>
        </div>
        <?= phone_cta('home_pest', 'btn btn--call btn--lg') ?>
    </div>
</section>

<section class="section s-mist">
    <div class="wrap">
        <div class="sec-head" data-anim="rise">
            <p class="eyebrow">How it works</p>
            <h2>From your call to the follow-up.</h2>
            <p class="lede">The same four steps apply whichever service you need. Nothing is authorised until you have seen the scope.</p>
        </div>
        <div class="steps steps--row" data-anim-group>
            <?php foreach ($homeSteps as $homeStep): ?>
                <article class="step" data-anim="rise">
                    <div>
                        <h3><?= e($homeStep['title']) ?></h3>
                        <p><?= e($homeStep['text']) ?></p>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="section s-white">
    <div class="wrap">
        <div class="split split--wide-left">
            <div class="stack" data-anim="left">
                <p class="eyebrow">Signs worth a call</p>
                <h2>Small things that are easier to deal with early.</h2>
                <p class="lede">These are conversation starters, not a remote diagnosis. Noticing one of them does not confirm a problem — it just means it is worth describing to someone.</p>
                <?= phone_cta('home_signs', 'btn btn--call') ?>
            </div>
            <div class="signals" data-anim-group>
                <?php foreach ($serviceDetails as $signSlug => $signService): ?>
                    <?php foreach (array_slice((array) ($signService['signs'] ?? []), 0, 1) as $sign): ?>
                        <div class="signal" data-anim="rise">
                            <?= icon('i-search') ?>
                            <div>
                                <strong><?= e($sign['title']) ?></strong>
                                <p class="signal__text"><?= e($sign['text']) ?></p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endforeach; ?>
                <div class="signal" data-anim="rise">
                    <?= icon('i-search') ?>
                    <div>
                        <strong>Pest activity you can see</strong>
                        <p class="signal__text">Droppings, gnaw marks, shed skins or insects appearing in the same place more than once.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section s-paper">
    <div class="wrap">
        <div class="split">
            <div class="stack" data-anim="left">
                <p class="eyebrow">Where we work</p>
                <h2><?= e(site('coverage')) ?> coverage, local contractors.</h2>
                <p class="lede"><?= e(site('coverage_note')) ?></p>
                <div class="areas">
                    <?php foreach ((array) site('service_areas', []) as $area): ?>
                        <span class="area-chip"><?= icon('i-pin', 'ic ic--sm') ?><strong><?= e($area) ?></strong></span>
                    <?php endforeach; ?>
                </div>
                <a class="textlink" href="<?= e(url('/service-areas')) ?>">Check your address <?= icon('i-arrow-right', 'ic ic--sm') ?></a>
            </div>
            <div class="stack" data-anim="right">
                <p class="eyebrow">Have this ready</p>
                <h2>A more useful first conversation.</h2>
                <ol class="prep-list">
                    <?php foreach ($homeReady as $ready): ?>
                        <li>
                            <div>
                                <strong><?= e($ready['title']) ?></strong>
                                <span><?= e($ready['text']) ?></span>
                            </div>
                        </li>
                    <?php endforeach; ?>
                </ol>
                <p class="fineprint"><?= e(site('hours')) ?> &middot; standard network charges may apply.</p>
            </div>
        </div>
    </div>
</section>

<section class="section s-mist">
    <div class="wrap">
        <div class="sec-head" data-anim="rise">
            <p class="eyebrow">Built for informed decisions</p>
            <h2>Trust is in the details.</h2>
            <p class="lede">No false urgency, vague “from” prices or promises that cannot be checked. Just clear information designed to help you decide what to do next.</p>
        </div>
        <div class="info-grid info-grid--four" data-anim-group>
            <?php foreach ($homeValues as [$valueNumber, $valueTitle, $valueText]): ?>
                <article class="info-card" data-anim="rise">
                    <span class="info-card__num"><?= e($valueNumber) ?></span>
                    <h3><?= e($valueTitle) ?></h3>
                    <p><?= e($valueText) ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="section s-white">
    <div class="wrap">
        <div class="split split--wide-right">
            <div class="stack" data-anim="left">
                <p class="eyebrow">Before you call</p>
                <h2>Questions people often ask.</h2>
                <p class="lede">If your question is property-specific, a short phone conversation will usually be more useful.</p>
                <div class="notecard notecard--alert">
                    <?= icon('i-alert') ?>
                    <div>
                        <strong>Not an emergency service</strong>
                        <p>For fire, gas odour, electrical danger, major flooding or structural danger, contact the appropriate emergency service or utility provider first.</p>
                    </div>
                </div>
            </div>
            <div data-anim="right">
                <?php partial('faq', ['items' => $homeFaqs]); ?>
            </div>
        </div>
    </div>
</section>

<?php partial('call-panel', [
    'title'     => 'A home problem feels smaller once the next step is clear.',
    'placement' => 'home_cta_panel',
]); ?>
