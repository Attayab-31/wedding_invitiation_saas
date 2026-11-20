-- Ultra-Luxury Pakistani Wedding Invitation Platform
-- Database Migration: 20261120000000_init_schema.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
DO $$ BEGIN
    CREATE TYPE event_type_enum AS ENUM ('mehndi', 'barat', 'walima', 'custom');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invitation_status_enum AS ENUM ('created', 'sent', 'opened', 'responded', 'revoked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE admin_role_enum AS ENUM ('owner', 'manager');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Weddings Table
CREATE TABLE IF NOT EXISTS weddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    couple_names TEXT NOT NULL,
    bride_name TEXT NOT NULL,
    groom_name TEXT NOT NULL,
    host_names TEXT NOT NULL,
    wedding_date DATE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    rsvp_deadline TIMESTAMPTZ,
    primary_color TEXT DEFAULT '#3A0715',
    accent_color TEXT DEFAULT '#C5A15A',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Events Table (Mehndi, Barat, Walima, etc.)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    event_type event_type_enum NOT NULL,
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    venue_name TEXT NOT NULL,
    venue_address TEXT NOT NULL,
    google_maps_url TEXT,
    dress_code TEXT,
    description TEXT,
    theme_color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Guests Table
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    token_hash TEXT UNIQUE NOT NULL, -- SHA-256 hash of random bearer token
    max_attendees INTEGER NOT NULL DEFAULT 1 CHECK (max_attendees >= 1),
    invitation_status invitation_status_enum NOT NULL DEFAULT 'created',
    expires_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Guest Event Access (Permissions per event)
CREATE TABLE IF NOT EXISTS guest_event_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    max_attendees INTEGER NOT NULL DEFAULT 1 CHECK (max_attendees >= 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(guest_id, event_id)
);

-- 5. RSVPs Table (Per event response)
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    attending BOOLEAN NOT NULL,
    headcount INTEGER NOT NULL DEFAULT 0 CHECK (headcount >= 0),
    dietary_notes TEXT,
    message TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(guest_id, event_id)
);

-- 6. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- Corresponds to auth.users.id
    email TEXT NOT NULL,
    role admin_role_enum NOT NULL DEFAULT 'manager',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(wedding_id, user_id)
);

-- 7. Invitation Logs Table
CREATE TABLE IF NOT EXISTS invitation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'created', 'sent_whatsapp', 'opened', 'rsvp_submitted'
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_guests_wedding_id ON guests(wedding_id);
CREATE INDEX IF NOT EXISTS idx_guests_token_hash ON guests(token_hash);
CREATE INDEX IF NOT EXISTS idx_events_wedding_id ON events(wedding_id);
CREATE INDEX IF NOT EXISTS idx_guest_event_access_guest ON guest_event_access(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_event_access_event ON guest_event_access(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_guest ON rsvps(guest_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_event ON rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_invitation_logs_guest ON invitation_logs(guest_id);

-- Row Level Security (RLS)
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_event_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_logs ENABLE ROW LEVEL SECURITY;

-- Admins policy: authenticated users can access weddings they manage
CREATE POLICY admin_weddings_all ON weddings
    FOR ALL
    TO authenticated
    USING (
        id IN (SELECT wedding_id FROM admins WHERE user_id = auth.uid())
    );

CREATE POLICY admin_events_all ON events
    FOR ALL
    TO authenticated
    USING (
        wedding_id IN (SELECT wedding_id FROM admins WHERE user_id = auth.uid())
    );

CREATE POLICY admin_guests_all ON guests
    FOR ALL
    TO authenticated
    USING (
        wedding_id IN (SELECT wedding_id FROM admins WHERE user_id = auth.uid())
    );

CREATE POLICY admin_guest_event_access_all ON guest_event_access
    FOR ALL
    TO authenticated
    USING (
        guest_id IN (
            SELECT g.id FROM guests g
            JOIN admins a ON g.wedding_id = a.wedding_id
            WHERE a.user_id = auth.uid()
        )
    );

CREATE POLICY admin_rsvps_all ON rsvps
    FOR ALL
    TO authenticated
    USING (
        guest_id IN (
            SELECT g.id FROM guests g
            JOIN admins a ON g.wedding_id = a.wedding_id
            WHERE a.user_id = auth.uid()
        )
    );

CREATE POLICY admin_logs_all ON invitation_logs
    FOR ALL
    TO authenticated
    USING (
        guest_id IN (
            SELECT g.id FROM guests g
            JOIN admins a ON g.wedding_id = a.wedding_id
            WHERE a.user_id = auth.uid()
        )
    );

-- Public access: Read wedding & events public info
CREATE POLICY public_read_weddings ON weddings
    FOR SELECT
    TO anon
    USING (true);

CREATE POLICY public_read_events ON events
    FOR SELECT
    TO anon
    USING (true);

-- Note: Guests table has NO direct public SELECT to prevent guest harvesting.
-- Guest verification and RSVP submission are handled via secure server-side functions / API route handlers using the service role key.
