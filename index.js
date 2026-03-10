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

if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error("Failed to connect to MongoDB", err);
    });
} else {
  // eslint-disable-next-line no-console
  console.error("MONGODB_URI environment variable is missing");
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`ShaadiBio API listening on port ${PORT}`);
});

export default app;
