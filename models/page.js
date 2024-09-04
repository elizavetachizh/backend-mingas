import mongoose from "mongoose"
// Page Schema
const PageSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  sorting: {
    type: Number,
  },
});

const Page = mongoose.model("Page", PageSchema);
export default Page;
