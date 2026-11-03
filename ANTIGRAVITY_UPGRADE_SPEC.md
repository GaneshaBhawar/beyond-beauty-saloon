# BEYOND BEAUTY SALOON
## Existing Application — Professional UI/UX, Authentication, Staff Management & Full QA Upgrade

**Document type:** Implementation-ready change request / engineering specification  
**Version:** 2.0  
**Prepared:** 28 October 2026  
**Project:** Beyond Beauty Saloon web application  
**Primary reader:** Google Antigravity coding agent  
**Priority:** P0 for security, broken flows, login, staff accounts, design consistency, and functional verification  
**Related baseline:** Existing `PRD.md` in the project repository (read alongside this file)  
**Status:** Instructions to implement against an EXISTING codebase, not permission to replace the application

---

## 0. Instructions to the Antigravity Agent — READ FIRST

You are acting as the senior engineer, UI/UX lead, product manager, accessibility reviewer, security reviewer, and QA engineer for a real salon operations product. The owner reports that the application already exists but looks inconsistent, elements are misaligned, fonts do not match, the customer-facing homepage exposes staff/admin entry points, role-based login is missing or incomplete, and the owner must be able to create staff accounts. These are functional release blockers, **not merely cosmetic edits**.

**Do not create a new project. Modify the existing application in place.** Before changing anything:

1. Read this entire document and the original `PRD.md`.
2. Inspect the actual repository: framework, architecture, folder structure, routes, components, authentication, database, migrations, current users/roles, deployed and local environment configuration, test tooling, and existing features.
3. Run the app and inspect the current homepage, customer booking flow, admin area, and employee area. Record a concise *before* inventory of visual inconsistencies, broken controls, insecure pages and missing features. Use browser/screenshots if available.
4. Identify what already works. **Preserve all functional flows and real data** (appointments, customers, employee records, payroll, bills, services, attendance, offers, reports, etc.). Keep existing working features, only refactor/rewrite a module when required by testable defects.
5. Create `docs/upgrade-plan.md` containing an evidence-based list of current gaps and the execution order; create/update `docs/upgrade-progress.md` as tasks pass real verification.
6. Maintain the current technology stack **if it is sound**; do not migrate to Next.js/NestJS solely because the original PRD recommended them. Avoid new dependencies without clear value. Document any architectural deviation or database migration.
7. Before migrations, destructive operations or changes to auth data, make a rollback plan and back up data where practical; never drop production data, replace the database with sample records, or overwrite the owner's credentials.
8. Implement in small, tested milestones. Do not stop after making a pretty landing page: complete the auth, staff creation, permission checks, UX fixes and QA requirements.
9. Verify each completed function in the browser and at the API level where applicable. **A UI button with no working backend is NOT complete.**
10. When done, start the actual application, open it in a working preview/browser, demonstrate the pages and user journeys, provide screenshots if possible, show exact startup commands and local URL, and write the truthful final completion report specified in Section 17.

**Conflict rule:** This specification supersedes prior PRD statements only about updated login entry points, redesigned UI/theme and staff onboarding. All other business functions, persistence, security and no-online-payment scope in `PRD.md` still apply.

