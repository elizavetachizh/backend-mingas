import Vacancies from "../models/vacancies.js";
import alert from "alert";

export const getVacancies = async (req, res) => {
  var count;
  Vacancies.count(function (err, c) {
    count = c;
  });
  Vacancies.find()
    .sort({ _id: -1 })
    .exec(function (err, vacancies) {
      res.render("admin/vacancies/admin_vacancies", {
        vacancies,
        count,
      });
    });
};

export const createVacancies = async (req, res) => {
  req.checkBody("name", "Название должно быть заполненым").notEmpty();
  req.checkBody("description", "Описание должно быть заполненым").notEmpty();
  const { name, description } = req.body;
  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/vacancies/add_vacancies", {
      errors,
    });
  } else {
    const newVacancy = await new Vacancies({
      name,
      description,
    });
    await newVacancy.save(function (err) {
      if (err) {
        return console.log(err);
      }
      req.flash("success", "Вакансия успешно добавлена");
      res.redirect("/admin/admin_vacancies");
    });
  }
};

export const getVacancyById = async (req, res) => {
  try {
    var errors;
    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    const vacancy = await Vacancies.findById(req.params.id);
    if (!vacancy) return res.status(404).json({ error: "Вакансия не была найдена" });
    res.render("admin/vacancies/edit_vacancies", {
      errors,
      name: vacancy.name,
      description: vacancy.description,
      id: vacancy._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateVacancy = async (req, res) => {
  try {
    req.checkBody("name", "Название должно быть заполненым").notEmpty();
    req.checkBody("description", "Описание должно быть заполненым").notEmpty();
    var errors = req.validationErrors();

    if (errors) {
      req.session.errors = errors;
      res.redirect("/admin_vacancies");
    } else {
      const tender = await Vacancies.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!tender) return res.status(404).json({ error: "Tender not found" });
      alert("Вакансия отредактирована");
      res.redirect("/admin/admin_vacancies");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancies.findByIdAndDelete(req.params.id);
    if (!vacancy) return res.status(404).json({ error: "User not found" });
    alert("Вакансия успешно удалена");
    res.redirect("/admin/admin_vacancies/");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
