import express from "express";
const adminDocumentsEDIRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import {
  deleteInfo,
  download,
  getListFiles,
  home,
  uploadFiles,
} from "../../controllers/documentsEDI.js";
adminDocumentsEDIRouter.get("/create", isAdmin, home);
adminDocumentsEDIRouter.post("/create", uploadFiles);
adminDocumentsEDIRouter.get("/", getListFiles);
adminDocumentsEDIRouter.get("/files/:name", download);
adminDocumentsEDIRouter.get("/delete/:id", deleteInfo);

export default adminDocumentsEDIRouter;
