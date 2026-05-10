import mongoose from "mongoose";


const connectDB = async () => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI ||
      'mongodb://localhost:27017/reviewrate';

    await mongoose.connect(MONGO_URI);

    console.log('MongoDB Connected');

  } catch (err) {
    console.error('MongoDB Error:', err.message);
    process.exit(1);
  }
};

export default connectDB;
