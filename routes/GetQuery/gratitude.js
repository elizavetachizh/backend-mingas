import express from "express";
import { keys } from "../../keys/index.js";
import { MongoClient } from "mongodb";
import Prices from "../../models/prices.js";
import Gratitude from "../../models/gratitude.js";
const gratitudeRouter = express.Router();
gratitudeRouter.get("/", async function (req, res) {
  Gratitude.find()
    .sort({_id:-1})
    .exec(function(err, files){
      res.send(files);
    })
});
export default gratitudeRouter;
