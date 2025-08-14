import mongoose from "mongoose";
// Page Schema
const EcoBoxSchema = mongoose.Schema({
  name: {
    type: String,
  },
  theme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'themeOfEcoBoxModel' // Должно совпадать с именем модели
  },
  price: {
    type: String,
  },
  description: {
    type: String,
  },
  images: [String],
});

const EcoBoxModel = mongoose.model("ecoBoxModel", EcoBoxSchema);
export default EcoBoxModel;
