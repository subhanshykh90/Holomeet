import { connectDB } from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { roomName, password } = await req.json();

  await connectDB();

  const quiz = await Quiz.findOne({
    meetingId: roomName,
    isActive:  true,
    password,
  });

  if (!quiz) {
    return NextResponse.json({ success: false, error: "Wrong password" });
  }

  return NextResponse.json({ success: true });
}