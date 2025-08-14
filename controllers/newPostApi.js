import alert from "alert";
import NewPosts from "../models/newPosts.js";

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
    .limit(5)
    .skip(page * 5)
    .exec(function (err, posts) {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.render("admin/newPostsApi/admin_post", {
        posts,
        count,
        pages: [...Array(Math.ceil(+count / 5))],
      });
    });
};

export const createNewPost = async (req, res) => {
  const { name, description, link, content } = req.body;
  console.log(req.files);
  // Обрабатываем несколько загруженных файлов
  let uploadedImages = [];
  if (req.files && req.files.length > 0) {
    uploadedImages = req.files.map((file) => `https://mingas.by/${file.path}`);
  }
  console.log(uploadedImages);
  const image =
    uploadedImages.length > 0
      ? uploadedImages[0]
      : "https://back.mingas.by/public/images/background_new.webp";

  var errors = req.validationErrors();
  const date = req.body.date;
  if (errors) {
    res.render("admin/newPostsApi/add_post", {
      errors,
    });
  } else {
    const post = await new NewPosts({
      name,
      description: description || "",
      images: uploadedImages?.length ? uploadedImages : "",
      link: link || "",
      content: content || "",
      image,
      date: date || new Date().toISOString().split("T")[0],
    });
    console.log(post);
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
  try {
    const errors = req.session.errors || null;
    req.session.errors = null;
    const link = req.body.link;

    await NewPosts.findById(req.params.id, function (err, posts) {
      console.log(posts);

      res.render("admin/newPostsApi/edit_post", {
        errors,
        name: posts.name,
        description: posts.description,
        images: posts.images,
        id: posts._id,
        link: link ? link.trim() : `https://mingas.by/posts/${link}`,
        content: posts.content,
        image: posts.image,
        date: posts.date,
      });
    });
  } catch (err) {
    alert(err);
  }
};

/*
 * POST edit product
 */
export const updateNewPost = async (req, res) => {
  req.checkBody("description", "Описание должно быть заполненнным").notEmpty();

  const { name, description, link, content, date } = req.body;
  const id = req.params.id;
  const errors = req.validationErrors();
  let uploadedImages = [];
  if (req.files && req.files.length > 0) {
    uploadedImages = req.files.map((file) => `https://mingas.by/${file.path}`);
  }
  const image =
    uploadedImages.length > 0
      ? uploadedImages[0]
      : "https://back.mingas.by/public/images/background_new.webp";
  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin_newpost/edit-newpost/" + id);
  } else {
    await NewPosts.findById(id, function (err, posts) {
      if (err) return console.log(err);
      posts.name = name;
      posts.description = description;
      posts.link = link || "";
      posts.content = content;
      posts.image = image;
      posts.date = date;
      posts.images = uploadedImages?.length ? uploadedImages : posts.images;
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
