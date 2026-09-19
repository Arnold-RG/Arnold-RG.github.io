import { type FormEvent, useState } from 'react'
import { DeskHours } from '../components/DeskHours'
import { OFFICE_ADDRESS, OFFICE_PHONE } from '../lib/hours'

export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [window, setWindow] = useState('')
  const [party, setParty] = useState('2')
  const [interest, setInterest] = useState('hosted-tour')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const payload = {
      name,
      email,
      window,
      party,
      interest,
      message,
      at: new Date().toISOString(),
    }
    const current = JSON.parse(localStorage.getItem('hamwe-mail') ?? '[]') as unknown[]
    localStorage.setItem('hamwe-mail', JSON.stringify([payload, ...current]))
    setSent(true)
  }

  return (
    <div className="page-pad">
      <header className="page-hero">
        <p className="eyebrow">Request · Hamwe Tourism</p>
        <h1>Request a trip, or write the house.</h1>
        <p className="lede">
          The desk sits at {OFFICE_ADDRESS.building} on {OFFICE_ADDRESS.street} in{' '}
          {OFFICE_ADDRESS.area}. Dietary notes, permit questions, late landings, or a custom window
          — send them here.
        </p>
      </header>
      <div className="contact-grid">
        <form className="checkout-form" onSubmit={onSubmit}>
          {sent ? (
            <p className="lede">
              Received on this demo desk. In production it would reach circle@hamwe.rw.
            </p>
          ) : (
            <>
              <label>
                Name
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <label>
                Travel window
                <input
                  value={window}
                  onChange={(event) => setWindow(event.target.value)}
                  placeholder="e.g. 12–24 October"
                />
              </label>
              <label>
                Party size
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={party}
                  onChange={(event) => setParty(event.target.value)}
                />
              </label>
              <label>
                What do you need
                <select value={interest} onChange={(event) => setInterest(event.target.value)}>
                  <option value="hosted-tour">A hosted tour seat</option>
                  <option value="custom">A custom itinerary</option>
                  <option value="gorillas">Gorillas and Volcanoes</option>
                  <option value="kivu">Lake Kivu and the west</option>
                  <option value="question">A question for the host</option>
                </select>
              </label>
              <label>
                Message
                <textarea
                  rows={6}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                />
              </label>
              <button className="btn btn-primary" type="submit">
                Send request
              </button>
            </>
          )}
        </form>
        <aside className="buy-panel">
          <p className="footer-label">On the ground</p>
          <p>{OFFICE_ADDRESS.building}</p>
          <p>
            {OFFICE_ADDRESS.street}, {OFFICE_ADDRESS.area}
          </p>
          <p>{OFFICE_ADDRESS.city}</p>
          <p>
            <a href={`tel:${OFFICE_PHONE.tel}`}>{OFFICE_PHONE.display}</a>
          </p>
          <p>
            <a href="mailto:circle@hamwe.rw">circle@hamwe.rw</a>
          </p>
          <DeskHours />
        </aside>
      </div>
    </div>
  )
}
