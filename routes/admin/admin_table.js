const express = require("express");
const router = express.Router();
const Table = require("../../models/tableReceptionSchedule");
const { isAdmin } = require("../../config/auth");
const alert = require("alert");

router.get("/", isAdmin, function (req, res) {
  var count;
  Table.count(function (err, c) {
    count = c;
  });
  Table.find(function (err, tableInfo) {
    if (err) {
      console.log(err);
    }
    // res.send(services)
    res.render("admin/admin_table", {
      tableInfo: tableInfo,
      count: count,
    });
    tableInfo.map((el) => console.log(el.description));
  });
});

/*
 * GET add product
 */
router.get("/add-table", isAdmin, function (req, res) {
  var name = "";

  res.render("admin/add_table", {
    name,
  });
});

/*
 * GET add product
 */
router.post("/add-table", function (req, res) {
  var name = req.body.name;

  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.render("admin/add_table", {
      errors,
      name,
    });
  } else {
    Table.findOne({ name }, function (err, table) {
      if (table) {
        res.render("admin/add_table", {
          name,
        });
      } else {
        var table = new Table({
          name,
        });
        table.save(function (err) {
          if (err) {
            return console.log(err);
          }
          req.flash("success", "Пост добавлен");
          res.redirect("/admin/admin_table/");
        });
      }
    });
  }
});
/*
 * GET edit product
 */
router.get("/edit-table/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  Table.findById(req.params.id, function (err, table) {
    // console.log(tender);
    if (err) {
      console.log(err);
      res.render("admin/admin_table");
    } else {
      res.render("admin/edit_table", {
        errors: errors,
        name: table.name,
        id: table._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-table/:id", function (req, res) {
  req.checkBody("name", "Описание должно быть заполненым").notEmpty();
  var name = req.body.name;
  var id = req.params.id;
  var errors = req.validationErrors();
  console.log(name)
  if (errors) {
    req.session.errors = errors;
    console.log(errors)
    res.redirect("/admin/admin_table/edit-table/" + id);
  } else {
    Table.findOne({ name }, function (err, table) {
      if (err) {
        console.log(err);
      }
      if (table) {
        // console.log("tender", tender);
        res.redirect("/admin/admin_table");
      } else {
        Table.findById(id, function (err, table) {
          if (err) return console.log(err);
          table.name = name;

          table.save(function (err) {
            if (err) return console.log(err);

            req.flash("success", "пост отредактирован!");
            alert("Пост отредактирован");
            res.redirect("/admin/admin_table/edit-table/" + id);
          });
          // console.log(tender);
        });
      }
    });
  }
});

/*
 * GET delete product
 */
router.get("/delete-table/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Table.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_table");
  });
});

module.exports = router;
