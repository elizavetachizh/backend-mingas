import alert from "alert";
import ThemeOfEcoBoxModel from "../../models/ecobox/themes/index.js";

export const getTheme = async (req, res) => {
  try {
    // Получаем количество документов
    const count = await ThemeOfEcoBoxModel.countDocuments();

    // Получаем содержимое
    const content = await ThemeOfEcoBoxModel.find();

    // Рендерим шаблон
    res.render("admin/ecobox/theme/admin_list", {
      content,
      count,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createTheme = async (req, res) => {
  const { title } = req.body;
  console.log(title);
  const errors = req.validationErrors();

  if (errors) {
    res.render("admin/ecobox/theme/add_info", {
      errors,
    });
  }
  try {
    const content = new ThemeOfEcoBoxModel({
      title,
    });
    console.log(content);
    await content.save();
    req.flash("success", "Новая вкладка добавлена");
    res.redirect("/admin/admin-ecobox-theme");
  } catch (err) {
    alert(err);
  }
};

export const getThemeById = async (req, res) => {
  try {
    const errors = req.session.errors || null;
    req.session.errors = null;

    const content = await ThemeOfEcoBoxModel.findById(req.params.id);

    if (!content) {
      return res.render("admin/ecobox/theme/admin_list");
    }

    res.render("admin/ecobox/theme/edit_info", {
      errors,
      title: content.title,
      id: content._id,
    });
  } catch (err) {
    alert(err);
    res.render("admin/ecobox/theme/admin_list");
  }
};

/*
 * POST edit product
 */
export const updateTheme = async (req, res) => {
  try {
    req.checkBody("title", "Описание должно быть заполненным").notEmpty();
    const errors = req.validationErrors();

    if (errors) {
      req.session.errors = errors;
      res.redirect("/admin/admin-ecobox-theme/edit-content/" + id);
    }
    const { title } = req.body;
    const id = req.params.id;

    await ThemeOfEcoBoxModel.findById(id, function (err, content) {
      if (err) return console.log(err);
      content.title = title;
      content.save(function (err) {
        req.flash("success", "пост отредактирован!");
        alert("Пост отредактирован");
        res.redirect("/admin/admin-ecobox-theme");
      });
    });
  } catch (err) {
    alert(err);
  }
};

/*
 * GET delete product
 */
export const deleteTheme = async (req, res) => {
  try {
    const id = req.params.id;

    // Удаляем запись
    const deletedItem = await ThemeOfEcoBoxModel.findByIdAndDelete(id);

    if (!deletedItem) {
      req.flash("error", "Запись не найдена");
      return res.redirect("/admin/admin-ecobox-theme");
    }

    req.flash("success", "Страница успешно удалена!");
    res.redirect("/admin/admin-ecobox-theme");
  } catch (err) {
    alert(err);

    req.flash("error", "Произошла ошибка при удалении");
  }
};
