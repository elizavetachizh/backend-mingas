import express from "express";
import NewPosts from "../../models/newPosts.js";

const newPostsRouter = express.Router();
newPostsRouter.get("/", function (req, res) {
  NewPosts.find(function (err, posts) {
    res.send(posts);
  });
});
newPostsRouter.get("/:id", function (req, res) {
  console.log(req.params);
  NewPosts.findById(req.params.id, function (err, post) {
    if (err) return console.log(err);
    res.send(post);
  });
});

export default newPostsRouter;
