# Implementation decisions

This document tracks architecture and security decisions for the cybersecurity portfolio.

---

## 1. Backend via Supabase Edge Functions

All stateful operations (contact, booking, admin) are delegated to Supabase. The browser bundle never receives provider secrets:

- Public client uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Server-side operations (Resend, Google Calendar, rate limiting) run in Edge Functions with secrets set via `supabase secrets set`.

---

## 2. Booking schema design

The schema in `supabase/migrations/202609090001_booking_platform.sql` enforces:

- **Row-level security (RLS)**: anonymous users cannot access profiles directly.
- **Booking lifecycle**: PENDING → CONFIRMED / CANCELLED / RESCHEDULED / REJECTED via `booking_status` enum.
- **Exclusion constraints**: GiST exclusion on `booking_reservations` prevents overlapping reservations.
- **Tokenized actions**: reschedule/cancel tokens are hashed in the database.

---

## 3. Email and calendar integration

Contact and booking notifications use Resend. Calendar events (Meet links) are created via Google Calendar API when `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` are set.

---

## 4. Multi-page routing

Unlike traditional portfolio templates, this app uses react-router-dom for explicit route separation (home, about, experience, projects, case studies, skills, certifications, education, resume, contact, schedule, admin).

This enables SEO-friendly URLs and independent page loading.
