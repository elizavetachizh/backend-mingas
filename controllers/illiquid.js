import alert from "alert";
import path from "path";
import Illiquid from "../models/illiquid.js";
export const getIlliquids = async (req, res) => {
  var count;
  Illiquid.count(function (err, c) {
    count = c;
  });
  Illiquid.find()
    .sort({ _id: -1 })
    .exec(function (err, files) {
      res.render("admin/illiquids/admin_illiquids", {
        files,
        count,
      });
    });
};

export const uploadIlliquid = async (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  var name = req.body.name;
  var date = req.body.date;

  const fileName = req.file.filename; // Убедитесь, что здесь нет слешей
  const uploadsDir = 'doc/illiquids'; // Папка для загрузок

  // Используйте path.join для формирования пути
  const filePath = path.join(uploadsDir, fileName);

  var errors = req.validationErrors();
  if (errors) {
    res.render("admin/illiquids/add_illiquid", {
      errors,
    });
  } else {
    const newIlliquid = await new Illiquid({
      name,
      date,
      file:filePath,
    });
    await newIlliquid.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "Пост добавлен");
      res.redirect("/admin/admin_illiquids");
    });
  }
};

export const getIlliquidById = async (req, res) => {
  try {
    var errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const illiquid = await Illiquid.findById(req.params.id);
    console.log(illiquid);
    if (!illiquid) return res.status(404).json({ error: "User not found" });
    res.render("admin/illiquids/edit_illiquid", {
      errors,
      name: illiquid.name,
      date: illiquid.date,
      file: illiquid.file,
      id: illiquid._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateIlliquid = async (req, res) => {
  try {
    req.checkBody("name", "Имя должно быть заполненым").notEmpty();
    var errors = req.validationErrors();

    if (errors) {
      req.session.errors = errors;
      res.redirect("/admin_illiquids");
    } else {
      const price = await Illiquid.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!price) return res.status(404).json({ error: "Не было найдено" });
      alert("Файл отредактирован");
      res.redirect("/admin/admin_illiquids");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteIlliquid = async (req, res) => {
  try {
    const illiquid = await Illiquid.findByIdAndDelete(req.params.id);
    if (!illiquid) return res.status(404).json({ error: "User not found" });
    alert("Файл был удален");
    res.redirect("/admin/admin_illiquids/");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
