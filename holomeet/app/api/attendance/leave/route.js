// app/api/attendance/leave/route.js
// Called when participant leaves — calculates time stayed, does NOT mark present/absent
// (Status is determined at report generation time by host input)

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // sendBeacon (tab close) sends text/plain — handle both content types
    const contentType = req.headers.get("content-type") || "";
    let roomName;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      roomName = body.roomName;
    } else {
      const text = await req.text();
      const body = JSON.parse(text);
      roomName = body.roomName;
    }

    if (!roomName) {
      return NextResponse.json({ success: false, error: "roomName required" }, { status: 400 });
    }

    await connectDB();

    const leftAt = new Date();

    // Try session first (works on normal disconnect)
    const session = await getServerSession(authOptions).catch(() => null);
    let record = null;

    if (session) {
      const userId = session.user.id || session.user.email;
      // Get the most recent open record for this user in this room
      record = await Attendance.findOne({
        roomName,
        userId,
        leftAt: { $exists: false },
      }).sort({ joinedAt: -1 });
    }

    if (!record) {
      // Fallback for sendBeacon (tab close) — no session available
      record = await Attendance.findOne({
        roomName,
        leftAt: { $exists: false },
      }).sort({ joinedAt: -1 });
    }

    if (!record) {
      return NextResponse.json({ success: true, message: "No open record found" });
    }

    const durationMinutes = Math.floor((leftAt - record.joinedAt) / 60000);

    // Just save duration and leftAt — status will be decided by host at report time
    await Attendance.findByIdAndUpdate(record._id, {
      leftAt,
      duration: durationMinutes,
      status: "absent", // placeholder; overridden at report generation
    });

    return NextResponse.json({ success: true, duration: durationMinutes });

  } catch (err) {
    console.error("Attendance leave error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
