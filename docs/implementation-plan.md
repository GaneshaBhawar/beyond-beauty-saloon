# Implementation Plan: Beyond Beauty Saloon Platform

**Project Slug:** `beyond-beauty-saloon`  
**Date:** 27 October 2026  
**Version:** 1.0.0  
**Baseline Document:** [PRD.md](../PRD.md)

---

## 1. Architecture Overview

Beyond Beauty Saloon is an integrated, full-stack, database-backed web application and operations management platform designed for three user classes:
1. **Public Visitors & Customers:** Discover services, view availability, book appointments, self-manage reservations, view sanitized visit history.
2. **Employees / Stylists:** View assigned appointments, self check-in/out attendance, submit completed service lines and bill drafts, receive operational notifications, view personal published payslips.
3. **Owner / Salon Admin:** Real-time command center, multi-employee calendar, service catalog/pricing, appointment dispatch and walk-ins, offline billing and payment logging (Cash/UPI/Card-at-counter), inventory and consumables ledger, attendance & leave approvals, salary & advance ledger, CMS announcements/gallery, operational audit logs.

### Monorepo Structure

```text
beyond-beauty-saloon/
├── PRD.md
├── README.md
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── apps/
│   ├── web/                     # Next.js (App Router), Tailwind CSS, TypeScript
│   │   ├── src/
│   │   │   ├── app/             # Public routes, /book, /account, /employee, /admin
│   │   │   ├── components/      # Accessible UI components, calendar, tables
│   │   │   ├── lib/             # API client, session helpers, date utils (Asia/Kolkata)
│   │   │   └── types/
│   │   ├── public/              # Brand assets, placeholders
│   │   └── package.json
│   └── api/                     # NestJS / Express TypeScript REST API
│       ├── src/
│       │   ├── auth/            # Cookie/JWT session auth, Argon2id/bcrypt, RBAC guards
│       │   ├── users/           # User accounts, customer & employee profiles
│       │   ├── catalog/         # Categories, services, pricing, durations
│       │   ├── availability/    # Real-time slot engine, shift & buffer math
│       │   ├── appointments/    # Atomic booking, rescheduling, cancel, events
│       │   ├── visits/          # Staff service logs, bill drafts
│       │   ├── billing/         # Invoices, offline manual payments, adjustments
│       │   ├── attendance/      # Check-in/out, roster, audit corrections
│       │   ├── payroll/         # Salary periods, advance grants, recoveries
│       │   ├── inventory/       # Stock catalog, movements, low-stock alerts
│       │   ├── expenses/        # Operating expenses ledger
│       │   ├── content/         # Site CMS, offers, announcements, media
│       │   ├── notifications/   # In-app notification center, outbox
│       │   ├── audit/           # Append-only administrative mutation logs
│       │   └── prisma/          # Prisma database client & repository
│       └── package.json
├── packages/
│   ├── types/                   # Shared TypeScript models, DTOs, Zod schemas, enums
│   │   ├── src/
│   │   └── package.json
│   ├── ui/                      # Shared design tokens & UI primitives
│   │   ├── src/
│   │   └── package.json
│   └── config/                  # Shared ESLint, Prettier, TypeScript configurations
├── database/
│   ├── prisma/
│   │   ├── schema.prisma        # Complete relational schema (PostgreSQL target)
│   │   ├── seed.ts              # Seed script (Clearly labeled SAMPLE data)
│   │   └── migrations/          # Version-controlled SQL migrations & constraints
│   └── schema.sqlite.prisma     # Optional lightweight local dev schema fallback
└── docs/
    ├── implementation-plan.md   # This document
    ├── data-model.md            # Entity descriptions and Mermaid ERD
    ├── open-decisions.md        # Owner decision register and defaults
    └── progress.md              # Phase tracking and verification log
```

---

## 2. Technology Stack & Rationale

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js (App Router) + React 18/19 + TypeScript | High SEO performance for public discovery, fast client transitions for dashboards, server-side data fetching. |
| **Styling** | Tailwind CSS + Lucide Icons + Radix Primitives | Bespoke luxury aesthetic (ivory, near-black, muted rose, warm gold), WCAG 2.2 AA accessibility, zero runtime CSS overhead. |
| **Backend API** | NestJS / Express + TypeScript | Strict modular boundaries, dependency injection, declarative validation (class-validator/Zod), OpenAPI documentation. |
| **Database** | PostgreSQL 16 (via Docker/Native) + Prisma ORM | Relational integrity, ACID transactions, range overlap checks for scheduling, strongly typed queries. |
| **Local Fallback DB** | SQLite / PGlite via Prisma | Enables immediate zero-dependency local runs on Windows machines without requiring Docker daemon. |
| **Caching / Queues**| Redis 7 + BullMQ (Docker) / In-memory queue fallback | Background notification dispatch, appointment reminders, cleanup of expired holds. |
| **Auth & Security** | HTTP-only Secure Cookies + Session Tokens + Argon2id / bcrypt | Prevents XSS token exfiltration, CSRF protection, strict role-based access control (RBAC). |
| **Testing** | Vitest / Jest + Supertest + Playwright | Unit testing for business algorithms, integration testing for API endpoints, concurrent booking race tests. |

---

## 3. Core Architectural Principles & Invariants

1. **No Fake Bookings or Placeholder Dashboards:** All appointment, employee, customer, and billing actions mutate persisted database tables.
2. **Scheduling Concurrency & Zero Double Booking:**
   - Staff capacity and resource availability are strictly evaluated on the server side inside database transactions.
   - Active appointment ranges (`[start_time, end_time)`) for any allocated employee or physical resource must never overlap.
   - Postgres exclusion constraints or serialized advisory locks ensure that concurrent requests for the same slot result in exactly one winner (`201 Created`) and one conflict response (`409 Conflict`).
