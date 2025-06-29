import alert from "alert";
import Posts from "../models/posts.js";
import MainPosts from "../models/mainPosts.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
  const page = req.query.page || 0;
  try {
    const posts = await Posts.find({
      content: { $regex: req.query.search || "" },
    })
      .sort({ _id: -1 })
      .limit(5)
      .skip(page * 5); // Получить все записи
    const count = await Posts.countDocuments(); // Получить количество записей
    res.render("admin/admin_posts", {
      posts,
      count,
      pages: [...Array(Math.ceil(+count / 5))],
    }); // Передать записи и их количество в шаблон
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPosts = async (req, res) => {
  const name = req.body.name;
  const link = req.body.link;
  const textLink = req.body.text;
  const content = req.body.content;
  const article =
    mongoose.Types.ObjectId.isValid(link) &&
    (await MainPosts.findById(link).select("name").lean());
  const image = req.file.path
    ? req.file.path
    : "https://back.mingas.by/public/images/background_new.webp";
  const date = req.body.date;
  const errors = req.validationErrors();
  if (errors) {
    res.render("admin/add_posts", {
      errors,
    });
  } else {
    const newPost = await new Posts({
      link: textLink.trim() || `https://mingas.by/posts/${link}`,
      content: content.trim() || article.name,
      image:`https://mingas.by/${image}`,
      date,
      name,
    });
    await newPost.save(function (err) {
      if (err) {
        return console.log(err);
      }
      alert("Пост был добавлен");
      res.redirect("/admin/admin_posts");
    });
  }
};

export const getPostsById = async (req, res) => {
  try {
    let errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const post = await Posts.findById(req.params.id);
    const mainPosts = await MainPosts.find({}, { name: 1 })
      .sort({ _id: -1 })
      .limit(7);
    if (!post) return res.status(404).json({ error: "Section not found" });
    console.log(post);
    res.render("admin/edit_post", {

      errors,
      link: post.link,
      content: post.content,
      image: post.image,
      id: post._id,
      date: post.date,
      name: post.name,
      mainPosts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePost = async (req, res) => {
  req.checkBody("link", "Название должно быть заполненым").notEmpty();
  req.checkBody("content", "Описание должно быть заполненым").notEmpty();
  const link = req.body.link;
  const textLink = req.body.text;
  try {
    let errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      res.redirect("/admin/admin_posts/");
    } else {
      const post = await Posts.findByIdAndUpdate(req.params.id, {
        link: textLink ? textLink.trim() : `https://mingas.by/posts/${link}`,
        image: req.body.image,
        content: req.body.content,
        date: req.body.date,
        name: req.body.name,
      });
      if (!post) return res.status(404).json({ error: "Post not found" });
      alert("Статья была отредактирована");
      res.redirect("/admin/admin_posts");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Posts.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "User not found" });
    alert("Пост был удален");
    res.redirect("/admin/admin_posts");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
