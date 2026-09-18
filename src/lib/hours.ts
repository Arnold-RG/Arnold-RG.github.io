export const OFFICE_HOURS = {
  zone: 'Africa/Kigali',
  days: 'Monday–Friday',
  open: '08:00',
  close: '18:00',
  lunchStart: '12:00',
  lunchEnd: '13:30',
  closed: 'Saturday and Sunday',
  label: 'Mon–Fri 08:00–18:00 · Lunch 12:00–13:30 CAT',
} as const

export const OFFICE_ADDRESS = {
  building: 'Ikaze House',
  street: 'KG 11 Ave',
  area: 'Kisimenti',
  city: 'Kigali, Rwanda',
  line: 'Ikaze House, KG 11 Ave, Kisimenti',
  full: 'Ikaze House, KG 11 Ave, Kisimenti, Kigali',
} as const

export const OFFICE_PHONE = {
  display: '+250 794 607 518',
  tel: '+250794607518',
  local: '0794 607 518',
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

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function kigaliParts(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: OFFICE_HOURS.zone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''

  return {
    weekday: WEEKDAY[read('weekday')] ?? 0,
    hour: Number(read('hour')),
    minute: Number(read('minute')),
    second: Number(read('second')),
  }
}

const OPEN_SEC = 8 * 3600
const LUNCH_START_SEC = 12 * 3600
const LUNCH_END_SEC = 13 * 3600 + 30 * 60
const CLOSE_SEC = 18 * 3600
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export type OfficeState = 'open' | 'lunch' | 'closed'

export interface OfficeCountdown {
  open: boolean
  lunch: boolean
  state: OfficeState
  weAre: string
  hours: number
  minutes: number
  seconds: number
  remainingSec: number
  headline: string
  targetLabel: string
  clock: string
  hoursLabel: string
}

function weAreLabel(state: OfficeState): string {
  if (state === 'open') return 'We are open'
  if (state === 'lunch') return 'We are on lunch'
  return 'We are closed'
}

function officeState(weekday: number, nowSec: number): OfficeState {
  const weekdayDesk = weekday >= 1 && weekday <= 5
  if (!weekdayDesk || nowSec < OPEN_SEC || nowSec >= CLOSE_SEC) return 'closed'
  if (nowSec >= LUNCH_START_SEC && nowSec < LUNCH_END_SEC) return 'lunch'
  return 'open'
}

export function getOfficeCountdown(now = new Date()): OfficeCountdown {
  const { weekday, hour, minute, second } = kigaliParts(now)
  const nowSec = hour * 3600 + minute * 60 + second
  const weekdayDesk = weekday >= 1 && weekday <= 5
  const state = officeState(weekday, nowSec)
  const open = state === 'open'
  const lunch = state === 'lunch'

  let remaining = 0
  let headline = 'Opens in'
  let targetLabel = 'Monday 08:00 CAT'

  if (open && nowSec < LUNCH_START_SEC) {
    remaining = LUNCH_START_SEC - nowSec
    headline = 'Closes in'
    targetLabel = 'Lunch 12:00 CAT'
  } else if (open) {
    remaining = CLOSE_SEC - nowSec
    headline = 'Closes in'
    targetLabel = 'Today 18:00 CAT'
  } else if (lunch) {
    remaining = LUNCH_END_SEC - nowSec
    headline = 'Opens in'
    targetLabel = 'Today 13:30 CAT'
  } else if (weekdayDesk && nowSec < OPEN_SEC) {
    remaining = OPEN_SEC - nowSec
    headline = 'Opens in'
    targetLabel = 'Today 08:00 CAT'
  } else {
    let daysAhead = 1
    if (weekday === 5 && nowSec >= CLOSE_SEC) daysAhead = 3
    else if (weekday === 6) daysAhead = 2
    else if (weekday === 0) daysAhead = 1
    remaining = 86400 - nowSec + (daysAhead - 1) * 86400 + OPEN_SEC
    headline = 'Opens in'
    const targetDay = (weekday + daysAhead) % 7
    targetLabel = daysAhead === 1 ? 'Tomorrow 08:00 CAT' : `${DAY_NAMES[targetDay]} 08:00 CAT`
  }

  remaining = Math.max(0, remaining)
  const hours = Math.floor(remaining / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  const seconds = remaining % 60

  return {
    open,
    lunch,
    state,
    weAre: weAreLabel(state),
    hours,
    minutes,
    seconds,
    remainingSec: remaining,
    headline,
    targetLabel,
    clock: `${pad(hour)}:${pad(minute)}:${pad(second)} CAT`,
    hoursLabel: OFFICE_HOURS.label,
  }
}

export function getDeskStatus(now = new Date()) {
  const countdown = getOfficeCountdown(now)

  return {
    open: countdown.open,
    lunch: countdown.lunch,
    state: countdown.state,
    weAre: countdown.weAre,
    hoursLabel: countdown.hoursLabel,
    nextLine: `${countdown.headline} ${countdown.targetLabel}`,
    closedWeekends: true,
  }
}
