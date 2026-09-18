<?php /**
 * Service areas page (/service-areas).
 *
 * The coverage list and the heading come from config/site.php
 * (site('service_areas'), site('primary_area')), so the list stays in one place.
 *
 * Call surfaces on this page: areas_check, areas_cta_panel.
 */

$areas = (array) site('service_areas', []);
?>
<?php partial('page-hero', [
    'eyebrow' => 'Service areas',
    'title'   => 'Local coverage, confirmed before you rely on a visit.',
    'text'    => 'Enter no details online—call with your postcode, ZIP code or neighbourhood and the service you need.',
    'crumbs'  => [
        ['label' => 'Home',          'href' => '/'],
        ['label' => 'Service areas', 'href' => null],
    ],
]); ?>

<section class="section s-paper">
  <div class="wrap split split--wide-left">
    <div class="stack" data-anim="left">
      <p class="eyebrow">Regions covered</p>
      <h2><?= e(site('coverage')) ?> across <?= e(site('primary_area')) ?>.</h2>
      <p class="lede"><?= e(site('coverage_note')) ?></p>
      <p class="muted">We are a free platform: you tell us the job and the ZIP code, and we look for an available independent contractor near you. We do not carry out the work ourselves.</p>
      <?= phone_cta('areas_check', 'btn btn--call') ?>
    </div>
    <div class="areas" data-anim-group>
      <?php foreach ($areas as $area): ?>
        <div class="area-chip" data-anim="scale">
          <i class="ic ic--pin" aria-hidden="true"></i>
          <strong><?= e($area) ?></strong>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section--tight s-white">
  <div class="wrap wrap--narrow">
    <div class="notecard notecard--warn" data-anim>
      <i class="ic ic--alert" aria-hidden="true"></i>
      <div>
        <strong>What nationwide does and does not mean</strong>
        <p>Nationwide describes where we look for contractors, not a guarantee that every trade is available in every location on any given day. Rural addresses, specialist work and short-notice jobs are the most likely to have limited availability. Nothing is confirmed until a contractor accepts the job.</p>
      </div>
    </div>
  </div>
</section>

<?php partial('call-panel', [
    'placement' => 'areas_cta_panel',
    'title'     => 'Not sure whether your address is covered?',
    'text'      => 'Call with your location and the service needed. We will confirm current coverage and availability.',
]); ?>
