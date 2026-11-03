# BEYOND BEAUTY SALOON — UI REFINEMENT CHANGE REQUEST

**Version:** 3.0 | **Date:** 28 October 2026  
**Project:** Existing Beyond Beauty Saloon web application  
**Audience:** Google Antigravity AI coding agent  
**Classification:** Targeted visual and usability upgrade, with regression testing  
**Read alongside:** `PRD.md` and `ANTIGRAVITY_UPGRADE_SPEC.md`, if available in the repository.

> **IMPORTANT — CHANGES TO THE EXISTING APP ONLY.** Do not create a replacement app or delete existing features, routes, database entries, customer bookings, staff/admin authentication, dashboards, payroll or other business workflows. Inspect the actual code before making changes. This v3 document supersedes earlier instructions **only for the visual elements explicitly changed here**, including the top promotional bar, public navigation placement, typography and theme-switcher placement.

---

## 1. Objective

Refresh the entire UI to look like a premium, trustworthy, modern salon brand. Current problems reported by the owner: mismatched and hard-to-read fonts; unnecessary top bar; color-palette button cluttering the area beside Login; undersized logo; poor right-side placement/alignment of navigation buttons; and a plain homepage without a beautiful blurred salon image or compelling text.

**Definition of success:** The public homepage looks polished immediately; every route uses a coherent readable font; the brand/logo is visually prominent; the navigation aligns correctly on desktop and mobile; all important text is legible over imagery; and existing business functions continue to work unchanged.

## 2. Required visual changes (all mandatory)

### 2.1 Replace mismatched fonts throughout the application

- Adopt **Manrope** as the single primary font family across the site and app (public pages, login, admin dashboard, staff dashboard, booking flow, modals, alerts, forms, tables, navigation, invoices, notifications and footer). Use system sans-serif fallbacks.
- Load the font once using the existing stack's official optimized font-loading method (e.g., `next/font/google` for Next.js), rather than multiple competing CDN imports. If the project uses a different framework, use an equivalent single global font system.
- Remove/override accidental per-component font families and inline typography styles that cause inconsistency. Preserve functional typographic semantics: consistent heading sizes, weights, spacing, and line heights.
- Target body text **16px desktop and mobile** with approximately 1.5–1.65 line height, reasonable form and table sizes; headings may use weights 700–800, body 400–500, labels/buttons 600–700. Do not make booking details, salary values or staff tables too small.
- Typography should be elegant and professional, but **clarity takes precedence** over decorative lettering. Do not introduce a second decorative headline font.
- Test real font rendering and wrapping on Windows Chrome and typical mobile screen widths; prevent overflow and inconsistent button heights. Keep local fallback fonts useful if the web font fails.

### 2.2 Remove the extra top bar

- **Remove the thin topmost announcement/promo/utility strip** from the public-facing website (the bar above the main header). It should not leave behind empty vertical space.
- **Keep the main navigation/header**: brand logo/name, appropriate public navigation links, Book Appointment button, and one Login button. Do not remove or hide important navigation while deleting the extra strip.
- If the removed bar currently displays important offers or announcements, relocate them to the existing Offers / Announcements section or a suitable homepage content section — **do not silently delete business data**.
- This request is for the **public website top strip** only; do not remove dashboard toolbars needed for admin/staff work.

### 2.3 Remove the color-palette button next to Login

- Remove the **visible color palette/theme selector icon or button located next to the Login button** in the public header. Restore spacing after removal; no empty gap or invisible click target.
- The user's request is to remove this **header control**, not to break the existing theme engine. If theme customization already works, preserve it unobtrusively in a settings page or other existing, non-header location. Do not create a new prominent button on the homepage.
- The public header should have only the necessary actions, with **one Login** entry for Admin/Staff role selection inside the login process; do not expose direct admin/staff dashboard shortcuts on the public homepage.

### 2.4 Make the logo more prominent; improve header alignment

- Enlarge the brand logo slightly so it is visually more prominent than the nearby nav icons/buttons: suggested desktop logo mark height **48–56px** (adjust to actual asset and header size); mobile **40–48px**. Preserve aspect ratio — never stretch or crop the real logo.
- If the header contains the text “Beyond Beauty Saloon,” ensure good hierarchy and legibility next to the logo. Use consistent brand spelling and avoid oversized nav text competing with the logo.
- Keep navigation/action buttons grouped on the **right side** of the header with proper right padding and consistent spacing; they must align on the same baseline/vertical center. Example desktop order: Home, Services, About, Gallery/Offers, Contact, **Book Appointment**, **Login**. Adapt to actual working routes rather than adding dead links.
- Use a clean responsive flex/grid layout and layout tokens, not ad hoc absolute positions or manual margins that fail at different widths. Constrain content with a centered max-width container and ~24–40px desktop / 16–20px mobile page gutters.
- On narrow screens, use an accessible hamburger/mobile menu; retain recognizable logo, Book Appointment access and Login; no horizontal scrolling or overlap. Ensure menus open/close, keyboard focus, and links work.
- Keep controls professionally sized, usually ~40–44px minimum tap target (larger if practical), consistent radii, active/hover/focus styles, and balanced whitespace.

