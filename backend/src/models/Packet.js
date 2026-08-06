import mongoose from 'mongoose';

const timelineItemSchema = new mongoose.Schema({
  mediaUrl:   { type: String, default: '' },
  mediaType:  { type: String, enum: ['image', 'video', 'none'], default: 'none' },
  title:      { type: String, required: true },
  date:       { type: String, default: '' },
  story:      { type: String, default: '' },
  secretNote: { type: String, default: '' },
});

const wishlistItemSchema = new mongoose.Schema({
  item:     { type: String, required: true },
  category: { type: String, default: 'Custom' },
  status:   { type: String, enum: ['open', 'pledged'], default: 'open' },
});

const couponSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  terms:    { type: String, default: '' },
  redeemed: { type: Boolean, default: false },
});

const certificateSchema = new mongoose.Schema({
  awardTitle:  { type: String, required: true },
  description: { type: String, default: '' },
});

const packetSchema = new mongoose.Schema(
  {
    packetId:      { type: String, required: true, unique: true, index: true },
    senderName:    { type: String, required: true },
    recipientName: { type: String, required: true },
    language:      { type: String, enum: ['en', 'hinglish'], default: 'en' },
    theme:         { type: String, default: 'nostalgic' },
    modules:       { type: [String], default: ['timeline', 'wheel', 'coupons', 'wishlist'] },
    timeline:      [timelineItemSchema],
    wishlist:      [wishlistItemSchema],
    punishments:   { type: [String], default: [] },
    coupons:       [couponSchema],
    certificates:  [certificateSchema],
  },
  { timestamps: true }
);

const Packet = mongoose.model('Packet', packetSchema);
export default Packet;
