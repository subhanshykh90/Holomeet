import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { RoomServiceClient } from "livekit-server-sdk";
import { connectDB } from "@/lib/mongodb";
import Meeting from "@/models/Meeting";
import { NextResponse } from "next/server";

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_URL,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomName, mute } = await req.json();

  try {
    await connectDB();

    await Meeting.findOneAndUpdate(
      { roomName },
      { isMuted: mute }
    );

    if (mute) {
      const participants = await roomService.listParticipants(roomName);
      for (const participant of participants) {
        for (const track of participant.tracks) {
          if (track.type === 0) {
            try {
              await roomService.mutePublishedTrack(
                roomName,
                participant.identity,
                track.sid,
                true
              );
            } catch (e) {
              console.log("Track mute skip:", e.message);
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      isMuted: mute,
    });

  } catch (error) {
    console.error("Mute error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}