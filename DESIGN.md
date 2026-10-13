# Mandap — Product and Design Document

## 1. Product summary

Mandap is a lightweight, multi-property booking and availability platform for Indian wedding venue owners.

The product gives an owner or venue manager one place to:

- View bookings across every property in a combined calendar.
- Open the calendar for one property at a time.
- Add wedding and event reservations.
- Prevent conflicting bookings.
- Maintain property details such as capacity, location, services, operating dates, and planned closures.
- Find properties that satisfy an enquiry's date, capacity, location, and service requirements.

The initial product is intentionally focused on availability and bookings. It is not yet a full customer relationship management, accounting, or event-planning system.

## 2. Product goal

The primary question Mandap should answer is:

> Which of my properties can host this event on the requested date?

The interface should make that answer quick and reliable while giving the venue owner enough detail to create the booking immediately.

## 3. Target users

### Primary user: multi-property venue owner

An owner may operate several wedding halls, lawns, banquet spaces, or destination venues. They need a consolidated view without losing the ability to inspect each property separately.

### Secondary user: booking or operations manager

A staff member receives enquiries, checks suitable venues, places dates on hold, and confirms bookings. They need fast filters and clear conflict warnings.

## 4. Product principles

1. **Availability first** — the calendar and property finder should make open dates obvious.
2. **One portfolio, separate properties** — information is centralized, but every venue retains its own calendar and operating details.
3. **Prevent mistakes early** — conflicting dates or slots should be rejected before a booking is saved.
4. **Indian wedding context** — event types, currency, date formatting, and venue services should reflect the target market.
5. **Demo-friendly** — the prototype should be easy to run, host, and share without requiring backend setup.

## 5. Information architecture

The application has two primary sections.

### Calendar

- Combined calendar for all properties.
- Individual calendar for each property.
- Monthly navigation.
- Booked and on-hold status indicators.
- Day details panel.
- New booking form.
- Monthly property availability summaries.

### Properties

- Portfolio overview of all properties.
- Property search and filtering.
- Add-property form.
- Edit-property form.
- Capacity and service details.
- Booking-season dates.
- Planned closure or blackout dates.
- Direct link from a property card to its calendar.

## 6. Core user flows

### 6.1 Check availability across all venues

1. Open the combined calendar.
2. Navigate to the required month.
3. Review bookings from all properties together.
4. Select a day to see reservation details.
5. Add a booking if a suitable property is open.

### 6.2 Check one property's calendar

1. Select a property from the sidebar or property selector.
2. Review only that property's bookings.
3. Select a day to see the event, slot, status, and booking amount.

### 6.3 Find a property for an enquiry

1. Open the Properties section.
2. Enter the requested event date.
3. Optionally enter minimum guest capacity.
4. Filter by city and required service.
5. Review only properties that match all selected requirements and are available.
6. Open a matching property's calendar.

### 6.4 Add a booking

1. Select **New booking** from the Calendar section.
2. Enter the couple or client name.
3. Select the property, event type, date, time slot, amount, and status.
4. Check the date and slot for a conflict.
5. Save the reservation and update the calendar.

### 6.5 Add or edit a property

1. Open the Properties section.
2. Select **Add property** or **Edit** on an existing property.
3. Enter the property name, location, capacity, and services.
4. Add optional booking-season and closure dates.
5. Save the property.
6. Make the property immediately available to calendar and booking views.

## 7. Feature specification

### 7.1 Combined calendar

The combined calendar displays reservations from all properties in one monthly grid.

Each booking shows:

- Event type.
- Couple or client name.
- Property name.
- Time slot.
- Property-specific color.
- Booking status.

Selecting a calendar day opens a detail panel containing all relevant bookings for that date.

### 7.2 Property-specific calendars

The user can filter the calendar to one property from either:

- The property list in the sidebar.
- The property selector above the calendar.
- The **View calendar** action on a property card.

The selected property view also shows its guest capacity and location.

### 7.3 Booking statuses

The prototype supports two statuses:

- **On hold** — a temporary reservation that still blocks the selected date and slot.
- **Booked** — a confirmed reservation.

Both statuses participate in availability checks.

### 7.4 Booking slots

The supported booking slots are:

- Morning.
- Evening.
- Full day.

A full-day booking conflicts with every other slot on the same property and date. Morning and evening bookings can coexist, but two bookings cannot occupy the same partial-day slot.

### 7.5 Event types

The initial event types are:

- Wedding.
- Reception.
- Sangeet.
- Mehendi.
- Haldi.
- Engagement.

### 7.6 Property portfolio

Each property card summarizes:

- Property name.
- City and locality.
- Maximum guest capacity.
- Services provided.
- Total reserved dates.
- Booking-season dates.
- Planned closure dates.
- Availability on the date selected in the finder.

### 7.7 Property finder

The finder can filter properties by:

- Property name, city, or locality.
- Event date.
- Minimum guest capacity.
- City.
- Required service.

A property appears in the result only when it satisfies every active filter.

### 7.8 Property services

The prototype includes the following service options:

- Catering.
- Decoration.
- Valet parking.
- Bridal suite.
- Guest rooms.
- In-house DJ.
- Power backup.
- Alcohol permitted.

The service list can be expanded later without changing the property-matching model.

### 7.9 Operating and closure dates

Each property can optionally define:

- A date from which bookings are accepted.
- A date after which bookings are closed.
- A planned closure start date.
- A planned closure end date.
- A reason for the closure.

These dates are used by the property finder and should also be validated when creating a booking.

## 8. Availability rules

A property is considered available for a requested date when all of the following are true:

1. The requested date is on or after the property's booking-open date, when one is configured.
2. The requested date is on or before the property's booking-close date, when one is configured.
3. The requested date is not inside a planned closure range.
4. The property has no reservation blocking the requested date or time slot.
5. The property satisfies the enquiry's capacity, city, and service filters.

For the first prototype, the property finder treats any booking on a date as unavailable. The booking form uses the more detailed morning, evening, and full-day slot conflict rules.

## 9. Data model

### Property

```ts
type Property = {
  id: string;
  name: string;
  city: string;
  area: string;
  capacity: number;
  services: string[];
  bookingOpen?: string;      // YYYY-MM-DD
  bookingClose?: string;     // YYYY-MM-DD
  blackoutStart?: string;    // YYYY-MM-DD
  blackoutEnd?: string;      // YYYY-MM-DD
  blackoutReason?: string;
  color: string;
};
```

### Booking

```ts
type Booking = {
  id: number;
  property: string;          // Property ID
  client: string;
  event: string;
  date: string;              // YYYY-MM-DD
  slot: "morning" | "evening" | "full";
  status: "hold" | "booked";
  amount: number;            // Indian rupees
};
```

## 10. Indian market context

The current interface uses:

- Indian rupee formatting.
- Indian English date formatting.
- Common Indian pre-wedding and wedding event types.
- Venue characteristics such as lawns, banquet halls, guest rooms, catering, valet parking, and bridal suites.
- Sample properties in New Delhi, Jaipur, and Udaipur.

Future versions may add GST, lakh/crore display preferences, multi-day wedding packages, auspicious-date markers, and regional language support.

## 11. Visual direction

The visual design is warm, premium, and operational rather than decorative.

- **Palette:** ivory backgrounds, charcoal navigation, terracotta actions, muted gold and green status colors.
- **Typography:** editorial serif headings paired with a clean sans-serif interface font.
- **Property identity:** each property receives a distinct calendar color.
- **Density:** enough information for daily operations without resembling an enterprise spreadsheet.
- **Responsive behavior:** the desktop sidebar becomes compact navigation on smaller screens; wide calendars remain horizontally scrollable.

## 12. Technical architecture

### Current prototype

- React for interface components and state.
- Vite for local development and production builds.
- Plain CSS for the design system and responsive layout.
- `localStorage` for demo persistence.
- Static build output, suitable for simple web hosting.

### Current storage behavior

Properties and bookings are saved only in the browser being used. This is appropriate for a client demo, but the data is not shared across people or devices.

### Hosting

The React application can be built into static assets with:

```bash
npm run build
```

The generated `dist` directory can be hosted on services such as Cloudflare Pages, Netlify, Vercel, GitHub Pages, or any static web server.

## 13. Accessibility and interaction requirements

- Every interactive control should be keyboard reachable.
- Form fields should have visible labels.
- Modal dialogs should be announced as dialogs and support closing with Escape.
- Status should not be communicated by color alone.
- Calendar days should expose their date and booking count to assistive technology.
- Text and control colors should maintain readable contrast.
- Mobile layouts should preserve all primary actions without requiring desktop navigation.

## 14. Prototype boundaries

The following are outside the current scope:

- Authentication and user roles.
- Shared cloud database.
- Customer CRM and enquiry pipeline.
- Online payments and invoicing.
- Contracts and document uploads.
- Staff scheduling.
- Customer-facing self-booking.
- Notifications through WhatsApp, SMS, or email.
- Recurring or multiple closure ranges.
- Detailed pricing packages.

## 15. Recommended next phases

### Phase 1 — complete the shareable prototype

- Finish responsive visual styling for the React implementation.
- Validate add/edit property behavior.
- Validate availability filters and booking conflicts.
- Produce and deploy a static client-demo build.

### Phase 2 — shared data and access

- Add authentication.
- Move properties and bookings to a hosted database.
- Add owner, manager, and staff permissions.
- Add audit history for booking changes.

### Phase 3 — enquiry and commercial workflow

- Add enquiry capture.
- Generate quotations.
- Track advances and remaining balances.
- Add packages, add-ons, and taxes.
- Add reminders and WhatsApp or email communication.

## 16. MVP acceptance criteria

The initial product is ready for a client demonstration when:

- A user can view bookings across all properties.
- A user can view each property's calendar independently.
- A user can inspect bookings for a selected date.
- A user can add a booking and receive a clear conflict warning when required.
- A user can view all properties.
- A user can add and edit property data.
- A user can filter properties by date, capacity, city, and service.
- Property operating dates and closures affect availability results.
- Data persists after a browser refresh.
- The production build loads correctly from static hosting.