3. **Financial Precision:**
   - All monetary values are represented as integer paise (1 INR = 100 paise) or fixed-scale Decimals to prevent floating-point calculation errors.
   - Offline payment recording only: recording cash, UPI transaction reference, or counter card swipe. No automated online card gateway in v1.
   - Issued invoices and payment records are immutable; adjustments are recorded as compensating ledger entries.
4. **Data Isolation & Privacy:**
   - Customers can only view their own appointments, invoices, and profile.
   - Employees can only view customer info for visits assigned to them, and cannot see other employees' pay, advances, or unrelated sales.
   - Public slot endpoint displays aggregate availability without exposing customer identity or private stylist schedules.
5. **No Fabricated Salon Information:**
   - Sample data is clearly tagged with `[SAMPLE]` or `[DEV]` badges.
   - Indicative 4.7/5 rating is displayed only with clear context that owner verification is pending.
   - Services with unverified prices use "Ask for price" and require a consultation request rather than an arbitrary numeric total.

---

## 4. Phase Breakdown & Execution Plan

### Phase 0: Workspace Setup, Tooling & Baseline Foundation
- Monorepo workspace configuration (`pnpm-workspace.yaml`, root `package.json`, TypeScript configurations).
- Docker Compose setup (`docker-compose.yml`) for PostgreSQL 16, Redis 7, API, and Web.
- Database layer: Prisma schema definition, migration scripts, and seed script with sample baseline data.
- API skeleton: NestJS / Express setup with health check (`GET /health`), CORS, global validation pipe, and error formatting.
- Web skeleton: Next.js App Router setup with luxury design tokens, Tailwind CSS, font configuration, and responsive public homepage.
- Baseline documentation and Windows PowerShell developer setup guide in `README.md`.

### Phase 1: Authentication, RBAC & Service Catalog
- Auth module: Registration, login, logout, password reset flow, session validation.
- User management and role assignment: `CUSTOMER`, `EMPLOYEE`, `OWNER_ADMIN`.
- Service taxonomy: Categories, services, duration, buffers, pricing, staff skill mappings.
- Public services browsing page with category filtering, service detail modal, and "Ask for price" support.
- Admin catalog management CRUD interface.

### Phase 2: Booking Engine & Customer Portal
- Working hours, staff shifts, breaks, holidays, and closure schedules.
- Authoritative server-side availability engine (`GET /api/v1/availability`).
- Atomic booking creation (`POST /api/v1/appointments`) with concurrency protection.
- Customer account dashboard: upcoming/past appointments, cancellation and reschedule workflows within cutoff policies.
- Appointment lifecycle state machine: `REQUESTED` → `CONFIRMED` → `CHECKED_IN` → `IN_SERVICE` → `COMPLETED` / `CANCELLED` / `NO_SHOW`.
- Append-only `appointment_events` audit trail.

### Phase 3: Employee Workspace & Attendance
- Mobile-first Employee Portal (`/employee`).
- My Daily Roster: today's schedule, assigned client details, service notes.
- Service execution workflow: Check-in, Start Service, Complete Service.
- Service line entry: Record actual services performed, quantities, add notes, and submit bill draft.
- Self attendance: Check-in / check-out with timestamps.
- Employee notifications center for new allocations and schedule changes.

### Phase 4: Core Owner Operations & Billing
- Owner Command Center (`/admin`): Daily KPI cards, multi-employee calendar grid, quick actions.
- Employee management: Add/edit staff, assign service skills, configure shifts, disable accounts.
- Customer CRM: Customer profiles, visit history, internal notes.
- Billing & Cash Register: Convert completed appointments or walk-ins to itemized invoices, record manual payments (Cash, UPI, Card), track balances, issue printable receipts.
- Administrative audit log viewer.

### Phase 5: Extended Operations (HR, Inventory, CMS, Reports)
- Salary & Advance Ledger: Monthly salary periods, advance requests, approved disbursement, installment deduction ledger.
- Attendance & Leave management: Owner approval of leave requests, attendance corrections.
- Inventory & Consumables: Stock tracking, vendor records, stock movements, low-stock warnings.
- Operating Expenses: Ledger for rent, utilities, salon supplies, miscellaneous.
- Offers & CMS: Promotional banners, discount codes, salon announcements, photo gallery management.
- Operational Reports: Sales by category/stylist, occupancy rates, cancellation analytics, CSV exports.

### Phase 6: Hardening, End-to-End Verification & Launch Readiness
- Automated concurrent booking test (race condition verification).
- Role-based authorization matrix integration tests.
- Full E2E customer booking, employee service entry, and owner billing journey test.
- Accessibility (WCAG 2.2 AA) and responsive mobile verification.
- Production build validation, deployment runbook, backup/restore procedures.

---

## 5. Risk Assessment & Mitigation

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| **Concurrent Double Booking** | High: Customer arrives for an occupied stylist. | Server-side transaction isolation (`SERIALIZABLE` or explicit exclusion locks) on `(employee_id, time_range)` and idempotency keys on booking mutations. |
| **Floating Point Discrepancies** | Medium: Accounting and balance rounding errors. | Store all monetary figures in integer paise (`price_paise`) and use precise integer arithmetic throughout backend and UI. |
| **Unauthorized Data Exposure** | High: Employee viewing salary of peers or customer seeing other bookings. | Enforce strict ownership verification in API query filters (`WHERE employee_id = req.user.employeeId`) at the data layer, never relying solely on UI masking. |
| **Unverified Salon Details** | Low: Inaccurate pricing or hours visible to public. | Clear administrative disclaimers, "Ask for price" default on unconfirmed items, and prominent owner settings panel for rapid updates. |
