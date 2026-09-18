# HomeGuard launch checklist

The site is intentionally conservative about claims. Complete these items before
connecting a real Google Ads campaign.

While the `configured` flag is false, every page sends `noindex, nofollow` and
shows a red pre-launch banner. Setting it to true is the **last** step here.

## 1. Business details

```bash
cp config/local.php.example config/local.php
```

Edit `config/local.php` with the real:

- business and legal name
- phone number, in both display and international `tel:` formats
- business email
- primary city and every genuinely served area
- published business hours
- `legal_updated` date shown on the three legal pages

Then replace the brand word. `HomeGuard` appears as visible text in
`partials/header.php` and `partials/footer.php`, and in the og:image alt text in
`inc/layout.php` — the surrounding copy uses your configured business name, but
those three literals are deliberate and need editing by hand if the brand
changes.

## 2. Domain and tracking

In the same `config/local.php`:

- `site_url` — the final HTTPS domain, no trailing slash. It drives canonical
  tags, Open Graph URLs and `sitemap.xml`.
- `google_ads_id` — the valid `AW-...` tag ID. Anything else and no tag loads.

Then:

- In Google Ads or Tag Manager, map the site event `phone_click` to your phone-call
  conversion action.
- Use a final or verification URL that visibly contains the exact same phone
  number used in the ad.
- Test the `tel:` link on a real phone and confirm calls reach the business.
- Confirm the consent banner appears once, that "Accept optional" is remembered,
  and that Tag Assistant shows consent granted on a **return** visit.

## 3. Claims and legal review

- Add licence, insurance, certification, guarantee, years-in-business and review
  claims only when current evidence supports them.
- Replace the placeholder governing-law, legal-entity and business-address
  language in `config/legal.php` — specifically privacy section 1 and terms
  section 8, which both say so in the text.
- Confirm local rules for pest-control products, regulated plumbing/gas work,
  roofing and advertising.
- Keep prices, discounts, response times and availability accurate.

## 4. Campaign landing pages

Match each ad group to the closest page. Do not send ad visitors to an unrelated
page or a different domain.

| Ad group | Landing page |
|---|---|
| Pest control | `/pest-control` |
| Cockroaches | `/pest-control/cockroach-control` |
| Termites | `/pest-control/termite-control` |
| Bed bugs | `/pest-control/bed-bug-control` |
| Rodents | `/pest-control/rodent-control` |
| Roofing | `/roofing` |
| Gardening | `/gardening` |
| Plumbing | `/plumbing` |

## 5. Server

- Apache has `mod_rewrite` enabled and `AllowOverride All` for the document root,
  or the clean URLs will 404.
- Confirm the source lockdown works — each of these must return **403**:
  `/config/site.php`, `/inc/helpers.php`, `/views/home.php`, `/partials/header.php`
- Serve over HTTPS and confirm `site_url` matches the scheme and host exactly.

## 6. Final testing

- Check desktop, tablet and mobile layouts.
- Test the menu, FAQ controls, privacy choices and every phone CTA.
- Confirm all pages show the same business identity and phone number.
- Confirm the privacy policy describes every analytics, advertising and
  contact-data tool actually in use.
- Load `/sitemap.xml` and `/robots.txt` and confirm they show the real domain.
- Confirm AdsBot is **not** blocked.

## 7. Go live

Only once every box above is ticked, set in `config/local.php`:

```php
'configured' => true,
```

The pre-launch banner disappears and the site becomes indexable. Reload any page
and confirm `<meta name="robots" content="index, follow">` before submitting the
domain or the ads.
