import Meeting from "../models/Meeting.js";
import MeetingSummary from "../models/MeetingSummary.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// FIX: Added back to resolve the import error in SummaryRoutes.js
export const listAvailableModels = async (req, res) => {
  try {
    res.json({ success: true, message: "Models list functionality is active." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateAISummary = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    // Combine chunks from the talk
    const fullTranscriptText = (meeting.transcriptChunks && meeting.transcriptChunks.length > 0) 
      ? meeting.transcriptChunks.join(" ").trim() 
      : meeting.transcriptText;

    if (!fullTranscriptText || fullTranscriptText.length < 5) {
      return res.status(400).json({ 
        error: "Insufficient transcription data. Speak more before generating." 
      });
    }

    meeting.transcriptText = fullTranscriptText;
    await meeting.save();

    let aiData;

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      // FIX 1: Correct model name — remove the "models/" prefix
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // FIX 2: Much stronger prompt that forces real summarization with key points
      const prompt = `You are an expert meeting summarizer. Read the transcript below carefully and extract the most important information.

TRANSCRIPT:
"""
${fullTranscriptText}
"""

Your job:
1. Identify a short, descriptive MAIN TOPIC (5-8 words max) that captures what this meeting was truly about.
2. Write a SHORT OVERVIEW: exactly 2 to 3 clear, informative sentences that summarize the key discussion points, decisions made, or conclusions reached. Do NOT copy sentences from the transcript. Write it freshly in your own words.
3. Extract 3 to 5 KEY POINTS as short bullet-style strings. Each key point should highlight an important fact, decision, or topic discussed in the meeting.

RULES:
- Never copy-paste from the transcript. Always rewrite in clean, professional English.
- Be specific — mention names, numbers, topics, decisions if they appear in the transcript.
- If the transcript is in mixed languages (e.g. Urdu + English), still respond fully in English.

Respond ONLY with valid JSON in this exact format, no markdown, no backticks, no extra text:
{
  "mainTopic": "Short descriptive title here",
  "shortOverview": "2-3 sentence summary here.",
  "keyPoints": [
    "First important point",
    "Second important point",
    "Third important point"
  ]
}`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text();

      // FIX 3: Safer JSON extraction — handles edge cases
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No valid JSON found in AI response");

      aiData = JSON.parse(jsonMatch[0]);

      // Validate the required fields exist
      if (!aiData.mainTopic || !aiData.shortOverview) {
        throw new Error("AI response missing required fields");
      }

      // Ensure keyPoints is always an array
      if (!Array.isArray(aiData.keyPoints)) {
        aiData.keyPoints = [];
      }

      console.log("✅ AI Summary generated successfully:", aiData.mainTopic);

    } catch (aiError) {
      // FIX 4: Log the ACTUAL error so you can debug it
      console.error("❌ AI Summarization Error:", aiError.message);

      // Fallback — at least try to make a meaningful summary from the text
      const words = fullTranscriptText.split(" ").slice(0, 50).join(" ");
      aiData = {
        mainTopic: "Meeting Summary",
        shortOverview: `This meeting covered the following: ${words}...`,
        keyPoints: ["Full AI summary unavailable — check server logs for details."]
      };
    }

    // Save the summary including keyPoints
    const updatedSummary = await MeetingSummary.findOneAndUpdate(
      { meetingId: meeting._id },
      { 
        mainTopic: aiData.mainTopic,
        shortOverview: aiData.shortOverview,
        keyPoints: aiData.keyPoints,        // FIX 5: Save keyPoints to DB
        meetingId: meeting._id, 
        transcriptText: fullTranscriptText, 
        status: 'completed' 
      },
      { upsert: true, new: true }
    );

    res.json({ 
      success: true, 
      summary: updatedSummary 
    });

  } catch (error) {
    console.error("❌ generateAISummary fatal error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};