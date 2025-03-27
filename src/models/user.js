// const mongoose = require("mongoose");
// const validator = require("validator");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// const userSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//       minLength: 3,
//       maxLength: 50,
//     },
//     lastName: {
//       type: String,
//       required: !true,
//       maxLength: 50,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       validate(value) {
//         if (!validator.isEmail(value)) {
//           throw new Error("Invalid Email");
//         }
//       },
//     },
//     userName: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true, // Removes leading/trailing spaces
//       minlength: 3, // Minimum length of 3 characters
//       maxlength: 30, // Maximum length of 30 characters
//       match: /^[a-zA-Z0-9_]+$/, // Allows only alphanumeric characters and underscores
//     },

//     gender: {
//       type: String,
//       enum: ["Male", "Female", "Others"],
//       default: "Others",
//     },
//     image: {
//       type: String,
//       default: "https://placekitten.com/200/200",
//     },
//     age: {
//       type: Number,
//       default: 18,
//     },
//     about: {
//       type: String,
//       maxLength: 50,
//       default: "I am a Frontend Developer",
//     },
//     skills: {
//       type: [String], // Array of strings
//       default: ["HTML", "CSS", "JavaScript"],
//     },
//     mobile: {
//       type: String,
//       trim: true,
//       unique: true, // Unique constraint
//       match: [/^\d{10}$/, "Mobile number must be 10 digits"], // Regex validation
//     },
//     password: {
//       type: String,
//       required: true,
//       validate(value) {
//         if (!validator.isStrongPassword(value)) {
//           throw new Error("Enter a strong password.");
//         }
//       },
//     },
//   },
//   { timestamps: true }
// );

// // Pre-save hook for password hashing
// // userSchema.pre("save", async function (next) {
// //   const user = this;
// //   if (user.isModified("password")) {
// //     user.password = await bcrypt.hash(user.password, 10);
// //   }
// //   next();
// // });
// userSchema.pre("save", async function (next) {
//   const user = this;
//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 10);
//   }
//   next();
// });
// console.log("Pre-save middleware triggered");


// // Generate JWT
// userSchema.methods.getJWT = async function () {
//   const user = this;
//   const token = jwt.sign({ _id: user._id }, "Suresh@123", { expiresIn: "1d" });
//   return token;
// };

// // Validate Password
// // userSchema.methods.validatePassword = async function (passwordInputByUser) {
// //   const user = this;
// //   return bcrypt.compare(passwordInputByUser, user.password);
// // };
// userSchema.methods.validatePassword = async function (passwordInputByUser) {
//   return bcrypt.compare(passwordInputByUser, this.password);
// };


// // Static method for finding user by credentials
// userSchema.statics.findByCredentials = async function (email, password) {
//   const user = await this.findOne({ email });
//   if (!user) {
//     throw new Error("Invalid login credentials.");
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     throw new Error("Invalid login credentials.");
//   }

//   return user;
// };

// const User = mongoose.model("User", userSchema);
// module.exports = User;



const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [3, "First name must be at least 3 characters"],
      maxLength: [50, "First name cannot exceed 50 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      maxLength: [50, "Last name cannot exceed 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores",
      ],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      default: "Others",
    },
    image: {
      type: String,
      default: "https://placekitten.com/200/200",
    },
    age: {
      type: Number,
      default: 18,
      min: [13, "You must be at least 13 years old"],
    },
    about: {
      type: String,
      maxLength: [50, "About cannot exceed 50 characters"],
      default: "I am a Frontend Developer",
    },
    skills: {
      type: [String],
      default: ["HTML", "CSS", "JavaScript"],
    },
    mobile: {
      type: String,
      trim: true,
      unique: true,
      default:undefined,
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message:
          "Password must be at least 8 characters with at least 1 lowercase, 1 uppercase, 1 number and 1 symbol",
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

 
userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "Suresh@123", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};
const User = mongoose.model("User", userSchema);
module.exports = User;