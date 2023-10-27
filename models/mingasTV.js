const mongoose = require("mongoose");

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

module.exports = MingasTV;
