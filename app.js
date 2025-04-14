import createError from "http-errors";
import express from "express";
import expressMessages from "express-messages";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";
import { keys } from "./keys/index.js";
import expressLayouts from "express-ejs-layouts";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import expressValidator from "express-validator";
import Passport from "./config/passport.js";
//Routers
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import questionsRouter from "./routes/questions.js";
import questionsForEntityRouter from "./routes/questionsForEntityRouter.js";
import cylindersRouter from "./routes/cylindersRouter.js";
import feedbackRouter from "./routes/feedbackRouter.js";
import telemetriaRouter from "./routes/telemetriaRouter.js";
import repairRouter from "./routes/repairRouter.js";
import maintenanceRouter from "./routes/maintenanceRouter.js";
import verificationRouter from "./routes/verificationRouter.js";
import adminRouter from "./routes/GetQuery/index.js";
import newFeedback from "./routes/newFormFeedBack.js";
import weldingRouter from "./routes/weldingRouter.js";

//RoutersAdmin
import postsAdminRouter from "./routes/admin/admin_posts.js";
import corruptionAdminRouter from "./routes/admin/admin_corruption.js";
import adminUsersRouter from "./routes/GetQuery/users.js";
import postsRouter from "./routes/GetQuery/posts.js";
import managementAdminRouter from "./routes/admin/admin_management.js";
import departamentAdminRouter from "./routes/admin/admin_departaments.js";
import tendersAdminRouter from "./routes/admin/admin_tenders.js";
import tendersRouter from "./routes/GetQuery/tenders.js";
import mainArticleAdminRouter from "./routes/admin/admin_mainArticle.js";
import articlesRouter from "./routes/GetQuery/articles.js";
import managementRouter from "./routes/GetQuery/management.js";
import departamentRouter from "./routes/GetQuery/departaments.js";
import adminServicesRouter from "./routes/admin/admin_services.js";
import adminDescriptionRouter from "./routes/admin/admin_descriptionServices.js";
import DescriptionRouter from "./routes/GetQuery/descriptionGet.js";
import ServicesRouter from "./routes/GetQuery/services.js";
import adminMainPostsRouter from "./routes/admin/admin_mainPosts.js";
import mainPostsRouter from "./routes/GetQuery/mainPost.js";
import adminDocumentsRouter from "./routes/admin/admin_regulatoryDoc.js";
import documentsRouter from "./routes/GetQuery/regulatoryDoc.js";
import adminSeparationsRouter from "./routes/admin/admin_separationDocs.js";
import documentsSeparationsRouter from "./routes/GetQuery/documents.js";
import adminAnswerQuestionsRouter from "./routes/admin/admin_askedQuestions.js";
import answerQuestionsRouter from "./routes/GetQuery/answerQuestion.js";
import adminThemesQuestionsRouter from "./routes/admin/admin_themeOfAskedQuestions.js";
import themesQuestionsRouter from "./routes/GetQuery/themesAnswerQuestions.js";
import pricesRouter from "./routes/GetQuery/prices.js";
import corruptionRouter from "./routes/GetQuery/corruption.js";
import adminAdministrativeServicesRouter from "./routes/admin/admin_AdministrativeServices.js";
import administrativeServicesRouter from "./routes/GetQuery/administrativeServices.js";
import pageSlugRouter from "./routes/GetQuery/pageSlug.js";
import adminPageRouter from "./routes/admin/admin_pages.js";
import adminTableRouter from "./routes/admin/admin_table.js";
import tableRouter from "./routes/GetQuery/tables.js";
import adminPhotosRouter from "./routes/admin/admin_photos.js";
import adminOgonekRouter from "./routes/admin/admin_ogonek.js";
import ogonekRouter from "./routes/GetQuery/infoOgonek.js";
import adminTVRouter from "./routes/admin/admin_mingasTV.js";
import TVRouter from "./routes/GetQuery/TV.js";
import adminDocumentsEDIRouter from "./routes/admin/admin_edi.js";
import documentsEDIRouter from "./routes/GetQuery/documentsEDI.js";
import adminGratitudeRouter from "./routes/admin/admin_gratitude.js";
import gratitudeRouter from "./routes/GetQuery/gratitude.js";
import adminVacanciesRouter from "./routes/admin/admin_vacancies.js";
import vacanciesRouter from "./routes/GetQuery/vacancies.js";
import pricesAdminRouter from "./routes/admin/admin_prices.js";
import adminIlliquidsRouter from "./routes/admin/admin_illiquids.js";
import illiquidsRouter from "./routes/GetQuery/illiquids.js";
import adminDocumentationRouter from "./routes/admin/admin_documentation.js";
import documentationRouter from "./routes/GetQuery/documentation.js";
import adminNewspapersRouter from "./routes/admin/admin_newspaper.js";
import newspapersRouter from "./routes/GetQuery/newspapersGet.js";
import usefulResourcesAdminRouter from "./routes/admin/admin_useful_resources.js";
import usefulResourcesRouter from "./routes/GetQuery/useful_resources.js";

