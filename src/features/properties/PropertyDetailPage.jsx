import { getPropertyDetails } from "../../data/propertyDetails.js";
import { longDate, shortDate, TODAY } from "../../utils/date.js";
import { rupees, slotLabel } from "../../utils/booking.js";
import { PropertyGallery } from "./PropertyGallery.jsx";

export function PropertyDetailPage({ property, bookings, onBack, onCalendar }) {
  const details = getPropertyDetails(property);
  const propertyBookings = bookings.filter((booking) => booking.property === property.id).sort((a, b) => a.date.localeCompare(b.date));
  const pastEvents = propertyBookings.filter((booking) => booking.date < TODAY).reverse();
  const upcomingEvents = propertyBookings.filter((booking) => booking.date >= TODAY);

  return <section className="page-body property-detail-page">
    <div className="detail-topbar"><button className="back-button" onClick={onBack}>← Back to properties</button><button className="primary-button" onClick={onCalendar}>View filtered calendar →</button></div>
    <section className={`property-detail-hero ${details.image ? "has-image" : ""}`} style={details.image ? { backgroundImage: `linear-gradient(90deg, rgba(28, 25, 22, .72), rgba(28, 25, 22, .08)), url(${details.image})` } : { "--property-color": property.color }}>
      <div><p className="eyebrow">{details.setting.toUpperCase()} · {property.city.toUpperCase()}</p><h1>{property.name}</h1><p>{details.tagline}</p><div className="hero-facts"><span><strong>{property.capacity.toLocaleString("en-IN")}</strong> guests</span><span><strong>{property.services.length}</strong> services</span><span><strong>{propertyBookings.length}</strong> events</span></div></div>
    </section>

    <div className="property-detail-layout">
      <main>
        <section className="detail-section"><div className="section-heading"><div><p className="eyebrow">THE VENUE</p><h2>Designed for the full celebration</h2></div></div><p className="detail-description">{details.description}</p><div className="space-grid">{details.spaces.map((space, index) => <div key={space}><span>{String(index + 1).padStart(2, "0")}</span><strong>{space}</strong></div>)}</div></section>
        <section className="detail-section"><div className="section-heading"><div><p className="eyebrow">GALLERY</p><h2>A closer look</h2></div><span className="section-count">{details.image ? "3 views" : "No photos"}</span></div><PropertyGallery property={property} details={details} /></section>
        <section className="detail-section"><div className="section-heading"><div><p className="eyebrow">EVENT HISTORY</p><h2>Past events</h2></div><span className="section-count">{pastEvents.length} completed</span></div>{pastEvents.length ? <div className="past-events-list">{pastEvents.map((booking) => <article key={booking.id}><div className="event-date-block"><strong>{new Date(`${booking.date}T12:00:00`).getDate()}</strong><span>{new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(new Date(`${booking.date}T12:00:00`))}</span></div><div><span className="event-type-label">{booking.event}</span><h3>{booking.client}</h3><p>{slotLabel(booking.slot)} · {rupees(booking.amount)}</p></div><span className={`status-badge ${booking.status}`}>{booking.status === "booked" ? "Completed" : "Was on hold"}</span></article>)}</div> : <div className="detail-empty"><strong>No past events yet</strong><p>Completed reservations will appear here automatically.</p></div>}</section>
      </main>

      <aside className="property-detail-aside">
        <section><p className="eyebrow">VENUE DETAILS</p><dl><div><dt>Location</dt><dd>{property.area}, {property.city}</dd></div><div><dt>Setting</dt><dd>{details.setting}</dd></div><div><dt>Established</dt><dd>{details.established}</dd></div><div><dt>Booking season</dt><dd>{shortDate(property.bookingOpen)} — {shortDate(property.bookingClose)}</dd></div>{property.blackoutStart && <div><dt>Planned closure</dt><dd>{shortDate(property.blackoutStart)} — {shortDate(property.blackoutEnd)}{property.blackoutReason ? ` · ${property.blackoutReason}` : ""}</dd></div>}</dl></section>
        <section><p className="eyebrow">SERVICES</p><div className="detail-services">{property.services.map((service) => <span key={service}>✓ {service}</span>)}</div></section>
        <section><div className="aside-heading"><p className="eyebrow">UPCOMING</p><span>{upcomingEvents.length}</span></div>{upcomingEvents.length ? <div className="upcoming-list">{upcomingEvents.slice(0, 4).map((booking) => <article key={booking.id}><strong>{booking.client}</strong><span>{booking.event} · {longDate(booking.date)}</span></article>)}</div> : <p className="aside-empty">No upcoming reservations.</p>}</section>
      </aside>
    </div>
  </section>;
}
