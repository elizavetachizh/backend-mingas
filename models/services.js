import mongoose from "mongoose";
// Category Schema
const ServicesSchema = mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  type: {
    type: String,
  },
  description: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Description",
    },
  ],
});

const Services = mongoose.model("Services", ServicesSchema);
export default Services;
