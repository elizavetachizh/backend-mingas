const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../config/auth");
var alert = require("alert");
const Prices = require("../../models/prices");
router.get("/", isAdmin, function (req, res) {
  var count;
  Prices.count(function (err, c) {
    count = c;
  });
  Prices.find(function (err, prices) {
    res.render("admin/admin_prices", {
      prices,
      count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-prices", isAdmin, function (req, res) {
  var name = "";
  res.render("admin/add_prices", {
    name,
  });
});

router.post("/add-prices", (req, res) => {
  req.checkBody("name", "Описание должно быть заполненым").notEmpty();
  var name = req.body.name;
  var description = req.body.description;
  var errors = req.validationErrors();
  if (errors) {
    console.log("errors1", errors);
    res.render("admin/add_prices", {
      errors,
      name,
      description,
    });
  } else {
    Prices.findOne({ name, description }, function (err, prices) {
      if (prices) {
        res.render("admin/add_prices", {
          name,
          description,
        });
      } else {
        var newPrices = new Prices({
          name,
          description,
        });
        newPrices.save(function (err) {
          if (err) {
            return console.log(`err`, err);
          }
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
        errors,
        name: prices.name,
        description: prices.description,
        id: prices._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-prices/:id", function (req, res) {
  req.checkBody("name", "Описание должно быть заполненым").notEmpty();

  var name = req.body.name;
  var description = req.body.description;
  var id = req.params.id;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_prices/edit-prices/" + id);
  } else {
    Prices.findOne({ name }, function (err, prices) {
      if (err) {
        console.log(err);
      }
      if (prices) {
        res.redirect("/admin/admin_prices");
      } else {
        Prices.findById(id, function (err, prices) {
          if (err) return console.log(err);

          prices.name = name;
          prices.description = description;

          prices.save(function (err) {
            if (err) return console.log(err);

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
