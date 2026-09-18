import { type FormEvent, useRef, useState } from 'react'
import { shufflePrompts } from '../gisubizo/knowledge'
import { askGisubizo } from '../gisubizo/engine'

interface Line {
  id: string
  role: 'user' | 'gisubizo'
  text: string
  followups?: string[]
}

export function GisubizoChat({ compact = false }: { compact?: boolean }) {
  const [lines, setLines] = useState<Line[]>([
    {
      id: 'open',
      role: 'gisubizo',
      text: 'Muraho. I am Gisubizo — Hamwe’s Rwanda intelligence. Ask in your own words. I compose a brief from country knowledge, live desk hours, and the Hamwe catalogue.',
      followups: shufflePrompts(compact ? 4 : 6),
    },
  ])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const linesRef = useRef(lines)
  linesRef.current = lines

  const ask = (question: string) => {
    const text = question.trim()
    if (!text || busy) return
    setDraft('')
    setBusy(true)
    const prior = linesRef.current
    setLines((current) => [...current, { id: `u-${Date.now()}`, role: 'user', text }])

    window.setTimeout(() => {
      const history = prior.map((line) => ({ role: line.role, text: line.text }))
      const reply = askGisubizo(text, history)
      setLines((current) => [
        ...current,
        { id: `g-${Date.now()}`, role: 'gisubizo', text: reply.text, followups: reply.followups },
      ])
      setBusy(false)
      window.requestAnimationFrame(() => {
        scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' })
      })
    }, 280)
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    ask(draft)
  }

  return (
    <div className={`giso-chat ${compact ? 'is-compact' : ''}`}>
      <div className="giso-thread" ref={scroller}>
        {lines.map((line) => (
          <article key={line.id} className={`giso-line is-${line.role}`}>
            {line.role === 'gisubizo' ? <p className="giso-who">Gisubizo</p> : null}
            <p>{line.text}</p>
            {line.followups?.length ? (
              <div className="giso-chips">
                {line.followups.map((chip) => (
                  <button key={chip} type="button" onClick={() => ask(chip)}>
                    {chip}
                  </button>
                ))}
              </div>
            ) : null}
          </article>
        ))}
        {busy ? <p className="giso-who">Gisubizo is writing…</p> : null}
      </div>
      <form className="giso-form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor={compact ? 'giso-dock-q' : 'giso-page-q'}>
          Ask Gisubizo
        </label>
        <input
          id={compact ? 'giso-dock-q' : 'giso-page-q'}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask anything — or type a follow-up"
          autoComplete="off"
        />
        <button className="btn btn-primary" type="submit" disabled={busy}>
          Ask
        </button>
      </form>
    </div>
  )
}
