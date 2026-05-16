export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import type { Service, Doctor } from '@/lib/types'
import BookingModal from '@/components/booking-modal'
import ChatbotWidget from '@/components/chatbot-widget'
import Navigation from '@/components/navigation'
import HeroInteractions from '@/components/hero-interactions'
import ContactForm from '@/components/contact-form'
import ReviewsSection from '@/components/reviews-section'

// Fetch services from Supabase (with fallback)
async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('price_amount', { ascending: true })
    if (error || !data?.length) return FALLBACK_SERVICES
    return data
  } catch {
    return FALLBACK_SERVICES
  }
}

// Fetch doctors from Supabase (with fallback)
async function getDoctors(): Promise<Doctor[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('is_active', true)
      .neq('slug', 'any')
      .order('experience_years', { ascending: false })
    if (error || !data?.length) return FALLBACK_DOCTORS
    return data
  } catch {
    return FALLBACK_DOCTORS
  }
}

export default async function Home() {
  const [services, doctors] = await Promise.all([getServices(), getDoctors()])

  return (
    <>
      {/* Demo Bar */}
      <div className="demo-bar">
        This is a demo website built by <strong>Namvi Digital</strong> — Bangkok&apos;s Premium Digital Solutions Partner
      </div>

      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-left">
            <div className="hero-decoration"></div>
            <div className="hero-badge">Premium Dental Care</div>
            <h1 className="hero-title">
              Your Smile Deserves<br /><em>Excellence</em>
            </h1>
            <p className="hero-sub">
              Modern dental care with a gentle, personalized approach. We blend advanced technology with warm hospitality.
            </p>
            <p className="hero-sub-th">
              บริการทันตกรรมคุณภาพระดับพรีเมียม ผสมผสานเทคโนโลยีทันสมัยกับการดูแลอย่างอบอุ่น
            </p>
            <div className="hero-stars">
              <span className="stars">★★★★★</span>
              <span className="rating">4.9</span>
              <span className="review-count">2,400+ Happy Patients</span>
            </div>
            <div className="hero-actions">
              <button className="btn-primary" id="heroBookBtn">Book Appointment</button>
              <button className="btn-secondary" id="heroServicesBtn">View Services</button>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-particles">
              <div className="particle" style={{ top: '20%', left: '15%' }}></div>
              <div className="particle" style={{ top: '60%', left: '80%', animationDelay: '2s' }}></div>
              <div className="particle" style={{ top: '80%', left: '25%', animationDelay: '4s' }}></div>
            </div>
            <div className="hero-card">
              <div className="hero-card-title">Quick Consultation</div>
              <div className="hero-card-sub">Select your concern to get started</div>
              <div className="service-pills">
                <span className="service-pill active">🦷 Checkup</span>
                <span className="service-pill">✨ Whitening</span>
                <span className="service-pill">🔧 Implants</span>
                <span className="service-pill">😁 Invisalign</span>
                <span className="service-pill">🩹 Emergency</span>
                <span className="service-pill">👶 Kids</span>
              </div>
              <div className="card-divider"></div>
              <div className="card-stat">
                <span className="card-stat-label">Next Available</span>
                <span className="card-stat-value">Tomorrow, 10:00 AM</span>
              </div>
              <div className="card-stat">
                <span className="card-stat-label">Consultation Fee</span>
                <span className="card-stat-value">Free</span>
              </div>
              <button className="btn-primary btn-chat" id="heroChatBtn">💬 Chat with Us Now</button>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="stats-bar" id="statsBar">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number" data-target="15" data-suffix="+">15+</div>
              <div className="stat-label">Years of Excellence</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-target="2400" data-suffix="+">2400+</div>
              <div className="stat-label">Happy Patients</div>
            </div>
            <div className="stat-item">
              <div
                className="stat-number"
                data-target={String(Math.max(doctors.length, 0))}
                data-suffix=""
              >
                {doctors.length}
              </div>
              <div className="stat-label">Specialist Doctors</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-target="7" data-suffix=" days">7 days</div>
              <div className="stat-label">Open Every Week</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-target="4.9" data-suffix="" data-decimal="1">4.9</div>
              <div className="stat-label">Google Rating</div>
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section id="doctors">
          <span className="section-label">Expert Team</span>
          <h2 className="section-title scramble-title">Meet Our <span>Specialists</span></h2>
          <p className="section-sub">
            Our team of highly qualified dental professionals brings together decades of experience and a passion for creating beautiful smiles.
          </p>
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-avatar">{doctor.initials}</div>
                <div className="doctor-name">{doctor.name}</div>
                <div className="doctor-role">{doctor.specialty}</div>
                <div className="doctor-detail">
                  {doctor.qualifications}
                  {doctor.bio && <><br />{doctor.bio}</>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section id="services">
          <span className="section-label">What We Offer</span>
          <h2 className="section-title scramble-title">Premium <span>Services</span></h2>
          <p className="section-sub">
            Comprehensive dental care using the latest technology and techniques, delivered with comfort and care in mind.
          </p>
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card" data-category={service.category}>
                <div className="service-icon">{service.icon}</div>
                <div className="service-name">{service.name}</div>
                {service.name_th && <div className="service-name-th">{service.name_th}</div>}
                <div className="service-desc">{service.description}</div>
                <div className="service-price-badge">{service.price_range || 'Contact Us'}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Before / After Section */}
        <section className="before-after-section" id="beforeAfter">
          <span className="section-label">Real Results</span>
          <h2 className="section-title scramble-title">See the <span>Transformation</span></h2>
          <p className="section-sub">Drag the handle to reveal the difference our treatments make.</p>
          <div className="ba-slider-wrapper">
            <div className="ba-slider" id="baSlider">
              <div className="ba-after">
                <div className="ba-img ba-img-after"></div>
                <span className="ba-label ba-label-after">After</span>
              </div>
              <div className="ba-before">
                <div className="ba-img ba-img-before"></div>
                <span className="ba-label ba-label-before">Before</span>
              </div>
              <div className="ba-handle" id="baHandle">
                <div className="ba-handle-line"></div>
                <div className="ba-handle-circle">
                  <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                    <path d="M8 5l-1.41 1.41L11.17 11H2v2h9.17l-4.59 4.59L8 19l7-7z" />
                  </svg>
                  <svg viewBox="0 0 24 24" fill="white" width="16" height="16" style={{ transform: 'rotate(180deg)' }}>
                    <path d="M8 5l-1.41 1.41L11.17 11H2v2h9.17l-4.59 4.59L8 19l7-7z" />
                  </svg>
                </div>
                <div className="ba-handle-line"></div>
              </div>
            </div>
            <div className="ba-caption">Teeth Whitening — Zoom Professional Treatment · 1 Hour Session</div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews">
          <span className="section-label">Patient Stories</span>
          <h2 className="section-title">What Our <span>Patients</span> Say</h2>
          <p className="section-sub">Real experiences from our valued patients who trusted us with their smiles.</p>
          <ReviewsSection />
        </section>

        {/* FAQ Section */}
        <section id="faq">
          <span className="section-label">Common Questions</span>
          <h2 className="section-title scramble-title">Frequently <span>Asked</span></h2>
          <p className="section-sub">Everything you need to know before your first visit.</p>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="faq-item">
                <button className="faq-question">
                  {item.question} <span className="faq-icon">+</span>
                </button>
                <div className="faq-answer"><p>{item.answer}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* Book / Contact Section */}
        <section id="book">
          <span className="section-label">Get in Touch</span>
          <h2 className="section-title">Book Your <span>Visit</span></h2>
          <p className="section-sub">Ready to start your journey to a healthier, brighter smile? We&apos;re here to help.</p>
          <div className="book-grid">
            <div className="book-info">
              <h3>Visit Our Clinic</h3>
              <p>Experience premium dental care in a comfortable, modern environment. We&apos;re conveniently located on Rama III Road with easy parking and BTS access.</p>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>994 Rama III Road, Chong Nonsi, Yannawa<br />Bangkok 10120, Thailand</div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>099-793-5635 (Thai &amp; English)</div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🕐</div>
                <div>Open Daily: 10:00 AM – 8:00 PM<br />Including weekends &amp; holidays</div>
              </div>
              <a href="https://line.me/R/ti/p/@sound.dentalclinic" className="line-btn" target="_blank" rel="noreferrer">
                <svg className="line-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                </svg>
                Chat on LINE · @sound.dentalclinic
              </a>
            </div>
            {/* Chatbot Widget (Client Component) */}
            <ChatbotWidget />
          </div>

          {/* Contact Form */}
          <div style={{ maxWidth: 640, margin: '3rem auto 0' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center' }}>
              Or Send Us a Message
            </h3>
            <ContactForm />
          </div>
        </section>
      </main>

      {/* Back to Top */}
      <button id="backToTop" aria-label="Back to top">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
        </svg>
      </button>

      {/* Sticky Book Bar */}
      <div className="sticky-book-bar" id="stickyBar">
        <span className="sticky-bar-text">Sound Dental · Open Today until 8 PM</span>
        <button className="sticky-bar-btn" id="stickyBookBtn">Book Now — Free Consult</button>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-logo">Sound <span>Dental</span> Clinic</div>
        <div>994 Rama III Rd, Bangkok · 099-793-5635 · Open daily 10 AM – 8 PM</div>
        <div>© 2026 Sound Dental Clinic · Built with ❤️ by Namvi Digital</div>
      </footer>

      {/* Booking Modal (Client Component) */}
      <BookingModal services={services} doctors={[...doctors, ANY_DOCTOR]} />

      {/* Hero interactions (Client Component for JS logic) */}
      <HeroInteractions />
    </>
  )
}

// =============================================
// FALLBACK DATA (used before Supabase is set up)
// =============================================

const FALLBACK_SERVICES: Service[] = [
  { id: '1', slug: 'whitening', icon: '✨', name: 'Teeth Whitening', name_th: 'ฟอกสีฟัน', description: 'Professional Zoom whitening for a brighter smile in just one hour.', description_th: null, price_range: 'From ฿5,900', price_amount: 5900, duration_minutes: 60, category: 'cosmetic', is_active: true, created_at: '', updated_at: '' },
  { id: '2', slug: 'implant', icon: '🔧', name: 'Dental Implants', name_th: 'รากฟันเทียม', description: 'Premium implant solutions with 3D planning and guided surgery.', description_th: null, price_range: 'From ฿45,000', price_amount: 45000, duration_minutes: 90, category: 'surgery', is_active: true, created_at: '', updated_at: '' },
  { id: '3', slug: 'invisalign', icon: '😁', name: 'Invisalign', name_th: 'จัดฟันใส', description: 'Clear aligners for discreet orthodontic treatment.', description_th: null, price_range: 'From ฿89,000', price_amount: 89000, duration_minutes: 45, category: 'orthodontics', is_active: true, created_at: '', updated_at: '' },
  { id: '4', slug: 'crown', icon: '👑', name: 'Crowns & Veneers', name_th: 'ครอบฟัน/วีเนียร์', description: 'Custom-crafted ceramic restorations for a perfect smile.', description_th: null, price_range: 'From ฿12,000', price_amount: 12000, duration_minutes: 60, category: 'cosmetic', is_active: true, created_at: '', updated_at: '' },
  { id: '5', slug: 'preventive', icon: '🛡️', name: 'Preventive Care', name_th: 'ทันตกรรมป้องกัน', description: 'Comprehensive checkups, cleanings, and oral health plans.', description_th: null, price_range: 'Free Consult', price_amount: 0, duration_minutes: 30, category: 'general', is_active: true, created_at: '', updated_at: '' },
  { id: '6', slug: 'emergency', icon: '🚨', name: 'Emergency Care', name_th: 'ฉุกเฉินทันตกรรม', description: 'Same-day emergency appointments available.', description_th: null, price_range: 'Same Day', price_amount: 0, duration_minutes: 30, category: 'emergency', is_active: true, created_at: '', updated_at: '' },
]

const FALLBACK_DOCTORS: Doctor[] = [
  { id: '1', slug: 'dr-nattapong', initials: 'NS', name: 'Dr. Nattapong Srisawat', name_th: null, specialty: 'Clinic Director', specialty_th: null, qualifications: 'D.D.S., M.Sc. in Prosthodontics', experience_years: 15, bio: '15+ years of excellence in dental implants and cosmetic dentistry', image_url: null, availability: {}, is_active: true, created_at: '', updated_at: '' },
  { id: '2', slug: 'dr-pimnara', initials: 'PC', name: 'Dr. Pimnara Chaiyasut', name_th: null, specialty: 'Orthodontist', specialty_th: null, qualifications: 'Board-Certified Orthodontist', experience_years: 10, bio: 'Invisalign Diamond Provider with 500+ cases completed', image_url: null, availability: {}, is_active: true, created_at: '', updated_at: '' },
  { id: '3', slug: 'dr-kritsada', initials: 'KV', name: 'Dr. Kritsada Vorapongse', name_th: null, specialty: 'Endodontist', specialty_th: null, qualifications: 'Root Canal Specialist', experience_years: 12, bio: 'Pain-free treatments with microscope-assisted precision', image_url: null, availability: {}, is_active: true, created_at: '', updated_at: '' },
]

const ANY_DOCTOR: Doctor = {
  id: 'any', slug: 'any', initials: '👨‍⚕️', name: 'Any Available Doctor', name_th: 'หมอที่ว่าง', specialty: 'First available specialist', specialty_th: null, qualifications: null, experience_years: 0, bio: null, image_url: null, availability: {}, is_active: true, created_at: '', updated_at: '',
}

const FAQ_ITEMS = [
  { question: 'Does Invisalign hurt?', answer: "Most patients experience mild pressure for a day or two after switching to a new aligner — this is normal and means it's working. There's no sharp pain like traditional braces." },
  { question: 'How long do dental implants last?', answer: 'With proper care, dental implants can last a lifetime. The crown on top typically lasts 15–25 years. We use premium Swiss implants with a lifetime warranty on the implant body itself.' },
  { question: 'Is teeth whitening safe?', answer: "Yes — professional Zoom whitening at our clinic is completely safe. Our dentists custom-fit trays and use protective gels to shield your gums. Results last 6–12 months with good oral hygiene." },
  { question: 'Do you treat children?', answer: 'Absolutely. We welcome patients from age 3 upwards. Our clinic is designed to be child-friendly, and our team is trained to make young patients feel comfortable and safe.' },
  { question: 'What if I have a dental emergency?', answer: 'Call us immediately at 099-793-5635. We reserve same-day slots for emergencies every day including weekends.' },
  { question: 'Do you accept insurance?', answer: 'We accept most major Thai health insurance plans and corporate dental benefits. We also offer interest-free installment plans for larger procedures.' },
]
