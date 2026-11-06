-- The site writes chats and contact messages only from the server (secret key),
-- so the public (publishable) key doesn't need write access. Without this, anyone
-- could insert rows straight through the API, skipping the routes' validation
-- and limits (chat spam would show up in the admin Chats page).
-- Bookings keep public INSERT: /api/bookings falls back to the publishable key.

REVOKE INSERT, UPDATE ON chat_sessions FROM anon, authenticated;
REVOKE INSERT ON contact_submissions FROM anon, authenticated;
