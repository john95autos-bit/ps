<?php

/**
 * partials/lead-form.php — the contact lead form.
 *
 * Expects $lead, the array returned by lead_handle() in inc/form.php. The
 * handler must run before any output so a rejected submission can re-render
 * with the visitor's values still in the fields — retyping a form because one
 * field was wrong is the fastest way to lose a lead.
 *
 * Note the ordering of the consent checkbox: unticked, immediately above the
 * submit button, with the full statement as its visible label. That placement
 * is what the privacy policy commits to and what TCPA expects; a consent buried
 * in a link or pre-ticked is not consent.
 */

$err = $lead['errors'] ?? [];
$val = $lead['values'] ?? [];

/** Echo a previously submitted value back into a field, escaped. */
$v = static fn (string $key): string => e($val[$key] ?? '');

/** Attributes marking a field invalid, wired to its error message. */
$bad = static function (array $err, string $key): string {
    return isset($err[$key])
        ? ' aria-invalid="true" aria-describedby="e-' . $key . '"'
        : '';
};

?>
<?php /* No <section> or .wrap of its own: the caller decides where this sits.
         On /contact it is placed in the right-hand column beside the phone
         card, so the two ways of getting in touch are side by side rather than
         a screen apart. */ ?>
<div class="leadpanel" id="enquiry">

    <div class="leadpanel__head">
      <p class="eyebrow">Send an enquiry</p>
      <h2>Prefer not to call?</h2>
      <p>Leave your details and a local contractor will call you back during published hours. Calling is still the fastest route — this form does not book anything.</p>
    </div>

    <?php if (!empty($lead['sent'])): ?>

      <div class="notecard notecard--ok" role="status" data-anim="rise">
        <?= icon('i-check') ?>
        <div>
          <strong>Thank you — your enquiry has been received.</strong>
          <p>Someone will call you back on the number you gave, during <?= e(site('hours')) ?>. If it is urgent, call <?= phone_link('contact_form_success', e(site('phone_display')), 'call-link') ?> instead.</p>
        </div>
      </div>

    <?php else: ?>

      <?php if (!empty($err['form'])): ?>
        <div class="notecard notecard--alert" role="alert" data-anim="rise">
          <?= icon('i-alert') ?>
          <div>
            <strong>That did not send</strong>
            <p><?= e($err['form']) ?></p>
          </div>
        </div>
      <?php endif; ?>

      <form class="leadform" method="post" action="<?= e(url('/contact')) ?>#enquiry" novalidate data-anim="rise">
        <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
        <input type="hidden" name="t" value="<?= e(form_stamp()) ?>">

        <?php /* Honeypot: hidden from people, irresistible to bots. The label
                 stays in the markup so the field is still described if a
                 stylesheet ever fails to load. */ ?>
        <div class="leadform__trap" aria-hidden="true">
          <label for="website">Leave this field empty</label>
          <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
        </div>

        <div class="leadform__row">
          <div class="field<?= isset($err['name']) ? ' field--bad' : '' ?>">
            <label for="f-name">Your name <span class="req" aria-hidden="true">*</span></label>
            <input type="text" id="f-name" name="name" value="<?= $v('name') ?>" autocomplete="name" maxlength="80" required<?= $bad($err, 'name') ?>>
            <?php if (isset($err['name'])): ?><p class="field__err" id="e-name"><?= e($err['name']) ?></p><?php endif; ?>
          </div>

          <div class="field<?= isset($err['phone']) ? ' field--bad' : '' ?>">
            <label for="f-phone">Phone number <span class="req" aria-hidden="true">*</span></label>
            <input type="tel" id="f-phone" name="phone" value="<?= $v('phone') ?>" autocomplete="tel" inputmode="tel" maxlength="32" required<?= $bad($err, 'phone') ?>>
            <?php if (isset($err['phone'])): ?><p class="field__err" id="e-phone"><?= e($err['phone']) ?></p><?php endif; ?>
          </div>
        </div>

        <div class="leadform__row">
          <div class="field<?= isset($err['email']) ? ' field--bad' : '' ?>">
            <label for="f-email">Email <span class="opt">optional</span></label>
            <input type="email" id="f-email" name="email" value="<?= $v('email') ?>" autocomplete="email" maxlength="120"<?= $bad($err, 'email') ?>>
            <?php if (isset($err['email'])): ?><p class="field__err" id="e-email"><?= e($err['email']) ?></p><?php endif; ?>
          </div>

          <div class="field">
            <label for="f-postcode">Postcode or area <span class="opt">optional</span></label>
            <input type="text" id="f-postcode" name="postcode" value="<?= $v('postcode') ?>" autocomplete="postal-code" maxlength="24">
          </div>
        </div>

        <div class="field<?= isset($err['service']) ? ' field--bad' : '' ?>">
          <label for="f-service">Service needed <span class="req" aria-hidden="true">*</span></label>
          <select id="f-service" name="service" required<?= $bad($err, 'service') ?>>
            <option value="">Choose a service&hellip;</option>
            <?php foreach ((array) config('main_services', []) as $svc): ?>
              <option value="<?= e($svc['title']) ?>"<?= ($val['service'] ?? '') === $svc['title'] ? ' selected' : '' ?>><?= e($svc['title']) ?></option>
            <?php endforeach; ?>
          </select>
          <?php if (isset($err['service'])): ?><p class="field__err" id="e-service"><?= e($err['service']) ?></p><?php endif; ?>
        </div>

        <div class="field<?= isset($err['message']) ? ' field--bad' : '' ?>">
          <label for="f-message">What have you noticed? <span class="req" aria-hidden="true">*</span></label>
          <textarea id="f-message" name="message" rows="4" maxlength="1200" required<?= $bad($err, 'message') ?>><?= $v('message') ?></textarea>
          <p class="field__hint">Signs, the affected area, when it started, and anything about access, children or pets.</p>
          <?php if (isset($err['message'])): ?><p class="field__err" id="e-message"><?= e($err['message']) ?></p><?php endif; ?>
        </div>

        <?php /* TCPA consent. Unticked by default, immediately above submit, the
                 full statement as the visible label, and the exact wording is
                 stored alongside the lead. */ ?>
        <div class="consent-box<?= isset($err['consent']) ? ' consent-box--bad' : '' ?>">
          <input type="checkbox" id="f-consent" name="consent" value="yes" required<?= $bad($err, 'consent') ?>>
          <label for="f-consent"><?= e((string) config('lead_form.consent_text')) ?></label>
        </div>
        <?php if (isset($err['consent'])): ?><p class="field__err" id="e-consent"><?= e($err['consent']) ?></p><?php endif; ?>

        <button class="btn btn--call btn--lg btn--block leadform__submit" type="submit">
          <span>Send enquiry</span>
          <?= icon('i-arrow-right') ?>
        </button>

        <p class="fineprint leadform__note">
          We use these details only to return your enquiry. Read the
          <a href="<?= e(url('/privacy')) ?>">privacy policy</a>.
          This form does not take payment and does not confirm a booking.
        </p>
      </form>

    <?php endif; ?>
</div>
