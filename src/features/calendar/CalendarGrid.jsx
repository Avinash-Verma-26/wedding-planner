import { keyForDate, longDate, TODAY } from "../../utils/date.js";
import { slotLabel } from "../../utils/booking.js";

export function CalendarGrid({ currentMonth, properties, bookings, selectedProperty, onSelectDate }) {
  const first = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7));
  const propertyMap = Object.fromEntries(properties.map((property) => [property.id, property]));
  const days = Array.from({ length: 42 }, (_, index) => { const date = new Date(start); date.setDate(start.getDate() + index); return date; });

  return <div className="calendar-wrap"><div className="weekdays">{["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">
    {days.map((date) => {
      const key = keyForDate(date);
      const dayBookings = bookings.filter((booking) => booking.date === key && (selectedProperty === "all" || booking.property === selectedProperty));
      return <button key={key} className={`calendar-day ${date.getMonth() !== currentMonth.getMonth() ? "outside" : ""} ${key === TODAY ? "today" : ""}`} onClick={() => onSelectDate(key)} aria-label={`${longDate(key)}, ${dayBookings.length} ${dayBookings.length === 1 ? "booking" : "bookings"}`}><span className="day-number">{date.getDate()}</span>{dayBookings.slice(0, 2).map((booking) => <span key={booking.id} className={`event-pill ${booking.status}`} style={{ "--event-color": propertyMap[booking.property]?.color }}><strong>{booking.event} · {booking.client}</strong><small>{propertyMap[booking.property]?.name} · {slotLabel(booking.slot)}</small></span>)}{dayBookings.length > 2 && <span className="more-events">+{dayBookings.length - 2} more</span>}</button>;
    })}
  </div></div>;
}
