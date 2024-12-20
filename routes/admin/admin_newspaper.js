import express from "express";
const adminNewspapersRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import fs from "fs-extra";
import multer from "multer";
import {
  deleteNewspaper,
  getNewspaperById,
  getNewspapers,
  updateNewspaper,
  uploadNewspaper,
} from "../../controllers/newspapers.js";

// Настройка загрузки файлов с помощью Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "doc/newspapers";
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

adminNewspapersRouter.get("/", isAdmin, getNewspapers);
adminNewspapersRouter.get("/upload", isAdmin, function (req, res) {
  var content = "";
  res.render("admin/newspapers/add_newspaper", {
    content,
  });
});
adminNewspapersRouter.post("/upload", upload.single("file"), uploadNewspaper);
adminNewspapersRouter.get("/edit-newspaper/:id", isAdmin, getNewspaperById);
adminNewspapersRouter.post("/edit-newspaper/:id", updateNewspaper);
adminNewspapersRouter.get("/delete/:id", deleteNewspaper);

export default adminNewspapersRouter;
