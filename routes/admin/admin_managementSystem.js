import express from "express";
import {
  uploadManagementSystem, getManagementSystems, getManagementSystemById, updateManagementSystem, deleteManagementSystem
} from "../../controllers/managementSystem.js";
import { isAdmin } from "../../config/auth.js";
import multer from "multer";
import fs from "fs-extra"
const adminManagementSystemRouter = express.Router();

// Настройка загрузки файлов с помощью Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'doc/managementSystem';
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

adminManagementSystemRouter.get("/", isAdmin, getManagementSystems);
adminManagementSystemRouter.get("/upload", isAdmin, function (req, res) {
  var content = "";
  res.render("admin/managementSystem/add_managementSystem", {
    content,
  });
});
adminManagementSystemRouter.post("/upload", upload.single("file"), uploadManagementSystem);
adminManagementSystemRouter.get("/edit-managementSystem/:id", isAdmin, getManagementSystemById);
adminManagementSystemRouter.post("/edit-managementSystem/:id", isAdmin, upload.single("file"), updateManagementSystem);
adminManagementSystemRouter.get("/delete/:id", isAdmin, deleteManagementSystem);

export default adminManagementSystemRouter;



