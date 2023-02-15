const express = require("express");
const app = express();

require("dotenv").config();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

// app.use(express.urlencoded({ extended: false }));

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const usersRouter = require("./users/userRoutes");
app.use("/user", usersRouter);

const mongoose = require("mongoose");

// Only insert fields to db if they are specified in schema
mongoose.set("strictQuery", true);

mongoose.connect(process.env.DATABASE_URI, () => console.log("Db connected"));

const port = process.env.SERVER_PORT
app.listen(port, () => console.log("Server is up"));
