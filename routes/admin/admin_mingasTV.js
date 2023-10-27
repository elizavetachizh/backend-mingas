const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../config/auth");
var alert = require("alert");
const MingasTV = require("../../models/mingasTV");
router.get("/", isAdmin, function (req, res) {
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
router.get("/add-info", isAdmin, function (req, res) {
  var name = "";
  var link = "";
  res.render("admin/add_TV", {
    name,
    link,
  });
});

router.post("/add-info", (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  req.checkBody("link", "Ссылка должна быть заполнена").notEmpty();

  var name = req.body.name;
  var link = req.body.link;

  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/add_TV", {
      errors,
      name,
      link,
    });
  } else {
    MingasTV.findOne({ name, link }, function (err, questions) {
      if (questions) {
        res.render("admin/add_questions", {
          name,
          link,
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
  }
});

/*
 * GET edit product
 */
router.get("/edit-info/:id", isAdmin, function (req, res) {
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
router.post("/edit-info/:id", function (req, res) {
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
    MingasTV.findOne({ name, link }, function (err, info) {
      if (err) {
        console.log(err);
      }
      if (info) {
        res.redirect("/admin/admin_TV");
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
  }
});

/*
 * GET delete product
 */
router.get("/delete-info/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  MingasTV.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "entry deleted!");
    res.redirect("/admin/admin_TV/");
  });
});

module.exports = router;
