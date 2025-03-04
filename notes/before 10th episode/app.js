const express = require("express");
const mongoose = require("mongoose");
const bcrypt=require("bcrypt")
const app = express();
const connectDB = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const User = require("./modules/user");
app.use(express.json());



app.post("/signUp", async (req, res) => {
    try {
        await validateSignUpData(req);

        const { firstName, lastName, email, password, mobile, gender } = req.body;

        // ✅ Validate gender values
        const validGenders = ["Male", "Female", "Other"];
        if (!validGenders.includes(gender)) {
            return res.status(400).json({ success: false, message: "Invalid gender value" });
        }

        // ✅ Corrected: Await the password hashing
        const passwordHash = await bcrypt.hash(password, 10); // ✅ FIXED
        console.log("Entered Password:", password);
        console.log("Hashed Password Before Saving:", passwordHash);  // ✅ Debugging Log

        // ✅ Create a new user without storing verifyPassword
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash, // Store only hashed password
            mobile,
            gender,
        });

        await user.save();

        res.status(201).json({ success: true, message: "User added successfully", user });
    } catch (error) {
        console.error("SignUp Error:", error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});



  
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials. User not found." });
        }

        console.log("Entered Password:", password);
        console.log("Stored Hashed Password:", user.password);  // ✅ Debugging Log

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials. Incorrect password." });
        }

        res.status(200).json({ success: true, message: "Login Successful!" });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});



  

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}).lean(); // Using .lean() for better performance
    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error); // Logging the error for debugging
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL params

    // Validate userId
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Find and delete user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser, // Optional: send deleted user data
    });
  } catch (error) {
    console.error("Delete User Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.patch("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("User ID to Update:", id);
    console.log("Update Data Received:", updateData);

    // Validate if ID is provided
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Prevent updating email & mobile
    if (updateData.email || updateData.mobile) {
      return res.status(400).json({
        success: false,
        message: "Updating email or mobile number is not allowed",
      });
    }

    // Define allowed fields based on your User schema
    const allowedFields = [
      "firstName",
      "lastName",
      "gender",
      "password",
      "verifyPassword",
    ]; // Add all valid fields here

    // Check if any key in updateData is not allowed
    const invalidFields = Object.keys(updateData).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid field(s) in request: ${invalidFields.join(", ")}`,
      });
    }

    // Check if user exists before updating
    const existingUser = await User.findById(id);
    console.log("Existing User:", existingUser);

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update user with allowed fields only
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log("Updated User:", updatedUser);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

connectDB()
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(3000, () => {
      console.log("server successfully connected on port 3000...");
    });
  })
  .catch((err) => {
    console.error({ message: err.message });
  });
