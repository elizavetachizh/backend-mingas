
import mongoose from "mongoose"
// Management System Schema
const managementSystemSchema = mongoose.Schema({
  name: {
    type: String,
  },
  file: {
    type: String, 
  },
});

const ManagementSystem = mongoose.model("managementSystem", managementSystemSchema);
export default ManagementSystem;

