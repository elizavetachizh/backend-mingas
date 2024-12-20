import mongoose from "mongoose"
// Page Schema
const mainPostsSchema = mongoose.Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  description: {
    type: String,
  },
  images: {
    type: String,
  },
});

const MainPosts = mongoose.model("MainPosts", mainPostsSchema);
export default MainPosts;
