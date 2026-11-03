# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# Beyond Beauty Saloon — Customer Booking & Salon Operations Platform

**Document version:** 1.0  
**Date:** 27 October 2026  
**Product:** Beyond Beauty Saloon  
**Working project slug:** `beyond-beauty-saloon`  
**Status:** Approved planning baseline; business policies requiring owner confirmation are explicitly marked TBD.  
**Target:** Professional production-ready responsive web application (no online payment gateway in v1).

---

## 1. Executive Summary

Build a full-stack, database-backed web application for Beyond Beauty Saloon, serving three primary roles:
1. **Customer:** browse salon details/services/offers, view real appointment availability, book and manage appointments, and see their own history.
2. **Employee:** securely view assigned appointments, availability, attendance, daily service/client records, billing drafts, notifications, and permitted performance information.
3. **Owner/Admin:** comprehensively operate the salon: bookings, staff, attendance, leave, advances, salary records, services, pricing, customer CRM, bills/payments recorded offline, inventory, marketing content, offers, notifications, expenses, analytics, and audit history.

**Critical product principle:** This is not a static marketing site, a fake booking demo, or a collection of disconnected dashboards. Each role must operate on the **same persisted data** with server-side permissions, auditable workflows, and accurate scheduling logic.

**v1 excludes:** online payment gateway/online payment collection, customer card storage, a mobile native app, complex multi-branch operation, and full statutory payroll/tax automation. v1 **includes** recording cash/UPI/card-at-counter payment details manually against bills, if enabled by owner.

---

## 2. Business Identity & Known Information

- **Business name:** Beyond Beauty Saloon (retain this spelling until owner explicitly changes it).
- **Address:** Shrikrishna Nagar / Savedi, near Kohinoor Mangal Karyalaya, Ahilyanagar, Maharashtra 414003, India.
- **Primary contact:** +91 98235 73781.
- **Alternate bookings contact:** +91 97307 68487.
- **Instagram:** https://www.instagram.com/beyond__beauty_saloon/
- **External public reviews:** approximately 4.7/5 was provided as an indicative rating; **do not present as a live verified score or fabricate ratings/review counts**. Owner may opt to show a sourced, explicitly dated rating after verification.
- **External catalog reference:** https://www.justdial.com/Ahmednagar/Beyond-Beauty-Salons-Near-Mangal-Karalya-Savedi/9999PX241-X241-130928002458-G5I2_BZDET/service-catalog
- **Business positioning:** premium, approachable salon for hair, skincare, grooming, bridal/party makeup, threading and beauty treatments.
- **Timezone:** `Asia/Kolkata`; customer-facing dates/times local; persist instants in UTC.
- **Currency:** INR (₹); all monetary data stored with decimal precision or integer paise, never floats.
- **Languages:** English at launch; architecture ready for Marathi later (avoid hardcoding copy deep in components).

**Important:** The owner must verify official business hours, gender/service audience, real catalog, each service's price and duration, employee list, and brand photos. Never manufacture actual pricing, employee details, testimonials, or service availability. Seed only clearly labeled sample/demo data until verified.

### 2.1 Initial Service Taxonomy

All items are admin-editable; exact services, descriptions, prices, durations, eligible staff, buffers, and publish status live in the database.

| Category | Initial example services / subcategories |
|---|---|
| Hair Styling | Hair styling, blow-dry, curling, special-occasion styling, layered haircut |
| Hair Care | Haircut, hair coloring, hair spa, hair treatments, transformation consultation |
| Skin Care | Facial, rejuvenation treatment, cleanup, skin-care consultation |
| Makeup & Grooming | Bridal makeup, party makeup, general grooming, hair removal |
| Threading | Full-face threading, eyebrow threading, upper-lip threading; any further options owner-configured |
| Packages | Bridal packages, occasion packages, multi-service bundles (configured by admin) |

For services with unknown prices use **“Ask for price”** and optionally a **consultation/request** workflow; do not pretend such a service has a numeric checkout total. Prices and estimated durations are never scraped or inferred from Justdial.

---

## 3. Goals, Success Criteria & Scope

### 3.1 Goals

- Make it easy to find, reserve, reschedule or cancel valid salon time slots.
- Prevent double booking of employees and applicable salon resources.
- Give employees a reliable mobile-first daily workspace.
- Give owner one authoritative view of business operations and staff status.
- Enable service-level billing, manual payment recording, and revenue tracking without an online gateway.
- Build secure, deployable, maintainable software with tests, migrations, observability and backups.

### 3.2 Example measurable KPIs (targets to validate after launch)

- Zero confirmed overlapping bookings for the same resource under concurrent booking tests.
- 100% of completed appointments linked to employee activity and eligible billing data, or explicitly marked unbilled with reason.
- Customer booking achievable in approximately 3–5 meaningful steps.
- Owner sees today’s bookings, employee availability, revenue, and pending actions without changing pages.
- Booking and admin core flows pass automated end-to-end tests in CI.
- Meet WCAG 2.2 AA-oriented accessibility checks; mobile and desktop responsive.

