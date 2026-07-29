// routes/profile.js
import express from "express";
import Register from "../models/Registration.js";

const router = express.Router();

// GET /api/profile?email=user@example.com
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email query param is required" });
    }

    const user = await Register.findOne({ Email: email }).select("-Password -Con_Password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/profile
router.put("/", async (req, res) => {
  try {
    const { Email, Firstname, Secondname, DOB, Department, Phonenumber, Usertype } = req.body;

    if (!Email) {
      return res.status(400).json({ message: "Email is required in request body" });
    }

    const updateFields = {};
    if (Firstname !== undefined)  updateFields.Firstname   = Firstname;
    if (Secondname !== undefined) updateFields.Secondname  = Secondname;
    if (DOB !== undefined && DOB) updateFields.DOB         = new Date(DOB);
    if (Department !== undefined) updateFields.Department  = Department;
    if (Phonenumber !== undefined)updateFields.Phonenumber = Phonenumber;
    if (Usertype !== undefined)   updateFields.Usertype    = Usertype;

    const updated = await Register.findOneAndUpdate(
      { Email: Email },
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-Password -Con_Password");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updated });
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;  // ← this line is what was missing in your old filec