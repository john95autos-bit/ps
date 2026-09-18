<?php

/**
 * partials/call-panel.php — the dark closing band every page ends on.
 *
 * Expects (all optional; the defaults are the copy the site has always used):
 *   $eyebrow   — small label above the heading
 *   $title     — <h2>
 *   $text      — supporting sentence
 *   $placement — data-placement for the phone link, default 'cta_panel'.
 *                Pass a page-specific value when a page already spends
 *                'cta_panel' somewhere else, so no two call surfaces on one
 *                page report the same placement.
 *
 * The eyebrow is a <span>, not a <p>: `.cta-panel p` is more specific than
 * `.eyebrow--on-navy`, so a paragraph here would lose its amber accent and pick
 * up the body-copy colour and margin instead.
 *
 * The phone button deliberately carries no [data-anim]. Everything else in the
 * panel may reveal on scroll; the call action is never allowed to depend on
 * JavaScript having run.
 */

$eyebrow   = $eyebrow ?? 'Ready to talk?';
$title     = $title ?? 'Start with one clear phone call.';
$text      = $text ?? 'Tell us what is happening, where you are and when you need help. We will explain the available next step.';
$placement = $placement ?? 'cta_panel';
?>
<section class="cta-panel">
  <div class="wrap">
    <div class="cta-panel__inner">
      <div class="stack" data-anim="rise">
<?php if ($eyebrow !== ''): ?>
        <span class="eyebrow eyebrow--on-navy"><?= e($eyebrow) ?></span>
<?php endif; ?>
        <h2><?= e($title) ?></h2>
<?php if ($text !== ''): ?>
        <p><?= e($text) ?></p>
<?php endif; ?>
      </div>
      <div class="cta-panel__actions">
        <?= phone_cta($placement, 'btn btn--call btn--lg') ?>
        <div class="cta-panel__hours">
          <?= icon('i-clock', 'ic ic--sm') ?>
          <span><?= e(site('hours')) ?></span>
        </div>
      </div>
    </div>
  </div>
</section>
