import mongoose from 'mongoose';

// ── Connection Lifecycle Event Listeners ────────────────────────────────────
mongoose.connection.on('connected', () => {
  console.log(`✅ MongoDB Atlas connected successfully (Host: ${mongoose.connection.host})`);
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Attempting reconnection...');
});

// ── Connect DB Function ─────────────────────────────────────────────────────
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is missing in environment variables');
    process.exit(1);
  }

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    autoIndex: process.env.NODE_ENV !== 'production',
  };

  try {
    await mongoose.connect(process.env.MONGO_URI, options);
  } catch (err) {
    console.error(`❌ Initial MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
