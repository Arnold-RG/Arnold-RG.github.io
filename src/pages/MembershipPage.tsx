import { useNavigate } from 'react-router-dom'
import { memberships } from '../data'
import { Price } from '../components/Price'
import { useBooking } from '../context/BookingContext'

export function MembershipPage() {
  const { setCart } = useBooking()
  const navigate = useNavigate()

  const buy = (id: string) => {
    const start = new Date()
    const iso = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`
    setCart({
      kind: 'membership',
      itemId: id,
      departureDate: iso,
      travelers: 1,
      joinCircle: true,
    })
    navigate('/checkout')
  }

  return (
    <div className="page-pad">
      <header className="page-hero">
        <p className="eyebrow">Membership · Circle pass</p>
        <h1>Stay in the circle after the ticket.</h1>
        <p className="lede">
          Tours remain one-off fares — gorilla permits and lodges cannot be a subscription. A Circle
          pass is the layer on top: first seats, activity rates, and the Kigali table.
        </p>
      </header>
      <div className="plan-grid">
        {memberships.map((plan) => (
          <article key={plan.id} className={`plan-card ${plan.highlighted ? 'is-featured' : ''}`}>
            <p className="mono-meta">{plan.period === 'month' ? 'Monthly' : 'Yearly'}</p>
            <h2>{plan.name}</h2>
            <p>{plan.tagline}</p>
            <p className="price">
              <Price usd={plan.priceUsd} size="l" />
            </p>
            <ul className="plain-list">
              {plan.perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
            <button className="btn btn-primary btn-block" type="button" onClick={() => buy(plan.id)}>
              Subscribe in FRw
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
