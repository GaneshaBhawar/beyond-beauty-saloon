# Beyond Beauty Saloon — Customer Booking & Salon Operations Platform

> **Working Project Slug:** `beyond-beauty-saloon`  
> **Location:** Shrikrishna Nagar / Savedi, near Kohinoor Mangal Karyalaya, Ahilyanagar, Maharashtra 414003, India  
> **Contacts:** +91 98235 73781 | Alternate: +91 97307 68487  
> **Instagram:** [@beyond__beauty_saloon](https://www.instagram.com/beyond__beauty_saloon/)  
> **Architecture Baseline:** [PRD.md](./PRD.md) | [docs/implementation-plan.md](./docs/implementation-plan.md) | [docs/data-model.md](./docs/data-model.md)

---

## 1. System Overview

Beyond Beauty Saloon is a comprehensive, database-backed web application and operations management platform designed for three roles:
1. **Customer:** Browse verified salon services, check real-time slot availability, reserve appointments atomically with collision protection, manage bookings, and review visit history.
2. **Employee:** Mobile-first workspace to view assigned queues, self check-in/out attendance, submit completed service lines and bill drafts, receive operational notifications, and view personal compensation records.
3. **Owner / Salon Admin:** Real-time command center: multi-stylist calendar grid, offline billing & payment recording (Cash, UPI, Card-at-counter), staff management, salary/advance ledger, inventory consumables, customer CRM, marketing CMS, and audit logs.

**Core Product Principle:** No fake booking demos, static landing mockups, or disconnected dashboards. All three roles operate on the **same persisted relational database** with server-side access control and atomic scheduling logic.

---

## 2. Monorepo Structure

```text
beyond-beauty-saloon/
├── apps/
│   ├── web/                    # Next.js (App Router), Tailwind CSS, luxury palette
│   └── api/                    # Express / NestJS TypeScript REST API with Prisma ORM
├── packages/
│   ├── types/                  # Shared TypeScript contracts, DTOs, and role enums
│   ├── ui/                     # Design tokens & UI components
│   └── config/                 # Common ESLint & TypeScript configuration
├── database/
│   └── prisma/                 # PostgreSQL migrations, schema, and sample seed
├── docs/
│   ├── implementation-plan.md  # Multi-phase execution plan and risk controls
│   ├── data-model.md           # Entity definitions and Mermaid ERD
│   ├── open-decisions.md       # Owner decision register and defaults
│   └── progress.md             # Verification log and task tracker
├── docker-compose.yml          # PostgreSQL 16 + Redis 7 + API + Web
├── .env.example                # Sample environment variables
└── README.md                   # Setup guide and documentation
```

---

## 3. Quick Start Guide for Windows PowerShell

### Prerequisites
- **Node.js:** v20.x or later installed (`node -v`)
- **pnpm:** Installed globally (`npm install -g pnpm`)
- **Docker Desktop (Optional):** Required for containerized Postgres/Redis, but local zero-config SQLite mode is supported out of the box for instant development!

### Step 1: Install Dependencies
Open Windows PowerShell in the project root:
```powershell
pnpm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```
*(By default, `.env` is pre-configured with local development defaults and safe fallback settings).*

### Step 3: Initialize Database & Seed Sample Data
Run Prisma migrations and seed the initial service taxonomy, business operating hours, sample staff, and test users:
```powershell
# Generate Prisma Client
pnpm db:generate

# Push database schema
pnpm db:push

# Seed verified categories and sample staff/services
pnpm db:seed
```

### Step 4: Launch Development Servers
Start both the REST API (port 4000) and Next.js Web Application (port 3000) concurrently:
```powershell
pnpm dev
```

Visit the applications in your browser:
- **Public Website & Customer Portal:** [http://localhost:3000](http://localhost:3000)
- **API Health Check & Status:** [http://localhost:4000/api/v1/health](http://localhost:4000/api/v1/health)
- **Public Business Info Endpoint:** [http://localhost:4000/api/v1/public/business](http://localhost:4000/api/v1/public/business)

---

## 4. Development & Testing Credentials

All dev accounts are clearly labeled `[SAMPLE]` and are for local testing only:

| Role | Email | Password | Description / Permissions |
|---|---|---|---|
| **Owner / Admin** | `admin@beyondbeauty.local` | `AdminPassword123!` | Full access to command center, billing, payroll, staff management, audit. |
| **Employee (Senior Stylist)** | `priya.stylist@beyondbeauty.local` | `StaffPassword123!` | Stylist portal: assigned appointments, attendance check-in, bill drafts. |
| **Employee (Skin Specialist)**| `sneha.skin@beyondbeauty.local` | `StaffPassword123!` | Skincare & makeup specialist portal. |
| **Customer** | `customer.demo@beyondbeauty.local` | `CustomerPassword123!` | Book appointments, view upcoming visits, self-service reschedule. |

*(The `/login` screen includes a one-click Quick-Fill selector for instant testing).*

---

## 5. Docker Deployment (PostgreSQL + Redis + API + Web)

To run the complete production containerized stack with PostgreSQL 16 and Redis 7:
```powershell
docker compose up -d --build
```
Services exposed:
- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

---

## 6. Testing & Quality Verification

Run typechecks, linters, and automated test suites:
```powershell
# Typecheck across all workspace packages
pnpm typecheck

# Build all applications
pnpm build
```

---

## 7. Business Policies & Owner Confirmation
Certain policies (official holiday schedule, final verified prices, GST registration) are marked as `[TBD]` pending final owner review. Refer to [docs/open-decisions.md](./docs/open-decisions.md) for details on configurable defaults.
