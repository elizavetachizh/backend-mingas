import express from "express";
const adminTVRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import alert from "alert";
import MingasTV from "../../models/mingasTV.js";
adminTVRouter.get("/", isAdmin, function (req, res) {
  var count;
  MingasTV.count(function (err, c) {
    count = c;
  });
  MingasTV.find(function (err, info) {
    res.render("admin/admin_TV.ejs", {
      info,
      count,
    });
  });
});

/*
 * GET add product
 */
adminTVRouter.get("/add-info", isAdmin, function (req, res) {
  var name = "";
  var link = "";
  res.render("admin/add_TV", {
    name,
    link,
  });
});

adminTVRouter.post("/add-info", (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  req.checkBody("link", "Ссылка должна быть заполнена").notEmpty();

  var name = req.body.name;
  var link = req.body.link;

  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/add_TV", {
      errors,
    });
  } else {
    var newEntry = new MingasTV({
      name,
      link,
    });
    newEntry.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "запись добавлена");
      res.redirect("/admin/admin_TV");
    });
  }
});

/*
 * GET edit product
 */
adminTVRouter.get("/edit-info/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  MingasTV.findById(req.params.id, function (err, info) {
    if (err) {
      console.log(err);
      res.render("admin/admin_TV");
    } else {
      res.render("admin/edit_TV", {
        errors,
        name: info.name,
        link: info.link,
        id: info._id,
      });
    }
  });
});

/*
 * POST edit product
 */
adminTVRouter.post("/edit-info/:id", function (req, res) {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  req.checkBody("link", "Ссылка должна быть заполнена").notEmpty();

  var name = req.body.name;
  var link = req.body.link;
  var id = req.params.id;

  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_TV/edit-info/" + id);
  } else {
    MingasTV.findById(id, function (err, info) {
      if (err) return console.log(err);
      info.name = name;
      info.link = link;
      info.save(function (err) {
        if (err) return console.log(err);

        req.flash("success", "пост отредактирован!");
        alert("пост отредактирован!");
        res.redirect("/admin/admin_TV");
      });
    });
  }
});

/*
 * GET delete product
 */
adminTVRouter.get("/delete-info/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  MingasTV.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "entry deleted!");
    res.redirect("/admin/admin_TV/");
  });
});

export default adminTVRouter;
