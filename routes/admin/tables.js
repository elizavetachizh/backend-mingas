const express = require("express");
const Table = require("../../models/tableReceptionSchedule");

const router = express.Router();
router.get("/", function (req, res) {
  Table.find(function (err, documents) {
    if (err) {
      console.log(err);
    }
    res.send(documents);
  });
});
module.exports = router;
