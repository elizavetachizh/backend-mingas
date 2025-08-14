import alert from "alert";
import EcoBoxModel from "../../models/ecobox/info/index.js";
import ThemeOfEcoBoxModel from "../../models/ecobox/themes/index.js";

export const getContent = async (req, res) => {
  try {
    const count = await EcoBoxModel.countDocuments();

    // Получаем содержимое
    const content = await EcoBoxModel.find().populate("theme");
    console.log(content);
    res.render("admin/ecobox/content/admin_list", {
      content,
      count,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createContent = async (req, res) => {
  const { name, description, theme, price } = req.body;

  // Обрабатываем несколько загруженных файлов
  let uploadedImages = [];
  if (req.files && req.files.length > 0) {
    uploadedImages = req.files.map((file) => `https://mingas.by/${file.path}`);
  }
  const errors = req.validationErrors();

  if (errors) {
    res.render("admin/ecobox/content/add_info", {
      errors,
    });
  }
  try {
    const content = new EcoBoxModel({
      name,
      description: description || "",
      images: uploadedImages?.length ? uploadedImages : "",
      theme,
      price,
    });

    console.log(content);
    content.save();
    req.flash("success", "Пост добавлен");
    res.redirect("/admin/admin-ecobox");
  } catch (err) {
    alert(err);
  }
};

export const getContentById = async (req, res) => {
  let errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;
  ThemeOfEcoBoxModel.find({}).exec(function (err, themes) {
    EcoBoxModel.findById(req.params.id, function (err, content) {
      console.log(content);
      if (err) {
        res.render("admin/ecobox/content/admin_list");
      } else {
        res.render("admin/ecobox/content/edit_info", {
          errors,
          name: content.name,
          description: content.description,
          images: content.images,
          id: content._id,
          theme: content.theme,
          price: content.price,
          themes,
        });
      }
    });
  });
};

/*
 * POST edit product
 */
export const updateContent = async (req, res) => {
  req.checkBody("description", "Описание должно быть заполненным").notEmpty();

  const { name, description, theme, price } = req.body;
  const id = req.params.id;
  const errors = req.validationErrors();
  let uploadedImages = [];
  if (req.files && req.files.length > 0) {
    uploadedImages = req.files.map((file) => `https://mingas.by/${file.path}`);
  }

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin-ecobox/edit-content/" + id);
  } else {
    EcoBoxModel.findById(id, function (err, content) {
      if (err) return console.log(err);
      content.name = name;
      content.description = description;
      content.theme = theme;
      content.price = price;
      content.images = uploadedImages?.length ? uploadedImages : content.images;
      content.save(function (err) {
        if (err) return console.log(err);

        req.flash("success", "пост отредактирован!");
        alert("Пост отредактирован");
        res.redirect("/admin/admin-ecobox");
      });
    });
  }
};

/*
 * GET delete product
 */
export const deleteContent = async (req, res) => {
  const id = req.params.id;
  EcoBoxModel.findByIdAndRemove(id, function (err) {
    if (err) return alert(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin-ecobox");
  });
};
