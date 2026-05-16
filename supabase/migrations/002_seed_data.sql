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
