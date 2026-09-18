<?php

/**
 * The document shell — the PHP equivalent of the old app/layout.tsx.
 */

declare(strict_types=1);

/** Build the <title> for a route, applying the "%s | Business" template. */
function page_title(array $route): string
{
    $default = site('name') . ' | Practical Home-Service Support';

    if (empty($route['title'])) {
        return $default;
    }

    return meta_text((string) $route['title']) . ' | ' . site('name');
}

/**
 * Render one page: capture the view, then emit the full document.
 */
function render_page(string $path, array $route): void
{
    $viewFile = dirname(__DIR__) . '/views/' . $route['view'] . '.php';

    if (!is_file($viewFile)) {
        throw new RuntimeException("Missing view: {$route['view']}");
    }

    /* Views that emit their own non-HTML response (robots.txt, sitemap.xml)
       bypass the document shell entirely. */
    if (isset($route['raw'])) {
        header('Content-Type: ' . $route['raw']);
        require $viewFile;
        return;
    }

    $title       = page_title($route);
    $description = meta_text((string) ($route['description'] ?? ''));
    $canonical   = abs_url($route['canonical'] ?? $path);
    $ogImage     = $route['og_image'] ?? '/images/pest-control-hero.webp';
    /* Direct lookup, not config('images.' . $ogImage): the image keys contain
       dots (.webp), which the dot-path splitter would treat as separators. */
    $imageSizes  = config('images', []);
    $ogSize      = (is_array($imageSizes) && isset($imageSizes[$ogImage]))
        ? $imageSizes[$ogImage]
        : ['width' => 1672, 'height' => 941];

    /* The original always emitted `index, follow`, even with a (000) 000-0000
       phone number and "Your City" in every heading. `configured` was declared
       but never read by any code. It is now load-bearing: until it is true the
       site refuses to be indexed and says so on every page. */
    $robots = (!site_is_configured() || !empty($route['noindex']))
        ? 'noindex, nofollow'
        : 'index, follow';

    $errorRef = $route['error_ref'] ?? null;

    ob_start();

    try {
        require $viewFile;
    } catch (Throwable $error) {
        ob_end_clean();
        throw $error;
    }

    $content = (string) ob_get_clean();

    /* Per-request nonce so the Content-Security-Policy can allow this page's own
       inline bootstrap without opening the door to 'unsafe-inline'. */
    $nonce = base64_encode(random_bytes(16));
    send_csp($nonce);

    ?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($title) ?></title>
<meta name="description" content="<?= e($description) ?>">
<meta name="robots" content="<?= e($robots) ?>">
<meta name="application-name" content="<?= e(site('name')) ?>">
<meta name="theme-color" content="#0E1C31">
<meta name="format-detection" content="telephone=no">
<link rel="canonical" href="<?= e($canonical) ?>">
<link rel="icon" href="<?= e(asset('/favicon.svg')) ?>" type="image/svg+xml">
<link rel="shortcut icon" href="<?= e(asset('/favicon.svg')) ?>" type="image/svg+xml">

<meta property="og:type" content="website">
<meta property="og:locale" content="en_US">
<meta property="og:site_name" content="<?= e(site('name')) ?>">
<meta property="og:title" content="<?= e($title) ?>">
<meta property="og:description" content="<?= e($description) ?>">
<meta property="og:url" content="<?= e($canonical) ?>">
<meta property="og:image" content="<?= e(abs_url($ogImage)) ?>">
<meta property="og:image:width" content="<?= (int) $ogSize['width'] ?>">
<meta property="og:image:height" content="<?= (int) $ogSize['height'] ?>">
<meta property="og:image:alt" content="<?= e(site('brand_short')) ?> home-service support">
<?php /* Not in the Next.js original; added so a shared link renders a large card. */ ?>
<meta name="twitter:card" content="summary_large_image">

<?php /* Fonts are self-hosted, so they preload from this origin with no third-party
         connection. These URLs deliberately carry NO ?v= cache-buster: they must
         byte-match the src in fonts.css, or the browser treats them as different
         resources and downloads each face twice. */ ?>
<link rel="preload" href="<?= e(base_path()) ?>/assets/fonts/space-grotesk-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="<?= e(base_path()) ?>/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="<?= e(base_path()) ?>/assets/vendor/fontawesome/webfonts/fa-solid-subset.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="<?= e(asset('/assets/css/site.css')) ?>">

<?php /* Consent Mode 'default' must be registered before the bootstrap below
         replays a stored 'update', so the tag loads first. */ ?>
<?php /* Structured data. Emitted only once the launch validation passes —
         publishing a LocalBusiness record carrying (000) 000-0000 and "Your City"
         would feed placeholder data straight into Google's knowledge systems. */ ?>
<?php if (site_is_configured()): ?>
<script type="application/ld+json"><?= json_attr([
    '@context'    => 'https://schema.org',
    '@type'       => 'HomeAndConstructionBusiness',
    'name'        => site('name'),
    'legalName'   => site('legal_name'),
    'url'         => abs_url('/'),
    'image'       => abs_url('/images/pest-control-hero.webp'),
    'telephone'   => site('phone_href'),
    'address'     => array_filter([
        '@type'           => 'PostalAddress',
        'streetAddress'   => site('address')['street']   ?? '',
        'addressLocality' => site('address')['locality'] ?? '',
        'addressRegion'   => site('address')['region']   ?? '',
        'postalCode'      => site('address')['postcode'] ?? '',
        'addressCountry'  => site('address')['country']  ?? '',
    ]),
    'email'       => site('email'),
    /* Nationwide platform: the served area is a country, not a list of towns.
       Emitting six regions as Place entities would misrepresent the model. */
    'areaServed'  => ['@type' => 'Country', 'name' => 'United States'],
    'openingHours' => site('hours'),
    'description'  => $description,
]) ?></script>
<?php endif; ?>

<?php partial('google-ads', ['nonce' => $nonce]); ?>

<?php /* ------------------------------------------------------------------
         Inline bootstrap. Deliberately inline and deliberately first.

         1. Adds .js so the sticky call bar can be hidden-then-revealed. The
            bar is visible by default in CSS, so if this never runs the primary
            CTA is still on screen. (It used to ship off-screen and depend on
            129 KB of deferred JS to appear.)
         2. Replays a stored consent choice immediately. Doing this from the
            deferred bundle could land after gtag's 500 ms wait_for_update
            window, silently losing a returning visitor's granted consent.
         3. Captures phone taps that happen before the deferred bundle parses —
            the earliest clicks are the most motivated ones, and they were going
            unrecorded entirely.
         ------------------------------------------------------------------ */ ?>
<script nonce="<?= e($nonce) ?>">
(function(){
  var d=document.documentElement;
  d.className+=' js';

  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments);}
  window.gtag=window.gtag||gtag;

  try{
    var c=localStorage.getItem('adhs-consent');
    if(c){gtag('consent','update',{ad_storage:c==='accepted'?'granted':'denied',analytics_storage:c==='accepted'?'granted':'denied',ad_user_data:c==='accepted'?'granted':'denied',ad_personalization:c==='accepted'?'granted':'denied'});}
  }catch(e){}

  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('[data-phone-link]');
    if(!a||a.__tracked)return;
    a.__tracked=1;
    dataLayer.push({event:'phone_click',phone_number:(a.getAttribute('href')||'').replace(/^tel:/,''),link_placement:a.getAttribute('data-placement')||'unknown',page_path:location.pathname});
    if(window.__adsConversion)window.__adsConversion();
  },true);
})();
</script>

