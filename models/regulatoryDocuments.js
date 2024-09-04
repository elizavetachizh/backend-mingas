import mongoose from "mongoose";
// Page Schema
const RegulatoryDocSchema = mongoose.Schema({
  separation: {
    type: String,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  link: {
    type: String,
  },
});

const RegulatoryDoc = mongoose.model("RegulatoryDoc", RegulatoryDocSchema);
export default RegulatoryDoc;
