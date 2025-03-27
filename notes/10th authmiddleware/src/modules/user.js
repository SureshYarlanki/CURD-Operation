const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error({Success:false, message:"Invalid Email", value})
            }
      }
    },
    gender: {
      type: String,
      required: true,
      set: function (value) {
        if (!value) return value;
        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        console.log("Formatted gender:", formattedValue); // Log transformed value
        return formattedValue;
      },
      validate: {
        validator: function (value) {
          return ["Male", "Female", "Others"].includes(value);
        },
        message: "Invalid gender value",
      },
    },
        
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      unique: true,
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
    },
    password: {
      type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error({Success:false, message:"Enter a strong Password", value})
            }
      }
    },
    verifyPassword: {
        type: String,
        
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords do not match",
      },
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("User", userSchema);

const User = mongoose.model("User", userSchema);
module.exports = User;