### 2.5 Replace the flat hero with a premium blurred salon photo background

- Set the **front-page hero section** against an elegant, high-quality photo that is clearly relevant to hair/beauty/salon services. Prefer an authentic Beyond Beauty Saloon photo that the owner provides; if none exists in the repository, use an appropriately licensed placeholder and clearly document the asset source/license. **Do not misrepresent a stock photo as the actual salon interior or staff.**
- Apply a **subtle controlled blur to the IMAGE/BACKGROUND LAYER ONLY** (roughly 3–7px depending on asset). Add a translucent dark or brand-toned gradient/overlay to guarantee clear readable text. The hero text, buttons, logo and navigation **must not be blurred**.
- Establish good contrast (aim at WCAG AA for text), large legible headline, ample spacing, and a visual focal point. Avoid noisy background, excessively dark overlays, text over faces, stretched images or poor cropping.
- Use `object-fit: cover`, meaningful background-position, responsive breakpoints and optimized image loading. Prioritize correct hero LCP/performance: responsive image sizes, image compression and no blocking giant downloads.
- Hero should be attractive but not take over the entire page on small phones; prevent content from clipping. Respect users' reduced-motion preferences for animations.
- Make the background/image easy for the owner to replace later via a clear configuration asset or CMS/admin content setting if one already exists. Do **not** add an unfinished CMS just for this request.

### 2.6 Replace generic homepage copy with polished, professional copy

Use the following *suggested* wording unless current verified salon copy is stronger. Keep it editable via existing content structures, if any:

**Eyebrow:** `BEYOND BEAUTY SALOON · SAVEDI, AHILYANAGAR`  
**Hero headline:** `Your Beauty, Beautifully Reimagined.`  
**Hero description:** `Discover personalized hair, skincare and makeup services in a welcoming space designed around you. Find your next look at Beyond Beauty Saloon.`  
**Primary CTA:** `Book an Appointment`  
**Secondary CTA:** `Explore Our Services`

Optional content section titles:
- Services: `Care Crafted Around You` / `Explore hair, skin and makeup services tailored to your style.`
- Why choose us: `A Little Time, Just for You` / `Thoughtful treatments and attention to the details that matter.`
- Booking CTA: `Ready for Your Next Look?` / `Choose a service and find a convenient appointment slot.`

**Copy quality constraints:** Avoid unverified awards, pricing, staff qualifications, fake testimonials and guarantees. Existing actual location/contact data should remain accurate. Ensure every CTA points to an existing working route/action, not a placeholder `#` link.

### 2.7 Harmonize the entire application, not just the hero

- Apply the global font and spacing rules across all public and authenticated routes. Audit buttons, cards, form labels, inputs, tables, empty states, notices, modal dialogs, staff screens and admin screens.
- Use a refined default brand palette (suggested light ivory/cream background, warm neutral surfaces, restrained dusty rose or deep plum accents, dark-charcoal text). Do not randomly mix bright colors; retain semantic colors for success, error, warnings and status. If an existing user-selectable theme is supported, keep it functioning away from the public header.
- Make page sections, icons, cards and CTAs feel like one design system. Avoid excessive shadows, gradients, heavy motion and gratuitous floating widgets. Keep loading states and keyboard focus indicators clear.
- Add only subtle purposeful animation (hero fade/slide, button hover, card reveal) with no layout shifts, no constant movement and support for `prefers-reduced-motion`.

---

## 3. Implementation process (follow in sequence)

