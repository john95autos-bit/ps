<?php

/**
 * Pre-launch banner.
 *
 * Expects no variables.
 *
 * The original declared `configured` in lib/site.ts and never read it, so a
 * site full of placeholder details ((000) 000-0000, "Your City") looked
 * launch-ready. The flag is now load-bearing: while it is false this banner
 * appears on every page and inc/layout.php emits `noindex, nofollow`.
 *
 * It sits above the masthead in source order and scrolls away with the page —
 * it must never occupy fixed space on a phone, where every pixel above the
 * fold belongs to the call action.
 */

if (site_is_configured()) {
    return;
}
?>
<?php
/* Name the actual blockers rather than saying "placeholder details are still in
   place". An operator who has just set `configured => true` and still sees this
   banner needs to know precisely what is stopping the launch. */
$blockers = launch_blockers();
$claimed  = site('configured') === true;
?>
<div class="prelaunch">
  <div class="wrap">
    <?= icon('i-alert', 'ic ic--sm') ?>
    <strong><?= $claimed ? 'Launch blocked' : 'Pre-launch preview' ?></strong>
    <span>
      <?php if ($blockers): ?>
        <?= e(ucfirst(implode('; ', $blockers))) ?>. This site stays <code>noindex</code> until these are resolved.
      <?php else: ?>
        Set <code>configured =&gt; true</code> in config/local.php to go live. See LAUNCH-CHECKLIST.md.
      <?php endif; ?>
    </span>
  </div>
</div>
