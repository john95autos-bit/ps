<?php

/**
 * Front controller.
 *
 * Apache sends every request that is not a real file here (see .htaccess), and
 * this file maps the path onto the route table in inc/router.php.
 */

declare(strict_types=1);

require __DIR__ . '/inc/helpers.php';
require __DIR__ . '/inc/router.php';
require __DIR__ . '/inc/layout.php';
require __DIR__ . '/inc/form.php';

mb_internal_encoding('UTF-8');

/* ---------------------------------------------------------------------------
 * Failure handling.
 *
 * Without this, any Throwable from a view returned HTTP 200 with a raw PHP
 * stack trace in the body — internal class names, absolute server paths, and a
 * page a paid visitor can do nothing with. Now: log it, send a real 500, and
 * still show the phone number.
 * ------------------------------------------------------------------------- */
ini_set('display_errors', site_is_configured() ? '0' : (string) ini_get('display_errors'));

set_exception_handler(static function (Throwable $error): void {
    $ref = strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));

    error_log(sprintf(
        '[AD Housing %s] %s: %s in %s:%d',
        $ref,
        get_class($error),
        $error->getMessage(),
        $error->getFile(),
        $error->getLine()
    ));

    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: text/html; charset=UTF-8');
    }

    try {
        $GLOBALS['__error_ref'] = $ref;
        render_page(current_path(), [
            'view'        => 'error',
            'title'       => 'Something Went Wrong',
            'description' => 'The page could not be loaded.',
            'canonical'   => '/',
            'noindex'     => true,
            'error_ref'   => $ref,
        ]);
    } catch (Throwable $fatal) {
        echo '<!doctype html><meta charset="utf-8"><title>Something went wrong</title>'
            . '<p>The page could not be loaded. Reference: ' . htmlspecialchars($ref, ENT_QUOTES) . '</p>';
    }
});

/* ---------------------------------------------------------------------------
 * Method handling. The front controller answered PUT, DELETE and TRACE with a
 * full 20 KB page and HTTP 200.
 * ------------------------------------------------------------------------- */
$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
$allowed = ['GET', 'HEAD', 'OPTIONS', 'POST'];

if (!in_array($method, $allowed, true)) {
    http_response_code(405);
    header('Allow: ' . implode(', ', $allowed));
    header('Content-Type: text/plain; charset=UTF-8');
    echo "405 Method Not Allowed
";
    exit;
}

if ($method === 'OPTIONS') {
    http_response_code(204);
    header('Allow: ' . implode(', ', $allowed));
    exit;
}

/* The security headers are set once, by .htaccess. Re-sending them here
   would put a duplicate of each on every HTML response. */
header('Content-Type: text/html; charset=UTF-8');

$requestUri = (string) ($_SERVER['REQUEST_URI'] ?? '/');
$path       = resolve_path($requestUri);
$routes     = routes();

/* ---------------------------------------------------------------------------
 * Canonical URL shape: send "/roofing/" and "/index.php" to "/roofing" and "/"
 * with a permanent redirect, so a page is never reachable at two addresses.
 * ------------------------------------------------------------------------- */
$rawPath = parse_url($requestUri, PHP_URL_PATH);
$rawPath = is_string($rawPath) ? $rawPath : '/';

if ($path === '/index.php') {
    $path = '/';
}

$expected = url($path === '/' ? '/' : $path);

/* Exact comparison, not a trimmed one: "/ps2/roofing/" must redirect to
   "/ps2/roofing", and "/ps2" to "/ps2/". Only routes that actually exist are
   redirected, so $expected is always built from a literal route key — a crafted
   path can never reach the Location header. */
if ($rawPath !== $expected && isset($routes[$path])) {
    $query = parse_url($requestUri, PHP_URL_QUERY);
    $query = is_string($query) ? preg_replace('/[\r\n]/', '', $query) : '';

    header('Location: ' . $expected . ($query !== '' ? '?' . $query : ''), true, 301);
    exit;
}

/* ---------------------------------------------------------------------------
 * Dispatch
 * ------------------------------------------------------------------------- */
if ($method === 'POST' && $path !== '/contact') {
    http_response_code(405);
    header('Allow: GET, HEAD, OPTIONS');
    header('Content-Type: text/plain; charset=UTF-8');
    echo "405 Method Not Allowed
";
    exit;
}

$GLOBALS['__route_path'] = $path;

if (isset($routes[$path])) {
    render_page($path, $routes[$path]);
    exit;
}

http_response_code(404);
render_page($path, [
    'view'        => 'not-found',
    'title'       => 'Page Not Found',
    'description' => 'That page is not available. Return to the home page or call to speak with the team.',
    /* Fixed canonical, matching the original layout's `alternates: { canonical: "/" }`.
       Echoing $path back would reflect attacker-chosen input into <link rel=canonical>
       and og:url on a page that becomes indexable once `configured` is true. */
    'canonical'   => '/',
    'noindex'     => true,
]);
