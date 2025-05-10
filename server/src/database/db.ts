import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGO_URI;
    if (!mongoURL) throw new Error("MONGO_URI not defined in .env");
    
    await mongoose.connect(mongoURL);
    console.log("Connected to database");

    mongoose.connection.on("disconnected", () => {
      console.error("Disconnected from database");
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectDB;
