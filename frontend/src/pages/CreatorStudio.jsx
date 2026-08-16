import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import ModuleToggle from '../components/creator/ModuleToggle';
import TimelineBuilder from '../components/creator/TimelineBuilder';
import WishlistSetup from '../components/creator/WishlistSetup';
import WheelCustomizer from '../components/creator/WheelCustomizer';
import CouponEditor from '../components/creator/CouponEditor';
import CertificateEditor from '../components/creator/CertificateEditor';
import FunZoneEditor from '../components/creator/FunZoneEditor';
import LivePreview from '../components/creator/LivePreview';
import usePacket from '../hooks/usePacket';
import useMediaQuery from '../hooks/useMediaQuery';
import { createPacket } from '../services/api';
import { showSuccess, showError } from '../components/common/Toast';
import { t as translate } from '../i18n/translations';

const CreatorStudio = () => {
  const navigate = useNavigate();
  const { packet, updateMeta, t: contextT } = usePacket();
  const [activeStep, setActiveStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareData, setShareData] = useState(null); // { packetId, shareUrl }
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStep]);

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const t = (key) => (contextT ? contextT(key) : translate(key, packet?.language || 'en'));

  const STEPS = [
    { id: 0, label: t('step0Label'), icon: 'settings' },
    { id: 1, label: t('step1Label'), icon: 'photo_library' },
    { id: 2, label: t('step2Label'), icon: 'card_giftcard' },
    { id: 3, label: t('step3Label'), icon: 'casino' },
    { id: 4, label: t('step4Label'), icon: 'confirmation_number' },
    { id: 5, label: t('step5Label'), icon: 'local_fire_department' },
  ];

  const handleGenerate = async () => {
    if (!packet.senderName.trim() || !packet.recipientName.trim()) {
      showError('Please enter both your name and your sibling\'s name in Step 0!');
      setActiveStep(0);
      return;
    }

    setIsGenerating(true);
    try {
      const { data } = await createPacket(packet);
      const liveShareUrl = `${window.location.origin}/vault/${data.packetId}`;
      setShareData({
        ...data,
        shareUrl: liveShareUrl,
      });
      showSuccess('🎉 Memory Vault created successfully!');
    } catch (err) {
      showError(err.response?.data?.error || 'Failed to save packet. Make sure backend is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (shareData?.shareUrl) {
      navigator.clipboard.writeText(shareData.shareUrl);
      showSuccess('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-surface paper-texture flex flex-col">
      <Navbar
        mode="creator"
        onShare={handleGenerate}
        onPreview={() => setShowPreviewModal(true)}
        lang={packet.language}
      />

      <main className="flex-1 max-w-container w-full mx-auto px-gutter py-8">
        {/* Step Indicator Header */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-outline-variant/30">
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-body font-bold text-label-bold whitespace-nowrap transition-all ${
                activeStep === s.id
                  ? 'bg-primary text-on-primary shadow-card'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Builder Form Area */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 0: Sender/Recipient info & Language Choice & Theme */}
            {activeStep === 0 && (
              <div className="space-y-6">
                {/* Language Selector Card */}
                <div className="bg-surface rounded-2xl p-5 shadow-card border-2 border-primary/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-headline-md text-primary">{t('selectLanguageLabel')} 🌐</h3>
                      <p className="font-body text-caption text-on-surface-variant">{t('selectLanguageDesc')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => updateMeta({ language: 'en' })}
                      className={`p-4 rounded-xl border-2 font-body font-bold text-label-bold flex items-center justify-center gap-2 transition-all ${
                        packet.language === 'en'
                          ? 'border-primary bg-primary-fixed text-on-primary-fixed shadow-md scale-102'
                          : 'border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <span>{t('langEn')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateMeta({ language: 'hinglish' })}
                      className={`p-4 rounded-xl border-2 font-body font-bold text-label-bold flex items-center justify-center gap-2 transition-all ${
                        packet.language === 'hinglish'
                          ? 'border-primary bg-primary-fixed text-on-primary-fixed shadow-md scale-102'
                          : 'border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <span>{t('langHinglish')}</span>
                    </button>
                  </div>
                </div>

                {/* Names input card */}
                <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20 space-y-4">
                  <h3 className="font-display text-headline-md text-on-surface">{t('step0Title')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-caption text-on-surface-variant block mb-1">{t('senderNameLabel')}</label>
                      <input
                        type="text"
                        className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none"
                        placeholder={t('senderNamePlaceholder')}
                        value={packet.senderName}
                        onChange={(e) => updateMeta({ senderName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="font-body text-caption text-on-surface-variant block mb-1">{t('recipientNameLabel')}</label>
                      <input
                        type="text"
                        className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none"
                        placeholder={t('recipientNamePlaceholder')}
                        value={packet.recipientName}
                        onChange={(e) => updateMeta({ recipientName: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <ModuleToggle />
              </div>
            )}

            {/* Step 1: Timeline */}
            {activeStep === 1 && <TimelineBuilder />}

            {/* Step 2: Wishlist */}
            {activeStep === 2 && <WishlistSetup />}

            {/* Step 3: Wheel */}
            {activeStep === 3 && <WheelCustomizer />}

            {/* Step 4: Coupons & Certs */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <CouponEditor />
                <CertificateEditor />
              </div>
            )}

            {/* Step 5: Roast & Fun Zone */}
            {activeStep === 5 && <FunZoneEditor />}

            {/* Navigation buttons between steps */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="ghost"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              >
                {t('prevStepBtn')}
              </Button>

              {activeStep < STEPS.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={() => setActiveStep((prev) => Math.min(STEPS.length - 1, prev + 1))}
                >
                  {t('nextStepBtn')}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  loading={isGenerating}
                  onClick={handleGenerate}
                  icon="send"
                >
                  {t('generateVaultBtn')}
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Desktop Live Preview */}
          {isDesktop && (
            <div className="lg:col-span-5">
              <LivePreview activeStep={activeStep} />
            </div>
          )}
        </div>
      </main>

      {/* Share Modal */}
      <Modal
        isOpen={!!shareData}
        onClose={() => setShareData(null)}
        title={t('vaultReadyTitle')}
      >
        <div className="text-center space-y-4">
          <p className="font-body text-body-md text-on-surface-variant">
            {t('shareLinkInstructions')} <strong>{packet.recipientName}</strong>:
          </p>
          <div className="flex items-center gap-2 bg-surface-container-high p-3 rounded-xl border border-outline-variant">
            <input
              type="text"
              readOnly
              value={shareData?.shareUrl || ''}
              className="flex-1 bg-transparent font-body text-body-md text-primary font-bold focus:outline-none"
            />
            <Button variant="primary" size="sm" onClick={copyToClipboard} icon="content_copy">
              {t('copyBtn')}
            </Button>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(`/vault/${shareData?.packetId}`)}
              icon="visibility"
            >
              {t('openRecipientBtn')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Mobile Live Preview Modal */}
      {!isDesktop && (
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title={t('mobilePreviewTitle')}
          size="sm"
        >
          <LivePreview activeStep={activeStep} />
        </Modal>
      )}
    </div>
  );
};

export default CreatorStudio;
