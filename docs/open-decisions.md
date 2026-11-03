# Owner Decision Register & Baseline Defaults

**Project Slug:** `beyond-beauty-saloon`  
**Date:** 27 October 2026  
**Version:** 1.0.0  
**Baseline Document:** [PRD.md Section 15](../PRD.md#15-owner-decision-register--unconfirmed-details)

---

## 1. Status Overview

The following items are business and policy decisions requiring explicit confirmation from the salon owner. In accordance with the PRD, these open decisions **do not block architecture or development**. Instead, each decision is implemented with an owner-editable administrative setting and a safe, conservative default marked visibly as `[SAMPLE]` or `[TBD]`.

| ID | Topic | Question / Decision Needed | Default / Baseline Strategy | Owner Action Required |
|---|---|---|---|---|
| **OD-01** | **Operating Schedule** | Official opening days, daily hours, lunch breaks, and holiday closures. | Open Mon–Sun 10:00 AM – 8:00 PM; Tuesday weekly half-day or holiday placeholder; sample breaks 1:00 PM – 2:00 PM. | Review and confirm official salon schedule in `/admin/settings`. |
| **OD-02** | **Service Catalog & Pricing** | Complete verified price list, standard durations, buffer times, and GST tax status. | Seed initial categories (Hair Styling, Hair Care, Skin Care, Makeup, Threading, Packages). Fixed prices where verified; "Ask for price" for transformation/bridal packages. Durations set to conservative estimates (30–90 min). | Update pricing and durations in `/admin/services`. |
| **OD-03** | **Staff Roster** | Real employee names, designations, phone numbers, and service proficiencies. | Seed 3 sample staff members labeled `[SAMPLE STAFF]` (e.g. Priya - Senior Stylist, Sneha - Skin Specialist, Pooja - Makeup Artist) for dev/staging. | Onboard real team members in `/admin/employees`. |
| **OD-04** | **Customer Auth Policy** | Require customer account creation before booking vs allow guest checkout with SMS/email verification? | Require customer registration/login in v1. Architecture stores customer profile cleanly; guest booking path can be enabled if requested. | Confirm whether guest checkout is desired for production. |
| **OD-05** | **Booking Confirmation Mode** | Should bookings be confirmed automatically if slot is free, or require manual salon approval? | Instant auto-confirmation for standard fixed-duration services; consultation request (`REQUESTED` state) for variable-price or package services. | Configure booking approval mode in `/admin/settings`. |
| **OD-06** | **Cancellation & Reschedule Policy** | Minimum notice period for cancellation/rescheduling and no-show policies. | Default policy: Free self-cancellation/reschedule up to 2 hours before appointment start time. No automated punitive fees in v1. | Confirm salon cancellation rules in `/admin/settings`. |
| **OD-07** | **Staff Selection Mode** | Can customers choose specific staff members, or only "Any Available Professional"? | Both supported: customer can select a preferred stylist from authorized public team members, or choose "Any Available Professional". | Toggle public stylist visibility per employee in `/admin/employees`. |
| **OD-08** | **Compensation & Commission** | Salary structure (fixed monthly vs commission per service line vs hybrid), advance repayment terms. | Support monthly base salary + optional basis point commission. Advance recovery deducted from monthly salary ledger with manual admin approval. | Validate compensation logic with salon accountant before processing live payroll. |
| **OD-09** | **Billing & Invoicing Workflow** | Can employees finalize customer bills directly, or do they submit a draft for owner/cashier approval? | Employees submit service lines and draft bill; owner/cashier approves final adjustments, discounts, and records payment. | Confirm salon front-desk operational hierarchy. |
| **OD-10** | **Taxation & GST** | Is Beyond Beauty Saloon registered under GST? Should GST numbers and tax breakdown appear on receipts? | Default: Tax percentage set to 0%; GST registration field kept empty and labeled "Unconfigured". | Provide GSTIN and tax percentage if applicable in `/admin/settings`. |
| **OD-11** | **Brand Assets & Reviews** | Official salon logo, high-resolution interior/exterior photos, verified Google/Justdial review quotes. | Placeholder luxury design assets and clear disclaimers on indicative 4.7/5 rating. No fake customer reviews or simulated testimonials. | Supply official high-res photography and approved testimonials. |
| **OD-12** | **External SMS / WhatsApp** | Provider credentials for transactional SMS and WhatsApp notifications (e.g. Twilio, Gupshup, Interakt). | In-app notification center fully functional for all roles. External messaging queued in outbox with simulation logger until credentials provided. | Provide API keys and approved message templates if external SMS is needed. |
| **OD-13** | **Hosting & Deployment** | Preferred cloud hosting infrastructure, domain DNS, and backup retention window. | Containerized Docker Compose deployment ready for VPS (DigitalOcean, AWS EC2, Hetzner) or Vercel (Web) + Render/Railway (API + Postgres). | Select hosting provider and configure production domain DNS. |
