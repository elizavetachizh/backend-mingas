const express = require("express");
const router = express.Router();
const Tenders = require("../../models/tenders");

router.get("/", function (req, res) {
  Tenders.find(function (err, tenders) {
     res.send(tenders);
  });
});
module.exports = router;
