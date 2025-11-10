import alert from "alert";
import ManagementSystem from "../models/managementSystem.js";
export const getManagementSystems = async (req, res) => {
  var count;
  ManagementSystem.count(function (err, c) {
    count = c;
  });
  ManagementSystem.find()
    .sort({ _id: -1 })
    .exec(function (err, files) {
      res.render("admin/managementSystem/admin_managementSystem", {
        files,
        count,
      });
    });
};

export const uploadManagementSystem = async (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  var name = req.body.name;
  const filePath = req.file.path; // Убедитесь, что здесь нет слешей

  var errors = req.validationErrors();
  if (errors) {
    res.render("admin/managementSystem/add_managementSystem", {
      errors,
    });
  } else {
    const newManagementSystem = await new ManagementSystem({
      name,
      file:filePath,
    });
    await newManagementSystem.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "Документ добавлен");
      res.redirect("/admin/managementSystem");
    });
  }
};

export const getManagementSystemById = async (req, res) => {
  try {
    var errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null; 
    const managementSystem = await ManagementSystem.findById(req.params.id);
    if (!managementSystem) return res.status(404).json({ error: "User not found" });
    res.render("admin/managementSystem/edit_managementSystem", {
      errors,
      name: managementSystem.name,
      file: managementSystem.file,
      id: managementSystem._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateManagementSystem = async (req, res) => {
  try {
    req.checkBody("name", "Имя должно быть заполненым").notEmpty();
    var errors = req.validationErrors();

    if (errors) {
      req.session.errors = errors;
      res.redirect("/admin_managementSystem");
    } else {
      const updateData = {
        name: req.body.name,
      };
      
      // Если загружен новый файл, обновляем путь к файлу
      if (req.file) {
        updateData.file = req.file.path;
      }
      
      const managementSystem = await ManagementSystem.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });
      if (!managementSystem) return res.status(404).json({ error: "Не было найдено" });
      alert("Документ был отредактирован");
      res.redirect("/admin/managementSystem");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteManagementSystem = async (req, res) => {
  try {
    const managementSystem = await ManagementSystem.findByIdAndDelete(req.params.id);
    if (!managementSystem) return res.status(404).json({ error: "User not found" });
    alert("Документ был удален");
    res.redirect("/admin/managementSystem/");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

