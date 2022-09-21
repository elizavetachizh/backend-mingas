var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const nodemailer = require("nodemailer");
const inlineBase64 = require("nodemailer-plugin-inline-base64");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var appealRouter = require("./routes/appeal");
var questionsRouter = require("./routes/questions");
var questionsForEntityRouter = require("./routes/questionsForEntityRouter");
var cylindersRouter = require("./routes/cylindersRouter");
var feedbackRouter = require("./routes/feedbackRouter");
var telemetriaRouter = require("./routes/telemetriaRouter");
const cors = require("cors");
const fs = require("fs");
// const options = {
//   key: fs.readFileSync("./ssl/privkey.pem"),
//   cert: fs.readFileSync("./ssl/cert.pem"),
//   ca: fs.readFileSync("./ssl/chain.pem"),
//   requestCert: true,
//   rejectUnauthorized: false,
// };

var app = express();
//for site
var port = process.env.PORT || 3000;

//for me
// var port = process.env.PORT || 9000;
// var http_port = process.env.PORT || 8080;
// var http = require("http");
// const https = require("https").createServer(options, app);

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
 app.use('/public',express.static(path.join(__dirname, "public")));
//  app.use('/public',express.static(path.join(__dirname, "public")));
// app.use('/static', express.static('public'))
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/appeal", appealRouter);
app.use("/questions", questionsRouter);
app.use("/question-for-entity", questionsForEntityRouter);
app.use("/cylinders", cylindersRouter);
app.use("/feedback", feedbackRouter);
app.use("/telemetria", telemetriaRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.get('*', function(req, res, next) {
  var schema = req.headers["x-forwarded-proto"];
  console.log(schema)
//http://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/TerminologyandKeyConcepts.html#x-forwarded-proto
  if (req.get('x-forwarded-proto') !== "https") {
    res.set('x-forwarded-proto', 'https');
    res.redirect('https://' + req.get('host') + req.url);
  } else {
    next();
  }
});
app.use(function (err, req, res, next) {
  console.log(req.headers);
  // var schema = req.headers["x-forwarded-proto"];
  // console.log(schema)
  // if (req.headers["x-forwarded-proto"] === "http") {
  //   return res.redirect(301, "https://mingas.by:9000");
  // } else {
  //   return next();

  // }
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
// http
//   .createServer(function (req, res) {
//     res.writeHead(301, {
//       Location:
//         "https://" + req.headers["host"].replace(http_port, port) + req.url,
//     });
//     console.log("http request, will go to >> ");
//     console.log(
//       "https://" + req.headers["host"].replace(http_port, port) + req.url
//     );
//     res.end();
//   })
//   .listen(http_port, ()=>{
//       console.log(`server start on port ${http_port}`);
//   });
module.exports = app;
