import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../../i18n/translations';

const SecretNoteReveal = ({ secretNote, lang = 'en' }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!secretNote) return null;

  return (
    <div className="mt-4">
      {!isRevealed ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsRevealed(true);
          }}
          className="w-full bg-gradient-to-r from-amber-500/20 via-primary-fixed/30 to-secondary-fixed/20 border-2 border-primary-fixed-dim hover:border-primary text-primary p-4 rounded-2xl flex items-center justify-between gap-3 font-body font-bold text-label-bold transition-all shadow-md group relative overflow-hidden"
        >
          {/* Shimmer background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />

          <div className="flex items-center gap-3">
            <span className="text-2xl group-hover:rotate-12 transition-transform">✉️</span>
            <span className="text-left font-display font-bold text-body-md text-on-surface">
              {t('tapToRevealSecret', lang)}
            </span>
          </div>

          <span className="w-8 h-8 bg-primary text-on-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
            🔑
          </span>
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-amber-50/80 border-2 border-dashed border-primary-fixed-dim p-5 rounded-2xl space-y-2 relative shadow-soft-memory overflow-hidden"
          >
            {/* Wax Seal Icon Ribbon */}
            <div className="flex items-center justify-between border-b border-primary-fixed-dim/30 pb-2">
              <div className="flex items-center gap-2 text-primary font-display font-bold text-caption uppercase tracking-wider">
                <span className="text-lg">📜</span>
                {t('secretUnlocked', lang)}
              </div>
              <span className="text-xs bg-primary-fixed text-on-primary-fixed font-body font-bold px-2.5 py-0.5 rounded-full">
                Secret Note 🔒
              </span>
            </div>

            <p className="font-serif text-body-lg text-primary italic font-medium leading-relaxed pt-1">
              "{secretNote}"
            </p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default SecretNoteReveal;
