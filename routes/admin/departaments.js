const express = require("express");
const router = express.Router();
const auth = require("../../config/auth");
const Departament = require("../../models/departaments");
router.get("/", function (req, res) {
  Departament.find(function (err, departament) {
    res.send(departament);
  });
});

module.exports = router;
