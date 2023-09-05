const express = require("express");
const router = express.Router();
const Posts = require("../../models/posts");
const { isAdmin } = require("../../config/auth");
var alert = require("alert");
const mainPosts = require("../../models/mainPosts");
router.get("/", isAdmin, function (req, res) {
  var count;
  Posts.count(function (err, c) {
    count = c;
  });
  Posts.find(function (err, posts) {
    res.render("admin/admin_posts", {
      posts,
      count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-post", isAdmin, function (req, res) {
  var link = "";
  var content = "";
  var image = "";
  var date = new Date();
  mainPosts.find(function (err, mainPosts) {
    res.render("admin/add_posts", {
      link,
      content,
      image,
      date,
      mainPosts,
    });
  });
});

router.post("/add-post", (req, res) => {
  req.checkBody("link", "Название должно быть заполненым").notEmpty();
  req.checkBody("content", "Описание должно быть заполненым").notEmpty();
  req.checkBody("image", "Картинка должна быть загружена").notEmpty();

  var link = req.body.link;
  var content = req.body.content;
  var image = req.body.image;
  var date = req.body.date;
  var errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/add_posts", {
      errors,
      link,
      content,
      image,
      date,
    });
  } else {
    Posts.findOne({ link }, function (err, post) {
      if (post) {
        res.render("admin/add_posts", {
          link,
          content,
          image,
          date,
        });
      } else {
        var post = new Posts({
          link,
          content,
          image,
          date,
        });
        post.save(function (err) {
          if (err) {
            return console.log(err);
          }
          req.flash("success", "Пост добавлен");
          res.redirect("/admin/admin_posts");
        });
      }
    });
  }
});

/*
 * GET edit product
 */
router.get("/edit-post/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  Posts.findById(req.params.id, function (err, post) {
    if (err) {
      console.log(err);
      res.render("admin/admin_posts");
    } else {
      res.render("admin/edit_post", {
        errors,
        link: post.link,
        content: post.content,
        image: post.image,
        id: post._id,
        date: post.date,
      });
    }
  });
});

/*
 * POST edit product
 */
router.post("/edit-post/:id", function (req, res) {
  req.checkBody("link", "Название должно быть заполненым").notEmpty();
  req.checkBody("content", "Описание должно быть заполненым").notEmpty();

  var link = req.body.link;
  var content = req.body.content;
  var image = req.body.image;
  var id = req.params.id;
  var date = req.body.date;

  var errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_posts/edit-post/" + id);
  } else {
    Posts.findOne(
      { link, content, image, date },
      function (err, post) {
        if (err) {
          console.log(err);
        }
        if (post) {
          res.redirect("/admin/admin_posts");
        } else {
          Posts.findById(id, function (err, post) {
            if (err) return console.log(err);

            post.link = link;
            post.content = content;
            post.image = image;
            post.date = date;
            post.save(function (err) {
              if (err) return console.log(err);

              req.flash("success", "пост отредактирован!");
              alert("Пост отредактирован");
              res.redirect("/admin/admin_posts/");
            });
          });
        }
      }
    );
  }
});

/*
 * GET delete product
 */
router.get("/delete-post/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  Posts.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_posts/");
  });
});

module.exports = router;
