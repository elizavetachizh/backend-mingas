import express from "express";
const adminDocumentsRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import SeparationDocs from "../../models/separationDocuments.js";
import {
  createDocuments,
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from "../../controllers/regulatoryDocuments.js";
adminDocumentsRouter.get("/", isAdmin, getDocuments);
adminDocumentsRouter.get("/add-documents", isAdmin, function (req, res) {
  var link = "";
  var separation = "";
  var type = "";
  var name = "";
  SeparationDocs.find(function (err, separations) {
    res.render("admin/add_documents", {
      link,
      separation,
      type,
      name,
      separations,
    });
  });
});
adminDocumentsRouter.post("/add-documents", createDocuments);
adminDocumentsRouter.get("/edit-documents/:id", isAdmin, getDocumentById);
adminDocumentsRouter.post("/edit-documents/:id", updateDocument);
adminDocumentsRouter.get("/delete-documents/:id", isAdmin, deleteDocument);

export default adminDocumentsRouter;
