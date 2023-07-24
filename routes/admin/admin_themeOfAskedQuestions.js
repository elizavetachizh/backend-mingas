const express = require("express");
const router = express.Router();
const SeparationDocs = require("../../models/separationDocuments");
const { isAdmin } = require("../../config/auth");
const alert = require("alert");
const ThemeOfAskedQuestions = require("../../models/themeOfAskedQuestions");
const AskedQuestions = require("../../models/askedQuestions");

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
  var questionAnswer = [];
  ThemeOfAskedQuestions.find({ _id: { $ne: id } })
    .populate("questionAnswer")
    .exec(function (err, separations) {
      if (err) console.log(err);

      res.render("admin/add_themes", {
        title: title,
        questionAnswer: questionAnswer,
      });
    });
});

router.post("/add-themes", function (req, res) {
  const title = req.body.title;
  const questionAnswer = req.body.questionAnswer.split(",");

  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.render("admin/add_themes", {
      errors: errors,
      title: title,
      questionAnswer: questionAnswer,
    });
  } else {
    ThemeOfAskedQuestions.findOne({ title: title })
      .populate("questionAnswer")
      .exec(function (err, themes) {
        if (themes) {
          res.render("admin/add_separations", {
            title: title,
            questionAnswer: questionAnswer,
          });
        } else {
          var themes = new ThemeOfAskedQuestions({
            title: title,
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
  AskedQuestions.find(function (err, questions) {
    ThemeOfAskedQuestions.findById(req.params.id, function (err, themes) {
      if (err) {
        console.log(err);
        res.render("admin/admin_themes");
      } else {
        res.render("admin/edit_themes", {
          errors: errors,
          title: themes.title,
          questionAnswer: themes.questionAnswer,
          id: themes._id,
          listOfQuestionAnswer: questions,
        });
        console.log(themes.questionAnswer)
        console.log(questions)
      }
    });
  });
});

/*
 * POST edit product
 */
router.post("/edit-themes/:id", function (req, res) {
  req.checkBody("title", "Название должно быть заполненым").notEmpty();
  // req.checkBody("image", "Описание должно быть заполненым").notEmpty();

  const title = req.body.title;
  const questionAnswer = req.body.questionAnswer.split(",");
  var id = req.params.id;
  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_themes/edit-themes/" + id);
  } else {
    ThemeOfAskedQuestions.findOne(
      { title: title, _id: { $ne: id } },
      function (err, themes) {
        if (err) return console.log(err);
        if (themes) {
          res.redirect("/admin/admin_themes");
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
      }
    );
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
