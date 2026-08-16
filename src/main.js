import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const NAV_ITEMS = [
  { label: 'WORK', path: '/work/' },
  { label: 'PRACTICE', anchor: 'practice' },
  { label: 'ABOUT', path: '/about/' },
  { label: 'CONTACT', anchor: 'contact' },
]

const isHome = () => location.pathname === '/' || location.pathname === '/index.html'

function navHref(item) {
  if (item.path) return item.path
  if (item.anchor) return isHome() ? `#${item.anchor}` : `/#${item.anchor}`
  return '#'
}

function isActive(item) {
  if (item.path) return location.pathname.startsWith(item.path)
  return false
}

function buildNavList(className) {
  return `<ul class="${className}">${NAV_ITEMS.map(
    (item) =>
      `<li><a href="${navHref(item)}"${isActive(item) ? ' class="active"' : ''}>${item.label}</a></li>`
  ).join('')}</ul>`
}

function injectHeader() {
  const root = document.getElementById('site-header-root')
  if (!root) return
  root.innerHTML = `
    <header class="site-header${isHome() ? ' is-home' : ''}" id="site-header">
      <div class="header-left">
        <a href="/" class="logo magnetic">VIZIONISH<span class="accent">.</span></a>
        <div class="status-indicator">
          <p>INDEPENDENT / AVAILABLE<br>FOR SELECT COMMISSIONS</p>
        </div>
      </div>
      <div class="header-right">
        <nav class="main-nav">${buildNavList('')}</nav>
        <div class="coordinates">38&deg;51'23.9"N<br>77&deg;02'36.6"W</div>
      </div>
      <button class="menu-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
    </header>
    <div class="mobile-nav">
      ${buildNavList('')}
      <div class="mobile-nav-footer">HELLO@VIZIONISH.COM<br>&copy; 2026 VIZIONISH.</div>
    </div>
  `
}

function injectFooter() {
  const root = document.getElementById('site-footer-root')
  if (!root) return
  root.innerHTML = `
    <footer class="site-footer section-padding" id="contact">
      <a href="mailto:hello@vizionish.com" class="footer-cta reveal">
        <h2 class="footer-headline serif">HAVE A<br>VISION?</h2>
        <div class="footer-arrow"><span class="accent">&rarr;</span></div>
        <h2 class="footer-headline right serif">LET'S MAKE<br>IT <span class="accent">REAL.</span></h2>
      </a>
      <div class="footer-bottom reveal">
        <a href="mailto:hello@vizionish.com" class="start-conversation accent magnetic">START A CONVERSATION &nearr;</a>
        <div class="footer-links">
          <a href="mailto:hello@vizionish.com">HELLO@VIZIONISH.COM</a>
          <span>|</span>
          <a href="https://instagram.com" target="_blank" rel="noopener">INSTAGRAM</a>
          <span>|</span>
          <a href="https://linkedin.com" target="_blank" rel="noopener">LINKEDIN</a>
        </div>
        <div class="copyright">&copy; 2026 VIZIONISH.</div>
      </div>
    </footer>
  `
}

function injectChrome() {
  const grain = document.createElement('div')
  grain.className = 'grain-overlay'
  document.body.appendChild(grain)

  const vignette = document.createElement('div')
  vignette.className = 'vignette-overlay'
  document.body.appendChild(vignette)

  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  const ring = document.createElement('div')
  ring.className = 'cursor-ring'
  document.body.appendChild(dot)
  document.body.appendChild(ring)

  const overlay = document.createElement('div')
  overlay.className = 'transition-overlay'
  document.body.appendChild(overlay)

  const curtain = document.createElement('div')
  curtain.className = 'preloader-curtain'
  document.body.appendChild(curtain)

  const preloader = document.createElement('div')
  preloader.className = 'preloader'
  preloader.innerHTML = `
    <div class="preloader-mark">VIZIONISH<span class="accent">.</span></div>
    <div class="preloader-bar"><div class="preloader-bar-fill"></div></div>
  `
  document.body.appendChild(preloader)

  return { dot, ring, overlay, curtain, preloader }
}

