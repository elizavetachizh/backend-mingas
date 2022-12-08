const express = require("express");
const Description = require("../../models/descriptionServices");
const router = express.Router();
router.get("/", function (req, res) {
  var count;
  Description.count(function (err, c) {
    count = c;
  });
  Description.find(function (err, description) {
    if (err) {
      console.log(err);
    }
    res.send(description);
  });
});
module.exports = router;
