import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePacket from '../../hooks/usePacket';
import { showSuccess, showError } from '../common/Toast';

const PRESET_AWARDS = [
  { awardTitle: 'Official Maggi Thief',       description: 'Awarded for repeatedly stealing Maggi at 2 AM without permission.' },
  { awardTitle: 'World\'s Loudest Sibling',   description: 'For maintaining an impressive noise level of 11/10 at all times.' },
  { awardTitle: 'Drama Queen/King Supreme',   description: 'In recognition of turning every minor inconvenience into a Netflix series.' },
  { awardTitle: 'Remote Control Monopolist',  description: 'For exclusive and unauthorized control of the TV remote since birth.' },
];

const CertificateEditor = () => {
  const { packet, addCertificate, removeCertificate } = usePacket();
  const [form, setForm] = useState({ awardTitle: '', description: '' });

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
        <h3 className="font-display text-headline-md text-on-surface mb-1">Funny Certificates 🏆</h3>
        <p className="font-body text-caption text-on-surface-variant mb-4">Tap to award a certificate to your sibling</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_AWARDS.map(a => (
            <button
              key={a.awardTitle}
              onClick={() => handleAddPreset(a)}
              className="flex flex-col gap-1 p-4 bg-surface-container-low border-2 border-outline-variant/30 rounded-xl hover:border-primary hover:bg-primary-fixed/20 transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <p className="font-body font-bold text-label-bold text-primary">{a.awardTitle}</p>
              </div>
              <p className="font-body text-caption text-on-surface-variant">{a.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom certificate */}
      <div className="bg-surface rounded-2xl p-5 shadow-card border border-outline-variant/20">
        <h3 className="font-display text-headline-md text-on-surface mb-4">Custom Certificate</h3>
        <div className="space-y-3">
          <div>
            <label className="font-body text-caption text-on-surface-variant block mb-1">Award Title *</label>
            <input
              className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none transition-colors"
              placeholder="e.g. Official Snack Stealer"
              value={form.awardTitle}
              onChange={e => setForm(f => ({ ...f, awardTitle: e.target.value }))}
            />
          </div>
          <div>
            <label className="font-body text-caption text-on-surface-variant block mb-1">Description</label>
            <textarea
              rows={2}
              className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:border-secondary focus:outline-none resize-none transition-colors"
              placeholder="For exceptional achievements in snack theft and midnight fridge raids…"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <button
            onClick={handleAddCustom}
            className="w-full bg-primary text-on-primary py-3 rounded-xl font-body font-bold text-label-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
            Create Certificate
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
