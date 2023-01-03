var mongoose = require("mongoose");

// Page Schema
var PricesSchema = mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
});

const Prices = mongoose.model("Prices", PricesSchema);
module.exports = Prices;
