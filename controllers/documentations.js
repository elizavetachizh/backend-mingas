import alert from "alert";
import DocumentationModel from "../models/documentations.js";
import path from "path";
import fs from "fs-extra"
export const getDocuments = async (req, res) => {
  var count;
  DocumentationModel.count(function (err, c) {
    count = c;
  });
  DocumentationModel.find()
    .sort({ _id: -1 })
    .exec(function (err, files) {
      res.render("admin/documentations/admin_documentations", {
        files,
        count,
      });
    });
};

export const uploadDocument = async (req, res) => {
  const filenames = req.files.map(file => file.originalname);
  const fileType = req.body.fileType; // Получаем тип файлов из формы
  const  newPathes  = []
  const dirIndex = req.body.folderIndex || '1'; // Получаем индекс папки из формы
  var errors = req.validationErrors();
  if (errors) {
    res.render("admin/documentations/add_documentation", {
      errors,
    });
  } else {
     const dirPath = path.join('doc/documentation', fileType,dirIndex);
     if (!fs.existsSync(dirPath)){
       fs.mkdirSync(dirPath, { recursive: true });
     }

     for (const file of req.files) {
        const newFilePath = path.join(dirPath, file.originalname);
       fs.renameSync(file.path, newFilePath); // Переместить файл из временной папки
       newPathes.push(newFilePath)
     }

    const newFileEntry = new DocumentationModel({
      filenames,
      paths:newPathes,
      date: new Date(),
      fileType,
      folder_index:dirIndex
    });
    await newFileEntry.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "Пост добавлен");
      res.redirect("/admin/documentations");
    });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    var errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;
    const document = await DocumentationModel.findById(req.params.id);

    if (!document) return res.status(404).json({ error: "User not found" });
    res.render("admin/documentations/edit_documentation", {
      errors,
      files: document.files,
      date: document.date,
      fileType:document.fileType,
      folder_index:document.folder_index,
      id: document._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await DocumentationModel.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ error: "User not found" });
    alert("Прайс был удален");
    res.redirect("/admin/documentations/");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
