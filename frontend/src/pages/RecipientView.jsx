import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Loader from '../components/common/Loader';
import MemoryTimeline from '../components/recipient/MemoryTimeline';
import WishlistDisplay from '../components/recipient/WishlistDisplay';
import SpinWheel from '../components/recipient/SpinWheel';
import CouponCard from '../components/recipient/CouponCard';
import CertificateCard from '../components/recipient/CertificateCard';
import { getPacket } from '../services/api';
import { showError } from '../components/common/Toast';

// Fallback demo data if user visits /vault/demo
const DEMO_PACKET = {
  packetId: 'demo',
  senderName: 'Alex',
  recipientName: 'Sarah',
  theme: 'nostalgic',
  modules: ['timeline', 'wishlist', 'wheel', 'coupons'],
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
    'Buy dinner for 3 days',
    'Do my chores for a week',
    'One free apology pass',
    'Pick the movie next time',
    'No roasting for 24 hours',
  ],
  coupons: [
    { id: 'c1', title: 'Free Hug Pass', terms: 'Valid anytime. No questions asked.', redeemed: false },
    { id: 'c2', title: 'Zero Arguments Pass', terms: 'I will not argue with you for 24h.', redeemed: false },
  ],
  certificates: [
    { id: 'cert1', awardTitle: 'Official Maggi Thief', description: 'For stealing Maggi at 2 AM without permission.' },
  ],
};

const RecipientView = () => {
  const { packetId } = useParams();
  const navigate = useNavigate();
  const [packet, setPacket] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setPacket(data);
      } catch (err) {
        showError('Could not load memory vault.');
        setPacket(DEMO_PACKET); // Fallback to demo
      } finally {
        setLoading(false);
      }
    };

    fetchVault();
  }, [packetId]);

  if (loading) return <Loader message="Unlocking your Memory Vault…" />;

  const modules = packet?.modules || ['timeline', 'wishlist', 'wheel', 'coupons'];

  return (
    <div className="min-h-screen bg-surface paper-texture flex flex-col">
      <Navbar mode="recipient" />

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
          A Gift For You
        </div>

        <h1 className="font-display text-display-lg text-primary">
          {packet.recipientName}'s Memory Vault 💌
        </h1>

        <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Crafted with love by <strong>{packet.senderName}</strong>. Scroll down to open your memories, spin the punishment wheel, and redeem your coupons!
        </p>
      </header>

      {/* Main Experience Body */}
      <main className="flex-1 max-w-container w-full mx-auto px-gutter pb-24 space-y-20">
        {/* Module 1: Memory Timeline */}
        {modules.includes('timeline') && (
          <MemoryTimeline items={packet.timeline} />
        )}

        {/* Module 2: Punishment Wheel */}
        {modules.includes('wheel') && (
          <SpinWheel punishments={packet.punishments} />
        )}

        {/* Module 3: Wishlist */}
        {modules.includes('wishlist') && (
          <WishlistDisplay packetId={packetId} items={packet.wishlist} />
        )}

        {/* Module 4: Coupons & Certificates */}
        {modules.includes('coupons') && (
          <section className="space-y-12">
            {/* Coupons Grid */}
            {packet.coupons?.length > 0 && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="font-display text-headline-md text-primary">Favor Coupons 🎟️</h2>
                  <p className="font-body text-body-md text-on-surface-variant">Tap to redeem your sibling favors!</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {packet.coupons.map((c) => (
                    <CouponCard key={c.id || c._id} packetId={packetId} coupon={c} />
                  ))}
                </div>
              </div>
            )}

            {/* Certificates Grid */}
            {packet.certificates?.length > 0 && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="font-display text-headline-md text-primary">Official Awards 🏆</h2>
                  <p className="font-body text-body-md text-on-surface-variant">Honorary certificates awarded to you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {packet.certificates.map((cert) => (
                    <CertificateCard
                      key={cert.id || cert._id}
                      recipientName={packet.recipientName}
                      certificate={cert}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-outline-variant px-gutter py-8 text-center bg-surface-container-low">
        <div className="max-w-container mx-auto space-y-2">
          <p className="font-display text-headline-md text-on-surface">Kinship &amp; Keepsake</p>
          <p className="font-body text-caption text-on-surface-variant">
            Built for {packet.recipientName} by {packet.senderName} ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RecipientView;
