// const express = require("express");
import express from "express"
const answerQuestionsRouter = express.Router();
import AskedQuestions from "../../models/askedQuestions.js";

answerQuestionsRouter.get("/", function (req, res) {
  AskedQuestions.find(function (err, questions) {
    res.send(questions);
  });
});

answerQuestionsRouter.get("/:id", function (req, res) {
  AskedQuestions.findById(req.params.id, function (err, questions) {
    res.send(questions);
  });
});

answerQuestionsRouter.get("/search/:key", async (req, res) => {
  let result = await AskedQuestions.find({
    $or: [
      {
        question: { $regex: req.params.key },
      },
    ],
  });
  res.send(result);
});

export default answerQuestionsRouter;
