# Beyond Beauty Saloon — Upgrade Engineering Plan

**Document Version:** 1.0  
**Date:** 28 October 2026  
**Author:** Senior Full-Stack, UX, Security & QA Lead  
**Scope:** In-place architectural and UI/UX upgrade based on `ANTIGRAVITY_UPGRADE_SPEC.md` and `PRD.md`.

---

## 1. Executive Summary & Existing Codebase Inventory

Beyond Beauty Saloon is a monorepo managed via `pnpm` workspace containing:
- **`apps/web`**: Next.js 14.2 App Router web application with Tailwind CSS, Lucide icons, and server/client components.
- **`apps/api`**: Express.js REST API with Prisma ORM 5.14, SQLite database (`prisma/dev.db`), JWT authentication, and bcryptjs.
- **`packages/types`**: TypeScript DTO interfaces and domain model types.
- **`packages/config`**: Shared configuration tokens.

### Current Working Baseline:
- The database schema in `apps/api/prisma/schema.prisma` already defines complete entities for `User`, `EmployeeProfile`, `CustomerProfile`, `ServiceCategory`, `Service`, `StaffShift`, `TimeOff`, `Appointment`, `AppointmentAllocation`, `Visit`, `VisitServiceLine`, `Invoice`, `Payment`, `AttendanceRecord`, `SalaryPeriod`, `SalaryAdvance`, `Notification`, `AuditLog`, `Offer`, and `Product`.
- Database seeds successfully with 6 operating hours records, 6 service categories, 8 services, admin user (`admin@beyondbeauty.local`), 2 stylists (`priya.stylist@beyondbeauty.local`, `sneha.skin@beyondbeauty.local`), and customer.
- Frontend builds cleanly (`next build`) and runs on port 3000.
- Vitest API baseline test suite runs and passes.

---

## 2. Identified Deficiencies & Specification Gaps (Baseline Audit)

| Area | Current State / Defect | Upgrade Requirement (`ANTIGRAVITY_UPGRADE_SPEC.md`) | Severity |
|---|---|---|---|
| **Public Navigation** | Direct "Staff" and "Admin" buttons exist in public header. | Public header must expose **ONE Login action only**. No direct Staff/Admin dashboard buttons. | **P0 (Critical)** |
| **Login Experience** | Login page lacks strict two-role switcher with server-side role verification. | Dedicated mutually exclusive **`Login as Admin`** and **`Login as Staff`** role selection with backend role enforcement and protected redirection. | **P0 (Critical)** |
| **Staff Creation & Onboarding** | Admin UI lacks real API connection to create staff accounts with login credentials. | Owner/Admin can create staff profile with unique ID (`BBS-XXXX`), assign services/shifts, generate initial login credentials, and disable/reset accounts. | **P0 (Critical)** |
| **Backend Protected Routes & RBAC** | `apps/api` only has `/auth`, `/public`, `/health` routes mounted. Missing `/admin/*`, `/employee/*`, and `/appointments/*` routers. | Server-side role enforcement: `authorize('OWNER_ADMIN')` and `authorize('EMPLOYEE')`. Block anonymous/wrong-role access at the API layer. | **P0 (Critical)** |
| **Appointment Scheduling & Concurrency** | Scheduling needs server-side concurrency / overlap detection against staff shifts and existing bookings. | Real database-backed slot booking with atomic conflict prevention (no double-booking). | **P0 (Critical)** |
| **Employee Workspace API** | Employee portal needs server-backed assigned queue, service completion entry, and notification updates. | Real API endpoints for assigned appointments, service entry with bill draft, attendance check-in/out, and persisted notifications. | **P0 (Critical)** |
| **Theme System & Palette** | Currently has 5 custom themes; needs exact 6 spec presets plus custom accent picker. | Presets: Rose Atelier, Sage Serenity, Lavender Glow, Peach Bloom, Ocean Mist, Midnight Luxe (dark mode) + custom accent picker with WCAG contrast calculation & reduced motion. | **P1 (High)** |
| **Typography & Layout Consistency** | Some cards and sections had inconsistent spacing scales and sample labels. | Strict typography tokens (`Playfair Display` + `Plus Jakarta Sans`), uniform 4/8/16/24/32/48/64px spacing scale, professional premium aesthetic. | **P1 (High)** |
| **Automated Test Coverage** | Only 2 baseline tests exist in `apps/api/test/health.test.ts`. | Comprehensive automated tests for auth, wrong-role denial, staff creation, double-booking race condition, and employee workflows. | **P0 (Critical)** |

