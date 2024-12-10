import alert from "alert";
import Edi from "../models/edi.js";
export const getDocuments = async (req, res) => {
  var count;
  Edi.count(function (err, c) {
    count = c;
  });
  Edi.find()
    .sort({ _id: -1 })
    .exec(function (err, files) {
      res.render("admin/edi/admin_edi", {
        files,
        count,
      });
    });
};

export const uploadDocument = async (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  var name = req.body.name;
  var date = req.body.date;
  const filePath = req.file.path; // Убедитесь, что здесь нет слешей

  var errors = req.validationErrors();
  if (errors) {
    res.render("admin/edi/add_edi", {
      errors,
    });
  } else {
    const newDocument = await new Edi({
      name,
      date,
      file:filePath,
    });
    await newDocument.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "Пост добавлен");
      res.redirect("/admin/edi");
    });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    var errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const document = await Edi.findById(req.params.id);
    console.log(document);
    if (!document) return res.status(404).json({ error: "User not found" });
    res.render("admin/edi/edit_edi", {
      errors,
      name: document.name,
      date: document.date,
      file: document.file,
      id: document._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    req.checkBody("name", "Имя должно быть заполненым").notEmpty();
    var errors = req.validationErrors();

    if (errors) {
      req.session.errors = errors;
      res.redirect("/edi");
    } else {
      const price = await Edi.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!price) return res.status(404).json({ error: "Не было найдено" });
      alert("Прайс отредактирован");
      res.redirect("/admin/edi");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const tender = await Edi.findByIdAndDelete(req.params.id);
    if (!tender) return res.status(404).json({ error: "User not found" });
    alert("Прайс был удален");
    res.redirect("/admin/edi/");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
