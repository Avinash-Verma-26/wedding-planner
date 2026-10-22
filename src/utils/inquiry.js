function publicPropertySnapshot(property) {
  return {
    id: property.id,
    name: property.name,
    city: property.city,
    area: property.area,
    capacity: property.capacity,
    services: property.services,
    bookingOpen: property.bookingOpen,
    bookingClose: property.bookingClose,
    color: property.color,
  };
}

function validSnapshot(value, expectedId) {
  if (!value || typeof value !== "object" || value.id !== expectedId) return null;
  if (![value.id, value.name, value.city, value.area].every((item) => typeof item === "string" && item)) return null;
  if (!Number.isFinite(Number(value.capacity)) || !Array.isArray(value.services)) return null;

  return {
    id: value.id,
    name: value.name,
    city: value.city,
    area: value.area,
    capacity: Number(value.capacity),
    services: value.services.filter((service) => typeof service === "string"),
    bookingOpen: typeof value.bookingOpen === "string" ? value.bookingOpen : "",
    bookingClose: typeof value.bookingClose === "string" ? value.bookingClose : "",
    color: typeof value.color === "string" ? value.color : "#aa4e39",
  };
}

export function buildInquiryUrl(property, currentUrl = window.location.href) {
  const url = new URL(currentUrl);
  url.search = "";
  url.hash = "";
  url.searchParams.set("inquiry", property.id);
  url.searchParams.set("venue", JSON.stringify(publicPropertySnapshot(property)));
  return url.toString();
}

export function resolveInquiryProperty(search, properties) {
  const params = new URLSearchParams(search);
  const propertyId = params.get("inquiry");
  if (!propertyId) return null;

  const encodedSnapshot = params.get("venue");
  if (encodedSnapshot) {
    try {
      const snapshot = validSnapshot(JSON.parse(encodedSnapshot), propertyId);
      if (snapshot) return snapshot;
    } catch {
      // Fall back to a property already available in this browser.
    }
  }

  return properties.find((property) => property.id === propertyId) || null;
}
