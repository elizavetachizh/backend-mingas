const express = require("express");
const router = express.Router();
const AdministrativeServices = require("../../models/administrativeServices");

router.get("/", function (req, res) {
    AdministrativeServices.find(function (err, administration) {
        res.send(administration);
    });
});
module.exports = router;
