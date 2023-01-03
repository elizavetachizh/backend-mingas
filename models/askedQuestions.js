const mongoose = require("mongoose");

const AskedQuestionsSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const AskedQuestions = mongoose.model("AskedQuestions", AskedQuestionsSchema);

module.exports = AskedQuestions;
