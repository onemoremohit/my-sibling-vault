import { v4 as uuidv4 } from 'uuid';
import Packet from '../models/Packet.js';
import generateLink from '../utils/generateLink.js';

// ─── POST /api/packets ─────────────────────────────────────────────────────
export const createPacket = async (req, res, next) => {
  try {
    const {
      senderName,
      recipientName,
      language,
      theme,
      modules,
      timeline,
      wishlist,
      punishments,
      coupons,
      certificates,
    } = req.body;

    if (!senderName || !recipientName) {
      return res.status(400).json({ error: 'senderName and recipientName are required.' });
    }

    const packetId = uuidv4();

    const packet = await Packet.create({
      packetId,
      senderName,
      recipientName,
      language: language || 'en',
      theme: theme || 'nostalgic',
      modules: modules || ['timeline', 'wheel', 'coupons', 'wishlist'],
      timeline:     timeline     || [],
      wishlist:     wishlist     || [],
      punishments:  punishments  || [],
      coupons:      coupons      || [],
      certificates: certificates || [],
    });

    const shareUrl = generateLink(packetId);

    res.status(201).json({ packetId, shareUrl, packet });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/packets/:packetId ────────────────────────────────────────────
export const getPacket = async (req, res, next) => {
  try {
    const { packetId } = req.params;
    const packet = await Packet.findOne({ packetId });

    if (!packet) {
      return res.status(404).json({ error: `Packet "${packetId}" not found.` });
    }

    res.json(packet);
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/packets/:packetId/redeem-coupon ────────────────────────────
export const redeemCoupon = async (req, res, next) => {
  try {
    const { packetId } = req.params;
    const { couponId } = req.body;

    if (!couponId) {
      return res.status(400).json({ error: 'couponId is required in request body.' });
    }

    const packet = await Packet.findOne({ packetId });
    if (!packet) {
      return res.status(404).json({ error: `Packet "${packetId}" not found.` });
    }

    const coupon = packet.coupons.id(couponId);
    if (!coupon) {
      return res.status(404).json({ error: `Coupon "${couponId}" not found.` });
    }

    coupon.redeemed = true;
    await packet.save();

    res.json({ success: true, coupon });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/packets/:packetId/pledge-item ──────────────────────────────
export const pledgeWishlistItem = async (req, res, next) => {
  try {
    const { packetId } = req.params;
    const { itemId } = req.body;

    const packet = await Packet.findOne({ packetId });
    if (!packet) return res.status(404).json({ error: 'Packet not found.' });

    const item = packet.wishlist.id(itemId);
    if (!item) return res.status(404).json({ error: 'Wishlist item not found.' });

    item.status = 'pledged';
    await packet.save();

    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/packets/upload (Multer handles file) ───────────────────────
export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const mediaUrl = `/uploads/${req.file.filename}`;
    res.json({ mediaUrl, filename: req.file.filename });
  } catch (err) {
    next(err);
  }
};
