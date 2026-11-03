<USER_REQUEST>
# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# Beyond Beauty Saloon — Smart Appointment Booking V2

**Project:** Beyond Beauty Saloon Management System  
**Module:** Customer Appointment Booking / Book Now  
**Version:** 2.0  
**Priority:** Critical  
**Application:** Existing React + TypeScript + Flask + SQLAlchemy application

## 1. OBJECTIVE

Act as a senior full-stack software engineer, UX designer, database architect, and QA engineer.

Your task is to redesign and enhance the EXISTING Beyond Beauty Saloon "Book Now" module into a premium, friendly, cheerful, highly intuitive, fully functional online appointment booking system.

This is an EXISTING full-stack project.

DO NOT rebuild the application or replace working modules.

Preserve the public website, admin dashboard, customers, staff management, payroll, billing, inventory, database, and existing functionality.

The booking module must use real backend records and availability calculations, not hardcoded sample time slots.

The goal is to make the customer booking experience exceptionally simple.

A first-time customer should be able to book an appointment without technical knowledge.

## 2. BUSINESS CONFIGURATION

Salon: Beyond Beauty Saloon

Location:
Shrikrishna Nagar, Savedi, Ahilyanagar, Maharashtra 414003, India.

Timezone: Asia/Kolkata

Business hours:
Tuesday to Sunday: 8:30 AM to 9:30 PM
Monday: Closed

Working hours must be configurable from the admin panel.

All calendar and time calculations must respect the configured salon timezone, employee shifts, special closures, and holidays.

## 3. USER EXPERIENCE DESIGN

Create a premium but cheerful beauty salon booking interface.

Brand style:
- Warm ivory background
- Soft blush pink accents
- Champagne gold details
- Dark charcoal text
- White cards
- Elegant rounded corners
- Clean service photography
- Gentle hover effects
- Smooth step transitions

Use playful touches sparingly, such as small beauty-themed illustrations, welcoming headings, and friendly confirmation visuals.

Avoid excessive animations, emojis, bright neon colours, distracting pop-ups, or complicated forms.

Use consistent typography with the main salon website.

The page should look polished and easy to use on phones, tablets, and desktop computers.

## 4. CUSTOMER BOOKING FLOW

Implement four clear steps:

1. Choose Service
2. Choose Stylist
3. Select Date & Time
4. Your Details & Confirm

Show a simple progress indicator.

Allow customers to return to previous steps without losing valid selections.

When a previous choice changes, invalidate dependent selections that are no longer valid.

For example, changing the selected service must clear an incompatible stylist or time slot.

A small booking summary should remain visible on desktop and appear in a compact expandable format on mobile.

## 5. STEP 1 — SERVICE SELECTION

Create a well-organized service catalogue using real active services from the database.

Service categories:

### Hair Care
- Haircut
- Deep Layer Haircut
- Hair Trim
- Hair Styling

### Hair Chemical Treatments
- Hair Colouring
- Highlights
- Balayage
- Hair Straightening
- Hair Rebonding

### Skin & Spa
- Facial Treatment
- Skin Grooming
- Spa Services

### Makeup & Grooming
- Makeup
- Basic Grooming

Only show services that actually exist and are active in the salon database.

Do not create duplicate service records simply to populate the UI.

### Service cards

Each card should include:
- Service name
- Relevant image, if available
- Short description
- Starting price or consultation price
- Estimated duration
- "View Details" button
- "Select Service" button

### Service details

When a customer clicks a service card or "View Details", open a polished modal, drawer, or dedicated detail page.

Display:
- Service name
- Service category
- Professional description
- Relevant image
- Estimated duration
- Actual configured price or "Price on Consultation"
- Relevant inclusions, only when configured
- Optional preparation information
- "Book This Service" button

The detail view must use real service data.

Do not fabricate prices, duration, treatment results, service inclusions, or guarantees.

If price or duration is not configured, handle this clearly rather than inventing values. Services that require duration configuration must not be bookable until scheduling information is valid.

Use category filters or tabs to make service discovery easy.

Include a search field if helpful.

### Selection rules

For V2, support one primary service per appointment.

Do not show multi-service booking unless the backend can correctly schedule combined service duration, employee requirements, pricing and conflicts.

Keep the initial flow simple and reliable.

## 6. STEP 2 — STYLIST / EMPLOYEE SELECTION

