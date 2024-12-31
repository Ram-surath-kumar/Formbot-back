const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 35000,
      socketTimeoutMS: 45000,
    });

    const connection = mongoose.connection;
    console.log("Connected to MongoDB");
    // Event listeners
    connection.on("connected", () => {
      console.log("MongoDB connected successfully!");
    });

    connection.on("disconnected", () => {
      console.log("MongoDB disconnected.");
    });

    connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectDB;
