import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { t } from '../../i18n/translations';

const Navbar = ({ mode = 'creator', onShare, onPreview, lang = 'en' }) => {
  const location = useLocation();
  const isStudio = location.pathname === '/studio';

  return (
    <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant shadow-nav">
      <div className="max-w-container mx-auto px-gutter flex items-center justify-between h-16">

        {/* Brand */}
        <Link to="/" className="font-display text-display-mobile text-primary tracking-tight hover:opacity-80 transition-opacity">
          {t('brandName', lang)}
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Mode badge */}
          <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-bold font-body text-xs uppercase tracking-wider ${
            mode === 'creator'
              ? 'bg-secondary-fixed text-on-secondary-fixed'
              : 'bg-tertiary-fixed text-on-tertiary-fixed'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow" />
            {mode === 'creator' ? t('creatorStudioBadge', lang) : t('previewModeBadge', lang)}
          </span>

          {/* Preview toggle (creator only) */}
          {isStudio && onPreview && (
            <button
              onClick={onPreview}
              className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
              title="Toggle live preview"
            >
              <span className="material-symbols-outlined">phone_iphone</span>
            </button>
          )}

          {/* Share button (creator only) */}
          {isStudio && onShare && (
            <button
              onClick={onShare}
              className="bg-primary text-on-primary px-5 py-2 rounded-full font-body font-bold text-label-bold transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-card"
            >
              <span className="material-symbols-outlined text-[18px]">ios_share</span>
              <span className="hidden sm:inline">{t('generateShareBtn', lang)}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