import cors from "cors";
import { fileURLToPath } from "url";


const app = express();
//for site
const port = 3000;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: 4000000000 }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(cors());

//mongo
mongoose
  .connect(keys.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

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
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
});

// Passport Config
Passport(passport);
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
app.use("/submit-survey", newFeedback);
app.use("/welding", weldingRouter);

//admin
app.use("/admin/admin_posts", postsAdminRouter);
app.use("/admin/admin_corruption", corruptionAdminRouter);
app.use("/admin/admin_management", managementAdminRouter);
app.use("/admin/admin_tenders", tendersAdminRouter);
app.use("/admin/admin_departament", departamentAdminRouter);
app.use("/admin/admin_article", mainArticleAdminRouter);
app.use("/admin/admin_services", adminServicesRouter);
app.use("/admin/admin_description", adminDescriptionRouter);
app.use("/admin/admin_mainpost", adminMainPostsRouter);
app.use("/admin/admin_ogonek", adminOgonekRouter);
app.use("/admin/admin_TV", adminTVRouter);
app.use("/admin/admin_documents", adminDocumentsRouter);
app.use("/admin/admin_separations", adminSeparationsRouter);
app.use("/admin/admin_questions", adminAnswerQuestionsRouter);
app.use("/admin/admin_themes", adminThemesQuestionsRouter);
app.use("/admin/admin_prices", pricesAdminRouter);
app.use("/admin/admin_administration", adminAdministrativeServicesRouter);
app.use("/admin/administration", administrativeServicesRouter);
app.use("/admin/admin_table", adminTableRouter);
app.use("/page", pageSlugRouter);
app.use("/admin_page", adminPageRouter);
app.use("/admin/admin_vacancies", adminVacanciesRouter);
app.use("/admin/admin_illiquids", adminIlliquidsRouter);
app.use("/admin/edi", adminDocumentsEDIRouter);
app.use("/admin/documentations", adminDocumentationRouter);
app.use("/admin/newspapers", adminNewspapersRouter);
app.use("/admin/useful-resources", usefulResourcesAdminRouter);

//for user
app.use("/admin/vacancies", vacanciesRouter);
app.use("/admin/users", adminUsersRouter);
app.use("/admin/upload", adminPhotosRouter);
app.use("/admin/TV", TVRouter);
app.use("/admin/documents_edi", documentsEDIRouter);
app.use("/admin/gratitude", adminGratitudeRouter);
app.use("/admin/gratitude_get", gratitudeRouter);
app.use("/admin/posts", postsRouter);
app.use("/admin/corruption", corruptionRouter);
app.use("/admin/tenders", tendersRouter);
app.use("/admin/articles", articlesRouter);
app.use("/admin/management", managementRouter);
app.use("/admin/departament", departamentRouter);
app.use("/admin/description", DescriptionRouter);
app.use("/admin/services", ServicesRouter);
app.use("/admin/mainposts", mainPostsRouter);
app.use("/admin/documents", documentsRouter);
app.use("/admin/documents_separation", documentsSeparationsRouter);
app.use("/admin/questions", answerQuestionsRouter);
app.use("/admin/themes", themesQuestionsRouter);
app.use("/admin/prices", pricesRouter);
app.use("/admin/table", tableRouter);
app.use("/admin/ogonek", ogonekRouter);
app.use("/admin/illiquids", illiquidsRouter);
app.use("/admin/gratitude_get", gratitudeRouter);
app.use("/admin/certificates", documentationRouter);
app.use("/admin/newspapers_get", newspapersRouter);
app.use("/admin/useful_resources", usefulResourcesRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.listen(port, () => {
  console.log(`server start on port ${port}`);
});

export default app;
