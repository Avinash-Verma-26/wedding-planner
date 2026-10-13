import { addDays, keyForDate, longDate, startOfWeek, TODAY } from "../../utils/date.js";
import { slotLabel } from "../../utils/booking.js";

export function WeekCalendar({ focusDate, properties, bookings, selectedProperty, onSelectDate }) {
  const start = startOfWeek(focusDate);
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));
  const propertyMap = Object.fromEntries(properties.map((property) => [property.id, property]));

  return <div className="calendar-wrap"><div className="week-calendar-grid">
    {days.map((date) => {
      const key = keyForDate(date);
      const dayBookings = bookings.filter((booking) => booking.date === key && (selectedProperty === "all" || booking.property === selectedProperty));
      return <button key={key} className={`week-calendar-day ${key === TODAY ? "today" : ""}`} onClick={() => onSelectDate(key)} aria-label={`${longDate(key)}, ${dayBookings.length} ${dayBookings.length === 1 ? "booking" : "bookings"}`}>
        <span className="week-day-name">{new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(date)}</span><span className="week-day-number">{date.getDate()}</span>
        <span className="week-event-list">{dayBookings.slice(0, 4).map((booking) => <span key={booking.id} className={`event-pill ${booking.status}`} style={{ "--event-color": propertyMap[booking.property]?.color }}><strong>{booking.event} · {booking.client}</strong><small>{propertyMap[booking.property]?.name} · {slotLabel(booking.slot)}</small></span>)}{dayBookings.length > 4 && <span className="more-events">+{dayBookings.length - 4} more</span>}{!dayBookings.length && <span className="week-open-label">Open</span>}</span>
      </button>;
    })}
  </div></div>;
}
