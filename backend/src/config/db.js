import mongoose from 'mongoose';
import dns from 'dns';

// Ensure Node.js DNS can resolve MongoDB Atlas SRV records on all network environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]);
} catch (e) {
  // Ignore fallback if setServers is restricted
}

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
    // If Atlas connection fails, attempt fallback connection to local MongoDB
    const localUri = 'mongodb://127.0.0.1:27017/sibling-vault';
    if (process.env.MONGO_URI !== localUri) {
      console.log(`🔄 Attempting fallback connection to local MongoDB (${localUri})...`);
      try {
        await mongoose.connect(localUri, options);
        return;
      } catch (localErr) {
        console.error(`❌ Local MongoDB fallback also failed: ${localErr.message}`);
      }
    }
    process.exit(1);
  }
};

export default connectDB;
