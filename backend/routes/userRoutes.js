import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

// This handles: GET http://localhost:5000/api/profile
router.get("/profile", getProfile);

// This handles: PUT http://localhost:5000/api/profile
router.put("/profile", updateProfile);

export default router;