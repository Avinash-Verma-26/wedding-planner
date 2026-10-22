import { useState } from "react";
import { EVENT_TYPES } from "../../constants.js";
import { getPropertyDetails } from "../../data/propertyDetails.js";
import { shortDate, TODAY } from "../../utils/date.js";
import { PropertyGallery } from "../properties/PropertyGallery.jsx";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  eventType: "Wedding",
  eventDate: "",
  guests: "",
  message: "",
};

export function InquiryPage({ property, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!property) {
    return <main className="inquiry-unavailable"><span className="brand-mark">मं</span><p className="eyebrow">PRIVATE VENUE LINK</p><h1>This inquiry link is unavailable</h1><p>Ask your venue manager to send you a new link.</p></main>;
  }

  const details = getPropertyDetails(property);

  function change(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.email.trim() && !form.phone.trim()) return setError("Please add an email address or phone number.");
    if (!form.eventDate) return setError("Please choose a preferred event date.");
    if (form.guests && Number(form.guests) < 1) return setError("Guest count must be at least 1.");

    onSubmit({ ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() });
    setSubmitted(true);
  }

  return <div className="inquiry-page">
    <header className="inquiry-header"><div className="inquiry-brand"><span className="brand-mark">मं</span><span><strong>Mandap</strong><small>venue inquiry</small></span></div><span>Shared by Aditya Bagai · Venue Manager</span></header>

    <main>
      <section className={`inquiry-hero ${details.image ? "has-image" : ""}`} style={details.image ? { backgroundImage: `linear-gradient(90deg, rgba(28, 25, 22, .78), rgba(28, 25, 22, .16)), url(${details.image})` } : { "--property-color": property.color }}>
        <div><p className="eyebrow">A VENUE SELECTED FOR YOU</p><h1>{property.name}</h1><p>{details.tagline}</p><div className="inquiry-hero-facts"><span><strong>{property.capacity.toLocaleString("en-IN")}</strong> guest capacity</span><span><strong>{property.area}</strong> {property.city}</span><span><strong>{details.setting}</strong> venue style</span></div><a className="primary-button inquiry-hero-button" href="#send-inquiry">Enquire about this venue ↓</a></div>
      </section>

      <div className="inquiry-layout">
        <div className="inquiry-content">
          <section className="inquiry-section"><p className="eyebrow">THE VENUE</p><h2>A setting for your celebration</h2><p className="inquiry-description">{details.description}</p><div className="inquiry-spaces">{details.spaces.map((space) => <span key={space}>✓ {space}</span>)}</div></section>
          <section className="inquiry-section"><div className="section-heading"><div><p className="eyebrow">GALLERY</p><h2>Picture your day here</h2></div></div><PropertyGallery property={property} details={details} /></section>
          <section className="inquiry-section inquiry-inclusions"><p className="eyebrow">AT A GLANCE</p><h2>Venue details</h2><div><span><small>Location</small><strong>{property.area}, {property.city}</strong></span><span><small>Capacity</small><strong>Up to {property.capacity.toLocaleString("en-IN")} guests</strong></span><span><small>Booking season</small><strong>{shortDate(property.bookingOpen)} — {shortDate(property.bookingClose)}</strong></span></div><div className="inquiry-services">{property.services.map((service) => <span key={service}>{service}</span>)}</div></section>
        </div>

        <aside className="inquiry-form-card" id="send-inquiry">
          {submitted ? <div className="inquiry-success" role="status"><span>✓</span><p className="eyebrow">INQUIRY SUBMITTED</p><h2>Thank you, {form.name.split(" ")[0]}.</h2><p>Your details for {property.name} have been saved. Aditya can follow up using the contact information you provided.</p></div> : <>
            <p className="eyebrow">START A CONVERSATION</p><h2>Tell us about your event</h2><p className="inquiry-form-intro">Share a few details and Aditya will help you plan the next step.</p>
            <form onSubmit={submit}>
              <label>Full name<input required autoComplete="name" placeholder="Your name" value={form.name} onChange={(event) => change("name", event.target.value)} /></label>
              <div className="inquiry-form-row"><label>Email<input type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(event) => change("email", event.target.value)} /></label><label>Phone<input type="tel" autoComplete="tel" placeholder="+91" value={form.phone} onChange={(event) => change("phone", event.target.value)} /></label></div>
              <div className="inquiry-form-row"><label>Event type<select value={form.eventType} onChange={(event) => change("eventType", event.target.value)}>{EVENT_TYPES.map((type) => <option key={type}>{type}</option>)}<option>Other celebration</option></select></label><label>Preferred date<input required type="date" min={TODAY} value={form.eventDate} onChange={(event) => change("eventDate", event.target.value)} /></label></div>
              <label>Estimated guests<input type="number" min="1" max={property.capacity} placeholder={`Up to ${property.capacity.toLocaleString("en-IN")}`} value={form.guests} onChange={(event) => change("guests", event.target.value)} /></label>
              <label>Anything else we should know?<textarea rows="4" placeholder="Tell us about your plans, timings, or questions." value={form.message} onChange={(event) => change("message", event.target.value)} /></label>
              <p className="form-error" role="alert">{error}</p>
              <button className="primary-button inquiry-submit" type="submit">Submit inquiry →</button>
              <small className="inquiry-privacy">Your details are used only to respond to this venue inquiry.</small>
            </form>
          </>}
        </aside>
      </div>
    </main>
    <footer className="inquiry-footer">Mandap · Thoughtful venues for unforgettable celebrations</footer>
  </div>;
}
