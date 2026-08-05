import React from 'react';
import usePacket from '../../hooks/usePacket';

const LivePreview = ({ activeStep }) => {
  const { packet } = usePacket();

  return (
    <div className="sticky top-20 bg-surface-container-low border-2 border-dashed border-outline-variant rounded-4xl p-6 flex flex-col items-center justify-center min-h-[640px]">
      <div className="text-center mb-4">
        <span className="font-body font-bold text-caption uppercase tracking-wider text-on-surface-variant bg-surface px-3 py-1 rounded-full border border-outline-variant/40">
          📱 Live Recipient Mobile Preview
        </span>
      </div>

      {/* Phone frame mockup */}
      <div className="w-[320px] h-[580px] bg-surface rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[8px] border-surface-variant overflow-hidden flex flex-col relative">
        {/* Phone Notch/Header */}
        <div className="bg-primary text-on-primary py-3 px-4 text-center rounded-b-2xl mx-8 shadow-sm z-10">
          <h4 className="font-display font-bold text-sm tracking-wide">
            {packet.recipientName ? `Vault for ${packet.recipientName}` : "Sibling's Vault"}
          </h4>
          <p className="font-body text-[10px] opacity-80">
            From: {packet.senderName || 'Your Sibling'}
          </p>
        </div>

        {/* Scrollable phone content preview */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-bright pb-16">
          {/* Step 0 / Meta */}
          <div className="text-center py-2 border-b border-outline-variant/30">
            <span className="text-2xl">🎁</span>
            <p className="font-display font-bold text-sm text-primary">A Memory Gift Packet</p>
          </div>

          {/* Timeline preview */}
          {packet.modules.includes('timeline') && (
            <div className={`p-3 rounded-2xl border transition-all ${activeStep === 1 ? 'ring-2 ring-primary bg-primary-fixed/20' : 'bg-surface-container-lowest'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold text-xs text-on-surface">Timeline</span>
                <span className="text-[10px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-bold">
                  {packet.timeline.length} memories
                </span>
              </div>
              {packet.timeline.length === 0 ? (
                <p className="font-body text-[11px] text-on-surface-variant italic text-center py-2">
                  No memories added yet…
                </p>
              ) : (
                <div className="space-y-2">
                  {packet.timeline.slice(0, 2).map((item) => (
                    <div key={item.id} className="bg-surface rounded-xl p-2 border border-outline-variant/30 text-left">
                      <p className="font-body font-bold text-xs text-on-surface truncate">{item.title}</p>
                      {item.secretNote && (
                        <p className="font-body text-[10px] text-secondary flex items-center gap-1 mt-0.5">
                          🔒 Secret note locked
                        </p>
                      )}
                    </div>
                  ))}
                  {packet.timeline.length > 2 && (
                    <p className="font-body text-[10px] text-on-surface-variant text-center">
                      +{packet.timeline.length - 2} more memories
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Wishlist preview */}
          {packet.modules.includes('wishlist') && (
            <div className={`p-3 rounded-2xl border transition-all ${activeStep === 2 ? 'ring-2 ring-primary bg-primary-fixed/20' : 'bg-surface-container-lowest'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-xs text-on-surface">Wishlist</span>
                <span className="text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full font-bold">
                  {packet.wishlist.length} items
                </span>
              </div>
              <div className="flex gap-1 overflow-x-auto py-1">
                {packet.wishlist.length === 0 ? (
                  <p className="font-body text-[11px] text-on-surface-variant italic">No wishes added</p>
                ) : (
                  packet.wishlist.map(w => (
                    <span key={w.id} className="text-[10px] bg-surface-container px-2 py-1 rounded-lg font-bold text-on-surface whitespace-nowrap">
                      {w.item}
                    </span>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Wheel preview */}
          {packet.modules.includes('wheel') && (
            <div className={`p-3 rounded-2xl border transition-all ${activeStep === 3 ? 'ring-2 ring-primary bg-primary-fixed/20' : 'bg-surface-container-lowest'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold text-xs text-on-surface">Punishment Wheel</span>
                <span className="text-[10px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full font-bold">
                  {packet.punishments.length} dares
                </span>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-primary mx-auto bg-gradient-to-tr from-primary-fixed via-secondary-fixed to-tertiary-fixed flex items-center justify-center">
                <span className="font-bold text-[10px] text-on-surface">SPIN</span>
              </div>
            </div>
          )}

          {/* Coupons & Certs preview */}
          {packet.modules.includes('coupons') && (
            <div className={`p-3 rounded-2xl border transition-all ${activeStep === 4 ? 'ring-2 ring-primary bg-primary-fixed/20' : 'bg-surface-container-lowest'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-bold text-xs text-on-surface">Coupons & Awards</span>
                <span className="text-[10px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-bold">
                  {packet.coupons.length + packet.certificates.length} ready
                </span>
              </div>
              <p className="font-body text-[10px] text-on-surface-variant">
                {packet.coupons.length} coupons • {packet.certificates.length} certificates
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
