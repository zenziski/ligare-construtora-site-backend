var mongoose = require('mongoose')

var schema = mongoose.Schema({
    name: String,
    images: [],
    data: {
        architect: String,
        photographer_name: String,
        engineer: String,
        area: Number,
        year: Number,
        local: String
    }
}, { timestamps: true });

module.exports = mongoose.model("construction", schema);