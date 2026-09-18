export const OFFICE_HOURS = {
  zone: 'Africa/Kigali',
  days: 'Monday–Friday',
  open: '08:00',
  close: '18:00',
  closed: 'Saturday and Sunday',
  label: 'Mon–Fri 08:00–18:00 CAT',
} as const

const WEEKDAY: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 0,
}

function kigaliParts(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: OFFICE_HOURS.zone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''

  return {
    weekday: WEEKDAY[read('weekday')] ?? 0,
    hour: Number(read('hour')),
    minute: Number(read('minute')),
  }
}

export function getDeskStatus(now = new Date()) {
  const { weekday, hour } = kigaliParts(now)
  const weekdayOpen = weekday >= 1 && weekday <= 5
  const open = weekdayOpen && hour >= 8 && hour < 18

  let nextLine = 'Opens Monday 08:00 CAT'
  if (open) nextLine = 'Closes 18:00 CAT'
  else if (weekdayOpen && hour < 8) nextLine = 'Opens today 08:00 CAT'
  else if (weekday >= 1 && weekday <= 4) nextLine = 'Opens tomorrow 08:00 CAT'

  return {
    open,
    hoursLabel: OFFICE_HOURS.label,
    nextLine,
    closedWeekends: true,
  }
}
