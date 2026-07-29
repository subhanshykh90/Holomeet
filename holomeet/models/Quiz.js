import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    meetingId:  { type: String, required: true },
    hostId:     { type: String, required: true },
    category:   { type: String, required: true },
    timeLimit:  { type: Number, default: 60 },
    password:   { type: String, required: true },
    questions:  { type: Array, required: true },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Quiz ||
  mongoose.model("Quiz", QuizSchema);