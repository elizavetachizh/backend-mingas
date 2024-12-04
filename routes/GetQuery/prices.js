import express from "express";
import Prices from "../../models/prices.js";
const pricesRouter = express.Router();
pricesRouter.get("/", async function (req, res) {
  Prices.find()
    .sort({_id:-1})
    .exec(function(err, prices){
        res.send(prices);
      })
});
export default pricesRouter;
