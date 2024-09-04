import mongoose from "mongoose";
// Category Schema
const AdministrativeServicesSchema = mongoose.Schema({
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
  typeAdministrativeService: {
    type: String,
  },
});

const AdministrativeServices = mongoose.model(
  "AdministrativeServices",
  AdministrativeServicesSchema
);
export default AdministrativeServices;
