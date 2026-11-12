# Tukate

Swipe to find someone nearby to drink and hang out with. Friends, not dates. 18+ only.

| Folder | What it is |
|---|---|
| `web/` | The public website (Next.js). See `web/` and run `pnpm install && pnpm dev` inside it. |
| `mobile/` | The phone app for iPhone and Android (Expo / React Native). |
| `supabase/` | The app's database: tables, security rules and tests. |
| `docs/` | Brand decisions, including the free and paid tiers. |

## The app in one paragraph

People sign in with an emailed code, set up a card (Base, Kinywaji, drinking type, party
style), and swipe on people nearby. Two yeses make a match and open a chat. Free accounts
get 3 swipes a day and no filters. Tukate Plus (KES 299 a month) removes the limit and
unlocks filters by drink, drinking type and party style. Those rules are enforced in the
database, so they cannot be bypassed from the app.

## Try the app without setting anything up (demo mode)

With no Supabase keys the app runs on made-up people held in memory.

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with the Expo Go app on your phone, or press `w` to open it in a browser.

## Connect the real database

1. Create a project at supabase.com.
2. In the project's SQL Editor, run `supabase/migrations/0001_core.sql`, then
   `supabase/migrations/0002_photos.sql`.
3. Authentication -> Email Templates -> Magic Link: make the email show the code by
   including `{{ .Token }}` in the template, for example `Your Tukate code is {{ .Token }}`.
4. Copy `mobile/.env.example` to `mobile/.env` and paste in the Project URL and the
   anon (public) key from Project Settings -> API. Never put the service role key in the app.
5. Start the app again. The yellow demo banner disappears when it is on the real database.

To make an account Plus by hand while payments are not connected, run this in the SQL
Editor with that person's user id:

```sql
update public.profiles set plan = 'plus', plan_until = now() + interval '30 days'
where id = '<user id>';
```

## Testing

- Database rules: `PGURL=postgres://postgres@localhost:5432/postgres supabase/tests/run.sh`
  runs 47 checks on a throwaway local Postgres database (age limit, daily swipe limit,
  Plus-only filters, privacy, matching, blocking, account deletion).
- App: `cd mobile && npm run typecheck`.

## Not done yet

- **Payments.** The Plus screen shows the price but M-PESA is not connected. It needs a
  Safaricom Daraja account and a small server function that marks the account Plus when a
  payment succeeds.
- **Phone number sign-in.** Sign-in is by emailed code for now. SMS codes need a paid SMS
  provider connected in Supabase.
- **Store release.** Needs an Apple developer account and a Google Play account, then
  `eas build`.
- **Moderation.** Reports are stored in the `reports` table. There is no admin screen yet.
- **Live location.** "Share my location" sends your current position once through the
  phone's share sheet. It does not keep updating.
- The real-database path has been tested at the database level but not yet end to end
  against a live Supabase project.
