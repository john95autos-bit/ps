<?php

/**
 * Route table and resolver.
 *
 * Every path the site answers on is listed here — the same fifteen pages the
 * original app router served, plus robots.txt and sitemap.xml. views/sitemap.php
 * builds its URL list from this table, so a new route can never be added to the
 * site and forgotten in the sitemap.
 *
 * Title and description strings may contain {area} and {name}; both are filled
 * from config/site.php, so changing the business city in one place updates every
 * page title. (The original hardcoded "Your City" in fifteen separate files.)
 */

declare(strict_types=1);

/** @return array<string, array<string, mixed>> */
function routes(): array
{
    return [
        '/' => [
            'view'        => 'home',
            'title'       => '{coverage} Home Services | Pest Control, Roofing, Gardening & Plumbing',
            'description' => 'Connect with local independent contractors for pest control, roofing, gardening and plumbing, {coverage} across {area}. Free to use, clear scope, no payment taken online.',
            'priority'    => 1.0,
            'changefreq'  => 'weekly',
        ],

        '/pest-control' => [
            'view'        => 'pest-control',
            'title'       => '{coverage} Pest Control | Find a Local Contractor',
            'description' => 'Inspection-led residential pest-control guidance and local contractors {coverage}. Cockroach, termite, bed bug and rodent service information.',
            'priority'    => 0.9,
        ],

        '/pest-control/cockroach-control' => [
            'view'        => 'pest-detail',
            'slug'        => 'cockroach-control',
            'title'       => 'Cockroach Control | {coverage} Pest Contractors',
            'description' => 'Residential cockroach inspection, treatment planning and preparation guidance from local contractors {coverage}.',
        ],

        '/pest-control/termite-control' => [
            'view'        => 'pest-detail',
            'slug'        => 'termite-control',
            'title'       => 'Termite Inspection & Control | {coverage}',
            'description' => 'Inspection-led termite information and control guidance for residential properties, from local contractors {coverage}.',
        ],

        '/pest-control/bed-bug-control' => [
            'view'        => 'pest-detail',
            'slug'        => 'bed-bug-control',
            'title'       => 'Bed Bug Control | {coverage} Contractors',
            'description' => 'Bed bug inspection, preparation and treatment-plan guidance for homes, from local contractors {coverage}.',
        ],

        '/pest-control/rodent-control' => [
            'view'        => 'pest-detail',
            'slug'        => 'rodent-control',
            'title'       => 'Rodent Control | {coverage} Contractors',
            'description' => 'Residential rodent inspection, control and entry-point guidance from local contractors {coverage}.',
        ],

        '/roofing' => [
            'view'        => 'service',
            'slug'        => 'roofing',
            'title'       => '{coverage} Roofing Services | Local Roofing Contractors',
            'description' => 'Residential roof inspections, maintenance and repairs from local independent contractors {coverage}.',
        ],

        '/gardening' => [
            'view'        => 'service',
            'slug'        => 'gardening',
            'title'       => '{coverage} Gardening & Lawn Services',
            'description' => 'Residential garden upkeep, tidy-ups, hedge trimming and seasonal care from local contractors {coverage}.',
        ],

        '/plumbing' => [
            'view'        => 'service',
            'slug'        => 'plumbing',
            'title'       => '{coverage} Plumbing Services | Local Plumbers',
            'description' => 'Household leaks, blocked fixtures and plumbing maintenance handled by local independent contractors {coverage}.',
        ],

        '/about' => [
            'view'        => 'about',
            'title'       => 'About Us',
            'description' => 'How {name} connects homeowners with local independent contractors for pest control, roofing, gardening and plumbing.',
        ],

        '/service-areas' => [
            'view'        => 'service-areas',
            'title'       => 'Service Coverage | {coverage}',
            'description' => 'How {coverage} coverage works across {area}, and how to check availability for your address.',
        ],

        '/contact' => [
            'view'        => 'contact',
            'title'       => 'Contact',
            'description' => 'Call or send an enquiry to {name} and we will connect you with a local independent contractor.',
        ],

        '/privacy' => [
            'view'        => 'legal',
            'slug'        => 'privacy',
            'title'       => 'Privacy Policy',
            'description' => 'How {name} handles website, advertising and contact information.',
        ],

        '/terms' => [
            'view'        => 'legal',
            'slug'        => 'terms',
            'title'       => 'Terms of Use',
            'description' => 'Terms governing use of the {name} website.',
        ],

        '/disclaimer' => [
            'view'        => 'legal',
            'slug'        => 'disclaimer',
            'title'       => 'Service Disclaimer',
            'description' => 'Important limitations concerning home-service information, imagery and advertising.',
        ],

        /* Generated, not part of the HTML sitemap listing. */
        '/robots.txt' => ['view' => 'robots', 'raw' => 'text/plain; charset=UTF-8'],
        '/sitemap.xml' => ['view' => 'sitemap', 'raw' => 'application/xml; charset=UTF-8'],
    ];
}

