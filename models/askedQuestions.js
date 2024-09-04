import mongoose from "mongoose";
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

export default AskedQuestions;
