import alert from "alert";
import Management from "../models/management.js";
import Departament from "../models/departaments.js";

export const getManagement = async (req, res) => {
  let count;
  Management.count(function (err, c) {
    count = c;
  });
  const management = await Management.find().populate("department");
  if (!management) return res.status(404).json({ error: "Section not found" });
  res.render("admin/admin_management", {
    management,
    count,
  });
};

export const createManagement = async (req, res) => {
  req.checkBody("fullName", "Название должно быть заполненым").notEmpty();
  req.checkBody("position", "Описание должно быть заполненым").notEmpty();
  const { image, fullName, position, contact_phone, email } = req.body;
  const department = req.body.department || [];
  var errors = req.validationErrors();
  if (errors) {
    res.render("admin/add_management", {
      errors,
    });
  } else {
    var management = await new Management({
      fullName,
      position,
      image,
      department,
      contact_phone,
      email,
    });
    await management.save(function (err) {
      if (err) {
        return console.log(err);
      }
      alert("человек добавлен");
      res.redirect("/admin/admin_management");
    });
  }
};

export const getManagementById = async (req, res) => {
  try {
    let errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const management = await Management.findById(req.params.id).populate(
      "department"
    );
    const department = await Departament.find();
    if (!management)
      return res.status(404).json({ error: "Section not found" });
    res.render("admin/edit_management", {
      errors,
      department,
      management,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateManagement = async (req, res) => {
  req.checkBody("fullName", "fullName должно быть заполненым").notEmpty();
  req.checkBody("position", "position должно быть заполненым").notEmpty();
  try {
    const management = await Management.findByIdAndUpdate(
      req.params.id,
      {
        fullName: req.body.fullName,
        position: req.body.position,
        department: req.body.department || [],
        image: req.body.image,
        contact_phone: req.body.contact_phone,
        email: req.body.email,
      },
      { new: true }
    );
    if (!management)
      return res.status(404).json({ error: "Section not found" });
    alert("Запись была отредактирована");
    res.redirect("/admin/admin_management");
  } catch (err) {
    const department = await Departament.find();
    res.status(400).render("admin/edit-services/:id", {
      error: err.message,
      fullName: req.body.fullName,
      position: req.body.position,
      contact_phone: req.body.contact_phone,
      email: req.body.email,
      department,
      image: req.body.image,
    });
  }
};

export const deleteManagement = async (req, res) => {
  try {
    const management = await Management.findByIdAndDelete(req.params.id);
    if (!management) return res.status(404).json({ error: "User not found" });
    alert("Запись была удалена");
    res.redirect("/admin/admin_management");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
