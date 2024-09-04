import express from "express";
const adminTableRouter = express.Router();
import Table from "../../models/tableReceptionSchedule.js";
import { isAdmin } from "../../config/auth.js";
import alert from "alert";

adminTableRouter.get("/", isAdmin, function (req, res) {
  var count;
  Table.count(function (err, c) {
    count = c;
  });
  Table.find(function (err, tableInfo) {
    if (err) {
      console.log(err);
    }
    res.render("admin/admin_table", {
      tableInfo,
      count,
    });
  });
});

/*
 * GET add product
 */
adminTableRouter.get("/add-table", isAdmin, function (req, res) {
  const name = "";
  res.render("admin/add_table", {
    name,
  });
});

/*
 * GET add product
 */
adminTableRouter.post("/add-table", function (req, res) {
  const name = req.body.name;

  const errors = req.validationErrors();
  if (errors) {
    res.render("admin/add_table", {
      errors,
    });
  } else {
    var newTable = new Table({
      name,
    });
    newTable.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "Пост добавлен");
      res.redirect("/admin/admin_table/");
    });
  }
});
/*
 * GET edit product
 */
adminTableRouter.get("/edit-table/:id", isAdmin, function (req, res) {
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
adminTableRouter.post("/edit-table/:id", function (req, res) {
  req.checkBody("name", "Описание должно быть заполненым").notEmpty();
  var name = req.body.name;
  var id = req.params.id;
  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_table/edit-table/" + id);
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
    });
  }
});

/*
 * GET delete product
 */
adminTableRouter.get("/delete-table/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Table.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_table");
  });
});

export default adminTableRouter;
