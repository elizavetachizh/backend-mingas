import mongoose from "mongoose";
// Page Schema
const CorruptionSchema = mongoose.Schema({
  link: {
    type: String,
  },
  name: {
    type: String,
  },
});

const Corruption = mongoose.model("Corruption", CorruptionSchema);
export default Corruption;
