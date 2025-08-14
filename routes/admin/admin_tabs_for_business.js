import express from "express";
import fs from "fs-extra";
import multer from "multer";
import {
  createContent,
  deleteContent,
  getContent,
  getContentById,
  updateContent,
} from "../../controllers/businessTabs.js";
import { isAdmin } from "../../config/auth.js";

// Настройка загрузки файлов с помощью Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'doc/businessTabs';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Добавляем дату к имени файла
  },
});
const upload = multer({ storage });

const adminBusinessTabsRouter = express.Router();

adminBusinessTabsRouter.get("/", isAdmin, getContent);
adminBusinessTabsRouter.get("/add-content", isAdmin, async (req, res) => {
  res.render("admin/businessTabs/add_info", {
    name: "",
    link: "",
    image: "",
  });
});
adminBusinessTabsRouter.post(
  "/add-content",
  upload.single("file"),
  createContent
);
adminBusinessTabsRouter.get("/edit-content/:id", isAdmin, getContentById);
adminBusinessTabsRouter.post(
  "/edit-content/:id",
  upload.single("file"),
  updateContent
);

/*
 * GET delete product
 */
adminBusinessTabsRouter.get("/delete-content/:id", isAdmin, deleteContent);

export default adminBusinessTabsRouter;