1. **Inspect before edits:** run the existing app; identify framework, global styles, font loaders, public layout/header components, existing theme-switcher location, logo asset, current hero and shared components; take before screenshots where supported.
2. **Write a concise change plan:** file-level list of intended edits and quick rollback approach. Preserve all authentication, bookings, notifications, inventory, attendance and salary logic.
3. **Update design tokens/font first:** one global font, type scale and shared button/input styles. Remove unnecessary font overrides carefully rather than using indiscriminate CSS that damages icons.
4. **Refine navigation:** delete the extra public top strip; enlarge the actual brand mark; remove the palette control next to Login; right-align header navigation; keep Login and Book Appointment working; implement robust mobile behavior.
5. **Build hero:** optimized appropriate background photo with image-only blur and accessible overlay, polished copy, correct CTA links and responsive layout.
6. **Check every major route:** homepage, services, contact, booking, login, Admin and Staff pages. Fix regressions in fonts, spacing, contrast and responsive layout. Do not change back-end business rules for aesthetic purposes.
7. **Test and document:** run existing formatter/linter, type checker, build, unit/integration/e2e tests. Add targeted tests where feasible. Run the app locally and perform browser visual/manual inspections; capture after screenshots.
8. **Demonstrate:** open the actual running app via the preview/browser if Antigravity has that ability; show desktop and mobile homepage, Login/Admin/Staff navigation, and booking path. If unavailable, provide exact local run commands and the verified localhost URL, without claiming a live preview was opened.

## 4. Mandatory acceptance tests / QA checklist

Record **PASS**, **FAIL** or **NOT TESTED** with evidence/notes for each, never infer PASS from code alone:

| ID | Test | Acceptance criterion |
|---|---|---|
| UI-01 | Font consistency | All public, Login, Admin, Staff and booking routes use Manrope with sensible fallbacks and readable typographic scale |
| UI-02 | Remove top strip | No extra public announcement bar or leftover blank padding; main header still visible |
| UI-03 | Palette button | No theme/palette button next to public Login; no empty click target; existing theme logic not broken |
| UI-04 | Logo | Brand logo visibly larger, correct aspect ratio; never overlaps buttons or text |
| UI-05 | Desktop navbar | Actions right-aligned and evenly spaced, with proper gutter and no wrapping/overlap at standard widths |
| UI-06 | Mobile navbar | 320px, 375px and 430px checks: menu and actions reachable, no horizontal overflow |
| UI-07 | Hero photo | Image loads, optimized/cropped well, blur limited to image layer, text and buttons sharp |
| UI-08 | Hero text/CTAs | Correct professional copy; strong readable contrast; both CTAs perform real navigation/action |
| UI-09 | Other breakpoints | 768px, 1024px, 1440px and a larger desktop width: hierarchy, spacing and alignment remain polished |
| UI-10 | Motion/a11y | Keyboard access/focus visible, accessible button names, reduced-motion behavior, acceptable contrast |
| AUTH-01 | Login | One public Login button opens actual role-selection login; valid Admin and Staff can authenticate |
| AUTH-02 | Security | Unauthenticated users cannot access protected Admin/Staff areas; login/logout remains functional |
| STAFF-01 | New staff | Owner can still create a staff account, and that employee can log in and view their assigned work |
| BOOK-01 | Booking regression | Customer can view genuine availability and complete a valid booking; staff/admin see correct data |
| CORE-01 | Build/tests | Project builds; existing automated tests run; relevant failures are reported and fixed where in scope |
| DEMO-01 | Visual proof | Before/after screenshots or visual walkthrough plus confirmed run commands/URL |

**No fake success:** If the environment prevents a test (for example, no live database, unavailable test accounts, network failure, missing image asset), state exactly what blocked it; never invent screenshots or passing results.

## 5. Deliverables and final response format (required)

At completion, Antigravity must provide:

1. **Summary of what actually changed**, mapped to the seven UI requirements above.
2. **Changed files** with brief reasons (font, header, hero, theme control, design tokens, tests).
3. **Preview/demo evidence:** app started, exact commands, URL (e.g., localhost address only if verified), desktop/mobile screenshots where possible; show how to navigate Home → Login and Home → Booking.
4. **Test matrix:** IDs from section 4 with PASS/FAIL/NOT TESTED, commands and relevant outputs. Distinguish automated tests from manual browser verification.
5. **Regression statement:** whether Admin login, employee login/staff creation, booking and other key modules still function, with evidence. Do not claim the app is fully production-ready based only on visual changes.
6. **Outstanding items:** blockers, missing real salon photo, any follow-up needed and exact next steps.
7. **Plain completion message:** `UI refinement complete` **only if work and required verification genuinely finished**; otherwise `Partially complete — outstanding: ...`.

## 6. Explicit non-goals / safety rails

- No recreation of the entire application, no stack migrations, no unnecessary back-end rewriting.
- No removal of Admin/Staff login, owner-controlled staff creation, existing bookings, payroll, attendance or reports.
- No fake content, hardcoded business data, simulated booking, destructive data changes or bypass of authentication for demos.
- No payment integration (not part of this visual refinement).
- No public top announcement strip and no public-header color-palette button near Login after this change.

**End of change request.**

