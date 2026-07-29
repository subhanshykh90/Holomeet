// import { connectDB } from "@/lib/mongodb";
// import Meeting from "@/models/Meeting";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const roomName = searchParams.get("roomName");

//   await connectDB();

//   const meeting = await Meeting.findOne({ roomName });

//   if (!meeting) {
//     return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
//   }

//   const session = await getServerSession(authOptions);
//   const isHost = session?.user?.id
//     ? meeting.hostId === session.user.id
//     : false;

//   return NextResponse.json({
//     meeting: {
//       roomName: meeting.roomName,
//       isMuted:  meeting.isMuted,
//       quizActive: meeting.quizActive,
//     },
//     isHost,
//   });
// }

// app/api/meeting/get/route.js
import { connectDB } from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const roomName = searchParams.get("roomName");

  await connectDB();

  const meeting = await Meeting.findOne({ roomName });

  if (!meeting) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }

  const session = await getServerSession(authOptions);

  // Check by ID first, then fall back to email
  // This handles both old (User model) and new (Registration model) sessions
  let isHost = false;

  if (session?.user?.id && meeting.hostId) {
    isHost = meeting.hostId.toString() === session.user.id.toString();
  }

  // Fallback: if ID check failed, try matching by hostEmail
  if (!isHost && session?.user?.email && meeting.hostEmail) {
    isHost = meeting.hostEmail === session.user.email;
  }

  return NextResponse.json({
    meeting: {
      roomName:   meeting.roomName,
      isMuted:    meeting.isMuted,
      quizActive: meeting.quizActive,
    },
    isHost,
  });
}