import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// ── Initial State ────────────────────────────────────────────────────────────
const initialPacket = {
  senderName:    '',
  recipientName: '',
  theme:         'nostalgic',
  modules:       ['timeline', 'wishlist', 'wheel', 'coupons'],
  timeline:      [],
  wishlist:      [],
  punishments:   [],
  coupons:       [],
  certificates:  [],
};

// ── Reducer ──────────────────────────────────────────────────────────────────
const packetReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_META':
      return { ...state, ...action.payload };

    case 'TOGGLE_MODULE': {
      const { module } = action.payload;
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

    // Wishlist
    case 'ADD_WISHLIST_ITEM':
      return { ...state, wishlist: [...state.wishlist, { id: uuidv4(), status: 'open', ...action.payload }] };
    case 'REMOVE_WISHLIST_ITEM':
      return { ...state, wishlist: state.wishlist.filter(w => w.id !== action.payload) };

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
  const toggleModule        = useCallback(module  => dispatch({ type: 'TOGGLE_MODULE', payload: { module } }), []);

  const addTimelineItem     = useCallback(item    => dispatch({ type: 'ADD_TIMELINE_ITEM', payload: item }), []);
  const removeTimelineItem  = useCallback(id      => dispatch({ type: 'REMOVE_TIMELINE_ITEM', payload: id }), []);
  const updateTimelineItem  = useCallback(item    => dispatch({ type: 'UPDATE_TIMELINE_ITEM', payload: item }), []);

  const addWishlistItem     = useCallback(item    => dispatch({ type: 'ADD_WISHLIST_ITEM', payload: item }), []);
  const removeWishlistItem  = useCallback(id      => dispatch({ type: 'REMOVE_WISHLIST_ITEM', payload: id }), []);

  const addPunishment       = useCallback(text    => dispatch({ type: 'ADD_PUNISHMENT', payload: text }), []);
  const removePunishment    = useCallback(index   => dispatch({ type: 'REMOVE_PUNISHMENT', payload: index }), []);

  const addCoupon           = useCallback(coupon  => dispatch({ type: 'ADD_COUPON', payload: coupon }), []);
  const removeCoupon        = useCallback(id      => dispatch({ type: 'REMOVE_COUPON', payload: id }), []);

  const addCertificate      = useCallback(cert    => dispatch({ type: 'ADD_CERTIFICATE', payload: cert }), []);
  const removeCertificate   = useCallback(id      => dispatch({ type: 'REMOVE_CERTIFICATE', payload: id }), []);

  const resetPacket         = useCallback(()      => dispatch({ type: 'RESET' }), []);

  return (
    <PacketContext.Provider value={{
      packet,
      updateMeta,
      toggleModule,
      addTimelineItem, removeTimelineItem, updateTimelineItem,
      addWishlistItem, removeWishlistItem,
      addPunishment, removePunishment,
      addCoupon, removeCoupon,
      addCertificate, removeCertificate,
      resetPacket,
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
