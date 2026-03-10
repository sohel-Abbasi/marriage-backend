import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import biodataRoutes from "./routes/biodata.js";

dotenv.config();

const app = express();

const MONGODB_URI = process.env.MONGODB_URI;

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// ✅ FIX 1: connectDB runs BEFORE routes as middleware
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing");
  }
  const db = await mongoose.connect(MONGODB_URI);
  isConnected = db.connections[0].readyState === 1;
  console.log("Connected to MongoDB");
};

// ✅ FIX 2: DB connection middleware registered BEFORE routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    return res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "ShaadiBio API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/biodata", biodataRoutes);

// ✅ FIX 3: No app.listen() on Vercel — just export the app
// Only listen locally when not in a serverless environment
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`ShaadiBio API listening on port ${PORT}`);
  });
}

export default app;
