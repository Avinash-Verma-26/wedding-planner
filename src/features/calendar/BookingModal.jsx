import { useState } from "react";
import { EVENT_TYPES } from "../../constants.js";
import { TODAY } from "../../utils/date.js";
import { Modal } from "../../components/shared/Modal.jsx";

export function BookingModal({ properties, selectedProperty, defaultDate, onClose, onSave }) {
  const [form, setForm] = useState({ client: "", property: selectedProperty === "all" ? properties[0]?.id : selectedProperty, event: "Wedding", date: defaultDate || TODAY, slot: "full", amount: "", status: "hold" });
  const [error, setError] = useState("");
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    setError(onSave({ ...form, amount: Number(String(form.amount).replace(/[^0-9]/g, "")) || 0 }));
  };

  return <Modal eyebrow="NEW RESERVATION" title="Add a booking" subtitle="Reserve a date and keep every property in sync." onClose={onClose}>
    <form onSubmit={submit}><div className="form-grid"><label className="full-field">Couple / client name<input required autoFocus placeholder="e.g. Riya & Karan" value={form.client} onChange={(event) => change("client", event.target.value)} /></label><label>Property<select value={form.property} onChange={(event) => change("property", event.target.value)}>{properties.map((property) => <option value={property.id} key={property.id}>{property.name}</option>)}</select></label><label>Event<select value={form.event} onChange={(event) => change("event", event.target.value)}>{EVENT_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label><label>Date<input required type="date" value={form.date} onChange={(event) => change("date", event.target.value)} /></label><label>Slot<select value={form.slot} onChange={(event) => change("slot", event.target.value)}><option value="full">Full day</option><option value="morning">Morning</option><option value="evening">Evening</option></select></label><label>Booking amount<span className="currency-input"><i>₹</i><input inputMode="numeric" placeholder="2,50,000" value={form.amount} onChange={(event) => change("amount", event.target.value)} /></span></label><label>Status<select value={form.status} onChange={(event) => change("status", event.target.value)}><option value="hold">On hold</option><option value="booked">Booked</option></select></label></div><p className="form-error" role="alert">{error}</p><div className="modal-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">Save booking</button></div></form>
  </Modal>;
}