/** Routes that belong in sitemap.xml — every page route, in table order. */
function indexable_routes(): array
{
    return array_filter(
        routes(),
        static fn (array $route): bool => !isset($route['raw'])
    );
}

/** Primary navigation, shared by the desktop and mobile menus. */
function nav_items(): array
{
    /* Home and Contact were both missing: the wordmark was the only route back
       to the home page, and Contact existed only in the mobile drawer, so a
       desktop visitor had no way to reach it from the header at all. */
    return [
        ['label' => 'Home',         'href' => '/'],
        ['label' => 'Pest control', 'href' => '/pest-control'],
        ['label' => 'Roofing',      'href' => '/roofing'],
        ['label' => 'Gardening',    'href' => '/gardening'],
        ['label' => 'Plumbing',     'href' => '/plumbing'],
        ['label' => 'About',        'href' => '/about'],
        ['label' => 'Contact',      'href' => '/contact'],
    ];
}

/**
 * Turn the raw request URI into a route path relative to the app root:
 * "/ps2/pest-control/?utm=x" => "/pest-control".
 */
function resolve_path(string $requestUri): string
{
    /* Strip the query and fragment by hand rather than with parse_url().
       parse_url() reads a leading "//" as an authority, so "//evil.com/roofing"
       parsed to path "/roofing" — at a document-root mount that served the HOME
       PAGE with HTTP 200 for any //-prefixed URL. The bug was invisible at the
       /ps2 dev mount, so it would only have surfaced in production. */
    $path = strtok($requestUri, '?#');
    $path = is_string($path) ? rawurldecode($path) : '/';

    /* Collapse every run of slashes, including the leading one. */
    $path = '/' . ltrim($path, '/');
    $path = (string) preg_replace('#/{2,}#', '/', $path);

    /* Strip the mount directory only on a path boundary — a bare prefix test
       would also strip "/ps2extra" down to "extra". */
    $base = base_path();
    if ($base !== '' && ($path === $base || str_starts_with($path, $base . '/'))) {
        $path = substr($path, strlen($base));
    }

    $path = '/' . trim($path, '/');

    return $path === '/' ? '/' : rtrim($path, '/');
}

/** Fill {area} and {name} tokens from config. */
function meta_text(string $template): string
{
    return strtr($template, [
        '{area}'     => (string) site('primary_area'),
        '{coverage}' => (string) site('coverage'),
        '{name}'     => (string) site('name'),
    ]);
}

/**
 * Date the site's content last actually changed.
 *
 * <lastmod> previously reported today's date on every request, which tells a
 * crawler the whole site changed daily and is worth exactly nothing. The config
 * files are where the copy lives, so their mtime is the honest signal.
 */
function content_last_modified(): string
{
    $times = [];
    foreach (['/config/site.php', '/config/legal.php'] as $file) {
        $full = dirname(__DIR__) . $file;
        if (is_file($full)) {
            $times[] = (int) filemtime($full);
        }
    }

    return date('Y-m-d', $times ? max($times) : time());
}

/**
 * The date shown on the legal pages.
 *
 * Prefers an explicit `legal_updated` in config, because a lawyer-reviewed
 * revision date is a deliberate statement. Falls back to the mtime of
 * config/legal.php, so a revision can never ship under a stale hand-typed date
 * that nobody remembered to bump.
 */
function legal_updated_date(): string
{
    $explicit = trim((string) site('legal_updated'));
    $file     = dirname(__DIR__) . '/config/legal.php';
    $mtime    = is_file($file) ? (int) filemtime($file) : time();

    if ($explicit === '') {
        return date('j F Y', $mtime);
    }

    /* If the file has been edited since the stated date, the stated date is
       wrong — trust the file. */
    $stated = strtotime($explicit) ?: 0;

    return $stated >= $mtime ? $explicit : date('j F Y', $mtime);
}
