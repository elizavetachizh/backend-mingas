const express = require("express");
const router = express.Router();
const AskedQuestions = require("../../models/askedQuestions");

router.get("/", function (req, res) {
  AskedQuestions.find(function (err, questions) {
    res.send(questions);
  });
});

router.get("/:id", function (req, res) {
  AskedQuestions.findById(req.params.id, function (err, questions) {
    res.send(questions);
  });
});

router.get("/search/:key", async (req, res) => {
  let result = await AskedQuestions.find({
    $or: [
      {
        question: { $regex: req.params.key },
      },
    ],
  });
  res.send(result);
});

module.exports = router;
