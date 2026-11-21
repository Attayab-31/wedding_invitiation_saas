export type EventType = 'mehndi' | 'barat' | 'walima' | 'custom';
export type InvitationStatus = 'created' | 'sent' | 'opened' | 'responded' | 'revoked';
export type AdminRole = 'owner' | 'manager';

export interface Wedding {
  id: string;
  title: string;
  couple_names: string;
  bride_name: string;
  groom_name: string;
  host_names: string;
  wedding_date: string;
  slug: string;
  rsvp_deadline: string | null;
  primary_color: string;
  accent_color: string;
  created_at: string;
  updated_at: string;
}

export interface WeddingEvent {
  id: string;
  wedding_id: string;
  event_type: EventType;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string | null;
  venue_name: string;
  venue_address: string;
  google_maps_url: string | null;
  dress_code: string | null;
  description: string | null;
  theme_color: string | null;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  wedding_id: string;
  display_name: string;
  phone: string;
  token_hash: string;
  max_attendees: number;
  invitation_status: InvitationStatus;
  expires_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface GuestEventAccess {
  id: string;
  guest_id: string;
  event_id: string;
  max_attendees: number;
  created_at: string;
}

export interface RSVP {
  id: string;
  guest_id: string;
  event_id: string;
  attending: boolean;
  headcount: number;
  dietary_notes: string | null;
  message: string | null;
  submitted_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  wedding_id: string;
  user_id: string;
  email: string;
  role: AdminRole;
  created_at: string;
}

export interface InvitationLog {
  id: string;
  guest_id: string;
  action: 'created' | 'sent_whatsapp' | 'opened' | 'rsvp_submitted';
  ip_address?: string | null;
  user_agent?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
}

/**
 * Resolved Guest Profile for dynamic invitation experience
 */
export interface ResolvedGuestExperience {
  guest: {
    id: string;
    display_name: string;
    phone: string;
    invitation_status: InvitationStatus;
  };
  wedding: Wedding;
  events: WeddingEvent[];
}
