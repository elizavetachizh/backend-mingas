import alert from "alert";
import RegulatoryDoc from "../models/regulatoryDocuments.js";
import SeparationDocs from "../models/separationDocuments.js";

export const getDocuments = async (req, res) => {
  try {
    const documents = await RegulatoryDoc.find();
    const count = await RegulatoryDoc.countDocuments(); // Получить количество записей
    res.render("admin/admin_documents", {
      documents,
      count,
    }); // Передать записи и их количество в шаблон
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDocuments = async (req, res) => {
  req.checkBody("link", "Название должно быть заполненым").notEmpty();
  req.checkBody("separation", "Описание должно быть заполненым").notEmpty();
  req.checkBody("name", "Картинка должна быть загружена").notEmpty();

  var link = req.body.link;
  var separation = req.body.separation;
  var name = req.body.name;
  const type = req.body.type;
  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/add_documents", {
      errors,
    });
  } else {
    const newDocument = new RegulatoryDoc({
      link,
      name,
      type,
      separation,
    });
    await newDocument.save(function (err) {
      if (err) {
        return console.log(err);
      }
      alert("Пост был добавлен");
      res.redirect("/admin/admin_documents");
    });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    let errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const separations = await SeparationDocs.find();
    const document = await RegulatoryDoc.findById(req.params.id)
      .sort({ _id: -1 })
      .limit(7);
    if (!document) return res.status(404).json({ error: "Section not found" });
    res.render("admin/edit_documents", {
      errors,
      link: document.link,
      type: document.type,
      name: document.name,
      separation: document.separation,
      separations,
      id: document._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDocument = async (req, res) => {
  req.checkBody("link", "Название должно быть заполненым").notEmpty();
  req.checkBody("name", "Описание должно быть заполненым").notEmpty();

  try {
    let errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      res.redirect("/admin/admin_posts/");
    } else {
      const document = await RegulatoryDoc.findByIdAndUpdate(
        req.params.id,
        {
          link: req.body.link,
          name: req.body.name,
          separation: req.body.separation,
          type: req.body.type,
        },
        { new: true }
      );
      if (!document) return res.status(404).json({ error: "Post not found" });
      alert("Документ был отредактирован");
      res.redirect("/admin/admin_documents");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await RegulatoryDoc.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ error: "User not found" });
    alert("Документ был удален");
    res.redirect("/admin/admin_documents");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
