// const jwt = require("jsonwebtoken");
// const User = require("../models/user"); // Fixed "modules" to "models"
// const cookieParser = require("cookie-parser");

// // Middleware to authenticate user using JWT from cookies
// const userAuth = async (req, res, next) => {
//   try {
//     // Read the token from cookies
//     const { token } = req.cookies;
//     if (!token) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Please Login!!!" });
//     }

//     // Validate and decode the token
//     const decodedObj = jwt.verify(token, "Suresh@123"); // Use environment variable for security

//     // Find the user in the database
//     const user = await User.findById(decodedObj._id);
//     if (!user) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized: User not found" });
//     }

//     // Attach user to request object
//     req.user = user;
//     next(); // Proceed to the next middleware
//   } catch (error) {
//     console.error("Authentication Error:", error.message);
//     return res
//       .status(401)
//       .json({ success: false, message: "Unauthorized: Invalid token" });
//   }
// };

// module.exports = { userAuth };


const jwt = require("jsonwebtoken");
const User = require("../models/user");
const cookieParser = require("cookie-parser");

// Middleware to authenticate user using JWT from cookies
const userAuth = async (req, res, next) => {
  try {
    // Read the token from cookies
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Please Login!!!" });
    }

    // Validate and decode the token
    const decodedObj = jwt.verify(token, "Suresh@123"); // Secure with environment variable

    // Find the user in the database
    const user = await User.findById(decodedObj._id).select(
      "firstName lastName email userName"
    );
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" });
    }

    // Attach user to request object
    req.user = user;
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Authentication Error:", error.message);

    const errorMessage =
      error.name === "TokenExpiredError"
        ? "Unauthorized: Token has expired"
        : "Unauthorized: Invalid token";

    return res.status(401).json({ success: false, message: errorMessage });
  }
};

module.exports = { userAuth };
