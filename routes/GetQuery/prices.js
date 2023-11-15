const express = require("express");
const router = express.Router();
const Prices = require("../../models/prices");

router.get("/", function (req, res) {
  Prices.find(function (err, prices) {
    res.send(prices);
  });
});

router.get("/:description", function (req, res) {
  var description = req.params.description;
  Prices.findOne({ description }, function (err) {
    if (err) return console.log(err);
    res.setHeader("Content-Type", "application/pdf");

    res.setHeader("Content-Disposition", "attachment");
    res.download(
      `D:/project/backend-mingas/backend-mingas/public/images/${description}`
    );
  });
});
module.exports = router;
