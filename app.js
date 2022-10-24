var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var questionsRouter = require("./routes/questions");
var questionsForEntityRouter = require("./routes/questionsForEntityRouter");
var cylindersRouter = require("./routes/cylindersRouter");
var feedbackRouter = require("./routes/feedbackRouter");
var telemetriaRouter = require("./routes/telemetriaRouter");
var repairRouter = require("./routes/repairRouter");
var maintenanceRouter = require("./routes/maintenanceRouter");
var verificationRouter = require("./routes/verificationRouter");

const cors = require("cors");

var app = express();
//for site
var port = process.env.PORT || 3000;
var bodyParser = require("body-parser");
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
// app.get("*", function (req, res, next) {
//   res.redirect("https://" + req.headers.host + req.path);
// });
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/questions", questionsRouter);
app.use("/question-for-entity", questionsForEntityRouter);
app.use("/cylinders", cylindersRouter);
app.use("/feedback", feedbackRouter);
app.use("/telemetria", telemetriaRouter);
app.use("/repair", repairRouter);
app.use("/maintenance", maintenanceRouter);
app.use("/verification", verificationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
app.use(bodyParser.json({ limit: "400mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "400mb",
    extended: true,
    parameterLimit: 300000,
  })
);

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
  console.log(`server start on port ${port}`);
});

module.exports = app;
