import { useRef, useState } from "react";
import { Sidebar } from "./components/layout/Sidebar.jsx";
import { Topbar } from "./components/layout/Topbar.jsx";
import { CalendarPage } from "./features/calendar/CalendarPage.jsx";
import { InquiryPage } from "./features/inquiries/InquiryPage.jsx";
import { PropertiesPage } from "./features/properties/PropertiesPage.jsx";
import { PropertyDetailPage } from "./features/properties/PropertyDetailPage.jsx";
import { useStoredState } from "./hooks/useStoredState.js";
import { DEFAULT_BOOKINGS, DEFAULT_PROPERTIES } from "./data/defaultData.js";
import { resolveInquiryProperty } from "./utils/inquiry.js";

export default function App() {
  const [page, setPage] = useState("calendar");
  const [properties, setProperties] = useStoredState("mandap-react-properties", DEFAULT_PROPERTIES);
  const [bookings, setBookings] = useStoredState("mandap-react-bookings", DEFAULT_BOOKINGS);
  const [, setInquiries] = useStoredState("mandap-react-inquiries", []);
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [detailPropertyId, setDetailPropertyId] = useState("");
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  function notify(message) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }

  function openPropertyCalendar(id) {
    setSelectedProperty(id);
    setPage("calendar");
  }

  function openPropertyDetail(id) {
    setDetailPropertyId(id);
    setPage("property");
  }

  const detailProperty = properties.find((property) => property.id === detailPropertyId);
  const hasInquiryLink = new URLSearchParams(window.location.search).has("inquiry");
  const inquiryProperty = hasInquiryLink ? resolveInquiryProperty(window.location.search, properties) : null;

  function submitInquiry(inquiry) {
    setInquiries((current) => [...current, {
      ...inquiry,
      id: globalThis.crypto?.randomUUID?.() || `inquiry-${Date.now()}`,
      property: inquiryProperty.id,
      propertyName: inquiryProperty.name,
      submittedAt: new Date().toISOString(),
    }]);
  }

  if (hasInquiryLink) return <InquiryPage property={inquiryProperty} onSubmit={submitInquiry} />;

  return <div className="app-shell">
    <Sidebar page={page} setPage={setPage} properties={properties} selectedProperty={selectedProperty} setSelectedProperty={setSelectedProperty} />
    <main className="main-content">
      <Topbar page={page} setPage={setPage} />
      {page === "calendar" && <CalendarPage properties={properties} bookings={bookings} setBookings={setBookings} selectedProperty={selectedProperty} setSelectedProperty={setSelectedProperty} notify={notify} />}
      {page === "properties" && <PropertiesPage properties={properties} setProperties={setProperties} bookings={bookings} openPropertyDetail={openPropertyDetail} openPropertyCalendar={openPropertyCalendar} notify={notify} />}
      {page === "property" && detailProperty && <PropertyDetailPage property={detailProperty} bookings={bookings} onBack={() => setPage("properties")} onCalendar={() => openPropertyCalendar(detailProperty.id)} notify={notify} />}
    </main>
    <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
  </div>;
}
