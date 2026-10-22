# Mandap architecture

This document is the source of truth for the application structure. Read it before adding a feature, changing a build, or introducing a new dependency. Update it in the same change whenever an architectural boundary, data flow, or build assumption changes.

## Goals

- Keep `App.jsx` as a small composition root rather than a feature implementation file.
- Organize product code by feature, with shared UI and utilities extracted only when they have a clear reusable contract.
- Keep booking and availability rules independent of React so they can be tested and reused by every calendar view.
- Maintain a static, backend-free build with browser-local persistence for the prototype.

## Source layout

```text
.github/
  workflows/
    deploy-pages.yml              Builds and deploys the site to GitHub Pages
public/
  venue-images/                   Optimized static venue photography
src/
  App.jsx                         Application composition and shared top-level state
  constants.js                   Shared product options and view identifiers
  data/
    defaultData.js               Demo properties and bookings
    propertyDetails.js           Editorial venue content and image metadata
  hooks/
    useStoredState.js            React/localStorage synchronization
  utils/
    booking.js                   Availability, conflict, currency, and slot rules
    date.js                      Date keys, labels, and range calculations
    inquiry.js                   Share-link creation and public property snapshot parsing
  components/
    layout/                      App-wide navigation and shell components
    shared/                      Reusable UI primitives such as Modal
  features/
    calendar/                    Calendar page, views, drawers, and booking form
    inquiries/                   Client-facing shared property page and inquiry form
    properties/                  Property finder, cards, detail/gallery page, and property form
  main.jsx                       Browser entry point
  styles.css                     Shared design system and responsive styles
```

## Data and state flow

`App` owns the property collection, booking collection, inquiry collection, active top-level page, selected property, and notifications. It passes data and explicit callbacks into feature pages.

```text
localStorage ↔ useStoredState ↔ App
                              ├─ CalendarPage → month/week/day views
                              ├─ PropertiesPage → finder/cards/editor → PropertyDetailPage
                              └─ InquiryPage → public property snapshot + inquiry form
```

Feature components never read or write local storage directly. Mutations flow upward through callbacks. Functional state updates are preferred so rapid actions cannot overwrite newer state.

## Reuse boundaries

- Date formatting and date-range calculations belong in `utils/date.js`.
- Booking availability and conflict decisions belong in `utils/booking.js`; UI components must not reimplement those rules.
- Calendar views receive the focused date, filtered property scope, bookings, and callbacks. They do not own portfolio state.
- `PropertyCard` is a presentation/action component. Selecting its main area opens the property detail page; its explicit calendar action opens a calendar already scoped to that property.
- `PropertyDetailPage` derives past and upcoming events from the shared booking collection. Editorial copy and image metadata come from `data/propertyDetails.js`, with a reusable fallback for user-created properties.
- Property detail pages create client links with the `inquiry` query parameter and a public property snapshot. `InquiryPage` is a standalone client view and never exposes bookings or manager navigation.
- Project-bound venue photography lives in `public/venue-images`. Reference it with relative paths so static subdirectory hosting continues to work.
- `Modal` owns shared dialog presentation and dismissal behavior. Feature forms own their fields and validation messages.
- Options used by multiple features belong in `constants.js`. Demo-only records belong in `data/defaultData.js`.

## Adding a feature

1. Read this document and identify the owning feature.
2. Put domain rules in a utility module and UI/state orchestration in the feature folder.
3. Prefer props and callbacks with explicit names over importing feature state globally.
4. Extract a shared component only when at least two consumers need the same behavior or when it is a true application primitive.
5. Add or update tests for domain rules and critical interactions when a test harness is present.
6. Run `npm run build` and manually check desktop and narrow layouts.
7. Update this document if the change introduces a new folder, dependency, state owner, persistence rule, or build step.

## Adding or changing a build

- Read this document before changing Vite, package scripts, asset handling, hosting paths, or dependencies.
- Preserve relative production asset paths unless the deployment target explicitly requires a fixed base path.
- Keep the prototype deployable as static files from `dist/`.
- Record new environment variables, generated artifacts, and deployment assumptions here.

## Current build and persistence assumptions

- React and Vite are the only runtime/build dependencies.
- `npm run build` produces the static `dist/` directory.
- Vite uses a relative base path so the build works from a subdirectory on static hosting.
- A GitHub Actions workflow builds and deploys `dist/` to GitHub Pages after pushes to `master`; it can also be run manually.
- The repository's GitHub Pages publishing source must be set to GitHub Actions.
- Properties, bookings, and submitted inquiries persist under `mandap-react-properties`, `mandap-react-bookings`, and `mandap-react-inquiries` in browser local storage.
- Shared inquiry links embed the public venue fields required to render in another browser. Inquiry submissions are local to the browser that submits them until a backend is introduced.
- There is no authentication, backend, shared database, or server-side rendering.
