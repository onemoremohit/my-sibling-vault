import React from 'react';
import { motion } from 'framer-motion';

const WishlistDisplay = ({
  brotherMessage = '',
  giftOrdered = false,
  senderName = 'Sender',
  recipientName = 'Recipient',
  lang = 'en',
}) => {
  const isHinglish = lang === 'hinglish';

  const defaultMessage = isHinglish
    ? `Happy Festival ${recipientName}! 🎀 Hamesha khush raho aur muskurate raho!`
    : `Happy Festival, ${recipientName}! 🎀 Wishing you endless joy, love, and laughter!`;

  const finalMessage = brotherMessage && brotherMessage.trim() ? brotherMessage : defaultMessage;

  return (
    <section className="relative space-y-6 max-w-4xl mx-auto">
      {/* ── Section Title ── */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-4 py-1.5 rounded-full font-body font-bold text-caption uppercase tracking-wider shadow-sm">
          <span>🎀</span>
          <span>{isHinglish ? 'Festival Sandesh & Gift' : 'Festival Wish & Special Gift'}</span>
        </div>
        <h2 className="font-display text-display-md text-primary font-bold">
          {isHinglish ? 'Dil Se Pyaara Sandesh 💌' : 'Heartfelt Sibling Wish 💌'}
        </h2>
      </div>

      {/* ── Main Message Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-surface via-primary-fixed/15 to-secondary-fixed/20 rounded-3xl p-8 md:p-10 shadow-card-hover border-2 border-primary/30 overflow-hidden text-center space-y-6"
      >
        {/* Decorative corner motifs */}
        <div className="absolute top-4 left-4 text-3xl opacity-30 select-none">🪔</div>
        <div className="absolute top-4 right-4 text-3xl opacity-30 select-none">🌸</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-30 select-none">✨</div>
        <div className="absolute bottom-4 right-4 text-3xl opacity-30 select-none">🎀</div>

        {/* Ribbon Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-primary-fixed-dim text-on-primary flex items-center justify-center text-3xl mx-auto shadow-md">
          🎁
        </div>

        {/* Heartfelt Message Quote */}
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="font-display text-headline-md md:text-headline-lg text-primary italic leading-relaxed">
            "{finalMessage}"
          </p>
          <p className="font-body font-bold text-label-lg text-on-surface-variant">
            — {isHinglish ? `Bohot saare pyaar ke saath, ${senderName}` : `With lots of love, ${senderName}`} 💖
          </p>
        </div>

        {/* ── Surprise Gift Delivery Box (Only displayed if sender confirmed ordering) ── */}
        {giftOrdered && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-surface-bright/95 backdrop-blur-md rounded-2xl p-6 border-2 border-primary/40 shadow-card max-w-xl mx-auto space-y-4 text-center"
          >
            <div className="inline-flex items-center justify-center gap-2 text-primary font-body font-extrabold text-label-lg uppercase tracking-wider bg-primary-fixed/30 px-4 py-1.5 rounded-full">
              <span className="animate-bounce">🎁</span>
              <span>{isHinglish ? 'Surprise Gift On The Way! ✨' : 'Surprise Gift On The Way! ✨'}</span>
            </div>

            {/* Glowing Secret Gift Box Graphic */}
            <div className="py-2">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-primary-fixed via-secondary-fixed to-primary flex items-center justify-center text-4xl shadow-lg border-2 border-surface animate-pulse">
                📦
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-headline-sm text-primary font-bold">
                {isHinglish
                  ? 'Aapke liye ek bohot pyaara surprise gift planned hai! 🎉'
                  : 'A special surprise gift is coming your way! 🎉'}
              </h4>

              <p className="font-body text-body-md text-on-surface-variant leading-relaxed max-w-md mx-auto">
                {isHinglish
                  ? 'Maine tumhare liye ek surprise gift select kiya hai jo jald hi deliver hoga. Doorbell aur courier par nazar rakhna! 🚚✨'
                  : 'A surprise gift has been arranged for you! It will be delivered in a few days. Keep an eye out for the courier! 🚚✨'}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-secondary-fixed text-on-secondary-fixed font-body font-bold text-caption px-4 py-1.5 rounded-full shadow-sm">
              <span>🤫</span>
              <span>{isHinglish ? 'Gift ka naam secret hai — surprise rahega!' : 'The gift is a secret surprise — coming soon!'}</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default WishlistDisplay;
