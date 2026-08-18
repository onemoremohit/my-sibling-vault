import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Loader from '../components/common/Loader';
import MemoryTimeline from '../components/recipient/MemoryTimeline';
import WishlistDisplay from '../components/recipient/WishlistDisplay';
import SpinWheel from '../components/recipient/SpinWheel';
import CouponCard from '../components/recipient/CouponCard';
import CertificateCard from '../components/recipient/CertificateCard';
import FunZoneDisplay from '../components/recipient/FunZoneDisplay';
import SisterCompletionCard from '../components/recipient/SisterCompletionCard';
import { getPacket } from '../services/api';
import { showError } from '../components/common/Toast';
import { t } from '../i18n/translations';

// Fallback demo data if user visits /vault/demo
const DEMO_PACKET = {
  packetId: 'demo',
  senderName: 'Alex',
  recipientName: 'Sarah',
  language: 'en',
  theme: 'nostalgic',
  giftOrdered: false,
  modules: ['timeline', 'wishlist', 'wheel', 'coupons', 'funZone'],
  timeline: [
    {
      id: 'demo-1',
      title: 'The Great Cookie Heist',
      date: 'July 1998',
      story: 'We snuck into the kitchen at midnight and ate the entire batch of chocolate chip cookies Mom baked for the guests.',
      secretNote: 'Honestly, I blamed you for breaking the jar, and Mom actually believed me! Sorry! 🍪',
      mediaUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop',
      mediaType: 'image',
    },
    {
      id: 'demo-2',
      title: 'Mario Kart Championship',
      date: 'Dec 2003',
      story: 'The infamous Rainbow Road showdown where you threw the controller into the couch cushion.',
      secretNote: 'I let you win the last lap because you were about to cry.',
      mediaUrl: '',
      mediaType: 'none',
    },
  ],
  wishlist: [
    { id: 'w1', item: 'AirPods Pro 2', category: 'tech', status: 'open' },
    { id: 'w2', item: 'Dark Chocolate Box', category: 'chocolates', status: 'open' },
    { id: 'w3', item: 'Concert Tickets', category: 'experiences', status: 'open' },
  ],
  punishments: [
    'Treat me to a lavish meal 🍕',
    'Take me out for a movie 🎬',
    'Do my laundry for a week 🧺',
    'Introduce me to your cute friend 🤝',
    'Take me on a fun trip / hangout 🚗',
    'Apologize to me for no reason right now 🤐',
  ],
  coupons: [
    { id: 'c1', title: 'Free Hug Pass', terms: 'Valid anytime. No questions asked.', redeemed: false },
    { id: 'c2', title: 'Zero Arguments Pass', terms: 'I will not argue with you for 24h.', redeemed: false },
  ],
  certificates: [
    { id: 'cert1', awardTitle: 'Official Maggi Thief', description: 'For stealing Maggi at 2 AM without permission.' },
  ],
  roasts: [
    { id: 'r1', text: 'Takes 2 hours to get ready for a 5-minute errand ⏰', trueVotes: 3, fakeVotes: 0 },
    { id: 'r2', text: 'Always steals my clothes and denies it even while wearing them 👕', trueVotes: 5, fakeVotes: 1 },
    { id: 'r3', text: 'Starts crying the exact second Mom enters the room 😭', trueVotes: 4, fakeVotes: 0 },
  ],
  secretChallenge: {
    question: "I dare you to let me draft your next WhatsApp status, and you can't delete it for 5 hours! 😂",
    challengeText: "I dare you to let me draft your next WhatsApp status, and you can't delete it for 5 hours! 😂",
  },
  siblingFavor: {
    requestText: 'Treat me to Momos & Boba Tea this weekend! 🥟🧋',
    priority: 'high',
    status: 'pending',
  },
  fines: [
    { id: 'f1', crimeTitle: 'Stealing clothes without asking 👕', amount: 500 },
    { id: 'f2', crimeTitle: 'Unanswered phone calls > 3 times 📱', amount: 200 },
    { id: 'f3', crimeTitle: 'Eating my ice cream from fridge 🍦', amount: 300 },
    { id: 'f4', crimeTitle: 'Bathroom occupancy > 45 minutes 🛁', amount: 400 },
  ],
};

