import mongoose from 'mongoose';

const timelineItemSchema = new mongoose.Schema({
  mediaUrl:   { type: String, default: '' },
  mediaUrls:  { type: [String], default: [] },
  mediaType:  { type: String, enum: ['image', 'images', 'video', 'none'], default: 'none' },
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

const roastSchema = new mongoose.Schema({
  text:       { type: String, required: true },
  trueVotes:  { type: Number, default: 0 },
  fakeVotes:  { type: Number, default: 0 },
});

const secretChallengeSchema = new mongoose.Schema({
  question:     { type: String, default: '' },
  options:      { type: [String], default: [] },
  correctIndex: { type: Number, default: 0 },
  hint:         { type: String, default: '' },
  revealMsg:    { type: String, default: '' },
});

const siblingFavorSchema = new mongoose.Schema({
  requestText: { type: String, default: '' },
  priority:    { type: String, enum: ['high', 'medium', 'funny'], default: 'high' },
  status:      { type: String, enum: ['pending', 'granted', 'countered'], default: 'pending' },
});

const fineItemSchema = new mongoose.Schema(
  {
    crimeTitle: { type: String, required: true },
    amount:     { type: Number, default: 0 },
  },
  { _id: true }
);

const interactionsSchema = new mongoose.Schema(
  {
    status:             { type: String, enum: ['pending', 'completed'], default: 'pending' },
    couponsRedeemed:    { type: [String], default: [] },
    punishmentAccepted: { type: String, default: '' },
    challengeAccepted:  { type: String, default: '' },
    favorAccepted:      { type: String, default: '' },
    finesSettled:       { type: Boolean, default: false },
    reactionMessage:    { type: String, default: '' },
    completedAt:        { type: Date },
  },
  { _id: false }
);

const packetSchema = new mongoose.Schema(
  {
    packetId:        { type: String, required: true, unique: true, index: true },
    senderName:      { type: String, required: true },
    recipientName:   { type: String, required: true },
    language:        { type: String, enum: ['en', 'hinglish'], default: 'en' },
    theme:           { type: String, default: 'nostalgic' },
    modules:         { type: [String], default: ['timeline', 'wheel', 'coupons', 'wishlist', 'funZone'] },
    timeline:        [timelineItemSchema],
    brotherMessage:  { type: String, default: '' },
    giftOrdered:     { type: Boolean, default: false },
    orderedGiftName: { type: String, default: '' },
    orderedGiftNote: { type: String, default: '' },
    orderedGiftImage:{ type: String, default: '' },
    wishlist:        [wishlistItemSchema],
    punishments:     { type: [String], default: [] },
    coupons:         [couponSchema],
    certificates:    [certificateSchema],
    roasts:          [roastSchema],
    secretChallenge: secretChallengeSchema,
    siblingFavor:    siblingFavorSchema,
    fines:           [fineItemSchema],
    creator:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    creatorEmail:    { type: String, default: null, index: true },
    interactions:    {
      type: interactionsSchema,
      default: () => ({ status: 'pending', couponsRedeemed: [], punishmentAccepted: '', reactionMessage: '' }),
    },
  },
  { timestamps: true }
);

const Packet = mongoose.model('Packet', packetSchema);
export default Packet;
