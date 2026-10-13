import { useState } from "react";
import { COLORS, SERVICES } from "../../constants.js";
import { Modal } from "../../components/shared/Modal.jsx";

export function PropertyModal({ property, properties, onClose, onSave }) {
  const [form, setForm] = useState(property || { id: "", name: "", city: "", area: "", capacity: "", services: [], bookingOpen: "", bookingClose: "", blackoutStart: "", blackoutEnd: "", blackoutReason: "", color: COLORS[properties.length % COLORS.length] });
  const [error, setError] = useState("");
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleService = (service) => change("services", form.services.includes(service) ? form.services.filter((item) => item !== service) : [...form.services, service]);

  const submit = (event) => {
    event.preventDefault();
    if (form.bookingOpen && form.bookingClose && form.bookingOpen > form.bookingClose) return setError("The booking close date must be after the opening date.");
    if ((form.blackoutStart && !form.blackoutEnd) || (!form.blackoutStart && form.blackoutEnd)) return setError("Add both start and end dates for the closure.");
    if (form.blackoutStart && form.blackoutEnd && form.blackoutStart > form.blackoutEnd) return setError("The closure end date must be after the start date.");
    const id = form.id || `${form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now().toString().slice(-4)}`;
    onSave({ ...form, id, capacity: Number(form.capacity) });
  };

  return <Modal eyebrow={property ? "EDIT PROPERTY" : "NEW PROPERTY"} title={property ? property.name : "Add a property"} subtitle="Details used for availability matching and bookings." onClose={onClose} wide>
    <form onSubmit={submit}><div className="form-grid"><label className="full-field">Property name<input required autoFocus placeholder="e.g. Noor Mahal Lawns" value={form.name} onChange={(event) => change("name", event.target.value)} /></label><label>City<input required placeholder="e.g. Jaipur" value={form.city} onChange={(event) => change("city", event.target.value)} /></label><label>Area / locality<input required placeholder="e.g. Amer Road" value={form.area} onChange={(event) => change("area", event.target.value)} /></label><label>Maximum capacity<input required min="1" type="number" placeholder="e.g. 800" value={form.capacity} onChange={(event) => change("capacity", event.target.value)} /></label><label>Calendar colour<div className="colour-options">{COLORS.map((color) => <button key={color} type="button" aria-label={`Use colour ${color}`} className={form.color === color ? "selected" : ""} style={{ background: color }} onClick={() => change("color", color)} />)}</div></label></div><fieldset className="services-field"><legend>Services provided</legend><div className="service-options">{SERVICES.map((service) => <label key={service} className={form.services.includes(service) ? "checked" : ""}><input type="checkbox" checked={form.services.includes(service)} onChange={() => toggleService(service)} /><span>✓</span>{service}</label>)}</div></fieldset><div className="form-section"><div><h3>Booking season</h3><p>Optional dates when this property accepts bookings.</p></div><div className="two-fields"><label>Opens on<input type="date" value={form.bookingOpen} onChange={(event) => change("bookingOpen", event.target.value)} /></label><label>Closes on<input type="date" value={form.bookingClose} onChange={(event) => change("bookingClose", event.target.value)} /></label></div></div><div className="form-section closure-section"><div><h3>Planned closure</h3><p>Add a maintenance or private-use block.</p></div><div className="two-fields"><label>From<input type="date" value={form.blackoutStart} onChange={(event) => change("blackoutStart", event.target.value)} /></label><label>Until<input type="date" value={form.blackoutEnd} onChange={(event) => change("blackoutEnd", event.target.value)} /></label><label className="full-field">Reason<input placeholder="e.g. Annual maintenance" value={form.blackoutReason} onChange={(event) => change("blackoutReason", event.target.value)} /></label></div></div><p className="form-error" role="alert">{error}</p><div className="modal-actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="primary-button" type="submit">{property ? "Save changes" : "Add property"}</button></div></form>
  </Modal>;
}
