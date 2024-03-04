const express = require("express");
const Services = require("../../models/services");
const router = express.Router();
router.get("/", function (req, res) {
  Services.find({}, { name: 1, type: 1, image: 1 }).exec(function (
    err,
    services
  ) {
    if (err) {
      console.log(err);
    }
    res.send(services);
  });
});

router.get("/:id", function (req, res) {
  Services.findById(req.params.id)
    .populate({ path: "description", select: "inform nameDescription" })
    .exec(function (err, services) {
      if (err) {
        console.log(err);
      }
      res.send(services);
    });
});

module.exports = router;
