// // holomeet/app/api/attendance/join/route.js
// // FIXED:
// //   1. getServerSession import was commented out → uncommented
// //   2. authOptions added (required for session to work)
// //   3. connectMongo → connectDB (matches your project)
// //   4. meetingId → roomName (matches Attendance model + leave + report)
// //   5. $setOnInsert → $set so rejoining students get a fresh joinedAt

// import { getServerSession } from "next-auth";                          // ✅ fix 1
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";      // ✅ fix 2
// import { connectDB } from "@/lib/mongodb";                             // ✅ fix 3
// import Attendance from "@/models/Attendance";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const session = await getServerSession(authOptions);                 // ✅ fix 2
//   if (!session) {
//     return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
//   }

//   const { roomName } = await req.json();                               // ✅ fix 4
//   if (!roomName) {
//     return NextResponse.json({ success: false, error: "roomName required" }, { status: 400 });
//   }

//   await connectDB();

//   const userId   = session.user.id    || session.user.email;
//   const userName = session.user.name  || session.user.email || "Unknown";

//   await Attendance.findOneAndUpdate(
//     { roomName, userId },                                              // ✅ fix 4
//     {
//       $set: {                                                          // ✅ fix 5
//         userName,
//         joinedAt: new Date(),
//         status:   "absent",
//         duration: 0,
//       },
//     },
//     { upsert: true, new: true }
//   );

//   return NextResponse.json({ success: true });
// }

// app/api/attendance/join/route.js
// Records when a participant joins — stores joinedAt timestamp

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { roomName } = await req.json();
  if (!roomName) {
    return NextResponse.json({ success: false, error: "roomName required" }, { status: 400 });
  }

  await connectDB();

  const userId   = session.user.id    || session.user.email;
  const userName = session.user.name  || session.user.email || "Unknown";

  // Always create a FRESH record on every join (don't reuse old ones)
  await Attendance.create({
    roomName,
    userId,
    userName,
    joinedAt: new Date(),
    status: "absent",
    duration: 0,
  });

  return NextResponse.json({ success: true });
}
