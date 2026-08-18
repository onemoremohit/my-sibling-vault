import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translations, t as translate } from '../i18n/translations';

// ── Initial State ────────────────────────────────────────────────────────────
const initialPacket = {
  senderName:    '',
  recipientName: '',
  language:      'en', // 'en' | 'hinglish'
  theme:         'nostalgic',
  modules:       ['timeline', 'wishlist', 'wheel', 'coupons', 'funZone'],
  timeline:      [],
  wishlist:      [],
  brotherMessage: '',
  giftOrdered:    false,
  orderedGiftName: '',
  orderedGiftNote: '',
  orderedGiftImage: '',
  punishments:   [],
  coupons:       [],
  certificates:  [],
  roasts:        [
    { id: 'r1', text: 'Takes 2 hours to get ready for a 5-minute errand ⏰', trueVotes: 0, fakeVotes: 0 },
  ],
  secretChallenge: {
    question: 'Guess what I broke in 2019 without telling Mom!',
    options: ['Mom\'s favourite vase', 'Your laptop charger', 'Dad\'s car key', 'The living room lamp'],
    correctIndex: 1,
    hint: 'It involved wires and your bedroom...',
    revealMsg: 'Yes! I broke your laptop charger and blamed the dog! 🐶',
  },
  siblingFavor: {
    requestText: 'Treat me to Momos & Boba Tea this weekend! 🥟🧋',
    priority: 'high',
    status: 'pending',
  },
  fines: [
    { id: 'f1', crimeTitle: 'Stealing clothes without asking 👕', amount: 500 },
    { id: 'f2', crimeTitle: 'Eating my ice cream / treats from fridge 🍦', amount: 300 },
  ],
};

// ── Reducer ──────────────────────────────────────────────────────────────────
const packetReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_META':
      return { ...state, ...action.payload };

    case 'SET_LANGUAGE': {
      const newLang = action.payload;
      const isSwitchingToHinglish = newLang === 'hinglish';

      // Update default roast text if matching
      const roasts = state.roasts.map(r => {
        if (r.id === 'r1') {
          return {
            ...r,
            text: isSwitchingToHinglish
              ? '5 min ke kaam ke liye 2 ghante taiyar hone me lagati hai ⏰'
              : 'Takes 2 hours to get ready for a 5-minute errand ⏰',
          };
        }
        return r;
      });

      // Update default fines text if matching
      const fines = state.fines.map(f => {
        if (f.id === 'f1') {
          return {
            ...f,
            crimeTitle: isSwitchingToHinglish ? 'Bina puche kapde churana 👕' : 'Stealing clothes without asking 👕',
          };
        }
        if (f.id === 'f2') {
          return {
            ...f,
            crimeTitle: isSwitchingToHinglish ? 'Fridge se meri Maggi/Ice cream khana 🍦' : 'Eating my ice cream / treats from fridge 🍦',
          };
        }
        return f;
      });

      return { ...state, language: newLang, roasts, fines };
    }

    case 'TOGGLE_MODULE': {
      const { module } = action.payload;
      const MANDATORY = ['wishlist'];
      if (MANDATORY.includes(module)) return state; // Cannot toggle mandatory modules
      const modules = state.modules.includes(module)
        ? state.modules.filter(m => m !== module)
        : [...state.modules, module];
      return { ...state, modules };
    }

    // Timeline
    case 'ADD_TIMELINE_ITEM':
      return { ...state, timeline: [...state.timeline, { id: uuidv4(), ...action.payload }] };
    case 'REMOVE_TIMELINE_ITEM':
      return { ...state, timeline: state.timeline.filter(t => t.id !== action.payload) };
    case 'UPDATE_TIMELINE_ITEM':
      return {
        ...state,
        timeline: state.timeline.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };

    // Wishlist & Gift Status
    case 'ADD_WISHLIST_ITEM':
      return { ...state, wishlist: [...state.wishlist, { id: uuidv4(), status: 'open', ...action.payload }] };
    case 'REMOVE_WISHLIST_ITEM':
      return { ...state, wishlist: state.wishlist.filter(w => w.id !== action.payload) };
    case 'UPDATE_BROTHER_MESSAGE':
      return { ...state, brotherMessage: action.payload };
    case 'SET_GIFT_ORDERED':
      return { ...state, giftOrdered: action.payload };
    case 'UPDATE_ORDERED_GIFT':
      return {
        ...state,
        giftOrdered: true,
        orderedGiftName: action.payload.name || state.orderedGiftName,
        orderedGiftNote: action.payload.note !== undefined ? action.payload.note : state.orderedGiftNote,
        orderedGiftImage: action.payload.image || state.orderedGiftImage,
      };

    // Punishments
    case 'ADD_PUNISHMENT':
      return { ...state, punishments: [...state.punishments, action.payload] };
    case 'REMOVE_PUNISHMENT':
      return { ...state, punishments: state.punishments.filter((_, i) => i !== action.payload) };

    // Coupons
    case 'ADD_COUPON':
      return { ...state, coupons: [...state.coupons, { id: uuidv4(), redeemed: false, ...action.payload }] };
    case 'REMOVE_COUPON':
      return { ...state, coupons: state.coupons.filter(c => c.id !== action.payload) };

    // Certificates
    case 'ADD_CERTIFICATE':
      return { ...state, certificates: [...state.certificates, { id: uuidv4(), ...action.payload }] };
    case 'REMOVE_CERTIFICATE':
      return { ...state, certificates: state.certificates.filter(c => c.id !== action.payload) };

    // Roasts
    case 'ADD_ROAST':
      return { ...state, roasts: [...state.roasts, { id: uuidv4(), text: action.payload, trueVotes: 0, fakeVotes: 0 }] };
    case 'REMOVE_ROAST':
      return { ...state, roasts: state.roasts.filter(r => r.id !== action.payload) };

    // Secret Challenge
    case 'UPDATE_SECRET_CHALLENGE':
      return { ...state, secretChallenge: { ...state.secretChallenge, ...action.payload } };

    // Sibling Favor
    case 'UPDATE_SIBLING_FAVOR':
      return { ...state, siblingFavor: { ...state.siblingFavor, ...action.payload } };

    // Fines
    case 'ADD_FINE':
      return { ...state, fines: [...state.fines, { id: uuidv4(), ...action.payload }] };
    case 'REMOVE_FINE':
      return { ...state, fines: state.fines.filter(f => f.id !== action.payload) };

    case 'RESET':
      return initialPacket;

    default:
      return state;
  }
};

