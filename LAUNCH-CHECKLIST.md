# Launch checklist

The site is intentionally conservative about claims. Complete these before
connecting a real Google Ads campaign.

While `VITE_CONFIGURED` is not `true`, every page sends `noindex, nofollow` and
shows a red pre-launch banner. Setting it to `true` is the **last** step here —
and the app re-checks, so if anything below is still outstanding it stays
`noindex` and the banner tells you exactly which item.

## 1. Business details

Edit `src/config/site.js`:

- business name, short brand name and legal name
- phone number, in both display and E.164 `tel:` formats
- business email and registered address
- coverage wording (`primaryArea`, `coverage`, `coverageNote`, `serviceAreas`)
- published business hours
- `legalUpdated` — the date shown on the three legal pages

Unlike the PHP build, the brand word is not duplicated anywhere. The header,
footer and og:image alt all read `brandShort`, so renaming is a single edit.

`legalUpdated` is now authoritative — the PHP version cross-checked it against
the file's modification time. **Bump it by hand whenever you edit
`src/config/legal.js`.**

## 2. Domain and tracking

Set in Vercel → Settings → Environment Variables (and `.env.local` for dev):

- `VITE_SITE_URL` — the final HTTPS domain, no trailing slash. Drives canonical
  tags, Open Graph URLs, `robots.txt` and `sitemap.xml`. While it is the
  placeholder, `robots.txt` is generated with `Disallow: /` so a preview
  deployment cannot be crawled under the wrong hostname.
- `VITE_GOOGLE_ADS_ID` **and** `VITE_GOOGLE_ADS_CONVERSION_LABEL`, or
  `VITE_GTM_ID`. The label is the part after the slash in
  `send_to: 'AW-123456789/AbC-D_efGh12345'`.

Then:

- Map the site event `phone_click` to your phone-call conversion action, or
  confirm `window.__adsConversion()` fires on tap.
- Use a final URL that visibly contains the exact phone number used in the ad.
- Test the `tel:` link on a real phone and confirm calls reach the business.
- Confirm the consent banner appears once, that "Accept optional" is remembered,
  and that Tag Assistant shows consent granted on a **return** visit.

Note: environment variables prefixed `VITE_` are baked in at build time, so
changing one in Vercel requires a **redeploy**, not just a restart.

## 3. The enquiry form

Configure at least one delivery channel, or the form tells visitors it is not
connected:

- `RESEND_API_KEY`, `LEAD_FROM_EMAIL` (on a Resend-verified domain) and
  `LEAD_EMAIL`; and/or
- `LEAD_WEBHOOK_URL`.

Then submit a real test enquiry on the deployed site and confirm it arrives with
the consent wording, timestamp, IP and user agent attached. That record is your
TCPA evidence — check it exists before you spend on ads, not after a complaint.

Decide where those leads are retained. Email alone means your mailbox is the
system of record; if you need to produce consent evidence years later, point
`LEAD_WEBHOOK_URL` at something that stores it durably.

## 4. Claims and legal review

- Add licence, insurance, certification, guarantee, years-in-business and review
  claims only when current evidence supports them.
- Replace the placeholder governing-law and legal-entity language in
  `src/config/legal.js` — terms section 8 and privacy section 7 both say so in
  the text, and the launch gate blocks on those phrases.
- Confirm local rules for pest-control products, regulated plumbing/gas work,
  roofing and advertising.
- Keep prices, discounts, response times and availability accurate.
- Check the platform disclosure is not contradicted anywhere. The operator is a
  referral platform, not the contractor: copy that says "our technicians", "the
  team handles" or "we carry out" is a Google Ads misrepresentation risk. The
  About page, footer and service-areas copy were corrected during the port —
  keep new copy consistent with them.

## 5. Campaign landing pages

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

## 6. Final testing

- `npm run smoke` passes.
- Check desktop, tablet and mobile layouts.
- Test the menu, FAQ controls, privacy choices and every phone CTA.
- Hard-refresh a deep link such as `/pest-control/termite-control` on the
  deployed site and confirm it loads rather than 404ing.
- Confirm all pages show the same business identity and phone number.
- Confirm the privacy policy describes every analytics, advertising and
  contact-data tool actually in use.
- Load `/sitemap.xml` and `/robots.txt` and confirm they show the real domain.
- Confirm AdsBot is **not** blocked.

## 7. Go live

Only once every box above is ticked:

```bash
VITE_CONFIGURED=true
```

Redeploy. The pre-launch banner disappears and the site becomes indexable.
Reload any page and confirm `<meta name="robots" content="index, follow">`
before submitting the domain or the ads. If the banner is still showing, read
it — it names what is still blocking.
