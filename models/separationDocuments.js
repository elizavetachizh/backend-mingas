import mongoose from "mongoose";
// Category Schema
const SeparationDocsSchema = mongoose.Schema({
  separation: {
    type: String,
  },
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegulatoryDoc",
    },
  ],
});

const SeparationDocs = mongoose.model("SeparationDocs", SeparationDocsSchema);
export default SeparationDocs;
