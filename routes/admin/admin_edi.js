import express from "express";
const adminDocumentsEDIRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
  uploadDocument
} from "../../controllers/documentsEDI.js";
import fs from "fs-extra"
import multer from "multer";

// Настройка загрузки файлов с помощью Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'doc/edi';
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

adminDocumentsEDIRouter.get("/", isAdmin, getDocuments);
adminDocumentsEDIRouter.get("/upload", isAdmin, function (req, res) {
  var content = "";
  res.render("admin/edi/add_edi", {
    content,
  });
});
 adminDocumentsEDIRouter.post("/upload",upload.single("file"), uploadDocument);
 adminDocumentsEDIRouter.get("/edit-edi/:id", getDocumentById);
 adminDocumentsEDIRouter.post("/edit-edi/:id", updateDocument);
adminDocumentsEDIRouter.get("/delete/:id", deleteDocument);

export default adminDocumentsEDIRouter;
