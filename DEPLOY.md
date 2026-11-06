# Deploying the demo (Vercel + Supabase)

About 20 minutes. You need a GitHub account (this repo), a Supabase account and a Vercel account.

## 0. Get the code onto `main`

Vercel deploys `main`. Merge the `fix/local-postgres-ssl` branch first: it contains the database
permissions fix (migration 005) without which the hosted site can't read or write anything.

## 1. Supabase: create the database

1. **New project.** Region: **Southeast Asia (Singapore)**, closest to Bangkok. Save the database
   password somewhere safe, but **do not** put it in Vercel (see "Security" below).
2. **SQL Editor → New query.** Paste the whole of `supabase/apply-all.sql` and click **Run**.
   Run it **once**: a second run fails with "policy already exists".
   This creates the tables, the sample services/doctors/bookings, and the API permissions.
3. **Authentication → Users → Add user → Create new user.** Use the admin email, a strong password,
   and tick **Auto Confirm User**.
4. **Authentication → URL Configuration → Site URL:** set it to your Vercel URL once you have it
   (step 2), e.g. `https://smile-bangkok-demo.vercel.app`.
5. **Project Settings → API Keys.** Copy the **Project URL**, the **publishable** key and a
   **secret** key for the next step.

## 2. Vercel: deploy the site

1. **Add New → Project →** import `vivekanandkoli/agency-clinic-demo`. Framework: Next.js
   (detected). Leave the build settings as they are.
2. **Environment Variables** (Production):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | publishable key (`sb_publishable_…`) |
   | `SUPABASE_SECRET_KEY` | secret key (`sb_secret_…`) |
   | `ADMIN_EMAILS` | the admin email from step 1.3 |
   | `ANTHROPIC_API_KEY` | from platform.claude.com (chatbot) |

   Optional: `NEXT_PUBLIC_GTM_ID` (or `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_META_PIXEL_ID`) for ad tracking.
3. **Deploy.** Then put the resulting URL into Supabase's Site URL (step 1.4).

## 3. Check it works

- Home page loads with services and doctors.
- Open `/?utm_source=facebook&utm_campaign=test`, make a booking and send a contact message.
- Ask the chatbot a question, in English and in Thai.
- Sign in at `/admin`. The booking shows "facebook / test" under Source; the contact message and
  the chat appear under Contacts and Chats.

## Security

- **Never set `DATABASE_URL`, `SUPABASE_DB_PASSWORD` or `ADMIN_INITIAL_PASSWORD` in Vercel.**
  `/api/setup` is public: on an empty database with a database password available, it creates the
  tables *and the admin user* and returns that admin's password to whoever called it. Setting the
  database up through the SQL Editor (step 1.2) and leaving these unset keeps it disabled.
- `SUPABASE_SECRET_KEY` and `ANTHROPIC_API_KEY` are server-only. Never add them with a
  `NEXT_PUBLIC_` prefix.
- Keep the Anthropic account on prepaid credit with auto-reload off, or set a monthly limit:
  the chatbot is public and every message costs a little.

## Running costs and limits

- **Supabase free tier** pauses a project after about a week with no activity. A paused demo
  shows errors until you restore it in the Supabase dashboard; check it before showing a client.
- **Vercel's Hobby (free) plan** is for non-commercial use. A demo used to sell agency services may
  need the Pro plan; check Vercel's current terms.
- **Chatbot:** roughly US$0.0005 per reply on Claude Haiku 5.5.
