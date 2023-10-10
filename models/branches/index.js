var mongoose = require("mongoose");

// Category Schema
var BranchesSchema = mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  typeBranch: {
    type: String,
  },
});

const Branches = mongoose.model("Branches", BranchesSchema);
module.exports = Branches;
