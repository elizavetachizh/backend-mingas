import express from "express";
import Newspapers from "../../models/newspapers.js";
const newspapersRouter = express.Router();
newspapersRouter.get("/", async function (req, res) {
  Newspapers.find()
    .sort({_id:-1})
    .exec(function(err, files){
      res.send(files);
    })
});
export default newspapersRouter;
