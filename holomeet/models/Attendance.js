// models/Attendance.js

import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  roomName:  { type: String, required: true, index: true },
  userId:    { type: String, required: true },
  userName:  { type: String, required: true },
  joinedAt:  { type: Date,   required: true },
  leftAt:    { type: Date },           // undefined = still in meeting
  duration:  { type: Number, default: 0 }, // minutes
  status:    { type: String, default: "absent", enum: ["present", "absent"] },
}, { timestamps: true });

// Index for fast lookups
AttendanceSchema.index({ roomName: 1, userId: 1 });

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
