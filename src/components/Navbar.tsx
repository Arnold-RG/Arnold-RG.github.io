import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useBooking } from '../context/BookingContext'
import { Logo } from './Logo'

const links = [
  { to: '/tours', label: 'Departures' },
  { to: '/destinations', label: 'Land' },
  { to: '/album', label: 'Album' },
  { to: '/activities', label: 'Activities' },
  { to: '/membership', label: 'Membership' },
  { to: '/circles', label: 'Circles' },
  { to: '/tickets', label: 'Tickets' },
]

export function Navbar() {
  const { cart, tickets } = useBooking()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav-solid' : ''} ${open ? 'nav-open' : ''}`}>
      <Logo />

      <nav className={`nav-links ${open ? 'open' : ''}`}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={`nav-link${link.to === '/tickets' ? ' nav-link-mobile' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-end">
        <NavLink to="/tickets" className="ghost-link">
          Tickets{tickets.length ? ` (${tickets.length})` : ''}
        </NavLink>
        <NavLink to={cart ? '/checkout' : '/tours'} className="nav-cta">
          {cart ? 'Checkout' : 'Buy a seat'}
        </NavLink>
        <button
          className={`menu-btn ${open ? 'open' : ''}`}
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
