import { rwandaAlbum } from '../data/album'

export function AlbumPage() {
  return (
    <div className="page-pad album-page">
      <header className="page-hero">
        <p className="eyebrow">Film · Rwanda</p>
        <h1>Photo album</h1>
        <p className="lede">The album has no photographs yet.</p>
      </header>
      {rwandaAlbum.length ? (
        <div className="album-grid">
          {rwandaAlbum.map((photo) => (
            <figure key={photo.id} className="album-tile">
              <img src={photo.src} alt="" loading="lazy" />
              <span>
                <strong>{photo.title}</strong>
                <em>{photo.place}</em>
              </span>
            </figure>
          ))}
        </div>
      ) : null}
    </div>
  )
}
