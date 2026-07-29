import mongoose from "mongoose";

const QuizAttemptSchema = new mongoose.Schema(
  {
    meetingId:       { type: String, required: true },
    quizId:          { type: String, required: true },
    participantName: { type: String, required: true },
    rollNumber:      { type: String, default: "N/A" },
    category:        { type: String, required: true },
    score:           { type: Number, required: true },
    totalQuestions:  { type: Number, required: true },
    answers:         { type: Object, required: true },
    timeTaken:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.QuizAttempt ||
  mongoose.model("QuizAttempt", QuizAttemptSchema);