import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomName, category, timeLimit, password, questionCount } = await req.json();

  try {
    const response = await axios.get(
      `https://opentdb.com/api.php?amount=${questionCount || 10}&category=${category}&type=multiple`
    );

    if (response.data.response_code !== 0) {
      return NextResponse.json({ error: "Quiz generation failed" }, { status: 500 });
    }

    const questions = response.data.results;

    await connectDB();

    await Quiz.updateMany({ meetingId: roomName }, { isActive: false });

    const quiz = await Quiz.create({
      meetingId: roomName,
      hostId:    session.user.id,
      category,
      questions,
      timeLimit,
      password,
      isActive:  true,
    });

    return NextResponse.json({ success: true, quiz });

  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}