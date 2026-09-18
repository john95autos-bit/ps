<?php

/**
 * Site footer.
 *
 * Expects no variables. Reads config('main_services') for the Services column
 * and the business identity from config/site.php.
 *
 * The footer repeats the phone number as its own large amber call link rather
 * than a button, so it reads as the closing statement of the page instead of a
 * second CTA competing with the sticky bar.
 */
?>
<footer class="sitefoot">
  <div class="wrap">
    <div class="sitefoot__grid">
      <div>
        <?php /* As in the header, the visible brand word is a literal while
                 site('name') drives the labels elsewhere. */ ?>
        <a class="brand" href="<?= e(url('/')) ?>">
          <span class="brand__mark"><?= icon('i-house') ?></span>
          <span class="brand__text">
            <strong><?= e(site('brand_short')) ?></strong>
            <small>Home services</small>
          </span>
        </a>

        <p class="sitefoot__blurb">Practical help for pests, roofs, gardens and household plumbing in <?= e(site('primary_area')) ?> and nearby areas.</p>

        <?= phone_link(
            'footer',
            icon('i-phone') . '<span>' . e(site('phone_display')) . '</span>',
            'sitefoot__call'
        ) ?>

        <p class="sitefoot__hours">
          <?= icon('i-clock', 'ic ic--sm') ?>
          <span><?= e(site('hours')) ?></span>
        </p>
      </div>

      <div class="sitefoot__col">
        <h2>Services</h2>
        <?php foreach (config('main_services', []) as $service): ?>
          <a href="<?= e(url($service['href'])) ?>"><?= e($service['title']) ?></a>
        <?php endforeach; ?>
      </div>

      <div class="sitefoot__col">
        <h2>Company</h2>
        <a href="<?= e(url('/about')) ?>">About us</a>
        <a href="<?= e(url('/service-areas')) ?>">Service areas</a>
        <a href="<?= e(url('/contact')) ?>">Contact</a>
      </div>

      <div class="sitefoot__col">
        <h2>Information</h2>
        <a href="<?= e(url('/privacy')) ?>">Privacy policy</a>
        <a href="<?= e(url('/terms')) ?>">Terms of use</a>
        <a href="<?= e(url('/disclaimer')) ?>">Service disclaimer</a>
        <?php /* The privacy policy promises a way to change a consent decision
                 after the fact; this is it. It only does anything with JS, so
                 it is a button rather than a link to nowhere. */ ?>
        <button type="button" class="sitefoot__reset" data-consent-reset>Privacy choices</button>
      </div>
    </div>

    <?php /* Platform disclosure. Sits above the copyright line, in its own
             bordered band, at readable size rather than fine print — a visitor
             has to be able to tell that the operator is not the contractor. */ ?>
    <?php if ($address = formatted_address()): ?>
      <p class="sitefoot__address">
        <?= icon('i-pin', 'ic ic--sm') ?>
        <span><?= e(site('legal_name')) ?> &middot; <?= e($address) ?></span>
      </p>
    <?php endif; ?>

    <?php if ($disclosure = trim((string) site('platform_disclosure'))): ?>
      <p class="sitefoot__disclosure">
        <?= icon('i-info', 'ic ic--sm') ?>
        <span><?= e($disclosure) ?></span>
      </p>
    <?php endif; ?>

    <div class="sitefoot__base">
      <p>© <?= e(date('Y')) ?> <?= e(site('legal_name')) ?>. All rights reserved.</p>
      <p class="sitefoot__legal">
        <?php /* Repeated in the bottom bar as well as the Information column.
                 A privacy policy has to be prominently and consistently linked,
                 and the bottom bar is where visitors look for it by convention. */ ?>
        <a href="<?= e(url('/privacy')) ?>">Privacy policy</a>
        <span aria-hidden="true">&middot;</span>
        <a href="<?= e(url('/terms')) ?>">Terms</a>
        <span aria-hidden="true">&middot;</span>
        <a href="<?= e(url('/disclaimer')) ?>">Disclaimer</a>
      </p>
      <p>Independent home-services provider. Not affiliated with Google.</p>
    </div>
  </div>
</footer>
