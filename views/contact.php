<?php /**
 * Contact page (/contact).
 *
 * Layout: the two ways of getting in touch sit side by side — the phone card on
 * the left, the enquiry form on the right — so a visitor chooses between them
 * instead of scrolling past one to find the other. The "have this ready" list
 * follows underneath, where it works for both routes rather than only for the
 * phone call it used to sit beside.
 *
 * Call surfaces on this page: contact_card, contact_button,
 * contact_form_success, contact_cta_panel.
 */

/* Numbering is a CSS counter on .prep-list li — never written into the markup. */
$contactSteps = [
    ['title' => 'Your location',            'text' => 'Postcode, ZIP code or neighbourhood.'],
    ['title' => 'The service needed',       'text' => 'Pest control, roofing, gardening or plumbing.'],
    ['title' => 'What you noticed',         'text' => 'Signs, affected area and when it started.'],
    ['title' => 'Access or safety details', 'text' => 'Children, pets, height, utilities or urgent risks.'],
];

/* The handler must run before a byte is emitted: a rejected submission
   re-renders with the visitor's values intact. */
$lead = lead_handle();
?>
<?php partial('page-hero', [
    'eyebrow' => 'Contact',
    'title'   => 'One call. A clearer next step.',
    'text'    => 'For the fastest response, call during published hours and tell us the service, property location and what you have noticed.',
    'crumbs'  => [
        ['label' => 'Home',    'href' => '/'],
        ['label' => 'Contact', 'href' => null],
    ],
]); ?>

<section class="section s-paper">
  <div class="wrap contact-layout">

    <div class="contact-col" data-anim="left">

      <div class="contact-card">
        <p class="contact-card__label">Phone enquiries</p>
        <?= phone_link('contact_card', e(site('phone_display')), 'contact-card__number') ?>
        <p class="contact-card__hours">
          <i class="ic ic--sm ic--clock" aria-hidden="true"></i>
          <span><?= e(site('hours')) ?></span>
        </p>
        <?= phone_cta('contact_button', 'btn btn--call btn--lg btn--block') ?>
        <small>Standard network charges may apply. Calling does not confirm a booking.</small>

        <?php if ($address = formatted_address()): ?>
          <p class="contact-card__alt">
            <?= icon('i-pin', 'ic ic--sm') ?>
            <span><?= e(site('legal_name')) ?><br><?= e($address) ?></span>
          </p>
        <?php endif; ?>

        <?php /* The privacy policy tells visitors to exercise their data rights by
                 email, and the site had no email address anywhere — a dead end for
                 anyone trying to use a right the policy grants them. */ ?>
        <p class="contact-card__alt">
          <?= icon('i-clipboard', 'ic ic--sm') ?>
          <span>Prefer to write? <a href="mailto:<?= e(site('email')) ?>"><?= e(site('email')) ?></a> — for enquiries that are not urgent, and for privacy or data requests.</span>
          </p>
        </div>

      <?php /* Sits under the phone card rather than in its own band below: the
               card is short and the form is tall, and the difference otherwise
               leaves a screen-height hole in this column. */ ?>
      <div class="prep-block">
        <p class="eyebrow">Have this ready</p>
        <h2>Help us understand the enquiry.</h2>
        <p>Whether you call or use the form, these four things are what a contractor needs before they can tell you anything useful.</p>
        <ol class="prep-list">
          <?php foreach ($contactSteps as $step): ?>
            <li>
              <div>
                <strong><?= e($step['title']) ?></strong>
                <span><?= e($step['text']) ?></span>
              </div>
            </li>
          <?php endforeach; ?>
        </ol>
      </div>

    </div>

    <div data-anim="right">
      <?php partial('lead-form', ['lead' => $lead]); ?>
    </div>

  </div>
</section>

<section class="section section--tight s-mist">
  <div class="wrap wrap--narrow">
    <div class="notecard notecard--alert" data-anim>
      <i class="ic ic--alert" aria-hidden="true"></i>
      <div>
        <strong>Emergency notice</strong>
        <p>This website is not an emergency-response service. For fire, electrical danger, major flooding, gas odour, structural danger or an immediate threat to people, contact the appropriate emergency service or utility provider.</p>
      </div>
    </div>
  </div>
</section>

<?php partial('call-panel', ['placement' => 'contact_cta_panel']); ?>
