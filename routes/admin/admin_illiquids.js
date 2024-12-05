import express from "express";
const adminIlliquidsRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import multer from "multer";
import fs from "fs-extra"
import {
  deleteIlliquid,
  getIlliquidById,
  getIlliquids,
  updateIlliquid,
  uploadIlliquid
} from "../../controllers/illiquid.js";

// Настройка загрузки файлов с помощью Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'doc/illiquids';
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

adminIlliquidsRouter.get("/", isAdmin, getIlliquids);
adminIlliquidsRouter.get("/upload", isAdmin, function (req, res) {
  var content = "";
  res.render("admin/illiquids/add_illiquid", {
    content,
  });
});
adminIlliquidsRouter.post("/upload", upload.single("file"), uploadIlliquid);
adminIlliquidsRouter.get("/edit-illiquid/:id", getIlliquidById);
adminIlliquidsRouter.post("/edit-illiquid/:id", updateIlliquid);
adminIlliquidsRouter.get("/delete-illiquid/:id", isAdmin, deleteIlliquid);

export default adminIlliquidsRouter;

