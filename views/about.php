<?php /**
 * About page (/about).
 *
 * No view-specific variables: the story paragraph reads the business name and
 * primary area from config/site.php, so changing the city in one place updates
 * this page too.
 *
 * Call surfaces on this page: about_story, about_cta_panel.
 */ ?>
<?php partial('page-hero', [
    'eyebrow' => 'About ' . site('brand_short'),
    'title'   => 'Home care should begin with a clear, honest conversation.',
    'text'    => 'We organise practical household service support around one simple idea: understand the problem before recommending the work.',
    'crumbs'  => [
        ['label' => 'Home',  'href' => '/'],
        ['label' => 'About', 'href' => null],
    ],
]); ?>

<section class="section s-paper">
  <div class="wrap split">
    <div class="stack" data-anim="left">
      <p class="eyebrow">Our approach</p>
      <h2>Useful information first.</h2>
      <p><?= e(site('name')) ?> is presented as an independent home-services provider serving <?= e(site('primary_area')) ?> and nearby areas. Our website explains the service categories offered, how enquiries are handled and what may affect scope, pricing or outcomes.</p>
      <p>We do not publish reviews, accreditation marks, customer counts or guaranteed-result claims. Anything of that kind belongs on a website only when it can be evidenced, so you will not find it here. Ask on the call about credentials, qualifications and insurance, and you will get a straight answer.</p>
      <?= phone_cta('about_story', 'call-link') ?>
    </div>
    <div>
      <p class="eyebrow">What matters to us</p>
      <?php /* The 01 / 02 / 03 markers are CSS counters on .step — never markup. */ ?>
      <ol class="steps" data-anim-group>
        <li class="step" data-anim>
          <div>
            <h3>Listen carefully</h3>
            <p>Start with the issue, the property and the customer’s priorities.</p>
          </div>
        </li>
        <li class="step" data-anim>
          <div>
            <h3>Explain clearly</h3>
            <p>Set practical expectations about inspection, access and possible next steps.</p>
          </div>
        </li>
        <li class="step" data-anim>
          <div>
            <h3>Confirm before work</h3>
            <p>Agree availability, scope, pricing basis and terms before authorisation.</p>
          </div>
        </li>
      </ol>
    </div>
  </div>
</section>

<section class="section s-mist">
  <div class="wrap">
    <div class="sec-head sec-head--center" data-anim>
      <p class="eyebrow">Our standards</p>
      <h2>Designed around informed choices.</h2>
    </div>
    <div class="info-grid" data-anim-group>
      <article class="info-card" data-anim>
        <span class="info-card__num">01</span>
        <h3>Relevant</h3>
        <p>The page a visitor lands on should closely match the service mentioned in the ad.</p>
      </article>
      <article class="info-card" data-anim>
        <span class="info-card__num">02</span>
        <h3>Transparent</h3>
        <p>Important qualifications, limitations and pricing variables should not be hidden.</p>
      </article>
      <article class="info-card" data-anim>
        <span class="info-card__num">03</span>
        <h3>Reachable</h3>
        <p>A consistent phone number, business identity, hours and service area make contact easier.</p>
      </article>
    </div>
  </div>
</section>

<?php partial('call-panel', [
    'placement' => 'about_cta_panel',
    'title'     => 'Tell us what your home needs.',
]); ?>
