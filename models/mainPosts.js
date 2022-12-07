var mongoose = require("mongoose");

// Page Schema
var mainPostsSchema = mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
});

const mainPosts = mongoose.model("mainPosts", mainPostsSchema);
module.exports = mainPosts;
