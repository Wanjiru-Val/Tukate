# Tukate web

Marketing site for **Tukate**: swipe to find someone nearby to drink and hang out with.
Friends, not dates. 18+ only.

Built with Next.js 15 (App Router), TypeScript and Tailwind CSS 4, in the Bendera Remix
palette (see `docs/brand-decisions.md`).

## Run it

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Pages

| Path | Page |
|---|---|
| `/` | Home: one Friday night, from 5:47 pm to home safe |
| `/safety` | Safety guide |
| `/venues` | Venue partner sign-up |
| `/download` | App store links |
| `/help` | FAQ |

## Design notes

- The homepage is one Friday night in Nairobi. It opens in daylight on cream, the sun sets
  behind the skyline as you scroll, and the rest happens after dark. The clock in the nav
  follows the story.
- Type: Bricolage Grotesque does everything (condensed and heavy for the painted-sign
  headlines, regular for reading). Reenie Beanie is the handwriting. Inter, the app's UI
  font, only appears inside app screens.
- All copy lives in `lib/content.ts`. The Sheng and Swahili lines should be checked by a
  native speaker before launch.
- Motion is one small script (`components/Motion.tsx`) plus CSS. It only animates
  transform and opacity, and switches off for people who ask for reduced motion.
- The profiles in the swipe demo are made up.

## Before launch

- `lib/site.ts`: add the App Store and Google Play links. Until then the buttons read "Coming soon".
- `app/api/venues/route.ts`: venue enquiries are only written to the server log. Connect a database, email or sheet.
- `components/Logo.tsx`: placeholder logo (party cup concept 1). Replace when the final logo is chosen.
- Legal pages (terms, privacy, community guidelines) are not written yet.
