import mongoose from "mongoose";
// Category Schema
const BranchesSchema = mongoose.Schema({
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
export default Branches;
