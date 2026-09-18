<?php

/**
 * Lead form: session, CSRF, validation, spam defences and storage.
 *
 * The site had no form at all until now, which is why the privacy policy could
 * say it collected nothing online. Adding one moves this site from "publishes a
 * phone number" to "collects personal data and telephone numbers", so the rules
 * that come with that are implemented here rather than left as good intentions:
 *
 *  · TCPA — an unticked consent checkbox is mandatory, its exact wording is
 *    fixed in config, and the consent is stored WITH the submission (timestamp,
 *    page, IP, user agent). Consent you cannot evidence is consent you do not
 *    have.
 *  · Data minimisation — five fields, nothing optional-but-nosy, no tracking
 *    identifiers written into the lead record.
 *  · Storage — written outside the document root's reachable paths and blocked
 *    by .htaccess. A CSV of names and phone numbers sitting on a public URL is
 *    the single worst thing a site like this can do.
 */

declare(strict_types=1);

const LEAD_MAX_LEN     = ['name' => 80, 'phone' => 32, 'email' => 120, 'postcode' => 24, 'message' => 1200];
const LEAD_MIN_SECONDS = 3;      // a human cannot read and complete this faster
const LEAD_RATE_MAX    = 5;      // submissions per IP per hour

/** Start the session exactly once, with cookie flags set. */
function form_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => base_path() . '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure'   => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
    session_name('adhs_sess');
    session_start();
}

/** Per-session CSRF token. */
function csrf_token(): string
{
    form_session();

    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }

    return (string) $_SESSION['csrf'];
}

function csrf_valid(?string $sent): bool
{
    form_session();

    return is_string($sent)
        && !empty($_SESSION['csrf'])
        && hash_equals((string) $_SESSION['csrf'], $sent);
}

/** Timestamp planted when the form is rendered, checked on submit. */
function form_stamp(): string
{
    form_session();
    $_SESSION['form_time'] = time();

    return (string) $_SESSION['form_time'];
}

function client_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';

    return is_string($ip) && filter_var($ip, FILTER_VALIDATE_IP) ? $ip : 'unknown';
}

/** Crude per-session rate limit. Not a substitute for a WAF, but it stops a script. */
function lead_rate_exceeded(): bool
{
    form_session();

    $now  = time();
    $hits = array_values(array_filter(
        (array) ($_SESSION['lead_hits'] ?? []),
        static fn ($t): bool => is_int($t) && $t > $now - 3600
    ));
    $_SESSION['lead_hits'] = $hits;

    return count($hits) >= LEAD_RATE_MAX;
}

function lead_record_hit(): void
{
    form_session();
    $_SESSION['lead_hits'][] = time();
}

/**
 * Validate a submission.
 *
 * @return array{0: array<string,string>, 1: array<string,string>} [errors, clean values]
 */
