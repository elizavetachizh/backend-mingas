import express from "express";
const adminSeparationsRouter = express.Router();
import SeparationDocs from "../../models/separationDocuments.js";
import { isAdmin } from "../../config/auth.js";
import alert from "alert";
import RegulatoryDoc from "../../models/regulatoryDocuments.js";
import {
  createSeparationDocs,
  deleteSeparationDocs,
  getSeparationDocs,
  getSeparationDocsById,
  updateSeparationDocs,
} from "../../controllers/regulatoryDocumentsSeparation.js";

adminSeparationsRouter.get("/", isAdmin, getSeparationDocs);
adminSeparationsRouter.get("/add-separations", isAdmin, function (req, res) {
  var separation = "";
  RegulatoryDoc.find(function (err, documents) {
    if (err) console.log(err);

    res.render("admin/add_separations", {
      documents,
      separation,
    });
  });
});
adminSeparationsRouter.post("/add-separations", createSeparationDocs);
adminSeparationsRouter.get(
  "/edit-separations/:id",
  isAdmin,
  getSeparationDocsById
);
adminSeparationsRouter.post("/edit-separations/:id", updateSeparationDocs);
adminSeparationsRouter.get(
  "/delete-separations/:id",
  isAdmin,
  deleteSeparationDocs
);

export default adminSeparationsRouter;
