import type { SupabaseClient } from '@supabase/supabase-js'

const SERVICES = [
  { slug: 'checkup', icon: '🦷', name: 'Dental Checkup', name_th: 'ตรวจสุขภาพฟัน', description: 'Comprehensive dental examination with X-rays', description_th: 'ตรวจสุขภาพฟันครอบคลุมพร้อมเอกซเรย์', price_range: 'Free', price_amount: 0, duration_minutes: 30, category: 'general' },
  { slug: 'whitening', icon: '✨', name: 'Teeth Whitening', name_th: 'ฟอกสีฟัน', description: 'Professional Zoom whitening for a brighter smile in one hour.', description_th: 'ฟอกสีฟันด้วยระบบ Zoom', price_range: 'From ฿5,900', price_amount: 5900, duration_minutes: 60, category: 'cosmetic' },
  { slug: 'invisalign', icon: '😁', name: 'Invisalign', name_th: 'จัดฟันใส', description: 'Clear aligners for discreet orthodontic treatment.', description_th: 'จัดฟันแบบใส', price_range: 'From ฿89,000', price_amount: 89000, duration_minutes: 45, category: 'orthodontics' },
  { slug: 'implant', icon: '🔧', name: 'Dental Implant', name_th: 'รากฟันเทียม', description: 'Premium implant solutions with 3D planning.', description_th: 'รากฟันเทียมคุณภาพสูง', price_range: 'From ฿45,000', price_amount: 45000, duration_minutes: 90, category: 'surgery' },
  { slug: 'crown', icon: '👑', name: 'Crown & Veneer', name_th: 'ครอบฟัน/วีเนียร์', description: 'Custom ceramic restorations for a natural smile.', description_th: 'ครอบฟันและวีเนียร์เซรามิก', price_range: 'From ฿12,000', price_amount: 12000, duration_minutes: 60, category: 'cosmetic' },
  { slug: 'emergency', icon: '🚨', name: 'Emergency Care', name_th: 'ฉุกเฉินทันตกรรม', description: 'Same-day emergency appointments available.', description_th: 'นัดหมายฉุกเฉินได้ทันที', price_range: 'Varies', price_amount: 0, duration_minutes: 30, category: 'emergency' },
]

const DOCTORS = [
  { slug: 'dr-nattapong', initials: 'NS', name: 'Dr. Nattapong Srisawat', name_th: 'ทพ. ณัฐพงศ์ ศรีสวัสดิ์', specialty: 'Implants & Prosthodontics', specialty_th: 'รากฟันเทียมและทันตกรรมประดิษฐ์', qualifications: 'D.D.S., M.Sc. in Prosthodontics', experience_years: 15, bio: 'Clinic Director with 15+ years of excellence.', availability: { monday: ['10:00', '18:00'], tuesday: [], wednesday: ['10:00', '18:00'], thursday: [], friday: ['10:00', '18:00'], saturday: ['10:00', '16:00'], sunday: [] } },
  { slug: 'dr-pimnara', initials: 'PC', name: 'Dr. Pimnara Chaiyasut', name_th: 'ทพญ. พิมนารา ชัยสุทธิ์', specialty: 'Orthodontics & Invisalign', specialty_th: 'จัดฟันและจัดฟันใส', qualifications: 'Board-Certified Orthodontist', experience_years: 10, bio: 'Invisalign Diamond Provider with 500+ cases.', availability: { monday: [], tuesday: ['10:00', '18:00'], wednesday: [], thursday: ['10:00', '18:00'], friday: [], saturday: ['10:00', '18:00'], sunday: [] } },
  { slug: 'dr-kritsada', initials: 'KV', name: 'Dr. Kritsada Vorapongse', name_th: 'ทพ. กฤษดา วรพงศ์', specialty: 'Endodontics & Root Canal', specialty_th: 'รักษารากฟัน', qualifications: 'Root Canal Specialist', experience_years: 12, bio: 'Pain-free microscope-assisted root canal care.', availability: { monday: ['10:00', '18:00'], tuesday: ['10:00', '18:00'], wednesday: [], thursday: ['10:00', '18:00'], friday: [], saturday: [], sunday: [] } },
  { slug: 'any', initials: '👨‍⚕️', name: 'Any Available Doctor', name_th: 'หมอที่ว่าง', specialty: 'First available specialist', specialty_th: 'ผู้เชี่ยวชาญที่ว่างก่อน', qualifications: '', experience_years: 0, bio: 'We match you with the best available specialist.', availability: { monday: ['10:00', '20:00'], tuesday: ['10:00', '20:00'], wednesday: ['10:00', '20:00'], thursday: ['10:00', '20:00'], friday: ['10:00', '20:00'], saturday: ['10:00', '20:00'], sunday: ['10:00', '18:00'] } },
]

