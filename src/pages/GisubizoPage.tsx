import { GisubizoChat } from '../components/GisubizoChat'

export function GisubizoPage() {
  return (
    <div className="page-pad giso-page">
      <header className="page-hero">
        <p className="eyebrow">Gisubizo · web MCP</p>
        <h1>The answer, quickly.</h1>
        <p className="lede">
          Gisubizo reads your question, pulls Rwanda facts plus Hamwe’s live catalogue, then writes
          an answer — itineraries, comparisons, packing lists, Kinyarwanda, permits. Igisubizo means
          the answer. Ask in your own words; follow-ups are remembered.
        </p>
      </header>
      <GisubizoChat />
    </div>
  )
}
