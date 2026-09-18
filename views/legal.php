<?php

/**
 * views/legal.php — one view, three routes: /privacy, /terms and /disclaimer.
 *
 * In scope from render_page(): $path, $route, $title, $description,
 * $canonical, $ogImage, $ogSize, $robots.
 *
 * $route['slug'] selects the document: 'privacy' | 'terms' | 'disclaimer'.
 * The copy — every section title and paragraph, in the original order — lives
 * in config/legal.php and is rendered verbatim; nothing is written here.
 *
 * Call surfaces on this page: <slug>_cta_panel (the closing panel only, so the
 * placement is still unique when all three documents share this template).
 */

$documents = require dirname(__DIR__) . '/config/legal.php';
$slug      = (string) ($route['slug'] ?? '');

if (!isset($documents[$slug])) {
    throw new RuntimeException("Unknown legal document: {$slug}");
}

$document = $documents[$slug];

/* Paragraph copy is stored with a {legal_name} placeholder where the React
   original interpolated ${siteConfig.legalName} (privacy, section 1), so the
   text stays a plain string in config and the legal entity is edited once, in
   config/site.php. */
$tokens = [
    '{legal_name}' => (string) site('legal_name'),
    '{address}'    => formatted_address(),
    '{phone}'      => (string) site('phone_display'),
    '{email}'      => (string) site('email'),
];

?>
<?php partial('page-hero', [
    'eyebrow' => $document['eyebrow'],
    'title'   => $document['title'],
    'text'    => $document['intro'],
    'crumbs'  => [
        ['label' => 'Home',                'href' => '/'],
        ['label' => $document['eyebrow'],  'href' => null],
    ],
]); ?>

<section class="section s-white">
  <div class="wrap wrap--narrow">
    <?php /* One reveal for the document as a whole: the guidance is to animate
             section-level blocks, and eight separately fading clauses would
             turn a legal page into a slideshow. */ ?>
    <article class="legal" data-anim="fade">
      <?php /* A <div>, not a <p>: `.legal p` is the more specific selector and
               would override the pill's own size and colour. The date comes
               from config/site.php so all three documents re-date in one edit. */ ?>
      <div class="legal__updated">
        <?= icon('i-clock', 'ic ic--sm') ?>
        <span>Last updated: <?= e(legal_updated_date()) ?></span>
      </div>
      <?php foreach ($document['sections'] as $section): ?>
        <section>
          <h2><?= e($section['title']) ?></h2>
          <?php foreach ($section['paragraphs'] as $paragraph): ?>
            <p><?= e(strtr($paragraph, $tokens)) ?></p>
          <?php endforeach; ?>
        </section>
      <?php endforeach; ?>
    </article>
  </div>
</section>

<?php partial('call-panel', [
    'placement' => $slug . '_cta_panel',
    'eyebrow'   => 'Questions about this page?',
    'title'     => 'Ask before you decide.',
    'text'      => 'If anything here affects the work you are considering, call and ask. We will explain what applies to your enquiry.',
]); ?>
