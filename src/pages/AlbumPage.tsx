import { useEffect, useState } from 'react'
import { album } from '../data'

export function AlbumPage() {
  const [active, setActive] = useState(0)
  const featured = album[active] ?? album[0]

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((index) => (index + 1) % album.length)
    }, 5200)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="page-pad album-page">
      <header className="page-hero">
        <p className="eyebrow">Film · Rwanda</p>
        <h1>A photo album of the country we walk.</h1>
        <p className="lede">
          Hills, gorillas, Kivu, canopy, savannah, and the city desk. Real ground the circles
          actually use — not a stock collage of “Africa.”
        </p>
      </header>

      {featured ? (
        <figure className="album-stage">
          <div className="album-stage-frame" key={featured.id}>
            <img src={featured.src} alt={`${featured.title} — ${featured.place}`} />
          </div>
          <figcaption>
            <p className="mono-meta">
              {String(active + 1).padStart(2, '0')} / {String(album.length).padStart(2, '0')} · {featured.place}
            </p>
            <h2>{featured.title}</h2>
            <p>{featured.caption}</p>
          </figcaption>
        </figure>
      ) : null}

      <div className="album-grid">
        {album.map((photo, index) => (
          <button
            key={photo.id}
            className={`album-tile ${index === active ? 'is-active' : ''}`}
            type="button"
            onClick={() => setActive(index)}
          >
            <img src={photo.src} alt="" />
            <span>
              <strong>{photo.title}</strong>
              <em>{photo.place}</em>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
