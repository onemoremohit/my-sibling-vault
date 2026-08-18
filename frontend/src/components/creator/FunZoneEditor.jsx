import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import usePacket from '../../hooks/usePacket';
import { t as translate } from '../../i18n/translations';

const PRESET_ROASTS_EN = [
  'Takes 2 hours to get ready for a 5-minute errand ⏰',
  'Always steals my clothes and denies it even while wearing them 👕',
  'Starts crying the exact second Mom enters the room 😭',
  'Asks for my phone password then reads all my private chats 📱',
  'Never returns borrowed money ("I\'m your sibling, it\'s a tax") 💸',
];

const PRESET_ROASTS_HINGLISH = [
  '5 min ke kaam ke liye 2 ghante taiyar hone me lagati hai ⏰',
  'Mera hoodie pehan ke kehti hai "yeh toh mera hi hai" 👕',
  'Mummy ke aate hi rona shuru kar deti hai 😭',
  'Mere fridge me rakhi chocolate secretly khaa jaati hai 🍫',
  'Udhari maango toh bolti hai "Bhai-behen me kaisa hisaab" 💸',
];

const PRESET_CRIMES_EN = [
  { crimeTitle: 'Stealing clothes without asking 👕', amount: 500 },
  { crimeTitle: 'Eating my ice cream / treats from fridge 🍦', amount: 300 },
  { crimeTitle: 'Unanswered phone calls > 3 times 📱', amount: 200 },
  { crimeTitle: 'Spoiling movie climax ending 🎬', amount: 1000 },
  { crimeTitle: 'Bathroom occupancy > 45 minutes 🛁', amount: 400 },
];

const PRESET_CRIMES_HINGLISH = [
  { crimeTitle: 'Bina puche kapde churana 👕', amount: 500 },
  { crimeTitle: 'Call pick na karna (3+ baar) 📱', amount: 200 },
  { crimeTitle: 'Fridge se meri Maggi/Ice cream khana 🍦', amount: 300 },
  { crimeTitle: 'Movie ka climax pehle bata dena 🎬', amount: 1000 },
  { crimeTitle: 'Bathroom me 45 min lagana 🛁', amount: 400 },
];

