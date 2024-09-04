import express from "express";
import {
  home,
  uploadFiles,
  getListFiles,
  download,
  deleteInfo,
} from "../../controllers/upload.js";
const adminPhotosRouter = express.Router();
import { isAdmin } from "../../config/auth.js";

adminPhotosRouter.get("/", isAdmin, home);
adminPhotosRouter.post("/", uploadFiles);
adminPhotosRouter.get("/files", getListFiles);
adminPhotosRouter.get("/files/:name", download);
adminPhotosRouter.get("/delete/:id", deleteInfo);

export default adminPhotosRouter;
