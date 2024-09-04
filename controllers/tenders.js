import Tenders from "../models/tenders.js";
import alert from "alert";

export const getTenders = async (req, res) => {
  var count;
  Tenders.count(function (err, c) {
    count = c;
  });
  Tenders.find()
    .sort({ _id: -1 })
    .exec(function (err, tenders) {
      res.render("admin/admin_tenders", {
        tenders,
        count,
      });
    });
};

export const createTender = async (req, res) => {
  req.checkBody("content", "Название должно быть заполненым").notEmpty();
  var content = req.body.content;

  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/add_tenders", {
      errors,
    });
  } else {
    const newTender = await new Tenders({
      content,
    });
    await newTender.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "Пост добавлен");
      res.redirect("/admin/admin_tenders");
    });
  }
};

export const getTenderById = async (req, res) => {
  try {
    var errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const tender = await Tenders.findById(req.params.id);
    if (!tender) return res.status(404).json({ error: "User not found" });
    res.render("admin/edit_tenders", {
      errors,
      content: tender.content,
      id: tender._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTender = async (req, res) => {
  try {
    req.checkBody("content", "Описание должно быть заполненым").notEmpty();
    var errors = req.validationErrors();

    if (errors) {
      req.session.errors = errors;
      res.redirect("/admin_tenders");
    } else {
      const tender = await Tenders.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!tender) return res.status(404).json({ error: "Tender not found" });
      alert("Пост отредактирован");
      res.redirect("/admin/admin_tenders");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTender = async (req, res) => {
  try {
    const tender = await Tenders.findByIdAndDelete(req.params.id);
    if (!tender) return res.status(404).json({ error: "User not found" });
    alert("Пост был удален");
    res.redirect("/admin/admin_tenders/");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
