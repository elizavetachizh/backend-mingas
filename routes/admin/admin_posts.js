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
import fs from "fs-extra";
import multer from "multer";
// Настройка загрузки файлов с помощью Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "doc/posts";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Добавляем дату к имени файла
  },
});
const upload = multer({ storage });

postsAdminRouter.get("/", isAdmin, getPosts);
postsAdminRouter.get("/add-post", isAdmin, function (req, res) {
  const link = "";
  const content = "";
  const text = "";
  const date = new Date();
  const name = "";
  MainPosts.find({}, { name: 1 })
    .sort({ _id: -1 })
    .limit(7)
    .exec(function (err, mainPosts) {
      res.render("admin/add_posts", {
        link,
        content,
        text,
        date,
        mainPosts,
        name,
      });
    });
});
postsAdminRouter.post("/add-post", upload.single("file"), createPosts);
postsAdminRouter.get("/edit-post/:id", isAdmin, getPostsById);
postsAdminRouter.post("/edit-post/:id", updatePost);
postsAdminRouter.get("/delete-post/:id", isAdmin, deletePost);

export default postsAdminRouter;
