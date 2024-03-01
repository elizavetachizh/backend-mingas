const express = require("express");
const ThemeOfAskedQuestions = require("../../models/themeOfAskedQuestions");
const router = express.Router();
router.get("/", function (req, res) {
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

router.get("/:id", function (req, res) {
  ThemeOfAskedQuestions.findById(req.params.id)
    .populate("questionAnswer")
    .exec(function (err, themes) {
      if (err) {
        console.log(err);
      }
      res.send(themes);
    });
});

router.get("/search/:key", async (req, res) => {
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

module.exports = router;
