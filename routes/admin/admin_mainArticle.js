import express from "express";
const mainArticleAdminRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import multer from "multer";
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticles,
  updateArticle,
} from "../../controllers/articles.js";
import fs from "fs-extra";

// Настройка загрузки файлов с помощью Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "doc/articles";
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

mainArticleAdminRouter.get("/", isAdmin, getArticles);
/*
 * GET add product
 */
mainArticleAdminRouter.get("/add-article", isAdmin, function (req, res) {
  var content = "";
  var button = "";
  var link = "";
  var image = "";
  res.render("admin/add_article", {
    content,
    button,
    link,
    image,
  });
});

mainArticleAdminRouter.post(
  "/add-article",
  upload.single("file"),
  createArticle
);
/*
 * GET edit product
 */
mainArticleAdminRouter.get("/edit-article/:id", isAdmin, getArticleById);
/*
 * POST edit product
 */
mainArticleAdminRouter.post(
  "/edit-article/:id",
  upload.single("file"),
  updateArticle
);
/*
 * GET delete product
 */
mainArticleAdminRouter.get("/delete-article/:id", isAdmin, deleteArticle);

export default mainArticleAdminRouter;
