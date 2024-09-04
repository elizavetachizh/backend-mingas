import express from "express";
import SeparationDocs from "../../models/separationDocuments.js";
const documentsSeparationsRouter = express.Router();
documentsSeparationsRouter.get("/", function (req, res) {
  var count;
  SeparationDocs.count(function (err, c) {
    count = c;
  });
  SeparationDocs.find({})
    .populate("documents")
    .exec(function (err, documents) {
      if (err) {
        console.log(err);
      }
      res.send(documents);
    });
});
export default documentsSeparationsRouter;