This is a major enhancement.

Customers must be able to choose which eligible employee performs their selected service.

### Employee cards

Each card should show:
- Employee display name
- Professional profile photo, if provided
- Role or designation
- Services they are assigned to perform
- Optional short professional bio
- Availability indicator for the selected booking date, if a date is known

Do not expose:
- Employee salary
- Personal mobile number
- Private email
- Home address
- Attendance history
- Internal employee notes

Only show employees who:
- Are active
- Are authorized or qualified to perform the selected service
- Are eligible for public bookings

### Booking preferences

Provide two clear choices:

**Any Available Stylist**
- Recommended default
- Find available eligible staff
- Assign an actual available employee at booking confirmation

**Choose My Stylist**
- Display eligible employee cards
- Let the customer select a preferred employee

If the service has no eligible staff, display a friendly unavailability message.

Never imply an employee is available without checking the requested date and time.

Do not invent actual staff members or qualifications.

## 7. STEP 3 — DATE AND EMPLOYEE SLOT AVAILABILITY

Implement a genuine database-driven appointment calendar.

### Date selector

Requirements:
- Clear and friendly calendar
- Current month and future dates
- Past dates disabled
- Mondays disabled
- Special closures disabled
- Configured booking horizon
- Mobile-friendly calendar

### Time slots

After selecting a date, calculate available time slots using:

- Selected service duration
- Service buffer time
- Business operating hours
- Employee shift and availability
- Employee days off
- Employee leave
- Existing appointments
- Booking status policy
- Special closure dates
- Minimum advance booking notice
- Shared salon resource constraints, where configured

Show only slots that can genuinely accommodate the service.

Prefer a configurable slot interval, such as 15 or 30 minutes.

The slot interval is the spacing between offered start times, not the appointment duration.

Example:

A 90-minute hair treatment starting at 4:00 PM occupies the relevant employee and resource for the complete configured duration and buffer.

The same employee must not be offered to another customer during the overlapping period.

### Employee availability view

Customers should be able to clearly see:

- The chosen employee
- Available booking times
- Unavailable times, optionally visually distinguished
- Alternative available employees
- Nearest alternative slot

For the "Any Available Stylist" option, group or display available times without confusing the customer.

Once a time is selected, show which employee will be assigned, if the salon workflow permits it.

A successful booking must assign a specific eligible employee, unless the system implements and tests a separate capacity-safe unassigned-booking model.

Do not assign a stylist only in frontend state without committing that assignment in the backend.

### Slot states

Use:
- Available
- Selected
- Unavailable
- Closed

Never display fake availability.

### Fully booked scenario

Display:

"We're fully booked at that time. Would another slot work for you?"

Show alternative available slots or employees.

If the date is fully booked:

"All appointments are booked for this day. Please choose another date."

Suggest the next available date when possible.

## 8. CRITICAL — DOUBLE-BOOKING PREVENTION

Availability must be verified on the backend.

Do not rely on React state or frontend availability alone.

At booking confirmation:

1. Validate the selected service.
2. Validate employee eligibility.
3. Validate selected date and time.
4. Check business hours.
5. Check employee shift and leave.
6. Check existing appointment conflicts.
7. Check required shared resources.
8. Create the appointment in a concurrency-safe transaction.
9. Return a unique booking reference.

If another customer books the slot first, the second customer must receive a friendly conflict response.

Return HTTP 409 for an availability conflict, with machine-readable error information and, where practical, alternative slots.

For PostgreSQL production, use robust transaction-level concurrency protection, including suitable constraints or locking.

For local SQLite, use a documented serialized-write strategy and retry behavior appropriate to its locking model.

A simple "check then insert" without concurrency protection is not acceptable.

Do not allow overlapping appointments for the same employee or required resource.

If multiple employees can perform the same service simultaneously, their separate schedules should allow separate valid bookings.

## 9. STEP 4 — CUSTOMER DETAILS

Create a simple form with:

- Full name — required
- Mobile number — required
- Email — optional
- Special requests — optional

Use appropriate Indian phone number validation.

Avoid excessive personal information fields.

Do not require customers to create an account for basic appointment booking.

Validate fields on both frontend and backend.

Provide helpful inline error messages.

Protect forms against spam and excessive automated requests.

## 10. BOOKING REVIEW AND CONFIRMATION

