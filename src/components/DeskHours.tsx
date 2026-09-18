import { OFFICE_HOURS } from '../lib/hours'
import { useDeskStatus } from '../hooks/useDeskStatus'

export function DeskHours({ compact = false }: { compact?: boolean }) {
  const desk = useDeskStatus()

  return (
    <div className={`desk-hours is-${desk.state}`}>
      <p className="desk-hours-status">
        <span className="live-pip" />
        {desk.weAre}
      </p>
      {compact ? (
        <p>
          {OFFICE_HOURS.label}. Closed {OFFICE_HOURS.closed}.
        </p>
      ) : (
        <>
          <p>
            <strong>Mon–Fri</strong> {OFFICE_HOURS.open}–{OFFICE_HOURS.close} CAT
          </p>
          <p>
            <strong>Lunch</strong> {OFFICE_HOURS.lunchStart}–{OFFICE_HOURS.lunchEnd} CAT
          </p>
          <p>
            <strong>Saturday–Sunday</strong> closed
          </p>
          <p className="tiny">{desk.nextLine}</p>
        </>
      )}
    </div>
  )
}
