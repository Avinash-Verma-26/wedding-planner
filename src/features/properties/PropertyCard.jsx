import { shortDate } from "../../utils/date.js";

export function PropertyCard({ property, bookings, filterDate, onEdit, onOpen, onCalendar }) {
  const reserved = new Set(bookings.filter((booking) => booking.property === property.id).map((booking) => booking.date)).size;

  return <article className="property-card" style={{ "--property-color": property.color }}>
    <button className="property-card-open" onClick={onOpen} aria-label={`Open ${property.name} details`}>
      <span className="property-art"><span className="property-monogram">{property.name.split(" ").filter((word) => word.length > 2).slice(0, 2).map((word) => word[0]).join("")}</span><span className="property-city">{property.city}</span>{filterDate && <span className="available-badge">✓ Available</span>}</span>
      <span className="property-card-body"><span className="property-title-row"><span><strong className="property-name">{property.name}</strong><small>{property.area}, {property.city}</small></span><span className="open-arrow">→</span></span><span className="property-stats"><span><strong>{property.capacity.toLocaleString("en-IN")}</strong> guests</span><span><strong>{property.services.length}</strong> services</span><span><strong>{reserved}</strong> reserved dates</span></span><span className="services-list">{property.services.slice(0, 3).map((service) => <span key={service}>{service}</span>)}{property.services.length > 3 && <span>+{property.services.length - 3}</span>}</span><span className="operating-window"><span><i>◷</i><span><small>Booking season</small><strong>{shortDate(property.bookingOpen)} — {shortDate(property.bookingClose)}</strong></span></span>{property.blackoutStart && <span className="blackout"><i>×</i><span><small>Closed</small><strong>{shortDate(property.blackoutStart)} — {shortDate(property.blackoutEnd)}</strong></span></span>}</span></span>
    </button>
    <div className="property-card-actions"><button className="edit-button" onClick={onEdit} aria-label={`Edit ${property.name}`}>Edit details</button><button className="calendar-link" onClick={onCalendar}>Filtered calendar <span>→</span></button></div>
  </article>;
}
