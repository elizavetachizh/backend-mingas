import mongoose from "mongoose";
// Page Schema
const vacanciesSchema = mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  salary: {
    type: String,
  },
  //Опыт работы
  work_experience: {
    type: String,
  },
  //Характер работы
  nature_of_work: {
    type: String,
  },
  //График
  schedule: {
    type: String,
  },
  //РАбочие часы
  working_hours: {
    type: String,
  },
  //Формат работы
  work_format: {
    type: String,
  },
  //Обязанности
  responsibilities: {
    type: String,
  },
  //Требования
  requirements: {
    type: String,
  },
  //Условия
  conditions: {
    type: String,
  },
});

const Vacancies = mongoose.model("Vacancies", vacanciesSchema);
export default Vacancies;
