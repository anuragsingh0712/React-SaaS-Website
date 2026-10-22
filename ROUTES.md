# React SaaS Website — Routes & Navigation

## How to run
cd /workspace/frontend_runs/1cd8e043-ba5a-4bbd-b45b-d3f2da1b27c3/project
npm install --legacy-peer-deps && npm run dev
Then open http://localhost:43025

## Routes

| Route | Page file | Description |
|-------|-----------|-------------|
| /login | src/pages/Login.tsx | Public. Email/password login, forgot password link, Google placeholder, auto-login redirect |
| /forgot-password | src/pages/ForgotPassword.tsx | Public. Placeholder password reset flow |
| / | redirects | Redirects to /home (protected) |
| /home | src/pages/Home.tsx | Welcome message, animated KPI cards, revenue chart, recent activity, quick actions, testimonials |
| /dashboard | src/pages/Dashboard.tsx | Analytics dashboard with daily/weekly/monthly filters, charts, progress bars, notifications panel |
| /features | src/pages/Features.tsx | Analytics/Automation/Collaboration modules with benefits, workflows, usage stats, insights |
| /pricing | src/pages/Pricing.tsx | Starter/Professional/Enterprise tiers, monthly/yearly toggle, savings calc, confirm modal |
| /resources | src/pages/Resources.tsx | Searchable resource list with category filters and bookmarking |
| /resources/:id | src/pages/ResourceDetail.tsx | Full resource content, bookmark toggle, related resources |
| /contact | src/pages/Contact.tsx | Contact form with validation, loading/success/error states, reset |
| /profile | src/pages/Profile.tsx | Profile info, subscription, activity, theme/notification preferences, clear data, logout |
| /notifications | src/pages/Notifications.tsx | Notification center: read/unread, dismiss, mark all read |
| * | src/pages/NotFound.tsx | 404 with Go Home link |

All routes except /login, /forgot-password, and * are wrapped in `<RequireAuth>` and
rendered inside the `<App>` layout (Sidebar + TopBar + Outlet).

## Navigation map

- Login -> Home (successful login, or auto-login redirect if a session already exists)
- Login -> ForgotPassword (Forgot password? link)
- ForgotPassword -> Login (Back to login link / after simulated reset email)
- Sidebar/TopBar mobile menu: Home, Dashboard, Features, Pricing, Resources, Contact,
  Notifications, Profile — available from every protected page (NavLink active state)
- Home -> Dashboard / Features / Pricing / Resources (Quick Action cards)
- Home/Dashboard/Features/Pricing/Resources/Contact/Notifications -> Profile (TopBar user menu)
- Any protected page -> Notifications (bell icon in TopBar)
- Profile -> Login (Logout button, after confirm dialog)
- Profile -> Pricing (Manage plan link)
- Features -> Pricing (CTA button)
- Resources -> ResourceDetail (click a resource card)
- ResourceDetail -> Resources (Back button) / ResourceDetail (click related resource)
- Pricing -> Confirmation modal -> plan persisted and shown on Profile
- Any unknown URL -> NotFound -> Home (Go Home link)

## Shared components

- src/components/Sidebar.tsx — sticky left navigation with NavLink active states
- src/components/TopBar.tsx — mobile menu, theme toggle, notification bell with unread badge, user menu, logout confirm
- src/components/RequireAuth.tsx — route guard redirecting unauthenticated users to /login
- src/components/ConfirmDialog.tsx — reusable confirmation modal for destructive actions
- src/components/Card.tsx — base card surface used across all pages
- src/components/Badge.tsx — colored status/category pill
- src/components/KpiCard.tsx — animated KPI metric card (Framer Motion)
- src/components/ProgressBar.tsx — labeled progress indicator
- src/components/RefreshButton.tsx — refresh action with spinner state
- src/components/SkeletonLoader.tsx — loading placeholder blocks
- src/components/EmptyState.tsx — empty-list placeholder
- src/components/ErrorState.tsx — error placeholder with retry action
- src/components/FormField.tsx — labeled form field wrapper with helper/error text
- src/components/TestimonialsCarousel.tsx — animated testimonial carousel with prev/next

## Design tokens

Defined in tailwind.config.js `theme.extend`:
- Colors: canvas, night, surface, surface-dark, glass, primary (50/100/400/500/600/700),
  accent (500/600), muted, muted-dark, border-subtle, border-default, border-dark,
  success (light/dark), warning (light/dark), danger (light/dark), info (light/dark)
- Background images: gradient-primary, gradient-secondary
- Border radius: card, pill
- Box shadow: card, card-lg, glass
- Font family: sans (Inter)
