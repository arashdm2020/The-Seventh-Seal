export const GAME_TIME_ZONE = "Asia/Tehran";
export function dateSeedFromDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    throw new Error("Invalid calendar date.");
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (
    !Number.isFinite(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  )
    throw new Error("Invalid calendar date.");
  return Math.floor(parsed.getTime() / 86400000);
}
export function authoritativeCalendar(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: GAME_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = (type) => parts.find((part) => part.type === type).value;
  const date = `${value("year")}-${value("month")}-${value("day")}`;
  return { date, dateSeed: dateSeedFromDate(date) };
}
export function calendarLabel(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
