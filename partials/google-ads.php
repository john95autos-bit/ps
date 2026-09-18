<?php

/**
 * partials/google-ads.php — the Google tag and call-conversion wiring.
 *
 * Rendered inside <head>, BEFORE the inline bootstrap, because Consent Mode
 * requires the `default` to be registered before any `update` is replayed.
 *
 * Expects: $nonce (CSP nonce for the inline block).
 *
 * Config it reads (config/site.php -> site.*):
 *   google_ads_id                 AW-123456789   loads gtag.js
 *   google_ads_conversion_label   AbC-D_efGh12   fires the call conversion
 *   gtm_id                        GTM-XXXXXXX    optional, instead of gtag.js
 */

$tagId      = (string) site('google_ads_id');
$label      = (string) site('google_ads_conversion_label');
$gtmId      = (string) site('gtm_id');
$nonce      = $nonce ?? '';

$hasTag = (bool) preg_match('/^AW-\d+$/D', $tagId);
$hasGtm = (bool) preg_match('/^GTM-[A-Z0-9]+$/D', $gtmId);

/* Guard before a single byte is written, so an unset or malformed id leaves the
   document completely untouched. */
if (!$hasTag && !$hasGtm) {
    return;
}

/* ---------------------------------------------------------------------------
   THE BUG THIS FIXES
   The site's only conversion action is a phone call. Every call surface pushed
   `phone_click` into dataLayer — but the page loaded gtag.js, which has no
   trigger engine and never reads arbitrary dataLayer objects. The events went
   into a queue nothing consumed, so Google Ads recorded ZERO conversions no
   matter how many calls came in.

   Two supported paths now:
   · gtag.js + a conversion label -> window.__adsConversion() fires the real
     `conversion` event, and the inline bootstrap calls it on every phone tap.
   · a GTM container -> gtm.js DOES consume dataLayer, so the existing
     phone_click push becomes usable as a trigger with no code change.
   --------------------------------------------------------------------------- */

$sendTo = ($hasTag && $label !== '') ? $tagId . '/' . $label : '';
?>
<link rel="preconnect" href="https://www.googletagmanager.com">
<script<?= $nonce !== '' ? ' nonce="' . e($nonce) . '"' : '' ?>>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

/* Denied by default, before the library loads. The original pushed bare arrays
   — dataLayer.push(["consent","default",{...}]) — which is not the shape the
   tag reads, so the denied default never actually registered. */
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
<?php if ($hasTag): ?>
gtag('js', new Date());
gtag('config', <?= json_attr($tagId) ?>);
<?php endif; ?>
<?php if ($sendTo !== ''): ?>

/* Called by the inline bootstrap on every tel: tap. Without this, a phone call
   is never reported to Google Ads as a conversion. */
window.__adsConversion = function () {
  gtag('event', 'conversion', { send_to: <?= json_attr($sendTo) ?> });
};
<?php endif; ?>
</script>
<?php if ($hasTag): ?>
<script async src="https://www.googletagmanager.com/gtag/js?id=<?= e(rawurlencode($tagId)) ?>"></script>
<?php endif; ?>
<?php if ($hasGtm): ?>
<script<?= $nonce !== '' ? ' nonce="' . e($nonce) . '"' : '' ?>>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',<?= json_attr($gtmId) ?>);
</script>
<?php endif; ?>
