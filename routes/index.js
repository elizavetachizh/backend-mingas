var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.send("Панель администратора");
  res.redirect("/admin");
});
module.exports = router;
