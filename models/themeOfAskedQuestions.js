// const mongoose = require("mongoose");
import mongoose from "mongoose"
const ThemeOfAskedQuestionsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questionAnswer: [
    { type: mongoose.Schema.Types.ObjectId, ref: "AskedQuestions" },
  ],
});

const ThemeOfAskedQuestions = mongoose.model(
  "ThemeOfAskedQuestions",
  ThemeOfAskedQuestionsSchema
);

export default ThemeOfAskedQuestions;
