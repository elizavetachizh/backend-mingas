// const express = require("express");
import express from "express";
import Page from "../../models/page.js";
const pageSlugRouter = express.Router();

/*
 * GET /
 */
pageSlugRouter.get("/", function (req, res) {
  Page.findOne({ slug: "home" }, function (err, page) {
    if (err) console.log(err);

    res.render("index", {
      title: page.title,
      content: page.content,
    });
  });
});

pageSlugRouter.get("/:slug", function (req, res) {
  var slug = req.params.slug;

  Page.findOne({ slug: slug }, function (err, page) {
    if (err) console.log(err);
    if (!page) {
      res.redirect("/");
    } else {
      // res.render("index", {
      //   title: page.title,
      //   content: page.content,
      // });
      res.send(page);
    }
  });
});
export default pageSlugRouter;
