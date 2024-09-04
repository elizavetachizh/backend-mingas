// const express = require("express");
import express from "express"
import ThemeOfAskedQuestions from "../../models/themeOfAskedQuestions.js"
const themesQuestionsRouter = express.Router();
themesQuestionsRouter.get("/", function (req, res) {
  var count;
  const title = req.query.title;

  ThemeOfAskedQuestions.count(function (err, c) {
    count = c;
  });
  if (title) {
    ThemeOfAskedQuestions.find({ title })
      .populate("questionAnswer")
      .exec(function (err, themes) {
        if (err) {
          console.log(err);
        }
        res.send(themes);
      });
  } else {
    ThemeOfAskedQuestions.find({}, { title: 1 })
      .populate("questionAnswer")
      .exec(function (err, themes) {
        if (err) {
          console.log(err);
        }
        res.send(themes);
      });
  }
});

themesQuestionsRouter.get("/:id", function (req, res) {
  ThemeOfAskedQuestions.findById(req.params.id)
    .populate("questionAnswer")
    .exec(function (err, themes) {
      if (err) {
        console.log(err);
      }
      res.send(themes);
    });
});

themesQuestionsRouter.get("/search/:key", async (req, res) => {
  await ThemeOfAskedQuestions.find({
    $or: [
      {
        title: { $regex: req.params.key },
      },
    ],
  })
    .populate("questionAnswer")
    .exec(function (err, themes) {
      if (err) {
        console.log(err);
      }
      res.send(themes);
    });
});

export default themesQuestionsRouter;
