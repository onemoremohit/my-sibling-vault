import React from 'react';
import { motion } from 'framer-motion';
import { t } from '../../i18n/translations';

const CertificateCard = ({ recipientName, certificate, lang = 'en' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-surface-container-lowest border-4 border-double border-primary-fixed-dim rounded-3xl p-6 sm:p-8 shadow-soft-memory text-center relative overflow-hidden space-y-4"
    >
      {/* Decorative Corner Ornaments */}
      <div className="absolute top-2 left-2 text-primary-fixed-dim text-xl font-serif">✦</div>
      <div className="absolute top-2 right-2 text-primary-fixed-dim text-xl font-serif">✦</div>
      <div className="absolute bottom-2 left-2 text-primary-fixed-dim text-xl font-serif">✦</div>
      <div className="absolute bottom-2 right-2 text-primary-fixed-dim text-xl font-serif">✦</div>

      {/* Ribbon Header */}
      <div className="inline-block bg-primary-fixed text-on-primary-fixed text-[11px] font-body font-bold uppercase tracking-widest px-4 py-1 rounded-full">
        {t('certHeader', lang)}
      </div>

      <div className="space-y-1">
        <p className="font-body text-caption text-on-surface-variant">{t('certConferredText', lang)}</p>
        <h3 className="font-display text-display-mobile text-primary font-bold">
          {recipientName || 'Dear Sibling'}
        </h3>
      </div>

      <div className="border-t border-b border-primary-fixed-dim/40 py-4 my-2">
        <h4 className="font-display text-headline-md text-on-surface font-bold mb-1">
          "{certificate.awardTitle}"
        </h4>
        {certificate.description && (
          <p className="font-body text-body-md text-on-surface-variant italic max-w-md mx-auto">
            {certificate.description}
          </p>
        )}
      </div>

      {/* Gold Seal */}
      <div className="flex items-center justify-center gap-2 text-primary font-body font-bold text-caption">
        <span className="material-symbols-outlined text-3xl">workspace_premium</span>
        <span>{t('certifiedSiblingText', lang)}</span>
      </div>
    </motion.div>
  );
};

export default CertificateCard;
