// const mongoose = require("mongoose");
import mongoose from "mongoose";
const ManagementSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  department: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Departament",
    },
  ],
  contact_phone: {
    type: String,
  },
});

const Management = mongoose.model("Management", ManagementSchema);

export default Management;
