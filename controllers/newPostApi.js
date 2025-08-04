import alert from "alert";
import NewPosts from "../models/newPosts.js";
import mongoose from "mongoose";

export const getNewPost = async (req, res) => {
  let count;
  NewPosts.count(function (err, c) {
    count = c;
  });
  const page = req.query.page || 0;

  await NewPosts.find({
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
      res.render("admin/newPostsApi/admin_post", {
        posts,
        count,
        pages: [...Array(Math.ceil(+count / 10))],
      });
    });
};

export const createNewPost = async (req, res) => {
  const { name, description, images, link, content } = req.body;
  const textLink = req.body.text;
  const article =
    mongoose.Types.ObjectId.isValid(link) &&
    (await NewPosts.findById(link).select("name").lean());
  const image = req.file.path
    ? req.file.path
    : "https://back.mingas.by/public/images/background_new.webp";
  console.log(image);
  console.log(req.file);
  var errors = req.validationErrors();
  const date = req.body.date;
  if (errors) {
    res.render("admin/newPostsApi/add_post", {
      errors,
    });
  } else {
    const post = new NewPosts({
      name,
      description: description || "",
      images: images || "",
      link: textLink.trim() || ``,
      content: content.trim() || article.name,
      image: `https://mingas.by/${image}`,
      date: date || new Date(),
    });
    post.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "Пост добавлен");
      res.redirect("/admin/new_posts");
    });
  }
};

export const getNewPostById = async (req, res) => {
  let errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;
  const textLink = req.body.text;
  const link = req.body.link;

  NewPosts.findById(req.params.id, function (err, posts) {
    if (err) {
      res.render("admin/newPostsApi/admin_post");
    } else {
      res.render("admin/newPostsApi/edit_post", {
        errors,
        name: posts.name,
        description: posts.description,
        images: posts.images,
        id: posts._id,
        link: textLink ? textLink.trim() : `https://mingas.by/posts/${link}`,
        content: posts.content,
        image: posts.image,
        date: posts.date,
        text: posts.text,
      });
    }
  });
};

/*
 * POST edit product
 */
export const updateNewPost = async (req, res) => {
  req.checkBody("name", "Описание должно быть заполненым").notEmpty();
  req.checkBody("description", "Описание должно быть заполненым").notEmpty();

  const { name, description, images, link, content, image, date, text } =
    req.body;
  const id = req.params.id;
  const errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_newpost/edit-newpost/" + id);
  } else {
    NewPosts.findById(id, function (err, posts) {
      if (err) return console.log(err);
      posts.name = name;
      posts.description = description;
      posts.link = link;
      posts.content = content;
      posts.image = image;
      posts.date = date;
      posts.images = images;
      posts.text = text;
      posts.save(function (err) {
        if (err) return console.log(err);

        req.flash("success", "пост отредактирован!");
        alert("Пост отредактирован");
        res.redirect("/admin/new_posts");
      });
    });
  }
};

/*
 * GET delete product
 */
export const deletePost = async (req, res) => {
  var id = req.params.id;
  NewPosts.findByIdAndRemove(id, function (err) {
    if (err) return console.log(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/new_posts");
  });
};
