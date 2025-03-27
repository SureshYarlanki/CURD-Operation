const validator = require("validator");
const User = require("../models/user");

// const validateSignUpData = async (req) => {
//   // Extract data from request body
//   const { email, mobile, firstName, lastName, password,gender, verifyPassword  } = req.body;

//   // Check if user already exists
//   const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
//   if (existingUser) {
//     throw new Error("User with this email or mobile already exists");
//   }

//   if (!firstName ) {
//     throw new Error("Name is not valid");
//   }
//   // ✅ Check if all required fields are provided
//   else if (!mobile || !gender || !verifyPassword) {
//     return res
//       .status(400)
//       .json({ success: false, message: "All fields are required" });
//   } else if (!validator.isEmail(email)) {
//     throw new Error("Invalid Email ID");
//   } else if (!validator.isStrongPassword(password)) {
//     throw new Error("Please enter a strong password");
//   }
//   // ✅ Validate password match before saving
//   else if (password !== verifyPassword) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Passwords do not match" });
//   }
// };
// const validateEditProfileData=(req)=>{
//     if (!req.body || typeof req.body !== "object") return false;
//   const allowedEditFields=[
//     "firstName",
//     "lastName",
//     "age",
//     "about",
//     "skills",
//     "gender"
//   ]
//   const isEditAllowed = Object.keys(req.body).every((field) =>
//     allowedEditFields.includes(field)
//   );
// return isEditAllowed;
// }
// Function to validate edit profile data

const validateSignUpData = async (data) => {
  const { email, firstName, password, userName } = data;

  // Check if all required fields are provided
  if (!email || !firstName || !password || !userName) {
    throw new Error("All fields are required");
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }

  // Check if password is strong
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be strong (e.g., include uppercase, numbers, symbols)"
    );
  }

  // Check if passwords match
  // if (password !== verifyPassword) {
  //   throw new Error("Passwords do not match");
  // }

  // Check if the user already exists in the database
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("A user with this email already exists");
  }
};


const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "about",
    "skills",
    "gender",
    "image",
  ];
  const bodyKeys = Object.keys(req.body);

  // Ensure all fields in the request body are allowed
  const isEditAllowed = bodyKeys.every((field) =>
    allowedEditFields.includes(field)
  );
  if (!isEditAllowed) {
    throw new Error("Invalid fields provided in the edit request.");
  }

  // Validate specific fields for types and constraints
  if (
    "age" in req.body &&
    (typeof req.body.age !== "number" || req.body.age <= 0)
  ) {
    throw new Error("Age must be a positive number.");
  }
  if ("skills" in req.body) {
    if (
      !Array.isArray(req.body.skills) ||
      !req.body.skills.every((skill) => typeof skill === "string")
    ) {
      throw new Error("Skills must be an array of strings.");
    }
  }
  if ("about" in req.body && typeof req.body.about !== "string") {
    throw new Error("About must be a string.");
  }
  if (
    "gender" in req.body &&
    !["Male", "Female", "Other"].includes(req.body.gender)
  ) {
    throw new Error("Gender must be 'Male', 'Female', or 'Other'.");
  }
  if ("image" in req.body && typeof req.body.image !== "string") {
    throw new Error("Image URL must be a string.");
  }

  return true;
};

module.exports = { validateSignUpData, validateEditProfileData };
