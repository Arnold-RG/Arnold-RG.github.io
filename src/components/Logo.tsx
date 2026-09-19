import { NavLink } from 'react-router-dom'

export function Logo() {
  return (
    <NavLink to="/" className="brand-logo-link" aria-label="Hamwe Tourism home">
      <img
        className="brand-logo"
        src="/brand/hamwe-logo-lockup.png?v=tourism"
        alt="Hamwe Tourism"
        width={1246}
        height={408}
        decoding="async"
      />
    </NavLink>
  )
}
