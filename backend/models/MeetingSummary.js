// backend/models/MeetingSummary.js
import mongoose from "mongoose";

const ActionItemSchema = new mongoose.Schema(
  {
    assignedTo: { type: String },
    task: { type: String },
    deadline: { type: String },
  },
  { _id: false }
);

const MeetingSummarySchema = new mongoose.Schema({
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meeting",
    required: true,
  },
  hostId: { type: String },
  transcriptText: { type: String },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },

  // AI Generated Fields
  mainTopic: { type: String },
  shortOverview: { type: String },
  participantCount: { type: Number },
  keyDiscussionPoints: [{ type: String }],
  importantDecisions: [{ type: String }],
  actionItems: [ActionItemSchema],

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MeetingSummary ||
  mongoose.model("MeetingSummary", MeetingSummarySchema);