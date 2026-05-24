-- =============================================
-- Sound Dental Clinic - Initial Database Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- SERVICES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL DEFAULT '🦷',
  name TEXT NOT NULL,
  name_th TEXT,
  description TEXT,
  description_th TEXT,
  price_range TEXT,
  price_amount INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 30,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DOCTORS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  initials TEXT NOT NULL,
  name TEXT NOT NULL,
  name_th TEXT,
  specialty TEXT NOT NULL,
  specialty_th TEXT,
  qualifications TEXT,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  image_url TEXT,
  availability JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BOOKINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  service_name TEXT,
  doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
  doctor_name TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  confirmation_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CHAT SESSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  patient_name TEXT,
  patient_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CONTACT SUBMISSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES - SERVICES (public read, admin write)
-- =============================================
CREATE POLICY "Allow public read on services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow service_role full access on services"
  ON services FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- RLS POLICIES - DOCTORS (public read, admin write)
-- =============================================
CREATE POLICY "Allow public read on doctors"
  ON doctors FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow service_role full access on doctors"
  ON doctors FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- RLS POLICIES - BOOKINGS (public insert, admin read/write)
-- =============================================
CREATE POLICY "Allow public insert on bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow service_role full access on bookings"
  ON bookings FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- RLS POLICIES - CHAT SESSIONS (insert/update by session, admin read)
-- =============================================
CREATE POLICY "Allow public insert on chat_sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update own session"
  ON chat_sessions FOR UPDATE
  USING (true);

CREATE POLICY "Allow service_role full access on chat_sessions"
  ON chat_sessions FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- RLS POLICIES - CONTACT SUBMISSIONS (public insert, admin read)
-- =============================================
CREATE POLICY "Allow public insert on contact_submissions"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow service_role full access on contact_submissions"
  ON contact_submissions FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- AUTO-UPDATE updated_at TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER doctors_updated_at
  BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- =============================================
-- Sound Dental Clinic - Seed Data
-- Run AFTER 001_initial_schema.sql
-- =============================================

-- =============================================
-- SEED SERVICES
-- =============================================
INSERT INTO services (slug, icon, name, name_th, description, description_th, price_range, price_amount, duration_minutes, category) VALUES
  ('checkup', '🦷', 'Dental Checkup', 'ตรวจสุขภาพฟัน', 'Comprehensive dental examination with X-rays', 'ตรวจสุขภาพฟันครอบคลุมพร้อมเอกซเรย์', 'Free', 0, 30, 'general'),
  ('whitening', '✨', 'Teeth Whitening', 'ฟอกสีฟัน', 'Professional Zoom whitening for brighter smile in just one hour. Safe, effective, and long-lasting results.', 'ฟอกสีฟันด้วยระบบ Zoom ให้ยิ้มขาวสดใสใน 1 ชั่วโมง', 'From ฿5,900', 5900, 60, 'cosmetic'),
  ('invisalign', '😁', 'Invisalign', 'จัดฟันใส', 'Clear aligners for discreet orthodontic treatment. Straighten your teeth without metal braces.', 'จัดฟันแบบใสไม่เห็นเหล็ก', 'From ฿89,000', 89000, 45, 'orthodontics'),
  ('implant', '🔧', 'Dental Implant', 'รากฟันเทียม', 'Premium implant solutions with 3D planning and guided surgery for precise, comfortable placement.', 'รากฟันเทียมคุณภาพสูงพร้อมแผน 3D', 'From ฿45,000', 45000, 90, 'surgery'),
  ('crown', '👑', 'Crown & Veneer', 'ครอบฟัน/วีเนียร์', 'Custom-crafted ceramic restorations for a perfect, natural-looking smile transformation.', 'ครอบฟันและวีเนียร์เซรามิกสั่งทำพิเศษ', 'From ฿12,000', 12000, 60, 'cosmetic'),
  ('emergency', '🚨', 'Emergency Care', 'ฉุกเฉินทันตกรรม', 'Same-day emergency appointments available. We''re here when you need us most.', 'นัดหมายฉุกเฉินได้ทันที', 'Varies', 0, 30, 'emergency')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- SEED DOCTORS
