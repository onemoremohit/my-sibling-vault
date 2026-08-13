import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePacket from '../../hooks/usePacket';
import { showSuccess, showError } from '../common/Toast';

const GIFT_CATEGORIES = [
  { id: 'fashion',     emoji: '👗', label: 'Clothes & Fashion'      },
  { id: 'tech',        emoji: '📱', label: 'Gadgets & Electronics'   },
  { id: 'cosmetics',   emoji: '💄', label: 'Cosmetic & Beauty'       },
  { id: 'chocolates',  emoji: '🍫', label: 'Chocolates & Sweets'     },
  { id: 'food',        emoji: '🍕', label: 'Food & Treats'           },
];

const GIFT_CATEGORIES_HINGLISH = [
  { id: 'fashion',     emoji: '👗', label: 'Kapde & Fashion'         },
  { id: 'tech',        emoji: '📱', label: 'Gadgets & Electronics'   },
  { id: 'cosmetics',   emoji: '💄', label: 'Beauty & Cosmetics'      },
  { id: 'chocolates',  emoji: '🍫', label: 'Chocolates & Meetha'     },
  { id: 'food',        emoji: '🍕', label: 'Khana & Treats'          },
];

const RAKHI_MESSAGES_EN = [
  'Happy Raksha Bandhan, Didi! 🎀 Pick what your heart desires!',
  'For my favourite sister — choose your best gift! 🌸',
  'Rakhi gift time! Tell me what you want and I will get it! 💝',
  'Didi, you deserve the world. Start here! 🎁',
];

const RAKHI_MESSAGES_HINGLISH = [
  'Happy Raksha Bandhan Didi! 🎀 Jo dil chahe woh choose karo!',
  'Meri favourite behen ke liye — apna best gift chunna! 🌸',
  'Rakhi gift time! Batao kya chahiye, main dilaunga! 💝',
  'Didi, tum sab kuch deserve karti ho. Yahan se shuru karo! 🎁',
];

const WishlistSetup = () => {
  const { packet, addWishlistItem, removeWishlistItem, updateBrotherMessage, t } = usePacket();
  const [customItem, setCustomItem] = useState('');
  const [customCategory, setCustomCategory] = useState('Custom');

  const isHinglish = packet?.language === 'hinglish';
  const categories = isHinglish ? GIFT_CATEGORIES_HINGLISH : GIFT_CATEGORIES;
  const rakhiMessages = isHinglish ? RAKHI_MESSAGES_HINGLISH : RAKHI_MESSAGES_EN;

  const handleAddPreset = (cat) => {
    const existing = packet.wishlist?.find(w => w.category === cat.id);
    if (existing) {
      removeWishlistItem(existing.id);
    } else {
      addWishlistItem({ item: `${cat.emoji} ${cat.label}`, category: cat.id });
      showSuccess(`${cat.label} added!`);
    }
  };

  const handleAddCustom = () => {
    if (!customItem.trim()) { showError('Enter an item name.'); return; }
    addWishlistItem({ item: customItem.trim(), category: customCategory });
    setCustomItem('');
    showSuccess('Item added to wishlist!');
  };

  return (
    <div className="space-y-5">
      {/* ── Raksha Bandhan Message Card ── */}
      <div className="bg-surface rounded-2xl p-5 shadow-card border-2 border-primary/30 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎀</span>
          <div>
            <h3 className="font-display text-headline-md text-primary">
              {isHinglish ? 'Behen ke liye Raksha Bandhan Message' : 'Raksha Bandhan Message for Sister'}
            </h3>
            <p className="font-body text-caption text-on-surface-variant">
              {isHinglish
                ? 'Apni behen ko ek dil se message likho ya preset chuno'
                : 'Write a heartfelt message or pick a quick preset for your sister'}
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2">
          {rakhiMessages.map((msg, i) => (
            <button
              key={i}
              onClick={() => updateBrotherMessage(msg)}
              className={`px-3 py-1.5 rounded-xl text-caption font-body font-bold border-2 transition-all ${
                packet.brotherMessage === msg
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-outline-variant hover:border-primary text-on-surface'
              }`}
            >
              {msg.length > 45 ? msg.slice(0, 45) + '…' : msg}
            </button>
          ))}
        </div>

        {/* Custom message textarea */}
        <textarea
          rows={2}
          className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors resize-none"
          placeholder={isHinglish
            ? 'e.g. Didi, Happy Rakhi! Jo chahiye batao, main dunga! 🎀'
            : 'e.g. Happy Rakhi Didi! Tell me what you want and I will make it happen! 🎀'}
          value={packet.brotherMessage}
          onChange={e => updateBrotherMessage(e.target.value)}
        />
      </div>

      {/* ── 5 Gift Categories Preview ── */}
      <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
        <h3 className="font-display text-headline-md text-on-surface mb-1">
          {isHinglish ? '5 Gift Categories (Preview) 🎁' : '5 Gift Categories (Preview) 🎁'}
        </h3>
        <p className="font-body text-caption text-on-surface-variant mb-4">
          {isHinglish
            ? 'Aapki behen in 5 categories mein se gift choose kar sakti hai'
            : 'Your sister will be able to browse these 5 categories to pick a gift'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map(cat => {
            const isSelected = packet.wishlist?.some(w => w.category === cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => handleAddPreset(cat)}
                className={`relative flex items-center gap-2 p-3 border-2 rounded-xl transition-all font-body text-label-bold text-left ${
                  isSelected
                    ? 'border-primary bg-primary-fixed/20 text-primary font-bold'
                    : 'border-outline-variant text-on-surface hover:border-primary hover:bg-primary-fixed/10'
                }`}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-sm">{cat.label}</span>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-on-primary w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md border-2 border-surface">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="font-body text-caption text-on-surface-variant mt-3 italic">
          {isHinglish
            ? '✨ Recipient ko ek pop-up window milegi jisme wo apni choice kar sakti hai'
            : '✨ Recipient will see a pop-up modal on each category to choose a specific gift'}
        </p>
      </div>

      {/* ── Custom Item Add ── */}
      <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
        <h3 className="font-display text-headline-md text-on-surface mb-4">
          {isHinglish ? 'Custom Item Add Karo' : 'Add Custom Item'}
        </h3>
        <div className="space-y-3">
          <input
            className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors"
            placeholder={isHinglish
              ? 'e.g. AirPods Pro, Meesho dress, Spa day…'
              : 'e.g. AirPods Pro, Spa day, Maggi instant noodles…'}
            value={customItem}
            onChange={e => setCustomItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
          />
          <select
            className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none"
            value={customCategory}
            onChange={e => setCustomCategory(e.target.value)}
          >
            <option value="Custom">Custom 🎁</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
          </select>
          <button
            onClick={handleAddCustom}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-body font-bold text-label-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            {isHinglish ? 'Wishlist Mein Add Karo' : 'Add to Wishlist'}
          </button>
        </div>
      </div>

      {/* Wishlist items */}
      {packet.wishlist.length > 0 && (
        <div className="space-y-2">
          <p className="font-body text-caption text-on-surface-variant font-bold uppercase tracking-wider">
            {packet.wishlist.length} {isHinglish ? 'Items Added' : 'Items on Wishlist'}
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
