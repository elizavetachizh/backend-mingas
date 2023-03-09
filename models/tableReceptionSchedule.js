var mongoose = require('mongoose');

// Product Schema
var TableSchema = mongoose.Schema({

    name: {
        type: String,
    },

});

const Table = mongoose.model("Table", TableSchema);
module.exports = Table;
