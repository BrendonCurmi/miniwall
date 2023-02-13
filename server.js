const express = require("express");
const app = express();

require("dotenv").config();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

// app.use(express.urlencoded({ extended: false }));

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const port = process.env.SERVER_PORT
app.listen(port, () => console.log("Server is up"));
