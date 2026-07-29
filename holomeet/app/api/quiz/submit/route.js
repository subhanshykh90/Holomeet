import { connectDB } from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { quizId, roomName, answers, participantName, rollNumber, timeTaken } = await req.json();

    if (!answers || !quizId || !participantName) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await connectDB();

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correct_answer) score++;
    });

    await QuizAttempt.create({
      meetingId:       roomName,
      quizId,
      participantName: participantName || "Anonymous",
      rollNumber:      rollNumber || "N/A",
      category:        quiz.category,
      score,
      totalQuestions:  quiz.questions.length,
      answers,
      timeTaken:       timeTaken || 0,
    });

    return NextResponse.json({
      success:        true,
      score,
      totalQuestions: quiz.questions.length,
      timeTaken:      timeTaken || 0,
    });

  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}