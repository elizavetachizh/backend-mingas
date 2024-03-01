const mainPosts = require("../../models/mainPosts");
const express = require("express");
const router = express.Router();
router.get("/", function (req, res) {
  mainPosts.find(function (err, posts) {
    res.send(posts);
    // console.log(posts);
  });
});
router.get("/type", function (req, res) {
  mainPosts
    .find({ type: "safety" }, { name: 1, description: 1 })
    .exec(function (err, posts) {
      res.send(posts);
    });
});
router.get("/:id", function (req, res) {
  mainPosts.findById(req.params.id, function (err, post) {
    if (err) return console.log(err);
    res.send(post);
  });
});
module.exports = router;
