import alert from "alert";
import Description from "../models/descriptionServices.js";

export const getDescriptionServices = async (req, res) => {
  const description = await Description.find({});
  if (!description) return res.status(404).json({ error: "Section not found" });
  res.render("admin/admin_description", {
    description,
  });
};

export const createDescriptionService = async (req, res) => {
  req.checkBody("inform", "inform должен быть заполненым").notEmpty();
  req
    .checkBody("nameDescription", "nameDescription должен быть заполненым")
    .notEmpty();
  const { inform, nameDescription } = req.body;
  const errors = req.validationErrors();
  if (errors) {
    res.render("admin/add_description", {
      errors,
    });
  } else {
    const description = new Description({
      inform,
      nameDescription,
    });
    await description.save(function (err) {
      if (err) {
        return console.log(err);
      }
      alert("услуга добавлена");
       res.redirect("/admin/admin_description");
    });
  }
};

export const getDescriptionServiceById = async (req, res) => {
  try {
    let errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const description = await Description.findById(req.params.id);
    if (!description)
      return res.status(404).json({ error: "Section not found" });
    res.render("admin/edit_description", {
      errors,
      nameDescription: description.nameDescription,
      inform: description.inform,
      id: description._id,
      type: description.type,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDescriptionService = async (req, res) => {
  req
    .checkBody("nameDescription", "nameDescription должно быть заполненым")
    .notEmpty();
  req.checkBody("inform", "inform должно быть заполненым").notEmpty();

  try {
    const description = await Description.findByIdAndUpdate(
      req.params.id,
      {
        nameDescription: req.body.nameDescription,
        inform: req.body.inform,
      },
      { new: true }
    );
    if (!description)
      return res.status(404).json({ error: "Section not found" });
    alert("Услуга была отредактирована");
    res.redirect("/admin/admin_description");
  } catch (err) {
    res.status(400).render("admin/edit-description/:id", {
      error: err.message,
      nameDescription: req.body.nameDescription,
      inform: req.body.inform,
    });
  }
};

export const deleteDescriptionService = async (req, res) => {
  try {
    const description = await Description.findByIdAndDelete(req.params.id);
    if (!description) return res.status(404).json({ error: "User not found" });
    alert("Пост был удален");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
