import mongoose from "mongoose";
// Page Schema
const newPostsSchema = mongoose.Schema({
  link: {
    type: String,
  },
  content: {
    type: String,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  date: {
    type: String,
  },
  description: {
    type: String,
  },
  images: [String],
});

const NewPosts = mongoose.model("newPosts", newPostsSchema);
export default NewPosts;
