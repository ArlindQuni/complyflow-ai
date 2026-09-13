export const DEMO_TODAY = new Date("2026-09-13T12:00:00.000Z");

export function fmtDate(value?: string | undefined) {
  if (!value) return "Not stated";
  const d = new Date(value.length === 10 ? `${value}T12:00:00.000Z` : value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function fmtDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function daysUntil(value?: string | undefined) {
  if (!value) return null;
  const d = new Date(value.length === 10 ? `${value}T12:00:00.000Z` : value);
  if (Number.isNaN(d.getTime())) return null;
  return Math.round((d.getTime() - DEMO_TODAY.getTime()) / 86_400_000);
}

export function dueLabel(value?: string | undefined) {
  const days = daysUntil(value);
  if (days === null) return "No date";
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Due today";
  return `in ${days}d`;
}
