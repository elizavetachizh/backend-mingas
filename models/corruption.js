var mongoose = require("mongoose");

// Page Schema
var CorruptionSchema = mongoose.Schema({
    link: {
        type: String,
    },
    name: {
        type: String,
    },
});

const Corruption = mongoose.model("Corruption", CorruptionSchema);
module.exports = Corruption;
