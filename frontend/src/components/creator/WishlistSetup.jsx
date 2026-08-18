import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePacket from '../../hooks/usePacket';
import { AFFILIATE_STORES } from '../../data/affiliateStores';
import { showSuccess } from '../common/Toast';

const RAKHI_MESSAGES_EN = [
  'Happy Festival! 🎀 You mean the world to me!',
  'For my favourite sibling — the best surprise is on the way! 🌸',
  'Festival gift time! Sending you lots of love and a sweet surprise! 💝',
  'You deserve all the happiness in the world! 🎁',
];

const RAKHI_MESSAGES_HINGLISH = [
  'Happy Festival! 🎀 Tum mere liye sabse special ho!',
  'Mere favourite sibling ke liye — ek bohot pyaara surprise gift! 🌸',
  'Gift time! Dil se dher saara pyaar aur ek gift tere liye! 💝',
  'Tum duniya ki saari khushiyan deserve karte ho! 🎁',
];

const WishlistSetup = () => {
  const { packet, updateBrotherMessage, updateGiftOrdered } = usePacket();

  const isHinglish = packet?.language === 'hinglish';
  const rakhiMessages = isHinglish ? RAKHI_MESSAGES_HINGLISH : RAKHI_MESSAGES_EN;

  const handleToggleOrdered = () => {
    const newState = !packet.giftOrdered;
    updateGiftOrdered(newState);
    if (newState) {
      showSuccess(isHinglish ? '🎁 Gift purchase confirm ho gaya! Recipient ko surprise message dikhega.' : '🎁 Gift purchase confirmed! Recipient will see surprise delivery notice.');
    }
  };

  return (
    <div className="space-y-8">
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* FEATURE 1: Festival & Sibling Message */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-surface rounded-3xl p-6 md:p-8 shadow-card border-2 border-primary/25 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
            🎀
          </div>
          <div>
            <h3 className="font-display text-headline-md text-primary font-bold">
              {isHinglish ? 'Festival & Sibling Sandesh' : 'Festival & Sibling Wish'}
              <span className="text-error ml-1" title="Required">*</span>
            </h3>
            <p className="font-body text-body-sm text-on-surface-variant">
              {isHinglish
                ? 'Apne sibling ko ek dil se message likho ya neeche se preset chuno'
                : 'Write a heartfelt message or pick a preset wish for your sibling'}
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 pt-1">
          {rakhiMessages.map((msg, i) => (
            <button
              key={i}
              type="button"
              onClick={() => updateBrotherMessage(msg)}
              className={`px-3.5 py-2 rounded-xl text-caption font-body font-bold border-2 transition-all text-left ${
                packet.brotherMessage === msg
                  ? 'border-primary bg-primary text-on-primary shadow-sm scale-[1.02]'
                  : 'border-outline-variant/60 hover:border-primary text-on-surface hover:bg-primary-fixed/10'
              }`}
            >
              {msg}
            </button>
          ))}
        </div>

        {/* Custom message textarea */}
        <div>
          <label className="block font-body text-caption font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
            {isHinglish ? 'Aapka Custom Message 💌' : 'Your Custom Message 💌'}
          </label>
          <textarea
            rows={3}
            className="w-full border-2 border-primary-fixed-dim bg-surface-bright rounded-2xl px-4 py-3 font-body text-body-md text-on-surface focus:border-primary focus:outline-none transition-colors resize-none placeholder:text-on-surface-variant/50"
            placeholder={isHinglish
              ? 'e.g. Didi, Happy Rakhi! Maine tumhare liye ek bohot pyaara gift order kiya hai! 🎁'
              : 'e.g. Happy Raksha Bandhan, Didi! A special gift is on its way to make you smile! 🎁'}
            value={packet.brotherMessage}
            onChange={e => updateBrotherMessage(e.target.value)}
          />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* FEATURE 2: Partner Shopping Platforms (Affiliate Store Links)     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-secondary-fixed/40 via-surface to-primary-fixed/30 p-6 md:p-8 rounded-3xl border border-outline-variant/30 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-3 py-1 rounded-full text-caption font-body font-bold uppercase tracking-wider shadow-sm">
            <span>🛍️</span>
            <span>{isHinglish ? 'Partner Gift Stores' : 'Partner Gift Stores'}</span>
          </div>
          <h3 className="font-display text-headline-lg text-primary font-bold">
            {isHinglish ? 'Apni Behen/Bhai Ke Liye Shopping Platform Chuno 🎁' : 'Choose Where to Buy Her Gift 🎁'}
          </h3>
          <p className="font-body text-body-sm text-on-surface-variant max-w-2xl">
            {isHinglish
              ? 'Neeche diye gaye kisi bhi platform se behen/bhai ke liye gift order karein. Order karne ke baad "Maine Gift Order Kiya" confirm karein!'
              : 'Select your preferred shopping platform below to buy her favorite gift. After ordering, simply confirm below!'}
          </p>
        </div>

        {/* 4 Major Brand Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {AFFILIATE_STORES.map((store) => (
            <motion.div
              key={store.id}
              whileHover={{ y: -3 }}
              className={`bg-surface rounded-3xl p-6 border-2 transition-all shadow-card hover:shadow-card-hover flex flex-col justify-between space-y-5 ${store.borderColor}`}
            >
              <div className="space-y-3">
                {/* Store Header & Badge */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${store.brandColor} text-white flex items-center justify-center text-2xl shadow-md`}>
                      {store.logo}
                    </div>
                    <div>
                      <h4 className="font-display text-headline-sm text-on-surface font-extrabold">
                        {store.name}
                      </h4>
                      <p className="font-body text-caption font-bold text-primary">
                        {store.discount}
                      </p>
                    </div>
                  </div>

                  <span className="bg-surface-bright border border-outline-variant/40 text-on-surface font-body font-bold text-[11px] px-3 py-1 rounded-full shadow-sm">
                    {isHinglish ? store.badgeHi : store.badge}
                  </span>
                </div>

                {/* Description & Popular For */}
                <div className="space-y-1 bg-surface-bright/70 p-3.5 rounded-2xl border border-outline-variant/30">
                  <p className="font-body text-body-sm text-on-surface font-semibold">
                    {isHinglish ? store.taglineHi : store.tagline}
                  </p>
                  <p className="font-body text-caption text-on-surface-variant leading-relaxed">
                    ✨ <span className="font-bold">{isHinglish ? 'Khaas Items:' : 'Popular for:'}</span> {isHinglish ? store.popularForHi : store.popularFor}
                  </p>
                </div>
              </div>

              {/* Direct Store Buy Link */}
              <a
                href={store.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r ${store.brandColor} hover:opacity-95 text-white font-body font-bold text-label-lg py-3.5 px-5 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.01] text-center`}
              >
                <span>{isHinglish ? `${store.name} Par Gift Dekhein ↗` : `Shop on ${store.name} ↗`}</span>
              </a>
            </motion.div>
          ))}
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* ONE-TAP PURCHASE CONFIRMATION CARD (Zero Extra Work For User)     */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <div className="bg-surface rounded-3xl p-6 md:p-8 shadow-card border-2 border-primary/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl shrink-0">
                🎁
              </div>
              <div>
                <h4 className="font-display text-headline-sm text-primary font-bold">
                  {isHinglish ? 'Order Confirm Karein' : 'Confirm Your Gift Purchase'}
                </h4>
                <p className="font-body text-body-sm text-on-surface-variant">
                  {isHinglish
                    ? 'Kya aapne upar diye gaye kisi store se behen ke liye gift order kar diya?'
                    : 'Did you purchase/order a gift for her from any of the stores above?'}
                </p>
              </div>
            </div>

            {/* Simple One-Tap Confirm Toggle / Button */}
            <button
              type="button"
              onClick={handleToggleOrdered}
              className={`shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-body font-extrabold text-label-lg transition-all shadow-md ${
                packet.giftOrdered
                  ? 'bg-primary text-on-primary ring-2 ring-primary/40 scale-105'
                  : 'bg-surface-bright border-2 border-primary text-primary hover:bg-primary-fixed/20'
              }`}
            >
              <span>{packet.giftOrdered ? '✓' : '🎁'}</span>
              <span>
                {packet.giftOrdered
                  ? (isHinglish ? 'Gift Ordered (Confirmed) ✅' : 'Gift Ordered (Confirmed) ✅')
                  : (isHinglish ? 'Maine Gift Order Kar Diya 🎁' : 'Yes, I Have Ordered a Gift! 🎁')}
              </span>
            </button>
          </div>

          {/* Celebration notification if confirmed */}
          <AnimatePresence>
            {packet.giftOrdered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-primary-fixed/30 border border-primary/30 p-4 rounded-2xl flex items-center gap-3 text-primary font-body text-caption font-bold"
              >
                <span className="text-xl">✨</span>
                <span>
                  {isHinglish
                    ? 'Badhai! Recipient side par ek exciting surprise gift message show hoga ki aapka gift raste mein hai!'
                    : 'Awesome! Recipient will see an exciting surprise delivery notice that a gift is on its way to her!'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WishlistSetup;
