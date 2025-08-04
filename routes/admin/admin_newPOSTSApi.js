import express from "express";
import { isAdmin } from "../../config/auth.js";
import {
  createNewPost,
  deletePost,
  getNewPost,
  getNewPostById,
  updateNewPost,
} from "../../controllers/newPostApi.js";
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

const adminNewPostsRouter = express.Router();

adminNewPostsRouter.get("/", isAdmin, getNewPost);
adminNewPostsRouter.get("/add-newpost", isAdmin, async (req, res) => {
  res.render("admin/newPostsApi/add_post", {
    name: "",
    description: "",
    images: "",
    link: "",
    content: "",
    image: "",
    date: "",
    text: "",
  });
});
adminNewPostsRouter.post("/add-newpost", upload.single("file"), createNewPost);
adminNewPostsRouter.get("/edit-newpost/:id", isAdmin, getNewPostById);
adminNewPostsRouter.post("/edit-newpost/:id", updateNewPost);

/*
 * GET delete product
 */
adminNewPostsRouter.get("/delete-newpost/:id", isAdmin, deletePost);

export default adminNewPostsRouter;
