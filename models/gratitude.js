
import mongoose from "mongoose"
// Page Schema
const gratitudeSchema = mongoose.Schema({
  name: {
    type: String,
  },
  file: {
    type: String,
  },
});

const gratitude = mongoose.model("gratitude", gratitudeSchema);
export default gratitude;
