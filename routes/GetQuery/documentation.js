import express from "express";
import DocumentationModel from "../../models/documentations.js";
const documentationRouter = express.Router();
documentationRouter.get("/", async function (req, res) {
  DocumentationModel.find()
    .sort({_id:-1})
    .exec(function(err, files){
      res.send(files);
    })
});
export default documentationRouter;
