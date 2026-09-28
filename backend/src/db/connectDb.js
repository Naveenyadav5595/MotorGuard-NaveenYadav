
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("Database connection failed", err);
    throw err;
  }
};

export default connectDB;