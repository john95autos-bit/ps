<?php /**
 * Service landing page — backs /roofing, /gardening and /plumbing.
 *
 * Expects (supplied by render_page):
 *   $route['slug'] — 'roofing' | 'gardening' | 'plumbing'
 *
 * One view, three routes: every string is read from
 * config('service_details.<slug>') using the slug carried by the route table,
 * so the three landing pages can never drift apart.
 *
 * Call surfaces on this page: <slug>_hero, <slug>_cta_panel.
 */

$serviceSlug = (string) ($route['slug'] ?? '');
$service     = config('service_details.' . $serviceSlug);

if (!is_array($service)) {
    throw new RuntimeException("Unknown service slug: {$serviceSlug}");
}

/* Fail with a sentence that names the problem. Dereferencing a missing key
   raised a TypeError deep inside img_tag() instead, which said nothing useful
   about which config entry was incomplete. */
foreach (['slug', 'eyebrow', 'title', 'summary', 'image', 'image_alt', 'note'] as $required) {
    if (!isset($service[$required])) {
        throw new RuntimeException("service_details.{$serviceSlug} is missing '{$required}'");
    }
}
foreach (['highlights', 'signs', 'process', 'faqs'] as $listKey) {
    $service[$listKey] = is_array($service[$listKey] ?? null) ? $service[$listKey] : [];
}

$slug = (string) $service['slug'];
?>
<section class="hero">
  <div class="hero__media" data-parallax>
    <?php /* First image on the page — never lazy-loaded. */ ?>
    <?= img_tag($service['image'], $service['image_alt']) ?>
  </div>
  <div class="hero__scrim"></div>
  <div class="wrap hero__inner">
    <p class="eyebrow eyebrow--on-navy"><?= e($service['eyebrow']) ?></p>
    <h1 class="hero__title"><?= e($service['title']) ?></h1>
    <p class="lede lede--on-navy"><?= e($service['summary']) ?></p>
    <div class="hero__actions">
      <?= phone_cta($slug . '_hero', 'btn btn--call btn--lg') ?>
      <a class="btn btn--onnavy btn--lg" href="<?= e(url('/service-areas')) ?>">Check service areas</a>
    </div>
    <p class="fineprint fineprint--on-navy">No online payment required. Scope and price are confirmed before authorised work.</p>
  </div>
</section>

<section class="section section--tight s-paper" aria-label="Service highlights">
  <div class="wrap">
    <ul class="pills" data-anim-group>
      <?php foreach ((array) $service['highlights'] as $highlight): ?>
        <li class="pill" data-anim="fade">
          <i class="ic ic--sm ic--check" aria-hidden="true"></i>
          <?= e($highlight) ?>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>

<section class="section s-mist">
  <div class="wrap">
    <div class="sec-head" data-anim>
      <p class="eyebrow">What to look for</p>
      <h2>Small signs can point to a bigger maintenance need.</h2>
      <p class="lede">These are useful conversation starters, not a remote diagnosis.</p>
    </div>
    <div class="info-grid" data-anim-group>
      <?php foreach ((array) $service['signs'] as $signIndex => $sign): ?>
        <article class="info-card" data-anim>
          <span class="info-card__num"><?= e(sprintf('%02d', $signIndex + 1)) ?></span>
          <h3><?= e($sign['title']) ?></h3>
          <p><?= e($sign['text']) ?></p>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section s-white">
  <div class="wrap">
    <div class="sec-head sec-head--row" data-anim>
      <div>
        <p class="eyebrow">How it works</p>
        <h2>Simple from the first call.</h2>
      </div>
      <p class="lede">We keep the conversation practical so you understand the next step, the likely scope and any limitations before work begins.</p>
    </div>
    <?php /* The 01 / 02 / 03 markers are CSS counters on .step — never markup. */ ?>
    <ol class="steps steps--row" data-anim-group>
      <?php foreach ((array) $service['process'] as $step): ?>
        <li class="step" data-anim>
          <div>
            <h3><?= e($step['title']) ?></h3>
            <p><?= e($step['text']) ?></p>
          </div>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>
</section>

<section class="section s-navy">
  <div class="wrap split split--wide-right">
    <div class="sec-head" data-anim="left">
      <p class="eyebrow eyebrow--on-navy">Common questions</p>
      <h2>Useful answers before you call.</h2>
      <p class="lede">Availability and exact service details vary by location and property.</p>
    </div>
    <div data-anim="right">
      <?php partial('faq', ['items' => (array) $service['faqs']]); ?>
    </div>
  </div>
</section>

<section class="section section--tight s-paper">
  <div class="wrap wrap--narrow">
    <?php /* The not-an-emergency-service notice previously appeared only on
             /contact and /disclaimer, neither of which a paid visitor lands on.
             Roofing and plumbing ad traffic in particular can arrive mid-crisis,
             so it belongs on the landing page itself. */ ?>
    <div class="notecard notecard--alert" data-anim>
      <?= icon('i-alert') ?>
      <div>
        <strong>Not an emergency service</strong>
        <p>For fire, gas odour, electrical danger, major flooding or structural danger, contact the appropriate emergency service or utility provider first. Call us once the immediate danger is handled.</p>
      </div>
    </div>

    <div class="notecard" data-anim>
      <i class="ic ic--info" aria-hidden="true"></i>
      <div>
        <strong>Important service note</strong>
        <p><?= e($service['note']) ?></p>
      </div>
    </div>
  </div>
</section>

<?php partial('call-panel', ['placement' => $slug . '_cta_panel']); ?>
