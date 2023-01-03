const express = require("express");
const SeparationDocs = require("../../models/separationDocuments");
const router = express.Router();
router.get("/", function (req, res) {
  var count;
  SeparationDocs.count(function (err, c) {
    count = c;
  });
  SeparationDocs.find({})
    .populate("documents")
    .exec(function (err, documents) {
      if (err) {
        console.log(err);
      }
      res.send(documents);
    });
});
module.exports = router;
