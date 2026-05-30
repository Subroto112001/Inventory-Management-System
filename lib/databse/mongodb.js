// lib/mongodb.js
import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

const connectMongoDB = async () => {
  try {
    // if already connected, return the existing connection
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    }
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectMongoDB;
