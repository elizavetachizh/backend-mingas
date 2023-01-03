const express = require("express");
const router = express.Router();
const Prices = require("../../models/prices");

router.get("/", function (req, res) {
  Prices.find(function (err, prices) {
    res.send(prices);
  });
});
module.exports = router;
