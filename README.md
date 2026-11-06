# Abhishek Babariya — Cybersecurity Portfolio

A dark, motion-driven cybersecurity portfolio for **Abhishek Babariya** — SOC operations, digital forensics, incident response, and threat detection. Built with React, TypeScript, Tailwind CSS, Framer Motion, and a Supabase-backed booking/contact layer.

**Cybersecurity Operations · DFIR · Incident Response · Threat Detection**

---

## Overview

The site is a multi-page application (not a single-scroll template) themed as an investigation workspace:

- **Portfolio pages** — home, about, experience, projects with case-study deep dives (MITRE ATT&CK mappings, severity, detections), skills, certifications, education, resume.
- **Secure contact** — honeypot-protected form delivered through a Supabase Edge Function.
- **Interview scheduling** — availability rules, buffered time slots, tokenized reschedule/cancel links, Google Calendar + Meet integration, reminder emails.
- **Recruiter channel** — dedicated flow for recruiters with an admin dashboard for reviewing, approving, rescheduling, and rejecting bookings.
- **Extras** — `/terminal` (interactive CLI portfolio), `/verify` (link verification), admin sign-in.

All public pages are static and served from GitHub Pages; every interactive/stateful feature is delegated to Supabase.

---

## Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | React 18.3 + TypeScript 5.9 | UI |
| Build | Vite 5.4 | Dev server / `dist/` build |
| Styling | Tailwind CSS 3.4 | Design system |
| Motion | Framer Motion 12.38 | Reveal / scroll animations |
| Icons | Lucide React 0.344 | Icons |
| Routing | react-router-dom 7.18 | Multi-page routes |
| Backend | Supabase Edge Functions (Deno) | Contact, availability, booking, admin, reminders |
| Database | Supabase PostgreSQL (RLS) | Profiles, meeting types, availability, bookings, reservations |
| Email | Resend | Notifications + confirmation |
| Calendar | Google Calendar API | Busy-time + Meet event creation |
| Hosting | GitHub Pages (Actions) | Static deployment |

---

## Quick start

```bash
npm install
npm run dev
```

Dev server prints its URL (default `http://localhost:5173`). Override with `PORT`:

```bash
PORT=5174 npm run dev
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |

The frontend renders fully without a backend; contact and scheduling features degrade to a clear "service not configured" state until `VITE_SUPABASE_*` is present.

---

## Project structure

```
src/
├── main.tsx                  Entry point
├── App.tsx                   Route table
├── index.css                 Global reset + Tailwind + fonts
├── components/
│   ├── SiteNavbar.tsx        Sticky nav
│   └── TelemetryBackground.tsx  Animated grid background
├── pages/                    One file per route
│   ├── HomePage.tsx          Hero, selected case studies, recruiter quick profile
│   ├── ProjectsPage.tsx      Case-study index
│   ├── CaseStudyPage.tsx     MITRE ATT&CK breakdown per case
│   ├── SchedulePage.tsx      Booking calendar
│   ├── ContactPage.tsx       Honeypot-protected secure form
│   ├── AdminPage.tsx         Dashboard + review queue
│   ├── RecruiterPage.tsx     Recruiter-specific landing
│   └── ...                   About, Experience, Skills, Certifications, Education,
│                             Resume, Terminal, Verify, Visitor booking actions
├── data/
│   └── portfolioData.ts      PROFILE, CASE_STUDIES, detections, certifications
└── lib/
    ├── supabase.ts           Client + isBackendConfigured guard
    ├── api.ts                Edge Function call wrappers
    └── booking.ts            Booking/availability client logic
```

---

## Backend

All server-side logic lives in `supabase/` as Deno Edge Functions with a shared security/validation layer:

| Function | Purpose |
|---|---|
| `submit-contact` | Secure contact form delivery |
| `get-availability` | Available slots from rules + Google busy time |
| `reserve-slot` | Slot reservation with expiry |
| `create-booking` / `visitor-booking` | Create bookings |
| `visitor-booking-action` | Tokenized reschedule / cancel |
| `admin-availability` | Manage availability rules |
| `admin-booking-action` | Approve / reject / reschedule bookings |
| `admin-dashboard` | Admin stats + list |
| `send-reminders` | Idempotent scheduled reminders |

Database schema (migration `202609090001_booking_platform.sql`) enforces RLS, row-level booking statuses, GiST exclusion on reservations, and hashed cancel/reschedule tokens — no plaintext secrets in the browser.

See [SETUP.md](SETUP.md) for the full production provisioning checklist and `.env.example` for the environment contract. Server secrets (service role, Resend, Google, rate-limit, reminder) must never be placed in `VITE_*` variables.

---

## Deployment

GitHub Actions builds `npm run build` and deploys `dist/` to GitHub Pages at the repo Pages origin under the `/portfolio/` base path. The workflow reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` from repository secrets when set.

To deploy:

1. Set the two `VITE_*` secrets in the repository if a live backend is configured.
2. Push to `main` (or run the workflow manually) — Pages publishes automatically.

Any static host also works: build command `npm run build`, publish directory `dist`.

---

## Documentation

| Doc | Contents |
|---|---|
| [`SETUP.md`](SETUP.md) | Production setup — Supabase, Resend, Google Calendar, reminders, verification checklist |
| [`docs/ASSETS.md`](docs/ASSETS.md) | Image inventory and replacement guidance |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Architecture decisions and rationale |
