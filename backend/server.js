// // server.js
// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import contactRoutes from "./routes/Contactroutes.js";
// import Registeration_router from "./routes/Registeration_route.js";
// import login_router from "./routes/LoginRoute.js";
// import passwordRouter from "./routes/PasswordRoute.js";
// import meetingRoutes from "./routes/meetingRoutes.js";
// const profileRoutes = require("./routes/profile");
// dotenv.config();

// const app = express();


// app.use(express.json());

// // CORS - allow your frontend (adjust origin as needed)
// app.use(
//   cors({
//     origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
//     credentials: true,
//   })
// );

// /**
//  * ROUTES
//  * Keep route prefixes intentional. You already used "/api/password" in your routes.
//  */
// app.use("/api", contactRoutes);
// app.use("/api", Registeration_router);
// app.use("/api", login_router);
// app.use("/api/password", passwordRouter);
// app.use("/api/meetings", meetingRoutes);
// app.use("/api/profile", profileRoutes);

// /**
//  * Simple test route to verify server is running
//  */
// app.get("/api/test", (req, res) => {
//   res.send("Backend is running successfully 🚀");
// });

// /**
//  * 404 handler for unknown routes
//  */
// app.use((req, res, next) => {
//   res.status(404).json({ message: "Route not found" });
// });

// /**
//  * Basic error handler
//  */
// app.use((err, req, res, next) => {
//   console.error("Unhandled error:", err);
//   res.status(err.status || 500).json({
//     message: err.message || "Internal Server Error",
//   });
// });

// /**
//  * MONGO CONNECTION & SERVER START
//  * 
//  */
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/YourDBName";

// mongoose
//   .connect(MONGO_URI) // no need for useNewUrlParser or useUnifiedTopology
//   .then(() => {
//     console.log("✅ MongoDB connected successfully");
//     app.listen(PORT, () => {
//       console.log(`✅ Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });


// // server.js
// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import contactRoutes from "./routes/Contactroutes.js";
// import Registeration_router from "./routes/Registeration_route.js";
// import login_router from "./routes/LoginRoute.js";
// import passwordRouter from "./routes/PasswordRoute.js";
// import meetingRoutes from "./routes/meetingRoutes.js";
// import profileRoutes from "./routes/profile.js"; // ← FIXED: was require() (CommonJS), now ESM import

// dotenv.config();

// const app = express();

// app.use(express.json());

// app.use(
//   cors({
//     origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
//     credentials: true,
//   })
// );

// app.use("/api", contactRoutes);
// app.use("/api", Registeration_router);
// app.use("/api", login_router);
// app.use("/api/password", passwordRouter);
// app.use("/api/meetings", meetingRoutes);
// app.use("/api/profile", profileRoutes); // GET and PUT /api/profile now work

// app.get("/api/test", (req, res) => {
//   res.send("Backend is running successfully 🚀");
// });

// app.use((req, res, next) => {
//   res.status(404).json({ message: "Route not found" });
// });

// app.use((err, req, res, next) => {
//   console.error("Unhandled error:", err);
//   res.status(err.status || 500).json({
//     message: err.message || "Internal Server Error",
//   });
// });

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/YourDBName";

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected successfully");
//     app.listen(PORT, () => {
//       console.log(`✅ Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err);
//     process.exit(1);
//   });


// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import { DeepgramClient } from "@deepgram/sdk";

// ============================================
// IMPORT ROUTES
// ============================================
import contactRoutes from "./routes/Contactroutes.js";
import Registeration_router from "./routes/Registeration_route.js";
import login_router from "./routes/LoginRoute.js";
import passwordRouter from "./routes/PasswordRoute.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import summaryRoutes from "./routes/SummaryRoutes.js";
import profileRoutes from "./routes/profile.js"; // ← Added from basic version

// Import Meeting Model for direct database streaming via WebSockets
import Meeting from "./models/Meeting.js";

// ============================================
// APP & SERVER INITIALIZATION
// ============================================
const app = express();
const httpServer = createServer(app);

// Initialize Deepgram Client (Automatically uses process.env.DEEPGRAM_API_KEY)
const deepgram = new DeepgramClient();

// Configure Socket.io with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Make the io instance available in Express routes (accessible via req.app.get("io"))
app.set("io", io);

// ============================================
// WEBSOCKET (SOCKET.IO) LOGIC
// ============================================
io.on("connection", (socket) => {
  console.log(`User connected to socket: ${socket.id}`);

  // User joins a specific meeting room
  socket.on("join-room", (roomName) => {
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined room: ${roomName}`);
  });

  // Listen for new transcript chunks and save directly to MongoDB
  socket.on("save-transcript", async ({ meetingId, text }) => {
    console.log(`Received chunk for meeting ${meetingId}: ${text.substring(0, 30)}...`);

    try {
      // Find the meeting by roomName and push the new chunk to the array
      const updatedMeeting = await Meeting.findOneAndUpdate(
        { roomName: meetingId },
        { $push: { transcriptChunks: text } },
        { new: true, upsert: false }
      );

      // If successfully saved, broadcast the chunk to others in the room for live captioning
      if (updatedMeeting) {
        socket.to(meetingId).emit("live-caption", { text });
      } else {
        console.warn(`Meeting ${meetingId} not found in database.`);
      }
    } catch (err) {
      console.error("Error saving transcript chunk:", err.message);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// ============================================
// EXPRESS MIDDLEWARE
// ============================================
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Custom Request Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// ============================================
// API ROUTES MOUNTING
// ============================================
app.use("/api", contactRoutes);
app.use("/api", Registeration_router);
app.use("/api", login_router);
app.use("/api/password", passwordRouter);
app.use("/api/meetings", meetingRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api", userRoutes);
app.use("/api/profile", profileRoutes); // ← Added from basic version

// Simple Health Check Route
app.get("/api/test", (req, res) => {
  res.status(200).send("Backend is running successfully 🚀");
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 Route Not Found Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ============================================
// DATABASE CONNECTION & SERVER START
// ============================================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Holomeet";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully to Holomeet");
    // httpServer use karo (app nahi) — Socket.io ke liye zaroori hai
    httpServer.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

export default app;