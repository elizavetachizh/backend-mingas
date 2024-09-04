import alert from "alert";
import SeparationDocs from "../models/separationDocuments.js";
import RegulatoryDoc from "../models/regulatoryDocuments.js";

export const getSeparationDocs = async (req, res) => {
  try {
    const separation = await SeparationDocs.find({}).populate("documents"); // Получить все записи
    const count = await SeparationDocs.countDocuments(); // Получить количество записей
    res.render("admin/admin_separations", {
      separation,
      count,
    }); // Передать записи и их количество в шаблон
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createSeparationDocs = async (req, res) => {
  req.checkBody("separation", "Название должно быть заполненым").notEmpty();
  const { separation } = req.body;
  const documents = req.body.documents || [];
  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/add_separations", {
      errors,
    });
  } else {
    var newDocument = await new SeparationDocs({
      separation,
      documents,
    });
    await newDocument.save(function (err) {
      if (err) {
        return console.log(err);
      }
      alert("Успешно добавлено");
      res.redirect("/admin/admin_separations");
    });
  }
};

export const getSeparationDocsById = async (req, res) => {
  try {
    let errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const separationDocs = await SeparationDocs.findById(
      req.params.id
    ).populate("documents");
    const regulatoryDoc = await RegulatoryDoc.find();
    if (!separationDocs)
      return res.status(404).json({ error: "Section not found" });
    res.render("admin/edit_separations", {
      errors,
      documents: regulatoryDoc,
      separation: separationDocs.separation,
      selectedDocuments: separationDocs.documents,
      id: separationDocs._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSeparationDocs = async (req, res) => {
  req.checkBody("separation", "Название должно быть заполненым").notEmpty();

  try {
    let errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;
      res.redirect("/admin/admin_separations/");
    } else {
      const separation = await SeparationDocs.findByIdAndUpdate(
        req.params.id,
        {
          separation: req.body.separation,
          documents: req.body.documents,
        },
        { new: true }
      );
      if (!separation) return res.status(404).json({ error: "Post not found" });
      alert("Документ был отредактирован");
      res.redirect("/admin/admin_separations");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSeparationDocs = async (req, res) => {
  try {
    const separation = await SeparationDocs.findByIdAndDelete(req.params.id);
    if (!separation) return res.status(404).json({ error: "Separation not found" });
    alert("Документы были удалены");
    res.redirect("/admin/admin_separations");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
