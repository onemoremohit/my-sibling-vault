import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { completePacket } from '../../services/api';
import { showSuccess, showError } from '../common/Toast';

const SISTER_REACTION_PRESETS_EN = [
  'Thank you Bhai! Best Rakhi gift ever! 💖',
  'I am redeeming all my coupons this weekend! 🍕🍦',
  'Your punishment is officially locked! No takebacks! 😈',
  'Loved the memories so much! Happy Raksha Bandhan! 🎀',
];

const SISTER_REACTION_PRESETS_HINGLISH = [
  'Thank you Bhai! Sabse best Rakhi surprise tha yeh! 💖',
  'Main saare coupons isi weekend redeem karne wali hoon! 🍕🍦',
  'Tera punishment lock ho chuka hai, ab koi bahana nahi chalega! 😈',
  'Saari yaadein dekh kar bohot maza aaya! Happy Rakhi! 🎀',
];

const SisterCompletionCard = ({
  packetId,
  senderName = 'Bhai',
  recipientName = 'Didi',
  redeemedCoupons = [],
  acceptedPunishment = '',
  defaultPunishment = 'Treat me to delicious food & snacks 🍕',
  lang = 'en',
}) => {
  const isHinglish = lang === 'hinglish';
  const presets = isHinglish ? SISTER_REACTION_PRESETS_HINGLISH : SISTER_REACTION_PRESETS_EN;

  const finalPunishment = acceptedPunishment || defaultPunishment;

  const [reactionMessage, setReactionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);

  const replyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/reply/${packetId}`
    : `https://sibling-vault.vercel.app/reply/${packetId}`;

  const shareText = `I unlocked my Sibling Vault! 🎁 Click here to see which coupons I stole and what punishment I accepted: ${replyUrl}`;

  const handleSubmitReaction = async () => {
    setIsSubmitting(true);
    try {
      if (packetId && packetId !== 'demo') {
        await completePacket(packetId, {
          couponsRedeemed: redeemedCoupons,
          punishmentAccepted: finalPunishment,
          reactionMessage: reactionMessage.trim(),
        });
      }
      setIsCompleted(true);
      showSuccess(isHinglish ? '🎉 Vault lock ho gaya! Ab Bhai ko response bhejo!' : '🎉 Vault locked! Now send your response receipt back to Bhai!');
    } catch (err) {
      console.error('Error completing vault:', err);
      showError('Could not submit reaction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareToBrother = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${recipientName}'s Sibling Vault Reaction`,
          text: shareText,
          url: replyUrl,
        });
        showSuccess('Shared successfully! 🚀');
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Web Share failed, falling back to clipboard:', err);
        }
      }
    }

    // Fallback: Clipboard copy
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      showSuccess(isHinglish ? '📋 Reply link copy ho gaya! WhatsApp par Bhai ko bhej do!' : '📋 Reaction link copied! Send it to Bhai on WhatsApp!');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Clipboard copy error:', err);
      showError('Could not copy link.');
    }
  };

  return (
    <section className="relative max-w-3xl mx-auto my-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-primary-fixed/25 via-surface to-secondary-fixed/30 rounded-4xl p-6 sm:p-10 border-2 border-primary/30 shadow-2xl relative overflow-hidden text-center space-y-6"
      >
        {/* Decorative corner sparkles */}
        <div className="absolute top-3 left-4 text-3xl opacity-40 select-none">✨</div>
        <div className="absolute top-3 right-4 text-3xl opacity-40 select-none">💌</div>

        {!isCompleted ? (
          /* Step 1: Write Reaction & Lock Vault */
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary text-on-primary font-body font-bold text-caption uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">
              <span>🚀</span>
              <span>{isHinglish ? 'Bhai Ko Reaction Bhejo' : 'Send Your Reaction to Bhai'}</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-headline-lg text-primary font-bold">
                {isHinglish ? `Kaisa Laga Yeh Vault, ${recipientName}? 💖` : `Loved Your Vault, ${recipientName}? 💖`}
              </h3>
              <p className="font-body text-body-md text-on-surface-variant max-w-xl mx-auto">
                {isHinglish
                  ? `${senderName} ko ek pyara sa message likho aur apne redeemed coupons & punishment ka receipt generate karo!`
                  : `Send a reaction note to ${senderName} and generate a fun receipt of all the coupons you stole and the punishment you accepted!`}
              </p>
            </div>

            {/* Live Highlights Chips */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <span className="bg-secondary-fixed text-on-secondary-fixed font-body font-bold text-caption px-3.5 py-1.5 rounded-xl shadow-sm border border-secondary/20 flex items-center gap-1.5">
                <span>🎰</span>
                <span>Punishment: {finalPunishment}</span>
              </span>
              {redeemedCoupons.length > 0 && (
                <span className="bg-tertiary-fixed text-on-tertiary-fixed font-body font-bold text-caption px-3.5 py-1.5 rounded-xl shadow-sm border border-tertiary/20 flex items-center gap-1.5">
                  <span>🎟️</span>
                  <span>Coupons Stolen: {redeemedCoupons.length}</span>
                </span>
              )}
            </div>

            {/* Quick Preset Replies */}
            <div className="space-y-2">
              <label className="block font-body text-caption font-bold text-on-surface-variant uppercase tracking-wider">
                {isHinglish ? 'Quick Messages 💬' : 'Quick Reaction Presets 💬'}
              </label>
              <div className="flex flex-wrap gap-2 justify-center">
                {presets.map((msg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setReactionMessage(msg)}
                    className={`px-3.5 py-2 rounded-xl text-caption font-body font-bold border-2 transition-all text-left ${
                      reactionMessage === msg
                        ? 'border-primary bg-primary text-on-primary shadow-sm scale-105'
                        : 'border-outline-variant/60 hover:border-primary text-on-surface hover:bg-primary-fixed/20'
                    }`}
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Reaction Textarea */}
            <div className="text-left space-y-1.5 max-w-xl mx-auto">
              <label className="block font-body text-caption font-bold text-on-surface-variant uppercase tracking-wider">
                {isHinglish ? `Aapka Message for ${senderName} ✍️` : `Your Personal Reply Note for ${senderName} ✍️`}
              </label>
              <textarea
                rows={3}
                className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-2xl px-4 py-3 font-body text-body-md text-on-surface focus:border-primary focus:outline-none transition-colors resize-none placeholder:text-on-surface-variant/50 shadow-inner"
                placeholder={isHinglish
                  ? 'e.g. Bhai, thank you so much! Maggi pass main kal hi use karungi! 😂💖'
                  : 'e.g. Thank you so much Bhai! This made my day! Get ready for your punishment! 😂💖'}
                value={reactionMessage}
                onChange={(e) => setReactionMessage(e.target.value)}
              />
            </div>

            {/* Lock & Submit Button */}
            <div className="pt-2.5 pb-1">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isSubmitting}
                onClick={handleSubmitReaction}
                className="w-full sm:w-auto bg-[#c0392b] hover:bg-[#a93224] active:bg-[#922b21] text-white font-body font-black text-sm sm:text-base px-7 sm:px-9 py-3 sm:py-3.5 rounded-full shadow-[0_8px_20px_rgba(192,57,43,0.45)] border-2 border-white/30 transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer text-center"
              >
                <span className="text-xl">{isSubmitting ? '⏳' : '🔒'}</span>
                <span className="tracking-wide">
                  {isSubmitting
                    ? (isHinglish ? 'Lock Ho Raha Hai…' : 'Locking Vault…')
                    : (isHinglish ? `Lock Vault & Generate Receipt for ${senderName} 🚀` : `Lock Vault & Generate Receipt for ${senderName} 🚀`)}
                </span>
              </motion.button>
            </div>
          </div>
        ) : (
          /* Step 2: Completed Screen with Share Action */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6 py-3"
          >
            <div className="w-16 h-16 bg-primary text-on-primary rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-lg animate-bounce">
              🧾
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display text-headline-md sm:text-headline-lg text-primary font-extrabold">
                {isHinglish ? 'Vault Successfully Locked! 🎉' : 'Vault Successfully Locked! 🎉'}
              </h3>
              <p className="font-body text-body-md text-on-surface-variant max-w-md mx-auto leading-relaxed">
                {isHinglish
                  ? `Aapka response receipt ready hai! Ab ${senderName} ko send karein!`
                  : `Your emotional reaction receipt is ready! Send it back to ${senderName} now!`}
              </p>
            </div>

            {/* Share CTA Button (Medium Sized & Balanced) */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleShareToBrother}
                className="w-full sm:w-auto bg-[#c0392b] hover:bg-[#a93224] active:bg-[#922b21] text-white font-body font-black text-sm sm:text-base px-7 sm:px-9 py-3 sm:py-3.5 rounded-full shadow-[0_8px_20px_rgba(192,57,43,0.45)] border-2 border-white/30 inline-flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span className="text-xl">🚀</span>
                <span className="tracking-wide">
                  {isHinglish ? 'Responses Wapas Sender Ko Bhejen' : 'Send Response Back to Sender'}
                </span>
              </motion.button>

              <button
                type="button"
                onClick={() => window.open(replyUrl, '_blank')}
                className="w-full sm:w-auto bg-stone-50 hover:bg-white text-stone-900 border-2 border-stone-300 hover:border-primary font-body font-black text-sm sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 rounded-full transition-colors shadow-sm text-center"
              >
                👀 {isHinglish ? 'Receipt Preview Dekhein' : 'Preview Receipt'}
              </button>
            </div>

            {copied && (
              <p className="font-body text-caption font-bold text-secondary animate-pulse">
                ✓ {isHinglish ? 'Link copied! WhatsApp / chat par paste karein!' : 'Link copied! Paste into WhatsApp / chat to send!'}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default SisterCompletionCard;
