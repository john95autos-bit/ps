<?php

/**
 * Legal document copy.
 *
 * Replaces the three thin Next.js page components that each passed a literal
 * `sections` array into <LegalPage>: app/privacy/page.tsx, app/terms/page.tsx
 * and app/disclaimer/page.tsx. The wording, the section titles and their order
 * are reproduced verbatim; only the storage moved.
 *
 * Shape (identical for all three slugs):
 *
 *   '<slug>' => [
 *       'eyebrow'  => string,   // breadcrumb crumb + eyebrow line in the hero
 *       'title'    => string,   // <h1>
 *       'intro'    => string,   // lead paragraph
 *       'sections' => list<['title' => string, 'paragraphs' => list<string>]>,
 *   ]
 *
 * Tokens: paragraph text may contain `{legal_name}`, which views/legal.php
 * substitutes with site('legal_name') at render time via strtr(). The original
 * interpolated `${siteConfig.legalName}` into the same spot in privacy section
 * 1; keeping it a token means the copy stays a plain string here and the legal
 * entity is still edited in exactly one place (config/site.php).
 *
 * The "Last updated" date is NOT stored here — it comes from
 * site('legal_updated'); the original hardcoded it in the component.
 */

declare(strict_types=1);

return [

    /* ---------------------------------------------------------------------
     * app/privacy/page.tsx — 8 sections.
     * ------------------------------------------------------------------- */
    'privacy' => [
        'eyebrow' => 'Privacy policy',
        'title'   => 'Your information should be handled with care.',
        'intro'   => 'This policy explains what this website may collect, why it is used and the choices available to visitors.',
        'sections' => [
            [
                'title'      => '1. Who we are',
                'paragraphs' => [
                    'This website is operated by {legal_name}, {address}. You can reach us by telephone on {phone} or by email at {email}.',
                    '{legal_name} is a free platform that connects users with local independent contractors. We do not directly provide home service work and we do not employ the technicians who carry it out. Where this policy refers to work being arranged, that work is performed by an independent contractor, not by us.',
                ],
            ],
            [
                'title'      => '2. Information you provide',
                'paragraphs' => [
                    'The website is designed primarily for phone enquiries, and it also has an enquiry form on the contact page. If you use that form you provide your name and telephone number, which are required, and optionally an email address and postcode, together with the service you need and a description of the problem. If you contact us by phone or email instead, you may provide the same kinds of information.',
                    'Along with a form submission we record the date and time, the page it was sent from, your IP address and your browser user-agent string. These are kept as evidence of when and how consent to be contacted was given, and to investigate abuse of the form.',
                    'Do not send card numbers, bank credentials, passwords or unnecessary sensitive information through this site. The form does not ask for payment details and no part of this website requests them.',
                ],
            ],
            [
                'title'      => '3. Website and advertising measurement',
                'paragraphs' => [
                    'This website loads a Google advertising tag on every page. Google Consent Mode is used, and until you make a choice in the privacy banner the tag is set to denied: it does not read or write advertising or analytics identifiers, and it does not use cookies. In that denied state Google still receives a limited signal that a page was loaded — the page address, the referring address and an approximate location derived from your IP address — which it uses for basic, aggregated measurement.',
                    'If you choose "Accept optional", the tag is switched to granted and may then set and read identifiers to measure whether an advertisement led to an enquiry, including recording that you tapped a phone-call button and which button it was. If you choose "Essential only", it stays denied.',
                    'Separately, and regardless of your choice, this site records your choice itself in your browser\'s local storage under the key "adhs-consent", and records phone-button taps in an in-page event queue so the measurement described above can read them when it is permitted to. No cookies are set by this website itself.',
                ],
            ],
            [
                'title'      => '4. How information is used',
                'paragraphs' => [
                    'Information may be used to respond to enquiries, check service-area availability, arrange or administer services, maintain records, improve the website, measure advertising performance, prevent misuse and comply with legal obligations.',
                    'Details you send through the enquiry form are passed to a local independent contractor so they can call you back about that enquiry. They are not sold, and they are not used to send you marketing about anything you did not ask about.',
                ],
            ],
            [
                'title'      => '5. Sharing and processors',
                'paragraphs' => [
                    'Information may be handled by service providers that support hosting, communications, analytics, advertising or business administration. It should not be sold as a standalone product. Information may also be disclosed when legally required or necessary to protect rights and safety.',
                    'The named advertising and measurement provider used by this website is Google (Google LLC, or Google Ireland Limited for visitors in the EEA, UK and Switzerland). Google\'s handling of this data is governed by its own privacy policy at https://policies.google.com/privacy, and personalised-advertising settings can be reviewed at https://adssettings.google.com. Hosting is provided by the operator\'s web host.',
                ],
            ],
            [
                'title'      => '6. Retention and security',
                'paragraphs' => [
                    'Information should be kept only as long as reasonably needed for the purposes described, legal obligations and dispute handling. Reasonable safeguards should be used, but no internet or communication system can be guaranteed completely secure.',
                ],
            ],
            [
                'title'      => '7. Your choices',
                'paragraphs' => [
                    'You may choose essential-only measurement in the privacy banner shown on your first visit. You can change that decision at any time using the "Privacy choices" link in the footer of every page, which clears the stored choice and shows the banner again.',
                    'Depending on your location, you may also have rights to request access to, correction of, deletion of, or restriction of your information, and to object to its use. To exercise any of these, contact the business by telephone on the number published on this site, or by email at the address published on the contact page. The operator must publish a postal address and a named data controller here before launch if the applicable law requires one.',
                ],
            ],

            /* TCPA. This site currently has no form of any kind and collects no
               phone number through the web, so the operative wording here is
               forward-looking: it states what consent language must appear IF a
               form is ever added. The three sentences after the quoted consent
               statement are not optional decoration — 47 CFR 64.1200(f)(9)
               requires prior express written consent to disclose that consent is
               not a condition of purchase, and to identify the calling party.
               A bare checkbox without them is weak consent. */
            [
                'title'      => '8. Calls and text messages',
                'paragraphs' => [
                    'If you telephone the number published on this site, your number reaches us through ordinary caller identification and we use it to return your call about the enquiry you made. If you submit the enquiry form on the contact page, you give us your telephone number directly and tick a consent box before it can be sent.',
                    'The consent box on the enquiry form is unticked by default, sits immediately above the submit button, and must be ticked before the form will send. It reads: “By clicking submit, I consent to receive calls and text messages from AD Housing Services and its network of independent contractors at the number provided. Consent is not a condition of purchase. Message and data rates may apply. Reply STOP to opt out.”',
                    'That consent is recorded with the date, time, page, IP address and browser user-agent of the submission, and the exact wording you agreed to is stored alongside it, so what was consented to can be produced later. Consent is not a condition of purchasing any service. Message and data rates may apply. Automated or prerecorded calls and texts may be used where the consent covers them.',
                    'You may withdraw consent at any time: reply STOP to any text message, or tell us on any call that you do not wish to be contacted again, and the number will be suppressed. Withdrawing consent does not affect your ability to telephone us.',
                ],
            ],
            [
                'title'      => '9. Children and changes',
                'paragraphs' => [
                    'This site is intended for adults arranging household services and is not directed to children. This policy may be updated when practices, services or legal requirements change.',
                ],
            ],
        ],
    ],

    /* ---------------------------------------------------------------------
     * app/terms/page.tsx — 8 sections.
     * ------------------------------------------------------------------- */
    'terms' => [
        'eyebrow' => 'Terms of use',
        'title'   => 'Clear terms for using this website.',
        'intro'   => 'By using this website, you agree to the following terms. Separate service terms may apply to any work you authorise.',
        'sections' => [
            [
                'title'      => '1. Website purpose',
                'paragraphs' => [
                    'The website provides general information about home-service categories and a way to contact the business. Content is not a remote diagnosis, survey, engineering opinion, safety certification, pesticide label or substitute for advice based on the property.',
                ],
            ],
            [
                'title'      => '2. Enquiries and bookings',
                'paragraphs' => [
                    'A phone call, email or website visit does not by itself create a booking or service contract. Availability, service area, scope, price or pricing basis, timing, access, cancellation terms and applicable taxes should be confirmed before work is authorised.',
                ],
            ],
            [
                'title'      => '3. Estimates and changes',
                'paragraphs' => [
                    'Any preliminary estimate based on a description or photograph may change when the property is inspected or new conditions are found. No payment is collected through this website. Ask for the accepted payment methods and any deposit terms directly from the business.',
                ],
            ],
            [
                'title'      => '4. Customer responsibilities',
                'paragraphs' => [
                    'Provide accurate information, disclose relevant risks, follow preparation and safety instructions, obtain any permissions required for the property and ensure safe access. Do not ask a worker to carry out unlawful or unsafe work.',
                ],
            ],
            [
                'title'      => '5. Availability and content',
                'paragraphs' => [
                    'Services and availability may change. We aim to keep the website functional and accurate but do not guarantee uninterrupted access or that every description will apply to every property.',
                ],
            ],
            [
                'title'      => '6. Intellectual property',
                'paragraphs' => [
                    'Website copy, layout and original branding are protected to the extent permitted by law. Illustrative images may be generated or licensed for marketing use and must not be treated as evidence of a particular completed job.',
                ],
            ],
            [
                'title'      => '7. Liability',
                'paragraphs' => [
                    'To the extent permitted by law, the site operator is not liable for loss caused solely by reliance on general website content. Nothing in these terms excludes rights or liabilities that cannot lawfully be excluded.',
                ],
            ],
            [
                'title'      => '8. Governing terms',
                'paragraphs' => [
                    'The operator should replace this paragraph before launch with the governing law, business address and dispute terms appropriate to the actual operating location.',
                ],
            ],
        ],
    ],

    /* ---------------------------------------------------------------------
     * app/disclaimer/page.tsx — 7 sections (unnumbered titles, as in the
     * original).
     * ------------------------------------------------------------------- */
    'disclaimer' => [
        'eyebrow' => 'Service disclaimer',
        'title'   => 'Important information before you rely on this site.',
        'intro'   => 'Please read these limitations alongside the relevant service page and any quotation or agreement.',
        'sections' => [
            [
                'title'      => 'Illustrative content',
                'paragraphs' => [
                    'Photographs and graphics on this website are illustrative. They show representative service situations and do not claim to depict a specific employee, customer, property, pest level, repair or outcome.',
                ],
            ],
            [
                'title'      => 'No guaranteed outcome',
                'paragraphs' => [
                    'Results depend on property condition, access, pest species or fault cause, environmental factors, maintenance and customer follow-through. The website does not promise permanent pest elimination, guaranteed repairs, guaranteed completion times or a result that has not been assessed.',
                ],
            ],
            [
                'title'      => 'Pricing and offers',
                'paragraphs' => [
                    'No price, discount, response time or availability should be assumed unless it is clearly stated and confirmed for the specific enquiry. Taxes, parts, materials, call-out charges, access requirements and additional work may affect the final price.',
                ],
            ],
            [
                'title'      => 'Qualifications and regulated work',
                'paragraphs' => [
                    'Licensing, certification, insurance and regulated-work claims must be verified for the actual business and location before being published. Only appropriately qualified people should perform work that local law reserves to licensed professionals.',
                ],
            ],

            /* Allocates verification responsibility to the homeowner. Placed
               directly after the qualifications section so a reader looking for
               licensing information meets both statements together rather than
               finding one without the other. */
            [
                'title'      => 'Verifying your contractor',
                'paragraphs' => [
                    'It is the responsibility of the homeowner to verify that the hired contractor holds the appropriate licenses, insurance, and bonding required for the specific job and local jurisdiction.',
                    'Requirements differ by trade, by the value and type of work, and by state, county and municipality, and they change over time. Ask to see current documentation before work begins, confirm that the licence covers the specific trade and scope being carried out, and check the details directly with the issuing authority or insurer rather than relying on a copy you have been shown. Nothing on this website should be treated as confirmation that any particular contractor is licensed, insured or bonded for your job.',
                ],
            ],
            [
                'title'      => 'Pest-control safety',
                'paragraphs' => [
                    'Pesticides and other control products must be selected, applied, stored and disposed of according to their labels and applicable law. Disclose children, pets, allergies, pregnancy, respiratory conditions and sensitive areas before treatment.',
                ],
            ],
            [
                'title'      => 'Not an emergency service',
                'paragraphs' => [
                    'Do not rely on this website for fire, gas, electrical, poisoning, major flooding, structural danger or any immediate threat to people or property. Contact the appropriate emergency service, poison centre or utility provider.',
                ],
            ],
            [
                'title'      => 'Advertising disclosure',
                'paragraphs' => [
                    'This is an independent business website and is not affiliated with or endorsed by Google. Inclusion in an advertisement does not mean Google guarantees or approves the services. Advertising approval is determined by Google and is not guaranteed by website design alone.',
                ],
            ],
        ],
    ],
];