const FunZoneEditor = () => {
  const {
    packet,
    addRoast,
    removeRoast,
    updateSecretChallenge,
    updateSiblingFavor,
    addFine,
    removeFine,
    t: contextT,
  } = usePacket();

  const t = (key) => (contextT ? contextT(key) : translate(key, packet?.language || 'en'));
  const isHinglish = packet?.language === 'hinglish';

  // Form states
  const [newRoast, setNewRoast] = useState('');
  const [crimeTitle, setCrimeTitle] = useState('');
  const [fineAmount, setFineAmount] = useState('');

  const handleToggleRoast = (preset) => {
    const existing = packet.roasts?.find((r) => r.text === preset);
    if (existing) {
      removeRoast(existing.id);
    } else {
      addRoast(preset);
    }
  };

  const handleToggleFine = (item) => {
    const existing = packet.fines?.find((f) => f.crimeTitle === item.crimeTitle);
    if (existing) {
      removeFine(existing.id);
    } else {
      addFine(item);
    }
  };

  const handleAddRoast = (e) => {
    e?.preventDefault();
    if (!newRoast.trim()) return;
    addRoast(newRoast.trim());
    setNewRoast('');
  };

  const handleAddFine = (e) => {
    e?.preventDefault();
    if (!crimeTitle.trim() || !fineAmount) return;
    addFine({ crimeTitle: crimeTitle.trim(), amount: Number(fineAmount) });
    setCrimeTitle('');
    setFineAmount('');
  };

  const secretChallenge = packet.secretChallenge || {
    question: '',
    revealMsg: '',
  };

  const presetRoasts = isHinglish ? PRESET_ROASTS_HINGLISH : PRESET_ROASTS_EN;
  const presetCrimes = isHinglish ? PRESET_CRIMES_HINGLISH : PRESET_CRIMES_EN;

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-surface rounded-2xl p-6 shadow-card border border-outline-variant/20">
        <h2 className="font-display text-headline-md text-primary flex items-center gap-2">
          <span>🌶️</span> {t('funZoneHeader')}
        </h2>
        <p className="font-body text-body-md text-on-surface-variant">{t('funZoneSub')}</p>
      </div>

      {/* FEATURE 1: Sibling Roasts 🌶️ (Optional) */}
      <div className="bg-surface rounded-2xl p-6 shadow-card border border-outline-variant/20 space-y-6">
        <div className="flex items-center justify-between gap-2 border-b border-outline-variant/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl">local_fire_department</span>
            <h3 className="font-display text-title-lg text-on-surface">{t('roastBuilderTitle')}</h3>
          </div>
          <span className="flex-shrink-0 font-body text-[10px] font-bold bg-surface-container text-on-surface-variant border border-outline-variant/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Optional
          </span>
        </div>
        <p className="font-body text-caption text-on-surface-variant">{t('roastBuilderDesc')}</p>

        {/* Quick Presets */}
        <div className="space-y-2">
          <p className="font-body text-label font-bold text-primary">{t('quickRoastPresets')}</p>
          <div className="flex flex-wrap gap-2">
            {presetRoasts.map((preset, idx) => {
              const isSelected = packet.roasts?.some((r) => r.text === preset);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleRoast(preset)}
                  className={`relative font-body text-caption px-3.5 py-1.5 rounded-full transition-all text-left border ${
                    isSelected
                      ? 'bg-secondary-fixed border-secondary text-secondary font-bold shadow-sm'
                      : 'bg-secondary-fixed/50 border-secondary/20 text-on-surface hover:bg-secondary-fixed'
                  }`}
                >
                  + {preset}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border border-surface">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Roast Form — Optional */}
        <div className="space-y-1.5 pt-2">
          <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
            Or write your own
            <span className="bg-surface-container border border-outline-variant/40 px-2 py-0.5 rounded-full">Optional</span>
          </p>
          <form onSubmit={handleAddRoast} className="flex gap-2">
            <input
              type="text"
              value={newRoast}
              onChange={(e) => setNewRoast(e.target.value)}
              placeholder={t('roastPlaceholder')}
              className="flex-1 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:outline-none focus:border-primary"
            />
            <Button type="submit" variant="primary" icon="add">
              {t('addRoastBtn')}
            </Button>
          </form>
        </div>

        {/* Added Roasts List */}
        {packet.roasts?.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-outline-variant/30">
            <h4 className="font-body font-bold text-label-bold text-on-surface">
              Added Roasts ({packet.roasts?.length || 0})
            </h4>
            <div className="space-y-2">
              {packet.roasts?.map((roast) => (
                <motion.div
                  key={roast.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40"
                >
                  <p className="font-body text-body-md text-on-surface flex-1 pr-3">🔥 "{roast.text}"</p>
                  <button
                    onClick={() => removeRoast(roast.id)}
                    className="p-1 text-on-surface-variant hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FEATURE 2: Catch My Challenge / Sibling Dare 🎯 (Optional) */}
      <div className="bg-surface rounded-2xl p-6 shadow-card border border-outline-variant/20 space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-outline-variant/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl">flag</span>
            <h3 className="font-display text-title-lg text-on-surface">{t('secretQuizTitle')}</h3>
          </div>
          <span className="flex-shrink-0 font-body text-[10px] font-bold bg-surface-container text-on-surface-variant border border-outline-variant/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Optional
          </span>
        </div>
        <p className="font-body text-caption text-on-surface-variant">{t('secretQuizDesc')}</p>

        {/* Single Clean Input Field */}
        <div className="space-y-1.5">
          <input
            type="text"
            value={secretChallenge.question || secretChallenge.challengeText || ''}
            onChange={(e) => updateSecretChallenge({ question: e.target.value, challengeText: e.target.value, revealMsg: '', rewardMsg: '' })}
            placeholder={t('secretQuestionPlaceholder')}
            className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 font-body text-body-md text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/50 shadow-inner"
          />
        </div>
      </div>

      {/* FEATURE 3: One Request (Sibling Favor) 🙏 (Optional) */}
      <div className="bg-surface rounded-2xl p-6 shadow-card border border-outline-variant/20 space-y-5">
        <div className="flex items-center justify-between gap-2 border-b border-outline-variant/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl">volunteer_activism</span>
            <h3 className="font-display text-title-lg text-on-surface">{t('favorTitle')}</h3>
          </div>
          <span className="flex-shrink-0 font-body text-[10px] font-bold bg-surface-container text-on-surface-variant border border-outline-variant/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Optional
          </span>
        </div>
        <p className="font-body text-caption text-on-surface-variant">{t('favorDesc')}</p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-body text-label-bold text-on-surface">{t('favorTextLabel')}</label>
            <textarea
              rows={3}
              value={packet.siblingFavor?.requestText || ''}
              onChange={(e) => updateSiblingFavor({ requestText: e.target.value })}
              placeholder={t('favorTextPlaceholder')}
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3 font-body text-body-md text-on-surface focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-body text-label-bold text-on-surface">{t('favorPriorityLabel')}</label>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'high', label: t('priorityHigh') },
                { key: 'medium', label: t('priorityMedium') },
                { key: 'funny', label: t('priorityFunny') },
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => updateSiblingFavor({ priority: p.key })}
                  className={`px-4 py-2 rounded-xl font-body font-bold text-caption transition-all ${
                    packet.siblingFavor?.priority === p.key
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/40'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 4: Fine Calculator 💸 (Optional) */}
      <div className="bg-surface rounded-2xl p-6 shadow-card border border-outline-variant/20 space-y-6">
        <div className="flex items-center justify-between gap-2 border-b border-outline-variant/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-2xl">receipt_long</span>
            <h3 className="font-display text-title-lg text-on-surface">{t('finesTitle')}</h3>
          </div>
          <span className="flex-shrink-0 font-body text-[10px] font-bold bg-surface-container text-on-surface-variant border border-outline-variant/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Optional
          </span>
        </div>
        <p className="font-body text-caption text-on-surface-variant">{t('finesDesc')}</p>

        {/* Quick Crime Presets */}
        <div className="space-y-2">
          <p className="font-body text-label font-bold text-primary">{t('quickCrimePresets')}</p>
          <div className="flex flex-wrap gap-2">
            {presetCrimes.map((item, idx) => {
              const isSelected = packet.fines?.some((f) => f.crimeTitle === item.crimeTitle);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleFine(item)}
                  className={`relative font-body text-caption px-3.5 py-1.5 rounded-full transition-all text-left border ${
                    isSelected
                      ? 'bg-secondary-fixed border-secondary text-secondary font-bold shadow-sm'
                      : 'bg-secondary-fixed/50 border-secondary/20 text-on-surface hover:bg-secondary-fixed'
                  }`}
                >
                  + {item.crimeTitle} (₹{item.amount})
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border border-surface">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Crime Fine Form — Optional */}
        <div className="space-y-1.5 pt-2">
          <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
            Or add a custom crime
            <span className="bg-surface-container border border-outline-variant/40 px-2 py-0.5 rounded-full">Optional</span>
          </p>
          <form onSubmit={handleAddFine} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <input
              type="text"
              value={crimeTitle}
              onChange={(e) => setCrimeTitle(e.target.value)}
              placeholder={t('crimeTitlePlaceholder')}
              className="sm:col-span-7 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:outline-none focus:border-primary"
            />
            <input
              type="number"
              value={fineAmount}
              onChange={(e) => setFineAmount(e.target.value)}
              placeholder={t('crimeAmountPlaceholder')}
              className="sm:col-span-3 bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 font-body text-body-md text-on-surface focus:outline-none focus:border-primary"
            />
            <div className="sm:col-span-2">
              <Button type="submit" variant="primary" icon="add" className="w-full">
                {t('addFineBtn')}
              </Button>
            </div>
          </form>
        </div>

        {/* Added Fines List */}
        {packet.fines?.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-outline-variant/30">
            <h4 className="font-body font-bold text-label-bold text-on-surface">
              Configured Crimes ({packet.fines?.length || 0})
            </h4>
            <div className="space-y-2">
              {packet.fines?.map((fine) => (
                <motion.div
                  key={fine.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/40"
                >
                  <p className="font-body text-body-md text-on-surface flex-1 pr-3">
                    ⚖️ {fine.crimeTitle}
                  </p>
                  <span className="font-display font-bold text-primary mr-3">₹{fine.amount}</span>
                  <button
                    onClick={() => removeFine(fine.id)}
                    className="p-1 text-on-surface-variant hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunZoneEditor;
