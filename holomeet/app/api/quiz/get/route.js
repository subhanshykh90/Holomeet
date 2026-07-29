import { connectDB } from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const roomName = searchParams.get("roomName");

  await connectDB();

  const quiz = await Quiz.findOne({
    meetingId: roomName,
    isActive:  true,
  }).sort({ createdAt: -1 });

  if (!quiz) {
    return NextResponse.json({ error: "No active quiz" }, { status: 404 });
  }

  return NextResponse.json({ success: true, quiz });
}