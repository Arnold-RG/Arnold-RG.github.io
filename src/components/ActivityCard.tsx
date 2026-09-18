import { Link } from 'react-router-dom'
import type { Activity } from '../types'
import { Price } from './Price'
import { SeatMeter } from './SeatMeter'

export function ActivityCard({ activity }: { activity: Activity }) {
  const taken = Math.max(0, activity.spotsTotal - activity.spotsLeft)

  return (
    <article className="activity-card" data-reveal>
      <Link to={`/activities/${activity.slug}`} className="activity-media">
        <img src={activity.image} alt="" />
        <span className="chip">{activity.category}</span>
      </Link>
      <div className="activity-body">
        <p className="mono-meta">
          {activity.city} · {activity.duration}
        </p>
        <h3>
          <Link to={`/activities/${activity.slug}`}>{activity.name}</Link>
        </h3>
        <p>{activity.togetherNote}</p>
        <SeatMeter taken={taken} total={activity.spotsTotal} unit="spot" />
        <div className="tour-card-foot">
          <Price usd={activity.priceUsd} />
          <span>{activity.spotsLeft} spots</span>
        </div>
      </div>
    </article>
  )
}
