import express from "express";
const adminVacanciesRouter = express.Router();
import { isAdmin } from "../../config/auth.js";
import {
  createVacancies,
  getVacancies,
  getVacancyById,
  updateVacancy,
  deleteVacancy,
} from "../../controllers/vacancies.js";
import Vacancies from "../../models/vacancies.js";
adminVacanciesRouter.get("/", isAdmin, getVacancies);
adminVacanciesRouter.get("/add-vacancies", isAdmin, function (req, res) {
  var name = "";
  var description = "";
  Vacancies.find({}).sort({ _id: -1 });
  res.render("admin/vacancies/add_vacancies", {
    name,
    description,
  });
});
adminVacanciesRouter.post("/add-vacancy", createVacancies);
adminVacanciesRouter.get("/edit-vacancy/:id", isAdmin, getVacancyById);
adminVacanciesRouter.post("/edit-vacancy/:id", updateVacancy);
adminVacanciesRouter.get("/delete-vacancy/:id", isAdmin, deleteVacancy);

export default adminVacanciesRouter;
