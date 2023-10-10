const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../config/auth");
var alert = require("alert");
const mainPosts = require("../../models/mainPosts");
router.get("/", isAdmin, function (req, res) {
  var count;
  mainPosts.count(function (err, c) {
    count = c;
  });
  mainPosts.find(function (err, posts) {
    res.render("admin/admin_mainpost", {
      posts,
      count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-mainpost", isAdmin, function (req, res) {
  var name = "";
  var description = "";
  var type = "";

  res.render("admin/add_mainpost", {
    name,
    type,
    description,
  });
});

router.post("/add-mainpost", (req, res) => {
  req.checkBody("name", "Описание должно быть заполненым").notEmpty();
  req.checkBody("description", "Картинка должна быть загружена").notEmpty();

  var name = req.body.name;
  var description = req.body.description;
  const type = req.body.type;

  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.render("/admin/add_mainpost", {
      errors,
      name,
      type,
      description,
    });
  } else {
    mainPosts.findOne({ name, type, description }, function (err, posts) {
      if (posts) {
        res.render("/admin/add_mainpost", {
          name,
          type,
          description,
        });
      } else {
        var newPosts = new mainPosts({
          name,
          type,
          description,
        });
        newPosts.save(function (err) {
          if (err) {
            return console.log(err);
          }
          req.flash("success", "Пост добавлен");
          res.redirect("/admin/admin_mainpost");
        });
      }
    });
  }
});

/*
 * GET edit product
 */
router.get("/edit-mainpost/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  mainPosts.findById(req.params.id, function (err, posts) {
    if (err) {
      console.log(err);
      res.render("admin/admin_mainpost");
    } else {
      res.render("admin/edit_mainpost", {
        errors,
        name: posts.name,
        type: posts.type,
        description: posts.description,
        id: posts._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-mainpost/:id", function (req, res) {
  req.checkBody("name", "Описание должно быть заполненым").notEmpty();
  req.checkBody("description", "Описание должно быть заполненым").notEmpty();

  var name = req.body.name;
  var description = req.body.description;
  var id = req.params.id;
  var type = req.body.type;
  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_mainpost/edit-mainpost/" + id);
  } else {
    mainPosts.findOne({ name, type, description }, function (err, posts) {
      if (err) {
        console.log(err);
      }
      if (posts) {
        res.redirect("/admin/admin_mainpost");
      } else {
        mainPosts.findById(id, function (err, posts) {
          if (err) return console.log(err);
          posts.name = name;
          posts.description = description;
          posts.type = type;
          posts.save(function (err) {
            if (err) return console.log(err);

            req.flash("success", "пост отредактирован!");
            alert("Пост отредактирован");
            res.redirect("/admin/admin_mainpost/edit-mainpost/" + id);
          });
        });
      }
    });
  }
});

/*
 * GET delete product
 */
router.get("/delete-mainpost/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  mainPosts.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_mainpost");
  });
});

module.exports = router;
