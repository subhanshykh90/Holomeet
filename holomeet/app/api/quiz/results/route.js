import { connectDB } from "@/lib/mongodb";
import QuizAttempt from "@/models/QuizAttempt";
import Quiz from "@/models/Quiz";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const roomName = searchParams.get("roomName");

  await connectDB();

  const results = await QuizAttempt.find({ meetingId: roomName })
    .sort({ score: -1, timeTaken: 1 })
    .lean();

  // Quiz bhi fetch karo correct answers ke liye
  const quiz = await Quiz.findOne({ meetingId: roomName, isActive: true });
  
  const CATEGORY_NAMES = {
    '9':  'General Knowledge',
    '17': 'Science & Nature',
    '18': 'Computers',
    '23': 'History',
    '10': 'English',
  };

  const rankedResults = results.map((r, index) => ({
    rank:            index + 1,
    participantName: r.participantName,
    rollNumber:      r.rollNumber || "N/A",
    category:        CATEGORY_NAMES[r.category] || r.category,
    score:           r.score,
    totalQuestions:  r.totalQuestions,
    scoreDisplay:    `${r.score}/${r.totalQuestions}`,
    percentage:      Math.round((r.score / r.totalQuestions) * 100),
    timeTaken:       r.timeTaken || 0,
    answers:         r.answers,
  }));

  // Correct answers list
  const correctAnswers = quiz?.questions?.map((q, i) => ({
    questionNo: i + 1,
    question: q.question,
    correctAnswer: q.correct_answer,
  })) || [];

  return NextResponse.json({ success: true, results: rankedResults, correctAnswers });
}
