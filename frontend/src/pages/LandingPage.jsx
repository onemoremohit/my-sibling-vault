import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '🖼️',
    title: 'Memory Timeline',
    desc: 'Build a chronological scrapbook with photos, stories, and click-to-reveal secret notes.',
    color: 'bg-primary-fixed',
  },
  {
    icon: '🎰',
    title: 'Punishment Wheel',
    desc: 'Add your funniest punishments. Let your sibling spin their fate.',
    color: 'bg-secondary-fixed',
  },
  {
    icon: '🎟️',
    title: 'Coupon Book',
    desc: 'Redeem "Free Hugs", "Zero Arguments Pass", and more — crafted with love.',
    color: 'bg-tertiary-fixed',
  },
  {
    icon: '🎁',
    title: 'Secret Wishlist',
    desc: 'Drop hints for the perfect festival gift. Your sibling can pledge to get it.',
    color: 'bg-primary-fixed-dim',
  },
];

const floatingEmojis = ['🎉', '💌', '🎊', '✨', '🌟', '🎈', '💝', '🥳'];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface paper-texture overflow-x-hidden">

      {/* ── Floating Emoji Decorations ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        {floatingEmojis.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl select-none"
            style={{
              left:  `${10 + (i * 12) % 80}%`,
              top:   `${5 + (i * 13) % 80}%`,
            }}
            animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-gutter py-sm max-w-container mx-auto">
        <span className="font-display text-display-mobile text-primary">Kinship &amp; Keepsake</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/studio')}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-body font-bold text-label-bold shadow-card"
        >
          Get Started
        </motion.button>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 text-center px-gutter pt-16 pb-24 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="inline-block bg-secondary-fixed text-on-secondary-fixed font-body font-bold text-caption uppercase tracking-widest px-4 py-1.5 rounded-full">
              🎉 Festival Season Special
            </span>
            <span className="inline-flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed font-body font-bold text-caption uppercase tracking-wider px-4 py-1.5 rounded-full shadow-card">
              🌐 English 🇬🇧 &amp; Hinglish 🇮🇳 Supported
            </span>
          </div>

          <h1 className="font-display text-display-lg text-on-surface mb-4 leading-[1.1]">
            Build a{' '}
            <span className="text-primary">
              Memory Vault
            </span>
            {' '}for your Sibling
          </h1>

          <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
            Turn your shared memories, inside jokes, and festival love into a personalized interactive gift — no login, no coding, just magic. ✨
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/studio')}
              className="bg-primary text-on-primary px-10 py-4 rounded-full font-body font-bold text-body-md shadow-[0_8px_24px_rgba(163,61,37,0.3)] inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              Create My Vault — It's Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/vault/demo')}
              className="bg-surface border-2 border-outline-variant text-on-surface px-8 py-4 rounded-full font-body font-bold text-body-md inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined">visibility</span>
              See a Demo Vault
            </motion.button>
          </div>

          {/* Language Feature Highlight Card */}
          <div className="mt-8 inline-flex items-center gap-4 bg-surface-container-lowest border-2 border-primary-fixed-dim/40 rounded-2xl px-6 py-4 shadow-card max-w-2xl text-left">
            <span className="text-3xl flex-shrink-0">💬</span>
            <div>
              <p className="font-body font-bold text-body-md text-on-surface mb-0.5">Vault in Your Language! Gen-Z special ⚡</p>
              <p className="font-body text-body-md text-on-surface-variant leading-relaxed">Create your vault in <strong>English</strong> or <strong>Hinglish</strong> — studio &amp; recipient view both adapt automatically!</p>
            </div>
          </div>
        </motion.div>

        {/* Hero image / mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mt-16 relative"
        >
          <div className="absolute inset-0 bg-primary-fixed-dim/30 rounded-6xl blur-3xl -z-10 scale-110" />
          <div className="bg-surface-container-lowest rounded-4xl shadow-[0_32px_80px_rgba(0,0,0,0.12)] p-2 border border-outline-variant/30 inline-block">
            <div className="bg-gradient-to-br from-primary-fixed via-secondary-fixed to-tertiary-fixed rounded-3xl p-8 flex items-center gap-4 flex-wrap justify-center">
              {['🌐 English & Hinglish', '🖼️ Timeline', '🎰 Wheel', '🎟️ Coupons', '🎁 Wishlist'].map(item => (
                <div key={item} className="bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm font-body font-bold text-on-surface text-label-bold whitespace-nowrap">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features Grid ── */}
      <section className="relative z-10 px-gutter pb-10 max-w-container mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-headline-md text-center text-on-surface mb-8"
        >
          Everything inside your vault 🗝️
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="bg-surface-container-lowest rounded-3xl p-6 shadow-card border border-outline-variant/20"
            >
              <div className={`${f.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-display text-headline-md text-on-surface mb-2">{f.title}</h3>
              <p className="font-body text-body-md text-on-surface-variant">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="relative z-10 bg-surface-container-low px-gutter py-12">
        <div className="max-w-container mx-auto text-center">
          <h2 className="font-display text-headline-md text-on-surface mb-8">How it works 🛠️</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: 'edit_note', title: 'Build Your Vault', desc: 'Use the Creator Studio to add memories, coupons, punishments, and wishes.' },
              { step: '02', icon: 'share',     title: 'Generate a Link',  desc: 'Hit "Generate & Share" to create a unique URL for your sibling.' },
              { step: '03', icon: 'celebration', title: 'They Open the Vault', desc: 'Your sibling opens an immersive, interactive experience made just for them.' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-4">
                <div className="relative">
                  <span className="absolute -top-3 -right-3 font-body font-bold text-caption text-primary bg-primary-fixed px-2 py-0.5 rounded-full">{s.step}</span>
                  <div className="w-16 h-16 bg-secondary-fixed rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-3xl">{s.icon}</span>
                  </div>
                </div>
                <h3 className="font-display text-headline-md text-on-surface">{s.title}</h3>
                <p className="font-body text-body-md text-on-surface-variant">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 px-gutter py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-display-mobile text-on-surface mb-4">
            Your sibling is waiting 💌
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-8">
            No account needed. Just 5 minutes to make them feel special.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/studio')}
            className="bg-primary text-on-primary px-12 py-5 rounded-full font-body font-bold text-body-md shadow-[0_8px_24px_rgba(163,61,37,0.3)]"
          >
            Start Building — Free 🎉
          </motion.button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-outline-variant px-gutter py-8">
        <div className="max-w-container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-display text-headline-md text-on-surface">Kinship &amp; Keepsake</span>
          <span className="font-body text-caption text-on-surface-variant">© 2024 — Made with nostalgia ❤️</span>
          <div className="flex gap-6 font-body text-caption text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
