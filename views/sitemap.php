<?php

/**
 * views/sitemap.php — replaces app/sitemap.ts (a Next metadata route).
 *
 * Raw view: inc/layout.php has already sent
 * `Content-Type: application/xml; charset=UTF-8` and requires this file
 * directly, so nothing but the XML document may be echoed — no leading
 * whitespace, no HTML shell. Only $path and $route are in scope; the loop
 * below uses its own variable names so neither is overwritten.
 *
 * The original repeated the fifteen page paths in a second hand-written list
 * that could drift from the router. This build walks indexable_routes() in
 * inc/router.php instead, so adding a page adds a sitemap entry, and
 * robots.txt / sitemap.xml (flagged `raw`) stay out of it automatically.
 * `priority` and `changefreq` come from the route, defaulting to 0.7 and
 * 'monthly' exactly as the original did.
 */

$lastmod = content_last_modified();

echo '<?xml version="1.0" encoding="UTF-8"?>', "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', "\n";

foreach (indexable_routes() as $routePath => $entry) {
    $priority   = number_format((float) ($entry['priority'] ?? 0.7), 1, '.', '');
    $changefreq = (string) ($entry['changefreq'] ?? 'monthly');

    echo "  <url>\n";
    echo '    <loc>', e(abs_url((string) $routePath)), "</loc>\n";
    echo '    <lastmod>', e($lastmod), "</lastmod>\n";
    echo '    <changefreq>', e($changefreq), "</changefreq>\n";
    echo '    <priority>', e($priority), "</priority>\n";
    echo "  </url>\n";
}

echo '</urlset>', "\n";
