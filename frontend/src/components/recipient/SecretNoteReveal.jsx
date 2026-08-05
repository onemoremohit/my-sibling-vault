import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SecretNoteReveal = ({ secretNote }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!secretNote) return null;

  return (
    <div className="mt-3">
      {!isRevealed ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsRevealed(true)}
          className="w-full bg-secondary-container/40 border border-secondary-fixed hover:bg-secondary-container/60 text-secondary p-3 rounded-xl flex items-center justify-center gap-2 font-body font-bold text-label-bold transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">lock</span>
          Tap to reveal secret message 🔒
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-secondary-fixed/30 border border-secondary-fixed-dim p-4 rounded-xl space-y-1"
          >
            <div className="flex items-center gap-2 text-secondary font-body font-bold text-caption uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">lock_open</span>
              Secret Unlocked!
            </div>
            <p className="font-body text-body-md text-on-surface italic">
              "{secretNote}"
            </p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default SecretNoteReveal;
