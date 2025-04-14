import mongoose from "mongoose"
// Page Schema
const UsefulResourcesSchema = mongoose.Schema({
  link: {
    type: String,
  },
  content: {
    type: String,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  date: {
    type: String,
  },
});

const UsefulResources = mongoose.model("UsefulResources", UsefulResourcesSchema);
export default UsefulResources;
