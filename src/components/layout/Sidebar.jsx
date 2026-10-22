export function Sidebar({ page, setPage, properties, selectedProperty, setSelectedProperty }) {
  const goCalendar = (id = selectedProperty) => {
    setSelectedProperty(id);
    setPage("calendar");
  };

  return <aside className="sidebar">
    <button className="brand" onClick={() => goCalendar("all")} aria-label="Mandap home"><span className="brand-mark">मं</span><span><strong>Mandap</strong><small>venue operations</small></span></button>
    <nav className="main-nav" aria-label="Main navigation">
      <button className={`nav-item ${page === "calendar" ? "active" : ""}`} onClick={() => setPage("calendar")}><span>▦</span> Calendar</button>
      <button className={`nav-item ${page !== "calendar" ? "active" : ""}`} onClick={() => setPage("properties")}><span>⌂</span> Properties</button>
    </nav>
    <div className="sidebar-section">
      <p className="sidebar-label">CALENDARS</p>
      <button className={`property-nav ${page === "calendar" && selectedProperty === "all" ? "active" : ""}`} onClick={() => goCalendar("all")}><span>▦</span><span>All properties</span><span className="property-count">{properties.length}</span></button>
      {properties.map((property) => <button key={property.id} className={`property-nav ${page === "calendar" && selectedProperty === property.id ? "active" : ""}`} onClick={() => goCalendar(property.id)}><i className="property-dot" style={{ background: property.color }} /><span>{property.name}</span></button>)}
    </div>
    <div className="sidebar-footer"><div className="help-card"><span className="help-icon">?</span><div><strong>Demo workspace</strong><small>Saved in this browser</small></div></div><div className="user-card"><span className="avatar">AB</span><div><strong>Aditya Bagai</strong><small>Venue Manager</small></div><span className="chevron">⌄</span></div></div>
  </aside>;
}
