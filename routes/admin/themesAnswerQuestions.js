const express = require("express");
const ThemeOfAskedQuestions = require("../../models/themeOfAskedQuestions");
const router = express.Router();
router.get("/", function (req, res) {
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
      res.send(themes);
    });
});
module.exports = router;
