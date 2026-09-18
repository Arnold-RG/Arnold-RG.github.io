import { Link } from 'react-router-dom'
import { circleForTour, seatsLeft, tours } from '../data'
import { compactDate } from '../lib/format'
import { CohortAvatars } from '../components/CohortAvatars'
import { SeatMeter } from '../components/SeatMeter'
import { initials } from '../lib/format'

export function CirclesPage() {
  return (
    <div className="page-pad">
      <header className="page-hero">
        <p className="eyebrow">Circles · mission board</p>
        <h1>Who you will actually walk with.</h1>
        <p className="lede">
          Hamwe is not anonymous. Before you fly, you see the circle — guests and a Kigali host —
          and you join a call. That is the product.
        </p>
      </header>

      <div className="circle-board">
        {tours.map((tour) => {
          const people = circleForTour(tour)
          return (
            <article key={tour.id} className="circle-card">
              <div className="circle-top">
                <img src={tour.image} alt="" />
                <div>
                  <p className="mono-meta">
                    {compactDate(tour.nextDeparture)} · {seatsLeft(tour) > 0 ? 'open' : 'closed'}
                  </p>
                  <h2>
                    <Link to={`/tours/${tour.slug}`}>{tour.name}</Link>
                  </h2>
                  <p>{tour.cohortName}</p>
                  <SeatMeter taken={tour.seatsTaken} total={tour.seatsTotal} />
                </div>
              </div>
              <CohortAvatars people={people} limit={10} />
              <ul className="people-list">
                {people.map((person) => (
                  <li key={person.id}>
                    <span className={person.role === 'host' ? 'avatar host' : 'avatar'}>
                      {initials(person.name)}
                    </span>
                    <div>
                      <strong>
                        {person.name}
                        {person.role === 'host' ? ' · host' : ''}
                      </strong>
                      <span>
                        {person.city}, {person.country}
                      </span>
                      <em>{person.note}</em>
                    </div>
                  </li>
                ))}
              </ul>
              <Link className="btn btn-ghost" to={`/tours/${tour.slug}`}>
                Take a seat
              </Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
