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
| `/` | Home |
| `/how-it-works` | Step-by-step walkthrough |
| `/safety` | Safety guide |
| `/venues` | Venue partner sign-up |
| `/download` | App store links |
| `/help` | FAQ |

## Before launch

- `lib/site.ts`: add the App Store and Google Play links. Until then the buttons read "Coming soon".
- `app/api/venues/route.ts`: venue enquiries are only written to the server log. Connect a database, email or sheet.
- `components/Logo.tsx`: placeholder logo (party cup concept 1). Replace when the final logo is chosen.
- Legal pages (terms, privacy, community guidelines) are not written yet.
