import { NavLink } from 'react-router-dom'

export function Logo() {
  return (
    <NavLink to="/" className="brand-logo-link" aria-label="Hamwe Tourism home">
      <img
        className="brand-logo"
        src="/brand/hamwe-logo-lockup.png"
        alt="Hamwe Tourism"
        width={1048}
        height={323}
        decoding="async"
      />
    </NavLink>
  )
}
