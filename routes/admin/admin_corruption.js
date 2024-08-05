const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../config/auth");
var alert = require("alert");
const Corruption = require("../../models/corruption");
router.get("/", isAdmin, function (req, res) {
  var count;
  Corruption.count(function (err, c) {
    count = c;
  });
  Corruption.find(function (err, corruption) {
    res.render("admin/admin_corruption", {
      corruption,
      count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-element", isAdmin, function (req, res) {
  var link = "";
  var name = "";
  res.render("admin/add_corruption", {
    link,
    name,
  });
});

router.post("/add-element", (req, res) => {
  var link = req.body.link;
  var name = req.body.name;
  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/add_corruption", {
      errors,
    });
  } else {
    Corruption.findOne({ name: name, link: link }, function (err, element) {
      if (element) {
        res.render("admin/add_corruption", {
          link,
          name,
        });
      } else {
        var post = new Corruption({
          link,
          name,
        });
        post.save(function (err) {
          if (err) {
            return console.log(err);
          }
          req.flash("success", "Пост добавлен");
          res.redirect("/admin/admin_corruption");
        });
      }
    });
  }
});

/*
 * GET edit product
 */
router.get("/edit-element/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  Corruption.findById(req.params.id, function (err, post) {
    // console.log(post);
    if (err) {
      console.log(err);
      res.render("admin/admin_corruption");
    } else {
      res.render("admin/edit_corruption", {
        errors,
        link: post.link,
        name: post.name,
        id: post._id,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-element/:id", function (req, res) {
  var link = req.body.link;
  var name = req.body.name;
  var id = req.params.id;

  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_element/edit-element/" + id);
  } else {
    Corruption.findOne({ link, name }, function (err, post) {
      // console.log("post2", post);
      if (err) {
        console.log(err);
      }
      if (post) {
        res.redirect("/admin/admin_corruption");
      } else {
        Corruption.findById(id, function (err, post) {
          if (err) return console.log(err);

          post.link = link;
          post.name = name;
          post.save(function (err) {
            if (err) return console.log(err);

            req.flash("success", "пост отредактирован!");
            alert("Пост отредактирован");
            res.redirect("/admin/admin_corruption/");
          });
        });
      }
    });
  }
});

/*
 * GET delete product
 */
router.get("/delete-element/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Corruption.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_corruption");
  });
});

module.exports = router;
