import { useEffect } from "react";
import { longDate } from "../../utils/date.js";
import { isPropertyAvailable, rupees, slotLabel } from "../../utils/booking.js";

export function DayDrawer({ date, properties, bookings, selectedProperty, onClose, onAdd }) {
  useEffect(() => {
    const handleKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const items = bookings.filter((booking) => booking.date === date && (selectedProperty === "all" || booking.property === selectedProperty));
  const propertyMap = Object.fromEntries(properties.map((property) => [property.id, property]));
  const relevantProperties = selectedProperty === "all" ? properties : properties.filter((property) => property.id === selectedProperty);
  const availableProperties = relevantProperties.filter((property) => isPropertyAvailable(property, date, bookings));
  const hasAvailability = availableProperties.length > 0;

  return <><div className="drawer-scrim" onClick={onClose} /><aside className="day-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title"><div className="drawer-header"><div><p className="eyebrow">DAY DETAILS</p><h2 id="drawer-title">{longDate(date)}</h2></div><button className="close-button" onClick={onClose} aria-label="Close">×</button></div>{items.length ? items.map((booking) => <article className="drawer-booking" key={booking.id}><div className="drawer-booking-top"><h3>{booking.client}</h3><span className={`status-badge ${booking.status}`}>{booking.status === "booked" ? "Booked" : "On hold"}</span></div><p><i className="property-dot" style={{ background: propertyMap[booking.property]?.color }} />{propertyMap[booking.property]?.name}</p><p>◷ {booking.event} · {slotLabel(booking.slot)}</p><p>{rupees(booking.amount)}</p></article>) : <div className={`drawer-empty ${hasAvailability ? "" : "closed"}`}><div><span>{hasAvailability ? "✓" : "×"}</span><strong>{hasAvailability ? "This date is open" : "No properties available"}</strong><small>{hasAvailability ? `${availableProperties.length} ${availableProperties.length === 1 ? "property is" : "properties are"} available on this date.` : "The selected properties are outside their booking season or closed."}</small></div></div>}<button className="primary-button drawer-add" onClick={onAdd} disabled={!hasAvailability && !items.length}>＋ Add booking on this date</button></aside></>;
}
