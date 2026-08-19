import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import MyVaultsModal from './MyVaultsModal';
import { t } from '../../i18n/translations';

const Navbar = ({ mode = 'creator', onShare, onPreview, lang = 'en' }) => {
  const location = useLocation();
  const isStudio = location.pathname === '/studio';
  const { user, isAuthenticated, loginWithGoogle, logout } = useAuth();

  const [showMyVaults, setShowMyVaults] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userFirstName = user?.name ? user.name.split(' ')[0] : 'Creator';

  return (
    <>
      <nav className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant shadow-nav w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 h-14 sm:h-16">

          {/* Brand */}
          <Link
            to="/"
            className="shrink-0 flex items-center gap-1.5 sm:gap-2 font-display text-sm font-bold sm:text-base md:text-xl text-primary tracking-tight whitespace-nowrap hover:opacity-80 transition-opacity"
          >
            <span className="text-base sm:text-xl">🎁</span>
            <span>{t('brandName', lang)}</span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mode badge */}
            <span
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-bold font-body text-xs uppercase tracking-wider ${
                mode === 'creator'
                  ? 'bg-secondary-fixed text-on-secondary-fixed'
                  : 'bg-tertiary-fixed text-on-tertiary-fixed'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow" />
              {mode === 'creator' ? t('creatorStudioBadge', lang) : t('previewModeBadge', lang)}
            </span>

            {/* Share button (creator only) */}
            {isStudio && onShare && (
              <button
                onClick={onShare}
                className="bg-primary text-on-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-body font-bold text-xs sm:text-sm transition-transform hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-1.5 shadow-card shrink-0 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[18px]">ios_share</span>
                <span className="hidden sm:inline">{t('generateShareBtn', lang)}</span>
                <span className="sm:hidden">Share</span>
              </button>
            )}

            {/* ── User Auth Section ── */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1 sm:gap-2 p-1 sm:px-3 sm:py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/40 transition-all cursor-pointer shrink-0"
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-primary object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                      {userFirstName.charAt(0)}
                    </div>
                  )}
                  <span className="hidden sm:inline font-body font-bold text-xs sm:text-sm text-on-surface">
                    {userFirstName}
                  </span>
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-on-surface-variant">
                    {dropdownOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 sm:w-56 bg-surface rounded-2xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-outline-variant/20">
                      <p className="font-display font-bold text-xs sm:text-sm text-on-surface truncate">
                        {user.name}
                      </p>
                      <p className="font-body text-[11px] text-on-surface-variant truncate">
                        {user.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        setShowMyVaults(true);
                      }}
                      className="w-full px-4 py-2 text-left font-body font-medium text-xs sm:text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">inventory_2</span>
                      <span>My Vaults</span>
                    </button>

                    <Link
                      to="/studio"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full px-4 py-2 text-left font-body font-medium text-xs sm:text-sm text-on-surface hover:bg-surface-container-low flex items-center gap-2 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-secondary">add_circle</span>
                      <span>Create New Vault</span>
                    </Link>

                    <div className="border-t border-outline-variant/20 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left font-body font-medium text-xs sm:text-sm text-error hover:bg-error-container/20 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center shrink-0">
                <GoogleLogin
                  onSuccess={(credentialResponse) => loginWithGoogle(credentialResponse)}
                  onError={() => console.error('Google Sign In Failed')}
                  type="standard"
                  theme="outline"
                  size="small"
                  text="signin"
                  shape="pill"
                />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* User's Vaults Modal */}
      <MyVaultsModal isOpen={showMyVaults} onClose={() => setShowMyVaults(false)} />
    </>
  );
};

export default Navbar;
