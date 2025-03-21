// const express = require("express");
import express from "express";
const adminPageRouter = express.Router();
// const Page = require("../../models/page");
import Page from "../../models/page.js";
// const auth = require("../../config/auth");
import { isAdmin } from "../../config/auth.js";

adminPageRouter.get("/", isAdmin, function (req, res) {
  Page.find({})
    .sort({ sorting: 1 })
    .exec(function (err, pages) {
      res.render("admin/pages", {
        pages,
      });
    });
});
adminPageRouter.get("/add_page", isAdmin, function (req, res) {
  var title = "";
  var slug = "";
  var content = "";
  res.render("admin/add_page", {
    title: title,
    slug: slug,
    content: content,
  });
});

adminPageRouter.post("/add_page", (req, res) => {
  req.checkBody("title", "Заголовок должен быть заполненым").notEmpty();
  req.checkBody("content", "Контент должен быть заполненым").notEmpty();

  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
  if (slug === "") slug = title.replace(/\s+/g, "-").toLowerCase();
  var content = req.body.content;

  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/add_page", {
      errors: errors,
      title: title,
      slug: slug,
      content: content,
    });
  } else {
    Page.findOne({ slug: slug }, function (err, page) {
      if (page) {
        req
          .checkBody(
            "title",
            "Данная страницы была создана ранее, попробуйте создать новую"
          )
          .notEmpty();
        req.flash(
          "danger",
          "Данная страницы была создана ранее, попробуйте создать новую"
        );
        res.render("admin/add_page", {
          title: title,
          slug: slug,
          content: content,
        });
      } else {
        var newPage = new Page({
          title,
          slug,
          content,
          sorting: 100,
        });

        newPage.save(function (err) {
          if (err) {
            return console.log(err);
          }
          Page.find({})
            .sort({ sorting: 1 })
            .exec(function (err, pages) {
              if (err) {
                return console.log(err);
              } else {
                req.app.locals.pages = pages;
              }
            });
        });

        req.flash("success", "Страница добавлена");
        res.redirect("/admin_page");
      }
    });
  }
});

/*
 * GET edit page
 */
adminPageRouter.get("/edit-page/:id", isAdmin, function (req, res) {
  Page.findById(req.params.id, function (err, page) {
    if (err) return console.log(err);
    res.render("admin/edit_page", {
      title: page.title,
      slug: page.slug,
      content: page.content,
      id: page._id,
    });
  });
});

/*
 * POST edit page
 */
adminPageRouter.post("/edit-page/:id", function (req, res) {
  req.checkBody("title", "Title must have a value.").notEmpty();
  req.checkBody("content", "Content must have a value.").notEmpty();

  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, "-").toLowerCase();
  if (slug === "") slug = title.replace(/\s+/g, "-").toLowerCase();
  var content = req.body.content;
  var id = req.body.id;

  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/edit_page", {
      errors: errors,
      title: title,
      slug: slug,
      content: content,
      id: id,
    });
  } else {
    Page.findOne({ slug, _id: { $ne: id } }, function (err, page) {
      if (page) {
        req
          .checkBody(
            "slug",
            "Данная страницы была создана ранее, попробуйте создать новую"
          )
          .notEmpty();
        res.render("admin/edit_page", {
          title: title,
          slug: slug,
          content: content,
          id: id,
        });
      } else {
        Page.findById(id, function (err, page) {
          if (err) return console.log(err);

          page.title = title;
          page.slug = slug;
          page.content = content;

          page.save(function (err) {
            if (err) return console.log(err);

            Page.find({})
              .sort({ sorting: 1 })
              .exec(function (err, pages) {
                if (err) {
                  console.log(err);
                } else {
                  req.app.locals.pages = pages;
                }
              });

            req.flash("success", "Страница отредактировна!");

            res.redirect("/admin_page/edit-page/" + page.id);
          });
        });
      }
    });
  }
});

/*
 * GET delete page
 */
adminPageRouter.get("/delete-page/:id", isAdmin, function (req, res) {
  Page.findByIdAndRemove(req.params.id, function (err) {
    if (err) return console.log(err);

    Page.find({})
      .sort({ sorting: 1 })
      .exec(function (err, pages) {
        if (err) {
          console.log(err);
        } else {
          req.app.locals.pages = pages;
        }
      });

    req.flash("success", "Page deleted!");
    res.redirect("/admin_page/");
  });
});

export default adminPageRouter;
