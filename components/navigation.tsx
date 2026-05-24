'use client'

import { useEffect } from 'react'

export default function Navigation({ clinicName = 'Sound Dental' }: { clinicName?: string }) {
  useEffect(() => {
    const hamburger = document.getElementById('navHamburger')
    const drawer = document.getElementById('mobileDrawer')
    const overlay = document.getElementById('mobileOverlay')

    const openMenu = () => {
      drawer?.classList.add('open')
      overlay?.classList.add('open')
      document.body.style.overflow = 'hidden'
    }

    const closeMenu = () => {
      drawer?.classList.remove('open')
      overlay?.classList.remove('open')
      document.body.style.overflow = ''
    }

    hamburger?.addEventListener('click', openMenu)
    overlay?.addEventListener('click', closeMenu)

    // Scroll handler for sticky nav
    const handleScroll = () => {
      const nav = document.querySelector('nav')
      if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 50)
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      hamburger?.removeEventListener('click', openMenu)
      overlay?.removeEventListener('click', closeMenu)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <nav>
        <div className="nav-inner page-container">
        <div className="nav-logo">
          {clinicName.includes(' ') ? (
            <>
              {clinicName.split(' ')[0]} <span>{clinicName.split(' ').slice(1).join(' ')}</span>
            </>
          ) : (
            clinicName
          )}
        </div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#doctors">Our Team</a>
          <a href="#reviews">Reviews</a>
          <a href="#faq">FAQ</a>
          <a
            href="#book"
            className="nav-cta"
            onClick={(e) => {
              e.preventDefault()
              document.dispatchEvent(new CustomEvent('openBookingModal'))
            }}
          >
            Book Now
          </a>
        </div>
        <button className="nav-hamburger" id="navHamburger" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className="mobile-drawer" id="mobileDrawer">
        <div className="mobile-drawer-inner">
          <div className="mobile-drawer-logo">Sound <span>Dental</span></div>
          <nav className="mobile-nav-links">
            <a href="#services" onClick={() => document.getElementById('mobileDrawer')?.classList.remove('open')}>Services</a>
            <a href="#doctors" onClick={() => document.getElementById('mobileDrawer')?.classList.remove('open')}>Our Team</a>
            <a href="#reviews" onClick={() => document.getElementById('mobileDrawer')?.classList.remove('open')}>Reviews</a>
            <a href="#faq" onClick={() => document.getElementById('mobileDrawer')?.classList.remove('open')}>FAQ</a>
          </nav>
          <button
            className="btn-primary mobile-book-btn"
            onClick={() => {
              document.getElementById('mobileDrawer')?.classList.remove('open')
              document.dispatchEvent(new CustomEvent('openBookingModal'))
            }}
          >
            Book Appointment
          </button>
          <div className="mobile-drawer-contact">
            <a href="tel:0997935635">📞 099-793-5635</a>
            <a href="https://line.me/R/ti/p/@sound.dentalclinic" target="_blank" rel="noreferrer">💬 @sound.dentalclinic</a>
          </div>
        </div>
      </div>
      <div className="mobile-overlay" id="mobileOverlay"></div>
    </>
  )
}
