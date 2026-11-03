# Beyond Beauty Saloon — Upgrade Progress Tracker

**Document Version:** 2.0  
**Last Updated:** 28 October 2026  
**Status:** Completed & Verified

---

## Progress Overview

| Milestone | Description | Status | Evidence / Notes |
|---|---|:---:|---|
| **Milestone A** | Baseline Codebase Inspection & Planning | ✅ Completed | `docs/upgrade-plan.md` created; db seed & health tests verified. |
| **Milestone B** | Backend RBAC, Staff Management & Booking APIs | ✅ Completed | 15 Vitest tests passing (`vitest run`). TypeScript compiles 0 errors. |
| **Milestone C** | Public Navbar Hardening & Dedicated Role Login | ✅ Completed | Navbar exposes exactly ONE Login button; `/login` has mutually exclusive Staff vs Admin tabs. |
| **Milestone D** | Admin Staff Creation & Employee Workspace | ✅ Completed | Admin onboarding modal issues `BBS-XXXX` codes & temp password card; employee portal connected to queue, service-entry, and notifications. |
| **Milestone E** | 6 Theme Presets, Custom Accent Picker & UI Polish | ✅ Completed | Rose Atelier, Sage, Lavender, Peach, Ocean, Midnight Luxe + WCAG contrast check + reduced-motion CSS. |
| **Milestone F** | End-to-End QA, Acceptance Matrix & Final Report | ✅ Completed | Full acceptance matrix verified; `docs/auth-and-rbac.md`, `docs/upgrade-design-system.md`, and `docs/upgrade-qa-report.md` published. |

---

## Detailed Task Verification Matrix

### Milestone A — Baseline & Discovery
- [x] Inspect existing repo structure, Prisma schema, frontend pages, and API routes.
- [x] Run baseline tests (`apps/api/test/health.test.ts` passed: 2/2).
- [x] Seed SQLite database with operating hours, service categories, sample staff, and services.
- [x] Create `docs/upgrade-plan.md` and `docs/upgrade-progress.md`.

### Milestone B — Backend RBAC, Staff Management & Booking APIs
- [x] Enhanced `authRouter`: support login by email or staff code; validate requested role against server-stored role; enforce active status.
- [x] Implemented `adminRouter` (`POST /api/v1/admin/staff`, `GET /api/v1/admin/staff`, `PATCH /api/v1/admin/staff/:id`, `DELETE /api/v1/admin/staff/:id`).
- [x] Implemented `appointmentRouter` (`POST /api/v1/appointments` with concurrency conflict check, `GET /api/v1/appointments`, `PATCH /:id/status`).
- [x] Implemented `employeeRouter` (`GET /api/v1/employee/appointments`, `POST /api/v1/employee/service-entry`, `POST /api/v1/employee/attendance`, notifications).
- [x] Automated tests (15/15 passing):
  - `test/auth.test.ts` (7 tests: admin login, staff code login, wrong password 401, role mismatch 403, anonymous denial 401, staff to admin denial 403).
  - `test/staff-onboarding.test.ts` (4 tests: admin creates staff, duplicate email 409, staff login with issued code/temp password, deactivated staff login denial 403).
  - `test/booking-concurrency.test.ts` (2 tests: booking creation, double-booking race condition rejection 409).
  - `test/health.test.ts` (2 tests).

### Milestone C — Authentication Flow & Public Navbar Hardening
- [x] Public Navbar: strictly ONE `Login` button; removed direct public "Staff" and "Admin" buttons from desktop and mobile drawer.
- [x] Login Page (`/login`): `Login as Staff` vs `Login as Admin` segmented control; server-side authentication; redirection to `/admin` or `/employee`.
- [x] Client portal link cleanly separated without cluttering primary staff/admin portal authentication.

### Milestone D — Staff Onboarding & Employee Workspace
- [x] Admin dashboard: `Add New Staff Member` modal with unique `BBS-XXXX` staff code generation, service assignment, salary/commission, and one-time credential modal.
- [x] Admin staff directory: live database listing with Active / Deactivated status toggle (`PATCH /admin/staff/:id`) and temporary password reset.
- [x] Employee portal (`/employee`): connected to live backend API for queue management, 'Start Service' (`IN_SERVICE`), 'Complete & Log Bill' modal (`COMPLETED`), attendance toggle, and notifications.

### Milestone E — Theme Engine & Visual Consistency
- [x] Implemented 6 Presets: Rose Atelier (default), Sage Serenity, Lavender Glow, Peach Bloom, Ocean Mist, Midnight Luxe.
- [x] Implemented custom accent color picker with native `<input type="color">` and real-time WCAG AA contrast computation.
- [x] Added `@media (prefers-reduced-motion: reduce)` support in `globals.css`.
- [x] Fixed alignment, typography, and responsive styles across desktop and mobile.

### Milestone F — End-to-End QA & Completion Report
- [x] Ran unit, integration, and typecheck checks (`pnpm --filter @beyond/api typecheck` passed 0 errors; `pnpm --filter @beyond/web exec tsc --noEmit` passed 0 errors).
- [x] Verified Section 15 Acceptance Tests (AUTH-01 to 06, STAFF-01 to 05, BOOK-01 to 04, UI-01 to 04).
- [x] Created `docs/upgrade-design-system.md`, `docs/auth-and-rbac.md`, and `docs/upgrade-qa-report.md`.

