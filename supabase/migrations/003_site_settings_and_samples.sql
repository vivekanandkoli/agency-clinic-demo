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
