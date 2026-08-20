import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import analyzeRouter from "./routes/analyze.js";

const app = express();

// const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://resu-match-ai-xi.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/analyze", analyzeRouter);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.error("Server will continue running, but /api/analyze will fail until MongoDB is reachable.");
  }

  app.listen(PORT, () => console.log(`ResuMatch API running on port ${PORT}`));
}

start();
