const express = require("express");
const router = express.Router();
const mainArticle = require("../../models/mainArticles");

router.get("/", function (req, res) {
  mainArticle
    .find()
    .sort({ _id: -1 })
    .exec(function (err, articles) {
      res.send(articles);
    });
});
module.exports = router;
