import mongoose from "mongoose";
// Category Schema
const TendersSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

const Tenders = mongoose.model("Tenders", TendersSchema);
export default Tenders;
