var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const keys = require("./keys/index");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
var passport = require("passport");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
//Routers
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
const adminRouter = require("./routes/admin/index");

//RoutersAdmin
const postsAdminRouter = require("./routes/admin/admin_posts");
const adminUsersRouter = require("./routes/admin/users");
const postsRouter = require("./routes/admin/posts");
const managementAdminRouter = require("./routes/admin/admin_management");
const departamentAdminRouter = require("./routes/admin/admin_departaments");
const tendersAdminRouter = require("./routes/admin/admin_tenders");
const tendersRouter = require("./routes/admin/tenders");
const mainArticleAdminRouter = require("./routes/admin/admin_mainArticle");
const articlesRouter = require("./routes/admin/articles");
const managementRouter = require("./routes/admin/management");
const departamentRouter = require("./routes/admin/departaments");
const adminServicesRouter = require("./routes/admin/admin_services");
const adminDescriptionRouter = require("./routes/admin/admin_descriptionServices");
const DescriptionRouter = require("./routes/admin/descriptionGet");
const ServicesRouter = require("./routes/admin/services");
const adminMainPostsRouter = require("./routes/admin/admin_mainPosts");
const mainPostsRouter = require("./routes/admin/mainPost");
const adminDocumentsRouter = require("./routes/admin/admin_regulatoryDoc");
const documentsRouter = require("./routes/admin/regulatoryDoc");
const adminSeparationsRouter = require("./routes/admin/admin_separationDocs");
const documentsSeparationsRouter = require("./routes/admin/documents");
const adminAnswerQuestionsRouter = require("./routes/admin/admin_askedQuestions");
const answerQuestionsRouter = require("./routes/admin/answerQuestion");
const adminThemesQuestionsRouter = require("./routes/admin/admin_themeOfAskedQuestions");
const themesQuestionsRouter = require("./routes/admin/themesAnswerQuestions");
const adminPricesRouter = require("./routes/admin/admin_price");
const pricesRouter = require("./routes/admin/prices");
const adminAdministrativeServicesRouter = require("./routes/admin/admin_AdministrativeServices");
const administrativeServicesRouter = require("./routes/admin/administrativeServices");
const pageSlugRouter = require("./routes/admin/pageSlug");
const adminPageRouter = require("./routes/admin/admin_pages");
const adminTableRouter = require("./routes/admin/admin_table");
const cors = require("cors");
var app = express();
//for site
var port = process.env.PORT || 3000;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: 4000000000 }));
// var bodyParser = require("body-parser");
app.use(cors());

//mongo
mongoose
  .connect(keys.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.use("/public", express.static("public"));
app.use(express.static("public"));

app.locals.errors = null;
app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(flash());

// Express fileUpload middleware
app.use(fileUpload());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Express Validator middleware
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
    customValidators: {
      isImage: function (value, filename) {
        var extension = path.extname(filename).toLowerCase();
        switch (extension) {
          case ".jpg":
            return ".jpg";
          case ".jpeg":
            return ".jpeg";
          case ".png":
            return ".png";
          case "":
            return ".jpg";
          default:
            return false;
        }
      },
    },
  })
);

// Express Messages middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Passport Config
require("./config/passport")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

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
app.use("/admin", adminRouter);

//admin
app.use("/admin/users", adminUsersRouter);
app.use("/admin/admin_posts", postsAdminRouter);
app.use("/admin/posts", postsRouter);
app.use("/admin/tenders", tendersRouter);
app.use("/admin/admin_management", managementAdminRouter);
app.use("/admin/admin_tenders", tendersAdminRouter);
app.use("/admin/admin_departament", departamentAdminRouter);
app.use("/admin/articles", articlesRouter);
app.use("/admin/admin_article", mainArticleAdminRouter);
app.use("/admin/management", managementRouter);
app.use("/admin/departament", departamentRouter);
app.use("/admin/admin_services", adminServicesRouter);
app.use("/admin/admin_description", adminDescriptionRouter);
app.use("/admin/admin_mainpost", adminMainPostsRouter);
app.use("/admin/description", DescriptionRouter);
app.use("/admin/services", ServicesRouter);
app.use("/admin/mainposts", mainPostsRouter);
app.use("/admin/admin_documents", adminDocumentsRouter);
app.use("/admin/documents", documentsRouter);
app.use("/admin/admin_separations", adminSeparationsRouter);
app.use("/admin/documents_separation", documentsSeparationsRouter);
app.use("/admin/admin_questions", adminAnswerQuestionsRouter);
app.use("/admin/questions", answerQuestionsRouter);
app.use("/admin/admin_themes", adminThemesQuestionsRouter);
app.use("/admin/themes", themesQuestionsRouter);
app.use("/admin/admin_prices", adminPricesRouter);
app.use("/admin/prices", pricesRouter);
app.use("/admin/admin_administration", adminAdministrativeServicesRouter);
app.use("/admin/administration", administrativeServicesRouter);
app.use("/admin/admin_table", adminTableRouter);
app.use("/page", pageSlugRouter);
app.use("/admin_page", adminPageRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
console.log('test')
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

app.listen(port, () => {
  console.log(`server start on port ${port}`);
});

module.exports = app;
