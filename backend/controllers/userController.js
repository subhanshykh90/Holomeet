//usercontrollers.js
import Register from '../Models/Registration.js';

export const getProfile = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // .select("-Password") ensures you don't send the hashed password to the frontend
    const user = await Register.findOne({ Email: email }).select("-Password");
    
    if (!user) {
      return res.status(404).json({ message: "Register not found" });
    }

    console.log(user)
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error fetching profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userEmail = req.body.Email;

    if (!userEmail) {
      return res.status(400).json({ message: "Email is required to update profile" });
    }

    const updateData = {
      Firstname: req.body.Firstname,
      Secondname: req.body.Secondname,
      Department: req.body.Department.trim(),
      EmployeeID: req.body.EmployeeID,
      Phonenumber: req.body.Phonenumber,
      OfficeLocation: req.body.OfficeLocation,
    };


    // runValidators: true ensures the new data matches your Schema rules
    const updatedUser = await Register.findOneAndUpdate(
      { Email: userEmail },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-Password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Register not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Profile Update Error:", error);
    // If it's a validation error (e.g. wrong phone format), send a 400 instead of 500
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error updating profile" });
  }
};