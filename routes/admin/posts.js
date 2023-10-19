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

// router.get("/", function (req, res) {
//   Posts.find(function (err, posts) {
//     const pageNumber = req.query.page || 1; // Get the current page number from the query parameters
//     const startIndex = (pageNumber - 1) * pageSize;
//     const endIndex = startIndex + pageSize;
//     const data = posts.slice(startIndex, endIndex);
//     res.json({ data, total: posts.length })
//   });
// });
router.get("/paginate", function (req, res) {
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
