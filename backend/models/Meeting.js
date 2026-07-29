// import mongoose from "mongoose";

// const MeetingSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now, // automatically stores current time
//   },
// });

// export default mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);
// backend/models/Meeting.js
import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  roomName: { type: String },
  hostId: { type: String },

  // Array to store live transcript chunks from Deepgram
  transcriptChunks: {
    type: [String],
    default: [],
  },

  // Final compiled transcript (filled after meeting ends)
  transcriptText: {
    type: String,
    default: "",
  },

  isTranscriptionEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-update updatedAt on every save
MeetingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);