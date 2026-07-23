// Date helpers shared across the app. Previously lived in the mock-games seed;
// still used by the host-game form to turn a day choice into a timestamp.

// An ISO timestamp `daysFromToday` days from now, at the given local time.
export function relativeISO(daysFromToday: number, hour: number, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromToday)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

// Days from today until the next occurrence of a weekday (0=Sun … 6=Sat).
export function daysUntilWeekday(target: number): number {
  const today = new Date().getDay()
  return (target - today + 7) % 7
}
