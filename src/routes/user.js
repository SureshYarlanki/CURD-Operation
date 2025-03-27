const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middelware/auth");
const connectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

// Get all pending connection requests received by the logged-in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Fetch all "interested" connection requests for the logged-in user
    const pendingRequests = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate(
        "fromUserId",
        "firstName lastName image age gender  skills about"
      ); // Populate sender info
    // .populate("fromUserId", ["firstName","lastName email"]); // Populate sender info

    if (pendingRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No pending connection requests found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: pendingRequests,
    });
  } catch (error) {
    console.error("Error fetching connection requests:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching connection requests",
      error: error.message,
    });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await connectionRequestModel
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", "firstName lastName image age gender  skills about")
      .populate("toUserId", "firstName lastName image age gender skills about");

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (error) {
    console.error("Error fetching connection requests:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching connection requests",
      error: error.message,
    });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName gender age skills image")
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
