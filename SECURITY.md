# How Tukate protects people's data

Tukate holds personal information: email, name, date of birth, rough location, photos,
swipes and private messages. This page says how it is protected and what still has to be
done before launch.

## Already in place

**Each person can only reach their own data.** The database (Supabase Postgres) has row
level security on every table. A signed-in person can read and edit only their own profile
row. Other people's cards reach them through two server functions that leave out the
private parts.

| Information | Who can see it |
|---|---|
| Email address | Only the owner |
| Date of birth | Only the owner. Others see age only |
| Exact location | Nobody. Others see distance rounded to 100 m |
| Card (name, Base, drinks, style, bio, photo) | Signed-in members |
| Swipes | Only the person who made them |
| Messages | Only the two people in the match |
| Reports | Nobody in the app. Team only, through the Supabase dashboard |
| Venue enquiries | Nobody in the app. Team only |

**Rules that cannot be bypassed from the app**, because the database enforces them:
18+ only, 3 free swipes a day, filters only on Plus, nobody can upgrade themselves,
nobody can change their date of birth, nobody can write a swipe or a match directly.

**Abuse limits:** 20 chat messages a minute, 10 reports a day, 5 venue enquiries an hour
per address, plus a hidden-field trap for bots on the venue form.

**On the phone:** the sign-in session is stored in the system keychain / keystore, not in
plain app storage. Photos are in a private bucket and shown through links that expire
after an hour.

**People control their own data:** edit card, download everything held about them, and
delete the account, all from the Me tab. Deleting removes the card, swipes, matches and
messages.

**Consent:** an account cannot be created without confirming 18+ and accepting the terms
and privacy policy. The time of acceptance is stored.

**Transport and headers:** everything travels over HTTPS. Both the website and the web
app send standard security headers.

**Tested:** `supabase/tests/run.sh` runs 54 checks covering the rules above.

## Keys

- `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are public by design and
  ship inside the app. They only allow what the security rules allow.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses every rule. It is used only by the website's server
  for the venue form. It must never be put in the app, in git, or in a chat.
- No keys are stored in this repository. `.env` files are ignored by git.

## Must be done before launch

1. **Register with the Office of the Data Protection Commissioner (ODPC)** as a data
   controller. Kenya's Data Protection Act generally requires this for organisations that
   handle personal data. Confirm the details with a lawyer.
2. **Have a lawyer review** the privacy policy, terms and community guidelines on the
   website. They are drafts.
3. **Turn on two-factor sign-in** on the Supabase, GitHub, hosting and email accounts.
   Whoever controls those controls everyone's data.
4. **Decide where the data lives.** Supabase has no East African region, so the data will
   sit outside Kenya. The privacy policy says so; a lawyer should confirm this is
   acceptable for your registration.
5. **Set up your own email sender** so sign-in codes reach real users.
6. **Turn on database backups** (Supabase paid plans include daily backups).
7. **Publish a contact address** for privacy requests (`NEXT_PUBLIC_CONTACT_EMAIL`).

## Known gaps

- No admin screen for reviewing reports yet; they are read in the Supabase dashboard.
- Age is self-declared. There is no ID check.
- Messages are protected by access rules but are not end-to-end encrypted, so the team
  can technically read them in the database. This is what allows reports to be reviewed.
- The venue form's rate limit is per server instance and resets on restart.
- The real-database path has been tested at the database level, not yet end to end
  against a live Supabase project.

## Reporting a security problem

Email the contact address on the website's privacy page. Please do not open a public
GitHub issue for security problems.
