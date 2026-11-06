-- Table privileges for the Supabase API roles.
-- Newer Supabase projects (and the local CLI stack) no longer auto-grant
-- SELECT/INSERT/UPDATE/DELETE on new public tables, so PostgREST returns
-- "permission denied" even for the secret key. RLS policies still decide
-- which rows each role can touch; these grants only mirror those policies.

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Server-side (secret key): full access, as the "service_role full access" policies intend.
GRANT SELECT, INSERT, UPDATE, DELETE ON
  services, doctors, bookings, chat_sessions, contact_submissions, site_settings
  TO service_role;

-- Public site (publishable key): read catalogue + settings, submit forms, chat.
GRANT SELECT ON services, doctors, site_settings TO anon, authenticated;
GRANT INSERT ON bookings, contact_submissions, chat_sessions TO anon, authenticated;
GRANT UPDATE ON chat_sessions TO anon, authenticated;
