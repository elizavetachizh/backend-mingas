import mongoose from "mongoose"
// Page Schema
const pricesSchema = mongoose.Schema({
  name: {
    type: String,
  },
  date: {
    type: Date,
  },
  file: {
    type: String,
  },
});

const prices = mongoose.model("prices", pricesSchema);
export default prices;
