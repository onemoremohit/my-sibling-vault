import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPacket } from '../services/api';
import Loader from '../components/common/Loader';
import { showSuccess, showError } from '../components/common/Toast';

const EmotionalReceipt = () => {
  const { id, packetId } = useParams();
  const targetId = id || packetId;
  const navigate = useNavigate();

  const [packet, setPacket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Future hook email state
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchVault = async () => {
      setLoading(true);
      if (!targetId || targetId === 'demo') {
        setPacket({
          packetId: 'demo-receipt',
          senderName: 'Alex (Bhai)',
          recipientName: 'Sarah (Didi)',
          language: 'en',
          createdAt: new Date().toISOString(),
          punishments: ['Treat me to a lavish meal 🍕', 'Do my laundry for a week 🧺'],
          interactions: {
            status: 'completed',
            couponsRedeemed: ['Free Hug Pass', 'Zero Arguments Pass'],
            punishmentAccepted: 'Treat me to a lavish meal 🍕',
            reactionMessage: 'Thank you so much Bhai! This made my day! Get ready for your punishment! 😂💖',
            completedAt: new Date().toISOString(),
          },
        });
        setLoading(false);
        return;
      }

      try {
        const { data } = await getPacket(targetId);
        if (data && data.packetId) {
          setPacket(data);
        } else {
          showError('Vault receipt not found.');
        }
      } catch (err) {
        console.error('Fetch receipt error:', err);
        showError('Could not load receipt data.');
      } finally {
        setLoading(false);
      }
    };

    fetchVault();
  }, [targetId]);

  if (loading) return <Loader message="Loading Emotional Checkout Receipt…" />;

  if (!packet) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center space-y-4 font-body">
        <span className="text-5xl">🧾</span>
        <h2 className="font-display text-headline-md text-primary font-bold">Receipt Not Found</h2>
        <p className="text-body-md text-on-surface-variant max-w-md">
          We could not find the reaction receipt for this vault ID.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-full"
        >
          Go Home
        </button>
      </div>
    );
  }

  const {
    senderName = 'Bhai',
    recipientName = 'Sister',
    language = 'en',
    punishments = [],
    interactions = {},
  } = packet;

  const isHinglish = language === 'hinglish';

  const {
    couponsRedeemed = [],
    punishmentAccepted = '',
    reactionMessage = '',
    completedAt,
  } = interactions;

  // Fallback punishment if not explicitly set
  const finalPunishment = punishmentAccepted || punishments[0] || (isHinglish ? 'Khana aur snacks khilao 🍕' : 'Treat me to a lavish meal 🍕');

  const txnDate = completedAt
    ? new Date(completedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
    : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

  const txnTime = completedAt
    ? new Date(completedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const receiptId = `SV-${(packet.packetId || '2026').slice(0, 8).toUpperCase()}`;

  const handleShareReceipt = async () => {
    const shareUrl = window.location.href;
    const shareText = isHinglish
      ? `Dekho ${recipientName} ka official reaction receipt Sibling Vault par! 🧾❤️ ${shareUrl}`
      : `Check out ${recipientName}'s official reaction receipt on Sibling Vault! 🧾❤️ ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Sibling Vault Receipt - ${recipientName}`,
          text: shareText,
          url: shareUrl,
        });
        showSuccess(isHinglish ? 'Receipt share ho gaya! 🚀' : 'Receipt shared successfully! 🚀');
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Share error:', err);
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      showSuccess(isHinglish ? '📋 Link copied! Sender ko WhatsApp par send karein!' : '📋 Link copied! Send it back to the sender on WhatsApp!');
    } catch {
      showError('Could not copy link.');
    }
  };

  const handleEmailSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showError('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    showSuccess('🎉 You are on the VIP list for the Diwali Vault!');
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 py-10 px-4 sm:px-6 flex flex-col items-center justify-center font-mono select-none">

      {/* Floating Header */}
      <div className="text-center mb-6 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 bg-primary/15 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider font-body border border-primary/20 shadow-sm">
          <span>💖</span>
          <span>{isHinglish ? 'Official Emotional Checkout Record' : 'Official Emotional Checkout Record'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-stone-800 dark:text-stone-100">
          {isHinglish ? 'Sibling Response Tracker 🧾' : 'Sibling Response Tracker 🧾'}
        </h1>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* THE PHYSICAL CHECKOUT RECEIPT (Tailwind Torn Paper / Monospace)    */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-stone-50 text-stone-900 shadow-[0_25px_60px_rgba(0,0,0,0.2)] border-x border-stone-300 p-6 sm:p-8"
      >
        {/* Top Torn / Sawtooth Edge SVG */}
        <div
          className="absolute -top-3 left-0 right-0 h-3 w-full bg-repeat-x bg-contain pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 10' fill='%23fafaf9'%3E%3Cpolygon points='0,10 10,0 20,10'/%3E%3C/svg%3E")`,
            backgroundSize: '16px 12px',
          }}
        />

        {/* ── Receipt Header ── */}
        <div className="text-center space-y-1 pb-4 border-b-2 border-dashed border-stone-300">
          <div className="text-3xl mb-1 animate-pulse">🎁</div>
          <p className="text-base sm:text-lg font-black tracking-widest uppercase font-mono text-stone-950">
            SIBLING VAULT
          </p>
          <p className="text-[11px] text-stone-600 tracking-wider font-semibold">
            TRANSACTION RECORD &amp; FEEDBACK RECEIPT
          </p>
          <p className="text-xs font-extrabold text-primary tracking-widest pt-1">
            RECEIPT #: {receiptId}
          </p>
        </div>

        {/* ── Metadata Info ── */}
        <div className="py-3 text-xs space-y-1 border-b border-dashed border-stone-300 text-stone-700">
          <div className="flex justify-between">
            <span>DATE: {txnDate}</span>
            <span>TIME: {txnTime}</span>
          </div>
          <div className="flex justify-between">
            <span>TERMINAL: SISTER-PORTAL</span>
            <span className="font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">STATUS: VERIFIED ✓</span>
          </div>
          <div className="flex justify-between pt-1">
            <span>SENDER (BHAI):</span>
            <span className="font-extrabold text-stone-950">{senderName}</span>
          </div>
          <div className="flex justify-between">
            <span>RECIPIENT (SISTER):</span>
            <span className="font-extrabold text-stone-950">{recipientName}</span>
          </div>
        </div>

        {/* ── Table Header ── */}
        <div className="py-2 text-[11px] font-black border-b-2 border-stone-800 flex justify-between uppercase tracking-wider text-stone-900">
          <span>QTY &amp; TRANSACTION ITEM</span>
          <span>ACTION STATUS</span>
        </div>

        {/* ── Line Items (Transactions) ── */}
        <div className="py-3.5 space-y-3 text-xs text-stone-800">
          {/* 1. Sibling Memory */}
          <div className="flex justify-between items-start gap-2">
            <span className="font-bold text-stone-900">1x Sibling Memory Vault</span>
            <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px] shadow-sm">
              UNLOCKED 📸
            </span>
          </div>

          {/* 2. Punishment Accepted (Always Prominent) */}
          <div className="flex justify-between items-start gap-2 bg-amber-100/80 p-2 rounded-xl border border-amber-300 shadow-sm">
            <div>
              <span className="font-black text-amber-950">1x Punishment Wheel Dare</span>
              <p className="text-[11px] text-amber-900 font-medium italic mt-0.5 leading-snug">
                "{finalPunishment}"
              </p>
            </div>
            <span className="font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded text-[10px] whitespace-nowrap shadow-sm">
              ACCEPTED 🎰
            </span>
          </div>

          {/* 3. Redeemed Coupons */}
          {couponsRedeemed.length > 0 ? (
            couponsRedeemed.map((couponTitle, idx) => (
              <div key={idx} className="flex justify-between items-start gap-2 bg-rose-50/80 p-1.5 rounded-lg border border-rose-200">
                <span className="font-bold text-rose-950 truncate max-w-[200px]">
                  1x {couponTitle}
                </span>
                <span className="font-black text-rose-800 bg-rose-200 px-1.5 py-0.5 rounded text-[10px] shadow-sm">
                  CLAIMED 🎟️
                </span>
              </div>
            ))
          ) : (
            <div className="flex justify-between items-start gap-2 bg-stone-100 p-1.5 rounded">
              <span className="font-semibold text-stone-700">1x Sibling Coupon Pass</span>
              <span className="font-bold text-stone-600 bg-stone-200 px-1.5 py-0.5 rounded text-[10px]">
                ALL RESERVED 🎟️
              </span>
            </div>
          )}

          {/* 4. Rakhi Surprise Gift Status */}
          <div className="flex justify-between items-start gap-2">
            <span className="font-bold text-stone-900">1x Rakhi Special Gift</span>
            <span className="font-black text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded text-[10px] shadow-sm">
              SURPRISE ORDERED 🎁
            </span>
          </div>
        </div>

        {/* ── Subtotal & Total Due ── */}
        <div className="pt-3 border-t-2 border-dashed border-stone-300 text-xs space-y-1.5">
          <div className="flex justify-between text-stone-600">
            <span>SUBTOTAL:</span>
            <span>100% PURE BOND</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>SIBLING FIGHT TAX:</span>
            <span>-100% WAIVED</span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t-2 border-stone-900 text-sm font-black text-stone-950">
            <span>TOTAL DUE:</span>
            <span className="text-primary font-extrabold text-base">
              INFINITE LOVE ❤️
            </span>
          </div>
          <div className="flex justify-between text-[10px] text-stone-500 pt-0.5">
            <span>PAYMENT METHOD:</span>
            <span>HUGS, MEMORIES &amp; SMILES</span>
          </div>
        </div>

        {/* ── Sister's Custom Reaction Note ── */}
        {reactionMessage && (
          <div className="mt-5 bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-4 text-center space-y-1.5 shadow-sm">
            <p className="text-[10px] font-black text-amber-950 uppercase tracking-widest">
              💌 SISTER'S PERSONAL REACTION MESSAGE
            </p>
            <p className="font-serif italic text-sm text-stone-900 font-bold leading-relaxed">
              "{reactionMessage}"
            </p>
            <p className="text-[11px] font-extrabold text-stone-700 pt-0.5">
              — With Love, {recipientName} 💖
            </p>
          </div>
        )}

        {/* ── Barcode & Slogan ── */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-stone-300 text-center space-y-2">
          {/* Visual Barcode */}
          <div className="flex justify-center items-center gap-1 h-10 overflow-hidden opacity-80 select-none">
            {[4, 2, 6, 1, 8, 3, 2, 5, 2, 7, 3, 1, 9, 4, 2, 6, 3, 5, 2, 8, 4, 2, 6, 1, 7, 3].map((h, i) => (
              <div
                key={i}
                className="bg-stone-900 w-1"
                style={{ height: `${h * 4 + 10}px` }}
              />
            ))}
          </div>
          <p className="text-[10px] font-extrabold tracking-widest text-stone-600 uppercase">
            * THANK YOU FOR BEING THE BEST SIBLING *
          </p>
        </div>

        {/* Bottom Torn / Sawtooth Edge SVG */}
        <div
          className="absolute -bottom-3 left-0 right-0 h-3 w-full bg-repeat-x bg-contain pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 10' fill='%23fafaf9'%3E%3Cpolygon points='0,0 10,10 20,0'/%3E%3C/svg%3E")`,
            backgroundSize: '16px 12px',
          }}
        />
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* PROMINENT HIGH-CONTRAST ACTION BUTTONS                             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="mt-8 flex flex-col gap-4 max-w-md w-full font-body">
        {/* Primary Action Button: "Send Response Back to Sender" */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleShareReceipt}
          className="w-full bg-[#c0392b] hover:bg-[#a93224] active:bg-[#922b21] text-white font-body font-extrabold text-body-md py-4 px-8 rounded-full shadow-[0_12px_28px_rgba(192,57,43,0.5)] border-2 border-white/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer text-center"
        >
          <span className="text-2xl">🚀</span>
          <span className="tracking-wide font-black text-base sm:text-lg">
            {isHinglish ? 'Responses Wapas Sender Ko Bhejen' : 'Send Response Back to Sender'}
          </span>
        </motion.button>

        {/* Secondary Action Button: "Create New Vault for Someone" */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/studio')}
          className="w-full bg-stone-50 hover:bg-white text-stone-900 border-2 border-stone-300 hover:border-primary font-body font-black text-body-md py-4 px-6 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
        >
          <span className="text-xl">✨</span>
          <span className="tracking-wide text-sm sm:text-base">
            {isHinglish ? 'Naya Page Banao Apne Bhai/Bahen Ke Liye ✨' : 'Create New Vault for Someone ✨'}
          </span>
        </motion.button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* PHASE 4: THE FUTURE HOOK — HIGH-CONTRAST FESTIVAL CARD (100% CLEAR)*/}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-14 w-full max-w-md bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white p-7 sm:p-9 rounded-4xl border-2 border-amber-400/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center space-y-4 font-body relative overflow-hidden"
      >
        {/* Decorative corner glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg animate-bounce border border-amber-300/40">
          🪔
        </div>

        <div className="space-y-2 relative z-10">
          <h3 className="font-display text-2xl sm:text-3xl font-black text-amber-300 tracking-tight drop-shadow-sm">
            Don’t miss the next festival! 🪔
          </h3>
          <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-xs mx-auto font-medium">
            Sign up to get early VIP access when the <strong className="text-amber-200">Diwali &amp; New Year Vault</strong> drops.
          </p>
        </div>

        <div className="relative z-10 pt-1">
          <AnimatePresence>
            {!subscribed ? (
              <form onSubmit={handleEmailSubscribe} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address…"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white text-stone-900 font-body font-semibold placeholder:text-stone-400 border-2 border-amber-400/60 focus:border-amber-400 rounded-2xl px-4 py-3 text-sm focus:outline-none shadow-inner"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer border border-amber-300/50"
                  >
                    Notify Me ✨
                  </button>
                </div>
                <p className="text-[11px] text-stone-300 font-medium">
                  🔒 Zero spam. Only festival drops &amp; exclusive surprises.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-950/80 border-2 border-emerald-400 p-4 rounded-2xl text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <span className="text-xl">🎉</span>
                <span>You're on the VIP list! We will notify you for Diwali.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default EmotionalReceipt;
