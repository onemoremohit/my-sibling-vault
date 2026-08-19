import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Attach JWT token to requests if present in localStorage ──────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sibling_vault_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Auth API ──────────────────────────────────────────────────────────────────

/** Send Google credential token to backend for verification & JWT issuance */
export const googleLoginApi = (credential) =>
  api.post('/auth/google', { credential });

/** Fetch authenticated user profile */
export const getMeApi = () =>
  api.get('/auth/me');

// ── Packet API ────────────────────────────────────────────────────────────────

/** Save a completed packet to the database. Returns { packetId, shareUrl, packet } */
export const createPacket = (payload) => api.post('/packets', payload);

/** Fetch packet data by its UUID for the Recipient View. */
export const getPacket = (packetId) => api.get(`/packets/${packetId}`);

/** Fetch all vaults created by the authenticated user */
export const getMyVaults = () => api.get('/packets/user/my-vaults');

/** Mark a coupon as redeemed. */
export const redeemCoupon = (packetId, couponId) =>
  api.patch(`/packets/${packetId}/redeem-coupon`, { couponId });

/** Complete vault interactions & reactions from recipient. */
export const completePacket = (packetId, interactionData) =>
  api.put(`/packets/${packetId}/complete`, interactionData);

/** Upload a photo or memory media. Returns { mediaUrl }. */
export const uploadMedia = (formData) =>
  api.post('/packets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export default api;
