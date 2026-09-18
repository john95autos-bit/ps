<?php

/**
 * views/robots.php — replaces app/robots.ts (a Next metadata route).
 *
 * Raw view: inc/layout.php has already sent
 * `Content-Type: text/plain; charset=UTF-8` and requires this file directly,
 * so nothing but the robots.txt body may be echoed. Only $path and $route are
 * in scope, and neither is needed.
 *
 * Differences from the original, per the porting spec:
 *   - the original blocked "/api/", a directory this port does not have; the
 *     PHP source directories are blocked instead;
 *   - the Sitemap line is always emitted, because site('site_url') always has
 *     a value, whereas the original omitted it when the env var was unset;
 *   - AdsBot is deliberately not blocked — a Disallow it obeyed would stop
 *     Google Ads from checking the landing pages.
 *
 * e() is intentionally not used here: this response is text/plain, so HTML
 * escaping would corrupt the URL rather than protect anything. The value is
 * built from config/site.php by abs_url(); CR/LF are stripped so a malformed
 * site_url cannot inject an extra directive.
 */

$sitemap = str_replace(["\r", "\n"], '', abs_url('/sitemap.xml'));

$lines = [
    'User-agent: *',
    'Allow: /',
    /* The protected directories are deliberately NOT listed. Apache already
       returns 403 for all of them, so a Disallow line adds no protection — it
       only hands a scanner the exact list of paths worth probing. */
    '',
    'Sitemap: ' . $sitemap,
];

echo implode("\n", $lines), "\n";
