import express from "express";
const usefulResourcesAdminRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import {
  createPosts,
  deletePost,
  getPosts,
  getPostsById,
  updatePost,
} from "../../controllers/usefulResources.js";
usefulResourcesAdminRouter.get("/", isAdmin, getPosts);
usefulResourcesAdminRouter.get("/add", isAdmin, function (req, res) {
  var link = "";
  var content = "";
  var image = "";
  const text = "";
  var date = new Date();
  var name = "";
  res.render("admin/usefulResources/add_posts", {
    link,
    content,
    text,
    image,
    date,
    name,
  });
});
usefulResourcesAdminRouter.post("/add", createPosts);
usefulResourcesAdminRouter.get("/edit/:id", isAdmin, getPostsById);
usefulResourcesAdminRouter.post("/edit/:id", updatePost);
usefulResourcesAdminRouter.get("/delete/:id", isAdmin, deletePost);

export default usefulResourcesAdminRouter;
