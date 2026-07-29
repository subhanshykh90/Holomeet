
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const roomName       = searchParams.get("roomName");
  const requiredMinutes = parseInt(searchParams.get("requiredMinutes") || "0", 10);

  if (!roomName) {
    return NextResponse.json({ success: false, error: "roomName is required" }, { status: 400 });
  }

  await connectDB();

  // Find the meeting
  const meeting = await Meeting.findOne({ roomName });
  if (!meeting) {
    return NextResponse.json({ success: false, error: "Meeting not found" }, { status: 404 });
  }

  // Only host can view attendance
  if (meeting.hostEmail !== session.user.email) {
    return NextResponse.json({ success: false, error: "Only the host can view attendance" }, { status: 403 });
  }

  const now = new Date();
  const rawRecords = await Attendance.find({ roomName }).sort({ userName: 1 });

  // Deduplicate: keep only the LATEST record per userId (in case of multiple joins)
  const latestByUser = new Map();
  for (const r of rawRecords) {
    const key = r.userId || r.userName;
    const existing = latestByUser.get(key);
    if (!existing || r.joinedAt > existing.joinedAt) {
      latestByUser.set(key, r);
    }
  }

  const records = Array.from(latestByUser.values()).map(r => {
    // If still in meeting (no leftAt), count time up to now
    const duration = r.leftAt
      ? (r.duration ?? 0)
      : Math.floor((now - r.joinedAt) / 60000);
    const status = duration >= requiredMinutes ? "present" : "absent";
    return {
      userName: r.userName,
      duration,
      status,
    };
  });

  // Sort: present first, then by name
  records.sort((a, b) => {
    if (a.status === b.status) return a.userName.localeCompare(b.userName);
    return a.status === "present" ? -1 : 1;
  });

  return NextResponse.json({
    success:          true,
    meetingTitle:     meeting.title || meeting.roomName,
    requiredDuration: requiredMinutes,
    date:             meeting.createdAt
                        ? new Date(meeting.createdAt).toLocaleDateString("en-PK", {
                            year: "numeric", month: "long", day: "numeric",
                          })
                        : new Date().toLocaleDateString("en-PK", {
                            year: "numeric", month: "long", day: "numeric",
                          }),
    records,
  });
}
