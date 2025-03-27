const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to User model
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["ignored", "interested", "accepted", "rejected"],
      default: "interested",
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({fromUserId:1, toUserId:1})

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("connect send the connection request to yourself");
  }
  next();
});

// Prevent duplicate model declarations
const connectionRequestModel =
  mongoose.models.connectionRequest ||
  mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = connectionRequestModel;
