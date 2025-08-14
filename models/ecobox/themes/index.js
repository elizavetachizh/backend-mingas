import mongoose from "mongoose";
const ThemeOfEcoBoxSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const ThemeOfEcoBoxModel = mongoose.model(
  "themeOfEcoBoxModel",
  ThemeOfEcoBoxSchema
);
export default ThemeOfEcoBoxModel;
