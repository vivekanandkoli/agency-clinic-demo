-- ============================================================
-- Ad attribution: which ad / campaign brought each booking and contact
-- Safe to run more than once.
-- ============================================================

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS utm_source   TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium   TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_content  TEXT,
  ADD COLUMN IF NOT EXISTS utm_term     TEXT,
  ADD COLUMN IF NOT EXISTS gclid        TEXT,
  ADD COLUMN IF NOT EXISTS fbclid       TEXT,
  ADD COLUMN IF NOT EXISTS landing_page TEXT,
  ADD COLUMN IF NOT EXISTS referrer     TEXT;

ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS utm_source   TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium   TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_content  TEXT,
  ADD COLUMN IF NOT EXISTS utm_term     TEXT,
  ADD COLUMN IF NOT EXISTS gclid        TEXT,
  ADD COLUMN IF NOT EXISTS fbclid       TEXT,
  ADD COLUMN IF NOT EXISTS landing_page TEXT,
  ADD COLUMN IF NOT EXISTS referrer     TEXT;

CREATE INDEX IF NOT EXISTS idx_bookings_utm_campaign ON bookings(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_contacts_utm_campaign ON contact_submissions(utm_campaign);