// ── Context ───────────────────────────────────────────────────────────────────
const PacketContext = createContext(null);

export const PacketProvider = ({ children }) => {
  const [packet, dispatch] = useReducer(packetReducer, initialPacket);

  const updateMeta          = useCallback(payload => dispatch({ type: 'UPDATE_META', payload }), []);
  const setLanguage         = useCallback(lang    => dispatch({ type: 'SET_LANGUAGE', payload: lang }), []);
  const toggleModule        = useCallback(module  => dispatch({ type: 'TOGGLE_MODULE', payload: { module } }), []);

  const addTimelineItem     = useCallback(item    => dispatch({ type: 'ADD_TIMELINE_ITEM', payload: item }), []);
  const removeTimelineItem  = useCallback(id      => dispatch({ type: 'REMOVE_TIMELINE_ITEM', payload: id }), []);
  const updateTimelineItem  = useCallback(item    => dispatch({ type: 'UPDATE_TIMELINE_ITEM', payload: item }), []);

  const addWishlistItem       = useCallback(item => dispatch({ type: 'ADD_WISHLIST_ITEM', payload: item }), []);
  const removeWishlistItem    = useCallback(id   => dispatch({ type: 'REMOVE_WISHLIST_ITEM', payload: id }), []);
  const updateBrotherMessage  = useCallback(msg  => dispatch({ type: 'UPDATE_BROTHER_MESSAGE', payload: msg }), []);
  const updateGiftOrdered     = useCallback(bool => dispatch({ type: 'SET_GIFT_ORDERED', payload: bool }), []);
  const updateOrderedGift     = useCallback(gift => dispatch({ type: 'UPDATE_ORDERED_GIFT', payload: gift }), []);

  const addPunishment       = useCallback(text    => dispatch({ type: 'ADD_PUNISHMENT', payload: text }), []);
  const removePunishment    = useCallback(index   => dispatch({ type: 'REMOVE_PUNISHMENT', payload: index }), []);

  const addCoupon           = useCallback(coupon  => dispatch({ type: 'ADD_COUPON', payload: coupon }), []);
  const removeCoupon        = useCallback(id      => dispatch({ type: 'REMOVE_COUPON', payload: id }), []);

  const addCertificate      = useCallback(cert    => dispatch({ type: 'ADD_CERTIFICATE', payload: cert }), []);
  const removeCertificate   = useCallback(id      => dispatch({ type: 'REMOVE_CERTIFICATE', payload: id }), []);

  const addRoast            = useCallback(text    => dispatch({ type: 'ADD_ROAST', payload: text }), []);
  const removeRoast         = useCallback(id      => dispatch({ type: 'REMOVE_ROAST', payload: id }), []);

  const updateSecretChallenge = useCallback(payload => dispatch({ type: 'UPDATE_SECRET_CHALLENGE', payload }), []);
  const updateSiblingFavor    = useCallback(payload => dispatch({ type: 'UPDATE_SIBLING_FAVOR', payload }), []);

  const addFine             = useCallback(fine    => dispatch({ type: 'ADD_FINE', payload: fine }), []);
  const removeFine          = useCallback(id      => dispatch({ type: 'REMOVE_FINE', payload: id }), []);

  const resetPacket         = useCallback(()      => dispatch({ type: 'RESET' }), []);

  const t = useCallback((key) => translate(key, packet.language), [packet.language]);

  return (
    <PacketContext.Provider value={{
      packet,
      updateMeta,
      setLanguage,
      toggleModule,
      addTimelineItem, removeTimelineItem, updateTimelineItem,
      addWishlistItem, removeWishlistItem, updateBrotherMessage,
      updateGiftOrdered, updateOrderedGift,
      addPunishment, removePunishment,
      addCoupon, removeCoupon,
      addCertificate, removeCertificate,
      addRoast, removeRoast,
      updateSecretChallenge,
      updateSiblingFavor,
      addFine, removeFine,
      resetPacket,
      t,
    }}>
      {children}
    </PacketContext.Provider>
  );
};

export const usePacketContext = () => {
  const ctx = useContext(PacketContext);
  if (!ctx) throw new Error('usePacketContext must be used within <PacketProvider>');
  return ctx;
};

export default PacketContext;
