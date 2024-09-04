import express from "express";
const tendersRouter = express.Router();
import Tenders from "../../models/tenders.js";

tendersRouter.get("/", function (req, res) {
  Tenders.find()
    .sort({ _id: -1 })
    .exec(function (err, tenders) {
      res.send(tenders);
    });
});
export default tendersRouter;
