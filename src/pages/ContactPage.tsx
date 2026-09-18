import { type FormEvent, useState } from 'react'
import { DeskHours } from '../components/DeskHours'

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const payload = { name, email, message, at: new Date().toISOString() }
    const current = JSON.parse(localStorage.getItem('hamwe-mail') ?? '[]') as unknown[]
    localStorage.setItem('hamwe-mail', JSON.stringify([payload, ...current]))
    setSent(true)
  }

  return (
    <div className="page-pad">
      <header className="page-hero">
        <p className="eyebrow">Host · Kigali</p>
        <h1>Write the house.</h1>
        <p className="lede">
          Aline and the circle desk sit on KN 5 Rd, Kiyovu. Dietary notes, permit questions, late
          landings — send them here.
        </p>
      </header>
      <div className="contact-grid">
        <form className="checkout-form" onSubmit={onSubmit}>
          {sent ? (
            <p className="lede">Received on this demo desk. In production it would reach circle@hamwe.rw.</p>
          ) : (
            <>
              <label>
                Name
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>
              <label>
                Email
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <label>
                Message
                <textarea rows={6} value={message} onChange={(event) => setMessage(event.target.value)} required />
              </label>
              <button className="btn btn-primary" type="submit">
                Send to the host
              </button>
            </>
          )}
        </form>
        <aside className="buy-panel">
          <p className="footer-label">On the ground</p>
          <p>KN 5 Rd, Kiyovu</p>
          <p>Kigali, Rwanda</p>
          <p>+250 788 000 214</p>
          <p>
            <a href="mailto:circle@hamwe.rw">circle@hamwe.rw</a>
          </p>
          <DeskHours />
        </aside>
      </div>
    </div>
  )
}
