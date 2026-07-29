
import express from "express";
// Removed listAvailableModels to fix the SyntaxError crash
import { generateAISummary } from "../controllers/SummaryController.js"; 
import { downloadSummaryPDF, downloadSummaryDocx } from "../controllers/exportController.js";

const router = express.Router();

// Host triggers summary generation
router.post("/:meetingId/generate", generateAISummary);

// Participants download results
router.get("/:meetingId/download/pdf", downloadSummaryPDF);
router.get("/:meetingId/download/docx", downloadSummaryDocx);

export default router;