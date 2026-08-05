import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePacket from '../../hooks/usePacket';
import { showSuccess, showError } from '../common/Toast';

const PRESET_CATEGORIES = [
  { id: 'chocolates',   emoji: '🍫', label: 'Chocolates'  },
  { id: 'tech',         emoji: '💻', label: 'Tech'        },
  { id: 'books',        emoji: '📚', label: 'Books'       },
  { id: 'experiences',  emoji: '🎡', label: 'Experiences' },
  { id: 'fashion',      emoji: '👗', label: 'Fashion'     },
  { id: 'food',         emoji: '🍕', label: 'Food'        },
];

const WishlistSetup = () => {
  const { packet, addWishlistItem, removeWishlistItem } = usePacket();
  const [customItem, setCustomItem] = useState('');
  const [customCategory, setCustomCategory] = useState('Custom');

  const handleAddPreset = (cat) => {
    addWishlistItem({ item: cat.label, category: cat.id });
    showSuccess(`${cat.emoji} ${cat.label} added!`);
  };

  const handleAddCustom = () => {
    if (!customItem.trim()) { showError('Enter an item name.'); return; }
    addWishlistItem({ item: customItem.trim(), category: customCategory });
    setCustomItem('');
    showSuccess('Item added to wishlist!');
  };

  return (
    <div className="space-y-5">
      {/* Quick-add categories */}
      <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
        <h3 className="font-display text-headline-md text-on-surface mb-1">Quick-Add Categories</h3>
        <p className="font-body text-caption text-on-surface-variant mb-4">Tap a category to add a hint</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESET_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleAddPreset(cat)}
              className="flex items-center gap-2 p-3 border-2 border-outline-variant rounded-xl hover:border-primary hover:bg-primary-fixed/20 transition-all font-body text-label-bold text-on-surface"
            >
              <span className="text-xl">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom item */}
      <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
        <h3 className="font-display text-headline-md text-on-surface mb-4">Add Custom Item</h3>
        <div className="space-y-3">
          <input
            className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors"
            placeholder="e.g. AirPods Pro, Spa day, Maggi instant noodles…"
            value={customItem}
            onChange={e => setCustomItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
          />
          <select
            className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none"
            value={customCategory}
            onChange={e => setCustomCategory(e.target.value)}
          >
            <option value="Custom">Custom</option>
            {PRESET_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <button
            onClick={handleAddCustom}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-body font-bold text-label-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add to Wishlist
          </button>
        </div>
      </div>

      {/* Wishlist items */}
      {packet.wishlist.length > 0 && (
        <div className="space-y-2">
          <p className="font-body text-caption text-on-surface-variant font-bold uppercase tracking-wider">
            {packet.wishlist.length} Item{packet.wishlist.length !== 1 ? 's' : ''} on Wishlist
          </p>
          <AnimatePresence>
            {packet.wishlist.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 bg-surface-container-low rounded-xl p-3 border border-outline-variant/20"
              >
                <span className="text-xl">
                  {PRESET_CATEGORIES.find(c => c.id === item.category)?.emoji || '🎁'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-bold text-label-bold text-on-surface truncate">{item.item}</p>
                  <p className="font-body text-caption text-on-surface-variant capitalize">{item.category}</p>
                </div>
                <button onClick={() => removeWishlistItem(item.id)} className="p-1 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-colors">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default WishlistSetup;
