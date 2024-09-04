import mongoose from "mongoose";
// Product Schema
var TableSchema = mongoose.Schema({
  name: {
    type: String,
  },
});

const Table = mongoose.model("Table", TableSchema);
export default Table;
