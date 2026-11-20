-- Seed data for Pakistani Luxury Wedding Invitation Platform
-- File: supabase/seed.sql

-- 1. Insert Default Wedding
INSERT INTO weddings (
    id,
    title,
    couple_names,
    bride_name,
    groom_name,
    host_names,
    wedding_date,
    slug,
    rsvp_deadline,
    primary_color,
    accent_color
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'The Wedding of Ahad & Maryam',
    'Ahad & Maryam',
    'Maryam Khan',
    'Ahad Tariq Raza',
    'Mr. & Mrs. Mansoor Khan and Mr. & Mrs. Tariq Raza',
    '2026-12-18',
    'ahad-and-maryam',
    '2026-12-05 23:59:59+05',
    '#3A0715',
    '#C5A15A'
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Events
-- Mehndi
INSERT INTO events (
    id,
    wedding_id,
    event_type,
    title,
    event_date,
    start_time,
    end_time,
    venue_name,
    venue_address,
    google_maps_url,
    dress_code,
    description,
    theme_color
) VALUES (
    '22222222-2222-2222-2222-222222222201',
    '11111111-1111-1111-1111-111111111111',
    'mehndi',
    'Mayun & Mehndi Rung',
    '2026-12-16',
    '07:30 PM',
    '11:30 PM',
    'The Haveli Gardens, Royal Palm',
    '52 Canal Bank Road, Mughalpura, Lahore',
    'https://maps.google.com/?q=Royal+Palm+Golf+and+Country+Club+Lahore',
    'Traditional Yellows, Festive Florals & Vibrant Shades',
    'An evening filled with aromatic marigolds, vibrant dholak rhythms, traditional songs, and radiant henna festivities.',
    '#D97706'
),
-- Barat
(
    '22222222-2222-2222-2222-222222222202',
    '11111111-1111-1111-1111-111111111111',
    'barat',
    'The Royal Barat Ceremony',
    '2026-12-18',
    '08:00 PM',
    '12:00 AM',
    'Grand Crystal Ballroom, Pearl Continental',
    'Shahrah-e-Quaid-e-Azam, G.O.R. - I, Lahore',
    'https://maps.google.com/?q=Pearl+Continental+Hotel+Lahore',
    'Black Tie, Formal Sherwani & Regal Maroon / Gold Ensembles',
    'The ceremonial arrival of the Barat followed by the traditional Nikah ceremony, royal dinner, and Rukhsati.',
    '#580F25'
),
-- Walima
(
    '22222222-2222-2222-2222-222222222203',
    '11111111-1111-1111-1111-111111111111',
    'walima',
    'The Walima Reception',
    '2026-12-20',
    '08:00 PM',
    '11:30 PM',
    'Imperial Banquets, The Nishat Hotel',
    'Gate No. 2, Abdul Haque Rd, Phase 2 Johar Town, Lahore',
    'https://maps.google.com/?q=The+Nishat+Hotel+Johar+Town+Lahore',
    'Contemporary Formal, Champagne, Soft Pastels & Ivory',
    'A sophisticated reception celebrating the newly united couple amidst soft candlelight, white jasmine blossoms, and celebratory hospitality.',
    '#C5A15A'
) ON CONFLICT (id) DO NOTHING;

-- 3. Insert Guests with token hashes
-- Guest 1: Bilal Ahmed & Family (Invited to Mehndi & Barat)
INSERT INTO guests (
    id,
    wedding_id,
    display_name,
    phone,
    token_hash,
    max_attendees,
    invitation_status,
    notes
) VALUES (
    '33333333-3333-3333-3333-333333333301',
    '11111111-1111-1111-1111-111111111111',
    'Bilal Ahmed & Family',
    '923001234567',
    'b6c984478cab2ea2f5345fe4c89e97bc03b79661bc082699dac15dafed5da0cd', -- token: vip-bilal-ahmed-family
    5,
    'created',
    'Close family friends'
),
-- Guest 2: Mr. Muhammad Ali (Invited to Barat only)
(
    '33333333-3333-3333-3333-333333333302',
    '11111111-1111-1111-1111-111111111111',
    'Mr. Muhammad Ali',
    '923121234567',
    '52adcaa3d0ed038115d38b9bcd696c9e2404c7df4ef27bf6240bf18c4754b747', -- token: guest-muhammad-ali
    2,
    'created',
    'University colleague'
),
-- Guest 3: Usman Khan & Family (Invited to Mehndi, Barat, and Walima)
(
    '33333333-3333-3333-3333-333333333303',
    '11111111-1111-1111-1111-111111111111',
    'Usman Khan & Family',
    '923331234567',
    'f6e5e1f9506e4f91ddd7ef85c87b6707305427b16969298c46b81039d50effdd', -- token: guest-chaudhry-usman
    6,
    'created',
    'Immediate paternal cousins'
),
-- Guest 4: Sarah Jenkins & Guest (Invited to Walima only)
(
    '33333333-3333-3333-3333-333333333304',
    '11111111-1111-1111-1111-111111111111',
    'Sarah Jenkins & Guest',
    '923219876543',
    'bf19767c00bdb9524657b1de35b6ab088fecddaad118a2ef25eca457c51f7fb2', -- token: guest-sarah-jenkins
    2,
    'created',
    'Overseas associate'
) ON CONFLICT (id) DO NOTHING;

-- 4. Insert Guest Event Access Permissions
-- Guest 1 (Bilal Ahmed): Mehndi & Barat
INSERT INTO guest_event_access (guest_id, event_id, max_attendees) VALUES
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 5),
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', 5)
ON CONFLICT (guest_id, event_id) DO NOTHING;

-- Guest 2 (Muhammad Ali): Barat only
INSERT INTO guest_event_access (guest_id, event_id, max_attendees) VALUES
('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222202', 2)
ON CONFLICT (guest_id, event_id) DO NOTHING;

-- Guest 3 (Usman Khan): All three events
INSERT INTO guest_event_access (guest_id, event_id, max_attendees) VALUES
('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222201', 6),
('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222202', 6),
('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222203', 6)
ON CONFLICT (guest_id, event_id) DO NOTHING;

-- Guest 4 (Sarah Jenkins): Walima only
INSERT INTO guest_event_access (guest_id, event_id, max_attendees) VALUES
('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222203', 2)
ON CONFLICT (guest_id, event_id) DO NOTHING;
