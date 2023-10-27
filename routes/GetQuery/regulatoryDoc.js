const express = require("express");
const router = express.Router();
const RegulatoryDoc = require("../../models/regulatoryDocuments");

router.get("/", function (req, res) {
  RegulatoryDoc.find(function (err, docs) {
    res.send(docs);
  });
});
module.exports = router;
