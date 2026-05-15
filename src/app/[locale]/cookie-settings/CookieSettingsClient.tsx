'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

function CookieToggle({
  label,
  description,
  enabled,
  onToggle,
  locked,
  badge,
  items,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  locked?: boolean;
  badge?: string;
  items?: string[];
}) {
  return (
    <div
      className="p-5 sm:p-6 rounded-xl"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              {label}
            </h3>
            {badge && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}
              >
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{description}</p>
        </div>
        <button
          onClick={locked ? undefined : onToggle}
          className={`cookie-toggle flex-shrink-0 mt-1 ${enabled ? 'active' : ''} ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
          aria-label={`Toggle ${label}`}
          disabled={locked}
        />
      </div>
      {items && items.length > 0 && (
        <ul className="mt-3 space-y-1.5" style={{ color: 'var(--text-muted)' }}>
          {items.map((item, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span style={{ color: 'var(--accent)' }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CookieSettingsClient() {
  const t = useTranslations('cookieSettings');
  const ht = useTranslations('header');
  const locale = useLocale();
  const homeHref = locale === 'en' ? '/' : `/${locale}`;

  const [analytics, setAnalytics] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const prefs = JSON.parse(localStorage.getItem('cookiePrefs') || '{}');
      if (prefs.analytics) setAnalytics(true);
      if (prefs.preferences) setPreferences(true);
      if (prefs.marketing) setMarketing(true);
    } catch {}
  }, []);

  function handleSave() {
    localStorage.setItem('cookiePrefs', JSON.stringify({ analytics, preferences, marketing }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleAcceptAll() {
    setAnalytics(true);
    setPreferences(true);
    setMarketing(true);
    localStorage.setItem('cookiePrefs', JSON.stringify({ analytics: true, preferences: true, marketing: true }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleRejectAll() {
    setAnalytics(false);
    setPreferences(false);
    setMarketing(false);
    localStorage.setItem('cookiePrefs', JSON.stringify({ analytics: false, preferences: false, marketing: false }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <a
          href={homeHref}
          className="inline-flex items-center gap-2 text-sm font-medium mb-10 transition-colors"
          style={{ color: 'var(--accent)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {ht('backToHome')}
        </a>

        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{t('lastUpdated')}</p>
        
        {t('intro') && (
          <p className="text-base mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('intro')}
          </p>
        )}
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="space-y-4 mb-8">
          <CookieToggle
            label={t('essential.title')}
            description={t('essential.description')}
            enabled={true}
            onToggle={() => {}}
            locked={true}
            badge={t('essential.badge')}
          />
          <CookieToggle
            label={t('analytics.title')}
            description={t('analytics.description')}
            enabled={analytics}
            onToggle={() => setAnalytics(!analytics)}
            items={t.raw('analytics.items')}
          />
          <CookieToggle
            label={t('preferences.title')}
            description={t('preferences.description')}
            enabled={preferences}
            onToggle={() => setPreferences(!preferences)}
            items={t.raw('preferences.items')}
          />
          <CookieToggle
            label={t('marketing.title')}
            description={t('marketing.description')}
            enabled={marketing}
            onToggle={() => setMarketing(!marketing)}
            items={t.raw('marketing.items')}
          />
        </div>

        {t('consent.description') && (
          <div className="mb-6 p-4 rounded-lg" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('consent.description')}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white transition-colors"
            style={{ background: 'var(--accent)' }}
          >
            {saved ? t('saved') : t('save')}
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
            style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            {t('consent.acceptAll')}
          </button>
          <button
            onClick={handleRejectAll}
            className="px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
            style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            {t('consent.rejectAll')}
          </button>
        </div>
      </div>
    </div>
  );
}
