/**
 * The contact lead form.
 *
 * A rejected submission re-renders with the visitor's values still in the
 * fields — retyping a form because one field was wrong is the fastest way to
 * lose a lead.
 *
 * Note the ordering of the consent checkbox: unticked, immediately above the
 * submit button, with the full statement as its visible label. That placement is
 * what the privacy policy commits to and what TCPA expects; a consent buried in
 * a link or pre-ticked is not consent.
 *
 * Spam defences, mirroring inc/form.php:
 *  · honeypot — a real browser leaves it empty because it is hidden
 *  · time trap — the form records when it mounted and api/lead.js rejects
 *    anything submitted implausibly fast. The PHP build kept that timestamp in
 *    the session, which meant opening the page in a second tab could silently
 *    discard the first tab's genuine submission; here the value travels with
 *    the form it belongs to.
 *
 * Everything is validated again on the server. This copy exists to give the
 * visitor an answer without a round trip, not to be trusted.
 */

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LEAD_FORM, MAIN_SERVICES, SITE } from '../config/site.js';
import Icon from './Icon.jsx';
import PhoneLink from './PhoneLink.jsx';

const MAX = { name: 80, phone: 32, email: 120, postcode: 24, message: 1200 };

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  postcode: '',
  service: '',
  message: '',
  consent: false,
  website: '',
};

function validate(values) {
  const errors = {};
  const digits = values.phone.replace(/\D/g, '');

  if (values.name.trim() === '') errors.name = 'Please tell us your name.';

  if (values.phone.trim() === '') {
    errors.phone = 'A phone number is needed so we can call you back.';
  } else if (digits.length < 7 || digits.length > 15) {
    errors.phone = 'That does not look like a complete phone number.';
  }

  if (values.email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'That email address does not look right.';
  }

  if (!MAIN_SERVICES.some((s) => s.title === values.service)) {
    errors.service = 'Please choose the service you need.';
  }

  if (values.message.trim() === '') errors.message = 'Tell us briefly what you have noticed.';

  /* TCPA: consent must be affirmative. There is no path that treats a missing
     checkbox as agreement. */
  if (values.consent !== true) {
    errors.consent =
      'We need your consent to call or text you back before we can take the enquiry.';
  }

  return errors;
}