Before final submission, show:

- Selected service
- Price or consultation pricing
- Estimated duration
- Employee name or assigned stylist
- Appointment date
- Appointment time
- Customer name
- Salon location

Use a clear "Confirm Appointment" button.

Disable duplicate submission while the request is processing.

Use an idempotency mechanism so browser retries or double-clicks cannot accidentally create duplicate appointments.

After successful backend confirmation show:

"Your Beauty Appointment Is Confirmed!"

Display:
- Booking reference
- Service name
- Assigned employee
- Date and time
- Salon address
- Status
- Cancellation/rescheduling instructions

Provide:
- Back to Home
- Book Another Appointment
- Manage Booking, if secure booking management is configured

Do not show "Confirmed" if the appointment is actually Pending under the configured workflow.

Do not claim a notification was sent unless a configured delivery mechanism actually accepted it.

## 11. ADMIN INTEGRATION

All public bookings must appear in the existing admin appointment system.

Admin should be able to:
- View appointment
- View assigned employee
- View selected service
- View customer contact
- View booking time
- Change appointment status
- Reschedule appointment
- Reassign stylist where valid
- Cancel appointment
- Create a manual booking
- Block employee time

Changes by admin must immediately affect customer availability.

Staff leave, shift changes and salon closures must also affect availability.

Ensure that rescheduling, reassignment and manual bookings follow the same conflict-prevention logic.

Do not implement separate, contradictory scheduling rules for admin and customer flows.

## 12. EMPLOYEE PORTAL INTEGRATION

If an employee portal exists, authorized employees should see their own upcoming assignments.

If the employee portal is not yet implemented, do not create an unrelated replacement as part of this scope.

The appointment backend should retain the staff association needed for future employee-portal integration.

Staff must not see unrelated customer or payroll data.

## 13. BACKEND APIs

Inspect existing Flask endpoints before adding or changing anything.

Reuse current endpoints when suitable.

Required capabilities:

GET /api/services

GET /api/services/{id}

GET /api/staff/eligible?service_id=...

GET /api/availability?service_id=...&date=...&staff_id=...

POST /api/appointments

Existing admin appointment management endpoints should remain functional.

These are proposed API contracts, not instructions to create duplicate routes where compatible routes already exist.

Availability response should clearly represent:

- Date
- Service
- Eligible employee
- Slot start
- Slot end
- Availability status
- Optional alternative times

Use consistent date/time serialization with explicit timezone handling.

Do not leak sensitive staff or customer information through public endpoints.

Avoid exposing confidential internal employee records.

## 14. FRONTEND ARCHITECTURE

Inspect existing files such as:

- frontend/src/pages/PublicSite.tsx
- frontend/src/App.tsx
- frontend/src/lib/api.ts
- frontend/src/index.css

Suggested reusable components:

- BookingWizard
- BookingProgress
- ServiceCategoryTabs
- ServiceCard
- ServiceDetailsModal
- StylistSelection
- StylistCard
- BookingCalendar
- TimeSlotGrid
- BookingSummary
- CustomerDetailsForm
- BookingConfirmation
- AvailabilityEmptyState

Separate presentation components from booking state and API logic where practical.

Use accessible React components and well-defined TypeScript types.

Keep the code understandable and maintainable.

## 15. RESPONSIVE DESIGN

Test the booking flow at:

- 320px
- 375px
- 430px
- 768px
- 1024px
- 1440px

Mobile:
- Single-column service cards
- Clear service details
- Full-width booking buttons
- Large selectable time slots
- Accessible date picker
- Compact progress indicator
- No unnecessary horizontal scrolling

Desktop:
- Service grid
- Comfortable employee cards
- Date picker and slots in a useful two-column arrangement
- Persistent booking summary where space permits

Ensure text remains readable and all interactive elements are touch-friendly.

## 16. EMPTY, LOADING AND ERROR STATES

Implement:
- Service loading skeletons
- No active services
- No eligible employees
- No available slots
- Staff unavailable
- Salon closed
- API error
- Network timeout
- Booking conflict
- Booking success

Errors must be friendly, specific and actionable.

Do not silently fail or display raw backend traces.

Do not show fictitious slots when the availability API fails.

## 17. ACCESSIBILITY AND PERFORMANCE

