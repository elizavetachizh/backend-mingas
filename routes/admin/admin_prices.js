import express from "express";
const pricesAdminRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import {
  deletePrice,
  getPriceById,
  getPrices,
  updatePrice,
  uploadPrice,
} from "../../controllers/pricesNew.js";
import multer from "multer";

// Настройка загрузки файлов с помощью Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "doc");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Добавляем дату к имени файла
  },
});

const upload = multer({ storage });

pricesAdminRouter.get("/", isAdmin, getPrices);
pricesAdminRouter.get("/upload", isAdmin, function (req, res) {
  var content = "";
  res.render("admin/prices/add_price", {
    content,
  });
});
pricesAdminRouter.post("/upload", upload.single("file"), uploadPrice);
pricesAdminRouter.get("/edit-price/:id", getPriceById);
pricesAdminRouter.post("/edit-price/:id", updatePrice);
pricesAdminRouter.get("/delete-price/:id", isAdmin, deletePrice);

export default pricesAdminRouter;
