// backend/controllers/exportController.js
import MeetingSummary from "../models/MeetingSummary.js";
import PDFDocument from "pdfkit";
import { Document, Packer, Paragraph, HeadingLevel } from "docx";

// Export summary as PDF
export const downloadSummaryPDF = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const summary = await MeetingSummary.findOne({ meetingId });

    if (!summary) return res.status(404).json({ error: "Summary not found" });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=HoloMeet_Summary_${meetingId}.pdf`
    );

    doc.pipe(res);

    // Header
    doc
      .font("Helvetica-Bold")
      .fillColor("#2563eb")
      .fontSize(24)
      .text("HoloMeet: Meeting Summary", { align: "center" });
    doc.moveDown();

    // Topic & Overview
    doc
      .font("Helvetica")
      .fillColor("black")
      .fontSize(16)
      .text(`Topic: ${summary.mainTopic || "N/A"}`, { underline: true });
    doc.fontSize(12).text(`Participants: ${summary.participantCount || "N/A"}`);
    doc.moveDown(0.5);
    doc
      .font("Helvetica-Oblique")
      .fontSize(11)
      .text(summary.shortOverview || "No overview provided.");
    doc.moveDown();
    doc.font("Helvetica");

    // Discussion Points
    doc.fontSize(14).fillColor("#1e40af").text("Key Discussion Points:");
    const points = summary.keyDiscussionPoints || [];
    if (points.length === 0)
      doc.fontSize(11).fillColor("black").text("• None");
    points.forEach((point) =>
      doc.fontSize(11).fillColor("black").text(`• ${point}`)
    );
    doc.moveDown();

    // Decisions
    doc.fontSize(14).fillColor("#1e40af").text("Important Decisions:");
    const decisions = summary.importantDecisions || [];
    if (decisions.length === 0)
      doc.fontSize(11).fillColor("black").text("✔ None");
    decisions.forEach((decision) =>
      doc.fontSize(11).fillColor("black").text(`✔ ${decision}`)
    );
    doc.moveDown();

    // Action Items
    doc.fontSize(14).fillColor("#1e40af").text("Action Items:");
    const actions = summary.actionItems || [];
    if (actions.length === 0)
      doc.fontSize(11).fillColor("black").text("- None");
    actions.forEach((item) => {
      doc
        .fontSize(11)
        .fillColor("black")
        .text(
          `- ${item.task || "Task"} (Assigned to: ${item.assignedTo || "Unassigned"}, Deadline: ${item.deadline || "None"})`
        );
    });

    doc.end();
  } catch (error) {
    console.error("PDF Generation Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "PDF Generation failed" });
    }
  }
};

// Export summary as DOCX
export const downloadSummaryDocx = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const summary = await MeetingSummary.findOne({ meetingId });

    if (!summary) return res.status(404).json({ error: "Summary not found" });

    const points = summary.keyDiscussionPoints || [];
    const actions = summary.actionItems || [];

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "HoloMeet Summary",
              heading: HeadingLevel.TITLE,
            }),
            new Paragraph({
              text: `Topic: ${summary.mainTopic || "N/A"}`,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: summary.shortOverview || "No overview provided.",
              italic: true,
            }),
            new Paragraph({
              text: "Key Discussion Points",
              heading: HeadingLevel.HEADING_2,
            }),
            ...points.map((p) => new Paragraph({ text: `• ${p}` })),
            new Paragraph({
              text: "Action Items",
              heading: HeadingLevel.HEADING_2,
            }),
            ...actions.map(
              (a) =>
                new Paragraph({
                  text: `${a.task || "Task"} - Assigned to: ${a.assignedTo || "Unassigned"} (By: ${a.deadline || "None"})`,
                })
            ),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=HoloMeet_Summary_${meetingId}.docx`
    );
    res.send(buffer);
  } catch (error) {
    console.error("DOCX Generation Error:", error);
    res.status(500).json({ error: "DOCX Generation failed" });
  }
};
