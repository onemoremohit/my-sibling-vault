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
}) => {
  // 1. Roast votes state
  const [roastVotes, setRoastVotes] = useState(
    roasts.map((r, i) => ({ id: r.id || i, trueVotes: r.trueVotes || 0, fakeVotes: r.fakeVotes || 0, userVote: null }))
  );

  const handleVote = (index, type) => {
    setRoastVotes((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        if (item.userVote === type) return item; // Already voted this way

        const newTrue = type === 'true' ? item.trueVotes + 1 : item.userVote === 'true' ? item.trueVotes - 1 : item.trueVotes;
        const newFake = type === 'fake' ? item.fakeVotes + 1 : item.userVote === 'fake' ? item.fakeVotes - 1 : item.fakeVotes;
        return { ...item, trueVotes: newTrue, fakeVotes: newFake, userVote: type };
      })
    );
  };

  // 2. Secret Quiz state
  const [selectedOption, setSelectedOption] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [quizStatus, setQuizStatus] = useState(null); // 'correct' | 'wrong'

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    if (selectedOption === (secretChallenge.correctIndex || 0)) {
      setQuizStatus('correct');
    } else {
      setQuizStatus('wrong');
    }
  };

  // 3. Sibling Favor state
  const [favorStatus, setFavorStatus] = useState(siblingFavor.status || 'pending');
  const [showFavorModal, setShowFavorModal] = useState(false);

  const handleGrantFavor = () => {
    setFavorStatus('granted');
    setShowFavorModal(true);
  };

  // 4. Fine Calculator state
  const [checkedFines, setCheckedFines] = useState(fines.map((f, i) => f.id || i)); // All checked by default
  const [showPaidModal, setShowPaidModal] = useState(false);

  const toggleFineCheck = (id) => {
    setCheckedFines((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalFine = fines
    .filter((f, i) => checkedFines.includes(f.id || i))
    .reduce((sum, f) => sum + (f.amount || 0), 0);

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
      {roasts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-3">
            <span className="text-3xl">🔥</span>
            <div>
              <h3 className="font-display text-headline-md text-on-surface">{t('roastWallHeader', lang)}</h3>
              <p className="font-body text-caption text-on-surface-variant">Vote to agree or call out fake news!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roasts.map((roast, idx) => {
              const voteData = roastVotes[idx] || { trueVotes: 0, fakeVotes: 0, userVote: null };
              return (
                <motion.div
                  key={roast.id || idx}
                  whileHover={{ y: -4 }}
                  className="bg-surface rounded-3xl p-6 shadow-card border border-outline-variant/40 flex flex-col justify-between space-y-5 relative overflow-hidden"
                >
                  {/* Decorative tape badge */}
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

      {/* FEATURE 2: Catch My Secret Challenge 🕵️‍♂️ */}
      {secretChallenge.question && (
        <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-card border-2 border-secondary/30 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-block bg-secondary-fixed text-on-secondary-fixed px-3 py-0.5 rounded-full font-body font-bold text-caption uppercase tracking-wider">
                🕵️‍♂️ Mini Challenge
              </div>
              <h3 className="font-display text-headline-md text-on-surface">{t('secretQuizHeader', lang)}</h3>
              <p className="font-body text-body-md text-on-surface-variant">{t('secretQuizSub', lang)}</p>
            </div>
          </div>

          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/40 space-y-4">
            <p className="font-display text-title-lg text-primary">
              ❓ "{secretChallenge.question}"
            </p>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {secretChallenge.options?.map((opt, idx) => {
                if (!opt) return null;
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedOption(idx);
                      setQuizStatus(null);
                    }}
                    className={`p-4 rounded-xl font-body font-bold text-body-md text-left transition-all flex items-center justify-between border-2 ${
                      isSelected
                        ? 'bg-secondary-fixed border-secondary text-on-surface shadow-sm'
                        : 'bg-surface border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-secondary bg-secondary' : 'border-outline-variant'
                    }`}>
                      {isSelected && <span className="material-symbols-outlined text-on-secondary text-[12px]">check</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hint Dropdown */}
            {secretChallenge.hint && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="font-body text-caption font-bold text-secondary hover:underline flex items-center gap-1"
                >
                  <span>{t('showHintBtn', lang)}</span>
                </button>
                <AnimatePresence>
                  {showHint && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="font-body text-caption text-on-surface-variant italic bg-surface p-3 rounded-xl border border-outline-variant/30 mt-2"
                    >
                      💡 Hint: {secretChallenge.hint}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Quiz Submit Button & Results */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              {quizStatus !== 'correct' && (
                <Button
                  variant="primary"
                  onClick={handleQuizSubmit}
                  disabled={selectedOption === null}
                  icon="key"
                >
                  {t('submitQuizBtn', lang)}
                </Button>
              )}

              {quizStatus === 'wrong' && (
                <div className="flex items-center gap-3">
                  <span className="font-body font-bold text-caption text-error">
                    {t('quizWrongTitle', lang)} {t('quizWrongDesc', lang)}
                  </span>
                </div>
              )}
            </div>

            {/* Secret Unlocked Reveal Banner */}
            {quizStatus === 'correct' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-secondary-fixed/50 border-2 border-secondary rounded-2xl p-5 text-center space-y-2 mt-4"
              >
                <div className="text-4xl animate-bounce">🎉</div>
                <h4 className="font-display font-bold text-headline-sm text-secondary">
                  {t('quizCorrectTitle', lang)}
                </h4>
                <p className="font-body text-body-lg font-medium text-on-surface">
                  "{secretChallenge.revealMsg || 'You cracked the secret!'}"
                </p>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* FEATURE 3: One Request Contract 🙏 */}
      {siblingFavor.requestText && (
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
              "{siblingFavor.requestText}"
            </blockquote>

            <div className="flex items-center justify-center gap-3 pt-4">
              {favorStatus === 'granted' ? (
                <div className="bg-secondary text-on-secondary px-6 py-2.5 rounded-full font-body font-bold text-body-md shadow-sm flex items-center gap-2">
                  <span>{t('grantedFavorBadge', lang)}</span>
                </div>
              ) : (
                <>
                  <Button variant="primary" size="lg" onClick={handleGrantFavor} icon="check_circle">
                    {t('grantFavorBtn', lang)}
                  </Button>
                  <Button variant="ghost" size="lg" onClick={() => setFavorStatus('countered')}>
                    {t('counterOfferBtn', lang)}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 4: Funny Fine Calculator 💸 */}
      {fines.length > 0 && (
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
              {fines.map((fine, idx) => {
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
              <Button variant="primary" size="md" onClick={() => setShowPaidModal(true)} icon="payment">
                {t('payViaUpiBtn', lang)}
              </Button>
              <Button variant="secondary" size="md" onClick={() => setShowPaidModal(true)} icon="local_pizza">
                {t('payViaPizzaBtn', lang)}
              </Button>
              <Button variant="ghost" size="md" onClick={() => setShowPaidModal(true)} icon="shield">
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
