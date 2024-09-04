import mongoose from "mongoose"
// Page Schema
const PostsSchema = mongoose.Schema({
  link: {
    type: String,
  },
  content: {
    type: String,
  },
  image: {
    type: String,
  },
  date: {
    type: String,
  },
});

const Posts = mongoose.model("Posts", PostsSchema);
export default Posts;