-- =============================================
INSERT INTO doctors (slug, initials, name, name_th, specialty, specialty_th, qualifications, experience_years, bio, availability) VALUES
  (
    'dr-nattapong',
    'NS',
    'Dr. Nattapong Srisawat',
    'ทพ. ณัฐพงศ์ ศรีสวัสดิ์',
    'Implants & Prosthodontics',
    'รากฟันเทียมและทันตกรรมประดิษฐ์',
    'D.D.S., M.Sc. in Prosthodontics',
    15,
    'Clinic Director with 15+ years of excellence in dental implants and cosmetic dentistry. Trained at Chulalongkorn University.',
    '{"monday": ["10:00","18:00"], "tuesday": [], "wednesday": ["10:00","18:00"], "thursday": [], "friday": ["10:00","18:00"], "saturday": ["10:00","16:00"], "sunday": []}'
  ),
  (
    'dr-pimnara',
    'PC',
    'Dr. Pimnara Chaiyasut',
    'ทพญ. พิมนารา ชัยสุทธิ์',
    'Orthodontics & Invisalign',
    'จัดฟันและจัดฟันใส',
    'Board-Certified Orthodontist',
    10,
    'Invisalign Diamond Provider with 500+ cases completed. Specialist in clear aligner therapy.',
    '{"monday": [], "tuesday": ["10:00","18:00"], "wednesday": [], "thursday": ["10:00","18:00"], "friday": [], "saturday": ["10:00","18:00"], "sunday": []}'
  ),
  (
    'dr-kritsada',
    'KV',
    'Dr. Kritsada Vorapongse',
    'ทพ. กฤษดา วรพงศ์',
    'Endodontics & Root Canal',
    'รักษารากฟัน',
    'Root Canal Specialist',
    12,
    'Root Canal Specialist offering pain-free treatments with microscope-assisted precision.',
    '{"monday": ["10:00","18:00"], "tuesday": ["10:00","18:00"], "wednesday": [], "thursday": ["10:00","18:00"], "friday": [], "saturday": [], "sunday": []}'
  ),
  (
    'any',
    '👨‍⚕️',
    'Any Available Doctor',
    'หมอที่ว่าง',
    'First available specialist',
    'ผู้เชี่ยวชาญที่ว่างก่อน',
    '',
    0,
    'Let us match you with the best available specialist for your needs.',
    '{"monday": ["10:00","20:00"], "tuesday": ["10:00","20:00"], "wednesday": ["10:00","20:00"], "thursday": ["10:00","20:00"], "friday": ["10:00","20:00"], "saturday": ["10:00","20:00"], "sunday": ["10:00","18:00"]}'
  )
ON CONFLICT (slug) DO NOTHING;
-- Site settings (CMS) + sample bookings & contacts
-- Run after 001 and 002

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on site_settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow service_role full access on site_settings"
  ON site_settings FOR ALL
  USING (auth.role() = 'service_role');

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

INSERT INTO site_settings (key, value) VALUES
  ('clinic', '{"name":"Sound Dental Clinic","name_th":"คลินิกทันตกรรมซาวด์","tagline":"Premium Dental Care","phone":"099-793-5635","email":"sound.dentalclinic@gmail.com","line":"@sound.dentalclinic","address":"994, 996, 998 Rama III Road, Yan Nawa, Bangkok 10120","hours":"Open daily until 8:00 PM"}'),
  ('hero', '{"badge":"Premium Dental Care","title":"Your Smile Deserves Excellence","title_th":"รอยยิ้มของคุณสมควรได้รับความเป็นเลิศ","subtitle":"Modern dental care with a gentle, personalized approach.","subtitle_th":"บริการทันตกรรมคุณภาพระดับพรีเมียม","rating":"4.9","review_count":"2,400+"}'),
  ('stats', '{"years":15,"patients":2400,"rating":4.9,"open_days":7}')
ON CONFLICT (key) DO NOTHING;

-- Sample bookings (requires services/doctors from seed 002)
INSERT INTO bookings (
  patient_name, patient_email, patient_phone,
  service_name, doctor_name, appointment_date, appointment_time, status, notes
)
SELECT * FROM (VALUES
  ('Sarah Mitchell', 'sarah.m@email.com', '081-234-5678', 'Teeth Whitening', 'Dr. Pimnara Chaiyasut', (CURRENT_DATE + 2)::date, '10:00', 'pending', 'First-time patient'),
  ('Michael Chen', 'michael.c@email.com', '082-345-6789', 'Dental Checkup', 'Dr. Nattapong Srisawat', (CURRENT_DATE + 1)::date, '14:30', 'confirmed', NULL),
  ('Lisa Thompson', 'lisa.t@email.com', NULL, 'Invisalign', 'Dr. Pimnara Chaiyasut', CURRENT_DATE, '11:00', 'completed', 'Follow-up visit'),
  ('James Wilson', 'james.w@email.com', '083-456-7890', 'Dental Implant', 'Dr. Nattapong Srisawat', (CURRENT_DATE + 5)::date, '15:00', 'pending', 'Consultation requested')
) AS v(patient_name, patient_email, patient_phone, service_name, doctor_name, appointment_date, appointment_time, status, notes)
WHERE NOT EXISTS (SELECT 1 FROM bookings LIMIT 1);

INSERT INTO contact_submissions (name, email, phone, subject, message, status)
SELECT * FROM (VALUES
  ('Anna Park', 'anna@email.com', '084-111-2222', 'Pricing', 'How much is Invisalign?', 'new'),
  ('David Lee', 'david@email.com', NULL, 'Hours', 'Are you open on Sundays?', 'read')
) AS v(name, email, phone, subject, message, status)
WHERE NOT EXISTS (SELECT 1 FROM contact_submissions LIMIT 1);
