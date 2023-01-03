const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../config/auth");
var alert = require("alert");
const AskedQuestions = require("../../models/askedQuestions");
router.get("/", isAdmin, function (req, res) {
  var count;
  AskedQuestions.count(function (err, c) {
    count = c;
  });
  AskedQuestions.find(function (err, questions) {
    res.render("admin/admin_questions", {
      questions: questions,
      count: count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-questions", isAdmin, function (req, res) {
  var question = "";
  var answer = "";
  res.render("admin/add_questions", {
    question: question,
    answer: answer,
  });
});

router.post("/add-questions", (req, res) => {
  req.checkBody("question", "Название должно быть заполненым").notEmpty();
  req.checkBody("answer", "Описание должно быть заполненым").notEmpty();

  var question = req.body.question;
  var answer = req.body.answer;

  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/add_questions", {
      errors: errors,
      question: question,
      answer: answer,
    });
  } else {
    AskedQuestions.findOne(
      { question: question, answer: answer },
      function (err, questions) {
        if (questions) {
          res.render("admin/add_questions", {
            question: question,
            answer: answer,
          });
        } else {
          var questions = new AskedQuestions({
            question: question,
            answer: answer,
          });
          questions.save(function (err) {
            if (err) {
              return console.log(err);
            }
            req.flash("success", "questions добавлен");
            res.redirect("/admin/admin_questions");
          });
        }
      }
    );
  }
});

/*
 * GET edit product
 */
router.get("/edit-questions/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  AskedQuestions.findById(req.params.id, function (err, questions) {
    // console.log(post);
    if (err) {
      console.log(err);
      res.render("admin/admin_questions");
    } else {
      res.render("admin/edit_questions", {
        errors: errors,
        question: questions.question,
        answer: questions.answer,
        id: questions._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-questions/:id", function (req, res) {
  req.checkBody("question", "Название должно быть заполненым").notEmpty();
  req.checkBody("answer", "Описание должно быть заполненым").notEmpty();

  var question = req.body.question;
  var answer = req.body.answer;
  var id = req.params.id;

  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_questions/edit-questions/" + id);
  } else {
    AskedQuestions.findOne(
      { question: question, answer: answer },
      function (err, questions) {
        // console.log("post2", post);
        if (err) {
          console.log(err);
        }
        if (questions) {
          // console.log("post3", post);
          res.redirect("/admin/admin_questions");
        } else {
          AskedQuestions.findById(id, function (err, questions) {
            if (err) return console.log(err);

            questions.question = question;
            questions.answer = answer;

            questions.save(function (err) {
              if (err) return console.log(err);

              req.flash("success", "пост отредактирован!");
              alert("questions отредактирован");
              res.redirect("/admin/admin_questions/edit-questions/" + id);
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
router.get("/delete-questions/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  AskedQuestions.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "questions deleted!");
    res.redirect("/admin/admin_questions/");
  });
});

module.exports = router;