export default function LeadForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const mountedAt = useRef(Date.now());

  const set = (key) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  const bad = (key) =>
    errors[key] ? { 'aria-invalid': 'true', 'aria-describedby': `e-${key}` } : {};

  async function onSubmit(e) {
    e.preventDefault();
    if (busy) return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          page: window.location.pathname,
          elapsedMs: Date.now() - mountedAt.current,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (response.ok && payload.ok) {
        setSent(true);
        return;
      }

      setErrors(
        payload.errors && Object.keys(payload.errors).length
          ? payload.errors
          : {
              form:
                payload.message ||
                'We could not send that. Please call us instead — the number is below.',
            }
      );
    } catch {
      setErrors({
        form: 'We could not reach the server. Please check your connection, or call us instead.',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    /* No <section> or .wrap of its own: the caller decides where this sits. On
       /contact it is placed in the right-hand column beside the phone card, so
       the two ways of getting in touch are side by side rather than a screen
       apart. */
    <div className="leadpanel" id="enquiry">
      <div className="leadpanel__head">
        <p className="eyebrow">Send an enquiry</p>
        <h2>Prefer not to call?</h2>
        <p>
          Leave your details and a local contractor will call you back during published hours.
          Calling is still the fastest route — this form does not book anything.
        </p>
      </div>

      {sent ? (
        <div className="notecard notecard--ok" role="status" data-anim="rise">
          <Icon id="i-check" />
          <div>
            <strong>Thank you — your enquiry has been received.</strong>
            <p>
              Someone will call you back on the number you gave, during {SITE.hours}. If it is
              urgent, call{' '}
              <PhoneLink placement="contact_form_success" className="call-link">
                {SITE.phoneDisplay}
              </PhoneLink>{' '}
              instead.
            </p>
          </div>
        </div>
      ) : (
        <>
          {errors.form ? (
            <div className="notecard notecard--alert" role="alert" data-anim="rise">
              <Icon id="i-alert" />
              <div>
                <strong>That did not send</strong>
                <p>{errors.form}</p>
              </div>
            </div>
          ) : null}

          <form className="leadform" onSubmit={onSubmit} noValidate data-anim="rise">
            {/* Honeypot: hidden from people, irresistible to bots. The label
                stays in the markup so the field is still described if a
                stylesheet ever fails to load. */}
            <div className="leadform__trap" aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={set('website')}
              />
            </div>

            <div className="leadform__row">
              <div className={`field${errors.name ? ' field--bad' : ''}`}>
                <label htmlFor="f-name">
                  Your name <span className="req" aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  id="f-name"
                  name="name"
                  value={values.name}
                  onChange={set('name')}
                  autoComplete="name"
                  maxLength={MAX.name}
                  required
                  {...bad('name')}
                />
                {errors.name ? (
                  <p className="field__err" id="e-name">{errors.name}</p>
                ) : null}
              </div>

              <div className={`field${errors.phone ? ' field--bad' : ''}`}>
                <label htmlFor="f-phone">
                  Phone number <span className="req" aria-hidden="true">*</span>
                </label>
                <input
                  type="tel"
                  id="f-phone"
                  name="phone"
                  value={values.phone}
                  onChange={set('phone')}
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={MAX.phone}
                  required
                  {...bad('phone')}
                />
                {errors.phone ? (
                  <p className="field__err" id="e-phone">{errors.phone}</p>
                ) : null}
              </div>
            </div>

            <div className="leadform__row">
              <div className={`field${errors.email ? ' field--bad' : ''}`}>
                <label htmlFor="f-email">
                  Email <span className="opt">optional</span>
                </label>
                <input
                  type="email"
                  id="f-email"
                  name="email"
                  value={values.email}
                  onChange={set('email')}
                  autoComplete="email"
                  maxLength={MAX.email}
                  {...bad('email')}
                />
                {errors.email ? (
                  <p className="field__err" id="e-email">{errors.email}</p>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="f-postcode">
                  Postcode or area <span className="opt">optional</span>
                </label>
                <input
                  type="text"
                  id="f-postcode"
                  name="postcode"
                  value={values.postcode}
                  onChange={set('postcode')}
                  autoComplete="postal-code"
                  maxLength={MAX.postcode}
                />
              </div>
            </div>

            <div className={`field${errors.service ? ' field--bad' : ''}`}>
              <label htmlFor="f-service">
                Service needed <span className="req" aria-hidden="true">*</span>
              </label>
              <select
                id="f-service"
                name="service"
                value={values.service}
                onChange={set('service')}
                required
                {...bad('service')}
              >
                <option value="">Choose a service&hellip;</option>
                {MAIN_SERVICES.map((svc) => (
                  <option key={svc.title} value={svc.title}>
                    {svc.title}
                  </option>
                ))}
              </select>
              {errors.service ? (
                <p className="field__err" id="e-service">{errors.service}</p>
              ) : null}
            </div>

            <div className={`field${errors.message ? ' field--bad' : ''}`}>
              <label htmlFor="f-message">
                What have you noticed? <span className="req" aria-hidden="true">*</span>
              </label>
              <textarea
                id="f-message"
                name="message"
                rows={4}
                maxLength={MAX.message}
                value={values.message}
                onChange={set('message')}
                required
                {...bad('message')}
              />
              <p className="field__hint">
                Signs, the affected area, when it started, and anything about access, children or
                pets.
              </p>
              {errors.message ? (
                <p className="field__err" id="e-message">{errors.message}</p>
              ) : null}
            </div>

            {/* TCPA consent. Unticked by default, immediately above submit, the
                full statement as the visible label, and the exact wording is
                stored alongside the lead. */}
            <div className={`consent-box${errors.consent ? ' consent-box--bad' : ''}`}>
              <input
                type="checkbox"
                id="f-consent"
                name="consent"
                checked={values.consent}
                onChange={set('consent')}
                required
                {...bad('consent')}
              />
              <label htmlFor="f-consent">{LEAD_FORM.consentText}</label>
            </div>
            {errors.consent ? (
              <p className="field__err" id="e-consent">{errors.consent}</p>
            ) : null}

            <button
              className="btn btn--call btn--lg btn--block leadform__submit"
              type="submit"
              disabled={busy}
            >
              <span>{busy ? 'Sending…' : 'Send enquiry'}</span>
              <Icon id="i-arrow-right" />
            </button>

            <p className="fineprint leadform__note">
              We use these details only to return your enquiry. Read the{' '}
              <Link to="/privacy">privacy policy</Link>. This form does not take payment and does
              not confirm a booking.
            </p>
          </form>
        </>
      )}
    </div>
  );
}