const SITE_SETTINGS = [
  { key: 'clinic', value: { name: 'Sound Dental Clinic', name_th: 'คลินิกทันตกรรมซาวด์', tagline: 'Premium Dental Care', phone: '099-793-5635', email: 'sound.dentalclinic@gmail.com', line: '@sound.dentalclinic', address: '994, 996, 998 Rama III Road, Yan Nawa, Bangkok 10120', hours: 'Open daily until 8:00 PM' } },
  { key: 'hero', value: { badge: 'Premium Dental Care', title: 'Your Smile Deserves Excellence', title_th: 'รอยยิ้มของคุณสมควรได้รับความเป็นเลิศ', subtitle: 'Modern dental care with a gentle, personalized approach.', subtitle_th: 'บริการทันตกรรมคุณภาพระดับพรีเมียม', rating: '4.9', review_count: '2,400+' } },
  { key: 'stats', value: { years: 15, patients: 2400, rating: 4.9, open_days: 7 } },
]

function addDays(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export async function seedDatabase(supabase: SupabaseClient) {
  const summary: string[] = []

  for (const row of SERVICES) {
    await supabase.from('services').upsert({ ...row, is_active: true }, { onConflict: 'slug' })
  }
  summary.push(`${SERVICES.length} services`)

  for (const row of DOCTORS) {
    await supabase.from('doctors').upsert({ ...row, is_active: true }, { onConflict: 'slug' })
  }
  summary.push(`${DOCTORS.length} doctors`)

  for (const row of SITE_SETTINGS) {
    await supabase
      .from('site_settings')
      .upsert({ key: row.key, value: row.value }, { onConflict: 'key' })
  }
  summary.push('site settings')

  const { count: bookingCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })

  if (!bookingCount) {
    await supabase.from('bookings').insert([
      { patient_name: 'Sarah Mitchell', patient_email: 'sarah.m@email.com', patient_phone: '081-234-5678', service_name: 'Teeth Whitening', doctor_name: 'Dr. Pimnara Chaiyasut', appointment_date: addDays(2), appointment_time: '10:00', status: 'pending', notes: 'First-time patient' },
      { patient_name: 'Michael Chen', patient_email: 'michael.c@email.com', patient_phone: '082-345-6789', service_name: 'Dental Checkup', doctor_name: 'Dr. Nattapong Srisawat', appointment_date: addDays(1), appointment_time: '14:30', status: 'confirmed' },
      { patient_name: 'Lisa Thompson', patient_email: 'lisa.t@email.com', service_name: 'Invisalign', doctor_name: 'Dr. Pimnara Chaiyasut', appointment_date: addDays(0), appointment_time: '11:00', status: 'completed', notes: 'Follow-up visit' },
      { patient_name: 'James Wilson', patient_email: 'james.w@email.com', patient_phone: '083-456-7890', service_name: 'Dental Implant', doctor_name: 'Dr. Nattapong Srisawat', appointment_date: addDays(5), appointment_time: '15:00', status: 'pending', notes: 'Consultation requested' },
    ])
    summary.push('4 sample bookings')
  }

  const { count: contactCount } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })

  if (!contactCount) {
    await supabase.from('contact_submissions').insert([
      { name: 'Anna Park', email: 'anna@email.com', phone: '084-111-2222', subject: 'Pricing', message: 'How much is Invisalign?', status: 'new' },
      { name: 'David Lee', email: 'david@email.com', subject: 'Hours', message: 'Are you open on Sundays?', status: 'read' },
    ])
    summary.push('2 contact messages')
  }

  return `Loaded: ${summary.join(', ')}.`
}
