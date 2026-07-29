import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Read the new fields alongside roomName
  const { roomName, title, date, description, requiredDuration } = await req.json();

  await connectDB();

  const existing = await Meeting.findOne({ roomName });
  if (existing) {
    return NextResponse.json({ meeting: existing });
  }

  const meeting = await Meeting.create({
    roomName,
    hostId:           session.user.id,
    hostEmail:        session.user.email,
    title:            title            || roomName,   // ✅ save title
    date:             date             || new Date(), // ✅ save date
    description:      description      || '',         // ✅ save description
    requiredDuration: Number(requiredDuration) || 0,  // ✅ THIS is what attendance uses
  });

  return NextResponse.json({ meeting });
}