const RecipientView = () => {
  const { packetId } = useParams();
  const navigate = useNavigate();
  const [packet, setPacket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeemedCoupons, setRedeemedCoupons] = useState([]);
  const [acceptedPunishment, setAcceptedPunishment] = useState('');

  useEffect(() => {
    const fetchVault = async () => {
      setLoading(true);
      if (packetId === 'demo') {
        setPacket(DEMO_PACKET);
        setLoading(false);
        return;
      }

      try {
        const { data } = await getPacket(packetId);
        if (data && data.packetId) {
          setPacket(data);
          // Preload any already redeemed coupons or interactions
          if (data.interactions?.couponsRedeemed?.length > 0) {
            setRedeemedCoupons(data.interactions.couponsRedeemed);
          }
          if (data.interactions?.punishmentAccepted) {
            setAcceptedPunishment(data.interactions.punishmentAccepted);
          }
        } else {
          setPacket(DEMO_PACKET);
        }
      } catch (err) {
        console.error('Fetch vault error:', err);
        showError('Could not load memory vault.');
        setPacket(DEMO_PACKET); // Fallback to demo
      } finally {
        setLoading(false);
      }
    };

    fetchVault();
  }, [packetId]);

  if (loading) return <Loader message="Unlocking your Memory Vault…" />;

  const lang = packet?.language || 'en';
  const modules = packet?.modules || ['timeline', 'wishlist', 'wheel', 'coupons', 'funZone'];

  const handleCouponRedeemed = (title) => {
    setRedeemedCoupons((prev) => (prev.includes(title) ? prev : [...prev, title]));
  };

  const handlePunishmentSelected = (punishment) => {
    setAcceptedPunishment(punishment);
  };

  return (
    <div className="min-h-screen bg-surface paper-texture flex flex-col">
      <Navbar mode="recipient" lang={lang} />

      {/* Floating Demo Banner if viewing demo */}
      {packetId === 'demo' && (
        <div className="bg-secondary text-on-secondary py-2 text-center font-body font-bold text-caption tracking-wider uppercase">
          🎉 Demo Mode Active — Want to build your own?{' '}
          <button onClick={() => navigate('/studio')} className="underline hover:text-secondary-fixed ml-2">
            Click here to create one
          </button>
        </div>
      )}

      {/* Hero Header */}
      <header className="relative pt-12 pb-16 px-gutter text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-block bg-primary-fixed text-on-primary-fixed px-4 py-1 rounded-full font-body font-bold text-caption uppercase tracking-wider shadow-sm">
          {t('recipientGiftBadge', lang)}
        </div>

        <h1 className="font-display text-display-lg text-primary">
          {packet.recipientName}{t('recipientHeroTitle', lang)}
        </h1>

        <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          {t('recipientHeroSubtitle', lang)} <strong>{packet.senderName}</strong>. {t('recipientHeroIntro', lang)}
        </p>
      </header>

      {/* Main Experience Body */}
      <main className="flex-1 max-w-container w-full mx-auto px-gutter pb-24 space-y-20">
        {/* Module 1: Memory Timeline (Only shown if photo/memory was added) */}
        {packet.timeline?.length > 0 && (
          <MemoryTimeline items={packet.timeline} lang={lang} />
        )}

        {/* Module 2: Punishment Wheel (Only shown if creator added punishments) */}
        {packet.punishments?.length > 0 && (
          <SpinWheel
            punishments={packet.punishments}
            onPunishmentAccepted={handlePunishmentSelected}
            lang={lang}
          />
        )}

        {/* Module 3: Gift Wishlist & Festive Message — Always shown */}
        <WishlistDisplay
          packetId={packetId}
          brotherMessage={packet.brotherMessage || ''}
          giftOrdered={packet.giftOrdered}
          orderedGiftName={packet.orderedGiftName || ''}
          orderedGiftNote={packet.orderedGiftNote || ''}
          orderedGiftImage={packet.orderedGiftImage || ''}
          senderName={packet.senderName || 'Sender'}
          recipientName={packet.recipientName || 'Recipient'}
          lang={lang}
        />

        {/* Module 4: Coupons & Certificates (Only shown if creator added coupons or awards) */}
        {((packet.coupons?.length > 0) || (packet.certificates?.length > 0)) && (
          <section className="space-y-12">
            {/* Coupons Grid */}
            {packet.coupons?.length > 0 && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="font-display text-headline-md text-primary">{t('couponsSectionHeader', lang)}</h2>
                  <p className="font-body text-body-md text-on-surface-variant">{t('couponsSectionSub', lang)}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packet.coupons.map((c) => (
                    <CouponCard
                      key={c.id || c._id}
                      packetId={packetId}
                      coupon={c}
                      onCouponRedeemed={handleCouponRedeemed}
                      lang={lang}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Certificates Grid */}
            {packet.certificates?.length > 0 && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="font-display text-headline-md text-primary">{t('certsSectionHeader', lang)}</h2>
                  <p className="font-body text-body-md text-on-surface-variant">{t('certsSectionSub', lang)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {packet.certificates.map((cert) => (
                    <CertificateCard
                      key={cert.id || cert._id}
                      recipientName={packet.recipientName}
                      certificate={cert}
                      lang={lang}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Module 5: Roast & Fun Zone (Automatically hides if no items were added) */}
        <FunZoneDisplay
          roasts={packet.roasts}
          secretChallenge={packet.secretChallenge}
          siblingFavor={packet.siblingFavor}
          fines={packet.fines}
          senderName={packet.senderName}
          recipientName={packet.recipientName}
          lang={lang}
        />

        {/* ── PHASE 2: Sister's Vault Completion & Reply Handoff ── */}
        <SisterCompletionCard
          packetId={packetId}
          senderName={packet.senderName}
          recipientName={packet.recipientName}
          redeemedCoupons={redeemedCoupons}
          acceptedPunishment={acceptedPunishment}
          lang={lang}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-outline-variant px-gutter py-8 text-center bg-surface-container-low">
        <div className="max-w-container mx-auto space-y-2">
          <p className="font-display text-headline-md text-on-surface">{t('footerBrand', lang)}</p>
          <p className="font-body text-caption text-on-surface-variant">
            {t('footerBuiltBy', lang)} {packet.recipientName} {t('footerWithLove', lang)} {packet.senderName}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RecipientView;
