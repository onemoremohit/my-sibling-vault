import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePacket from '../../hooks/usePacket';
import { showSuccess, showError } from '../common/Toast';

const CertificateEditor = () => {
  const { packet, addCertificate, removeCertificate, t } = usePacket();
  const [form, setForm] = useState({ awardTitle: '', description: '' });

  const PRESET_AWARDS = [
    { awardTitle: t('cert1Title'), description: t('cert1Desc') },
    { awardTitle: t('cert2Title'), description: t('cert2Desc') },
    { awardTitle: t('cert3Title'), description: t('cert3Desc') },
    { awardTitle: t('cert4Title'), description: t('cert4Desc') },
  ];

  const handleAddPreset = (p) => {
    addCertificate({ awardTitle: p.awardTitle, description: p.description });
    showSuccess(`🏆 "${p.awardTitle}" certificate added!`);
  };

  const handleAddCustom = () => {
    if (!form.awardTitle.trim()) { showError('Award title is required.'); return; }
    addCertificate({ awardTitle: form.awardTitle.trim(), description: form.description.trim() });
    setForm({ awardTitle: '', description: '' });
    showSuccess('Certificate added!');
  };

  return (
    <div className="space-y-5">
      {/* Presets */}
      <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
        <h3 className="font-display text-headline-md text-on-surface mb-1">{t('funnyCertsTitle')}</h3>
        <p className="font-body text-caption text-on-surface-variant mb-4">{t('funnyCertsDesc')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_AWARDS.map(a => {
            const isSelected = packet.certificates?.some(c => c.awardTitle === a.awardTitle);
            return (
              <button
                key={a.awardTitle}
                onClick={() => handleAddPreset(a)}
                className={`relative flex flex-col gap-1 p-4 border-2 rounded-xl transition-all text-left ${
                  isSelected
                    ? 'border-primary bg-primary-fixed/20 font-bold'
                    : 'border-outline-variant/30 bg-surface-container-low hover:border-primary hover:bg-primary-fixed/10'
                }`}
              >
                <div className="flex items-center gap-2 pr-3">
                  <span className="text-xl">🏆</span>
                  <p className="font-body font-bold text-label-bold text-primary">{a.awardTitle}</p>
                </div>
                <p className="font-body text-caption text-on-surface-variant">{a.description}</p>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-on-primary w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md border-2 border-surface">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom certificate */}
      <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
        <h3 className="font-display text-headline-md text-on-surface mb-4">{t('customCertTitle')}</h3>
        <div className="space-y-3">
          <div>
            <label className="font-body text-caption text-on-surface-variant block mb-1">Award Title *</label>
            <input
              className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors"
              placeholder={t('certTitlePlaceholder')}
              value={form.awardTitle}
              onChange={e => setForm(f => ({ ...f, awardTitle: e.target.value }))}
            />
          </div>
          <div>
            <label className="font-body text-caption text-on-surface-variant block mb-1">Description</label>
            <textarea
              rows={2}
              className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none resize-none transition-colors"
              placeholder={t('certDescPlaceholder')}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <button
            onClick={handleAddCustom}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-body font-bold text-label-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
            {t('createCertBtn')}
          </button>
        </div>
      </div>

      {/* Added certificates */}
      {packet.certificates.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {packet.certificates.map(c => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-start gap-3 border-2 border-primary-fixed-dim bg-primary-fixed/10 rounded-xl p-4"
              >
                <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0">workspace_premium</span>
                <div className="flex-1 min-w-0">
                  <p className="font-body font-bold text-label-bold text-primary">{c.awardTitle}</p>
                  {c.description && <p className="font-body text-caption text-on-surface-variant mt-0.5">{c.description}</p>}
                </div>
                <button onClick={() => removeCertificate(c.id)} className="p-1 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-colors flex-shrink-0">
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

export default CertificateEditor;
