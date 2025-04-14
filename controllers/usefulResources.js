import alert from "alert";
import UsefulResources from "../models/usefulResources.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await UsefulResources.find();

    const count = await UsefulResources.countDocuments(); // Получить количество записей
    res.render("admin/usefulResources/admin_posts", {
      posts,
      count,
    }); // Передать записи и их количество в шаблон
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPosts = async (req, res) => {
  const name = req.body.name;
  const link = req.body.link;
  const content = req.body.content;
  const image = req.body.image;
  const date = req.body.date;
  const errors = req.validationErrors();
  if (errors) {
    res.render("admin/usefulResources/add_posts", {
      errors,
    });
  } else {
    const newPost = await new UsefulResources({
      link,
      content: content.trim(),
      image,
      date,
      name,
    });
    await newPost.save(function (err) {
      if (err) {
        return console.log(err);
      }
      alert("Пост был добавлен");
      res.redirect("/admin/useful-resources");
    });
  }
};

export const getPostsById = async (req, res) => {
  try {
    let errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const post = await UsefulResources.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Section not found" });
    res.render("admin/usefulResources/edit_post", {
      errors,
      link: post.link,
      content: post.content,
      image: post.image,
      id: post._id,
      date: post.date,
      name: post.name,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePost = async (req, res) => {
  req.checkBody("link", "Название должно быть заполненым").notEmpty();
  req.checkBody("content", "Описание должно быть заполненым").notEmpty();
  try {
    let errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      res.redirect("/admin/useful-resources/");
    } else {
      const post = await UsefulResources.findByIdAndUpdate(
        req.params.id,
        {
          link: req.body.link,
          image: req.body.image,
          content: req.body.content,
          date: req.body.date,
          name: req.body.name,
        },
        { new: true }
      );
      if (!post) return res.status(404).json({ error: "Post not found" });
      alert("Статья была отредактирована");
      res.redirect("/admin/useful-resources");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await UsefulResources.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "User not found" });
    alert("Пост был удален");
    res.redirect("/admin/useful-resources");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