<?php /* Without JS the reveal styles never apply (they are gated behind
         .js-motion), so no fallback is needed for those. FAQ answers do need
         one, since they render collapsed. */ ?>
<noscript><style>[data-faq-a][hidden] { display: block !important; height: auto !important; }</style></noscript>
</head>
<body>
<a class="skip-link" href="#main-content">Skip to content</a>
<?php partial('prelaunch-notice'); ?>
<?php partial('header'); ?>
<main id="main-content"><?= $content ?></main>
<?php partial('footer'); ?>
<?php partial('mobile-call-bar'); ?>
<?php partial('cookie-consent'); ?>
<?php partial('call-popup'); ?>

<?php /* GSAP is vendored locally rather than pulled from a CDN: one less
         third-party origin on an ad landing page, and it cannot break because
         someone else's CDN is down. Both are deferred, so the call button is
         tappable long before any of this parses. */ ?>
<?php /* Parser-inserted and deferred, so execution order is guaranteed:
         gsap -> ScrollTrigger -> site.js. Injecting these conditionally to save
         46 KB for reduced-motion visitors was tried and reverted: a dynamically
         created <script> ignores `defer` and behaves as async, so GSAP could
         land after site.js had already decided it was absent and skipped every
         animation. Loading it unconditionally is the safe trade. All three are
         deferred, so the call button is tappable long before any of this runs. */ ?>
<script src="<?= e(asset('/assets/js/vendor/gsap.min.js')) ?>" defer></script>
<script src="<?= e(asset('/assets/js/vendor/ScrollTrigger.min.js')) ?>" defer></script>
<script src="<?= e(asset('/assets/js/site.js')) ?>" defer></script>
</body>
</html>
<?php
}
