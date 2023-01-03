var express = require("express");
const Page = require("../../models/page");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  Page.findOne({ slug: "home" }, function (err, page) {
    if (err) console.log(err);

    res.render("index", {
      title: page.title,
      content: page.content,
    });
  });
});
module.exports = router;
