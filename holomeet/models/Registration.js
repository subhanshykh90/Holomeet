// holomeet/models/Registration.js
import mongoose from "mongoose";

const Registration_Schema = new mongoose.Schema({
  Firstname:    { type: String, default: "" },
  Secondname:   { type: String, default: "" },
  Email:        { type: String, required: true, unique: true },
  Phonenumber:  { type: String, default: "" },
  Usertype:     { type: String, enum: ["Student", "Teacher"], default: "Student" },
  DOB:          { type: Date,   default: null },
  Department:   { type: String, default: "" },
  Password:     { type: String, default: "" },
  Con_Password: { type: String, default: "" },
}, { timestamps: true });

// prevent model recompilation error in Next.js hot reload
const Register = mongoose.models.Registration || mongoose.model("Registration", Registration_Schema);
export default Register;