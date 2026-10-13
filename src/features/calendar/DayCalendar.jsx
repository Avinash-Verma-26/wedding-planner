import { keyForDate } from "../../utils/date.js";
import { propertyDateError, slotLabel } from "../../utils/booking.js";

export function DayCalendar({ focusDate, properties, bookings, onSelectDate, onAddBooking }) {
  const date = keyForDate(focusDate);

  return <div className="day-agenda">
    <div className="day-agenda-heading"><div><span>{new Intl.DateTimeFormat("en-IN", { weekday: "long" }).format(focusDate)}</span><strong>{focusDate.getDate()}</strong></div><p>Select a venue to add a reservation, or open the day details to review every booking.</p><button className="secondary-button" onClick={() => onSelectDate(date)}>View day details</button></div>
    <div className="day-venue-list">{properties.map((property) => {
      const propertyBookings = bookings.filter((booking) => booking.date === date && booking.property === property.id);
      const closedReason = propertyDateError(property, date);
      return <article className="day-venue-row" key={property.id} style={{ "--property-color": property.color }}>
        <div className="day-venue-title"><i className="property-dot" style={{ background: property.color }} /><div><strong>{property.name}</strong><small>{property.area}, {property.city} · {property.capacity.toLocaleString("en-IN")} guests</small></div></div>
        <div className="day-venue-bookings">{propertyBookings.map((booking) => <div className={`day-booking ${booking.status}`} key={booking.id}><span><strong>{booking.client}</strong><small>{booking.event} · {slotLabel(booking.slot)}</small></span><span className={`status-badge ${booking.status}`}>{booking.status === "booked" ? "Booked" : "On hold"}</span></div>)}{!propertyBookings.length && <span className={`day-availability ${closedReason ? "closed" : ""}`}>{closedReason || "No reservations — available"}</span>}</div>
        <button className="small-button" disabled={Boolean(closedReason)} onClick={() => onAddBooking(property.id)}>＋ Book</button>
      </article>;
    })}{!properties.length && <div className="empty-results"><h3>No properties yet</h3><p>Add a property before creating a booking.</p></div>}</div>
  </div>;
}
