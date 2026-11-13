# Tukate Project Report

13 November 2026

## Summary

Tukate is built but not live. The website, the phone app, the web app and the database all exist in one GitHub repository and pass their tests, but nothing is deployed and nothing has run against a real database yet. Every remaining blocker needs an account that only the owner can create.

| Part | State |
| --- | --- |
| Website | Built, 9 pages. Not deployed |
| Phone app (iPhone and Android) | Built. Runs in demo mode on made-up people |
| Web app | Built from the same code as the phone app. Not deployed |
| Database | Designed and tested on a local test database. No live project yet |
| Payments (M-PESA) | Not started |
| App store release | Not started |

The work took three days, 11 to 13 November 2026, across 7 commits. The repository holds about 5,400 lines of code in 78 source files: 2,576 lines for the website, 2,130 for the app and 714 for the database and its tests.

Repository: [github.com/Wanjiru-Val/Tukate](https://github.com/Wanjiru-Val/Tukate). It is public.

## What Tukate is

Tukate is an app for finding someone nearby to have a drink with. It works like a swiping app, but it is for making friends, not dating. It starts in Nairobi and is for adults only.

| Decision | Choice |
| --- | --- |
| Name | Tukate (Sheng: "let's go") |
| Slogan | Ingia Tukate |
| Tagline | Swipe. Match. Cheers. |
| Audience | Adults 18 and over in Nairobi |
| Launch areas | Kilimani, Westlands, Kileleshwa, CBD |
| Language | English buttons, Sheng and Swahili for headlines |
| Colours | Bendera Remix: midnight, green, red, cream, mango, pink |
| Fonts | Bricolage Grotesque for headlines, Inter for app text |
| Logo | Placeholder: red party cup inside a green map pin. Final choice still open |
| Group feature | Mbogi Mode, planned for later |

Every profile carries a **Base** (the area someone hangs out in) and a **Kinywaji** (their usual drink). A mutual yes shows the match screen, "Form imeshika!".

The website is designed as one Friday night in Nairobi, from a cancelled plan at 5:47 pm to getting home safe. This replaced a first version that looked generic, at the owner's request.

## What has been built

The repository has three working parts: a website, an app that runs on phones and in a browser, and a database.

### Website (`web/`)

The public marketing site. Built with Next.js.

| Page | What it does |
| --- | --- |
| Home | Tells one Friday night: a group chat that falls through, a draggable swipe demo, a sunset over the Nairobi skyline, a timeline of the night, the house rules, free and paid tiers, Mbogi Mode, common questions |
| Safety | House rules sign, a checklist for before, during and after a meetup, emergency numbers |
| For venues | Pitch to bars and a form that saves enquiries to the database |
| Get the app | App store buttons, which read "coming soon" until links are added |
| Help | Eleven questions answered in full |
| Privacy policy | Draft, needs a lawyer's review |
| Terms of use | Draft, needs a lawyer's review |
| Community guidelines | Draft, needs a lawyer's review |
| Wrong address page | Shown for addresses that do not exist |

Every page has an 18+ check on first visit and a responsible-drinking line with the NACADA helpline number.

### App (`mobile/`)

One codebase, built with Expo and React Native, that becomes an iPhone app, an Android app and a web app.

| Screen | What it does |
| --- | --- |
| Welcome | Confirms 18+ and agreement to the terms before anything else |
| Sign in | Six-digit code sent by email |
| Set up your card | Name, date of birth, Base, Kinywaji, kind of drink, drinking type, party style, optional one-line bio |
| Swipe | Drag or tap Pass, Super Like or Cheers. Nearest people first. Shows swipes left today and the filters |
| Match | "Form imeshika!" on a mutual yes |
| Matches | List of matches with the latest message |
| Chat | Messages between two matched people, with a Safety button |
| Safety menu | Share location with a friend, report, block |
| Tukate Plus | Free and paid compared, with the price |
| Me | View and edit card, add a photo, download my data, sign out, delete account |
| House rules | The six safety rules |
| Privacy summary | What is collected and who sees it, in plain words |

The app has two modes. With database keys it talks to the real database. Without them it runs in **demo mode** on seven made-up people held in memory, which is how it has been tested so far.

### Database (`supabase/`)

A Postgres database designed for Supabase. It holds eight tables: areas, profiles, swipes, matches, messages, blocks, reports and venue enquiries. The important rules live inside the database itself, so the app cannot bypass them.

## Business model

Tukate is free with limits, and charges KES 299 a month for the freedom to choose who you see. The owner set both numbers on 12 November 2026.

|  | Free | Tukate Plus |
| --- | --- | --- |
| Price | KES 0 | KES 299 a month |
| Swipes | 3 a day | No daily limit |
| Who you see | People in the area you are in | Same, plus filters |
| Filter by same drink | No | Yes |
| Filter by drinking type | No | Yes |
| Filter by party style | No | Yes |
| Chat and meetups | Yes | Yes |

The limits are enforced in the database. A free account that asks for a fourth swipe or a filter is refused by the server, whatever the app does. Nobody can upgrade their own account; only the payment system can.

Three things here were assumed and need the owner's confirmation:

- **The name.** "Tukate Plus" is a working name.
- **Unlimited swipes on Plus.** The owner only mentioned filters.
- **Chat is the same on both tiers.**

Payments are not connected, so nobody can buy Plus yet. Until then an account can be made Plus by hand in the database for testing.

A note of caution raised during the build: three swipes a day is tight. A new user in a quiet area could use all three, get no match, and leave before considering Plus. This is worth testing with real people.

## Security and data protection

Each person can only reach their own data, and that rule is enforced by the database, not by the app. Tukate will hold emails, dates of birth, rough locations, photos, swipes and private messages, so this was treated as a core requirement.

| Information | Who can see it |
| --- | --- |
| Email address | Only the owner |
| Date of birth | Only the owner. Others see age only |
| Exact location | Nobody. Others see distance rounded to 100 m |
| Card (name, Base, drinks, style, bio) | Signed-in members |
| Photos | Signed-in members, through links that expire after an hour |
| Swipes | Only the person who made them |
| Messages | Only the two people in the match |
| Reports and venue enquiries | Nobody in the app. The team only |

### Protections in place

- **Access rules on every table.** Other people's profiles are only reachable through two server functions that leave out the private fields.
- **Rules that cannot be bypassed:** 18+ only, 3 free swipes a day, filters only on Plus, no self-upgrade, date of birth cannot be changed after sign-up.
- **Consent.** No account without confirming 18+ and accepting the terms and privacy policy. The time of acceptance is stored.
- **Abuse limits.** 20 chat messages a minute, 10 reports a day, 5 venue enquiries an hour per address, and a hidden-field trap for bots on the venue form.
- **On the phone.** The sign-in session is kept in the phone's encrypted keychain.
- **User rights.** Anyone can edit their card, download everything held about them, and delete their account from the Me tab.
- **Website and web app.** Standard security headers on every page, and the framework was upgraded after an audit found 22 known issues in its dependencies, 3 of them critical. One moderate issue remains, in a developer tool that never reaches users.
- **Keys.** No keys are stored in the repository.

### Known gaps

- Age is self-declared. There is no ID check.
- Messages are protected by access rules but are not end-to-end encrypted, so the team can technically read them in the database. This is what makes reviewing reports possible.
- There is no admin screen for reviewing reports yet.
- The venue form's rate limit resets whenever the server restarts.
- The privacy policy, terms and community guidelines are drafts.

The full write-up is in `SECURITY.md` in the repository.

## Testing and health

Everything that could be tested without live accounts was tested, and it passed. The parts that depend on a live database, a real phone or real payments have not been tested at all.

| What was tested | How | Result |
| --- | --- | --- |
| Database rules | 54 automated checks on a local Postgres database | All pass |
| App, whole journey | Automated run in a phone-sized browser, demo mode: sign-up, under-18 refusal, swipe, match, chat, report, daily limit, upgrade, filters, edit, sign-out | All 20 steps pass |
| App code | Type check | No errors |
| Website build and code checks | Build and lint | Clean |
| Website speed (Lighthouse) | Homepage, 11 November | 91 on phone, 100 on desktop |
| Website accessibility | Automated scan of every page at phone and desktop width, 11 November | 0 failures after fixes |
| Website links | Every link followed | None broken |
| Venue form | Against a stand-in database | Saves, drops bot submissions, blocks the 6th enquiry in an hour |
| Dependency security audit | Website, 11 November | 22 known issues reduced to 1, in a developer tool |

The database checks cover the age limit, the daily swipe limit, Plus-only filters, profile privacy, matching, chat privacy, blocking, consent, data export, rate limits and account deletion.

### Not tested

- **The app against a live Supabase project.** No project exists yet, so sign-in by email, photo upload, live chat delivery and the real data path are unproven end to end.
- **The app on a real phone.** Location sharing, the photo picker and keychain storage have only been exercised in a browser, where they behave differently.
- **The website's speed and accessibility after 11 November.** The pricing section and three legal pages were added later and the scans were not re-run.
- **Payments.** Nothing exists to test.
- **Load.** Nothing has been tested with more than a handful of test accounts.

## What is not done yet

Four things stop Tukate from opening: no live database, nothing deployed, no way for real users to receive sign-in codes, and no payments.

| Item | Why it matters | Level |
| --- | --- | --- |
| No live database | The app only runs in demo mode | Blocker |
| Nothing is deployed | Nobody can visit the website or the web app | Blocker |
| No email sender | Supabase's built-in email reaches only the owner's own team, 2 emails an hour. Real users cannot sign in | Blocker |
| Payments not connected | Tukate Plus cannot be bought, so there is no income | Blocker for income |
| Legal pages are drafts | Personal data is collected under them | Before launch |
| App store release | Needs Apple and Google developer accounts and store listings | Before launch |
| Sheng and Swahili copy unreviewed | Written during the build and never checked by a native speaker | Before launch |
| Placeholder logo | The final party cup concept has not been chosen | Before launch |
| No admin screen for reports | Reports can only be read in the database dashboard | Before launch |
| No share image or sitemap | Shared links show no preview. Needs the domain first | Before launch |
| Sign-in by phone number | Email codes were used because SMS needs a paid provider | Later |
| Live location | "Share my location" sends one position, it does not keep updating | Later |
| Mbogi Mode | Group matching is only a teaser on the website | Later |
| Real photography | Demo profiles are illustrated | Later |
| Neighbourhood, events and blog pages | Planned as a later phase from the start | Later |

## What is needed from the owner

Five accounts unlock the remaining work, and the first one unlocks the most. They are listed in the order they should be done.

1. **Supabase project and access token.** Create a project at supabase.com in an EU region, then generate an access token. This lets the real database be created and the app tested end to end.
2. **Vercel account connected to the repository.** Puts the website and the web app online. The free tier is enough to start.
3. **A domain and an email sender.** A domain such as tukate.co.ke, and a free account with an email service such as Brevo or Resend. This lets sign-in codes reach real users and unlocks the sign-in email wording.
4. **Safaricom Daraja account.** Needed for M-PESA payments.
5. **Apple and Google developer accounts.** About 99 US dollars a year for Apple and 25 US dollars once for Google.

### Legal and safety steps

- [ ] Register with the Office of the Data Protection Commissioner as a data controller. Confirm the details with a lawyer.
- [ ] Have a lawyer review the privacy policy, terms and community guidelines.
- [ ] Turn on two-factor sign-in for the Supabase, GitHub, hosting and email accounts.
- [ ] Publish a contact address for privacy requests.
- [ ] Check domains, social handles and Kenyan trademarks for the name "Tukate".

### Decisions and reviews

- [ ] Read through the Sheng and Swahili copy on the website and in the app.
- [ ] Choose the final party cup logo.
- [ ] Confirm the paid tier's name and that it has no daily swipe limit.
- [ ] Test the name and the three-swipe limit with 10 to 15 people in the target group.

## Risks

The biggest risk is not technical. Tukate puts strangers together where alcohol is involved, so safety and the law matter more than any feature.

| Risk | What could happen | What reduces it |
| --- | --- | --- |
| Someone is harmed at a meetup | Serious harm to a user, and to the business | House rules, public-place messaging in every chat, location sharing, report and block. Still needs a way to review reports quickly and a lawyer's view on liability |
| Under-18s sign up | Legal exposure | Age is self-declared today. An ID check would close this |
| Data protection non-compliance | Fines or orders under the Data Protection Act | Access rules, consent, export and deletion are built. Registration and legal review are not done |
| Alcohol advertising rules | Marketing may be restricted in Kenya | Not assessed. Needs legal advice before any paid promotion |
| Unverified parts fail on first real use | Sign-in, photos or chat break against the live database | Test end to end as soon as the Supabase project exists |
| Empty app at launch | New users see nobody nearby and leave | Launch in a few areas at once, and seed with venue partners and events |
| Three free swipes is too few | Users leave before they ever match | Test with real people; the limit is one number to change |
| Name or trademark conflict | Forced rename after launch | Check trademarks, domains and handles before spending on the brand |
| Account takeover | Whoever controls Supabase or GitHub controls all user data | Two-factor sign-in on every account |

One related item outside this project: the owner's other app, Fuego, uses the same outdated version of Next.js that was found to have critical security issues here. It needs the same upgrade to 15.5.29.

## Timeline and where everything lives

The project went from a brand file to a tested website, app and database in three days.

| Date | What happened |
| --- | --- |
| 13 Nov 2026 | Data protection hardened: consent, private photos, rate limits, data export. App made to run as a web app. Privacy policy, terms and community guidelines drafted. Venue form now saves to the database |
| 12 Nov 2026 | Phone app built with demo mode. Database designed and tested. Website moved into its own folder. Free and paid tiers decided and added to the website |
| 11 Nov 2026 | Health check: security upgrade, phone menu, age check and contrast fixes. Code map made with the owner's fork of Floorplan |
| 11 Nov 2026 | Website redesigned as one Friday night in Nairobi, after the first version was judged too generic |
| 11 Nov 2026 | First website built from the site plan. Repository created by the owner |
| 11 Nov 2026 | Site plan drawn from the brand directions file |

### Where things are

| Thing | Location |
| --- | --- |
| All code | [github.com/Wanjiru-Val/Tukate](https://github.com/Wanjiru-Val/Tukate), branch `main` |
| Website | `web/` folder |
| Phone and web app | `mobile/` folder |
| Database and its tests | `supabase/` folder |
| Brand and pricing decisions | `docs/brand-decisions.md` |
| Security write-up | `SECURITY.md` |
| Setup steps | `README.md` |
| Original site plan | [Tukate Site Floorplan](https://claude.ai/artifact/FpHNTMEk3wTRHKo2sicZqu) |
| Health check of 11 November | [Tukate As-Built Floorplan](https://claude.ai/artifact/1JeiX8vTx2PzLHV2VnezRi) |
| Floorplan tool | [github.com/Wanjiru-Val/floorplan-Val](https://github.com/Wanjiru-Val/floorplan-Val), the owner's fork |

The Floorplan code map of 11 November is out of date. The folders were reorganised and the app was added after it was made.
