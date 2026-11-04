// Petites aides de dates en heure locale (format « YYYY-MM-DD »), sans dépendance.

export function parseDay(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toDay(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(day: string, n: number) {
  const date = parseDay(day);
  date.setDate(date.getDate() + n);
  return toDay(date);
}

export function addMinutes(iso: string, minutes: number) {
  const date = new Date(iso);
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}

export const fmtDayLong = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });
export const fmtDayShort = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric" });
export const fmtDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long" });
export const fmtTime = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" });

// Lundi de la semaine qui contient ce jour.
export function startOfWeek(day: string) {
  const date = parseDay(day);
  const offset = (date.getDay() + 6) % 7;
  return addDays(day, -offset);
}

// Numéro de semaine ISO 8601.
export function isoWeek(day: string) {
  const date = parseDay(day);
  const thursday = new Date(date);
  thursday.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const firstThursday = new Date(thursday.getFullYear(), 0, 4);
  return 1 + Math.round(((thursday.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7);
}

// 42 jours (6 semaines) pour afficher un mois en grille, en commençant un lundi.
export function monthGrid(month: string) {
  const first = `${month}-01`;
  const start = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export const fmtMonth = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
export const fmtWeekday = new Intl.DateTimeFormat("fr-FR", { weekday: "long" });
export const fmtMonthName = new Intl.DateTimeFormat("fr-FR", { month: "long" });
export const fmtWeekdayShort = new Intl.DateTimeFormat("fr-FR", { weekday: "short" });