### 3.3 Prioritization

- **P0:** Must work for first production launch: authentication/roles, service catalog, calendar and robust booking engine, employee availability, employee workspace, basic attendance, customer profile/history, admin operations, notifications inside app, service entry, billing, operational audit and dashboard.
- **P1:** Enhanced operations: salary/advance ledger, leave approval, inventory, expenses, coupons/offers, reporting/exports, cancellation/no-show rules, notifications through consented external providers.
- **P2:** Later: loyalty, referrals, gift cards, waitlist, memberships, multi-branch, WhatsApp automation, POS hardware, detailed commissions, advanced analytics.

Implementation must progress in vertical slices: foundation → scheduling → employee operations → billing/admin → business expansion. Do not generate a large superficial UI where buttons are placeholders.

---

## 4. User Roles & Authorization

| Capability | Guest | Customer | Employee | Owner/Admin |
|---|---:|---:|---:|---:|
| Public pages & published offers | Yes | Yes | Yes | Yes |
| View safe aggregate free/booked slots | Yes | Yes | Only own/allowed roster | Yes |
| Book appointment | Via sign-in/guest policy TBD | Yes | On behalf if permitted | Yes |
| View own appointment details | No | Yes | Own assigned | All |
| View other employees' private info | No | No | No | Yes |
| Record own completed services | No | No | Yes | Yes |
| Mark/check in attendance | No | No | Self (policy-based) | Yes |
| Read own payslip/payroll history | No | No | Yes if published | Yes |
| Manage service catalog/prices | No | No | No | Yes |
| Create/disable employee accounts | No | No | No | Yes |
| Post offers/announcements | No | No | No | Yes |
| Manage advances/salary/bills/financial exports | No | No | No | Yes |

**Security rules:** Permissions enforced on the API and database-query level, never by merely hiding navigation. Employee IDs and appointment IDs must be checked for ownership. Payroll, phone numbers, financial information and customer notes are privacy-sensitive. The owner can optionally create a limited manager role later; no employee receives automatic owner capabilities.

---

## 5. Customer-Facing Website & Portal (Detailed)

### 5.1 Public Marketing Website

- Elegant brand-led homepage with hero, clear **Book Appointment** CTA, service categories, gallery, team section (only with permission), verified business info, contact, FAQ, policies and social links.
- Services page with searchable/filterable categories, prices **where verified**, durations, and consultation/ask-price labels where unknown.
- Service detail page: benefits, estimated duration, preparation notes, contraindications/care notes if approved, price/disclaimer, and eligible booking options.
- Gallery with owner-uploaded authorized images, alt text and optimized formats.
- Published offers and announcements with validity dates and terms.
- Contact page: phone click-to-call, Instagram, directions link, opening hours once configured, contact inquiry form with spam protection.
- SEO: metadata, canonical links, sitemap, local business structured data after business details verification, optimized rendering and accessible semantic content.

### 5.2 Customer Account

