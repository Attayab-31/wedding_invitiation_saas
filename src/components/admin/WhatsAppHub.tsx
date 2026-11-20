'use client';

import React, { useState, useMemo } from 'react';
import { Wedding, WeddingEvent } from '@/types/database';
import {
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Send,
  Sparkles,
  Download,
  CheckCircle2,
  Filter,
} from 'lucide-react';

interface WhatsAppHubProps {
  initialGuests: any[];
  wedding: Wedding;
  events: WeddingEvent[];
}

export function WhatsAppHub({ initialGuests, wedding, events }: WhatsAppHubProps) {
  const [guests, setGuests] = useState(initialGuests);
  const [template, setTemplate] = useState<'formal' | 'warm' | 'romanUrdu'>('formal');
  const [filter, setFilter] = useState<'all' | 'unsent' | 'sent'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedGuestId, setSelectedGuestId] = useState<string>(
    initialGuests[0]?.id || ''
  );

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://wedding.example.com';

  // Templates generator
  const generateMessage = (guestName: string, token: string) => {
    const inviteUrl = `${origin}/invite/${token}`;

    if (template === 'romanUrdu') {
      return `Assalam-o-Alaikum ${guestName},

Nihayat musarrat ke sath hum aap ko aur aapki family ko apni shadi ki taqreebaat mein shirkat ki dawat dete hain.

Aapka personalized 3D invitation card yahan dekhein:
${inviteUrl}

Aapki aamad aur duayein hamare liye baais-e-barkat hongi.

Dua-go,
${wedding.host_names}`;
    }

    if (template === 'warm') {
      return `Dear ${guestName},

We would be deeply honored and delighted to have you celebrate our wedding festivities with us!

Please open your personalized invitation here:
${inviteUrl}

Looking forward to creating cherished memories together.

With love and warm regards,
${wedding.couple_names} & Families`;
    }

    // Default Formal
    return `Assalam-o-Alaikum ${guestName},

With immense joy, we invite you to join us in celebrating our wedding festivities.

Your personalized digital invitation is available here:
${inviteUrl}

We look forward to celebrating these blessed moments together.

Warm regards,
${wedding.host_names}`;
  };

  const filteredGuests = guests.filter((g) => {
    if (filter === 'unsent') return g.invitation_status === 'created';
    if (filter === 'sent') return g.invitation_status !== 'created';
    return true;
  });

  const selectedGuest = guests.find((g) => g.id === selectedGuestId) || guests[0];

  const handleCopyMessage = (guest: any) => {
    const msg = generateMessage(guest.display_name, guest.token);
    navigator.clipboard.writeText(msg);
    setCopiedId(`msg_${guest.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyLink = (guest: any) => {
    const link = `${origin}/invite/${guest.token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(`link_${guest.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleMarkSent = async (guestId: string) => {
    try {
      await fetch(`/api/admin/guests/${guestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_sent' }),
      });
      setGuests((prev) =>
        prev.map((g) => (g.id === guestId ? { ...g, invitation_status: 'sent' } : g))
      );
    } catch {
      alert('Failed to update status');
    }
  };

  const openWhatsApp = (guest: any) => {
    const msg = generateMessage(guest.display_name, guest.token);
    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${guest.phone}?text=${encoded}`;
    window.open(waUrl, '_blank');
    handleMarkSent(guest.id);
  };

  const exportWhatsAppCSV = () => {
    const headers = ['guest_name', 'phone', 'whatsapp_link', 'invitation_url', 'message_text'];
    const lines = [headers.join(',')];

    filteredGuests.forEach((g) => {
      const msg = generateMessage(g.display_name, g.token);
      const encoded = encodeURIComponent(msg);
      const waUrl = `https://wa.me/${g.phone}?text=${encoded}`;
      const inviteUrl = `${origin}/invite/${g.token}`;

      lines.push(
        `"${g.display_name}","${g.phone}","${waUrl}","${inviteUrl}","${msg.replace(/\n/g, ' ')}"`
      );
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `whatsapp_invitations_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-royal font-bold text-gold-gradient flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-emerald-400" />
            WhatsApp Invitation Generator
          </h1>
          <p className="text-xs text-[#E6D2A0]/80 font-serif italic mt-0.5">
            Personalized wa.me deep links with pre-composed messages, one-click dispatch, and status tracking
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportWhatsAppCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3A0715] hover:bg-[#580F25] border border-[#C5A15A]/40 text-xs font-royal text-[#E6D2A0] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A15A]" />
            <span>Export WhatsApp Links CSV</span>
          </button>
        </div>
      </div>

      {/* Grid: Preview & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selector & Info */}
        <div className="mughal-border rounded-xl p-6 bg-[#23050E]/80 space-y-4">
          <span className="text-xs uppercase tracking-wider text-[#C5A15A] font-royal font-semibold block">
            Message Style &amp; Language
          </span>

          <div className="space-y-2">
            {[
              { id: 'formal', label: 'Royal Formal English', desc: 'Elegant traditional invitation phrasing' },
              { id: 'romanUrdu', label: 'Traditional Roman Urdu', desc: 'Familiar cultural warmth with Duas' },
              { id: 'warm', label: 'Warm Family & Friends', desc: 'Direct, personal, and celebratory' },
            ].map((t) => (
              <label
                key={t.id}
                onClick={() => setTemplate(t.id as any)}
                className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                  template === t.id
                    ? 'bg-[#3A0715] border-[#C5A15A] shadow-md ring-1 ring-[#C5A15A]'
                    : 'bg-[#191516]/60 border-[#C5A15A]/20 hover:border-[#C5A15A]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-royal font-bold text-xs text-[#F8F1E5]">{t.label}</span>
                  {template === t.id && <Check className="w-3.5 h-3.5 text-[#C5A15A]" />}
                </div>
                <span className="text-[10px] text-[#E6D2A0]/70 block mt-1">{t.desc}</span>
              </label>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-[#E6D2A0]/70 border-t border-[#C5A15A]/20">
            <p className="italic">
              * Note: `wa.me` links open WhatsApp with pre-filled text. Clicking dispatch opens WhatsApp Web or App for instant sending.
            </p>
          </div>
        </div>

        {/* Live Chat Bubble Preview */}
        <div className="lg:col-span-2 mughal-border rounded-xl p-6 bg-[#162016]/90 border-emerald-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-emerald-800/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold text-white">
                  WA
                </div>
                <div>
                  <span className="text-xs font-royal font-bold text-emerald-200 block">
                    Live WhatsApp Preview
                  </span>
                  <span className="text-[10px] text-emerald-300/70 block">
                    Previewing for: {selectedGuest?.display_name || 'Guest'}
                  </span>
                </div>
              </div>

              {selectedGuest && (
                <button
                  onClick={() => openWhatsApp(selectedGuest)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-royal font-semibold cursor-pointer shadow transition-transform active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp</span>
                </button>
              )}
            </div>

            {/* Bubble */}
            {selectedGuest && (
              <div className="max-w-lg bg-[#075E54] text-white p-4 rounded-xl rounded-tl-none shadow-md font-sans text-xs leading-relaxed space-y-2 relative">
                <pre className="whitespace-pre-wrap font-sans">
                  {generateMessage(selectedGuest.display_name, selectedGuest.token)}
                </pre>
                <div className="text-right text-[10px] text-white/60 flex items-center justify-end gap-1">
                  <span>Just now</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-300 inline" />
                </div>
              </div>
            )}
          </div>

          {selectedGuest && (
            <div className="mt-4 pt-3 border-t border-emerald-800/40 flex items-center justify-between text-xs text-emerald-200">
              <span>Recipient: +{selectedGuest.phone}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyMessage(selectedGuest)}
                  className="hover:underline text-[11px] text-emerald-300"
                >
                  {copiedId === `msg_${selectedGuest.id}` ? 'Copied Message!' : 'Copy Text'}
                </button>
                <span>•</span>
                <button
                  onClick={() => handleCopyLink(selectedGuest)}
                  className="hover:underline text-[11px] text-emerald-300"
                >
                  {copiedId === `link_${selectedGuest.id}` ? 'Copied URL!' : 'Copy URL'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guest Dispatch Table */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#C5A15A] font-royal font-semibold">
              Filter Guests:
            </span>
            <div className="flex rounded-lg border border-[#C5A15A]/30 bg-[#191516] p-0.5 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded cursor-pointer ${
                  filter === 'all' ? 'bg-[#3A0715] text-[#E6D2A0] font-semibold' : 'text-[#E6D2A0]/60'
                }`}
              >
                All ({guests.length})
              </button>
              <button
                onClick={() => setFilter('unsent')}
                className={`px-3 py-1 rounded cursor-pointer ${
                  filter === 'unsent' ? 'bg-[#3A0715] text-[#E6D2A0] font-semibold' : 'text-[#E6D2A0]/60'
                }`}
              >
                Unsent ({guests.filter((g) => g.invitation_status === 'created').length})
              </button>
              <button
                onClick={() => setFilter('sent')}
                className={`px-3 py-1 rounded cursor-pointer ${
                  filter === 'sent' ? 'bg-[#3A0715] text-[#E6D2A0] font-semibold' : 'text-[#E6D2A0]/60'
                }`}
              >
                Sent ({guests.filter((g) => g.invitation_status !== 'created').length})
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#C5A15A]/20 bg-[#1D1215]/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#2B0610] text-[#C5A15A] font-royal uppercase tracking-wider text-[11px] border-b border-[#C5A15A]/20">
              <tr>
                <th className="py-3 px-4">Guest Display Name</th>
                <th className="py-3 px-4">WhatsApp Phone</th>
                <th className="py-3 px-4">Invitation Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A15A]/10">
              {filteredGuests.map((guest) => {
                const isSelected = selectedGuest?.id === guest.id;
                return (
                  <tr
                    key={guest.id}
                    onClick={() => setSelectedGuestId(guest.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#3A0715]/70' : 'hover:bg-[#250812]/50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-serif font-bold text-sm text-[#F8F1E5] block">
                        {guest.display_name}
                      </span>
                      <span className="text-[10px] text-[#E6D2A0]/60">
                        Max: {guest.max_attendees} {guest.max_attendees === 1 ? 'Person' : 'People'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-[#E6D2A0]">
                      +{guest.phone}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-royal font-semibold border ${
                          guest.invitation_status !== 'created'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : 'bg-[#3A0715] text-[#E6D2A0] border-[#C5A15A]/30'
                        }`}
                      >
                        {guest.invitation_status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {/* Direct WhatsApp Button */}
                        <button
                          onClick={() => openWhatsApp(guest)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-royal font-semibold text-xs cursor-pointer shadow transition-transform active:scale-95"
                          title="Open WhatsApp chat with prefilled invitation message"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send WA</span>
                        </button>

                        {/* Copy Message */}
                        <button
                          onClick={() => handleCopyMessage(guest)}
                          className="p-1.5 rounded hover:bg-[#3A0715] text-[#C5A15A]"
                          title="Copy personalized text"
                        >
                          {copiedId === `msg_${guest.id}` ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Toggle Mark as Sent */}
                        <button
                          onClick={() => handleMarkSent(guest.id)}
                          className="p-1.5 rounded hover:bg-[#3A0715] text-[#E6D2A0]/70 hover:text-[#E6D2A0]"
                          title="Mark as dispatched"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
