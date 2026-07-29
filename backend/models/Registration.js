// models/Registration.js
import mongoose from "mongoose";

const Registration_Schema = new mongoose.Schema({
  Firstname:   { type: String, required: true },
  Secondname:  { type: String, default: "" },           // not required — Google users won't have it
  Email:       { type: String, required: true, unique: true },
  Phonenumber: { type: String, default: "" },           // not required — Google users won't have it
  Usertype:    { type: String, required: true, enum: ["Student", "Teacher"], default: "Student" },
  DOB:         { type: Date, default: null },           // not required — Google users won't have it
  Password:    { type: String, default: "" },           // not required — Google users have no password
  Con_Password:{ type: String, default: "" },           // not required — same reason
}, { timestamps: true });

const Register = mongoose.models.Registration || mongoose.model("Registration", Registration_Schema);
export default Register;