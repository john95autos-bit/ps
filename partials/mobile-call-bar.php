<?php

/**
 * The sticky mobile call bar — the single highest-value element on the site.
 *
 * Expects no variables. Hidden above 900px by the stylesheet, where the
 * masthead CTA takes over.
 *
 * It ships in its off-screen state and assets/js/site.js adds `.is-in` on the
 * first animation frame, then publishes the measured height as --callbar-h so
 * the page reserves exactly that much bottom padding and the consent banner
 * stacks above it rather than over it. Nothing here waits on GSAP: with
 * reduced motion, or with the script blocked entirely, the CSS leaves the bar
 * in place and the number is still one tap away.
 */
?>
<div class="callbar" data-callbar>
  <?= phone_cta_stacked('callbar_sticky', 'btn btn--call btn--stack callbar__call') ?>

  <?php /* Secondary, deliberately small and quiet: it must never compete with
           the amber button beside it. */ ?>
  <a
    class="callbar__aux"
    href="<?= e(url('/contact')) ?>"
    aria-label="What to have ready before you call"
  ><?= icon('i-clipboard') ?></a>
</div>
