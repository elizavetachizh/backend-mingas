import mongoose from "mongoose";
// Page Schema
const vacanciesSchema = mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Vacancies = mongoose.model("Vacancies", vacanciesSchema);
export default Vacancies;
