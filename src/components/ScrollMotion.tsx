import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollMotion() {
  const location = useLocation()

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-reveal], .page-hero, .circle-card, .plan-card, .land-plate, .faq-item, .tour-card, .activity-card, .steps li, .trust-chips li, .album-tile, .album-stage',
      ),
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))

    const hero = document.querySelector<HTMLElement>('.hero-bg')
    const bar = document.querySelector<HTMLElement>('.scroll-progress > span')

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (bar) bar.style.transform = `scaleX(${progress})`
      if (hero) {
        hero.style.transform = `translate3d(0, ${window.scrollY * 0.35}px, 0) scale(1.12)`
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [location.pathname])

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span />
    </div>
  )
}
