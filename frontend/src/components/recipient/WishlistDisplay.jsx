import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pledgeWishlistItem } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';
import { t } from '../../i18n/translations';

// ─── Curated gift suggestions per category ────────────────────────────────────
const CURATED_GIFTS = {
  fashion: [
    { name: 'Floral Kurti Set 🌸', hint: 'Trending on Meesho & Myntra' },
    { name: 'Denim Jacket 🧥', hint: 'Great for casual outings' },
    { name: 'Printed Co-ord Set 👗', hint: 'Perfect for family gatherings' },
    { name: 'Silk Dupatta 🧣', hint: 'Classic festive pick' },
    { name: 'Sneakers 👟', hint: 'Everyday style upgrade' },
    { name: 'Handbag / Sling Bag 👜', hint: 'Always useful!' },
  ],
  tech: [
    { name: 'Wireless Earbuds 🎧', hint: 'Great for music & calls' },
    { name: 'Smart Watch ⌚', hint: 'Track fitness & notifications' },
    { name: 'Phone Case (Customised) 📱', hint: 'Personal touch!' },
    { name: 'Portable Charger 🔋', hint: 'Never run out of battery' },
    { name: 'Ring Light 💡', hint: 'For selfies & reels' },
    { name: 'Laptop Stand 💻', hint: 'Ergonomic & stylish' },
  ],
  cosmetics: [
    { name: 'Lip Gloss Set 💋', hint: 'Trending shades' },
    { name: 'Skincare Kit 🧴', hint: 'Moisturizer, serum & SPF' },
    { name: 'Perfume / Body Mist 🌸', hint: 'Long-lasting fragrance' },
    { name: 'Nail Polish Set 💅', hint: 'Multi-color fun pack' },
    { name: 'Face Mask Pack 🎭', hint: 'Glow-up weekend treat' },
    { name: 'Eye Shadow Palette 👁️', hint: 'Festive glam kit' },
  ],
  chocolates: [
    { name: 'Cadbury Celebrations Box 🎁', hint: 'Classic festive gift' },
    { name: 'Ferrero Rocher Box 🍬', hint: 'Premium & delicious' },
    { name: 'Dark Chocolate Assortment 🍫', hint: 'For the connoisseur' },
    { name: 'Kaju Katli Box 🥮', hint: 'Traditional Indian mithai' },
    { name: 'Patchi Chocolate Box 🍭', hint: 'Luxury chocolate gift' },
    { name: 'Custom Chocolate Bar 🍫', hint: 'Personalised message inside!' },
  ],
  food: [
    { name: 'Boba Tea Voucher 🧋', hint: 'For the bubble tea lover' },
    { name: 'Momos Treat 🥟', hint: 'Street food date!' },
    { name: 'Pizza Night 🍕', hint: 'Dominos / Pizza Hut gift card' },
    { name: 'Biryani Feast 🍚', hint: 'Celebration meal' },
    { name: 'Cake & Dessert Box 🎂', hint: 'Customised from local bakery' },
    { name: 'Ice Cream Tub 🍦', hint: 'Favourite flavour!'},
  ],
  Custom: [],
};

const CATEGORY_META = [
  { id: 'fashion',    emoji: '👗', label: 'Clothes & Fashion',    labelHi: 'Kapde & Fashion'       },
  { id: 'tech',       emoji: '📱', label: 'Gadgets & Electronics', labelHi: 'Gadgets & Electronics' },
  { id: 'cosmetics',  emoji: '💄', label: 'Cosmetic & Beauty',     labelHi: 'Beauty & Cosmetics'    },
  { id: 'chocolates', emoji: '🍫', label: 'Chocolates & Sweets',   labelHi: 'Chocolates & Meetha'   },
  { id: 'food',       emoji: '🍕', label: 'Food & Treats',         labelHi: 'Khana & Treats'        },
];

