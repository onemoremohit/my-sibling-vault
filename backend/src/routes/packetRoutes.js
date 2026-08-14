import express from 'express';
import multer from 'multer';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import {
  createPacket,
  getPacket,
  redeemCoupon,
  pledgeWishlistItem,
  uploadMedia,
} from '../controllers/packetController.js';

const router = express.Router();

// ── Backblaze B2 S3 Client & Storage Setup ─────────────────────────────────
const endpointRaw = process.env.B2_ENDPOINT || 's3.us-west-004.backblazeb2.com';
const endpointUrl = endpointRaw.startsWith('http') ? endpointRaw : `https://${endpointRaw}`;
const regionMatch = endpointRaw.match(/s3\.([a-z0-9-]+)\.backblazeb2\.com/i);
const region = regionMatch ? regionMatch[1] : 'us-west-004';

const isB2Configured = Boolean(
  process.env.B2_KEY_ID &&
  process.env.B2_KEY_ID !== 'your-key-id' &&
  process.env.B2_APPLICATION_KEY &&
  process.env.B2_APPLICATION_KEY !== 'your-application-key' &&
  process.env.B2_BUCKET_NAME &&
  process.env.B2_BUCKET_NAME !== 'your-bucket-name'
);

let storage;

if (isB2Configured) {
  const s3 = new S3Client({
    endpoint: endpointUrl,
    region: region,
    credentials: {
      accessKeyId: process.env.B2_KEY_ID,
      secretAccessKey: process.env.B2_APPLICATION_KEY,
    },
  });

  storage = multerS3({
    s3,
    bucket: process.env.B2_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `timeline/${unique}${ext}`);
    },
  });
  console.log('☁️ Backblaze B2 S3 storage configured for uploads.');
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, unique + path.extname(file.originalname));
    },
  });
  console.log('📁 Local disk storage active (Backblaze B2 placeholders present in .env).');
}

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
