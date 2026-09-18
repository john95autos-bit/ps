<?php

/**
 * views/not-found.php — rendered for ANY unmatched path.
 *
 * index.php sends the 404 status before dispatching here and passes only
 * $path, $route, $title, $description, $canonical, $ogImage, $ogSize and
 * $robots — there is no route table entry behind this page, so nothing below
 * may read $route['slug'] or any other page-specific data.
 *
 * No [data-anim] anywhere: this is the whole first screen, and a visitor who
 * has already hit a dead end must not wait on JavaScript to see the way out.
 *
 * Call surfaces on this page: notfound.
 */

?>
<section class="section s-white">
  <div class="wrap">
    <div class="notfound">
      <div class="notfound__code">404</div>
      <h1>That page is not here.</h1>
      <p>The link may be old or the address may have been typed incorrectly.</p>
      <div class="notfound__actions">
        <a class="btn btn--dark" href="<?= e(url('/')) ?>">Return home</a>
        <?= phone_cta('notfound', 'btn btn--call') ?>
      </div>
    </div>
  </div>
</section>
