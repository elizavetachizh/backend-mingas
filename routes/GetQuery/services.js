const express = require("express");
const Services = require("../../models/services");
const router = express.Router();
router.get("/", function (req, res) {
  var count;
  Services.count(function (err, c) {
    count = c;
  });
  Services.find({})
    .populate({ path: "description", select: "inform nameDescription" })
    .exec(function (err, services) {
      if (err) {
        console.log(err);
      }
      res.send(services);
    });
});
module.exports = router;
