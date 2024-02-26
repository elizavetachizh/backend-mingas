const express = require("express");
const router = express.Router();
const Tenders = require("../../models/tenders");

router.get("/", function (req, res) {
  Tenders.find()
    .sort({ _id: -1 })
    .exec(function (err, tenders) {
      res.send(tenders);
    });
});
module.exports = router;
