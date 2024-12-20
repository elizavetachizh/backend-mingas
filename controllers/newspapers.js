import alert from "alert";
import Newspapers from "../models/newspapers.js";
export const getNewspapers = async (req, res) => {
  var count;
  Newspapers.count(function (err, c) {
    count = c;
  });
  Newspapers.find()
    .sort({ _id: -1 })
    .exec(function (err, newspapers) {
      res.render("admin/newspapers/admin_newspapers", {
        newspapers,
        count,
      });
    });
};

export const uploadNewspaper = async (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  const { name, date } = req.body;
  const archive = req.body.archive === "on";
  const filePath = req.file.path; // Убедитесь, что здесь нет слешей

  var errors = req.validationErrors();
  if (errors) {
    res.render("admin/newspapers/add_newspaper", {
      errors,
    });
  } else {
    const newspaper = await new Newspapers({
      name,
      date,
      archive,
      file: filePath,
    });
    await newspaper.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "Газета успешно добавлена");
      res.redirect("/admin/newspapers");
    });
  }
};

export const getNewspaperById = async (req, res) => {
  try {
    var errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const newspaper = await Newspapers.findById(req.params.id);
    console.log(newspaper);
    if (!newspaper)
      return res.status(404).json({ error: "Газета не была найдена" });
    res.render("admin/newspapers/edit_newspaper", {
      errors,
      name: newspaper.name,
      date: newspaper.date,
      file: newspaper.file,
      archive: newspaper.archive === true,
      id: newspaper._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateNewspaper = async (req, res) => {
  try {
    req.checkBody("name", "Имя должно быть заполненым").notEmpty();
    var errors = req.validationErrors();

    if (errors) {
      req.session.errors = errors;
      res.redirect("/admin/newspapers");
    } else {
      const price = await Newspapers.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!price) return res.status(404).json({ error: "Не было найдено" });
      alert("Газета успешно отредактирована");
      res.redirect("/admin/newspapers");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNewspaper = async (req, res) => {
  try {
    const newspaper = await Newspapers.findByIdAndDelete(req.params.id);
    if (!newspaper)
      return res.status(404).json({ error: "Газета не была найдена" });
    alert("Газета была удалена");
    res.redirect("/admin/newspapers/");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
