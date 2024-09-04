import express from "express";
const postsAdminRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import MainPosts from "../../models/mainPosts.js";
import {
  createPosts,
  deletePost,
  getPosts,
  getPostsById,
  updatePost,
} from "../../controllers/posts.js";
postsAdminRouter.get("/", isAdmin, getPosts);
postsAdminRouter.get("/add-post", isAdmin, function (req, res) {
  var link = "";
  var content = "";
  var image = "";
  var date = new Date();
  MainPosts.find({}, { name: 1 })
    .sort({ _id: -1 })
    .limit(7)
    .exec(function (err, mainPosts) {
      res.render("admin/add_posts", {
        link,
        content,
        image,
        date,
        mainPosts,
      });
    });
});
postsAdminRouter.post("/add-post", createPosts);
postsAdminRouter.get("/edit-post/:id", isAdmin, getPostsById);
postsAdminRouter.post("/edit-post/:id", updatePost);
postsAdminRouter.get("/delete-post/:id", isAdmin, deletePost);

export default postsAdminRouter;
