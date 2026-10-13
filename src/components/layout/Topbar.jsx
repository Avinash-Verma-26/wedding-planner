export function Topbar({ page, setPage }) {
  return <header className="topbar">
    <div className="mobile-brand"><span className="brand-mark">मं</span><strong>Mandap</strong></div>
    <div className="mobile-tabs"><button className={page === "calendar" ? "active" : ""} onClick={() => setPage("calendar")}>Calendar</button><button className={page !== "calendar" ? "active" : ""} onClick={() => setPage("properties")}>Properties</button></div>
    <div className="topbar-actions"><span className="live-pill"><i /> Demo workspace</span><button className="avatar-button">AK</button></div>
  </header>;
}
