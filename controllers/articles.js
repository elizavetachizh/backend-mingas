import alert from "alert";
import mainArticle from "../models/mainArticles.js";

export const getArticles = async (req, res) => {
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
};

export const createArticle = async (req, res) => {
  // req.checkBody("content", "Описание должно быть заполненым").notEmpty();
  // req.checkBody("image", "Картинка должна быть загружена").notEmpty();
  var content = req.body.content;
  var button = req.body.button;
  var link = req.body.link;
  const image = req.file?.path
    ? req.file.path
    : "https://back.mingas.by/admin/upload/files/1718283945809-phone.webp";
  console.log(req.file);
  const errors = req.validationErrors();
  try {
    const newArticle = new mainArticle({
      content,
      button,
      link,
      image,
    });
    console.log(newArticle);
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
};
/*
 * GET edit product
 */
export const getArticleById = async (req, res) => {
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
};
/*
 * POST edit product
 */
export const updateArticle = async (req, res) => {
  var content = req.body.content;
  const image = req.file
    ? req.file.path
    : "https://back.mingas.by/admin/upload/files/1718283945809-phone.webp";
  const id = req.params.id;
  const button = req.body.button;
  const link = req.body.link;
  const errors = req.validationErrors();
  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_article/edit-article/" + id);
  } else {
    mainArticle.findById(id, function (err, article) {
      if (err) return console.log(err);

      article.content = content;
      article.image = image ? image : article.image;
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
};
/*
 * GET delete product
 */
export const deleteArticle = async (req, res) => {
  const id = req.params.id;
  mainArticle.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_article");
  });
};
