const Management = require("../../models/management");
const { isAdmin } = require("../../config/auth");
const express = require("express");
const alert = require("alert");

const Departament = require("../../models/departaments");
const router = express.Router();

router.get("/", isAdmin, function (req, res) {
  var count;
  Management.count(function (err, c) {
    count = c;
  });
  Management.find(function (err, management) {
    res.render("admin/admin_management", {
      management,
      count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-men", isAdmin, function (req, res) {
  var fullName = "";
  var position = "";
  var image = "";
  Departament.find(function (err, departaments) {
    res.render("admin/add_management", {
      fullName,
      position,
      image,
      department: departaments,
    });
  });
});

router.post("/add-men", (req, res) => {
  req.checkBody("fullName", "Название должно быть заполненым").notEmpty();
  req.checkBody("position", "Описание должно быть заполненым").notEmpty();
  const { image, fullName, position, department } = req.body;

  var errors = req.validationErrors();
  if (errors) {
    res.render("admin/add_management", {
      errors,
    });
  } else {
    var management = new Management({
      fullName,
      position,
      image,
      department,
    });
    management.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "человек добавлен");
      res.redirect("/admin/admin_management");
    });
  }
});

/*
 * GET edit product
 */
router.get("/edit-men/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;
  Departament.find(function (err, departments) {
    Management.findById(req.params.id, function (err, men) {
      if (err) {
        console.log(err);
        res.render("admin/admin_management");
      } else {
        res.render("admin/edit_management", {
          errors,
          fullName: men.fullName,
          position: men.position,
          departments: departments,
          department: men.department,
          image: men.image,
          id: men._id,
        });
      }
    });
  });
});

/*
 * POST edit product
 */
router.post("/edit-men/:id", function (req, res) {
  req.checkBody("fullName", "fullName должно быть заполненым").notEmpty();
  req.checkBody("position", "position должно быть заполненым").notEmpty();
  const { image, fullName, position, department } = req.body;
  var id = req.params.id;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_management/edit-men/" + id);
  } else {
    Management.findById(id, function (err, men) {
      if (err) return console.log(err);

      men.fullName = fullName;
      men.position = position;
      men.department = department;
      men.image = image;

      men.save(function (err) {
        if (err) return console.log(err);

        req.flash("success", "продукция отредактировна!");
        alert("Пост отредактирован");
        res.redirect("/admin/admin_management/");
      });
    });
  }
});

/*
 * GET delete product
 */
router.get("/delete-men/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Management.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_management/");
  });
});

module.exports = router;
