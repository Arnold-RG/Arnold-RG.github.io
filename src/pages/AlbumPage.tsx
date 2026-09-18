import { useMemo, useState } from 'react'
import { albumTopics, rwandaAlbum } from '../data/album'

const PAGE = 48

export function AlbumPage() {
  const [topic, setTopic] = useState('all')
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(PAGE)
  const [active, setActive] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rwandaAlbum.filter((photo) => {
      if (topic !== 'all' && photo.topic !== topic) return false
      if (!needle) return true
      return `${photo.title} ${photo.place} ${photo.topicLabel}`.toLowerCase().includes(needle)
    })
  }, [topic, query])

  const visible = filtered.slice(0, shown)
  const featured =
    (active && filtered.find((photo) => photo.id === active)) ||
    filtered.find((photo) => photo.topic === 'kigali') ||
    visible[0]

  return (
    <div className="page-pad album-page">
      <header className="page-hero">
        <p className="eyebrow">Film · Rwanda</p>
        <h1>A real photograph album of the country.</h1>
        <p className="lede">
          {rwandaAlbum.length.toLocaleString()} photographs from Wikimedia Commons — dance, RwandAir,
          Kigali and other cities, hills, mountains, rivers, lakes, people, gardens, weddings, hotels,
          stadiums, transport, the presidency, RDF, and police. Not generated images.
        </p>
      </header>

      <div className="album-tools">
        <label className="album-search">
          <span className="sr-only">Search the album</span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setShown(PAGE)
            }}
            placeholder="Search Kigali, Intore, Kivu…"
          />
        </label>
        <p className="mono-meta">
          {filtered.length.toLocaleString()} photographs
          {topic !== 'all' ? ` · ${albumTopics.find((item) => item.id === topic)?.label}` : ''}
        </p>
      </div>

      <div className="album-topics" role="tablist" aria-label="Album topics">
        {albumTopics.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={topic === item.id}
            className={topic === item.id ? 'on' : ''}
            onClick={() => {
              setTopic(item.id)
              setShown(PAGE)
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {featured ? (
        <figure className="album-stage">
          <div className="album-stage-frame">
            <img src={featured.full || featured.src} alt={`${featured.title} — ${featured.place}`} />
          </div>
          <figcaption>
            <p className="mono-meta">{featured.place}</p>
            <h2>{featured.title}</h2>
            <p>{featured.caption}</p>
            {featured.commons ? (
              <a className="text-link" href={featured.commons} target="_blank" rel="noreferrer">
                Wikimedia source
              </a>
            ) : null}
          </figcaption>
        </figure>
      ) : (
        <p>No photographs match that search.</p>
      )}

      <div className="album-grid">
        {visible.map((photo) => (
          <button
            key={photo.id}
            className={`album-tile ${featured?.id === photo.id ? 'is-active' : ''}`}
            type="button"
            onClick={() => setActive(photo.id)}
          >
            <img src={photo.src} alt="" loading="lazy" />
            <span>
              <strong>{photo.title}</strong>
              <em>{photo.topicLabel || photo.place}</em>
            </span>
          </button>
        ))}
      </div>

      {shown < filtered.length ? (
        <div className="album-more">
          <button type="button" className="btn btn-ghost" onClick={() => setShown((value) => value + PAGE)}>
            Show more photographs
          </button>
        </div>
      ) : null}
    </div>
  )
}
