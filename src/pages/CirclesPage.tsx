import { Link } from 'react-router-dom'
import { tours } from '../data'
import { compactDate } from '../lib/format'
import { Price } from '../components/Price'

export function CirclesPage() {
  return (
    <div className="page-pad">
      <header className="page-hero">
        <p className="eyebrow">Circles · mission board</p>
        <h1>Pick a departure. Meet the circle after you book.</h1>
        <p className="lede">
          Hamwe does not publish invented guest lists. After you buy a seat, the host introduces
          the people walking that date.
        </p>
      </header>

      <div className="circle-board">
        {tours.map((tour) => (
          <article key={tour.id} className="circle-card">
            <div className="circle-top">
              <img src={tour.image} alt="" />
              <div>
                <p className="mono-meta">
                  {compactDate(tour.nextDeparture)} · {tour.durationDays} days · {tour.region}
                </p>
                <h2>
                  <Link to={`/tours/${tour.slug}`}>{tour.name}</Link>
                </h2>
                <p>{tour.tagline}</p>
                <p className="price">
                  <Price usd={tour.priceUsd} />
                </p>
              </div>
            </div>
            <Link className="btn btn-ghost" to={`/tours/${tour.slug}`}>
              Take a seat
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
