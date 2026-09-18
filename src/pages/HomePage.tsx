import { Link } from 'react-router-dom'
import { activities, tours } from '../data'
import { compactDate, money } from '../lib/format'
import { Constellation } from '../components/Constellation'
import { TourCard } from '../components/TourCard'
import { DailyBudget } from '../components/DailyBudget'
import { AlbumStrip } from '../components/AlbumStrip'
import { OfficeCountdown } from '../components/OfficeCountdown'

const featured = tours.slice(0, 3)
const next = [...tours].sort((a, b) => a.nextDeparture.localeCompare(b.nextDeparture))[0]

const trust = [
  {
    code: '01',
    title: 'Gorilla permits in the fare',
    copy: 'When a trek is listed, the permit is already bought. You do not assemble that at midnight.',
  },
  {
    code: '02',
    title: 'Bilingual Kigali host',
    copy: 'A host from the city walks every circle — days, tables, and the quiet after gorillas.',
  },
  {
    code: '03',
    title: 'Airport welcome',
    copy: 'Kigali pickup is in the ticket. You land. Someone is holding your name.',
  },
  {
    code: '04',
    title: 'Pre-trip circle call',
    copy: 'Two weeks out, faces on a call. Nerves, food rules, who is coming from where.',
  },
]

export function HomePage() {
  return (
    <div className="page-home">
      <section className="hero">
        <div className="hero-bg">
          <img src="/images/hero-hills.png" alt="Terraced green hills of Rwanda in morning mist" />
          <div className="hero-filaments" aria-hidden="true" />
          <div className="hero-scanlines" aria-hidden="true" />
          <div className="hero-vignette" aria-hidden="true" />
        </div>

        <OfficeCountdown />

        <div className="hero-hud">
          <div className="hero-copy">
            <p className="eyebrow">Visit Rwanda · with strangers, on purpose</p>
            <h1>
              Rwanda, walked
              <em> together.</em>
            </h1>
            <p className="lede">
              Hamwe sells seats on fully planned tours — gorillas, Kivu, Nyungwe, Akagera, Kigali —
              then introduces the people holding those seats. You buy a ticket. The circle does the rest.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/tours">
                See departures
              </Link>
              <Link className="btn btn-ghost" to="/gisubizo">
                Ask Gisubizo
              </Link>
              <Link className="btn btn-ghost" to="/about">
                How a circle works
              </Link>
            </div>
            <dl className="hero-stats">
              <div>
                <dt>Circle size</dt>
                <dd>10–14</dd>
              </div>
              <div>
                <dt>Next seat</dt>
                <dd>{next ? compactDate(next.nextDeparture) : '—'}</dd>
              </div>
              <div>
                <dt>Host on every tour</dt>
                <dd>Kigali-based</dd>
              </div>
            </dl>
          </div>

          <div className="hero-stage">
            <Constellation />
            {next ? (
              <aside className="boarding-pass">
                <header>
                  <span>
                    <i className="live-pip" /> Next boarding
                  </span>
                  <span className="mono-meta">HMW · KGL</span>
                </header>
                <p className="boarding-route">Kigali → hills → table</p>
                <strong>{next.name}</strong>
                <dl>
                  <div>
                    <dt>Departs</dt>
                    <dd>{compactDate(next.nextDeparture)}</dd>
                  </div>
                  <div>
                    <dt>Length</dt>
                    <dd>{next.durationDays} days</dd>
                  </div>
                  <div>
                    <dt>Region</dt>
                    <dd>{next.region}</dd>
                  </div>
                  <div>
                    <dt>Fare</dt>
                    <dd>{money(next.priceUsd)}</dd>
                  </div>
                </dl>
                <Link className="btn btn-primary btn-block" to={`/tours/${next.slug}`}>
                  Claim a seat
                </Link>
              </aside>
            ) : null}
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, index) => (
            <p key={index}>
              Kigali · Volcanoes · Lake Kivu · Nyungwe · Akagera · Nyanza · Musanze · Huye ·
              Rubavu · Kimironko ·
            </p>
          ))}
        </div>
      </div>

      <AlbumStrip />

      <section className="section" data-reveal>
        <header className="section-head">
          <p className="eyebrow">The method</p>
          <h2>Not a bus. A planned circle.</h2>
        </header>
        <ol className="steps">
          <li data-reveal style={{ '--reveal-delay': '0ms' } as object}>
            <span>01</span>
            <h3>Pick a departure</h3>
            <p>Every tour is dated, hosted, and capped. The itinerary is already written. You choose a circle, not a buffet of options.</p>
          </li>
          <li data-reveal style={{ '--reveal-delay': '90ms' } as object}>
            <span>02</span>
            <h3>Buy the ticket</h3>
            <p>One seat. Or two. Gorilla permits, lodges, and the road are in the price. You are not assembling a trip at midnight.</p>
          </li>
          <li data-reveal style={{ '--reveal-delay': '180ms' } as object}>
            <span>03</span>
            <h3>Meet before you fly</h3>
            <p>Two weeks out, the circle meets on a call. Faces, food rules, nerves. Strangers become a table.</p>
          </li>
          <li data-reveal style={{ '--reveal-delay': '270ms' } as object}>
            <span>04</span>
            <h3>Walk Rwanda</h3>
            <p>Then do the country — and the extras — together. Coffee, long tables, canopy hours, lamp boats.</p>
          </li>
        </ol>
      </section>

      <section className="trust-strip" data-reveal>
        <header className="section-head">
          <p className="eyebrow">Already in the fare</p>
          <h2>Visit with no problem.</h2>
        </header>
        <ul className="trust-chips">
          {trust.map((item, index) => (
            <li key={item.code} data-reveal style={{ '--reveal-delay': `${index * 90}ms` } as object}>
              <span className="trust-code">{item.code}</span>
              <strong>{item.title}</strong>
              <p>{item.copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" data-reveal>
        <header className="section-head split">
          <div>
            <p className="eyebrow">Departures</p>
            <h2>Upcoming circles</h2>
          </div>
          <Link className="text-link" to="/tours">
            All tours
          </Link>
        </header>
        <div className="card-grid featured">
          {featured.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      <section className="together-band" data-reveal>
        <div className="together-copy">
          <p className="eyebrow">Activities</p>
          <h2>The tour is the spine. The activities are how the circle actually happens.</h2>
          <p>
            Day tickets are FRw 8,000–20,000. Luxury packages are FRw 80,000 — nothing on this site
            costs more.
          </p>
          <Link className="btn btn-light" to="/activities">
            Browse activities
          </Link>
        </div>
        <ul className="together-list">
          {activities.slice(0, 4).map((activity) => (
            <li key={activity.id}>
              <Link to={`/activities/${activity.slug}`}>
                <img src={activity.image} alt="" />
                <div>
                  <strong>{activity.name}</strong>
                  <span>
                    {activity.city} · {money(activity.priceUsd)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <DailyBudget />

      <section className="live-circles" data-reveal>
        <div className="live-copy">
          <p className="eyebrow">Circles</p>
          <h2>A hosted itinerary, then a table.</h2>
          <p>
            You buy a dated seat. After you book, Hamwe introduces the circle and a Kigali host.
          </p>
          <Link className="text-link" to="/circles">
            Open the mission board
          </Link>
        </div>
        <Constellation compact />
      </section>

      <section className="closing-cta" data-reveal>
        <img src="/images/cohort.png" alt="A small group walking a hillside path in Rwanda" />
        <div>
          <p className="eyebrow">Next departure</p>
          <h2>Come for the hills. Stay for the circle.</h2>
          <p>A host from Kigali. A country in a sensible order.</p>
          <Link className="btn btn-primary" to="/tours">
            Buy a ticket
          </Link>
        </div>
      </section>
    </div>
  )
}
