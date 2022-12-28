const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../config/auth");
var alert = require("alert");
const fs = require("fs-extra");
const Prices = require("../../models/prices");
router.get("/", isAdmin, function (req, res) {
  var count;
  Prices.count(function (err, c) {
    count = c;
  });
  Prices.find(function (err, prices) {
    res.render("admin/admin_prices", {
      prices: prices,
      count: count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-prices", isAdmin, function (req, res) {
  var name = "";
  res.render("admin/add_prices", {
    name: name,
  });
});

router.post("/add-prices", (req, res) => {
  req.checkBody("name", "Описание должно быть заполненым").notEmpty();

  var name = req.body.name;
  var descriptionFile =
    typeof req.files?.description !== "undefined"
      ? req.files.description.name
      : "";
  console.log(`des`, descriptionFile);
  var errors = req.validationErrors();
  console.log(descriptionFile);
  if (errors) {
    console.log("errors1", errors);
    res.render("admin/add_prices", {
      errors: errors,
      name: name,
      description: descriptionFile,
    });
  } else {
    Prices.findOne({ name: name }, function (err, prices) {
      if (prices) {
        res.render("admin/add_prices", {
          name: name,
        });
      } else {
        var prices = new Prices({
          name: name,
          description: descriptionFile,
        });
        prices.save(function (err) {
          if (err) {
            return console.log(`err`, err);
          }

          if (descriptionFile !== "") {
            let productImage = req.files.description;
            let path = "public/images" + "/" + descriptionFile;

            productImage.mv(path, function (err) {
              return console.log(err);
            });
          }
          console.log(`pr`, prices);
          req.flash("success", "Пост добавлен");
          res.redirect("/admin/admin_prices");
        });
      }
    });
  }
});

/*
 * GET edit product
 */
router.get("/edit-prices/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  Prices.findById(req.params.id, function (err, prices) {
    if (err) {
      console.log(err);
      res.render("admin/admin_prices");
    } else {
      res.render("admin/edit_prices", {
        errors: errors,
        name: prices.name,
        description: prices.description,
        id: prices._id,
      });
      console.log(prices);
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-prices/:id", function (req, res) {
  req.checkBody("name", "Описание должно быть заполненым").notEmpty();

  var name = req.body.name;
  var descriptionFile =
    typeof req.files?.description !== "undefined"
      ? req.files.description.name
      : "";
  var id = req.params.id;
  var description = req.body.description;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_prices/edit-prices/" + id);
  } else {
    Prices.findOne({ name: name }, function (err, prices) {
      if (err) {
        console.log(err);
      }
      if (prices) {
        res.redirect("/admin/admin_prices");
      } else {
        Prices.findById(id, function (err, prices) {
          if (err) return console.log(err);

          prices.name = name;
          prices.description = descriptionFile;

          prices.save(function (err) {
            if (err) return console.log(err);

            if (descriptionFile !== "") {
              if (description !== "") {
                fs.remove(
                  "public/images" + "/" + descriptionFile,
                  function (err) {
                    if (err) console.log(err);
                  }
                );
              }

              var serviceFile = req.files.description;
              var path = "public/product_images/" + descriptionFile;

              serviceFile.mv(path, function (err) {
                return console.log(err);
              });
            }

            req.flash("success", "prices отредактирован!");
            alert("prices отредактирован");
            res.redirect("/admin/admin_prices");
          });
        });
      }
    });
  }
});

/*
 * GET delete product
 */
router.get("/delete-prices/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Prices.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "prices deleted!");
    res.redirect("/admin/admin_prices");
  });
});

module.exports = router;
