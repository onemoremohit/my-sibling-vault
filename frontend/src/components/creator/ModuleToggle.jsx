import React from 'react';
import { motion } from 'framer-motion';
import usePacket from '../../hooks/usePacket';
import { t as translate } from '../../i18n/translations';

// Wishlist is MANDATORY — always included, cannot be removed.
const MANDATORY_MODULES = ['wishlist'];

const ModuleToggle = () => {
  const { packet, toggleModule, t: contextT } = usePacket();
  const t = (key) => (contextT ? contextT(key) : translate(key, packet?.language || 'en'));

  const ALL_MODULES = [
    { id: 'timeline', icon: 'photo_library',         label: t('modTimelineTitle'), desc: t('modTimelineDesc') },
    { id: 'wishlist', icon: 'card_giftcard',          label: t('modWishlistTitle'), desc: t('modWishlistDesc') },
    { id: 'wheel',    icon: 'casino',                 label: t('modWheelTitle'),    desc: t('modWheelDesc') },
    { id: 'coupons',  icon: 'confirmation_number',    label: t('modCouponsTitle'),  desc: t('modCouponsDesc') },
    { id: 'funZone',  icon: 'local_fire_department',  label: t('modFunZoneTitle'),  desc: t('modFunZoneDesc') },
  ];

  return (
    <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
      <h3 className="font-display text-headline-md text-on-surface mb-1">{t('chooseModulesTitle')}</h3>
      <p className="font-body text-caption text-on-surface-variant mb-4">{t('chooseModulesDesc')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALL_MODULES.map((mod) => {
          const isMandatory = MANDATORY_MODULES.includes(mod.id);
          const active = packet.modules.includes(mod.id) || isMandatory;

          return (
            <motion.button
              key={mod.id}
              onClick={() => !isMandatory && toggleModule(mod.id)}
              whileTap={!isMandatory ? { scale: 0.97 } : {}}
              style={{ cursor: isMandatory ? 'default' : 'pointer' }}
              className={`relative flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                active
                  ? 'border-secondary bg-secondary-fixed text-on-surface'
                  : 'border-outline-variant bg-surface-container-low text-on-surface-variant'
              } ${isMandatory ? 'opacity-90 ring-2 ring-primary/20' : ''}`}
            >
              {/* Optional / Mandatory badge */}
              {isMandatory ? (
                <span className="absolute top-1.5 right-1.5 text-[9px] font-body font-black uppercase tracking-widest bg-primary text-on-primary px-1.5 py-0.5 rounded-full">
                  Required
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 text-[9px] font-body font-bold uppercase tracking-widest bg-surface-container text-on-surface-variant border border-outline-variant/40 px-1.5 py-0.5 rounded-full">
                  Optional
                </span>
              )}

              <span className={`material-symbols-outlined text-2xl ${active ? 'text-secondary' : 'text-outline'}`}>
                {mod.icon}
              </span>
              <div className="flex-1 min-w-0 pr-10">
                <p className="font-body font-bold text-label-bold truncate">{mod.label}</p>
                <p className="font-body text-caption truncate">{mod.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                active ? 'bg-secondary border-secondary' : 'border-outline-variant'
              }`}>
                {active && <span className="material-symbols-outlined text-on-secondary text-[14px]">check</span>}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Hint */}
      <p className="font-body text-caption text-on-surface-variant mt-3 italic">
        ✅ <strong>Required</strong> sections are always included. Toggle <strong>Optional</strong> sections on/off — disabled ones will not appear for the recipient.
      </p>
    </div>
  );
};

export default ModuleToggle;
