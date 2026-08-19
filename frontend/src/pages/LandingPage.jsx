import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import usePacket from '../hooks/usePacket';
import { useAuth } from '../context/AuthContext';
import MyVaultsModal from '../components/common/MyVaultsModal';

const floatingEmojis = ['🎉', '💌', '🎊', '✨', '🌟', '🎈', '💝', '🥳'];

const LandingPage = () => {
  const navigate = useNavigate();
  const { packet, setLanguage } = usePacket();
  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const [showMyVaults, setShowMyVaults] = useState(false);
  const isHinglish = packet?.language === 'hinglish';

  const content = {
    badge1: isHinglish ? '🎉 Festival Season Special' : '🎉 Festival Season Special',
    badge2: isHinglish ? '🌐 Hinglish 🇮🇳 Mode Active' : '🌐 English 🇬🇧 Mode Active',
    heroTitlePart1: isHinglish ? 'Apne Bhai/Behen Ke Liye Ek ' : 'Build a ',
    heroTitleHighlight: isHinglish ? 'Memory Vault ' : 'Memory Vault ',
    heroTitlePart2: isHinglish ? 'Banayein' : 'for your Sibling',
    heroSub: isHinglish
      ? 'Apni pyari yaadein, bachpan ke kisse, aur festival ka pyaar ek interactive digital gift mein badlo — bina kisi login ya code ke! ✨'
      : 'Turn your shared memories, inside jokes, and festival love into a personalized interactive gift — no login, no coding, just magic. ✨',
    ctaPrimary: isHinglish ? 'Vault Banayein — Bilkul Free' : 'Create My Vault — It’s Free',
    ctaSecondary: isHinglish ? 'Demo Vault Dekhein' : 'See a Demo Vault',
    langCardTitle: isHinglish ? 'Apni Bhasha Mein Vault! ⚡' : 'Vault in Your Language! ⚡',
    langCardDesc: isHinglish
      ? 'Aapka vault English ya Hinglish dono me ready hoga — Studio aur Recipient View sab adapt hoga!'
      : 'Create your vault in English or Hinglish — studio & recipient view both adapt automatically!',
    featuresHeader: isHinglish ? 'Vault Ke Andar Kya Kya Milega 🗝️' : 'Everything inside your vault 🗝️',
    howItWorksHeader: isHinglish ? 'Yeh Kaise Kaam Karta Hai 🛠️' : 'How it works 🛠️',
    step1Title: isHinglish ? 'Vault Customize Karein' : 'Build Your Vault',
    step1Desc: isHinglish ? 'Studio mein memory photo, Rakhi wish, coupons aur roasts add karein.' : 'Use Creator Studio to add memory photo, wish, coupons, and roasts.',
    step2Title: isHinglish ? 'Link Generate Karein' : 'Generate a Link',
    step2Desc: isHinglish ? '"Create Vault" dabayein aur apna unique link banayein.' : 'Hit "Create Vault" to generate a unique shareable URL.',
    step3Title: isHinglish ? 'Behen/Bhai Vault Kholega' : 'They Open the Vault',
    step3Desc: isHinglish ? 'Aapka sibling phone par ek shandar personalized experience unlock karega.' : 'Your sibling opens an immersive, interactive experience made just for them.',
    finalCtaTitle: isHinglish ? 'Aapka Sibling Intezar Kar Raha Hai 💌' : 'Your sibling is waiting 💌',
    finalCtaSub: isHinglish ? 'Koi account nahi chahiye. Sirf 2 minute mein unhe special feel karayein.' : 'No account needed. Just 2 minutes to make them feel special.',
    finalCtaBtn: isHinglish ? 'Abhi Shuru Karein — Free 🎉' : 'Start Building — Free 🎉',
  };

  const features = [
    {
      icon: '📸',
      title: isHinglish ? 'Yaadon Ki Photo' : 'Memory Photo',
      desc: isHinglish ? '1 sabse pyaari photo upload karein uncropped frame aur secret note ke saath.' : 'Upload your best memory photo with uncropped ambient frame & secret notes.',
      color: 'bg-primary-fixed',
    },
    {
      icon: '🎁',
      title: isHinglish ? 'Rakhi Sandesh & Gift' : 'Rakhi Wish & Gifts',
      desc: isHinglish ? 'Bhai ka dil se message aur Flipkart/Myntra/Ajio partner stores se gift deals.' : 'Heartfelt Rakhi message with top curated deals from Flipkart, Myntra & Ajio.',
      color: 'bg-primary-fixed-dim',
    },
    {
      icon: '🎰',
      title: isHinglish ? 'Punishment Wheel' : 'Punishment Wheel',
      desc: isHinglish ? 'Mazedaar sibling punishments dalein jise spin karke wo accept karein.' : 'Add your funniest punishments. Let your sibling spin their fate.',
      color: 'bg-secondary-fixed',
    },
    {
      icon: '🎟️',
      title: isHinglish ? 'Sibling Coupons' : 'Coupon Book',
      desc: isHinglish ? '"Free Ice Cream", "Maggi Pass" jaise vouchers redeem karein confetti ke saath.' : 'Redeem "Free Treats", "Zero Arguments Pass", and more crafted with love.',
      color: 'bg-tertiary-fixed',
    },
  ];

  return (
    <div className="min-h-screen bg-surface paper-texture overflow-x-hidden">

      {/* ── Floating Emoji Decorations ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        {floatingEmojis.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl select-none"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              top: `${5 + (i * 13) % 80}%`,
            }}
            animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      {/* ── Navbar with Dynamic Language Switcher ── */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 overflow-x-hidden">
        <span className="shrink-0 flex items-center gap-1.5 sm:gap-2 font-display text-sm font-bold sm:text-base md:text-xl text-primary tracking-tight whitespace-nowrap">
          <span className="text-base sm:text-xl">🎁</span>
          <span>Kinship &amp; Keepsake</span>
        </span>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Desktop Dual Switcher */}
          <div className="hidden sm:flex items-center bg-surface-container rounded-full p-1 border border-outline-variant/60 shadow-sm shrink-0">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-full text-caption font-body font-bold transition-all flex items-center gap-1 cursor-pointer ${
                !isHinglish
                  ? 'bg-primary text-on-primary shadow-sm scale-105'
                  : 'text-on-surface hover:text-primary'
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hinglish')}
              className={`px-3 py-1.5 rounded-full text-caption font-body font-bold transition-all flex items-center gap-1 cursor-pointer ${
                isHinglish
                  ? 'bg-primary text-on-primary shadow-sm scale-105'
                  : 'text-on-surface hover:text-primary'
              }`}
            >
              <span>🇮🇳</span>
              <span>Hinglish</span>
            </button>
          </div>

          {/* Mobile Compact Language Switcher */}
          <button
            type="button"
            onClick={() => setLanguage(isHinglish ? 'en' : 'hinglish')}
            className="sm:hidden px-2.5 py-1 rounded-full text-xs font-body font-bold bg-surface-container border border-outline-variant/60 text-on-surface shadow-sm flex items-center gap-1 shrink-0 cursor-pointer"
            title="Switch Language"
          >
            <span>{isHinglish ? '🇮🇳 HI' : '🇬🇧 EN'}</span>
          </button>

          {/* User Auth or Studio trigger */}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => setShowMyVaults(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/50 text-on-surface font-body font-bold text-xs sm:text-caption transition-all shadow-sm cursor-pointer shrink-0"
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-primary object-cover"
                />
              ) : (
                <span>👤</span>
              )}
              <span className="hidden sm:inline">My Vaults</span>
              <span className="sm:hidden">Vaults</span>
            </button>
          ) : (
            <div className="flex items-center shrink-0">
              <GoogleLogin
                onSuccess={(credentialResponse) => loginWithGoogle(credentialResponse)}
                onError={() => console.error('Google Sign In Failed')}
                type="standard"
                theme="outline"
                size="small"
                text="signin"
                shape="pill"
              />
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/studio')}
            className="bg-primary text-on-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-body font-bold text-xs sm:text-sm shadow-card inline-flex items-center gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <span>{isHinglish ? 'Studio' : 'Get Started'}</span>
            <span>→</span>
          </motion.button>
        </div>
      </nav>

      {/* User's Vaults Modal */}
      <MyVaultsModal isOpen={showMyVaults} onClose={() => setShowMyVaults(false)} />

      {/* ── Hero Section ── */}
      <section className="relative z-10 text-center px-gutter pt-12 pb-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="inline-block bg-secondary-fixed text-on-secondary-fixed font-body font-bold text-caption uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
              {content.badge1}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed font-body font-bold text-caption uppercase tracking-wider px-4 py-1.5 rounded-full shadow-card">
              {content.badge2}
            </span>
          </div>

          <h1 className="font-display text-display-lg text-on-surface mb-4 leading-[1.1]">
            {content.heroTitlePart1}
            <span className="text-primary font-extrabold">
              {content.heroTitleHighlight}
            </span>
            {content.heroTitlePart2}
          </h1>

          <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
            {content.heroSub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/studio')}
              className="bg-primary text-on-primary px-10 py-4 rounded-full font-body font-bold text-body-md shadow-[0_8px_24px_rgba(163,61,37,0.3)] inline-flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              <span>{content.ctaPrimary}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/vault/demo')}
              className="bg-surface border-2 border-outline-variant text-on-surface px-8 py-4 rounded-full font-body font-bold text-body-md inline-flex items-center justify-center gap-2 hover:border-primary transition-colors"
            >
              <span className="material-symbols-outlined">visibility</span>
              <span>{content.ctaSecondary}</span>
            </motion.button>
          </div>

          {/* Language Feature Highlight Card */}
          <div className="mt-8 inline-flex items-center gap-4 bg-surface-container-lowest border-2 border-primary-fixed-dim/40 rounded-2xl px-6 py-4 shadow-card max-w-2xl text-left">
            <span className="text-3xl flex-shrink-0">💬</span>
            <div>
              <p className="font-body font-bold text-body-md text-on-surface mb-0.5">
                {content.langCardTitle}
              </p>
              <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
                {content.langCardDesc}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Hero mockup badges */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mt-14 relative"
        >
          <div className="absolute inset-0 bg-primary-fixed-dim/30 rounded-6xl blur-3xl -z-10 scale-110" />
          <div className="bg-surface-container-lowest rounded-4xl shadow-[0_32px_80px_rgba(0,0,0,0.12)] p-2 border border-outline-variant/30 inline-block">
            <div className="bg-gradient-to-br from-primary-fixed via-secondary-fixed to-tertiary-fixed rounded-3xl p-8 flex items-center gap-4 flex-wrap justify-center">
              {['🌐 English & Hinglish', '📸 Memory Photo', '🎁 Rakhi Wish & Store', '🎰 Punishment Wheel', '🎟️ Coupons'].map(item => (
                <div key={item} className="bg-white/80 backdrop-blur-sm px-5 py-3 rounded-2xl shadow-sm font-body font-bold text-on-surface text-label-bold whitespace-nowrap">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features Grid ── */}
      <section className="relative z-10 px-gutter pb-14 max-w-container mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-headline-md text-center text-on-surface mb-8 font-bold"
        >
          {content.featuresHeader}
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
              className="bg-surface-container-lowest rounded-3xl p-6 shadow-card border border-outline-variant/20 flex flex-col justify-between"
            >
              <div>
                <div className={`${f.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm`}>
                  {f.icon}
                </div>
                <h3 className="font-display text-headline-sm text-on-surface mb-2 font-bold">{f.title}</h3>
                <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="relative z-10 bg-surface-container-low px-gutter py-14">
        <div className="max-w-container mx-auto text-center">
          <h2 className="font-display text-headline-md text-on-surface mb-10 font-bold">{content.howItWorksHeader}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: 'edit_note', title: content.step1Title, desc: content.step1Desc },
              { step: '02', icon: 'share', title: content.step2Title, desc: content.step2Desc },
              { step: '03', icon: 'celebration', title: content.step3Title, desc: content.step3Desc },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-4">
                <div className="relative">
                  <span className="absolute -top-3 -right-3 font-body font-bold text-caption text-primary bg-primary-fixed px-2 py-0.5 rounded-full">{s.step}</span>
                  <div className="w-16 h-16 bg-secondary-fixed rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-secondary text-3xl">{s.icon}</span>
                  </div>
                </div>
                <h3 className="font-display text-headline-sm text-on-surface font-bold">{s.title}</h3>
                <p className="font-body text-body-sm text-on-surface-variant max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 px-gutter py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="font-display text-display-mobile text-on-surface font-bold">
            {content.finalCtaTitle}
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-6">
            {content.finalCtaSub}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/studio')}
            className="bg-primary text-on-primary px-12 py-5 rounded-full font-body font-bold text-body-md shadow-[0_8px_24px_rgba(163,61,37,0.3)] inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined">auto_awesome</span>
            <span>{content.finalCtaBtn}</span>
          </motion.button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-outline-variant px-gutter py-8">
        <div className="max-w-container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-display text-headline-sm text-on-surface font-bold">Kinship &amp; Keepsake</span>
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
