import express from "express";
import fs from "fs-extra";
import multer from "multer";
import { isPostsUser } from "../../../config/auth.js";
import {
  createContent,
  deleteContent,
  getContent,
  getContentById,
  updateContent,
} from "../../../controllers/ecobox/content.js";
import ThemeOfEcoBoxModel from "../../../models/ecobox/themes/index.js";

// Настройка загрузки файлов с помощью Multer
const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    const dir = "doc/ecobox";
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

const adminEcoBoxRouter = express.Router();

adminEcoBoxRouter.get("/", isPostsUser, getContent);
adminEcoBoxRouter.get("/add-content", isPostsUser, async (req, res) => {
  ThemeOfEcoBoxModel.find({}).exec(function (err, themes) {
    res.render("admin/ecobox/content/add_info", {
      name: "",
      description: "",
      images: "",
      theme: "",
      price: "",
      themes,
    });
  });
});
adminEcoBoxRouter.post(
  "/add-content",
  upload.array("files", 10),
  createContent
);
adminEcoBoxRouter.get("/edit-content/:id", isPostsUser, getContentById);
adminEcoBoxRouter.post(
  "/edit-content/:id",
  upload.array("files", 10),
  updateContent
);

/*
 * GET delete product
 */
adminEcoBoxRouter.get("/delete-content/:id", isPostsUser, deleteContent);

export default adminEcoBoxRouter;
