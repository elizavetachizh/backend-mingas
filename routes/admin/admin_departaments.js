const Departament = require("../../models/departaments");
const { isAdmin } = require("../../config/auth");
const express = require("express");
const alert = require("alert");
const Management = require("../../models/management");
const router = express.Router();

router.get("/", isAdmin, function (req, res) {
  var count;
  Departament.count(function (err, c) {
    count = c;
  });
  Management.find(function (err, management) {
    Departament.find(function (err, departament) {
      res.render("admin/admin_departament", {
        departament,
        count,
        nameMen: management,
      });
    });
  });
});

/*
 * GET add product
 */
router.get("/add-departament", isAdmin, function (req, res) {
  var name = "",
    chief = "",
    description = "",
    schedule = "",
    contacts = "";
  Management.find(function (err, management) {
    res.render("admin/add_departament", {
      name,
      nameMen: management,
      chief,
      description,
      schedule,
      contacts,
    });
  });
});

router.post("/add-departament", (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  req.checkBody("nameMen", "Описание должно быть заполненым").notEmpty();
  var name = req.body.name;
  var chief = req.body.chief;
  var description = req.body.description;
  var schedule = req.body.schedule;
  var contacts = req.body.contacts;
  var nameMen = req.body.nameMen;
  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/add_departament", {
      errors,
    });
  } else {
    var newDepartment = new Departament({
      name,
      chief,
      description,
      schedule,
      contacts,
      nameMen,
    });
    newDepartment.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "departament добавлен");
      res.redirect("/admin/admin_departament");
    });
  }
});

/*
 * GET edit product
 */
router.get("/edit-departament/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;
  Management.find(function (err, management) {
    Departament.findById(req.params.id, function (err, departament) {
      const fullName = management?.find((el) => el.id === departament?.nameMen);
      if (err) {
        console.log(err);
        res.render("admin/admin_departament");
      } else {
        res.render("admin/edit_departament", {
          errors,
          name: departament.name,
          id: departament._id,
          chief: departament.chief,
          description: departament.description,
          schedule: departament.schedule,
          contacts: departament.contacts,
          management: fullName?.fullName,
          nameMen: management,
          nameMenChecked: departament.nameMen,
        });
      }
    });
  });
});

/*
 * POST edit product
 */
router.post("/edit-departament/:id", function (req, res) {
  const errors = req.validationErrors();
  const { name, id, chief, description, schedule, contacts, nameMen } =
    req.body;
  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_departament/edit-departament/" + id);
  } else {
    Departament.findById(id, function (err, departament) {
      if (err) return console.log(err);

      departament.name = name;
      departament.chief = chief;
      departament.description = description;
      departament.schedule = schedule;
      departament.contacts = contacts;
      departament.nameMen = nameMen;
      departament.save(function (err) {
        if (err) return console.log(err);

        req.flash("success", "продукция отредактировна!");
        alert("Пост отредактирован");
        res.redirect("/admin/admin_departament/");
      });
    });
  }
});

/*
 * GET delete product
 */
router.get("/delete-departament/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Departament.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_departament/");
  });
});

module.exports = router;
