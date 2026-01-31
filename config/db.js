const mongoose = require("mongoose");

// 1. Define a global cache to store the connection between requests
let cached = global.mongoose;

// If the cache doesn't exist (first run), initialize it
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // 2. If a connection already exists, use it and return immediately
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  // 3. If no connection promise exists, create a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose buffering for faster failures in serverless
    };

    console.log("Connecting to MongoDB...");
    
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    });
  }

  // 4. Await the promise and store the connection
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise if connection failed
    console.error("MongoDB connection failed:", e.message);
    throw e; // Throw error so the API can handle it (don't exit process)
  }

  return cached.conn;
};

module.exports = connectDB;
