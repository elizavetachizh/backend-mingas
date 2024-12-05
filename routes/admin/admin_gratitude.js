import express from "express";
import {
  uploadGratitude, getGratitudes, getGratitudeById, updateGratitude, deleteGratitude
} from "../../controllers/gratitude.js";
import { isAdmin } from "../../config/auth.js";
import multer from "multer";
import fs from "fs-extra"
const adminGratitudeRouter = express.Router();

// Настройка загрузки файлов с помощью Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'doc/gratitude';
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

adminGratitudeRouter.get("/", isAdmin, getGratitudes);
adminGratitudeRouter.get("/upload", isAdmin, function (req, res) {
  var content = "";
  res.render("admin/gratitude/add_gratitude", {
    content,
  });
});
adminGratitudeRouter.post("/upload", upload.single("file"), uploadGratitude);
adminGratitudeRouter.get("/edit-gratitude/:id", getGratitudeById);
adminGratitudeRouter.post("/edit-gratitude/:id", updateGratitude);
adminGratitudeRouter.get("/delete/:id", deleteGratitude);

export default adminGratitudeRouter;


