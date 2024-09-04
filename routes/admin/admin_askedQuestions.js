import express from "express";
const adminAnswerQuestionsRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import alert from "alert";
import AskedQuestions from "../../models/askedQuestions.js";
adminAnswerQuestionsRouter.get("/", isAdmin, function (req, res) {
  var count;
  AskedQuestions.count(function (err, c) {
    count = c;
  });
  AskedQuestions.find(function (err, questions) {
    res.render("admin/admin_questions", {
      questions,
      count,
    });
  });
});

/*
 * GET add product
 */
adminAnswerQuestionsRouter.get("/add-questions", isAdmin, function (req, res) {
  var question = "";
  var answer = "";
  res.render("admin/add_questions", {
    question,
    answer,
  });
});

adminAnswerQuestionsRouter.post("/add-questions", (req, res) => {
  req.checkBody("question", "Название должно быть заполненым").notEmpty();
  req.checkBody("answer", "Описание должно быть заполненым").notEmpty();

  var question = req.body.question;
  var answer = req.body.answer;

  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/add_questions", {
      errors,
    });
  } else {
    var newQuestions = new AskedQuestions({
      question,
      answer,
    });
    newQuestions.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "questions добавлен");
      res.redirect("/admin/admin_questions");
    });
  }
});

/*
 * GET edit product
 */
adminAnswerQuestionsRouter.get(
  "/edit-questions/:id",
  isAdmin,
  function (req, res) {
    var errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    AskedQuestions.findById(req.params.id, function (err, questions) {
      if (err) {
        console.log(err);
        res.render("admin/admin_questions");
      } else {
        res.render("admin/edit_questions", {
          errors,
          question: questions.question,
          answer: questions.answer,
          id: questions._id,
        });
      }
    });
  }
);

/*
 * POST edit product
 */
adminAnswerQuestionsRouter.post("/edit-questions/:id", function (req, res) {
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
    AskedQuestions.findById(id, function (err, questions) {
      if (err) return console.log(err);
      questions.question = question;
      questions.answer = answer;
      questions.save(function (err) {
        if (err) return console.log(err);

        req.flash("success", "пост отредактирован!");
        alert("questions отредактирован");
        res.redirect("/admin/admin_questions");
      });
    });
  }
});

/*
 * GET delete product
 */
adminAnswerQuestionsRouter.get(
  "/delete-questions/:id",
  isAdmin,
  function (req, res) {
    var id = req.params.id;
    AskedQuestions.findByIdAndRemove(id, function (err) {
      if (err) return console.log(err);

      req.flash("success", "questions deleted!");
      res.redirect("/admin/admin_questions/");
    });
  }
);

export default adminAnswerQuestionsRouter;
