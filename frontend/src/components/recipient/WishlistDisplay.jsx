import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pledgeWishlistItem } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';

const CATEGORY_EMOJIS = {
  chocolates: '🍫',
  tech:       '💻',
  books:      '📚',
  experiences:'🎡',
  fashion:    '👗',
  food:       '🍕',
  Custom:     '🎁',
};

const WishlistDisplay = ({ packetId, items = [] }) => {
  const [wishlist, setWishlist] = useState(items);

  if (items.length === 0) return null;

  const handlePledge = async (item) => {
    if (item.status === 'pledged') return;

    try {
      if (packetId && packetId !== 'demo') {
        await pledgeWishlistItem(packetId, item.id || item._id);
      }
      setWishlist(prev =>
        prev.map(i => (i.id === item.id || i._id === item._id) ? { ...i, status: 'pledged' } : i)
      );
      showSuccess(`🎁 You pledged to get: ${item.item}!`);
    } catch {
      showError('Failed to record pledge. Please try again.');
    }
  };

  return (
    <section className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="font-display text-headline-md text-primary">Secret Wishlist 🎁</h2>
        <p className="font-body text-body-md text-on-surface-variant">Here are a few things your sibling would love to get!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlist.map((item, index) => {
          const isPledged = item.status === 'pledged';
          const emoji = CATEGORY_EMOJIS[item.category] || '🎁';

          return (
            <motion.div
              key={item.id || item._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`rounded-3xl p-5 border flex flex-col justify-between transition-all ${
                isPledged
                  ? 'bg-tertiary-fixed/30 border-tertiary-fixed-dim'
                  : 'bg-surface-container-lowest border-outline-variant/30 shadow-card hover:shadow-card-hover'
              }`}
            >
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{emoji}</span>
                  <span className={`text-[11px] font-body font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    isPledged ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {isPledged ? 'Pledged ✨' : item.category}
                  </span>
                </div>
                <h3 className="font-display text-headline-md text-on-surface">{item.item}</h3>
              </div>

              <button
                onClick={() => handlePledge(item)}
                disabled={isPledged}
                className={`w-full py-2.5 px-4 rounded-full font-body font-bold text-label-bold transition-all flex items-center justify-center gap-2 ${
                  isPledged
                    ? 'bg-tertiary text-on-tertiary cursor-default'
                    : 'bg-primary text-on-primary hover:scale-105 active:scale-95 shadow-md'
                }`}
              >
                {isPledged ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Promised / Pledged!
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                    Pledge This Gift
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default WishlistDisplay;
