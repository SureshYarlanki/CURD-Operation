// const express = require("express");
// const authRouter = express.Router();
// const { validateSignUpData } = require("../utils/validation");
// const bcrypt = require("bcrypt");
// const User = require("../models/user");

// // authRouter.post("/signUp", async (req, res) => {
// //   try {
// //     // Validate the incoming data
// //     await validateSignUpData(req);

// //     const { firstName, lastName, email, password } = req.body;

// //     // Check if the email is already registered
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Email is already registered. Please log in instead.",
// //       });
// //     }

// //     // Hash the password securely
// //     const passwordHash = await bcrypt.hash(password, 10);

// //     // Create a new user instance
// //     const user = new User({
// //       firstName,
// //       lastName,
// //       email,
// //       password: passwordHash,
// //     });

// //     // Save the user in the database
// //     const savedUser = await user.save();

// //     // Generate a JWT token for authentication
// //     const token = await savedUser.getJWT();

// //     // Set the JWT as an HTTP-only cookie
// //     res.cookie("token", token, {
// //       httpOnly: true,
// //       sameSite: "strict",
// //       secure: process.env.NODE_ENV === "production", // Use secure cookies in production
// //       maxAge: 24 * 60 * 60 * 1000, // 1 day
// //     });

// //     // Respond with the newly created user details
// //     res.status(201).json({
// //       success: true,
// //       message: "User registered successfully.",
// //       data: {
// //         id: savedUser._id,
// //         firstName: savedUser.firstName,
// //         lastName: savedUser.lastName,
// //         email: savedUser.email,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("SignUp Error:", error.message);
// //     res.status(400).json({
// //       success: false,
// //       message: error.message || "An error occurred during sign-up.",
// //     });
// //   }
// // });
// authRouter.post("/signUp", async (req, res) => {
//   try {
//     const { firstName, email, password, userName, mobile } = req.body;

//     // Check if the email or username is already registered
//     const existingUser = await User.findOne({
//       $or: [{ email }, { userName }, { mobile }],
//     });

//     if (existingUser) {
//       const conflictField = existingUser.email === email ? "Email" : "Username";
//       return res.status(400).json({
//         success: false,
//         message: `${conflictField} is already taken. Please choose another one.`,
//       });
//     }

//     // Hash the password
//     const passwordHash = await bcrypt.hash(password, 10);

//     // Create a new user
//     const user = new User({
//       firstName,
//       mobile,
//       email,
//       password: passwordHash,

//       userName,
//     });

//     // Save the user to the database
//     const savedUser = await user.save();

//     // Generate JWT token
//     const token = await savedUser.getJWT();

//     // Set token as HTTP-only cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     });

//     // Respond with user details (without sensitive information)
//     res.status(201).json({
//       success: true,
//       message: "User registered successfully.",
//       data: {
//         id: savedUser._id,
//         firstName: savedUser.firstName,
//         email: savedUser.email,
//         userName: savedUser.userName,
//         userName: savedUser.mobile,

//       },
//     });
//   } catch (error) {
//     console.error("SignUp Error:", error.message);

//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Username or email is already taken.",
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: error.message || "An error occurred during sign-up.",
//     });
//   }
// });

// authRouter.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and password are required",
//       });
//     }

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Invalid credentials. Please enter a valid email and password.",
//       });
//     }

//     // Validate password
//     const isPasswordValid = await user.validatePassword(password);
//     if (!isPasswordValid) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Invalid credentials. Please enter a valid email and password.",
//       });
//     }

//     // Generate JWT token
//     const token = await user.getJWT();

//     // Set the token in a cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     });

//     // Respond with success
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token, // Optional: Include the token in the response body
//     });
//   } catch (error) {
//     console.error("Login Error:", error.message);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// });

// authRouter.post("/logout", async (req, res) => {
//   res.cookie("token", null, { expires: new Date(0) });
//   res.status(200).json({
//     success: true,
//     message: "Logged out successfully",
//   });
// });

// module.exports = authRouter;

const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {validateSignUpData}=require("../utils/validation")

// authRouter.post("/signup", async (req, res) => {
//   console.log("Signup request received:", req.body);
//   try {
//     const { firstName, userName, email, password } = req.body;
//     console.log("Parsed signup data:", { firstName, userName, email });

//     if (!firstName || !userName || !email || !password) {
//       console.log("Missing required fields");
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       console.log("Email already exists:", email);
//       return res.status(400).json({
//         success: false,
//         message: "Email is already registered",
//       });
//     }

//     console.log("Hashing password...");
//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log("Password hashed successfully");

//     const user = new User({
//       firstName,
//       userName,
//       email,
//       password: passwordHash,
//     });

//     console.log("Saving user to database...");
//     const savedUser = await user.save();
//     console.log("User saved successfully:", savedUser._id);

//     const token = await savedUser.getJWT();
//     console.log("JWT token generated");

//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       data: {
//         id: savedUser._id,
//         firstName: savedUser.firstName,
//         userName: savedUser.userName,
//         email: savedUser.email,
//       },
//     });
//   } catch (error) {
//     console.error("SignUp Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error during sign-up",
//       error: error.message,
//     });
//   }
// });
// authRouter.post("/signup", async (req, res) => {
//   console.log("Signup request received:", req.body);

//   try {
//     const { firstName, userName, email, password } = req.body;

//     // Validate required fields
//     if (!firstName || !userName || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // Check if the email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is already registered",
//       });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save the user
//     const user = new User({
//       firstName,
//       userName,
//       email,
//       password: hashedPassword,
//     });

//     const savedUser = await user.save();

//     // Generate JWT
//     const token = jwt.sign({ id: savedUser._id }, "Suresh@123", {
//       expiresIn: "1d",
//     });

//     // Set the token in cookies
//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     });

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       data: {
//         id: savedUser._id,
//         firstName: savedUser.firstName,
//         userName: savedUser.userName,
//         email: savedUser.email,
//       },
//     });
//   } catch (error) {
//     console.error("SignUp Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error during sign-up",
//       error: error.message,
//     });
//   }
// });
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate signup data
    await validateSignUpData(req.body);

    const { firstName, userName, email, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = new User({
      firstName,
      userName,
      email,
      password: passwordHash,
    });

    // Save the user to the database
    const savedUser = await user.save();

    // Generate JWT token
    const token = await savedUser.getJWT();

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        userName: savedUser.userName,
        email: savedUser.email,
      },
    });
  } catch (err) {
    console.error("Error during signup:", err.message);
    res.status(400).json({
      success: false,
      message: `Error: ${err.message}`,
    });
  }
});


authRouter.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("Comparing passwords...");
    const isPasswordValid = await user.validatePassword(password);
    console.log("Password comparison result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = await user.getJWT();
    console.log("Generated token for user:", user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        userName: user.userName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
      error: error.message,
    });
  }
});

authRouter.post("/logout", (req, res) => {
  console.log("Logout request received");
  res.cookie("token", null, { expires: new Date(0) });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = authRouter;