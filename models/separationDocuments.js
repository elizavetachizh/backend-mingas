var mongoose = require("mongoose");

// Category Schema
var SeparationDocsSchema = mongoose.Schema({
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
module.exports = SeparationDocs;
