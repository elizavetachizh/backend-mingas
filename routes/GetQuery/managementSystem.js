import express from "express";
import ManagementSystem from "../../models/managementSystem.js";
const managementSystemRouter = express.Router();
managementSystemRouter.get("/", async function (req, res) {
  ManagementSystem.find()
    .sort({_id:-1})
    .exec(function(err, files){
      res.send(files);
    })
});
export default managementSystemRouter;

