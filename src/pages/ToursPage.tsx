import { useMemo, useState } from 'react'
import { tours } from '../data'
import { TourCard } from '../components/TourCard'
import type { Difficulty } from '../types'

const filters: Array<{ id: 'all' | Difficulty; label: string }> = [
  { id: 'all', label: 'All circles' },
  { id: 'gentle', label: 'Gentle' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'active', label: 'Active' },
]

export function ToursPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')

  const list = useMemo(
    () => (filter === 'all' ? tours : tours.filter((tour) => tour.difficulty === filter)),
    [filter],
  )

  return (
    <div className="page-pad">
      <header className="page-hero">
        <p className="eyebrow">Departures · live seats</p>
        <h1>Choose a circle, not a brochure.</h1>
        <p className="lede">
          Every Hamwe tour is a dated, hosted itinerary. Seats are capped so the table stays human.
          Buy a ticket and you are in.
        </p>
      </header>

      <div className="filters" role="tablist" aria-label="Filter by pace">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            className={filter === item.id ? 'on' : ''}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="card-grid">
        {list.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  )
}
