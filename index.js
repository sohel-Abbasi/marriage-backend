import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import biodataRoutes from "./routes/biodata.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "ShaadiBio API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/biodata", biodataRoutes);

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  if (!MONGODB_URI) {
    console.error("MONGODB_URI environment variable is missing");
    return;
  }
  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to MongoDB via serverless wrapper");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`ShaadiBio API listening on port ${PORT}`);
});

export default app;
