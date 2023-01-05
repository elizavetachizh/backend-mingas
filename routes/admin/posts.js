const express = require("express");
const router = express.Router();
const Posts = require("../../models/posts");

router.get("/", function (req, res) {
  Posts.find(function (err, posts) {
    res.send(posts);
  });
});

/*
 * GET edit page
 */
router.get("/:link", function (req, res) {
  Posts.findById(req.params.link, function (err, post) {
    if (err) return console.log(err);
    res.send(post);
  });
});

module.exports = router;
