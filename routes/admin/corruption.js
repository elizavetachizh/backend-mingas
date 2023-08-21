const express = require("express");
const router = express.Router();
const Corruption = require("../../models/corruption");

router.get("/", function (req, res) {
  Corruption.find(function (err, posts) {
    res.send(posts);
  });
});

/*
 * GET edit page
 */
router.get("/:link", function (req, res) {
  Corruption.findById(req.params.link, function (err, post) {
    if (err) return console.log(err);
    res.send(post);
  });
});

module.exports = router;
