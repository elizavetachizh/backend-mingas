import mongoose from "mongoose"
// Category Schema
const CategorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
