const express = require("express");
const Description = require("../../models/descriptionServices");
const router = express.Router();
router.get("/", function (req, res) {
  Description.find(function (err, description) {
    if (err) {
      console.log(err);
    }
    res.send(description);
  });
});
router.get("/:id", function (req, res) {
  Description.findById(req.params.id, function (err, description) {
    if (err) {
      console.log(err);
    }
    res.send(description);
  });
});
module.exports = router;
