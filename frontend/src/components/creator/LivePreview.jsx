import React from 'react';
import usePacket from '../../hooks/usePacket';
import { t as translate } from '../../i18n/translations';

const LivePreview = ({ activeStep }) => {
  const { packet, t: contextT } = usePacket();
  const t = (key) => (contextT ? contextT(key) : translate(key, packet?.language || 'en'));

  return (
    <div className="sticky top-20 bg-surface-container-low border-2 border-dashed border-outline-variant rounded-4xl p-6 flex flex-col items-center justify-center min-h-[640px]">
      <div className="text-center mb-4">
        <span className="font-body font-bold text-caption uppercase tracking-wider text-on-surface-variant bg-surface px-3 py-1 rounded-full border border-outline-variant/40">
          {t('mobilePreviewTitle')}
        </span>
      </div>

      {/* Phone frame mockup */}
      <div className="w-[320px] h-[580px] bg-surface rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[8px] border-surface-variant overflow-hidden flex flex-col relative">
        {/* Phone Notch/Header */}
        <div className="bg-primary text-on-primary py-3 px-4 text-center rounded-b-2xl mx-8 shadow-sm z-10">
          <h4 className="font-display font-bold text-sm tracking-wide">
            {packet.recipientName ? `${t('vaultForRecipient')} ${packet.recipientName}` : t('defaultRecipient')}
          </h4>
          <p className="font-body text-[10px] opacity-80">
            {t('fromSender')} {packet.senderName || t('defaultSender')}
          </p>
        </div>

        {/* Scrollable phone content preview */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-bright pb-16">
          {/* Step 0 / Meta */}
          <div className="text-center py-2 border-b border-outline-variant/30">
            <span className="text-2xl">🎁</span>
            <p className="font-display font-bold text-sm text-primary">{t('giftPacketTitle')}</p>
          </div>

          {/* Timeline / Memory Photo preview */}
          <div className={`p-3 rounded-2xl border transition-all ${activeStep === 1 ? 'ring-2 ring-primary bg-primary-fixed/20' : 'bg-surface-container-lowest'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-display font-bold text-xs text-on-surface">📸 Sibling Memory Photo</span>
              {packet.timeline.length > 0 && (
                <span className="text-[9px] bg-primary text-on-primary px-1.5 py-0.5 rounded-full font-bold">
                  Photo Added ✨
                </span>
              )}
            </div>
            {packet.timeline.length === 0 ? (
              <p className="font-body text-[11px] text-on-surface-variant italic text-center py-2">
                No memory photo uploaded yet
              </p>
            ) : (
              <div className="bg-surface rounded-xl p-2 border border-outline-variant/30 text-left space-y-1.5">
                {packet.timeline[0]?.mediaUrl && (
                  <div className="w-full h-28 rounded-lg overflow-hidden bg-black/10">
                    <img
                      src={packet.timeline[0].mediaUrl.startsWith('http') ? packet.timeline[0].mediaUrl : `http://localhost:5000${packet.timeline[0].mediaUrl}`}
                      alt="Memory"
                      className="w-full h-full object-contain bg-black/40"
                    />
                  </div>
                )}
                <p className="font-body font-bold text-[11px] text-primary truncate">
                  {packet.timeline[0]?.title || 'Cherished Memory'}
                </p>
                {packet.timeline[0]?.secretNote && (
                  <p className="font-body text-[9px] text-secondary flex items-center gap-1">
                    🔒 Wax-sealed secret note attached
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Wishlist & Gift Message preview */}
          <div className={`p-3 rounded-2xl border transition-all ${activeStep === 2 ? 'ring-2 ring-primary bg-primary-fixed/20' : 'bg-surface-container-lowest'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-display font-bold text-xs text-on-surface">💌 Rakhi Message & Gift</span>
              {packet.giftOrdered && (
                <span className="text-[9px] bg-primary text-on-primary px-1.5 py-0.5 rounded-full font-bold">
                  Gift Ordered 🎁
                </span>
              )}
            </div>
            <div className="bg-surface rounded-xl p-2.5 border border-primary/20 text-left space-y-1">
              <p className="font-body text-[11px] text-primary italic line-clamp-2">
                "{packet.brotherMessage || (packet.language === 'hinglish' ? 'Happy Raksha Bandhan! 🎀' : 'Happy Rakhi! 🎀')}"
              </p>
              {packet.giftOrdered && (
                <p className="font-body text-[10px] font-bold text-on-surface-variant flex items-center gap-1 pt-1 border-t border-outline-variant/30">
                  <span>🚚</span> {packet.orderedGiftName || 'Surprise gift on the way!'}
                </p>
              )}
            </div>
          </div>

          {/* Wheel preview */}
          <div className={`p-3 rounded-2xl border transition-all ${activeStep === 3 ? 'ring-2 ring-primary bg-primary-fixed/20' : 'bg-surface-container-lowest'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold text-xs text-on-surface">{t('wheelTitle')}</span>
              <span className="text-[10px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-bold">
                {packet.punishments.length} {t('daresCount')}
              </span>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-primary mx-auto bg-gradient-to-tr from-primary-fixed via-secondary-fixed to-tertiary-fixed flex items-center justify-center">
              <span className="font-bold text-[10px] text-on-surface">{t('spinText')}</span>
            </div>
          </div>

          {/* Coupons & Certs preview */}
          <div className={`p-3 rounded-2xl border transition-all ${activeStep === 4 ? 'ring-2 ring-primary bg-primary-fixed/20' : 'bg-surface-container-lowest'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-display font-bold text-xs text-on-surface">{t('couponsCertsPreview')}</span>
              <span className="text-[10px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-bold">
                {packet.coupons.length + packet.certificates.length} {t('readyCount')}
              </span>
            </div>
            <p className="font-body text-[10px] text-on-surface-variant">
              {packet.coupons.length} coupons • {packet.certificates.length} certificates
            </p>
          </div>

          {/* Roast & Fun Zone preview */}
          <div className={`p-3 rounded-2xl border transition-all ${activeStep === 5 ? 'ring-2 ring-primary bg-primary-fixed/20' : 'bg-surface-container-lowest'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-display font-bold text-xs text-on-surface">🌶️ Roast & Fun Zone</span>
              <span className="text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full font-bold">
                4 features
              </span>
            </div>
            <p className="font-body text-[10px] text-on-surface-variant">
              {packet.roasts?.length || 0} roasts • Quiz • Request • Fines
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
