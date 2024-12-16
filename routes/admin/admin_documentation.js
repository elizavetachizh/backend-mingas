import express from "express";
const adminDocumentationRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import multer from "multer";
import {
  deleteDocument,
  getDocumentById,
  getDocuments,
  uploadDocument
} from "../../controllers/documentations.js";

const upload = multer({  dest: 'doc/' });

adminDocumentationRouter.get("/", isAdmin, getDocuments);
adminDocumentationRouter.get("/upload", isAdmin, function (req, res) {
  var content = "";
  res.render("admin/documentations/add_documentation", {
    content,
  });
});
adminDocumentationRouter.post("/upload", upload.array('files'), uploadDocument);
adminDocumentationRouter.get("/edit/:id", getDocumentById);
adminDocumentationRouter.get("/delete/:id", deleteDocument);

export default adminDocumentationRouter;
