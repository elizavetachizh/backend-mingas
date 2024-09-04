// const mongoose = require("mongoose");
import mongoose from "mongoose";
const MingasTVSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const MingasTV = mongoose.model("MingasTV", MingasTVSchema);

export default MingasTV;
