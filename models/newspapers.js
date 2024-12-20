import mongoose from "mongoose";
// Page Schema
const newspapersSchema = mongoose.Schema({
  name: {
    type: String,
  },
  date: {
    type: String,
  },
  file: {
    type: String,
  },
  archive: {
    type: Boolean,
  },
});

const Newspapers = mongoose.model("newspapers", newspapersSchema);
export default Newspapers;
