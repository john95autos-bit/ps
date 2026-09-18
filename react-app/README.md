# AD Housing Services — React

A phone-call-first home-services site built for Google Ads landing pages. React
18 + Vite + React Router, deployed to Vercel as a static build with one
serverless function for the enquiry form.

This is a port of the PHP version in the parent directory. Every route, every
line of copy and the entire stylesheet came across; what changed is listed under
[Differences from the PHP build](#differences-from-the-php-build).

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server, including a working `/api/lead` endpoint |
| `npm run build` | Generates `robots.txt` + `sitemap.xml`, then builds to `dist/` |
| `npm run preview` | Serves `dist/` as it will be served in production |
| `npm run smoke` | Renders all 16 routes server-side and asserts their content |

`npm run smoke` is the one to run after any change. A client-rendered app
compiles happily with a broken component and only fails in the browser; the
smoke test walks every route through `react-dom/server` and fails the build
instead. It checks markup, not behaviour — effects (meta tags, animations,
consent banner, call prompt) need a real browser.

## Deploying to Vercel

1. Push this directory to a Git repo, or run `vercel` from inside it.
2. If the repo root is the parent folder rather than this one, set **Root
   Directory** to `react-app` in the Vercel project settings.
3. Framework preset: **Vite**. Build command and output directory are already in
   `vercel.json`, so the defaults are correct.
4. Add the environment variables below under **Settings → Environment
   Variables**.
5. Deploy.

`vercel.json` handles the SPA fallback (so `/roofing` works on a hard refresh
and as an ad's final URL), the security headers, and immutable caching for
hashed assets.

## Configuration

Business details, copy, service pages and the pest guides live in
`src/config/site.js` and `src/config/legal.js`. Edit those directly — they are
the equivalent of the old `config/site.php` and `config/legal.php`.

Anything that differs between local and production is an environment variable.
Copy `.env.example` to `.env.local` for development:

```bash
cp .env.example .env.local
```

| Variable | Where | Purpose |
|---|---|---|
| `VITE_SITE_URL` | browser | Final HTTPS domain, no trailing slash. Drives canonical tags, Open Graph, `robots.txt`, `sitemap.xml`. |
| `VITE_GOOGLE_ADS_ID` | browser | `AW-123456789`. Loads gtag.js. |
| `VITE_GOOGLE_ADS_CONVERSION_LABEL` | browser | The part after the slash in `send_to`. Without it, calls are never reported as conversions. |
| `VITE_GTM_ID` | browser | `GTM-XXXXXXX`, as an alternative to the two above. |
| `VITE_CONFIGURED` | browser | The launch switch. See below. |
| `RESEND_API_KEY` | server | Resend API key for emailing enquiries. |
| `LEAD_FROM_EMAIL` | server | Sender address, on a domain verified with Resend. |
| `LEAD_EMAIL` | server | Where enquiries land. |
| `LEAD_WEBHOOK_URL` | server | POST each lead as JSON to your own endpoint. Works alone or alongside email. |

Anything prefixed `VITE_` is **compiled into the browser bundle and is public**.
The server-only values are read by `api/lead.js` and never reach the client.

## The launch gate

While `VITE_CONFIGURED` is anything but `true`, every page sends
`noindex, nofollow` and shows a red pre-launch banner. That is deliberate:
placeholder details cannot reach Google or a live ad campaign by accident.

Setting it to `true` is not enough on its own. `src/lib/launch.js` re-checks the
configuration and, if it still finds a placeholder domain, a malformed tag id,
missing conversion tracking or unreplaced legal text, the site stays `noindex`
and the banner names the specific blockers. Flipping the flag is the last step
of `LAUNCH-CHECKLIST.md`, not the first.

## The enquiry form

`POST /api/lead` is a Vercel serverless function (`api/lead.js`). It validates
the submission, rejects cross-origin posts, applies a honeypot, a time trap and
a per-IP rate limit, then delivers the lead by email (Resend) and/or webhook.

**Configure at least one delivery channel.** With none set, the endpoint returns
a "not connected yet" message rather than showing a success screen over a lead
that went nowhere.

Each delivered lead carries the TCPA consent evidence: the timestamp, the page,
the IP, the user agent and the exact consent wording the visitor agreed to.
Changing `LEAD_FORM.consentText` in `src/config/site.js` changes what future
submissions record and updates the quote in the privacy policy at the same time;
it does not rewrite consent already given.

The rate limiter lives in the function's memory, so it resets on a cold start
and is not shared between concurrent instances. It is a speed bump, not a
control. If you need a real one, put the counter in Vercel KV or Upstash Redis.

## Project layout

```text
index.html                 document shell; Consent Mode default runs here
vercel.json                SPA fallback, security headers, caching
api/lead.js                the enquiry form endpoint (serverless)
scripts/generate-seo.js    writes robots.txt + sitemap.xml at build time
scripts/smoke.jsx          renders every route and asserts its content
src/config/site.js         business details, service copy, image dimensions
src/config/legal.js        privacy / terms / disclaimer documents
src/config/routes.js       route table, nav items, title templates
src/lib/                   launch gate, formatting, page metadata, GSAP motion
src/components/            header, footer, hero, FAQ, call surfaces, form
src/pages/                 one component per page type
src/styles/site.css        the whole stylesheet, unchanged from the PHP build
public/                    images, self-hosted fonts, favicon
```

To add a page: add a route to `src/config/routes.js`, a component to
`src/pages/`, and a `<Route>` in `src/App.jsx`. It joins `sitemap.xml`
automatically.

## Differences from the PHP build

**Rendering.** The PHP version sent complete HTML. This one renders in the
browser, so `<head>` is written by `src/lib/usePageMeta.js` after mount.
Googlebot renders JavaScript and will see the right tags; most social scrapers
(Facebook, LinkedIn, Slack) do not, so shared links fall back to the defaults in
`index.html`. If organic search or link previews matter, prerender the routes at
build time — `vite-plugin-ssr`, `react-snap` or a small script reusing
`scripts/smoke.jsx` would all do it, since every page already renders correctly
through `react-dom/server`.

**Content-Security-Policy.** The PHP build used a per-request nonce. A static
bundle has no per-request anything, so `script-src` carries `'unsafe-inline'`
instead. Everything else in the policy is unchanged and still strict. Removing
it would need server-rendered pages.

**Lead storage.** `lead_store()` appended to `storage/leads-YYYY-MM.jsonl`.
Vercel's filesystem is ephemeral, so that file would be lost on every deploy and
invisible across instances. Delivery is email and/or webhook instead.

**CSRF.** No sessions, so no token. `api/lead.js` checks `Origin` against `Host`,
which is what a same-origin form needs and all the token was buying.

**Time trap.** The PHP version kept the form's timestamp in the session, so
opening `/contact` in a second tab could silently discard the first tab's
genuine submission. The elapsed time now travels with the form it belongs to.

**HTTPS and headers.** The `.htaccess` HTTP→HTTPS redirect was unreachable — an
earlier `[L]` ended the ruleset before it — and `Header always unset
X-Powered-By` / `Server` never worked. Vercel serves HTTPS and sets HSTS
directly, so both problems disappear with the platform.

**Fixes carried in during the port.** The consent banner and privacy policy no
longer claim a Google tag loads when none is configured; the launch gate now
treats missing conversion tracking as a blocker; the sticky call bar no longer
waits on the animation bundle to appear; the reduced-motion rule for it now wins
on specificity; the About page, footer and service-areas copy no longer
contradict the platform disclosure; and the privacy policy quotes the consent
text from config rather than keeping a second copy that could drift.