Include:
- Keyboard navigation
- Screen-reader-friendly form labels
- Proper dialog focus management
- Accessible disabled dates
- Sufficient contrast
- Visible focus states
- Reduced-motion support
- Optimized image loading
- Efficient API requests
- Avoid stale availability after selection changes

Do not fetch every employee's entire appointment history in the frontend.

All availability and permission filtering must happen on the backend.

## 18. TESTING REQUIREMENTS

Automated backend tests must cover:

1. Monday closure.
2. Past-date booking.
3. Booking after closing time.
4. Service duration overlapping closing time.
5. Employee not qualified for service.
6. Employee on leave.
7. Employee shift mismatch.
8. Existing booking conflict.
9. Multiple eligible employees with independent availability.
10. Any-available-stylist assignment.
11. Fully booked date.
12. Concurrent booking attempts.
13. Booking cancellation.
14. Booking rescheduling.
15. Admin employee reassignment.
16. Invalid phone number.
17. Duplicate booking submission.
18. Booking status accuracy.
19. Special closure dates.
20. Correct time zone handling.

Also implement frontend interaction tests for:

- Service details
- Service selection
- Stylist selection
- Slot selection
- Step navigation
- Form validation
- Loading and failure states
- Booking confirmation

Run production build and relevant existing tests.

Do not claim successful tests without executing them.

## 19. SCOPE LIMITATIONS

This task concerns the Book Appointment module.

Do not redesign:
- Admin dashboard
- Payroll
- Billing/POS
- Inventory
- Reports
- Entire public homepage

Make only the compatible changes required for booking integration.

Do not delete existing database records.

Do not run destructive migrations.

Do not break existing customer or employee records.

## 20. IMPLEMENTATION PROCESS

Phase 1: Inspect current booking frontend, backend and data model.

Phase 2: Document existing capabilities and gaps.

Phase 3: Improve service catalogue and service detail views.

Phase 4: Implement service-aware employee selection.

Phase 5: Implement real employee-specific availability.

Phase 6: Implement intuitive date/time selection.

Phase 7: Connect the booking form and confirmation.

Phase 8: Integrate admin schedule updates.

Phase 9: Add concurrency protection and automated tests.

Phase 10: Verify responsiveness and existing workflows.

Complete real working code, not mockups.

## 21. ACCEPTANCE CRITERIA

The module is complete only when:

- Customer can browse actual active salon services.
- Clicking a service displays complete configured information.
- Customer can choose a compatible stylist.
- Customer can select "Any Available Stylist".
- Customer can see genuine eligible-stylist availability.
- Customer cannot select an unavailable time.
- Customer can enter simple contact details.
- Customer can complete an appointment.
- The backend prevents double booking.
- Assigned stylist is persisted in the database.
- Customer receives an accurate confirmation.
- Booking appears in the admin panel.
- Admin changes affect available booking slots.
- The booking page works well on mobile.
- All functional buttons and forms work.
- Relevant tests and builds pass.
- Other existing modules remain operational.

## 22. FINAL DELIVERABLE

Deliver the enhanced, fully integrated Book Appointment V2 module inside the EXISTING Beyond Beauty Saloon project.

Provide:
- Updated frontend booking interface
- Real service detail views
- Employee selection
- Genuine availability calendar
- Correct booking transactions
- Confirmation screen
- Admin integration
- Tests
- Build results
- File change summary
- Remaining limitations, if any

The experience must be friendly, elegant, cheerful, fast and extremely simple for customers.

**Start by auditing the existing project and implement the actual working booking module. Do not stop after planning.**
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-11-03T18:45:22+05:30.

The user's current state is as follows:
Other open documents:
- d:\beyond-beauty-saloon\apps\web\Dockerfile (LANGUAGE_UNSPECIFIED)
- d:\beyond-beauty-saloon\apps\web\src\components\admin\AdminShell.tsx (LANGUAGE_UNSPECIFIED)
- d:\beyond-beauty-saloon\apps\web\src\components\admin\DashboardGreeting.tsx (LANGUAGE_UNSPECIFIED)
- d:\beyond-beauty-saloon\apps\api\src\routes\admin.ts (LANGUAGE_UNSPECIFIED)
- d:\beyond-beauty-saloon\apps\api\src\index.ts (LANGUAGE_UNSPECIFIED)
</ADDITIONAL_METADATA>