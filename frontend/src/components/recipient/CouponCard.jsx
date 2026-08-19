import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { redeemCoupon } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';
import { t } from '../../i18n/translations';
import { trackEvent } from '../../utils/analytics';

const CouponCard = ({ packetId, coupon, onCouponRedeemed, lang = 'en' }) => {
  const [isRedeemed, setIsRedeemed] = useState(coupon.redeemed);

  const handleRedeem = async () => {
    if (isRedeemed) return;

    try {
      if (packetId && packetId !== 'demo') {
        await redeemCoupon(packetId, coupon.id || coupon._id);
      }
      setIsRedeemed(true);
      trackEvent('redeem_coupon', 'engagement', coupon.title);
      onCouponRedeemed?.(coupon.title);
      showSuccess(`🎟️ Redeemed: "${coupon.title}"!`);
    } catch {
      showError('Failed to redeem coupon.');
    }
  };

  return (
    <motion.div
      whileHover={!isRedeemed ? { y: -4, scale: 1.02 } : {}}
      className={`relative rounded-3xl p-5 border-2 border-dashed flex flex-col justify-between transition-all overflow-hidden ${
        isRedeemed
          ? 'bg-surface-dim/40 border-outline-variant opacity-60 grayscale'
          : 'bg-surface-container-lowest border-secondary-fixed-dim shadow-card hover:border-secondary'
      }`}
    >
      {/* Top perforated edge design */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="material-symbols-outlined text-secondary text-2xl">confirmation_number</span>
        <span className="font-body text-[10px] font-bold uppercase tracking-widest bg-secondary-fixed text-on-secondary-fixed px-2.5 py-0.5 rounded-full">
          {isRedeemed ? t('redeemedBadge', lang) : t('officialFavorBadge', lang)}
        </span>
      </div>

      <div className="space-y-1 mb-4">
        <h3 className="font-display text-headline-md text-on-surface">{coupon.title}</h3>
        {coupon.terms && (
          <p className="font-body text-caption text-on-surface-variant italic">
            "{coupon.terms}"
          </p>
        )}
      </div>

      <button
        onClick={handleRedeem}
        disabled={isRedeemed}
        className={`w-full py-2.5 px-4 rounded-full font-body font-bold text-label-bold transition-all flex items-center justify-center gap-2 ${
          isRedeemed
            ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
            : 'bg-secondary text-on-secondary hover:opacity-90 active:scale-95 shadow-md'
        }`}
      >
        {isRedeemed ? (
          <>
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            {t('redeemedBtnText', lang)}
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {t('redeemBtnText', lang)}
          </>
        )}
      </button>

      {/* Redeemed Stamp Overlay */}
      {isRedeemed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-display font-black text-3xl text-error/40 border-4 border-error/40 px-4 py-1 rounded-xl rotate-[-15deg] uppercase tracking-widest">
            {t('redeemedStamp', lang)}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default CouponCard;
