import { Wedding, WeddingEvent, Guest, GuestEventAccess, RSVP, InvitationLog, ResolvedGuestExperience } from '@/types/database';
import { hashGuestToken } from '@/lib/security/token';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';

// In-Memory Fallback State (Loaded with seed data for standalone resilience & testing)
const INITIAL_WEDDING: Wedding = {
  id: '11111111-1111-1111-1111-111111111111',
  title: 'The Wedding of Ahad & Maryam',
  couple_names: 'Ahad & Maryam',
  bride_name: 'Maryam Khan',
  groom_name: 'Ahad Tariq Raza',
  host_names: 'Mr. & Mrs. Mansoor Khan and Mr. & Mrs. Tariq Raza',
  wedding_date: '2026-12-18',
  slug: 'ahad-and-maryam',
  rsvp_deadline: '2026-12-05T23:59:59Z',
  primary_color: '#3A0715',
  accent_color: '#C5A15A',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const INITIAL_EVENTS: WeddingEvent[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    wedding_id: INITIAL_WEDDING.id,
    event_type: 'mehndi',
    title: 'Mayun & Mehndi Rung',
    event_date: '2026-12-16',
    start_time: '07:30 PM',
    end_time: '11:30 PM',
    venue_name: 'The Haveli Gardens, Royal Palm',
    venue_address: '52 Canal Bank Road, Mughalpura, Lahore',
    google_maps_url: 'https://maps.google.com/?q=Royal+Palm+Golf+and+Country+Club+Lahore',
    dress_code: 'Festive Florals, Mustard Yellows & Vibrant Henna Attire',
    description: 'An enchanting evening of rhythmic dholak beats, festive singing, traditional henna, and celebration under golden canopies.',
    theme_color: '#D97706',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    wedding_id: INITIAL_WEDDING.id,
    event_type: 'barat',
    title: 'The Royal Barat Ceremony',
    event_date: '2026-12-18',
    start_time: '08:00 PM',
    end_time: '12:00 AM',
    venue_name: 'Grand Crystal Ballroom, Pearl Continental',
    venue_address: 'Shahrah-e-Quaid-e-Azam, G.O.R. - I, Lahore',
    google_maps_url: 'https://maps.google.com/?q=Pearl+Continental+Hotel+Lahore',
    dress_code: 'Black Tie, Formal Sherwani & Imperial Maroon / Antique Gold',
    description: 'The regal arrival of the Barat, the sacred Nikah vows, royal banquet, and the heartfelt Rukhsati.',
    theme_color: '#580F25',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    wedding_id: INITIAL_WEDDING.id,
    event_type: 'walima',
    title: 'The Walima Reception',
    event_date: '2026-12-20',
    start_time: '08:00 PM',
    end_time: '11:30 PM',
    venue_name: 'Imperial Banquets, The Nishat Hotel',
    venue_address: 'Gate No. 2, Abdul Haque Rd, Phase 2 Johar Town, Lahore',
    google_maps_url: 'https://maps.google.com/?q=The+Nishat+Hotel+Johar+Town+Lahore',
    dress_code: 'Contemporary Formal, Champagne Gold, Soft Pastels & Ivory',
    description: 'A serene luxury reception welcoming our guests with soft candlelight, blooming white jasmines, and joyful blessings.',
    theme_color: '#C5A15A',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Initial guests preloaded with exact SHA-256 hashes
const INITIAL_GUESTS: Guest[] = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    wedding_id: INITIAL_WEDDING.id,
    display_name: 'Bilal Ahmed & Family',
    phone: '923001234567',
    token_hash: hashGuestToken('vip-bilal-ahmed-family'),
    max_attendees: 5,
    invitation_status: 'created',
    expires_at: null,
    notes: 'Close family friends',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    wedding_id: INITIAL_WEDDING.id,
    display_name: 'Mr. Muhammad Ali',
    phone: '923121234567',
    token_hash: hashGuestToken('guest-muhammad-ali'),
    max_attendees: 2,
    invitation_status: 'created',
    expires_at: null,
    notes: 'University colleague',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    wedding_id: INITIAL_WEDDING.id,
    display_name: 'Usman Khan & Family',
    phone: '923331234567',
    token_hash: hashGuestToken('guest-chaudhry-usman'),
    max_attendees: 6,
    invitation_status: 'created',
    expires_at: null,
    notes: 'Paternal cousins',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333304',
    wedding_id: INITIAL_WEDDING.id,
    display_name: 'Sarah Jenkins & Guest',
    phone: '923219876543',
    token_hash: hashGuestToken('guest-sarah-jenkins'),
    max_attendees: 2,
    invitation_status: 'created',
    expires_at: null,
    notes: 'Overseas associate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_ACCESS: GuestEventAccess[] = [
  // Guest 1: Mehndi & Barat
  { id: '401', guest_id: '33333333-3333-3333-3333-333333333301', event_id: INITIAL_EVENTS[0].id, max_attendees: 5, created_at: new Date().toISOString() },
  { id: '402', guest_id: '33333333-3333-3333-3333-333333333301', event_id: INITIAL_EVENTS[1].id, max_attendees: 5, created_at: new Date().toISOString() },
  // Guest 2: Barat only
  { id: '403', guest_id: '33333333-3333-3333-3333-333333333302', event_id: INITIAL_EVENTS[1].id, max_attendees: 2, created_at: new Date().toISOString() },
  // Guest 3: All 3 events
  { id: '404', guest_id: '33333333-3333-3333-3333-333333333303', event_id: INITIAL_EVENTS[0].id, max_attendees: 6, created_at: new Date().toISOString() },
  { id: '405', guest_id: '33333333-3333-3333-3333-333333333303', event_id: INITIAL_EVENTS[1].id, max_attendees: 6, created_at: new Date().toISOString() },
  { id: '406', guest_id: '33333333-3333-3333-3333-333333333303', event_id: INITIAL_EVENTS[2].id, max_attendees: 6, created_at: new Date().toISOString() },
  // Guest 4: Walima only
  { id: '407', guest_id: '33333333-3333-3333-3333-333333333304', event_id: INITIAL_EVENTS[2].id, max_attendees: 2, created_at: new Date().toISOString() },
];

const memoryStore = {
  weddings: [INITIAL_WEDDING],
  events: [...INITIAL_EVENTS],
  guests: [...INITIAL_GUESTS],
  guest_event_access: [...INITIAL_ACCESS],
  rsvps: [] as RSVP[],
  logs: [] as InvitationLog[],
  guestTokens: new Map<string, string>([
    ['33333333-3333-3333-3333-333333333301', 'vip-bilal-ahmed-family'],
    ['33333333-3333-3333-3333-333333333302', 'guest-muhammad-ali'],
    ['33333333-3333-3333-3333-333333333303', 'guest-chaudhry-usman'],
    ['33333333-3333-3333-3333-333333333304', 'guest-sarah-jenkins'],
  ]),
};

export class DatabaseService {
  /**
   * Resolves a guest token server-side, verifying validity, permissions, and returning authorized events only.
   */
  static async resolveGuestByToken(token: string): Promise<ResolvedGuestExperience | null> {
    const tokenHash = hashGuestToken(token);

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      // 1. Fetch guest by token_hash
      const { data: guest, error: guestErr } = await supabaseAdmin
        .from('guests')
        .select('*')
        .eq('token_hash', tokenHash)
        .single();

      if (guestErr || !guest) return null;
      if (guest.invitation_status === 'revoked') return null;
      if (guest.expires_at && new Date(guest.expires_at) < new Date()) return null;

      // 2. Fetch wedding
      const { data: wedding } = await supabaseAdmin
        .from('weddings')
        .select('*')
        .eq('id', guest.wedding_id)
        .single();

      if (!wedding) return null;

      // 3. Fetch guest_event_access
      const { data: accessList } = await supabaseAdmin
        .from('guest_event_access')
        .select('*')
        .eq('guest_id', guest.id);

      if (!accessList || accessList.length === 0) return null;

      const eventIds = accessList.map((a: GuestEventAccess) => a.event_id);

      // 4. Fetch allowed events
      const { data: events } = await supabaseAdmin
        .from('events')
        .select('*')
        .in('id', eventIds)
        .order('event_date', { ascending: true });

      // 5. Fetch existing RSVPs
      const { data: rsvps } = await supabaseAdmin
        .from('rsvps')
        .select('*')
        .eq('guest_id', guest.id);

      // Log opened action asynchronously
      await supabaseAdmin.from('invitation_logs').insert({
        guest_id: guest.id,
        action: 'opened',
        metadata: { timestamp: new Date().toISOString() },
      });

      // Construct safe payload
      const resolvedEvents = (events || []).map((evt: WeddingEvent) => {
        const access = accessList.find((a: GuestEventAccess) => a.event_id === evt.id);
        const existingRsvp = (rsvps || []).find((r: RSVP) => r.event_id === evt.id);
        return {
          ...evt,
          guest_max_attendees: access ? access.max_attendees : guest.max_attendees,
          existing_rsvp: existingRsvp
            ? {
                attending: existingRsvp.attending,
                headcount: existingRsvp.headcount,
                dietary_notes: existingRsvp.dietary_notes,
                message: existingRsvp.message,
              }
            : null,
        };
      });

      return {
        guest: {
          id: guest.id,
          display_name: guest.display_name,
          phone: guest.phone,
          max_attendees: guest.max_attendees,
          invitation_status: guest.invitation_status,
        },
        wedding,
        events: resolvedEvents,
      };
    }

    // In-Memory Fallback
    const guest = memoryStore.guests.find((g) => g.token_hash === tokenHash);
    if (!guest || guest.invitation_status === 'revoked') return null;
    if (guest.expires_at && new Date(guest.expires_at) < new Date()) return null;

    const wedding = memoryStore.weddings.find((w) => w.id === guest.wedding_id);
    if (!wedding) return null;

    const accessList = memoryStore.guest_event_access.filter((a) => a.guest_id === guest.id);
    const eventIds = new Set(accessList.map((a) => a.event_id));
    const permittedEvents = memoryStore.events.filter((e) => eventIds.has(e.id));

    // Sort by date
    permittedEvents.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

    // Update status to opened if created
    if (guest.invitation_status === 'created') {
      guest.invitation_status = 'opened';
    }

    memoryStore.logs.push({
      id: Math.random().toString(),
      guest_id: guest.id,
      action: 'opened',
      created_at: new Date().toISOString(),
    });

    const resolvedEvents = permittedEvents.map((evt) => {
      const access = accessList.find((a) => a.event_id === evt.id);
      const existingRsvp = memoryStore.rsvps.find((r) => r.guest_id === guest.id && r.event_id === evt.id);
      return {
        ...evt,
        guest_max_attendees: access ? access.max_attendees : guest.max_attendees,
        existing_rsvp: existingRsvp
          ? {
              attending: existingRsvp.attending,
              headcount: existingRsvp.headcount,
              dietary_notes: existingRsvp.dietary_notes,
              message: existingRsvp.message,
            }
          : null,
      };
    });

    return {
      guest: {
        id: guest.id,
        display_name: guest.display_name,
        phone: guest.phone,
        max_attendees: guest.max_attendees,
        invitation_status: guest.invitation_status,
      },
      wedding,
      events: resolvedEvents,
    };
  }

  /**
   * Submits an RSVP for a specific event with server-side validation of authorization & max attendees.
   */
  static async submitRSVP(params: {
    token: string;
    eventId: string;
    attending: boolean;
    headcount: number;
    dietaryNotes?: string;
    message?: string;
  }): Promise<{ success: boolean; error?: string }> {
    const { token, eventId, attending, headcount, dietaryNotes, message } = params;
    const tokenHash = hashGuestToken(token);

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      // 1. Verify guest
      const { data: guest } = await supabaseAdmin
        .from('guests')
        .select('*')
        .eq('token_hash', tokenHash)
        .single();

      if (!guest || guest.invitation_status === 'revoked') {
        return { success: false, error: 'Unauthorized or expired invitation token.' };
      }

      // 2. Verify event permission & max attendees
      const { data: access } = await supabaseAdmin
        .from('guest_event_access')
        .select('*')
        .eq('guest_id', guest.id)
        .eq('event_id', eventId)
        .single();

      if (!access) {
        return { success: false, error: 'You are not invited to this event.' };
      }

      if (attending) {
        if (headcount <= 0) {
          return { success: false, error: 'Headcount must be at least 1 person.' };
        }
        if (headcount > access.max_attendees) {
          return {
            success: false,
            error: `Maximum permitted attendees for this event is ${access.max_attendees}.`,
          };
        }
      }

      const finalHeadcount = attending ? headcount : 0;

      // 3. Upsert RSVP
      const { error: rsvpErr } = await supabaseAdmin.from('rsvps').upsert(
        {
          guest_id: guest.id,
          event_id: eventId,
          attending,
          headcount: finalHeadcount,
          dietary_notes: dietaryNotes?.trim() || null,
          message: message?.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'guest_id,event_id' }
      );

      if (rsvpErr) {
        return { success: false, error: 'Failed to record RSVP. Please try again.' };
      }

      // Update guest status to responded
      await supabaseAdmin
        .from('guests')
        .update({ invitation_status: 'responded', updated_at: new Date().toISOString() })
        .eq('id', guest.id);

      // Log action
      await supabaseAdmin.from('invitation_logs').insert({
        guest_id: guest.id,
        action: 'rsvp_submitted',
        metadata: { eventId, attending, headcount: finalHeadcount },
      });

      return { success: true };
    }

    // In-memory implementation
    const guest = memoryStore.guests.find((g) => g.token_hash === tokenHash);
    if (!guest || guest.invitation_status === 'revoked') {
      return { success: false, error: 'Unauthorized or expired invitation token.' };
    }

    const access = memoryStore.guest_event_access.find(
      (a) => a.guest_id === guest.id && a.event_id === eventId
    );
    if (!access) {
      return { success: false, error: 'You are not invited to this event.' };
    }

    if (attending) {
      if (headcount <= 0) {
        return { success: false, error: 'Headcount must be at least 1 person.' };
      }
      if (headcount > access.max_attendees) {
        return {
          success: false,
          error: `Maximum permitted attendees for this event is ${access.max_attendees}.`,
        };
      }
    }

    const finalHeadcount = attending ? headcount : 0;

    const existingIndex = memoryStore.rsvps.findIndex(
      (r) => r.guest_id === guest.id && r.event_id === eventId
    );

    const rsvpRecord: RSVP = {
      id: existingIndex >= 0 ? memoryStore.rsvps[existingIndex].id : Math.random().toString(),
      guest_id: guest.id,
      event_id: eventId,
      attending,
      headcount: finalHeadcount,
      dietary_notes: dietaryNotes?.trim() || null,
      message: message?.trim() || null,
      submitted_at: existingIndex >= 0 ? memoryStore.rsvps[existingIndex].submitted_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      memoryStore.rsvps[existingIndex] = rsvpRecord;
    } else {
      memoryStore.rsvps.push(rsvpRecord);
    }

    guest.invitation_status = 'responded';
    memoryStore.logs.push({
      id: Math.random().toString(),
      guest_id: guest.id,
      action: 'rsvp_submitted',
      metadata: { eventId, attending, headcount: finalHeadcount },
      created_at: new Date().toISOString(),
    });

    return { success: true };
  }

  /**
   * Admin: Get all dashboard metrics & statistics
   */
  static async getDashboardMetrics() {
    const guests = memoryStore.guests;
    const events = memoryStore.events;
    const rsvps = memoryStore.rsvps;

    const totalGuests = guests.length;
    const sentInvitations = guests.filter((g) => g.invitation_status === 'sent' || g.invitation_status === 'opened' || g.invitation_status === 'responded').length;
    const openedInvitations = guests.filter((g) => g.invitation_status === 'opened' || g.invitation_status === 'responded').length;
    const respondedGuests = guests.filter((g) => g.invitation_status === 'responded').length;

    const confirmedRSVPs = rsvps.filter((r) => r.attending);
    const declinedRSVPs = rsvps.filter((r) => !r.attending);
    const totalConfirmedAttendees = confirmedRSVPs.reduce((sum, r) => sum + r.headcount, 0);

    const eventBreakdown = events.map((event) => {
      const eventAccess = memoryStore.guest_event_access.filter((a) => a.event_id === event.id);
      const invitedGuestCount = eventAccess.length;
      const totalCapacity = eventAccess.reduce((sum, a) => sum + a.max_attendees, 0);

      const eventRSVPs = rsvps.filter((r) => r.event_id === event.id);
      const confirmed = eventRSVPs.filter((r) => r.attending);
      const declined = eventRSVPs.filter((r) => !r.attending);
      const confirmedAttendees = confirmed.reduce((sum, r) => sum + r.headcount, 0);

      return {
        event,
        invitedGuestCount,
        totalCapacity,
        confirmedCount: confirmed.length,
        declinedCount: declined.length,
        confirmedAttendees,
      };
    });

    return {
      totalGuests,
      sentInvitations,
      openedInvitations,
      respondedGuests,
      totalRSVPResponses: rsvps.length,
      confirmedRSVPs: confirmedRSVPs.length,
      declinedRSVPs: declinedRSVPs.length,
      totalConfirmedAttendees,
      eventBreakdown,
    };
  }

  /**
   * Admin: Get all guests with their permissions and generated raw tokens
   */
  static async getAllGuests() {
    return memoryStore.guests.map((g) => {
      const access = memoryStore.guest_event_access.filter((a) => a.guest_id === g.id);
      const rsvps = memoryStore.rsvps.filter((r) => r.guest_id === g.id);
      const token = memoryStore.guestTokens.get(g.id) || 'demo-token';
      return {
        ...g,
        token,
        event_access: access,
        rsvps,
      };
    });
  }

  /**
   * Admin: Add a new guest with permissions
   */
  static async addGuest(params: {
    displayName: string;
    phone: string;
    allowedEventIds: string[];
    maxAttendees: number;
    notes?: string;
  }): Promise<{ guest: Guest; token: string }> {
    const { generateGuestToken } = await import('@/lib/security/token');
    const token = generateGuestToken();
    const tokenHash = hashGuestToken(token);
    const guestId = 'guest_' + Math.random().toString(36).substring(2, 10);

    const newGuest: Guest = {
      id: guestId,
      wedding_id: INITIAL_WEDDING.id,
      display_name: params.displayName.trim(),
      phone: params.phone.trim(),
      token_hash: tokenHash,
      max_attendees: params.maxAttendees,
      invitation_status: 'created',
      expires_at: null,
      notes: params.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    memoryStore.guests.unshift(newGuest);
    memoryStore.guestTokens.set(guestId, token);

    for (const eventId of params.allowedEventIds) {
      memoryStore.guest_event_access.push({
        id: Math.random().toString(),
        guest_id: guestId,
        event_id: eventId,
        max_attendees: params.maxAttendees,
        created_at: new Date().toISOString(),
      });
    }

    return { guest: newGuest, token };
  }

  /**
   * Admin: Regenerate guest token
   */
  static async regenerateGuestToken(guestId: string): Promise<string> {
    const guest = memoryStore.guests.find((g) => g.id === guestId);
    if (!guest) throw new Error('Guest not found');

    const { generateGuestToken } = await import('@/lib/security/token');
    const newToken = generateGuestToken();
    guest.token_hash = hashGuestToken(newToken);
    guest.updated_at = new Date().toISOString();
    memoryStore.guestTokens.set(guestId, newToken);
    return newToken;
  }

  /**
   * Admin: Revoke guest token
   */
  static async revokeGuest(guestId: string): Promise<boolean> {
    const guest = memoryStore.guests.find((g) => g.id === guestId);
    if (!guest) return false;
    guest.invitation_status = 'revoked';
    guest.updated_at = new Date().toISOString();
    return true;
  }

  /**
   * Admin: Mark invitation as sent
   */
  static async markAsSent(guestId: string): Promise<boolean> {
    const guest = memoryStore.guests.find((g) => g.id === guestId);
    if (!guest) return false;
    if (guest.invitation_status === 'created') {
      guest.invitation_status = 'sent';
      guest.updated_at = new Date().toISOString();
    }
    return true;
  }

  /**
   * Get default wedding details
   */
  static async getDefaultWedding(): Promise<Wedding> {
    return memoryStore.weddings[0];
  }

  /**
   * Get all wedding events
   */
  static async getAllEvents(): Promise<WeddingEvent[]> {
    return memoryStore.events;
  }
}
