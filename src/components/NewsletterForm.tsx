'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function NewsletterForm() {
  const t = useTranslations('home');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="font-outfit font-semibold text-ink animate-on-scroll">
        {t('newsletter_success')}
      </p>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 justify-center animate-on-scroll"
      >
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletter_placeholder')}
          className="flex-1 max-w-sm px-4 py-3 rounded-xl border border-ink/10 bg-white font-outfit text-sm text-ink placeholder-gray/50 focus:outline-none focus:ring-2 focus:ring-teal/40"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="px-6 py-3 bg-teal text-white font-outfit font-semibold text-sm rounded-xl hover:bg-teal/90 transition-colors whitespace-nowrap disabled:opacity-60"
        >
          {status === 'sending' ? '...' : t('newsletter_cta')}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs font-semibold text-red-700 mt-3">{t('newsletter_error')}</p>
      )}
      <p className="text-xs font-light text-ink/50 mt-4 animate-on-scroll">
        {t('newsletter_disclaimer')}{' '}
        <Link href="/politica-de-privacidad" className="underline hover:text-teal">
          {t('newsletter_privacy_link')}
        </Link>
      </p>
    </>
  );
}
