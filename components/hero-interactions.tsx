'use client'

import { useEffect } from 'react'

export default function HeroInteractions() {
  useEffect(() => {
    // Hero Book button
    const heroBookBtn = document.getElementById('heroBookBtn')
    heroBookBtn?.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('openBookingModal'))
    })

    // Hero Services button
    const heroServicesBtn = document.getElementById('heroServicesBtn')
    heroServicesBtn?.addEventListener('click', () => {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
    })

    // Hero Chat button
    const heroChatBtn = document.getElementById('heroChatBtn')
    heroChatBtn?.addEventListener('click', () => {
      document.getElementById('chatbot')?.scrollIntoView({ behavior: 'smooth' })
    })

    // Sticky bar book button
    const stickyBookBtn = document.getElementById('stickyBookBtn')
    stickyBookBtn?.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('openBookingModal'))
    })

    // Back to top button
    const backToTop = document.getElementById('backToTop')
    const handleScroll = () => {
      if (backToTop) {
        backToTop.classList.toggle('visible', window.scrollY > 300)
      }
      const stickyBar = document.getElementById('stickyBar')
      if (stickyBar) {
        stickyBar.classList.toggle('visible', window.scrollY > 400)
      }
    }
    window.addEventListener('scroll', handleScroll)

    backToTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })

    // Service pill interactions
    const pills = document.querySelectorAll('.service-pill')
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        pills.forEach((p) => p.classList.remove('active'))
        pill.classList.add('active')
      })
    })

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item')
    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question')
      const answer = item.querySelector('.faq-answer') as HTMLElement
      const icon = item.querySelector('.faq-icon')
      question?.addEventListener('click', () => {
        const isOpen = item.classList.contains('open')
        faqItems.forEach((fi) => {
          fi.classList.remove('open')
          const a = fi.querySelector('.faq-answer') as HTMLElement
          const ic = fi.querySelector('.faq-icon')
          if (a) a.style.maxHeight = '0'
          if (ic) ic.textContent = '+'
        })
        if (!isOpen) {
          item.classList.add('open')
          if (answer) answer.style.maxHeight = answer.scrollHeight + 'px'
          if (icon) icon.textContent = '−'
        }
      })
    })

    // Before/After slider
    const baSlider = document.getElementById('baSlider')
    const baHandle = document.getElementById('baHandle')
    if (baSlider && baHandle) {
      let isDragging = false
      const updateSlider = (x: number) => {
        const rect = baSlider.getBoundingClientRect()
        const pct = Math.min(Math.max(((x - rect.left) / rect.width) * 100, 0), 100)
        const before = baSlider.querySelector('.ba-before') as HTMLElement
        if (before) before.style.width = pct + '%'
        baHandle.style.left = pct + '%'
      }
      baHandle.addEventListener('mousedown', () => { isDragging = true })
      document.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX) })
      document.addEventListener('mouseup', () => { isDragging = false })
      baHandle.addEventListener('touchstart', () => { isDragging = true }, { passive: true })
      document.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(e.touches[0].clientX) }, { passive: true })
      document.addEventListener('touchend', () => { isDragging = false })
    }

    // Counter animation
    const counters = document.querySelectorAll('[data-target]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          const target = parseFloat(el.dataset.target || '0')
          const suffix = el.dataset.suffix || ''
          const decimal = parseInt(el.dataset.decimal || '0')
          const duration = 2000
          const start = performance.now()
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const val = target * progress
            el.textContent = (decimal ? val.toFixed(decimal) : Math.floor(val).toLocaleString()) + suffix
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
          observer.unobserve(el)
        }
      })
    })
    counters.forEach((c) => observer.observe(c))

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  return null
}
