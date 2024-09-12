import express from "express";
import Vacancies from "../../models/vacancies.js";
const vacanciesRouter = express.Router();

vacanciesRouter.get("/", function (req, res) {
  Vacancies.find()
    .sort({ _id: -1 })
    .exec(function (err, vacancies) {
      res.send(vacancies);
    });
});
export default vacanciesRouter;
