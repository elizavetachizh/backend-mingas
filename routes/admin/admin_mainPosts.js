import express from "express";
const adminMainPostsRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import alert from "alert";
import MainPosts from "../../models/mainPosts.js";
adminMainPostsRouter.get("/", isAdmin, async (req, res) => {
  var count;
  MainPosts.count(function (err, c) {
    count = c;
  });
  const page = req.query.page || 0;

  await MainPosts.find({
    name: { $regex: req.query.search || "" },
  })
    .sort({ _id: -1 })
    .limit(10)
    .skip(page * 10)
    .exec(function (err, posts) {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.render("admin/admin_mainpost", {
        posts,
        count,
        pages: [...Array(Math.ceil(+count / 10))],
      });
    });
});

/*
 * GET add product
 */
adminMainPostsRouter.get("/add-mainpost", isAdmin, function (req, res) {
  const name = "";
  const description = "";
  const type = "";
  const images = "";

  res.render("admin/add_mainpost", {
    name,
    type,
    description,
    images,
  });
});

adminMainPostsRouter.post("/add-mainpost", (req, res) => {
  req.checkBody("name", "Описание должно быть заполненым").notEmpty();
  req.checkBody("description", "Картинка должна быть загружена").notEmpty();
  const { name, description, type, images } = req.body;

  var errors = req.validationErrors();
  if (errors) {
    res.render("/admin/add_mainpost", {
      errors,
    });
  } else {
    var newPosts = new MainPosts({
      name,
      type,
      description,
      images,
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

/*
 * GET edit product
 */
adminMainPostsRouter.get("/edit-mainpost/:id", isAdmin, function (req, res) {
  var errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;

  MainPosts.findById(req.params.id, function (err, posts) {
    if (err) {
      res.render("admin/admin_mainpost");
    } else {
      res.render("admin/edit_mainpost", {
        errors,
        name: posts.name,
        type: posts.type,
        description: posts.description,
        images: posts.images,
        id: posts._id,
      });
    }
  });
});

/*
 * POST edit product
 */
adminMainPostsRouter.post("/edit-mainpost/:id", function (req, res) {
  req.checkBody("name", "Описание должно быть заполненым").notEmpty();
  req.checkBody("description", "Описание должно быть заполненым").notEmpty();

  const { name, description, type, images } = req.body;
  const id = req.params.id;
  const errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_mainpost/edit-mainpost/" + id);
  } else {
    MainPosts.findById(id, function (err, posts) {
      if (err) return console.log(err);
      posts.name = name;
      posts.description = description;
      posts.type = type;
      posts.images = images;
      posts.save(function (err) {
        if (err) return console.log(err);

        req.flash("success", "пост отредактирован!");
        alert("Пост отредактирован");
        res.redirect("/admin/admin_mainpost/edit-mainpost/" + id);
      });
    });
  }
});

/*
 * GET delete product
 */
adminMainPostsRouter.get("/delete-mainpost/:id", isAdmin, function (req, res) {
  var id = req.params.id;
  MainPosts.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin_mainpost");
  });
});

export default adminMainPostsRouter;
