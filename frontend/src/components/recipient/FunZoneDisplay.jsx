import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { t } from '../../i18n/translations';

const FunZoneDisplay = ({
  roasts = [],
  secretChallenge = {},
  siblingFavor = {},
  fines = [],
  senderName = 'Your Sibling',
  recipientName = 'You',
  lang = 'en',
  onAcceptChallenge,
  onGrantFavor,
  onSettleFines,
}) => {
  const DEFAULT_ROASTS_EN = [
    { id: 'r1', text: 'Takes 2 hours to get ready for a 5-minute errand ⏰', trueVotes: 3, fakeVotes: 0 },
    { id: 'r2', text: 'Always steals my clothes and denies it even while wearing them 👕', trueVotes: 5, fakeVotes: 1 },
    { id: 'r3', text: 'Starts crying the exact second Mom enters the room 😭', trueVotes: 4, fakeVotes: 0 },
  ];

  const DEFAULT_ROASTS_HINGLISH = [
    { id: 'r1', text: '5 min ke kaam ke liye 2 ghante taiyar hone me lagati hai ⏰', trueVotes: 3, fakeVotes: 0 },
    { id: 'r2', text: 'Mera hoodie pehan ke kehti hai "yeh toh mera hi hai" 👕', trueVotes: 5, fakeVotes: 1 },
    { id: 'r3', text: 'Mummy ke aate hi rona shuru kar deti hai 😭', trueVotes: 4, fakeVotes: 0 },
  ];

  const DEFAULT_CHALLENGE_EN = {
    challengeText: "I dare you to let me draft your next WhatsApp status, and you can't delete it for 5 hours! 😂",
  };

  const DEFAULT_CHALLENGE_HINGLISH = {
    challengeText: "Mera dare hai ki tumhara agla WhatsApp status main likhunga/likhungi, aur tum 5 ghante tak delete nahi karoge! 😂",
  };

  const DEFAULT_FAVOR_EN = {
    requestText: 'Treat me to Momos & Boba Tea this weekend! 🥟🧋',
    priority: 'high',
  };

  const DEFAULT_FAVOR_HINGLISH = {
    requestText: 'Is weekend mujhe Momos aur Chai ki treat do! 🥟☕',
    priority: 'high',
  };

  const DEFAULT_FINES_EN = [
    { id: 'f1', crimeTitle: 'Stealing clothes without asking 👕', amount: 500 },
    { id: 'f2', crimeTitle: 'Unanswered phone calls > 3 times 📱', amount: 200 },
    { id: 'f3', crimeTitle: 'Eating my ice cream from fridge 🍦', amount: 300 },
    { id: 'f4', crimeTitle: 'Bathroom occupancy > 45 minutes 🛁', amount: 400 },
  ];

  const DEFAULT_FINES_HINGLISH = [
    { id: 'f1', crimeTitle: 'Bina puche kapde churana 👕', amount: 500 },
    { id: 'f2', crimeTitle: 'Call pick na karna (3+ baar) 📱', amount: 200 },
    { id: 'f3', crimeTitle: 'Fridge se meri Maggi/Ice cream khana 🍦', amount: 300 },
    { id: 'f4', crimeTitle: 'Bathroom me 45 min lagana 🛁', amount: 400 },
  ];

  const activeRoasts = (roasts && roasts.length > 0) ? roasts : [];

  const challengeText = (secretChallenge?.question || secretChallenge?.challengeText || '').trim();
  const activeChallenge = challengeText ? { ...secretChallenge, challengeText, question: challengeText } : null;

  const favorText = (siblingFavor?.requestText || '').trim();
  const activeFavor = favorText ? siblingFavor : null;

  const activeFines = (fines && fines.length > 0) ? fines : [];

  const hasAnyFunContent = activeRoasts.length > 0 || activeChallenge !== null || activeFavor !== null || activeFines.length > 0;

  // 1. Roast votes state
  const [roastVotes, setRoastVotes] = useState(
    activeRoasts.map((r, i) => ({ id: r.id || i, trueVotes: r.trueVotes || 0, fakeVotes: r.fakeVotes || 0, userVote: null }))
  );

  const handleVote = (index, type) => {
    setRoastVotes((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        if (item.userVote === type) return item;

        const newTrue = type === 'true' ? item.trueVotes + 1 : item.userVote === 'true' ? item.trueVotes - 1 : item.trueVotes;
        const newFake = type === 'fake' ? item.fakeVotes + 1 : item.userVote === 'fake' ? item.fakeVotes - 1 : item.fakeVotes;
        return { ...item, trueVotes: newTrue, fakeVotes: newFake, userVote: type };
      })
    );
  };

  // 2. Secret Challenge state
  const [quizStatus, setQuizStatus] = useState(null);

  const handleToggleChallenge = () => {
    if (quizStatus === 'accepted') {
      setQuizStatus(null);
      if (onAcceptChallenge) onAcceptChallenge('');
    } else {
      setQuizStatus('accepted');
      if (onAcceptChallenge) {
        onAcceptChallenge(activeChallenge?.question || activeChallenge?.challengeText || '');
      }
    }
  };

  // 3. Sibling Favor state
  const [favorStatus, setFavorStatus] = useState(activeFavor?.status || 'pending');
  const [showFavorModal, setShowFavorModal] = useState(false);

  const handleGrantFavor = () => {
    setFavorStatus('granted');
    if (onGrantFavor) onGrantFavor(activeFavor?.requestText || '');
    setShowFavorModal(true);
  };

  // 4. Fine Calculator state
  const [checkedFines, setCheckedFines] = useState(activeFines.map((f, i) => f.id || i));
  const [showPaidModal, setShowPaidModal] = useState(false);

  const handleSettleFines = () => {
    setShowPaidModal(true);
    if (onSettleFines) onSettleFines(true);
  };

  const toggleFineCheck = (id) => {
    setCheckedFines((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalFine = activeFines
    .filter((f, i) => checkedFines.includes(f.id || i))
    .reduce((sum, f) => sum + (f.amount || 0), 0);

  if (!hasAnyFunContent) {
    return null;
  }

  return (
    <section className="space-y-16 py-6">
      {/* Section Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-block bg-tertiary-fixed text-on-tertiary-fixed px-4 py-1 rounded-full font-body font-bold text-caption uppercase tracking-wider shadow-sm">
          🌶️ Sibling Banger Zone
        </div>
        <h2 className="font-display text-display-md text-primary">{t('funZoneSectionHeader', lang)}</h2>
        <p className="font-body text-body-lg text-on-surface-variant">{t('funZoneSectionSub', lang)}</p>
      </div>

      {/* FEATURE 1: Sibling Roast Wall 🌶️ */}
      {activeRoasts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-3">
            <span className="text-3xl">🔥</span>
            <div>
              <h3 className="font-display text-headline-md text-on-surface">{t('roastWallHeader', lang)}</h3>
              <p className="font-body text-caption text-on-surface-variant">Vote to agree or call out fake news!</p>
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRoasts.map((roast, idx) => {
            const voteData = roastVotes[idx] || { trueVotes: 0, fakeVotes: 0, userVote: null };
            return (
              <motion.div
                key={roast.id || idx}
                whileHover={{ y: -4 }}
                className="bg-surface rounded-3xl p-6 shadow-card border border-outline-variant/40 flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-6 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-b-xl font-display text-caption font-bold tracking-wider shadow-sm">
                  ROAST #{idx + 1}
                </div>

                <p className="font-display text-title-lg text-on-surface pt-2 leading-relaxed">
                  "{roast.text}"
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/30">
                  <button
                    onClick={() => handleVote(idx, 'true')}
                    className={`flex-1 py-2 px-3 rounded-xl font-body font-bold text-caption flex items-center justify-center gap-1.5 transition-all ${
                      voteData.userVote === 'true'
                        ? 'bg-secondary text-on-secondary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <span>{t('voteTrueBtn', lang)}</span>
                    <span className="opacity-80">({voteData.trueVotes})</span>
                  </button>

                  <button
                    onClick={() => handleVote(idx, 'fake')}
                    className={`flex-1 py-2 px-3 rounded-xl font-body font-bold text-caption flex items-center justify-center gap-1.5 transition-all ${
                      voteData.userVote === 'fake'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <span>{t('voteFakeBtn', lang)}</span>
                    <span className="opacity-80">({voteData.fakeVotes})</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      )}

      {/* FEATURE 2: Catch My Dare / Sibling Dare Challenge 🎯 */}
      {activeChallenge && (
        <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-card border-2 border-secondary/30 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-block bg-secondary-fixed text-on-secondary-fixed px-3 py-0.5 rounded-full font-body font-bold text-caption uppercase tracking-wider">
                🎯 Sibling Dare Challenge
              </div>
              <h3 className="font-display text-headline-md text-on-surface">
                {lang === 'hinglish' ? 'Catch My Challenge / Sibling Dare' : 'Catch My Dare / Sibling Challenge'}
              </h3>
              <p className="font-body text-body-md text-on-surface-variant">
                {lang === 'hinglish'
                  ? `${senderName} ne aapko ek daring challenge diya hai!`
                  : `A special dare set by ${senderName} for you to complete!`}
              </p>
            </div>
            <div className="text-3xl">🎯</div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl border-2 border-dashed border-secondary/40 space-y-4 text-center">
            <p className="font-body text-caption font-bold uppercase tracking-widest text-secondary">
              Dare from {senderName}:
            </p>

            <blockquote className="font-display text-display-mobile sm:text-headline-md text-on-surface italic px-4 py-2">
              "{activeChallenge.question || activeChallenge.challengeText}"
            </blockquote>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleToggleChallenge}
                className={`w-full py-3 px-4 rounded-xl font-body font-bold text-body-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  quizStatus === 'accepted'
                    ? 'bg-secondary text-on-secondary shadow-md'
                    : 'bg-primary text-on-primary hover:opacity-90 shadow-sm'
                }`}
              >
                <span>{quizStatus === 'accepted' ? (lang === 'hinglish' ? 'Dare Accepted! 🔥 Chal Raha Hai' : 'Dare Accepted! 🔥 In Progress') : (lang === 'hinglish' ? 'Dare Accept Karo 🎯' : 'Accept Dare 🎯')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 3: One Request Contract 🙏 */}
      {activeFavor && (
        <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-card border border-outline-variant/40 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
            <div>
              <div className="inline-block bg-primary-fixed text-on-primary-fixed px-3 py-0.5 rounded-full font-body font-bold text-caption uppercase tracking-wider mb-1">
                📜 Official Contract
              </div>
              <h3 className="font-display text-headline-md text-on-surface">{t('favorHeader', lang)}</h3>
              <p className="font-body text-caption text-on-surface-variant">{t('favorSub', lang)}</p>
            </div>
            <div className="text-4xl">🤝</div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl border-2 border-dashed border-primary/30 space-y-4 text-center">
            <p className="font-body text-caption font-bold uppercase tracking-widest text-primary">
              Favor Requested by {senderName}:
            </p>

            <blockquote className="font-display text-display-mobile sm:text-headline-md text-on-surface italic px-4 py-2">
              "{activeFavor.requestText}"
            </blockquote>

            <div className="flex items-center justify-center gap-3 pt-4">
              {favorStatus === 'granted' ? (
                <div className="bg-secondary text-on-secondary px-6 py-2.5 rounded-full font-body font-bold text-body-md shadow-sm flex items-center gap-2">
                  <span>{t('grantedFavorBadge', lang)}</span>
                </div>
              ) : (
                <Button variant="primary" size="lg" onClick={handleGrantFavor} icon="check_circle">
                  {t('grantFavorBtn', lang)}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 4: Funny Fine Calculator 💸 */}
      {activeFines.length > 0 && (
        <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-card border-2 border-outline-variant/60 space-y-6">
          <div className="space-y-1">
            <div className="inline-block bg-tertiary-fixed text-on-tertiary-fixed px-3 py-0.5 rounded-full font-body font-bold text-caption uppercase tracking-wider">
              🧾 Crime Invoice
            </div>
            <h3 className="font-display text-headline-md text-on-surface">{t('fineCalcHeader', lang)}</h3>
            <p className="font-body text-body-md text-on-surface-variant">{t('fineCalcSub', lang)}</p>
          </div>

          {/* Itemized Receipt Paper Box */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border-2 border-outline-variant shadow-inner space-y-4 max-w-xl mx-auto font-mono">
            <div className="text-center border-b border-dashed border-outline-variant pb-3">
              <p className="font-display text-title-lg text-primary font-bold tracking-widest">
                {t('fineReceiptTitle', lang)}
              </p>
              <p className="font-body text-caption text-on-surface-variant">ISSUED TO: {recipientName.toUpperCase()}</p>
            </div>

            {/* Crime Checklist */}
            <div className="space-y-3">
              {activeFines.map((fine, idx) => {
                const fineId = fine.id || idx;
                const isChecked = checkedFines.includes(fineId);
                return (
                  <label
                    key={fineId}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline-variant/30 cursor-pointer hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleFineCheck(fineId)}
                        className="w-5 h-5 text-primary rounded accent-primary cursor-pointer"
                      />
                      <span className={`font-body text-body-md ${isChecked ? 'text-on-surface font-medium' : 'text-on-surface-variant line-through opacity-50'}`}>
                        {fine.crimeTitle}
                      </span>
                    </div>
                    <span className="font-display font-bold text-primary">₹{fine.amount}</span>
                  </label>
                );
              })}
            </div>

            {/* Total Calculation */}
            <div className="border-t-2 border-dashed border-outline-variant pt-4 flex items-center justify-between">
              <span className="font-display text-title-lg text-on-surface font-bold">
                {t('totalFineLabel', lang)}
              </span>
              <span className="font-display text-display-mobile text-secondary font-bold">
                ₹{totalFine.toLocaleString()}
              </span>
            </div>

            {/* Settlement Action Buttons */}
            <div className="pt-4 flex flex-wrap gap-2 justify-center font-body">
              <Button variant="primary" size="md" onClick={handleSettleFines} icon="payment">
                {t('payViaUpiBtn', lang)}
              </Button>
              <Button variant="secondary" size="md" onClick={handleSettleFines} icon="local_pizza">
                {t('payViaPizzaBtn', lang)}
              </Button>
              <Button variant="ghost" size="md" onClick={handleSettleFines} icon="shield">
                {t('claimImmunityBtn', lang)}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Favor Status Modal */}
      <Modal
        isOpen={showFavorModal}
        onClose={() => setShowFavorModal(false)}
        title={t('favorModalTitle', lang)}
      >
        <div className="text-center space-y-4 py-2">
          <div className="text-5xl animate-bounce">🤝</div>
          <p className="font-body text-body-lg text-on-surface font-medium">
            {t('favorModalDesc', lang)}
          </p>
          <Button variant="primary" onClick={() => setShowFavorModal(false)}>
            Awesome! 🚀
          </Button>
        </div>
      </Modal>

      {/* Fine Payment Modal */}
      <Modal
        isOpen={showPaidModal}
        onClose={() => setShowPaidModal(false)}
        title={t('paidModalTitle', lang)}
      >
        <div className="text-center space-y-4 py-2">
          <div className="text-5xl animate-bounce">🍕</div>
          <p className="font-body text-body-lg text-on-surface font-medium">
            {t('paidModalDesc', lang)}
          </p>
          <Button variant="primary" onClick={() => setShowPaidModal(false)}>
            Settled! 🤝
          </Button>
        </div>
      </Modal>
    </section>
  );
};

export default FunZoneDisplay;
