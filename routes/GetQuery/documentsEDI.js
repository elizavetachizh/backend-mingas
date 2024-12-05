import express from "express";
import Edi from "../../models/edi.js";
const documentsEDIRouter = express.Router();
documentsEDIRouter.get("/", async function (req, res) {
  Edi.find()
    .sort({_id:-1})
    .exec(function(err, prices){
      res.send(prices);
    })
});
export default documentsEDIRouter;
