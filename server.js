const express = require("express");
const app = express();

// Init environment variables
require("dotenv").config();

// Parses cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

// Sanitise request bodies and params
let xss = require("xss-clean");
app.use(xss())

// Add auth routes
const authRouter = require("./users/authRoutes");
app.use("/", authRouter);

// Auth jwt middleware for routes below
const verifyToken = require("./middleware/verifyToken");
app.use(verifyToken);

// Add routes
const usersRouter = require("./users/userRoutes");
app.use(usersRouter);

const postRouter = require("./posts/postRoutes");
app.use(postRouter);

const likeRouter = require("./likes/likeRoutes");
app.use(likeRouter);

const commentRouter = require("./comments/commentRoutes");
app.use(commentRouter);

const mongoose = require("mongoose");

// Only insert fields to db if they are specified in schema
mongoose.set("strictQuery", true);

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URI, () => console.log("Database connected"));

const port = process.env.SERVER_PORT
app.listen(port, () => console.log("Server is up"));
