<?php

/**
 * Shared helpers. Loaded once by index.php before any view renders.
 */

declare(strict_types=1);

/* -------------------------------------------------------------------------
 * Configuration access
 * ---------------------------------------------------------------------- */

/**
 * Merge an override array over the defaults.
 *
 * Deliberately NOT array_replace_recursive(): that merges lists by index, so an
 * override could never shorten one. A launch config listing two service areas
 * would silently keep the two placeholder entries at positions 2 and 3 and
 * advertise districts the business does not serve. Lists are replaced whole;
 * only string-keyed maps merge.
 */
function merge_config(array $base, array $override): array
{
    foreach ($override as $key => $value) {
        if (is_array($value) && !array_is_list($value)
            && isset($base[$key]) && is_array($base[$key])) {
            $base[$key] = merge_config($base[$key], $value);
        } else {
            $base[$key] = $value;
        }
    }

    return $base;
}

/**
 * Read the site configuration, optionally by dot-path.
 *
 *   config()                       => the whole array
 *   config('site.phone_display')   => '(000) 000-0000'
 *   config('pest_pages.termite-control')
 */
function config(?string $key = null, mixed $default = null): mixed
{
    static $data = null;

    if ($data === null) {
        $data = require dirname(__DIR__) . '/config/site.php';

        $local = dirname(__DIR__) . '/config/local.php';
        if (is_file($local)) {
            $overrides = require $local;
            if (is_array($overrides)) {
                $data = merge_config($data, $overrides);
            }
        }
    }

    if ($key === null) {
        return $data;
    }

    /* A literal key wins over dot-path traversal, so keys that themselves
       contain dots — image paths like "/images/hero.webp" — stay reachable. */
    if (array_key_exists($key, $data)) {
        return $data[$key];
    }

    $value = $data;
    foreach (explode('.', $key) as $segment) {
        if (!is_array($value) || !array_key_exists($segment, $value)) {
            return $default;
        }
        $value = $value[$segment];
    }

    return $value;
}

/** Shortcut for the business-identity block. */
function site(string $key, mixed $default = null): mixed
{
    return config('site.' . $key, $default);
}

/**
 * Everything still standing between this site and a real ad campaign.
 *
 * The launch switch used to validate nothing but itself: flipping `configured`
 * to true removed the pre-launch banner and made the site indexable even with a
 * (000) 000-0000 phone number, an unparseable Ads id, or the placeholder
 * governing-law paragraphs still in the legal pages. Those are exactly the
 * mistakes that get an Ads account suspended, so the switch now has to earn it.
 *
 * @return list<string> Human-readable blockers; empty means ready.
 */
/**
 * The business address as a single line, or '' when not configured.
 *
 * Google Ads expects an advertised business to be identifiable and reachable,
 * and the privacy policy has to name the operating entity and its address, so
 * this needs one canonical formatting rather than being retyped per template.
 */
function formatted_address(string $separator = ', '): string
{
    $a = site('address');
    if (!is_array($a)) {
        return '';
    }

    $parts = array_filter([
        $a['street']   ?? '',
        $a['locality'] ?? '',
        trim((string) ($a['region'] ?? '') . ' ' . (string) ($a['postcode'] ?? '')),
        $a['country']  ?? '',
    ], static fn ($v): bool => trim((string) $v) !== '');

    return implode($separator, $parts);
}

function launch_blockers(): array
{
    $problems = [];

    $phoneDisplay = (string) site('phone_display');
    $phoneHref    = (string) site('phone_href');

    if (str_contains($phoneDisplay, '000-0000') || trim($phoneDisplay) === '') {
        $problems[] = 'the phone number is still the placeholder';
    }
    if (!preg_match('/^\+[1-9]\d{6,14}$/D', $phoneHref)) {
        $problems[] = 'phone_href is not a dialable E.164 number (for example +15551234567)';
    } elseif (preg_replace('/\D/', '', $phoneDisplay) !== '' 
        && !str_ends_with(preg_replace('/\D/', '', $phoneHref), substr(preg_replace('/\D/', '', $phoneDisplay), -7))) {
        $problems[] = 'phone_href and phone_display do not appear to be the same number';
    }

    $area = trim((string) site('primary_area'));
    if ($area === '' || str_contains($area, 'Your City')) {
        $problems[] = 'the service coverage is not set';
    }
    if (str_contains((string) site('site_url'), 'yourdomain.com')) {
        $problems[] = 'site_url is still the placeholder domain';
    }
    if (str_contains((string) site('email'), 'yourdomain.com')) {
        $problems[] = 'the business email is still the placeholder';
    }

    $adsId = (string) site('google_ads_id');
    $gtmId = (string) site('gtm_id');
    if ($adsId !== '' && !preg_match('/^AW-\d+$/D', $adsId)) {
        $problems[] = 'google_ads_id is malformed, so no tag is being emitted at all';
    }
    if ($adsId !== '' && (string) site('google_ads_conversion_label') === '' && $gtmId === '') {
        $problems[] = 'no conversion label or GTM container is set, so phone calls cannot be reported to Google Ads';
    }

    /* Placeholder legal prose is visitor-facing and was not covered by the gate,
       so it could ship the moment the switch was flipped. */
    $legalFile = dirname(__DIR__) . '/config/legal.php';
    if (is_file($legalFile)) {
        $legal = require $legalFile;
        $blob  = json_encode($legal) ?: '';
        foreach (['replace this paragraph', 'before launch', 'should replace placeholder'] as $marker) {
            if (stripos($blob, $marker) !== false) {
                $problems[] = 'the legal pages still contain placeholder text that must be replaced';
                break;
            }
        }
    }

    return $problems;
}