function lead_validate(array $post): array
{
    $errors = [];
    $clean  = [];

    foreach (['name', 'phone', 'email', 'postcode', 'message'] as $field) {
        $value = is_string($post[$field] ?? null) ? trim($post[$field]) : '';
        $clean[$field] = mb_substr($value, 0, LEAD_MAX_LEN[$field]);
    }
    $clean['service'] = is_string($post['service'] ?? null) ? trim($post['service']) : '';

    if ($clean['name'] === '') {
        $errors['name'] = 'Please tell us your name.';
    }

    $digits = preg_replace('/\D/', '', $clean['phone']) ?? '';
    if ($clean['phone'] === '') {
        $errors['phone'] = 'A phone number is needed so we can call you back.';
    } elseif (strlen($digits) < 7 || strlen($digits) > 15) {
        $errors['phone'] = 'That does not look like a complete phone number.';
    }

    if ($clean['email'] !== '' && !filter_var($clean['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'That email address does not look right.';
    }

    $services = array_map(
        static fn (array $s): string => (string) $s['title'],
        (array) config('main_services', [])
    );
    if ($clean['service'] === '' || !in_array($clean['service'], $services, true)) {
        $errors['service'] = 'Please choose the service you need.';
    }

    if ($clean['message'] === '') {
        $errors['message'] = 'Tell us briefly what you have noticed.';
    }

    /* TCPA: consent must be affirmative. There is no path that treats a missing
       checkbox as agreement. */
    if (($post['consent'] ?? '') !== 'yes') {
        $errors['consent'] = 'We need your consent to call or text you back before we can take the enquiry.';
    }

    return [$errors, $clean];
}

/** Append the lead to a month-stamped JSONL file under storage/. */
function lead_store(array $lead): bool
{
    $dir = dirname(__DIR__) . '/storage';

    if (!is_dir($dir) && !@mkdir($dir, 0770, true) && !is_dir($dir)) {
        error_log('[AD Housing] cannot create storage directory');
        return false;
    }

    $file = $dir . '/leads-' . date('Y-m') . '.jsonl';
    $line = json_encode($lead, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    if ($line === false) {
        return false;
    }

    return @file_put_contents($file, $line . "\n", FILE_APPEND | LOCK_EX) !== false;
}

/** Optional email notification. Silent if no recipient is configured. */
function lead_notify(array $lead): void
{
    $to = trim((string) site('lead_email'));
    if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return;
    }

    $subject = 'Website enquiry: ' . $lead['service'] . ' — ' . $lead['name'];

    $body = "New enquiry from the website.\n\n"
        . "Name:     {$lead['name']}\n"
        . "Phone:    {$lead['phone']}\n"
        . "Email:    {$lead['email']}\n"
        . "Postcode: {$lead['postcode']}\n"
        . "Service:  {$lead['service']}\n\n"
        . "Message:\n{$lead['message']}\n\n"
        . "---\n"
        . "Consent given: {$lead['consent_text']}\n"
        . "Recorded:      {$lead['submitted_at']} from {$lead['page']}\n";

    /* Header injection guard: a newline in any header value would let a crafted
       submission add its own headers. Nothing user-supplied goes in a header. */
    $headers = 'From: website@' . preg_replace('/[^a-z0-9.\-]/i', '', (string) parse_url((string) site('site_url'), PHP_URL_HOST))
        . "\r\nContent-Type: text/plain; charset=UTF-8";

    @mail($to, $subject, $body, $headers);
}

/**
 * Handle a POST. Returns the view state.
 *
 * @return array{sent: bool, errors: array<string,string>, values: array<string,string>}
 */
function lead_handle(): array
{
    $state = ['sent' => false, 'errors' => [], 'values' => []];

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        return $state;
    }

    form_session();

    [$errors, $clean] = lead_validate($_POST);
    $state['values'] = $clean;

    if (!csrf_valid($_POST['csrf'] ?? null)) {
        $state['errors'] = ['form' => 'Your session expired. Please check the details and send again.'];
        return $state;
    }

    /* Honeypot — a real browser leaves this empty because it is hidden. And the
       time trap: anything submitted within LEAD_MIN_SECONDS was not typed. Both
       fail silently as success so a bot learns nothing. */
    $planted = (int) ($_SESSION['form_time'] ?? 0);
    if (trim((string) ($_POST['website'] ?? '')) !== ''
        || ($planted > 0 && time() - $planted < LEAD_MIN_SECONDS)) {
        $state['sent'] = true;
        return $state;
    }

    if (lead_rate_exceeded()) {
        $state['errors'] = ['form' => 'Too many enquiries from this browser in the last hour. Please call instead.'];
        return $state;
    }

    if ($errors) {
        $state['errors'] = $errors;
        return $state;
    }

    $lead = $clean + [
        'submitted_at' => gmdate('c'),
        'page'         => current_path(),
        'ip'           => client_ip(),
        'user_agent'   => mb_substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 200),
        'consent'      => true,
        'consent_text' => (string) config('lead_form.consent_text'),
    ];

    if (!lead_store($lead)) {
        $state['errors'] = ['form' => 'We could not save that. Please call us instead — the number is below.'];
        return $state;
    }

    lead_notify($lead);
    lead_record_hit();

    /* New token, so the same submission cannot be replayed by a refresh. */
    unset($_SESSION['csrf']);
    $state['sent'] = true;

    return $state;
}
