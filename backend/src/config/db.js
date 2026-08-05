import mongoose from 'mongoose';

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries} failed: ${err.message}`);
      if (retries >= MAX_RETRIES) {
        console.error('💀 Max retries reached. Exiting.');
        process.exit(1);
      }
      // Wait 2s before retry
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

export default connectDB;
