import { useCallback, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { IntroSplash } from './IntroSplash'
import { Navbar } from './Navbar'
import { ScrollMotion } from './ScrollMotion'
import { GisubizoDock } from './GisubizoDock'

export function Layout() {
  const [introDone, setIntroDone] = useState(false)
  const finishIntro = useCallback(() => setIntroDone(true), [])

  useEffect(() => {
    document.title = 'Hamwe Tourism'
  }, [])

  useEffect(() => {
    if (introDone) document.getElementById('boot-intro')?.remove()
  }, [introDone])

  return (
    <div className={`shell ${introDone ? 'is-live' : 'is-waiting'}`}>
      {introDone ? null : <IntroSplash onDone={finishIntro} />}
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="atmosphere" aria-hidden="true" />
      {introDone ? <ScrollMotion /> : null}
      <div className="site-stage" aria-hidden={introDone ? undefined : true}>
        <Navbar />
        <main id="content">
          <Outlet />
        </main>
        <Footer />
      </div>
      {introDone ? <GisubizoDock /> : null}
    </div>
  )
}
