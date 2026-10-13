import { useState } from "react";
import { CALENDAR_VIEWS } from "../../constants.js";
import { addDays, keyForDate, longDate, monthLabel, weekLabel } from "../../utils/date.js";
import { bookingsConflict, isPropertyAvailable, propertyDateError, slotLabel } from "../../utils/booking.js";
import { CalendarGrid } from "./CalendarGrid.jsx";
import { WeekCalendar } from "./WeekCalendar.jsx";
import { DayCalendar } from "./DayCalendar.jsx";
import { BookingModal } from "./BookingModal.jsx";
import { DayDrawer } from "./DayDrawer.jsx";

export function CalendarPage({ properties, bookings, setBookings, selectedProperty, setSelectedProperty, notify }) {
  const [focusDate, setFocusDate] = useState(() => new Date());
  const [calendarView, setCalendarView] = useState("month");
  const [bookingModal, setBookingModal] = useState(null);
  const [drawerDate, setDrawerDate] = useState("");
  const activeProperty = properties.find((property) => property.id === selectedProperty);
  const monthPrefix = `${focusDate.getFullYear()}-${String(focusDate.getMonth() + 1).padStart(2, "0")}`;
  const shownProperties = selectedProperty === "all" ? properties : activeProperty ? [activeProperty] : properties;

  const moveCalendar = (direction) => {
    if (calendarView === "month") return setFocusDate(new Date(focusDate.getFullYear(), focusDate.getMonth() + direction, 1, 12));
    setFocusDate(addDays(focusDate, direction * (calendarView === "week" ? 7 : 1)));
  };

  const rangeLabel = calendarView === "month" ? monthLabel(focusDate) : calendarView === "week" ? weekLabel(focusDate) : longDate(keyForDate(focusDate));

  function saveBooking(booking) {
    const property = properties.find((item) => item.id === booking.property);
    const dateError = propertyDateError(property, booking.date);
    if (dateError) return dateError;
    const conflict = bookings.find((item) => bookingsConflict(item, booking));
    if (conflict) return `${property?.name} already has ${conflict.client} (${slotLabel(conflict.slot)}) on this date.`;
    setBookings((current) => [...current, { ...booking, id: Date.now() }]);
    setFocusDate(new Date(`${booking.date}T12:00:00`));
    setBookingModal(null);
    notify(`Booking added for ${booking.client}.`);
    return "";
  }

  return <section className="page-body">
    <div className="page-heading"><div><p className="eyebrow">{selectedProperty === "all" ? "ALL PROPERTIES" : "PROPERTY CALENDAR"}</p><h1>{activeProperty?.name || "Your venue calendar"}</h1><p>{activeProperty ? `${activeProperty.capacity.toLocaleString("en-IN")} guests · ${activeProperty.area}, ${activeProperty.city}` : "A clear view of what’s booked, held, and still open."}</p></div><div className="heading-actions"><div className="availability-key"><span><i className="status-dot booked-dot" />Booked</span><span><i className="status-dot hold-dot" />On hold</span></div><button className="primary-button" onClick={() => setBookingModal({ date: "" })}>＋ New booking</button></div></div>
    <div className={`metrics-grid ${shownProperties.length === 1 ? "single-metric" : ""}`}>{shownProperties.map((property) => {
      const days = new Date(focusDate.getFullYear(), focusDate.getMonth() + 1, 0).getDate();
      const monthDates = Array.from({ length: days }, (_, index) => `${monthPrefix}-${String(index + 1).padStart(2, "0")}`);
      const available = monthDates.filter((date) => isPropertyAvailable(property, date, bookings)).length;
      const reserved = new Set(bookings.filter((booking) => booking.property === property.id && booking.date.startsWith(monthPrefix)).map((booking) => booking.date)).size;
      return <article className="metric-card" key={property.id} style={{ "--property-color": property.color }}><div className="metric-top"><span className="metric-property"><i className="property-dot" style={{ background: property.color }} />{property.name}</span><span className={`metric-status ${available ? "" : "closed"}`}>● {available ? "accepting bookings" : "no open dates"}</span></div><strong>{available} days available</strong><small>{reserved} reserved {reserved === 1 ? "date" : "dates"} in {monthLabel(focusDate)}</small></article>;
    })}</div>
    <section className="calendar-card">
      <div className="calendar-view-bar" aria-label="Calendar view">{CALENDAR_VIEWS.map((view) => <button key={view} className={calendarView === view ? "active" : ""} onClick={() => setCalendarView(view)}>{view[0].toUpperCase() + view.slice(1)}</button>)}</div>
      <div className="calendar-toolbar"><div className="month-navigation"><button className="month-arrow" aria-label={`Previous ${calendarView}`} onClick={() => moveCalendar(-1)}>‹</button><h2>{rangeLabel}</h2><button className="month-arrow" aria-label={`Next ${calendarView}`} onClick={() => moveCalendar(1)}>›</button><button className="small-button" onClick={() => setFocusDate(new Date())}>Today</button></div><label className="property-select-wrap"><i className="select-dot" style={{ background: activeProperty?.color || "#777" }} /><select aria-label="Choose a property" value={selectedProperty} onChange={(event) => setSelectedProperty(event.target.value)}><option value="all">All properties</option>{properties.map((property) => <option value={property.id} key={property.id}>{property.name}</option>)}</select></label></div>
      {calendarView === "month" && <CalendarGrid currentMonth={focusDate} properties={properties} bookings={bookings} selectedProperty={selectedProperty} onSelectDate={setDrawerDate} />}
      {calendarView === "week" && <WeekCalendar focusDate={focusDate} properties={properties} bookings={bookings} selectedProperty={selectedProperty} onSelectDate={setDrawerDate} />}
      {calendarView === "day" && <DayCalendar focusDate={focusDate} properties={shownProperties} bookings={bookings} onSelectDate={setDrawerDate} onAddBooking={(property) => setBookingModal({ date: keyForDate(focusDate), property })} />}
    </section>
    {bookingModal && <BookingModal properties={properties} selectedProperty={bookingModal.property || selectedProperty} defaultDate={bookingModal.date} onClose={() => setBookingModal(null)} onSave={saveBooking} />}
    {drawerDate && <DayDrawer date={drawerDate} properties={properties} bookings={bookings} selectedProperty={selectedProperty} onClose={() => setDrawerDate("")} onAdd={() => { setDrawerDate(""); setBookingModal({ date: drawerDate }); }} />}
  </section>;
}
