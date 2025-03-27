const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middelware/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Patch route for editing profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);

    // Validate request body
    validateEditProfileData(req);
    console.log("Validation passed for:", req.body);

    const loggedInUser = req.user;

    if (!loggedInUser) {
      console.error("No user found in request context.");
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }

    console.log("Logged-in user before update:", loggedInUser);

    // Update allowed fields
    Object.assign(loggedInUser, req.body);

    // Save updated user to the database
    try {
      await loggedInUser.save();
      console.log("User profile updated successfully in the database.");
    } catch (err) {
      console.error("Error saving user to database:", err.message);
      return res.status(500).json({ error: "Database error occurred." });
    }

    // Respond with updated user data
    const { firstName, lastName, age, about, skills, gender, image } =
      loggedInUser;

    return res.status(200).json({
      message: "User profile updated successfully.",
      data: { firstName, lastName, age, about, skills, gender, image },
    });
  } catch (error) {
    console.error("Error in /profile/edit route:", error.message, error.stack);

    if (error.message.startsWith("Invalid")) {
      return res.status(400).json({ error: error.message });
    }

    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
});



module.exports = profileRouter;
