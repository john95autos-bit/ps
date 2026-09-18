# HomeGuard Services website

A responsive, phone-call-first home-services website built for focused Google Ads
landing pages. Plain PHP — no build step, no Node, no package manager.

## Requirements

- PHP 8.1 or later (developed against XAMPP's PHP 8.2)
- Apache with `mod_rewrite` enabled and `AllowOverride All` for the document root

## Running it locally

Drop the project into your XAMPP `htdocs` directory and start Apache. If the
folder is `htdocs/ps2`, the site is at:

```text
http://localhost/ps2/
```

The app detects its own base directory, so it works unchanged at a subdirectory
or at a domain root — no configuration to change when you deploy.

## Included pages

- Home
- Pest control landing page
- Cockroach, termite, bed bug and rodent landing pages
- Roofing, gardening and plumbing pages
- About, service areas and contact pages
- Privacy policy, terms of use and service disclaimer
- Generated `robots.txt` and `sitemap.xml`

## Before launch

Read `LAUNCH-CHECKLIST.md`. The site ships with a working brand and placeholder
contact/location details.

**While `configured` is false, every page sends `noindex, nofollow` and shows a
red pre-launch banner.** That is deliberate: placeholder details cannot reach
Google or a live ad campaign by accident. Flipping the flag is the last step of
the checklist, not the first.

## Configuration

Everything editable lives in one place:

```bash
cp config/local.php.example config/local.php
```

Then edit `config/local.php` — business name, phone number (display and `tel:`
forms), email, service areas, hours, public domain, Google Ads ID and the
`configured` flag. It is merged over `config/site.php`, so you only list what you
are changing, and it is gitignored.

`config/site.php` holds the defaults plus the page copy (service descriptions,
pest guides, image dimensions). `config/legal.php` holds the three legal
documents.

## Google Ads integration

Set these in `config/local.php` (or as environment variables `SITE_URL` and
`GOOGLE_ADS_ID`):

```php
'site_url'      => 'https://www.yourdomain.com',   // no trailing slash
'google_ads_id' => 'AW-123456789',
```

Every phone link pushes a `phone_click` event to `dataLayer` with the page path,
link placement and phone number. Connect that event to your chosen conversion
action in Google Tag Manager or Google Ads.

The measurement tag loads only when a syntactically valid `AW-...` ID is
configured. Consent defaults to denied using Google's documented `gtag()` snippet
and is updated from the site's privacy-choice banner — including on return
visits, when the stored choice is replayed on page load.

## Project layout

```text
index.php              front controller — resolves a URL against the route table
.htaccess              clean URLs, source lockdown, caching, security headers
config/site.php        business details, service copy, image dimensions
config/legal.php       privacy / terms / disclaimer documents
config/local.php       your overrides (gitignored; copy the .example)
inc/helpers.php        e(), url(), asset(), phone_link(), img_tag(), partial()
inc/router.php         route table, nav items, sitemap source
inc/layout.php         the HTML document shell
partials/              header, footer, FAQ, call panel, consent banner, ...
views/                 one file per page type
assets/css/site.css    the whole stylesheet
assets/js/site.js      menu, FAQ, reveals, phone tracking, consent
images/                service photography
```

`config/`, `inc/`, `partials/` and `views/` are blocked from the web by
`.htaccess`; only `index.php`, `assets/` and `images/` are directly reachable.

To add a page: add a route to `inc/router.php` and a template to `views/`. It
joins `sitemap.xml` automatically.

## Design notes

Lightweight native scroll reveals, reduced-motion support, responsive photo
crops, accessible navigation and a persistent mobile phone CTA. Content is
readable with JavaScript disabled. Every image carries intrinsic dimensions so
pages do not shift while loading.

No testimonial, licence, certification, insurance, price, job-count or
guaranteed-result claim has been invented. Add only claims the real business can
verify.
