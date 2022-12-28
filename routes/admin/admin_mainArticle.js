const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../config/auth");
var alert = require("alert");
const mainArticle = require("../../models/mainArticles");
const mainPosts = require("../../models/mainPosts");
const fs = require("fs-extra");
router.get("/", isAdmin, function (req, res) {
  var count;
  mainArticle.count(function (err, c) {
    count = c;
  });
  mainArticle.find(function (err, articles) {
    res.render("admin/admin_articles", {
      articles: articles,
      count: count,
    });
  });
});

/*
 * GET add product
 */
router.get("/add-article", isAdmin, function (req, res) {
  var content = "";
  var button = "";
  var link = "";

  mainPosts.find(function (err, post) {
    res.render("admin/add_article", {
      content: content,
      button: button,
      link: link,
      href: post,
    });
  });
});

router.post("/add-article", (req, res) => {
  // req.checkBody("content", "Описание должно быть заполненым").notEmpty();
  // req.checkBody("image", "Картинка должна быть загружена").notEmpty();
  var imageFile =
    typeof req.files?.image !== "undefined" ? req.files.image.name : "";
  var content = req.body.content;
  var button = req.body.button;
  var link = req.body.link;
  var href = req.body.href;

  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    mainPosts.find(function (err, post) {
      res.render("admin/add_article", {
        errors: errors,
        content: content,
        image: imageFile,
        button: button,
        link: link,
        href: post,
      });
    });
  } else {
    mainArticle.findOne({ content: content }, function (err, article) {
      if (article) {
        mainPosts.find(function (err, post) {
          res.render("admin/add_article", {
            content: content,
            button: button,
            link: link,
            href: post,
          });
        });
      } else {
        var article = new mainArticle({
          content: content,
          image: imageFile,
          button: button,
          link: link,
          href: href,
        });
        article.save(function (err) {
          if (err) {
            return console.log(err);
          }

          if (imageFile !== "") {
            let productImage = req.files.image;
            let path = "public/images" + "/" + imageFile;

            productImage.mv(path, function (err) {
              return console.log(err);
            });
          }

          req.flash("success", "Пост добавлен");
          res.redirect("/admin/admin_article");
        });
      }
    });
  }
});

/*
 * GET edit product
 */
router.get("/edit-article/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  mainPosts.find(function (err, post) {
    mainArticle.findById(req.params.id, function (err, article) {
      if (err) {
        console.log(err);
        res.render("admin/admin_article");
      } else {
        res.render("admin/edit_article", {
          errors: errors,
          content: article.content,
          image: article.image,
          button: article.button,
          link: article.link,
          id: article._id,
          href: post,
        });
      }
    });
  });
});

/*
 * POST edit product
 */
router.post("/edit-article/:id", function (req, res) {
  req.checkBody("content", "Описание должно быть заполненым").notEmpty();

  var content = req.body.content;
  var imageFile =
    typeof req.files?.image !== "undefined" ? req.files.image.name : "";
  var id = req.params.id;
  var button = req.body.button;
  var link = req.body.link;
  var href = req.body.href;
  var image = req.body.image;
  var errors = req.validationErrors();
  console.log(imageFile);
  if (errors) {
    console.log(errors);
    req.session.errors = errors;
    res.redirect("/admin/admin_article/edit-article/" + id);
  } else {
    mainArticle.findOne(
      { content: content, link: link, href: href, image: imageFile },
      function (err, article) {
        if (err) {
          console.log(err);
        }
        if (article) {
          console.log(article);
          res.redirect("/admin/admin_article");
        } else {
          mainArticle.findById(id, function (err, article) {
            if (err) return console.log(err);

            article.content = content;
            article.image = imageFile;
            article.button = button;
            article.link = link;
            article.href = href;

            article.save(function (err) {
              if (err) return console.log(err);

              if (imageFile !== "") {
                var serviceImage = req.files.image;
                var path = "public/images" + "/" + imageFile;

                serviceImage.mv(path, function (err) {
                  return console.log(err);
                });
              }
              console.log(`art`, article);
              req.flash("success", "пост отредактирован!");
              alert("Пост отредактирован");
              res.redirect("/admin/admin_article");
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
router.get("/delete-article/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  mainArticle.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_article");
  });
});

module.exports = router;
