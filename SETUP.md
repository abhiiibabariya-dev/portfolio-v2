# Production Setup

This repository serves a static Vite/React portfolio from GitHub Pages and delegates contact, booking, email, calendar, and admin operations to Supabase Edge Functions. No browser bundle contains provider secrets.

## 1. Frontend configuration

Copy the public values from `.env.example` into the GitHub Pages build environment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Set the same deployed Pages origin and local development origin in Supabase Auth URL configuration. This application uses hash routes, so the deployed app URL ends at `/portfolio/` rather than a server-side route.

## 2. Supabase

1. Create a Supabase project.
2. Apply `supabase/migrations/202609090001_booking_platform.sql` through the Supabase CLI or SQL editor.
3. Create an Auth user for the administrator, then set that user's `profiles.is_admin` value to `true`.
4. Deploy all functions listed in `supabase/config.toml`.
5. Set Function secrets with `supabase secrets set`; use the server-only values documented in `.env.example`.

Do not expose `SUPABASE_SERVICE_ROLE_KEY`, Resend, Google, rate-limit, or reminder secrets in Vite variables.

## 3. Email delivery

Configure a verified sending domain and sender in Resend, then set:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `OWNER_EMAIL`

Test both owner notification and visitor confirmation using a controlled email address before publishing.

## 4. Google Calendar and Meet

Enable the Google Calendar API for an OAuth client with access to the selected calendar. Generate and store a refresh token server-side, then set:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_CALENDAR_ID`

If these secrets are absent, availability ignores Google busy time and confirmed bookings do not create calendar events or Meet links.

## 5. Reminders

Schedule authenticated POST calls to `send-reminders` with the `x-reminder-secret` header matching `REMINDER_CRON_SECRET`. Run it at a short interval such as every five minutes. The function records `sent_at`, making repeated scheduled calls idempotent.

## 6. Verification checklist

- `npm run build` passes.
- Anonymous direct table access is rejected by RLS.
- Valid public function calls work for contact, availability, reservation, and booking.
- Non-admin users cannot access admin functions.
- A controlled booking verifies buffers, reservation expiry, email, calendar, cancel links, and reminder delivery.

Live provider validation requires configured Supabase, Resend, Google Calendar, and deployed origin credentials; it cannot be completed from this repository alone.
