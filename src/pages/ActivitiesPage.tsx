import { useMemo, useState } from 'react'
import { activities } from '../data'
import { ActivityCard } from '../components/ActivityCard'
import type { ActivityCategory } from '../types'

const filters: Array<{ id: 'all' | ActivityCategory | string; label: string }> = [
  { id: 'all', label: 'All activities' },
  { id: 'culture', label: 'Culture' },
  { id: 'food', label: 'Food' },
  { id: 'nature', label: 'Nature' },
  { id: 'night', label: 'Night' },
  { id: 'Kigali', label: 'Kigali' },
  { id: 'Musanze', label: 'Musanze' },
  { id: 'Lake Kivu', label: 'Kivu' },
]

export function ActivitiesPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]['id']>('all')

  const list = useMemo(() => {
    if (filter === 'all') return activities
    if (filter === 'culture' || filter === 'food' || filter === 'nature' || filter === 'night') {
      return activities.filter((activity) => activity.category === filter)
    }
    return activities.filter((activity) => activity.city.includes(String(filter)))
  }, [filter])

  return (
    <div className="page-pad">
      <header className="page-hero">
        <p className="eyebrow">Activities · together extras</p>
        <h1>Evenings, studios, boats, walks.</h1>
        <p className="lede">
          Open to anyone on a Hamwe ticket — and to travelers who want a single shared evening in
          Kigali, Musanze, or on Kivu. Pay in FRw. Meet at the point named on the pass.
        </p>
      </header>

      <div className="filters" role="tablist" aria-label="Filter activities">
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
        {list.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  )
}
