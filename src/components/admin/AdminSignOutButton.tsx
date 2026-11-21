'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function AdminSignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    setIsSigningOut(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'POST',
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('Sign-out request failed.');
      router.replace('/admin/login');
      router.refresh();
    } catch {
      setIsSigningOut(false);
      setError('Unable to sign out. Please try again.');
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={signOut}
        disabled={isSigningOut}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#B88E3E]/40 px-3 py-1.5 text-xs text-[#DFCA94] transition hover:bg-[#3A0715] disabled:opacity-60"
      >
        <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
        {isSigningOut ? 'Signing out…' : 'Sign out'}
      </button>
      {error && <p role="alert" className="mt-1 text-[11px] text-red-300">{error}</p>}
    </div>
  );
}
