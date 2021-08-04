const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoutes");
const CreatorRouter = require("./routes/contentCreatorRoutes");
const StudentRouter = require("./routes/StudentRoutes");
const AdminRouter = require("./routes/AdminRoutes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();

// Utility middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://prakash:prks18@quiz-app-cluster.zvvdi.mongodb.net/quiz-app-cluster?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes handling
app.use(authRouter);
app.use("/student", StudentRouter);
app.use("/creator", CreatorRouter);
app.use("/admin", AdminRouter);
