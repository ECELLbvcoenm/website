# E-Cell BVCOENM

Website for the Entrepreneurship Cell at Bharati Vidyapeeth College of Engineering, Navi Mumbai.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion
- Supabase (auth + members/applications data, with a local fallback in `lib/localMembers.ts`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You'll need Supabase credentials for auth and the live member list to work — create `.env.local`
with:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Without these, the site still runs and falls back to the static roster in `lib/localMembers.ts`
and the static event list in `lib/events.ts`.

## Structure

- `app/` — pages (home, events, members, sponsors, join, about, founders, projects, resources)
- `components/` — Navbar, Footer, theme + auth providers, auth modal
- `lib/` — Supabase client, static events data, static member fallback data
