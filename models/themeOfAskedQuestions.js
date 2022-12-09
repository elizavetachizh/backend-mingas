const mongoose = require("mongoose");

const ThemeOfAskedQuestionsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  question: {
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

module.exports = ThemeOfAskedQuestions;
