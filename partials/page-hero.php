<?php

/**
 * partials/page-hero.php — the compact head every sub-page opens with.
 *
 * Two shapes, decided by whether an image was passed:
 *   with an image  -> .pagehead + .pagehead__media + .pagehead__scrim
 *   without one    -> .pagehead.pagehead--plain (flat navy, no photo request)
 *
 * Expects (every key optional — an omitted key must never raise a warning,
 * hence the `?? default` block below):
 *   $eyebrow   — short uppercase label above the heading
 *   $title     — plain-text <h1>; the page's only h1
 *   $text      — plain-text lead paragraph
 *   $image     — image path registered in config('images'), e.g. '/images/x.webp'
 *   $image_alt — alt text for it; '' leaves the photo decorative, which is the
 *                right answer for a backdrop sitting under a scrim
 *   $crumbs    — list of ['label' => string, 'href' => string|null]; the last
 *                crumb always renders as <span aria-current="page">
 *
 * No [data-anim] anywhere in here on purpose: this block is the first screen on
 * every sub-page, and the first screen must be painted and tappable without
 * waiting on JavaScript.
 */

$eyebrow   = $eyebrow ?? '';
$title     = $title ?? '';
$text      = $text ?? '';
$image     = $image ?? '';
$image_alt = $image_alt ?? '';
$crumbs    = $crumbs ?? [];

$crumbs     = array_values(array_filter(is_array($crumbs) ? $crumbs : [], 'is_array'));
$crumbsLast = count($crumbs) - 1;

if (!function_exists('pagehead_crumb_href')) {
    /**
     * Resolve a crumb href.
     *
     * Callers may pass either a bare route ('/pest-control') or a link already
     * run through url() ('/ps2/pest-control'). Both are accepted, and neither
     * ends up with the base path applied twice.
     */
    function pagehead_crumb_href(string $href): string
    {
        /* Only http/https absolutes are passed through. The previous test let
           ANY scheme past, so a javascript: or data: href would have been
           written straight into the anchor — e() escapes the quotes but does
           nothing about the scheme, so it would still have executed on click.
           Protocol-relative "//host" is rejected too: nothing on this site
           legitimately produces one. */
        if ($href === '') {
            return $href;
        }
        if (preg_match('~^(?:https?:)//~i', $href) === 1) {
            return $href;
        }
        if (preg_match('~^(?:[a-z][a-z0-9+.\-]*:|//)~i', $href) === 1) {
            return url('/');   // unknown or dangerous scheme -> home
        }

        $base = base_path();
        if ($base !== '' && ($href === $base || str_starts_with($href, $base . '/'))) {
            return $href;
        }

        return url($href);
    }
}
?>
<section class="pagehead<?= $image === '' ? ' pagehead--plain' : '' ?>">
<?php if ($image !== ''): ?>
  <div class="pagehead__media"><?= img_tag($image, $image_alt, ['fetchpriority' => 'high']) ?></div>
  <div class="pagehead__scrim"></div>
<?php endif; ?>
  <div class="wrap">
    <div class="pagehead__inner">
<?php if ($crumbs !== []): ?>
      <nav class="crumbs" aria-label="Breadcrumb">
<?php foreach ($crumbs as $crumbIndex => $crumb): ?>
<?php
        $crumbLabel = (string) ($crumb['label'] ?? '');
        $crumbHref  = (string) ($crumb['href'] ?? '');
        $crumbIsEnd = $crumbIndex === $crumbsLast;
?>
<?php if ($crumbIndex > 0): ?>
        <span class="sep"><?= icon('i-chevron-right', 'ic ic--sm') ?></span>
<?php endif; ?>
<?php if ($crumbIsEnd): ?>
        <span aria-current="page"><?= e($crumbLabel) ?></span>
<?php elseif ($crumbHref === ''): ?>
        <span><?= e($crumbLabel) ?></span>
<?php else: ?>
        <a href="<?= e(pagehead_crumb_href($crumbHref)) ?>"><?= e($crumbLabel) ?></a>
<?php endif; ?>
<?php endforeach; ?>
      </nav>
<?php endif; ?>
<?php if ($eyebrow !== ''): ?>
      <p class="eyebrow eyebrow--on-navy"><?= e($eyebrow) ?></p>
<?php endif; ?>
      <h1><?= e($title) ?></h1>
<?php if ($text !== ''): ?>
      <p class="lede lede--on-navy"><?= e($text) ?></p>
<?php endif; ?>
    </div>
  </div>
</section>
