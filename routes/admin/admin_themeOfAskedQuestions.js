import express from "express";
const adminThemesQuestionsRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import alert from "alert";
import ThemeOfAskedQuestions from "../../models/themeOfAskedQuestions.js";
import AskedQuestions from "../../models/askedQuestions.js";

adminThemesQuestionsRouter.get("/", isAdmin, function (req, res) {
  var count;
  ThemeOfAskedQuestions.count(function (err, c) {
    count = c;
  });
  ThemeOfAskedQuestions.find({})
    .populate("questionAnswer")

    .exec(function (err, themes) {
      if (err) {
        console.log(err);
      }
      res.render("admin/admin_themes", {
        themes: themes,
      });
    });
});
/*
 * GET add product
 */
adminThemesQuestionsRouter.get("/add-themes", isAdmin, function (req, res) {
  var title = "";
  var questionAnswer = [];
  AskedQuestions.find(function (err, arrayOfAsks) {
    if (err) console.log(err);

    res.render("admin/add_themes", {
      title,
      questionAnswer,
      arrayOfAsks,
    });
  });
});

adminThemesQuestionsRouter.post("/add-themes", function (req, res) {
  const title = req.body.title;
  const questionAnswer = req.body.question;
  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/add_themes", {
      errors,
    });
  } else {
    ThemeOfAskedQuestions.findOne({ title })
      .populate("questionAnswer")
      .exec(function (err, themes) {
        if (themes) {
          res.render("admin/add_separations", {
            title,
            questionAnswer,
          });
        } else {
          var newThemes = new ThemeOfAskedQuestions({
            title,
            questionAnswer,
          });
          newThemes.save(function (err) {
            if (err) {
              return console.log(err);
            }
            req.flash("success", "themes добавлен");
            res.redirect("/admin/admin_themes");
          });
        }
      });
  }
});

/*
 * GET edit product
 */
adminThemesQuestionsRouter.get(
  "/edit-themes/:id",
  isAdmin,
  function (req, res) {
    var errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;
    AskedQuestions.find(function (err, questions) {
      ThemeOfAskedQuestions.findById(req.params.id, function (err, themes) {
        if (err) {
          console.log(err);
          res.render("admin/admin_themes");
        } else {
          res.render("admin/edit_themes", {
            errors,
            title: themes.title,
            questionAnswer: themes.questionAnswer,
            id: themes._id,
            listOfQuestionAnswer: questions,
          });
        }
      });
    });
  }
);

/*
 * POST edit product
 */
adminThemesQuestionsRouter.post("/edit-themes/:id", function (req, res) {
  req.checkBody("title", "Название должно быть заполненым").notEmpty();

  const title = req.body.title;
  const questionAnswer = req.body.question;
  var id = req.params.id;
  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_themes/edit-themes/" + id);
  } else {
    ThemeOfAskedQuestions.findById(id, function (err, themes) {
      if (err) console.log(err);
      themes.title = title;
      themes.questionAnswer = questionAnswer;
      themes.save(function (err) {
        if (err) return console.log(err);
        req.flash("success", "themes отредактирован!");
        alert("themes отредактирован");
        res.redirect("/admin/admin_themes");
      });
    });
  }
});

/*
 * GET delete product
 */
adminThemesQuestionsRouter.get(
  "/delete-themes/:id",
  isAdmin,
  function (req, res) {
    var id = req.params.id;
    ThemeOfAskedQuestions.findByIdAndRemove(id, function (err) {
      if (err) return console.log(err);

      req.flash("success", "themes deleted!");
      res.redirect("/admin/admin_themes/");
    });
  }
);

export default adminThemesQuestionsRouter;
