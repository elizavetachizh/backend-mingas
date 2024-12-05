import mongoose from "mongoose"
// Page Schema
const ediSchema = mongoose.Schema({
  name: {
    type: String,
  },
  date: {
    type: String,
  },
  file: {
    type: String,
  },
});

const ediDocuments = mongoose.model("ediDocuments", ediSchema);
export default ediDocuments;
