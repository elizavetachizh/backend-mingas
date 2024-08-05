const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../config/auth");
var alert = require("alert");
const Branches = require("../../models/branches");
router.get("/", isAdmin, function (req, res) {
  var count;
  Branches.count(function (err, c) {
    count = c;
  });
  Branches.find(function (err, info) {
    res.render("admin/admin_info_ogonek", {
      info,
      count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-info", isAdmin, function (req, res) {
  var content = "";
  var title = "";
  var typeBranch = "";
  res.render("admin/add_info_ogonek", {
    content,
    title,
    typeBranch,
  });
});

router.post("/add-info", (req, res) => {
  req.checkBody("title", "Название должно быть заполненым").notEmpty();
  var content = req.body.content;
  var title = req.body.title;
  var typeBranch = req.body.typeBranch;
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.render("admin/add_info_ogonek", {
      errors,
      content,
      title,
      typeBranch,
    });
  } else {
    Branches.findOne({ title }, function (err, info) {
      if (info) {
        res.render("admin/add_info_ogonek", {
          content,
          title,
          typeBranch,
        });
      } else {
        var newBranch = new Branches({
          content,
          title,
          typeBranch,
        });
        newBranch.save(function (err) {
          if (err) {
            return console.log(err);
          }
          req.flash("success", "Пост добавлен");
          res.redirect("/admin/admin_ogonek");
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

  Branches.findById(req.params.id, function (err, info) {
    // console.log(tender);
    console.log(info)
    if (err) {
      console.log(err);
      res.render("admin/admin_info_ogonek");
    } else {
      res.render("admin/edit_info_ogonek", {
        errors,
        content: info.content,
        title: info.title,
        typeBranch: info.typeBranch,
        id: info._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-info/:id", function (req, res) {
  req.checkBody("content", "Описание должно быть заполненым").notEmpty();

  var content = req.body.content;
  var title = req.body.title;
  var typeBranch = req.body.typeBranch;
  var id = req.params.id;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin_ogonek/edit-info/" + id);
  } else {
    Branches.findOne({ title, content, typeBranch }, function (err, info) {
      if (err) {
        console.log(err);
      }
      if (info) {
        // console.log("tender", tender);
        res.redirect("/admin/admin_ogonek");
      } else {
        Branches.findById(id, function (err, info) {
          if (err) return console.log(err);
          info.content = content;
          info.title = title;
          info.typeBranch = typeBranch;
          info.save(function (err) {
            if (err) return console.log(err);

            req.flash("success", "пост отредактирован!");
            alert("Пост отредактирован");
            res.redirect("/admin/admin_ogonek");
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
  Branches.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_ogonek/");
  });
});

module.exports = router;
