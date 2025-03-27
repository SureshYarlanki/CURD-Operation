const mongoose = require("mongoose");
const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middelware/auth");
const connectionRequestModel = require("../models/connectionRequest");
const User=require("../models/user")


requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id; // Retrieved from authenticated user
      const toUserId = req.params.toUserId; // Retrieved from route parameter
      const status = req.params.status;

      // Validate status value
      const validStatuses = ["ignored", "interested"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value " + status,
        });
      }

    const toUser=await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({success:false, message:"User not found"});
    }


      // Prevent duplicate connection requests
      const existingRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(409).json({
          success: false,
          message: "A connection request already exists between these users",
        });
      }

      // Create a new connection request
      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      return res.status(201).json({
        success: true,
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (error) {
      console.error("Error sending connection request:", error.message);
      return res.status(500).json({
        success: false,
        message: "Server error while sending connection request",
        error: error.message,
      });
    }
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // // Validate ObjectId
      // if (!mongoose.Types.ObjectId.isValid(requestId)) {
      //   return res.status(400).json({ message: "Invalid requestId format" });
      // } 

      // const status = rawStatus.trim();
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      // Log inputs
      console.log("RequestId:", requestId);
      console.log("ToUserId:", loggedInUser._id);
      console.log("Status filter: 'interested'");

      // Query the connection request
      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found",
          details: {
            requestId,
            toUserId: loggedInUser._id,
            status: "interested",
          },
        });
      }

      // Update status
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      return res.status(200).json({
        success: true,
        message: `Connection request ${status} successfully`,
        data,
      });
    } catch (error) {
      console.error("Error processing connection request:", error.message);
      return res.status(500).json({
        success: false,
        message: "Server error while processing connection request",
        error: error.message,
      });
    }
  }
);





module.exports = requestRouter;
