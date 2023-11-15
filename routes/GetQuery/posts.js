const express = require("express");
const router = express.Router();
const Posts = require("../../models/posts");

router.get("/", function (req, res) {
  let count;
  const pageOptions = {
    page: parseInt(req.query.page) || 0,
    limit: parseInt(req.query.limit),
  };
  Posts.count(function (err, c) {
    count = c;
  });
  Posts.find()
    .sort({ _id: -1 })
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .exec(function (err, doc) {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.status(200).send({
        count: count,
        results: doc,
      });
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
