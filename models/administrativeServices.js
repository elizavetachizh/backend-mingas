var mongoose = require("mongoose");

// Category Schema
var AdministrativeServicesSchema = mongoose.Schema({
  uniqueName: {
    type: String,
  },
  maximumImplementationPeriod: {
    type: String,
  },
  certificateValidityPeriod: {
    type: String,
  },
  boardSize: {
    type: String,
  },
  documents: {
    type: String,
  },
  contactInform: {
    type: String,
  },
  type: {
    type: String,
  },
});

const AdministrativeServices = mongoose.model(
  "AdministrativeServices",
  AdministrativeServicesSchema
);
module.exports = AdministrativeServices;
