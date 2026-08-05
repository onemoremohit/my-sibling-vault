import React from 'react';
import { motion } from 'framer-motion';
import usePacket from '../../hooks/usePacket';

const ALL_MODULES = [
  { id: 'timeline', icon: 'photo_library', label: 'Memory Timeline', desc: 'Photos, stories & secret notes' },
  { id: 'wishlist', icon: 'card_giftcard',  label: 'Gift Wishlist',   desc: 'Let them pledge your gift' },
  { id: 'wheel',    icon: 'casino',         label: 'Punishment Wheel',desc: 'Spin for hilarious dares' },
  { id: 'coupons',  icon: 'confirmation_number', label: 'Coupon Book', desc: 'Redeemable favor cards' },
];

const ModuleToggle = () => {
  const { packet, toggleModule } = usePacket();

  return (
    <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
      <h3 className="font-display text-headline-md text-on-surface mb-1">Choose Modules</h3>
      <p className="font-body text-caption text-on-surface-variant mb-4">Select what goes inside your vault</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALL_MODULES.map((mod) => {
          const active = packet.modules.includes(mod.id);
          return (
            <motion.button
              key={mod.id}
              onClick={() => toggleModule(mod.id)}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                active
                  ? 'border-secondary bg-secondary-fixed text-on-surface'
                  : 'border-outline-variant bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl ${active ? 'text-secondary' : 'text-outline'}`}>
                {mod.icon}
              </span>
              <div className="flex-1 min-w-0">
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
    </div>
  );
};

export default ModuleToggle;
