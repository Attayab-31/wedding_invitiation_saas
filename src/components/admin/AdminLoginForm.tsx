'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';

function getErrorMessage(value: unknown) {
  if (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'string'
  ) {
    return value.error;
  }
  return 'Unable to sign in. Please try again.';
}

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      });

      if (!response.ok) {
        setError(getErrorMessage(await response.json()));
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Unable to reach the sign-in service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-4 py-10">
      <div className="mughal-border w-full max-w-md rounded-2xl bg-[#23050E]/90 p-6 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#C5A15A]/50 bg-[#3A0715] text-[#E6D2A0]">
            <LockKeyhole aria-hidden="true" className="h-5 w-5" />
          </div>
          <p className="font-royal text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C5A15A]">
            Owner access
          </p>
          <h1 className="mt-2 font-royal text-2xl font-bold text-gold-gradient">
            Imperial Wedding Admin
          </h1>
          <p className="mt-2 font-serif text-sm italic text-[#E6D2A0]/75">
            Sign in with the credentials configured on the server.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1 block font-royal text-xs uppercase tracking-wider text-[#C5A15A]">
              Admin email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
              className="w-full rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3.5 py-3 text-sm text-[#F8F1E5] focus:border-[#C5A15A] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-1 block font-royal text-xs uppercase tracking-wider text-[#C5A15A]">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={256}
              className="w-full rounded-lg border border-[#C5A15A]/30 bg-[#191516] px-3.5 py-3 text-sm text-[#F8F1E5] focus:border-[#C5A15A] focus:outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-500/40 bg-red-950/60 p-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg border border-[#C5A15A] bg-gradient-to-r from-[#580F25] to-[#3A0715] px-4 py-3 font-royal text-xs font-semibold uppercase tracking-wider text-[#E6D2A0] transition hover:brightness-125 disabled:cursor-wait disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-[11px] text-[#E6D2A0]/55">
          Admin signup is disabled. Credentials are provisioned through environment variables.
        </p>
      </div>
    </main>
  );
}
