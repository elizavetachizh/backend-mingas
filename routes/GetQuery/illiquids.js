import express from "express";
import Illiquid from "../../models/illiquid.js";
const illiquidsRouter = express.Router();
illiquidsRouter.get("/", async function (req, res) {
  Illiquid.find()
    .sort({_id:-1})
    .exec(function(err, prices){
      res.send(prices);
    })
});
export default illiquidsRouter;
