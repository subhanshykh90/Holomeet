
import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema(
  {
    roomName:         { type: String, required: true, unique: true },
    hostId:           { type: String },
    hostEmail:        { type: String },

    // ✅ NEW fields — saved from dashboard form
    title:            { type: String, default: "" },
    date:             { type: String, default: "" },
    description:      { type: String, default: "" },
    requiredDuration: { type: Number, default: 0 }, // minutes — set by teacher

    // existing fields you likely already have
    isMuted:          { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);