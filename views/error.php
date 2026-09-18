<?php
/**
 * views/error.php — the 500 page.
 *
 * Rendered by index.php's exception handler. Deliberately carries the phone
 * CTA: a visitor who arrived from a paid click and hit a server fault is still
 * a lead, and a dead-end error page throws that click away.
 *
 * Never renders the exception message, class or stack trace. Those go to the
 * PHP error log; the visitor gets a reference they can quote instead.
 */
?>
<section class="section">
  <div class="wrap">
    <div class="notfound">
      <p class="notfound__code" aria-hidden="true">500</p>
      <h1>Something went wrong on our side.</h1>
      <p class="lede">The page could not be loaded. This is a fault with the website, not with anything you did.</p>
      <p class="muted">You can still reach the team by phone during published hours.</p>

      <div class="notfound__actions">
        <a class="btn btn--dark" href="<?= e(url('/')) ?>">Return home</a>
        <?= phone_cta('error_500', 'btn btn--call') ?>
      </div>

      <?php if (!empty($errorRef)): ?>
        <p class="fineprint" style="margin-top:var(--s6)">Reference: <?= e($errorRef) ?></p>
      <?php endif; ?>
    </div>
  </div>
</section>
