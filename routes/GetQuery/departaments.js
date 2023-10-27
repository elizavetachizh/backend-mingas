const express = require("express");
const router = express.Router();
const Departament = require("../../models/departaments");
router.get("/", function (req, res) {
  const queryNameMen = req.query.nameMen;
  const queryName = req.query.name;
  if (queryNameMen) {
    Departament.find({ nameMen: queryNameMen }, function (err, department) {
      res.send(department);
    });
  } else if (queryName) {
    Departament.find({ name: queryName }, function (err, department) {
      res.send(department);
    });
  } else {
    Departament.find(function (err, department) {
      res.send(department);
    });
  }
});

router.get("/:id", function (req, res) {
  Departament.findById(req.params.id, function (err, department) {
    if (err) return console.log(err);
    res.send(department);
  });
});

router.get("/search/:key", async (req, res) => {
  let result = await Departament.find({
    $or: [
      {
        name: { $regex: req.params.key },
      },
    ],
  });
  res.send(result);
});
module.exports = router;
