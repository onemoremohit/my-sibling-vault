import mongoose from 'mongoose';
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
      brotherMessage,
      giftOrdered,
      orderedGiftName,
      orderedGiftNote,
      orderedGiftImage,
      wishlist,
      punishments,
      coupons,
      certificates,
      roasts,
      secretChallenge,
      siblingFavor,
      fines,
    } = req.body;

    if (!senderName || !recipientName) {
      return res.status(400).json({ error: 'senderName and recipientName are required.' });
    }

    const packetId = uuidv4();
    const creator = req.user ? req.user.id : null;
    const creatorEmail = req.user ? req.user.email : null;

    const packet = await Packet.create({
      packetId,
      creator,
      creatorEmail,
      senderName,
      recipientName,
      language: language || 'en',
      theme: theme || 'nostalgic',
      modules: modules || ['timeline', 'wheel', 'coupons', 'wishlist', 'funZone'],
      timeline:        timeline        || [],
      brotherMessage:  brotherMessage  || '',
      giftOrdered:     giftOrdered     ?? false,
      orderedGiftName: orderedGiftName || '',
      orderedGiftNote: orderedGiftNote || '',
      orderedGiftImage:orderedGiftImage|| '',
      wishlist:        wishlist        || [],
      punishments:     punishments     || [],
      coupons:         coupons         || [],
      certificates:    certificates    || [],
      roasts:          roasts          || [],
      secretChallenge: secretChallenge || {},
      siblingFavor:    siblingFavor    || {},
      fines:           fines           || [],
    });

    const shareUrl = generateLink(packetId);

    res.status(201).json({ packetId, shareUrl, packet });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/packets/user/my-vaults ──────────────────────────────────────────
export const getUserVaults = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!userId && !userEmail) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const query = {
      $or: [
        ...(userId ? [{ creator: userId }] : []),
        ...(userEmail ? [{ creatorEmail: userEmail.toLowerCase() }] : []),
      ],
    };

    const vaults = await Packet.find(query)
      .sort({ createdAt: -1 })
      .select('packetId senderName recipientName theme language createdAt interactions timeline giftOrdered orderedGiftName brotherMessage');

    res.json({
      vaults: vaults.map((v) => ({
        packetId: v.packetId,
        senderName: v.senderName,
        recipientName: v.recipientName,
        theme: v.theme,
        language: v.language,
        createdAt: v.createdAt,
        interactions: v.interactions,
        hasPhoto: v.timeline?.length > 0,
        giftOrdered: v.giftOrdered,
        orderedGiftName: v.orderedGiftName,
      })),
    });
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

    item.status = item.status === 'pledged' ? 'open' : 'pledged';
    await packet.save();

    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/packets/:id/complete ──────────────────────────────────────────
export const completePacket = async (req, res, next) => {
  try {
    const { packetId, id } = req.params;
    const targetId = packetId || id;
    const {
      couponsRedeemed,
      punishmentAccepted,
      challengeAccepted,
      favorAccepted,
      finesSettled,
      reactionMessage,
    } = req.body;

    const packet = await Packet.findOne({
      $or: [
        { packetId: targetId },
        { _id: mongoose.isValidObjectId(targetId) ? targetId : null },
      ],
    });

    if (!packet) {
      return res.status(404).json({ error: `Packet "${targetId}" not found.` });
    }

    packet.interactions = {
      status: 'completed',
      couponsRedeemed: Array.isArray(couponsRedeemed)
        ? couponsRedeemed
        : (packet.interactions?.couponsRedeemed || []),
      punishmentAccepted: punishmentAccepted !== undefined
        ? punishmentAccepted
        : (packet.interactions?.punishmentAccepted || ''),
      challengeAccepted: challengeAccepted !== undefined
        ? challengeAccepted
        : (packet.interactions?.challengeAccepted || ''),
      favorAccepted: favorAccepted !== undefined
        ? favorAccepted
        : (packet.interactions?.favorAccepted || ''),
      finesSettled: finesSettled !== undefined
        ? Boolean(finesSettled)
        : (packet.interactions?.finesSettled || false),
      reactionMessage: reactionMessage !== undefined
        ? reactionMessage
        : (packet.interactions?.reactionMessage || ''),
      completedAt: new Date(),
    };

    await packet.save();

    res.json({
      success: true,
      message: 'Vault interactions completed successfully!',
      packet,
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/packets/upload (Multer handles files) ───────────────────────
export const uploadMedia = async (req, res, next) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    // Import the B2 base URL dynamically (set in packetRoutes.js)
    let b2Base = '';
    try {
      const { b2PublicBaseUrl } = await import('../routes/packetRoutes.js');
      b2Base = b2PublicBaseUrl || '';
    } catch { /* ignore */ }

    const mediaUrls = files.map(f => {
      // 1. If multer-s3 set location (full URL), use it
      if (f.location) return f.location;
      // 2. If we have a key (B2 S3), build the public URL
      if (f.key && b2Base) return `${b2Base}/${f.key}`;
      // 3. Fallback to local uploads path
      return `/uploads/${f.filename}`;
    });

    // Debug log
    files.forEach((f, i) => {
      console.log(`📁 File[${i}]: location=${f.location}, key=${f.key}, built=${mediaUrls[i]}`);
    });

    const isVideo = files.some(f => f.mimetype.startsWith('video'));
    const mediaType = isVideo ? 'video' : (mediaUrls.length > 1 ? 'images' : 'image');

    res.json({
      mediaUrls,
      mediaUrl: mediaUrls[0],
      mediaType,
      count: mediaUrls.length,
    });
  } catch (err) {
    next(err);
  }
};
