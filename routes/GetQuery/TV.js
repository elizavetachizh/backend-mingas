const express = require("express");
const router = express.Router();
const MingasTV = require("../../models/mingasTV");

router.get("/", function (req, res) {
  MingasTV.find(function (err, info) {
    res.send(info);
  });
});
module.exports = router;
