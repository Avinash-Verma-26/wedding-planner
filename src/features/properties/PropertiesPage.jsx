import { useMemo, useState } from "react";
import { SERVICES } from "../../constants.js";
import { isPropertyAvailable } from "../../utils/booking.js";
import { shortDate } from "../../utils/date.js";
import { PropertyCard } from "./PropertyCard.jsx";
import { PropertyModal } from "./PropertyModal.jsx";

const EMPTY_FILTERS = { search: "", city: "all", capacity: "", service: "all", date: "" };

export function PropertiesPage({ properties, setProperties, bookings, openPropertyDetail, openPropertyCalendar, notify }) {
  const [editor, setEditor] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const cities = [...new Set(properties.map((property) => property.city))].sort();
  const filtered = useMemo(() => properties.filter((property) => {
    const query = filters.search.toLowerCase();
    return (!query || `${property.name} ${property.city} ${property.area}`.toLowerCase().includes(query)) &&
      (filters.city === "all" || property.city === filters.city) &&
      (!filters.capacity || property.capacity >= Number(filters.capacity)) &&
      (filters.service === "all" || property.services.includes(filters.service)) &&
      isPropertyAvailable(property, filters.date, bookings);
  }), [properties, bookings, filters]);

  function saveProperty(property) {
    const exists = properties.some((item) => item.id === property.id);
    setProperties((current) => exists ? current.map((item) => item.id === property.id ? property : item) : [...current, property]);
    setEditor(null);
    notify(exists ? `${property.name} updated.` : `${property.name} added.`);
  }

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const clearFilters = () => setFilters(EMPTY_FILTERS);

  return <section className="page-body properties-page">
    <div className="page-heading"><div><p className="eyebrow">YOUR PORTFOLIO</p><h1>Properties</h1><p>Manage venue details and find the right space for every enquiry.</p></div><button className="primary-button" onClick={() => setEditor("new")}>＋ Add property</button></div>
    <section className="finder-card"><div className="finder-heading"><div><span className="finder-icon">⌕</span><div><h2>Find an available property</h2><p>Match capacity, services, location and date.</p></div></div>{Object.values(filters).some((value) => value && value !== "all") && <button className="text-button" onClick={clearFilters}>Clear filters</button>}</div><div className="finder-grid"><label>Search<input placeholder="Property, city or area" value={filters.search} onChange={(event) => setFilter("search", event.target.value)} /></label><label>Event date<input type="date" value={filters.date} onChange={(event) => setFilter("date", event.target.value)} /></label><label>Minimum capacity<input type="number" min="0" placeholder="e.g. 500" value={filters.capacity} onChange={(event) => setFilter("capacity", event.target.value)} /></label><label>City<select value={filters.city} onChange={(event) => setFilter("city", event.target.value)}><option value="all">All cities</option>{cities.map((city) => <option key={city}>{city}</option>)}</select></label><label>Required service<select value={filters.service} onChange={(event) => setFilter("service", event.target.value)}><option value="all">Any service</option>{SERVICES.map((service) => <option key={service}>{service}</option>)}</select></label></div></section>
    <div className="results-row"><strong>{filtered.length} {filtered.length === 1 ? "property" : "properties"}</strong><span>{filters.date ? `available on ${shortDate(filters.date)}` : "in your portfolio"} · Select a property to view its details</span></div>
    <div className="property-grid">{filtered.map((property) => <PropertyCard key={property.id} property={property} bookings={bookings} filterDate={filters.date} onEdit={() => setEditor(property)} onOpen={() => openPropertyDetail(property.id)} onCalendar={() => openPropertyCalendar(property.id)} />)}{!filtered.length && <div className="empty-results"><span>⌕</span><h3>No exact matches</h3><p>Try a different date, lower the guest count, or remove a service filter.</p><button className="secondary-button" onClick={clearFilters}>Clear all filters</button></div>}</div>
    {editor && <PropertyModal property={editor === "new" ? null : editor} properties={properties} onClose={() => setEditor(null)} onSave={saveProperty} />}
  </section>;
}