// ─── Component ────────────────────────────────────────────────────────────────
const WishlistDisplay = ({ packetId, items = [], brotherMessage = '', lang = 'en' }) => {
  const isHinglish = lang === 'hinglish';

  // Category modal
  const [activeCategory, setActiveCategory] = useState(null);

  // Selected gifts per category (id → Set of gift names)
  const [selectedGifts, setSelectedGifts] = useState({});

  // Custom link inputs
  const [customGiftName, setCustomGiftName] = useState('');
  const [customGiftUrl, setCustomGiftUrl] = useState('');
  const [customRequests, setCustomRequests] = useState([]);

  // Legacy pledge (keep existing items working)
  const [wishlist, setWishlist] = useState(items);

  const handlePledge = async (item, targetIdx) => {
    const isPledged = item.status === 'pledged';
    const newStatus = isPledged ? 'open' : 'pledged';
    try {
      const targetId = item.id || item._id;
      if (packetId && packetId !== 'demo' && targetId) {
        await pledgeWishlistItem(packetId, targetId);
      }
      setWishlist(prev =>
        prev.map((i, idx) => {
          if (targetId && (i.id === targetId || i._id === targetId)) return { ...i, status: newStatus };
          if (idx === targetIdx) return { ...i, status: newStatus };
          return i;
        })
      );
      showSuccess(newStatus === 'pledged' ? `🎁 Promised: ${item.item}!` : `Undo: ${item.item}`);
    } catch {
      showError('Failed to record pledge. Please try again.');
    }
  };

  const toggleGift = (catId, giftName) => {
    setSelectedGifts(prev => {
      const current = new Set(prev[catId] || []);
      if (current.has(giftName)) current.delete(giftName);
      else current.add(giftName);
      return { ...prev, [catId]: current };
    });
    showSuccess(`🎀 ${selectedGifts[catId]?.has(giftName) ? 'Removed' : 'Added'}: ${giftName}`);
  };

  const handleAddCustomRequest = () => {
    if (!customGiftName.trim()) { showError('Please enter a gift name.'); return; }
    setCustomRequests(prev => [
      ...prev,
      { name: customGiftName.trim(), url: customGiftUrl.trim(), id: Date.now() },
    ]);
    showSuccess(`✅ Gift request added: ${customGiftName}`);
    setCustomGiftName('');
    setCustomGiftUrl('');
  };

  const removeCustomRequest = (id) => {
    setCustomRequests(prev => prev.filter(r => r.id !== id));
  };

  const allSelectedCount = Object.values(selectedGifts).reduce((sum, s) => sum + (s?.size || 0), 0) + customRequests.length;

  return (
    <section className="space-y-10">
      {/* ── Header ── */}
      <div className="text-center space-y-2">
        <div className="inline-block bg-primary-fixed text-on-primary-fixed px-4 py-1 rounded-full font-body font-bold text-caption uppercase tracking-wider shadow-sm">
          🎀 Raksha Bandhan Special
        </div>
        <h2 className="font-display text-display-md text-primary">
          {isHinglish ? 'Gift Wishlist 🎁' : t('wishlistSectionHeader', lang)}
        </h2>
        <p className="font-body text-body-lg text-on-surface-variant">
          {isHinglish
            ? 'Apna favourite gift category choose karo ya custom link paste karo!'
            : 'Browse categories or paste your favourite product link for your brother to buy!'}
        </p>
      </div>

      {/* ── Brother's Raksha Bandhan Message ── */}
      {brotherMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-primary-fixed/30 via-secondary-fixed/20 to-tertiary-fixed/30 rounded-3xl p-6 border-2 border-primary/20 text-center space-y-2"
        >
          <div className="text-4xl">🎀</div>
          <p className="font-display text-headline-md text-on-surface italic">"{brotherMessage}"</p>
          <p className="font-body text-caption text-on-surface-variant">— {isHinglish ? 'Aapke Bhai ki taraf se 💝' : 'From your Brother with love 💝'}</p>
        </motion.div>
      )}

      {/* ── 5 Category Buttons ── */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-display text-headline-md text-on-surface">
            {isHinglish ? '🛍️ Category Choose Karo' : '🛍️ Browse Gift Categories'}
          </h3>
          <p className="font-body text-caption text-on-surface-variant">
            {isHinglish
              ? 'Kisi bhi category par tap karo aur gift select karo'
              : 'Tap any category to browse & select gifts'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORY_META.map(cat => {
            const count = selectedGifts[cat.id]?.size || 0;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveCategory(cat)}
                className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 font-body font-bold transition-all shadow-sm ${
                  count > 0
                    ? 'border-primary bg-primary-fixed/20 text-primary'
                    : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:bg-primary-fixed/10'
                }`}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-xs text-center leading-tight">{isHinglish ? cat.labelHi : cat.label}</span>
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-on-primary w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shadow-md border-2 border-surface">
                    {count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Category Pop-up Modal ── */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setActiveCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface rounded-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-outline-variant/30 w-full max-w-lg max-h-[80vh] overflow-y-auto"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{activeCategory.emoji}</span>
                  <div>
                    <h3 className="font-display text-headline-md text-on-surface">
                      {isHinglish ? activeCategory.labelHi : activeCategory.label}
                    </h3>
                    <p className="font-body text-caption text-on-surface-variant">
                      {isHinglish ? 'Jo pasand aaye woh select karo!' : 'Tap to select the gifts you want!'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="p-2 rounded-xl hover:bg-surface-container-high text-on-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Gift options grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(CURATED_GIFTS[activeCategory.id] || []).map((gift, idx) => {
                  const isChosen = selectedGifts[activeCategory.id]?.has(gift.name);
                  return (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => toggleGift(activeCategory.id, gift.name)}
                      className={`relative text-left p-4 rounded-2xl border-2 transition-all ${
                        isChosen
                          ? 'border-primary bg-primary-fixed/20'
                          : 'border-outline-variant/40 bg-surface-container-lowest hover:border-primary/50'
                      }`}
                    >
                      {isChosen && (
                        <span className="absolute top-2 right-2 bg-primary text-on-primary w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shadow-md">
                          ✓
                        </span>
                      )}
                      <p className="font-body font-bold text-label-bold text-on-surface">{gift.name}</p>
                      <p className="font-body text-caption text-on-surface-variant mt-0.5">{gift.hint}</p>
                    </motion.button>
                  );
                })}
              </div>

              {/* Done button */}
              <button
                onClick={() => setActiveCategory(null)}
                className="mt-5 w-full bg-primary text-on-primary py-3 rounded-xl font-body font-bold text-label-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                {isHinglish ? 'Done! Selection Save Ho Gayi' : 'Done! Save Selection'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Selected Gifts Summary ── */}
      {allSelectedCount > 0 && (
        <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/20 space-y-3">
          <h3 className="font-display text-headline-md text-on-surface">
            🎯 {isHinglish ? `${allSelectedCount} Gifts Selected!` : `${allSelectedCount} Gifts Chosen!`}
          </h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_META.map(cat =>
              [...(selectedGifts[cat.id] || [])].map(giftName => (
                <span key={`${cat.id}-${giftName}`} className="flex items-center gap-1 bg-primary-fixed/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-caption font-body font-bold">
                  {cat.emoji} {giftName}
                  <button onClick={() => toggleGift(cat.id, giftName)} className="ml-1 hover:text-error">×</button>
                </span>
              ))
            )}
            {customRequests.map(req => (
              <span key={req.id} className="flex items-center gap-1 bg-secondary-fixed/20 text-secondary border border-secondary/30 px-3 py-1 rounded-full text-caption font-body font-bold">
                🔗 {req.name}
                <button onClick={() => removeCustomRequest(req.id)} className="ml-1 hover:text-error">×</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Custom Gift / Shopping Link ── */}
      <div className="bg-surface rounded-2xl p-6 border border-outline-variant/20 shadow-card space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔗</span>
          <div>
            <h3 className="font-display text-headline-md text-on-surface">
              {isHinglish ? 'Custom Gift / Product Link' : 'Custom Gift & Product Link'}
            </h3>
            <p className="font-body text-caption text-on-surface-variant">
              {isHinglish
                ? 'Amazon, Flipkart, Meesho ya kisi bhi site ka link paste karo!'
                : 'Paste a product link from Amazon, Flipkart, Meesho or any site!'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors"
            placeholder={isHinglish ? 'Gift ka naam (e.g. Blue Floral Kurti)' : 'Gift name (e.g. Blue Floral Kurti, AirPods Pro)'}
            value={customGiftName}
            onChange={e => setCustomGiftName(e.target.value)}
          />
          <input
            type="url"
            className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors"
            placeholder="https://www.meesho.com/... or amazon.in/... (optional)"
            value={customGiftUrl}
            onChange={e => setCustomGiftUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCustomRequest()}
          />

          {/* Shopping platform quick-links */}
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Amazon 📦', url: 'https://www.amazon.in' },
              { name: 'Flipkart 🛒', url: 'https://www.flipkart.com' },
              { name: 'Meesho 🧵', url: 'https://www.meesho.com' },
              { name: 'Myntra 👗', url: 'https://www.myntra.com' },
              { name: 'Nykaa 💄', url: 'https://www.nykaa.com' },
            ].map(platform => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption font-body font-bold px-3 py-1 rounded-full border border-outline-variant hover:border-primary hover:bg-primary-fixed/10 text-on-surface-variant hover:text-primary transition-all"
              >
                {platform.name}
              </a>
            ))}
          </div>

          <button
            onClick={handleAddCustomRequest}
            className="w-full bg-secondary text-on-secondary py-3 rounded-xl font-body font-bold text-label-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add_link</span>
            {isHinglish ? 'Gift Request Add Karo' : 'Add Gift Request'}
          </button>
        </div>
      </div>

      {/* ── Legacy wishlist items (if any from creator side) ── */}
      {wishlist.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display text-headline-md text-on-surface">
            📝 {isHinglish ? 'Wishlist Items (Brother ne add kiye)' : 'Wishlist Items (Added by Brother)'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((item, index) => {
              const isPledged = item.status === 'pledged';
              const catMeta = CATEGORY_META.find(c => c.id === item.category);
              const emoji = catMeta?.emoji || '🎁';
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
                        {isPledged ? t('pledgedStatus', lang) : item.category}
                      </span>
                    </div>
                    <h3 className="font-display text-headline-md text-on-surface">{item.item}</h3>
                  </div>
                  <button
                    onClick={() => handlePledge(item, index)}
                    className={`w-full py-2.5 px-4 rounded-full font-body font-bold text-label-bold transition-all flex items-center justify-center gap-2 ${
                      isPledged
                        ? 'bg-tertiary text-on-tertiary hover:opacity-90 shadow-sm'
                        : 'bg-primary text-on-primary hover:scale-105 active:scale-95 shadow-md'
                    }`}
                  >
                    {isPledged ? (
                      <>
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        {t('pledgedBtnText', lang)}
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                        {t('pledgeBtnText', lang)}
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default WishlistDisplay;
