import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createPacket,
  getPacket,
  redeemCoupon,
  pledgeWishlistItem,
  uploadMedia,
} from '../controllers/packetController.js';

const router = express.Router();

// ── Multer storage config ──────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|webm/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase())
             && allowed.test(file.mimetype.split('/')[1]);
    ok ? cb(null, true) : cb(new Error('Unsupported file type.'));
  },
});

// ── Routes ─────────────────────────────────────────────────────────────────
// Accepts single 'media' OR multiple 'mediaFiles' (up to 6)
router.post('/upload', upload.any(), uploadMedia);
router.post('/',                         createPacket);
router.get('/:packetId',                 getPacket);
router.patch('/:packetId/redeem-coupon', redeemCoupon);
router.patch('/:packetId/pledge-item',   pledgeWishlistItem);

export default router;
