export const keyForDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const TODAY = keyForDate(new Date());

export const monthLabel = (date) => new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(date);

export const longDate = (key) => new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${key}T12:00:00`));

export const shortDate = (key) => key
  ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${key}T12:00:00`))
  : "No limit";

export const addDays = (date, amount) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount, 12);

export const startOfWeek = (date) => addDays(date, -((date.getDay() + 6) % 7));

export function weekLabel(date) {
  const start = startOfWeek(date);
  const end = addDays(start, 6);
  const day = new Intl.DateTimeFormat("en-IN", { day: "numeric" });
  const dayMonth = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
  if (start.getFullYear() !== end.getFullYear()) return `${dayMonth.format(start)} ${start.getFullYear()} – ${dayMonth.format(end)} ${end.getFullYear()}`;
  if (start.getMonth() !== end.getMonth()) return `${dayMonth.format(start)} – ${dayMonth.format(end)} ${end.getFullYear()}`;
  return `${day.format(start)}–${dayMonth.format(end)} ${end.getFullYear()}`;
}
