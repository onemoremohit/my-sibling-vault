import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePacket from '../../hooks/usePacket';
import { showSuccess, showError } from '../common/Toast';

const CouponEditor = () => {
  const { packet, addCoupon, removeCoupon, t } = usePacket();
  const [form, setForm] = useState({ title: '', terms: '' });

  const PRESETS = [
    { title: t('c1Title'), terms: t('c1Terms'), icon: '🤗' },
    { title: t('c2Title'), terms: t('c2Terms'), icon: '🕊️' },
    { title: t('c3Title'), terms: t('c3Terms'), icon: '🎬' },
    { title: t('c4Title'), terms: t('c4Terms'), icon: '🍜' },
    { title: t('c5Title'), terms: t('c5Terms'), icon: '🚗' },
    { title: t('c6Title'), terms: t('c6Terms'), icon: '🥞' },
  ];

  const handleAddPreset = (p) => {
    const existing = packet.coupons?.find(c => c.title === p.title);
    if (existing) {
      removeCoupon(existing.id);
    } else {
      addCoupon({ title: p.title, terms: p.terms });
      showSuccess(`🎟️ "${p.title}" coupon added!`);
    }
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
        <h3 className="font-display text-headline-md text-on-surface mb-1">{t('couponsEditorTitle')}</h3>
        <p className="font-body text-caption text-on-surface-variant mb-4">{t('couponsEditorDesc')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESETS.map(p => {
            const isSelected = packet.coupons?.some(c => c.title === p.title);
            return (
              <button
                key={p.title}
                onClick={() => handleAddPreset(p)}
                className={`relative flex items-start gap-3 p-3 border-2 border-dashed rounded-xl transition-all text-left ${
                  isSelected
                    ? 'border-secondary bg-secondary-fixed/30 font-bold'
                    : 'border-outline-variant hover:border-secondary hover:bg-secondary-fixed/20'
                }`}
              >
                <span className="text-2xl flex-shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0 pr-3">
                  <p className="font-body font-bold text-label-bold text-on-surface">{p.title}</p>
                  <p className="font-body text-caption text-on-surface-variant line-clamp-1">{p.terms}</p>
                </div>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 bg-secondary text-on-secondary w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md border-2 border-surface">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom coupon (Optional) */}
      <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-headline-md text-on-surface">{t('customCouponTitle')}</h3>
          <span className="flex-shrink-0 font-body text-[10px] font-bold bg-surface-container text-on-surface-variant border border-outline-variant/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Optional
          </span>
        </div>
        <div className="space-y-3">
          <input
            className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors"
            placeholder={t('couponTitlePlaceholder')}
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <textarea
            rows={2}
            className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none resize-none transition-colors"
            placeholder={t('couponTermsPlaceholder')}
            value={form.terms}
            onChange={e => setForm(f => ({ ...f, terms: e.target.value }))}
          />
          <button
            onClick={handleAddCustom}
            className="w-full bg-secondary text-on-secondary py-3 rounded-xl font-body font-bold text-label-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            {t('addCouponBtn')}
          </button>
        </div>
      </div>

      {/* Added coupons */}
      {packet.coupons.length > 0 && (
        <div className="space-y-2">
          <p className="font-body text-caption text-on-surface-variant font-bold uppercase tracking-wider">
            {packet.coupons.length} {t('couponsInBookCount')}
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
