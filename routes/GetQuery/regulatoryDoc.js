import express from "express";
const documentsRouter = express.Router();
import RegulatoryDoc from "../../models/regulatoryDocuments.js";

documentsRouter.get("/", function (req, res) {
  RegulatoryDoc.find(function (err, docs) {
    res.send(docs);
  });
});
export default documentsRouter;
