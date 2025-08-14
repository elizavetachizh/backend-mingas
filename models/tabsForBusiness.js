// const mongoose = require("mongoose");
import mongoose from "mongoose";
const BusinessTabsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  image: { type: String },
});

const BusinessTabsModel = mongoose.model("BusinessTabs", BusinessTabsSchema);

export default BusinessTabsModel;