---

## 3. Phased Execution Roadmap

### Milestone A — Baseline & Safe Preparation
- Document existing codebase, database schema, and test suite.
- Create `docs/upgrade-plan.md` and `docs/upgrade-progress.md`.
- Verify database backup and rollback plan (SQLite file backup `prisma/dev.db.bak`).

### Milestone B — Backend RBAC, Staff Management & Booking APIs
- Expand `apps/api`:
  - Enhance `authRouter`: support login via email OR staff code, validate requested role against server role, enforce active account status.
  - Implement `adminRouter` (`/api/v1/admin`):
    - `POST /staff`: Create new employee with unique staff code, system user account, default shifts, and eligible services.
    - `GET /staff`: Directory listing with status, job title, and skills.
    - `PATCH /staff/:id`: Edit profile, change status (`ACTIVE` vs `DISABLED`), reset credentials.
    - `GET /appointments`: Salon-wide bookings overview with status filter.
    - `GET /analytics`: Live operational metrics (billed, collected, active staff).
  - Implement `appointmentRouter` (`/api/v1/appointments`):
    - `POST /`: Create booking with atomic transaction and conflict detection (concurrency lock).
    - `GET /`: Role-scoped appointments retrieval.
    - `PATCH /:id/status`: Transition appointment status (`CONFIRMED` -> `IN_SERVICE` -> `COMPLETED` / `CANCELLED`).
  - Implement `employeeRouter` (`/api/v1/employee`):
    - `GET /appointments`: Assigned queue for the authenticated staff member.
    - `POST /service-entry`: Log completed service with bill draft and notes.
    - `POST /attendance`: Check-in / check-out with persisted timestamp.
    - `GET /notifications`: Persisted notifications with read status update.
- Write automated backend tests for all new endpoints using `vitest` and `supertest`.

### Milestone C — Authentication Flow & Public Navbar Hardening
- Update Public Navbar (`apps/web/src/components/Navbar.tsx`):
  - Expose exactly **ONE Login action** in the public navbar.
  - Remove direct public "Staff" and "Admin" navigation buttons.
- Redesign Login Page (`apps/web/src/app/login/page.tsx`):
  - Clear, accessible segmented role selector: **`Login as Admin`** and **`Login as Staff`**.
  - Server-authenticated login via `/api/v1/auth/login` validating matching role.
  - Role-based redirect to `/admin` or `/employee`. Safe error on role mismatch.
  - Provide an accessible customer portal sign-in link without compromising staff/admin flow.

### Milestone D — Owner Staff Management & Staff Workspace
- Admin Staff Management (`apps/web/src/app/admin/page.tsx`):
  - Add Staff modal with real API submission to `/api/v1/admin/staff`.
  - Automatic generation of unique staff code (`BBS-XXXX`).
  - Immediate display of initial access credentials for the owner.
  - Toggle staff status (`ACTIVE` vs `DISABLED`) and password reset.
- Staff Workspace (`apps/web/src/app/employee/page.tsx`):
  - Live assigned queue powered by API.
  - Working service entry logging and attendance check-in/out.
  - Real-time in-app notification center.

### Milestone E — Theme Engine, Typography & Public Site Refinement
- Update Theme Engine (`ThemeContext.tsx`, `ThemeSwitcher.tsx`, `globals.css`):
  - 6 Presets: Rose Atelier (default), Sage Serenity, Lavender Glow, Peach Bloom, Ocean Mist, Midnight Luxe.
  - Custom accent color picker with accessible text contrast computation.
  - `@media (prefers-reduced-motion: reduce)` support in CSS animations.
- Refine Homepage, Services, Booking, About, and Contact pages for pixel-perfect typography, aligned buttons, and zero broken controls.

### Milestone F — Verification, End-to-End QA & Completion Reporting
- Run automated test suite (`pnpm test` in API and Web).
- Execute manual journey verifications from the Acceptance Matrix (Section 15 of spec).
- Produce `docs/upgrade-qa-report.md`, `docs/upgrade-design-system.md`, and `docs/auth-and-rbac.md`.
- Provide Windows PowerShell commands and live running server URLs.

---

## 4. Rollback and Data Protection Strategy
- SQLite database backup: Create a timestamped copy of `apps/api/prisma/dev.db` before applying migrations.
- If schema changes are required, use tracked Prisma migrations (`prisma migrate dev`).
- Never overwrite or drop existing owner credentials or historical salon records.

