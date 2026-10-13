import { shortDate } from "./date.js";

export const rupees = (value) => value
  ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value)
  : "Amount not added";

export const slotLabel = (slot) => ({ full: "Full day", morning: "Morning", evening: "Evening" }[slot]);

export function isPropertyAvailable(property, date, bookings) {
  if (!date) return true;
  if (property.bookingOpen && date < property.bookingOpen) return false;
  if (property.bookingClose && date > property.bookingClose) return false;
  if (property.blackoutStart && property.blackoutEnd && date >= property.blackoutStart && date <= property.blackoutEnd) return false;
  return !bookings.some((booking) => booking.property === property.id && booking.date === date);
}

export function propertyDateError(property, date) {
  if (!property || !date) return "Choose a property and date.";
  if (property.bookingOpen && date < property.bookingOpen) return `${property.name} only accepts bookings from ${shortDate(property.bookingOpen)}.`;
  if (property.bookingClose && date > property.bookingClose) return `${property.name} only accepts bookings until ${shortDate(property.bookingClose)}.`;
  if (property.blackoutStart && property.blackoutEnd && date >= property.blackoutStart && date <= property.blackoutEnd) {
    return `${property.name} is closed on this date${property.blackoutReason ? ` for ${property.blackoutReason.toLowerCase()}` : ""}.`;
  }
  return "";
}

export const bookingsConflict = (existing, proposed) => existing.property === proposed.property &&
  existing.date === proposed.date &&
  (existing.slot === "full" || proposed.slot === "full" || existing.slot === proposed.slot);
