import mongoose from "mongoose";
// Category Schema
const DescriptionSchema = mongoose.Schema({
  nameDescription: {
    type: String,
  },
  inform: {
    type: String,
  },
});

const Description = mongoose.model("Description", DescriptionSchema);
export default Description;
