import mongoose from "mongoose"
// Page Schema
const illiquidSchema = mongoose.Schema({
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

const illiquid = mongoose.model("illiquids", illiquidSchema);
export default illiquid;
