import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Packet API ────────────────────────────────────────────────────────────────

/** Save a completed packet to the database. Returns { packetId, shareUrl, packet } */
export const createPacket = (payload) => api.post('/packets', payload);

/** Fetch packet data by its UUID for the Recipient View. */
export const getPacket = (packetId) => api.get(`/packets/${packetId}`);

/** Mark a coupon as redeemed. */
export const redeemCoupon = (packetId, couponId) =>
  api.patch(`/packets/${packetId}/redeem-coupon`, { couponId });

/** Mark a wishlist item as pledged. */
export const pledgeWishlistItem = (packetId, itemId) =>
  api.patch(`/packets/${packetId}/pledge-item`, { itemId });

/** Upload a photo or video file. Returns { mediaUrl }. */
export const uploadMedia = (formData) =>
  api.post('/packets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default api;
