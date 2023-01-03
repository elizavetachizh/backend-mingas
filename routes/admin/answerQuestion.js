const express = require("express");
const router = express.Router();
const AskedQuestions = require("../../models/askedQuestions");

router.get("/", function (req, res) {
  AskedQuestions.find(function (err, questions) {
    res.send(questions);
  });
});
module.exports = router;
