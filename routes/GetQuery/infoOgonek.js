import express from "express"
const ogonekRouter = express.Router();
import Branches from "../../models/branches/index.js";

ogonekRouter.get("/", function (req, res) {
  const typeBranch = req.query.typeBranch;
  if (typeBranch) {
    Branches.find({ typeBranch }, function (err, info) {
      res.send(info);
    });
  } else {
    Branches.find(function (err, info) {
      res.send(info);
    });
  }
});

export default ogonekRouter;
