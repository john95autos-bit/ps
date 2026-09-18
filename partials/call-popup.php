<?php

/**
 * partials/call-popup.php — the timed call prompt.
 *
 * Takes no data; everything comes from config('call_popup'). Rendered into
 * every page but always starts `hidden`; assets/js/site.js owns the timing,
 * the focus trap and dismissal via the data-attribute contract:
 *
 *   [data-callpop]          the dialog wrapper
 *   [data-callpop-scrim]    click-to-dismiss backdrop
 *   [data-callpop-close]    the × button and the "keep reading" button
 *   data-delay / data-once  read from config, not hardcoded in JS
 *
 * Accessibility: this is a real modal dialog, so it carries role="dialog"
 * aria-modal="true" and is labelled by its own heading. site.js traps focus
 * inside it while open, closes on Escape, and returns focus to whatever was
 * focused before it appeared.
 *
 * Rendering it server-side rather than injecting it from JS means the markup is
 * in the DOM for assistive tech from the start and the copy stays in config
 * where a non-developer can edit it.
 */

$popup = config('call_popup', []);

if (empty($popup['enabled'])) {
    return;
}

$reasons = is_array($popup['reasons'] ?? null) ? $popup['reasons'] : [];

?>
<div class="callpop"
     data-callpop
     data-delay="<?= (int) ($popup['delay_ms'] ?? 3000) ?>"
     data-once="<?= !empty($popup['once_per_session']) ? '1' : '0' ?>"
     hidden>

  <div class="callpop__scrim" data-callpop-scrim></div>

  <div class="callpop__card"
       role="dialog"
       aria-modal="true"
       aria-labelledby="callpop-title"
       aria-describedby="callpop-text">

    <?php /* Purely decorative affordance telling a thumb the sheet can be
             dragged/dismissed. Hidden on desktop, where the card is centred. */ ?>
    <div class="callpop__grip" aria-hidden="true"></div>

    <button class="callpop__close" type="button" data-callpop-close aria-label="Close">
      <i class="ic ic--plus" aria-hidden="true"></i>
    </button>

    <?php /* The amber phone badge that used to sit here is gone. It competed
             with the amber call button directly beneath it, and on a card this
             small two amber blocks read as decoration rather than an action. */ ?>
    <p class="callpop__eyebrow"><?= e($popup['eyebrow'] ?? 'Speak to the team') ?></p>
    <h2 class="callpop__title" id="callpop-title"><?= e($popup['title'] ?? '') ?></h2>
    <p class="callpop__text" id="callpop-text"><?= e($popup['text'] ?? '') ?></p>

    <?php if ($reasons): ?>
      <ul class="callpop__list">
        <?php foreach ($reasons as $reason): ?>
          <li>
            <i class="ic ic--sm ic--check" aria-hidden="true"></i>
            <span><?= e($reason) ?></span>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>

    <?php /* Distinct placement so calls started from this prompt are separable
             from hero and sticky-bar calls in Google Ads reporting — that is how
             you find out whether the prompt is actually earning its intrusion. */ ?>
    <?= phone_cta('popup', 'btn btn--call btn--lg btn--block') ?>

    <p class="callpop__hours">
      <i class="ic ic--sm ic--clock" aria-hidden="true"></i>
      <span><?= e(site('hours')) ?></span>
    </p>

    <button class="callpop__dismiss" type="button" data-callpop-close>
      <?= e($popup['dismiss'] ?? 'Keep reading') ?>
    </button>
  </div>
</div>
