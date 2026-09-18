import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { DeskHours } from './DeskHours'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-mark">
            <Logo />
          </div>
          <p className="footer-lede">
            Planned Rwanda, walked with people you have not met yet. Kigali-born. Circle-sized.
          </p>
        </div>
        <div>
          <p className="footer-label">Walk</p>
          <Link to="/tours">Departures</Link>
          <Link to="/destinations">Land</Link>
          <Link to="/album">Photo album</Link>
          <Link to="/activities">Activities</Link>
          <Link to="/circles">Who is going</Link>
        </div>
        <div>
          <p className="footer-label">House</p>
          <Link to="/membership">Membership</Link>
          <Link to="/about">How it works</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/gisubizo">Gisubizo</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/tickets">Your tickets</Link>
          <a href="mailto:circle@hamwe.rw">circle@hamwe.rw</a>
        </div>
        <div>
          <p className="footer-label">On the ground</p>
          <p>KN 5 Rd, Kiyovu</p>
          <p>Kigali, Rwanda</p>
          <p>+250 788 000 214</p>
          <DeskHours compact />
        </div>
      </div>
      <div className="footer-bar">
        <span>© {new Date().getFullYear()} Hamwe Collectives</span>
        <span>Fares in FRw. Demo payments — no live MoMo or card charge.</span>
      </div>
    </footer>
  )
}
