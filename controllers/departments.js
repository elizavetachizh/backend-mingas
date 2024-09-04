import alert from "alert";
import Management from "../models/management.js";
import Departament from "../models/departaments.js";

export const getDepartment = async (req, res) => {
  try {
    const count = await Departament.countDocuments(); // Получить количество записей

    const department = await Departament.find();
    if (!department)
      return res.status(404).json({ error: "Section not found" });
    res.render("admin/admin_departament", {
      department,
      count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDepartment = async (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  req.checkBody("nameMen", "Описание должно быть заполненым").notEmpty();
  const { name, chief, description, schedule, contacts, nameMen } = req.body;
  var errors = req.validationErrors();
  if (errors) {
    res.render("admin/add_departament", {
      errors,
    });
  } else {
    var department = await new Departament({
      name,
      chief,
      description,
      schedule,
      contacts,
      nameMen,
    });
    await department.save(function (err) {
      if (err) {
        return console.log(err);
      }
      alert("Подразделение добавлено");
      res.redirect("/admin/admin_departament");
    });
  }
};

export const getDepartmentById = async (req, res) => {
  try {
    let errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const management = await Management.find();
    const department = await Departament.findById(req.params.id);
    if (!department)
      return res.status(404).json({ error: "Section not found" });
    res.render("admin/edit_departament", {
      errors,
      name: department.name,
      id: department._id,
      chief: department.chief,
      description: department.description,
      schedule: department.schedule,
      contacts: department.contacts,
      management,
      nameMenChecked: department.nameMen,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDepartment = async (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  req.checkBody("nameMen", "Описание должно быть заполненым").notEmpty();
  const errors = req.validationErrors();
  try {
    const department = await Departament.findByIdAndUpdate(
      req.params.id,
      {
        errors,
        name: req.body.name,
        chief: req.body.chief,
        description: req.body.description,
        schedule: req.body.schedule,
        contacts: req.body.contacts,
        nameMen: req.body.nameMen,
      },
      { new: true }
    );
    if (!department)
      return res.status(404).json({ error: "Section not found" });
    alert("Запись была отредактирована");
    res.redirect("/admin/admin_departament");
  } catch (err) {
    const department = await Departament.find();
    res.status(400).render("admin/edit-services/:id", {
      error: err.message,
      fullName: req.body.fullName,
      position: req.body.position,
      department,
      image: req.body.image,
    });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const department = await Departament.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ error: "User not found" });
    alert("Запись была удалена");
    res.redirect("/admin/admin_departament");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
