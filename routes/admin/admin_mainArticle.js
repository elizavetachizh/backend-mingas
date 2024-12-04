import express from "express";
const mainArticleAdminRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import alert from "alert";
import mainArticle from "../../models/mainArticles.js";
mainArticleAdminRouter.get("/", isAdmin, function (req, res) {
  var count;
  mainArticle.count(function (err, c) {
    count = c;
  });
  mainArticle.find(function (err, articles) {
    res.render("admin/admin_articles", {
      articles,
      count,
    });
  });
});
/*
 * GET add product
 */
mainArticleAdminRouter.get("/add-article", isAdmin, function (req, res) {
  var content = "";
  var button = "";
  var link = "";
  var image = "";
  res.render("admin/add_article", {
    content,
    button,
    link,
    image,

  });
});

mainArticleAdminRouter.post("/add-article", (req, res) => {
  // req.checkBody("content", "Описание должно быть заполненым").notEmpty();
  // req.checkBody("image", "Картинка должна быть загружена").notEmpty();
  var content = req.body.content;
  var button = req.body.button;
  var link = req.body.link;
  var image = req.body.image
    ? req.body.image
    : "https://back.mingas.by/admin/upload/files/1718283945809-phone.webp";

  var errors = req.validationErrors();
  try {
    var newArticle = new mainArticle({
      content,
      button,
      link,
      image,
    });
    newArticle.save(function (err) {
      if (err) {
        return console.log(err);
      }

      req.flash("success", "Пост добавлен");
      res.redirect("/admin/admin_article");
    });
  } catch (error) {
    res.render("admin/add_article", {
      errors,
    });
  }
});
/*
 * GET edit product
 */
mainArticleAdminRouter.get("/edit-article/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  mainArticle.findById(req.params.id, function (err, article) {
    if (err) {
      console.log(err);
      res.render("admin/admin_article");
    } else {
      res.render("admin/edit_article", {
        errors,
        content: article.content,
        image: article.image,
        button: article.button,
        link: article.link,
        id: article._id,
      });
    }
  });
});
/*
 * POST edit product
 */
mainArticleAdminRouter.post("/edit-article/:id", function (req, res) {
  var content = req.body.content;
  var image = req.body.image;
  var id = req.params.id;
  var button = req.body.button;
  var link = req.body.link;
  var errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_article/edit-article/" + id);
  } else {
    mainArticle.findById(id, function (err, article) {
      if (err) return console.log(err);

      article.content = content;
      article.image = image;
      article.button = button;
      article.link = link;
      article.save(function (err) {
        if (err) return console.log(err);

        req.flash("success", "пост отредактирован!");
        alert("Пост отредактирован");
        res.redirect("/admin/admin_article");
      });
    });
  }
});
/*
 * GET delete product
 */
mainArticleAdminRouter.get("/delete-article/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  mainArticle.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_article");
  });
});

export default mainArticleAdminRouter;
