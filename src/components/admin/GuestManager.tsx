'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WeddingEvent } from '@/types/database';
import {
  Search,
  Plus,
  Copy,
  ExternalLink,
  RefreshCw,
  Ban,
  Check,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  MessageCircle,
} from 'lucide-react';

interface GuestManagerProps {
  initialGuests: any[];
  events: WeddingEvent[];
}

export function GuestManager({ initialGuests, events }: GuestManagerProps) {
  const [guests, setGuests] = useState(initialGuests);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add Guest Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newMaxAttendees, setNewMaxAttendees] = useState(2);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(events.map((e) => e.id));
  const [newNotes, setNewNotes] = useState('');
  const [addError, setAddError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter logic
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.display_name.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.includes(search);

    const matchesStatus = statusFilter === 'all' || g.invitation_status === statusFilter;

    const matchesEvent =
      eventFilter === 'all' ||
      g.event_access?.some((a: any) => a.event_id === eventFilter);

    return matchesSearch && matchesStatus && matchesEvent;
  });

  const copyInviteLink = (guestId: string, token: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/invite/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(guestId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerateToken = async (guestId: string) => {
    if (!confirm('Are you sure you want to regenerate this invitation token? The old link will stop working.')) return;
    try {
      const res = await fetch(`/api/admin/guests/${guestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'regenerate_token' }),
      });
      const data = await res.json();
      if (data.success) {
        setGuests((prev) =>
          prev.map((g) => (g.id === guestId ? { ...g, token: data.token } : g))
        );
        alert('New token generated successfully!');
      }
    } catch {
      alert('Failed to regenerate token.');
    }
  };

  const handleRevoke = async (guestId: string) => {
    if (!confirm('Revoke this invitation? The guest will no longer be able to open the page or RSVP.')) return;
    try {
      const res = await fetch(`/api/admin/guests/${guestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke' }),
      });
      const data = await res.json();
      if (data.success) {
        setGuests((prev) =>
          prev.map((g) => (g.id === guestId ? { ...g, invitation_status: 'revoked' } : g))
        );
      }
    } catch {
      alert('Failed to revoke invitation.');
    }
  };

  const handleMarkSent = async (guestId: string) => {
    try {
      const res = await fetch(`/api/admin/guests/${guestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_sent' }),
      });
      const data = await res.json();
      if (data.success) {
        setGuests((prev) =>
          prev.map((g) => (g.id === guestId ? { ...g, invitation_status: 'sent' } : g))
        );
      }
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: newDisplayName,
          phone: newPhone,
          allowedEventIds: selectedEventIds,
          maxAttendees: newMaxAttendees,
          notes: newNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setAddError(data.error || 'Failed to add guest');
        setIsSubmitting(false);
        return;
      }

      // Add to local state
      const createdGuest = {
        ...data.guest,
        token: data.token,
        event_access: selectedEventIds.map((id) => ({ event_id: id, max_attendees: newMaxAttendees })),
        rsvps: [],
      };

      setGuests([createdGuest, ...guests]);
      setIsAddModalOpen(false);
      setNewDisplayName('');
      setNewPhone('');
      setNewNotes('');
    } catch {
      setAddError('Network error while adding guest.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-royal font-bold text-gold-gradient">
            Guest Invitation Registry
          </h1>
          <p className="text-xs text-[#E6D2A0]/80 font-serif italic mt-0.5">
            Manage invitations, permissions, RSVP statuses, and secure cryptographic tokens
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#580F25] to-[#3A0715] border border-[#C5A15A] text-[#E6D2A0] text-xs font-royal font-semibold uppercase tracking-wider shadow-lg hover:shadow-[0_0_15px_rgba(197,161,90,0.3)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C5A15A]" />
          <span>Add New Guest</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl bg-[#23050E]/80 border border-[#C5A15A]/20">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-[#C5A15A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or phone (e.g. Bilal, 92300...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#191516]/80 border border-[#C5A15A]/30 text-xs text-[#F8F1E5] placeholder-[#F8F1E5]/30 focus:outline-none focus:border-[#C5A15A]"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#191516]/80 border border-[#C5A15A]/30 text-xs text-[#E6D2A0] focus:outline-none focus:border-[#C5A15A]"
          >
            <option value="all">All Invitation Statuses</option>
            <option value="created">Created (Unsent)</option>
            <option value="sent">Sent via WhatsApp</option>
            <option value="opened">Opened 3D Experience</option>
            <option value="responded">Responded RSVP</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>

        <div>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[#191516]/80 border border-[#C5A15A]/30 text-xs text-[#E6D2A0] focus:outline-none focus:border-[#C5A15A]"
          >
            <option value="all">All Event Permissions</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                Invited to: {e.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Guest Table */}
      <div className="overflow-x-auto rounded-xl border border-[#C5A15A]/20 bg-[#1D1215]/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#2B0610] text-[#C5A15A] font-royal uppercase tracking-wider text-[11px] border-b border-[#C5A15A]/20">
            <tr>
              <th className="py-3.5 px-4">Guest Name</th>
              <th className="py-3.5 px-4">Phone</th>
              <th className="py-3.5 px-4">Permitted Events</th>
              <th className="py-3.5 px-4 text-center">Max Headcount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C5A15A]/10 font-sans">
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#E6D2A0]/60 font-serif italic">
                  No matching guests found.
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => {
                const guestEvents = events.filter((e) =>
                  guest.event_access?.some((a: any) => a.event_id === e.id)
                );

                const statusColor =
                  guest.invitation_status === 'responded'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    : guest.invitation_status === 'opened'
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                    : guest.invitation_status === 'sent'
                    ? 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                    : guest.invitation_status === 'revoked'
                    ? 'bg-red-950/80 text-red-300 border-red-500/40'
                    : 'bg-[#3A0715] text-[#E6D2A0] border-[#C5A15A]/30';

                return (
                  <tr key={guest.id} className="hover:bg-[#250812]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-serif font-bold text-sm text-[#F8F1E5] block">
                        {guest.display_name}
                      </span>
                      {guest.notes && (
                        <span className="text-[10px] text-[#E6D2A0]/60 italic block">
                          {guest.notes}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-[#E6D2A0]">
                      {guest.phone}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {guestEvents.map((e) => (
                          <span
                            key={e.id}
                            className="px-2 py-0.5 rounded text-[10px] uppercase font-royal font-semibold bg-[#3A0715] border border-[#C5A15A]/30 text-[#E6D2A0]"
                          >
                            {e.event_type}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-royal font-bold text-sm text-[#F8F1E5]">
                      {guest.max_attendees}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-royal font-semibold border ${statusColor}`}
                      >
                        {guest.invitation_status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Copy Link */}
                        <button
                          onClick={() => copyInviteLink(guest.id, guest.token)}
                          className="p-1.5 rounded hover:bg-[#3A0715] text-[#C5A15A] transition-colors"
                          title="Copy unique invitation link"
                        >
                          {copiedId === guest.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Open Experience */}
                        <Link
                          href={`/invite/${guest.token}`}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-[#3A0715] text-[#C5A15A] transition-colors"
                          title="Open 3D invitation experience"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* WhatsApp Hub Link */}
                        <Link
                          href={`/admin/whatsapp?guest=${guest.id}`}
                          className="p-1.5 rounded hover:bg-[#3A0715] text-emerald-400 transition-colors"
                          title="Compose WhatsApp invitation"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Link>

                        {/* Regenerate Token */}
                        <button
                          onClick={() => handleRegenerateToken(guest.id)}
                          className="p-1.5 rounded hover:bg-[#3A0715] text-[#E6D2A0]/70 hover:text-[#E6D2A0] transition-colors"
                          title="Regenerate cryptographic token"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>

                        {/* Revoke */}
                        {guest.invitation_status !== 'revoked' && (
                          <button
                            onClick={() => handleRevoke(guest.id)}
                            className="p-1.5 rounded hover:bg-red-950/60 text-red-400 transition-colors"
                            title="Revoke access"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Guest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="mughal-border max-w-lg w-full bg-[#20050D] p-6 md:p-8 rounded-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#C5A15A]/20 pb-4">
              <div>
                <h3 className="text-xl font-royal font-bold text-gold-gradient">
                  Add New Guest Invitation
                </h3>
                <p className="text-xs text-[#E6D2A0]/70 font-serif italic">
                  Creates secure bearer token &amp; function permissions
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#E6D2A0]/70 hover:text-[#E6D2A0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-lg bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A15A] font-royal mb-1">
                  Guest / Family Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bilal Ahmed & Family, or Mr. Muhammad Ali"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#191516] border border-[#C5A15A]/30 text-xs text-[#F8F1E5] focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A15A] font-royal mb-1">
                  Pakistani Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 03001234567 or +923001234567"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#191516] border border-[#C5A15A]/30 text-xs text-[#F8F1E5] focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A15A] font-royal mb-1">
                  Maximum Permitted Attendees *
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={newMaxAttendees}
                  onChange={(e) => setNewMaxAttendees(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#191516] border border-[#C5A15A]/30 text-xs text-[#F8F1E5] focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A15A] font-royal mb-2">
                  Invited Functions *
                </label>
                <div className="space-y-2">
                  {events.map((evt) => {
                    const isChecked = selectedEventIds.includes(evt.id);
                    return (
                      <label
                        key={evt.id}
                        className="flex items-center gap-2 p-2 rounded bg-[#191516]/60 border border-[#C5A15A]/20 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEventIds([...selectedEventIds, evt.id]);
                            } else {
                              setSelectedEventIds(selectedEventIds.filter((id) => id !== evt.id));
                            }
                          }}
                          className="accent-[#C5A15A]"
                        />
                        <span className="font-royal font-semibold text-[#F8F1E5]">
                          {evt.title}
                        </span>
                        <span className="text-[10px] text-[#C5A15A] uppercase">
                          ({evt.event_type})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C5A15A] font-royal mb-1">
                  Admin Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP groom side, cousins"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#191516] border border-[#C5A15A]/30 text-xs text-[#F8F1E5] focus:outline-none focus:border-[#C5A15A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#C5A15A]/20">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/20 text-xs text-[#E6D2A0]/80 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#580F25] to-[#3A0715] border border-[#C5A15A] text-xs font-royal font-semibold text-[#E6D2A0] shadow hover:shadow-[0_0_15px_rgba(197,161,90,0.3)] disabled:opacity-50"
                >
                  {isSubmitting ? 'Generating...' : 'Save & Generate Token'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
