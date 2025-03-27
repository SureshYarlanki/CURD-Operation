const connectDB = require("./config/database");

const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(3000, () => {
      console.log("server successfully connected on port 3000...");
    });
  })
  .catch((err) => {
    console.error({ message: err.message });
  });
