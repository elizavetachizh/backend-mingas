var mongoose = require("mongoose");

// Page Schema
var RegulatoryDocSchema = mongoose.Schema({
  separation: {
    type: String,
  },
  name: {
    type: String,
  },
  link: {
    type: String,
  },
});

const RegulatoryDoc = mongoose.model("RegulatoryDoc", RegulatoryDocSchema);
module.exports = RegulatoryDoc;
