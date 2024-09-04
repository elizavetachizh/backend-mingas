import mongoose from "mongoose";
// Page Schema
const mainArticlesSchema = mongoose.Schema({
  content: {
    type: String,
  },
  image: {
    type: String,
  },
  button: {
    type: String,
  },
  link: {
    type: String,
  },
});

const mainArticle = mongoose.model("mainArticle", mainArticlesSchema);
export default mainArticle;
