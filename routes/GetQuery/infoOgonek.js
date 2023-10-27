const express = require("express");
const router = express.Router();
const Branches = require("../../models/branches");

router.get("/", function (req, res) {
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

module.exports = router;
