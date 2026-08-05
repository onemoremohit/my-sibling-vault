import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePacket from '../../hooks/usePacket';
import { showSuccess, showError } from '../common/Toast';

const PRESETS = [
  { title: 'Free Hug',            terms: 'Valid 1x. No questions asked.',        icon: '🤗' },
  { title: 'Zero Arguments Pass', terms: 'I will not argue with you for 24h.',   icon: '🕊️' },
  { title: 'Pick the Movie',      terms: 'You choose the movie, no complaints.', icon: '🎬' },
  { title: 'Maggi on Demand',     terms: 'I will make Maggi for you anytime.',   icon: '🍜' },
  { title: 'Late Night Drive',    terms: 'One midnight drive, anywhere you want.',icon: '🚗' },
  { title: 'Breakfast in Bed',    terms: 'One lazy Sunday breakfast served.',    icon: '🥞' },
];

const CouponEditor = () => {
  const { packet, addCoupon, removeCoupon } = usePacket();
  const [form, setForm] = useState({ title: '', terms: '' });

  const handleAddPreset = (p) => {
    addCoupon({ title: p.title, terms: p.terms });
    showSuccess(`🎟️ "${p.title}" coupon added!`);
  };

  const handleAddCustom = () => {
    if (!form.title.trim()) { showError('Coupon title is required.'); return; }
    addCoupon({ title: form.title.trim(), terms: form.terms.trim() });
    setForm({ title: '', terms: '' });
    showSuccess('Coupon added!');
  };

  return (
    <div className="space-y-5">
      {/* Preset coupons */}
      <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
        <h3 className="font-display text-headline-md text-on-surface mb-1">Preset Coupons</h3>
        <p className="font-body text-caption text-on-surface-variant mb-4">Tap to add a ready-made coupon</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESETS.map(p => (
            <button
              key={p.title}
              onClick={() => handleAddPreset(p)}
              className="flex items-start gap-3 p-3 border-2 border-dashed border-outline-variant rounded-xl hover:border-secondary hover:bg-secondary-fixed/20 transition-all text-left"
            >
              <span className="text-2xl flex-shrink-0">{p.icon}</span>
              <div>
                <p className="font-body font-bold text-label-bold text-on-surface">{p.title}</p>
                <p className="font-body text-caption text-on-surface-variant">{p.terms}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom coupon */}
      <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
        <h3 className="font-display text-headline-md text-on-surface mb-4">Custom Coupon</h3>
        <div className="space-y-3">
          <input
            className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors"
            placeholder="e.g. One Get Out of Trouble Free"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <textarea
            rows={2}
            className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none resize-none transition-colors"
            placeholder="Terms & conditions (e.g. Expires never, subject to my mood)"
            value={form.terms}
            onChange={e => setForm(f => ({ ...f, terms: e.target.value }))}
          />
          <button
            onClick={handleAddCustom}
            className="w-full bg-secondary text-on-secondary py-3 rounded-xl font-body font-bold text-label-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Custom Coupon
          </button>
        </div>
      </div>

      {/* Added coupons */}
      {packet.coupons.length > 0 && (
        <div className="space-y-2">
          <p className="font-body text-caption text-on-surface-variant font-bold uppercase tracking-wider">
            {packet.coupons.length} Coupon{packet.coupons.length !== 1 ? 's' : ''} in the book
          </p>
          <AnimatePresence>
            {packet.coupons.map(c => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 border-2 border-dashed border-secondary-fixed-dim bg-secondary-fixed/10 rounded-xl p-3"
              >
                <span className="material-symbols-outlined text-secondary">confirmation_number</span>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-bold text-label-bold text-on-surface truncate">{c.title}</p>
                  {c.terms && <p className="font-body text-caption text-on-surface-variant truncate">{c.terms}</p>}
                </div>
                <button onClick={() => removeCoupon(c.id)} className="p-1 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-colors">
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

export default CouponEditor;
