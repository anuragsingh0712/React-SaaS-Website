# React SaaS Website

A demo SaaS product dashboard ("Nimbus") built to showcase realistic business workflows —
authentication, an analytics home/dashboard, feature modules, pricing with billing-cycle
savings, a searchable resource center with bookmarking, a contact form, a profile/settings
page with theme and notification preferences, and a notification center — all running on
local mock data with no backend required.

## Tech stack

React + TypeScript, Vite, Tailwind CSS, React Router, axios, React Hook Form, Zod,
Framer Motion, Recharts, React Hot Toast, TanStack Query.

## Getting started

```
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```

Then open http://localhost:43025

Demo login: `admin@example.com` / `password123` (prefilled on the login form).

## Environment variables

See .env.example. VITE_API_URL is optional — every entity runs on local mock data
(USE_MOCK = true in src/data/store.ts and src/auth/auth.ts) until it's set and each
entity's flag is flipped to false.

## Project structure

- src/pages — one component per screen/route
- src/components — shared UI building blocks (Sidebar, TopBar, Card, forms, etc.)
- src/data — mock data, localStorage-backed CRUD store
- src/api — shared axios client with auth/error interceptors
- src/auth — mock authentication (login/signup/logout/session)
- src/contexts — ThemeContext (light/dark, persisted)
- src/hooks — useAsyncData, useDebouncedValue
- src/constants — route paths and shared literal values
- src/validation — reusable field validators
- src/utils — formatting helpers
- src/routes — createBrowserRouter route tree
