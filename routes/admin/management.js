const express = require("express");
const router = express.Router();
const Management = require("../../models/management");
router.get("/", function (req, res) {
  Management.find(function (err, management) {
    res.send(management);
  });
});

module.exports = router;
