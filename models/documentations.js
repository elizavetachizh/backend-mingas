import mongoose from "mongoose"

const documentationsSchema = new mongoose.Schema({
  filenames: [String],
  date: { type: Date, default: Date.now },
  paths: [String],
  fileType:String
});

const DocumentationModel = mongoose.model('Documentations', documentationsSchema);

export default DocumentationModel;