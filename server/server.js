import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import protect from "./middleware/auth.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Enable CORS with credentials (adjust origin as needed)
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend origin
    credentials: true,
  })
);

// Body parser & cookie parser
app.use(express.json());
app.use(cookieParser());

// Serve static files (like CSS, JS, images) from client directory
app.use("/static", express.static(join(__dirname, "../client/static")));

// Auth API routes (login, register, logout, etc.)
app.use("/api/auth", authRoutes);

// Protect user info route to get logged-in user's data
app.get("/api/auth/me", protect, async (req, res) => {
  // req.user is set by protect middleware
  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

// Serve login page (public)
app.get("/auth/login", (req, res) => {
  res.sendFile(join(__dirname, "../client/auth/login.html"));
  console.log("this is the login page");
});

// Serve register page (public)
app.get("/auth/register", (req, res) => {
  res.sendFile(join(__dirname, "../client/auth/register.html"));
  console.log("this is the register page");
});

// Serve home page (protected)
app.get("/home", (req, res) => {
  res.sendFile(join(__dirname, "../client/navbar.html"));
});
app.get("/port", protect, (req, res) => {
  res.sendFile(join(__dirname, "../client/port.html"));
});
app.get("/ai", protect, (req, res) => {
  res.sendFile(join(__dirname, "../client/ai_assistant.html"));
});
app.get("/image-ai", protect, (req, res) => {
  res.sendFile(join(__dirname, "../client/image_ai.html"));
});
app.get("/music", protect, (req, res) => {
  res.redirect("https://musical-phi-one.vercel.app/");
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../client/navbar.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on this ${PORT}`);
});
