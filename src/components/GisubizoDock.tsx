import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GisubizoChat } from './GisubizoChat'

export function GisubizoDock() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  if (location.pathname === '/gisubizo') return null

  return (
    <div className={`giso-dock ${open ? 'is-open' : ''}`}>
      {open ? (
        <div className="giso-panel">
          <header>
            <div>
              <p className="eyebrow">Web MCP · Rwanda</p>
              <strong>Gisubizo</strong>
            </div>
            <div className="giso-panel-actions">
              <Link to="/gisubizo">Full desk</Link>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close Gisubizo">
                Close
              </button>
            </div>
          </header>
          <GisubizoChat compact />
        </div>
      ) : null}
      <button className="giso-fab" type="button" onClick={() => setOpen((value) => !value)}>
        {open ? 'Close' : 'Gisubizo'}
      </button>
    </div>
  )
}
