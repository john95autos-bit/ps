<?php

/**
 * views/pest-detail.php — one page per pest type.
 *
 * In scope from render_page(): $path, $route, $title, $description,
 * $canonical, $ogImage, $ogSize, $robots.
 *
 * $route['slug'] selects the pest page:
 * 'cockroach-control' | 'termite-control' | 'bed-bug-control' | 'rodent-control'.
 * The React component took the same value as a prop and indexed `pestPages`.
 *
 * The page head is written out here rather than delegated to partials/page-hero
 * so the call button can sit inside .pagehead__inner, above the fold at 375×667.
 */

$slug = (string) ($route['slug'] ?? '');
$pest = config('pest_pages.' . $slug);

if (!is_array($pest)) {
    throw new RuntimeException("Unknown pest page: {$slug}");
}

foreach (['title', 'pest', 'intro'] as $required) {
    if (!isset($pest[$required])) {
        throw new RuntimeException("pest_pages.{$slug} is missing '{$required}'");
    }
}
/* Normalise the collections so an incomplete config entry cannot spray
   "foreach() argument must be of type array" warnings into the page body. */
foreach (['clues', 'approach', 'faqs'] as $listKey) {
    $pest[$listKey] = is_array($pest[$listKey] ?? null) ? $pest[$listKey] : [];
}

/* The original called `pest.pest.toLowerCase()` in two places. */
$pestLower = mb_strtolower((string) $pest['pest']);

?>
<section class="pagehead">
    <div class="pagehead__media">
        <?php /* First hero image: never lazy-loaded. img_tag adds width/height (the CLS fix). */ ?>
        <?= img_tag('/images/pest-control-hero.webp', 'Pest-control technician inspecting a residential kitchen') ?>
    </div>
    <div class="pagehead__scrim"></div>
    <div class="wrap">
        <div class="pagehead__inner">
            <nav class="crumbs" aria-label="Breadcrumb">
                <a href="<?= e(url('/')) ?>">Home</a>
                <span class="sep" aria-hidden="true">/</span>
                <a href="<?= e(url('/pest-control')) ?>">Pest control</a>
                <span class="sep" aria-hidden="true">/</span>
                <span aria-current="page"><?= e($pest['pest']) ?></span>
            </nav>
            <p class="eyebrow eyebrow--on-navy">Residential pest information</p>
            <h1><?= e($pest['title']) ?></h1>
            <p class="lede lede--on-navy"><?= e($pest['intro']) ?></p>
            <?= phone_cta($slug . '_hero', 'btn btn--call btn--lg') ?>
        </div>
    </div>
</section>

<section class="section s-paper">
    <div class="wrap">
        <div class="sec-head" data-anim="rise">
            <p class="eyebrow">Possible signs</p>
            <h2>What people commonly notice.</h2>
            <p class="lede">One sign alone may not confirm <?= e($pestLower) ?>. Avoid disturbing the area before asking what will help an inspection.</p>
        </div>
        <div class="signals signals--two" data-anim-group>
            <?php foreach ($pest['clues'] as $clue): ?>
                <div class="signal" data-anim="rise">
                    <?= icon('i-search') ?>
                    <strong><?= e($clue) ?></strong>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="section s-white">
    <div class="wrap">
        <div class="sec-head" data-anim="rise">
            <p class="eyebrow">A practical approach</p>
            <h2>Inspection, treatment planning and clear aftercare.</h2>
        </div>
        <div class="stack-lg">
            <?php /* The 01–04 badge on each step is a CSS counter, so no number is
                     written into the markup here. */ ?>
            <div class="steps" data-anim-group>
                <?php foreach ($pest['approach'] as $approachStep): ?>
                    <div class="step" data-anim="rise">
                        <h3><?= e($approachStep) ?></h3>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="notecard notecard--warn" data-anim="rise">
                <?= icon('i-alert', 'ic ic--lg') ?>
                <div>
                    <strong>Safety comes first.</strong>
                    <p>Tell the technician about children, pets, pregnancy, allergies, respiratory conditions and sensitive areas. Any pesticide use must follow the product label and applicable local rules.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="section s-navy">
    <div class="wrap">
        <div class="split split--wide-right">
            <div class="stack" data-anim="left">
                <p class="eyebrow eyebrow--on-navy"><?= e($pest['pest']) ?> FAQs</p>
                <h2>Answers without overpromising.</h2>
                <p class="lede lede--on-navy">The right plan depends on evidence found at the property.</p>
            </div>
            <div data-anim="right">
                <?php partial('faq', ['items' => $pest['faqs']]); ?>
            </div>
        </div>
    </div>
</section>

<?php partial('call-panel', [
    'title'     => 'Concerned about ' . $pestLower . '? Start with a clear description.',
    'placement' => $slug . '_cta_panel',
]); ?>
