var mongoose = require("mongoose");

// Category Schema
var DescriptionSchema = mongoose.Schema({
  nameDescription: {
    type: String,
  },
  inform: {
    type: String,
  },

  services: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Services",
  },
});

const Description = mongoose.model("Description", DescriptionSchema);
module.exports = Description;