/**
 * True only when the operator has said the site is ready AND nothing in
 * launch_blockers() contradicts them.
 */
function site_is_configured(): bool
{
    return site('configured') === true && launch_blockers() === [];
}

/* -------------------------------------------------------------------------
 * Escaping
 * ---------------------------------------------------------------------- */

/** Escape for HTML text and quoted attribute values. Use on every dynamic value. */
function e(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Escape for a JavaScript string / JSON literal embedded in a <script> block. */
function json_attr(mixed $value): string
{
    return json_encode(
        $value,
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
    ) ?: 'null';
}

/* -------------------------------------------------------------------------
 * URLs
 * ---------------------------------------------------------------------- */

/**
 * Directory the app is mounted at, without a trailing slash.
 * Under XAMPP at htdocs/ps2 this is "/ps2"; at a domain root it is "".
 */
function base_path(): string
{
    static $base = null;

    if ($base === null) {
        $script = str_replace('\\', '/', (string) ($_SERVER['SCRIPT_NAME'] ?? ''));
        /* dirname('/index.php') returns a lone "\" on Windows, so normalise after the
           call as well — otherwise a root-mounted install gets a base of "\". */
        $dir    = rtrim(str_replace('\\', '/', dirname($script)), '/');
        $base   = ($dir === '' || $dir === '.' || $dir === '/') ? '' : $dir;
    }

    return $base;
}

/** Root-relative URL for an internal route: url('/roofing') => '/ps2/roofing'. */
function url(string $path = '/'): string
{
    if ($path === '' || $path === '/') {
        return base_path() . '/';
    }

    return base_path() . '/' . ltrim($path, '/');
}

/** Root-relative URL for a static asset, with an mtime cache-buster. */
function asset(string $path): string
{
    $clean = '/' . ltrim($path, '/');
    $file  = dirname(__DIR__) . $clean;
    $href  = base_path() . $clean;

    if (is_file($file)) {
        $href .= '?v=' . filemtime($file);
    }

    return $href;
}

/**
 * Absolute URL against the configured public domain. Used for canonical tags,
 * Open Graph and the sitemap, which must not point at localhost.
 */
function abs_url(string $path = '/'): string
{
    $base = rtrim((string) site('site_url'), '/');
    $path = '/' . ltrim($path, '/');

    /* Include the mount directory. At a subdirectory install every canonical,
       og:url and sitemap <loc> otherwise pointed at a URL that does not exist
       (https://host/roofing instead of https://host/ps2/roofing). If site_url
       already ends with the mount path, don't double it. */
    $mount = base_path();
    if ($mount !== '' && !str_ends_with($base, $mount)) {
        $base .= $mount;
    }

    return $path === '/' ? $base . '/' : $base . $path;
}

/* -------------------------------------------------------------------------
 * Current request
 * ---------------------------------------------------------------------- */

/** Route path for the current request, normalised to a leading slash, e.g. '/pest-control'. */
function current_path(): string
{
    return $GLOBALS['__route_path'] ?? '/';
}

/** True when $href is the current page or one of its ancestors. */
function is_active(string $href): bool
{
    $now = current_path();

    if ($href === '/') {
        return $now === '/';   // rtrim('/', '/') is '', which matched every path
    }

    return $now === $href || str_starts_with($now, rtrim($href, '/') . '/');
}

/* -------------------------------------------------------------------------
 * Markup helpers
 * ---------------------------------------------------------------------- */

/**
 * A click-to-call anchor.
 *
 * Every phone link pushes a `phone_click` event to dataLayer with the page
 * path, link placement and phone number — the tracking contract the original
 * React PhoneLink implemented, now handled by one delegated listener in
 * assets/js/site.js.
 *
 * @param string $inner Trusted HTML (call sites build it from literals + e()).
 */
function phone_link(string $placement, string $inner, string $class = ''): string
{
    $label = sprintf('Call %s at %s', (string) site('name'), (string) site('phone_display'));

    return sprintf(
        '<a class="%s" href="tel:%s" data-phone-link data-placement="%s" aria-label="%s">%s</a>',
        e($class),
        e(site('phone_href')),
        e($placement),
        e($label),
        $inner
    );
}

/**
 * An icon from the self-hosted Font Awesome 6 subset.
 *
 * Always decorative: the accessible name comes from the surrounding link,
 * button or heading text, never from the glyph.
 */
function icon(string $id, string $class = 'ic'): string
{
    /* Font Awesome 6, self-hosted and subset to only the glyphs this site uses
       (1.7 KB rather than the 158 KB full solid face, and no CDN request).
       The glyph itself is attached by CSS via .ic--<slug>::before, so the markup
       stays free of private-use characters that a screen reader might try to
       announce. Decorative by definition — the accessible name always comes
       from the surrounding link, button or heading. */
    $slug = str_starts_with($id, 'i-') ? substr($id, 2) : $id;

    return '<i class="' . e($class) . ' ic--' . e($slug) . '" aria-hidden="true"></i>';
}

/**
 * The standard call-to-action button: phone icon + "Call (000) 000-0000".
 *
 * The icon is a real SVG, not the ☎ text glyph the previous design used — that
 * rendered as a different shape on every platform, could not be styled, and was
 * read aloud as "telephone" by screen readers on top of the link text.
 */
function phone_cta(
    string $placement,
    string $class = 'btn btn--call',
    ?string $label = null
): string {
    $text = $label ?? 'Call ' . (string) site('phone_display');

    return phone_link($placement, icon('i-phone') . '<span>' . e($text) . '</span>', $class);
}

/**
 * Two-line variant for the header and sticky bar: a small action word above the
 * number, so the button reads as an instruction rather than a label.
 */
function phone_cta_stacked(string $placement, string $class = 'btn btn--call btn--stack', string $kicker = 'Tap to call'): string
{
    $inner = '<span class="phone-badge">' . icon('i-phone', 'ic ic--sm') . '</span>'
        . '<span class="btn__label"><small>' . e($kicker) . '</small>'
        . '<strong>' . e(site('phone_display')) . '</strong></span>';

    return phone_link($placement, $inner, $class);
}

/**
 * An <img> carrying the intrinsic width/height from config, so the browser can
 * reserve space and avoid layout shift.
 *
 * @param array<string,string|bool> $attrs Extra attributes, e.g. ['loading' => 'lazy'].
 */
function img_tag(string $src, string $alt, array $attrs = []): string
{
    $images = config('images', []);
    $size   = (is_array($images) && isset($images[$src])) ? $images[$src] : [];
    $out  = '<img src="' . e(asset($src)) . '" alt="' . e($alt) . '"';

    if (isset($size['width'], $size['height'])) {
        $out .= ' width="' . (int) $size['width'] . '" height="' . (int) $size['height'] . '"';
    }

    $attrs += ['decoding' => 'async'];

    foreach ($attrs as $name => $value) {
        if ($value === false || $value === null) {
            continue;
        }
        $out .= $value === true ? ' ' . e($name) : ' ' . e($name) . '="' . e($value) . '"';
    }

    return $out . '>';
}

/** Inline style string for the staggered reveal delay used across the grids. */
function reveal_delay(int $index, int $step = 70): string
{
    return ' style="--delay:' . ($index * $step) . 'ms"';
}

/**
 * Send a Content-Security-Policy for an HTML response.
 *
 * The page runs one inline bootstrap script and, when configured, loads the
 * Google tag. Everything else is same-origin. The nonce lets that one inline
 * block execute without resorting to 'unsafe-inline', which would defeat the
 * point of having a policy at all.
 */
function send_csp(string $nonce): void
{
    if (headers_sent()) {
        return;
    }

    $google = "https://www.googletagmanager.com https://www.google-analytics.com "
        . "https://googleads.g.doubleclick.net https://www.google.com https://www.googleadservices.com";

    $policy = [
        "default-src 'self'",
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'self'",
        "form-action 'self'",
        "img-src 'self' data: {$google}",
        "font-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "script-src 'self' 'nonce-{$nonce}' {$google}",
        "connect-src 'self' {$google}",
        "frame-src {$google}",
    ];

    header('Content-Security-Policy: ' . implode('; ', $policy));
}

/* -------------------------------------------------------------------------
 * View rendering
 * ---------------------------------------------------------------------- */

/** Render a partial from partials/ with $data extracted into scope. */
function partial(string $name, array $data = []): void
{
    $file = dirname(__DIR__) . '/partials/' . $name . '.php';

    if (!is_file($file)) {
        throw new RuntimeException("Missing partial: {$name}");
    }

    /* EXTR_SKIP silently drops any key colliding with a local ($file, $name,
       $data), so the partial would render with that variable missing and no
       error. Unset our own locals first, then extract with nothing to collide
       against. */
    $__file = $file;
    unset($file, $name);
    extract($data, EXTR_OVERWRITE);
    unset($data);

    require $__file;
}

/** Capture a partial as a string instead of echoing it. */
function partial_to_string(string $name, array $data = []): string
{
    ob_start();

    try {
        partial($name, $data);
    } catch (Throwable $error) {
        ob_end_clean();
        throw $error;
    }

    return (string) ob_get_clean();
}
