// const express = require("express");
import express from "express";
import {
  home,
  uploadFiles,
  getListFiles,
  download,
  deleteInfo,
} from "../../controllers/upload.js";
const adminDocumentsEDIRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
adminDocumentsEDIRouter.get("/create", isAdmin, home);
adminDocumentsEDIRouter.post("/create", uploadFiles);
adminDocumentsEDIRouter.get("/", getListFiles);
adminDocumentsEDIRouter.get("/files/:name", download);
adminDocumentsEDIRouter.get("/delete/:id", deleteInfo);

export default adminDocumentsEDIRouter;
