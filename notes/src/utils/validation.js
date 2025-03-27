const validator = require("validator");
const User = require("../modules/user");

const validateSignUpData = async (req) => {
  // Extract data from request body
  const { email, mobile, firstName, lastName, password,gender, verifyPassword  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
  if (existingUser) {
    throw new Error("User with this email or mobile already exists");
  }

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  }
  // ✅ Check if all required fields are provided
  else if (!mobile || !gender || !verifyPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email ID");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
  // ✅ Validate password match before saving
  else if (password !== verifyPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }
};

module.exports = { validateSignUpData };
