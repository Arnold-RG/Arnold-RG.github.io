import { Link } from 'react-router-dom'
import type { Tour } from '../types'
import { compactDate } from '../lib/format'
import { Price } from './Price'
import { seatsLeft } from '../data'
import { SeatMeter } from './SeatMeter'

export function TourCard({ tour }: { tour: Tour }) {
  const open = seatsLeft(tour)

  return (
    <article className="tour-card" data-reveal>
      <Link to={`/tours/${tour.slug}`} className="tour-card-media">
        <img src={tour.image} alt="" />
        <span className="chip chip-dark">{tour.region}</span>
        <span className="plate-hud" aria-hidden="true">
          {tour.cohortName}
        </span>
      </Link>
      <div className="tour-card-body">
        <p className="mono-meta">
          {compactDate(tour.nextDeparture)} · {tour.durationDays} days · {tour.cohortName}
        </p>
        <h3>
          <Link to={`/tours/${tour.slug}`}>{tour.name}</Link>
        </h3>
        <p>{tour.tagline}</p>
        <SeatMeter taken={tour.seatsTaken} total={tour.seatsTotal} />
        <div className="tour-card-foot">
          <Price usd={tour.priceUsd} />
          <span className={open <= 4 ? 'warn' : ''}>
            {open} {open === 1 ? 'seat' : 'seats'} left
          </span>
        </div>
      </div>
    </article>
  )
}
