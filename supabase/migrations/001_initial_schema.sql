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
