import alert from "alert";
import path from "path";
import Gratitude from "../models/gratitude.js";
export const getGratitudes = async (req, res) => {
  var count;
  Gratitude.count(function (err, c) {
    count = c;
  });
  Gratitude.find()
    .sort({ _id: -1 })
    .exec(function (err, files) {
      res.render("admin/gratitude/admin_gratitude", {
        files,
        count,
      });
    });
};

export const uploadGratitude = async (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  var name = req.body.name;

  const fileName = req.file.filename; // Убедитесь, что здесь нет слешей
  const uploadsDir = 'doc/gratitude'; // Папка для загрузок

  // Используйте path.join для формирования пути
  const filePath = path.join(uploadsDir, fileName);

  var errors = req.validationErrors();
  if (errors) {
    res.render("admin/gratitude/add_gratitude", {
      errors,
    });
  } else {
    const newGratitude = await new Gratitude({
      name,
      file:filePath,
    });
    await newGratitude.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "Документ добавлен");
      res.redirect("/admin/gratitude");
    });
  }
};

export const getGratitudeById = async (req, res) => {
  try {
    var errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;
    console.log(req.params);
    const gratitude = await Gratitude.findById(req.params.id);
    console.log(gratitude);
    if (!gratitude) return res.status(404).json({ error: "User not found" });
    res.render("admin/gratitude/edit_gratitude", {
      errors,
      name: gratitude.name,
      file: gratitude.file,
      id: gratitude._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGratitude = async (req, res) => {
  try {
    req.checkBody("name", "Имя должно быть заполненым").notEmpty();
    var errors = req.validationErrors();

    if (errors) {
      req.session.errors = errors;
      res.redirect("/admin_gratitude");
    } else {
      const gratitude = await Gratitude.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!gratitude) return res.status(404).json({ error: "Не было найдено" });
      alert("Документ был отредактирован");
      res.redirect("/admin/admin_gratitude");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGratitude = async (req, res) => {
  try {
    const tender = await Gratitude.findByIdAndDelete(req.params.id);
    if (!tender) return res.status(404).json({ error: "User not found" });
    alert("Документ был удален");
    res.redirect("/admin/gratitude/");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
