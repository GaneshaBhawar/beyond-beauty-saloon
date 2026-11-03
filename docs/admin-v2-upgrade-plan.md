# Beyond Beauty Saloon — Admin Panel & Dashboard V2 Implementation Plan

**Project:** Beyond Beauty Saloon Management System  
**Module:** Admin Panel — Dashboard Redesign and Enhancement V2  
**Date:** 3 November 2026  
**Status:** In Progress (Phase A Completed, Phase B-E In Execution)

---

## 1. Baseline Architecture & Audit

### Monorepo Structure
- **Frontend (`apps/web`)**: Next.js 14.2 App Router, React 18, TypeScript, Tailwind CSS, Lucide icons.
- **Backend (`apps/api`)**: Express.js REST API on port 4000, Prisma ORM 5.14, SQLite database (`apps/api/prisma/dev.db`), bcryptjs, JWT authentication.
- **Shared Types (`packages/types`)**: Domain types & enums (`UserRole`, `AppointmentStatus`, etc.).

### Existing Admin Baseline
- `apps/web/src/app/admin/page.tsx`: Existing single-file tabbed admin view with staff onboarding, walk-in billing modal, receipt generator, inventory restocking, and theme preset manager.
- `apps/api/src/routes/admin.ts`: Express admin router protected by `authenticate` and `authorize('OWNER_ADMIN')`. Includes `/staff`, `/appointments`, `/stats`, `/inventory`.

### Deficiencies Addressed in V2:
1. **Layout & Shell**: Needs a modern desktop collapsible sidebar with logical groupings (Overview, Business, Team, Operations, Insights, System) and a smooth mobile navigation drawer.
2. **Top Header**: Needs live Asia/Kolkata date & business hours, active route breadcrumb, real-time search, actionable notification bell with counter, and user profile/logout.
3. **Dashboard V2 Sections**:
   - Greeting with Asia/Kolkata time awareness and owner name
   - Quick action bar (New Appointment, Create Bill, Add Customer, Mark Attendance, View Calendar)
   - 8 distinct business KPI cards with clear INR formatting and strict separation of Billed Sales vs Payment Collections
   - Today's appointment schedule with status badges, filters, and working action transitions
   - Interactive business performance sales chart (Daily / Weekly / Monthly views)
   - Monthly business summary with documented calculation methodology
   - Staff attendance panel (Present, Absent, On Leave, Not Yet Marked)
   - Popular services ranked ranking
   - Payment method breakdown (Cash, UPI, Card, Bank Transfer)
   - Real actionable alerts panel with one-click resolution

---

## 2. Phased Implementation Roadmap

- [x] **Phase A — Audit & Preparation**: Inspected codebase, Prisma schema, API routes, and database models.
- [ ] **Phase B — Backend API Extensions**:
  - Implement `GET /api/v1/admin/dashboard` with complete aggregated metrics, appointment lists, sales trends, attendance counts, payment splits, and alerts.
  - Implement `POST /api/v1/admin/attendance`, `POST /api/v1/admin/customers`, `PATCH /api/v1/admin/appointments/:id/status`.
- [ ] **Phase C — Frontend Admin Component Architecture**:
  - Create `apps/web/src/components/admin/AdminShell.tsx` (Sidebar, Header, Mobile Drawer).
  - Create reusable dashboard widgets: `DashboardKPIs.tsx`, `QuickActionBar.tsx`, `TodayAppointmentsTable.tsx`, `AppointmentDetailsDrawer.tsx`, `BusinessPerformanceChart.tsx`, `MonthlySummaryCard.tsx`, `StaffOverviewPanel.tsx`, `PopularServicesList.tsx`, `PaymentMethodsBreakdown.tsx`, `ActionableAlertsPanel.tsx`.
  - Create quick action modals: `NewAppointmentModal.tsx`, `AddCustomerModal.tsx`, `MarkAttendanceModal.tsx`, `WalkInBillModal.tsx`.
- [ ] **Phase D — Integration & Polish**:
  - Integrate into `apps/web/src/app/admin/page.tsx` with full support for all operational views (Appointments, Customers, Billing, Staff, Inventory, Settings).
  - Apply warm off-white and dusty rose design system tokens with Manrope typography.
- [ ] **Phase E — Automated Testing & Verification**:
  - Add backend test suite in `apps/api/test/admin-dashboard.test.ts`.
  - Verify TypeScript compilation and production builds.
  - Capture desktop and mobile preview screenshots.

