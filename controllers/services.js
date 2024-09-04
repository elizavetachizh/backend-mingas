import alert from "alert";
import Services from "../models/services.js";
import Description from "../models/descriptionServices.js";

export const getServices = async (req, res) => {
  await Services.find({})
    .populate("description")

    .exec(function (err, services) {
      if (err) {
        console.log(err);
      }
      res.render("admin/admin_services", {
        services,
      });
    });
};

export const createService = async (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();

  var image = req.body.image;
  const name = req.body.name;
  const description = req.body.description || [];
  var errors = req.validationErrors();
  const type = req.body.type;
  if (errors) {
    res.render("admin/add_services", {
      errors,
    });
  } else {
    var newServices = await new Services({
      name,
      image,
      description,
      type,
    });
    await newServices.save(function (err) {
      if (err) {
        return console.log(err);
      }
      alert("услуга добавлена");
      res.redirect("/admin/admin_services");
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    let errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const service = await Services.findById(req.params.id).populate(
      "description"
    );
    const description = await Description.find();
    if (!service) return res.status(404).json({ error: "Section not found" });
    res.render("admin/edit_services", {
      errors,
      description,
      service,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateService = async (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();

  try {
    const service = await Services.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        image: req.body.image,
        type: req.body.type,
        description: req.body.description || [],
      },
      { new: true }
    );
    if (!service) return res.status(404).json({ error: "Section not found" });
    alert("Услуга была отредактирована");
    res.redirect("/admin/admin_services");
  } catch (err) {
    const description = await Description.find();
    res.status(400).render("admin/edit-services/:id", {
      error: err.message,
      service: req.body,
      description,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Services.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: "User not found" });
    alert("Пост был удален");
    res.redirect("/admin/admin_services");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
