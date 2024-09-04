import mainPosts from "../../models/mainPosts.js";
import express from "express";
const mainPostsRouter = express.Router();
mainPostsRouter.get("/", function (req, res) {
  mainPosts.find(function (err, posts) {
    res.send(posts);
  });
});
mainPostsRouter.get("/type", function (req, res) {
  mainPosts
    .find({ type: "safety" }, { name: 1, description: 1 })
    .exec(function (err, posts) {
      res.send(posts);
    });
});
mainPostsRouter.get("/:id", function (req, res) {
  mainPosts.findById(req.params.id, function (err, post) {
    if (err) return console.log(err);
    res.send(post);
  });
});
export default mainPostsRouter;
