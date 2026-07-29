// import express from "express";
// import { createMeeting, getMeetings } from "../controllers/meetingController.js";

// const router = express.Router();

// // POST /api/meetings => create a new meeting
// router.post("/", createMeeting);

// // GET /api/meetings => fetch all meetings
// router.get("/", getMeetings);

// export default router;
// Routers/meetingRoutes.js
import express from "express";
import {
  createMeeting,
  getMeetings,
  getMeetingById,
  appendTranscription,
} from "../controllers/meetingController.js";

const router = express.Router();

// POST /api/meetings => create a new meeting
router.post("/", createMeeting);

// GET /api/meetings => fetch all meetings
router.get("/", getMeetings);

// GET /api/meetings/:id => fetch single meeting with summary
router.get("/:id", getMeetingById);

// PATCH /api/meetings/append-transcription => update live transcript
router.patch("/append-transcription", appendTranscription);

export default router;