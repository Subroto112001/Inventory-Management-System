// lib/mongodb.js
import mongoose from "mongoose";
import { validateServerEnv } from "@/lib/env";
import { logger } from "@/lib/serverLogger";
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "ims";
let connectionPromise = null;

const connectMongoDB = async () => {
  validateServerEnv(["MONGODB_URI"]);
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (mongoose.connection.readyState === 0 || !connectionPromise) {
    connectionPromise = mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB })
      .then(() => {
        logger.info("Connected to MongoDB successfully.");
        return mongoose.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

export default connectMongoDB;
