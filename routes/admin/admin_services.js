const express = require("express");
const router = express.Router();
const Services = require("../../models/services");
const { isAdmin } = require("../../config/auth");
const alert = require("alert");
const fs = require("fs-extra");

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
      // res.send(services)
      res.render("admin/admin_services", {
        services: services,
      });
    });
});

/*
 * GET add product
 */
router.get("/add-services", isAdmin, function (req, res) {
  var id = req.params._id;
  var name = "";
  const description = [];
  var type = "";
  Services.find({ _id: { $ne: id } })
    .populate("description")
    .exec(function (err, services) {
      if (err) console.log(err);
      res.render("admin/add_services", {
        services: services,
        name: name,
        type: type,
        description: description,
      });
    });
});

router.post("/add-services", function (req, res) {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();

  var imageFile =
    typeof req.files?.image !== "undefined" ? req.files.image.name : "";
  const name = req.body.name;
  const description = req.body.description.split(",");
  var errors = req.validationErrors();
  const type = req.body.type;
  if (errors) {
    console.log(errors);
    res.render("admin/add_services", {
      errors: errors,
      description: description,
      name: name,
      image: imageFile,
      type: type,
    });
  } else {
    Services.findOne({ name: name })
      .populate("description")
      .exec(function (err, services) {
        if (services) {
          console.log(services);
          res.render("admin/add_services", {
            name: name,
            description: description,
            type: type,
          });
        } else {
          var services = new Services({
            name: name,
            image: imageFile,
            description: description,
            type: type,
          });
          services.save(function (err) {
            if (err) {
              return console.log(err);
            }

            if (imageFile !== "") {
              let productImage = req.files.image;
              let path = "public/images" + "/" + imageFile;

              productImage.mv(path, function (err) {
                return console.log(err);
              });
            }

            req.flash("success", "человек добавлен");
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

  Services.findById(req.params.id, function (err, service) {
    if (err) {
      console.log(err);
      res.render("admin/admin_services");
    } else {
      res.render("admin/edit_services", {
        errors: errors,
        description: service.description,
        name: service.name,
        image: service.image,
        id: service._id,
        type: service.type,
      });
    }
    // service.forEach((el)=>{
    //   console.log(el.description)
    // })
  });
});

/*
 * POST edit product
 */
router.post("/edit-services/:id", function (req, res) {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();

  var imageFile =
    typeof req.files?.image !== "undefined" ? req.files.image.name : "";
  var name = req.body.name;
  var image = req.body.image;
  var id = req.params.id;
  const type = req.body.type;
  const description = req.body.description.split(",");
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_services/edit-services/" + id);
    console.log(`1`, errors);
  } else {
    Services.findOne({ name: name, _id: { $ne: id } }, function (err, service) {
      if (err) {
        console.log(`2`, err);
      }
      if (service) {
        res.redirect("/admin/admin_services");
      } else {
        Services.findById(id, function (err, service) {
          if (err) return console.log(err);

          service.name = name;
          service.description = description;
          service.type = type;
          if (imageFile !== "") {
            service.image = imageFile;
          }
          service.save(function (err) {
            if (err) return console.log(err);
            if (imageFile !== "") {
              if (image !== "") {
                fs.remove(
                  "public/product_images" + "/" + image,
                  function (err) {
                    if (err) console.log(err);
                  }
                );
              }

              var serviceImage = req.files.image;
              var path = "public/product_images/" + imageFile;

              serviceImage.mv(path, function (err) {
                return console.log(err);
              });
            }
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
