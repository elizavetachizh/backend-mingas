const express = require("express");
const router = express.Router();
const Services = require("../../models/services");
const { isAdmin } = require("../../config/auth");
const alert = require("alert");
const Description = require("../../models/descriptionServices");

router.get("/", isAdmin, function (req, res) {
  var count;
  Services.count(function (err, c) {
    count = c;
  });
  Services.find({})
    .populate("description")

    .exec(function (err, services) {
      if (err) {
        console.log(err);
      }
      res.render("admin/admin_services", {
        services: services,
      });
    });
});

/*
 * GET add service
 */
router.get("/add-services", isAdmin, function (req, res) {
  var name = "";
  const description = [];
  var type = "";
  Description.find(function (err, generalDescription) {
    if (err) console.log(err);
    res.render("admin/add_services", {
      name,
      type,
      description,
      generalDescription,
    });
  });
});

router.post("/add-services", function (req, res) {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();

  var image = req.body.image;
  const name = req.body.name;
  const description = req.body.description.split(",");
  var errors = req.validationErrors();
  const type = req.body.type;
  if (errors) {
    console.log(errors);
    res.render("admin/add_services", {
      errors,
      description,
      name,
      image,
      type,
    });
  } else {
    Services.findOne({ name })
      .populate("description")
      .exec(function (err, services) {
        if (services) {
          res.render("admin/add_services", {
            name,
            description,
            type,
            image,
          });
        } else {
          var newServices = new Services({
            name,
            image,
            description,
            type,
          });
          newServices.save(function (err) {
            if (err) {
              return console.log(err);
            }

            req.flash("success", "услуга добавлена");
            res.redirect("/admin/admin_services");
          });
        }
      });
  }
});

/*
 * GET edit product
 */
router.get("/edit-services/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  Description.find(function (err, generalDescription) {
    if (err) console.log(err);
    Services.findById(req.params.id, function (err, service) {
      const { description, name, image, _id: id, type } = service;
      if (err) {
        console.log(err);
        res.render("admin/admin_services");
      } else {
        res.render("admin/edit_services", {
          errors,
          description,
          name,
          image,
          id,
          type,
          generalDescription,
        });
      }
    });
  });
});

/*
 * POST edit product
 */
router.post("/edit-services/:id", function (req, res) {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();

  var name = req.body.name;
  var image = req.body.image;
  var id = req.params.id;
  const type = req.body.type;
  const description = req.body.description.split(",");
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_services/edit-services/" + id);
    console.log(errors);
  } else {
    Services.findOne({ name, _id: { $ne: id } }, function (err, service) {
      if (err) {
        console.log(err);
      }
      if (service) {
        res.redirect("/admin/admin_services");
      } else {
        Services.findById(id, function (err, service) {
          if (err) return console.log(err);

          service.name = name;
          service.description = description;
          service.type = type;
          service.image = image;

          service.save(function (err) {
            if (err) return console.log(err);
            req.flash("success", "пост отредактирован!");
            alert("Пост отредактирован");
            res.redirect("/admin/admin_services");
          });
        });
      }
    });
  }
});

/*
 * GET delete product
 */
router.get("/delete-services/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Services.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_services/");
  });
});

module.exports = router;