- Account registration/login by email and password for v1 (password reset, verified email); optional phone OTP after configuring an actual provider.
- Profile: name, mobile number, email, optional preferences/consents, account privacy actions.
- My Appointments: upcoming, completed, canceled, no-show; status and policy-aware reschedule/cancel.
- Notifications center and notification preferences; no unapproved promotional messages.
- Visit history: services taken, sanitized invoice/receipt and summary (never other customers' data).
- Customer feedback form (private feedback initially); testimonials become public only after consent and moderation.

### 5.3 Booking Experience

1. Customer selects one or multiple services, each with admin-defined duration, eligibility, buffer and confirmed price or `Ask for price` handling.
2. Customer selects a date and optionally an eligible staff member; **Any Available Professional** matches all qualified staff.
3. API computes free start times from staff shifts, exceptions, time off, existing reservations, break/cleaning buffers, branch hours and required resources.
4. Calendar UI shows **Available**, **Limited availability**, and **Unavailable** without identifying other customers, disclosing employee personal details or exposing exact private bookings. Public employee names may appear only if owner has authorized display.
5. Customer selects available time, signs in if needed, reviews service(s), expected duration, pricing/estimate, terms and booking.
6. Server atomically validates availability, creates booking, and returns reference number and confirmation; notification recorded.
7. Customer sees status and can cancel/reschedule within business rules; staff/admin calendars update.

**Customer-visible employee busyness:** Show named employee's **available/unavailable** state only for public-facing/bookable staff; do not reveal whom they serve, customer bill, personal leave reason or detailed private schedule.

### 5.4 Booking States

`REQUESTED` (optional admin approval policy) → `CONFIRMED` → `CHECKED_IN` → `IN_SERVICE` → `COMPLETED`; alternatives `CANCELLED_BY_CUSTOMER`, `CANCELLED_BY_STAFF`, `NO_SHOW`, and `REJECTED` for requests. Changes logged with actor/time/reason. Do not equate unbilled with completed/paid.

### 5.5 Edge Cases

- Service without fixed price or duration: admin-configured **consultation request**; do not allow a bookable time slot without known required duration.
- Multiple services: calculate feasible staff allocation, sequencing and total duration; v1 can require a single eligible employee for entire booking if transparently indicated.
- Different employee requirements: schedule service segments or present separate bookings, not silently overbook.
- Employee sudden absence: owner receives conflict alerts and must reassign/reschedule with customer notice.
- Customer double-click/retries: idempotency key on booking mutation.
- Race: two users choose last slot simultaneously; DB ensures at most one succeeds, loser gets updated availability.
- Recurring hours, exceptions, blocked slots, breaks, leave and holidays honored server-side.
- Admin can create walk-ins, override with reason where safe, assign/reassign service staff and manually block slots.
- Cancellation cutoff, same-day booking lead time, horizon, slot increments and buffers are configurable policies; defaults are placeholders awaiting owner approval.
- Date/time formatting handles locale, daylight rules via timezone library (business timezone India), and server clock sync.

---

## 6. Employee Portal (Detailed)

### 6.1 Staff Home

- Today's roster and appointments, customer name/contact **only for assigned visits**, service, timing, status and special notes where necessary/consented.
- Day/week calendar, blocked time, time off, assigned customer queue and conflict alerts.
- Notifications for newly allocated appointment, changes, cancellations, check-in, and approved admin announcements.
- Staff profile with role, enabled services, shift info, permitted attendance and payroll view.

### 6.2 Appointment Operations

- Employee can acknowledge or view assignment; policy-controlled check-in, start service, mark completion, no-show and note exceptions.
- Capture actual start/end timestamps when useful; handle late arrivals and partial services.
- Employee cannot change their own pricing/discounts beyond configurable permission; manager approval required for overrides.

### 6.3 Client/Service & Bill Entry

Employee may record each serviced client with:
- customer (existing or walk-in), services performed, service quantities, assigned staff, actual completion time;
- admin-defined unit prices, permitted discounts, optional notes and final calculated amounts;
- bill draft submission for review/finalization (admin controls final price adjustments, void/refund/settlement);
- service records linked to appointment when booked and to a walk-in visit when not.

No employee can modify finalized financial transactions or erase completed service history. Corrections are reversals/adjustments with audit trail. Do not permit employees to browse all customers or unrelated sales.

### 6.4 Attendance / Leave

- Self check-in/out with timestamps and status; owner can manually correct with documented reason.
- Owner-configured roster: present, absent, leave, half-day, late, holiday and off-day.
- Leave request, balance (if policy defined), status and approval notification.
- Attendance changes must never silently rewrite historic payroll.
- V1 self check-in/out is not proof of geolocation; geofencing/biometric verification excluded unless implemented with privacy consent.

### 6.5 Employee Compensation View

If owner enables it, show employee's own salary periods, gross amount, deductions/advance recoveries, net amount, disbursement status and payslip. Never expose colleagues' salary or advances. Payment information shown only after owner explicitly publishes a finalized period.

---

## 7. Owner/Admin Dashboard (Primary Product Priority)

### 7.1 Command Center

- KPI cards: today’s appointments, upcoming/active, completed, canceled/no-show, estimated vs billed revenue, cash/UPI/card-at-counter received, outstanding bills, on-duty/off-duty employees and next booking.
- Calendar with employee columns, status coding, drag-reschedule **only after API revalidation**, manual blocks, appointments and walk-ins.
- Action inbox: unassigned appointments, missing service prices, staff absence conflicts, unbilled services, payment due, leave requests, low stock, pending salary/advance approvals.
- Trend summaries: booking conversion, repeat visits, revenue by day/category/employee, service popularity, occupancy and cancellation rate; clearly label date range/timezone and whether metrics are paid/billed/estimated.
- Filters, search, quick actions, CSV export and drilldowns.

### 7.2 Employee Management

- Invite/onboard employee; capture name, staff code, allowed contact, employment start date, employment status, role, skill/service eligibility, working hours, day off, breaks, booking capacity and admin-authorized public visibility.
- Disable employee login rather than hard-deleting history. Offboard/reassign future bookings with safe owner workflow.
- Daily attendance with present/absent/on leave/late; leave approvals, manual corrections and audit.
- Staff performance: number of clients served, services, billed revenue attributed, appointment utilization and optional commissions (policy TBD).
- Employee shift calendar, exceptions, holidays, staffing coverage, conflicts.

### 7.3 Salary, Advance & Payroll Ledger

- Employee compensation settings (monthly fixed salary or defined commission policy; data configurable).
- Salary periods, attendance-based adjustments **only according to confirmed written salon rules**, overtime if applicable, discretionary adjustments, advances granted, advance recoveries, gross/deductions/net, payment method and paid-on date.
- Advance workflow: request (optional) → approved/rejected → disbursed → installment recoveries; ledger must prevent double deduction and track outstanding balance.
- Payroll states: DRAFT → REVIEWED → APPROVED → MARKED_PAID; immutable snapshots of finalized periods and correction records.
- Audit actor/reason for salary edits, advance approvals, edits and marking paid.
- Optional PDF payslip/CSV export in later slice.
- **Do not claim statutory compliance:** owner/accountant must validate applicable wage, tax, provident fund/ESI and record retention policies before real payroll usage. No bank transfers automatically made by application.

### 7.4 Catalog, Offers & CMS

- CRUD for categories, services, rich descriptions, pricing, duration, booking availability, staff eligibility, prep/aftercare, public visibility, featured services.
- Manage website copy, business contacts/hours, gallery, team profiles, FAQs, policies, banners and announcement posts.
- Offers: percentage/fixed discount, published start/end dates, optional promo code, service eligibility, usage limits and safe calculation rules.
- Editorial workflow: DRAFT/SCHEDULED/PUBLISHED/ARCHIVED; immediate or time-bound publication; preview before publish.
- Upload security: image format/size validation, authenticated authorization, safe storage, no arbitrary script uploads.

### 7.5 Customer CRM

- Customer search and visit timeline, appointments, service preferences with consent, feedback, complaints, follow-up tags, booking source, no-show history and consent flags.
- Merge duplicates only through owner-reviewed process and preserve all financial records.
- Export customer-specific data and support privacy deletion/anonymization where legally and operationally appropriate.
- Internal customer notes require access controls; avoid unnecessary sensitive notes (e.g. diagnoses).

### 7.6 Billing, Cash Register & Expenses

- Create an itemized bill from completed booking or walk-in: item price, quantity, authorized discount, tax rate/configuration (if applicable), total, paid amount and balance.
- Bill states: DRAFT → ISSUED → PARTIALLY_PAID/PAID/VOID (with controlled corrections).
- Manual payment recording: cash, UPI, card at counter, bank transfer; store transaction reference if provided, timestamp, recorder and amount. **No actual processing of funds**.
- Receipts with business info; tax details only after owner verifies GST/registration and accountant approves required fields.
- Refund/adjustment ledger when needed; never delete a payment entry.
- Expense categories: rent, utilities, consumables, salary, miscellaneous; receipts and periods.
- Cash-day closing/reconciliation (P1); distinguish gross billed sales, net sales, money collected and profit estimates.

### 7.7 Inventory (P1)

- Products/consumables with SKU, units, current quantity, minimum stock, vendor, purchase cost and expiry where relevant.
- Stock movements: purchases, adjustments, usage, waste and returns; movement log, actor and timestamp.
- Low-stock alerts; optional service recipes/consumable deduction later.
- Avoid estimating stock levels from bookings unless service-to-consumable rules are configured.

### 7.8 Reports (P1)

- Booking report, cancellations/no-shows, employee workload, attendance, salary/advance register, sales by service/category/employee, payment mode, outstanding invoices, expenses, net margin estimates, inventory and offers performance.
- Date filters, snapshots, transparent definitions, timezone, CSV downloads and role protections.
- No misleading attribution: employee sales credited only for employee-linked service lines; split attribution policy TBD.

---

## 8. Notifications & Messaging

**In-app notifications (P0):** persist notification record for recipient, type, related entity, created/read timestamps; show real-time updates via SSE or WebSockets where useful, with polling fallback.

Triggers: booking created/confirmed/canceled/rescheduled, employee assigned/reassigned, shift conflict, customer reminder, leave decision, announcement, salary published, low stock.

**External notifications (P1):** transactional email through provider; SMS/WhatsApp only with approved provider credentials, template approval and legally compliant opt-in. Keep a notification outbox and worker/retry policy, deduplicate jobs, record failed delivery; booking correctness must not depend on provider success.

Privacy: customers never receive internal employee finance data; employees only receive relevant booking data; promotional alerts require express opt-in/unsubscribe.

---

## 9. Booking Engine: Scheduling Invariants & Data Integrity

**Hard requirements:**

1. Availability is always computed on the server from authoritative records; never trust frontend-reported free slots.
2. Each bookable service has `duration_minutes`, optional buffers and allowed employees/resources.
3. Staff shifts, breaks, approved leave, absences, one-off closures, blocked times and preexisting bookings all reduce availability.
4. There is no overlap among active held/confirmed/in-service time ranges for any single required employee/resource; canceled and expired holds free capacity.
5. Booking and rescheduling must execute inside a DB transaction with race protection: Postgres exclusion constraints for employee/resource time ranges **or** equivalent verified locking/serialization approach. Tests must prove only one winner for a concurrent last slot.
6. Every appointment mutation is idempotent where retries possible; employ unique request key or operation token.
7. If a resource/employee changes, revalidate all affected sessions before commit.
8. Customer UI exposes only safe availability, not private reservation details.
9. Temporary holds (optional) have firm expiry and cleanup; do not reserve indefinitely.
10. All changes create `appointment_events` with actor, old/new status, reason and timestamp.
11. Configurable policies: business hours, break schedule, minimum notice, booking horizon, lead time, max reschedules, cancellation cutoff, no-show rules, buffer, slot grid, holiday closures, staff working hours.
12. For multi-service bookings v1 may require same staff to execute all services sequentially; document this constraint and use consistent availability and duration math.

**Example concurrency acceptance case:** Two separate customer sessions both see the same last 4:00 PM slot for Staff A. Customer 1 confirms; Customer 2 receives `409 SLOT_UNAVAILABLE` and refreshed slot suggestions; system retains exactly one active allocation.

---

## 10. Technical Architecture (Recommended)

**Principle:** Choose one coherent production-capable stack, typed contracts, migration tooling and explicit deployment path. Avoid mixing Flask, Django, Firebase and unrelated services for the same core purpose.

| Layer | Selected technology | Rationale |
|---|---|---|
| Frontend | Next.js (App Router) + React + TypeScript | Responsive SEO-capable public site + rich dashboards |
| UI | Tailwind CSS + shadcn/ui + accessible component primitives | Consistent elegant design and reusable form/calendar components |
| Backend | NestJS + TypeScript REST API (OpenAPI) | Modular RBAC, validation, background jobs and domain separation |
| Database | PostgreSQL | ACID integrity, relational data and booking collision controls |
| ORM & migrations | Prisma plus SQL migrations for exclusion/index constraints | Typed access; robust raw SQL where ORM unsupported |
| Background jobs | Redis + BullMQ | Async notifications/reminders/outbox processing |
| Authentication | Secure server-side session or standards-based token flow with HTTP-only cookies; implement in API | Role-controlled access with rotation, CSRF considerations, rate limiting |
| Live updates | SSE or WebSockets with authenticated channels | Assignment updates, booking availability refresh, admin action inbox |
| File storage | S3-compatible object storage | Gallery, attachments, receipts (private/public buckets as appropriate) |
| Testing | Vitest/Jest, API integration tests, Playwright E2E | Coverage for business-critical behavior |
| Local environment | Docker Compose: Postgres, Redis, API, web | Repeatable Windows developer setup |
| CI/CD | GitHub Actions | Lint, type checks, tests, migrations check, security scanning/build |
| Observability | Structured application logs, error monitoring, health endpoints | Production diagnosability |

**Alternative:** If the project explicitly requires Python backend later, FastAPI + SQLAlchemy/Alembic could be substituted **before coding starts**, not mixed in midway. For this PRD, proceed with the selected TypeScript stack.

### 10.1 Recommended Modular Monorepo

```text
beyond-beauty-saloon/
├── PRD.md
├── AGENTS.md
├── README.md
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── apps/
│   ├── web/                  # Next.js website + customer/staff/admin interfaces
│   └── api/                  # NestJS REST API, auth, domain logic
├── packages/
│   ├── ui/                   # shared UI components and brand tokens
│   ├── types/                # shared contracts / validated schemas
│   └── config/               # shared tsconfig, lint/build configs
├── database/
│   ├── prisma/               # schema, seed scripts
│   └── migrations/           # DB migrations and scheduling constraints
├── docs/                     # architecture, API, runbook, decisions
└── .github/workflows/        # CI workflows
```

### 10.2 Proposed Domain Modules

`auth`, `users`, `roles`, `customers`, `employees`, `services`, `staff-skills`, `shifts`, `time-off`, `resources`, `availability`, `appointments`, `appointment-events`, `visits`, `service-lines`, `invoices`, `payments`, `attendance`, `leave`, `payroll`, `salary-advances`, `inventory`, `expenses`, `offers`, `content`, `notifications`, `audit`, `analytics`, `settings`.

### 10.3 Data Model (Minimum Tables/Entities)

- `users` (id, login identity, password hash, role, status, verified timestamps)
- `customer_profiles`, `employee_profiles`, `employee_service_skills`
- `services`, `service_categories`, `service_prices` (history where required), `service_resources`
- `business_settings`, `operating_hours`, `closures`, `staff_shifts`, `shift_exceptions`, `time_off`, `appointment_resources`
- `appointments`, `appointment_services`, `appointment_allocations`, `appointment_events`, `idempotency_keys`
- `visits`, `visit_service_lines`, `invoices`, `invoice_lines`, `payments`, `adjustments`
- `attendance_records`, `leave_requests`, `salary_periods`, `payroll_lines`, `salary_advances`, `advance_recoveries`
- `inventory_items`, `stock_movements`, `vendors`, `expenses`
- `offers`, `promo_redemptions`, `announcements`, `media_assets`, `site_content`
- `notifications`, `notification_preferences`, `notification_outbox`
- `audit_logs`, `consent_records`, `application_settings`

For every business record include appropriate keys, timestamps, status, unique indexes, foreign keys and deleted/archive semantics. Sensitive fields require role protections and safe logging. Do not build financial reports using unverified sample data.

### 10.4 Representative REST API (versioned)

```text
GET    /api/v1/public/services
GET    /api/v1/public/business
GET    /api/v1/availability?serviceIds=...&date=...&staffId=...
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
GET    /api/v1/me
POST   /api/v1/appointments                   # atomic booking
GET    /api/v1/me/appointments
PATCH  /api/v1/appointments/:id/reschedule
POST   /api/v1/appointments/:id/cancel
GET    /api/v1/employee/appointments
POST   /api/v1/employee/visits/:id/service-lines
POST   /api/v1/employee/attendance/check-in
POST   /api/v1/employee/attendance/check-out
GET    /api/v1/admin/dashboard
GET    /api/v1/admin/appointments
POST   /api/v1/admin/appointments
CRUD   /api/v1/admin/employees/*
CRUD   /api/v1/admin/services/*
CRUD   /api/v1/admin/attendance/*
CRUD   /api/v1/admin/payroll/*
CRUD   /api/v1/admin/advances/*
CRUD   /api/v1/admin/invoices/*
CRUD   /api/v1/admin/offers/*
CRUD   /api/v1/admin/content/*
GET    /api/v1/admin/reports/*
GET    /api/v1/notifications
PATCH  /api/v1/notifications/:id/read
```

`CRUD` is shorthand for properly documented explicit REST routes, not a literal HTTP method. Publish an OpenAPI specification with schema validation and errors.

---

## 11. UI/UX Design System

**Direction:** Refined contemporary beauty brand, professional SaaS clarity for internal dashboards. Avoid gaudy gradients, template-looking landing pages, excessive animation, unreadable pale text or decorative fake statistics.

- **Brand mood:** luxury, calm, welcoming, polished, feminine-neutral where appropriate.
- **Proposed palette (to be approved):** ivory `#FAF7F2`, near-black `#241F23`, muted rose `#B78693`, warm gold `#B79A62`, soft gray `#ECE7E4`. Maintain contrast compliance; gold as accent rather than pale body text.
- **Type:** elegant display serif for brand headings (e.g. Playfair Display), legible sans (e.g. Inter) for body/forms/dashboards.
- **Layout:** mobile-first; clear sticky booking CTA; responsive navigation; compact operational tables, calendar toggles, filters and empty/loading/error states.
- **Components:** accessible buttons, cards, labels, searchable selects, dialogs, datetime selection, rich calendar, toast, data table, pagination, skeleton loading, badges, confirmation prompts.
- **Photo standards:** only licensed or salon-owned imagery; show realistic salon content, do not use fake before/after results or invented customer images.
- **A11y:** labels, keyboard navigation, logical focus, screen-reader status, color contrast and reduced-motion preferences.
- **Role-aware navigation:** `Home / Services / Offers / Gallery / Contact / Book` public; `My Appointments / Account` customer; `My Schedule / Visits / Attendance / Notifications` employee; `Dashboard / Calendar / Customers / Employees / Attendance / Payroll / Billing / Inventory / Marketing / Reports / Settings` admin.

### 11.1 Route Map

```text
/  /services  /services/[slug]  /offers  /gallery  /about  /contact
/book  /login  /register  /forgot-password
/account  /account/appointments  /account/appointments/[id]  /account/profile
/employee  /employee/calendar  /employee/clients  /employee/attendance  /employee/notifications
/admin  /admin/calendar  /admin/appointments  /admin/customers
/admin/employees  /admin/employees/[id]  /admin/attendance  /admin/leave
/admin/payroll  /admin/advances  /admin/services  /admin/billing
/admin/inventory  /admin/expenses  /admin/offers  /admin/content
/admin/reports  /admin/settings  /admin/audit
```

---

## 12. Non-Functional Requirements

### 12.1 Security & Privacy

- Hash passwords with Argon2id or well-configured bcrypt; never store plaintext credentials.
- HTTP-only, Secure and SameSite-aware cookies; CSRF protections where session-cookie auth applies, explicit CORS allowlist, rate limiting, account lockout/backoff, safe reset tokens.
- Server validation of all untrusted input and file uploads, ORM parameterization, output encoding, content-security policy and OWASP-aligned controls.
- Every admin financial/HR mutation logged in append-only audit records (user, action, timestamp, target and safe diffs).
- Mask PII and credentials in logs; secrets only in environment/secret manager, never repository.
- Access control on all endpoints; employee can see only assigned appointments, customer only own data, public sees only curated display content.
- Consent for notifications/marketing, data retention policy, data subject requests, privacy notice, backup access and least privilege.
- Owner and employee sensitive access ideally protected by MFA (P1) and session revocation after account disabling.
- Database backups encrypted, documented restore process and tested recovery.
- Consider India Digital Personal Data Protection Act and applicable rules with qualified legal review before launch; do not make unsupported claims of compliance.

### 12.2 Reliability/Performance

- Production HTTPS, health checks, safe migrations and graceful deploys.
- Target p95 API latency < 500 ms under ordinary loads (exclude slow third-party deliveries; verify with realistic load tests).
- Indexed calendar/availability queries; use pagination/search indexes for customer and invoice lists.
- Database transactions cover appointment mutations, stock ledger changes, invoice finalization and advance recovery.
- Background retry queues and dead-letter or failure review for outbound notifications.
- Server side pagination, caching only where invalidation strategy does not cause stale booking decisions.
- Frontend handles empty, slow, disconnected, expired session, conflict and partial-failure states.
- Document restore test, backup frequency/retention and recovery objectives with owner hosting budget.

### 12.3 Operational Quality

- Strict TypeScript, lint/formatter, schema validation, tests and clear modular boundaries.
- Accessible responsive design at mobile/tablet/laptop widths.
- `README.md` with prerequisites, local setup commands for **Windows PowerShell**, seed/test credentials clearly marked **dev only**, migrations and deployment instructions.
- `.env.example` contains variable names and nonsecret examples; `.env` always gitignored.
- No hardcoded production records, fake metrics, mock-only forms or nonfunctional click handlers in shipped flows.

---

## 13. Delivery Phases & Exit Criteria

### Phase 0 — Discovery & Setup

Deliver: owner question list/TBD register, architecture, ER diagram, design tokens, repo and Docker dev setup, clean baseline CI and README. Verify sample app boots end-to-end locally.

### Phase 1 — Foundation & Design System

Deliver: authentication, roles, admin bootstrap by safe seed/env, protected routes, common layout, design components, public pages, editable content and service catalog.

**Done when:** logged-out/role-denied routes genuinely reject access; catalog persisted and admin edits visible publicly.

### Phase 2 — Booking Engine & Customer Portal (P0)

Deliver: shifts, closures, skills, availability API, booking transaction and calendar, self-service cancel/reschedule, customer appointment center and appointment events.

**Done when:** concurrency tests prove no overlapping employee/resource booking; a booking persists across restart and appears in correct staff/admin views.

### Phase 3 — Employee Workspace (P0)

Deliver: employee calendar, assignment notifications, attendance, check-in/status actions, serviced-client records, visit and bill drafts.

**Done when:** employee can record completed service for assigned visit while unauthorized staff cannot access it.

### Phase 4 — Core Owner Operations (P0)

Deliver: dashboard, admin calendar, employee CRUD/disable, skill roster, customer management, invoice/payment recording, safe discount and correction handling, admin CMS/announcement posts and audit log.

**Done when:** owner can run a sample salon day from bookings through billed visit and review meaningful totals.

### Phase 5 — Extended Owner Operations (P1)

Deliver: salary periods/advances, leave, inventory, expenses, promotions, exports, richer reports and approved external reminders.

**Done when:** owner can reconcile a sample salary period and advance recovery without duplication; stock and financial ledger tests pass.

### Phase 6 — Release Hardening

Deliver: Playwright role journeys, accessibility review, security testing, load test for booking races, backup/restore drill, privacy content, production setup, domain/SSL, logging and release checklist.

**Done when:** staging run-through and owner UAT are signed off, secrets configured, real pricing/hours entered, no production demo accounts or fake customer data, restore and rollback documented.

**Implementation rule:** Complete/test one phase before starting the next. Never describe an unfinished phase as implemented.

---

## 14. Test Plan & Required Acceptance Scenarios

1. Public visitor sees brand/contact/real or explicitly unpriced services; can discover booking path.
2. Customer can register/login, book a valid slot, see confirmation and persistent appointment.
3. Customer cannot view another customer's appointment or payment details.
4. Employee sees only their assigned visits; booking assignment appears in notification center.
5. Public sees safe free/busy calendar; other customers' identities are never revealed.
6. Two simultaneous attempts for last employee slot result in **one** confirmation; no overlap.
7. Booking unavailable during leave, breaks, holiday closure, blocked hours or resource collision.
8. Customer cancellation releases the slot according to policy and records audit event.
9. Admin reschedule/reassignment enforces new staff availability and notifies affected parties.
10. Employee records services and bill draft; owner can issue invoice; totals use accurate decimal arithmetic.
11. Manual payment entry increases paid amount, updates due balance and prohibits overpayment unless explicit credit policy.
12. Employee cannot edit final bills, salaries, advances, service prices or announcement posts.
13. Attendance check-in/out and owner correction are auditable; prior payroll is not silently changed.
14. Payroll advance recoveries cannot exceed recorded outstanding balance or be deducted twice.
15. Disabled employee cannot log in; historical employee appointments, invoices and salary records remain intact.
16. Owner changes a service price with future effect; historical issued invoices do not change.
17. Non-admin cannot access `/admin` routes or bypass through direct API calls.
18. Upload rejects unsafe types; images display correctly and no secret media is public.
19. App survives refresh/restart without lost bookings or locally mocked state.
20. Production build/lint/typecheck/unit/integration/E2E pipeline passes on clean install.

---

## 15. Owner Decision Register / Unconfirmed Details

These are **open business decisions, not blockers for architecture and initial implementation**. Build secure, editable settings and defaults marked as demo/TBD until owner confirms.

| Question | Temporary implementation strategy |
|---|---|
| Opening days/hours and holiday schedule? | Admin-managed; placeholder seed clearly labeled SAMPLE |
| Actual services, durations, prices, taxes? | Admin editable; `Ask for price` where unknown; do not allow durationless instant booking |
| Staff names, specialties and employment status? | Sample dev staff only; no public fabricated bios |
| Customer authentication: mandatory vs guest checkout? | Start with customer login; architecture allows future guest booking |
| Booking confirmation instant vs admin approval? | Configurable; initially instant for fixed-duration services |
| Cancellation/reschedule/no-show policies? | Configurable per business; conservative sample default; no punitive charge without owner approval |
| Staff selection public vs automatic? | Admin-configurable; default any qualified available employee |
| Salary rules, leave, advance recovery, commission? | Manual admin-approved settings; no automatic legal assumptions |
| Staff recording invoice vs finalizing it? | Employee creates draft; owner finalizes |
| Actual GST registration/tax display? | Keep disabled/unconfigured until owner/accountant verifies |
| Business photos, logo, employee portraits, testimonials? | Placeholder design assets labeled demo; replace with licensed/approved assets |
| Email/WhatsApp provider credentials? | In-app notifications functional first; external provider feature-gated |
| Hosting/domain/budget and retention policy? | Document deployment options, select before production |

---

## 16. Instructions to Google Antigravity Agent

**Read this PRD fully before generating code.** Act as senior product engineer, architect, UI/UX designer, QA lead and security-conscious developer. Create a coherent professional app, not a mockup.

**Required workflow:**
1. Inspect the existing repository and preserve valid code if present.
2. Produce `docs/implementation-plan.md` listing phases, decisions, architectural risks, dependencies and test strategy.
3. Produce `docs/data-model.md` and an ERD in Mermaid. Document entities, relationships, booking constraints and access boundaries.
4. Build **Phase 0 first**, then implement phases in order using working vertical slices.
5. For each phase, explicitly report changed files, commands executed, test results, how to run and remaining work. Do not claim success without running commands.
6. Prefer real Postgres persistence and real API integration over placeholder arrays; no fake dashboards or simulated bookings as final behavior.
7. Use TypeScript strict mode, structured API errors and server-enforced validation/RBAC.
8. Provide secure transactional scheduling with adversarial concurrent request tests before marking booking done.
9. Generate usable seed data only in development environments; visibly label it SAMPLE; never disguise it as real salon facts.
10. Build premium UI but prioritize functional workflows and accessibility over animations.
11. Maintain a phase checklist in `docs/progress.md`; mark tasks complete only when verified.
12. If uncertain about business details, implement an owner-editable setting/neutral placeholder and document the question in `docs/open-decisions.md`. Do not block on minor missing facts.
13. At the end of each phase run lint, typecheck, relevant automated tests and production builds, fix failures, and demonstrate the actual user flow in browser where tools permit.
14. Never seed/default a known public admin password in production; prevent env secrets and PII exposure.
15. Do not implement an online payment gateway or imply that manually recorded UPI/cash transactions have been processed online.

### First agent instruction (paste into Antigravity)

```text
Read PRD.md in full. This is a real commercial salon booking and operations platform, not a landing-page demo. First inspect the project, then write docs/implementation-plan.md, docs/data-model.md, docs/open-decisions.md, and docs/progress.md. Use the recommended Next.js + NestJS + PostgreSQL + Prisma + Redis monorepo stack. Then IMPLEMENT AND TEST PHASE 0 only: repository/workspace, local Docker Compose services, frontend/API skeletons, env.example, migrations framework, baseline CI, README with Windows PowerShell setup instructions, health check and running public homepage shell. Do not start the booking feature yet. Run relevant commands and report verified results, outstanding risks and how to launch locally. No invented salon pricing, employee data, fake live ratings or mock booking confirmations.
```

---

## 17. Definition of Done for the Entire Product

A production-ready release requires:
- Correct customer, employee and owner journeys all demonstrated on persisted real DB data.
- Verified no double booking even under concurrent load.
- Protected roles and endpoint ownership tests.
- Usable responsive premium public site and efficient mobile staff/admin dashboards.
- Complete billing and clear financial ledger semantics (offline/manual payment recording only).
- Sensitive salary/advance logic reviewed by owner/accountant before real use.
- Audit trails, configuration, customer privacy, reliable notifications and no fabricated business facts.
- Passed lint, typecheck, test suite, E2E paths, accessibility checks and production build.
- Working migrations, deploy runbook, domain/HTTPS, backups, restore exercise, logging and incident/error process.
- Owner confirms business details, real staff, catalog, hours, terms and final acceptance in staging.

**Product principle:** Build one trusted, integrated operational system that an actual salon can use every day—not three disconnected demo pages.
