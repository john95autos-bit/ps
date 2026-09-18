<?php

/**
 * partials/cookie-consent.php — the consent banner.
 *
 * Takes no data. The banner is always in the document, always starts `hidden`,
 * and assets/js/site.js owns it from there via the data-attribute contract:
 *
 *   [data-consent]                 the banner element
 *   [data-consent-choice="…"]      "essential" | "accepted"
 *
 * There is deliberately no PHP branching here: site.js replays a stored choice
 * on every load and only reveals this banner when no choice is stored, so a
 * returning visitor's Consent Mode update fires on every page rather than only
 * on the visit where they clicked.
 *
 * The stylesheet parks it directly on top of the sticky call bar
 * (`bottom: calc(var(--callbar-h) + …)`), so it never covers the phone button.
 */

?>
<aside class="consent" aria-label="Privacy choices" data-consent hidden>
  <strong>Your privacy choices</strong>
  <p>
    A Google advertising tag loads on every page. Until you choose, it is set to
    denied and uses no identifiers or cookies. <span class="consent__detail">Accepting lets it measure whether
    an ad led to a phone call.</span> <a href="<?= e(url('/privacy')) ?>">Privacy policy</a>.
  </p>
  <div class="consent__actions">
    <?php /* Both buttons carry the same weight and the same size. A reject
             option that is visually subordinate to accept is a dark pattern and
             is treated as invalid consent under the GDPR. */ ?>
    <button class="btn btn--outline" type="button" data-consent-choice="essential">Essential only</button>
    <button class="btn btn--dark" type="button" data-consent-choice="accepted">Accept optional</button>
  </div>
</aside>
