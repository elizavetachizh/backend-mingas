const express = require("express");
const router = express.Router();
const SeparationDocs = require("../../models/separationDocuments");
const { isAdmin } = require("../../config/auth");
const alert = require("alert");
const ThemeOfAskedQuestions = require("../../models/themeOfAskedQuestions");

router.get("/", isAdmin, function (req, res) {
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
router.get("/add-themes", isAdmin, function (req, res) {
  var id = req.params._id;
  var title = "";
  var question = "";
  var questionAnswer = [];
  ThemeOfAskedQuestions.find({ _id: { $ne: id } })
    .populate("questionAnswer")
    .exec(function (err, separations) {
      if (err) console.log(err);

      res.render("admin/add_themes", {
        title: title,
        question: question,
        questionAnswer: questionAnswer,
      });
    });
});

router.post("/add-themes", function (req, res) {
  const title = req.body.title;
  const question = req.body.question;
  const questionAnswer = req.body.questionAnswer.split(",");

  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.render("admin/add_themes", {
      errors: errors,
      title: title,
      question: question,
      questionAnswer: questionAnswer,
    });
  } else {
    ThemeOfAskedQuestions.findOne({ title: title })
      .populate("questionAnswer")
      .exec(function (err, themes) {
        if (themes) {
          res.render("admin/add_separations", {
            title: title,
            question: question,
            questionAnswer: questionAnswer,
          });
        } else {
          var themes = new ThemeOfAskedQuestions({
            title: title,
            question: question,
            questionAnswer: questionAnswer,
          });
          themes.save(function (err) {
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
router.get("/edit-themes/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  ThemeOfAskedQuestions.findById(req.params.id, function (err, themes) {
    if (err) {
      console.log(err);
      res.render("admin/admin_themes");
    } else {
      res.render("admin/edit_themes", {
        errors: errors,
        title: themes.title,
        question: themes.question,
        questionAnswer: themes.questionAnswer,
        id: themes._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-themes/:id", function (req, res) {
  // req.checkBody("name", "Название должно быть заполненым").notEmpty();
  // req.checkBody("image", "Описание должно быть заполненым").notEmpty();

  const title = req.body.title;
  const question = req.body.question;
  const questionAnswer = req.body.questionAnswer.split(",");
  var id = req.params.id;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_themes/edit-themes/" + id);
  } else {
    ThemeOfAskedQuestions.findOne({ title: title }, function (err, themes) {
      if (err) return console.log(err);

      if (themes) {
        res.redirect("/admin/admin_themes");
      } else {
        ThemeOfAskedQuestions.findById(id, function (err, themes) {
          if (err) console.log(err);
          themes.title = title;
          themes.question = question;
          themes.questionAnswer = questionAnswer;
          themes.save(function (err) {
            if (err) return console.log(err);

            req.flash("success", "themes отредактирован!");
            alert("themes отредактирован");
            res.redirect("/admin/admin_themes/edit-themes/" + id);
          });
        });
      }
    });
  }
});

/*
 * GET delete product
 */
router.get("/delete-themes/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  ThemeOfAskedQuestions.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "themes deleted!");
    res.redirect("/admin/admin_themes/");
  });
});

module.exports = router;
