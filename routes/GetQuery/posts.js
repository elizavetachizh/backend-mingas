import express from "express";
const postsRouter = express.Router();
import Posts from "../../models/posts.js";

postsRouter.get("/", function (req, res) {
  let count;
  const pageOptions = {
    page: Math.max(0, req.query.page || 0),
    limit: Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)) // лимит между 1 и 100
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
        console.log(err);
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
postsRouter.get("/:link", function (req, res) {
  Posts.findById(req.params.link, function (err, post) {
    if (err) return console.log(err);
    res.send(post);
  });
});

export default postsRouter;
