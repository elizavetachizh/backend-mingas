import alert from "alert";
import BusinessTabsModel from "../models/tabsForBusiness.js";

export const getContent = async (req, res) => {
  try {
    const count = await BusinessTabsModel.countDocuments();

    // Получаем содержимое
    const content = await BusinessTabsModel.find();

    res.render("admin/businessTabs/admin_list", {
      content,
      count,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createContent = async (req, res) => {
  const { name, link } = req.body;
  const image = req.file?.path ? req.file.path : "";
  const errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render("admin/businessTabs/add_info", {
      errors,
    });
  }
  try {
    const content = new BusinessTabsModel({
      name,
      link: link || "",
      image,
    });

    console.log(content);
    content.save();
    req.flash("success", "Пост добавлен");
    res.redirect("/admin/admin-business-tabs");
  } catch (err) {
    alert(err);
  }
};

export const getContentById = async (req, res) => {
  let errors;
  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null;
  BusinessTabsModel.findById(req.params.id, function (err, content) {
    console.log(content);
    if (err) {
      res.render("admin/businessTabs/admin_list");
    } else {
      res.render("admin/businessTabs/edit_info", {
        errors,
        name: content.name,
        link: content.link,
        image: content.image,
        id: content._id,
      });
    }
  });
};

/*
 * POST edit product
 */
export const updateContent = async (req, res) => {
  req.checkBody("name", "Описание должно быть заполненным").notEmpty();

  const { name, link } = req.body;
  const image = req.file ? req.file.path : "";
  const id = req.params.id;
  const errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
    res.redirect("/admin/admin-business-tabs/edit-content/" + id);
  } else {
    BusinessTabsModel.findById(id, function (err, content) {
      if (err) return console.log(err);
      content.name = name;
      content.link = link;
      content.image = image ? image : content.image;
      content.save(function (err) {
        if (err) return console.log(err);

        req.flash("success", "пост отредактирован!");
        alert("Пост отредактирован");
        res.redirect("/admin/admin-business-tabs");
      });
    });
  }
};

/*
 * GET delete product
 */
export const deleteContent = async (req, res) => {
  const id = req.params.id;
  BusinessTabsModel.findByIdAndRemove(id, function (err) {
    if (err) return alert(err);

    req.flash("success", "Page deleted!");
    res.redirect("/admin/admin-business-tabs");
  });
};
