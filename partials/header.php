<?php

/**
 * Site chrome: desktop top bar, sticky masthead, mobile drawer.
 *
 * Expects no variables. Reads nav_items() from inc/router.php and the business
 * identity from config/site.php.
 *
 * Structure notes:
 * · .topbar is desktop-only (the stylesheet reveals it at 900px), so the phone
 *   number never loses vertical space to it on the screens that convert.
 * · The drawer is a child of .masthead on purpose. .masthead carries a
 *   backdrop-filter, which makes it the containing block for fixed-position
 *   descendants, so the drawer's `inset: 64px 0 auto` resolves against the
 *   header itself and stays pinned to its lower edge at every scroll position.
 * · The menu is always server-rendered CLOSED — `inert` plus aria-hidden, so
 *   its links leave the tab order and the accessibility tree together.
 *   assets/js/site.js drops both attributes when it opens; there is no inline
 *   JavaScript anywhere in this project.
 */

$navItems = nav_items();

/* The drawer carries the primary nav plus any secondary destination not already
   in it. Filtered rather than appended blindly: Contact joined the main nav, and
   a hardcoded append would have listed it twice. */
$drawerItems = $navItems;
foreach ([['label' => 'Service areas', 'href' => '/service-areas'],
          ['label' => 'Contact',       'href' => '/contact']] as $extra) {
    if (!in_array($extra['href'], array_column($navItems, 'href'), true)) {
        $drawerItems[] = $extra;
    }
}

/* is_active() also matches ancestors (/pest-control on a pest sub-page), which
   is right for the underline but wrong for aria-current="page". */
$here = current_path();
?>
<div class="topbar">
  <div class="wrap">
    <span class="topbar__item">
      <?= icon('i-pin', 'ic ic--sm') ?>
      <span>Serving <?= e(site('primary_area')) ?> and nearby areas</span>
    </span>
    <span class="topbar__item">
      <?= icon('i-clock', 'ic ic--sm') ?>
      <span><?= e(site('hours')) ?></span>
    </span>
  </div>
</div>

<header class="masthead" data-masthead>
  <div class="wrap">
    <?php /* The visible brand word is a literal while site('name') drives the
             accessible label — the same split the original markup used. */ ?>
    <a class="brand" href="<?= e(url('/')) ?>" aria-label="<?= e(site('name') . ' home') ?>">
      <span class="brand__mark"><?= icon('i-house') ?></span>
      <span class="brand__text">
        <strong><?= e(site('brand_short')) ?></strong>
        <small>Home services</small>
      </span>
    </a>

    <nav class="mainnav" aria-label="Primary navigation">
      <?php foreach ($navItems as $item): ?>
        <a
          <?= is_active($item['href']) ? 'class="is-active"' : '' ?>
          href="<?= e(url($item['href'])) ?>"
          <?= $here === $item['href'] ? 'aria-current="page"' : '' ?>
        ><?= e($item['label']) ?></a>
      <?php endforeach; ?>
    </nav>

    <?= phone_cta_stacked('header_desktop', 'btn btn--call btn--stack masthead__call') ?>

    <button
      class="navtoggle"
      type="button"
      data-navtoggle
      aria-expanded="false"
      aria-controls="mobile-nav"
      aria-label="Open navigation"
    >
      <span></span>
      <span></span>
    </button>
  </div>

  <div class="drawer" id="mobile-nav" data-drawer inert aria-hidden="true">
    <div class="drawer__inner">
      <nav aria-label="Mobile navigation">
        <?php foreach ($drawerItems as $item): ?>
          <a
            <?= is_active($item['href']) ? 'class="is-active"' : '' ?>
            href="<?= e(url($item['href'])) ?>"
            <?= $here === $item['href'] ? 'aria-current="page"' : '' ?>
          ><span><?= e($item['label']) ?></span><?= icon('i-chevron-right', 'ic ic--sm') ?></a>
        <?php endforeach; ?>
      </nav>

      <div class="drawer__cta">
        <?= phone_cta('drawer', 'btn btn--call btn--block') ?>
      </div>

      <p class="drawer__hours">
        <span class="pill"><?= icon('i-clock', 'ic ic--sm') ?><span><?= e(site('hours')) ?></span></span>
      </p>
    </div>
  </div>
</header>
