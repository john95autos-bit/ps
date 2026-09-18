<?php

/**
 * partials/faq.php — the accordion used on the home, service and pest pages.
 *
 * Expects:
 *   $items — list of ['question' => string, 'answer' => string]
 *
 * Contract with assets/js/site.js:
 *   [data-faq]       the wrapper           — one accordion group
 *   [data-faq-item]  each question/answer pair
 *   [data-faq-q]     the button; carries aria-expanded + aria-controls
 *   [data-faq-a]     the panel; carries the matching id, and `hidden` on every
 *                    item except the first
 *
 * Every answer is in the HTML, so the content is readable, indexable and
 * printable with JavaScript switched off (inc/layout.php ships a <noscript>
 * rule that un-hides the collapsed panels).
 *
 * The icon is always i-plus. `.faq__q[aria-expanded="true"] .faq__icon` rotates
 * it 45deg into a minus, so the open and closed states differ by one attribute
 * and the markup never has to change.
 */

if (!function_exists('faq_block_id')) {
    /**
     * Sequential id prefix — one per FAQ block rendered on this request, so two
     * accordions on the same page cannot hand out colliding panel ids.
     *
     * The counter lives inside a function because a partial can be included
     * many times per request: file-scope state would reset on every include.
     */
    function faq_block_id(): string
    {
        static $blocks = 0;

        return 'faq-' . (++$blocks);
    }
}

$faqBlock = faq_block_id();
$faqItems = array_values(array_filter(is_array($items ?? null) ? $items : [], 'is_array'));
?>
<div class="faq" data-faq>
<?php foreach ($faqItems as $faqIndex => $faqItem): ?>
<?php
    /* First item open, matching the state site.js re-applies on load. */
    $faqOpen     = $faqIndex === 0;
    $faqAnswerId = $faqBlock . '-answer-' . $faqIndex;
?>
  <div class="faq__item" data-faq-item>
    <button class="faq__q" type="button" data-faq-q aria-expanded="<?= $faqOpen ? 'true' : 'false' ?>" aria-controls="<?= e($faqAnswerId) ?>">
      <span><?= e($faqItem['question'] ?? '') ?></span>
      <span class="faq__icon"><?= icon('i-plus', 'ic ic--sm') ?></span>
    </button>
    <div class="faq__a" id="<?= e($faqAnswerId) ?>" data-faq-a<?= $faqOpen ? '' : ' hidden' ?>>
      <p><?= e($faqItem['answer'] ?? '') ?></p>
    </div>
  </div>
<?php endforeach; ?>
</div>
