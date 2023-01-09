const express = require("express");
const router = express.Router();
const Prices = require("../../models/prices");

router.get("/", function (req, res) {
  Prices.find(function (err, prices) {
    res.send(prices);
  });
});

router.get("/:id", function (req, res) {
  var id = req.params.id;
  Prices.findById(id, function (err, prices) {
    if (err) return console.log(err);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment");
    res.download(
      `D:/project/backend-mingas/backend-mingas/public/images/${prices.description}`
    );
  });
});
module.exports = router;