function initCursor(dot, ring) {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return

  let mx = -100, my = -100
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX
    my = e.clientY
    document.body.classList.add('cursor-ready')
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
  })

  gsap.ticker.add(() => {
    ringPos.x += (mx - ringPos.x) * 0.18
    ringPos.y += (my - ringPos.y) * 0.18
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`
  })
  const ringPos = { x: mx, y: my }

  const hoverables = 'a, button, .magnetic, .project-item'
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) ring.classList.add('is-active')
  })
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverables)) ring.classList.remove('is-active')
  })
}

function initMagnetic() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect()
      const relX = e.clientX - rect.left - rect.width / 2
      const relY = e.clientY - rect.top - rect.height / 2
      gsap.to(el, { x: relX * 0.25, y: relY * 0.4, duration: 0.4, ease: 'power2.out' })
    })
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
    })
  })
}

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle')
  if (!toggle) return
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('menu-open')
  })
  document.querySelectorAll('.mobile-nav a').forEach((a) => {
    a.addEventListener('click', () => document.body.classList.remove('menu-open'))
  })
}

function initHeaderScroll() {
  const header = document.getElementById('site-header')
  if (!header) return
  const update = () => {
    if (window.scrollY > 60) header.classList.add('scrolled')
    else header.classList.remove('scrolled')
  }
  update()
  window.addEventListener('scroll', update, { passive: true })
}

function initLenis() {
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

function initReveals() {
  const items = gsap.utils.toArray('.reveal')
  items.forEach((el) => {
    gsap.set(el, { opacity: 0, y: 30 })
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      },
    })
  })

  gsap.utils.toArray('.section-header').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => el.classList.add('active'),
    })
  })
}

function initHeroIntro() {
  const blocks = gsap.utils.toArray('.hero .fade-in')
  if (!blocks.length) return null
  gsap.set(blocks, { opacity: 0, y: 16 })
  return gsap.timeline({ paused: true }).to(blocks, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.12,
  })
}

function initHeroParallax() {
  const bg = document.querySelector('.hero-background')
  if (!bg) return
  gsap.to(bg, {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  })
}

function runPreloader(preloader, curtain, lenis, heroTimeline) {
  lenis.stop()
  const tl = gsap.timeline({
    onComplete: () => {
      preloader.remove()
      lenis.start()
      if (heroTimeline) heroTimeline.play()
      ScrollTrigger.refresh()
    },
  })

  tl.to(preloader.querySelector('.preloader-mark'), { opacity: 1, duration: 0.35 })
    .to(preloader.querySelector('.preloader-bar-fill'), { width: '100%', duration: 0.6, ease: 'power2.inOut' }, '-=0.05')
    .to(preloader, { opacity: 0, duration: 0.3 }, '+=0.05')
    .set(preloader, { display: 'none' })
    .to(curtain, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' }, '-=0.1')
    .set(curtain, { display: 'none' })
}

function initPageTransitions(overlay) {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a')
    if (!link) return
    const href = link.getAttribute('href')
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || link.target === '_blank') return
    if (href === location.pathname) return

    e.preventDefault()
    document.body.classList.remove('menu-open')
    gsap.timeline({
      onComplete: () => {
        window.location.href = href
      },
    }).to(overlay, { yPercent: -101, duration: 0.001 })
      .to(overlay, { yPercent: 0, duration: 0.55, ease: 'power4.inOut' })
  })
}

function init() {
  injectHeader()
  injectFooter()
  const { dot, ring, overlay, curtain, preloader } = injectChrome()

  const lenis = initLenis()
  initCursor(dot, ring)
  initMagnetic()
  initMobileMenu()
  initHeaderScroll()
  initPageTransitions(overlay)
  initReveals()
  initHeroParallax()
  const heroTimeline = initHeroIntro()

  runPreloader(preloader, curtain, lenis, heroTimeline)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
