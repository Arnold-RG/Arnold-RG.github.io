import { NavLink } from 'react-router-dom'

export function Logo() {
  return (
    <NavLink to="/" className="brand-logo-link" aria-label="Hamwe Visit Rwanda home">
      <img
        className="brand-logo"
        src="/brand/hamwe-logo-lockup.png"
        alt="Hamwe Visit Rwanda"
        width={1048}
        height={323}
        decoding="async"
      />
    </NavLink>
  )
}
